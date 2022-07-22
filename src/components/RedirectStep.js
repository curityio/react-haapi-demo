import React from 'react'

export default function RedirectStep(props) {
    const { continueFlow } = props
    return (<>
        <h1>Redirect step</h1>
        <p>Normally, a user will not be able to see this step. Click "Continue" to continue to next step.</p>
        <button className="button button-primary" onClick={continueFlow}>Continue</button>
    </>)
}
