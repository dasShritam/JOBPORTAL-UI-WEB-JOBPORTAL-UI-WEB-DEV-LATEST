import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";

function Faq_sk() {
    return (
        <>
            <div className="col-lg-12 col-md-12">
                <ul className="post-job-bx browse-job-grid row">
                    <div
                        className="col-lg-12 col-md-12 "
                        style={{
                            marginBottom: "25px",
                        }}
                    >
                        <div className="post-bx">
                            <div className="">
                                <div className="job-post-info">
                                    <div className="d-flex justify-content-between">
                                        <div className="row">
                                            <div className="col-lg-12 col-sm-12 pb-12">
                                                <h5 className="col-lg-10 col-sm-10 pb-10">
                                                    <Typography variant="body1">
                                                        <Skeleton
                                                            style={{
                                                                width: "800px",
                                                                height: "30px",
                                                            }}
                                                        />
                                                    </Typography>
                                                </h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="float-right">
                                    <div className="d-flex justify-content-between">
                                        <Skeleton
                                            animation="wave"
                                            height={25}
                                            width="100%"
                                        />
                                        &nbsp;
                                        <Skeleton
                                            animation="wave"
                                            height={25}
                                            width="60px"
                                        />
                                        &nbsp;
                                        <Skeleton
                                            animation="wave"
                                            height={25}
                                            width="100%"
                                        />
                                        &nbsp;
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ul>
            </div>
        </>
    );
}

export default Faq_sk;
