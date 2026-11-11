import { Link } from "react-router-dom";
import Listingsidebar from "../../../common/Elements/ListingsSidebar";
import BasicDetails from "./BasicDetails";
import ResumeHeadline from "./ResumeHeadline";
import KeySkills from "./KeySkills";
import Employment from "./Employment";
import Education from "./Education";
import ItSkills from "./ItSkills";
import Projects from "./Projects";
import ProfileSummary from "./ProfileSummary";
import Accomplishments from "./Accomplishments";
import CareerProfile from "./CareerProfile";
import { useEffect, useState } from "react";
import { ProfileStateType } from "./jobseekertypes";
import PersonalDetails from "./PersonalDetails";
import { useDispatch, useSelector } from "react-redux";
import { getJobSeekerrData } from "../../../../redux/features/manage-account/profile/JsSlice";
import RegisterSuccessPopup from "../../../authentication/runway/RegistrationSuccessPopup";
import comingSoonImage from "../../../../assets/images/banner/Come.png";
import {
  DeletejobseekerFile,
  downloadResume,
  downloadVideo,
  resetDeleteJSFile,
  resetDownloadResume,
  resetFileUpload,
  uploadFile,
} from "../../../../redux/features/manage-account/profile/userFilesSlice";
import {
  bytesToMegabytes,
  GetDayFromTimeStamp,
  GetDisplayDateFromTimeStamp,
  GetMonthNameFromTimeStamp,
  GetTimeFromTimeStamp,
  GetYearFromTimeStamp,
} from "../../../../common/common";
import { UseToastAlert } from "../../../../hooks/useToastAlert";
import {
  BsCloudDownload,
  BsCloudUpload,
  BsFileEarmarkPlay,
} from "react-icons/bs";
import { AiOutlineCloseCircle } from "react-icons/ai";
import "../../../../assets/customCss/jobseekerProfile.css";
import { resetRegActionCreator } from "../../../../redux/features/authentication/jobSeekerRegisterSlice";
import { jobSeekerProfileMasterData } from "../../../../redux/features/masterData/MasterDataInfoSlice";
import { SkillsMasterData } from "../../../../redux/features/masterData/SkillsSlice";
import { CompanyMasterData } from "../../../../redux/features/masterData/CompanySlice";
import { DesignationMasterData } from "../../../../redux/features/masterData/DesignationSlice";
import { getYearMonth } from "../../../../redux/features/masterData/YearMonthSlice";
import { environment } from "../../../../environments/environment";
import { getFutureyearmonth } from "../../../../redux/features/manage-account/profile/EmploymentSlice";
import { DepartmentMasterData } from "../../../../redux/features/masterData/DepartmentSlice";
import { LocationcityMasterData } from "../../../../redux/features/masterData/LocationcitySlice";
import Swal from "sweetalert2";
import { getIndustryType } from "../../../../redux/features/masterData/industrySlice";
import { universitiesMasterData } from "../../../../redux/features/masterData/InstituteSlice";
import { profileStrength } from "../../../../redux/features/manage-account/profile/BasicDetailsSlice";
import { resetOtpActionCreator } from "../../../../redux/features/authentication/jobSeekerVerifyEmail";
import JobSeekerProfile_SK from "./JobSeekerProfile_SK";
import ResumeParser from "../../../jobSeeker/resumeParser/resumeParser";
import { getResumeData, resetResumeData } from "../../../../redux/features/jobSeeker/resumeParserSlice";

