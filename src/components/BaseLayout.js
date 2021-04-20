import React, { useEffect } from "react";
import "../App.css";
import Navbar from "./Navbar";

function BaseLayout(props) {
  return (
    <>
      <div className="page-background">{props.children}</div>
    </>
  );
}

export default BaseLayout;
