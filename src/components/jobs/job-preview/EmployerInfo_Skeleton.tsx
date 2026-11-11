import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getDateDifference } from "../../../common/common";
import { Skeleton } from "@mui/material";

function EmployerInfoSkeleton() {
  return (
    <>
      <div>
        <div className="job-bx bg-white m-b15">
          <div className="d-flex flex-column mr-2">
            <Skeleton style={{ width: "200px" }} />

            <Skeleton style={{ width: "100px" }} height={40} />

            <Skeleton style={{ width: "100px" }} height={40} />
          </div>
        </div>
      </div>
    </>
  );
}
export default EmployerInfoSkeleton;
