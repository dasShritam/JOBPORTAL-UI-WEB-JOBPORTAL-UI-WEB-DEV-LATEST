import { Avatar, Chip } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import {
    empInternalStatisticsDatas,
    internalJobsData,
    resetEmpIntStatistics,
    resetInternalJobs,
    resetUpdateIntJobSts,
} from "../../../../redux/features/jobs/manage-jobs/MangeJobs-rjp-ijpSlice";
import FilterJobs from "../manage-ijp-rjp-jobs/FilterJobs";
import JobListing from "../manage-ijp-rjp-jobs/JobListing";
var draftJobsImg = require("../../../../assets/images/background/draftJobImg.png");

function ManageJobsRjpIjp() {
    const navigate = useNavigate();
    const [hideFilter, setHideFilter] = useState(true);
    const { internalJobsRes, internalJobLoading } = useSelector(
        (state: any) => state.InternalJobs
    );
    const hideFilterHandler = (bool: boolean) => {
        setHideFilter(bool);
    };

    const dispatch = useDispatch();
    useEffect(() => {
        const JobListOptions = {
            mode: "minimal",
            pageId: 1,
            search: "",
            jobid: null,
            pageLimit: 10,
            status: ["PUBLISH", "CLOSE"],
        };
        dispatch(internalJobsData(JobListOptions));
    }, []);

    // useEffect(() => {
    //     dispatch(empInternalStatisticsDatas({}));
    // }, []);

    useEffect(() => {
        dispatch(resetEmpIntStatistics());
        dispatch(resetUpdateIntJobSts());
        dispatch(resetInternalJobs());
    }, []);

    const handleConfirmSwal = (values: any) => {
        Swal.fire({
            title: "Permission Denied",
            text: `Oops..! looks like you do not have permission to access this feature (${values}), please contact you Administrator.`,
            showCancelButton: false,
            confirmButtonColor: "red",
            confirmButtonText: "OK",
        }).then((result) => { });
    };

    const [filterSearchData, setFilterSearchData] = useState({});
    const filterData = (data: any) => {
        setFilterSearchData({ ...data });
    };

    return (
        <div className="page-content bg-white">
            <div className="content-block">
                <div className="browse-job section-full bg-white p-t50 p-b20">
                    <div className="container">
                        <div className="job-bx browse-job clearfix mt-5 m-b30">
                            <div className="d-flex justify-content-between">
                                <div className="job-bx-title clearfix NativeTitle w-100">
                                    <h5 className="font-weight-700 pull-left text-uppercase">
                                        MANAGE INTERNAL AND REFERRAL JOBS{" "}
                                    </h5>

                                    <div className="float-right p-tb5 p-r20">
                                        <Chip
                                            label={
                                                <span className="custom-job-content text-bold">
                                                    Total Jobs
                                                </span>
                                            }
                                            avatar={
                                                <Avatar
                                                    className="btn site-button btn-sm "
                                                    style={{
                                                        color: "white",
                                                        backgroundColor: "blue",
                                                    }}
                                                >
                                                    {internalJobsRes?.totalCount
                                                        ? internalJobsRes?.totalCount
                                                        : "0"}
                                                </Avatar>
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xl-3 col-lg-4 col-md-5 col-sm-12 m-b30">
                                    {hideFilter && (
                                        <FilterJobs filterRecord={filterData} />
                                    )}
                                    {!hideFilter && (
                                        <img
                                            src={draftJobsImg}
                                            className="m-t50 img-fluid"
                                            alt=""
                                        />
                                    )}
                                </div>
                                <div className="col-xl-9 col-lg-8 col-md-7">
                                    <JobListing
                                        hideFilterHandler={hideFilterHandler}
                                        filterData={
                                            filterSearchData
                                                ? filterSearchData
                                                : {}
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ManageJobsRjpIjp;
