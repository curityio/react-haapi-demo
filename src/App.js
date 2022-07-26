/* Styles */
import "./scss/main.scss"
import "./scss/curity-theme.scss"
import "./scss/curity-example-app.scss"
import './App.css'
import '../node_modules/pretty-print-json/dist/pretty-print-json.css'

import {useState} from "react";
import HAAPIProcessor from "./components/HAAPIProcessor";
import haapiFetch from "./haapiFetch";
import Authenticated from "./components/Authenticated";

function App() {
  const [tokens, setTokens] = useState(null)

  return (
    <div className="App">
      <header className="App-header">
        <img src="/curity-logo.svg" className="App-logo" alt="logo" />
      </header>
      <main>
        {tokens && <Authenticated tokens={tokens} />}
        {!tokens && <HAAPIProcessor haapiFetch={haapiFetch} setTokens={setTokens} />}
      </main>
    </div>
  );
}

export default App;
