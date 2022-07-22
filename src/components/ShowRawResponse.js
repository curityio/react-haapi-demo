import React, {useState} from 'react'
import AnimateHeight from "react-animate-height";
import {prettyPrintJson} from "pretty-print-json";

export default function ShowRawResponse(props) {
    const [visible, setVisible] = useState(false)

    const { haapiResponse, forceVisibility } = props

    const isResponseVisible = visible || forceVisibility
    const rawResponseHeight = isResponseVisible ? 'auto' : 0

    return (<>
        <input type="checkbox" checked={isResponseVisible} name="showRaw" onChange={() => setVisible(!isResponseVisible)} />
        <label htmlFor="showRaw">Show raw JSON response</label>
        <AnimateHeight
            height={rawResponseHeight}
            duration={500}
        >
            <pre className="json-container" dangerouslySetInnerHTML={{ __html: prettyPrintJson.toHtml(haapiResponse) }}>
            </pre>
        </AnimateHeight>
    </>)
}
