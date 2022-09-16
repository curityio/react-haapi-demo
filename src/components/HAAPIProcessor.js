/*
 *  Copyright 2022 Curity AB
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import {useEffect, useState} from "react"
import StartAuthorization from "./StartAuthorization";

/* UI Authenticators */
import UsernamePassword from "../ui-kit/authenticators/UsernamePassword";

/* UI Containers */
import Selector from "../ui-kit/containers/Selector";

/* UI Components */
import {Spinner, Error, Layout, Page, Well, Logo, Heading} from "../ui-kit/ui-components";

import UsernamePasswordContinue from "../ui-kit/authenticators/UsernamePasswordContinue";
import ShowRawResponse from "./ShowRawResponse";
import RedirectStep from "./RedirectStep";
import {prettyPrintJson} from "pretty-print-json";
import {OidcClient} from "./OidcClient";
import {InitializationError} from "@curity/identityserver-haapi-web-driver";
import {haapiConnectionIssue} from "../messages";

export default function HAAPIProcessor(props) {
    const { haapiFetch, setTokens } = props
    const [ oidcClient ] = useState(new OidcClient())
    const [ step, setStep ] = useState({ name: null, haapiResponse: null, inputProblem: null })
    const [ missingResponseType, setMissingResponseType ] = useState(null)
    const [ isLoading, setIsLoading ] = useState(false)
    const [ followRedirects, setFollowRedirects ] = useState(true)

    useEffect( () => {
        if (step.name === 'authorization-complete') {
            oidcClient.fetchTokens(step.haapiResponse.properties.code, setTokens)
        }
    }, [setTokens, step, oidcClient])

    const processAuthenticationStep = () => {
        const { haapiResponse } = step
        const view = haapiResponse.metadata.viewName

        switch (view) {
            case 'authenticator/html-form/forgot-account-id/get':
            case 'authenticator/html-form/reset-password/get':
            case 'authenticator/username/authenticate/get':
            case 'authenticator/html-form/authenticate/get':
            case 'authenticator/html-form/create-account/get':
                return <UsernamePassword
                    haapiResponse={haapiResponse}
                    submitForm={(formState, url, method) => submitForm(formState, url, method)}
                    isLoading={isLoading}
                    clickLink={(url) => clickLink(url)}
                    inputProblem={step.inputProblem}
                />
            case 'views/select-authenticator/index':
                return <Selector
                        actions={haapiResponse.actions}
                        submitForm={(url, method) => submitForm( null, url, method)}
                        />
            case 'authenticator/html-form/reset-password/post':
            case 'authenticator/html-form/forgot-account-id/post':
            case 'authenticator/html-form/create-account/post':
                return <UsernamePasswordContinue
                    haapiResponse={haapiResponse}
                    isLoading={isLoading}
                    submitForm={(url, method) => submitForm(null, url, method)}
                />
            case 'authenticator/external-browser/launch':
                setStep({ name: 'external-browser-launch', haapiResponse: step.haapiResponse })
                return
            default:
                setStep({ name: 'unknown-step', haapiResponse: step.haapiResponse })
                setMissingResponseType('Authentication Step')
        }
    }

    const startAuthorization = async () => {
        setStep({ name: 'loading', haapiResponse: null })
        setIsLoading(true)

        const url = await oidcClient.getAuthorizationUrl()
        await callHaapi(url)
    }

    const submitForm = async (formState, url, method) => {
        setIsLoading(true)
        await callHaapi(
            url,
            method,
            formState
        )
    }

    const processHaapiResult = async () => {
        const { haapiResponse } = step
        setIsLoading(false)
        switch (haapiResponse.type) {
            case 'redirection-step':
                if (followRedirects) {
                    return await processRedirect()
                } else {
                    setStep({ name: 'show-redirect-step', haapiResponse })
                }
                break
            case 'authentication-step':
                setStep({ name: 'authentication-step', haapiResponse })
                break
            case 'registration-step':
                setStep({ name: 'registration-step', haapiResponse })
                break
            case 'https://curity.se/problems/incorrect-credentials':
                setStep({ name: step.haapiResponse.type, haapiResponse: step.haapiResponse, problem: haapiResponse })
                break
            case 'oauth-authorization-response':
                setStep({ name: 'authorization-complete', haapiResponse })
                break
            case 'https://curity.se/problems/invalid-input':
                setStep({ name: step.haapiResponse.type, haapiResponse: step.haapiResponse, inputProblem: haapiResponse })
                break
            default:
                setStep({ name: 'unknown-step', haapiResponse })
                setMissingResponseType('step type')
        }
    }

    useEffect(() => {
        switch (step.name) {
            case 'process-result':
                processHaapiResult()
                break
            case 'continue-redirect-step':
                processRedirect()
                break
            case 'continue-continue-step':
                processContinue()
                break
            case 'external-browser-launch':
                launchExternalBrowser()
                break
            default:
                break
        }
    }, [ step ])

    const clickLink = async (url) => await callHaapi(url)

    const processRedirect = async () => {
        const action = step.haapiResponse.actions[0]

        if (action.template === 'form' && action.kind === 'redirect') {
            await callHaapi(
                action.model.href,
                action.model.method,
                getRedirectBody(action.model.fields)
            )

            return
        }

        setStep({ name: 'unknown-step', haapiResponse: step.haapiResponse})
        setMissingResponseType('Redirect Step')
    }

    const processContinue = async () => {
        const continueAction = step.haapiResponse.actions[0].model.continueActions[0]

        if (continueAction && continueAction.template === 'form' && continueAction.kind === 'continue') {
            await callHaapi(
                continueAction.model.href,
                continueAction.model.method,
                getRedirectBody(continueAction.model.fields)
            )

            return
        }

        setStep({ name: 'unknown-step', haapiResponse: step.haapiResponse})
        setMissingResponseType('Continue Step')
    }

    const launchExternalBrowser = async () => {
        const url = step.haapiResponse.actions[0].model.arguments.href + "&for_origin=" + window.location
        const popup = window.open(url)

        window.addEventListener('message', async event => {
            if (event.source !== popup) {
                return
            }

            if (!followRedirects) {
                step.haapiResponse.actions[0].model.continueActions[0].model.fields[0].value = event.data
                setStep({ name: 'show-continue-step', haapiResponse: step.haapiResponse })
            } else {
                const continueAction = step.haapiResponse.actions[0].model.continueActions[0]

                await callHaapi(
                    continueAction.model.href,
                    continueAction.model.method,
                    new URLSearchParams({ '_resume_nonce': event.data })
                )
            }

            setTimeout(() => popup.close(), 3000)
        })
    }

    const callHaapi = async (url, method = 'GET', data = null) => {
        const init = { method }
        let finalUrl = url

        if (data) {
            if (method === 'POST' || method === 'PUT') {
                init.body = data
            } else {
                finalUrl = new URL(url)
                data.forEach((value, key) => {
                    finalUrl.searchParams.set(key, value)
                })
            }
        }

        try {
            const response = await haapiFetch(finalUrl, init)
            const haapiResponse = await response.json()
            setStep({ name: 'process-result', haapiResponse })
        } catch (e) {
            if (e instanceof InitializationError) {
                setStep({ name: null, problem: { title: haapiConnectionIssue }})
            }
        }
    }

    const renderCancelForm = (action) => {
        const { model } = action
        const fields = new URLSearchParams(model.fields.map(field => [field.name, field.value]))
        return <>
                <div className="form" key={action.title}>
                    <p>{model.title}</p>
                    <button className="mt2 button button-primary button-fullwidth" onClick={() => submitForm(fields, model.href, model.method)}>{model.actionTitle}</button>
                </div>
        </>
    }

    const renderForm = (action) => {
        switch (action.kind) {
            case 'cancel':
                return renderCancelForm(action)
            default:
                return <></>
        }
    }

    const renderAction = (action) => {
        switch (action.template) {
            case 'form':
                return renderForm(action)
            default:
                return <>
                </>
        }

    }

    let stepComponent

    switch (step.name) {
        case 'loading':
        case 'authorization-complete':
        case 'continue-redirect-step':
        case 'process-result':
            stepComponent = <Spinner/>
            break
        case 'authentication-step':
        case 'registration-step':
            stepComponent = processAuthenticationStep()
            break
        case 'show-redirect-step':
            stepComponent = <RedirectStep continueFlow={() => setStep({ name: 'continue-redirect-step', haapiResponse: step.haapiResponse })}/>
            break
        case 'show-continue-step':
            stepComponent = <RedirectStep type="Continue" continueFlow={() => setStep({ name: 'continue-continue-step', haapiResponse: step.haapiResponse })} />
            break
        case 'external-browser-launch':
            const remainingActions = step.haapiResponse.actions.slice(1)
            stepComponent = <Layout>
                <Page>
                        <Well>
                        <Logo />
                        <p>{step.haapiResponse.actions[0].title}</p>
                        {remainingActions && remainingActions.map(action => renderAction(action))}
                    </Well>
                </Page>
            </Layout>
            break
        case 'unknown-step':
            stepComponent = <Layout>
                <Page>
                    <Well>
                        <Logo />
                        <Error message={`Unknown ${missingResponseType}`} />
                        <div className="example-app-settings active">
                            <h3>Response</h3>
                            <pre className="json-container" dangerouslySetInnerHTML={{ __html: prettyPrintJson.toHtml(step.haapiResponse)}}></pre>
                        </div>
                    </Well>
                </Page>
            </Layout>
            break
        default:
            stepComponent =
            <Layout>
                <Page>
                    <Well>
                        <Logo />
                        {step.problem && <Error message={step.problem.title} />}
                        <div className="area">
                            <Heading title="This is a demo app showing HAAPI capabilities" />
                            <p>Click the button below to start the login flow without leaving this SPA</p>
                        </div>
                        <StartAuthorization startAuthorization={() => startAuthorization()} />
                    </Well>
                </Page>
            </Layout>
    }

    return (<>
        {/* {step.problem && <Error message={step.problem.title} />} */}
        {stepComponent}
        <div className="example-app-settings active">

        <img
          src="/images/curity-api-react.svg"
          className="py4 mx-auto block"
          style={{ maxWidth: "300px" }}
          alt="Curity HAAPI React Demo"
        />

        <h1>HAAPI demo application with React</h1>

        <h3 className="white">Settings</h3>
        <div className="form-field flex flex-center">
            <input className="mr1" type="checkbox" id="toggleFollowRedirects" name="toggleFollowRedirects" checked={followRedirects} onChange={() => setFollowRedirects(!followRedirects)} />
            <label htmlFor="toggleFollowRedirects">Follow Redirects</label>
        </div>
        {step.haapiResponse && <ShowRawResponse haapiResponse={step.haapiResponse} forceVisibility={step.name === 'show-redirect-step'} />}
        </div>
    </>)
}

const getRedirectBody = (fields) => {
    if (!fields) {
        return null
    }

    return new URLSearchParams(fields.map(field => [field.name, field.value]))
}
