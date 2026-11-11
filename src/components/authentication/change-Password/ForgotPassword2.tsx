import { Formik } from "formik";
import * as Yup from "yup";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../assets/customCss/ForgotPassword.css";
import { useDispatch, useSelector } from "react-redux";
import {
  forgetPwd,
  forgetPwdActionCreator,
} from "../../../redux/features/authentication/resetPasswordSlice";
import {
  resetForgetPwdState,
  resetVerifyPwdState,
  verifyForgetPwdOtp,
} from "../../../redux/features/authentication/verifyOtpSlice";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import { Modal } from "react-bootstrap";
import { environment } from "../../../environments/environment";
import { values } from "lodash";
import { margin } from "@mui/system";
import { regex } from "../../../common/validation";
// let bnr = require("../../../assets/images/common/empLogin.png");
let logo = require("../../../assets/images/Techkri-logo-blue.png");

let bnr = require("../../../assets/images/common/forgotPass.png");

function ForgotPassword() {
  let navigate = useNavigate(),
    [displayname, SetDisplayname] = useState("Email Address"),
    [email, setEmail] = useState(""),
    [mobNo, setMobNo] = useState(""),
    [disInput, setDispInput] = useState(true),
    showSnackAlert = UseToastAlert(),
    [verifyLoader, setVerifyLoader] = useState(false),
    [otpErr, setOtpErr] = useState(""),
    [time, setTime] = useState(0),
    [loader3, setLoader3] = useState(false),
    [otp, setOtp] = useState(new Array(6).fill("")),
    [mins, setMins] = useState(0),
    [secs, setSecs] = useState(0),
    [activeOtpIndex, setActiveOtpIndex] = useState(0),
    [disEmailpopup, setDiaEmailPopup] = useState(false),
    [pointer, setPointer] = useState("pointer"),
    [err, setErr] = useState(""),
    inputRef = useRef<HTMLInputElement>(null),
    [txtId, setTxtId] = useState(""),
    [goLoader, setGoLoader] = useState(false),
    otpChanges = ({ target }: ChangeEvent<HTMLInputElement>, index: number) => {
      const { value } = target;
      const otpArr: string[] = [...otp];
      otpArr[index] = value.substring(value.length - 1);
      if (!value) setActiveOtpIndex(index);
      else setActiveOtpIndex(index + 1);
      setOtp(otpArr);
    },
    otpKeyChanges = (
      { key }: React.KeyboardEvent<HTMLInputElement>,
      index: number
    ) => {
      if (key === "Backspace" && !otp[index]) setActiveOtpIndex(index - 1);
      else if (key === "Backspace") setActiveOtpIndex(index - 0);
    },
    dispatch = useDispatch(),
    forgetPassword = useSelector((state: any) => state.forgetPwd),
    verifyForgetPassword = useSelector(
      (state: any) => state.verifyForgetPwdOtp
    ),
    { forgetPass } = forgetPassword;

  const [, setReg] = useState<any>(regex.email);

  const INITIAL_MAIL_STATE: any = {
    MobileNumber: "",
    commInfo: "",
    radiobtn: "true",
  };

  const verifyOtp = async () => {
    const Otp = Number(
      `${otp[0]}${otp[1]}${otp[2]}${otp[3]}${otp[4]}${otp[5]}`
    );
    const authType = displayname === "Email Address" ? "email" : "sms";
    let to: any;
    if (displayname === "Email Address") {
      to = email;
    } else {
      to = `+91${mobNo}`;
    }
    const options = {
      to,
      txn_id: txtId,
      otp: Otp,
      authType,
    };
    dispatch(verifyForgetPwdOtp(options));
  };

  const MAIL_FORM_VALIDATION = Yup.object().shape({
    radiobtn: Yup.boolean(),
    MobileNumber: Yup.string().when("radiobtn", {
      is: false,
      then: Yup.string()
        .required("Please enter Mobile Number.")
        .matches(regex.indian_mobile, "Please enter valid Mobile Number."),
    }),
    commInfo: Yup.string().when("radiobtn", {
      is: true,
      then: Yup.string()
        .required("Please enter Email Address.")
        .matches(regex.email, "Please specify valid Email Address."),
    }),
  });

  const setTimeFunc = () => {
    setTime(Number(environment.otp_time_sec));
  };
  useEffect(() => {
    if (disEmailpopup) {
      const timer: any = time > 0 && setInterval(() => setTime(time - 1), 1000);
      setMins(Math.floor(time / 60));
      setSecs(time % 60);
      return () => clearInterval(timer);
    }
  }, [disEmailpopup, time]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  useEffect(() => {
    if (forgetPass && forgetPass.code === 200) {
      setGoLoader(false);
      setTxtId(forgetPass.data.txn_id);
      dispatch(forgetPwdActionCreator());
      showSnackAlert("success", `OTP sent successfully`);
      setLoader3(false);
      setDiaEmailPopup(true);
      setTimeFunc();
    } else if (
      forgetPass &&
      forgetPass.response &&
      forgetPass.response.status &&
      forgetPass.response.status !== 200
    ) {
      dispatch(resetForgetPwdState());
      setGoLoader(false);
      setLoader3(false);
      setErr(forgetPass?.response?.data?.message);
      dispatch(forgetPwdActionCreator());
    }
  }, [
    dispatch,
    forgetPass,
    forgetPass.code,
    err,
    forgetPass.response?.data?.message,
    txtId,
    goLoader,
  ]);
  const sendOtp_resend = () => {
    let options: any;
    if (displayname === "Email Address") {
      options = {
        to: email,
        authType: "email",
      };
    } else {
      options = {
        to: `+91${mobNo}`,
        authType: "sms",
      };
    }

    dispatch(forgetPwd(options));
  };
  useEffect(() => {
    time > 0 ? setPointer("default") : setPointer("pointer");
  }, [time]);

  useEffect(() => {
    if (
      verifyForgetPassword &&
      verifyForgetPassword.res &&
      verifyForgetPassword.res.code &&
      verifyForgetPassword.res.code === 200
    ) {
      setVerifyLoader(false);
      navigate({
        pathname: "/employerverifications",
        search: `?id=${verifyForgetPassword.res.data}`,
      });
      dispatch(resetVerifyPwdState());
    } else if (
      verifyForgetPassword &&
      verifyForgetPassword.res &&
      verifyForgetPassword.res.response &&
      verifyForgetPassword.res.response.status === 400
    ) {
      setVerifyLoader(false);
      setOtpErr(verifyForgetPassword.res.response.data.message);
    }
  }, [dispatch, navigate, verifyForgetPassword, verifyForgetPassword.res]);

  let randomString = (Math.random() + 1).toString(36).substring(7);
  function ssoHandler(authType: string) {
    let state;
    switch (authType) {
      case "google":
        state = "google";
        const url = `https://accounts.google.com/o/oauth2/v2/auth?scope=${environment.googleSso.scope}&access_type=offline&include_granted_scopes=true&response_type=code&state=${state}&redirect_uri=${environment.runwayUrl}&client_id=${environment.googleSso.client_id}`;
        window.location.href = url;
        break;
      case "linkedin":
        state = "linkedin";
        const linkedinUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${environment.linkedInSso.client_id}&redirect_uri=${environment.runwayUrl}&state=${state}&scope=${environment.linkedInSso.scope}`;
        window.location.href = linkedinUrl;
        break;

      case "facebook":
        state = "facebook";
        const facebookUrl = `https://www.facebook.com/v16.0/dialog/oauth?client_id=${environment.faceBookSso.client_id}&redirect_uri=${environment.runwayUrl}&display=popup&response_type=code&scope=public_profile,email&state=${state}`;
        window.location.href = facebookUrl;
        break;
      case "twitter":
        state = { authType: authType, code_challenge: randomString };
        const stateData = btoa(JSON.stringify(state));
        const twitterUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${environment.twitterSso.client_id}&redirect_uri=${environment.runwayUrl}&scope=tweet.read%20users.read&state=${stateData}&code_challenge=${randomString}&code_challenge_method=plain`;
        window.location.href = twitterUrl;
        break;
      default:
        break;
    }
  }

  return (
    <>
      <div className="browse-job mainDiv">
        <div className="container">
          <div className="loginDiv">
            <div className="row divHeight">
              <div className="col-md-7 col-lg-7 col-sm-12 forgotPassDiv">
                <div>
                  <h4 style={{ color: "#004aad" }}>Forgot Password</h4>
                  <div className="d-flex justify-content-around">
                    <img src={bnr} style={{ width: "50%" }}></img>
                  </div>
                  <div>
                    <div className="" style={{ color: "#4e4f50" }}>
                      <h5>Jobseeker in Job Portal?</h5>
                    </div>
                    <p style={{ fontSize: "13px", color: "#4e4f50" }}>
                      Sign in now to get your own personalized account.
                    </p>
                    <ul className="list-inline m-a0">
                      <li
                        onClick={(e: any) => {
                          ssoHandler("facebook");
                        }}
                      >
                        <div
                          className="site-button  facebook circle m-r10 "
                          title="Log in with Facebook."
                        >
                          <i className="fa fa-facebook fa-lg"></i>
                        </div>
                      </li>
                      <li
                        onClick={(e: any) => {
                          ssoHandler("google");
                        }}
                      >
                        <div
                          className="site-button  google-plus circle m-r10"
                          title="Log in with Google."
                        >
                          <i
                            className="fa fa-google fa-lg"
                            aria-hidden="true"
                          ></i>
                        </div>
                      </li>
                      <li
                        onClick={(e: any) => {
                          ssoHandler("linkedin");
                        }}
                      >
                        <div
                          className="site-button  linkedin circle m-r10"
                          title="Log in with LinkedIn."
                        >
                          <i className="fa fa-linkedin fa-lg"></i>
                        </div>
                      </li>
                      <li
                        onClick={() => {
                          ssoHandler("twitter");
                        }}
                      >
                        <div
                          className="site-button  twitter circle m-r10 "
                          title="Log in with Twitter."
                        >
                          <i className="fa fa-twitter fa-lg"></i>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-5 col-lg-5 col-sm-12 loginDivChild2">
                <Link to={"/home"} title="Go to home page.">
                  <div
                    className="d-flex justify-content-center"
                    style={{ margin: "7% 0" }}
                  >
                    <img src={logo} style={{ width: "50%" }} />
                  </div>
                </Link>

                <div className="forgotHead">
                  <h6>Forgot Password</h6>
                </div>
                <form
                  id="login"
                  className="tab-pane active P_commonform"
                  autoComplete="off"
                >
                  {err && (
                    <p className="form-error text-center text-break">{err}</p>
                  )}
                  <Formik
                    initialValues={{
                      ...INITIAL_MAIL_STATE,
                    }}
                    validationSchema={MAIL_FORM_VALIDATION}
                    onSubmit={(values) => {
                      if (disInput) {
                        setGoLoader(false);
                        const options: any = {
                          to: values.commInfo,
                          authType: "email",
                        };
                        dispatch(forgetPwd(options));
                        setGoLoader(true);
                      } else {
                        setGoLoader(false);
                        const options: any = {
                          to: `+91${values.MobileNumber}`,
                          authType: "sms",
                        };
                        dispatch(forgetPwd(options));
                        setGoLoader(true);
                      }
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
                        <div className="form-group">
                          {disInput && (
                            <>
                              <label className="font-weight-700">
                                {displayname}
                                <span className="maditory">*</span>
                              </label>
                              <input
                                maxLength={150}
                                name="commInfo"
                                className="form-control"
                                placeholder={`Enter ${displayname}`}
                                type="text"
                                onChange={(e: any) => {
                                  handleChange(e);
                                  setErr("");
                                  setEmail(e.target.value);
                                }}
                                // onBlur={(e) => {
                                //   setEmail(e.target.value);``
                                // }}
                                onBlur={handleBlur}
                                value={values.commInfo}
                              />
                              {errors.commInfo && touched.commInfo && (
                                <p className="form-error">{errors.commInfo}</p>
                              )}
                              <button
                                type="button"
                                disabled={goLoader}
                                className="site-button float-center w-100 positive-Btn mt-4"
                                // className="FP_gobtn FP_btns site-button float-right"
                                onClick={() => {
                                  handleSubmit(values, errors);
                                }}
                              >
                                <center>
                                  {goLoader && (
                                    <i
                                      className="fa fa-circle-o-notch fa-spin"
                                      // style={{ marginRight: "10px" }}
                                    ></i>
                                  )}
                                  {!goLoader ? "Go" : ""}
                                </center>
                              </button>
                            </>
                          )}
                          {!disInput && (
                            <>
                              <label className="font-weight-700">
                                {displayname}
                                <span className="maditory">*</span>
                              </label>
                              <input
                                name="MobileNumber"
                                id="phonenums"
                                className="form-control w-100"
                                placeholder="Enter Mobile Number"
                                onInput={(e: any) => {
                                  e.target.value = e.target.value.slice(0, 10);
                                }}
                                type={"number"}
                                onBlur={handleBlur}
                                onChange={(e) => {
                                  handleChange(e);
                                  setMobNo(e.target.value);
                                  setErr("");
                                }}
                                value={values.MobileNumber}
                              />
                              <button
                                type="button"
                                disabled={goLoader}
                                className="FP_gobtn FP_btns site-button float-right"
                                onClick={() => {
                                  handleSubmit(values, errors);
                                }}
                              >
                                {goLoader && (
                                  <i className="fa fa-circle-o-notch fa-spin"></i>
                                )}
                                {!goLoader ? "Go" : ""}
                              </button>
                              {errors.MobileNumber && touched.MobileNumber && (
                                <p className="form-error">
                                  {errors.MobileNumber}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      );
                    }}
                  </Formik>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {disEmailpopup && (
        <Modal show={disEmailpopup} className="modal fade modal-bx-info editor">
          <div className="modal-dialog my-0  mx-0 w-100 " role="document">
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
                      {displayname === "Email Address"
                        ? "VERIFY EMAIL ADDRESS"
                        : "VERIFY MOBILE NUMBER"}
                    </h6>{" "}
                    <button
                      className="close"
                      style={{ float: "right" }}
                      onClick={() => {
                        setDiaEmailPopup(false);
                        setOtpErr("");
                      }}
                    >
                      <i
                        className="fa fa-times model-close"
                        onClick={() => setOtp(new Array(6).fill(""))}
                      ></i>
                    </button>
                  </div>
                  <center>
                    <span
                      style={{ fontFamily: "Montserrat" }}
                    >{`Enter OTP sent to ${displayname}. `}</span>
                    <br></br>
                    <span style={{ display: "none" }}>
                      {displayname === "Email Address" ? email : mobNo}
                      <i
                        style={{
                          color: "#14377c",
                          cursor: "pointer",
                        }}
                        className="fa fa-light fa-pencil"
                        onClick={() => {
                          setDiaEmailPopup(false);
                          setOtp(new Array(6).fill(""));
                          setOtpErr("");
                          setVerifyLoader(false);
                        }}
                      ></i>
                    </span>
                    {mins > 9 && secs > 9 && (
                      <p style={{ fontSize: "14px" }}>
                        OTP will expire in{" "}
                        <span className="badge badge-pill badge-info">
                          {mins}:{secs}
                        </span>{" "}
                        mins
                      </p>
                    )}
                    {mins < 10 && secs > 9 && (
                      <p style={{ fontSize: "14px" }}>
                        OTP will expire in{" "}
                        <span className="badge badge-pill badge-info">
                          0{mins}:{secs}
                        </span>{" "}
                        mins
                      </p>
                    )}
                    {mins > 9 && secs < 10 && (
                      <p style={{ fontSize: "14px" }}>
                        OTP will expire in{" "}
                        <span className="badge badge-pill badge-info">
                          {mins}:0{secs}
                        </span>{" "}
                        mins
                      </p>
                    )}
                    {mins < 10 && secs < 10 && (
                      <p style={{ fontSize: "14px" }}>
                        OTP will expire in{" "}
                        <span className="badge badge-pill badge-info">
                          0{mins}:0{secs}
                        </span>{" "}
                        mins{" "}
                      </p>
                    )}
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
                          regex.numberTyping.test(e.target.value) &&
                            otpChanges(e, idx);
                          setOtpErr("");
                        }}
                        value={otp[idx]}
                        onKeyDown={(e) => otpKeyChanges(e, idx)}
                      />
                    ))}
                    <br />
                    {
                      <span style={{ color: "red", fontSize: "13px" }}>
                        {otpErr}
                      </span>
                    }
                    <br></br>
                    <br></br>
                    <div style={{ marginTop: "-17px", marginBottom: "13px" }}>
                      {otp.join("").length === 6 && time !== 0 && (
                        <button
                          type="button"
                          className="site-button border border-primary btn-sm"
                          style={{
                            background: "white",
                            color: "#2e55fa",
                            borderColor: "#2e55fa",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setVerifyLoader(true);
                            verifyOtp();
                          }}
                        >
                          {verifyLoader && (
                            <i
                              className="fa fa-circle-o-notch fa-spin"
                              style={{ marginRight: "10px" }}
                            ></i>
                          )}
                          {verifyLoader ? "VERIFYING OTP" : "VERIFY OTP"}
                        </button>
                      )}
                      &nbsp;
                      {time === 0 && (
                        <button
                          type="button"
                          className="site-button border border-primary btn-sm"
                          style={{
                            background: "white",
                            color: "#2e55fa",
                            borderColor: "#2e55fa",
                            cursor: `${pointer}`,
                          }}
                          disabled={time > 0}
                          onClick={() => {
                            setLoader3(true);
                            sendOtp_resend();
                            setTime(Number(environment.otp_time_sec));
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
                    </div>
                  </center>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default ForgotPassword;
