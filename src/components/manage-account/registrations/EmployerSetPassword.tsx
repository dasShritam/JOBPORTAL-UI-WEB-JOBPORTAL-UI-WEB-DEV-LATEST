import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import * as Forge from "node-forge";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { patchEmpMailVeify } from "../../../redux/features/authentication/employerMailVerifySlice";
import {
  patchEmpDeclare,
  resetDeclareActionCreator,
} from "../../../redux/features/authentication/employerDeclareSclice";
import {
  patchEmpSetPwd,
  resetSetPwdActionCreator,
} from "../../../redux/features/authentication/employerSetPwdSlice";
import { UseToastAlert } from "../../../hooks/useToastAlert";

import { verifyOtp } from "../../../redux/features/authentication/verifyOtpSlice";
import jwtDecode from "jwt-decode";
import React from "react";
import Swal from "sweetalert2";
import { optLogin } from "../../../redux/features/authentication/LoginSlice";
import { environment } from "../../../environments/environment";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { regex } from "../../../common/validation";
import { RoleGroup } from "../../../routes/roles";
import { gettermsAndCondition } from "../../../redux/features/admin/support/TermsAndCondition";

let bnr = require("../../../assets/images/common/setPassword.png");
let logo = require("../../../assets/images/Techkri-logo-blue.png");

const INITIAL_FORM_STATE: any = {
    New_Password: "",
    Confirm_Password: "",
  },
  FORM_VALIDATION = Yup.object().shape({
    New_Password: Yup.string()
      .required("Please enter New Password.")
      .min(8, "Minimum new Password Count should be 8 characters.")
      .max(16, "Maximum new Password Count should be 16 characters.")
      .matches(
        regex.password,
        "Password should be 8 to 16 characters with at least one special characters (!@#$%^&*?), one numeric, one small case and one upper case letter (i.e. Abcd@123)."
      )
      .notOneOf(
        [Yup.ref("Old_Password"), null],
        "New Password cannot be same as Old Password!"
      ),
    Confirm_Password: Yup.string()
      .required("Please enter Confirm Password.")
      .min(8, "Minimum confirm Password count should be 8 characters.")
      .max(16, "Maximum confirm Password count should be 16 characters.")
      .oneOf(
        [Yup.ref("New_Password"), null],
        "Confirm password should be same as New Password!"
      ),
  });

