import React from "react";
import { Link } from "react-router-dom";
// import { COMPANY_DETAILS } from "../../../../config/app.config";
// import "../../../../assets/customCss/header-profile/HeaderProfile.css";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-bottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <span> ©{new Date().getFullYear()} Copyright by <i className="fa fa-heart m-lr5 text-red heart"></i>
                <a href="https://www.alchemy.com/">Captive Jobs </a>
                All rights reserved.
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
    // <footer
    //   classNameName=""
    //   style={{ backgroundColor: "rgb(33, 37, 41)", color: "white" }}
    // >
    //   <div classNameName="container jobResp">
    //     <div classNameName="row">
    //       <div classNameName="col-lg-12 text-center">
    //         <span classNameName="float-left">
    //           © Copyright by{" "}
    //           <a href="https://www.alchemy.com/" style={{ color: "aliceblue" }}>
    //             Captive Jobs
    //           </a>{" "}
    //         </span>
    //         <span
    //           classNameName="float-right"
    //           style={{ color: "rgb(215, 224, 232)" }}
    //         >
    //           All rights reserved.
    //         </span>
    //       </div>
    //     </div>
    //   </div>
    // </footer>
  );
};

export default Footer;
