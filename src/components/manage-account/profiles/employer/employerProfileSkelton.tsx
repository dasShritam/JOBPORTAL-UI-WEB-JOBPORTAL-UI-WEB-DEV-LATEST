import Skeleton from "@mui/material/Skeleton";
let imageIs: any = "";
function EmployerProfileSkelton() {
  return (
    <>
      <div className="page-content">
        <div className="">
          <div className="section-full">
            <div className="candidate-info onepage">
              <div className="container">
                <div className="row">
                  <div className="col-xl-3 col-lg-4 m-b30">
                    <ul>
                      <div className="profileSke">
                        <Skeleton animation="wave" className="propske" />
                      </div>
                      <li className="liske">
                        <Skeleton animation="wave" className="menuske" />
                      </li>
                    </ul>
                  </div>
                  <div className="col-xl-9 col-lg-8 col-md-8 col-sm-12">
                    <div className="row">
                      <div className="col-xl-5 col-lg-4 col-md-4 col-sm-12">
                        <div className="mainSke">
                          <Skeleton animation="wave" className="bodyproske" />
                        </div>
                        <div className="mainSke">
                          <Skeleton animation="wave" className="bodyproske" />
                        </div>
                        <div className="mainSke">
                          <Skeleton animation="wave" className="bodyproske" />
                        </div>
                        <div className="mainSke">
                          <Skeleton animation="wave" className="bodyproske" />
                        </div>
                        <div className="mainSke">
                          <Skeleton animation="wave" className="bodyproske" />
                        </div>
                        <div className="mainSke">
                          <Skeleton animation="wave" className="bodyproske" />
                        </div>
                      </div>
                      <div className="col-xl-5 col-lg-4 col-md-4 col-sm-12">
                        <div className="mainSke">
                          <Skeleton animation="wave" className="bodyproske" />
                        </div>
                        <div className="mainSke">
                          <Skeleton animation="wave" className="bodyproske" />
                        </div>
                        <div className="mainSke">
                          <Skeleton animation="wave" className="bodyproske" />
                        </div>
                        <div className="mainSke">
                          <Skeleton animation="wave" className="bodyproske" />
                        </div>
                        <div className="mainSke">
                          <Skeleton animation="wave" className="bodyproske" />
                        </div>
                        <div className="mainSke">
                          <Skeleton animation="wave" className="bodyproske" />
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
    </>
  );
}

export default EmployerProfileSkelton;