function SetPassword() {
  const dispatch = useDispatch(),
    navigate = useNavigate(),
    [id] = useSearchParams(),
    [isTrue] = useSearchParams(),
    showSnackAlert = UseToastAlert(),
    isTrueValue = isTrue.get("isTrue"),
    inputRef = useRef<HTMLInputElement>(null),
    [togtypeNew, setTogtypeNew] = useState("password"),
    [togtypeCon, setTogtypeCon] = useState("password"),
    [otp, setOtp] = useState(new Array(6).fill("")),
    [time, setTime] = useState(0),
    [decpop, setdecpop] = useState(false),
    [activeOtpIndex, setActiveOtpIndex] = useState(0),
    [createbtn, setCreatebtn] = useState("site-button btn-sm"),
    [mins, setMins] = useState(0),
    [secs, setSecs] = useState(0),
    [verifynum, setVerifynum] = useState(false),
    [number, setNumber] = useState(""),
    [pointer, setPointer] = useState("pointer"),
    [mobilereg, setMobilereg] = useState(false),
    [donePwd, setDonePwd] = useState(false),
    [tokeData, setTokenData] = useState<any>(""),
    [loader2, setLoader2] = useState(false),
    [loader3, setLoader3] = useState(false),
    [visible, setVisible] = useState(false),
    [txnid, setTxnid] = useState(""),
    [masked, setMasked] = useState(""),
    // initialValue = { jobDesc: "" },
    [editValues, setEditValues] = useState<any>(""),
    [uniqueId] = useState(
      Math.floor(Math.random() * 0xffffff * 1000000).toString(16)
    ),
    sessionData = sessionStorage?.getItem("access_token")
      ? jwtDecode(sessionStorage?.getItem("access_token")!)
      : "";
  const otpLoginRes = useSelector((state: any) => state.otpLogin),
    { EmpMail, loadingM } = useSelector(
      (state: any) => state.employerMailVerify
    ),
    { EmpSetPwd, loadingP } = useSelector((state: any) => state.employerSetPwd),
    { EmpDeclare, loadingD } = useSelector(
      (state: any) => state.employerDeclare
    ),
    { res, loading } = useSelector((state: any) => state.verifyOtp);
  // { EmpResnd, loadingR, errorR } = useSelector(
  //   (state: any) => state.EmployerResendMail
  // );

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
    }),
    otpChanges = ({ target }: ChangeEvent<HTMLInputElement>, index: number) => {
      const { value } = target,
        otpArr: string[] = [...otp];
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
    setTimeFunc = () => {
      setTime(Number(environment?.otp_time_sec));
    },
    verifyOtps = () => {
      const Otp = Number(
          `${otp[0]}${otp[1]}${otp[2]}${otp[3]}${otp[4]}${otp[5]}`
        ),
        verificationInfo = {
          txn_id: txnid,
          otp: `${Otp}`,
          channel: "sms",
          to: `+91${
            EmpDeclare?.data?.mobile ? EmpDeclare?.data?.mobile : number
          }`,
        };

      dispatch(verifyOtp(verificationInfo));
      // setLoader2(false);
    },
    reSendOtp = () => {
      const data = {
        code: "+91",
        phNo: number,
      };
      dispatch(optLogin(data));
    },
    handleConfirmSwal = (values: any) => {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to set this as password!",
        showCancelButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "red",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.isConfirmed) {
          const rsa = Forge.pki.publicKeyFromPem(environment.publicKey),
            rsaEncrypted = window.btoa(rsa.encrypt(values.New_Password));
          let pwd = rsaEncrypted;
          dispatch(
            patchEmpSetPwd({
              empPassword: pwd,
              token: id.get("id"),
            })
          );
        }
      });
    };

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);
  useEffect(() => {
    if (verifynum) {
      const timer: any = time > 0 && setInterval(() => setTime(time - 1), 1000);
      setMins(Math.floor(time / 60));
      setSecs(time % 60);
      return () => clearInterval(timer);
    }
  }, [verifynum, time]);
  useEffect(() => {
    // if (
    //   EmpResnd &&
    //   EmpResnd.response &&
    //   EmpResnd.response.data.status !== 200
    // ) {
    //   showSnackAlert("warning", EmpResnd?.response?.data?.message);
    //   setLoader3(false);
    //   setVisible(true);
    // }
    if (
      EmpDeclare &&
      EmpDeclare.response &&
      EmpDeclare.response.data.status !== 200
    ) {
      showSnackAlert("warning", EmpDeclare?.response?.data?.message);
    }
    if (EmpMail && EmpMail.response && EmpMail.response.data.status !== 200) {
      setVisible(true);
      showSnackAlert("warning", EmpMail?.response?.data?.message);
    }
  }, [EmpDeclare, EmpMail]);
  useEffect(() => {
    time > 0 ? setPointer("default") : setPointer("pointer");
  }, [time]);
  useEffect(() => {
    setTokenData(sessionData);
    setVisible(true);
  }, [EmpMail]);
  const isSubmit = formik.values.termsAndConditions;
  useEffect(() => {
    if (isSubmit) {
      setCreatebtn("site-button btn-sm");
    } else {
      setCreatebtn("btn btn-secondary btn-sm");
    }
  }, [isSubmit]);
  useEffect(() => {
    dispatch(resetDeclareActionCreator());
    setdecpop(false);
    setVerifynum(false);
    setMobilereg(false);
    dispatch(patchEmpMailVeify(id.get("id")));
  }, []);
  useEffect(() => {
    if (loadingD === false && EmpDeclare.code === 200 && isTrueValue === "1") {
      setdecpop(false);
      setVerifynum(true);
      setTimeFunc();
    }
  }, [EmpDeclare]);
  useEffect(() => {
    if (
      EmpDeclare &&
      EmpDeclare?.code &&
      EmpDeclare?.code === 200 &&
      EmpDeclare?.data &&
      EmpDeclare?.data?.txn_id &&
      EmpDeclare?.data?.mobile &&
      EmpDeclare?.data?.masked_to
    ) {
      setTxnid(EmpDeclare?.data?.txn_id);
      setNumber(EmpDeclare?.data?.mobile);
      setMasked(EmpDeclare?.data?.masked_to);
    }
    if (res && res?.code && res?.code === 200 && res?.data)
      setTxnid(res?.data?.txn_id);
    if (
      otpLoginRes &&
      otpLoginRes?.res &&
      otpLoginRes?.res?.code &&
      otpLoginRes?.res?.code === 200 &&
      otpLoginRes?.res?.data &&
      otpLoginRes?.res?.data?.txn_id
    )
      setTxnid(otpLoginRes?.res?.data?.txn_id);
  }, [EmpDeclare, otpLoginRes, res]);
  useEffect(() => {
    if (loading === false && res.code === 200 && isTrueValue === "1") {
      setVerifynum(false);
      setdecpop(false);
      setMobilereg(true);
      setTime(0);
    }
    if (
      res &&
      res.response &&
      res.response?.data?.status !== 200 &&
      isTrueValue === "1"
    ) {
      showSnackAlert("warning", res?.response?.data?.message);
      setLoader2(false);
    }
  }, [res]);
  const enum types {
    TC = "TERMS_AND_CONDITIONS",
    PP = "PRIVACY_POLICY",
    CS = "DECLARATION",
  }
  const handleSetType = (input) => {
    const modal = {
      type: input == "CS" ? types.CS : types.CS,
    };
    setEditValues("");
    dispatch(gettermsAndCondition(modal));
  };
  useEffect(() => {
    if (loadingP === false && EmpSetPwd.code === 200 && isTrueValue === "1") {
      setdecpop(true);
      handleSetType("CS");
    } else if (loadingP === false && EmpSetPwd.code === 200) {
      setDonePwd(true);
    }
  }, [EmpSetPwd]);
  useEffect(() => {
    if (
      otpLoginRes &&
      otpLoginRes.res &&
      otpLoginRes.res.response &&
      otpLoginRes.res.response.data &&
      otpLoginRes.res.response.data.code !== 200
    ) {
      showSnackAlert("warning", otpLoginRes?.res?.response?.data?.message);
      setLoader2(false);
      setOtp(new Array(6).fill(""));
    } else if (otpLoginRes && otpLoginRes.res && otpLoginRes.res.code === 200) {
      showSnackAlert("success", "OTP Sent Successfully");
      setLoader2(false);
      setLoader3(false);
      setVerifynum(true);
    }
  }, [otpLoginRes]);

  const termsAndPrivacy = useSelector(
    (state: any) => state.GetTermsAndCondition
  );
  const { termsAndPolicy, termsAndPolicyLoading } = termsAndPrivacy;

  useEffect(() => {
    if (!termsAndPolicyLoading) {
      setEditValues(termsAndPolicy?.data);
    }
  }, [termsAndPolicyLoading]);
  useFormik({
    initialValues: editValues,
    enableReinitialize: true,
    onSubmit: (values) => {},
    // Other configuration options can be added here
  });
  const MAX_CHARACTERS = 200;

  const [showFullContent, setShowFullContent] = useState(false);

  const displayContent = showFullContent
    ? editValues
    : editValues?.slice(0, 200) + "...";

  const toggleContent = () => {
    setShowFullContent(!showFullContent);
  };

  return (
    <>
      <Formik
        initialValues={{
          ...INITIAL_FORM_STATE,
        }}
        validationSchema={FORM_VALIDATION}
        onSubmit={(values, { resetForm }) => {
          if (values.Confirm_Password === values.New_Password) {
            handleConfirmSwal(values);
          }
          resetForm();
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
            isValid,
          } = formik;
          return (
            <div
              className="browse-job mainDiv login-background d-flex align-items-center"
              style={{ height: "100%" }}
            >
              <div className="container">
                <div className="loginDiv">
                  <div className="row">
                    <div className="col-md-7 col-lg-7 col-sm-12 setPassDiv">
                      <h4 style={{ color: "#FFF" }}>Set Password</h4>
                      <div className="d-flex justify-content-around">
                        <img src={bnr} style={{ width: "75%" }}></img>
                      </div>
                    </div>
                    <div className="col-md-5 col-lg-5 col-sm-12 loginDivChild2">
                      {EmpMail?.code === 200 && (
                        <>
                          <Link to={"/home"} title="Go to home page.">
                            <div
                              className="d-flex justify-content-center"
                              style={{ margin: "7% 0" }}
                            >
                              <img src={logo} style={{ width: "50%" }} />
                            </div>
                          </Link>
                          <form
                            autoComplete="off"
                            onSubmit={handleSubmit}
                            id="login"
                            className="tab-pane active P_commonform"
                            style={{
                              padding: "0px 25px",
                              paddingBottom: "50px",
                              paddingTop: "10px",
                            }}
                          >
                            {EmpMail && (
                              <p style={{ color: "#ad9e61" }}>
                                {EmpMail?.data[1]?.uname}
                              </p>
                            )}
                            <div className="form-group">
                              <label className="font-weight-700">
                                New Password
                                <span
                                  className="maditory"
                                  style={{ color: "red" }}
                                >
                                  *
                                </span>
                              </label>
                              <input
                                name="New_Password"
                                className="form-control myField1"
                                placeholder="Enter New Password"
                                type={togtypeNew}
                                onChange={handleChange}
                                minLength={8}
                                maxLength={16}
                                value={values.New_Password}
                                onBlur={handleBlur}
                                onCopy={(e) => {
                                  e.preventDefault();
                                  return false;
                                }}
                                onPaste={(e) => {
                                  e.preventDefault();
                                  return false;
                                }}
                              />
                              <span
                                className="eye-btn myEye1"
                                onClick={() => {
                                  if (togtypeNew === "password") {
                                    setTogtypeNew("text");
                                  } else {
                                    setTogtypeNew("password");
                                  }
                                }}
                                style={{ top: "-30px", color: "gray" }}
                              >
                                {" "}
                                {togtypeNew === "password" ? (
                                  <BsFillEyeSlashFill className="eyePointer" />
                                ) : (
                                  <BsFillEyeFill className="eyePointer" />
                                )}
                              </span>
                            </div>
                            {errors.New_Password && touched.New_Password ? (
                              <p
                                style={{
                                  position: "relative",
                                  bottom: "20px",
                                }}
                                className="form-error"
                              >
                                {errors.New_Password}
                              </p>
                            ) : null}
                            <div className="form-group">
                              <label className="font-weight-700">
                                Confirm Password
                                <span
                                  className="maditory"
                                  style={{ color: "red" }}
                                >
                                  *
                                </span>
                              </label>
                              <input
                                name="Confirm_Password"
                                className="form-control myField1"
                                placeholder="Enter Confirm Password"
                                onChange={handleChange}
                                type={togtypeCon}
                                minLength={8}
                                maxLength={16}
                                value={values.Confirm_Password}
                                onBlur={handleBlur}
                                onCopy={(e) => {
                                  e.preventDefault();
                                  return false;
                                }}
                                onPaste={(e) => {
                                  e.preventDefault();
                                  return false;
                                }}
                                style={{ marginBottom: "25px" }}
                              />
                              <span
                                className="eye-btn myEye2"
                                onClick={() => {
                                  if (togtypeCon === "password") {
                                    setTogtypeCon("text");
                                  } else {
                                    setTogtypeCon("password");
                                  }
                                }}
                                style={{ top: "-53px", color: "gray" }}
                              >
                                {" "}
                                {togtypeCon === "password" ? (
                                  <BsFillEyeSlashFill className="eyePointer" />
                                ) : (
                                  <BsFillEyeFill className="eyePointer" />
                                )}
                              </span>
                            </div>
                            {errors.Confirm_Password &&
                            touched.Confirm_Password ? (
                              <p
                                style={{
                                  position: "relative",
                                  bottom: "20px",
                                  marginTop: "-10px",
                                }}
                                className="form-error"
                              >
                                {errors.Confirm_Password}
                              </p>
                            ) : null}
                            <div>
                              {!isValid && (
                                <button
                                  type="submit"
                                  className="site-button float-center w-100 positive-Btn"
                                  disabled={EmpSetPwd?.code !== 200}
                                  style={{
                                    cursor: "default",
                                    backgroundColor: "#bdbebf",
                                  }}
                                >
                                  Set Password
                                </button>
                              )}
                              {isValid && (
                                <button className="site-button float-center w-100 positive-Btn CP_btns">
                                  {loadingP && (
                                    <i
                                      className="fa fa-circle-o-notch fa-spin"
                                      style={{ marginRight: "10px" }}
                                    ></i>
                                  )}
                                  {loadingP ? "Processing..." : "Set Password"}
                                </button>
                              )}
                              <br />
                            </div>
                          </form>
                        </>
                      )}
                      {loadingM !== true &&
                        visible &&
                        EmpMail?.code !== 200 &&
                        EmpMail?.code !== 206 && (
                          <>
                            <div className="tab-pane active P_commonform">
                              <center>
                                <i
                                  className="fa fa-times"
                                  aria-hidden="true"
                                  style={{
                                    fontSize: 90,
                                    color: "red",
                                    width: "90px",
                                    borderRadius: "50%",
                                    border: "1px solid #ee2424",
                                    outline: "none",
                                  }}
                                ></i>
                                <br></br>
                                <br></br>
                                <h3>INVALID VERIFICATION URL</h3>
                              </center>
                              <br />
                              <p
                                className="m-b30"
                                style={{
                                  marginLeft: 20,
                                  fontFamily: "Montserrat",
                                }}
                              >
                                I'm sorry, the URL you entered appears to be
                                invalid. Please check the URL and try again.
                              </p>
                            </div>
                          </>
                        )}
                      {EmpMail?.code === 206 && visible && (
                        <>
                          <div className="tab-pane active P_commonform">
                            <center>
                              <i
                                className="fa fa-times"
                                aria-hidden="true"
                                style={{
                                  fontSize: 90,
                                  color: "red",
                                  width: "90px",
                                  borderRadius: "50%",
                                  border: "1px solid #ee2424",
                                  outline: "none",
                                }}
                              ></i>
                              <br></br>
                              <br></br>
                              <h3>VERIFICATION LINK EXPIRED</h3>
                            </center>
                            <br />
                            <p
                              className="m-b30"
                              style={{
                                marginLeft: 20,
                                fontFamily: "Montserrat",
                              }}
                            >
                              I'm sorry, the verification Link is expired.
                              Please request for new link.
                            </p>
                            {/* <button
                                    type="button"
                                    className="site-button border border-primary btn-sm"
                                    style={{
                                      background: "white",
                                      color: "#2e55fa",
                                      borderColor: "#2e55fa",
                                      marginLeft: "180px",
                                    }}
                                    onClick={() => {
                                      dispatch(
                                        postEmpResendMail({
                                          empUrl: id.get("id"),
                                        })
                                      );
                                    }}
                                  >
                                    Resend Link
                                  </button> */}
                          </div>
                        </>
                      )}
                      {loadingM && (
                        <>
                          <h3>Verifying</h3>
                          <p>Loading...</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="companyCopyright">
                  <span>{`@${new Date().getFullYear()} CaptiveJobs`}</span>
                </div>
              </div>
            </div>
          );
        }}
      </Formik>
      {/* POPUP */}
      {donePwd && (
        <Modal
          show={donePwd}
          onHide={() => {
            setDonePwd(false);
            RoleGroup.EMP_ADMIN_RECRUITER.includes(tokeData?.roles[0])
              ? navigate("/employerSignin")
              : navigate("/jobSeekerSignin");
          }}
          className="modal fade modal-bx-info editor"
        >
          <div className="modal-dialog my-0 mx-0 w-100 " role="document">
            <div className="modal-content">
              <div className="modal-body">
                <div className="success-checkmark">
                  <div className="check-icon">
                    <span className="icon-line line-tip"></span>
                    <span className="icon-line line-long"></span>
                    <div className="icon-circle"></div>
                    <div className="icon-fix"></div>
                  </div>
                </div>
                <center>
                  <p style={{ fontFamily: "Montserrat" }}>
                    You've successfully changed your password!
                    <br /> Thank you for joining us.
                  </p>
                </center>
                <hr></hr>
                <button
                  type="button"
                  className="site-button border border-primary btn-sm"
                  style={{
                    background: "white",
                    color: "#2e55fa",
                    borderColor: "#2e55fa",
                    float: "right",
                  }}
                  onClick={() => {
                    setDonePwd(false);
                    tokeData?.roles[0] === "ADMINISTRATOR"
                      ? navigate("/adminSignin")
                      : navigate("/home");
                    sessionStorage.removeItem("refresh_token");
                    sessionStorage.removeItem("access_token");
                    sessionStorage.removeItem("state");
                  }}
                >
                  GOT IT!
                </button>
                <br></br>
              </div>
            </div>
          </div>
        </Modal>
      )}
      {isTrueValue === "1" && (
        <>
          <Modal
            show={decpop}
            className="modal fade modal-bx-info editor"
            id="scroll"
          >
            <div className="modal-dialog my-0  mx-0 " role="document">
              <div className="modal-content mt-3">
                {/* <div className="modal-header">
                  <h5
                    className="modal-title"
                    id="KeyskillsModalLongTitle"
                    style={{
                      marginTop: "13px",
                      marginLeft: "10px",
                      color: "#6060b4",
                      fontSize: "15px",
                    }}
                  >
                    Most Important Terms & Conditions
                  </h5>
                </div> */}
                <div className="modal-body">
                  <h5 style={{ textAlign: "center" }}>
                    PASSWORD SET SUCCESSFULLY
                  </h5>
                  <div className="success-checkmark">
                    <div className="check-icon">
                      <span className="icon-line line-tip"></span>
                      <span className="icon-line line-long"></span>
                      <div className="icon-circle"></div>
                      <div className="icon-fix"></div>
                    </div>
                  </div>
                  <center>
                    <p style={{ fontFamily: "Montserrat" }}>
                      Your password has been set successfully! Please read the
                      Captive Jobs Policy and continues.
                    </p>
                  </center>
                  <hr />
                  {editValues && (
                    <div id="section-1">
                      <div>
                        <h5>Most Important Terms & Conditions </h5>
                        <div
                          style={{ maxHeight: "300px", overflowY: "scroll" }}
                        >
                          <div
                            style={{ fontSize: "14px" }}
                            className="jobDessContent"
                            dangerouslySetInnerHTML={{
                              __html: displayContent,
                            }}
                          ></div>
                          {editValues && editValues.length > MAX_CHARACTERS && (
                            // <Link onClick={toggleContent}>
                            // Read More
                            // </Link>
                            <p
                              style={{
                                textDecoration: "none",
                                color: "blue",
                                border: "none",
                                backgroundColor: "white",
                                cursor: "pointer",
                              }}
                              onClick={toggleContent}
                            >
                              {showFullContent ? "Read less" : "Read more"}
                            </p>
                          )}
                        </div>
                        <div>
                          <input
                            name="termsAndConditions"
                            type="checkbox"
                            id="chkTermsAndCondition"
                            style={{ marginRight: 10 }}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                          />
                          <label htmlFor="chkTermsAndCondition">
                            I agree to Terms & Condition and Privacy Policy
                          </label>
                        </div>
                      </div>
                      <div
                        style={{
                          textAlign: "center",
                          marginBottom: "10px",
                          marginTop: "10px",
                          float: "right",
                        }}
                      >
                        {isSubmit && (
                          <button
                            type="submit"
                            className={`${createbtn}`}
                            disabled={!isSubmit}
                            style={{ cursor: "pointer" }}
                            onClick={(event: any) => {
                              dispatch(patchEmpDeclare());
                              dispatch(resetSetPwdActionCreator());
                              setdecpop(false);
                              setTimeFunc();
                              // otpLogin(event);
                              setVerifynum(false);
                            }}
                          >
                            Continue
                          </button>
                        )}
                        {!isSubmit && (
                          <button
                            type="submit"
                            className={`${createbtn}`}
                            disabled={!isSubmit}
                            style={{ cursor: "default" }}
                          >
                            {" "}
                            Continue
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  {editValues === undefined && (
                    <div>
                      <button
                        type="submit"
                        className="site-button btn-sm"
                        style={{ cursor: "pointer", float: "right" }}
                        onClick={(event: any) => {
                          dispatch(patchEmpDeclare());
                          dispatch(resetSetPwdActionCreator());
                          setdecpop(false);
                          setTimeFunc();
                          // otpLogin(event);
                          setVerifynum(false);
                        }}
                      >
                        Continue
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Modal>
          {/* ---------------- */}

          {
            <Modal show={verifynum} className="modal fade modal-bx-info editor">
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
                        VERIFY MOBILE NUMBER
                      </h6>
                      <center>
                        <span style={{ fontFamily: "Montserrat" }}>
                          Enter OTP sent to your mobile number
                        </span>
                        {/* <br></br> */}
                        <p style={{ fontSize: "13px" }}>
                          For better communication please verify your registered
                          mobile number.
                        </p>
                        <span>{masked}</span>
                        {mins > 9 && secs > 9 && (
                          <p style={{ fontSize: "13px" }}>
                            OTP will expire in{" "}
                            <span className="badge badge-pill badge-info">
                              {mins}:{secs}
                            </span>{" "}
                            mins
                          </p>
                        )}
                        {mins < 10 && secs > 9 && (
                          <p style={{ fontSize: "13px" }}>
                            OTP will expire in{" "}
                            <span className="badge badge-pill badge-info">
                              0{mins}:{secs}
                            </span>{" "}
                            mins
                          </p>
                        )}
                        {mins > 9 && secs < 10 && (
                          <p style={{ fontSize: "13px" }}>
                            OTP will expire in{" "}
                            <span className="badge badge-pill badge-info">
                              {mins}:0{secs}
                            </span>{" "}
                            mins
                          </p>
                        )}
                        {mins < 10 && secs < 10 && (
                          <p style={{ fontSize: "13px" }}>
                            OTP will expire in{" "}
                            <span className="badge badge-pill badge-info">
                              0{mins}:0{secs}
                            </span>{" "}
                            mins
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
                            onChange={(e) =>
                              regex.numberTyping.test(e.target.value) &&
                              otpChanges(e, idx)
                            }
                            value={otp[idx]}
                            onKeyDown={(e) => otpKeyChanges(e, idx)}
                          />
                        ))}
                        <br></br>
                        <br></br>
                        {otp.join("").length === 6 && time !== 0 && (
                          <button
                            type="button"
                            className="site-button border border-primary btn-sm"
                            disabled={otp.join("").length === 6 ? false : true}
                            style={{
                              cursor: "pointer",
                              background: "white",
                              color: "#2e55fa",
                              borderColor: "#2e55fa",
                            }}
                            onClick={(e: any) => {
                              setLoader2(true);
                              verifyOtps();
                              setOtp(new Array(6).fill(""));
                            }}
                          >
                            {loader2 && (
                              <i
                                className="fa fa-circle-o-notch fa-spin"
                                style={{ marginRight: "10px" }}
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
                            onClick={(event: any) => {
                              setLoader3(true);

                              setTimeFunc();
                              dispatch(resetDeclareActionCreator());
                              reSendOtp();
                              setLoader3(false);
                              setOtp(new Array(6).fill(""));
                            }}
                          >
                            {loader3 && (
                              <i
                                className="fa fa-circle-o-notch fa-spin"
                                style={{ marginRight: "10px" }}
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
          <Modal show={mobilereg} className="modal fade modal-bx-info editor">
            <div className="modal-dialog my-0  mx-0 w-100 " role="document">
              <div className="modal-content">
                <div className="modal-body">
                  <h5 style={{ textAlign: "center" }}>
                    PHONE NUMBER VERIFIED SUCCESSFULLY
                  </h5>
                  <div className="success-checkmark">
                    <div className="check-icon">
                      <span className="icon-line line-tip"></span>
                      <span className="icon-line line-long"></span>
                      <div className="icon-circle"></div>
                      <div className="icon-fix"></div>
                    </div>
                  </div>
                  <center>
                    <p style={{ fontFamily: "Montserrat" }}>
                      Your phone number has been verified successfully!
                    </p>
                    <br></br>
                    <br></br>
                    <button
                      type="button"
                      className="site-button border border-primary btn-sm"
                      style={{
                        background: "white",
                        color: "#2e55fa",
                        borderColor: "#2e55fa",
                        float: "right",
                      }}
                      onClick={() => {
                        setMobilereg(false);
                        sessionStorage.removeItem("refresh_token");
                        sessionStorage.removeItem("access_token");
                        sessionStorage.removeItem("state");
                        navigate("/employerSignin");
                      }}
                    >
                      GOT IT!
                    </button>
                    &nbsp;
                  </center>
                </div>
              </div>
            </div>
          </Modal>
        </>
      )}
    </>
  );
}
export default SetPassword;
