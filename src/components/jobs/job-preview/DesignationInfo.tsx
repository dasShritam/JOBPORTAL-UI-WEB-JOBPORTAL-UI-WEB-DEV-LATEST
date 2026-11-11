import jwtDecode from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import { BsPerson } from "react-icons/bs";
import { CgWorkAlt } from "react-icons/cg";
import { HiOutlineClock, HiOutlineLocationMarker } from "react-icons/hi";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { IoCallOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  convertTo12HourFormat,
  formatNumberToSalary,
  getDateDifference,
  getTimestampToDate,
} from "../../../common/common";
import { ROLES } from "../../../config/app.config";
import { AppContext } from "../../../context/AppContext";
import { environment } from "../../../environments/environment";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import {
  JobApply,
  resetApplyJob,
} from "../../../redux/features/jobs/apply-job/ApplyJob";
import { findJob } from "../../../redux/features/jobs/job-listing/JobListingSlice";
import { JobPreviewData } from "../../../redux/features/jobs/job-preview/JobPreviewSlice";
import { manageJobsData } from "../../../redux/features/jobs/manage-jobs/ManageJobsSlice";
import {
  PatchSaveUnSaveJob,
  resetSaveUnsaveCreator,
} from "../../../redux/features/jobs/saved-jobs/SavedJobsSlice";
import { RoleGroup } from "../../../routes/roles";
import ApplyJob from "../../shared/ApplyJob";
import Alert from "@mui/material/Alert";

