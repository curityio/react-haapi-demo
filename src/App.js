/* Styles */
import "./scss/main.scss"
import "./scss/curity-theme.scss"
import "./scss/curity-example-app.scss"
import './App.css'
import '../node_modules/pretty-print-json/dist/pretty-print-json.css'

import {useState} from "react";
import {createHaapiFetch} from "@curity/identityserver-haapi-web-driver";
import HAAPIProcessor from "./components/HAAPIProcessor";

function App() {

  const [user, setUser] = useState(null)

    console.log("Creating/recreatig HAAPIFetch")
    const haapiFetch = createHaapiFetch({
        clientId: 'react-client',
        tokenEndpoint: 'https://localhost:8443/oauth/v2/oauth-token',
    })

  return (
    <div className="App">
      <header className="App-header">
        <img src="/curity-logo.svg" className="App-logo" alt="logo" />
      </header>
      <main>
        {user && <>
          <p>Logged in as { getUser(user) } with token {user.access_token}</p>
        </>}
        {!user && <>
          <HAAPIProcessor haapiFetch={haapiFetch} setUser={setUser}/>
        </>}
      </main>
    </div>
  );
}

const getUser = (tokens) => {
    const idToken = tokens.id_token
    if (!idToken) {
        return null
    }

    const dataPart = idToken.split('.')[1]
    const claims = JSON.parse(atob(dataPart))
    return claims.sub
}

export default App;
