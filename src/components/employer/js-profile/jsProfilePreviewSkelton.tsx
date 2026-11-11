import Skeleton from "@mui/material/Skeleton";
import Typography from "@material-ui/core/Typography";
let imageIs: any = "";
function JsProfilePreviewSkelton() {
  return (
    <>
      <div className="page-content jsproprev">
        <div className="">
          <Skeleton animation="wave" height={10} className="ske" />
          <div className="section-full">
            <div className="candidate-info onepage">
              <div className="container">
                <div className="row">
                  <div className="col-xl-2 col-lg-4 col-md-4 col-sm-12 m-b30">
                    <ul>
                      <li className="liske">
                        <Skeleton animation="wave" className="menuske" />
                      </li>
                      <li className="liske">
                        <Skeleton animation="wave" className="menuske" />
                      </li>
                      <li className="liske">
                        <Skeleton animation="wave" className="menuske" />
                      </li>
                      <li className="liske">
                        <Skeleton animation="wave" className="menuske" />
                      </li>
                      <li className="liske">
                        <Skeleton animation="wave" className="menuske" />
                      </li>
                      <li className="liske">
                        <Skeleton animation="wave" className="menuske" />
                      </li>
                      <li className="liske">
                        <Skeleton animation="wave" className="menuske" />
                      </li>
                      <li className="liske">
                        <Skeleton animation="wave" className="menuske" />
                      </li>
                      <li className="liske">
                        <Skeleton animation="wave" className="menuske" />
                      </li>
                      <li className="liske">
                        <Skeleton animation="wave" className="menuske" />
                      </li>
                      <li className="liske">
                        <Skeleton animation="wave" className="menuske" />
                      </li>
                      <li className="liske">
                        <Skeleton animation="wave" className="menuske" />
                      </li>
                      <li className="liske">
                        <Skeleton animation="wave" className="menuske" />
                      </li>
                    </ul>
                  </div>
                  <div className="col-xl-7 col-lg-8 col-md-8 col-sm-12">
                    <div className="mainSke">
                      <Skeleton animation="wave" className="bodyske" />
                    </div>
                    <div className="mainSke">
                      <Skeleton animation="wave" className="bodyske" />
                    </div>
                    <div className="mainSke">
                      <Skeleton animation="wave" className="bodyske" />
                    </div>
                    <div>
                      <Skeleton animation="wave" className="bodyske" />
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-8 col-md-8 col-sm-12">
                    <div>
                      <Skeleton
                        animation="wave"
                        className="commentSke"
                        style={{ marginTop: "-68px" }}
                      />
                    </div>
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

export default JsProfilePreviewSkelton;
