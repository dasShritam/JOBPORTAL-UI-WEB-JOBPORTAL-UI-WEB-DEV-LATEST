import { Skeleton } from "@mui/material";
import React from "react";
function ManagePollsSkeleton() {
  return (
    <>
     <div className="page-content bg-white">
        <div className="content-block">
          <div className="section-full bg-white ">
            <div className="container">
              <div className="row">
                <div className="col-xl-12 col-lg-12 ">
                  <div className="job-bx browse-job clearfix">
                    <div className="job-bx-title  clearfix">
                      <h5 className="font-weight-700 text-uppercase">
                        <Skeleton variant="text" width={200} />
                      </h5>
                    </div>
                    <table className="table-job-bx cv-manager company-manage-job">
                      <thead>
                        <tr>
                          <th>
                            <Skeleton variant="text" width={100} />
                          </th>
                          <th>
                            <Skeleton variant="text" width={100} />
                          </th>
                          <th>
                            <Skeleton variant="text" width={200} />
                          </th>
                          <th>
                            <Skeleton variant="text" width={100} />
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="job-name">
                            <p>
                              <Skeleton variant="text" width={200} />
                            </p>
                            <p style={{ fontWeight: "normal" }}>
                              <Skeleton variant="text" width={150} />
                            </p>
                            <label>
                              <Skeleton variant="text" width={150} />
                            </label>
                          </td>
                          <td className="application text-primary">
                            <>
                              <div>
                                <Skeleton variant="text" width={100} />
                              </div>
                            </>
                          </td>
                          <td className="expired pending">
                            <div>
                              <Skeleton variant="text" width={100} />
                              <span className="application text-green">
                                <span style={{ color: "red" }}>
                                  <Skeleton variant="text" width={100} />
                                </span>
                              </span>
                            </div>

                            <div
                              className="mt-4"
                              style={{ marginBottom: "0" }}
                            >
                              <label>
                                <Skeleton variant="text" width={150} />
                              </label>
                            </div>
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
    </>
  );
}
export default ManagePollsSkeleton;
