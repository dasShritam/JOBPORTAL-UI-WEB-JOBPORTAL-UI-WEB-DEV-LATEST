import { Skeleton } from "@mui/material";

const NativeUserListSkeleton = () => {
  return (
    <>
      <div className="page-content">
        <div className="content-block">
          <div className="section-full  content-inner-2">
            <div
              style={{
                paddingTop: "23px",
                marginLeft: "5%",
                marginRight: "5%",
                marginTop: "10px",
              }}
              className="job-bx bg-white d-flex justify-content-between NativeTitle"
            >
              {" "}
              <h5 className="text-uppercase" style={{ color: "#7777d3" }}>
                NATIVE USER MANAGEMENT{" "}
              </h5>{" "}
              <Skeleton animation="wave" height={30} width="30%" />
            </div>
            <div style={{ marginLeft: "5%", marginRight: "5%" }}>
              <br />
              <div>
                <Skeleton animation="wave" height={30} width="20%" />
                <div
                  style={{
                    marginLeft: "90%",
                    marginTop: "-30px",
                    display: "flex",
                  }}
                >
                  <Skeleton animation="wave" height={30} width="50%" />{" "}
                  <Skeleton animation="wave" height={30} width="50%" />
                </div>
              </div>
              <br />
              <div id="TableScroll">
                <table className="table-job-bx cv-manager company-manage-job">
                  <thead>
                    <tr>
                      <th>
                        <Skeleton animation="wave" height={30} width="30%" />
                      </th>
                      <th className="table-head-JSR">
                        <Skeleton animation="wave" height={30} width="30%" />
                      </th>
                      <th className="table-head-JSR">
                        <Skeleton animation="wave" height={30} width="30%" />
                      </th>
                      <th className="table-head-JSR">
                        <Skeleton animation="wave" height={30} width="30%" />
                      </th>
                      <th className="table-head-JSR">
                        <Skeleton animation="wave" height={30} width="30%" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <>
                      {" "}
                      <tr>
                        <td className="job-name  table-head-JSR">
                          <div style={{ color: "gray" }}>
                            <div>
                              <Skeleton
                                animation="wave"
                                height={30}
                                width="30%"
                              />
                              <Skeleton
                                animation="wave"
                                height={30}
                                width="30%"
                              />
                              <Skeleton
                                animation="wave"
                                height={30}
                                width="30%"
                              />
                            </div>
                          </div>
                        </td>
                        <td
                          className="application text-primary table-body-JSR"
                          // style={{ padding: "6px 2px 1px 11px" }}
                        >
                          <Skeleton animation="wave" height={30} width="30%" />
                          <Skeleton animation="wave" height={30} width="30%" />
                        </td>
                        <td
                          className="application text-primary table-body-JSR"
                          // style={{ padding: "6px 2px 1px 11px" }}
                        >
                          <Skeleton animation="wave" height={30} width="30%" />
                        </td>
                        <td
                          className="table-body-JSR"
                          // style={{ padding: "6px 2px 1px 11px" }}
                        >
                          <div>
                            <Skeleton
                              animation="wave"
                              height={30}
                              width="30%"
                            />
                          </div>
                        </td>
                        <td className="job-links table-body-JSR">
                          <Skeleton
                            style={{ marginTop: "10%" }}
                            animation="wave"
                            height={30}
                            width="30%"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="job-name  table-head-JSR">
                          <div style={{ color: "gray" }}>
                            {" "}
                            <Skeleton
                              animation="wave"
                              height={30}
                              width="30%"
                            />
                            <Skeleton
                              animation="wave"
                              height={30}
                              width="30%"
                            />
                            <Skeleton
                              animation="wave"
                              height={30}
                              width="30%"
                            />
                          </div>
                        </td>
                        <td
                          className="application text-primary table-body-JSR"
                          // style={{ padding: "6px 2px 1px 11px" }}
                        >
                          <Skeleton animation="wave" height={30} width="30%" />
                          <Skeleton animation="wave" height={30} width="30%" />
                        </td>
                        <td
                          className="application text-primary table-body-JSR"
                          // style={{ padding: "6px 2px 1px 11px" }}
                        >
                          <Skeleton animation="wave" height={30} width="30%" />
                        </td>
                        <td
                          className="table-body-JSR"
                          // style={{ padding: "6px 2px 1px 11px" }}
                        >
                          <div>
                            <Skeleton
                              animation="wave"
                              height={30}
                              width="30%"
                            />
                          </div>
                        </td>
                        <td className="job-links table-body-JSR">
                          <Skeleton
                            style={{ marginTop: "10%" }}
                            animation="wave"
                            height={30}
                            width="30%"
                          />
                        </td>
                      </tr>
                    </>
                  </tbody>
                </table>
                <div
                  className="pagination-bx m-t20"
                  style={{ marginLeft: "90%" }}
                >
                  <Skeleton animation="wave" height={30} width="50%" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NativeUserListSkeleton;
