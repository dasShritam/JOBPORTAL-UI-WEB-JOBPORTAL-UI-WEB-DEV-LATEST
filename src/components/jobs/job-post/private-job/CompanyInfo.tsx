import { Field } from "formik";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AsyncCreatableSelect from "react-select/async-creatable";
import { Modal } from "react-bootstrap";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import "../../../../assets/customCss/jobs/job-post.css";
import { customStyles } from "../../../../common/common";
import { BsPersonCircle } from "react-icons/bs";
// import "../../../../assets/customCss/jobs/"

interface ColourOption {
  label: string;
  value: string;
}
// const optionsforclientname = [
//   { label: "wipro", value: "wipro" },
//   { label: "mindtree", value: "mindtree" },
//   { label: "capgemini", value: "capgemini" }

// ]

// const optionsforEmail = [
//   { label: "jhon@gmail.com", value: "jhon@gmail.com" },
//   { label: "Ethan@gmail.com", value: "Ethan@gmail.com" },
//   { label: "josh@gmail.com", value: "josh@gmail.com" }

// ]
const noofRefresh = [
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
  { label: "6", value: 6 },
  { label: "7", value: 7 },
  { label: "8", value: 8 },
  { label: "9", value: 9 },
  { label: "10", value: 10 },
];
const oftenmailoption = [
  { label: "On every new apply", value: "On every new apply" },
  { label: "Daily summary", value: "Daily summary" },
];

