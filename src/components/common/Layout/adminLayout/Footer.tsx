import React from "react";
import { Link } from "react-router-dom";
import { COMPANY_DETAILS } from "../../../../config/app.config";
import "../../../../assets/customCss/header-profile/HeaderProfile.css";

const Footeradmin = () => {
  return (
    <>
      <footer
        className=""
        style={{ backgroundColor: "rgb(33, 37, 41)", color: "white" }}
      >
        <div className="container jobResp">
          <div className="row">
            <div className="col-lg-12 text-center">
              <span className="float-left">
                © Copyright by{" "}
                <a
                  href="https://www.alchemy.com/"
                  style={{ color: "aliceblue" }}
                >
                  Captive Jobs
                </a>{" "}
              </span>
              <span
                className="float-right"
                style={{ color: "rgb(215, 224, 232)" }}
              >
                All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footeradmin;
