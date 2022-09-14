import React from "react"

// TODO: This is old. Will be updated soon

const Spinner = (props) => {
  return (
    <div className="waiting-spinner loader-inner ball-pulse">
      <div className="waiting-spinner-child waiting-spinner-bounce1"></div>
      <div className="waiting-spinner-child waiting-spinner-bounce2"></div>
      <div className="waiting-spinner-child waiting-spinner-bounce3"></div>
    </div>
  )
}

export default Spinner
