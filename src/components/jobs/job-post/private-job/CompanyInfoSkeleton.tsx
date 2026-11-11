import React from 'react'
import { Skeleton } from '@mui/material';

function CompanyInfoSkeleton() {
    return (
        <div id="companyInfo_bx" className="job-bx bg-white m-b30">
            <Skeleton animation="wave" height={50} width="30%" />
            <div className="row">
                <div className="col-lg-12 ">
                    <Skeleton animation="wave" height={50} width="100%" />
                    <br />

                    <Skeleton animation="wave" height={50} width="100%" />
                    <br />

                    <Skeleton animation="wave" height={50} width="100%" />

                    <div className='d-flex justify-content-between mt-3'>
                        <Skeleton animation="wave" height={50} width="100%" />
                        {/* <span className="custom-control custom-checkbox float-right">
                            <Skeleton animation="wave" height={30} width="30%" />
                        </span> */}
                    </div>


                </div>
                <div className="col-lg-12 ">
                    <ul className="list-unstyled">
                        <li>
                            <div className="post-bx">
                                <div className="d-flex isHotDiv">
                                    <div className="job-post-company">
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
                                    <div className="job-post-info">
                                        <Skeleton animation="wave" height={30} width="30%" />
                                        <ul className="list-unstyled">
                                            <Skeleton animation="wave" height={30} width="30%" />
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="col-lg-12 ">
                    {/* <span className="custom-control custom-checkbox mb-2">
                        <Skeleton animation="wave" height={30} width="30%" />
                    </span> */}

                    <br />

                    {/* <label htmlFor="">How often should mails be send ?</label> */}

                    <Skeleton animation="wave" height={40} width="50%" />

                    <br />

                    <span className='font_italic_md'>
                        <Skeleton animation="wave" height={40} width="50%" />
                    </span>
                </div>
            </div>


        </div >

    );
}

export default CompanyInfoSkeleton