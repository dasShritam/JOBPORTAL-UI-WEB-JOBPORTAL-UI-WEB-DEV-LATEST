import CheckIcon from "@mui/icons-material/Check";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import { Button, Skeleton, Typography } from "@mui/material";
import Pagination from "rc-pagination";

function ApplicantCardSkeleton() {
  return (
    <>
      <div>
        <div className="row">
          <div className="col-xl-12 col-lg-12 col-md-12">
            <div className="m-b30">
              <div
                className=" form-control d-flex justify-content-between"
                style={{ height: "50px" }}
              >
                <div
                  className=" d-flex justify-content-between"
                  style={{ alignItems: "center" }}
                >
                  <div className="form-group" style={{ marginBottom: "0%" }}>
                    <div
                      className="custom-control custom-checkbox d-flex"
                      style={{ width: "150px" }}
                    >
                      <Skeleton animation="wave" height={10} width="10%" />
                      <label className="custom-control-label" htmlFor="check">
                        Select All
                      </label>
                    </div>
                  </div>
                  <Button
                    sx={{ color: "grey", height: 42, textTransform: "none" }}
                    variant="text"
                  >
                    <CheckIcon fontSize="small" />
                    &nbsp; Shortlist
                  </Button>
                  <Button
                    sx={{ color: "grey", height: 42, textTransform: "none" }}
                    variant="text"
                  >
                    <DoNotDisturbAltIcon fontSize="small" />
                    &nbsp; Reject
                  </Button>
                </div>
              </div>
            </div>

            <div className="post-job-bx d-flex">
              <div className={"col-xl-6 col-lg-6 col-md-6 col-sm-12 mt-1 mb-1"}>
                <>
                  <div
                    className="myCard3 border"
                    style={{ fontFamily: "poppins" }}
                  >
                    <div className="">
                      <div className={"row"}>
                        <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12">
                          <div className="job-name d-flex">
                            <div className="com_logo d-flex justify-content-around ">
                              <Typography variant="body1">
                                <Skeleton
                                  animation="wave"
                                  variant="rectangular"
                                  style={{
                                    borderRadius: "100%",
                                    width: "70px",
                                    height: "70px",
                                  }}
                                />
                              </Typography>
                            </div>
                            <ul
                              className="job-post-info ml-2"
                              style={{ listStyleType: "none" }}
                            >
                              <li
                                className="job-name"
                                style={{
                                  fontWeight: "600",
                                  color: "#333",
                                  fontSize: "14px",
                                }}
                              >
                                <Typography variant="body1">
                                  <Skeleton style={{ width: "200px" }} />
                                </Typography>
                              </li>
                              <li className="job-requirements">
                                <Typography variant="body1">
                                  <Skeleton style={{ width: "200px" }} />
                                </Typography>
                              </li>
                              <li className="job-requirements">
                                <Typography variant="body1">
                                  <Skeleton style={{ width: "200px" }} />
                                </Typography>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
                          <Typography variant="body1">
                            <Skeleton
                              animation="wave"
                              variant="rectangular"
                              style={{ width: "80px" }}
                            />
                          </Typography>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="d-flex ">
                        <div>
                          <Typography variant="body1">
                            <Skeleton style={{ width: "200px" }} />
                          </Typography>
                        </div>
                      </div>
                      <div>
                        <Typography variant="body1">
                          <Skeleton style={{ width: "200px" }} />
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="body1">
                          <Skeleton style={{ width: "200px" }} />
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="body1">
                          <Skeleton style={{ width: "200px" }} />
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="body1">
                          <Skeleton style={{ width: "200px" }} />
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="body1">
                          <Skeleton style={{ width: "200px" }} />
                        </Typography>
                      </div>
                    </div>
                  </div>
                </>
              </div>
              <div className={"col-xl-6 col-lg-6 col-md-6 col-sm-12 mt-1 mb-1"}>
                <>
                  <div
                    className="myCard3 border"
                    style={{ fontFamily: "poppins" }}
                  >
                    <div className="">
                      <div className={"row"}>
                        <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12">
                          <div className="job-name d-flex">
                            <div className="com_logo d-flex justify-content-around ">
                              <Typography variant="body1">
                                <Skeleton
                                  animation="wave"
                                  variant="rectangular"
                                  style={{
                                    borderRadius: "100%",
                                    width: "70px",
                                    height: "70px",
                                  }}
                                />
                              </Typography>
                            </div>
                            <ul
                              className="job-post-info ml-2"
                              style={{ listStyleType: "none" }}
                            >
                              <li
                                className="job-name"
                                style={{
                                  fontWeight: "600",
                                  color: "#333",
                                  fontSize: "14px",
                                }}
                              >
                                <Typography variant="body1">
                                  <Skeleton style={{ width: "200px" }} />
                                </Typography>
                              </li>
                              <li className="job-requirements">
                                <Typography variant="body1">
                                  <Skeleton style={{ width: "200px" }} />
                                </Typography>
                              </li>
                              <li className="job-requirements">
                                <Typography variant="body1">
                                  <Skeleton style={{ width: "200px" }} />
                                </Typography>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
                          <Typography variant="body1">
                            <Skeleton
                              animation="wave"
                              variant="rectangular"
                              style={{ width: "80px" }}
                            />
                          </Typography>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="d-flex ">
                        <div>
                          <Typography variant="body1">
                            <Skeleton style={{ width: "200px" }} />
                          </Typography>
                        </div>
                      </div>
                      <div>
                        <Typography variant="body1">
                          <Skeleton style={{ width: "200px" }} />
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="body1">
                          <Skeleton style={{ width: "200px" }} />
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="body1">
                          <Skeleton style={{ width: "200px" }} />
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="body1">
                          <Skeleton style={{ width: "200px" }} />
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="body1">
                          <Skeleton style={{ width: "200px" }} />
                        </Typography>
                      </div>
                    </div>
                  </div>
                </>
              </div>
            </div>
            <div className="float-right">
              <center className="d-flex">
                <span className="m-t30" style={{ fontSize: "12px" }}></span>
                <Pagination className="pagination-data mt-4" />
              </center>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ApplicantCardSkeleton;
