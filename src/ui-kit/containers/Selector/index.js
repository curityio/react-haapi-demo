import React from "react"
import Heading from "../../ui-components/Heading";
import Button from "../../ui-components/Button";
import FormElement from "../../ui-components/FormElement";

/* UI Components */

const Selector = (props) => {
  const { actions, submitForm } = props
  const options = actions[0].model.options
  const title = actions[0].title

  return (
    <div className="form">
      <Heading title={title} />

      {options.map(({ title, properties: { authenticatorType: kind }, model }) => (
        <FormElement key={title}>
          <Button title={title} authenticator={kind} type="social" loading={false} submitForm={() => submitForm(model.href, model.method)} />
        </FormElement>
      ))}
    </div>
  )
}

export default Selector
