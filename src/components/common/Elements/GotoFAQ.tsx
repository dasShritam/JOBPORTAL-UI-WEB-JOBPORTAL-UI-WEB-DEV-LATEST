import React from "react";
import { Link } from "react-router-dom";
var FAQ_Img = require("../../../assets/images/background/FAQ.png");
const GotoFAQ = () => {
  return (
    <>
      <div
        className="section-full content-inner-2 call-to-action overlay-black-dark text-white text-center bg-img-fix"
        style={{ backgroundImage: "url(" + FAQ_Img + ")" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h2 className="m-b10">Frequently Asked Questions (FAQ)</h2>{" "}
              <p className="m-b0 ">
                Find answers to commonly asked questions about our
                products/services. If you have a question that isn't answered
                here, feel free to contact our support team for further
                assistance.
              </p>{" "}
              <Link
                to={"/public/faq"}
                className="site-button m-t20 outline outline-2 radius-xl"
                style={{ textDecoration: "none" }}
              >
                Go to FAQ
              </Link>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </>
  );
};
export default GotoFAQ;
