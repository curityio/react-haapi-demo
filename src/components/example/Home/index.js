import React from "react"

const Home = ({children}) => {
  return (
    <div className="body-dark py4" style={{ height: "calc(100vh)" }}>
      <div className="container">
        <img
          src="/images/curity-api-react.svg"
          className="py4 mx-auto block"
          style={{ maxWidth: "300px" }}
          alt="Curity HAAPI React Demo"
        />

        <div className="center">
          <h1 className="white mt0">HAAPI demo application with React</h1>
        </div>

        {children}
      </div>
    </div>
  )
}

export default Home
