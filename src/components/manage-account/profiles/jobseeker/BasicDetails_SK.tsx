import { Skeleton } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

function BasicDetails_SK() {
  var bnr = require("../../../../assets/images/banner/bnr1.jpg");
  return (
    <div
      className="overlay-black-dark profile-edit p-t50 p-b20"
      style={{
        backgroundImage: "url(" + bnr + ")",
      }}
    >
      <div className="container" style={{ marginTop: "55px" }}>
        <div className="row">
          {
            <div className="col-lg-8 col-md-7 candidate-info">
              <div className="candidate-detail">
                <div className="col-lg-8 ">
                  <Link to={"#"}>
                    <Skeleton variant="circular" width={100} height={100} />
                  </Link>
                  <div
                    className="upload-link"
                    data-toggle="tooltip"
                    data-placement="right"
                  >
                    <Skeleton height={30} width="60%" />
                  </div>
                </div>
                <div className=" text-white browse-job text-left">
                  <h4 className="m-b0">
                    <Link to={"#"} className="m-l15 font-16 text-white">
                      <Skeleton height={30} width="60%" />
                    </Link>
                  </h4>

                  <p className="m-b15">
                    <Skeleton height={30} width="60%" />
                  </p>
                  <ul className="clearfix">
                    <li className="modal-title">
                      <Skeleton height={30} width="60%" />
                    </li>
                    <li>
                      <span>
                        <Skeleton height={30} width="60%" />
                      </span>

                      <span>
                        <Skeleton height={30} width="60%" />
                      </span>
                    </li>
                    <li>
                      <Skeleton height={30} width="60%" />
                    </li>
                    <li>
                      <span>
                        <Skeleton height={30} width="60%" />
                      </span>
                    </li>
                  </ul>
                  <div>
                    <div className="col-lg-6">
                      <span>
                        <Skeleton height={30} width="60%" />
                      </span>
                    </div>

                    <div className="col-lg-4">
                      <Skeleton height={30} width="100%" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }

          <div className="col-lg-4 col-md-5">
            <Link
              to={""}
              style={{
                textDecorationLine: "none",
              }}
            >
              <div className="pending-info text-white p-a25">
                <h5>Pending Action(s)</h5>
                <ul className="list-check secondry">
                  <a>
                    <li key={Math.random()}>
                      <Skeleton variant="text" height={30} width="60%" />
                    </li>
                    <li key={Math.random()}>
                      <Skeleton variant="text" height={30} width="75%" />
                    </li>
                    <li key={Math.random()}>
                      <Skeleton variant="text" height={30} width="68%" />
                    </li>
                  </a>
                </ul>
                <div
                  style={{
                    float: "right",
                    marginTop: "-6px",
                    fontSize: "14px",
                  }}
                >
                  <Skeleton height={30} width="60%" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BasicDetails_SK;
