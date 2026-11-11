import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import '../../../../assets/customCss/jobSeekerLogin.css'
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from "yup";
import { getUniqueId, regex } from '../../../../common/validation';
import { encryptInput } from '../../../../common/encrypt';
import { useDispatch, useSelector } from 'react-redux';
import {
    jobSeekerLogin,
    optLogin,
    resetActionCreator,
    resetSendOtp,
} from "../../../../redux/features/authentication/LoginSlice";
import { UseToastAlert } from '../../../../hooks/useToastAlert';
import { resetVerifyOtp, verifyOtpAndCrtToken } from '../../../../redux/features/authentication/verifyOtpSlice';
import { PatchSaveUnSaveJob } from '../../../../redux/features/jobs/saved-jobs/SavedJobsSlice';
import { environment } from '../../../../environments/environment';
import { sendOtp } from '../../../../redux/features/authentication/sendOtpSlice';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
let bnr = require("../../../../assets/images/common/jsLogin.png");
let logo = require("../../../../assets/images/Techkri-logo-blue.png");
const FORM_VALIDATION = Yup.object().shape({
    email: Yup.string()
        .required("Please enter your email address.")
        .email("Please enter your valid email address."),
    password: Yup.string().required("Please enter your password."),
});

function Job(props: any) {
    const [popup, setPopup] = useState(false);
    const [numver, setNumver] = useState(false);
    const [number, setNumber] = useState("");
    const [activeOtpIndex, setActiveOtpIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const [pointer, setPointer] = useState("pointer");
    const [numErr1, setNumErr1] = useState(false);
    const [backenderror, setBackenderror] = useState("");
    const [otp, setOtp] = useState(new Array(6).fill("")),
        [mins, setMins] = useState(0),
        [secs, setSecs] = useState(0),
        [loading, setLoading] = useState(false),
        [loader, setLoader] = useState(false),
        [loader2, setLoader2] = useState(false),
        [loader3, setLoader3] = useState(false),
        jobSeekerLoginRes = useSelector((state: any) => state.jobSeekerLogin),
        otpLoginRes = useSelector((state: any) => state.otpLogin),
        otpVerifiedRes = useSelector((state: any) => state.verifyAndCrtToken),
        { res } = jobSeekerLoginRes,
        [time, setTime] = useState(59),
        dispatch = useDispatch(),
        [uniqueId] = useState(getUniqueId()),
        navigate = useNavigate();
    const newReg = new RegExp(regex.numberRegx);
    const [displayErrorMessage, setDisplayErrorMessage] = useState("");
    const [displayError, setDisplayError] = useState("");
    const INITIAL_FORM_STATE: any = {
        email: "",
        password: "",
    };
    let randomString = (Math.random() + 1).toString(36).substring(7);
    const [passwordType, setPasswordType] = useState("password");
    const showSnackAlert = UseToastAlert();

    //useEffect
    useEffect(() => {
        inputRef.current?.focus();
    }, [activeOtpIndex]);

    useEffect(() => {
        if (popup) {
            const timer: any = time > 0 && setInterval(() => setTime(time - 1), 1000);
            setMins(Math.floor(time / 60));
            setSecs(time % 60);
            return () => clearInterval(timer);
        }
    }, [popup, time]);

    useEffect(() => {
        time > 0 ? setPointer("default") : setPointer("pointer");
    }, [time]);

    useEffect(() => {
        if (otpVerifiedRes?.res?.code === 200) {
            navigate("/jobseekerProfile");
            dispatch(resetVerifyOtp());
            sessionStorage.removeItem("trans_id");
            setLoader2(false);
        } else if (otpVerifiedRes?.res?.response?.status === 400) {
            setDisplayError(otpVerifiedRes?.res?.response?.data?.message);
            dispatch(resetVerifyOtp());
            setLoader2(false);
        }
    }, [otpVerifiedRes?.res?.code, otpVerifiedRes?.res?.response?.data]);

    useEffect(() => {
        if (res.code === 200) {
            const jobid = sessionStorage.getItem("jobid");
            sessionStorage.removeItem("jobid");

            if (jobid) {
                const datamdl = {
                    jobSeekerResp: {
                        jobid: jobid,
                        status: "SAVE",
                    },
                };
                dispatch(PatchSaveUnSaveJob(datamdl));
                sessionStorage.removeItem("jobid");
                navigate("/jobs/savedjobs");
            } else {
                navigate("/jobseekerProfile");
            }
            setLoading(false);
            dispatch(resetActionCreator());
        } else if (
            (res && res.response && res.response.status === 401) ||
            (res && res.response && res.response.status === 400)
        ) {
            setBackenderror(res?.response?.data.message);
            setLoading(false);
            dispatch(resetActionCreator());
        } else if (res && res.response && res.response.status !== 200) {
            setBackenderror(res?.response?.data.message);
            setLoading(false);
            dispatch(resetActionCreator());
        }
    }, [navigate, res]);

    const { saveOrUnsave, loadingSave } = useSelector(
        (state: any) => state.PatchSaveUnSaveJobSlice
    );

    useEffect(() => {
        if (
            otpLoginRes &&
            otpLoginRes.res &&
            otpLoginRes.res.response &&
            otpLoginRes.res.response.data &&
            otpLoginRes.res.response.data.code !== 200
        ) {
            setDisplayErrorMessage(otpLoginRes?.res?.response?.data?.message);
            setLoader(false);
            setPopup(false);
            setOtp(new Array(6).fill(""));
            dispatch(resetSendOtp());
        } else if (otpLoginRes && otpLoginRes.res && otpLoginRes.res.code === 200) {
            sessionStorage.setItem("trans_id", otpLoginRes?.res?.data?.txn_id);
            setPopup(true);
            setLoader(false);
            setDisplayErrorMessage("");
            setNumver(false);
            setLoader(false);
            dispatch(resetSendOtp());
        }
    }, [otpLoginRes]);

    //Internal functions

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
        setTime(Number(environment?.otp_time_sec));
    };

    const otpKeyChanges = (
        { key }: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        if (key === "Backspace" && !otp[index]) setActiveOtpIndex(index - 1);
        else if (key === "Backspace") setActiveOtpIndex(index - 0);
    };

    const MobileMessage = () => {
        if (!regex.mobileMaxLength.test(number)) {
            setNumErr1(true);
            setLoader(false);
        } else {
            setNumErr1(false);
            setLoader(false);
            setNumver(false);
        }
    };

    const otpLogin = (event: any) => {
        event.preventDefault();
        setNumver(true);
        setDisplayErrorMessage("");
        setDisplayError("");
        if (sendOtp) {
            const data = {
                code: "+91",
                phNo: number,
            };
            dispatch(optLogin(data));
        }
        if (!sendOtp) {
            const verificationInfo = {
                txn_id: otpLoginRes?.res?.data?.txn_id,
                otp: otp,
                state: {
                    uniqueid: uniqueId,
                    ondemandpage: "/adminDashboard",
                },
            };
            dispatch(verifyOtpAndCrtToken(verificationInfo));
        }
    };

    const verifyOtp = () => {
        const Otp = Number(
            `${otp[0]}${otp[1]}${otp[2]}${otp[3]}${otp[4]}${otp[5]}`
        );
        const verificationInfo = {
            txn_id: sessionStorage.getItem("trans_id"),
            otp: Otp,
            state: {
                uniqueid: uniqueId,
                ondemandpage: "/adminDashboard",
            },
        };
        dispatch(verifyOtpAndCrtToken(verificationInfo));
    };

    const reSendOtp = () => {
        const data = {
            code: "+91",
            phNo: number,
        };
        dispatch(optLogin(data));
    };

    const togglePassword = () => {
        setPasswordType(passwordType === "password" ? "text" : "password");
    };

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
                const stateData = window.btoa(JSON.stringify(state));
                const twitterUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${environment.twitterSso.client_id}&redirect_uri=${environment.runwayUrl}&scope=tweet.read%20users.read&state=${stateData}&code_challenge=${randomString}&code_challenge_method=plain`;
                window.location.href = twitterUrl;
                break;
            default:
                break;
        }
    }

    const [id] = useSearchParams(),
        [isTrue] = useSearchParams();

    return (
        <div className="page-content" style={{ background: '#ededed' }}>
            <div className="content-block">
                <div className="section-full browse-job content-inner-2">
                    <div className="container">
                        <div className='loginDiv'>
                            <div className='row maxHeight500'>
                                <div className='col-md-7 col-lg-7 col-sm-12 loginDivChild1'>
                                    <div>
                                        <h4 style={{ color: '#FFF' }}>Job Seeker Login</h4>
                                        <p className='desc'>To kick start your career and to grow or boost your career this is right place to login...</p>
                                        <div className='d-flex justify-content-around'>
                                            <img src={bnr} style={{ width: '75%' }}></img>
                                        </div>
                                        <div >
                                            <div className='d-flex justify-content-around'>
                                                <h5 className='textWhite'>looking for employer?</h5>
                                            </div>
                                            <div className='d-flex justify-content-center'>
                                                <button className='loginButton mr-3'>Login</button>
                                                <button className='regButton'>Register</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-md-5 col-lg-5 col-sm-12 loginDivChild2 backWhite'>
                                    <div className='d-flex justify-content-center' style={{ margin: '7% 0' }}>
                                        <img src={logo} style={{ width: '50%' }} />
                                    </div>
                                    <Formik
                                        initialValues={{
                                            ...INITIAL_FORM_STATE,
                                        }}
                                        validationSchema={FORM_VALIDATION}
                                        onSubmit={(values) => {
                                            const loginInfo = {
                                                authType: "credentials",
                                                authKey: values.email,
                                                pwd: values.password,
                                                state: {
                                                    uniqueid: uniqueId,
                                                    ondemandpage: "/jobseekerProfile",
                                                },
                                            };
                                            loginInfo.pwd = encryptInput(loginInfo.pwd);
                                            dispatch(jobSeekerLogin(loginInfo));
                                            setLoading(true);
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
                                                <form
                                                    onSubmit={handleSubmit}
                                                    className="col-12 p-a0 "
                                                    autoComplete="off"
                                                >
                                                    {props.errorMessage && (
                                                        <div className="bg-red-300 text-red-900 p-1 my-2">
                                                            {props.errorMessage}
                                                        </div>
                                                    )}
                                                    {props.successMessage && (
                                                        <div className="bg-green-300 text-green-900  p-1 my-2">
                                                            {props.successMessage}
                                                        </div>
                                                    )}
                                                    {!errors.email && backenderror && (
                                                        <p className="form-error custom-js-login-Sign-font">
                                                            {backenderror}
                                                        </p>
                                                    )}

                                                    <div className="form-group  ">
                                                        <div className="input-group">
                                                            <input
                                                                type="text"
                                                                autoComplete="off"
                                                                className={errors.email && touched.email ? "form-control marginRight loginError" : "form-control marginRight"}
                                                                placeholder="Enter Your Email Address"
                                                                maxLength={150}
                                                                value={values.email}
                                                                name="email"
                                                                onChange={(e: any) => {
                                                                    formik.handleChange(e);
                                                                    setBackenderror("");
                                                                }}
                                                                onBlur={handleBlur}
                                                            />
                                                        </div>

                                                        {/* {errors.email && touched.email ? (
                                                            <p className="form-error">{errors.email}</p>
                                                        ) : null} */}
                                                    </div>
                                                    <div className="form-group">
                                                        <div className="input-group">
                                                            <input
                                                                type={passwordType}
                                                                // className={(errors.password && touched.password) ? "form-control marginRight loginError" : "form-control marginRight"}
                                                                className="form-control marginRight"
                                                                autoComplete="off"
                                                                placeholder="Enter Your Password"
                                                                maxLength={16}
                                                                name="password"
                                                                onChange={formik.handleChange}
                                                                value={formik.values.password}
                                                                onBlur={handleBlur}
                                                            />
                                                        </div>

                                                        <div className="input-group">
                                                            <span className="custom-eye" onClick={togglePassword}>
                                                                {passwordType === "password" ? (
                                                                    <BsFillEyeSlashFill style={{ color: 'gray' }} />
                                                                ) : (
                                                                    <BsFillEyeFill />
                                                                )}
                                                            </span>
                                                        </div>
                                                        {/* {errors.password && touched.password ? (
                                                            <p className="form-error">{errors.password}</p>
                                                        ) : null} */}
                                                        {
                                                            errors.password && touched.password && showSnackAlert('warning',errors.password,4000)
                                                        }
                                                        <Link
                                                            to="/forgotPassword"
                                                            className="site-button-link forget-pass  float-right custom-forgot-pwd-style"
                                                            style={{ marginTop: "8px" }}
                                                        >
                                                            Forgot Password?
                                                        </Link>
                                                    </div>
                                                    <div className="text-center">
                                                        <button
                                                            className="site-button float-center w-100"
                                                            style={{ marginTop: "10px" }}
                                                            disabled={loading}
                                                        >
                                                            {loading && (
                                                                <i
                                                                    className="fa fa-circle-o-notch fa-spin"
                                                                    style={{ marginRight: "10px" }}
                                                                ></i>
                                                            )}
                                                            {loading ? "Logging in..." : "Login"}
                                                        </button>

                                                        <br />
                                                        <Link
                                                            onClick={() => {
                                                                setNumver(true);
                                                                setTimeFunc();
                                                                setNumber("");
                                                            }}
                                                            className="site-button-link forget-pass m-t10"
                                                            style={{
                                                                fontSize: "14px",
                                                                color: "#00407a",
                                                                fontWeight: 600
                                                            }}
                                                            to={""}
                                                        >
                                                            Use OTP to Login
                                                        </Link>
                                                        <div className="divider">
                                                            <span>or</span>
                                                        </div>
                                                        <ul className="d-flex justify-content-center" style={{ listStyle: 'none' }}>
                                                            <li
                                                                onClick={(e: any) => {
                                                                    ssoHandler("facebook");
                                                                }}
                                                            >
                                                                <div
                                                                    className="site-button  facebook circle m-r10  "
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
                                                        <div>
                                                            <span
                                                                style={{
                                                                    fontSize: "13px",
                                                                    color: '#858080'
                                                                }}
                                                            >
                                                                Need an Account?
                                                            </span>
                                                            <Link
                                                                to="/jobseekerregister"
                                                                className="site-button-link forget-pass m-t20 mb-5"
                                                                style={{
                                                                    color: "#00407a",
                                                                    fontSize: "14px",
                                                                    marginLeft: "20px",
                                                                    fontWeight: 600
                                                                }}
                                                            >
                                                                <i
                                                                    className="fa fa-unlock-alt"
                                                                    style={{ color: "#00407a" }}
                                                                ></i>{" "}
                                                                Register
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </form>
                                            )
                                        }}
                                    </Formik>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Job