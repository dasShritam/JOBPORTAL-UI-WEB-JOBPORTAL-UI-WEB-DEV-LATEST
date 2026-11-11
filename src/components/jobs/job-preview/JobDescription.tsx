import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function JobDescription(data: any) {
  const preview = useSelector((state: any) => state.Jobpreviews);
  const { JobPreviewDetails, loadingJobPreview } = preview;
  const findJobData = useSelector((state: any) => state.findJob);
  const { res } = findJobData;

  const [jobs, setJobs] = useState<any>([]);
  const listingJob = useSelector((state: any) => state.ManageJobs);
  const { allManageJobs } = listingJob;

  useEffect(() => {
    if (res?.data?.jobs.length > 0) {
      setJobs(res?.data?.jobs);
    } else if (JobPreviewDetails?.data?.jobs.length > 0) {
      setJobs(JobPreviewDetails?.data?.jobs);
    } else if (allManageJobs && allManageJobs?.jobs?.length > 0) {
      setJobs(allManageJobs?.jobs);
    }
  }, [res, JobPreviewDetails, jobs, allManageJobs]);

  return (
    <>
      {jobs?.length > 0 && (
        <div className="job-bx bg-white m-b15">
          <span className="job-title m-b15">Job description</span>

          <>
            <div className="m-b15">
              {/* <span className="job-subtitle">Roles and Responsibilities</span> */}
              <div
                className="jobDessContent"
                style={{ wordWrap: "break-word" }}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html:
                      jobs[0]?.job_desc.replace(/<br\s*\/?>/gm, "") ||
                      "Not Available",
                  }}
                  className="job-desc-content"
                ></span>
              </div>
              <div className="job-desc">
                <span className="job-desc-label">Role :&nbsp;</span>
                <span className="job-desc-content">
                  {jobs[0]?.role ? jobs[0]?.role : "Not Available"}
                </span>
              </div>
              {/* <div className="job-desc">
                <div>
                  <span className="job-desc-label">Industry Type :&nbsp;</span>
                </div>
                <div>
                  <span className="job-desc-content">
                    {jobs[0]?.industry
                      ? jobs[0]?.industry.join(", ")
                      : "Not Available"}
                  </span>
                </div>
              </div> */}
              <div
                className="job-desc"
                // style={{ alignItems: "baseline", flexDirection: "column" }}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  flexDirection: "row",
                }}
              >
                <span
                  className="job-desc-label"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Industry Type :&nbsp;
                </span>
                <span
                  className="job-desc-content"
                  style={{ whiteSpace: "normal" }}
                >
                  {jobs[0]?.industry
                    ? jobs[0]?.industry.join(", ")
                    : "Not Available"}
                </span>
              </div>
              <div className="job-desc">
                <span className="job-desc-label">Department :&nbsp;</span>
                <span className="job-desc-content">
                  {jobs[0]?.department ? jobs[0]?.department : "Not Available"}
                </span>
              </div>
              <div className="job-desc">
                <span className="job-desc-label">Employment Type :&nbsp;</span>
                <span className="job-desc-content">
                  {jobs[0]?.emp_type ? jobs[0]?.emp_type : "Not Available"}
                </span>
              </div>
              <div className="job-desc">
                <span className="job-desc-label">Work mode :&nbsp;</span>
                <span className="job-desc-content">
                  {jobs[0]?.work_mode?.policy && jobs[0]?.work_mode?.value
                    ? `${jobs[0]?.work_mode?.policy} ( ${jobs[0]?.work_mode?.value} )`
                    : "Not Available"}
                </span>
              </div>
            </div>
            <div className="m-b15">
              <span className="job-subtitle">Education</span>
              <div>
                {jobs.length > 0 &&
                  jobs[0]?.education?.map((c) => (
                    <div>
                      <span className="job-desc-label">{c?.course} </span>
                      <span className="job-desc-content">
                        {c?.stream?.join(",")}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
            <div className="m-b15">
              <span className="job-subtitle">Key Skills</span>
              <div className="job-desc">
                <span className="job-desc-content">
                  {jobs[0]?.skills.map((c) => (
                    <span className="custom-chip">{c}</span>
                  ))}
                </span>
              </div>
            </div>
          </>
        </div>
      )}
    </>
  );
}

export default JobDescription;
