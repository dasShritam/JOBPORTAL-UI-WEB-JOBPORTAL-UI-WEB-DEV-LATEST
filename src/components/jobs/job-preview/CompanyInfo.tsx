import jwtDecode from "jwt-decode";
import React, { useContext, useEffect, useState } from "react";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ROLES } from "../../../config/app.config";
import { AppContext } from "../../../context/AppContext";
import { environment } from "../../../environments/environment";
import { JobApply } from "../../../redux/features/jobs/apply-job/ApplyJob";
import ApplyJob from "../../shared/ApplyJob";

function CompanyInfo(data: any) {
  const [registerToApply, setRegisterToApply] = useState<any>();
  const [loginToApply, setLoginToApply] = useState<any>();
  const [checkLogin, setCheckLogin] = useState<boolean>();
  const [checkEmpLogin, setCheckEmpLogin] = useState<boolean>();
  const apply = useSelector((state: any) => state.JobApply);
  const { applyJob, loadjobs } = apply;
  const findJobData = useSelector((state: any) => state.findJob);
  const { res } = findJobData;

  const preview = useSelector((state: any) => state.Jobpreviews);
  const { JobPreviewDetails, loadingJobPreview } = preview;
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any>([]);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [isDisable, setIsDisable] = useState("");
  const listingJob = useSelector((state: any) => state.ManageJobs);
  const { allManageJobs } = listingJob;
  const { job_Id } = useParams();
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

  useEffect(() => {
    if (jobs[0]?.application_status?.self === "APPLY") {
      setIsDisable("gray");
    } else {
      setIsDisable("blue");
    }
  }, [jobs]);

  useEffect(() => {
    if (res?.data?.jobs.length > 0) {
      setJobs(res?.data?.jobs);
    } else if (!loadingJobPreview && JobPreviewDetails?.data?.jobs.length > 0) {
      setJobs(JobPreviewDetails?.data?.jobs);
    } else if (allManageJobs && allManageJobs?.jobs?.length > 0) {
      setJobs(allManageJobs?.jobs);
    }
  }, [loadingJobPreview, res, JobPreviewDetails, jobs, allManageJobs]);

  useEffect(() => {
    if (sessionStorage.getItem("access_token")) {
      setCheckLogin(true);
    } else {
      setCheckLogin(false);
    }
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("access_token")) {
      setCheckEmpLogin(true);
    } else {
      setCheckEmpLogin(false);
    }
  }, []);

  const decodedToken: any = sessionStorage.getItem("access_token")
    ? jwtDecode(sessionStorage.getItem("access_token")!)
    : "";
  const { userInfo, setUserInfo } = useContext(AppContext);

  useEffect(() => {
    if (decodedToken) {
      setUserInfo(decodedToken);
    }
  }, []);

  return (
    <>
      {checkEmpLogin &&
        userInfo?.roles[0] === ROLES.EMPLOYER_ADMINISTRATOR &&
        jobs[0]?.questions?.length !== 0 && (
          <div className="job-bx bg-white m-b15">
            <span className="job-title">Questions</span>
            <div className="job-desc">
              <span className="job-desc-content">
                {jobs[0]?.questions?.map((q, index) => (
                  <React.Fragment key={q?._id}>
                    <span>
                      {index + 1}. {q?.name}
                      {q?.required && <span style={{ color: "red" }}> * </span>}
                    </span>
                    <br />
                    {q.type === "SINGLE_LINE" ? (
                      <React.Fragment>
                        <input type="text" disabled />
                        <br />
                        <br />
                      </React.Fragment>
                    ) : q.type === "SINGLE_CHOICE" ? (
                      <React.Fragment>
                        {q?.options?.map((o) => (
                          <div
                            className="custom-control custom-radio"
                            key={o?._id}
                          >
                            <input
                              type="radio"
                              id={`radio_${o?._id}`}
                              name={`radio_${q?._id}`}
                              disabled
                              className="custom-control-input"
                            />
                            <label
                              htmlFor={`radio_${o?._id}`}
                              className="custom-control-label"
                            >
                              <span>{o?.val}</span>
                            </label>
                          </div>
                        ))}
                        <br />
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        {q?.options?.map((o) => (
                          <div
                            className="custom-control custom-checkbox"
                            key={o?._id}
                          >
                            <input
                              type="checkbox"
                              id={`checkbox_${o?._id}`}
                              name={o?.val}
                              disabled
                              className="custom-control-input"
                            />
                            <label
                              htmlFor={`checkbox_${o?._id}`}
                              className="custom-control-label"
                            >
                              <span>{o?.val}</span>
                            </label>
                          </div>
                        ))}
                        <br />
                      </React.Fragment>
                    )}
                  </React.Fragment>
                ))}
              </span>
            </div>
          </div>
        )}
      {jobs?.length > 0 && (
        <div className="job-bx bg-white">
          <span className="job-title">About company</span>

          {jobs?.length && (
            <div className="d-flex justify-content-between">
              <div className="d-flex flex-column mr-2">
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

                <div className="job-content" title="Location">
                  <HiOutlineLocationMarker />
                  <br />
                  <span className="ml-1 job-desc-label">
                    {jobs[0]?.employer?.address
                      ? jobs[0]?.employer?.address
                      : "Not Available"}
                  </span>
                </div>
              </div>
              <div>
                {checkLogin && userInfo?.roles[0] === ROLES.JOBSEEKER && (
                  <button
                    className="site-button btn-sm"
                    onClick={handleApplyJob}
                    disabled={jobs[0]?.application_status?.self === "APPLY"}
                    style={{ background: `${isDisable}` }}
                  >
                    {jobs.length > 0 &&
                    jobs[0]?.application_status?.self === "APPLY"
                      ? "Applied"
                      : "Apply"}
                  </button>
                )}
                {!checkLogin && (
                  <div style={{ float: "right" }}>
                    {" "}
                    <button
                      type="button"
                      className={
                        loginToApply
                          ? "btn btn-primary btn-sm"
                          : "btn btn-outline-primary btn-sm"
                      }
                      onClick={() => {
                        navigate("/jobSeekerSignin");
                        job_Id && sessionStorage.setItem("jobid", job_Id);
                        setRegisterToApply(false);
                        setLoginToApply(true);
                        sessionStorage.setItem(
                          "goBack",
                          `${environment.baseUiUrl}/jobs/joblisting`
                        );
                      }}
                    >
                      {" "}
                      Login to Apply{" "}
                    </button>{" "}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      <ApplyJob showModal={showModal} toggleModal={toggleModal} />
    </>
  );
}

export default CompanyInfo;
