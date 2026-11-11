import React from "react";
import { Accordion } from "react-bootstrap";
import { GrSearch } from "react-icons/gr";
import { Chip, Skeleton } from "@mui/material";

const AdminRegistration_Skeleton = () => {
  return (
    <div className="page-content bg-white">
      <div className="content-block">
        <div className="browse-job section-full bg-white p-t50 p-b20">
          <div className="container">
            <div className="row">
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 m-b30 mt-5">
                <div className="job-bx browse-job clearfix">
                  <div className="job-bx-title  clearfix">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h5 className="font-weight-700 pull-left text-uppercase">
                          <Skeleton
                            animation="wave"
                            // variant="circular"
                            width={100}
                            height={20}
                          />
                        </h5>
                      </div>

                      <div>
                        <Chip
                          avatar={
                            <Skeleton
                              animation="wave"
                              variant="circular"
                              width={20}
                              height={20}
                            />
                          }
                          label={<Skeleton style={{ width: "100px" }} />}
                        />
                      </div>
                    </div>

                    <hr />

                    <div className="row">
                      <div className="col-xl-3 col-lg-4 col-md-5 col-sm-12 m-b30">
                        <aside
                          id="accordion1"
                          className="sidebar-filter bg-white"
                        >
                          <Accordion defaultActiveKey="0">
                            <h6 className="title">
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <i
                                    className="fa fa-filter"
                                    aria-hidden="true"
                                    style={{ color: "orange" }}
                                  ></i>{" "}
                                  Filters{" "}
                                </div>
                                <div>
                                  <Skeleton
                                    className="font-12 float-right"
                                    animation="wave"
                                    height={20}
                                    width="60%"
                                  />
                                </div>
                              </div>
                            </h6>
                            <Accordion.Collapse eventKey="0">
                              <div
                                id="companies"
                                className="acod-body collapse show"
                              >
                                <div className="acod-content">
                                  <Skeleton
                                    animation="wave"
                                    height={20}
                                    width="60%"
                                  />
                                  <span
                                    style={{
                                      position: "relative",
                                      top: "-30px",
                                      left: "90%",
                                      fontSize: "14px",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <GrSearch />
                                  </span>

                                  <Skeleton
                                    animation="wave"
                                    height={20}
                                    width="60%"
                                  />
                                  <br />
                                  <Skeleton
                                    animation="wave"
                                    height={20}
                                    width="60%"
                                  />
                                  <br />
                                  <Skeleton
                                    animation="wave"
                                    height={20}
                                    width="60%"
                                  />
                                  <br />

                                  <Skeleton
                                    animation="wave"
                                    height={20}
                                    width="60%"
                                  />
                                </div>
                              </div>
                            </Accordion.Collapse>
                          </Accordion>
                        </aside>
                      </div>

                      <div className="col-xl-9 col-lg-8 col-md-7">
                        <table className="table-job-bx cv-manager company-manage-job">
                          <thead>
                            <tr>
                              <th>Applicant</th>
                              <th>Contact Number</th>
                              <th>Activities</th>
                              <th>Query</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="job-name">
                                <Skeleton
                                  animation="wave"
                                  height={20}
                                  width="60%"
                                />
                              </td>

                              <td className="application text-primary">
                                <Skeleton
                                  animation="wave"
                                  height={20}
                                  width="60%"
                                />
                              </td>

                              <td className="application text-primary">
                                <Skeleton
                                  animation="wave"
                                  height={20}
                                  width="60%"
                                />
                              </td>

                              <td className="application text-primary">
                                <Skeleton
                                  animation="wave"
                                  height={20}
                                  width="60%"
                                />
                              </td>

                              <td className="application text-primary">
                                <Skeleton
                                  animation="wave"
                                  height={20}
                                  width="60%"
                                />
                              </td>
                            </tr>
                            <tr>
                              <td className="job-name">
                                <Skeleton
                                  animation="wave"
                                  height={20}
                                  width="60%"
                                />
                              </td>

                              <td className="application text-primary">
                                <Skeleton
                                  animation="wave"
                                  height={20}
                                  width="60%"
                                />
                              </td>

                              <td className="application text-primary">
                                <Skeleton
                                  animation="wave"
                                  height={20}
                                  width="60%"
                                />
                              </td>

                              <td className="application text-primary">
                                <Skeleton
                                  animation="wave"
                                  height={20}
                                  width="60%"
                                />
                              </td>

                              <td className="application text-primary">
                                <Skeleton
                                  animation="wave"
                                  height={20}
                                  width="60%"
                                />
                              </td>
                            </tr>
                            <tr>
                              <td className="job-name">
                                <Skeleton
                                  animation="wave"
                                  height={20}
                                  width="60%"
                                />
                              </td>

                              <td className="application text-primary">
                                <Skeleton
                                  animation="wave"
                                  height={20}
                                  width="60%"
                                />
                              </td>

                              <td className="application text-primary">
                                <Skeleton
                                  animation="wave"
                                  height={20}
                                  width="60%"
                                />
                              </td>

                              <td className="application text-primary">
                                <Skeleton
                                  animation="wave"
                                  height={20}
                                  width="60%"
                                />
                              </td>

                              <td className="application text-primary">
                                <Skeleton
                                  animation="wave"
                                  height={20}
                                  width="60%"
                                />
                              </td>
                            </tr>
                            <tr>
                              <td className="job-name">
                                <Skeleton
                                  animation="wave"
                                  height={20}
                                  width="60%"
                                />
                              </td>

                              <td className="application text-primary">
                                <Skeleton
                                  animation="wave"
                                  height={20}
                                  width="60%"
                                />
                              </td>

                              <td className="application text-primary">
                                <Skeleton
                                  animation="wave"
                                  height={20}
                                  width="60%"
                                />
                              </td>

                              <td className="application text-primary">
                                <Skeleton
                                  animation="wave"
                                  height={20}
                                  width="60%"
                                />
                              </td>

                              <td className="application text-primary">
                                <Skeleton
                                  animation="wave"
                                  height={20}
                                  width="60%"
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegistration_Skeleton;
