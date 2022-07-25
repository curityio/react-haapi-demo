import {useEffect, useState} from "react"
import StartAuthorization from "./StartAuthorization";
import UsernamePassword from "../ui-kit/authenticators/UsernamePassword";
import Error from "../ui-kit/ui-components/Error";
import Selector from "../ui-kit/containers/Selector";
import UsernamePasswordContinue from "../ui-kit/authenticators/UsernamePasswordContinue";
import ShowRawResponse from "./ShowRawResponse";
import RedirectStep from "./RedirectStep";
import {prettyPrintJson} from "pretty-print-json";

export default function HAAPIProcessor(props) {
    const { haapiFetch, setTokens } = props
    const [ state, setState ] = useState({ step: null, type: null, haapiResponse: null, problem: null, isLoading: false })
    const [ followRedirects, setFollowRedirects ] = useState(true)

    const setIsLoading = () => setState({
        ...state,
        isLoading: true
    })

    useEffect( () => {

        if (state.haapiResponse && state.haapiResponse.type === 'oauth-authorization-response') {
            const fetchTokens = async () => {
                const tokensResponse = await getTokens(state.haapiResponse.properties.code, state.codeVerifier)
                const tokens = await tokensResponse.json()
                console.log('Setting tokens')
                console.log(tokens)
                setTokens(tokens)
            }

            fetchTokens()
        }
    }, [setTokens, state])

    const processAuthenticationStep = (haapiResponse, followRedirect) => {
        const view = haapiResponse.metadata.viewName

        switch (view) {
            case 'authenticator/html-form/forgot-account-id/get':
            case 'authenticator/html-form/reset-password/get':
            case 'authenticator/username/authenticate/get':
            case 'authenticator/html-form/authenticate/get':
            case 'authenticator/html-form/create-account/get':
                return <UsernamePassword
                    haapiResponse={haapiResponse}
                    submitForm={(formState, url, method) => submitForm(formState, url, method, followRedirect)}
                    isLoading={state.isLoading}
                    clickLink={(url) => clickLink(url, followRedirect)}
                    inputProblem={state.inputProblem}
                />
            case 'views/select-authenticator/index':
                return <Selector
                    actions={haapiResponse.actions}
                    submitForm={(url, method) => submitForm( null, url, method, followRedirect)}
                />
            case 'authenticator/html-form/reset-password/post':
            case 'authenticator/html-form/forgot-account-id/post':
            case 'authenticator/html-form/create-account/post':
                return <UsernamePasswordContinue
                    haapiResponse={haapiResponse}
                    isLoading={state.isLoading}
                    submitForm={(url, method) => submitForm(null, url, method, followRedirect)}
                />
            default:
                setState({ step: 'unknownStep', type: 'Authentication Step', haapiResponse: haapiResponse, problem: null, isLoading: false })
        }
    }

    const startAuthorization = async (followRedirect) => {
        setState({ step: 'loading', type: null, haapiResponse: null, problem: null, isLoading: true })

        const codeVerifier = generateRandomString(64)
        setState({
            ...state,
            codeVerifier
        })
        const codeChallenge = await generateCodeChallenge(codeVerifier)

        const haapiResponse = await callHaapi(
            `https://localhost:8443/oauth/v2/oauth-authorize?scope=openid&client_id=react-client&response_type=code&code_challenge_method=S256&code_challenge=${codeChallenge}&redirect_uri=http://localhost:3000/`
        )

        await processHaapiResult(haapiResponse, codeVerifier, followRedirect)
    }

    const submitForm = async (formState, url, method, followRedirect) => {
        setIsLoading()
        const response = await callHaapi(
            url,
            method,
            formState
        )

        await processHaapiResult(response, state.codeVerifier, followRedirect)
    }

    const processHaapiResult = async (haapiResponse, codeVerifier, followRedirect) => {
        switch (haapiResponse.type) {
            case 'redirection-step':
                if (followRedirect) {
                    return await processRedirect(haapiResponse, codeVerifier, followRedirect)
                } else {
                    setState({ step: 'show-redirect-step', haapiResponse, problem: null, isLoading: false, codeVerifier })
                }
                break
            case 'authentication-step':
                setState({ step: 'authentication-step', haapiResponse, problem: null, isLoading: false, codeVerifier })
                break
            case 'registration-step':
                setState({ step: 'registration-step', haapiResponse, problem: null, isLoading: false, codeVerifier })
                break
            case 'https://curity.se/problems/incorrect-credentials':
                setState({ step: state.haapiResponse.type, haapiResponse: state.haapiResponse, problem: haapiResponse, isLoading: false, codeVerifier })
                break
            case 'oauth-authorization-response':
                setState({ step: 'authorization-complete', haapiResponse, isLoading: false, codeVerifier })
                break
            case 'https://curity.se/problems/invalid-input':
                setState({ step: state.haapiResponse.type, haapiResponse: state.haapiResponse, inputProblem: haapiResponse, isLoading: false, codeVerifier })
                break
            default:
                setState({ step: 'unknownStep', type: 'step type', haapiResponse: haapiResponse, problem: null, isLoading: false })
        }
    }

    const clickLink = async (url, followRedirect) => {
        const response = await callHaapi(
            url,
            "GET",
            null
        )

        await processHaapiResult(response, state.codeVerifier, followRedirect)
    }

    const processRedirect = async (haapiResult, codeVerifier, followRedirect) => {
        const action = haapiResult.actions[0]

        if (action.template === 'form' && action.kind === 'redirect') {
            const response = await callHaapi(
                action.model.href,
                action.model.method,
                getRedirectBody(action.model.fields)
            )

            return await processHaapiResult(response, codeVerifier, followRedirect)
        }

        setState({ step: 'unknownStep', type: 'Redirect Step', haapiResponse: haapiResult, problem: null, isLoading: false })
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

    switch (state.step) {
        case 'loading':
            stepComponent = <div className="loader" />
            break
        case 'authentication-step':
        case 'registration-step':
            stepComponent = processAuthenticationStep(state.haapiResponse, followRedirects)
            break
        case 'authorization-complete':
            stepComponent = <div className="loader" />
            break
        case 'continue-redirect-step':
            processRedirect(state.haapiResponse, state.codeVerifier, followRedirects)
            stepComponent = <div className="loader" />
            break
        case 'show-redirect-step':
            stepComponent = <RedirectStep continueFlow={() => setState({ step: 'continue-redirect-step', isLoading: false, haapiResponse: state.haapiResponse, codeVerifier: state.codeVerifier, problem: null})}/>
            break
        case 'unknownStep':
            stepComponent = <>
                <h2>Unknown {state.type}</h2>
                <p>Response:</p>
                <pre className="json-container" dangerouslySetInnerHTML={{ __html: prettyPrintJson.toHtml(state.haapiResponse)}}></pre>
                </>
            break
        default:
            stepComponent = <>
                <p>Please log in</p>
                <StartAuthorization startAuthorization={() => startAuthorization(followRedirects)} />
            </>
    }

    return (<>
        {state.problem && <Error message={state.problem.title} />}
        {stepComponent}
        <div>
            <input type="checkbox" name="toggleFollowRedirects" checked={followRedirects} onChange={() => setFollowRedirects(!followRedirects)} />
            <label htmlFor="toggleFollowRedirects">Follow Redirects</label>
        </div>
        {state.haapiResponse && <ShowRawResponse haapiResponse={state.haapiResponse} forceVisibility={state.step === 'show-redirect-step'} />}
    </>)
}

const getTokens = async (code, codeVerifier) => await fetch('https://localhost:8443/oauth/v2/oauth-token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `client_id=react-client&grant_type=authorization_code&code=${code}&code_verifier=${codeVerifier}&redirect_uri=http://localhost:3000/`,
        mode: 'cors'
    })

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

const generateRandomString = (length) => {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

const generateCodeChallenge = async (codeVerifier) => {
    const digest = await crypto.subtle.digest("SHA-256",
        new TextEncoder().encode(codeVerifier))

    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}
