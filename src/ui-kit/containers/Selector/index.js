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

/* UI Components */
import { Layout, Page, Well, Logo, Heading, Button, FormElement } from "../../ui-components";

/* UI Components */

const Selector = (props) => {
  const { actions, submitForm } = props
  const options = actions[0].model.options
  const title = actions[0].title

  return (
    <Layout>
      <Page>
        <Well>
          <Logo />
          <Heading title={title} />

          {options.map(({ title, properties: { authenticatorType: kind }, model }) => (
            <FormElement key={title}>
              <Button title={title} authenticator={kind} type="social" loading={false} submitForm={() => submitForm(model.href, model.method)} />
            </FormElement>
          ))}
        </Well>
      </Page>
    </Layout>
  )
}

export default Selector
