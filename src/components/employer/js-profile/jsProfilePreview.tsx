import React, { useEffect, useState, useRef, lazy } from "react";

import "../../../assets/customCss/previewjs.css";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import html2pdf from "html2pdf.js";
import { Button } from "@mui/material";
import {
  getApplicantInfo,
  resetApplicatInfo,
} from "../../../redux/features/employer/jsprofilepreviewslice";
import { useDispatch, useSelector } from "react-redux";
import {
  resetAppStatusRestset,
  updateAppStatus,
} from "../../../redux/features/employer/applicationStatusslice";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import { downloadAppImage } from "../../../redux/features/employer/downloadMedia";

import Select from "react-select";
import { recruitmentMailReset } from "../../../redux/features/employer/recruitmentMailslice";
import JsProfilePreviewSkelton from "./jsProfilePreviewSkelton";
import AssessmentDetails from "./AssessmentDetails";
import { resetJsProfileViewSlice } from "../../../redux/features/employer/js-view/JsProfileViewSlice";
const EmailModel = lazy(() => import("../../shared/emailModel"));
const Commentprofile = lazy(() => import("./comment"));
const ProfileVideo = lazy(() => import("./profileVideo"));
const ListingSidebars = lazy(() => import("./listingSidebars"));
const CandidateDetails = lazy(() => import("./candidateDetails"));
const QuestionList = lazy(() => import("./questionList"));
const WorkExp = lazy(() => import("./workExp"));
const Education = lazy(() => import("./education"));
const ProjectDetails = lazy(() => import("./projectDetails"));
const ItSkills = lazy(() => import("./itSkills"));
const OtherDetails = lazy(() => import("./otherDetails"));
const AttachResume = lazy(() => import("./attachResume"));

