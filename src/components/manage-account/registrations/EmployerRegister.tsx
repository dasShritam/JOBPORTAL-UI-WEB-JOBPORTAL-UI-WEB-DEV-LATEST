import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import Select from "react-select";
import { Link, useNavigate } from "react-router-dom";
import { Modal } from "react-bootstrap";
import React from "react";
import { Step, StepContent, StepLabel, Stepper } from "@material-ui/core";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import logo3 from "../../../assets/images/background/EmployerRegistration.png";
import "../../../assets/customCss/EmployeeRegister.css";
import {
  empRegister,
  resetEmpRegActionCreator,
} from "../../../redux/features/authentication/employerRegisterSlice";
import {
  resetEmpActionCreator,
  validateUser,
} from "../../../redux/features/authentication/userMailSlice";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import "../../../assets/customCss/OtpVerification.css";
import { getCountryCode } from "../../../redux/features/masterData/countrySlice";
import { getIndustryType } from "../../../redux/features/masterData/industrySlice";
import { regex } from "../../../common/validation";
let logo = require("../../../assets/images/Techkri-logo-blue.png");

const PATENT_FORM_VALIDATION_1 = Yup.object().shape({
    firstname: Yup.string()
      .matches(
        regex.firstname,
        "Numeric and Special characters are not allowed."
      )
      .trim("Empty space not allowed.")
      .min(1, "First Name must contains minimum 1 characters.")
      .max(100)
      .required("Please enter First Name."),
    lastname: Yup.string()
      .matches(
        regex.lastName,
        "Numeric and Special characters are not allowed."
      )
      .trim("Empty space not allowed.")
      .required("Please enter Last Name."),
    userEmail: Yup.string()
      .matches(
        regex.email,
        "Sorry, only letters, numbers and periods(.) are allowed."
      )
      .trim("Empty space not allowed")
      .required("Please enter Email Address."),
    country: Yup.string().notRequired(),
    mobileNumber: Yup.string()
      .required("Please enter Mobile Number.")
      .trim("Empty space not allowed.")
      .matches(
        regex.international_mobile,
        "Please enter Mobile Number with minimum of 6 digits and maximum of 12 digits."
      ),
  }),
  PATENT_FORM_VALIDATION_2 = Yup.object().shape({
    companyName: Yup.string()
      .matches(
        regex.companyName,
        `Please enter valid Company Name. Start with alphabets and allowed characters are numbers, spaces and ( & ' . , ( ) - @ _ ).`
      )
      .trim("Empty space not allowed.")
      .required("Please enter Company Name."),
    industryName: Yup.object().nullable().required("Please select Industry."),
    designation: Yup.string()
      .trim("Empty space not allowed.")
      .min(1, "Please enter Designation.")
      .required("Please enter Designation.")
      .matches(
        regex.designation,
        "Please enter valid Designation. Start with alphabets and allowed characters are numbers, spaces and ( - . )."
      ),
    pinCode: Yup.string()
      .trim("Empty space not allowed.")
      .matches(
        regex.pinCode,
        "Please enter Company Pin Code with minimum of 4 digits and maximum of 6 digits."
      )
      .required("Please enter Company Pin Code."),
    address: Yup.string()
      .trim("Empty space not allowed.")
      .min(1, "Please enter the Valid Company Address.")
      .required("Please enter Company Address."),
    termsAndConditions: Yup.bool().oneOf(
      [true],
      "Please accept the terms and conditions."
    ),
  });

let countries = new Array<Country>();
interface Country {
  value: string;
  label: string;
  phone: string;
}
let industries: any = new Array<Industry>();
interface Industry {
  value: String;
  label: string;
}
function getSteps() {
  return ["YOUR DETAILS", "COMPANY DETAILS"];
}

