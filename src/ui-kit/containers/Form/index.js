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
    const { links, href, submitForm, onChange, isLoading, clickLink, headingTitle, inputProblem } = this.props
    const { title, actionTitle, fields } = this.props.model

    const formTitle = headingTitle || title

    console.log("Here is the form's model")
    console.log(this.props.model)
    console.log("Does the form has any problems?")
    console.log(inputProblem)

    return (
      <div className="form ">
        {inputProblem && <Error message={inputProblem.title}/>}
        <Heading title={formTitle} />
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
