import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";

import loginbg from "../../../assets/images/background/AdminLoginBackgroungImage.png";
import logo2 from "../../../assets/images/Techkri-logo-blue.png";
import {
  resetVerifyOtp,
  verifyOtpAndCrtToken,
} from "../../../redux/features/authentication/verifyOtpSlice";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import { adminLogin } from "../../../redux/features/authentication/LoginSlice";
import { COMPANY_DETAILS } from "../../../config/app.config";
import { environment } from "../../../environments/environment";
import "../../../assets/customCss/employerLogin.css";
import { encryptInput } from "../../../common/encrypt";
import { getUniqueId, regex } from "../../../common/validation";

const INITIAL_FORM_STATE: any = {
  email: "",
  password: "",
};
const PATENT_FORM_VALIDATION = Yup.object().shape({
  password: Yup.string().required("Please enter your Password."),

  email: Yup.string()
    .required("Please enter your Email Address.")
    .matches(regex.email, "Please enter your valid Email Address."),
});

function AdminLogin(props: any) {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [time, setTime] = useState(59);
  const [backenderror, setBackenderror] = useState("");
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  const [err, setErr] = useState("");
  const [pointer, setPointer] = useState("pointer");
  const inputRef = useRef<HTMLInputElement>(null);
  const [loader2, setLoader2] = useState(false);
  const [loader3, setLoader3] = useState(false);
  const [popup, setPopup] = useState(false),
    [loader, setLoader] = useState(false),
    [userCred, setUserCred] = useState({}),
    [mins, setMins] = useState(0),
    [secs, setSecs] = useState(0),
    dispatch = useDispatch(),
    navigation = useNavigate(),
    showSnackAlert = UseToastAlert(),
    [uniqueId] = useState(getUniqueId()),
    adminLoginRes = useSelector((state: any) => state.adminLogin),
    otpVerifiedRes = useSelector((state: any) => state.verifyAndCrtToken),
    { res } = adminLoginRes,
    loginErrorMessage = res?.response?.data?.message,
    otpErrorMessage = otpVerifiedRes?.res?.response?.data?.message;
  const [passwordType, setPasswordType] = useState("password");

  //useEffect

  useEffect(() => {
    if (popup) {
      const timer: any = time > 0 && setInterval(() => setTime(time - 1), 1000);
      setMins(Math.floor(time / 60));
      setSecs(time % 60);
      return () => clearInterval(timer);
    }
  }, [popup, time]);

  useEffect(() => {
    if (res?.code === 200) {
      setBackenderror("");
      setPopup(true);
      setLoader(false);
      setTimeFunc();
    } else if (res && res.response && res.response.code !== 200) {
      setLoader(false);
      setBackenderror(loginErrorMessage);
    }
  }, [res, loginErrorMessage]);

  useEffect(() => {
    setPopup(false);
  }, []);

  useEffect(() => {
    if (otpVerifiedRes?.res?.code === 200) {
      setPopup(false);
      dispatch(resetVerifyOtp());
      navigation("/adminDashboard");
      setLoader(false);
      setLoader2(false);
    } else if (
      otpVerifiedRes &&
      otpVerifiedRes.res &&
      otpVerifiedRes.res.response &&
      otpVerifiedRes.response?.code !== 200
    ) {
      showSnackAlert(
        "warning",
        otpErrorMessage
          ? otpErrorMessage
          : otpVerifiedRes?.res?.response?.data?.message
      );
      dispatch(resetVerifyOtp());
      setLoader(false);
      setLoader2(false);
    }
  }, [navigation, otpVerifiedRes, otpErrorMessage]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  useEffect(() => {
    time > 0 ? setPointer("default") : setPointer("pointer");
  }, [time]);

  //Internal function

  const otpChanges = (
    { target }: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = target;
    const otpArr: string[] = [...otp];
    otpArr[index] = value.substring(value.length - 1);
    if (!value) setActiveOtpIndex(index);
    else setActiveOtpIndex(index + 1);
    setOtp(otpArr);
  };

  const setTimeFunc = () => {
    setTime(Number(environment.otp_time_sec));
  };

  const otpKeyChanges = (
    { key }: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (key === "Backspace" && !otp[index]) setActiveOtpIndex(index - 1);
    else if (key === "Backspace") setActiveOtpIndex(index - 0);
  };

  const verifyOtpAdmin = (event: any) => {
    event.preventDefault();
    const verificationInfo = {
      txn_id: res?.data?.txn_id,
      otp: otp.join(""),
      state: {
        uniqueid: uniqueId,
        ondemandpage: "/adminDashboard",
      },
    };
    dispatch(verifyOtpAndCrtToken(verificationInfo));
  };

  const resendOtp = (event: any) => {
    event.preventDefault();
    dispatch(adminLogin(userCred));
    setLoader(true);
    setLoader3(false);
  };

  const handleClose = () => {
    setPopup(false);
  };

  const togglePassword = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  return (
    <>
      <Formik
        initialValues={{
          ...INITIAL_FORM_STATE,
        }}
        validationSchema={PATENT_FORM_VALIDATION}
        onSubmit={(values: any) => {
          const loginInfo = {
            authType: "credentials",
            authKey: values.email,
            pwd: values.password,
            state: {
              uniqueid: uniqueId,
              ondemandpage: "/adminDashboard",
            },
          };
          setLoader(true);
          loginInfo.pwd = encryptInput(loginInfo.pwd);
          dispatch(adminLogin(loginInfo));
          setUserCred(loginInfo);
          setTime(3000);
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
            <div className="page-wraper">
              <div
                className="page-content bg-white login-style2"
                style={{
                  backgroundImage: "url(" + loginbg + ")",
                  backgroundSize: "cover",
                }}
              >
                <div className="section-full mt-5">
                  <div className="container mt-2">
                    <div className="row">
                      <div className="col-lg-6 col-md-6 d-flex">
                        <div className="text-white align-self-center"></div>
                      </div>

                      <div className="col-lg-6 col-md-6 d-flex justify-content-around flex-wrap">
                        <div className="login-2 submit-resume p-a30 ">
                          <div className="nav">
                            <form
                              onSubmit={handleSubmit}
                              className="col-12 p-a0 "
                              autoComplete="off"
                            >
                              <div className="text-center">
                                <div className="logo rounded mx-auto d-block">
                                  <img src={logo2} alt="" />
                                  <p className="font-weight-600 mt-2">
                                    ADMINISTRATOR LOGIN
                                  </p>
                                </div>
                              </div>
                              {props.errorMessage && (
                                <div className="bg-red-300 text-red-900  p-1 my-2 ">
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
                                  style={{
                                    fontSize: "12px",
                                    marginTop: "-20px",
                                  }}
                                >
                                  {backenderror}
                                </p>
                              )}
                              <div className="form-group ">
                                <label className="font-weight-normal">
                                  Email Address
                                  <span className="text-danger">*</span>
                                </label>
                                <div className="input-group">
                                  <Field
                                    autoComplete="off"
                                    type="text"
                                    name="email"
                                    maxLength={150}
                                    className="form-control"
                                    placeholder="Enter your email address"
                                    value={values.email}
                                    onChange={(e: any) => {
                                      handleChange(e);
                                      setBackenderror("");
                                    }}
                                  />
                                </div>

                                {errors.email && touched.email ? (
                                  <p className="form-error">{errors.email}</p>
                                ) : null}
                              </div>
                              <div className="form-group">
                                <label className="font-weight-normal">
                                  Password
                                  <span className="text-danger">*</span>
                                </label>
                                <div className="input-group">
                                  <input
                                    autoComplete="off"
                                    type={passwordType}
                                    name="password"
                                    onBlur={handleBlur}
                                    onChange={(e: any) => {
                                      handleChange(e);
                                      setErr("");
                                    }}
                                    className="form-control"
                                    minLength={2}
                                    maxLength={16}
                                    placeholder="Enter your password"
                                  />
                                </div>
                                <div className="input-group">
                                  <span
                                    className="eye-btn-login eye custom-eye-btn-pos "
                                    onClick={togglePassword}
                                    style={{
                                      display: "block",
                                      zIndex: "99",
                                      position: "relative",
                                      left: "92%",
                                      marginTop: "-9%",
                                      marginBottom: "-10%",
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
                                  <p className="form-error">
                                    {errors.password}
                                  </p>
                                ) : null}
                              </div>
                              <div className="text-center ">
                                <button
                                  type="submit"
                                  className="site-button float-center w-100"
                                  disabled={loader}
                                >
                                  {loader && (
                                    <i
                                      className="fa fa-circle-o-notch fa-spin"
                                      style={{
                                        marginRight: "10px",
                                      }}
                                    ></i>
                                  )}
                                  {loader ? "Logging in..." : "Login"}
                                </button>
                                {err && <p className="form-error">{err}</p>}
                              </div>

                              <div
                                className="text-center mt-4 "
                                style={{
                                  display: "none",
                                }}
                              >
                                <Link
                                  to="/adminForgotPassword"
                                  className="site-button-link"
                                  style={{
                                    fontSize: "14px",
                                  }}
                                >
                                  Forgot Password ?
                                </Link>
                              </div>

                              <div
                                style={{
                                  fontSize: "12px",
                                  paddingTop: ".5rem",
                                }}
                              >
                                <center>
                                  {" "}
                                  © Copyright by{" "}
                                  <Link
                                    target="_blank"
                                    to={COMPANY_DETAILS.companyUrl}
                                  >
                                    {COMPANY_DETAILS.companyName}{" "}
                                  </Link>{" "}
                                  - All rights reserved.
                                </center>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {
                <Modal show={popup} className="modal fade modal-bx-info editor">
                  <div
                    className="modal-dialog my-0  mx-0 w-100 "
                    role="document"
                  >
                    <div className="modal-content">
                      <div className="modal-body">
                        <div>
                          <div
                            style={{
                              borderBottom: "1px solid #e9ecef",
                              paddingBottom: "18px",
                              marginBottom: "10px",
                            }}
                          >
                            <h6
                              style={{
                                textAlign: "center",
                                color: "#0070a6",
                                fontFamily: "Montserrat",
                                display: "contents",
                              }}
                            >
                              VERIFY MOBILE NUMBER
                            </h6>{" "}
                            <button
                              className="close"
                              style={{
                                float: "right",
                              }}
                              onClick={handleClose}
                            >
                              <i
                                className="fa fa-times model-close"
                                onClick={() => setOtp(new Array(6).fill(""))}
                              ></i>
                            </button>
                          </div>
                          <center>
                            <span
                              style={{
                                fontFamily: "Montserrat",
                              }}
                            >
                              Enter OTP sent to your mobile number
                            </span>{" "}
                            <br></br> <span>{res?.data?.maskedTo}</span>{" "}
                            {mins > 9 && secs > 9 && (
                              <p
                                style={{
                                  fontSize: "13px",
                                }}
                              >
                                OTP will expire in{" "}
                                <span className="badge badge-pill badge-info">
                                  {mins}:{secs}
                                </span>{" "}
                                mins
                              </p>
                            )}
                            {mins < 10 && secs > 9 && (
                              <p
                                style={{
                                  fontSize: "13px",
                                }}
                              >
                                OTP will expire in{" "}
                                <span className="badge badge-pill badge-info">
                                  0{mins}:{secs}
                                </span>{" "}
                                mins
                              </p>
                            )}
                            {mins > 9 && secs < 10 && (
                              <p
                                style={{
                                  fontSize: "13px",
                                }}
                              >
                                OTP will expire in{" "}
                                <span className="badge badge-pill badge-info">
                                  {mins}:0
                                  {secs}
                                </span>{" "}
                                min
                              </p>
                            )}
                            {mins < 10 && secs < 10 && (
                              <p
                                style={{
                                  fontSize: "13px",
                                }}
                              >
                                OTP will expire in{" "}
                                <span className="badge badge-pill badge-info">
                                  0{mins}
                                  :0{secs}
                                </span>{" "}
                                mins
                              </p>
                            )}{" "}
                            {otp.map((_, idx) => (
                              <input
                                type="text"
                                style={{
                                  width: "8%",
                                  height: "40px",
                                  textAlign: "center",
                                  marginRight: "3px",
                                }}
                                placeholder="_"
                                maxLength={1}
                                minLength={1}
                                ref={idx === activeOtpIndex ? inputRef : null}
                                onChange={(e) => {
                                  if (regex.numberRegx.test(e.target.value)) {
                                    otpChanges(e, idx);
                                  }
                                }}
                                value={otp[idx]}
                                onKeyDown={(e) => otpKeyChanges(e, idx)}
                              />
                            ))}
                            <br></br> <br></br>
                            {otp.join("").length === 6 && time !== 0 && (
                              <button
                                type="button"
                                className="site-button border border-primary btn-sm"
                                disabled={
                                  otp.join("").length === 6 ? false : true
                                }
                                style={{
                                  cursor: "pointer",
                                  background: "white",
                                  color: "#2e55fa",
                                  borderColor: "#2e55fa",
                                }}
                                onClick={(e: any) => {
                                  verifyOtpAdmin(e);
                                  setLoader2(true);
                                  setOtp(new Array(6).fill(""));
                                }}
                              >
                                {" "}
                                {loader2 && (
                                  <i
                                    className="fa fa-circle-o-notch fa-spin"
                                    style={{
                                      marginRight: "10px",
                                    }}
                                  ></i>
                                )}
                                {loader2 ? "VERIFYING OTP" : "VERIFY OTP"}
                              </button>
                            )}
                            &nbsp;
                            {time == 0 && (
                              <button
                                type="button"
                                className="site-button border border-primary btn-sm"
                                style={{
                                  background: "white",
                                  color: "#2e55fa",
                                  borderColor: "#2e55fa",
                                  cursor: `${pointer}`,
                                }}
                                onClick={(e: any) => {
                                  setLoader3(true);
                                  resendOtp(e);
                                }}
                              >
                                {" "}
                                {loader3 && (
                                  <i
                                    className="fa fa-circle-o-notch fa-spin"
                                    style={{
                                      marginRight: "10px",
                                    }}
                                  ></i>
                                )}
                                {loader3 ? "RESENDING OTP" : "RESEND OTP"}
                              </button>
                            )}
                          </center>
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal>
              }
            </div>
          );
        }}
      </Formik>
    </>
  );
}

export default AdminLogin;
