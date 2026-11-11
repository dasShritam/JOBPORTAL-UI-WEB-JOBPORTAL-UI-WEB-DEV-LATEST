import { useRef } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { Formik } from "formik";
import { charaterLength, regex } from "../../../common/validation";
import * as Yup from "yup";
import {
  Content,
  convertNumberToWeekday,
  convertTo12HourFormat,
  customStyles,
} from "../../../common/common";
import { useEffect, useState } from "react";
import { environment } from "../../../environments/environment";
import "../../../assets/customCss/footer.css";
import {
  postQuery,
  resetPostQuery,
} from "../../../redux/features/admin/support/ManageContactInfoSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  contactInfoMasterData,
  jobSeekerProfileMasterData,
} from "../../../redux/features/masterData/MasterDataInfoSlice";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import { FaCloudUploadAlt } from "react-icons/fa";
import SendIcon from "@mui/icons-material/Send";
import LoadingButton from "@mui/lab/LoadingButton";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import { Tooltip } from "@material-ui/core";
var contactImg = require("../../../assets/images/background/bc-contact.png");
const QuickContact = () => {
  const [fieldValue, setFieldValue] = useState<any>();
  const [errormsg, setErrormsg] = useState<string>("");
  const [fileformat, setFileformat] = useState(false);
  const [filesize, setFilesize] = useState(false);
  const [lockerror, setLockerror] = useState(false);
  const [areaTouched, setAreaTouched] = useState(false);
  const [areaOfConcernList, setAreaOfConcernList] = useState<any>([]);
  const [contactList, setContactList] = useState<any>([]);
  const [clear, setClear] = useState<any>();
  const [open, setOpen] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleScroll = () => {
    if (inputRef?.current) {
      inputRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const charLength = charaterLength;

  const dispatch = useDispatch();

  const { response, loading } = useSelector((state: any) => state.postQuery);

  const FORM_VALIDATION_1 = Yup.object().shape({
    ContactNumber: Yup.string()
      .required("Please enter Contact Number.")
      .trim("Empty space not allowed.")
      .matches(/^.{6,}$/, "Please enter minimum 6 charecters.")
      .matches(regex.international_mobile, "Please enter valid Contact Number.")
      .nullable(),
    FullName: Yup.string()
      .required("Please enter Full Name.")
      .trim("Empty space not allowed.")
      .matches(
        regex.fullName,
        "Numeric and Special characters are not allowed."
      )
      .nullable(),
    AreaOfConcern: Yup.object()
      .required("Please select Area of Concern.")
      .nullable(),
    QueryorConcern: Yup.string()
      .required("Please enter your Query/Concern.")
      .min(10, "Please enter minimum 10 characters.")
      .max(500),
    EmailAddress: Yup.string()
      .required("Please enter Email Address.")
      .matches(regex.email, "Please specify valid Email Address.")
      .trim("Empty space not allowed."),
    Image: Yup.string().notRequired(),
  });

  const INITIAL_FORM_STATE: any = {
    FullName: "",
    ContactNumber: "",
    EmailAddress: "",
    QueryorConcern: "",
    AreaOfConcern: null,
    Image: "",
  };

  useEffect(() => {
    const masterDataObj = [
      {
        group: "TTYPE",
        active: 1,
      },
    ];

    dispatch(jobSeekerProfileMasterData(masterDataObj));
  }, []);

  useEffect(() => {
    const masterContactObj = [
      {
        group: "CTUS",
        active: 1,
      },
    ];
    dispatch(contactInfoMasterData(masterContactObj));
  }, []);

  const JS_MASTER_DATA = useSelector((state: any) => state.jobSeekerMasterData);
  const CONTACT_INFO_DATA = useSelector(
    (state: any) => state.contactInfoMasterData
  );

  const showSnackAlert = UseToastAlert();

  useEffect(() => {
    CONTACT_INFO_DATA?.CInfoMasterData?.length > 0 &&
      CONTACT_INFO_DATA?.CInfoMasterData?.map((e, i) => {
        let modeoptions: any = [];
        if (e?.group == "CTUS") {
          e?.data?.map((e) => {
            e?.value?.length > 0 && modeoptions?.push(JSON.parse(e?.value));
          });
          setContactList(modeoptions);
        }
      });
  }, [CONTACT_INFO_DATA]);

  useEffect(() => {
    if (JS_MASTER_DATA && JS_MASTER_DATA?.JSMasterData) {
      JS_MASTER_DATA?.JSMasterData?.length > 0 &&
        JS_MASTER_DATA?.JSMasterData?.map((e, i) => {
          let modeoptions: any = [];
          if (e?.group == "TTYPE") {
            e?.data?.map((e) => {
              modeoptions?.push({
                label: e?.value,
                value: e?.id,
              });
            });
            setAreaOfConcernList(modeoptions);
          }
        });
    }
  }, [JS_MASTER_DATA]);

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

  const handleImageChange = (e: any) => {
    const selectedFile: any = e.target.files && e.target.files[0];
    const reader: any = new FileReader();
    reader.readAsArrayBuffer(selectedFile);
    reader.onload = function () {
      let file: any = new Blob([reader.result], { type: "image/*" });
      file.text().then((x) => {
        if (x.includes("Encrypt")) {
          setLockerror(true);
          setFileformat(false);
          setFilesize(false);
        } else {
          if (selectedFile) {
            if (
              selectedFile.type !== "image/png" &&
              selectedFile.type !== "image/jpeg"
            ) {
              setFileformat(true);
              setFilesize(false);
              setLockerror(false);
              setFieldValue(null);
            } else if (selectedFile.size > environment.imageSize) {
              setFilesize(true);
              setFileformat(false);
              setLockerror(false);
              setFieldValue(null);
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

  const handleSend = (values: any) => {
    const contactMdl = {
      name: values.FullName,
      phone: values.ContactNumber,
      email: values.EmailAddress,
      category: values.AreaOfConcern.label,
      description: values.QueryorConcern,
    };

    let formData = new FormData();
    formData.append("image", fieldValue);
    formData.append("tsRequest", JSON.stringify(contactMdl));

    dispatch(postQuery(formData));
  };

  useEffect(() => {
    if (response?.code === 200) {
      handleScroll();
      clearFunc();
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
        dispatch(resetPostQuery());
      }, 4000);
      setAreaTouched(false);
    }
  }, [response, response?.code]);

  const clearFunc = () => {
    clear?.e();
    setFieldValue(null);
  };

  useEffect(() => {
    if (response?.code === 206) {
      showSnackAlert("warning", response?.response?.data?.message);
    } else if (
      response?.response &&
      response?.response?.data &&
      response?.response?.data?.code !== 200
    ) {
      showSnackAlert("warning", response?.response?.data?.message);
      dispatch(resetPostQuery());
    }
  }, [response, response?.code]);
  const textLimit: number = 30;

  return (
    <>
      <Formik
        initialValues={{ ...INITIAL_FORM_STATE }}
        validationSchema={FORM_VALIDATION_1}
        onSubmit={(values, { resetForm }) => {
          setAreaTouched(true);
          handleSend(values);
          setClear({ e: resetForm });
        }}
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

          return (
            <>
              <div className="page-content bg-white">
                <div
                  className="dez-bnr-inr overlay-black-middle"
                  style={{
                    backgroundImage: "url(" + contactImg + ")",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    height: "350px",
                  }}
                >
                  <div className="container">
                    <div className="dez-bnr-inr-entry">
                      <h1 className="text-white mt-5" ref={inputRef}>
                        Contact Us
                      </h1>
                    </div>
                  </div>
                </div>
                <div className="section-full content-inner bg-white contact-style-1">
                  <div className="container">
                    <div className="row">
                      <div className="col-lg-4 col-md-6 d-lg-flex d-md-flex">
                        <div className="p-a30 border m-b30 contact-area border-1 align-self-stretch radius-sm">
                          <h4 className="m-b10">Quick Contact</h4>
                          <p>
                            If you have any questions simply use the following
                            contact details.
                          </p>
                          <ul className="no-margin">
                            <li className="icon-bx-wraper left  m-b30">
                              <div className="icon-bx-xs border-1">
                                <Link
                                  to={"#"}
                                  className="icon-cell"
                                  style={{ textDecoration: "none" }}
                                >
                                  <i className="ti-email "></i>
                                </Link>
                              </div>
                              <div className="icon-content">
                                <h6 className="text-uppercase m-tb0">Email</h6>
                                <p className="word-break">
                                  {contactList[0]?.mail?.prim}

                                  {contactList[0]?.mail?.secd[0]
                                    ? ` | ${contactList[0]?.mail?.secd[0]}`
                                    : ""}
                                </p>
                                {/* <Tooltip
                                  title={contactList[0]?.mail?.prim}
                                  placement="top"
                                >
                                  <p>
                                    {Content(
                                      contactList[0]?.mail?.prim,
                                      textLimit
                                    )}{" "}
                                  </p> */}
                                {/* </Tooltip>
                                {contactList[0]?.mail?.secd[0] && (
                                  <Tooltip
                                    title={contactList[0]?.mail?.secd[0]}
                                    style={{ marginTop: "-15px" }}
                                  >
                                    <p>
                                      {contactList[0]?.mail?.secd[0]
                                        ? ` | ${Content(
                                            contactList[0]?.mail?.secd[0],
                                            textLimit
                                          )}`
                                        : ""}
                                    </p>
                                  </Tooltip>
                                )} */}
                              </div>
                            </li>
                            <li className="icon-bx-wraper left m-b30">
                              <div className="icon-bx-xs border-1">
                                <Link to={"#"} className="icon-cell">
                                  <i className="ti-mobile"></i>
                                </Link>
                              </div>
                              <div className="icon-content">
                                <h6 className="text-uppercase m-tb0">PHONE</h6>
                                <p>
                                  {contactList[0]?.ph?.prim}
                                  {contactList[0]?.ph?.secd[0]
                                    ? ` | ${contactList[0]?.ph?.secd[0]}`
                                    : ""}
                                </p>
                              </div>
                            </li>
                            <li className="icon-bx-wraper left  m-b30">
                              <div className="icon-bx-xs border-1">
                                <Link to={"#"} className="icon-cell">
                                  <i className="ti-calendar"></i>
                                </Link>
                              </div>
                              <div className="icon-content">
                                <h6 className="text-uppercase m-tb0">
                                  Working Days
                                </h6>
                                <p>
                                  {convertNumberToWeekday(
                                    contactList[0]?.work_days[0]
                                  )}
                                  &nbsp; To &nbsp;
                                  {convertNumberToWeekday(
                                    contactList[0]?.work_days[1]
                                  )}
                                </p>
                              </div>
                            </li>
                            <li className="icon-bx-wraper left  m-b30">
                              <div className="icon-bx-xs border-1">
                                <Link to={"#"} className="icon-cell">
                                  <i className="ti-alarm-clock"></i>
                                </Link>
                              </div>
                              <div className="icon-content">
                                <h6 className="text-uppercase m-tb0">
                                  Working Hours
                                </h6>
                                <p>
                                  {CONTACT_INFO_DATA?.CInfoMasterData &&
                                    contactList &&
                                    contactList[0] &&
                                    convertTo12HourFormat(
                                      contactList[0]?.work_hrs.split("-")?.[0]
                                    )}
                                  -
                                  {convertTo12HourFormat(
                                    contactList[0]?.work_hrs.split("-")?.[1]
                                  )}
                                </p>
                              </div>
                            </li>
                          </ul>
                          <div className="m-t20">
                            <ul className="dez-social-icon dez-social-icon-lg">
                              <li>
                                <a
                                  href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
                                  target="_blank"
                                  className="fa fa-facebook bg-primary mr-1"
                                  title="Share on facebook."
                                ></a>
                              </li>
                              <li>
                                <a
                                  href={`https://twitter.com/intent/tweet?url=${window.location.href}`}
                                  target="_blank"
                                  className=" fa fa-twitter bg-primary mr-1"
                                  title="Share on twitter."
                                ></a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-8 col-md-8">
                        {!loading && response.code === 200 && (
                          <Collapse in={open}>
                            <Alert
                              variant="filled"
                              severity="success"
                              action={
                                <IconButton
                                  aria-label="close"
                                  color="inherit"
                                  size="small"
                                  onClick={() => {
                                    setOpen(false);
                                  }}
                                >
                                  <CloseIcon fontSize="inherit" />
                                </IconButton>
                              }
                              sx={{ mb: 2 }}
                            >
                              Thank you for contacting us. We have received your
                              query/Concern and will get back to you shortly
                            </Alert>
                          </Collapse>
                        )}
                        <div className="p-a30 m-b30 radius-sm bg-gray clearfix">
                          <form onSubmit={handleSubmit}>
                            <div className="row ">
                              <div className="col-lg-12 col-md-12">
                                <label style={{ fontWeight: "400 !important" }}>
                                  Full Name
                                  <span className="maditory">*</span>
                                </label>
                                <input
                                  className="form-control"
                                  name="FullName"
                                  maxLength={100}
                                  onBlur={handleBlur}
                                  onChange={(e) => {
                                    regex.alphabetSpaceTyping.test(
                                      e.target.value
                                    ) && handleChange(e);
                                  }}
                                  value={formik.values.FullName}
                                  placeholder="Enter your Full Name"
                                />
                                {errors.FullName && touched.FullName && (
                                  <p className="form-error">
                                    {errors.FullName}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="row mt-2">
                              <div className="col-lg-6 col-md-6">
                                <label
                                  className=""
                                  style={{ fontWeight: "400 !important" }}
                                >
                                  Contact Number
                                  <span className="maditory">*</span>
                                </label>

                                <input
                                  className="form-control"
                                  name="ContactNumber"
                                  maxLength={12}
                                  onBlur={handleBlur}
                                  onChange={(e) => {
                                    regex.numberTyping.test(e.target.value) &&
                                      handleChange(e);
                                  }}
                                  value={values.ContactNumber}
                                  placeholder="Enter your Contact Number"
                                />
                                {errors.ContactNumber &&
                                  formik.touched.ContactNumber && (
                                    <p className="form-error">
                                      {errors.ContactNumber}
                                    </p>
                                  )}
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <label
                                  className=""
                                  style={{ fontWeight: "400 !important" }}
                                >
                                  Email Address
                                  <span className="maditory">*</span>
                                </label>
                                <input
                                  type="email"
                                  className="form-control tags_input"
                                  maxLength={150}
                                  name="EmailAddress"
                                  placeholder="Enter your Email Address"
                                  onChange={(e) => {
                                    handleChange(e);
                                  }}
                                  onBlur={handleBlur}
                                  value={values.EmailAddress}
                                />
                                {errors.EmailAddress &&
                                  formik.touched.EmailAddress && (
                                    <p className="form-error">
                                      {errors.EmailAddress}
                                    </p>
                                  )}
                              </div>
                            </div>
                            <div className="row mt-2">
                              <div className="col-lg-12 col-md-12">
                                <label style={{ fontWeight: "400 !important" }}>
                                  Area Of Concern
                                  <span className="maditory">*</span>
                                </label>
                                <Select
                                  name="AreaOfConcern"
                                  className="dropstyle"
                                  styles={customStyles}
                                  placeholder="Select Area Of Concern"
                                  id="react-select-4-listbox areaOfConcern"
                                  isClearable={true}
                                  options={areaOfConcernList}
                                  value={formik.values.AreaOfConcern}
                                  onBlur={() => {
                                    setAreaTouched(true);
                                  }}
                                  onChange={(option: any) => {
                                    let event = {
                                      target: {
                                        name: "AreaOfConcern",
                                        value: option,
                                      },
                                    };
                                    handleChange(event);
                                  }}
                                />

                                {errors.AreaOfConcern && areaTouched && (
                                  <p className="form-error">
                                    {errors.AreaOfConcern}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="row mt-2">
                              <div className="col-lg-12 col-md-12">
                                <label
                                  className=""
                                  style={{ fontWeight: "400 !important" }}
                                >
                                  Query/ Concern
                                </label>
                                <span className="error">*</span>
                                <textarea
                                  name="QueryorConcern"
                                  autoComplete="off"
                                  maxLength={500}
                                  minLength={10}
                                  style={{ resize: "none", maxHeight: "75%" }}
                                  placeholder="Enter your Query or Concern"
                                  onChange={handleChange}
                                  value={values.QueryorConcern}
                                  onBlur={handleBlur}
                                  className="form-control"
                                ></textarea>
                                {errors.QueryorConcern &&
                                  formik.touched.QueryorConcern && (
                                    <p className="form-error">
                                      {errors.QueryorConcern}
                                    </p>
                                  )}
                              </div>

                              <div className="col-lg-12">
                                <div className="row">
                                  <div className="col-lg-9 col-md-9">
                                    <p
                                      className="m-auto align-self-center"
                                      style={{
                                        fontSize: "14px",
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "baseline",
                                          // cursor: "pointer",
                                        }}
                                      >
                                        <label style={{ cursor: "pointer" }}>
                                          <span className="mr-1 mt-2">
                                            <FaCloudUploadAlt />
                                          </span>
                                          <input
                                            title={values.Image}
                                            className="file-upload-input"
                                            type="file"
                                            value={values.Image}
                                            onChange={(event: any) => {
                                              handleImageChange(event);
                                            }}
                                          />
                                          Upload image
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
                                  <div
                                    className="col-lg-2 col-md-2 ml-5 mt-3"
                                    style={{ float: "right" }}
                                  >
                                    <LoadingButton
                                      type="submit"
                                      onClick={() => {
                                        setAreaTouched(true);
                                      }}
                                      endIcon={<SendIcon />}
                                      loading={loading}
                                      loadingPosition="end"
                                      variant="contained"
                                    >
                                      <span>Send</span>
                                    </LoadingButton>
                                  </div>

                                  {fileformat && (
                                    <p className="form-error ml-3">
                                      Please select a image with PNG, JPG or
                                      JPEG format.
                                    </p>
                                  )}
                                  {filesize && (
                                    <p className="form-error ml-3">
                                      File size should not exceed 1MB.
                                    </p>
                                  )}
                                  {lockerror && (
                                    <p className="form-error ml-3">
                                      User does not have permission to upload
                                      protected file.
                                    </p>
                                  )}

                                  {errormsg && <div>{errormsg}</div>}
                                </div>
                                <p
                                  className="text-primary"
                                  style={{
                                    fontSize: "12px",
                                    fontStyle: "italic",
                                  }}
                                >
                                  Note : File format of JPG, JPEG & PNG of max
                                  size of 1MB is allowed.
                                </p>

                                <span
                                  id="resume-Span"
                                  style={{
                                    fontSize: "14px",
                                    fontStyle: "italic",
                                    color: "#4a3833",
                                  }}
                                >
                                  Upload a image which will help us to
                                  understand the problem better.
                                </span>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        }}
      </Formik>
    </>
  );
};

export default QuickContact;
