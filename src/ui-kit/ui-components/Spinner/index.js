import React from "react";

/* UI Components */
import { Layout, Page, Well, Logo } from "../";

const Spinner = () => {
  return (
    <Layout>
      <Page>
        <Well>
          <Logo />
          <div className="waiting-spinner loader-inner ball-pulse">
            <div className="waiting-spinner-child waiting-spinner-bounce1"></div>
            <div className="waiting-spinner-child waiting-spinner-bounce2"></div>
            <div className="waiting-spinner-child waiting-spinner-bounce3"></div>
          </div>
        </Well>
      </Page>
    </Layout>
  );
};

export default Spinner;
