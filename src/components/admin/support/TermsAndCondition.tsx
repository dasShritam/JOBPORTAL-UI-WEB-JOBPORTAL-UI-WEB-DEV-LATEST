import { useEffect, useRef, useState } from "react";
import { regex } from "../../../common/validation";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import Select from "react-select";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Skeleton,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import ReactQuill from "react-quill";
import { BiInfoCircle } from "react-icons/bi";
import { getDocument } from "pdfjs-dist";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { Formik, useFormik } from "formik";
import {
  gettermsAndCondition,
  gettermsSettings,
  postSettings,
  postTermsAndCondition,
  resetGetTermsAndCondition,
  resetGetTermsSettings,
  resetPostTermsAndCondition,
  resetTermsSettings,
} from "../../../redux/features/admin/support/TermsAndCondition";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { convert_date_unix_ts } from "../../../common/common";
import dayjs from "dayjs";
function disableRandomDates(date) {
  return date < new Date();
}

const INITIAL_FORM_STATE: any = {
  NumberOfUser: "",
  NumberOfDays: "",
  NumberOfJobseeker: "",
  EndTill: "",
};

interface ResponseDataType {
  activation_lnk_exp_in_days: number;
  company_users_limit: number;
  js_profile_view_limit: number;
  employer_jsp_acc_till: number;
}
const FORM_VALIDATION = Yup.object().shape({
  NumberOfUser: Yup.number()
    .min(1, "Please enter a number greater than or equal to 1.")
    .integer("Please enter a valid integer.")
    .required("Please enter Number of users allowed for Employer."),

  NumberOfDays: Yup.number()
    .min(1, "Please enter a number greater than or equal to 1.")
    .integer("Please enter a valid integer.")
    .required(
      "Please enter Number of day(s), an account activation link will be active."
    ),

  NumberOfJobseeker: Yup.number()
    .min(1, "Please enter a number greater than or equal to 1.")
    .integer("Please enter a valid integer.")
    .required(
      "Please enter Number of Jobseeker Profile an employer can access."
    ),
  jspAccDuration: Yup.string()
    .required(
      "Please enter Number of days left for employer can view js profile."
    )
    .nullable(),
  // EndTill: Yup.string().nullable(),
});
const TermsAndCondition = () => {
  const [loaderjd, setLoaderjd] = useState(false);
  const editorRef = useRef<ReactQuill>(null);
  const [minDaysErr, setMinDaysErr] = useState("");
  const [fileContents, setFileContents] = useState("");
  const [redirectionURL, setRedirectionURl] = useState("/termsandcondition");
  const [hidereact, setHidereact] = useState(false);
  const [showreact, setShowreact] = useState(true);
  const [termsErr, setTermsErr] = useState("");
  const showSnackAlert = UseToastAlert();
  const [downloadBtn, setDownloadBtn] = useState("Import T & C");
  const dispatch = useDispatch();
  const formikRef = useRef<any>();
  const [settingValue, setSettingValue] = useState<ResponseDataType>();
  const [startDateTouched, setStartDateTouched] = useState(false);
  const [hidepages, setHidePages] = useState<boolean>(false);
  const [Datee, setDate] = useState<any>(null);

  const [DateErr, setDateErr] = useState<any>("");

  useEffect(() => {
    const inputModal = {
      type: types.TC,
    };
    dispatch(gettermsAndCondition(inputModal));

    return () => {
      dispatch(resetPostTermsAndCondition());
    };
  }, []);
  useEffect(() => {
    if (loaderjd) {
      setHidereact(true);
      setShowreact(false);
      setLoaderjd(false);
    } else {
      setTimeout(() => {
        setHidereact(false);
        setShowreact(true);
      }, 3000);
    }
  }, [loaderjd]);

  const enum types {
    TC = "TERMS_CONDITIONS",
    PP = "PRIVACY_POLICY",
    CS = "DECLARATION",
    // ST = "SETTINGS",
  }
  const subscriptionType = [
    { label: "Monthly", value: "30" },
    { label: "Quarterly", value: "90" },
    { label: "Half Year", value: "180" },
    { label: "One Year", value: "365" },
  ];

  const handleFileUpload = async (e: any) => {
    if (e.target.files[0].type === "application/pdf") {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async () => {
        const arrayBuffer: any = reader.result;
        const pdf = await getDocument(arrayBuffer).promise;
        const numPages = pdf.numPages;
        let pdffile = "";
        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items
            .map((item: any) => item.str)
            .join("\n");
          pdffile += pageText + "\n";
        }
        const event = {
          target: { name: "jobDesc", value: pdffile },
        };

        handleChange(event);
      };
      reader.readAsArrayBuffer(file);
    } else if (
      e.target.files[0].type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      e.target.files[0].type === "application/msword"
    ) {
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        const content = e.target.result;
        var doc = new Docxtemplater(new PizZip(content), {
          delimiters: {
            start: "12op1j2po1j2poj1po",
            end: "op21j4po21jp4oj1op24j",
          },
        });
        var text: any = doc.getFullText();
        const event = {
          target: { name: "jobDesc", value: text.slice(0, 5000) },
        };
        handleChange(event);
      };
      reader.readAsBinaryString(e.target.files[0]);
    }
  };

  const handleTextFileChange = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const fileContents = event.target.result;

      setFileContents(fileContents);
      const eventt = {
        target: {
          name: "jobDesc",
          value: fileContents.slice(0, 5000),
        },
      };
      handleChange(eventt);
    };
    reader.readAsText(file);
  };
  const [output, setOutput] = useState(
    `<strong><h3>Roles And Responsibilities </h3><br/>`
  );

  const handle = (e: any) => {
    const event = {
      target: {
        name: "jobDesc",
        value: "",
      },
    };
    handleChange(event);
    setOutput("");

    handleTextFileChange(e);
    handleFileUpload(e);
  };

  const snackAlert = UseToastAlert();
  const handleRestrict = (e: any) => {
    const videoValue = e?.target?.files && e?.target?.files[0];

    if (videoValue.size > 500000) {
      snackAlert("warning", "File size should not be greater than 500 KB");
      setLoaderjd(false);
    } else if (
      videoValue.type !== "application/pdf" &&
      videoValue.type !==
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
      videoValue.type !== "text/plain" &&
      videoValue.type !== "application/msword"
    ) {
      snackAlert("warning", "File must be in doc, docx, pdf or txt format");
      setLoaderjd(false);
      const eventsss = { target: { name: "jobDesc", value: "" } };
      handleChange(eventsss);
    } else {
      handle(e);
    }
  };

  const termsAndPrivacy = useSelector(
    (state: any) => state.GetTermsAndCondition
  );
  const { termsAndPolicy, termsAndPolicyLoading } = termsAndPrivacy;

  //get api redux state
  const termsGetSettings1 = useSelector((state: any) => state.TermsGetSettings);
  const { termsSettings1, termsSettingsLoading1 } = termsGetSettings1;

  //patch api redux state
  const termsAndSettings = useSelector((state: any) => state.TermsSettings);
  const { termsSettings, termsSettingsLoading } = termsAndSettings;
  const [formvalue, setformvalue] = useState<any>();

  const [bindSettingsData, setBindSettingsData] = useState<any>({
    NumberOfUser: "",
    NumberOfDays: "",
    NumberOfJobseeker: "",
    // EndTill: "",
    jspAccDuration: "",
  });

  useEffect(() => {
    if (formvalue) {
      // let DurationDays = subscriptionType?.filter((e: any) => {
      //   if (e.value == formvalue?.jsp_acc_dur) {
      //     return e;
      //   }

      // })
      setBindSettingsData({
        NumberOfUser: formvalue?.company_user_limit,
        NumberOfDays: formvalue?.activation_link_exp_days,
        NumberOfJobseeker: formvalue?.profile_limit,
        jspAccDuration: formvalue?.sub_dur_days,
        // EndTill: dayjs(
        //   new Date(
        //     (formvalue?.employer_jsp_acc_till + (5 * 60 * 60 + 30 * 60)) * 1000
        //   )?.toISOString()
        //   // ?.substr(0, 10)
        // ),
        //formvalue?.employer_jsp_acc_till,
      });
      // setDate(
      //   dayjs(
      //     new Date(
      //       (formvalue?.employer_jsp_acc_till + (5 * 60 * 60 + 30 * 60)) * 1000
      //     )?.toISOString()
      //     // ?.substr(0, 10)
      //   )
      // );
    }
  }, [formvalue]);

  useEffect(() => {
    if (
      !termsSettingsLoading1 &&
      termsSettings1 &&
      termsSettings1?.code &&
      termsSettings1?.code === 200
    ) {
      setformvalue(
        JSON.parse(
          termsSettings1 && termsSettings1?.data
            ? termsSettings1?.data?.data[0]?.data[0].value
            : ""
        )
      );
    } else if (
      termsSettings1 &&
      termsSettings1?.response &&
      termsSettings1?.response?.status !== 200
    ) {
      showSnackAlert("error", termsSettings1?.response?.data?.message);
      // setLoader(false);
      dispatch(resetGetTermsSettings());
    }
  }, [termsSettings1, termsSettingsLoading1, hidepages]);

  const initialValue = { jobDesc: "" };
  const [editValues, setEditValues] = useState<any>(initialValue);

  useEffect(() => {
    if (!termsAndPolicyLoading) {
      setEditValues({ jobDesc: termsAndPolicy?.data });
    }
  }, [termsAndPolicyLoading]);

  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: editValues,
    enableReinitialize: true,
    onSubmit: (values) => {},
    // Other configuration options can be added here
  });

  const terms = useSelector((state: any) => state.TermsAndCondition);
  const { termsArray, termsLoading } = terms;

  useEffect(() => {
    if (!termsLoading && termsArray.code === 200) {
      showSnackAlert("success", termsArray.message, 200);
    }
  }, [termsLoading]);
  useEffect(() => {
    // setLoader(true);
    if (!termsSettingsLoading && termsSettings.code === 200) {
      showSnackAlert("success", termsSettings.message);
      setLoader(false);
      dispatch(resetTermsSettings());
    } else if (
      termsSettings &&
      termsSettings?.response &&
      termsSettings?.response?.status !== 200
    ) {
      showSnackAlert("error", termsSettings?.response?.data?.message);
      setLoader(false);
      dispatch(resetTermsSettings());
    }
  }, [termsSettingsLoading]);

  const [type, setType] = useState<string>("TC");
  const [loader, setLoader] = useState(false);

  const [heading, setHeading] = useState<string>("Manage Terms and Condition");

  const handleSetType = (input) => {
    setType(input);
    const modal = {
      type: input == "TC" ? types.TC : input == "PP" ? types.PP : types.CS,

      // input == "CS"
      // ? types.CS
      // : types.ST,
    };
    setEditValues(initialValue);
    dispatch(gettermsAndCondition(modal));

    if (input === "TC") {
      setHeading("Manage Terms and Condition");
      setRedirectionURl("/termsandcondition");
      setDownloadBtn("Import T & C");
    } else if (input === "PP") {
      setHeading("Manage Privacy Policy");
      setRedirectionURl("/privacypolicy");
      setDownloadBtn("Import Privacy Policy");
    } else if (input === "CS") {
      setHeading("Manage Consent");
      setRedirectionURl("/consent");
      setDownloadBtn("Import Consent");
    } else {
      setHeading("Manage Settings");
      setRedirectionURl("/settings");
      setDownloadBtn("Import Settings");
    }
  };

  useEffect(() => {
    if (
      termsAndPolicy?.response &&
      termsAndPolicy?.response?.data &&
      termsAndPolicy?.response?.data?.code !== 200
    ) {
      showSnackAlert("warning", termsAndPolicy?.response?.data?.message);
      dispatch(resetGetTermsAndCondition());
    }
  }, [termsAndPolicy, termsAndPolicy?.code]);

  // const handleSave = () => {
  //   let timestampForDate = convert_date_unix_ts(
  //     new Date(`${Datee?.$y}-${Datee?.$M + 1}-${Datee?.$D} 23:59:59`)
  //   );
  //   const requestData = {
  //     /* data to send */
  //     empUsersCnt: Number(formikRef.current.values.NumberOfUser),
  //     jsProfileViewCnt: Number(formikRef.current.values.NumberOfJobseeker),
  //     activationLinkExpTime: Number(formikRef.current.values.NumberOfDays),
  //     employerjspAccTill: timestampForDate,
  //     // convert_date_unix_ts(
  //     //   new Date(
  //     //     `${values.EndTill?.$y}/${1 + values.EndTill?.$M}/${
  //     //       values.EndTill?.$D
  //     //     }`
  //     //   )
  //     // ),
  //   };
  //   dispatch(postSettings(requestData));
  //   setLoader(true);
  // };

  const handleSave = () => {
    if (!DateErr.length && !minDaysErr) {
      let timestampForDate = convert_date_unix_ts(
        new Date(`${Datee?.$y}-${Datee?.$M + 1}-${Datee?.$D} 23:59:59`)
      );
      const requestData = {
        /* data to send */
        empUsersCnt: Number(formikRef.current.values.NumberOfUser),
        jsProfileViewCnt: Number(formikRef.current.values.NumberOfJobseeker),
        activationLinkExpTime: Number(formikRef.current.values.NumberOfDays),
        jspAccDuration: Number(formikRef?.current?.values?.jspAccDuration),
        // employerjspAccTill: timestampForDate,
      };
      dispatch(postSettings(requestData));
      setLoader(true);
    }
  };

  useEffect(() => {
    if (termsSettings1?.data?.data?.length) {
      setSettingValue(
        JSON.parse(termsSettings1?.data?.data[0]?.data[0]?.value)
      );
    }
  }, [termsSettings1?.data?.data]);

  const handleSettings = () => {
    const requestData = [
      {
        /* data to send */
        group: "APPCON",
        active: 1,
      },
    ];
    dispatch(gettermsSettings(requestData));
  };

  const handleHideTable = () => {
    // setHideTabel(false);
    // setHideJobseeker(true);
    setHidePages(true);
  };
  return (
    <>
      {/* <div className="">
        <button
          type="button"
          className={
            type == "TC" ? "btn btn-primary" : "btn btn-outline-primary"
          }
          onClick={() => {
            handleSetType("TC");
            setTermsErr("");
            setHidePages(false);
          }}
        >
          Manage T & C
        </button>
        &nbsp;&nbsp;
        <button
          type="button"
          className={
            type == "PP" ? "btn btn-primary" : "btn btn-outline-primary"
          }
          onClick={(e: any) => {
            handleSetType("PP");
            setTermsErr("");
            setHidePages(false);
          }}
        >
          Privacy Policy
        </button>
        &nbsp;&nbsp;
        <button
          type="button"
          className={
            type == "CS" ? "btn btn-primary" : "btn btn-outline-primary"
          }
          onClick={(e: any) => {
            handleSetType("CS");
            setTermsErr("");
            setHidePages(false);
          }}
        >
          Consent
        </button>
        <button
          type="button"
          className={
            type == "ST" ? "btn btn-primary" : "btn btn-outline-primary"
          }
          onClick={(e: any) => {
            handleHideTable();
            handleSettings();
          }}
        >
          Settings
        </button>
      </div> */}
      <div className="page-content bg-white">
        <div className="content-block">
          <div className="browse-job section-full bg-white p-t50 p-b20">
            <div className="container">
              <div className="row">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 m-b30 mt-5">
                  <div className="job-bx browse-job">
                    <div className="job-bx-title ">
                      <div>
                        <h5 className="font-weight-700 pull-left text-uppercase">
                          {/* Manage Terms and Conditions */}
                          {redirectionURL !== "" ? (
                            <a
                              style={{
                                color: "blue",
                                textDecoration: "none",
                              }}
                              href={redirectionURL}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {heading}
                            </a>
                          ) : (
                            `${heading}`
                          )}
                        </h5>
                      </div>
                      <br />
                      <div className="">
                        <button
                          type="button"
                          className={
                            type == "TC"
                              ? "btn btn-primary"
                              : "btn btn-outline-primary"
                          }
                          onClick={() => {
                            handleSetType("TC");
                            setTermsErr("");
                            setHidePages(false);
                          }}
                        >
                          Manage T & C
                        </button>
                        &nbsp;&nbsp;
                        <button
                          type="button"
                          className={
                            type == "PP"
                              ? "btn btn-primary"
                              : "btn btn-outline-primary"
                          }
                          onClick={(e: any) => {
                            handleSetType("PP");
                            setTermsErr("");
                            setHidePages(false);
                          }}
                        >
                          Privacy Policy
                        </button>
                        &nbsp;&nbsp;
                        <button
                          type="button"
                          className={
                            type == "CS"
                              ? "btn btn-primary"
                              : "btn btn-outline-primary"
                          }
                          onClick={(e: any) => {
                            handleSetType("CS");
                            setTermsErr("");
                            setHidePages(false);
                          }}
                        >
                          Consent
                        </button>
                        &nbsp;&nbsp;
                        <button
                          type="button"
                          className={
                            type == "ST"
                              ? "btn btn-primary"
                              : "btn btn-outline-primary"
                          }
                          onClick={() => {
                            handleHideTable();
                            handleSetType("ST");
                            setTermsErr("");
                            handleSettings();

                            setBindSettingsData(null);
                            setformvalue(null);
                            setDateErr(false);
                          }}
                        >
                          Settings
                        </button>
                      </div>
                    </div>

                    {!hidepages && (
                      <div className="row">
                        {showreact && (
                          <div className="m-b30 radius-sm bg-white clearfix">
                            <>
                              <form onSubmit={handleSubmit}>
                                <div className="d-flex justify-content-center">
                                  <label
                                    className="jdimport"
                                    style={{
                                      color: "skyblue",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <input
                                      className="float-right"
                                      type="file"
                                      style={{ display: "none" }}
                                      id="file-input"
                                      accept=".pdf,.docx,.txt"
                                      onChange={(e: any) => {
                                        setLoaderjd(true);
                                        handleRestrict(e);
                                      }}
                                    />
                                    {downloadBtn}
                                  </label>
                                  &nbsp;
                                  <BiInfoCircle
                                    className="mt-1"
                                    title="File must be in docx, pdf or txt format and should not be greater than 500 KB"
                                    // style={{ marginRight: "70px" }}
                                  />
                                </div>
                                {!termsAndPolicyLoading ? (
                                  <ReactQuill
                                    id="reactquill"
                                    ref={editorRef}
                                    value={values.jobDesc}
                                    style={{
                                      width: "90vw",
                                      marginTop: "-37px",
                                      height: "370px",
                                    }}
                                    onChange={(e: any) => {
                                      setTermsErr("");
                                      // e.target.value.props.values.jobDesc.slice(0, 10);

                                      const addedData =
                                        e.toString() == "<p><br></p>" ||
                                        e.toString() == "<h3><br></h3>"
                                          ? ""
                                          : e.toString();
                                      const event = {
                                        target: {
                                          name: "jobDesc",
                                          value: addedData,
                                        },
                                      };
                                      handleChange(event);

                                      // if (addedData.length > 5000) {
                                      //   snackAlert(
                                      //     "warning",
                                      //     "Text length must be less than 5000 characters"
                                      //   );
                                      //   setLoaderjd(false);
                                      //   handleChange(event);
                                      // } else {
                                      //   handleChange(event);
                                      // }
                                      handleChange(event);
                                      // props.handleChange(event);

                                      // setOutput(addedData);
                                      // props.values.jobDesc = e.toString();
                                    }}
                                  />
                                ) : (
                                  "loading"
                                )}
                                {/* {props.errors.jobDesc &&
                                       props.touched.jobDesc && (
                                         <p className="form-error  error-scroll">
                                           {props.errors.jobDesc}
                                         </p>
                                       )}
                                     {props.errors.jobDesc && (
                                       <div className="error-scroll"></div>
                                     )} */}

                                <LoadingButton
                                  className="mt-5"
                                  type="submit"
                                  style={{ float: "right" }}
                                  //   onClick={() => {
                                  //     setfirstWorkingTouched(true);
                                  //     setlastWorkingTouched(true);
                                  //   }}
                                  // endIcon={<SendIcon />}
                                  //   loading={patchloading}
                                  onClick={() => {
                                    if (values.jobDesc !== "") {
                                      // showSnackAlert(
                                      //   "success",
                                      //   termsArray.message,
                                      //   200
                                      // );
                                      setTermsErr("");
                                      let formData = new FormData();
                                      formData.append(
                                        "type",
                                        type == "TC"
                                          ? types.TC
                                          : type == "PP"
                                          ? types.PP
                                          : types.CS
                                      );

                                      const file = new File(
                                        [values.jobDesc],
                                        "file.txt",
                                        {
                                          type: "text/plain",
                                        }
                                      );

                                      formData.append("file", file);
                                      dispatch(postTermsAndCondition(formData));
                                      // handleSubmit();
                                    } else {
                                      if (
                                        type === "TC" &&
                                        values.jobDesc === ""
                                      ) {
                                        setTermsErr(
                                          "Please type Terms and Condition."
                                        );
                                      } else if (
                                        type === "PP" &&
                                        values.jobDesc === ""
                                      ) {
                                        setTermsErr(
                                          "Please type Privacy Policy."
                                        );
                                      } else if (
                                        type === "CS" &&
                                        values.jobDesc === ""
                                      ) {
                                        setTermsErr("Please type Consent.");
                                      } else {
                                        setTermsErr("");
                                      }
                                    }
                                  }}
                                  loadingPosition="end"
                                  variant="contained"
                                >
                                  <span>Save</span>
                                </LoadingButton>
                              </form>
                            </>
                          </div>
                        )}
                        <p className="form-error  error-scroll">{termsErr}</p>
                        {hidereact && (
                          <div>
                            {" "}
                            <Skeleton
                              animation="wave"
                              height={100}
                              width="90vw"
                            />{" "}
                          </div>
                        )}
                        {/* </div> */}
                      </div>
                    )}
                    <Formik
                      initialValues={{
                        ...bindSettingsData,
                      }}
                      validationSchema={FORM_VALIDATION}
                      enableReinitialize={true}
                      onSubmit={() => {
                        if (
                          Number(formikRef?.current?.values?.jspAccDuration) <
                          30
                        ) {
                          setMinDaysErr(
                            "Please enter greater than or equal to 30 days."
                          );
                        } else if (
                          Number(formikRef?.current?.values?.jspAccDuration) >
                          365
                        ) {
                          setMinDaysErr(
                            "Please enter less than or equal to 365 days."
                          );
                        } else {
                          setMinDaysErr("");
                          handleSave();
                        }
                      }}
                      isInitialValid={false}
                      innerRef={formikRef}
                    >
                      {(formik: any) => {
                        const {
                          values,
                          handleChange,
                          handleSubmit,
                          errors,
                          setFieldValue,
                          touched,
                          handleBlur,
                          isValid,
                          dirty,
                        } = formik;
                        return (
                          <>
                            {hidepages && (
                              <div
                                className="row"
                                style={{ alignItems: "center" }}
                              >
                                <div
                                  className="row"
                                  style={{ alignItems: "center" }}
                                >
                                  <div className="container">
                                    <div className="row ">
                                      <div className="registerForm-div">
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
                                                className="p-a30 job-bx radius-sm bg-white"
                                                style={{
                                                  width: "750px",
                                                  marginLeft: "185px",
                                                }}
                                              >
                                                <div className="tab-content">
                                                  <form
                                                    autoComplete="off"
                                                    id="login"
                                                    className="tab-pane active"
                                                    onSubmit={(e) => {
                                                      e.preventDefault();
                                                      handleSubmit();
                                                    }}
                                                  >
                                                    <div className="form-group">
                                                      <label className="font-weight-700">
                                                        Number of users allowed
                                                        for Employer?{" "}
                                                        <span className="maditory">
                                                          *
                                                        </span>
                                                      </label>
                                                      <input
                                                        name="NumberOfUser"
                                                        className="form-control"
                                                        placeholder="Enter number of users allowed for employer"
                                                        type="text"
                                                        autoComplete="off"
                                                        minLength={1}
                                                        maxLength={2}
                                                        onChange={(e) => {
                                                          regex.numberTyping.test(
                                                            e.target.value
                                                          ) && handleChange(e);
                                                        }}
                                                        onBlur={handleBlur}
                                                        value={
                                                          values.NumberOfUser
                                                        }
                                                      />
                                                      {errors.NumberOfUser &&
                                                        touched.NumberOfUser && (
                                                          <p className="form-error">
                                                            {
                                                              errors.NumberOfUser
                                                            }
                                                          </p>
                                                        )}
                                                    </div>
                                                    <div className="form-group">
                                                      <label className="font-weight-700">
                                                        Number of day(s), an
                                                        account activation link
                                                        will be active?{" "}
                                                        <span className="maditory">
                                                          *
                                                        </span>
                                                      </label>
                                                      <input
                                                        name="NumberOfDays"
                                                        className="form-control"
                                                        placeholder="Enter number of day(s), an account activation link will be active"
                                                        type="text"
                                                        autoComplete="off"
                                                        minLength={1}
                                                        maxLength={2}
                                                        onChange={(e) => {
                                                          regex.numberTyping.test(
                                                            e.target.value
                                                          ) && handleChange(e);
                                                        }}
                                                        onBlur={handleBlur}
                                                        value={
                                                          values.NumberOfDays
                                                        }
                                                      />
                                                      {errors.NumberOfDays &&
                                                        touched.NumberOfDays && (
                                                          <p className="form-error">
                                                            {
                                                              errors.NumberOfDays
                                                            }
                                                          </p>
                                                        )}
                                                    </div>

                                                    <div className="row">
                                                      <div className="col-lg-12 col-md-12 col-sm-12">
                                                        <label className="font-weight-700">
                                                          Number of Jobseeker
                                                          Profile an employer
                                                          can access ?{" "}
                                                          <span className="maditory">
                                                            *
                                                          </span>
                                                        </label>
                                                        <input
                                                          name="NumberOfJobseeker"
                                                          className="form-control"
                                                          placeholder="Enter number of jobseeker profile an employer can access"
                                                          type="text"
                                                          minLength={1}
                                                          autoComplete="off"
                                                          maxLength={6}
                                                          // onChange={handleChange}

                                                          onBlur={handleBlur}
                                                          onChange={(e) => {
                                                            regex.numberTyping.test(
                                                              e.target.value
                                                            ) &&
                                                              handleChange(e);
                                                          }}
                                                          value={
                                                            values.NumberOfJobseeker
                                                          }
                                                          // value={values.NumberOfJobseeker}
                                                        />
                                                        {errors.NumberOfJobseeker &&
                                                          touched.NumberOfJobseeker && (
                                                            <p className="form-error">
                                                              {
                                                                errors.NumberOfJobseeker
                                                              }
                                                            </p>
                                                          )}
                                                      </div>
                                                      <div className="col-lg-12 col-md-12 col-sm-12 mt-3">
                                                        <label className="font-weight-700 mb--1%">
                                                          Number of days left
                                                          for employer to view
                                                          js profile?
                                                          <span className="maditory">
                                                            {" "}
                                                            *
                                                          </span>
                                                        </label>
                                                        <input
                                                          name="jspAccDuration"
                                                          className="form-control"
                                                          placeholder="Enter Number of days left for employer to view js profile"
                                                          type="text"
                                                          minLength={1}
                                                          autoComplete="off"
                                                          maxLength={3}
                                                          // onChange={handleChange}

                                                          onBlur={handleBlur}
                                                          onChange={(e) => {
                                                            if (
                                                              regex.numberTyping.test(
                                                                e.target.value
                                                              )
                                                            ) {
                                                              handleChange(e);
                                                              setMinDaysErr("");
                                                            }
                                                          }}
                                                          value={
                                                            values.jspAccDuration
                                                          }
                                                          // value={values.NumberOfJobseeker}
                                                        />
                                                        {errors.jspAccDuration &&
                                                          touched.jspAccDuration && (
                                                            <p className="form-error">
                                                              {
                                                                errors.jspAccDuration
                                                              }
                                                            </p>
                                                          )}
                                                        {minDaysErr && (
                                                          <p className="form-error">
                                                            {minDaysErr}
                                                          </p>
                                                        )}

                                                        {/* <LocalizationProvider
                                                          dateAdapter={
                                                            AdapterDayjs
                                                          }
                                                        >
                                                          <DemoContainer
                                                            components={[
                                                              "DatePicker",
                                                            ]}
                                                          >
                                                            <DatePicker
                                                              className="dropstyle"
                                                              value={Datee}
                                                              format="DD-MM-YYYY"
                                                              sx={{
                                                                width: "100%",
                                                              }}
                                                              disablePast
                                                              shouldDisableDate={
                                                                disableRandomDates
                                                              }
                                                              onChange={(
                                                                newValue
                                                              ) => {
                                                                const selectedDate = `${newValue?.$D
                                                                  }/${newValue?.$M +
                                                                  1
                                                                  }/${newValue?.$y
                                                                  }`;

                                                                if (
                                                                  isNaN(
                                                                    newValue?.$D
                                                                  ) ||
                                                                  isNaN(
                                                                    newValue?.$M +
                                                                    1
                                                                  ) ||
                                                                  isNaN(
                                                                    newValue?.$y
                                                                  )
                                                                ) {
                                                                  setDateErr(
                                                                    "Please enter Date."
                                                                  );
                                                                } else if (
                                                                  newValue?.$D &&
                                                                  newValue?.$M +
                                                                  1 &&
                                                                  newValue?.$y &&
                                                                  new Date(
                                                                    `${newValue?.$M +
                                                                    1
                                                                    }/${newValue?.$D
                                                                    }/${newValue?.$y
                                                                    }`
                                                                  ) < new Date()
                                                                ) {
                                                                  setDateErr(
                                                                    "Please select future Date."
                                                                  );
                                                                } else {
                                                                  setDateErr(
                                                                    ""
                                                                  );
                                                                }
                                                                values.EndTill =
                                                                  newValue;
                                                                setDate(
                                                                  newValue
                                                                );
                                                              }}
                                                              onClose={() => {
                                                                setStartDateTouched(
                                                                  true
                                                                );
                                                              }}
                                                            />
                                                          </DemoContainer>
                                                        </LocalizationProvider> */}
                                                        {/* <Select
                                                          name="jspAccDuration"
                                                          className="dropstyle"
                                                          placeholder="Subscription Type"
                                                          options={subscriptionType}
                                                          value={values?.jspAccDuration}
                                                          onChange={(e: any) => {
                                                            const event = {
                                                              target: {
                                                                name: "jspAccDuration",
                                                                value: e,
                                                              }
                                                            }

                                                            handleChange(event)

                                                          }}

                                                        /> */}
                                                        {DateErr && (
                                                          <p className="form-error">
                                                            {DateErr}
                                                          </p>
                                                        )}
                                                        {/* {walkindateError && (
                            <p className="form-error">{walkindateError}</p>
                          )} */}
                                                        {/* {!walkindateError &&
            props.values.startDate === null &&
            startDateTouched && (
              <p className="form-error">{"Please select the start date."}</p>
            )} */}
                                                        {touched.EndTill &&
                                                          errors.EndTill &&
                                                          values?.EndTill ===
                                                            null && (
                                                            <p className="form-error">
                                                              {errors.EndTill}
                                                            </p>
                                                          )}
                                                        {errors.EndTill && (
                                                          <div className="error-scroll">
                                                            {" "}
                                                          </div>
                                                        )}
                                                      </div>
                                                    </div>

                                                    <div className="modal-custom-footer">
                                                      <button
                                                        style={{ zIndex: 0 }}
                                                        type="submit"
                                                        className="site-button"
                                                      >
                                                        {loader && (
                                                          <i
                                                            className="fa fa-circle-o-notch fa-spin"
                                                            style={{
                                                              marginRight:
                                                                "10px",
                                                            }}
                                                          ></i>
                                                        )}
                                                        {loader
                                                          ? "Saving"
                                                          : "Save"}
                                                      </button>
                                                    </div>
                                                  </form>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        {/* </div> */}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        );
                      }}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsAndCondition;
