import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Accordion, Card } from "react-bootstrap";
import { BiSearch } from "react-icons/bi";
import { AiOutlineSearch } from "react-icons/ai";
import { TbClearAll } from "react-icons/tb";
import { GrSearch } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import {
    empStatisticsDatas,
    manageJobsData,
    resetEmpStatistics,
    resetManageJobs,
    resetUpdateStatus,
} from "../../../redux/features/jobs/manage-jobs/ManageJobsSlice";

function FilterJobs({ filterRecord }) {
    const [activeJob, setActiveJob] = useState(false);
    const [closedJob, setClosedJob] = useState(false);
    const [expiredJob, setExpiredJob] = useState(false);

    const listingJob = useSelector((state: any) => state.ManageJobs);
    const { allManageJobs } = listingJob;

    const totalCounts = useSelector((state: any) => state.EmpStatisticsData);
    const { empStatisticsData } = totalCounts;

    useEffect(() => { }, [empStatisticsData]);

    useEffect(() => { }, [allManageJobs]);

    useEffect(() => { }, [activeJob, closedJob, expiredJob]);

    const [filterData, setFilterData] = useState<any>([]);
    const dispatch = useDispatch();

    const handleFilter = () => {
        const JobListOptions = {
            mode: "minimal",
            title: filterData,
            pageid: 1,
            jobid: "",
            status: [],
        };
        filterRecord(JobListOptions);
        dispatch(manageJobsData(JobListOptions));
    };

    const resetHandler = (e: any) => {
        e.preventDefault();
        setFilterData("");
        setActiveJob(false);
        setClosedJob(false);
        setExpiredJob(false);

        const JobListOptions = {
            mode: "minimal",
            pageid: 1,
            title: "",
            jobid: "",
            status: ["PUBLISH", "CLOSE"],
        };
        filterRecord({});
        dispatch(manageJobsData(JobListOptions));
        // dispatch(empStatisticsDatas());
    };

    const searchHandler = () => {
        let status: any = [];
        if (activeJob) {
            status.push("ACTIVE");
        }
        if (closedJob) {
            status.push("CLOSE");
        }
        if (expiredJob) {
            status.push("EXPIRED");
        }
        const fetchInfo = {
            mode: "minimal",
            pageid: 1,
            title: filterData,
            jobid: "",
            status: status,
        };

        filterRecord(fetchInfo);
        dispatch(manageJobsData(fetchInfo));
    };

    return (
        <aside id="accordion1" className="sidebar-filter bg-white">
            <Accordion defaultActiveKey="0">
                <h6 className="title">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <i
                                className="fa fa-filter"
                                aria-hidden="true"
                                style={{ color: "orange" }}
                            ></i>{" "}
                            Filters{" "}
                        </div>
                        <div>
                            <Link
                                to={"#"}
                                onClick={(e: any) => {
                                    resetHandler(e);
                                }}
                                className="font-12 float-right"
                            >
                                <TbClearAll /> Reset
                            </Link>{" "}
                        </div>
                    </div>
                </h6>
                <Accordion.Collapse eventKey="0">
                    <div id="companies" className="acod-body collapse show">
                        <div className="acod-content">
                            <input
                                className="form-control"
                                type="search"
                                value={filterData}
                                placeholder="Job Title"
                                aria-label="Search "
                                onChange={(e: any) => {
                                    setFilterData(e.target.value);
                                }}
                            />
                            <span
                                style={{
                                    position: "relative",
                                    top: "-30px",
                                    left: "90%",
                                    fontSize: "14px",
                                    cursor: "pointer",
                                }}
                            >
                                <GrSearch
                                    onClick={() => {
                                        handleFilter();
                                    }}
                                />
                            </span>
                            <h6> Filter By Job Status </h6>
                            <div className="custom-control custom-checkbox">
                                <input
                                    className="custom-control-input"
                                    id="companies3"
                                    type="checkbox"
                                    checked={activeJob}
                                    readOnly
                                    name="checkbox-companies"
                                    onClick={() => {
                                        setActiveJob(!activeJob);
                                    }}
                                />
                                <label
                                    className="custom-control-label"
                                    htmlFor="companies3"
                                >
                                    Active Jobs{" "}
                                    <span>
                                        (
                                        {
                                            empStatisticsData?.job_status
                                                ?.active_jobs
                                        }
                                        )
                                    </span>{" "}
                                </label>
                            </div>
                            <div className="custom-control custom-checkbox">
                                <input
                                    className="custom-control-input"
                                    id="companies4"
                                    type="checkbox"
                                    checked={closedJob}
                                    readOnly
                                    name="checkbox-companies"
                                    onChange={(e: any) => {
                                        setClosedJob(!closedJob);
                                    }}
                                />
                                <label
                                    className="custom-control-label"
                                    htmlFor="companies4"
                                >
                                    Closed Jobs{" "}
                                    <span>
                                        (
                                        {
                                            empStatisticsData?.job_status
                                                ?.closed_jobs
                                        }
                                        )
                                    </span>
                                </label>
                            </div>
                            <div className="custom-control custom-checkbox">
                                <input
                                    className="custom-control-input"
                                    id="companies5"
                                    type="checkbox"
                                    checked={expiredJob}
                                    readOnly
                                    name="checkbox-companies"
                                    onChange={(e: any) => {
                                        setExpiredJob(!expiredJob);
                                    }}
                                />
                                <label
                                    className="custom-control-label"
                                    htmlFor="companies5"
                                >
                                    Expired Jobs{" "}
                                    <span>
                                        (
                                        {
                                            empStatisticsData?.job_status
                                                ?.expired_jobs
                                        }
                                        )
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="acod-content">
                            <button
                                type="submit"
                                className="site-button btn-block"
                                onClick={searchHandler}
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </Accordion.Collapse>
            </Accordion>
        </aside>
    );
}

export default FilterJobs;
