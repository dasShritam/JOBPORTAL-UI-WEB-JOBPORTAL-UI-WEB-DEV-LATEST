import { Skeleton } from "@mui/material";
import Listingsidebar from "../../../common/Elements/ListingsSidebar";
import BasicDetails_SK from "./BasicDetails_SK";

const JobSeekerProfile_SK = () => {
  return (
    <div className="page-content">
      <BasicDetails_SK />
      <div className="content-block">
        <div className="section-full browse-job content-inner-2">
          <div className="container">
            <span className="lastUpdate c_content_subheader">
              Profile Last Updated{" "}
              <b>
                <Skeleton height={30} width="10%" />
              </b>
            </span>
            <div className="row">
              <div className="col-xl-3 col-lg-4 col-md-4 col-sm-12 m-b30">
                <Listingsidebar />
              </div>
              <div className="col-xl-9 col-lg-8 col-md-8 col-sm-12">
                <div id="attach_video_bx" className="job-bx bg-white m-b30">
                  <h5 className="c_content_header">
                    <Skeleton height={30} width="30%" />
                  </h5>

                  <div className="c_content_desc">
                    <div style={{ fontSize: "14.5" }}>
                      <Skeleton height={30} width="60%" />
                    </div>
                  </div>

                  <div className="RVdeletebtn">
                    <Skeleton height={30} width="60%" />
                  </div>
                  <form className="attach-resume ">
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <div style={{ textAlign: "center" }}>
                          <Skeleton height={30} width="50%" />
                        </div>
                        <div className="form-group ">
                          <div className="custom-file d-block JP-RVlink">
                            <p className="m-auto align-self-center Vupload">
                              <>
                                <Skeleton height={30} width="60%" />
                              </>
                            </p>

                            <p className="modal-custom-desc">
                              <Skeleton height={30} width="60%" />
                            </p>

                            <Skeleton height={30} width="76%" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                {/* Video  */}
                <div id="attach_video_bx" className="job-bx bg-white m-b30">
                  <h5 className="c_content_header">
                    <Skeleton height={30} width="30%" />
                  </h5>

                  <div className="c_content_desc">
                    <div style={{ fontSize: "14.5" }}>
                      <Skeleton height={30} width="60%" />
                    </div>
                  </div>

                  <div className="RVdeletebtn">
                    <Skeleton height={30} width="60%" />
                  </div>
                  <form className="attach-resume ">
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <div style={{ textAlign: "center" }}>
                          <Skeleton height={30} width="50%" />
                        </div>
                        <div className="form-group ">
                          <div className="custom-file d-block JP-RVlink">
                            <p className="m-auto align-self-center Vupload">
                              <>
                                <Skeleton height={30} width="60%" />
                              </>
                            </p>

                            <p className="modal-custom-desc">
                              <Skeleton height={30} width="60%" />
                            </p>

                            <Skeleton height={30} width="76%" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerProfile_SK;
