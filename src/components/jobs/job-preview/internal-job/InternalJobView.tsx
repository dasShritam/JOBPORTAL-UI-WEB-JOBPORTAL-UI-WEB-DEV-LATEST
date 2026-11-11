import React, { lazy, useContext, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CompanySkeletonInfo from "../CompanyInfo_Skeleton";
import EmployerInfoSkeleton from "../EmployerInfo_Skeleton";
import JobDescriptionSkeleton from "../JobDescription_Skeleton";
import DesignationInfoSkeleton from "../DesignationInfo_Skeleton";
import JobPreview from "../../job-post/internal_ref_job/JobPreview";
import { GetInternalOrRefJob } from "../../../../redux/features/jobs/internal_ref_job/Internal_Ref_Job";
import education from "../../../employer/js-profile/education";
import { UI_ROUTES } from "../../../../shared/ui-route.shared";

function InternalJobView() {
  const dispatch = useDispatch();
  const InrRefJob = useSelector((state: any) => state.GetInternalJobs);
  const { jobData, jobLoading } = InrRefJob;
  const { id } = useParams();
  const [modal, setModal] = useState<any>(null);

  const [jobs, setJobs] = useState<any>([]);
  // useEffect(() => {

  //   if (jobData?.data?.jobData?.data?.jobs[0].length > 0) {
  //     jobData?.data?.jobData?.data?.jobs[0].map((item) => {
  //
  //       if (id === item.jobid) {
  //         setJobs(item);
  //       }
  //     });
  //   }
  // }, [jobData]);
  // useEffect(() => {
  // }, [jobs]);
  useEffect(() => {
    const apiInput = {
      mode: "all",
      pageId: 1,
      search: "",
      jobid: id,
      pageLimit: 10,
      status: ["PUBLISH", "CLOSE"],
    };
    dispatch(GetInternalOrRefJob(apiInput));
  }, []);

  useEffect(() => {
    if (!jobLoading && jobData?.data?.jobs?.length > 0) {
      const eduData = jobData?.data?.jobs[0]?.education?.map((c) => {
        return { course: c.course, stream: c.stream };
      });

      setModal({
        eduQualification: eduData,
        designation: { label: jobData?.data?.jobs[0].title },
        referenceCode: "",
        currency: jobData?.data?.jobs[0].salary?.currency,
        workExp: [
          jobData?.data?.jobs[0].exp?.min,
          jobData?.data?.jobs[0].exp?.max,
        ],
        isSalaryHidden: jobData?.data?.jobs[0].salary?.visible,
        salary: [
          jobData?.data?.jobs[0].salary?.min,
          jobData?.data?.jobs[0].salary?.max,
        ],

        location: [jobData?.data?.jobs[0].location.join("| ")],
        vacancy: jobData?.data?.jobs[0].vacancy,
        jobDesc: jobData?.data?.jobs[0].job_desc?.value,
        department: {
          label: jobData?.data?.jobs[0].department,
        },
        roleCategory: {
          label: jobData?.data?.jobs[0].role_category,
        },
        role: {
          label: jobData?.data?.jobs[0].role,
        },
        keySkills: [jobData?.data?.jobs[0].skills],
        startDate: jobData?.data?.jobs[0].start_date,
        endDate: jobData?.data?.jobs[0].end_date,
        hiringManager: { label: jobData?.data?.jobs[0].recrutier?.name },
        isFromPreview: true,
        // created_at: jobData?.data?.jobs[0].created_at,
      });
    }
  }, [jobLoading]);

  return (
    <>
      <div className="page-content">
        <div className="content-block">
          <div className="section-full browse-job content-inner-2">
            <div className="container" style={{ marginTop: "2%" }}>
              <div className="job-bx-title backli clearfix">
                <Link
                  to={UI_ROUTES.R059}
                  className="site-button mt-2 right-arrow button-sm float-right"
                >
                  Go Back
                </Link>
              </div>
              <div className="row">
                <div className="col-md-12 col-lg-12 col-sm-12">
                  {modal !== null ? (
                    <JobPreview {...modal} />
                  ) : (
                    <>
                      <DesignationInfoSkeleton />
                      <JobDescriptionSkeleton />
                      <EmployerInfoSkeleton />
                      <CompanySkeletonInfo />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default InternalJobView;
