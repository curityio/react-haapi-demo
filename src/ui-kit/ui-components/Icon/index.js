/*
 *  Copyright 2022 Curity AB
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

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