const JsProfilePreview = (props: any) => {
  // start View resume
  const handleClickScroll = () => {
    const element = document.getElementById("section-1");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // End View resume

  const htmlContent = "";
  const containerRef = useRef<HTMLDivElement>(null);
  const handleConvertToPdf = () => {
    const element = containerRef.current;
    if (element) {
      html2pdf().from(element).save();
    }
  };

  // Toaster
  const showSnackAlert = UseToastAlert();
  const dispatch = useDispatch();
  const [uid] = useSearchParams();
  const [jid] = useSearchParams();
  const [profileValue, setProfileValue] = useState<any>("");
  const [bindAppProfile, setBindAppProfile] = useState<any>();
  const [scoreVal, setscoreVal] = useState<any>("");
  const [match, setMatch] = useState<any>("");
  const useridVal: any = uid.get("uid");
  const job_idVal: any = jid.get("jid");
  const [status, setStatus] = useState<any>(null);
  const [desVal, setdesVal] = useState<any>("");
  const [emailId, setEmailId] = useState<any>("");
  const [matched, setmatched] = useState<any>([]);
  const [notMatched, setnotMatched] = useState<any>([]);
  const [url, setUrl] = useState<any>("");

  /* Start Applicant info API */
  const applicantProfile = useSelector((state: any) => state.jsPrfilePreview);
  const { ApplicantInfo, loading } = applicantProfile;
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(resetApplicatInfo());
    const applicantomodel: any = {
      user_id: useridVal,
      jobid: job_idVal,
    };
    dispatch(getApplicantInfo(applicantomodel));
  }, [dispatch]);

  useEffect(() => {
    if (!loading && ApplicantInfo?.data && ApplicantInfo?.data) {
      setProfileValue(ApplicantInfo);
    } else if (ApplicantInfo?.response?.data?.code == 429) {
      Swal.fire({
        html: `You have exceeded the limit/time to preview job seekers profile. Please <a href="/public/quick-contact"  target="_blank">contact support</a>.`,
        icon: "warning",
        showCancelButton: false,
        confirmButtonColor: "red",
        allowOutsideClick: false,
        confirmButtonText: "OK",
      }).then(async (result) => {
        if (result?.isConfirmed) {
          await dispatch(resetJsProfileViewSlice());
          navigate(-1);
        }
      });
    }
  }, [ApplicantInfo, loading]);

  useEffect(() => {
    if (profileValue.code === 200) {
      setBindAppProfile(profileValue?.data?.applicant_info);
    }
  }, [profileValue]);

  useEffect(() => {
    if (!loading && ApplicantInfo?.data && ApplicantInfo?.data) {
      setEmailId(bindAppProfile?.uname);
    }
  }, [ApplicantInfo, loading, bindAppProfile?.uname]);

  /* End Applicant info API */

  /* Start application status API */

  const applicationStatus = useSelector((state: any) => state.appStatus);
  const { ApplicationStatus, loadingStatus } = applicationStatus;
  const { Emails, loadReM } = useSelector((state: any) => state.emailSend);

  useEffect(() => {
    if (!loadingStatus && ApplicationStatus?.code === 200) {
      showSnackAlert("success", ApplicationStatus?.message);
      dispatch(resetAppStatusRestset());
    } else if (
      !loadingStatus &&
      ApplicationStatus &&
      ApplicationStatus?.code !== 200
    ) {
      // showSnackAlert("warning", ApplicationStatus.message);
      dispatch(resetAppStatusRestset());
    }
  }, [loadingStatus, ApplicationStatus?.code]);

  /* End application status API */

  /* Start Image Download API */

  const { image, load } = useSelector((state: any) => state.downloadAppImg);

  useEffect(() => {
    dispatch(resetAppStatusRestset());
    dispatch(downloadAppImage(useridVal));
    if (sessionStorage?.getItem("goBack"))
      setUrl(
        sessionStorage?.getItem("goBack")
          ? sessionStorage?.getItem("goBack")
          : ""
      );
    return () => {
      dispatch(resetAppStatusRestset());
      dispatch(resetApplicatInfo());
    };
  }, []);
  useEffect(() => {
    const temp: any = sessionStorage?.getItem("goBack");
    if (!url && temp) {
      setUrl(temp);
    }
  }, [url, sessionStorage]);

  /* End Image Download API */

  const [showEmailModel, setShowEmailModel] = useState(false),
    [sendEmail, setSendEmail] = useState(false),
    [emailreg, setEmailreg] = useState(false);

  const handleOpenEmailModel = () => {
    setShowEmailModel(!showEmailModel);
  };

  const profileDelete = () => {
    setEmailreg(true);
  };

  const closeModel = () => {
    setEmailreg(false);
  };
  const deleteprofile = () => {
    setEmailreg(false);
    //  navigate("/employerSignin");
  };

  //low, high , medium match

  useEffect(() => {
    setscoreVal(bindAppProfile?.score);
    if (scoreVal) {
      if (scoreVal?.total >= 60) {
        setMatch("High Match");
      } else if (scoreVal?.total >= 40 && scoreVal?.total < 60) {
        setMatch("Medium Match");
      } else if (scoreVal?.total < 40) {
        setMatch("Low Match");
      }
    }
  });

  useEffect(() => {
    if (!loading && ApplicantInfo?.data) {
      setdesVal(
        scoreVal && scoreVal?.rel_score && JSON.parse(scoreVal?.rel_score)
      );
    }
  }, [scoreVal, ApplicantInfo]);

  useEffect(() => {
    matched.splice(0, matched?.length);
    notMatched.splice(0, notMatched?.length);
    setnotMatched([]);
    setmatched([]);
    let temp1: any[] = [],
      temp2: any[] = [];
    if (desVal && desVal.designation && desVal.designation > 49) {
      temp1.push("Designation");
    } else if (
      desVal &&
      (desVal.designation || desVal.designation === 0) &&
      desVal.designation < 50
    ) {
      temp2.push("Designation");
    }
    if (desVal && desVal.skills && desVal.skills > 49) {
      temp1.push("Skills");
    } else if (
      desVal &&
      (desVal.skills || desVal.skills === 0) &&
      desVal.skills < 50
    ) {
      temp2.push("Skills");
    }
    if (desVal && desVal.experience && desVal.experience > 49) {
      temp1.push("Experience");
    } else if (
      desVal &&
      (desVal.experience || desVal.experience === 0) &&
      desVal.experience < 50
    ) {
      temp2.push("Experience");
    }
    if (desVal && desVal.location && desVal.location > 49) {
      temp1.push("Location");
    } else if (
      desVal &&
      (desVal.location || desVal.location === 0) &&
      desVal.location < 50
    ) {
      temp2.push("Location");
    }
    setmatched(temp1);
    setnotMatched(temp2);
  }, [desVal]);
  useEffect(() => {}, [notMatched, matched, scoreVal]);

  useEffect(() => {
    if (!loadReM && Emails && Emails?.code && Emails?.code === 200) {
      dispatch(recruitmentMailReset());
      showSnackAlert("success", Emails?.message);
    } else if (!loadReM && Emails && Emails?.code && Emails?.code !== 200) {
      dispatch(recruitmentMailReset());
      // showSnackAlert("warning", Emails?.message);
    }
  }, [Emails]);

  const actionOptions: any = [
    { value: "SHORTLIST", label: "SHORTLIST" },
    { value: "REJECT", label: "REJECT" },
  ];
  const statusArray = ["SHORTLIST", "REJECT"];

  useEffect(() => {
    setStatus(
      statusArray.includes(bindAppProfile?.jsStatus?.emp)
        ? {
            label: bindAppProfile?.jsStatus?.emp,
            value: bindAppProfile?.jsStatus?.emp,
          }
        : null
    );
  }, [bindAppProfile]);

  return (
    <>
      {loading && <JsProfilePreviewSkelton />}
      <div className="page-content jsproprev" ref={containerRef}>
        <div className="content-block">
          <div className="section-full browse-job content-inner-2">
            <div
              id="shortlist_bx"
              className="job-bx bg-white m-b30 btnss topHead"
            >
              <div className="d-flex justify-content-between align-items-center">
                <Button
                  sx={{
                    color: "grey",
                    height: 42,
                    textTransform: "none",
                  }}
                  variant="text"
                  onClick={() => {
                    handleOpenEmailModel();
                    setSendEmail(true);
                  }}
                  className="topButtons"
                >
                  <MailOutlineIcon fontSize="small" className="headicon" />
                  &nbsp; Email
                </Button>
                {/* <Button
                  sx={{ color: "grey", height: 42, textTransform: "none" }}
                  variant="text"
                  onClick={handleConvertToPdf}
                  className="topButtons"
                >
                  <DownloadIcon fontSize="small" className="headicon" />
                  &nbsp; Download
                </Button> */}
              </div>
              {/* shortlist dropdown */}
              <div className="d-flex align-items-center">
                <div
                  style={{
                    minWidth: 120,
                    marginTop: "0px",
                    display: "flex",
                  }}
                >
                  <Select
                    className="dropstyle"
                    options={actionOptions}
                    isSearchable={false}
                    name="actionOptions"
                    placeholder="Action"
                    value={status}
                    onChange={(option: any) => {
                      setStatus(option);
                      dispatch(
                        updateAppStatus({
                          status: option.label,
                          applicants_info: [
                            {
                              job_id: job_idVal,
                              applicant_id: useridVal,
                            },
                          ],
                        })
                      );
                    }}
                  />
                </div>
                <div className="float-right ml-2">
                  <div className="job-bx-title backli clearfix">
                    <Link
                      to={url}
                      className="site-button mt-2 right-arrow button-sm float-right"
                    >
                      Go Back
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <div className="row">
                <div className="col-xl-2 col-lg-4 col-md-4 col-sm-12 m-b30">
                  <ListingSidebars />
                </div>
                <div className="col-xl-7 col-lg-8 col-md-8 col-sm-12">
                  {/* nams pic and decription */}

                  <div id="shortlist_bx" className="job-bx bg-white m-b30">
                    <div className="row">
                      <div className="col-xl-8 col-lg-4 m-b30">
                        <div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-end",
                              marginBottom: "4px",
                            }}
                          >
                            <span className="canprop">
                              {bindAppProfile?.profile?.name}
                            </span>{" "}
                            <div className="vCv">
                              <p title="Click here to download your resume"></p>
                              <button
                                onClick={handleClickScroll}
                                className="viewR"
                              >
                                View Resume
                              </button>
                            </div>
                          </div>
                          <div
                            style={{
                              fontSize: "13px",
                              color: "#8e8b8b",
                            }}
                          >
                            {bindAppProfile?.career_profile?.headline ??
                              "Resume headline not provided"}
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-4 m-b30">
                        <div>
                          <div className="candidate-detail text-center can-details">
                            <div className="jsLogoi">
                              <Link to={"#"}>
                                <img
                                  style={{
                                    height: "100%",
                                  }}
                                  alt="Profile_Image"
                                  src={
                                    image?.data || load
                                      ? `data:image/png;base64,${image?.data}`
                                      : require("../../../assets/images/av-pic-01.png")
                                  }
                                />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="mainline"
                      style={{ marginBottom: "10px" }}
                    ></div>
                    <div className="row">
                      <div className="col-xl-12 col-lg-4 m-b3">
                        <div className="data">
                          <div>
                            <i
                              className="fa fa-envelope-o iconsKu"
                              aria-hidden="true"
                            ></i>
                            {bindAppProfile?.uname
                              ? bindAppProfile?.uname
                              : "Not Available"}
                          </div>
                          {/* {bindAppProfile?.profile?.contact.map((item) => ( */}
                          {bindAppProfile?.phone?.val && (
                            <div>
                              <i
                                className="fa fa-phone iconsKu"
                                aria-hidden="true"
                              ></i>
                              {`${bindAppProfile?.phone?.code}${" "}${
                                bindAppProfile?.phone?.val
                              }`}
                            </div>
                          )}
                          {/* ))} */}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Low match */}

                  {/* <div id="shortlist_bx" className="job-bx bg-white m-b30">
                    {match === "High Match" ? (
                      <div
                        className="highm headerp"
                        style={{ marginBottom: "20px" }}
                      >
                        {match}
                      </div>
                    ) : match === "Medium Match" ? (
                      <div
                        className="medimMatch headerp"
                        style={{ marginBottom: "20px", fontWeight: "bold" }}
                      >
                        {match}
                      </div>
                    ) : (
                      <div
                        className="lowsty headerp"
                        style={{ marginBottom: "20px" }}
                      >
                        {match}
                      </div>
                    )}

                    <div style={{ marginBottom: "20px", display: "flex" }}>
                      <div style={{ width: 30, marginRight: "7px" }}>
                        <CircularProgressbar
                          value={scoreVal?.total}
                          text={`${scoreVal?.total}%`}
                        />
                      </div>
                      <div style={{ marginRight: "10px", fontSize: "12.5px" }}>
                        {scoreVal?.total}% Overall Match
                      </div>
                    </div>
                    <div
                      className="mainline"
                      style={{ marginBottom: "10px" }}
                    ></div>

                    <div style={{ display: "flex" }}>
                      {matched?.length ? (
                        <div>
                          <span
                            style={{
                              marginRight: "10px",
                              backgroundColor: "#bdefaa",
                              padding: " 3px 3px",
                              fontSize: "14px",
                            }}
                          >
                            Matched
                          </span>
                          <span
                            style={{ marginRight: "55px", fontSize: "14px" }}
                          >
                            {matched.toString()}
                          </span>
                        </div>
                      ) : (
                        <div className="notavail">Not Available</div>
                      )}
                      {notMatched?.length ? (
                        <div>
                          <span
                            style={{
                              marginRight: "10px",
                              backgroundColor: "#f8d3aa",
                              padding: " 3px 3px",
                              fontSize: "14px",
                            }}
                          >
                            Not-Matched
                          </span>
                          <span style={{ fontSize: "14px" }}>
                            {" "}
                            {notMatched.toString()}
                          </span>
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div> */}

                  <div id="shortlist_bx" className="job-bx bg-white m-b30">
                    <div className="row">
                      <div className="col-xl-3 col-lg-8 col-md-8 col-sm-12">
                        <div
                          style={{
                            width: "56%",
                            marginRight: "7px",
                          }}
                        >
                          <CircularProgressbar
                            value={scoreVal?.total}
                            text={`${scoreVal?.total}%`}
                          />
                        </div>
                      </div>
                      <div className="col-xl-6 col-lg-8 col-md-8 col-sm-12">
                        <div>
                          <div>
                            {match === "High Match" ? (
                              <div
                                className="highm headerp"
                                style={{
                                  marginBottom: "20px",
                                }}
                              >
                                {match}
                              </div>
                            ) : match === "Medium Match" ? (
                              <div
                                className="medimMatch headerp"
                                style={{
                                  marginBottom: "20px",
                                  fontWeight: "bold",
                                }}
                              >
                                {match}
                              </div>
                            ) : (
                              <div
                                className="lowsty headerp"
                                style={{
                                  marginBottom: "20px",
                                }}
                              >
                                {match}
                              </div>
                            )}
                          </div>
                          <div>
                            <div
                              style={{
                                marginRight: "10px",
                                fontSize: "12.5px",
                                marginBottom: "14px",
                              }}
                            >
                              {scoreVal?.total}% Overall Match
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="mainline"
                      style={{ marginBottom: "10px" }}
                    ></div>
                    <div style={{ display: "flex" }}>
                      {matched?.length ? (
                        <div>
                          <span
                            style={{
                              marginRight: "10px",
                              backgroundColor: "#bdefaa",
                              padding: " 3px 3px",
                              fontSize: "14px",
                            }}
                          >
                            Matched
                          </span>
                          <span
                            style={{
                              marginRight: "55px",
                              fontSize: "14px",
                            }}
                          >
                            {matched.toString()}
                          </span>
                        </div>
                      ) : (
                        <div className="notavail"></div>
                      )}
                      {notMatched?.length ? (
                        <div>
                          <span
                            style={{
                              marginRight: "10px",
                              backgroundColor: "#f8d3aa",
                              padding: " 3px 3px",
                              fontSize: "14px",
                            }}
                          >
                            Not-Matched
                          </span>
                          <span
                            style={{
                              fontSize: "14px",
                            }}
                          >
                            {" "}
                            {notMatched.toString()}
                          </span>
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>

                  <AssessmentDetails userId={useridVal} jobId={job_idVal} />
                  <CandidateDetails userId={useridVal} jobId={job_idVal} />
                  <QuestionList userId={useridVal} jobId={job_idVal} />
                  <WorkExp userId={useridVal} jobId={job_idVal} key="first" />
                  <Education userId={useridVal} jobId={job_idVal} />
                  <ItSkills userId={useridVal} jobId={job_idVal} />
                  <ProjectDetails userId={useridVal} jobId={job_idVal} />
                  <OtherDetails
                    id="section-1"
                    userId={useridVal}
                    jobId={job_idVal}
                  />
                  <AttachResume userId={useridVal} jobId={job_idVal} />
                  <ProfileVideo userId={useridVal} jobId={job_idVal} />
                </div>
                <div className="col-xl-3 col-lg-8 col-md-8 col-sm-12">
                  <Commentprofile userId={useridVal} jobId={job_idVal} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EmailModel
        showModal={showEmailModel}
        sendto={emailId}
        toggleModal={handleOpenEmailModel}
        formik={props}
        headerName={sendEmail ? "Send Email" : "Forward Email"}
        jobid={job_idVal}
      />
      <Modal
        show={emailreg}
        className="modal fade modal-bx-info editor"
        onHide={() => {
          setEmailreg(false);
        }}
      >
        <div className="modal-dialog my-0 mx-0 w-100 " role="document">
          <div className="modal-content">
            <div className="modal-body">
              <button type="button" className="close" onClick={closeModel}>
                <span aria-hidden="true">&times;</span>
              </button>
              <h5 className="deletehead">Are you Sure you want to delete?</h5>

              <div className="dell">
                Deleting the Profile(s) will permanently remove it from the
                system.
              </div>
              <div style={{ float: "right" }}>
                <button className="site-button border" onClick={deleteprofile}>
                  Yes, Delete it
                </button>
                <button className="site-button border" onClick={closeModel}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default JsProfilePreview;
