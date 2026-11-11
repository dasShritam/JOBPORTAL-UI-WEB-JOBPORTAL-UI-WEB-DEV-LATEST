import React from 'react'
import { Skeleton } from '@mui/material';
function JobdescriptionSkeleton() {
    return (
        <div id="job_desc_bx" className="job-bx bg-white m-b30">
            <h5 className="mb-2"><Skeleton animation="wave" height={50} width="30%" /></h5>
            <div>
                <div className="row" id="desigjd">
                    <div className="col-lg-6 col-md-6 col-sm-6">
                        {/* <label>Job title / Designation</label>
                        <span className="form-error">*</span> */}
                        <Skeleton animation="wave" height={40} width="100%" />

                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6">
                        {/* <label>Employment Type</label>
                        <span className="form-error">*</span> */}
                        <Skeleton animation="wave" height={40} width="100%" />

                    </div>
                </div>
                <br />
                <div className="row" id="workjd">
                    <div className="col-lg-6 col-md-6 col-sm-6">
                        {/* <label>Work Mode</label>
                        <span className="form-error">*</span> */}
                        <Skeleton animation="wave" height={40} width="100%" />
                    </div>
                </div>
                <br />
                <div id="jdtexteditor">
                    <div>
                        {/* <label>Job Description</label>
                        <span className="form-error">*</span> */}
                    </div>
                    <Skeleton animation="wave" height={70} width="100%" />
                </div>
            </div>
        </div>
    );
}

export default JobdescriptionSkeleton