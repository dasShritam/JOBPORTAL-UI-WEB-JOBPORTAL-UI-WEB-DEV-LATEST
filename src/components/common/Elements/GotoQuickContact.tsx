import React from "react";
import { Link } from "react-router-dom";
var FAQ_Img = require("../../../assets/images/background/FAQ.png");
const GotoQuickContact = () => {
  return (
    <>
      <div
        className="section-full content-inner-2 call-to-action overlay-black-dark text-white text-center bg-img-fix"
        style={{ backgroundImage: "url(" + FAQ_Img + ")" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h2 className="m-b10">Quick Contact Page</h2>{" "}
              <p className="m-b0 ">
                A quick contact page is a dedicated section on a website or
                application that allows users to quickly and easily submit
                queries or requests for customer support. It serves as a
                convenient and efficient way for users to reach out to the
                customer support team with their questions, concerns, or
                feedback. The primary purpose of a quick contact page is to
                streamline the communication process and provide a seamless
                experience for users seeking assistance.
              </p>{" "}
              <Link
                to={"/public/quick-contact"}
                className="site-button m-t20 outline outline-2 radius-xl"
                style={{ textDecoration: "none" }}
              >
                Go To Quick Contact
              </Link>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </>
  );
};

export default GotoQuickContact;
