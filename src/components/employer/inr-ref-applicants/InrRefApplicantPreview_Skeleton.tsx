import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { InrRefApplicantData } from "../../../redux/features/employer/inr-ref-applicants/InrRefApplicantPreviewSlice";
import { useParams } from "react-router";
import {
  convertformatTimestamp,
  formatExperience,
  getTimestampToDate,
} from "../../../common/common";
import { Card } from "react-bootstrap";
import { CardActions, CardContent, CardMedia, Skeleton } from "@mui/material";

function InrRefApplicantPreview_Skeleton() {
  return (
    <div className="container" style={{ marginTop: "60px" }}>
      <div className="row" style={{ alignItems: "center" }}>
        <div className="col-md-2 col-sm-12 col-lg-2"></div>
        <div className="col-12 col-md-8 col-lg-8">
          <div className="job-bx bg-white">
            <div className="header-container">
              <div className="d-flex justify-content-between">
                <Skeleton style={{ width: "100px" }} height={30} />
                <Skeleton style={{ width: "100px" }} height={40} />
              </div>
            </div>

            <br />

            <div className="row">
              <div className="col-md-2 col-sm-12 col-lg-2"></div>
              {/* <div className="d-flex justify-content-between"> */}
              <div className="col-md-6 col-sm-6 col-lg-6 ">
                <div className="job-desc">
                  <Skeleton style={{ width: "100px" }} height={30} />
                </div>

                <div className="job-desc">
                  <Skeleton style={{ width: "100px" }} height={30} />
                </div>

                <div className="job-desc">
                  <Skeleton style={{ width: "100px" }} height={30} />
                </div>
                <div className="job-desc">
                  <Skeleton style={{ width: "100px" }} height={30} />
                </div>
              </div>
              <div className="col-md-6 col-sm-6 col-lg-6 ">
                <div>
                  <div className="job-desc">
                    <Skeleton style={{ width: "100px" }} height={30} />
                  </div>

                  <div className="job-desc">
                    <Skeleton style={{ width: "100px" }} height={30} />
                  </div>

                  <div className="job-desc">
                    <Skeleton style={{ width: "100px" }} height={30} />
                  </div>
                  <div className="job-desc">
                    <Skeleton style={{ width: "100px" }} height={30} />
                  </div>
                </div>
              </div>
              {/* </div> */}
            </div>
            <br />
            <div
              className="col-md-12 col-sm-12 col-lg-12"
              style={{ marginLeft: "-16px" }}
            >
              <div className="job-desc" style={{ display: "block" }}>
                <div>
                  <Skeleton style={{ width: "100px" }} height={30} />
                </div>

                <div>
                  <span className="custom-chip">
                    <Skeleton style={{ width: "100px" }} height={30} />
                  </span>
                </div>
              </div>
              <div className="job-desc" style={{ display: "block" }}>
                <div>
                  <Skeleton style={{ width: "100px" }} height={30} />
                </div>

                <div>
                  <span className="custom-chip">
                    <Skeleton style={{ width: "100px" }} height={30} />
                  </span>
                </div>
              </div>
              <div className="job-desc" style={{ display: "block" }}>
                <div>
                  <Skeleton style={{ width: "100px" }} height={30} />
                </div>

                <div>
                  <span className="custom-chip">
                    <Skeleton style={{ width: "100px" }} height={30} />
                  </span>
                </div>
              </div>
              <div className="job-desc">
                <Skeleton style={{ width: "100px" }} height={30} />
              </div>
              <div className="job-desc">
                <Skeleton style={{ width: "100px" }} height={30} />
              </div>
            </div>
          </div>
        </div>

        {/* <div className="col-md-4 col-sm-12 col-lg-4">
                <Card className="">
                  <CardMedia
                    sx={{ height: 200 }}
                    // image={bnr3}
                    title="green iguana"
                  />
                  <CardContent>
                    <h4 className="">Job Preview</h4>
                  </CardContent>
                  <CardActions></CardActions>
                </Card>
              </div> */}
        <div className="col-md-2 col-sm-12 col-lg-2"></div>
      </div>
    </div>
  );
}

export default InrRefApplicantPreview_Skeleton;
