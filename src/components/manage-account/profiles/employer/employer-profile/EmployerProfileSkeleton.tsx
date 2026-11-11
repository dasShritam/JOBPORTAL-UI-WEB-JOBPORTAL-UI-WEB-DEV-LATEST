import Skeleton from "@mui/material/Skeleton";
let imageIs: any = "";

function EmployerProfileSkeleton() {
  return (
    <>
      <div className="page-content">
        <div className="">
          <div className="section-full">
            <div className="candidate-info onepage">
              <div className="container">
                <div className="row">
                  <div
                    className="col-xl-3 col-lg-4 m-b30"
                    style={{ width: "50px" }}
                  >
                    <ul>
                      <div
                        className="profileSke"
                        style={{ marginLeft: "-45px" }}
                      >
                        <Skeleton animation="wave" className="propske" />
                      </div>
                    </ul>
                  </div>
                  <div className="col-xl-9 col-lg-8 col-md-8 col-sm-12">
                    <div
                      id="Company_Details_bx"
                      className="job-bx submit-resume m-b30"
                    >
                      <>
                        <div className="row">
                          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                            <div className="form-group">
                              <Skeleton animation="wave" height={50} />
                            </div>
                          </div>

                          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                            <div className="form-group">
                              <Skeleton animation="wave" height={50} />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                              <Skeleton animation="wave" height={50} />
                            </div>
                          </div>
                          <div className="form-group col-lg-6 col-md-6 col-sm-6">
                            <Skeleton animation="wave" height={50} />
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                              <Skeleton animation="wave" height={50} />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                              <Skeleton animation="wave" height={50} />
                            </div>
                          </div>

                          <div className=" col-xl-6 col-lg-6 col-md-6 col-sm-12 d-inline">
                            <Skeleton animation="wave" height={50} />
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                              <Skeleton animation="wave" height={50} />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <Skeleton animation="wave" height={50} />
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <Skeleton animation="wave" height={50} />
                          </div>
                        </div>
                        <div style={{ marginLeft: "90%" }}>
                          <Skeleton animation="wave" height={60} width="90%" />
                        </div>
                      </>
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

export default EmployerProfileSkeleton;
