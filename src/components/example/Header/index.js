import React from "react";

import { HeaderLogo } from "../";

const Header = () => {
  return (
    <header
      style={{
        backgroundColor: "#2a2f3a",
        padding: ".5rem",
        position: "fixed",
        top: "0",
        width: "100%",
        zIndex: "10",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <HeaderLogo />
    </header>
  );
};

export default Header;
