import { Skeleton, Typography } from "@mui/material";
import "../../../assets/customCss/ApplicantCard.css";

const ApplicantCardSk = (props: any) => {
  return (
    <>
      <div className="myCard3 border" style={{ fontFamily: "poppins" }}>
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
              <Typography variant="body1" className="myBtn1">
                <Skeleton />
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
  );
};

export default ApplicantCardSk;
