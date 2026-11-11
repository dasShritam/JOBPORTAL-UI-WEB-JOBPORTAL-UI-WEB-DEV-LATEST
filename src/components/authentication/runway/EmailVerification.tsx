import { ChangeEvent, useEffect, useRef, useState } from "react";
import React from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  JobSeekerSendOtp,
  JobSeekerVerifyOtpEmail,
  resetOtpActionCreator,
  resetSendEmailCreator,
} from "../../../redux/features/authentication/jobSeekerVerifyEmail";
import { regex } from "../../../common/validation";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import { InitializeSocket } from "../../../context/WebsocketContext";

const EmailVerification = () => {
  const [verifyemail, setVerifyemail] = useState(false),
    [email, setEmail] = useState(""),
    [pointer, setPointer] = useState("pointer"),
    [emailErr1, setEmailErr1] = useState(false),
    [emailver, setEmailver] = useState(true),
    jobSeekerReg = useSelector((state: any) => state.jobSeekerRegister),
    [loader, setLoader] = useState(false),
    [loader2, setLoader2] = useState(false),
    [loader3, setLoader3] = useState(false),
    sid = Math.floor(Math.random() * 0xffffff * 1000000).toString(16),
    navigate = useNavigate(),
    [otp, setOtp] = useState(new Array(6).fill("")),
    inputRef = useRef<HTMLInputElement>(null),
    [mins, setMins] = useState(0),
    [secs, setSecs] = useState(0),
    [time, setTime] = useState(0),
    [activeOtpIndex, setActiveOtpIndex] = useState(0),
    [err, setErr] = useState(""),
    [txtId, setTxtId] = useState(""),
    dispatch = useDispatch(),
    emailRegex = regex.email,
    jobSeekerSendEmail = useSelector((state: any) => state.jobSeekerSendEmail),
    jobSeekerVerifyOtp = useSelector((state: any) => state.jobSeekerVerifyOtp);

  const sendOtp = () => {
    if (!emailRegex.test(email)) {
      setEmailErr1(true);
      setLoader(false);
    } else if (email === "") {
      setEmailErr1(true);
    } else {
      sendOtp_resend();
    }
  };
  const sendOtp_resend = async () => {
    const sendOtpInfo = {
      to: email,
      channel: "email",
    };
    dispatch(JobSeekerSendOtp(sendOtpInfo));
  };
  const showSnackAlert = UseToastAlert();

  useEffect(() => {
    if (jobSeekerSendEmail?.sendOtpRes?.code === 200) {
      setEmailErr1(false);
      setEmailver(false);
      setVerifyemail(true);
      setTime(Number(jobSeekerSendEmail?.sendOtpRes?.data?.validityInMin) * 60);
      setLoader(false);
      setLoader3(false);
      dispatch(resetSendEmailCreator());
      setTxtId(jobSeekerSendEmail.sendOtpRes.data.txn_id);
    } else if (jobSeekerSendEmail?.sendOtpRes?.response?.data?.code === 500) {
      showSnackAlert("warning", jobSeekerSendEmail?.sendOtpRes?.response?.data?.message);
      setLoader(false);
    }
    if (
      jobSeekerVerifyOtp &&
      jobSeekerVerifyOtp.verifyOtpRes &&
      jobSeekerVerifyOtp.verifyOtpRes.code &&
      jobSeekerVerifyOtp.verifyOtpRes.code === 200
    ) {
      InitializeSocket(jobSeekerVerifyOtp.verifyOtpRes.data.access_token);
      sessionStorage.setItem("access_token", jobSeekerVerifyOtp.verifyOtpRes.data.access_token);
      sessionStorage.setItem("refresh_token", jobSeekerVerifyOtp.verifyOtpRes.data.refresh_token);
      sessionStorage.setItem("exp", jobSeekerVerifyOtp.verifyOtpRes.data.exp);
      navigate("/jobseekerprofile");
    } else if (
      jobSeekerVerifyOtp &&
      jobSeekerVerifyOtp.verifyOtpRes &&
      jobSeekerVerifyOtp.verifyOtpRes.response &&
      jobSeekerVerifyOtp.verifyOtpRes.response.status &&
      jobSeekerVerifyOtp.verifyOtpRes.response.status === 400
    ) {
      setErr(jobSeekerVerifyOtp.verifyOtpRes.response.data.message);
      setLoader2(false);
      // dispatch(resetOtpActionCreator());
      setOtp(new Array(6).fill(""));
    }
  }, [jobSeekerSendEmail, jobSeekerVerifyOtp, err]);

  const verifyOtp = async () => {
    try {
      setErr("");
      let token;
      if (jobSeekerReg.res && jobSeekerReg.res.code === 206) {
        token = jobSeekerReg.res.data.token;
      }
      const Otp = Number(`${otp[0]}${otp[1]}${otp[2]}${otp[3]}${otp[4]}${otp[5]}`);
      // const otp = Number(`${input1}${input2}${input3}${input4}${input5}${input6}`);
      const verifyOtpInfo = {
        token,
        otp: Otp,
        email,
        txn_id: txtId,
        state: {
          ondemandpage: "http://localhost:4200/",
          uniqueid: sid,
        },
      };
      dispatch(JobSeekerVerifyOtpEmail(verifyOtpInfo));
    } catch (error: any) {}
  };

  const otpChanges = ({ target }: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = target;
    const otpArr: string[] = [...otp];
    otpArr[index] = value.substring(value.length - 1);
    if (!value) setActiveOtpIndex(index);
    else setActiveOtpIndex(index + 1);
    setOtp(otpArr);
  };
  const otpKeyChanges = ({ key }: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (key === "Backspace" && !otp[index]) setActiveOtpIndex(index - 1);
    else if (key === "Backspace") setActiveOtpIndex(index - 0);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  useEffect(() => {
    if (verifyemail) {
      const timer: any = time > 0 && setInterval(() => setTime(time - 1), 1000);
      setMins(Math.floor(time / 60));
      setSecs(time % 60);
      return () => clearInterval(timer);
    }
  }, [verifyemail, time]);

  return (
    <div>
      <Modal show={emailver} className="modal fade modal-bx-info editor">
        <div className="modal-dialog my-0  mx-0 w-100 " role="document">
          <div className="modal-content">
            <div className="modal-body">
              <div>
                <h5 style={{ textAlign: "center" }}>EMAIL VERIFICATION</h5>
                <div style={{ textAlign: "center" }}>
                  <i
                    className="fa fa-duotone fa-envelope"
                    style={{
                      fontSize: "64px",
                      color: "rgb(63, 81, 181)",
                      width: "67px",
                      textAlign: "center",
                    }}
                  ></i>
                </div>

                <h6
                  style={{
                    textAlign: "center",
                    color: "#0070a6",
                    fontFamily: "Montserrat",
                  }}
                >
                  VERIFY EMAIL
                </h6>
                <center>
                  <p style={{ fontFamily: "Montserrat" }}>
                    No email address is associated with selected account,
                    <br /> please verify email to complete account setup!
                  </p>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Email Id"
                    maxLength={30}
                    style={{ width: "50%" }}
                    defaultValue={email}
                    onChange={(e) => {
                      e.target.value === "" ? setEmailErr1(true) : setEmailErr1(false);
                      setEmail(e.target.value);
                      setEmailErr1(false);
                    }}
                  />
                  {emailErr1 && email && <p className="error">Invalid Email</p>}
                  <br></br>
                  <button
                    type="button"
                    disabled={loader}
                    className="site-button border border-primary btn-sm"
                    style={{
                      cursor: "pointer",
                      background: "white",
                      color: "#2e55fa",
                      borderColor: "#2e55fa",
                    }}
                    onClick={() => {
                      setLoader(true);
                      sendOtp();
                    }}
                  >
                    {loader && <i className="fa fa-circle-o-notch fa-spin" style={{ marginRight: "10px" }}></i>}
                    {loader ? "Sending OTP" : "SEND OTP"}
                  </button>{" "}
                  &nbsp;
                  <button
                    className="site-button border border-primary btn-sm"
                    style={{
                      cursor: "pointer",
                      background: "white",
                      color: "#2e55fa",
                      borderColor: "#2e55fa",
                    }}
                    onClick={() => {
                      setEmailver(false);
                    }}
                  >
                    Close
                  </button>
                </center>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal show={verifyemail} className="modal fade modal-bx-info editor">
        <div className="modal-dialog my-0  mx-0 w-100 " role="document">
          <div className="modal-content">
            <div className="modal-body">
              <div>
                <h6
                  style={{
                    textAlign: "center",
                    color: "#0070a6",
                    fontFamily: "Montserrat",
                  }}
                >
                  VERIFY EMAIL
                </h6>
                <center>
                  <span style={{ fontFamily: "Montserrat" }}>Enter OTP sent to your email address</span>
                  <br></br>
                  <span>
                    {email}{" "}
                    <i
                      style={{
                        color: "#14377c",
                        cursor: "pointer",
                      }}
                      className="fa fa-light fa-pencil"
                      onClick={() => {
                        setEmailver(true);
                        setVerifyemail(false);
                        setLoader(false);
                        setOtp(new Array(6).fill(""));
                        setLoader2(false);
                        setErr("");
                      }}
                    ></i>
                  </span>
                  {mins > 9 && secs > 9 && (
                    <p style={{ fontSize: "10px" }}>
                      OTP will expire in{" "}
                      <span className="badge badge-pill badge-info">
                        {mins}:{secs}
                      </span>{" "}
                      mins
                    </p>
                  )}
                  {mins < 10 && secs > 9 && (
                    <p style={{ fontSize: "10px" }}>
                      OTP will expire in{" "}
                      <span className="badge badge-pill badge-info">
                        0{mins}:{secs}
                      </span>{" "}
                      mins
                    </p>
                  )}
                  {mins > 9 && secs < 10 && (
                    <p style={{ fontSize: "10px" }}>
                      OTP will expire in{" "}
                      <span className="badge badge-pill badge-info">
                        {mins}:0{secs}
                      </span>{" "}
                      mins
                    </p>
                  )}
                  {mins < 10 && secs < 10 && (
                    <p style={{ fontSize: "10px" }}>
                      OTP will expire in{" "}
                      <span className="badge badge-pill badge-info">
                        0{mins}:0{secs}
                      </span>{" "}
                      mins
                    </p>
                  )}
                  {verifyemail &&
                    otp.map((_, idx) => (
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
                        onChange={(e) => regex.numberTyping.test(e.target.value) && otpChanges(e, idx)}
                        value={otp[idx]}
                        onKeyDown={(e) => otpKeyChanges(e, idx)}
                      />
                    ))}
                  <br />
                  {<span style={{ color: "red", fontSize: "13px" }}>{err}</span>}
                  <br></br>
                  <br></br>
                  {/* <button
                    type="button"
                    className="site-button border border-primary btn-sm"
                    style={{
                      background: "white",
                      color: "#2e55fa",
                      borderColor: "#2e55fa",
                    }}
                    onClick={verifyOtp}
                  >
                    VERIFY OTP
                  </button> */}
                  {otp.join("").length === 6 && (
                    <button
                      type="button"
                      className="site-button border border-primary btn-sm"
                      disabled={loader2}
                      style={{
                        background: "white",
                        color: "#2e55fa",
                        borderColor: "#2e55fa",
                        cursor: `${pointer}`,
                      }}
                      onClick={() => {
                        setLoader2(true);
                        verifyOtp();
                      }}
                    >
                      {loader2 && <i className="fa fa-circle-o-notch fa-spin" style={{ marginRight: "10px" }}></i>}
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
                      // disabled={time > 0}
                      onClick={() => {
                        sendOtp_resend();
                        setTime(Number(jobSeekerSendEmail?.sendOtpRes?.data?.validityInMin) * 60);
                        setLoader3(true);
                      }}
                    >
                      {loader3 && <i className="fa fa-circle-o-notch fa-spin" style={{ marginRight: "10px" }}></i>}
                      {loader3 ? "RESENDING OTP" : "RESEND OTP"}
                    </button>
                  )}
                </center>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EmailVerification;