const EmployerReg = () => {
  //Variables
  const dispatch = useDispatch(),
    showSnackAlert = UseToastAlert(),
    [emailreg, setEmailreg] = useState(false),
    [selectedCountryCode, setSelectedCountryCode] = useState<any>({
      value: "0",
      label: "India",
      phone: "+91",
    }),
    [selectedPhone, setSelectedPhone] = useState(""),
    [mailErr, setMailErr] = useState(false),
    [mobileErr, setMobileErr] = useState(false),
    [CountryCodes, setCountryCode] = useState<any>();
  const navigate = useNavigate();
  const [industryValue, setIndustryValue] = useState<any>();
  const [btnClass, setBtnClass] = useState({
    className: "site-button float-center",
    style: { cursor: "default", backgroundColor: "#bdbebf" },
  });
  const [createbtn, setCreatebtn] = useState({
    className: "site-button float-center",
    style: { cursor: "default", backgroundColor: "#bdbebf" },
  });
  const [activeStep, setActiveStep] = React.useState(0);
  const { UserCheck, loadingU } = useSelector(
      (state: any) => state.userMailVerify
    ),
    { empReg, loading } = useSelector((state: any) => state.empRegister),
    { IndustryType } = useSelector((state: any) => state.industryType),
    { CountryCode } = useSelector((state: any) => state.countryCode);

  // const inputRef = useRef<any>(null);
  // useEffect(() => {
  //   inputRef.current.value = "";
  // }, []);

  const formik1: any = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      userEmail: "",
      mobileNumber: "",
      country: "",
    },
    validationSchema: PATENT_FORM_VALIDATION_1,
    onSubmit: (e: any) => {
      e.preventDefault();
      handleNext(e);
    },
  });

  const formik2: any = useFormik({
    initialValues: {
      companyName: "",
      industryName: "",
      designation: "",
      pinCode: "",
      address: "",
      termsAndConditions: false,
    },
    validationSchema: PATENT_FORM_VALIDATION_2,
    onSubmit: (e: any) => {
      e.preventDefault();
      handleNext(e);
      formik2.resetForm();
    },
  });
  const steps = getSteps();
  const isEnabled =
    !formik1.errors.lastname &&
    !formik1.errors.firstname &&
    !formik1.errors.mobileNumber &&
    !formik1.errors.userEmail &&
    formik1.values.firstname &&
    formik1.values.lastname &&
    formik1.values.mobileNumber &&
    formik1.values.userEmail &&
    !mobileErr &&
    !mailErr;
  const isSubmit =
    !formik2.errors.companyName &&
    !formik2.errors.designation &&
    !formik2.errors.industryName &&
    industryValue !== undefined &&
    !formik2.errors.pinCode &&
    !formik2.errors.address &&
    !formik2.errors.termsAndConditions &&
    formik2.values.companyName &&
    formik2.values.designation &&
    formik2.values.industryName &&
    formik2.values.pinCode.length > 3 &&
    formik2.values.pinCode.length < 7 &&
    formik2.values.address &&
    formik2.values.termsAndConditions;

  //UseEffect

  useEffect(() => {
    dispatch(getCountryCode({ pageno: -1, search: "" }));
    dispatch(getIndustryType({ pageno: -1, search: "" }));
    setEmailreg(false);
    setMailErr(false);
    dispatch(resetEmpActionCreator());
    setMobileErr(false);
  }, []);

  useEffect(() => {
    if (
      CountryCode &&
      CountryCode?.code &&
      CountryCode?.code === 200 &&
      !countries.length
    ) {
      CountryCode?.data.map((e: any, i: number) => {
        countries.push({
          value: `${1 + i}`,
          label: e.name,
          phone: e.code,
        });
      });
    }
    if (
      IndustryType &&
      IndustryType?.code &&
      IndustryType?.code === 200 &&
      !industries.length
    ) {
      IndustryType?.data.map((e: any, i: number) => {
        industries.push({ value: `${1 + i}`, label: e });
      });
    }
  }, [CountryCode, IndustryType]);
  useEffect(() => {
    if (isSubmit) {
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
  }, [isSubmit]);
  useEffect(() => {
    if (empReg && empReg.response && empReg.response.status !== 200) {
      showSnackAlert("warning", empReg?.response?.data?.message);
    }
    if (empReg && empReg?.code === 200 && typeof empReg !== "string") {
      setEmailreg(true);
      dispatch(resetEmpActionCreator());
      dispatch(resetEmpRegActionCreator());
    }
  }, [empReg?.response?.status, empReg?.code]);

  useEffect(() => {
    if (UserCheck && UserCheck.code && UserCheck.code === 200) {
      if (
        UserCheck?.data[0]?.key === "email" &&
        UserCheck?.data[0]?.exist === true
      ) {
        setMailErr(true);
      } else if (
        UserCheck?.data[0]?.key === "email" &&
        UserCheck?.data[0]?.exist === false
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

  //Internal function

  const handleNext = (e: any) => {
    e.preventDefault();
    if (
      !formik1.errors.lastname &&
      !formik1.errors.firstname &&
      !formik1.errors.mobileNumber &&
      formik1.values.firstname &&
      formik1.values.lastname &&
      formik1.values.mobileNumber &&
      formik1.values.userEmail &&
      !mobileErr &&
      !mailErr
    ) {
      setActiveStep((prevActiveStep: any) => prevActiveStep + 1);
    }
  };

  const validatePhone = () => {
    const phone = regex.international_mobile.test(selectedPhone);
    if (phone) {
      dispatch(
        validateUser({data:[
          {
            key: "phone",
            code: `${selectedCountryCode.phone}`,
            value: `${selectedPhone}`,
          },
        ]})
      );
    }
  };
  useEffect(() => {
    validatePhone();
  }, [selectedPhone, selectedCountryCode]);

  useEffect(() => {
    if (isSubmit) {
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
  }, [isSubmit]);

  const customFilter = (option, searchText) => {
    if (
      option.data.label.toLowerCase().includes(searchText.toLowerCase()) ||
      option.data.phone.toLowerCase().includes(searchText.toLowerCase())
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handlecreate = (e: any) => {
    e.preventDefault();
    if (
      !formik2.errors.companyName &&
      !formik2.errors.designation &&
      !formik2.errors.industryName &&
      industryValue !== undefined &&
      !formik2.errors.pinCode &&
      !formik2.errors.address &&
      !formik2.errors.termsAndConditions &&
      formik2.values.companyName &&
      formik2.values.designation &&
      formik2.values.industryName &&
      formik2.values.pinCode.length > 3 &&
      formik2.values.pinCode.length < 7 &&
      formik2.values.address &&
      formik2.values.termsAndConditions
    ) {
      // setActiveStep((prevActiveStep: any) => prevActiveStep + 1);
      // setPopup(true);
      dispatch(
        empRegister({
          empName: `${formik1.values.firstname} ${formik1.values.lastname}`,
          empMail: `${formik1.values.userEmail}`.toLowerCase(),
          empPhoneCode: formik1.values.country
            ? `${formik1.values.country}`
            : "+91",
          empPhoneNo: String(formik1.values.mobileNumber),
          empCompany: formik2.values.companyName,
          empType: industryValue?.label,
          empDesignation: formik2.values.designation,
          empPin: String(formik2.values.pinCode),
          empAddress: formik2.values.address,
        })
      );
    }
  };

  const handleBack = (e: any) => {
    e.preventDefault();
    setActiveStep((prevActiveStep: any) => prevActiveStep - 1);
  };

  function getStepContent(step: any) {
    const formatOptionLabel = (
        { label, phone }: Country,
        { context }: { context: string }
      ) => {
        if (context === "value") {
          return phone;
        }
        return (
          <div>
            {label} ({phone})
          </div>
        );
      },
      validateEmai = (e: any) => {
        e.preventDefault();
        const email = regex.email.test(e?.target?.value);
        if (email) {
          dispatch(
            validateUser({data:[
              {
                key: "email",
                value: e?.target?.value.toLowerCase(),
              },
            ]})
          );
        }
      };

    switch (step) {
      case 0:
        return (
          <div>
            <form autoComplete="off">
              <div className="form-group">
                <label className="font-weight-700">First Name</label>
                <span className="error"> *</span>
                <input
                  autoComplete="off"
                  maxLength={100}
                  name="firstname"
                  placeholder="Enter Your First Name"
                  type="text"
                  onChange={formik1.handleChange}
                  value={formik1.values.firstname}
                  onBlur={formik1.handleBlur}
                  className="form-control"
                  autoFocus
                />
                {formik1.errors.firstname && formik1.touched.firstname && (
                  <p className="form-error">{formik1.errors.firstname}</p>
                )}
              </div>
              <div className="form-group">
                <label className="font-weight-700">Last Name</label>
                <span className="error"> *</span>
                <input
                  autoComplete="false"
                  // list="autocompleteOff"
                  maxLength={50}
                  name="lastname"
                  placeholder="Enter Your Last Name"
                  type="text"
                  onChange={formik1.handleChange}
                  onBlur={formik1.handleBlur}
                  value={formik1.values.lastname}
                  className="form-control"
                />
                {formik1.errors.lastname && formik1.touched.lastname && (
                  <p className="form-error">{formik1.errors.lastname}</p>
                )}
              </div>

              <div className="form-group">
                <label className="font-weight-700">Email Address</label>
                <span className="error"> *</span>
                <input
                  autoComplete="off"
                  maxLength={150}
                  name="userEmail"
                  placeholder="Enter Your Email Address"
                  type="email"
                  onChange={formik1.handleChange}
                  onBlur={(e) => {
                    formik1.handleBlur(e);
                    validateEmai(e);
                  }}
                  value={formik1.values.userEmail}
                  className="form-control"
                />
                {!formik1.errors.userEmail && mailErr && (
                  <p className="form-error">
                    Please check, entered Email Address is already exists!
                  </p>
                )}
                {formik1.errors.userEmail && formik1.touched.userEmail && (
                  <>
                    <p className="form-error">{formik1.errors.userEmail}</p>
                  </>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="country">Mobile Number</label>
                <span className="error"> *</span>
                <div id="phonenumber">
                  <div style={{ width: "120px" }}>
                    <Select
                      maxMenuHeight={200}
                      minMenuHeight={200}
                      name="country"
                      options={countries}
                      value={selectedCountryCode}
                      placeholder="Select Code1"
                      defaultValue={{
                        value: "0",
                        label: "India",
                        phone: "+91",
                      }}
                      isSearchable={true}
                      onChange={(option: any) => {
                        setCountryCode(option?.phone);
                        setSelectedCountryCode(option);
                        formik1.setFieldValue("country", option.phone);
                      }}
                      onInputChange={(e) => {
                        if (e?.length > 5) return "";
                      }}
                      formatOptionLabel={formatOptionLabel}
                      filterOption={customFilter}
                      className="dropstyle"
                    />
                  </div>
                  <div>
                    <input
                      autoComplete="off"
                      name="mobileNumber"
                      id="phonenum"
                      type="text"
                      title=""
                      minLength={6}
                      maxLength={12}
                      placeholder="Enter Your Mobile Number"
                      onChange={(e) => {
                        regex.numberTyping.test(e.target.value) &&
                          formik1.handleChange(e);
                      }}
                      value={formik1.values.mobileNumber}
                      onBlur={(e) => {
                        formik1.handleBlur(e);
                        setSelectedPhone(e?.target?.value);
                      }}
                      className="form-control"
                    />
                  </div>
                </div>
                {!formik1.errors.mobileNumber && mobileErr && (
                  <p className="form-error">
                    Please check, entered Mobile Number is already exists!
                  </p>
                )}
                {formik1.errors.mobileNumber &&
                  formik1.touched.mobileNumber && (
                    <p className="form-error">{formik1.errors.mobileNumber}</p>
                  )}
              </div>
              <div>
                <button
                  id="nextbtn"
                  onClick={(e) => {
                    e.preventDefault();
                    formik1.handleSubmit();
                    handleNext(e);
                  }}
                  className={`${btnClass.className}`}
                  style={btnClass.style}
                  disabled={!isEnabled}
                >
                  NEXT
                  <ArrowForwardIosIcon className="nexticon" />
                </button>
              </div>
            </form>
          </div>
        );
      case 1:
        return (
          <div>
            <form autoComplete="off">
              <div>
                <div className="form-group">
                  <label className="font-weight-700">Company Name</label>
                  <span className="error"> *</span>
                  <input
                    autoComplete="off"
                    maxLength={100}
                    name="companyName"
                    placeholder="Enter Your Company Name"
                    type="text"
                    onChange={formik2.handleChange}
                    value={formik2.values.companyName}
                    onBlur={formik2.handleBlur}
                    className="form-control"
                  />
                  {formik2.errors.companyName &&
                    formik2.touched.companyName && (
                      <p className="form-error">{formik2.errors.companyName}</p>
                    )}
                </div>

                <div className="form-group">
                  <label htmlFor="industryName">Select Industry</label>
                  <span className="error"> *</span>
                  <Select
                    options={industries}
                    name="industryName"
                    className="dropstyle"
                    placeholder="Select Industry"
                    isClearable={true}
                    value={industryValue}
                    classNamePrefix="select"
                    onBlur={(e: any) => formik2.setFieldTouched}
                    onChange={(option: any) => {
                      let event = {
                        target: {
                          name: "industryName",
                          value: option,
                        },
                      };
                      formik2.handleChange(event);
                      setIndustryValue(option);
                    }}
                  />
                  {formik2.errors.industryName && (
                    <div className="form-error">
                      {formik2?.errors?.industryName}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="font-weight-700">Designation</label>
                  <span className="error"> *</span>
                  <input
                    autoComplete="off"
                    maxLength={100}
                    name="designation"
                    placeholder="Enter Your Designation"
                    type="text"
                    onChange={formik2.handleChange}
                    value={formik2.values.designation}
                    onBlur={formik2.handleBlur}
                    className="form-control"
                  />
                  {formik2.errors.designation &&
                    formik2.touched.designation && (
                      <p className="form-error">{formik2.errors.designation}</p>
                    )}
                </div>

                <div className="form-group">
                  <label className="font-weight-700">Company Pin Code</label>
                  <span className="error"> *</span>
                  <input
                    // ref={inputRef}
                    autoComplete="off"
                    name="pinCode"
                    placeholder="Enter Your Company Pin Code"
                    type="text"
                    maxLength={6}
                    title=""
                    minLength={4}
                    onChange={(e) => {
                      regex.numberTyping.test(e.target.value) &&
                        formik2.handleChange(e);
                    }}
                    value={formik2.values.pinCode}
                    onBlur={formik2.handleBlur}
                    className="form-control"
                  />
                  {formik2.errors.pinCode && formik2.touched.pinCode && (
                    <p className="form-error">{formik2.errors.pinCode}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="font-weight-700">Company Address</label>
                  <span className="error"> *</span>
                  <textarea
                    autoComplete="off"
                    id="address"
                    name="address"
                    placeholder="Enter Your Company Address"
                    maxLength={500}
                    onChange={formik2.handleChange}
                    value={formik2.values.address}
                    onBlur={formik2.handleBlur}
                    className="form-control"
                    style={{ paddingTop: "10px" }}
                  ></textarea>
                  {formik2.errors.address && formik2.touched.address && (
                    <p className="form-error">{formik2.errors.address}</p>
                  )}
                </div>
                <div>
                  <div style={{ display: "flex" }}>
                    <input
                      name="termsAndConditions"
                      id="checkbtn"
                      type="checkbox"
                      checked={formik2.values.termsAndConditions}
                      onChange={formik2.handleChange}
                      onBlur={formik2.handleBlur}
                    />
                    &nbsp; &nbsp;
                    <label
                      style={{
                        marginTop: "10px",
                        color: "#00000082",
                      }}
                    >
                      <span>
                        <label htmlFor="checkbtn">
                          I agree to&nbsp;
                          <a
                            href="/termsandcondition"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Terms &amp; Conditions
                          </a>
                        </label>
                      </span>
                      &nbsp;and&nbsp;
                      <span>
                        <a
                          href="/privacypolicy"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>
                  {formik2.errors.termsAndConditions &&
                    formik2.touched.termsAndConditions && (
                      <p className="form-error">
                        {formik2.errors.termsAndConditions}
                      </p>
                    )}
                </div>
              </div>
              <div id="btn">
                <button
                  className="site-button"
                  id="backbtn"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                >
                  <ArrowBackIosIcon className="backicon" />
                  BACK
                </button>

                <button
                  id="createbtn"
                  onClick={(e) => {
                    e.preventDefault();
                    formik2.handleSubmit();
                    handlecreate(e);
                  }}
                  type="submit"
                  className={`${createbtn.className}`}
                  style={{ ...createbtn.style, marginLeft: "211px" }}
                  disabled={
                    !isSubmit || UserCheck?.code !== 200 || loading || loadingU
                  }
                >
                  {loading && <i className="fa fa-circle-o-notch fa-spin"></i>}
                  {loading ? "REGISTERING..." : "REGISTER"}
                </button>
              </div>
            </form>
          </div>
        );
    }
  }
  return (
    <>
      <div
        className="browse-job login-background d-flex align-items-center"
        style={{ padding: "30px 0" }}
      >
        <div className="container">
          <div className="loginDiv">
            <div className="row">
              <div className="col-md-5 col-lg-5 col-sm-12 loginDivChild1">
                <div>
                  <h4 style={{ color: "#FFF" }}>Employer Registration</h4>
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
                      to={"/employerSignin"}
                    >
                      Log In
                    </Link>
                  </p>
                  <div className="logo">
                    <Link to={"#"}>
                      <img
                        src={logo3}
                        alt=""
                        style={{
                          margin: "18% 10px 30px 0px",
                        }}
                      />
                    </Link>
                  </div>

                  <button
                    className="emphomebtn"
                    onClick={() => {
                      navigate("/home");
                    }}
                  >
                    Go to Home
                  </button>
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
                  <Link to="/home">
                    <img
                      src={logo}
                      style={{ height: "86%" }}
                      title="Go to home page."
                    />
                  </Link>
                </div>
                <div className="row">
                  <div className="col-md-12 m-b30">
                    <div className="tab-content">
                      <form className="tab-pane active" autoComplete="off">
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
                      <div />
                    </div>
                    {/* </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={emailreg}
        onHide={() => {
          setEmailreg(false);
          dispatch(resetEmpActionCreator());
          dispatch(resetEmpRegActionCreator());
          navigate("/employerSignin");
        }}
        className="modal fade modal-bx-info editor"
      >
        <div className="modal-dialog my-0 mx-0 w-100 " role="document">
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
                {" "}
                CONGRATULATIONS{" "}
              </h6>
              <center>
                <p style={{ fontFamily: "Montserrat" }}>
                  Your account has been created successfully!
                  <br /> Thank you for joining us.
                </p>
              </center>
              <center>
                <p
                  style={{
                    color: "#0070a6",
                    fontWeight: "bold",
                  }}
                >
                  An account activation link has been sent to your registered
                  email address. Please activate the account.
                  <br />
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
                  setEmailreg(false);
                  dispatch(resetEmpActionCreator());
                  dispatch(resetEmpRegActionCreator());
                  navigate("/employerSignin");
                }}
              >
                GOT IT!
              </button>
              <br></br>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EmployerReg;
