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

import React, { Component } from "react"

/* UI Components */
import { FormField, Button, Link, Error } from "../../ui-components";

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      error: null
    }
  }

  componentDidMount() {}

  render() {
    const { links, href, submitForm, onChange, isLoading, clickLink, headingTitle, inputProblem, computedTitle } = this.props
    const { actionTitle, fields } = this.props.model

    const showSubtitle = headingTitle && computedTitle !== headingTitle

    return (
      <>
        {inputProblem && <Error message={inputProblem.title}/>}
        <div className="heading">{computedTitle}</div>
        {showSubtitle && <p>{headingTitle}</p>}
        {fields && fields.map(({ label, kind, name, type }) => (
          <FormField
            key={name}
            href={href}
            label={label}
            name={name}
            type={type}
            onChange={(event) => onChange(name, event.target.value)}
            fieldProblem={inputProblem && inputProblem.invalidFields.find((field) => field.name === name)}
          />
        ))}
        <Button href={href} title={actionTitle} submitForm={submitForm} kind="regular" loading={isLoading} />
        <div className="mt3 clearfix">
          <div className="center py2 login-action flex flex-column">
            {links &&
              links.map(({ title, href, rel }) => (
                <Link key={href} title={title} href={href} rel={rel} clickLink={clickLink} />
              ))}
          </div>
        </div>
      </>
    )
  }
}
export default Form
