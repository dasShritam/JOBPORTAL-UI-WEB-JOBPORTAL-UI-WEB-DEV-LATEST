import { Card, CardActions, CardContent, CardMedia } from "@mui/material";
import jwtDecode from "jwt-decode";
import { lazy, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../../../assets/customCss/jobs.css";
import { ROLES } from "../../../config/app.config";
import { AppContext } from "../../../context/AppContext";
import { environment } from "../../../environments/environment";
import {
  findJob,
  resetJobSearchCreator,
} from "../../../redux/features/jobs/job-listing/JobListingSlice";
import {
  JobPreviewData,
  resetPreviewJob,
} from "../../../redux/features/jobs/job-preview/JobPreviewSlice";
import {
  manageJobsData,
  resetManageJobs,
} from "../../../redux/features/jobs/manage-jobs/ManageJobsSlice";
import { RoleGroup } from "../../../routes/roles";
import CompanySkeletonInfo from "./CompanyInfo_Skeleton";
import DesignationInfoSkeleton from "./DesignationInfo_Skeleton";
import EmployerInfoSkeleton from "./EmployerInfo_Skeleton";
import JobDescriptionSkeleton from "./JobDescription_Skeleton";
const DesignationInfo = lazy(() => import("./DesignationInfo"));
const JobDescription = lazy(() => import("./JobDescription"));
const EmployerInfo = lazy(() => import("./EmployerInfo"));
const CompanyInfo = lazy(() => import("./CompanyInfo"));

function JobPreview() {
  const dispatch = useDispatch();

  const preview = useSelector((state: any) => state.Jobpreviews);
  const { JobPreviewDetails, loadingJobPreview } = preview;
  const listingJob = useSelector((state: any) => state.ManageJobs);
  const { allManageJobs, manageJobLoading } = listingJob;
  const findJobData = useSelector((state: any) => state.findJob);
  const { res, loading } = findJobData;
  const [jobs, setJobs] = useState<any>([]);
  const [loadingStates, setLoadingStates] = useState([true]);
  const backURL: any =
    sessionStorage && sessionStorage?.getItem("goBack")
      ? sessionStorage?.getItem("goBack")
      : "";
  useEffect(() => {
    if (loadingJobPreview && res?.data?.jobs.length > 0) {
      setJobs(res?.data?.jobs);
    } else if (JobPreviewDetails?.data?.jobs.length > 0) {
      setJobs(JobPreviewDetails?.data?.jobs);
    } else if (allManageJobs && allManageJobs?.jobs?.length > 0) {
      setJobs(allManageJobs?.jobs);
    }
  }, [loadingJobPreview, res, JobPreviewDetails, allManageJobs]);
  useEffect(() => {
    // return () => {
    dispatch(resetPreviewJob());
    dispatch(resetJobSearchCreator());
    dispatch(resetManageJobs());
    // };
  }, []);
  const { userInfo } = useContext(AppContext);

  useEffect(() => {
    setLoadingStates([loadingJobPreview, manageJobLoading, loading]);
  }, [loadingJobPreview, manageJobLoading, loading]);

  const { id } = useParams();
  const navigate = useNavigate();
  const decodedToken: any = sessionStorage.getItem("access_token")
    ? jwtDecode(sessionStorage.getItem("access_token")!)
    : "";
  const fetchData = () => {
    if (userInfo?.roles[0]) {
      if (userInfo?.roles[0] === ROLES.JOBSEEKER) {
        dispatch(
          JobPreviewData({
            mode: "all",
            pageid: 1,
            jobid: id,
            pageLimit: 10,
          })
        );
      } else if (RoleGroup.EMP_ADMIN_RECRUITER.includes(userInfo?.roles[0])) {
        dispatch(
          manageJobsData({
            mode: "all",
            pageid: 1,
            jobid: id,
          })
        );
      }
    } else if (!sessionStorage.getItem("access_token")) {
      dispatch(
        findJob({
          mode: "all",
          pageid: 1,
          jobid: id,
        })
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, [userInfo?.roles[0], id]);

  var bnr3 = require("../../../assets/images/job_preview.png");

  return (
    <>
      <div className="page-content">
        <div className="content-block">
          <div className="section-full browse-job content-inner-2">
            <div className="container" style={{ marginTop: "2%" }}>
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                <div className="job-bx-title backli clearfix">
                  <Link
                    to={
                      backURL === `${environment?.baseUiUrl}/jobSeekerSignin`
                        ? "/jobs/joblisting"
                        : backURL
                    }
                    onClick={(e) => {
                      sessionStorage.removeItem("goBack");
                    }}
                    className="site-button mt-2 right-arrow button-sm float-right"
                  >
                    Go Back
                  </Link>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 col-sm-12 col-lg-4">
                  <Card className="">
                    <CardMedia
                      sx={{ height: 200 }}
                      image={bnr3}
                      title="green iguana"
                    />
                    <CardContent>
                      <h4 className="">Share</h4>
                      <p style={{ fontStyle: "italic" }}>
                        Please post this job on Facebook, Twitter to share with
                        interested candidate.
                      </p>
                    </CardContent>
                    <CardActions>
                      <ul className="list-inline m-a0">
                        <li className="social-icons">
                          <div
                            className="site-button facebook circle m-r10 "
                            title="Register in with facebook."
                          >
                            <Link
                              to={`https://www.facebook.com/sharer/sharer.php?u=${environment?.baseUiUrl}/jobs/public/previewjob/${id}`}
                              target="_blankShare"
                            >
                              <i
                                className="fa fa-facebook fa-lg"
                                style={{ color: "white" }}
                              ></i>
                            </Link>
                          </div>
                        </li>
                        <li>
                          {/* <div
                            className="site-button linkedin circle m-r10"
                            title="Register in with Linked In."
                          >
                            <a
                              href={`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`}
                              target="_blank"
                              style={{ color: "white" }}
                            >
                              {" "}
                              <i
                                className="fa fa-linkedin fa-lg"
                                style={{ color: "white" }}
                              ></i>
                            </a>
                          </div> */}
                        </li>
                        <li>
                          <div
                            className="site-button twitter circle m-r10 "
                            title="Register in with twitter."
                          >
                            <Link
                              to={`https://twitter.com/intent/tweet?url=${environment?.baseUiUrl}/jobs/public/previewjob/${id}`}
                              target="_blank"
                              style={{ color: "white" }}
                            >
                              <i className="fa fa-twitter fa-lg"></i>
                            </Link>
                          </div>
                        </li>
                      </ul>
                    </CardActions>
                  </Card>
                </div>
                <div className="col-md-8 col-lg-8 col-sm-12">
                  {loadingStates.includes(false) && jobs.length > 0 ? (
                    <>
                      <DesignationInfo />
                      <JobDescription />
                      <EmployerInfo />
                      <CompanyInfo />
                    </>
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

export default JobPreview;
