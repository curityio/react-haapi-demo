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
