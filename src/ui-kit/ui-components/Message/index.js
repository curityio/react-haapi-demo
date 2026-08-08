/*
 *  Copyright 2024 Curity AB
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

import React from "react";

import { prettyPrintJson } from "pretty-print-json";

const Message = (props) => {
    const { message } = props;

    let messageComponent;
    if(message.classList.includes('json')) {
        messageComponent = (
            <pre className="json-container"
                dangerouslySetInnerHTML={{
                __html: prettyPrintJson.toHtml(JSON.parse(message.text))
            }} ></pre>
        );
    }
    else if (message.classList.includes('heading')) {
        messageComponent = (<h2>{message.text}</h2>);
    } else {
        messageComponent = (
            <div className={message.classList.join(' ')}>
            <p>{message.text}</p>
            </div>
        );
    }

    return messageComponent;
};

export default Message;