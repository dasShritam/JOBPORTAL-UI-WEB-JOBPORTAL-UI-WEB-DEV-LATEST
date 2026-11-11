import Skeleton from "@mui/material/Skeleton";

import Typography from "@material-ui/core/Typography";

function SkeletonResultCard() {
  return (
    <>
      <div className="post-bx">
        <div className="">
          <div className="job-post-info">
            <div className="row">
              <div className="col-lg-7 col-sm-4 pb-3">
                <div className="">
                  <div className="form-group">
                    <div className="custom-control">
                      <label style={{ marginLeft: "-4%" }}>
                        <Typography variant="body1">
                          <Skeleton style={{ width: "200px" }} />
                        </Typography>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="">
                  <ul className="d-flex flex-row">
                    <li className="" style={{ fontSize: "14px" }}>
                      <Skeleton animation="wave" height={30} width="60%" />
                    </li>

                    <li className="" style={{ fontSize: "14px" }}>
                      <Skeleton animation="wave" height={30} width="60%" />
                    </li>
                  </ul>
                </div>
                <div className="mt-3">
                  <div className="row" style={{ marginLeft: "0%" }}>
                    <Skeleton animation="wave" height={30} width="60%" />
                  </div>

                  <div className="row" style={{ marginLeft: "0%" }}>
                    <Skeleton animation="wave" height={30} width="60%" />
                  </div>

                  <div className="row" style={{ marginLeft: "0%" }}>
                    <Skeleton animation="wave" height={30} width="60%" />
                  </div>

                  <div className="row" style={{ marginLeft: "0%" }}>
                    <Skeleton animation="wave" height={30} width="60%" />
                  </div>

                  <div className="row" style={{ marginLeft: "0%" }}>
                    <Skeleton animation="wave" height={30} width="60%" />
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-sm-4">
                <center>
                  <div>
                    <div
                      className="job-post-company"
                      style={{ marginRight: "0px" }}
                    >
                      <div className="round-box">
                        <Skeleton
                          animation="wave"
                          variant="circular"
                          style={{
                            borderRadius: "100%",
                            width: "70px",
                            height: "70px",
                          }}
                        />
                      </div>
                    </div>

                    <br />
                    <Skeleton animation="wave" height={30} width="80%" />

                    <Skeleton animation="wave" height={20} width="80%" />
                    <Skeleton animation="wave" height={20} width="80%" />
                  </div>
                </center>
              </div>

              <div className="col-lg-1 col-sm-4">
                <center className="center-btn">
                  <div className="col-lg-12 col-sm-4 mail"></div>
                </center>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SkeletonResultCard;
