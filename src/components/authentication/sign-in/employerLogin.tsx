import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";

import {
  employerLogin,
  resetEmpLogActionCreator,
} from "../../../redux/features/authentication/LoginSlice";
import { COMPANY_DETAILS } from "../../../config/app.config";
import { patchEmpDeclare } from "../../../redux/features/authentication/employerDeclareSclice";
import { encryptInput } from "../../../common/encrypt";
import { getUniqueId, regex } from "../../../common/validation";
import "../../../assets/customCss/common/common.css";
import "../../../assets/customCss/jobSeekerLogin.css";
let bnr = require("../../../assets/images/common/empLogin.png");
let logo = require("../../../assets/images/Techkri-logo-blue.png");

const INITIAL_FORM_STATE: any = {
  email: "",
  password: "",
};
const LOGIN_FORM_VALIDATION = Yup.object().shape({
  password: Yup.string().required("Please enter your password."),
  email: Yup.string()
    .required("Please enter your email address.")
    .matches(regex.email, "Please enter your valid email address."),
});

function EmployerLogin(props: any) {
  const [popup, setPopup] = useState(false);
  const [time, setTime] = useState(59);
  const [decpop, setDecpop] = useState(false);
  const [backenderror, setBackenderror] = useState("");
  const [createbtn, setCreatebtn] = useState("btn btn-primary");
  const [loginErr, setLoginErr] = useState(""),
    [loader, setLoader] = useState(false);
  const dispatch = useDispatch(),
    [uniqueId] = useState(getUniqueId()),
    navigate = useNavigate(),
    employerLoginRes = useSelector((state: any) => state.employerLogin),
    { res } = employerLoginRes,
    loginErrorMessage = res?.response?.data?.message;
  const EmployeeCompanyInfoSchema = Yup.object().shape({
      termsAndConditions: Yup.bool().oneOf(
        [true],
        "Please accept the terms and conditions."
      ),
    }),
    formik = useFormik({
      initialValues: {
        termsAndConditions: false,
      },
      validationSchema: EmployeeCompanyInfoSchema,
      onSubmit: (e: any) => {
        e.preventDefault();
      },
    });
  const isSubmit = formik.values.termsAndConditions;
  const [passwordType, setPasswordType] = useState("password");

  //useEffect

  useEffect(() => {
    if (res.code === 200) {
      dispatch(resetEmpLogActionCreator());
      if (res.data.tc_accepted) {
        navigate("/empDashboard");
        setLoader(false);
      } else setDecpop(true);
    } else if (
      (res && res.response && res.response.status === 401) ||
      (res && res.response && res.response.status === 400)
    ) {
      dispatch(resetEmpLogActionCreator());
      setBackenderror(loginErrorMessage);
      setLoader(false);
    } else if (res && res.response && res.response.status !== 200) {
      setBackenderror(loginErrorMessage);
      setLoader(false);
      dispatch(resetEmpLogActionCreator());
    }
  }, [navigate, res, loginErrorMessage, loginErr]);

  useEffect(() => {
    if (popup) {
      const timer: any = time > 0 && setInterval(() => setTime(time - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [popup, time]);

  useEffect(() => {
    if (isSubmit) {
      setCreatebtn("border border-primary bg-light text-primary");
    } else {
      setCreatebtn("btn btn-secondary btn-sm");
    }
  }, [isSubmit]);

  //Internal functions
  const togglePassword = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  return (
    <div
      className="browse-job mainDiv login-background d-flex align-items-center"
      style={{ height: "100%" }}
    >
      <div className="container">
        <div className="loginDiv">
          <div className="row">
            <div className="col-md-7 col-lg-7 col-sm-12 loginDivChild1">
              <div>
                <h4 style={{ color: "#FFF" }}>Employer Login</h4>
                <p className="desc">
                  If you do not have an account please
                  <Link
                    to="/employerregister"
                    className="desc"
                    style={{ fontWeight: 600 }}
                  >
                    &nbsp;register&nbsp;
                  </Link>
                  to employer account.
                </p>
                <div className="d-flex justify-content-around">
                  <img src={bnr} style={{ width: "75%" }}></img>
                </div>
                <div>
                  <div className="d-flex justify-content-around">
                    <h5 className="textWhite">looking for job seeker?</h5>
                  </div>
                  <div className="d-flex justify-content-center">
                    <Link
                      to={"/jobSeekerSignin"}
                      style={{ textDecoration: "none" }}
                    >
                      <button className="loginButton mr-3">Login</button>
                    </Link>
                    <Link
                      to={"/jobseekerregister"}
                      style={{ textDecoration: "none" }}
                    >
                      <button className="regButton">Register</button>
                    </Link>
                  </div>
                  <div className="mt-2 text-center">
                    <Link className="text-white gotohome" to={"/home"}>
                      Go to Home
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-5 col-lg-5 col-sm-12 loginDivChild2">
              {/* <Link to={"/home"} title="Go to home page."> */}
              <div
                className="d-flex justify-content-center"
                style={{ margin: "7% 0" }}
              >
                <img
                  src={logo}
                  style={{ width: "50%", cursor: "pointer" }}
                  title="o to home page."
                  onClick={() => {
                    navigate("/home");
                  }}
                />
              </div>
              {/* </Link> */}
              <Formik
                initialValues={{
                  ...INITIAL_FORM_STATE,
                }}
                validationSchema={LOGIN_FORM_VALIDATION}
                onSubmit={(values: any) => {
                  const loginInfo = {
                    authType: "credentials",
                    authKey: values.email,
                    pwd: values.password,
                    state: {
                      uniqueid: uniqueId,
                      ondemandpage: "/employerSignIn",
                    },
                  };

                  loginInfo.pwd = encryptInput(loginInfo.pwd);
                  dispatch(employerLogin(loginInfo));
                  setLoader(true);
                  setTime(59);
                }}
                isInitialValid={false}
              >
                {(formik: any) => {
                  const {
                    values,
                    handleChange,
                    handleSubmit,
                    errors,
                    touched,
                    handleBlur,
                  } = formik;

                  return (
                    <div className="nav">
                      <form
                        onSubmit={handleSubmit}
                        className="col-12 p-a0 "
                        autoComplete="off"
                      >
                        {props.errorMessage && (
                          <div className="bg-red-300 text-red-900  p-1 my-2">
                            {props.errorMessage}
                          </div>
                        )}
                        {props.successMessage && (
                          <div className="bg-green-300 text-green-900  p-1 my-2">
                            {props.successMessage}
                          </div>
                        )}
                        {!errors.email && backenderror && (
                          <p
                            className="form-error"
                            style={{ fontSize: "12px" }}
                          >
                            {backenderror}
                          </p>
                        )}
                        <div className="form-group ">
                          <div className="input-group">
                            <input
                              type="email"
                              name="email"
                              onBlur={handleBlur}
                              onChange={(e: any) => {
                                handleChange(e);
                                setBackenderror("");
                              }}
                              value={values.email}
                              maxLength={150}
                              autoComplete="off"
                              className="form-control marginRight"
                              placeholder="Enter Your Email Address"
                            />
                          </div>

                          {errors.email && touched.email ? (
                            <p className="form-error">{errors.email}</p>
                          ) : null}
                        </div>
                        <div className="form-group">
                          <div className="input-group">
                            <input
                              type={passwordType}
                              name="password"
                              className="form-control marginRight"
                              onBlur={handleBlur}
                              onChange={(e: any) => {
                                handleChange(e);
                                setLoginErr("");
                              }}
                              minLength={6}
                              maxLength={16}
                              autoComplete="off"
                              value={values.password}
                              placeholder="Enter Your Password"
                              onPaste={(e: any) => {
                                e.preventDefault();
                                return false;
                              }}
                              onCopy={(e) => {
                                e.preventDefault();
                                return false;
                              }}
                            />
                          </div>
                          <div className="input-group">
                            <span
                              className="eye-btn-login custom-eye-btn-pos"
                              onClick={togglePassword}
                              style={{
                                display: "block",
                                zIndex: "99",
                                position: "relative",
                                left: "92%",
                                marginTop: "-9%",
                                cursor: "pointer",
                              }}
                            >
                              {passwordType === "password" ? (
                                <BsFillEyeSlashFill />
                              ) : (
                                <BsFillEyeFill />
                              )}
                            </span>
                          </div>
                          {errors.password && touched.password ? (
                            <p
                              className="form-error"
                              style={{ marginTop: "-5%" }}
                            >
                              {errors.password}
                            </p>
                          ) : null}
                        </div>
                        <div className="text-right mb-2">
                          <Link
                            to="/forgotPassword"
                            className="site-button-link font13gray"
                          >
                            Forgot Password ?
                          </Link>
                        </div>
                        <div className="text-center ">
                          <button
                            type="submit"
                            className="site-button float-center w-100 positive-Btn"
                            disabled={loader}
                          >
                            {loader && (
                              <i
                                className="fa fa-circle-o-notch fa-spin"
                                style={{ marginRight: "10px" }}
                              ></i>
                            )}
                            {loader ? "Processing" : "Login"}
                          </button>
                          {loginErr && (
                            <span
                              className="form-error"
                              style={{
                                marginTop: "10px",
                                display: "inline-block",
                              }}
                            >
                              {loginErr}
                            </span>
                          )}
                        </div>
                        <div className="text-center mt-3">
                          <p className="font13gray">Are you new employer ?</p>
                        </div>
                        <Link
                          to="/employerregister"
                          className="site-button-link forget-pass mt-2 float-center w-100"
                        >
                          <button
                            type="button"
                            className="btn btn-outline-primary w-100"
                            style={{ marginBottom: "5%" }}
                          >
                            Register Now
                          </button>
                        </Link>
                        <br></br>
                      </form>
                    </div>
                  );
                }}
              </Formik>
              <Modal
                show={decpop}
                className="modal fade modal-bx-info editor"
                id="scroll"
              >
                <div className="modal-dialog my-0  mx-0 " role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5
                        className="modal-title"
                        id="KeyskillsModalLongTitle"
                        style={{
                          fontSize: "15px",
                          paddingTop: "10px",
                          paddingLeft: "15px",
                          color: "#6060b4",
                        }}
                      >
                        Most Important Terms & Conditions
                      </h5>
                    </div>
                    <div className="modal-body">
                      <div id="section-1">
                        <h5
                          style={{
                            fontSize: "17px",
                            fontWeight: "bold",
                            fontFamily: "-moz-initial",
                          }}
                        >
                          Most Important Terms & Conditions for Usage of Resdex®
                          and Captive Jobs Job Postings
                        </h5>
                        <p style={{ fontSize: "14px" }}>
                          We thank you for subscribing to captivejobs.in. For
                          uninterrupted services, a superior user experience,
                          and maintaining data security, it is important that
                          there is a strict adherence to the Terms and
                          conditions that govern usage of our services.
                        </p>
                        <div>
                          <input
                            name="termsAndConditions"
                            type="checkbox"
                            style={{ marginRight: 10 }}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          <label style={{ color: "#db9c57", fontSize: "14px" }}>
                            {" "}
                            I agree to Terms & Condition and Privacy Policy
                          </label>
                        </div>
                        <div
                          style={{
                            textAlign: "center",
                            marginBottom: "10px",
                            marginTop: "10px",
                          }}
                        >
                          {isSubmit && (
                            <button
                              type="submit"
                              className={`${createbtn}`}
                              disabled={!isSubmit}
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                dispatch(patchEmpDeclare());
                                setDecpop(false);
                                navigate("/empDashboard");
                              }}
                            >
                              Continue
                            </button>
                          )}
                          {!isSubmit && (
                            <button
                              type="submit"
                              className={"btn btn-secondary btn-sm"}
                              disabled={!isSubmit}
                              style={{ cursor: "default" }}
                            >
                              {" "}
                              Continue
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Modal>
            </div>
          </div>
        </div>
        <div className="companyCopyright">
          <span>{`@${new Date().getFullYear()} CaptiveJobs`}</span>
        </div>
      </div>
    </div>
  );
}

export default EmployerLogin;
