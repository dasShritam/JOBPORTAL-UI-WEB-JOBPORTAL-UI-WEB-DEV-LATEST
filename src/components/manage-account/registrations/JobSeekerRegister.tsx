import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Step, StepContent, StepLabel, Stepper } from "@material-ui/core";
import { Modal } from "react-bootstrap";

import logo2 from "../../../assets/images/background/JobSeekerRegistration.png";
import "../../../assets/customCss/JobSeekerRegister.css";
import "../../../assets/plugins/bootstrap/css/bootstrap.min.css";
import { environment } from "../../../environments/environment";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import {
  jobSeekerSelfRegister,
  resetStateCreator,
} from "../../../redux/features/authentication/jobSeekerRegisterSlice";
import {
  resetActionCreator,
  resetSocialMediaLogin,
} from "../../../redux/features/authentication/LoginSlice";
import EmailVerification from "../../authentication/runway/EmailVerification";
import {
  resetsendotpAction,
  sendOtp,
} from "../../../redux/features/authentication/sendOtpSlice";
import {
  resetForgetPwdState,
  resetVerifyOtp,
  verifyOtp,
} from "../../../redux/features/authentication/verifyOtpSlice";
import { validateUser } from "../../../redux/features/authentication/userMailSlice";
import {
  charaterLength,
  getRandomString,
  regex,
} from "../../../common/validation";
import { encryptInput } from "../../../common/encrypt";
import dayjs from "dayjs";
let logo = require("../../../assets/images/Techkri-logo-blue.png");

const FORM_VALIDATION_1 = Yup.object().shape({
    FullName: Yup.string()
      .required("Please enter your Full Name.")
      .trim("Empty space not allowed.")
      .matches(
        regex.fullName,
        "Numeric and Special characters are not allowed."
      )
      .nullable(),
    EmailId: Yup.string()
      .required("Please enter Email Address.")
      .matches(regex.email, "Please specify valid Email Address.")
      .trim("Empty space not allowed."),
    Password: Yup.string()
      .required("Please create your Password.")
      .min(8, "Password must be at least 8 characters.")
      .max(16)
      .matches(
        regex.password,
        "Password should be 8 to 16 characters with at list one special character (!@#$%^&*?), one numeric, one small case and one upper case letter (i.e. Abcd@123)."
      ),
    MobileNumber: Yup.string()
      .required("Please enter Mobile Number.")
      .max(12)
      .matches(regex.indian_mobile, "Please enter valid Mobile Number.")
      .nullable(),
  }),
  FORM_VALIDATION_2 = Yup.object().shape({
    Status: Yup.string().required("Please select Work Status."),
    City: Yup.string().when("Status", {
      is: "Fresher",
      then: Yup.string()
        .required("Please mention Current City.")
        .trim("Empty space not allowed."),
    }),
    CountyCheckBox: Yup.array().notRequired(),
    Country: Yup.string().when("CountyCheckBox", {
      is: (c: any) => (c ? c.toString() === "outsideIndia" : false),
      then: Yup.string().required("Please mention Current Country."),
    }),
    Resume: Yup.string(),
    Video: Yup.string().notRequired(),
  });

function getSteps() {
  return ["YOUR DETAILS", "WORK DETAILS"];
}

