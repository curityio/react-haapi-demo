import React, { Component } from "react"
import Heading from "../../ui-components/Heading";
import FormField from "../../ui-components/FormField";
import Button from "../../ui-components/Button";
import Link from "../../ui-components/Link";
import Error from "../../ui-components/Error";

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
      <div className="form ">
        {inputProblem && <Error message={inputProblem.title}/>}
        <Heading title={computedTitle} />
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
        <Button href={href} title={actionTitle} submitForm={submitForm} kind="regular" margin="mt2" loading={isLoading} />
        <div className="mt3 clearfix">
          <div className="center py2 login-action flex flex-column">
            {links &&
              links.map(({ title, href, rel }) => (
                <Link key={href} title={title} href={href} rel={rel} clickLink={clickLink} />
              ))}
          </div>
        </div>
      </div>
    )
  }
}
export default Form
