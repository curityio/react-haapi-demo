import React, { useState } from "react"
import Icon from "../Icon";

const Button = (props) => {
    const { title, kind, authenticator, type, loading, submitForm } = props

    const handleClick = (event) => {
        event.preventDefault()
        submitForm()

    }

    let buttonType =
    kind === "regular"
      ? `button-primary button-loading ${loading && "button-loading-active"}`
      : "button-social"
    const classNames = `button button-fullwidth ${buttonType} button-${authenticator}`

    return (
    <button className={classNames} onClick={(event) => handleClick(event)}>
      <span className="icon">
        {type === "social" && <Icon type={authenticator} />}
      </span>
      <span>{title}</span>
    </button>
)
}
export default Button
