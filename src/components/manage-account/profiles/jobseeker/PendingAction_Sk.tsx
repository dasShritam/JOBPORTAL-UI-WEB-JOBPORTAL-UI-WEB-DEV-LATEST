import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";

function PendingAction_Sk() {
  return (
    <span className="col-lg-12 col-md-12" style={{ marginBottom: "25px" }}>
      <div className="post-bx" id="Custom-CardBackgrdColor">
        <div className="">
          <div className="job-post-info">
            <div className="d-flex justify-content-between">
              <div className="row">
                <div className="col-lg-12 col-sm-12 pb-12">
                  <div className="d-flex">
                    <h5>
                      <Typography variant="body1">
                        <Skeleton
                          style={{
                            width: "200px",
                            height: "30px",
                          }}
                        />
                      </Typography>
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-sm-4 pb-4">
                <h5 className="custom-job-content">
                  <Skeleton animation="wave" height={30} width="100%" />
                </h5>
              </div>
            </div>
            <ul>
              <li style={{ listStyleType: "none" }}>
                <Skeleton animation="wave" height={20} width="85%" />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </span>
  );
}

export const PendingAction_Skl = PendingAction_Sk;
