import React from 'react'
import { Skeleton } from '@mui/material';


function JobRequirementSkeleton() {
    return (
        <div id="job_req_bx" className="job-bx bg-white m-b30">
            <h5 className="mb-2"><Skeleton animation="wave" height={50} width="30%" /></h5>
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                }}
            >
                <div className="row">
                    <div className="col-lg-12 col-md-12">
                        <div className="">

                            <Skeleton animation="wave" height={40} width="20%" />


                            <Skeleton animation="wave" height={30} width="100%" />

                            <div className="isHotDiv mb-4">
                                <Skeleton animation="wave" height={30} width="30%" />
                                <div className="d-flex align-items-center ">
                                    <div style={{ width: "70%" }} className="mt-4">
                                        <Skeleton animation="wave" height={40} width="100%" />

                                    </div>
                                </div>
                            </div>
                            <div className="isHotDiv">
                                <Skeleton animation="wave" height={30} width="30%" />
                                <br />
                                <div className="d-flex align-items-center">
                                    {/* <div
                    className="btn-group "
                    role="group"
                    aria-label="Toggle manual switch"
                  >                    
                    <label>
                      <input
                        type="radio"
                        name="currencySymbole"
                        value="INR"
                        className="card-input-element"
                        checked={props.values.currencySymbole === "INR"}
                        onChange={props.handleChange}
                      />
                      <div
                        className={
                          props.values.currencySymbole === "INR"
                            ? "btn btn-primary btn-sm"
                            : "btn btn-outline-primary btn-sm"
                        }
                      >
                        ₹
                      </div>
                    </label>
                    <label className="mr-3">
                      <input
                        type="radio"
                        name="currencySymbole"
                        value="USD"
                        className="card-input-element"
                        checked={props.values.currencySymbole === "USD"}
                        onChange={props.handleChange}
                      />
                      <div
                        className={
                          props.values.currencySymbole === "USD"
                            ? "btn btn-primary btn-sm"
                            : "btn btn-outline-primary btn-sm"
                        }
                      >
                        $
                      </div>
                    </label>
                  </div> */}
                                    <div style={{ width: "70%" }}>
                                        <Skeleton animation="wave" height={40} width="100%" />
                                    </div>
                                </div>


                            </div>
                            <br />
                            <div>

                                <Skeleton animation="wave" height={30} width="40%" />

                            </div>
                            <br />
                            <div>
                                <Skeleton animation="wave" height={30} width="30%" />
                                <Skeleton animation="wave" height={30} width="100%" />

                                {/* <span className="custom-control custom-checkbox">
                                    <Skeleton animation="wave" height={30} width="100%" />

                                </span> */}
                            </div>
                            <div>

                            </div>
                            <br />
                            <div className="mt-2">
                                <Skeleton animation="wave" height={30} width="30%" />
                                <Skeleton animation="wave" height={30} width="100%" />
                            </div>
                            <br />
                            <div className="mt-3">
                                <Skeleton animation="wave" height={30} width="30%" />
                                <Skeleton animation="wave" height={30} width="100%" />

                            </div>
                            <br />
                            {/* <div className="mt-3">
                                <Skeleton animation="wave" height={30} width="30%" />
                                <Skeleton animation="wave" height={30} width="100%" />

                            </div> */}

                        </div>
                        <div className="col-lg-12 d-flex mt-3">
                            <Skeleton animation="wave" height={30} width="20%" />
                            &nbsp;
                            <Skeleton animation="wave" height={30} width="20%" />
                        </div>

                        <div className="col-lg-6 col-md-12 col-sm-12 d-flex">
                            <Skeleton animation="wave" height={30} width="100%" />

                            &nbsp;
                            <Skeleton animation="wave" height={30} width="100%" />

                        </div>
                    </div>
                </div>
                <br />

                <Skeleton animation="wave" height={30} width="30%" />

                <div>
                    <Skeleton animation="wave" height={60} width="100%" />

                </div>
                {/* <div>
                    <span className="custom-control custom-checkbox">
                        <Skeleton animation="wave" height={30} width="100%" />

                    </span>

                </div>
                <div>
                    <span className="custom-control custom-checkbox">
                        <Skeleton animation="wave" height={30} width="100%" />

                    </span>
                </div>
                <div>
                    <span className="custom-control custom-checkbox">
                        <Skeleton animation="wave" height={30} width="100%" />

                    </span>
                </div> */}
            </form >
        </div >

    );
}

export default JobRequirementSkeleton