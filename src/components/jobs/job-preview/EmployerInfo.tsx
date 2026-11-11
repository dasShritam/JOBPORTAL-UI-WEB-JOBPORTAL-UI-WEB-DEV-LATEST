import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getDateDifference } from "../../../common/common";

function EmployerInfo(data: any) {
  const preview = useSelector((state: any) => state.Jobpreviews);
  const { JobPreviewDetails } = preview;
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
      {jobs?.length > 0 && jobs[0]?.visible && (
        <div>
          <div className="job-bx bg-white m-b15">
            <span className="job-title">Employer Info</span>

            <div className="d-flex flex-column mr-2">
              <span className="job-desc-content ">
                {jobs[0]?.client?.name ? jobs[0]?.client?.name : "Not Available"}
              </span>
              <span className="job-desc-label">
                {jobs[0]?.employer?.company_name ? jobs[0]?.employer?.company_name : "Not Available"}
              </span>
              <span className="job-desc-label">
                {jobs[0]?.client?.address ? jobs[0]?.client?.address : "Not Available"}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default EmployerInfo;