function JobSeekerRegister() {
  //Variables
  const [btnClass, setBtnClass] = useState({
    className: "site-button float-center",
    style: { cursor: "default", backgroundColor: "#bdbebf" },
  });
  const [createbtn, setCreatebtn] = useState({
    className: "site-button float-center",
    style: { cursor: "default", backgroundColor: "#bdbebf" },
  });
  const [activeStep, setActiveStep] = React.useState(0);
  const [workStatus, setWorkStatus] = useState("");
  const [cityDisplay, setCityDisplay] = useState(false);
  const [checked, setChecked] = useState(true);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [mins, setMins] = useState(0);
  const [secs, setSecs] = useState(0);
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  const [verifynum, setVerifynum] = useState(false);
  const [numver, setNumver] = useState(false);
  const [number, setNumber] = useState("");
  const [pointer, setPointer] = useState("pointer");
  const [numErr1, setNumErr1] = useState(false);
  const [time, setTime] = useState(59);
  const [fieldValue, setFieldValue] = useState<any>();
  const [videoValue, setVideoValue] = useState<any>();
  const [sucessModel, setSuceesModel] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [passwordType, setPasswordType] = useState("password");
  const showSnackAlert = UseToastAlert();
  const [errormsg, setErrormsg] = useState<string>("");
  const [mob, setMob] = useState("");
  const [loader3, setLoader3] = useState(false);
  const [loader2, setLoader2] = useState(false);
  const [loader4, setLoader4] = useState(false);
  const [filesize, setFilesize] = useState(false);
  const [lockerror, setLockerror] = useState(false);
  const [fileformat, setFileformat] = useState(false);
  const [dobVal, setDobVal] = useState<number>();
  const [dobClearErr, setDobClearErr] = useState(false);
  const [touchedDob, setTouchedDob] = useState(false);
  const [vdo, setVdo] = useState(false);
  const [vdoexceed, setVdoExceed] = useState(false);
  const [value, setValue] = React.useState<any>(null);
  const [isCheched, setIsChecked] = useState(false);
  const [isChechedFre, setIsCheckedFre] = useState(false);
  const [ischeckboxFre, setIsCheckboxFre] = useState(false);
  const [isError, setIsError] = useState(false);

  const jsSocailMediaLogin = useSelector((state: any) => state.JsSocMediaLogin);
  const JobSeekerRegistered = useSelector(
    (state: any) => state.jobSeekerRegister
  );
  const JobSeekerSelfRegisterd = useSelector(
    (state: any) => state.jobSeekerSelfRegister
  );
  const { res, loading } = JobSeekerRegistered;
  const { UserCheck, loadingU } = useSelector(
    (state: any) => state.userMailVerify
  );
  const { response, load } = JobSeekerSelfRegisterd,
    [mailErr, setMailErr] = useState(false),
    [mobileErr, setMobileErr] = useState(false);

  let randomString = getRandomString(7);

  const sendOtpRes = useSelector((state: any) => state.sendOtp);
  const { otpRes } = sendOtpRes;
  const otpVerifiedRes = useSelector((state: any) => state.verifyAndCrtToken),
    otpErrorMessage = otpVerifiedRes?.res?.response?.data?.message;
  const inputRef = useRef<HTMLInputElement>(null);
  const jobSeekerReg = useSelector((state: any) => state.jobSeekerRegister);
  const verifyOtpResponse = useSelector((state: any) => state.verifyOtp),
    verifyOtpMessage = verifyOtpResponse?.res?.response?.data?.message;
  const charLength = charaterLength;
  const formik1: any = useFormik({
    initialValues: {
      FullName: "",
      EmailId: "",
      Password: "",
      MobileNumber: "",
    },
    validationSchema: FORM_VALIDATION_1,
    onSubmit: (e: any) => {
      e.preventDefault();
      handleNext(e);
    },
  });

  const formik2: any = useFormik({
    initialValues: {
      City: "",
      Country: "",
      Resume: "",
      Video: "",
      Status: "",
      CountyCheckBox: "",
    },
    validationSchema: FORM_VALIDATION_2,
    onSubmit: (e: any) => {
      e.preventDefault();
      handleNext(e);
      formik2.resetForm();
    },
  });
  const steps = getSteps();
  const [disPopUp, setDisPopUp] = useState(false);
  const isEnabled =
    !formik1.errors.FullName &&
    !formik1.errors.EmailId &&
    !formik1.errors.Password &&
    !formik1.errors.MobileNumber &&
    value !== null &&
    formik1.values.FullName &&
    formik1.values.EmailId &&
    formik1.values.Password &&
    formik1.values.MobileNumber &&
    !mobileErr &&
    !mailErr &&
    !dobClearErr &&
    !isError;

  const isSubmit = formik2.isValid;
  const [disErr, setDisErr] = useState("");

  //Use-Effect

  useEffect(() => {
    if (UserCheck && UserCheck?.code && UserCheck?.code === 200) {
      if (
        UserCheck?.data[0]?.key === "email" &&
        UserCheck?.data[0]?.exist === true
      ) {
        setMailErr(true);
      } else if (
        UserCheck.data[0]?.key === "email" &&
        UserCheck.data[0]?.exist === false
      ) {
        setMailErr(false);
      }
      if (
        UserCheck?.data[0]?.key === "phone" &&
        UserCheck?.data[0]?.exist === true
      ) {
        setMobileErr(true);
      } else if (
        UserCheck?.data[0]?.key === "phone" &&
        UserCheck?.data[0]?.exist === false
      ) {
        setMobileErr(false);
      }
    }
  }, [UserCheck, mailErr, mobileErr]);

  useEffect(() => {
    if (value) {
      const dob = new Date(`${value?.$y}, ${value?.$M + 1} ,${value?.$D}`);
      const currentDay = new Date();

      if (isNaN(value?.$D) || isNaN(value?.$y) || isNaN(value?.$M)) {
        setDobClearErr(true);
      } else {
        setDobClearErr(false);
      }

      if (dob <= currentDay) {
      } else if (dob > currentDay) {
        setValue(null);
        return;
      }
      if (regex.indian_mobile.test(mob) && dob) {
        dispatch(
          validateUser({data:[
            {
              key: "phone",
              value: `${mob}`,
              code: "+91",
            },
            {
              key: "dob",
              value: new Date(
                `${value?.$y}, ${value?.$M + 1} ,${value?.$D}`
              ).toLocaleString("fr-CA", {
                dateStyle: "short",
              }),
            },
          ]})
        );
      }
    }
  }, [mob, dobVal]);

  useEffect(() => {
    if (response.code === 200) {
      setLoader2(false);
      setTimeFunc();
      setLoader3(false);
      sendOTP();
    } else if (response?.code === 206) {
      showSnackAlert("warning", response.message);
      dispatch(resetStateCreator());
    } else if (
      JobSeekerSelfRegisterd &&
      JobSeekerSelfRegisterd.response &&
      JobSeekerSelfRegisterd.response.response &&
      JobSeekerSelfRegisterd.response?.code !== 200
    ) {
      showSnackAlert("warning", response.message);
      dispatch(resetStateCreator());
    }
  }, [response.code, JobSeekerSelfRegisterd?.response?.code]);

  useEffect(() => {
    if (res?.code === 200) {
      setTimeFunc();
      sendOTP();
    }
  }, [res.code]);

  useEffect(() => {
    if (otpRes?.code === 200) {
      setVerifynum(true);
      setTimeFunc();
      // dispatch(resetsendotpAction());
    } else if (
      otpRes &&
      otpRes.response &&
      otpRes.response.status &&
      otpRes.response.status !== 200
    ) {
      setSuceesModel(true);
      dispatch(resetsendotpAction());
    }
  }, [otpRes, otpRes?.code]);

  useEffect(() => {
    if (jobSeekerReg.res && jobSeekerReg.res.code === 206) {
      setDisPopUp(true);
      // dispatch(resetRegActionCreator())
    }
  }, [jobSeekerReg]);

  useEffect(() => {
    time > 0 ? setPointer("default") : setPointer("pointer");
  }, [time]);

  useEffect(() => {
    if (verifyOtpResponse?.res?.code === 200) {
      setSuceesModel(true);
      dispatch(resetForgetPwdState());
    } else if (
      verifyOtpResponse &&
      verifyOtpResponse.res &&
      verifyOtpResponse.res.response &&
      verifyOtpResponse.res.response?.data &&
      verifyOtpResponse.res?.response?.data?.code !== 200
    ) {
      setLoader2(false);
      setOtp(new Array(6).fill(""));
    }
  }, [verifyOtpResponse?.res, verifyOtpResponse?.res?.response?.data]);

  useEffect(() => {
    if (otpVerifiedRes?.res?.code === 200) {
      navigate("/jobseekerProfile");
      showSnackAlert("success", response.message);
      dispatch(resetVerifyOtp());
    } else if (
      otpVerifiedRes &&
      otpVerifiedRes.res &&
      otpVerifiedRes.res.response &&
      otpVerifiedRes.response?.code !== 200
    ) {
      showSnackAlert("warning", otpErrorMessage);
      setOtp(new Array(6).fill(""));
      // dispatch(resetsendotpAction());
      dispatch(resetVerifyOtp());
    }
  }, [navigate, otpVerifiedRes?.res?.code, otpErrorMessage]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

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
    if (
      jsSocailMediaLogin.res &&
      jsSocailMediaLogin.res.response &&
      jsSocailMediaLogin.res.response.data &&
      jsSocailMediaLogin.res.response.data.code &&
      jsSocailMediaLogin?.res?.response?.data?.code === 400
    ) {
      setDisErr(jsSocailMediaLogin?.res?.response?.data?.message);
      setLoader3(false);
      setTimeout(() => {
        setDisErr("");
        dispatch(resetActionCreator());
        dispatch(resetSocialMediaLogin());
      }, 5000);
      dispatch(resetSocialMediaLogin());
    }
    if (jobSeekerReg.res && jobSeekerReg.res.code === 206) {
      setDisPopUp(true);
      setLoader3(false);
    }
  }, [jsSocailMediaLogin]);
  useEffect(() => {
    return () => {
      setDisErr("");
    };
  }, []);

  useEffect(() => {
    setWorkStatus(formik2.values.Status);
    formik2.values.Status === "Fresher"
      ? setCityDisplay(true)
      : setCityDisplay(false);
  }, [formik2.values.Status]);

  useEffect(() => {
    if (isEnabled) {
      setBtnClass({
        className: "site-button mt-3",
        style: { cursor: "pointer", backgroundColor: "" },
      });
    } else {
      setBtnClass({
        className: "site-button mt-3",
        style: { cursor: "default", backgroundColor: "#bdbebf" },
      });
    }
  }, [isEnabled]);

  useEffect(() => {
    if (isSubmit && formik2.values.Status !== "") {
      setCreatebtn({
        className: "site-button",
        style: { cursor: "pointer", backgroundColor: "" },
      });
    } else {
      setCreatebtn({
        className: "site-button",
        style: { cursor: "default", backgroundColor: "#bdbebf" },
      });
    }
  }, [isSubmit, formik2.values.Status]);

  //Internal function

  const setTimeFunc = () => {
    setTime(Number(environment.otp_time_sec));
  };

  const handleResumeChange = (e: any) => {
    const selectedFile: any = e.target.files && e.target.files[0];
    const reader: any = new FileReader();
    reader.readAsArrayBuffer(selectedFile);
    reader.onload = function () {
      let file: any = new Blob([reader.result], {
        type: "application/pdf",
      });
      file.text().then((x) => {
        if (x.includes("Encrypt")) {
          setLockerror(true);
          setFileformat(false);
          setFilesize(false);
        } else {
          if (selectedFile) {
            if (
              selectedFile.type !== "application/pdf" &&
              selectedFile.type !==
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ) {
              setFileformat(true);
              setFilesize(false);
              setLockerror(false);
              setFieldValue(null);
              e.target.files = [];
            } else if (selectedFile.size > environment.resumefile) {
              setFilesize(true);
              setFileformat(false);
              setLockerror(false);
              setFieldValue(null);
              e.target.files = [];
            } else {
              setFieldValue(selectedFile);
              setErrormsg("");
              setFilesize(false);
              setFileformat(false);
              setLockerror(false);
              setLockerror(false);
            }
          }
        }
      });
    };
  };

  const togglePassword = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  const handleCheck = (checked) => {
    checked ? setChecked(false) : setChecked(true);
  };

  const MobileMessage = () => {
    if (!regex.indian_mobile.test(number)) {
      setNumErr1(true);
    } else {
      setNumErr1(false);
      setNumver(false);
    }
  };

  const GetTinyFileName = (file) => {
    const lastIndex = file.lastIndexOf(".");
    const ext = file.substring(lastIndex, file.length);
    let fileName = file.substring(0, lastIndex);
    if (fileName.length > charLength) {
      fileName = `${fileName.substring(0, charLength)}..${ext}`;
    } else {
      fileName = file;
    }
    return fileName;
  };

  const handleVideoChange = (e: any) => {
    const videoValue = e.target.files && e.target.files[0];
    if (videoValue) {
      if (videoValue.type !== "video/mp4") {
        setVdo(true);
        setVdoExceed(false);
        setVideoValue(null);
        e.target.files = [];
      } else if (videoValue.size > environment.videofile) {
        setVdoExceed(true);
        setVdo(false);
        setVideoValue(null);
        e.target.files = [];
      } else {
        setVideoValue(videoValue);
        setVdoExceed(false);
        setVdo(false);
      }
    }
  };

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
  const otpKeyChanges = (
    { key }: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (key === "Backspace" && !otp[index]) setActiveOtpIndex(index - 1);
    else if (key === "Backspace") setActiveOtpIndex(index - 0);
  };

  function ssoHandler(authType: string) {
    let state;
    switch (authType) {
      case "googleRegister":
        state = authType;
        const url = `https://accounts.google.com/o/oauth2/v2/auth?scope=${environment.googleSso.scope}&access_type=offline&include_granted_scopes=true&response_type=code&state=${state}&redirect_uri=${environment.runwayUrl}&client_id=${environment.googleSso.client_id}`;
        window.location.href = url;
        break;
      case "linkedInRegister":
        state = authType;
        const linkedinUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${environment.linkedInSso.client_id}&redirect_uri=${environment.runwayUrl}&state=${state}&scope=${environment.linkedInSso.scope}`;
        window.location.href = linkedinUrl;
        break;
      case "facebookRegister":
        state = authType;
        const facebookUrl = `https://www.facebook.com/v16.0/dialog/oauth?client_id=${environment.faceBookSso.client_id}&redirect_uri=${environment.runwayUrl}&display=popup&response_type=code&scope=public_profile,email&state=${authType}`;
        window.location.href = facebookUrl;
        break;
      case "twitterRegister":
        state = { authType: authType, code_challenge: randomString };
        const stateData = btoa(JSON.stringify(state));
        const twitterUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${environment.twitterSso.client_id}&redirect_uri=${environment.runwayUrl}&scope=tweet.read%20users.read&state=${stateData}&code_challenge=${randomString}&code_challenge_method=plain`;
        window.location.href = twitterUrl;
        break;
      default:
        break;
    }
  }

  const sendOTP = async () => {
    try {
      if (!regex.indian_mobile.test(mob)) {
        setLoader3(false);
        return;
      }
      const mobileData = {
        to: `+91${mob}`,
        channel: "sms",
        user_id: response?.data,
      };
      dispatch(sendOtp(mobileData));
    } catch (error: any) {}
  };

  const verifyOTP = async () => {
    const verificationData = {
      txn_id: otpRes?.data?.txn_id,
      otp: otp.join(""),
      to: `+91${number}`,
      channel: "sms",
    };

    dispatch(verifyOtp(verificationData));
    dispatch(resetStateCreator());
  };

  const validateEmail = (e: any) => {
    e.preventDefault();
    const email = regex.email.test(e?.target?.value);
    if (email) {
      dispatch(
        validateUser({data:[
          {
            key: "email",
            value: `${e?.target?.value.toLowerCase()}`,
          },
        ]})
      );
    }
  };

  const handleNext = (e: any) => {
    e.preventDefault();
    if (
      !formik1.errors.FullName &&
      !formik1.errors.EmailId &&
      !formik1.errors.Password &&
      !formik1.errors.MobileNumber &&
      value !== null &&
      formik1.values.FullName &&
      formik1.values.EmailId &&
      formik1.values.Password &&
      formik1.values.MobileNumber &&
      !mobileErr &&
      !mailErr
    ) {
      setActiveStep((prevActiveStep: any) => prevActiveStep + 1);
    }
  };

  const handlecreate = (e: any) => {
    e.preventDefault();
    if (
      !formik2.errors.City &&
      (UserCheck?.code === 200 || loading) &&
      checked &&
      !formik2.errors.Country &&
      !formik2.errors.Status &&
      formik2.values.Status &&
      checked
        ? true
        : Boolean(formik2.values.Country)
    ) {
      let fresher: boolean;

      if (workStatus === "Fresher") {
        fresher = true;
      } else {
        fresher = false;
      }
      setNumber(formik1.values.MobileNumber);

      const mdl = {
        fullName: formik1.values.FullName,
        email: formik1.values.EmailId.toLowerCase(),
        phno: formik1.values.MobileNumber,
        pwd: formik1.values.Password,
        fresher: fresher,
        country_code: "+91",
        currentcity: fresher === true ? formik2.values.City.trim() : "",
        currentcountry:
          fresher === true
            ? formik2.values.Country.trim()
              ? formik2.values.Country.trim()
              : "India"
            : "",
        dateofbirth: new Date(
          `${value?.$y}, ${value?.$M + 1} ,${value?.$D}`
        ).toLocaleString("fr-CA", {
          dateStyle: "short",
        }),
      };
      mdl.pwd = encryptInput(formik1.values.Password);
      let formData = new FormData();
      formData.append("resume", fieldValue);
      formData.append("video", videoValue);
      formData.append("jsProfile", JSON.stringify(mdl));
      dispatch(jobSeekerSelfRegister(formData));
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep: any) => prevActiveStep - 1);
  };

  const minDate = dayjs().subtract(70, "year");
  const minMonth = new Date().getMonth();
  const minDay = new Date().getDate();
  const maxDate = dayjs().add(10, "year");

  function getStepContent(step: any) {
    switch (step) {
      case 0:
        return (
          <div>
            <form autoComplete="off">
              <div className="form-group">
                <label className="font-weight-700">
                  Full Name
                  <span className="maditory">*</span>
                </label>
                <input
                  name="FullName"
                  className="form-control"
                  placeholder="Enter Your Full Name"
                  type="text"
                  maxLength={150}
                  autoComplete="new-text"
                  onChange={formik1.handleChange}
                  onBlur={formik1.handleBlur}
                  value={formik1.values.FullName}
                />
                {formik1.errors.FullName && formik1.touched.FullName && (
                  <p className="form-error">{formik1.errors.FullName}</p>
                )}
              </div>
              <div className="form-group">
                <label className="font-weight-700">
                  Email Address
                  <span className="maditory">*</span>
                </label>
                <input
                  name="EmailId"
                  className="form-control"
                  placeholder="Enter Your Email Address"
                  type="email"
                  autoComplete="new-email"
                  maxLength={150}
                  onChange={formik1.handleChange}
                  onBlur={(e) => {
                    formik1.handleBlur(e);
                    validateEmail(e);
                  }}
                  value={formik1.values.EmailId}
                />
                {!formik1.errors.EmailId && mailErr && (
                  <p className="error" style={{ fontSize: "13px" }}>
                    Please check, Entered Email Id is already exists!
                  </p>
                )}
                {formik1.errors.EmailId && formik1.touched.EmailId && (
                  <p className="form-error">{formik1.errors.EmailId}</p>
                )}
              </div>
              <div className="form-group" id="pass-div">
                <label
                  className="font-weight-700"
                  style={{ marginTop: "14px" }}
                >
                  Password
                  <span className="maditory">*</span>
                </label>
                <i className="eye-btn" onClick={togglePassword}>
                  {passwordType === "password" ? (
                    <BsFillEyeSlashFill className="eyePointer" />
                  ) : (
                    <BsFillEyeFill className="eyePointer" />
                  )}
                </i>
                <input
                  name="Password"
                  id="input-password"
                  className="form-control"
                  placeholder="Create a Password for Your Account."
                  type={passwordType}
                  autoComplete="new-passwordType"
                  maxLength={16}
                  onChange={formik1.handleChange}
                  onBlur={formik1.handleBlur}
                  value={formik1.values.Password}
                />
                <div className="input-group-btn"></div>
                {formik1.errors.Password && formik1.touched.Password && (
                  <p className="form-error">{formik1.errors.Password}</p>
                )}
              </div>
              <label
                className="font-weight-700"
                style={{ marginBottom: "0px" }}
              >
                Date of Birth
                <span className="maditory">*</span>
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    className="dobselect fs-6 "
                    value={value}
                    sx={{ width: "100%" }}
                    format="DD-MM-YYYY"
                    disableFuture={true}
                    onChange={(newValue) => {
                      setValue(newValue);
                      setDobVal(newValue);
                      if (newValue.$y < minDate.year()) {
                        setIsError(true);
                      } else if (minDate.year() === newValue.$y) {
                        if (newValue.$M < minMonth) {
                          setIsError(true);
                        } else if (
                          newValue.$M === minMonth &&
                          newValue.$D < minDay
                        ) {
                          setIsError(true);
                        } else {
                          setIsError(false);
                        }
                      } else {
                        setIsError(false);
                      }
                    }}
                    minDate={minDate}
                    maxDate={maxDate}
                    onClose={() => {
                      setTouchedDob(true);
                    }}
                  />{" "}
                </DemoContainer>{" "}
              </LocalizationProvider>{" "}
              {isError && (
                <p className="form-error" style={{ marginTop: "-15px" }}>
                  {" Please select a date within the last 70 years."}
                </p>
              )}
              {value === null && touchedDob && (
                <p className="form-error" style={{ marginTop: "-15px" }}>
                  {"Please select Date Of Birth."}
                </p>
              )}
              {value === null &&
                formik1.touched.MobileNumber &&
                !touchedDob && (
                  <p className="form-error" style={{ marginTop: "-15px" }}>
                    {"Please select Date Of Birth."}
                  </p>
                )}
              {dobClearErr && value !== null && (
                <p className="form-error" style={{ marginTop: "-10px" }}>
                  {"Please select Date Of Birth."}
                </p>
              )}
              <div className="form-group">
                <label className="font-weight-700">
                  Mobile Number
                  <span className="maditory">*</span>
                </label>
                <input
                  name="MobileNumber"
                  id="phonenums"
                  className="form-control w-100"
                  placeholder="Enter Your Mobile Number"
                  autoComplete="new-text"
                  maxLength={10}
                  onBlur={formik1.handleBlur}
                  onChange={(e) => {
                    regex.numberTyping.test(e.target.value) &&
                      formik1.handleChange(e);
                    setMob(e.target.value);
                  }}
                  style={{ paddingLeft: "42px" }}
                  value={formik1.values.MobileNumber}
                />
                <span
                  style={{
                    position: "relative",
                    top: "-33px",
                    left: "2%",
                    fontSize: "14px",
                  }}
                >
                  +91
                </span>
                {!formik1.errors.MobileNumber && mobileErr && (
                  <p
                    className="error"
                    style={{
                      fontSize: "13px",
                      marginTop: "-23px",
                    }}
                  >
                    Please check, entered Mobile Number is already exists!
                  </p>
                )}
                {formik1.errors.MobileNumber &&
                  formik1.touched.MobileNumber && (
                    <p className="form-error" style={{ marginTop: "-22px" }}>
                      {formik1.errors.MobileNumber}
                    </p>
                  )}
              </div>
              <div>
                <button
                  id="nextbtns"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    formik1.handleSubmit();
                    handleNext(e);
                  }}
                  className={`${btnClass.className}`}
                  style={btnClass.style}
                  disabled={!isEnabled || dobClearErr || isError}
                >
                  NEXT
                  <ArrowForwardIosIcon className="nexticons" />
                </button>
              </div>
            </form>
          </div>
        );
      case 1:
        return (
          <div>
            <form autoComplete="off">
              <div className="form-group">
                <label
                  className="font-weight-700"
                  style={{
                    marginTop: "16px",
                    marginBottom: "0px",
                  }}
                >
                  Work Status
                  <span className="maditory">*</span>
                </label>
                <br />
                <br />
                <div className="workStatusDiv">
                  <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                    <label>
                      <input
                        type="radio"
                        name="Status"
                        className="card-input-element-status"
                        onChange={formik2.handleChange}
                        style={{ padding: "10px" }}
                        onClick={() => {
                          formik2.values.City = "";
                          formik2.values.Country = "";
                          formik2.values.CountyCheckBox = "";
                          setChecked(true);
                          setIsChecked(true);
                          setIsCheckedFre(false);
                          setIsCheckboxFre(false);
                        }}
                        checked={isCheched}
                      />
                      <div
                        className="panel panel-default card-input "
                        style={{ padding: "14px 30px" }}
                      >
                        <div className="panel-heading">I'm Experienced</div>
                      </div>
                    </label>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                    <label>
                      <input
                        type="radio"
                        value="Fresher"
                        name="Status"
                        onChange={formik2.handleChange}
                        className="card-input-element-status"
                        onClick={() => {
                          setIsCheckedFre(true);
                          setIsChecked(false);
                        }}
                        checked={isChechedFre}
                      />
                      <div
                        className="panel panel-default card-input"
                        style={{ padding: "14px 47px" }}
                      >
                        <div className="panel-heading">I'm Fresher</div>
                      </div>
                    </label>
                  </div>
                </div>
                {formik2.errors.Status && (
                  <p className="form-error">{formik2.errors.Status}</p>
                )}
              </div>
              {cityDisplay && (
                <>
                  <div className="form-group d-flex justify-content-between">
                    <label className="font-weight-700">
                      Current City
                      <span className="maditory">*</span>
                    </label>
                    <div className="checkbox-div">
                      <input
                        type="checkbox"
                        className="countyPointer"
                        name="CountyCheckBox"
                        value="outsideIndia"
                        maxLength={100}
                        onChange={(e) => {
                          handleCheck(e.target.checked);
                          formik2.handleChange(e);
                        }}
                        onClick={() => setIsCheckboxFre(!ischeckboxFre)}
                        checked={ischeckboxFre}
                        id="check1"
                      />
                      <label htmlFor="check1" className="countyPointer">
                        &nbsp;Outside India
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <input
                      id="city"
                      name="City"
                      className="form-control"
                      placeholder="Mention the city you live in"
                      maxLength={100}
                      type="text"
                      onChange={(event) => {
                        if (
                          event?.target?.value.match(regex.alphabetSpaceTyping)
                        ) {
                          formik2.handleChange(event);
                        }
                        if (event?.target?.value === "") {
                          formik2.handleChange(event);
                        }
                      }}
                      value={formik2.values.City}
                    />
                    {formik2.errors.City ? (
                      <p className="form-error">{formik2.errors.City}</p>
                    ) : null}
                  </div>
                </>
              )}
              {cityDisplay && !checked && (
                <div className="form-group">
                  <label className="font-weight-700">
                    Current Country
                    <span className="maditory">*</span>
                  </label>
                  <input
                    name="Country"
                    className="form-control"
                    placeholder="Mention the country where you are staying"
                    type="text"
                    maxLength={100}
                    onChange={(event) => {
                      if (
                        event?.target?.value.match(regex.alphabetSpaceTyping)
                      ) {
                        formik2.handleChange(event);
                      }
                      if (event?.target?.value === "") {
                        formik2.handleChange(event);
                      }
                    }}
                    value={formik2.values.Country}
                  />
                  {formik2.errors.Country ? (
                    <p className="form-error">{formik2.errors.Country}</p>
                  ) : null}
                </div>
              )}
              <div className="form-group">
                <label className="font-weight-700">
                  Upload Resume
                  <span
                    className="fs-5 color-grey-999"
                    id="smallTxt"
                    style={{
                      fontSize: "14px",
                      marginLeft: "5px",
                    }}
                  >
                    (docx, pdf)(Max : 2MB)
                  </span>
                </label>
                <form className="attach-resume">
                  <div className="row">
                    <div className="col-lg-12 col-md-12 uploadResume">
                      <div className="">
                        <p
                          className="m-auto align-self-center"
                          style={{
                            fontSize: "14px",
                            color: "#815bb5",
                          }}
                        >
                          <div
                            className="file-upload"
                            style={{
                              display: "flex",
                            }}
                          >
                            <label className="file-upload-label-resume text-light">
                              <input
                                title={formik2.values.Resume}
                                className="file-upload-input"
                                type="file"
                                accept=".pdf,.docx"
                                value={formik2.values.Resume}
                                onChange={(event: any) => {
                                  handleResumeChange(event);
                                }}
                              />
                              Upload Resume
                            </label>
                            {fieldValue ? (
                              <div className="file-upload-preview">
                                <span
                                  className="file-name"
                                  title={fieldValue.name}
                                >
                                  {GetTinyFileName(fieldValue.name)}
                                </span>
                                <label className="replace-button"></label>
                                <button
                                  className="remove-button"
                                  onClick={() => {
                                    setFieldValue(null);
                                  }}
                                >
                                  <i className="fa fa-trash-o fa-12px"></i>
                                </button>
                              </div>
                            ) : (
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                <p
                                  style={{
                                    borderRadius: "20px",
                                    marginTop: "10px",
                                  }}
                                >
                                  &nbsp; No file choosen...
                                </p>
                              </div>
                            )}
                          </div>
                        </p>
                      </div>
                    </div>
                    {errormsg && <div>{errormsg}</div>}
                  </div>
                </form>
                <div>
                  {fileformat && (
                    <p className="form-error">
                      Please select a pdf or docx file.
                    </p>
                  )}
                  {filesize && (
                    <p className="form-error">
                      File size should not exceed 2MB.
                    </p>
                  )}
                  {lockerror && (
                    <p className="form-error">
                      User does not have permission to upload Protected File.
                    </p>
                  )}
                </div>
                <span
                  id="resume-Span"
                  style={{
                    fontSize: "14px",
                    fontStyle: "italic",
                  }}
                >
                  Recruiters give first preference to candidates who have
                  resume.
                </span>
                <br />
              </div>
              <div className="form-group">
                <label className="font-weight-700">
                  Upload Profile Video
                  <span
                    className="fs-5 color-grey-999"
                    id="smallTxt"
                    style={{
                      fontSize: "14px",
                      marginLeft: "5px",
                    }}
                  >
                    (m4v, mp4)(Max : 20MB)
                  </span>
                </label>
                <form className="video-input">
                  <div className="row">
                    <div className="col-lg-12 col-md-12 ">
                      <div>
                        <p
                          className="m-auto align-self-center"
                          style={{
                            fontSize: "14px",
                            color: "#815bb5",
                          }}
                        >
                          <div
                            className="file-upload"
                            style={{
                              display: "flex",
                            }}
                          >
                            <label className="file-upload-label-Video text-light">
                              <input
                                title={formik2.values.Video}
                                className="file-upload-input"
                                type="file"
                                accept="video/mp4,video/x-m4v,video/"
                                id="custom-file"
                                max-size="5e+6"
                                value={formik2.values.Video}
                                onChange={(event: any) => {
                                  {
                                    handleVideoChange(event);
                                  }
                                }}
                              />
                              Upload Video
                            </label>
                            {videoValue ? (
                              <div className="file-upload-preview">
                                <span
                                  className="file-name"
                                  title={videoValue.name}
                                >
                                  {GetTinyFileName(videoValue.name)}
                                </span>
                                <label className="replace-button"></label>
                                <button
                                  className="remove-button"
                                  onClick={() => {
                                    setVideoValue(null);
                                  }}
                                >
                                  <i className="fa fa-trash-o fa-12px"></i>
                                </button>
                              </div>
                            ) : (
                              <div
                                style={{
                                  display: "flex",
                                }}
                              >
                                <p
                                  style={{
                                    borderRadius: "20px",
                                    marginTop: "10px",
                                  }}
                                >
                                  &nbsp; No file choosen...
                                </p>
                              </div>
                            )}
                          </div>
                        </p>
                        {vdo && (
                          <p className="form-error">
                            Please select a Video File.
                          </p>
                        )}
                        {vdoexceed && (
                          <p className="form-error">
                            File size should not exceed 20MB.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="jobs">
                    <button
                      className="site-button"
                      id="backbtns"
                      type="button"
                      disabled={activeStep === 0}
                      onClick={(e: any) => {
                        handleBack();
                        e.preventDefault();
                      }}
                    >
                      <ArrowBackIosIcon className="backicons" />
                      BACK
                    </button>

                    <button
                      id="createbtns"
                      onClick={(e) => {
                        e.preventDefault();
                        formik2.handleSubmit();
                        handlecreate(e);
                      }}
                      type="submit"
                      className={`${createbtn.className}`}
                      style={createbtn.style}
                      disabled={
                        UserCheck?.code !== 200 ||
                        loading ||
                        loadingU ||
                        !isSubmit
                      }
                    >
                      {load && <i className="fa fa-circle-o-notch fa-spin"></i>}
                      {load ? "REGISTERING..." : "REGISTER"}
                    </button>
                  </div>
                </form>
              </div>
            </form>
          </div>
        );
    }
  }
  return (
    <>
      {disErr && (
        <>
          <div
            className="alert alert-danger alert-dismissible fade show"
            style={{
              marginTop: "30px",
              width: "700px",
              marginLeft: "300px",
              textAlign: "center",
            }}
            role="alert"
          >
            {disErr}
          </div>
        </>
      )}
      <div
        className="browse-job login-background d-flex align-items-center"
        style={{ padding: "40px 0" }}
      >
        <div className="container">
          <div className="loginDiv">
            <div className="row">
              <div className="col-md-5 col-lg-5 col-sm-12 loginDivChild1">
                <div>
                  <h4 style={{ color: "#FFF" }}>Jobseeker Registration</h4>
                  <p
                    className="font-weight-600"
                    style={{
                      fontSize: "14px",
                      color: "#bfdaf2",
                    }}
                  >
                    If you have an account with us, please{" "}
                    <Link
                      style={{
                        color: "#FFF",
                      }}
                      to={"/jobSeekerSignin"}
                    >
                      Log In
                    </Link>
                  </p>
                  <div className="logo">
                    <Link to={"#"}>
                      <img src={logo2} alt="" />
                    </Link>
                  </div>
                  <div className="d-flex justify-content-around">
                    <button
                      className="homebtn"
                      onClick={() => {
                        navigate("/home");
                      }}
                    >
                      Go to Home
                    </button>
                  </div>

                  <h4
                    className="m-b10"
                    style={{
                      color: "#FFF",
                      marginTop: "6%",
                      textAlign: "center",
                    }}
                  >
                    New to Captive Jobs?
                  </h4>
                  <p
                    className="m-b40"
                    style={{
                      color: "#FFF",
                      textAlign: "center",
                    }}
                  >
                    Sign up now to get your own personalized account.
                  </p>
                  <ul
                    className="list-inline m-a0"
                    style={{ textAlign: "center" }}
                  >
                    <li className="social-icons">
                      <div
                        onClick={() => {
                          ssoHandler("facebookRegister");
                        }}
                        className="site-button  facebook circle m-r10 "
                        title="Register with Facebook."
                      >
                        <i className="fa fa-facebook fa-lg"></i>
                      </div>
                    </li>
                    <li>
                      <div
                        className="site-button  google-plus circle m-r10 "
                        title="Register with Google."
                        onClick={() => {
                          ssoHandler("googleRegister");
                        }}
                      >
                        <i
                          className="fa fa-google fa-lg"
                          aria-hidden="true"
                        ></i>
                      </div>
                    </li>
                    <li>
                      <div
                        className="site-button  linkedin circle m-r10"
                        title="Register with LinkedIn."
                        onClick={() => {
                          ssoHandler("linkedInRegister");
                        }}
                      >
                        <i className="fa fa-linkedin fa-lg"></i>
                      </div>
                    </li>
                    <li>
                      <div
                        onClick={() => {
                          ssoHandler("twitterRegister");
                        }}
                        className="site-button  twitter circle m-r10 "
                        title="Register with Twitter."
                      >
                        <i className="fa fa-twitter fa-lg"></i>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                className="col-md-7 col-lg-7 col-sm-12 loginDivChild2 backWhite"
                style={{ paddingTop: "17px" }}
              >
                <div
                  className="d-flex justify-content-end"
                  style={{ height: "11%" }}
                >
                  <Link to={"/home"} title="Go to home page.">
                    <img className="" style={{ height: "86%" }} src={logo} />
                  </Link>
                </div>
                <div className="row">
                  <div className="col-md-12 m-b30">
                    <div className="tab-content">
                      <form
                        id="login"
                        className="tab-pane active"
                        onSubmit={formik2.handleSubmit}
                      >
                        <Stepper activeStep={activeStep} orientation="vertical">
                          {steps.map((label, index) => (
                            <Step key={label}>
                              <StepLabel>{label}</StepLabel>
                              <StepContent>
                                <div>{getStepContent(index)}</div>
                                <div></div>
                              </StepContent>
                            </Step>
                          ))}
                        </Stepper>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={numver}
        onHide={() => {
          setNumver(false);
        }}
        className="modal fade modal-bx-info editor"
      >
        <div className="modal-dialog my-0  mx-0 w-100 " role="document">
          <div className="modal-content">
            <div className="modal-body">
              <div>
                <h5 style={{ textAlign: "center" }}>
                  CONTACT NUMBER VERIFICATION
                </h5>
                <div style={{ textAlign: "center" }}>
                  <i
                    className="fa fa-duotone fa-mobile"
                    style={{
                      fontSize: "90px",
                      color: "rgb(63, 81, 181)",
                      width: "90px",
                      borderRadius: "50%",
                      border: "1px solid rgb(35, 132, 178)",
                      outline: "none",
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
                  VERIFY MOBILE NUMBER
                </h6>
                <center>
                  <p style={{ fontFamily: "Montserrat" }}>
                    To complete the verification process, we need to send a
                    verification code to your Mobile Number.
                    <br /> Please provide your Mobile Number to verify.
                  </p>
                  <div className="d-flex" style={{ marginLeft: 170 }}>
                    <span className="form-control" style={{ width: 70 }}>
                      +91
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      id="num"
                      maxLength={10}
                      style={{ width: "50%" }}
                      defaultValue={number}
                      onChange={(e: any) => {
                        {
                          regex.numberTyping.test(e.target.value) &&
                            setNumber(e.target.value);
                          setNumErr1(false);
                          setMob(e.target.value);
                        }
                      }}
                    />
                  </div>
                  {numErr1 && number && (
                    <p className="error">Invalid Mobile Number</p>
                  )}
                  <br></br>
                  {number.length === 10 && (
                    <button
                      type="button"
                      className="site-button border border-primary btn-sm"
                      style={{
                        cursor: "pointer",
                        background: "white",
                        color: "#2e55fa",
                        borderColor: "#2e55fa",
                      }}
                      onClick={(event: any) => {
                        if (number.length === 10) {
                          setTimeFunc();
                          setLoader3(true);
                          sendOTP();
                          MobileMessage();
                          setOtp(new Array(6).fill(""));
                        }
                      }}
                    >
                      {loader3 && (
                        <i
                          className="fa fa-circle-o-notch fa-spin"
                          style={{
                            marginRight: "10px",
                          }}
                        ></i>
                      )}
                      {loader3 ? "SENDING OTP" : "SEND OTP"}
                    </button>
                  )}
                  &nbsp;
                  <button
                    type="button"
                    className="site-button border border-primary btn-sm"
                    style={{
                      background: "white",
                      color: "#2e55fa",
                      borderColor: "#2e55fa",
                    }}
                    onClick={() => setNumver(false)}
                  >
                    SKIP
                  </button>
                </center>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal show={verifynum} className="modal fade modal-bx-info editor">
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
                    VERIFY MOBILE NUMBER
                  </h6>
                  <button
                    className="close"
                    style={{ float: "right" }}
                    onClick={() => {
                      setVerifynum(false);
                      dispatch(resetForgetPwdState());
                      dispatch(resetsendotpAction());
                    }}
                  >
                    <i
                      className="fa fa-times model-close"
                      onClick={() => setOtp(new Array(6).fill(""))}
                    ></i>
                  </button>
                </div>
                <center>
                  <span style={{ fontFamily: "Montserrat" }}>
                    Enter OTP sent to your mobile number.
                  </span>
                  <br></br>
                  <span>{otpRes?.data?.masked_to}</span>
                  {mins > 9 && secs > 9 && (
                    <p style={{ fontSize: "13px" }}>
                      OTP will expire in &nbsp;
                      <span className="badge badge-pill badge-info">
                        {mins}:{secs}
                      </span>{" "}
                      mins
                    </p>
                  )}
                  {mins < 10 && secs > 9 && (
                    <p style={{ fontSize: "13px" }}>
                      OTP will expire in &nbsp;
                      <span className="badge badge-pill badge-info">
                        0{mins}:{secs}
                      </span>{" "}
                      mins
                    </p>
                  )}
                  {mins > 9 && secs < 10 && (
                    <p style={{ fontSize: "13px" }}>
                      OTP will expire in &nbsp;
                      <span className="badge badge-pill badge-info">
                        {mins}:0{secs}
                      </span>{" "}
                      mins
                    </p>
                  )}
                  {mins < 10 && secs < 10 && (
                    <p style={{ fontSize: "13px" }}>
                      OTP will expire in &nbsp;
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
                      onChange={(e) => {
                        regex.numberTyping.test(e.target.value) &&
                          otpChanges(e, idx);
                      }}
                      value={otp[idx]}
                      onKeyDown={(e) => otpKeyChanges(e, idx)}
                    />
                  ))}
                  <br></br>
                  {verifyOtpMessage && (
                    <span className="form-error">{verifyOtpMessage}</span>
                  )}
                  <br />
                  <br />
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
                        verifyOTP();
                        setLoader2(true);
                      }}
                    >
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
                      onClick={() => {
                        setLoader4(true);
                        setTimeFunc();
                        sendOTP();
                        setLoader4(false);
                        setOtp(new Array(6).fill(""));
                      }}
                    >
                      {loader4 && (
                        <i
                          className="fa fa-circle-o-notch fa-spin"
                          style={{
                            marginRight: "10px",
                          }}
                        ></i>
                      )}
                      {loader4 ? "RESENDING OTP" : "RESEND OTP"}
                    </button>
                  )}
                </center>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        show={sucessModel}
        onHide={() => {
          setSuceesModel(false);
          setVerifynum(false);
          setNumver(false);
          dispatch(resetsendotpAction());
        }}
        className="modal fade modal-bx-info editor"
      >
        <div className="modal-dialog my-0  mx-0 w-100 " role="document">
          <div className="modal-content">
            <div className="modal-body">
              <h5 style={{ textAlign: "center" }}>REGISTRATION SUCCESSFULL</h5>
              <div className="success-checkmark">
                <div className="check-icon">
                  <span className="icon-line line-tip"></span>
                  <span className="icon-line line-long"></span>
                  <div className="icon-circle"></div>
                  <div className="icon-fix"></div>
                </div>
              </div>
              <h6
                style={{
                  textAlign: "center",
                  color: "green",
                  fontFamily: "Montserrat",
                }}
              >
                CONGRATULATIONS
              </h6>
              <center>
                <p style={{ fontFamily: "Montserrat" }}>
                  Your account has been created successfully!
                  <br /> Thank you for joining us.
                </p>
                <button
                  type="button"
                  className="site-button border border-primary btn-sm"
                  style={{
                    background: "white",
                    color: "#2e55fa",
                    borderColor: "#2e55fa",
                  }}
                  onClick={() => {
                    setVerifynum(false);
                    setNumver(false);
                    navigate("/jobSeekerSignin");
                    dispatch(resetsendotpAction());
                    dispatch(resetStateCreator());
                  }}
                >
                  Login
                </button>
              </center>
            </div>
          </div>
        </div>
      </Modal>
      {disPopUp && <EmailVerification />}
    </>
  );
}
export default JobSeekerRegister;
