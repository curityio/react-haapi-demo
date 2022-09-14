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

import React, {useState} from "react";

/* UI Containers */
import Form from "../containers/Form";

/* UI Components */
import { Layout, Page, Well, Logo } from "../ui-components";

export default function UsernamePassword(props) {
    const { actions, links, messages } = props.haapiResponse
    const { model, title } = actions[0]
    const otherActions = actions.slice(1)

    const [state, setState] = useState(new URLSearchParams())

    const onChange = (name, value) => {
        setState((prevState) => {
            prevState.set(name, value)
            return prevState
        })
    }

    const computedTitle =
        (messages && messages.find(m => m.classList.includes("heading"))?.text)
        || title
        || model.title

    return (
      <Layout>
        <Page>
            <Well>
                <Logo />
                <Form
                    model={model}
                    computedTitle={computedTitle}
                    headingTitle={title}
                    actions={actions}
                    links={links}
                    submitForm={() => props.submitForm(state, model.href, model.method)}
                    onChange={onChange}
                    isLoading={props.isLoading}
                    clickLink={props.clickLink}
                    inputProblem={props.inputProblem}
                />
                {otherActions.map(action => <Form
                    key={action.model.href}
                    model={action.model}
                    submitForm={() => props.submitForm(null, action.model.href, action.model.method)}
                />)}
            </Well>
        </Page>
    </Layout>
    )
}
