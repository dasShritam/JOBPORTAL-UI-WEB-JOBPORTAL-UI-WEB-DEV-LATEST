import React, { useContext, useEffect, useState } from "react";
import Header from "../../authentication/auth-layout/Header";
import { Link, useNavigate } from "react-router-dom";
import { number, string } from "yup";
import { useDispatch, useSelector } from "react-redux";
import { JobApply } from "../../../redux/features/jobs/apply-job/ApplyJob";
import ApplyJob from "../../shared/ApplyJob";
import { AppContext } from "../../../context/AppContext";
import jwtDecode from "jwt-decode";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { Skeleton } from "@mui/material";

function CompanySkeletonInfo() {
  return (
    <>
      <div className="job-bx bg-white m-b15">
        <Skeleton style={{ width: "200px" }} />
        <div className="job-desc">
          <span className="job-desc-content">
            <Skeleton animation="wave" height={15} width="300px" />
            <Skeleton animation="wave" height={15} width="300px" />
          </span>
        </div>
      </div>

      <div className="job-bx bg-white">
        <Skeleton style={{ width: "200px" }} />

        <div className="d-flex justify-content-between">
          <div className="d-flex flex-column mr-2">
            <div>
              <Skeleton animation="wave" height={15} width="300px" />
              <Skeleton animation="wave" height={15} width="500px" />
            </div>

            <span className="job-desc-label"></span>
          </div>
          <div>
            <Skeleton style={{ width: "100px" }} height={40} />

            <div style={{ float: "right" }}> </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CompanySkeletonInfo;
