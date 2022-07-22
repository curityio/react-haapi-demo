import React from "react";

import Form from "../containers/Form";

export default function UsernamePasswordContinue(props) {
    const { actions, links, messages } = props.haapiResponse
    const { model, title } = actions[0]

    return (<>
        {messages && messages.map((message) => (
            <div className={message.classList.join(" ")}>{message.text}</div>
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
