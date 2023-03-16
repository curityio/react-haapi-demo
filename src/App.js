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
import '../node_modules/pretty-print-json/dist/css/pretty-print-json.css'
import { Header, Layout, Main } from "./components/example"

import {useState} from "react";

/* HAAPI */
import HAAPIProcessor from "./components/HAAPIProcessor";
import haapiFetch from "./haapiFetch";
import Authenticated from "./components/Authenticated";

function App() {
  const [tokens, setTokens] = useState(null)

  return (
    <Layout>
      <Header/>
      <Main>
        {tokens && <Authenticated tokens={tokens} />}
        {!tokens && <HAAPIProcessor haapiFetch={haapiFetch} setTokens={setTokens} />}
      </Main>
    </Layout>
  );
}

export default App;
