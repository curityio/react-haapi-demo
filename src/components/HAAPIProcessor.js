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
    const { haapiFetch, setUser } = props
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
                setUser(tokens)
            }

            fetchTokens()
        }
    }, [setUser, state])

console.log('State in processor is: ')
console.log(state)
    let stepComponent

    switch (state.step) {
        case 'loading':
            stepComponent = <div className="loader" />
            break
        case 'authentication-step':
        case 'registration-step':
            stepComponent = processAuthenticationStep(setState, haapiFetch, state.haapiResponse, state, setIsLoading, followRedirects)
            break
        case 'authorization-complete':
            stepComponent = <div className="loader" />
            break
        case 'continue-redirect-step':
            processRedirect(setState, haapiFetch, state.haapiResponse, state, state.codeVerifier, followRedirects)
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
            stepComponent = startAuthorizationButton(setState, haapiFetch, state, followRedirects)
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

const startAuthorization = async (setState, haapiFetch, state, followRedirect) => {
    setState({ step: 'loading', type: null, haapiResponse: null, problem: null, isLoading: true })

    const codeVerifier = generateRandomString(64)
    setState({
        ...state,
        codeVerifier
    })
    const codeChallenge = await generateCodeChallenge(codeVerifier)

    const haapiResponse = await callHaapi(
        haapiFetch,
        `https://localhost:8443/oauth/v2/oauth-authorize?scope=openid&client_id=react-client&response_type=code&code_challenge_method=S256&code_challenge=${codeChallenge}&redirect_uri=http://localhost:3000/`
    )

    await processHaapiResult(setState, haapiFetch, haapiResponse, state, codeVerifier, followRedirect)
}

const processHaapiResult = async (setState, haapiFetch, haapiResponse, state, codeVerifier, followRedirect) => {
    switch (haapiResponse.type) {
        case 'redirection-step':
            if (followRedirect) {
                return await processRedirect(setState, haapiFetch, haapiResponse, state, codeVerifier, followRedirect)
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

const submitForm = async (haapiFetch, setState, formState, url, method, state, setIsLoading, followRedirect) => {
    setIsLoading()
    const response = await callHaapi(
        haapiFetch,
        url,
        method,
        formState
    )

    await processHaapiResult(setState, haapiFetch, response, state, state.codeVerifier, followRedirect)
}

const clickLink = async (haapiFetch, setState, url, state, followRedirect) => {
    const response = await callHaapi(
        haapiFetch,
        url,
        "GET",
        null
    )

    await processHaapiResult(setState, haapiFetch, response, state, state.codeVerifier, followRedirect)
}

const processAuthenticationStep = (setState, haapiFetch, haapiResponse, state, setIsLoading, followRedirect) => {
    const view = haapiResponse.metadata.viewName

    switch (view) {
        case 'authenticator/html-form/forgot-account-id/get':
        case 'authenticator/html-form/reset-password/get':
        case 'authenticator/username/authenticate/get':
        case 'authenticator/html-form/authenticate/get':
        case 'authenticator/html-form/create-account/get':
            return <UsernamePassword
                haapiResponse={haapiResponse}
                submitForm={(formState, url, method) => submitForm(haapiFetch, setState, formState, url, method, state, setIsLoading, followRedirect)}
                isLoading={state.isLoading}
                clickLink={(url) => clickLink(haapiFetch, setState, url, state, followRedirect)}
                inputProblem={state.inputProblem}
            />
        case 'views/select-authenticator/index':
            return <Selector
                actions={haapiResponse.actions}
                submitForm={(url, method) => submitForm(haapiFetch, setState, null, url, method, state, setIsLoading, followRedirect)}
            />
        case 'authenticator/html-form/reset-password/post':
        case 'authenticator/html-form/forgot-account-id/post':
        case 'authenticator/html-form/create-account/post':
            return <UsernamePasswordContinue
                haapiResponse={haapiResponse}
                isLoading={state.isLoading}
                submitForm={(url, method) => submitForm(haapiFetch, setState, null, url, method, state, setIsLoading, followRedirect)}
            />
        default:
            setState({ step: 'unknownStep', type: 'Authentication Step', haapiResponse: haapiResponse, problem: null, isLoading: false })
    }
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
const processRedirect = async (setState, haapiFetch, haapiResult, state, codeVerifier, followRedirect) => {
    const action = haapiResult.actions[0]

    if (action.template === 'form' && action.kind === 'redirect') {
        const response = await callHaapi(
            haapiFetch,
            action.model.href,
            action.model.method,
            getRedirectBody(action.model.fields)
        )

        return await processHaapiResult(setState, haapiFetch, response, state, codeVerifier, followRedirect)
    }

    setState({ step: 'unknownStep', type: 'Redirect Step', haapiResponse: haapiResult, problem: null, isLoading: false })
}

const callHaapi = async (haapiFetch, url, method = 'GET', body = null) => {
    const init = { method }
    if (body) {
        init.body = body
    }

    const response = await haapiFetch(url, init)

    return await response.json()
}

const startAuthorizationButton = (setState, haapiFetch, state, followRedirect) => <>
        <p>Please log in</p>
        <StartAuthorization startAuthorization={() => startAuthorization(setState, haapiFetch, state, followRedirect)} />
    </>

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
