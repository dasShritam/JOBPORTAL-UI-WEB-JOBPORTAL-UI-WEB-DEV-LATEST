import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { Formik } from "formik";
import React, { lazy, useEffect, useRef, useState } from "react";
import { Accordion, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { MdOutlineReplay } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import "../../../assets/customCss/JobSeekerRegister.css";
import {
  customStyles,
  getTimestampToDate,
  Content,
} from "../../../common/common";
import { charaterLength, regex } from "../../../common/validation";
import { environment } from "../../../environments/environment";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import { authJobSeekerRegister } from "../../../redux/features/admin/AuthJobseekerRegSlice";
import {
  resetEmpActionCreator,
  validateUser,
} from "../../../redux/features/authentication/userMailSlice";
import { JobSeekerData } from "../userManagement/UserManagement";
import AdminRegistration_Skeleton from "./adminRegistration_Skeleton";
import { Avatar, Chip, IconButton, Switch } from "@mui/material";
import { BsCloudDownload, BsPersonCircle } from "react-icons/bs";
import { TbClearAll } from "react-icons/tb";
import "../../../assets/customCss/Pagination.css";
import { ROLES } from "../../../config/app.config";
import {
  resendMail,
  resetResendMail,
  resetuserAccessibility,
  userAccessibility,
} from "../../../redux/features/admin/userManagement/UserManagementSlice";
import { downloadAppResume } from "../../../redux/features/employer/downloadMedia";
import { resetDownloadResume } from "../../../redux/features/manage-account/profile/userFilesSlice";
import {
  downloadSAS,
  successSAS,
} from "../../../redux/features/jobs/job-applications/downloadSASSlice";
import dayjs from "dayjs";
import { downloadUserInfo } from "../../../redux/features/admin/AuthEmployerRegSlice";
import { RiDownload2Fill } from "react-icons/ri";
const Pagination = lazy(() => import("rc-pagination"));

const INITIAL_FORM_STATE: any = {
  FullName: "",
  EmailId: "",
  MobileNumber: "",
  City: "",
  Country: "",
  Resume: "",
  Status: "",
  CountyCheckBox: "",
  Access: "true",
};
const FORM_VALIDATION = Yup.object().shape({
  FullName: Yup.string()
    .required("Please enter Full Name.")
    .trim("Empty space not allowed.")
    .matches(regex.fullName, "Numeric and special characters are not allowed.")
    .nullable(),
  EmailId: Yup.string()
    .required("Please enter Email Address.")
    .matches(regex.email, "Please specify valid Email Address."),
  MobileNumber: Yup.string()
    .required("Please enter Mobile Number.")
    .max(12)
    .matches(regex.indian_mobile, "Please enter valid Mobile Number.")
    .nullable(),
  Status: Yup.string().required("Please select Work Status."),
  Access: Yup.string().required("Please select Access."),
  City: Yup.string().when("Status", {
    is: "Fresher",
    then: Yup.string()
      .required("Please mention Current City.")
      .trim("Empty space not allowed."),
  }),
  CountyCheckBox: Yup.array().notRequired(),
  Country: Yup.string().when("CountyCheckBox", {
    is: (c: any) => (c ? c.toString() == "outsideIndia" : false),
    then: Yup.string().required("Please mention Current Country."),
  }),
  Resume: Yup.string(),
});
const FILTERACTIVEOPTION = [
  { label: "All Users", value: "All" },
  { label: "Only Active Users", value: "ACTIVE" },
  { label: "Only Inactive User", value: "INACTIVE" },
];
const ISFRESHEROPTION = [
  { label: "All Users", value: "All" },
  { label: "Only Freshers", value: "FRESHER" },
  { label: "Only Experienced", value: "EXPERIENCE" },
];

const JobSeekerRegistration = () => {
  var notFoundimg = require("../../../assets/images/background/No-record.png");
  const showSnackAlert = UseToastAlert();
  const [workStatus, setWorkStatus] = useState(null);
  const [cityDisplay, setCityDisplay] = useState(false);
  const [checked, setChecked] = useState(true);
  const [countries, setErrCountries] = useState(
    "Please mention current country."
  );
  const [fieldValue, setFieldValue] = useState<any>();
  const [mob, setMob] = useState("");
  const dispatch = useDispatch();
  const [value, setValue] = React.useState<any>(null);
  const [fileformat, setFileformat] = useState(false);
  const [filesize, setFilesize] = useState(false);
  const [lockerror, setLockerror] = useState(false);
  const [dobVal, setDobVal] = useState<any>();
  // const [dobVal, setDobVal] = useState<number>();
  const [dobClearErr, setDobClearErr] = useState(false);
  const [touchedDob, setTouchedDob] = useState(false);
  const [accessVal, setAccessVal] = useState("true");
  const [locationErr, setLocationErr] = useState(false);
  const myRef = useRef<any>(null);
  const executeScroll = () =>
    myRef?.current?.scrollIntoView({ behavior: "smooth" });
  const JobSeekerRegistered = useSelector(
    (state: any) => state.authJobSeekerRegster
  );
  const { UserCheck, loadingU } = useSelector(
    (state: any) => state.userMailVerify
  );
  const [emailreg, setEmailreg] = useState(false);
  const { res, loading } = JobSeekerRegistered;
  const [errormsg, setErrormsg] = useState<string>("");
  const [dobError, setDobError] = useState(false);
  const isExpRef = useRef<any>();
  const isFresherRef = useRef<any>(),
    [mailErr, setMailErr] = useState(false),
    [mobileErr, setMobileErr] = useState(false);
  const [clear, setClear] = useState<any>();
  const charLength = charaterLength;
  const { sasData, load } = useSelector((state: any) => state.downloadSAS);
  const JobData = useSelector((state: any) => state.JobSeekerData1);
  const { JobSeekerArray, loadingJobSeeker } = JobData;
  const [resetFilter, setResetFilter] = useState(false);
  const [Email, setEmail] = useState("");
  const [Em, setEm] = useState("");
  const [isPagination, setIspagination] = useState(false);
  const [expState, setExpState] = useState<any>("");
  const [Ex, setEx] = useState<any>("");
  const [IsactiveState, setIsactivestate] = useState<any>({
    label: "All Users",
    value: "All",
  });
  const [IsActive, setIsActive] = useState<any>({
    label: "All Users",
    value: "All",
  });
  const [isError, setIsError] = useState(false);
  const [currentpage, setCurrentPage] = useState(1),
    [perPage, setPerPage] = useState(10),
    [size, setSize] = useState(perPage);
  let resendMailState = useSelector((state: any) => state.resendMail);
  const [loaderr, setLoaderr] = useState<any>({});
  const [loaderid, setloaderid] = useState<any>();

  useEffect(() => {
    if (resendMailState?.loading) {
      setLoaderr((prevState) => ({ ...prevState, [loaderid]: true }));
    } else {
      setLoaderr((prevState) => ({ ...prevState, [loaderid]: false }));
    }
  }, [resendMailState?.loading]);
  let userAccessibilityState = useSelector(
    (state: any) => state.userAccessibility
  );
  async function dispatchfunction() {
    await dispatch(
      JobSeekerData({
        roleType: ROLES.JOBSEEKER,
        exp: !resetFilter
          ? expState
            ? expState.value == "All"
              ? ""
              : expState.value
            : ""
          : "",
        pageid: 1,
        userId: "",
        active: !resetFilter
          ? IsactiveState
            ? IsactiveState.value == "All"
              ? null
              : IsactiveState.value
            : null
          : null,
        emailId: !resetFilter ? (Email ? Email : "") : "",
        pageLimit: 10,
      })
    );
    setCurrentPage(1);
    setResetFilter(false);
  }
  useEffect(() => {
    resetFilter && setEmail("");
    setEx("");
    setEm("");
    setIsActive({
      label: "All Users",
      value: "All",
    });
    setIspagination(false);
    setExpState("");
    setIsactivestate({ label: "All Users", value: "All" });
    setCurrentPage(1);
  }, [resetFilter]);
  useEffect(() => {
    dispatchfunction();
  }, [userAccessibilityState, resetFilter]);
  useEffect(() => {
    dispatch(resetuserAccessibility());
  }, [useLocation().pathname]);

  useEffect(() => {
    if (isPagination) {
      setEmail(Em);
      setExpState(Ex);
      setIsactivestate(IsActive);
      dispatchfunction();
    }
  }, [isPagination, Email, expState, IsactiveState]);
  const PaginationChange = (page: any, pageSize: any) => {
    setIspagination(false);
    executeScroll();
    setCurrentPage(page);
    setSize(pageSize);

    dispatch(
      JobSeekerData({
        roleType: ROLES.JOBSEEKER,
        exp: expState ? (expState.value == "All" ? "" : expState.value) : "",
        pageid: page,
        userId: "",
        active: IsactiveState
          ? IsactiveState.value == "All"
            ? null
            : IsactiveState.value
          : null,
        emailId: Email ? Email : "",
        pageLimit: 10,
      })
    );
  };

  const PrevNextArrow = (current: any, type: any, originalElement: any) => {
    if (type === "prev") {
      return (
        <button
          title="prev"
          className="previous"
          style={{ borderColor: "#eae6e6", borderRadius: "2px" }}
        >
          <i className="ti-arrow-left"></i> Prev
        </button>
      );
    }

    if (type === "next") {
      return (
        <button
          title="next"
          style={{ borderColor: "#eae6e6", borderRadius: "2px" }}
          className="pagination"
        >
          Next <i className="ti-arrow-right"></i>
        </button>
      );
    }
    return originalElement;
  };

  useEffect(() => {
    if (
      JobSeekerArray &&
      JobSeekerArray?.userInfo &&
      JobSeekerArray?.userInfo?.length
    ) {
      const userids = JobSeekerArray?.userInfo?.map((e: any) => {
        return e?.userId;
      });
      userids.length
        ? dispatch(
            downloadSAS({
              id: [...userids],
              sasFor: "IMG",
            })
          )
        : dispatch(successSAS());
    }
  }, [JobSeekerArray]);
  useEffect(() => {
    setEmailreg(false);
    dispatch(resetEmpActionCreator());
  }, []);

  useEffect(() => {
    if (res?.code === 200) {
      setEmailreg(true);
      clearFunc();
      dispatchfunction();
    } else if (
      res &&
      res.response &&
      res.response.status &&
      res.response.status !== 200
    ) {
      showSnackAlert("warning", res?.response?.statusText);
    }
  }, [res, res?.code]);

  useEffect(() => {
    if (UserCheck && UserCheck?.code && UserCheck?.code === 200) {
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
    if (value === null || mobileErr) {
      setDobError(true);
    } else {
      setDobError(false);
    }
  }, [value, mobileErr]);

  useEffect(() => {
    if (isNaN(value?.$D) || isNaN(value?.$y) || isNaN(value?.$M)) {
      setDobError(true);
      setDobClearErr(true);
    } else {
      setDobError(false);
      setDobClearErr(false);
    }

    if (value) {
      const dob = new Date(`${value?.$y}, ${value?.$M + 1} ,${value?.$D}`);

      const currentDay = new Date();

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
              code: "+91",
              value: `${mob}`,
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
  }, [mob, dobVal, value]);

  //Internal function

  const handleResumeChange = (e: any) => {
    const selectedFile: any = e.target.files && e.target.files[0];
    const reader: any = new FileReader();
    reader.readAsArrayBuffer(selectedFile);
    reader.onload = function () {
      let file: any = new Blob([reader.result], { type: "application/pdf" });
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
  const handleCheck = () => {
    setChecked(checked ? false : true);
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

  const clearFunc = () => {
    clear?.e();
    setWorkStatus(null);
    setFieldValue(null);
    setValue(null);
    setClear(undefined);
    isExpRef.current.checked = false;
    isFresherRef.current.checked = false;
  };
  const handleSwal = () => {
    Swal.fire({
      title: "Do you want to add one more user",
      showCancelButton: true,
      confirmButtonColor: "#2a9f2a ",
      cancelButtonColor: "#db1919 ",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (!result.isConfirmed) {
        setHideJobseeker(false);
      }
    });
  };
  const handlesubmit = (values: any) => {
    let fresher: boolean;
    if (workStatus === "Fresher") {
      fresher = true;
    } else {
      fresher = false;
    }
    const mdl = {
      fullName: values.FullName,
      email: `${values.EmailId}`.toLowerCase(),
      phno: values.MobileNumber,
      fresher: fresher,
      currentcity: fresher == true ? values.City : "",
      currentcountry: fresher == true ? values.Country : "",
      access: values.Access === "true" ? true : false,
      dateofbirth: new Date(
        `${value?.$y}, ${value?.$M + 1} ,${value?.$D}`
      ).toLocaleString("fr-CA", {
        dateStyle: "short",
      }),
      country_code: "+91",
    };
    setAccessVal(values.Access);
    let formData = new FormData();
    formData.append("resume", fieldValue);
    formData.append("jsProfile", JSON.stringify(mdl)); //append the values with key, value pair
    // dispatch(authJobSeekerRegister(formData));

    handleConfirmSwal(formData);
  };
  const handleConfirmSwal = (formData: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to register this Jobseeker!",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(authJobSeekerRegister(formData));
      }
    });
  };

  useEffect(() => {
    if (cityDisplay && !checked) {
      if (countries) {
        setLocationErr(true);
      } else {
        setLocationErr(false);
      }
    } else {
      setLocationErr(false);
    }
  }, [checked, countries, cityDisplay]);

  const [hideJobseeker, setHideJobseeker] = useState<boolean>(false);
  // const [hideTable, setHideTabel] = useState(true);

  const handleClose = () => {
    setHideJobseeker(false);
    // setHideTabel(true)
  };

  const handleHideTable = () => {
    // setHideTabel(false);
    setHideJobseeker(true);
  };

  useEffect(() => {
    if (userAccessibilityState?.res?.code === 200) {
      showSnackAlert("success", userAccessibilityState?.res?.message);
      dispatch(resetuserAccessibility());
    } else if (userAccessibilityState?.res?.code === 400) {
      showSnackAlert("warning", userAccessibilityState?.res?.message);
      dispatch(resetuserAccessibility());
    } else if (userAccessibilityState?.res?.code === 500) {
      showSnackAlert("error", userAccessibilityState?.res?.message);
      dispatch(resetuserAccessibility());
    }
  }, [userAccessibilityState]);
  useEffect(() => {
    !resendMailState?.loading &&
      setLoaderr((prevState) => ({ ...prevState, [loaderid]: false }));
    if (resendMailState?.res?.code === 200) {
      showSnackAlert("success", resendMailState?.res?.message);
      dispatch(resetResendMail());
    } else if (resendMailState?.res?.code === 400) {
      showSnackAlert("warning", resendMailState?.res?.message);
      dispatch(resetResendMail());
    } else if (resendMailState?.res?.code === 500) {
      showSnackAlert("error", resendMailState?.res?.message);
      dispatch(resetResendMail());
    }
  }, [resendMailState]);

  function handleDeleteSwal(data, e) {
    const Ddata = {
      userId: data?.userId,
      accessType: !data?.active ? "ENABLE" : "DISABLE",
    };
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${
        Ddata.accessType == "ENABLE" ? "enable" : "disable"
      } user!`,
      showCancelButton: true,
      confirmButtonColor: "#2a9f2a ",
      cancelButtonColor: "#db1919 ",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(userAccessibility(Ddata));
      } else {
        e.target.checked = !e.target.checked;
      }
    });
  }
  let { resume, loading1 } = useSelector((state: any) => state.downloadAppRes);

  const resumeDownload = (id) => {
    dispatch(downloadAppResume(id));
  };
  useEffect(() => {
    if (!loading1 && resume.code === 200) {
      window.location.href = resume.data;
      dispatch(resetDownloadResume());
    }
  }, [loading1, resume]);
  const minDate = dayjs().subtract(70, "year");
  const minMonth = new Date().getMonth();
  const minDay = new Date().getDate();
  const maxDate = dayjs().add(10, "year");

  //download userdetails
  const { downUserInfo, loadingD } = useSelector(
    (state: any) => state.DownloadUserInfoData
  );

  return (
    <div>
      <Formik
        initialValues={{
          ...INITIAL_FORM_STATE,
        }}
        validationSchema={FORM_VALIDATION}
        onSubmit={(values, { resetForm }) => {
          !mailErr && !mobileErr && handlesubmit(values);
          setClear({ e: resetForm });
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
            dirty,
          } = formik;

          setWorkStatus(formik.values.Status);
          workStatus === "Fresher"
            ? setCityDisplay(true)
            : setCityDisplay(false);
          return (
            <>
              {/* -------------------------------- */}

              {hideJobseeker && (
                <div className="mb-5 ">
                  <div>
                    <div>
                      <center>
                        <h4
                          className="font-weight-700 m-b20"
                          style={{
                            color: "#7777d3",
                            marginBottom: "24px",
                          }}
                        >
                          MANAGE JOB SEEKER
                        </h4>
                      </center>
                    </div>
                  </div>
                  <div>
                    <div>
                      <div className="data">
                        <div className="col-lg-12 col-md-12 col-sm-12 m-b30">
                          {/* <button
                            type="button"
                            className="close"
                            onClick={handleClose}
                            style={{marginTop:"20%"}}
                          > 
                            <span aria-hidden="true">&times;</span>
                          </button> */}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            {/* <button
                              type="button"
                              className="close"
                              onClick={handleClose}
                              style={{
                                position: "absolute",
                                marginTop: "5%",
                                marginLeft: "87%",
                              }}
                            > 
                              <span aria-hidden="true">&times;</span>
                            </button> */}
                            <div
                              className="section-full"
                              style={{ marginTop: "10px" }}
                            >
                              <div className="container">
                                <div className="row ">
                                  <div className="registerForm-div">
                                    <div className="section-full content-inner browse-job shop-account">
                                      <div className="container">
                                        <div className="row">
                                          <div
                                            className="col-md-12 m-b30"
                                            style={{
                                              marginTop: "10px",
                                              marginLeft: "-23px",
                                            }}
                                          >
                                            <div
                                              className="p-a30 job-bx max-w900 radius-sm bg-white"
                                              style={{ width: "500px" }}
                                            >
                                              <div className="tab-content">
                                                <form
                                                  autoComplete="off"
                                                  id="login"
                                                  className="tab-pane active"
                                                  onSubmit={handleSubmit}
                                                >
                                                  <center>
                                                    <h4
                                                      className="font-weight-700 m-b20"
                                                      style={{
                                                        color: "#7777d3",
                                                        marginBottom: "24px",
                                                      }}
                                                    >
                                                      JOBSEEKER INFORMATION
                                                    </h4>
                                                  </center>

                                                  <button
                                                    type="button"
                                                    className="close"
                                                    onClick={() => {
                                                      handleClose();
                                                      formik.resetForm();
                                                      setFieldValue(null);
                                                      setDobVal(null);
                                                      setValue(null);
                                                      setTouchedDob(false);
                                                    }}
                                                    style={{
                                                      position: "absolute",
                                                      marginTop: "-13%",
                                                      marginLeft: "91%",
                                                    }}
                                                  >
                                                    <span aria-hidden="true">
                                                      &times;
                                                    </span>
                                                  </button>
                                                  <fieldset>
                                                    <div className="accessDiv d-flex">
                                                      <div
                                                        style={{
                                                          width: "200px",
                                                          marginLeft: "13px",
                                                        }}
                                                      >
                                                        <label>
                                                          <input
                                                            type="radio"
                                                            name="Access"
                                                            value="true"
                                                            className="card-input-element"
                                                            style={{
                                                              padding: "10px",
                                                            }}
                                                            checked={
                                                              values.Access ===
                                                              "true"
                                                            }
                                                            onChange={
                                                              handleChange
                                                            }
                                                          />
                                                          <div
                                                            className="panel panel-default card-input "
                                                            style={{
                                                              padding: "10px",
                                                            }}
                                                          >
                                                            <div className="panel-heading btn-design">
                                                              Portal access
                                                              allowed
                                                            </div>
                                                          </div>
                                                        </label>
                                                      </div>
                                                      <div>
                                                        <label>
                                                          <input
                                                            type="radio"
                                                            value="false"
                                                            name="Access"
                                                            className="card-input-element"
                                                            checked={
                                                              values.Access ===
                                                              "false"
                                                            }
                                                            onChange={
                                                              handleChange
                                                            }
                                                          />
                                                          <div
                                                            className="panel panel-default card-input"
                                                            style={{
                                                              padding: "10px",
                                                            }}
                                                          >
                                                            <div className="panel-heading btn-designs ">
                                                              Portal access
                                                              denied
                                                            </div>
                                                          </div>
                                                        </label>
                                                      </div>
                                                    </div>
                                                  </fieldset>
                                                  <div className="form-group">
                                                    <label className="font-weight-700">
                                                      Full Name
                                                      <span className="maditory">
                                                        *
                                                      </span>
                                                    </label>
                                                    <input
                                                      name="FullName"
                                                      className="form-control"
                                                      placeholder="Enter Full Name"
                                                      type="text"
                                                      autoComplete="off"
                                                      maxLength={150}
                                                      onChange={handleChange}
                                                      onBlur={handleBlur}
                                                      value={
                                                        formik.values.FullName
                                                      }
                                                    />
                                                    {errors.FullName &&
                                                      touched.FullName && (
                                                        <p className="form-error">
                                                          {errors.FullName}
                                                        </p>
                                                      )}
                                                  </div>
                                                  <div className="form-group">
                                                    <label className="font-weight-700">
                                                      Email Address
                                                      <span className="maditory">
                                                        *
                                                      </span>
                                                    </label>
                                                    <input
                                                      name="EmailId"
                                                      className="form-control abc"
                                                      placeholder="Enter Email Address"
                                                      type="text"
                                                      autoComplete="off"
                                                      maxLength={150}
                                                      onChange={handleChange}
                                                      onBlur={(e) => {
                                                        handleBlur(e);
                                                        validateEmail(e);
                                                      }}
                                                      value={
                                                        formik.values.EmailId
                                                      }
                                                    />
                                                    {!errors.EmailId &&
                                                      mailErr && (
                                                        <p
                                                          className="error"
                                                          style={{
                                                            fontSize: "13px",
                                                          }}
                                                        >
                                                          Please check, entered
                                                          Email Address already
                                                          exists!
                                                        </p>
                                                      )}
                                                    {errors.EmailId &&
                                                      touched.EmailId && (
                                                        <p className="form-error">
                                                          {errors.EmailId}
                                                        </p>
                                                      )}
                                                  </div>
                                                  <label className="font-weight-700">
                                                    Date of Birth
                                                    <span className="maditory">
                                                      *
                                                    </span>
                                                  </label>
                                                  <LocalizationProvider
                                                    dateAdapter={AdapterDayjs}
                                                  >
                                                    <DemoContainer
                                                      components={[
                                                        "DatePicker",
                                                      ]}
                                                    >
                                                      <DatePicker
                                                        value={value}
                                                        sx={{ width: "100%" }}
                                                        disableFuture={true}
                                                        format="DD-MM-YYYY"
                                                        onChange={(
                                                          newValue
                                                        ) => {
                                                          setValue(newValue);
                                                          setDobVal(newValue);
                                                          if (
                                                            newValue.$y <
                                                            minDate.year()
                                                          ) {
                                                            setIsError(true);
                                                          } else if (
                                                            minDate.year() ===
                                                            newValue.$y
                                                          ) {
                                                            if (
                                                              newValue.$M <
                                                              minMonth
                                                            ) {
                                                              setIsError(true);
                                                            } else if (
                                                              newValue.$M ===
                                                                minMonth &&
                                                              newValue.$D <
                                                                minDay
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
                                                      />
                                                    </DemoContainer>
                                                  </LocalizationProvider>
                                                  {isError && (
                                                    <p
                                                      className="form-error"
                                                      style={{
                                                        marginTop: "-15px",
                                                      }}
                                                    >
                                                      {
                                                        " Please select a date within the last 70 years."
                                                      }
                                                    </p>
                                                  )}

                                                  {value === null &&
                                                    touchedDob &&
                                                    res?.code !== 200 && (
                                                      <p
                                                        className="form-error"
                                                        style={{
                                                          marginTop: "-10px",
                                                        }}
                                                      >
                                                        {
                                                          "Please select Date of Birth."
                                                        }
                                                      </p>
                                                    )}
                                                  {value === null &&
                                                    touched.MobileNumber &&
                                                    !touchedDob &&
                                                    res?.code !== 200 && (
                                                      <p
                                                        className="form-error"
                                                        style={{
                                                          marginTop: "-10px",
                                                        }}
                                                      >
                                                        {
                                                          "Please select Date of Birth."
                                                        }
                                                      </p>
                                                    )}
                                                  {dobClearErr &&
                                                    value !== null &&
                                                    res?.code !== 200 && (
                                                      <p
                                                        className="form-error"
                                                        style={{
                                                          marginTop: "-10px",
                                                        }}
                                                      >
                                                        {
                                                          "Please select Date of Birth."
                                                        }
                                                      </p>
                                                    )}
                                                  <div className="form-group">
                                                    <label className="font-weight-700">
                                                      Mobile Number
                                                      <span className="maditory">
                                                        *
                                                      </span>
                                                    </label>
                                                    <input
                                                      name="MobileNumber"
                                                      id="phonenums"
                                                      className="form-control w-100"
                                                      placeholder="Enter Mobile Number"
                                                      autoComplete="off"
                                                      maxLength={10}
                                                      onBlur={handleBlur}
                                                      style={{
                                                        paddingLeft: "42px",
                                                      }}
                                                      onChange={(e) => {
                                                        regex.numberTyping.test(
                                                          e.target.value
                                                        ) && handleChange(e);
                                                        setMob(e.target.value);
                                                      }}
                                                      value={
                                                        formik.values
                                                          .MobileNumber
                                                      }
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
                                                    {!errors.MobileNumber &&
                                                      mobileErr && (
                                                        <p
                                                          className="form-error"
                                                          style={{
                                                            marginTop: "-23px",
                                                            marginBottom:
                                                              "50px",
                                                          }}
                                                        >
                                                          Please check, entered
                                                          Mobile Number already
                                                          exists!
                                                        </p>
                                                      )}
                                                    {errors.MobileNumber &&
                                                      touched.MobileNumber && (
                                                        <p
                                                          className="form-error"
                                                          style={{
                                                            marginTop: "-22px",
                                                            marginBottom:
                                                              "50px",
                                                          }}
                                                        >
                                                          {errors.MobileNumber}
                                                        </p>
                                                      )}
                                                  </div>
                                                  <div
                                                    className="form-group"
                                                    style={{
                                                      marginTop: "-30px",
                                                    }}
                                                  >
                                                    <label className="font-weight-700">
                                                      Work Status
                                                      <span className="maditory">
                                                        *
                                                      </span>
                                                    </label>
                                                    <br />
                                                    <div className="workStatusDiv">
                                                      <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                                        <label>
                                                          <input
                                                            type="radio"
                                                            name="Status"
                                                            className="card-input-element-status"
                                                            onChange={
                                                              handleChange
                                                            }
                                                            style={{
                                                              padding: "10px",
                                                            }}
                                                            onClick={() => {
                                                              values.City = "";
                                                              values.Country =
                                                                "";
                                                              values.CountyCheckBox =
                                                                "";
                                                              setChecked(true);
                                                            }}
                                                            ref={isExpRef}
                                                          />
                                                          <div
                                                            className="panel panel-default card-input "
                                                            style={{
                                                              padding: "10px",
                                                            }}
                                                          >
                                                            <div
                                                              className="panel-heading"
                                                              style={{
                                                                padding:
                                                                  "2px 30px",
                                                              }}
                                                            >
                                                              Is Experienced
                                                            </div>
                                                          </div>
                                                        </label>
                                                      </div>
                                                      <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                                        <label>
                                                          <input
                                                            type="radio"
                                                            value="Fresher"
                                                            name="Status"
                                                            onChange={
                                                              handleChange
                                                            }
                                                            className="card-input-element-status"
                                                            ref={isFresherRef}
                                                          />
                                                          <div
                                                            className="panel panel-default card-input"
                                                            style={{
                                                              padding: "10px",
                                                            }}
                                                          >
                                                            <div
                                                              className="panel-heading"
                                                              style={{
                                                                padding:
                                                                  "2px 30px",
                                                              }}
                                                            >
                                                              Is Fresher
                                                            </div>
                                                          </div>
                                                        </label>
                                                      </div>
                                                    </div>
                                                    {touched.Status &&
                                                      errors.Status && (
                                                        <p className="form-error">
                                                          {errors.Status}
                                                        </p>
                                                      )}
                                                  </div>
                                                  {cityDisplay && (
                                                    <div className="form-group">
                                                      <label className="font-weight-700">
                                                        Current City
                                                        <span className="maditory">
                                                          *
                                                        </span>
                                                      </label>
                                                      <div
                                                        className="checkbox-div"
                                                        id="checkBox"
                                                      >
                                                        <input
                                                          type="checkbox"
                                                          className="countyPointer"
                                                          name="CountyCheckBox"
                                                          value="outsideIndia"
                                                          maxLength={100}
                                                          onChange={(e) => {
                                                            handleChange(e);
                                                            handleCheck();
                                                          }}
                                                          id="check1"
                                                        />
                                                        <label
                                                          htmlFor="check1"
                                                          className="countyPointer"
                                                        >
                                                          &nbsp;Outside India
                                                        </label>
                                                      </div>
                                                      <input
                                                        id="city"
                                                        name="City"
                                                        className="form-control"
                                                        placeholder="Mention the city you live in"
                                                        type="text"
                                                        autoComplete="off"
                                                        onBlur={handleBlur}
                                                        maxLength={100}
                                                        onChange={(event) => {
                                                          if (
                                                            event?.target?.value.match(
                                                              regex.alphabetSpaceTyping
                                                            )
                                                          ) {
                                                            handleChange(event);
                                                          }
                                                          if (
                                                            event?.target
                                                              ?.value == ""
                                                          ) {
                                                            handleChange(event);
                                                          }
                                                        }}
                                                        value={
                                                          formik.values.City
                                                        }
                                                      />
                                                      {errors.City &&
                                                        touched.City && (
                                                          <p className="form-error">
                                                            {errors.City}
                                                          </p>
                                                        )}
                                                    </div>
                                                  )}
                                                  {cityDisplay && !checked && (
                                                    <div className="form-group">
                                                      <label className="font-weight-700">
                                                        Current Country
                                                        <span className="maditory">
                                                          *
                                                        </span>
                                                      </label>
                                                      <input
                                                        name="Country"
                                                        className="form-control"
                                                        placeholder="Mention the country where you are staying"
                                                        type="text"
                                                        maxLength={100}
                                                        autoComplete="off"
                                                        onBlur={handleBlur}
                                                        onChange={(event) => {
                                                          if (
                                                            event?.target?.value.match(
                                                              regex.alphabetSpaceTyping
                                                            )
                                                          ) {
                                                            handleChange(event);
                                                          }
                                                          if (
                                                            event?.target
                                                              ?.value == ""
                                                          ) {
                                                            handleChange(event);
                                                          }
                                                        }}
                                                        value={
                                                          formik.values.Country
                                                        }
                                                      />
                                                      {errors.Country ? (
                                                        <p className="form-error">
                                                          {errors.Country}
                                                        </p>
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
                                                        (docx, pdf)(Max: 2MB)
                                                      </span>
                                                    </label>
                                                    <form className="attach-resume">
                                                      <div className="row">
                                                        <div className="col-lg-12 col-md-12 uploadResume">
                                                          <div className="">
                                                            <p
                                                              className="m-auto align-self-center"
                                                              style={{
                                                                fontSize:
                                                                  "14px",
                                                                color:
                                                                  "#815bb5",
                                                              }}
                                                            >
                                                              <div
                                                                className="file-upload"
                                                                style={{
                                                                  display:
                                                                    "flex",
                                                                }}
                                                              >
                                                                <label className="file-upload-label-resume text-light">
                                                                  <input
                                                                    title={
                                                                      formik
                                                                        .values
                                                                        .Resume
                                                                    }
                                                                    accept=".pdf,.docx,"
                                                                    className="file-upload-input"
                                                                    style={{
                                                                      zIndex:
                                                                        -1,
                                                                    }}
                                                                    type="file"
                                                                    value={
                                                                      formik
                                                                        .values
                                                                        .Resume
                                                                    }
                                                                    onChange={(
                                                                      event: any
                                                                    ) => {
                                                                      handleResumeChange(
                                                                        event
                                                                      );
                                                                    }}
                                                                  />
                                                                  Upload Resume
                                                                </label>
                                                                {fieldValue ? (
                                                                  <div className="file-upload-preview">
                                                                    <span
                                                                      className="file-name"
                                                                      title={
                                                                        fieldValue.name
                                                                      }
                                                                    >
                                                                      {GetTinyFileName(
                                                                        fieldValue.name
                                                                      )}
                                                                    </span>
                                                                    <label className="replace-button"></label>
                                                                    <button
                                                                      className="remove-button"
                                                                      onClick={() => {
                                                                        setFieldValue(
                                                                          null
                                                                        );
                                                                      }}
                                                                    >
                                                                      <i className="fa fa-trash-o fa-12px"></i>
                                                                    </button>
                                                                  </div>
                                                                ) : (
                                                                  <div
                                                                    style={{
                                                                      display:
                                                                        "flex",
                                                                    }}
                                                                  >
                                                                    <p
                                                                      style={{
                                                                        borderRadius:
                                                                          "20px",
                                                                        marginTop:
                                                                          "10px",
                                                                      }}
                                                                    >
                                                                      &nbsp; No
                                                                      file
                                                                      choosen...
                                                                    </p>
                                                                  </div>
                                                                )}
                                                              </div>
                                                            </p>
                                                          </div>
                                                        </div>
                                                        {errormsg && (
                                                          <div>{errormsg}</div>
                                                        )}
                                                      </div>
                                                    </form>
                                                    <div>
                                                      {fileformat && (
                                                        <p className="form-error">
                                                          Please select a pdf or
                                                          doc file.
                                                        </p>
                                                      )}
                                                      {filesize && (
                                                        <p className="form-error">
                                                          File size should not
                                                          exceed 2MB.
                                                        </p>
                                                      )}
                                                      {lockerror && (
                                                        <p className="form-error">
                                                          User does not have
                                                          permission to upload
                                                          protected file.
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
                                                      Recruiters give first
                                                      preference to candidates
                                                      who have resume.
                                                    </span>
                                                    <br />
                                                  </div>
                                                  <div
                                                    className="text-left"
                                                    id="btnRegister"
                                                    style={{
                                                      marginTop: "40px",
                                                    }}
                                                  >
                                                    {!isValid && (
                                                      <button
                                                        type="submit"
                                                        className="site-button float-center w-100"
                                                        disabled={
                                                          value === null &&
                                                          dobError &&
                                                          UserCheck?.code !==
                                                            200
                                                        }
                                                        style={{
                                                          cursor: "default",
                                                          backgroundColor:
                                                            "#bdbebf",
                                                        }}
                                                      >
                                                        Register
                                                      </button>
                                                    )}
                                                    {isValid && (
                                                      <button
                                                        type="submit"
                                                        id="CursorPointer"
                                                        disabled={
                                                          UserCheck?.code !==
                                                            200 ||
                                                          dobError ||
                                                          loading ||
                                                          loadingU ||
                                                          mailErr
                                                        }
                                                        className="site-button float-center btn-lg"
                                                        style={{
                                                          fontSize: "14px",
                                                          width: "100%",
                                                          backgroundColor: `${
                                                            dobError ||
                                                            mailErr == true
                                                              ? "#bdbebf"
                                                              : ""
                                                          }`,
                                                        }}
                                                      >
                                                        {loading && (
                                                          <i
                                                            className="fa fa-circle-o-notch fa-spin"
                                                            style={{
                                                              marginRight:
                                                                "10px",
                                                            }}
                                                          ></i>
                                                        )}
                                                        {loading
                                                          ? "Registering..."
                                                          : "Register"}
                                                      </button>
                                                    )}
                                                  </div>
                                                </form>
                                              </div>
                                            </div>
                                          </div>
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
                              }}
                              className="modal fade modal-bx-info editor"
                            >
                              <div
                                className="modal-dialog my-0 mx-0 w-100 "
                                role="document"
                              >
                                <div className="modal-content">
                                  <div className="modal-body">
                                    <h5 style={{ textAlign: "center" }}>
                                      REGISTRATION SUCCESSFULL
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
                                        Jobseeker information registered
                                        successfully.
                                      </p>
                                    </center>
                                    {accessVal === "true" && (
                                      <p
                                        style={{
                                          color: "#0070a6",
                                          fontWeight: "bold",
                                          fontSize: "14px",
                                        }}
                                      >
                                        An account activation link has been sent
                                        to respective registered email address.
                                        <br />
                                      </p>
                                    )}
                                    {accessVal === "false" && (
                                      <center>
                                        <p
                                          style={{
                                            color: "#0070a6",
                                            fontWeight: "bold",
                                            fontSize: "14px",
                                          }}
                                        >
                                          Account has been created and Jobseeker
                                          information has been saved in our
                                          database.
                                          <br />
                                        </p>
                                      </center>
                                    )}
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
                                        handleSwal();
                                      }}
                                    >
                                      GOT IT!
                                    </button>
                                    <br></br>
                                  </div>
                                </div>
                              </div>
                            </Modal>
                          </div>
                          <div
                            className="icon-bx-wraper p-a30 center radius-sm"
                            style={{ marginTop: "20%" }}
                          >
                            {/* <div
                              className="icon-content"
                              style={{ textAlign: "left", marginLeft: "100px" }}
                            >
                              <h5
                                className="dlab-tilte text-uppercase"
                                style={{ marginBottom: "15px" }}
                              >
                                On registering, you can
                              </h5>
                              <div>
                                <p>
                                  <i
                                    className="fa fa-check-circle"
                                    style={{ color: "#18c1a3" }}
                                  ></i>
                                  &nbsp; On <b>Portal access allowed</b> an
                                  account activation link will be sent to
                                  registered email.
                                </p>
                                <p>
                                  <i
                                    className="fa fa-check-circle"
                                    style={{ color: "#18c1a3" }}
                                  ></i>
                                  &nbsp; On <b>Portal access denied </b>account
                                  activation link will not be sent.
                                </p>
                              </div>
                            </div> */}
                            {/* <div>
                              <div className="bg-img-fix">
                                <img src={bnr} style={{ width: "40%" }}></img>
                              </div>
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* -------------------------------- */}

              {!hideJobseeker && !loadingJobSeeker && (
                <div className="page-content bg-white">
                  <div className="content-block">
                    <div
                      className="browse-job section-full bg-white p-t50 p-b20"
                      // ref={inputRef}
                    >
                      <div className="container">
                        <div className="row" ref={myRef}>
                          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 m-b30 mt-5">
                            <div className="job-bx browse-job clearfix">
                              <div className="job-bx-title  clearfix">
                                <h5 className="font-weight-700 pull-left text-uppercase">
                                  MANAGE JOB SEEKER
                                </h5>
                                <div className="float-right">
                                  <Chip
                                    label={
                                      <span className="custom-job-content text-bold">
                                        Total Count
                                      </span>
                                    }
                                    avatar={
                                      <Avatar
                                        className="btn site-button btn-sm "
                                        style={{
                                          color: "white",
                                          backgroundColor: "blue",
                                        }}
                                      >
                                        {JobSeekerArray?.totalCount
                                          ? JobSeekerArray?.totalCount
                                          : "0"}
                                      </Avatar>
                                    }
                                  />
                                  {JobSeekerArray?.userInfo?.length !== 0 && (
                                    <Link
                                      // style={{ marginLeft: "90%" }}
                                      className="ml-3"
                                      to={""}
                                      style={{
                                        borderRadius: "0px",
                                        color: "white",
                                        backgroundColor: "rgb(14 173 105)",
                                      }}
                                      id="down-icon"
                                      download="filename.csv"
                                      onClick={() => {
                                        const details = {
                                          userType: "JOBSEEKER",
                                          id: 1,
                                        };
                                        dispatch(downloadUserInfo(details));
                                      }}
                                      title="Download total Jobseeker Info"
                                    >
                                      <BsCloudDownload />
                                    </Link>
                                  )}
                                </div>
                                <br />
                              </div>
                              <div
                                className="row mb-2"
                                style={{ display: "flex" }}
                              >
                                <button
                                  className="site-button btn-success add-btn mt-1"
                                  style={{ marginRight: "20px" }}
                                  onClick={handleHideTable}
                                >
                                  Invite Job Seeker
                                </button>
                              </div>
                              <div className="row">
                                <div className="col-xl-3 col-lg-4 col-md-5 col-sm-12 m-b30">
                                  <aside
                                    id="accordion1"
                                    className="sidebar-filter bg-white"
                                  >
                                    <Accordion defaultActiveKey="0">
                                      <h6 className="title">
                                        <div className="d-flex justify-content-between align-items-center">
                                          <div>
                                            <i
                                              className="fa fa-filter"
                                              aria-hidden="true"
                                              style={{ color: "orange" }}
                                            ></i>{" "}
                                            Filters{" "}
                                          </div>
                                          <div>
                                            <Link
                                              to={"#"}
                                              onClick={() => {
                                                setResetFilter(true);
                                              }}
                                              className="font-12 float-right"
                                            >
                                              <TbClearAll /> Reset
                                            </Link>{" "}
                                          </div>
                                        </div>
                                      </h6>
                                      <Accordion.Collapse eventKey="0">
                                        <div
                                          id="companies"
                                          className="acod-body collapse show"
                                        >
                                          <div className="acod-content">
                                            <input
                                              className="form-control mb-3"
                                              type="search"
                                              // value={filterData}
                                              value={Em}
                                              placeholder="Email Address"
                                              aria-label="Search "
                                              onChange={(e: any) => {
                                                setEm(e.target.value);
                                                //  setEmail(e.target.value);
                                              }}
                                            />
                                            {/* <span
                                              style={{
                                                position: "relative",
                                                top: "-30px",
                                                left: "90%",
                                                fontSize: "14px",
                                                cursor: "pointer",
                                              }}
                                            >
                                              <GrSearch
                                                onClick={() => {
                                                  Email && dispatchfunction();
                                                  // emailSearchHandler();
                                                }}
                                              />
                                            </span> */}

                                            <Select
                                              name="AreaOfConcern mb-3"
                                              className="dropstyle"
                                              styles={customStyles}
                                              placeholder="Filer by active user"
                                              id="react-select-4-listbox areaOfConcern"
                                              defaultValue={{
                                                label: "All Users",
                                                value: "All",
                                              }}
                                              options={FILTERACTIVEOPTION}
                                              value={IsActive}
                                              onChange={(option: any) => {
                                                // setIsactivestate(option);
                                                setIsActive(option);
                                              }}
                                            />
                                            <br />
                                            <Select
                                              name="UserType"
                                              className="dropstyle"
                                              styles={customStyles}
                                              placeholder="Select Experience"
                                              id="react-select-4-listbox areaOfConcern"
                                              isClearable={true}
                                              options={ISFRESHEROPTION}
                                              value={Ex}
                                              onChange={(option: any) => {
                                                // setExpState(option);
                                                setEx(option);
                                              }}
                                            />
                                            <br />
                                            <button
                                              className="col-lg-12 site-button border border-primary btn-sm  mb-2"
                                              style={{ zIndex: "0" }}
                                              onClick={() => {
                                                (Email != "" ||
                                                  expState?.value !=
                                                    undefined ||
                                                  IsactiveState.value !=
                                                    undefined) &&
                                                  setEmail(Em);
                                                setExpState(Ex);
                                                setIsactivestate(IsActive);
                                                // searchHandler();
                                                setIspagination(true);
                                                // dispatchfunction();
                                              }}
                                            >
                                              Search
                                            </button>
                                          </div>
                                        </div>
                                      </Accordion.Collapse>
                                    </Accordion>
                                  </aside>
                                </div>
                                {/* no record */}
                                {(JobSeekerArray?.userInfo?.length === 0 ||
                                  !JobSeekerArray?.userInfo) && (
                                  <center>
                                    <div
                                      className="col-xl-9 col-lg-8 col-md-7"
                                      style={{ marginLeft: "29%" }}
                                    >
                                      <img src={notFoundimg} alt="" />
                                      <h6
                                        style={
                                          {
                                            // fontSize: "13px",
                                            // fontWeight: "bold",
                                          }
                                        }
                                      >
                                        Oops no record found.
                                      </h6>
                                    </div>
                                  </center>
                                )}

                                {/* table */}
                                {JobSeekerArray?.userInfo &&
                                  JobSeekerArray?.userInfo?.length !== 0 && (
                                    <div className="col-xl-9 col-lg-8 col-md-7">
                                      <table className="table-job-bx cv-manager company-manage-job">
                                        <thead>
                                          <tr>
                                            <th>User Details</th>
                                            <th>Contact Number</th>
                                            <th>DOB</th>
                                            <th>Experienced</th>
                                            <th className="text-center">
                                              Action
                                            </th>
                                            {/* <th>Resume</th>
                                            <th>Status</th> */}
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {JobSeekerArray?.userInfo?.length >
                                            0 &&
                                            JobSeekerArray?.userInfo?.map(
                                              (data, index) => (
                                                <tr key={data?.userId}>
                                                  <td className="job-name d-flex">
                                                    <>
                                                      <div
                                                        style={{
                                                          color: "lightgray",
                                                          width: "47px",
                                                        }}
                                                      >
                                                        {sasData?.code ===
                                                          200 &&
                                                          sasData?.data?.filter(
                                                            (e) =>
                                                              e?.id ===
                                                              data?.userId
                                                          )[0]?.img_sas
                                                            ?.length !== 0 && (
                                                            <img
                                                              alt=""
                                                              style={{
                                                                borderRadius:
                                                                  "50%",
                                                                width: "47px",
                                                                height: "47px",
                                                              }}
                                                              src={
                                                                sasData?.data?.filter(
                                                                  (e) =>
                                                                    e?.id ===
                                                                    data?.userId
                                                                )[0]?.img_sas
                                                              }
                                                            />
                                                          )}
                                                        {(sasData?.code !==
                                                          200 ||
                                                          sasData?.data?.filter(
                                                            (e) =>
                                                              e?.id ===
                                                              data?.userId
                                                          )[0]?.img_sas
                                                            ?.length === 0) && (
                                                          <BsPersonCircle
                                                            style={{
                                                              width: "47px",
                                                              fontSize: "47px",
                                                              color:
                                                                "lightgray",
                                                            }}
                                                          />
                                                        )}
                                                      </div>
                                                    </>
                                                    <div className="ml-1">
                                                      <>
                                                        <div
                                                          className=""
                                                          title={data?.name}
                                                        >
                                                          {data?.name
                                                            ? Content(
                                                                data?.name,
                                                                25
                                                              )
                                                            : "Not mentioned"}
                                                        </div>
                                                      </>
                                                      <ul className="job-post-info">
                                                        <li className="">
                                                          <Link
                                                            style={{
                                                              color: "#007bff",
                                                              fontSize: "14px",
                                                              width: "47px",
                                                            }}
                                                            title={
                                                              data?.contact
                                                                ?.mail?.val
                                                            }
                                                            to={`mailto:${data?.contact?.mail?.val}`}
                                                          >
                                                            {Content(
                                                              data?.contact
                                                                ?.mail?.val,
                                                              25
                                                            )}
                                                          </Link>
                                                        </li>
                                                      </ul>
                                                    </div>
                                                  </td>

                                                  <td>
                                                    <ul className="job-post-info">
                                                      <li
                                                        className="text-secondary"
                                                        style={{
                                                          fontSize: "13px",
                                                        }}
                                                      >
                                                        {data?.contact?.ph?.val
                                                          ? `${data?.contact?.ph?.code} ${data?.contact?.ph?.val}`
                                                          : "Not mentioned"}
                                                      </li>
                                                    </ul>
                                                  </td>

                                                  <td className="application tabletd p-0">
                                                    <li
                                                      style={{
                                                        fontSize: "13px",
                                                      }}
                                                    >
                                                      {getTimestampToDate(
                                                        data?.DOB
                                                      )}
                                                    </li>
                                                  </td>
                                                  <td className="application  text-center">
                                                    <label className="tabletd">
                                                      {data?.workStatus
                                                        ? "No"
                                                        : "Yes"}
                                                    </label>
                                                  </td>
                                                  <td className="application  tabletd">
                                                    <div className="d-flex justify-content-around align-items-center">
                                                      <IconButton
                                                        title={
                                                          "Resend Activation Link"
                                                        }
                                                        style={{
                                                          cursor: "pointer",
                                                        }}
                                                        key={data?.userId}
                                                      >
                                                        {!loaderr[
                                                          data?.userId
                                                        ] ? (
                                                          <MdOutlineReplay
                                                            className={
                                                              "tabletd"
                                                            }
                                                            onClick={() => {
                                                              setloaderid(
                                                                data?.userId
                                                              );
                                                              dispatch(
                                                                resendMail({
                                                                  userId:
                                                                    data?.userId,
                                                                })
                                                              );
                                                            }}
                                                            style={{
                                                              fontSize: "20px",
                                                            }}
                                                          />
                                                        ) : (
                                                          <i
                                                            className="fa fa-circle-o-notch fa-spin"
                                                            style={{
                                                              fontSize: "16px",
                                                            }}
                                                          ></i>
                                                        )}
                                                      </IconButton>
                                                      &nbsp;
                                                      <IconButton
                                                        title={
                                                          data?.resume
                                                            ? "Click to download Resume"
                                                            : "Resume not available"
                                                        }
                                                        style={
                                                          data?.resume
                                                            ? {
                                                                color:
                                                                  " rgb(0, 123, 255)",
                                                                cursor:
                                                                  "pointer",
                                                              }
                                                            : {
                                                                color: "black ",
                                                              }
                                                        }
                                                        onClick={() => {
                                                          data?.resume &&
                                                            resumeDownload(
                                                              data?.userId
                                                            );
                                                        }}
                                                      >
                                                        <BsCloudDownload
                                                          className={
                                                            data?.resume
                                                              ? ""
                                                              : "tabletd"
                                                          }
                                                          style={{
                                                            fontSize: "20px",
                                                          }}
                                                        />
                                                      </IconButton>
                                                      &nbsp;
                                                      <Switch
                                                        title={
                                                          data?.active
                                                            ? "Click to disable user"
                                                            : "Click to enable user"
                                                        }
                                                        checked={data?.active}
                                                        onChange={(e) => {
                                                          handleDeleteSwal(
                                                            data,
                                                            e
                                                          );
                                                        }}
                                                        inputProps={{
                                                          "aria-label":
                                                            "controlled",
                                                        }}
                                                      />
                                                    </div>
                                                  </td>
                                                </tr>
                                              )
                                            )}
                                        </tbody>
                                      </table>
                                    </div>
                                  )}
                              </div>

                              {JobSeekerArray?.totalCount > 0 && (
                                <div className="pagination-bx float-right m-t10">
                                  <Pagination
                                    className="pagination-data"
                                    onChange={PaginationChange}
                                    total={JobSeekerArray?.totalCount}
                                    current={currentpage}
                                    pageSize={size}
                                    showSizeChanger={true}
                                    itemRender={PrevNextArrow}
                                    // onShowSizeChange={PerPageChange}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {loadingJobSeeker && <AdminRegistration_Skeleton />}
            </>
          );
        }}
      </Formik>
    </div>
  );
};
export default JobSeekerRegistration;
