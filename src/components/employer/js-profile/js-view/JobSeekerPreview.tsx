import html2pdf from "html2pdf.js";
import React, { lazy, useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import "react-circular-progressbar/dist/styles.css";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import "../../../../assets/customCss/previewjs.css";
import { UseToastAlert } from "../../../../hooks/useToastAlert";
import {
  resetAppStatusRestset,
  updateAppStatus,
} from "../../../../redux/features/employer/applicationStatusslice";
import {
  jsProfileDetails,
  resetJsProfileViewSlice,
} from "../../../../redux/features/employer/js-view/JsProfileViewSlice";
import { downloadAppImage } from "../../../../redux/features/employer/js-view/downloadSlice";
import {
  downloadSAS,
  resetSAS,
} from "../../../../redux/features/jobs/job-applications/downloadSASSlice";
import ListingSidebarJs from "./listingSidebarJS";

const EmailModel = lazy(() => import("../../../shared/emailModel"));
const Commentprofile = lazy(() => import("../comment"));
const ProfileVideo = lazy(() => import("../profileVideo"));
const ListingSidebars = lazy(() => import("../listingSidebars"));
const CandidateDetails = lazy(() => import("../candidateDetails"));
const QuestionList = lazy(() => import("../questionList"));
const WorkExp = lazy(() => import("../workExp"));
const Education = lazy(() => import("../education"));
const ProjectDetails = lazy(() => import("../projectDetails"));
const ItSkills = lazy(() => import("../itSkills"));
const OtherDetails = lazy(() => import("../otherDetails"));
const AttachResume = lazy(() => import("../attachResume"));

const percentage = 66;
const percentages = 33;

const match = {
  a: "66",
  b: "33",
};

const JobSeekerPreview = (props: any) => {
  const handleClickScroll = () => {
    const element = document.getElementById("section-1");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const htmlContent = "";
  const containerRef = useRef<HTMLDivElement>(null);
  const handleConvertToPdf = () => {
    const element = containerRef.current;
    if (element) {
      html2pdf().from(element).save();
    }
  };

  // View resume in another TAB
  const PreviewApplicantResume = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const url = e.currentTarget.href;
    window.open(url, "_blank");
  };

  // Toaster
  const showSnackAlert = UseToastAlert();

  const dispatch = useDispatch();

  const [uid] = useSearchParams();
  const { id } = useParams();
  const [jid] = useSearchParams();
  const [statusA, setStatusA] = React.useState("");
  const [profileValue, setProfileValue] = useState<any>("");
  const [bindAppProfile, setBindAppProfile] = useState<any>();
  const [selected, setSelected] = useState("");
  const [drop, setDrop] = useState<any>("");
  // const useridVal: any = uid.get("uid");
  const useridVal: any = id;
  const job_idVal: any = jid.get("jid");
  const isEmployer: boolean = true;

  /* Start Applicant info API */
  const applicantProfile = useSelector((state: any) => state.jsPrfilePreview);
  const jsProfile = useSelector((state: any) => state.jsProfileDetails);
  const { details, loadingg, error } = jsProfile;

  const { ApplicantInfo, loading } = applicantProfile;

  const navigate = useNavigate();

  useEffect(() => {
    // user_id: useridVal;
    dispatch(jsProfileDetails(useridVal));
  }, [dispatch, id]);

  useEffect(() => {
    if (!loadingg && details?.data && details?.data) {
      setProfileValue(details);
    }
    //429
    else if (details?.response?.data?.code == 429) {
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
    } else if (details?.response?.data?.code === 400) {
      showSnackAlert("warning", details?.response?.data?.message);
    } else if (details?.response?.data?.code === 500) {
      showSnackAlert("warning", details?.response?.data?.message);
    }
  }, [details, loading]);

  useEffect(() => {
    if (profileValue.code === 200) {
      setBindAppProfile(profileValue?.data?.applicant_info);
    }
  }, [profileValue]);

  /* End Applicant info API */

  /* Start application status API */

  const applicationStatus = useSelector((state: any) => state.appStatus);
  const { ApplicationStatus, loadingStatus } = applicationStatus;

  useEffect(() => {
    if (selected === "SHORTLIST") {
      setDrop("SHORTLIST");
    } else if (selected === "REJECT") {
      setDrop("REJECT");
    }
  }, [selected]);

  const UpdatStatus = () => {
    const statusModel: any = {
      status: drop,
      applicants_info: [
        {
          job_id: job_idVal,
          applicant_id: useridVal,
        },
      ],
    };
    dispatch(updateAppStatus(statusModel));

    if (ApplicationStatus?.code === 200) {
      showSnackAlert("success", `Status changed to ${drop} Successfully.`);
      dispatch(resetAppStatusRestset());
    } else if (ApplicationStatus && ApplicationStatus?.code !== 200) {
      showSnackAlert("warning", ApplicationStatus.message);
      dispatch(resetAppStatusRestset());
    }
  };

  const selectionChangeHandler = (event) => {
    setSelected(event.target.value);
  };

  /* End application status API */

  /* Start Image Download API */

  const { sasData, load } = useSelector((state: any) => state.downloadSAS);

  useEffect(() => {
    dispatch(resetSAS());
    const dataMdl = {
      id: [useridVal],
      sasFor: "IMG",
    };
    dispatch(downloadSAS(dataMdl));
  }, []);

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

  return (
    <>
      {/* <div
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      /> */}
      ;
      <div className="page-content">
        <div className="content-block">
          <div className="section-full browse-job content-inner-2">
            <div className="container">
              <div className="job-bx-title clearfix">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4 className="font-weight-500">{`${bindAppProfile?.profile?.name}'s Profile`}</h4>
                  </div>
                  <div>
                    <div>
                      <button
                        aria-haspopup="true"
                        aria-expanded="false"
                        type="button"
                        className="site-button right-arrow button-sm float-right backlink"
                        onClick={() => {
                          dispatch(resetJsProfileViewSlice());
                          navigate(-1);
                        }}
                      >
                        Go Back
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xl-3 col-lg-4 col-md-4 col-sm-12 m-b30">
                  <ListingSidebarJs />
                </div>

                <div className="col-xl-9 col-lg-8 col-md-8 col-sm-12">
                  {/* shortlist dropdown */}

                  {/* nams pic and decription */}
                  <div id="shortlist_bx" className="job-bx bg-white m-b30">
                    <div className="row">
                      <div className="col-xl-6 col-lg-4 m-b30">
                        <div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-end",
                            }}
                          >
                            <span className="canprop">
                              {bindAppProfile?.profile?.name}
                            </span>{" "}
                            <div className="vCv">
                              <p title="Click here to download your resume"></p>
                              <Link onClick={handleClickScroll} to={"#"}>
                                View Resume
                              </Link>
                            </div>
                          </div>
                          <div
                            style={{
                              fontSize: "13px",
                            }}
                          >
                            {bindAppProfile?.career_profile?.headline}
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-6 col-lg-4 m-b30">
                        <div>
                          <div className="candidate-detail text-center can-details">
                            <div className="jsLogoi">
                              <div>
                                {sasData?.data && sasData?.data[0]?.img_sas ? (
                                  <img
                                    style={{
                                      height: "100%",
                                    }}
                                    alt=""
                                    src={`${
                                      sasData?.data && sasData?.data[0]?.img_sas
                                    }`}
                                  />
                                ) : (
                                  <img
                                    alt="Profile_Image"
                                    src={require("../../../../assets/images/av-pic-01.png")}
                                  />
                                )}
                              </div>
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
                            {bindAppProfile?.uname}
                          </div>
                          {/* {bindAppProfile?.profile?.contact?.map((item) => ( */}
                          {bindAppProfile?.phone?.val && (
                            <div className="mr-5">
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
                  {/* job_id: job_idVal,
          applicant_id: useridVal, */}

                  <CandidateDetails
                    userId={useridVal}
                    jobId={job_idVal}
                    isEmployer={isEmployer}
                  />
                  <WorkExp
                    userId={useridVal}
                    jobId={job_idVal}
                    isEmployer={isEmployer}
                  />
                  <Education
                    userId={useridVal}
                    jobId={job_idVal}
                    isEmployer={isEmployer}
                  />
                  <ItSkills
                    userId={useridVal}
                    jobId={job_idVal}
                    isEmployer={isEmployer}
                  />
                  <ProjectDetails
                    userId={useridVal}
                    jobId={job_idVal}
                    isEmployer={isEmployer}
                  />
                  <OtherDetails
                    id="section-1"
                    userId={useridVal}
                    jobId={job_idVal}
                    isEmployer={isEmployer}
                  />
                  <AttachResume
                    userId={useridVal}
                    jobId={job_idVal}
                    isEmployer={isEmployer}
                  />
                  <ProfileVideo
                    userId={useridVal}
                    jobId={job_idVal}
                    isEmployer={isEmployer}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <EmailModel
        showModal={showEmailModel}
        toggleModal={handleOpenEmailModel}
        formik={props}
        headerName={sendEmail ? "Send Email" : "Forward Email"}
        jobid={"64467fe9de728fcb12cf8e0d"}
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

export default JobSeekerPreview;
