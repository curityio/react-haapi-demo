import React from "react"

const FormField = (props) => {
  const { type, name, label, onChange, fieldProblem } = props
  let formType, autofocus

  switch (type) {
    case "username":
      formType = "text"
      autofocus = true
      break
    case "password":
      formType = "password"
      break
    case "checkbox":
        formType = "checkbox"
          break
    default:
      formType = "text"
  }

  const classes = "block full-width mb1 field-light " + (fieldProblem ? "is-error" : "")

  return (
    <div className="form-field">
      <label htmlFor={name} className="label">
        {label}
      </label>
      <input
        type={formType}
        name={name}
        id={name}
        className={classes}
        autoCapitalize="none"
        autoFocus={autofocus}
        autoComplete={name}
        data-lpignore="true"
        onChange={onChange}
      />
        {fieldProblem && <div className="is-error-danger is-error">{fieldProblem.detail}</div>}
    </div>
  )
}

export default FormField
