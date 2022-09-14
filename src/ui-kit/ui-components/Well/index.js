import React from "react"

import { theme } from "../../../settings.js"

const Well = (props) => {
  const {
    skin: { loginFormBackground },
  } = theme

  const className = ` ${loginFormBackground}`

  return <div className={`login-well ${className}`}>{props.children}</div>
}

export default Well
