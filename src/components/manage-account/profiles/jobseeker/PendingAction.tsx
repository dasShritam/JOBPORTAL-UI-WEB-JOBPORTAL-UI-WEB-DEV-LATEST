import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { BsCloudUpload } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "../../../../assets/customCss/PendingAction.css";
import { regex } from "../../../../common/validation";
import { environment } from "../../../../environments/environment";
import { UseToastAlert } from "../../../../hooks/useToastAlert";
import {
  resetVerifyOtpSl,
  verifyOtp,
} from "../../../../redux/features/authentication/jobseekerVerifyOtpSlice";
import {
  resetsendotpAction,
  sendOtp,
} from "../../../../redux/features/authentication/sendOtpSlice";
import { profileStrength } from "../../../../redux/features/manage-account/profile/BasicDetailsSlice";
import {
  getFutureyearmonth,
  resetEmployement,
} from "../../../../redux/features/manage-account/profile/EmploymentSlice";
import {
  jobSeekerprofile,
  resetProfile,
} from "../../../../redux/features/manage-account/profile/JobSeekerProfileSlice";
import {
  getJobSeekerrData,
  resetjobSeekerProfileData,
} from "../../../../redux/features/manage-account/profile/JsSlice";
import { resetPersonalDetailsCreator } from "../../../../redux/features/manage-account/profile/PersonalDetailsSlice";
import {
  downloadImage,
  resetdownloadImageSlice,
  resetFileUpload,
  uploadFile,
} from "../../../../redux/features/manage-account/profile/userFilesSlice";
import {
  CompanyMasterData,
  resetCompanyMasterData,
} from "../../../../redux/features/masterData/CompanySlice";
import {
  getCountryCode,
  resetcountryCode,
} from "../../../../redux/features/masterData/countrySlice";
import {
  DepartmentMasterData,
  resetDepartmentMasterData,
} from "../../../../redux/features/masterData/DepartmentSlice";
import {
  DesignationMasterData,
  resetDesignationMasterData,
} from "../../../../redux/features/masterData/DesignationSlice";
import {
  LocationcityMasterData,
  resetLocationcityMasterData,
} from "../../../../redux/features/masterData/LocationcitySlice";
import {
  jobSeekerProfileMasterData,
  resetJobSeekerProfileMasterData,
} from "../../../../redux/features/masterData/MasterDataInfoSlice";
import {
  getYearMonth,
  resetYearMonth,
} from "../../../../redux/features/masterData/YearMonthSlice";
import BasicDetails from "./BasicDetails";
import CareerProfile from "./CareerProfile";
import Education from "./Education";
import Employment from "./Employment";
import KeySkills from "./KeySkills";
import PersonalDetails from "./PersonalDetails";
import ProfileSummary from "./ProfileSummary";
import Projects from "./Projects";
import ResumeHeadline from "./ResumeHeadline";
import { PendingAction_Skl } from "./PendingAction_Sk";
var bnr = require("../../../../assets/images/banner/blur-09.jpg");

