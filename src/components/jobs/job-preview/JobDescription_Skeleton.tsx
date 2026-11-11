import { Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function JobDescriptionSkeleton() {
  return (
    <div className="job-bx bg-white m-b15">
      <Skeleton style={{ width: "200px" }} />

      <>
        <div className="m-b15">
          <div className="jobDessContent">
            <Skeleton style={{ width: "100px" }} height={40} />
          </div>
          <div className="job-desc">
            <Skeleton style={{ width: "100px" }} height={40} />
          </div>
          <div className="job-desc">
            <Skeleton style={{ width: "100px" }} height={40} />
          </div>
          <div className="job-desc">
            <Skeleton style={{ width: "100px" }} height={40} />
          </div>
          <div className="job-desc">
            <Skeleton style={{ width: "100px" }} height={40} />
          </div>
          <div className="job-desc">
            <Skeleton style={{ width: "100px" }} height={40} />
          </div>
        </div>
        <div className="m-b15">
          <div>
            <div>
              <Skeleton style={{ width: "100px" }} height={40} />
            </div>
          </div>
        </div>
        <div className="m-b15">
          <div className="job-desc">
            <Skeleton style={{ width: "100px" }} height={40} />
          </div>
        </div>
      </>
    </div>
  );
}

export default JobDescriptionSkeleton;
