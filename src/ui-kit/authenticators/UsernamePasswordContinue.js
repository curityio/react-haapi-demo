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

import React from "react";

import Form from "../containers/Form";

export default function UsernamePasswordContinue(props) {
    const { actions, links, messages } = props.haapiResponse
    const { model, title } = actions[0]

    return (<>
        {messages && messages.map((message) => (
            <div className={message.classList.join(" ") + " message"}>{message.text}</div>
        ))}
        <Form
            model={model}
            headingTitle={title}
            links={links}
            submitForm={() => props.submitForm(model.href, model.method)}
            isLoading={props.isLoading}
        />
    </>)
}
