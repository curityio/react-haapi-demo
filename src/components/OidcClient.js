import config from "../config";

class OidcClient {
    codeVerifier

    constructor() {
        this.codeVerifier = generateCodeVerifier()
    }

    fetchTokens = async (code, setTokens) => {
        const tokensResponse = await getTokens(code, this.codeVerifier)
        const tokens = await tokensResponse.json()
        setTokens(tokens)
    }

    getAuthorizationUrl = async () => {
        const codeChallenge = await calculateCodeChallenge(this.codeVerifier)

        const url = new URL(config.authorizationEndpoint)
        const queryParams = url.searchParams
        queryParams.append('client_id', config.clientId)
        queryParams.append('scope', config.scope)
        queryParams.append('response_type', 'code')
        queryParams.append('code_challenge_method', 'S256')
        queryParams.append('code_challenge', codeChallenge)
        queryParams.append('redirect_uri', config.redirectUri)

        return url
    }
}

const getTokens = async (code, codeVerifier) => await fetch(config.tokenEndpoint, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: getBody(code, codeVerifier)
})

const getBody = (code, codeVerifier) => new URLSearchParams({
    'client_id': config.clientId,
    'grant_type': 'authorization_code',
    'code': code,
    'code_verifier': codeVerifier,
    'redirect_uri': config.redirectUri
})

const generateCodeVerifier = () => generateRandomString(64)

const generateRandomString = (length) => {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

const calculateCodeChallenge = async (codeVerifier) => {
    const digest = await crypto.subtle.digest("SHA-256",
        new TextEncoder().encode(codeVerifier))

    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

export { OidcClient }