const PendingAction = () => {
  const [disPersonalDetails, setDisPersoanlDetails] = useState(false),
    [disCareerProfile, setDisCareerProfile] = useState(false),
    [disProject, setDisProject] = useState(false),
    [disProfileSummary, setDisProfileSummary] = useState(false),
    [disKeySkills, setDisKeySkills] = useState(false),
    [disEducation, setDisEducation] = useState(false),
    dispatch = useDispatch(),
    showSnackAlert = UseToastAlert(),
    JobSeekerProfileData = useSelector((state: any) => state.JobSeekerProfile2),
    { JobSeekerProfile, loading } = JobSeekerProfileData,
    [pendingActionPD, setPendingActionPD] = useState(true),
    [project, setProject] = useState<boolean>(false),
    [desiredJobLoc, setDesiredLoc] = useState(true),
    [department, setDepartment] = useState(true),
    [industry, setIndustry] = useState(true),
    [resumeHeadline, setResumeHeadline] = useState(true),
    [keySkills, setKeySkills] = useState(true),
    [education, setEducation] = useState(true),
    [displayLang, setDisplayLang] = useState<boolean>(true),
    [disResumeHeadline, setDisResumeHeadline] = useState<boolean>(false),
    [disResume, setDisResume] = useState(true),
    [disEmailVrf, setDisEmailVrf] = useState(false),
    [disPhoto, setDisPoto] = useState(true),
    [number, setNumber] = useState(""),
    [time, setTime] = useState(0),
    [loader2, setLoader2] = useState(false),
    [loader3] = useState(false),
    [otp, setOtp] = useState(new Array(6).fill("")),
    [mins, setMins] = useState(0),
    [secs, setSecs] = useState(0),
    [verifynum, setVerifynum] = useState(false),
    [activeOtpIndex, setActiveOtpIndex] = useState(0),
    inputRef = useRef<HTMLInputElement>(null),
    [pointer] = useState("pointer"),
    [addMobNo, setAddMobNo] = useState(false),
    [disModelText, setDisModelText] = useState(true),
    [txtId, setTxtId] = useState(""),
    [disMobileModel, setDisMobModel] = useState(false),
    [disBasicDetails, setDispBasicDetails] = useState(false),
    [email, setEmail] = useState(""),
    [user_id, setUser_id] = useState(""),
    [disJobProfile, setDisJobProfile] = useState(false),
    [company_des, setCompany_des] = useState(false),
    [disEmpModel, setDisEmpModel] = useState(false),
    [resumeLoader, setResumeLoader] = useState(false),
    [videoLoader, setVideoLoader] = useState(false),
    personalDetail = useSelector((state: any) => state.personalDetails),
    { UpdatedPersonalDetails } = personalDetail,
    { loading1 } = useSelector((state: any) => state.downloadResume),
    UploadPicture = useSelector((state: any) => state.uploadFile),
    { fileUpload } = UploadPicture,
    UploadPhoto = useSelector((state: any) => state.jobseekerProfile),
    { response } = UploadPhoto,
    sendJsOtp = useSelector((state: any) => state.sendOtp),
    { otpRes } = sendJsOtp,
    verifyJobseekerOtp = useSelector((state: any) => state.jobseekerotpVerify),
    { res } = verifyJobseekerOtp,
    [basicInfo, setBaicInfo] = useState<any>(),
    employerProfileDetail = useSelector((state: any) => state.employmentDetail),
    { employmentDetails } = employerProfileDetail,
    pflStrength = useSelector((state: any) => state.profileStrength),
    navigate = useNavigate(),
    otpKeyChanges = (
      { key }: React.KeyboardEvent<HTMLInputElement>,
      index: number
    ) => {
      if (key === "Backspace" && !otp[index]) setActiveOtpIndex(index - 1);
      else if (key === "Backspace") setActiveOtpIndex(index - 0);
    },
    setTimeFunc = () => {
      setTime(Number(environment?.otp_time_sec));
    },
    otpChanges = ({ target }: ChangeEvent<HTMLInputElement>, index: number) => {
      const { value } = target,
        otpArr: string[] = [...otp];
      otpArr[index] = value.substring(value?.length - 1);
      if (!value) setActiveOtpIndex(index);
      else setActiveOtpIndex(index + 1);
      setOtp(otpArr);
    },
    [summery, setSummery] = useState(false);
  useEffect(() => {
    if (employmentDetails.message) {
      if (employmentDetails.code === 200) {
        showSnackAlert("success", employmentDetails.message);
        dispatch(getJobSeekerrData());
        if (JobSeekerProfile?.js_profile?.employments?.length > 0) {
          JobSeekerProfile?.js_profile?.employments?.map((data: any) => {
            if (data.fulltime.job_desc) {
              setDisJobProfile(false);
            }
            if (data.company) {
              setCompany_des(false);
            }
          });
        }
        dispatch(resetEmployement());
        setDisEmpModel(false);
        dispatch(getJobSeekerrData());
      }
      if (!loading1 && employmentDetails.code === 206) {
        showSnackAlert("warning", employmentDetails.message);
      }
    }
  }, [employmentDetails?.code, loading1]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  useEffect(() => {
    if (response?.code === 200) {
      showSnackAlert("success", "Your Profile picture uploaded sucessfully.");
      dispatch(resetProfile());
      dispatch(getJobSeekerrData());
    } else if (
      UploadPicture &&
      UploadPicture.response &&
      UploadPicture.response.response &&
      UploadPicture.response?.code !== 200
    ) {
      showSnackAlert("warning", response.message);
      dispatch(resetProfile());
    }
  }, [response.code, response, dispatch]);

  useEffect(() => {
    if (otpRes?.code === 200) {
      setTxtId(otpRes.data.txn_id);
      showSnackAlert("success", "OTP Sent Successfully");
      dispatch(resetsendotpAction());
      setOtp(new Array(6).fill(""));
    }
  }, [otpRes]);
  useEffect(() => {
    return () => {
      dispatch(resetjobSeekerProfileData());
      dispatch(resetVerifyOtpSl());
      dispatch(resetYearMonth());
      dispatch(resetJobSeekerProfileMasterData());
      dispatch(resetFileUpload());
      dispatch(resetsendotpAction());
      dispatch(resetcountryCode());
      dispatch(resetdownloadImageSlice());
      dispatch(resetCompanyMasterData());
      dispatch(resetDesignationMasterData());
      dispatch(resetDepartmentMasterData());
      dispatch(resetLocationcityMasterData());
    };
  }, []);

  useEffect(() => {
    if (res?.code === 200) {
      setVerifynum(false);
      showSnackAlert("success", res.message);
      setLoader2(false);
      dispatch(getJobSeekerrData());
      dispatch(resetVerifyOtpSl());
      setOtp(new Array(6).fill(""));
    } else if (res?.response?.data?.code === 400) {
      showSnackAlert("warning", res?.response?.data?.message);
      setLoader2(false);
      dispatch(resetVerifyOtpSl());
    }
  }, [res, res.code]);

  useEffect(() => {
    const masterDataObj = [
      {
        group: "All",
        active: 1,
      },
    ];
    const yearmonthObj = [
      {
        group: "All",
        params: [],
      },
    ];
    dispatch(getYearMonth(yearmonthObj));
    dispatch(jobSeekerProfileMasterData(masterDataObj));
  }, []);

  const UploadResume = (e: any) => {
    setResumeLoader(true);
    let regex = new RegExp(
      /[^\s]+(.*?).(.doc|.DOC|.docx|.DOCX|.rtf|.RTF|.pdf|.PDF)$/
    );
    const selectedFile: any = e.target.files && e.target.files[0];
    const reader: any = new FileReader();
    reader.readAsArrayBuffer(selectedFile);
    reader.onload = function () {
      let file: any = new Blob([reader.result], {
        type: "application/pdf",
      });
      file.text().then((x) => {
        if (x.includes("Encrypt")) {
          showSnackAlert(
            "warning",
            `Please select a valid file which is not protected.`
          );
          e.target.value = null;
          setResumeLoader(false);
          return;
        }
        const resume = e.target.files[0].type;
        if (resume) {
          if (e.target?.files[0].size > environment.resumefile) {
            showSnackAlert(
              "warning",
              `Please select a valid file size, Supported file size upto 2MB`
            );
            e.target.value = null;
            setResumeLoader(false);
            return;
          }
          if (
            regex.test(resume) == true ||
            resume === "application/msword" ||
            resume ===
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          ) {
            let formData = new FormData();
            formData.append("resume", e.target.files[0]);
            dispatch(uploadFile(formData));
            e.target.value = null;
          } else {
            showSnackAlert(
              "warning",
              `Please select a valid resume format, Supported Formats: doc, docx, rtf, pdf, upto 2MB`
            );
            e.target.value = null;
            setResumeLoader(false);
            dispatch(resetFileUpload());
          }
        }
      });
    };
  };

  // const UploadVideo = (e: any) => {
  //   setVideoLoader(true);
  //   let regex = new RegExp(/[^\s]+(.*?).(m4v|mp4)$/);
  //   const video = e.target.files[0].type;
  //   if (video) {
  //     if (e.target?.files[0].size > environment.videofile) {
  //       showSnackAlert(
  //         "warning",
  //         `Please select a valid file size, Supported video size upto 2MB`
  //       );
  //       e.target.value = null;
  //       setVideoLoader(false);
  //       return;
  //     }
  //     if (regex.test(video) === true) {
  //       let formData = new FormData();
  //       formData.append("video", e.target.files[0]);
  //       dispatch(uploadFile(formData));
  //     } else {
  //       showSnackAlert(
  //         "warning",
  //         `Please select a valid video format, Supported Formats: m4v, mp4, upto 2MB`
  //       );
  //       setVideoLoader(false);
  //       e.target.value = null;
  //       dispatch(resetFileUpload());
  //     }
  //   }
  // };

  const UploadVideo = (e: any) => {
    setVideoLoader(true);
    const videoSizeLimit = 20 * 1024 * 1024; // 20 MB
    const supportedFormats = ["m4v", "mp4"];
    const video = e.target.files[0].type;

    if (video) {
      if (e.target?.files[0].size > videoSizeLimit) {
        showSnackAlert(
          "warning",
          "Please select a valid file size. Supported video size up to 20MB."
        );
        e.target.value = null;
        setVideoLoader(false);
        return;
      }
      if (supportedFormats.includes(video.split("/")[1])) {
        let formData = new FormData();
        formData.append("video", e.target.files[0]);
        dispatch(uploadFile(formData));
      } else {
        showSnackAlert(
          "warning",
          "Please select a valid video format. Supported formats: m4v, mp4, upto 20MB"
        );
        setVideoLoader(false);
        e.target.value = null;
        dispatch(resetFileUpload());
      }
    }
  };

  useEffect(() => {
    if (UpdatedPersonalDetails && UpdatedPersonalDetails.code === 200) {
      dispatch(getJobSeekerrData());
      dispatch(resetPersonalDetailsCreator());
      showSnackAlert("success", UpdatedPersonalDetails.message);
    }
  }, [UpdatedPersonalDetails]);

  useEffect(() => {
    dispatch(getCountryCode());
    dispatch(getJobSeekerrData());
    dispatch(downloadImage());
    dispatch(profileStrength());
    dispatch(CompanyMasterData({ pageno: -1, search: "" }));
    dispatch(DesignationMasterData({ pageno: -1, search: "" }));
    dispatch(DepartmentMasterData({ pageno: -1, search: "" }));
    dispatch(LocationcityMasterData({ pageno: -1, search: "" }));
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

  const trigger = (boolValue: boolean) => {
    setDisPersoanlDetails(boolValue);
  };
  const change = (boolValue: boolean) => {
    setDisProfileSummary(boolValue);
  };
  const basicDetailsTrigger = (boolValue: boolean) => {
    setDispBasicDetails(boolValue);
  };

  const employerTrigger = (boolValue: boolean) => {
    setDisEmpModel(boolValue);
  };

  const resumeHeadlineTrigger = (boolValue: boolean) => {
    setDisResumeHeadline(boolValue);
  };
  const keySkillsTrigger = (boolValue: boolean) => {
    setDisKeySkills(boolValue);
  };
  const educationTrigger = (boolValue: boolean) => {
    setDisEducation(boolValue);
  };
  const carrerProfileTrigger = (boolValue: boolean) => {
    setDisCareerProfile(boolValue);
  };
  const projectTrigger = (boolValue: boolean) => {
    setDisProject(boolValue);
  };

  useEffect(() => {}, [disBasicDetails]);

  useEffect(() => {
    if (JobSeekerProfile?.js_profile?.profile?.dob) {
      if (JobSeekerProfile?.js_profile?.profile?.gender) {
        setPendingActionPD(false);
      }
    }
  }, [
    disPersonalDetails,
    JobSeekerProfile?.js_profile?.profile,
    pendingActionPD,
  ]);

  useEffect(() => {
    if (JobSeekerProfile?.js_profile?.languages?.length > 0) {
      setDisplayLang(false);
    }
    if (JobSeekerProfile?.js_profile?.career_profile?.headline) {
      setResumeHeadline(false);
    }
    if (JobSeekerProfile?.js_profile?.skills?.key?.length > 0) {
      setKeySkills(false);
    }
    if (
      JobSeekerProfile?.js_profile?.education?.schools?.length > 0 ||
      JobSeekerProfile?.js_profile?.education?.degree?.length > 0
    ) {
      setEducation(false);
    }
    if (JobSeekerProfile?.js_profile?.career_profile?.location?.length > 0) {
      setDesiredLoc(false);
    }
    if (JobSeekerProfile?.js_profile?.career_profile?.dept) {
      setDepartment(false);
    }
    if (JobSeekerProfile?.js_profile?.career_profile?.industry) {
      setIndustry(false);
    }
    if (JobSeekerProfile?.js_profile?.career_profile?.fresher) {
      setProject(true);
      if (JobSeekerProfile?.js_profile?.project?.length > 0) {
        setProject(false);
      }
    }
  }, [JobSeekerProfile?.js_profile?.languages]);

  const [dispVideoUpload, setDispVideoUpload] = useState(true);
  useEffect(() => {
    if (fileUpload?.code === 200) {
      showSnackAlert("success", "File uploaded successfully");
      dispatch(resetFileUpload());
      dispatch(getJobSeekerrData());
      if (JobSeekerProfile?.js_profile?.profile?.intro_video?.name) {
        setDispVideoUpload(false);
      }
    }
  }, [fileUpload, JobSeekerProfile, dispVideoUpload]);

  useEffect(() => {
    if (jobSeekerprofile) {
      setUser_id(JobSeekerProfile?.acc_info?.user_id);
    }
    JobSeekerProfile?.js_profile?.profile?.intro_video?.name
      ? setDispVideoUpload(false)
      : setDispVideoUpload(true);

    if (JobSeekerProfile?.js_profile?.career_profile?.cv?.name) {
      setDisResume(false);
    }
    if (!JobSeekerProfile?.acc_info?.email_verified) {
      setDisEmailVrf(true);
    } else {
      setDisEmailVrf(false);
    }
    if (JobSeekerProfile?.js_profile?.profile?.image?.name) {
      setDisPoto(false);
    }
    if (JobSeekerProfile?.acc_info?.contact?.primary?.phno) {
      if (!JobSeekerProfile?.acc_info?.ph_verified) {
        setAddMobNo(false);
        setNumber(JobSeekerProfile?.acc_info?.contact?.primary?.phno);
        setBaicInfo(JobSeekerProfile?.acc_info);
        setDisMobModel(true);
      } else {
        setDisMobModel(false);
      }
    } else {
      setDisMobModel(true);
      setAddMobNo(true);
    }
    if (!JobSeekerProfile?.js_profile?.career_profile?.fresher) {
      !JobSeekerProfile?.js_profile?.career_profile?.summary
        ? setSummery(true)
        : setSummery(false);
    } else setSummery(false);
    if (!JobSeekerProfile?.js_profile?.career_profile?.fresher) {
      setDisJobProfile(true);
      setCompany_des(true);
      if (JobSeekerProfile?.js_profile?.employments?.length > 0) {
        JobSeekerProfile?.js_profile?.employments?.map((data: any) => {
          if (data.fulltime.job_desc) {
            setDisJobProfile(false);
          }
          if (data.company) {
            setCompany_des(false);
          }
        });
      }
    } else {
      setDisJobProfile(false);
      setCompany_des(false);
    }
    if (
      !disJobProfile &&
      !company_des &&
      !disMobileModel &&
      !disPhoto &&
      !disEmailVrf &&
      !disResume &&
      !dispVideoUpload &&
      !pendingActionPD &&
      !displayLang &&
      !resumeHeadline &&
      !keySkills &&
      !education &&
      !desiredJobLoc &&
      !department &&
      !industry &&
      !project &&
      !summery
    ) {
      navigate("/jobseekerprofile");
    }
    setEmail(JobSeekerProfile?.acc_info?.contact?.primary?.email);
  }, [
    JobSeekerProfile,
    dispVideoUpload,
    disResume,
    disPhoto,
    disMobileModel,
    basicInfo,
    disEmailVrf,
    user_id,
    res,
    disJobProfile,
  ]);

  const handleProfileChange = (e: any) => {
    let regex = new RegExp(/[^\s]+(.*?).(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/);
    const image = e.target?.files[0].type;
    if (image) {
      if (regex.test(image) == true) {
        let formData = new FormData(); //formdata object
        formData.append("image", e.target?.files[0]);
        dispatch(jobSeekerprofile(formData));
      } else if (e.target?.files[0].size > 5000000) {
        showSnackAlert("warning", "image size should not exceed 5MB.");
        e.target.files[0] = null;
        e.target.files = [];
      } else {
        showSnackAlert("warning", "Please select a valid image.");
        e.target.files[0] = null;
        e.target.files = [];
      }
    }
  };

  useEffect(() => {
    if (verifynum) {
      const timer: any = time > 0 && setInterval(() => setTime(time - 1), 1000);
      setMins(Math.floor(time / 60));
      setSecs(time % 60);
      return () => clearInterval(timer);
    }
  }, [number, time, disModelText]);

  const sendOtpHandler = (otpType: string, contact: any) => {
    const options = {
      to: contact,
      channel: otpType,
      user_id: user_id,
    };
    switch (otpType) {
      case "sms":
        options.to = `+91${contact}`;
        dispatch(sendOtp(options));
        break;
      case "email":
        dispatch(sendOtp(options));
        break;
    }
  };
  const displaySkl = [1, 2, 3, 4];

  const verifyConOtp = (verifyType: string) => {
    const VerificationInfo = {
      to: number,
      txn_id: txtId,
      otp: Number(`${otp[0]}${otp[1]}${otp[2]}${otp[3]}${otp[4]}${otp[5]}`),
      channel: verifyType,
    };
    switch (verifyType) {
      case "sms":
        VerificationInfo.to = `+91${number}`;
        dispatch(verifyOtp(VerificationInfo));
        break;
      case "email":
        VerificationInfo.to = email;
        dispatch(verifyOtp(VerificationInfo));
        break;
    }
  };

  return (
    <>
      <div className="page-wraper">
        <div className="page-content bg-white">
          <div
            className="dez-bnr-inr overlay-black-middle"
            style={{ backgroundImage: "url(" + bnr + ")" }}
          >
            <div className="container">
              <div className="dez-bnr-inr-entry">
                <h1
                  className="text-white"
                  style={{
                    fontSize: "20px",
                    marginTop: "133px",
                    float: "left",
                  }}
                >
                  Pending Action(s)
                </h1>
                <div className="breadcrumb-row">
                  <ul className="list-inline"></ul>
                </div>
              </div>
            </div>
          </div>
          <div className="job-bx-title backli clearfix">
            {" "}
            <Link
              to={"/jobseekerprofile"}
              className="site-button right-arrow button-sm float-right backlink"
            >
              Go Back To Profile
            </Link>{" "}
          </div>
          <div className="content-block">
            <div
              className="section-full browse-job"
              style={{
                paddingTop: "30px",
                paddingBottom: "30px",
              }}
            >
              <div className="container">
                <div className="row">
                  {loading &&
                    displaySkl.map(() => {
                      return (
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                          <div className=" job-bx bg-white m-b30">
                            <div className="d-flex">
                              <PendingAction_Skl />
                            </div>
                          </div>
                        </div>
                      );
                    })}

                  {/* Verify Email */}
                  {!loading && disEmailVrf && (
                    <div className="col-xl-6 col-lg-5 col-md-5 col-sm-12">
                      <div className=" job-bx bg-white m-b30">
                        <div className="d-flex">
                          <h5 className="m-b15 pendingCard">
                            Verify Email{" "}
                            <span className="font-14">{`(${pflStrength?.pflStrnRes?.data?.profileWeightage?.email_verified}%)`}</span>
                          </h5>
                        </div>
                        <p className="m-b0 pendingcarddesc">
                          Recruiters are more likely to contact candidates with
                          verified email address. Verify your email address to
                          increase your chances of getting contacted.
                        </p>
                        <span
                          className="commonSty"
                          style={{ fontSize: "12px" }}
                        >
                          {JobSeekerProfile &&
                            JobSeekerProfile?.acc_info?.contact?.primary?.email}
                        </span>{" "}
                        <Link
                          to={"#"}
                          onClick={() => {
                            setTimeFunc();
                            setDisModelText(false);
                            setVerifynum(true);
                            sendOtpHandler("email", email);
                          }}
                          className="emailverfy"
                        >
                          Verify
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Verify Mobile */}

                  {!loading && disMobileModel && (
                    <div className="col-xl-6 col-lg-5 col-md-5 col-sm-12">
                      <div className=" job-bx bg-white m-b30">
                        <div className="d-flex">
                          {!addMobNo && (
                            <h5 className="m-b15 pendingCard">
                              Verify Mobile{" "}
                              <span className="font-14">{`(${pflStrength?.pflStrnRes?.data?.profileWeightage?.ph_verified}%)`}</span>
                            </h5>
                          )}
                          {addMobNo && (
                            <h5 className="m-b15 pendingCard">Add Mobile</h5>
                          )}
                        </div>
                        <p className="m-b0 pendingcarddesc">
                          Verify your mobile number to increase your chances of
                          getting contacted by recruiters.
                        </p>
                        <span
                          className="commonSty"
                          style={{ fontSize: "12px" }}
                        ></span>{" "}
                        {!addMobNo && (
                          <>
                            <span
                              className="commonSty"
                              style={{
                                fontSize: "12px",
                              }}
                            >
                              {JobSeekerProfile &&
                                JobSeekerProfile?.acc_info?.contact?.primary
                                  ?.phno}
                            </span>{" "}
                            <Link
                              to={"#"}
                              onClick={() => {
                                setTimeFunc();
                                setDisModelText(true);
                                setVerifynum(true);
                                sendOtpHandler("sms", number);
                              }}
                              className="emailverfy"
                            >
                              Verify
                            </Link>
                          </>
                        )}
                        {addMobNo && (
                          <>
                            <span
                              className="commonSty"
                              style={{
                                fontSize: "12px",
                              }}
                            >
                              {JobSeekerProfile &&
                                JobSeekerProfile?.acc_info?.contact?.primary
                                  ?.phno}
                            </span>{" "}
                            <Link
                              to={"#"}
                              onClick={() => {
                                setDispBasicDetails(true);
                              }}
                              className="emailverfy"
                            >
                              Add Mobile Number
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Upload Photo */}
                  {!loading && disPhoto && (
                    <div className="col-xl-6 col-lg-5 col-md-5 col-sm-12">
                      <div className=" job-bx bg-white m-b30">
                        <div className="d-flex">
                          <h5 className="m-b15 pendingCard">
                            Upload Photo{" "}
                            <span className="font-14">{`(${pflStrength?.pflStrnRes?.data?.profileWeightage?.photo}%)`}</span>
                          </h5>
                          <div>
                            <div
                              className="upload-link"
                              title="Change your profile photo"
                              data-toggle="tooltip"
                              data-placement="right"
                            >
                              <h6 className=" pendingButton">
                                Upload Photo
                                <input
                                  type="file"
                                  className="update-flie"
                                  accept="image/*"
                                  style={{
                                    width: "20%",
                                    marginLeft: "75%",
                                  }}
                                  onChange={(event: any) => {
                                    handleProfileChange(event);
                                  }}
                                />
                              </h6>
                            </div>
                          </div>
                        </div>
                        <p className="m-b0 pendingcarddesc">
                          Upload a professional photograph showing your entire
                          face, neck and possibly top of your shoulders clearly.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Resume Headline */}

                  {!loading && resumeHeadline && (
                    <div className="col-xl-6 col-lg-5 col-md-5 col-sm-12">
                      <div className=" job-bx bg-white m-b30">
                        <div className="d-flex">
                          <h5 className="m-b15 pendingCard">
                            Resume Headline{" "}
                            <span className="font-14">{`(${pflStrength?.pflStrnRes?.data?.profileWeightage?.headline}%)`}</span>
                          </h5>
                          <Link
                            to={"#"}
                            className="pendingButton"
                            onClick={() => {
                              setDisResumeHeadline(true);
                            }}
                          >
                            ADD RESUME HEADLINE
                          </Link>
                        </div>
                        <p className="m-b0 pendingcarddesc">
                          Write concisely what makes you unique and right person
                          for the job you are looking for.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Key Skills */}

                  {!loading && keySkills && (
                    <div className="col-xl-6 col-lg-5 col-md-5 col-sm-12">
                      <div className=" job-bx bg-white m-b30">
                        <div className="d-flex">
                          <h5 className="m-b15 pendingCard">
                            Key Skills{" "}
                            <span className="font-14">{`(${pflStrength?.pflStrnRes?.data?.profileWeightage?.key_skill}%)`}</span>
                          </h5>
                          <Link
                            to={"#"}
                            className="pendingButton"
                            onClick={() => {
                              setDisKeySkills(true);
                            }}
                          >
                            ADD KEY SKILLS
                          </Link>
                        </div>
                        <p className="m-b0 pendingcarddesc">
                          Tell recruiters what you know or what you are known
                          for. We will send you job recommendations basis these
                          skills.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {!loading && education && (
                    <div className="col-xl-6 col-lg-5 col-md-5 col-sm-12">
                      <div className=" job-bx bg-white m-b30">
                        <div className="d-flex">
                          <h5 className="m-b15 pendingCard">
                            Education{" "}
                            <span className="font-14">{`(${pflStrength?.pflStrnRes?.data?.profileWeightage?.education}%)`}</span>
                          </h5>
                          <Link
                            to={"#"}
                            className="pendingButton"
                            onClick={() => {
                              setDisEducation(true);
                            }}
                          >
                            ADD EDUCATION
                          </Link>
                        </div>
                        <p className="m-b0 pendingcarddesc">
                          Mention your education details. You can add details
                          about your school, institute and specialization.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Desired Job Location */}
                  {!loading && desiredJobLoc && (
                    <div className="col-xl-6 col-lg-5 col-md-5 col-sm-12">
                      <div className=" job-bx bg-white m-b30">
                        <div className="d-flex">
                          <h5 className="m-b15 pendingCard">
                            Desired Job Location{" "}
                            <span className="font-14">{`(${pflStrength?.pflStrnRes?.data?.profileWeightage?.des_job_loc}%)`}</span>
                          </h5>
                          <Link
                            to={"#"}
                            className="pendingButton"
                            onClick={() => {
                              setDisCareerProfile(true);
                            }}
                          >
                            ADD DESIRED JOB LOCATION
                          </Link>
                        </div>
                        <p className="m-b0 pendingcarddesc">
                          Tell us about your location preferences. This will
                          help us personalize your job recommendations.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Department */}
                  {!loading && department && (
                    <div className="col-xl-6 col-lg-5 col-md-5 col-sm-12">
                      <div className=" job-bx bg-white m-b30">
                        <div className="d-flex">
                          <h5 className="m-b15 pendingCard">
                            Department{" "}
                            <span className="font-14">{`(${pflStrength?.pflStrnRes?.data?.profileWeightage?.dept}%)`}</span>
                          </h5>
                          <Link
                            to={"#"}
                            className="pendingButton"
                            onClick={() => {
                              setDisCareerProfile(true);
                            }}
                          >
                            ADD DEPARTMENT
                          </Link>
                        </div>
                        <p className="m-b0 pendingcarddesc">
                          Tell us more about what department you currently or
                          recently worked in.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Industry Type */}
                  {!loading && industry && (
                    <div className="col-xl-6 col-lg-5 col-md-5 col-sm-12">
                      <div className=" job-bx bg-white m-b30">
                        <div className="d-flex">
                          <h5 className="m-b15 pendingCard">
                            Industry Type{" "}
                            <span className="font-14">{`(${pflStrength?.pflStrnRes?.data?.profileWeightage?.ind_type}%)`}</span>
                          </h5>
                          <Link
                            to={"#"}
                            className="pendingButton"
                            onClick={() => {
                              setDisCareerProfile(true);
                            }}
                          >
                            ADD INDUSTRY TYPE
                          </Link>
                        </div>
                        <p className="m-b0 pendingcarddesc">
                          Tell us about your industry preferences. This will
                          help us personalize your job recommendations.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {!loading && project && (
                    <div className="col-xl-6 col-lg-5 col-md-5 col-sm-12">
                      <div className=" job-bx bg-white m-b30">
                        <div className="d-flex">
                          <h5 className="m-b15 pendingCard">
                            Project{" "}
                            <span className="font-14">{`(${pflStrength?.pflStrnRes?.data?.profileWeightage?.project}%)`}</span>
                          </h5>
                          <Link
                            to={"#"}
                            className="pendingButton"
                            onClick={() => {
                              setDisProject(true);
                            }}
                          >
                            ADD PROJECT
                          </Link>
                        </div>
                        <p className="m-b0 pendingcarddesc">
                          Add details about projects you have done in college,
                          internship or at work.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Languages */}
                  {!loading && displayLang && (
                    <div className="col-xl-6 col-lg-5 col-md-5 col-sm-12">
                      <div className=" job-bx bg-white m-b30">
                        <div className="d-flex">
                          <h5 className="m-b15 pendingCard">
                            Languages{" "}
                            <span className="font-14">{`(${pflStrength?.pflStrnRes?.data?.profileWeightage?.lang}%)`}</span>
                          </h5>
                          <Link
                            to={"#"}
                            className="pendingButton"
                            onClick={() => {
                              setDisPersoanlDetails(true);
                            }}
                          >
                            ADD LANGUAGES
                          </Link>
                        </div>
                        <p className="m-b0 pendingcarddesc">
                          Tell recruiters about the languages you know and your
                          proficiency level in those languages.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Personal Details */}

                  {!loading && pendingActionPD && (
                    <div className="col-xl-6 col-lg-5 col-md-5 col-sm-12">
                      <div className=" job-bx bg-white m-b30">
                        <div className="d-flex">
                          <h5 className="m-b15 pendingCard">
                            Personal Details{" "}
                            <span className="font-14">{`(${
                              Number(
                                pflStrength?.pflStrnRes?.data?.profileWeightage
                                  ?.gender
                              ) +
                              Number(
                                pflStrength?.pflStrnRes?.data?.profileWeightage
                                  ?.dob
                              )
                            }%)`}</span>
                          </h5>
                          <Link
                            to={"#"}
                            className=" pendingButton"
                            onClick={() => {
                              setDisPersoanlDetails(true);
                            }}
                          >
                            ADD PERSONAL DETAILS
                          </Link>
                        </div>
                        <p className="m-b0 pendingcarddesc">
                          Your personal details will make your profile richer
                          and will help recruiters find out more about you.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Job Profile */}
                  {!loading && disJobProfile && (
                    <div className="col-xl-6 col-lg-5 col-md-5 col-sm-12">
                      <div className=" job-bx bg-white m-b30">
                        <div className="d-flex">
                          <h5 className="m-b15 pendingCard">
                            Job Profile{" "}
                            <span className="font-14">{`(${Number(
                              pflStrength?.pflStrnRes?.data?.profileWeightage
                                ?.job_profile
                            )}%)`}</span>
                          </h5>
                          <Link
                            to={"#"}
                            onClick={() => {
                              setDisEmpModel(true);
                            }}
                            className="pendingButton"
                          >
                            ADD JOB PROFILE
                          </Link>
                        </div>
                        <p className="m-b0 pendingcarddesc">
                          Tell recruiters a little more about what exactly you
                          did at work including your responsibilities and
                          achievements.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* EMP-> Company and Designation */}
                  {!loading && company_des && (
                    <div className="col-xl-6 col-lg-5 col-md-5 col-sm-12">
                      <div className=" job-bx bg-white m-b30">
                        <div className="d-flex">
                          <h5 className="m-b15 pendingCard">
                            Company and Designation{" "}
                            <span className="font-14">{`(${Number(
                              pflStrength?.pflStrnRes?.data?.profileWeightage
                                ?.designation
                            )}%)`}</span>
                          </h5>
                          <Link
                            to={"#"}
                            onClick={() => {
                              setDisEmpModel(true);
                            }}
                            className="pendingButton"
                          >
                            ADD COMPANY AND DESIGNATION
                          </Link>
                        </div>
                        <p className="m-b0 pendingcarddesc">
                          Mention your employment details including your current
                          and previous company work experience.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Profile Summary */}
                  {!JobSeekerProfile?.js_profile?.career_profile?.fresher &&
                    summery && (
                      <div className="col-xl-6 col-lg-5 col-md-5 col-sm-12">
                        <div className=" job-bx bg-white m-b30">
                          <div className="d-flex">
                            <h5 className="m-b15 pendingCard">
                              Profile Summary{" "}
                              <span className="font-14">{`(${pflStrength?.pflStrnRes?.data?.profileWeightage?.prof_summery}%)`}</span>
                            </h5>
                            <Link
                              to={"#"}
                              className="pendingButton"
                              onClick={() => {
                                setDisProfileSummary(true);
                              }}
                            >
                              ADD PROFILE SUMMARY
                            </Link>
                          </div>
                          <p className="m-b0 pendingcarddesc">
                            Mention the highlights of your career and education,
                            what your professional interests are, and what kind
                            of a career you are looking for.
                          </p>
                        </div>
                      </div>
                    )}

                  {/* upload resume */}
                  {disResume && (
                    <div className="col-xl-6 col-lg-5 col-md-5 col-sm-12">
                      <div
                        id="attach_video_bx"
                        className="job-bx bg-white m-b30"
                      >
                        <h5 className="m-b15 pendingCard">
                          Resume{" "}
                          <span className="font-14">{`(${pflStrength?.pflStrnRes?.data?.profileWeightage?.cv}%)`}</span>
                        </h5>
                        <div className="c_content_desc">
                          <p className="m-b0 pendingcarddesc">
                            Resume is the most important document recruiters
                            look for. Recruiters generally do not look at
                            profiles without resumes.
                          </p>
                        </div>

                        <div
                          className="c_content_subheader"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <p title="Click here to play video"></p>
                        </div>
                        <div className="RVdeletebtn"></div>
                        <form className="attach-resume ">
                          <div className="row">
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group ">
                                <div className="custom-file">
                                  <p className="m-auto align-self-center VerifyRupload">
                                    {resumeLoader ? (
                                      <>
                                        {" "}
                                        <i
                                          className="fa fa-circle-o-notch fa-spin"
                                          style={{
                                            marginRight: "10px",
                                          }}
                                        >
                                          {" "}
                                        </i>{" "}
                                        UPLOADING...
                                      </>
                                    ) : (
                                      <>
                                        <BsCloudUpload
                                          style={{
                                            marginBottom: "-5px",
                                          }}
                                        />{" "}
                                        UPLOAD RESUME
                                      </>
                                    )}
                                  </p>
                                  <input
                                    type="file"
                                    className="site-button form-control"
                                    id="customFile"
                                    onChange={UploadResume}
                                    style={{
                                      width: "100%",
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                        <p className="modal-custom-desc text-center">
                          Supported Formats: doc, docx, rtf, pdf, upto 2 MB
                        </p>
                      </div>
                    </div>
                  )}

                  {/* upload video */}
                  {dispVideoUpload && (
                    <div className="col-xl-6 col-lg-5 col-md-5 col-sm-12">
                      <div
                        id="attach_video_bx"
                        className="job-bx bg-white m-b30"
                      >
                        <h5 className="m-b15 pendingCard">
                          Video{" "}
                          <span className="font-14">{`(${pflStrength?.pflStrnRes?.data?.profileWeightage?.intro_video}%)`}</span>
                        </h5>
                        <div className="c_content_desc">
                          <p className="m-b0 pendingcarddesc">
                            Video is the most important document recruiters look
                            for. Recruiters generally do not look at profiles
                            without Videos.
                          </p>
                        </div>

                        <div
                          className="c_content_subheader"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <p title="Click here to play video"></p>
                        </div>
                        <div className="RVdeletebtn"></div>
                        <form className="attach-resume ">
                          <div className="row">
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group ">
                                <div className="custom-file">
                                  <p className="m-auto align-self-center VerifyRupload">
                                    {videoLoader ? (
                                      <>
                                        {" "}
                                        <i
                                          className="fa fa-circle-o-notch fa-spin"
                                          style={{
                                            marginRight: "10px",
                                          }}
                                        >
                                          {" "}
                                        </i>{" "}
                                        UPLOADING...
                                      </>
                                    ) : (
                                      <>
                                        <BsCloudUpload
                                          style={{
                                            marginBottom: "-5px",
                                          }}
                                        />{" "}
                                        UPLOAD VIDEO
                                      </>
                                    )}
                                  </p>
                                  <input
                                    type="file"
                                    className="site-button form-control"
                                    id="customFile"
                                    onChange={UploadVideo}
                                    style={{
                                      width: "100%",
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                        <p className="modal-custom-desc text-center">
                          Supported Formats: m4v, mp4, upto 20 MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {disCareerProfile && (
        <CareerProfile displayModel={true} trigger={carrerProfileTrigger} />
      )}
      {disProject && <Projects displayModel={true} trigger={projectTrigger} />}
      {disEducation && (
        <Education displayModel={true} trigger={educationTrigger} />
      )}
      {disResumeHeadline && (
        <ResumeHeadline displayModel={true} trigger={resumeHeadlineTrigger} />
      )}
      {disKeySkills && (
        <KeySkills displayModel={true} trigger={keySkillsTrigger} />
      )}
      {disPersonalDetails && (
        <PersonalDetails displayModel={true} trigger={trigger} />
      )}
      {disProfileSummary && (
        <ProfileSummary displayModel={true} change={change} />
      )}
      {disBasicDetails && (
        <BasicDetails displayModel={true} trigger={basicDetailsTrigger} />
      )}
      {disEmpModel && (
        <Employment displayModel={true} trigger={employerTrigger} />
      )}

      {/* OTP verification model */}
      {
        <Modal
          show={verifynum}
          onHide={() => {
            setVerifynum(false);
            setOtp(new Array(6).fill(""));
          }}
          className="modal fade modal-bx-info editor"
        >
          <div className="modal-dialog my-0  mx-0 w-100 " role="document">
            <div className="modal-content">
              <div className="modal-body">
                <div>
                  {
                    <h6
                      style={{
                        textAlign: "center",
                        color: "#0070a6",
                        fontFamily: "Montserrat",
                      }}
                    >
                      {disModelText
                        ? "VERIFY MOBILE NUMBER"
                        : "VERIFY EMAIL ID"}
                    </h6>
                  }
                  <center>
                    <span style={{ fontFamily: "Montserrat" }}>
                      {disModelText
                        ? "Enter OTP sent to your mobile number"
                        : "Enter OTP sent to your email id"}
                    </span>
                    <br></br>
                    <span>{disModelText ? number : email}</span>
                    {mins > 9 && secs > 9 && (
                      <p style={{ fontSize: "13px" }}>
                        OTP will expire in{" "}
                        <span className="badge badge-pill badge-info">
                          {mins}:{secs}
                        </span>{" "}
                        mins
                      </p>
                    )}
                    {mins < 10 && secs > 9 && (
                      <p style={{ fontSize: "13px" }}>
                        OTP will expire in{" "}
                        <span className="badge badge-pill badge-info">
                          0{mins}:{secs}
                        </span>{" "}
                        mins
                      </p>
                    )}
                    {mins > 9 && secs < 10 && (
                      <p style={{ fontSize: "13px" }}>
                        OTP will expire in{" "}
                        <span className="badge badge-pill badge-info">
                          {mins}:0{secs}
                        </span>{" "}
                        mins
                      </p>
                    )}
                    {mins < 10 && secs < 10 && (
                      <p style={{ fontSize: "13px" }}>
                        OTP will expire in{" "}
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
                          regex.numberTyping && otpChanges(e, idx);
                        }}
                        value={otp[idx]}
                        onKeyDown={(e) => otpKeyChanges(e, idx)}
                      />
                    ))}
                    <br></br>
                    <br></br>
                    {otp.join("")?.length === 6 && (
                      <button
                        type="button"
                        className="site-button border border-primary btn-sm"
                        disabled={otp.join("")?.length === 6 ? false : true}
                        style={{
                          cursor: "pointer",
                          background: "white",
                          color: "#2e55fa",
                          borderColor: "#2e55fa",
                        }}
                        onClick={(e: any) => {
                          setLoader2(true);
                          disModelText
                            ? verifyConOtp("sms")
                            : verifyConOtp("email");
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
                          disModelText
                            ? sendOtpHandler("sms", number)
                            : sendOtpHandler("email", email);
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
                        {loader3 ? "RESENDING OTP" : "RESEND OTP"}
                      </button>
                    )}
                  </center>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      }
    </>
  );
};

export default PendingAction;
