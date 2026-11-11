import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import logo2 from "../../../assets/images/Techkri-logo-blue.png";
import "../../../assets/customCss/header-profile/HeaderProfile.css";

const Header = () => {
  const navigate = useNavigate();
  const [pageURL, setPageURL] = useState(false);
  const [empPage, setEmpPage] = useState(false);
  const [jobSPage, setJobSPage] = useState(false);

  const jobseekSignIn = window.location.href.includes("jobSeekerSignin"),
    jobseekSignUp = window.location.href.includes("jobseekerregister"),
    EmployerSignIn = window.location.href.includes("employerSignin"),
    EmployerSignUp = window.location.href.includes("employerregister");

  useEffect(() => {
    if (jobseekSignIn || jobseekSignUp) {
      setPageURL(true);
    } else {
      setPageURL(false);
    }
  });

  useEffect(() => {
    if (EmployerSignIn || EmployerSignUp) {
      setEmpPage(true);
    } else {
      setEmpPage(false);
    }
  });

  return (
    <>
      <header className="site-header mo-left header fullwidth">
        <div className="sticky-header main-bar-wraper navbar-expand-lg">
          <div className="main-bar clearfix borderh">
            <div className="container clearfix">
              <div className="logo-header mostion">
                {/* <Link to={"/"}>
                  <img src={logo2} className="logo" alt="img" style={{height:'75px'}} />
                </Link> */}
                <img
                  alt="Header logo"
                  src={logo2}
                  style={{ cursor: "pointer" }}
                  title="Go to home page."
                  onClick={() => {
                    navigate("/");
                  }}
                />
              </div>
              <button
                className="navbar-toggler collapsed navicon  justify-content-end"
                type="button"
                style={{ display: "none" }}
                data-toggle="collapse"
                data-target="#navbarNavDropdown"
                aria-controls="navbarNavDropdown"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>

              <div
                className="extra-nav"
                style={{
                  display: "flex",
                  alignItems: "center",
                  paddingTop: "32px",
                  paddingBottom: "0px",
                  marginTop: "-11px",
                  float: "right",
                }}
              >
                <div className="extra-cell">
                  {/* start  Jobseeker*/}
                  {!pageURL && (
                    <div id={empPage ? "hideonlgemp" : "jobshow"}>
                      <Link
                        to={"/jobSeekerSignin"}
                        className="site-button border border-primary "
                        title="Jobseeker Login"
                        style={{
                          background: "white",
                          color: "#457eff",
                          borderColor: "#457eff",
                          textDecoration: "auto",
                          fontSize: "15px",
                          fontWeight: "500",
                        }}
                      >
                        <i className="fa fa-user"></i> Login
                      </Link>

                      <Link
                        to={"/jobseekerregister"}
                        className="site-button"
                        title="Jobseeker Register"
                        style={{
                          background: "#ff7555",
                          borderColor: "#ff7555",
                          textDecoration: "auto",
                          fontSize: "15px",
                          fontWeight: "500",
                        }}
                      >
                        <i className="fa fa-unlock-alt"></i> Register
                      </Link>
                    </div>
                  )}
                  {/* End  Jobseeker*/}

                  {/* start Employer*/}
                  {!empPage && (
                    <div
                      className="H_dropdown "
                      id={pageURL ? "hideonlgjob" : ""}
                    >
                      <button
                        className="H_dropbtn site-button jobsign"
                        style={{
                          background: "white",
                          color: "#445578",
                          fontSize: "15px",
                        }}
                      >
                        For Employer <i className="fa fa-chevron-down"></i>
                      </button>

                      <div className="H_dropdown-content">
                        <Link
                          to={"/employerSignin"}
                          className="H_Dlink dez-page "
                          style={{ textDecoration: "auto" }}
                        >
                          <span style={{ fontSize: "15px" }}>
                            <i className="fa fa-user"></i> Login
                          </span>{" "}
                          {/* <i className="fa fa-user ml-5"></i> */}
                        </Link>
                        <Link
                          to={"/employerregister"}
                          className="H_Dlink dez-page "
                          style={{ textDecoration: "auto" }}
                        >
                          <span style={{ fontSize: "15px" }}>
                            {" "}
                            <i className="fa fa-unlock-alt"></i> Register
                          </span>
                          {/* <i className="fa fa-unlock-alt ml-5"></i> */}
                        </Link>
                      </div>
                    </div>
                  )}
                  {/* End Employer*/}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