function DesignationInfo(data: any) {
  const dispatch = useDispatch();
  const apply = useSelector((state: any) => state.JobApply);
  const { applyJob, loadjobs } = apply;
  const savejob = useSelector((state: any) => state.PatchSaveUnSaveJobSlice);
  const { saveOrUnsave } = savejob;
  const preview = useSelector((state: any) => state.Jobpreviews);
  const { JobPreviewDetails, loadingJobPreview } = preview;
  const listingJob = useSelector((state: any) => state.ManageJobs);
  const { allManageJobs } = listingJob;
  const findJobData = useSelector((state: any) => state.findJob);
  const { res } = findJobData;
  const [disableButton, setDisableButton] = useState<any>(false);
  const [jobs, setJobs] = useState<any>([]);

  //SHOW BUTTONS TO ONLY JOBSEEKER
  const decodedToken: any = sessionStorage.getItem("access_token")
    ? jwtDecode(sessionStorage.getItem("access_token")!)
    : "";
  const { userInfo, setUserInfo } = useContext(AppContext);

  useEffect(() => {
    if (decodedToken) {
      setUserInfo(decodedToken);
    }
  }, []);
  //colpt shw btn

  useEffect(() => {}, []);
  useEffect(() => {
    if (saveOrUnsave?.code === 200) {
      showSnackAlert("success", saveOrUnsave?.message);
      dispatch(resetSaveUnsaveCreator());
    } else if (saveOrUnsave?.response?.data?.code === 400) {
      showSnackAlert("warning", saveOrUnsave?.response?.data?.message);
      dispatch(resetSaveUnsaveCreator());
    }
  }, [saveOrUnsave]);

  const navigate = useNavigate();

  useEffect(() => {
    if (jobs) {
      jobs[0]?.application_status?.self === "APPLY"
        ? setDisableButton(true)
        : setDisableButton(false);
    }
  }, [jobs]);
  useEffect(() => {
    if (loadingJobPreview && res?.data?.jobs.length > 0) {
      setJobs(res?.data?.jobs);
    } else if (JobPreviewDetails?.data?.jobs.length > 0) {
      setJobs(JobPreviewDetails?.data?.jobs);
    } else if (allManageJobs && allManageJobs?.jobs?.length > 0) {
      setJobs(allManageJobs?.jobs);
    }
  }, [loadingJobPreview, res, JobPreviewDetails, allManageJobs, jobs]);

  const [iamInterested, setIamInterested] = useState<any>();
  const [copyUrl, setCopyUrl] = useState<any>();
  const [registerToApply, setRegisterToApply] = useState<any>();
  const [loginToApply, setLoginToApply] = useState<any>();
  const [checkLogin, setCheckLogin] = useState<boolean>();
  const [checkJObSeekerLogin, setCheckJobSeekerLogin] = useState<boolean>();
  const [showModal, setShowModal] = useState(false);
  const showSnackAlert = UseToastAlert();
  const [saveDisable, setSaveDisable] = useState("");
  const [interested, setInterested] = useState(false);
  const [checkEmpLogin, setCheckEmpLogin] = useState<boolean>();
  useEffect(() => {
    if (sessionStorage.getItem("access_token")) {
      setCheckEmpLogin(true);
    } else {
      setCheckEmpLogin(false);
    }
  }, []);
  useEffect(() => {
    if (sessionStorage.getItem("access_token")) {
      setCheckJobSeekerLogin(true);
    } else {
      setCheckJobSeekerLogin(false);
    }
  }, []);
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleApplyJob = () => {
    if (jobs && jobs[0]?.questions?.length) {
      jobs[0]?.application_status?.self === "APPLY"
        ? setShowModal(false)
        : setShowModal(true);
    } else {
      const apply = {
        jobid: jobs[0]?.jobid,
        status: "APPLY",
      };
      let applyData = new FormData();
      applyData.append("jobSeekerResp", JSON.stringify(apply));
      dispatch(JobApply(applyData));
    }
  };

  const getFormatedTime = (time) => {
    const times = time?.split("-");
    return `${convertTo12HourFormat(times[0])}-${convertTo12HourFormat(
      times[1]
    )}`;
  };

  const { id } = useParams();
  const PreviewJobOptions = {
    mode: "all",
    pageid: 1,
    jobid: id,
    pageLimit: 10,
  };
  const fetchData = () => {
    if (!RoleGroup.EMP_ADMIN_RECRUITER.includes(userInfo?.roles[0])) {
      dispatch(JobPreviewData(PreviewJobOptions));
    } else if (RoleGroup.EMP_ADMIN_RECRUITER.includes(userInfo?.roles[0])) {
      dispatch(manageJobsData(PreviewJobOptions));
    } else {
      const fetchInfo = {
        mode: "all",
        pageid: 1,
        title: "",
        location: "",
        industry: "",
        jobid: id,
      };
      dispatch(findJob(fetchInfo));
    }
  };

  useEffect(() => {
    if (!loadjobs && applyJob?.code === 200) {
      showSnackAlert("success", applyJob.message);
      setShowModal(false);
      setSaveDisable("gray");
      fetchData();
      setInterested(true);
      dispatch(resetApplyJob());
      if (jobs[0]?.applyJob?.message === "Job saved successfully") {
        setSaveBtnHide(false);
      }
    } else if (applyJob?.code === 400) {
      showSnackAlert("warning", applyJob?.message);
      setShowModal(false);
      dispatch(resetApplyJob());
      setInterested(false);
    } else if (applyJob?.response?.data?.code === 401) {
      // handle the case where the response code is 401

      showSnackAlert("warning", "Bad Request");
      setShowModal(false);
      dispatch(resetApplyJob());
    }
  }, [applyJob, loadjobs, interested]);

  useEffect(() => {
    if (sessionStorage.getItem("access_token")) {
      setCheckLogin(true);
    } else {
      setCheckLogin(false);
    }
  }, []);

  const [isDisable, setIsDisable] = useState("");
  const saveJob = () => {
    if (sessionStorage.getItem("access_token")) {
      const saveInputs = {
        jobid: jobs[0]?.jobid,
        status: "SAVE",
      };

      let data = new FormData();
      data.append("jobSeekerResp", JSON.stringify(saveInputs));
      dispatch(PatchSaveUnSaveJob(data));
      setIamInterested(true);
    } else {
      sessionStorage.setItem("jobid", jobs[0]?.jobid);
      navigate("/jobSeekerSignin");
    }
  };

  useEffect(() => {
    if (jobs[0]?.application_status?.self === "APPLY") {
      setIsDisable("gray");
    } else {
      setIsDisable("blue");
    }
    if (jobs[0]?.application_status?.self === "SAVE") {
      setSaveDisable("gray");
      setInterested(true);
    } else {
      setSaveDisable("blue");
    }
  }, [jobs, saveDisable, interested]);

  const [saveBtnHide, setSaveBtnHide] = useState(false);
  return (
    <>
      {jobs.length > 0 && (
        <div className="job-bx bg-white m-b10">
          <div className="d-flex justify-content-between">
            <div className="row w-100">
              <div className="col-xl-10 col-lg-10 col-md-10 col-sm-12">
                {jobs?.length && (
                  <>
                    <div className="d-flex flex-column w-100">
                      <span
                        className="job-title"
                        style={{ wordWrap: "break-word" }}
                      >
                        {jobs[0]?.title ? jobs[0]?.title : "Not Available"}
                      </span>

                      {jobs[0]?.alias && (
                        <div className="job-content">
                          <span>Reference code : </span>
                          <span className="ml-1">
                            {jobs[0]?.alias ? jobs[0]?.alias : "Not Available"}
                          </span>
                        </div>
                      )}
                      {jobs[0]?.employer?.company_name && (
                        <div className="job-content">
                          <HiBuildingOffice2
                            className="custom-job-icon"
                            title="Comapany name"
                          />
                          <span className="ml-1">
                            {jobs[0]?.employer?.company_name
                              ? jobs[0]?.employer?.company_name
                              : "Not Available"}
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div style={{ float: "right" }}>
              {checkLogin && userInfo?.roles[0] === ROLES.JOBSEEKER && (
                <button
                  className="site-button btn-sm"
                  onClick={handleApplyJob}
                  style={{ background: `${isDisable}` }}
                  disabled={jobs[0]?.application_status?.self === "APPLY"}
                >
                  {jobs.length > 0 &&
                  jobs[0]?.application_status?.self === "APPLY"
                    ? "Applied"
                    : "Apply"}
                </button>
              )}
            </div>

            {!checkLogin && (
              <div>
                {/* <button
                type="button"
                className={
                  registerToApply
                    ? "btn btn-primary btn-sm"
                    : "btn btn-outline-primary btn-sm"
                }
                onClick={() => {
                  navigate("/jobseekerregister");
                  setRegisterToApply(true);
                  setLoginToApply(false);
                }}
              >
                Register to Apply{" "}
              </button>{" "}
              &nbsp;{" "} */}
                <button
                  type="button"
                  className={
                    loginToApply
                      ? "btn btn-primary btn-sm"
                      : "btn btn-outline-primary btn-sm"
                  }
                  onClick={() => {
                    navigate("/jobSeekerSignin");
                    setRegisterToApply(false);
                    setLoginToApply(true);
                  }}
                >
                  {" "}
                  Login to Apply{" "}
                </button>{" "}
              </div>
            )}
          </div>

          {jobs?.length && (
            <div>
              <div className="c_content_details  flex-column m-b15">
                <div>
                  {jobs[0]?.client?.name && (
                    <div className="job-content">
                      <span>Hiring for : </span>
                      <span className="ml-1">
                        {jobs[0]?.client?.name
                          ? jobs[0]?.client?.name
                          : "Not Available"}
                      </span>
                    </div>
                  )}
                  <div className="job-content mt-1">
                    {checkJObSeekerLogin &&
                      userInfo?.roles[0] === ROLES.JOBSEEKER &&
                      jobs[0]?.include_video && (
                        <div>
                          <Alert severity="warning">
                            This job requires candidates with video profile,
                            it's better to upload a video before applying for a
                            job.
                          </Alert>
                        </div>
                      )}
                  </div>
                  <hr />
                  <div className="d-flex">
                    <div className="job-content mr-2">
                      <CgWorkAlt title="Experience" />
                      {/* <span className="ml-1">
                        {jobs[0]?.exp?.max
                          ? `${jobs[0]?.exp?.min} - ${jobs[0]?.exp?.max} years`
                          : "Not mentioned"}
                      </span> */}
                      <span className="ml-1">
                        {jobs[0]?.exp?.min === 0 && jobs[0]?.exp?.max === 0
                          ? "Fresher"
                          : jobs[0]?.exp?.max
                          ? `${jobs[0]?.exp?.min} - ${jobs[0]?.exp?.max} years`
                          : "Not mentioned"}
                      </span>
                    </div>
                    <span>|</span>
                    <div className="job-content ml-2" title="Salary">
                      {/* <span className="ml-1">
                        {checkEmpLogin &&
                        userInfo?.roles[0] === ROLES.EMPLOYER_ADMINISTRATOR ? (
                          <>
                            {jobs[0]?.salary?.currency === "USD" ? "$" : "₹"}
                            {formatNumberToSalary(jobs[0]?.salary?.min)} -{" "}
                            {jobs[0]?.salary?.max ? (
                              <>
                                {jobs[0]?.salary?.currency === "USD"
                                  ? "$"
                                  : "₹"}
                                {formatNumberToSalary(jobs[0]?.salary?.max)}
                              </>
                            ) : (
                              " Not mentioned"
                            )}
                          </>
                        ) : jobs[0]?.salary?.visible ? (
                          <>
                            {jobs[0]?.salary?.currency === "USD" ? "$" : "₹"}
                            {formatNumberToSalary(jobs[0]?.salary?.min)} -{" "}
                            {jobs[0]?.salary?.max ? (
                              <>
                                {jobs[0]?.salary?.currency === "USD"
                                  ? "$"
                                  : "₹"}
                                {formatNumberToSalary(jobs[0]?.salary?.max)}
                              </>
                            ) : (
                              " Not disclosed"
                            )}
                          </>
                        ) : (
                          "₹ Not disclosed"
                        )}
                      </span> */}

                      <span className="ml-1">
                        {checkEmpLogin &&
                        userInfo?.roles[0] === ROLES.EMPLOYER_ADMINISTRATOR ? (
                          <>
                            {jobs[0]?.salary?.currency === "USD" ? "$" : "₹"}
                            {jobs[0]?.salary?.min !== 0 ? (
                              <>
                                {formatNumberToSalary(jobs[0]?.salary?.min)} -{" "}
                                {jobs[0]?.salary?.max ? (
                                  <>
                                    {jobs[0]?.salary?.currency === "USD"
                                      ? "$"
                                      : "₹"}
                                    {formatNumberToSalary(jobs[0]?.salary?.max)}
                                  </>
                                ) : (
                                  " Not disclosed"
                                )}
                              </>
                            ) : (
                              " Not disclosed"
                            )}
                          </>
                        ) : jobs[0]?.salary?.visible ? (
                          <>
                            {jobs[0]?.salary?.currency === "USD" ? "$" : "₹"}
                            {jobs[0]?.salary?.min !== 0 ? (
                              <>
                                {formatNumberToSalary(jobs[0]?.salary?.min)} -{" "}
                                {jobs[0]?.salary?.max ? (
                                  <>
                                    {jobs[0]?.salary?.currency === "USD"
                                      ? "$"
                                      : "₹"}
                                    {formatNumberToSalary(jobs[0]?.salary?.max)}
                                  </>
                                ) : (
                                  " "
                                )}
                              </>
                            ) : (
                              " Not disclosed"
                            )}
                          </>
                        ) : (
                          "₹ Not disclosed"
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="job-content">
                    <HiOutlineLocationMarker
                      title="Location"
                      className="custom-job-icon"
                      style={{ overflow: "inherit" }}
                    />

                    <span className="ml-1">
                      {jobs[0]?.location && jobs[0]?.location?.length > 0
                        ? jobs[0]?.location.join(" | ")
                        : "Not Available"}
                    </span>
                  </div>
                </div>
              </div>
              {jobs[0]?.walkin?.start_ts &&
                jobs[0]?.walkin?.end_ts &&
                jobs[0]?.walkin?.time && (
                  <>
                    <h6 className="font-weight-600">Time and Venue</h6>
                    <div className="job-content">
                      <HiOutlineClock title="Date and time" />
                      <span className="ml-1">
                        {jobs[0]?.walkin?.start_ts &&
                        jobs[0]?.walkin?.end_ts &&
                        jobs[0]?.walkin?.time
                          ? `${getTimestampToDate(
                              jobs[0]?.walkin?.start_ts
                            )} to ${getTimestampToDate(
                              jobs[0]?.walkin?.end_ts
                            )} - ${getFormatedTime(jobs[0]?.walkin?.time)}`
                          : "Not Available"}
                      </span>
                    </div>
                    <div className="job-content ">
                      <HiOutlineLocationMarker title="Location" />
                      <span className="ml-1 ">
                        {jobs[0]?.walkin?.address
                          ? jobs[0].walkin?.address
                          : "Not Available"}
                      </span>
                    </div>
                    <div className="job-content">
                      <BsPerson
                        title="Contact person"
                        style={{ fontSize: "medium" }}
                      />
                      <span className="ml-1">
                        {jobs[0]?.walkin?.contact?.name
                          ? `${jobs[0]?.walkin?.contact?.name}`
                          : "Not Available"}
                      </span>
                    </div>
                    <div className="job-content" title="Contact Number">
                      <IoCallOutline />
                      <span className="ml-1">
                        {jobs[0]?.walkin?.contact?.phone
                          ? ` ${jobs[0]?.walkin?.contact?.phone}`
                          : "Not Available"}
                      </span>
                    </div>
                  </>
                )}
              {!jobs[0]?.walkin?.start_ts &&
                !jobs[0]?.walkin?.end_ts &&
                !jobs[0]?.walkin?.time &&
                //   !jobs[0]?.walkin?.start_ts &&
                jobs[0]?.walkin?.address && (
                  <>
                    <h6 className="font-weight-600">Venue</h6>

                    <div className="job-content" title="Location">
                      <HiOutlineLocationMarker />
                      <span>{jobs[0]?.walkin?.address ?? "Not Available"}</span>
                    </div>
                  </>
                )}

              <hr />
              <div className="d-flex justify-content-between">
                <div>
                  <div className="job-content">
                    <span>Posted :&nbsp;</span>
                    <span>
                      {getDateDifference(
                        jobs[0]?.created_at ?? "Not available"
                      )}
                    </span>
                  </div>
                  <div className="job-content">
                    <span>Openings : </span>
                    <span className="ml-1">
                      {jobs[0]?.vacancy ? jobs[0]?.vacancy : "Not mentioned"}
                    </span>
                  </div>
                </div>
                <div>
                  {jobs &&
                    !(jobs[0]?.application_status?.self === "APPLY") &&
                    (!RoleGroup.EMP_ADMIN_RECRUITER.includes(
                      userInfo?.roles[0]
                    ) ||
                      userInfo?.roles[0] === undefined) && (
                      <button
                        type="button"
                        className="site-button btn-sm"
                        onClick={() => {
                          saveJob();
                          fetchData();
                          sessionStorage.set(
                            "goBack",
                            `${environment.baseUiUrl}/jobs/joblisting`
                          );
                          // setSaveBtnHide(true)
                        }}
                        hidden={saveBtnHide}
                        disabled={interested}
                        style={{ background: interested ? "gray" : "blue" }}
                      >
                        {" "}
                        I am interested{" "}
                      </button>
                    )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <ApplyJob
        showModal={showModal}
        toggleModal={toggleModal}
        questionsList={jobs[0]?.questions}
      />
    </>
  );
}

export default DesignationInfo;