function JobSeekerProfile(props: any) {
  const [disPopup, setDisPopUp] = useState(false),
    [close, setClose] = useState(false);

  const jobSeekerReg = useSelector((state: any) => state.jobSeekerRegister);
  let { resume, loading1 } = useSelector((state: any) => state.downloadResume);
  const { video } = useSelector((state: any) => state.downloadVideo);

  const pflStrength = useSelector((state: any) => state.profileStrength);

  const JobSeekerProfileData = useSelector(
    (state: any) => state.JobSeekerProfile2
  );
  const { JobSeekerProfile, loading } = JobSeekerProfileData;
  const jobseekerfiledelete = useSelector(
    (state: any) => state.DeletejobseekerFile
  );

  const [res, setRes] = useState("UPLOAD RESUME");
  const [videoInputName, setVideoInputName] = useState(
    "UPLOAD SELF INTRODUCTION VIDEO"
  );
  const [downld, setDwnld] = useState(false);
  const [vdoDwnBtn, setVdoDwnBtn] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [resumeLoader, setResumeLoader] = useState(false);
  const [videoLoader, setVideoLoader] = useState(false);
  const showSnackAlert = UseToastAlert();
  const videoSize = bytesToMegabytes(Number(environment.videofile));
  const resumeSize = bytesToMegabytes(Number(environment.resumefile));
  const dispatch = useDispatch();
  // eslint-disable-next-line no-restricted-globals
  history.pushState(null, location.href);
  window.onpopstate = function () {
    // eslint-disable-next-line no-restricted-globals
    history.go(1);
  };
  
useEffect(() => {
   if (!loading && JobSeekerProfile) {
  if (JobSeekerProfile?.js_profile?.career_profile?.cv?.name) {    
    dispatch(getResumeData());
    dispatch(resetResumeData());
  }
}
}, [loading]);

const [resumeParser, setResumeParser] = useState(false);
  useEffect(() => {
    if (!loading && JobSeekerProfile) {
      if (JobSeekerProfile?.js_profile?.career_profile?.cv?.name) {
        setRes("UPDATE RESUME");
        setDwnld(true);
        setResumeLoader(false);
      }
      if (JobSeekerProfile?.js_profile?.profile?.intro_video?.name) {
        setVideoInputName("UPDATE SELF INTRODUCTION VIDEO");
        setVdoDwnBtn(true);
        setVideoLoader(false);
      }
      if (!sessionStorage.getItem("isSkiped")) {
        if (JobSeekerProfile?.js_profile?.career_profile?.headline) {
          setResumeParser(false);
        } else {
          setResumeParser(true);
        }
      }
    }
  }, [loading, JobSeekerProfile]);

  useEffect(() => {
    const masterDataObj = [
      {
        group: "All",
        active: 1,
      },
    ];
    dispatch(jobSeekerProfileMasterData(masterDataObj));
  }, []);

  useEffect(() => {
    const yearmonthObj = [
      {
        group: "All",
        params: [],
      },
    ];
    dispatch(getYearMonth(yearmonthObj));
  }, []);
  useEffect(() => {
    dispatch(SkillsMasterData({ pageno: -1, search: "" }));
  }, []);

  useEffect(() => {
    dispatch(CompanyMasterData({ pageno: -1, search: "" }));
  }, []);

  useEffect(() => {
    dispatch(getIndustryType({ pageno: -1, search: "" }));
  }, []);

  useEffect(() => {
    dispatch(DesignationMasterData({ pageno: -1, search: "" }));
  }, []);
  useEffect(() => {
    dispatch(DepartmentMasterData({ pageno: -1, search: "" }));
  }, []);
  useEffect(() => {
    dispatch(LocationcityMasterData({ pageno: -1, search: "" }));
    dispatch(universitiesMasterData({ pageno: -1, search: "" }));
  }, []);

  useEffect(() => {
    const data = [
      {
        group: "FUYE",
        params: [
          {
            key: "years",
            value: 2,
          },
        ],
      },
    ];
    dispatch(getFutureyearmonth(data));
  }, []);

  const date = (updated_at: number) => {
    const year = GetYearFromTimeStamp(updated_at);
    const month = GetMonthNameFromTimeStamp(updated_at, false);
    const day = GetDayFromTimeStamp(updated_at);
    const time = GetTimeFromTimeStamp(updated_at);
    const formattedDate = `${month} ${day}, ${year} - ${time}`;
    return formattedDate;
  };

  const handleDownload = () => {
    dispatch(downloadResume());
  };
  useEffect(() => {
    if (!loading1 && resume.code === 200) {
      window.location.href = resume.data;
      dispatch(resetDownloadResume());
    }
  }, [loading1, resume]);
  const [vediofilesizeError, setVediofilesizeError] = useState("");
  const [vedioformatError, setVedioformatError] = useState("");
  useEffect(() => {
    if (video.code === 200) {
      setVideoUrl(video?.data);
      setVediofilesizeError("");
      setVedioformatError("");
    }
  }, [video, video.data]);

  useEffect(() => {
    dispatch(getJobSeekerrData());
  }, [dispatch]);

  const handleVideo = () => {
    dispatch(downloadVideo());
  };

  useEffect(() => {
    if (resume?.code === 200) {
      window.open(resume.data);
    }
  }, [resume]);

  useEffect(() => {
    if (jobSeekerReg?.res?.code === 200) {
      if (jobSeekerReg?.res?.data?.is_new_reg) {
        setDisPopUp(true);
        dispatch(resetRegActionCreator());
        setTimeout(() => {
          setDisPopUp(false);
        }, 5000);
      }
      dispatch(resetRegActionCreator());
      dispatch(resetOtpActionCreator());
    }
  }, [jobSeekerReg]);

  const resumeUploadStatus = useSelector((store: any) => store.uploadFile);

  const { fileUpload, uploadLoading } = resumeUploadStatus;
  const [notprotectedError, setNotprotectedError] = useState("");
  const [filesizeError, setFilesizeError] = useState("");
  const [resumeformatError, setResumeformatError] = useState("");

  const UploadResume = (e: any) => {
    setResumeLoader(true);
    let regex = new RegExp(/[^\s]+(.*?).(.docx|.DOCX|.pdf|.PDF)$/);
    const selectedFile: any = e.target.files && e.target.files[0];
    const reader: any = new FileReader();
    reader.readAsArrayBuffer(selectedFile);
    reader.onload = function () {
      let file: any = new Blob([reader.result], { type: "application/pdf" });
      file.text().then((x) => {
        if (x.includes("Encrypt")) {
          setNotprotectedError(
            "Please select a valid file which is not protected."
          );
          setResumeformatError("");
          setFilesizeError("");
          e.target.value = null;
          setResumeLoader(false);
          return;
        }
        const resume = e.target.files[0].type;
        if (resume) {
          if (e.target?.files[0].size > environment.resumefile) {
            setFilesizeError(
              `Please select a valid file size, Supported file size upto ${resumeSize} MB`
            );
            setResumeformatError("");
            setNotprotectedError("");
            e.target.value = null;
            setResumeLoader(false);
            return;
          }
          if (
            regex.test(resume) == true ||
            resume ===
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          ) {
            let formData = new FormData();
            formData.append("resume", e.target.files[0]);
            dispatch(uploadFile(formData));
            e.target.value = null;
          } else {
            setResumeformatError(
              `Please select a valid resume format, Supported Formats: docx and pdf upto ${resumeSize} MB`
            );
            setFilesizeError("");
            setNotprotectedError("");
            e.target.value = null;
            setResumeLoader(false);
            dispatch(resetFileUpload());
          }
        }
      });
    };
  };

  const UploadVideo = (e: any) => {
    setVideoLoader(true);
    let regex = new RegExp(/[^\s]+(.*?).(m4v|mp4)$/);
    const video = e.target.files[0].type;
    if (video) {
      if (e.target?.files[0].size > environment.videofile) {
        setVediofilesizeError(
          `Please select a valid File Size, Supported video size upto ${videoSize} MB`
        );
        setVedioformatError("");
        e.target.value = null;
        setVideoLoader(false);
        return;
      }
      if (regex.test(video) == true) {
        let formData = new FormData();
        formData.append("video", e.target.files[0]);
        dispatch(uploadFile(formData));
      } else {
        setVedioformatError(
          `Please select a valid Video Format, Supported Formats: m4v, mp4, upto ${videoSize} MB`
        );
        setVediofilesizeError("");
        setVideoLoader(false);
        e.target.value = null;
        dispatch(resetFileUpload());
      }
    }
  };

  useEffect(() => {
    if (fileUpload?.code && !uploadLoading) {
      if (fileUpload?.code === 200) {
        showSnackAlert("success", fileUpload?.message);
        setResumeformatError("");
        setFilesizeError("");
        setNotprotectedError("");
        dispatch(getJobSeekerrData());
        dispatch(profileStrength());
        dispatch(resetFileUpload());
        dispatch(downloadVideo());
        setResumeLoader(false);
        setVideoLoader(false);
      } else if (fileUpload?.code == 413) {
        showSnackAlert("error", fileUpload?.message);
        setResumeLoader(false);
        setVideoLoader(false);
        dispatch(resetFileUpload());
      } else {
        dispatch(resetFileUpload());
      }
    }
  }, [fileUpload?.code, uploadLoading]);

  useEffect(() => {
    if (jobseekerfiledelete?.message?.code === 200) {
      setDwnld(false);
      setVdoDwnBtn(false);
      setRes("UPLOAD RESUME");
      setVideoInputName("UPLOAD SELF INTRODUCTION VIDEO");
      setResumeLoader(false);
      showSnackAlert("success", jobseekerfiledelete?.message?.message);
      dispatch(getJobSeekerrData());
      dispatch(profileStrength());
      dispatch(resetDeleteJSFile());
    } else if (jobseekerfiledelete?.message?.code != 200) {
    }
  }, [jobseekerfiledelete?.message]);

  const handleDeleteSwal = (name: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this record!",
      showCancelButton: true,
      confirmButtonColor: "#2a9f2a ",
      cancelButtonColor: "#db1919 ",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(DeletejobseekerFile(name));
      }
    });
  };

  return (
    <>
      {loading && (
        <div className="page-content">
          <JobSeekerProfile_SK />
        </div>
      )}
      {!environment.production ? (
        <div className="page-content">
          <BasicDetails />
          <div className="content-block">
            <div className="section-full browse-job content-inner-2">
              <div className="container">
                <span className="lastUpdate c_content_subheader">
                  Profile Last Updated{" "}
                  <b>
                    {GetDisplayDateFromTimeStamp(
                      !loading && JobSeekerProfile?.js_profile?.updated_at
                    )}
                  </b>
                </span>
                <div className="row">
                  <div className="col-xl-3 col-lg-4 col-md-4 col-sm-12 m-b30">
                    <Listingsidebar />
                  </div>
                  <div className="col-xl-9 col-lg-8 col-md-8 col-sm-12">
                    <div
                      id="attach_resume_bx"
                      className="job-bx bg-white m-b30"
                    >
                      <h5 className="c_content_header">
                        Attach Resume
                        <span className="font-14">
                          {pflStrength?.pflStrnRes?.data?.profileWeightage?.cv
                            ? ` (${pflStrength?.pflStrnRes?.data?.profileWeightage?.cv}%)`
                            : ""}
                        </span>
                      </h5>
                      <p className="c_content_desc">
                        Resume is the most important document recruiters look
                        for. Recruiters generally do not look at profiles
                        without resumes.
                      </p>
                      {downld && (
                        <div
                          className="c_content_subheader"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <p>
                            <b>
                              {
                                JobSeekerProfile?.js_profile?.career_profile?.cv?.name.split(
                                  "-"
                                )[1]
                              }{" "}
                            </b>
                            -{" "}
                            <span className="font-14">
                              {" "}
                              Uploaded On{" "}
                              {JobSeekerProfile?.js_profile?.career_profile?.cv
                                ?.name &&
                                date(
                                  JobSeekerProfile?.js_profile?.career_profile
                                    ?.cv?.updated_at
                                )}
                            </span>
                          </p>
                          <p title="Click here to download your resume">
                            <Link
                              className="float-right"
                              to={"#"}
                              style={{ color: "blue" }}
                              onClick={() => {
                                handleDownload();
                              }}
                            >
                              <BsCloudDownload />
                            </Link>
                          </p>
                        </div>
                      )}
                      <div className="RVdeletebtn">
                        {downld && (
                          <button
                            title="Click here to delete resume"
                            className="bg-danger site-button RVdeletebtn btn-sm "
                            onClick={() => {
                              handleDeleteSwal("resume");
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <form className="attach-resume ">
                        <div className="row">
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <div className="custom-file d-block JP-RVlink">
                                <p className="m-auto align-self-center Rupload">
                                  {resumeLoader ? (
                                    <>
                                      <i
                                        className="fa fa-circle-o-notch fa-spin"
                                        style={{ marginRight: "10px" }}
                                      >
                                        {" "}
                                      </i>{" "}
                                      UPLOADING...{" "}
                                    </>
                                  ) : (
                                    <>
                                      {" "}
                                      <BsCloudUpload /> {`${res}`}
                                    </>
                                  )}
                                </p>
                                {notprotectedError ? (
                                  <span className="form-error">
                                    {notprotectedError}
                                  </span>
                                ) : (
                                  ""
                                )}
                                {filesizeError ? (
                                  <span className="form-error">
                                    {filesizeError}
                                  </span>
                                ) : (
                                  ""
                                )}
                                {resumeformatError ? (
                                  <span className="form-error">
                                    {" "}
                                    {resumeformatError}
                                  </span>
                                ) : (
                                  ""
                                )}
                                <p className="modal-custom-desc">
                                  {`Supported Formats: docx and pdf upto ${resumeSize}`}
                                  MB
                                </p>

                                <input
                                  type="file"
                                  className="site-button form-control"
                                  id="customFile"
                                  title=""
                                  style={{
                                    width: "100%",
                                    height: "50%",
                                  }}
                                  onChange={UploadResume}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                    {/* Video  */}
                    <div id="attach_video_bx" className="job-bx bg-white m-b30">
                      <h5 className="c_content_header">
                        Attach Video
                        <span className="font-14">
                          {pflStrength?.pflStrnRes?.data?.profileWeightage
                            ?.intro_video
                            ? ` (${pflStrength?.pflStrnRes?.data?.profileWeightage?.intro_video}%)`
                            : ""}
                        </span>
                      </h5>

                      <div className="c_content_desc">
                        <div style={{ fontSize: "14.5" }}>
                          Video is the most important document recruiters look
                          for. Recruiters generally do not look at profiles
                          without Videos.
                        </div>
                      </div>

                      <div
                        className="c_content_subheader"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        {vdoDwnBtn && (
                          <p>
                            <b>
                              {
                                JobSeekerProfile?.js_profile?.profile?.intro_video?.name.split(
                                  "-"
                                )[1]
                              }{" "}
                            </b>
                            <span className="font-14">- Uploaded On </span>
                            {date(
                              JobSeekerProfile?.js_profile?.profile?.intro_video
                                ?.updated_at
                            )}
                          </p>
                        )}
                        <p
                          title={!close ? "Click here to play video" : "close"}
                        >
                          {vdoDwnBtn && !close && (
                            <Link
                              to={"#"}
                              style={{ color: "blue" }}
                              onClick={() => {
                                handleVideo();
                                setClose(true);
                              }}
                            >
                              <BsFileEarmarkPlay />
                            </Link>
                          )}
                          {vdoDwnBtn && close && (
                            <Link
                              to={"#"}
                              style={{ color: "blue" }}
                              onClick={() => {
                                setClose(false);
                              }}
                            >
                              <AiOutlineCloseCircle />
                            </Link>
                          )}
                        </p>
                      </div>
                      <div className="RVdeletebtn">
                        {vdoDwnBtn && !close && (
                          <button
                            title="Click to delete video"
                            className="site-button btn-sm bg-danger"
                            onClick={() => {
                              handleDeleteSwal("video");
                            }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                      <form className="attach-resume ">
                        <div className="row">
                          <div className="col-lg-12 col-md-12">
                            <div style={{ textAlign: "center" }}>
                              {videoUrl && close && (
                                <video
                                  width="95%"
                                  height="400"
                                  controls
                                  autoPlay
                                  disablePictureInPicture
                                >
                                  <source
                                    src={videoUrl}
                                    type="video/mp4"
                                  ></source>
                                </video>
                              )}
                            </div>
                            <div className="form-group ">
                              <div className="custom-file d-block JP-RVlink">
                                <p className="m-auto align-self-center Vupload">
                                  {videoLoader ? (
                                    <>
                                      {" "}
                                      <i
                                        className="fa fa-circle-o-notch fa-spin"
                                        style={{ marginRight: "10px" }}
                                      >
                                        {" "}
                                      </i>{" "}
                                      UPLOADING...
                                    </>
                                  ) : (
                                    <>
                                      <BsCloudUpload /> {videoInputName}
                                    </>
                                  )}
                                </p>
                                {vedioformatError ? (
                                  <span className="form-error">
                                    {vedioformatError}
                                  </span>
                                ) : (
                                  ""
                                )}
                                {vediofilesizeError ? (
                                  <span className="form-error">
                                    {vediofilesizeError}
                                  </span>
                                ) : (
                                  ""
                                )}
                                <p className="modal-custom-desc">
                                  {`Supported Formats: m4v, mp4, upto ${videoSize} MB`}
                                </p>

                                <input
                                  type="file"
                                  className="site-button form-control"
                                  id="customFile"
                                  onChange={UploadVideo}
                                  title=""
                                  style={{
                                    width: "100%",
                                    height: "50%",
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                    {resumeParser && <ResumeParser />}
                    <ResumeHeadline />
                    <KeySkills />
                    <Employment />
                    <Education />
                    <ItSkills />
                    <Projects />
                    <ProfileSummary />
                    <Accomplishments />
                    <CareerProfile />
                    <PersonalDetails />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            paddingTop: "10%",
          }}
        >
          <Link to={"#"}>
            <img src={comingSoonImage} alt="" />
          </Link>
        </div>
      )}

      {disPopup && <RegisterSuccessPopup />}
    </>
  );
}
export default JobSeekerProfile;
