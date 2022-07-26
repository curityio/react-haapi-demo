import React, {useState} from "react";

import Logo from "../ui-components/Logo";
import Form from "../containers/Form";

export default function UsernamePassword(props) {
    const { actions, links, messages } = props.haapiResponse
    const { model, title } = actions[0]
    const otherActions = actions.slice(1)

    const [state, setState] = useState({})

    const onChange = (name, value) => {
        setState((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }

    const computedTitle =
        (messages && messages.find(m => m.classList.includes("heading"))?.text)
        || title
        || model.title

    return (<>
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
    </>)
}
