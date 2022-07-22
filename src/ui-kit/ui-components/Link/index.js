import React from "react"
import { IoMdPersonAdd } from "react-icons/io"

const Link = (props) => {
  const { title, rel, clickLink, href } = props

  return (
    <button className="button button-tiny button-fullwidth button-primary-outline mb1" onClick={() => clickLink(href)}>
      {rel === "register-create" && <IoMdPersonAdd className="mr1" />}
      {title}
    </button>
  )
}

export default Link
