import Skeleton from "@mui/material/Skeleton";
import React from "react";

const AssessmentViewSkeleton = () => {
  return (
    <>
      <React.Fragment key={"right"}>
        <div className="page-content">
          <div className="content-block">
            <div className="section-full browse-job content-inner-2">
              <div className="container">
                <div className="row">
                  <div
                    className="col-lg-10 col-md-10 "
                    style={{ marginLeft: "7%" }}
                  >
                    <>
                      <div className="job-bx-title backli clearfix">
                        <div style={{ marginLeft: "80%" }}>
                          <Skeleton animation="wave" height={40} width="30%" />
                        </div>
                      </div>
                      <div
                        className="job-bx bg-white m-b30   assessment_box"
                        id="headingjas"
                        style={{
                          borderRadius: "10px",
                        }}
                      >
                        <div>
                          <div className="d-flex justify-content-between">
                            <Skeleton
                              animation="wave"
                              height={40}
                              width="30%"
                            />
                            <Skeleton
                              animation="wave"
                              height={40}
                              width="10%"
                            />
                          </div>
                          <div>
                            <Skeleton
                              animation="wave"
                              height={80}
                              width="100%"
                            />
                          </div>
                        </div>
                        <footer>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div></div>
                            <div>
                              <Skeleton
                                animation="wave"
                                height={40}
                                width="30%"
                              />
                            </div>
                          </div>
                        </footer>
                        <footer className="border-top pt-3">
                          <div>
                            <div className="row d-flex justify-content-between">
                              <ul className="col-lg-6 md-6 sm-6">
                                <li className="listyle">
                                  <Skeleton
                                    animation="wave"
                                    height={40}
                                    width="30%"
                                  />
                                </li>

                                <li className="listyle">
                                  <Skeleton
                                    animation="wave"
                                    height={40}
                                    width="30%"
                                  />
                                </li>

                                <li className="listyle">
                                  <Skeleton
                                    animation="wave"
                                    height={40}
                                    width="30%"
                                  />
                                </li>
                              </ul>
                              <ul className="col-lg-6 md-6 sm-6">
                                <li className="listyle">
                                  <Skeleton
                                    animation="wave"
                                    height={40}
                                    width="30%"
                                  />
                                </li>

                                <li className="listyle">
                                  <Skeleton
                                    animation="wave"
                                    height={40}
                                    width="30%"
                                  />
                                </li>

                                <li className="listyle">
                                  <Skeleton
                                    animation="wave"
                                    height={40}
                                    width="30%"
                                  />
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div className="testdesc">
                            <Skeleton
                              animation="wave"
                              height={40}
                              width="30%"
                            />
                          </div>
                          <div className="assesDesc">
                            <Skeleton
                              animation="wave"
                              height={40}
                              width="30%"
                            />
                            <div>
                              <ul>
                                <li className="listyle">
                                  <Skeleton
                                    animation="wave"
                                    height={40}
                                    width="30%"
                                  />
                                </li>
                                <li className="scoret">
                                  <ul className="ml-4">
                                    <Skeleton
                                      animation="wave"
                                      height={40}
                                      width="30%"
                                    />
                                  </ul>
                                </li>
                              </ul>
                            </div>

                            <div>
                              <Skeleton
                                animation="wave"
                                height={40}
                                width="30%"
                              />
                            </div>
                          </div>
                        </footer>
                      </div>
                    </>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    </>
  );
};

export default AssessmentViewSkeleton;
