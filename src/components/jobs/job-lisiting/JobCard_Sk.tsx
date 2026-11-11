import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
function JobCard_Sk() {
  return (
    <>
      <div className="col-lg-12 col-md-12">
        <ul className="post-job-bx browse-job-grid row">
          <span className="col-lg-6 col-md-6" style={{ marginBottom: "25px" }}>
            <div className="post-bx" id="Custom-CardBackgrdColor">
              <div className="">
                <div className="job-post-info">
                  <div className="d-flex justify-content-between">
                    <div className="row">
                      <div className="col-lg-12 col-sm-12 pb-12">
                        <h5>
                          <Typography variant="body1">
                            <Skeleton
                              style={{ width: "200px", height: "30px" }}
                            />
                          </Typography>
                        </h5>
                      </div>
                    </div>
                    <div className="col-lg-2 col-sm-2 pb-2">
                      <h5 className="custom-job-content">
                        <Skeleton animation="wave" height={30} width="100%" />
                      </h5>
                    </div>
                  </div>
                  <ul>
                    <li>
                      <Skeleton animation="wave" height={20} width="40%" />
                    </li>
                    <li>
                      <Skeleton animation="wave" height={20} width="40%" />
                    </li>
                    <li>
                      <Skeleton animation="wave" height={20} width="60%" />
                    </li>
                    <li>
                      <Skeleton animation="wave" height={20} width="60%" />
                    </li>
                    <li>
                      <Skeleton animation="wave" height={20} width="80%" />
                    </li>
                    <li>
                      <Skeleton animation="wave" height={20} width="70%" />
                    </li>
                    <li>
                      <Skeleton animation="wave" height={10} width="20%" />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </span>
        </ul>
      </div>
    </>
  );
}
export default JobCard_Sk;
