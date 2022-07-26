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

import React from "react"
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
