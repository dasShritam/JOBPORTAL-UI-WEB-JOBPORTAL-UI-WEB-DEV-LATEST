import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../../assets/customCss/errorpage.css";
var bnr = require("../../assets/images/banner/bnr1.jpg");

function ErrorPage400() {
  useEffect(() => {
    sessionStorage?.clear();
  }, []);
  return (
    <div className="page-wraper">
      <div className="page-content">
        <div
          className="dez-bnr-inr overlay-black-middle"
          style={{ backgroundImage: "url(" + bnr + ")" }}
        >
          <div className="container">
            <div className="dez-bnr-inr-entry">
              <h1 className="text-white">Error 400</h1>
              <div className="breadcrumb-row">
                <ul className="list-inline">
                  <li>
                    <Link to={"#"}>Home</Link>
                  </li>
                  <li>Error 400</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="section-full content-inner-3 bg-white ErrorPages">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 error-page text-center">
                <h2 className="dz_error text-secondry">400</h2>
                <h3>OOPS!</h3>
                <h4 className="text-primary">Page Not Found</h4>
                <p className="" style={{ fontFamily: "cursive" }}>
                  Request could not be sent.{" "}
                </p>
                <Link to={"/employerSignin"} className="site-button">
                  Back To Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ErrorPage400;
