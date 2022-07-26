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

import React from 'react'
import Heading from "../ui-kit/ui-components/Heading";
import {prettyPrintJson} from "pretty-print-json";

export default function Authenticated(props) {

    const decodeToken = (idToken) => {
        const dataPart = idToken.split('.')[1]
        return JSON.parse(atob(dataPart))
    }

    const getSubject = (idToken) => {
        if (!idToken) {
            return null
        }

        return decodeToken(idToken).sub
    }

    const { id_token, access_token, scope, expires_in } = props.tokens

    return (<div className="authenticated">
        <Heading title={`Welcome ${getSubject(id_token)}`} />
        <div className="left-align">
            <p>Access Token: <strong>{access_token}</strong></p>
            <p>Scopes: <strong>{scope}</strong></p>
            <p>Access token expires in <strong>{expires_in}</strong> seconds</p>
            <p>ID Token claims:</p>
            <pre className="json-container" dangerouslySetInnerHTML={{ __html: prettyPrintJson.toHtml(decodeToken(id_token)) }} />
        </div>
    </div>)
}
