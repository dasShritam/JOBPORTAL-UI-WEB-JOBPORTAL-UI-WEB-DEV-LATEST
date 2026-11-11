import React, { lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../../assets/customCss/Pagination.css";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, DropdownButton } from "react-bootstrap";
import "../../../assets/customCss/jobs/manage-jobs.css";
import {
  manageJobsData,
  resetUpdateStatus,
  updateJobStatus,
} from "../../../redux/features/jobs/manage-jobs/ManageJobsSlice";
import Swal from "sweetalert2";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import { EMP_PERMISSIONS } from "../../../routes/roles";
import jwtDecode from "jwt-decode";

const JobCard = lazy(() => import("./JobCard"));
const DraftJobCard = lazy(() => import("./DraftJobCard"));

type initialState = {
  hideFilterHandler?: any;
  filterData?: any;
};
function JobListing({ hideFilterHandler, filterData }: initialState) {
  const [allJobs, setAllJobs] = useState(true);
  const [load, setLoad] = useState(false);
  const [draftJobs, setDraftJobs] = useState(false);
  const dispatch = useDispatch();
  const listingJob = useSelector((state: any) => state.ManageJobs);
  const { allManageJobs } = listingJob;
  const showSnackAlert = UseToastAlert();
  const navigate = useNavigate();
  const updatedStatus = useSelector((state: any) => state.UpdateJobsData);
  const { updatejobsStatus } = updatedStatus;

  const draftDataHandler = () => {
    const JobListOptions = {
      mode: "minimal",
      pageid: 1,
      title: "",
      jobid: "",
      status: ["DRAFT"],
    };
    dispatch(manageJobsData(JobListOptions));
  };
  const allDataHandler = () => {
    const JobListOptions = {
      mode: "minimal",
      pageid: 1,
      title: "",
      jobid: "",
      status: ["PUBLISH", "CLOSE"],
    };
    dispatch(manageJobsData(JobListOptions));
  };

  function handleDeleteSwal() {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this record!",
      showCancelButton: true,
      confirmButtonColor: "#2a9f2a ",
      cancelButtonColor: "#db1919 ",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const jobIds = allManageJobs?.jobs?.map((e: any) => e.jobid);
        const deleteInfo = {
          status: "DELETE",
          jobid: [...jobIds],
          remarks: "",
        };
        dispatch(updateJobStatus(deleteInfo));
        draftDataHandler();
      }
    });
  }
  const handleConfirmSwal = (values: any) => {
    Swal.fire({
      title: `<h4 style="color:red;">Permission Denied</h4>`,
      text: `Oops..! looks like you do not have permission to access this feature (${values}), please contact your Administrator.`,
      showCancelButton: false,
      confirmButtonColor: "red",
      confirmButtonText: "OK",
    }).then((result) => { });
  };
  const decodedToken: any = sessionStorage.getItem("access_token")
    ? jwtDecode(sessionStorage.getItem("access_token")!)
    : "";

  useEffect(() => {
    setTimeout(() => {
      setLoad(true);
    }, 1000);
  }, []);

  return (
    <>
      <div className="job-bx-title clearfix">
        <div className="col-xl-4 col-lg-4 col-md-4 pull-left ">
          <button
            type="button"
            className={allJobs ? "btn btn-primary" : "btn btn-outline-primary"}
            onClick={() => {
              setAllJobs(true);
              setDraftJobs(false);
              hideFilterHandler(true);
              allDataHandler();
            }}
          >
            All Jobs
          </button>{" "}
          &nbsp;
          <button
            type="button"
            className={
              draftJobs ? "btn btn-primary" : "btn btn-outline-primary"
            }
            onClick={(e: any) => {
              setDraftJobs(true);
              setAllJobs(false);
              hideFilterHandler(false);
              draftDataHandler();
            }}
          >
            Draft Jobs
          </button>
        </div>
        <div>
          <DropdownButton
            className="float-right"
            id="dropdown-basic-button"
            title="Post a Job"
          >
            <Dropdown.Item
              href=""
              onClick={() => {
                decodedToken?.permission?.includes(EMP_PERMISSIONS?.MEJ) &&
                  navigate("/postjob/privatejob");
                !decodedToken?.permission?.includes(EMP_PERMISSIONS?.MEJ) &&
                  handleConfirmSwal("post private jobs");
              }}
            >
              Private Job
            </Dropdown.Item>
            <Dropdown.Item
              href=""
              onClick={() => {
                decodedToken?.permission?.includes(EMP_PERMISSIONS?.MEJ) &&
                  navigate("/postjob/hotjob");
                !decodedToken?.permission?.includes(EMP_PERMISSIONS?.MEJ) &&
                  handleConfirmSwal("post hot jobs");
              }}
            >
              Hot Job
            </Dropdown.Item>
            <Dropdown.Item
              href=""
              onClick={() => {
                decodedToken?.permission?.includes(EMP_PERMISSIONS?.MIJ) &&
                  navigate("/postjob/internaljob");
                !decodedToken?.permission?.includes(EMP_PERMISSIONS?.MIJ) &&
                  handleConfirmSwal("post internal jobs");
              }}
            >
              Internal Job
            </Dropdown.Item>
            <Dropdown.Item
              href=""
              onClick={() => {
                decodedToken?.permission?.includes(EMP_PERMISSIONS?.MIJ) &&
                  navigate("/postjob/referaljob");
                !decodedToken?.permission?.includes(EMP_PERMISSIONS?.MIJ) &&
                  handleConfirmSwal("post referral jobs");
              }}
            >
              Referral Job
            </Dropdown.Item>
          </DropdownButton>
        </div>
        <div className="float-right">
          <div className="float-right p-tb5 p-r10">
            {load && allManageJobs?.jobs?.length > 0 && draftJobs && (
              <h6>
                <Link to={"#"} onClick={handleDeleteSwal}>
                  {" "}
                  Delete All
                </Link>
              </h6>
            )}
          </div>
        </div>
      </div>
      <div>
        {allJobs && <JobCard filterData={filterData} />}
        {draftJobs && <DraftJobCard />}
      </div>
    </>
  );
}

export default JobListing;
