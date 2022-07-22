import React from "react"

// TODO: This is old. Will be updated soon

const Error = (props) => {
  const { message } = props
  const errorText = message.hasOwnProperty.statusText
    ? message.statusText
    : message

  return (
    <div className="error">
      <div className="alert alert-danger px4 mt2">{errorText}</div>
    </div>
  )
}

export default Error
