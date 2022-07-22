import React from "react"

import * as Icons from "../Icons"

const Icon = (props) => {
  const { type } = props

  switch (type) {
    case "google":
      return <Icons.IoLogoGoogle />
    case "totp":
      return <Icons.IoMdKeypad />
    case "phpass":
      return <Icons.IoIosLogIn />
    case "sms":
      return <Icons.IoIosChatboxes />
    case "html-form":
      return <Icons.IoIosMan />
    case "email":
      return <Icons.IoIosMail />
    case "facebook":
      return <Icons.IoLogoFacebook />
    default:
      return <Icons.IoIosCube />
  }
}

export default Icon
