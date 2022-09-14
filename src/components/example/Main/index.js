import React from "react"

const Main = ({children}) => {
  return (
    <div className="body-dark py4" style={{ height: "calc(100vh)" }}>



        {children}

    </div>
  )
}

export default Main
