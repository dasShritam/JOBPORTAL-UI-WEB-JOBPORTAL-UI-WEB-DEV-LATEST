import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoCallOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { BiRupee } from "react-icons/bi";
import { CgWorkAlt } from "react-icons/cg";
import {
  convertTo12HourFormat,
  formatNumberToSalary,
  formatTimestamp,
  getDateDifference,
  getTimestampToDate,
} from "../../../common/common";
import {
  JobApply,
  resetApplyJob,
} from "../../../redux/features/jobs/apply-job/ApplyJob";
import {
  PatchSaveUnSaveJob,
  resetSaveUnsaveCreator,
} from "../../../redux/features/jobs/saved-jobs/SavedJobsSlice";
import ApplyJob from "../../shared/ApplyJob";
import {
  JobPreviewData,
  resetPreviewJob,
} from "../../../redux/features/jobs/job-preview/JobPreviewSlice";
import { findJob } from "../../../redux/features/jobs/job-listing/JobListingSlice";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import jwtDecode from "jwt-decode";
import { GrLocation } from "react-icons/gr";
import { HiOutlineClock, HiOutlineLocationMarker } from "react-icons/hi";
import { AppContext } from "../../../context/AppContext";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { BsPerson } from "react-icons/bs";
import { manageJobsData } from "../../../redux/features/jobs/manage-jobs/ManageJobsSlice";
import { Skeleton } from "@mui/material";

function DesignationInfoSkeleton() {
  return (
    <>
      <div className="job-bx bg-white m-b10">
        <div className="d-flex justify-content-between">
          <div className="d-flex flex-column">
            <Skeleton style={{ width: "200px" }} />

            <div className="job-content">
              <Skeleton style={{ width: "100px" }} height={40} />
            </div>

            <div>
              <Skeleton style={{ width: "100px" }} height={40} />
            </div>
          </div>

          <div style={{ float: "right" }}>
            <Skeleton style={{ width: "100px" }} height={40} />
          </div>

          <div>
            <Skeleton style={{ width: "100px" }} height={40} />
          </div>
        </div>

        <div>
          <div className="c_content_details d-flex flex-column m-b15">
            <div>
              <div className="job-content">
                <Skeleton style={{ width: "100px" }} height={40} />
              </div>

              <hr />
              <div className="d-flex">
                <div className="job-content mr-2" title="Experience">
                  <Skeleton style={{ width: "100px" }} height={40} />
                </div>

                <div className="job-content ml-2" title="Salary">
                  <Skeleton style={{ width: "100px" }} height={40} />
                </div>
              </div>
              <div className="job-content" title="Location">
                <Skeleton style={{ width: "100px" }} height={40} />
              </div>
            </div>
          </div>

          <>
            <div className="job-content">
              <Skeleton style={{ width: "100px" }} height={40} />
            </div>
            <div className="job-content ">
              <Skeleton animation="wave" height={15} width="500px" />
            </div>
            <div className="job-content">
              <Skeleton animation="wave" height={15} width="500px" />
            </div>
            <div className="job-content" title="Contact Number">
              <Skeleton animation="wave" height={15} width="500px" />
            </div>
          </>

          <>
            <div className="job-content" title="Location">
              <Skeleton animation="wave" height={15} width="500px" />
            </div>
          </>

          <hr />
          <div className="d-flex justify-content-between">
            <div>
              <div className="job-content">
                <Skeleton animation="wave" height={15} width="500px" />
              </div>
              <div className="job-content">
                <Skeleton animation="wave" height={15} width="500px" />
              </div>
            </div>
            <div>
              <Skeleton style={{ width: "100px" }} height={40} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DesignationInfoSkeleton;
