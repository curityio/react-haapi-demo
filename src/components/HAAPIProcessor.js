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
import UsernamePassword from "../ui-kit/authenticators/UsernamePassword";
import Error from "../ui-kit/ui-components/Error";
import Selector from "../ui-kit/containers/Selector";
import UsernamePasswordContinue from "../ui-kit/authenticators/UsernamePasswordContinue";
import ShowRawResponse from "./ShowRawResponse";
import RedirectStep from "./RedirectStep";
import {prettyPrintJson} from "pretty-print-json";
import {OidcClient} from "./OidcClient";

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
            default:
                setStep({ name: 'unknown-step', haapiResponse: step.haapiResponse })
                setMissingResponseType('Authentication Step')
        }
    }

    const startAuthorization = async () => {
        setStep({ name: 'loading', haapiResponse: null })
        setIsLoading(true)

        const url = await oidcClient.getAuthorizationUrl()
        const haapiResponse = await callHaapi(url)

        setStep({ name: 'process-result', haapiResponse })
    }

    const submitForm = async (formState, url, method) => {
        setIsLoading(true)
        const haapiResponse = await callHaapi(
            url,
            method,
            formState
        )

        setStep({ name: 'process-result', haapiResponse})
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
            default:
                break
        }
    }, [ step ])

    const clickLink = async (url) => {
        const haapiResponse = await callHaapi(
            url,
            "GET",
            null
        )

        setStep({ name: 'process-result', haapiResponse })
    }

    const processRedirect = async () => {
        const action = step.haapiResponse.actions[0]

        if (action.template === 'form' && action.kind === 'redirect') {
            const haapiResponse = await callHaapi(
                action.model.href,
                action.model.method,
                getRedirectBody(action.model.fields)
            )

            setStep({ name: 'process-result', haapiResponse })
            return
        }

        setStep({ name: 'unknown-step', haapiResponse: step.haapiResponse})
        setMissingResponseType('Redirect Step')
    }

    const callHaapi = async (url, method = 'GET', body = null) => {
        const init = { method }
        if (body) {
            init.body = body
        }

        const response = await haapiFetch(url, init)

        return await response.json()
    }

    let stepComponent

    switch (step.name) {
        case 'loading':
        case 'authorization-complete':
        case 'continue-redirect-step':
        case 'process-result':
            stepComponent = <div className="loader" />
            break
        case 'authentication-step':
        case 'registration-step':
            stepComponent = processAuthenticationStep()
            break
        case 'show-redirect-step':
            stepComponent = <RedirectStep continueFlow={() => setStep({ name: 'continue-redirect-step', haapiResponse: step.haapiResponse })}/>
            break
        case 'unknown-step':
            stepComponent = <>
                <h2>Unknown {missingResponseType}</h2>
                <p>Response:</p>
                <pre className="json-container" dangerouslySetInnerHTML={{ __html: prettyPrintJson.toHtml(step.haapiResponse)}}></pre>
                </>
            break
        default:
            stepComponent = <>
                <p>Please log in</p>
                <StartAuthorization startAuthorization={() => startAuthorization()} />
            </>
    }

    return (<>
        {step.problem && <Error message={step.problem.title} />}
        {stepComponent}
        <div className="example-app-settings active">
            <h3 className="white">Settings</h3>
            <input type="checkbox" name="toggleFollowRedirects" checked={followRedirects} onChange={() => setFollowRedirects(!followRedirects)} />
            <label htmlFor="toggleFollowRedirects">Follow Redirects</label>
        </div>
        {step.haapiResponse && <ShowRawResponse haapiResponse={step.haapiResponse} forceVisibility={step.name === 'show-redirect-step'} />}
    </>)
}

const getRedirectBody = (fields) => {
    if (!fields) {
        return null
    }

    const body = {}

    fields.forEach(field => {
        body[field.name] = field.value
    })

    return body
}
