import { Chip, Link, Skeleton } from "@mui/material";
import React from "react";
import { BsBuildingsFill, BsCheckCircleFill } from "react-icons/bs";
import { IoMdContact } from "react-icons/io";

function AppliedJobSkeleton() {
  return (
    <>
      <div className="row">
        <div className="col-lg-5 col-md-5 col-sm-5">
          <div className="d-flex ml-5">
            <Skeleton animation="wave" height={30} width="30%" />
            <Skeleton animation="wave" height={30} width="30%" />
          </div>
          <div
            className=" mt-5 ml-5"
            id="carddiv"
            style={{ overflowY: "scroll", height: "450px" }}
          >
            <div className="job-bx">
              <Skeleton animation="wave" height={30} width="40%" />
              <Skeleton animation="wave" height={30} width="40%" />
              <div className="d-flex justify-content-between">
                <Skeleton animation="wave" height={20} width="30%" />
                <Skeleton animation="wave" height={20} width="30%" />
              </div>
            </div>
            <br />
            <div className="job-bx">
              <Skeleton animation="wave" height={30} width="40%" />
              <Skeleton animation="wave" height={30} width="40%" />
              <div className="d-flex justify-content-between">
                <Skeleton animation="wave" height={20} width="30%" />
                <Skeleton animation="wave" height={20} width="30%" />
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-7 col-md-7 col-sm-7">
          <div
            className="job-box"
            id="Application-status"
            style={{ overflowY: "scroll", height: "450px" }}
          >
            <div className="d-flex ml-2">
              <i className="fa-3x mt-2">
                <Skeleton
                  animation="wave"
                  variant="circular"
                  style={{
                    borderRadius: "100%",
                    width: "70px",
                    height: "70px",
                  }}
                />
              </i>
              <Skeleton
                style={{ marginTop: "2%", marginLeft: "2%" }}
                animation="wave"
                height={30}
                width="30%"
              />
              <Skeleton
                style={{ marginTop: "5%", marginLeft: "-210px" }}
                animation="wave"
                height={30}
                width="30%"
              />
            </div>
            <div className="d-flex">
              <i className="fa-3x mt-2 ml-2">
                <Skeleton
                  animation="wave"
                  variant="circular"
                  style={{
                    borderRadius: "100%",
                    width: "70px",
                    height: "70px",
                  }}
                />
              </i>
              <Skeleton
                style={{ marginTop: "2%", marginLeft: "2%" }}
                animation="wave"
                height={30}
                width="30%"
              />
              <Skeleton
                style={{ marginTop: "5%", marginLeft: "-210px" }}
                animation="wave"
                height={30}
                width="30%"
              />
            </div>
            <hr />
            <div>
              <div>
                <div>
                  <Skeleton animation="wave" height={30} width="30%" />
                </div>
                <center>
                  <Skeleton animation="wave" height={30} width="60%" />
                </center>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AppliedJobSkeleton;