function CompanyInfo(props: any) {
  const [optionsforclientname, setOptionsforClientname] = useState([
    { label: "", value: "" },
  ]);


  const [RefType, setRefType] = useState("");
  const [modelpopup, setModelpopup] = useState(false);
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [NoOfRef, setNoOfRef] = useState<any>("")
  const [refreshEndsAfter, setRefreshEndsAfter] = useState("")
  const [emailNotify, setEmailNotify] = useState<any>([]);
  const [count, setCount] = useState(0);
  const [refreshType, setRefreshType] = useState<any>("");
  const [datedisplay, setDateDisplay] = useState<any>("");
  const [disendDate, setDisendDate] = useState<any>("");
  const [noOfRefresh, setNoOfRefresh] = useState<any>("");
  const MAX_LENGTH_CLIENTNAME = 100;
  const [sdateError, setSdateError] = useState(false);
  const [edateError, setEdateError] = useState(false);
  const [refreshError, setRefreshError] = useState(false);
  const [optionsforEmail, setOptionsforEmail] = useState<any>();
  const [companyname, setcompanyname] = useState<any>([]);
  const [formvalue, setformvalue] = useState<any>();
  const [refreshstartdateError, setRefreshstartdateError] = useState("");
  const [refreshsenddateError, setRefreshenddateError] = useState("");
  const CompanymasterData = useSelector((state: any) => state.compnayname);
  const empDetails = useSelector((state: any) => state.employeeProfile);
  const { MailIDs, loadingM } = useSelector((state: any) => state.getEpmMails);
  const { EmployerProfile, loading } = empDetails;
  const { CompanyData } = CompanymasterData;
  const listingJob = useSelector((state: any) => state.ManageJobs);
  const { allManageJobs, manageJobLoading } = listingJob;
  const PostJob = useSelector((state: any) => state.PostJob);

  useEffect(() => {
    if (!loading && EmployerProfile?.data && EmployerProfile?.data)
      setformvalue(EmployerProfile?.data?.acountInfo);
  }, [EmployerProfile?.data, loading]);

  function setData() {
    setRefType(props.values.schedule.refreshType)
    setRefreshEndsAfter(props.values.schedule.refreshEndsAfter)
    props.values.schedule.refreshEndsAfter == "After" &&
      setNoOfRef(props.values.schedule.noOfRefresh)
    props.values.schedule.refreshType &&
      props.values.schedule.start &&
      setStartDate(dayjs(new Date(props.values.schedule.start)));

    props.values.schedule.refreshDate && props.values.schedule.refreshEndsAfter == "ON" &&
      setEndDate(
        dayjs(new Date(props.values.schedule.refreshDate))
      );


  }

  useEffect(() => {
    if (PostJob?.res?.code === 200) {
      setData()
    }
    else {
      setNoOfRef(null)
      setNoOfRefresh(null)
      setStartDate(null)
      setEndDate(null)
      setRefType("")
      setRefreshEndsAfter("")
      props.values.schedule.refreshType = "Do Not refresh"
      props.values.schedule.start = null
      props.values.schedule.refreshDate = null
      props.values.schedule.refreshEndsAfter = "After"
    }

  }, [PostJob?.res])
  useEffect(() => {
    if (CompanyData) {
      const Data = CompanyData?.map((c: any) => {
        return {
          label: c,
          value: c,
        };
      });
      setOptionsforClientname(Data);
    }

    // setStartDate(dayjs(new Date(props.values.schedule.start)))
    // setStartDate(props.values.schedule.start)
  }, [CompanyData]);

  useEffect(() => {
    setEmailNotify(props.values.notifyMatch);
    let recruiterAllMail = MailIDs?.data?.map((EM) => {
      return { label: EM.email, value: EM.email };
    });
    setOptionsforEmail(recruiterAllMail);
  }, [MailIDs?.data, formvalue?.email]);

  const components = {
    DropdownIndicator: null,
  };

  const isValidCLientName = (inputValue, selectValue, selectOptions) => {
    if (inputValue.length === 0 || inputValue.length > MAX_LENGTH_CLIENTNAME) {
      return false;
    }
    const isDuplicate = selectOptions.find(
      (option) => option.label === inputValue
    );
    if (isDuplicate) {
      return false;
    }
    return true;
  };

  const FilterOptionsEmail = (inputValue: string) => {
    return optionsforEmail?.filter((i) =>
      i.label?.toLowerCase().includes(inputValue?.toLowerCase())
    );
  };
  const promiseOptionsEmail = (inputValue: string) =>
    new Promise<ColourOption[]>((resolve) => {
      setTimeout(() => {
        resolve(FilterOptionsEmail(inputValue));
      }, 1000);
    });

  const FilterOptionsClient = (inputValue: string) => {
    return optionsforclientname.filter((i) =>
      i.label?.toLowerCase().includes(inputValue?.toLowerCase())
    );
  };
  const promiseOptionsClient = (inputValue: string) =>
    new Promise<ColourOption[]>((resolve) => {
      setTimeout(() => {
        resolve(FilterOptionsClient(inputValue));
      }, 1000);
    });

  const handleHideWorkSample = () => {
    setModelpopup(true);
  };

  const handleSelectOption = (option) => {
    const res = handleChangeInput(option);
    if (res) {
      setEmailNotify(option);
      props.values.notifyMatch = option;
    }
  };

  const getRepostMessage = () => {
    if (props.values.schedule.refreshType !== "Do Not refresh" && noOfRefresh) {
      return `This Job will be refreshed ${refreshType} from ${datedisplay} and will be stopped after ${noOfRefresh} refreshes.`;
    } else if (
      (props.values.schedule.refreshType !== "Do Not refresh" &&
        props.values.schedule.refreshDate && props.values.schedule.refreshDate != null &&
        startDate) ||
      (props.values.schedule.refreshDate &&
        props.values.schedule.refreshType !== "Do Not refresh")
    ) {
      return `This Job will be refreshed ${refreshType} from ${datedisplay ? datedisplay : props.values.schedule.start
        } to ${disendDate ? disendDate : moment(
          new Date(props.values.schedule.refreshDate)
        ).format("DD-MMM-YYYY")

        }.`;
    }
    return "This job will not be refreshed";
  };

  const handleChangeInput = (e): boolean => {
    const options = e
      .map((opt) => opt.value)
      .toString()
      .replaceAll(",", "");

    // if (skills.length > 500) {
    //   return false;
    // } else if (skills.length) {
    //   setErrorMsg(false);
    // } else {
    //   setErrorMsg(true);
    //   setSkillsCount(skills.length);
    //   return true;
    // }
    // setSkillsCount(skills.length);
    return true;
  };

  function disableRandomDates(date) {
    return date < new Date();
  }

  return (
    <div id="companyInfo_bx" className="job-bx bg-white m-b30">
      <h5 className="mb-2">Company Info</h5>
      <div className="row">
        <div className="col-lg-12 ">
          <label>Company Name </label>
          <input
            type="text"
            value={EmployerProfile?.data?.profile?.name}
            style={{ cursor: "not-allowed" }}
            // value={EmployerProfile?.data.profile?.name}
            readOnly
            className="form-control"
          />
          <br />
          {/* <label>Company URL</label>
          <input type="text" maxLength={250} placeholder='Enter Company URL' name='companyUrl' onChange={props.handleChange} className='form-control' />
          {props.errors.companyUrl && props.touched.companyUrl ? (<p className='form-error'>{props.errors.companyUrl}</p>)
            : null
          }
          <br /> */}
          <label>Client Name</label>
          <AsyncCreatableSelect
            components={components}
            placeholder="Enter Client Name"
            cacheOptions
            isClearable={true}
            noOptionsMessage={() => "Enter keyword to search"}
            name="clientName"
            isValidNewOption={isValidCLientName}
            value={
              props?.values?.clientName?.label ? props?.values?.clientName : ""
            }
            onChange={(e: any) => {
              let event = {
                target: {
                  name: "clientName",
                  value: e,
                },
              };
              props.handleChange(event);
            }}
            className={"dropstyle"}
            loadOptions={promiseOptionsClient}
          />
          <br />

          <label>Client Company Address</label>
          <textarea
            className="form-control"
            name="clientDetails"
            onChange={(e: any) => {
              props.handleChange(e);
              setCount(e.target.value.length);
            }}
            maxLength={500}
            placeholder="Enter Client Company Address"
            value={props.values.clientDetails}
          ></textarea>
          <span className="custom-char-count">
            {props?.values?.clientDetails?.length
              ? 500 - props.values.clientDetails.length
              : 500 - count}{" "}
            Character(s) Left
          </span>

          <div className="d-flex justify-content-between mt-3">
            <div>
              <label>Recruiter Details</label>
              <p className="font_italic_sm">
                These details will {!props.values.showRecruiterDetails && "not"}{" "}
                be visible to candidate
              </p>
            </div>
            <span className="custom-control custom-checkbox float-right">
              <input
                type="checkbox"
                className="custom-control-input"
                name="showRecruiterDetails"
                checked={props.values.showRecruiterDetails}
                onChange={props.handleChange}
                id="showdetails"
              />
              <label className="custom-control-label " htmlFor="showdetails">
                Show Recruiter Details
              </label>
            </span>
          </div>
        </div>
        <div className="col-lg-12 ">
          <ul className="list-unstyled">
            <li>
              <div className="post-bx">
                <div className="d-flex isHotDiv">
                  <div className="job-post-company">
                    <Link to={""}>
                      <span>
                        {/* <img alt="" src={item.image} /> */}
                        {/* <img src={true ? "https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg" : ""} alt="" /> */}
                        <BsPersonCircle style={{ fontSize: "60px" }} />
                      </span>
                    </Link>
                  </div>
                  <div className="job-post-info">
                    <h5>{formvalue?.name}</h5>
                    <ul className="list-unstyled">
                      <li>{formvalue?.email}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div className="col-lg-12 ">
          <span className="custom-control custom-checkbox mb-2">
            <input
              type="checkbox"
              className="custom-control-input"
              name="isNotifyMatch"
              checked={props.values.isNotifyMatch}
              // checked={props?.values?.notifyMatch?.length > 0 ? true : false}
              onChange={(e) => {
                props.handleChange(e);
              }}
              id="isNotifyMatch"
            />
            <label className="custom-control-label " htmlFor="isNotifyMatch">
              On which Email ID's do you want to receive notifications of
              matching applications?
            </label>
          </span>

          {props.values.isNotifyMatch == true && (
            <AsyncSelect
              placeholder="Select Email To Get Notification"
              cacheOptions
              isClearable={false}
              className="dropstyle"
              name="notifyMatch"
              isMulti
              value={props.values.notifyMatch}
              // value={emailNotify}
              onChange={(e) => {
                handleSelectOption(e);
              }}
              defaultOptions
              loadOptions={promiseOptionsEmail}
            // isValidNewOption={isValidEmail}
            />
          )}
          <br />

          <label htmlFor="">How often should mails be send ?</label>
          <div className="row">
            <Select
              maxMenuHeight={200}
              placeholder=" Select how often should mails be send"
              minMenuHeight={100}
              isSearchable={true}
              isDisabled={false}
              options={oftenmailoption}
              name="OftenMail"
              value={
                props?.values?.OftenMail?.label ? props?.values?.OftenMail : ""
              }
              onChange={(selectedOption: any) => {
                let event = {
                  target: {
                    name: "OftenMail",
                    value: selectedOption,
                  },
                };
                props.setFieldValue("OftenMail", selectedOption);
                // props.handleChange(event);
              }}
              className="dropstyle col-lg-5"
              styles={customStyles}
            />
          </div>
          {(props?.values?.OftenMail?.value &&
            props.values.OftenMail.value.toLowerCase()) == "daily summary" && (
              <p className="col-lg-12  c_content_desc alert alert-warning mb-3 mt-3  ">
                Recommended if you do not wish to receive a high volume of emails
                in your inbox. A summary email with responses received in last 24
                hours will be sent on the specified email IDs every morning.
              </p>
            )}
          <br />

          <span className="font_italic_md">
            <span>{getRepostMessage()}&nbsp;</span>
            <Link
              to={"#"}
              onClick={() => {
                setModelpopup(true);
                setData()
              }}
            >
              Change It
            </Link>{" "}
          </span>
        </div>
      </div>

      <Modal
        className="modal fade browse-job modal-bx-info editor mt-5 "
        show={modelpopup}
        backdrop="static"
        onHide={() => {
          handleHideWorkSample();
        }}
      >
        <div
          className="modal-dialog my-0"
          role="document"
          style={{ width: "100%" }}
        >
          <div className="modal-content">
            <div className="modal-custom-header p-2" id="headerjds">
              <h5 className="modal-title"> Schedule Refresh</h5>
              <button
                type="button"
                className="close"
                title="Close"
                onClick={() => {
                  setModelpopup(false);
                  setStartDate(null);
                  setEndDate(null);
                  // props.resetForm();
                  setSdateError(false);
                  setEdateError(false);
                  setRefreshError(false);
                  // props.values.schedule.refreshType = ""
                }}
              >
                {" "}
                <i
                  style={{ color: "white" }}
                  className="fa fa-times"
                  aria-hidden="true"
                ></i>
              </button>
            </div>
            <div className="modal-body">
              {/*  id='headerjds' */}

              <form>
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                      <label>Refresh this job every</label>
                      <br />
                      <div className="row">
                        <div className="col-md-3 ">
                          <div className="custom-control custom-radio">
                            <input
                              type="radio"
                              className="custom-control-input"
                              id="Weekly"
                              name="schedule.refreshType"
                              value="Weekly"
                              checked={
                                RefType == "Weekly"
                                // props.values.schedule.refreshType == "Weekly"
                              }
                              // onChange={props.handleChange}
                              onChange={(e) => {
                                setRefType("Weekly")
                              }}
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="Weekly"
                            >
                              Weekly
                            </label>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="custom-control custom-radio">
                            <input
                              type="radio"
                              className="custom-control-input"
                              id="Fortnight"
                              name="schedule.refreshType"
                              value="Fortnight"
                              checked={
                                RefType == "Fortnight"
                                // props.values.schedule.refreshType == "Fortnight"
                              }
                              // onChange={props.handleChange}
                              onChange={(e) => {
                                setRefType("Fortnight")
                              }}
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="Fortnight"
                            >
                              Fortnight
                            </label>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="custom-control custom-radio">
                            <input
                              type="radio"
                              className="custom-control-input"
                              id="Month"
                              name="schedule.refreshType"
                              value="Month"
                              // onChange={props.handleChange}
                              onChange={(e) => {
                                setRefType("Month")
                              }}
                              checked={
                                RefType == "Month"
                                // props.values.schedule.refreshType == "Month"
                              }
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="Month"
                            >
                              Month
                            </label>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="custom-control custom-radio">
                            <input
                              type="radio"
                              className="custom-control-input"
                              id="Do Not refresh"
                              name="schedule.refreshType"
                              value="Do Not refresh"
                              checked={
                                RefType == "Do Not refresh"
                                // props.values.schedule.refreshType ==
                                // "Do not refresh"
                              }
                              onChange={(e) => {
                                // props.handleChange(e);                                
                                setRefType("Do Not refresh")
                                // props.values.schedule.refreshType = ""
                                // props.values.schedule.start = ""
                                setStartDate(null)
                                setEndDate(null)
                                // props.values.schedule.noOfRefresh = null
                              }}
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="Do Not refresh"
                            >
                              Do not Refresh
                            </label>
                          </div>
                        </div>
                      </div>
                      <br />

                      {RefType !==
                        "Do Not refresh" && (
                          <>
                            <div className="row mb-4">
                              <div className="col-md-5">
                                <label htmlFor="">
                                  Start Refresh From
                                  <span className="form-error">*</span>
                                </label>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                  <DemoContainer components={["DatePicker"]}>
                                    <DatePicker
                                      className="dobselect fs-6 "
                                      minDate={dayjs(new Date())}
                                      value={startDate}
                                      // defaultValue={dayjs(new Date())}
                                      shouldDisableDate={disableRandomDates}
                                      sx={{ width: "100%" }}
                                      format="DD/MM/YYYY"
                                      // defaultValue={startDate?startDate:new Date("2023-04-18")}
                                      disablePast={true}
                                      onChange={(newValue) => {
                                        setSdateError(false);
                                        setEndDate(null);
                                        if (
                                          newValue?.$D &&
                                          newValue?.$M + 1 &&
                                          newValue?.$y &&
                                          new Date(
                                            `${newValue?.$M + 1}/${newValue?.$D
                                            }/${newValue?.$y}`
                                          ) < new Date()
                                        ) {
                                          setStartDate(null);
                                          // props.values.schedule.start = "";
                                          setRefreshstartdateError(
                                            "Please select the future date."
                                          );
                                        } else {
                                          setStartDate(newValue);
                                          setRefreshstartdateError("");
                                          // props.setFieldValue('schedule.start', `${new Date(`${newValue?.$y}, ${newValue?.$M + 1} ,${newValue?.$D}`)}`)
                                          // props.values.schedule.start = newValue;
                                        }
                                      }}
                                      onClose={() => {
                                        // setTouchedDob(true);
                                      }}
                                    />
                                  </DemoContainer>
                                </LocalizationProvider>
                                {refreshstartdateError && (
                                  <p className="form-error">
                                    {refreshstartdateError}
                                  </p>
                                )}
                                {!refreshstartdateError && sdateError && (
                                  <p className="form-error">
                                    Please Select Start Date.
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-md-6">
                                <div className="custom-control custom-radio d-flex mb-2">
                                  <input
                                    type="radio"
                                    className="custom-control-input"
                                    id="refreshAfter"
                                    name="schedule.refreshEndsAfter"
                                    value="After"
                                    checked={
                                      refreshEndsAfter ==
                                      "After"
                                    }
                                    onChange={(e) => {
                                      setRefreshenddateError("");
                                      // setSdateError(false)
                                      setEdateError(false);
                                      setEndDate(null);
                                      // props.handleChange(e);
                                      setRefreshEndsAfter("After")
                                    }}
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="refreshAfter"
                                  >
                                    Refresh Ends After
                                    <span className="form-error">*</span>
                                  </label>
                                </div>
                                <Select
                                  maxMenuHeight={100}
                                  placeholder="0"
                                  minMenuHeight={100}
                                  isSearchable={true}
                                  isDisabled={
                                    refreshEndsAfter !==
                                    "After"
                                  }
                                  options={noofRefresh}
                                  name="schedule.noOfRefresh"
                                  // value={props.values.schedule.noOfRefresh}
                                  value={NoOfRef}
                                  onChange={(selectedOption: any) => {
                                    setRefreshError(false);
                                    let event = {
                                      target: {
                                        name: "schedule.noOfRefresh",
                                        value: selectedOption,
                                      },
                                    };
                                    // props.setFieldValue(
                                    //   "schedule.noOfRefresh",
                                    //   selectedOption
                                    // );
                                    setNoOfRef(selectedOption)
                                    setEndDate(null)
                                    // props.handleChange(event);
                                  }}
                                  className="dropstyle"
                                  styles={customStyles}
                                />
                                <label htmlFor="refreshAfter">Refresh(s)</label>
                                {refreshError && (
                                  <p className="form-error">
                                    Please Select no of refresh.
                                  </p>
                                )}
                              </div>
                              <br />
                              <div className="col-md-6">
                                <div>
                                  <div className="custom-control custom-radio">
                                    <input
                                      type="radio"
                                      className="custom-control-input"
                                      id="refreshEndON"
                                      name="schedule.refreshEndsAfter"
                                      value="ON"
                                      onChange={(e) => {
                                        // props.handleChange(e);
                                        setRefreshError(false);
                                        setNoOfRef(null)
                                        setRefreshEndsAfter("ON")
                                        // props.values.schedule.noOfRefresh = null;
                                      }}
                                      checked={
                                        refreshEndsAfter ==
                                        "ON" || endDate
                                      }
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="refreshEndON"
                                    >
                                      ON
                                    </label>
                                  </div>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DemoContainer components={["DatePicker"]}>
                                      <DatePicker
                                        className="dobselect fs-6 "
                                        value={endDate}
                                        sx={{ width: "100%" }}
                                        format="DD/MM/YYYY"
                                        disabled={
                                          refreshEndsAfter == "After"
                                          // !startDate ||
                                          // props.values.schedule
                                          //   .refreshEndsAfter == "After"
                                        }
                                        minDate={startDate}
                                        onChange={(newValue) => {
                                          setEdateError(false);
                                          setRefreshError(false);
                                          setRefreshEndsAfter("ON")
                                          // props.values.schedule.refreshEndsAfter =
                                          //   "ON";
                                          if (
                                            newValue?.$D &&
                                            newValue?.$M + 1 &&
                                            newValue?.$y &&
                                            new Date(
                                              `${newValue?.$M + 1}/${newValue?.$D
                                              }/${newValue?.$y}`
                                            ) <
                                            new Date(
                                              `${startDate?.$M + 1}/${startDate?.$D
                                              }/${startDate?.$y}`
                                            )
                                          ) {
                                            setEndDate(null);
                                            setRefreshenddateError(
                                              "End date should be greater than Start date."
                                            );
                                            // props.setFieldValue(
                                            //   "schedule.refreshDate",
                                            //   ""
                                            // );
                                          } else {
                                            setEndDate(newValue);
                                            setRefreshenddateError("");
                                            // setNoOfRefresh("")
                                            setNoOfRef(null)
                                            // props.setFieldValue(
                                            //   "schedule.refreshDate",
                                            //   newValue
                                            // );
                                          }
                                        }}
                                        onClose={() => {
                                          // setTouchedDob(true);
                                        }}
                                      />{" "}
                                    </DemoContainer>{" "}
                                  </LocalizationProvider>
                                  <label
                                    htmlFor=""
                                    style={{ position: "absolute" }}
                                  ></label>
                                  {refreshsenddateError && !edateError && (
                                    <p className="form-error">
                                      {refreshsenddateError}
                                    </p>
                                  )}
                                  {edateError && (
                                    <p className="form-error">
                                      Please Select End Date.
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                    </div>
                    <div className="modal-custom-footer">
                      <button
                        className="site-button float-right"
                        type="button"
                        onClick={async (e) => {
                          refreshEndsAfter == "ON" &&
                            !endDate &&
                            setEdateError(true);

                          refreshEndsAfter == "After" &&
                            !endDate &&
                            // props.values.schedule.noOfRefresh
                            NoOfRef
                            == null &&
                            setRefreshError(true);

                          // props.values.schedule.refreshEndsAfter == 'After' && !startDate &&
                          if (!startDate) {
                            await setSdateError(true);
                            //  props.values.schedule.refreshEndsAfter == 'After' && setSdateError(false); setEdateError(false);
                          }
                          // setRefreshType(RefType);
                          startDate
                            ? setDateDisplay(
                              moment(
                                new Date(startDate)
                              ).format("DD-MMM-YYYY")
                            )
                            : setDateDisplay("");
                          // NoOfRef && setNoOfRefresh(
                          //   NoOfRef.value
                          //   // props.values?.schedule?.noOfRefresh?.value
                          // );
                          refreshEndsAfter == "ON" && endDate
                            ? setDisendDate(
                              moment(
                                new Date(endDate)
                              ).format("DD-MMM-YYYY")
                            )
                            : setDisendDate("");

                          if (
                            RefType ==
                            "Do Not refresh" ||
                            (startDate &&
                              (endDate || NoOfRef))
                          ) {
                            props.values.schedule.refreshType = RefType
                            props.values.schedule.start = startDate
                            // props.values.schedule.noOfRefresh = NoOfRef
                            props.values.schedule.refreshDate = endDate
                            if (refreshEndsAfter == "After") {
                              props.values.schedule.refreshEndsAfter = "After"
                              props.values.schedule.noOfRefresh = NoOfRef
                              props.values.schedule.refreshDate = ""
                              setEndDate(null)
                              NoOfRef && setNoOfRefresh(
                                NoOfRef.value
                                // props.values?.schedule?.noOfRefresh?.value
                              );
                            }
                            else if (refreshEndsAfter == "ON") {
                              props.values.schedule.refreshEndsAfter = "ON"
                              props.values.schedule.noOfRefresh = ""
                              setNoOfRef(null)
                              setNoOfRefresh(null)
                              props.values.schedule.refreshDate = endDate
                            }
                            setRefreshType(RefType);
                            setModelpopup(false);
                            setRefreshError(false);
                            setSdateError(false);
                            setEdateError(false);
                          }
                          if (
                            RefType ==
                            "Do Not refresh"
                          ) {
                            props.values.schedule.start = "";
                            props.values.schedule.refreshDate = "";
                            setStartDate(null);
                            setEndDate(null);
                            props.values.schedule.noOfRefresh = null;
                          }
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default CompanyInfo;
