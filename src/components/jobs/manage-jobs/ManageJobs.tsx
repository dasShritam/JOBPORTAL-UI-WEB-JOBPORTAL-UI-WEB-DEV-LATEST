import React, { lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    empStatisticsDatas,
    manageJobsData,
    resetEmpStatistics,
    resetManageJobs,
    resetTotalApplicants,
    resetUpdateStatus,
} from "../../../redux/features/jobs/manage-jobs/ManageJobsSlice";
import FilterJobs from "./FilterJobs";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { useNavigate } from "react-router";
import jwtDecode from "jwt-decode";
import { EMP_PERMISSIONS } from "../../../routes/roles";
import Swal from "sweetalert2";
import { Avatar, Chip } from "@mui/material";

const JobListing = lazy(() => import("./JobListing"));

var draftJobsImg = require("../../../assets/images/background/draftJobImg.png");
function ManageJobs(props) {
    const [hideFilter, setHideFilter] = useState(true);
    const { allManageJobs, manageJobLoading } = useSelector(
        (state: any) => state.ManageJobs
    );
    const hideFilterHandler = (bool: boolean) => {
        setHideFilter(bool);
    };

    const dispatch = useDispatch();
    useEffect(() => {
        const JobListOptions = {
            mode: "minimal",
            pageid: 1,
            title: "",
            jobid: "",
            status: ["PUBLISH", "CLOSE"],
        };
        dispatch(manageJobsData(JobListOptions));
    }, []);

    // useEffect(() => {
    //     dispatch(empStatisticsDatas({}));
    // }, []);

    useEffect(() => {
        return () => {
            dispatch(resetEmpStatistics());
            dispatch(resetManageJobs());
            dispatch(resetUpdateStatus());
            dispatch(resetTotalApplicants());
        };
    }, []);
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
                                        MANAGE PRIVATE AND HOT JOBS{" "}
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
                                                    {allManageJobs?.totalCount
                                                        ? allManageJobs?.totalCount
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

export default ManageJobs;
