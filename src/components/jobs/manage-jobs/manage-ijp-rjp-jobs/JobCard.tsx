import React, { useEffect, useState } from "react";
import { MdDescription, MdMilitaryTech } from "react-icons/md";
import { TbCalendar } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { ImLocation } from "react-icons/im";
import { HiOutlineTicket } from "react-icons/hi";
import Pagination from "rc-pagination";
import "../../../../assets/customCss/Pagination.css";
import { Modal } from "react-bootstrap";
import "../../../../assets/customCss/jobs/manage-jobs.css";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "@mui/material";
import { FaShoppingBag } from "react-icons/fa";
import { UseToastAlert } from "../../../../hooks/useToastAlert";
import {
    Content,
    getDateDifference,
    getTimestampToDate,
} from "../../../../common/common";
import {
    empInternalStatisticsDatas,
    intTotalJobApplicantsData,
    internalJobsData,
    resetUpdateIntJobSts,
    updateInternalJobStatus,
} from "../../../../redux/features/jobs/manage-jobs/MangeJobs-rjp-ijpSlice";
import { JobCard_Skl } from "../JobCard_Sk";
import { BsCloudDownload } from "react-icons/bs";
var notfoundImg = require("../../../../assets/images/background/No-record.png");

type initialState = {
    filterData?: any;
};
function JobCard({ filterData }: initialState) {
    const [closedId, setClosedId] = useState("");

    const dispatch = useDispatch();
    const internalJobList = useSelector((state: any) => state.InternalJobs);
    const { internalJobsRes, internalJobLoading } = internalJobList;

    const updateIntJobSts = useSelector(
        (state: any) => state.UpdateIntJobStatus
    );
    const { updateInterjobsSts } = updateIntJobSts;

    const totalCounts = useSelector(
        (state: any) => state.EmpInternalStatisticsData
    );
    const { empIntStatisticsData } = totalCounts;

    useEffect(() => { }, [internalJobsRes, closedId]);

    const totalApplicants = useSelector((state: any) => state.intJobApplicants);
    const { intTotalJobsApplicants } = totalApplicants;

    useEffect(() => { }, [intTotalJobsApplicants]);

    const [displayData, setDisplayData] = useState<any>([]);
    useEffect(() => {
        let combinedData: any = [];
        const data = internalJobsRes?.jobs?.map((e: any) => {
            let res = { ...e };

            empIntStatisticsData?.actions?.applicants_lstRpt?.map((a: any) => {
                if (e.jobid === a._id) {
                    res.totalResponse = a.count;
                }
                empIntStatisticsData?.actions?.shortListedRpt?.map((b: any) => {
                    if (e.jobid === b._id) {
                        res.shortListed = b.count;
                    }
                });
            });
            combinedData.push(res);
        });

        setDisplayData([...combinedData]);
    }, [internalJobsRes, empIntStatisticsData]);

    const fetchData = () => {
        const JobListOptions = {
            mode: "minimal",
            pageId: 1,
            search: "",
            jobid: null,
            pageLimit: 10,
            status: ["PUBLISH", "CLOSE"],
        };
        dispatch(internalJobsData(JobListOptions));
    };

    const showSnackAlert = UseToastAlert();
    const navigate = useNavigate();
    const [closeJob, setClosedJob] = useState("");
    const [disModal, setDisModal] = useState(false);
    const [postData, setPostData] = useState<any>([]);
    const [currentpage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [size, setSize] = useState(perPage);
    const PerPageChange = (value: any) => {
        setSize(value);
        if (postData) {
            Math.ceil(postData?.length / value);
        }
    };
    const PrevNextArrow = (current: any, type: any, originalElement: any) => {
        if (type === "prev") {
            return (
                <button
                    title="prev"
                    className="previous"
                    style={{ borderColor: "#eae6e6", borderRadius: "2px" }}
                >
                    <i className="ti-arrow-left"></i> Prev
                </button>
            );
        }

        if (type === "next") {
            return (
                <button
                    title="next"
                    style={{ borderColor: "#eae6e6", borderRadius: "2px" }}
                    className="pagination"
                >
                    Next <i className="ti-arrow-right"></i>
                </button>
            );
        }

        return originalElement;
    };
    const PaginationChange = (page: any, pageSize: any) => {
        setCurrentPage(page);
        setSize(pageSize);
        if (filterData.title || filterData.status) {
            filterData.pageid = page;
            dispatch(internalJobsData(filterData));
        } else {
            const JobListOptions = {
                mode: "minimal",
                pageId: page,
                jobid: null,
                search: "",
                pageLimit: 10,
                status: [],
            };
            dispatch(internalJobsData(JobListOptions));
        }
    };

    const getData = (current: any, pageSize: any) => {
        return internalJobsRes.slice(
            (current - 1) * pageSize,
            current * pageSize
        );
    };

    const closeHandler = () => {
        if (closeJob) {
            setDisModal(false);
            const closeInfo = {
                status: "CLOSE",
                jobid: [closedId],
                remarks: closeJob,
            };
            dispatch(updateInternalJobStatus(closeInfo));
            fetchData();
        }
    };
    const checkStatus = (status: any, endDate: any) => {
        let res: any = "";
        let color: any = "";
        if (status === "CLOSE") {
            res = "Closed";
            color = "badge badge-danger";
        } else if (endDate <= Number(new Date().getTime() / 1000).toFixed()) {
            res = "Expired";
            color = "badge badge-danger";
        }
        return { res, color };
    };

    const checkRepost = (status: any, created_at: any, updated_at: any) => {
        let res: any = "";
        if (status === "") {
            if (created_at !== updated_at) {
                res = "Reposted";
            }
        }
        return res;
    };
    useEffect(() => {
        let AllJobIDs = {
            jobIds: internalJobsRes?.jobs?.map((e) => {
                return e.jobid
            })
        }
        dispatch(empInternalStatisticsDatas(AllJobIDs));
    }, [internalJobsRes?.jobs])

    useEffect(() => {
        if (updateInterjobsSts?.code === 200) {
            showSnackAlert("success", updateInterjobsSts.message);
            dispatch(resetUpdateIntJobSts());
            // dispatch(empInternalStatisticsDatas());
            const JobListOptions = {
                mode: "minimal",
                pageId: 1,
                search: "",
                jobid: null,
                pageLimit: 10,
                status: [],
            };
            dispatch(internalJobsData(JobListOptions));
        } else if (updateInterjobsSts?.response?.data?.code === 400) {
            showSnackAlert(
                "warning",
                updateInterjobsSts?.response?.data?.message
            );
            dispatch(resetUpdateIntJobSts());
        } else if (updateInterjobsSts?.response?.data?.code === 500) {
            showSnackAlert(
                "error",
                updateInterjobsSts?.response?.data?.message
            );
            dispatch(resetUpdateIntJobSts());
        }
    }, [updateInterjobsSts]);

    useEffect(() => { }, [size, currentpage, displayData]);

    return (
        <>
            {internalJobLoading && <JobCard_Skl />}
            {!internalJobLoading && (
                <div className="col-lg-12 col-md-12">
                    <ul className="post-job-bx browse-job-grid row">
                        {displayData?.length > 0 &&
                            displayData?.map((item: any, index: any) => {
                                return (
                                    <span
                                        className="col-lg-12 col-md-12"
                                        key={index}
                                        style={{ marginBottom: "25px" }}
                                    >
                                        <div
                                            className="post-bx"
                                            id="Custom-CardBackgrdColor"
                                        >
                                            <div className="">
                                                <div className="job-post-info">
                                                    <div className="d-flex justify-content-between">
                                                        <div className="row">
                                                            <div className="col-lg-12 col-sm-12 pb-12">
                                                                <h5>
                                                                    <Tooltip
                                                                        title={`${item?.title}`}
                                                                        arrow
                                                                    >
                                                                        <Link
                                                                            to={`/jobs/inr/previewjob/${item?.jobid}`}
                                                                        >
                                                                            {Content(
                                                                                item.title
                                                                                    .charAt(
                                                                                        0
                                                                                    )
                                                                                    .toUpperCase() +
                                                                                item.title.slice(
                                                                                    1
                                                                                ),
                                                                                20
                                                                            )}
                                                                            &nbsp;
                                                                        </Link>
                                                                    </Tooltip>
                                                                    <span
                                                                        style={{
                                                                            fontSize:
                                                                                "10px",
                                                                            height: "16px",
                                                                        }}
                                                                        className="badge badge-primary "
                                                                    >
                                                                        {item?.job_type ===
                                                                            "INTERNAL JOB"
                                                                            ? "Internal Job"
                                                                            : "Referral Job"}
                                                                    </span>{" "}
                                                                    <span
                                                                        style={{
                                                                            fontSize:
                                                                                "10px",
                                                                            height: "16px",
                                                                        }}
                                                                        className={
                                                                            checkStatus(
                                                                                item
                                                                                    ?.status
                                                                                    ?.value,
                                                                                item?.end_date
                                                                            )
                                                                                .color
                                                                        }
                                                                    >
                                                                        {
                                                                            checkStatus(
                                                                                item
                                                                                    ?.status
                                                                                    ?.value,
                                                                                item?.end_date
                                                                            )
                                                                                .res
                                                                        }
                                                                    </span>{" "}
                                                                    <span
                                                                        style={{
                                                                            fontSize:
                                                                                "10px",
                                                                            height: "16px",
                                                                        }}
                                                                        className="badge badge-primary"
                                                                    >
                                                                        {checkRepost(
                                                                            checkStatus(
                                                                                item
                                                                                    ?.status
                                                                                    ?.value,
                                                                                item?.end_date
                                                                            )
                                                                                .res,
                                                                            item.created_at,
                                                                            item.updated_at
                                                                        )}
                                                                    </span>
                                                                </h5>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex justify-content-between">
                                                            <label
                                                                style={{
                                                                    color: "black",
                                                                }}
                                                            >
                                                                <span className="custom-job-content">
                                                                    Total
                                                                    Responses:
                                                                </span>{" "}
                                                                <Tooltip
                                                                    title={
                                                                        "total responses"
                                                                    }
                                                                    arrow
                                                                >
                                                                    <span
                                                                        style={{
                                                                            fontWeight:
                                                                                "500",
                                                                            cursor: "pointer",
                                                                            width: "18px",
                                                                        }}
                                                                        className="badge badge-primary "
                                                                        onClick={() => {
                                                                            if (
                                                                                item?.totalResponse
                                                                            )
                                                                                navigate(
                                                                                    `/jobs/ijp-rjp-applications?id=${item?.jobid}`
                                                                                );
                                                                        }}
                                                                    >
                                                                        {item?.totalResponse
                                                                            ? item?.totalResponse
                                                                            : 0}
                                                                    </span>
                                                                </Tooltip>
                                                                &nbsp;
                                                            </label>
                                                        </div>
                                                        <div className="d-flex justify-content-between">
                                                            <label>
                                                                <span className="custom-job-content">
                                                                    Shortlisted:
                                                                </span>{" "}
                                                                <Tooltip
                                                                    title={
                                                                        "shortlisted"
                                                                    }
                                                                    arrow
                                                                >
                                                                    <span
                                                                        style={{
                                                                            fontWeight:
                                                                                "500",
                                                                            cursor: "pointer",
                                                                            width: "18px",
                                                                        }}
                                                                        className="badge badge-primary "
                                                                        onClick={() => {
                                                                            if (
                                                                                item?.shortListed
                                                                            )
                                                                                navigate(
                                                                                    `/jobs/ijp-rjp-applications?id=${item?.jobid}&is=1`
                                                                                );
                                                                        }}
                                                                    >
                                                                        {item?.shortListed
                                                                            ? item?.shortListed
                                                                            : 0}
                                                                    </span>
                                                                </Tooltip>
                                                                &nbsp;
                                                            </label>
                                                        </div>
                                                        <div className="d-flex justify-content-between">
                                                            {item?.totalResponse && (
                                                                <Link
                                                                    to={""}
                                                                    id="down-icon"
                                                                    download="filename.csv"
                                                                    onClick={() => {
                                                                        const JobApplicants =
                                                                        {
                                                                            jobid: item.jobid,
                                                                        };
                                                                        dispatch(
                                                                            intTotalJobApplicantsData(
                                                                                JobApplicants
                                                                            )
                                                                        );
                                                                    }}
                                                                >
                                                                    <BsCloudDownload
                                                                        style={{
                                                                            cursor: "pointer",
                                                                        }}
                                                                        title="Download total applicants"
                                                                    />
                                                                </Link>
                                                            )}
                                                            &nbsp;
                                                        </div>
                                                    </div>
                                                    <ul>
                                                        {item?.alias && (
                                                            <li
                                                                key={
                                                                    item?.alias
                                                                }
                                                            >
                                                                <HiOutlineTicket className="custom-job-icon" />
                                                                &nbsp;
                                                                <span className="custom-job-content">
                                                                    Ref-Id :{" "}
                                                                    {
                                                                        item?.alias
                                                                    }
                                                                </span>
                                                            </li>
                                                        )}
                                                        <li
                                                            key={item?.location}
                                                        >
                                                            <ImLocation className="custom-job-icon" />
                                                            &nbsp;
                                                            <Tooltip
                                                                title={`${item?.location}`}
                                                                arrow
                                                            >
                                                                <span className="custom-job-content">
                                                                    {Content(
                                                                        item?.location.join(
                                                                            "| "
                                                                        ),
                                                                        120
                                                                    )}
                                                                </span>
                                                            </Tooltip>
                                                        </li>
                                                        <li
                                                            key={item?.exp?.max}
                                                        >
                                                            <FaShoppingBag className="custom-job-icon" />
                                                            &nbsp;
                                                            <span className="custom-job-content">
                                                                {`${item?.exp?.min}-${item?.exp?.max} years`}
                                                            </span>
                                                        </li>
                                                        <li key={item?.skills}>
                                                            <MdMilitaryTech className="custom-job-icon" />
                                                            &nbsp;
                                                            <Tooltip
                                                                title={`${item?.skills}`}
                                                                arrow
                                                            >
                                                                <span className="custom-job-content text-break">
                                                                    {Content(
                                                                        item?.skills
                                                                            ?.toString()
                                                                            ?.replaceAll(
                                                                                ",",
                                                                                " | "
                                                                            ),
                                                                        120
                                                                    )}
                                                                </span>
                                                            </Tooltip>
                                                        </li>
                                                        {/* <li
                                                            key={
                                                                item?.job_desc
                                                                    ?.value
                                                            }
                                                        >
                                                            <MdDescription className="custom-job-icon mr-1" />
                                                            <Tooltip
                                                                title={`${convertHtmlToText(
                                                                    item
                                                                        ?.job_desc
                                                                        ?.value
                                                                )}`}
                                                                arrow
                                                            >
                                                                <span className="custom-job-content text-break">
                                                                    {convertHtmlToText(
                                                                        item
                                                                            ?.job_desc
                                                                            ?.value
                                                                    )
                                                                        ? Content(
                                                                              convertHtmlToText(
                                                                                  item
                                                                                      ?.job_desc
                                                                                      ?.value
                                                                              ),
                                                                              130
                                                                          )
                                                                        : "Not available"}
                                                                </span>
                                                            </Tooltip>
                                                        </li> */}
                                                        {item?.start_date && (
                                                            <span
                                                                key={
                                                                    item?.start_date
                                                                }
                                                            >
                                                                <TbCalendar className="custom-job-icon" />
                                                                &nbsp;
                                                                <>
                                                                    <span className="custom-job-content">
                                                                        Application
                                                                        starts
                                                                        from
                                                                    </span>{" "}
                                                                    <span
                                                                        className="custom-job-content"
                                                                        style={{
                                                                            fontWeight:
                                                                                "500",
                                                                        }}
                                                                    >
                                                                        {getTimestampToDate(
                                                                            item?.start_date
                                                                        )}
                                                                    </span>{" "}
                                                                    <span className="custom-job-content">
                                                                        to
                                                                    </span>{" "}
                                                                    <span
                                                                        className="custom-job-content"
                                                                        style={{
                                                                            fontWeight:
                                                                                "500",
                                                                        }}
                                                                    >
                                                                        {getTimestampToDate(
                                                                            item?.end_date
                                                                        )}
                                                                    </span>
                                                                </>
                                                            </span>
                                                        )}

                                                        <div className="d-flex justify-content-between">
                                                            <div className="row">
                                                                <div className="col-lg-12 col-sm-12 pb-12">
                                                                    <li>
                                                                        <span className="custom-timeDiff">
                                                                            &nbsp;
                                                                            {checkRepost(
                                                                                checkStatus(
                                                                                    item
                                                                                        ?.status
                                                                                        ?.value,
                                                                                    item?.end_date
                                                                                )
                                                                                    .res,
                                                                                item?.created_at,
                                                                                item?.updated_at
                                                                            ) ===
                                                                                "Reposted"
                                                                                ? "Reposted "
                                                                                : "Posted "}
                                                                            {getDateDifference(
                                                                                checkRepost(
                                                                                    checkStatus(
                                                                                        item
                                                                                            ?.status
                                                                                            ?.value,
                                                                                        item?.end_date
                                                                                    )
                                                                                        .res,
                                                                                    item?.created_at,
                                                                                    item?.updated_at
                                                                                ) ===
                                                                                    "Reposted"
                                                                                    ? item?.updated_at
                                                                                    : item?.created_at
                                                                            )}
                                                                        </span>{" "}
                                                                    </li>
                                                                </div>
                                                            </div>
                                                            {item?.status
                                                                ?.value ===
                                                                "CLOSE" ? (
                                                                <div className="d-flex justify-content-between">
                                                                    <div className="d-flex justify-content-between">
                                                                        <Tooltip
                                                                            title={
                                                                                "Repost job"
                                                                            }
                                                                            arrow
                                                                        >
                                                                            <div className="row">
                                                                                <button
                                                                                    type="button"
                                                                                    title="Repost job"
                                                                                    className="btn btn-sm btn-primary custom-Btns"
                                                                                    onClick={() => {
                                                                                        if (
                                                                                            item?.job_type ===
                                                                                            "INTERNAL JOB"
                                                                                        ) {
                                                                                            navigate(
                                                                                                `/postjob/internaljob/${item?.jobid}`
                                                                                            );
                                                                                        } else {
                                                                                            navigate(
                                                                                                `/postjob/referaljob/${item?.jobid}`
                                                                                            );
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    Repost
                                                                                    Job
                                                                                </button>
                                                                                &nbsp;
                                                                            </div>
                                                                        </Tooltip>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <Tooltip
                                                                    title={
                                                                        "Close"
                                                                    }
                                                                    arrow
                                                                >
                                                                    <div className="row">
                                                                        <button
                                                                            type="button"
                                                                            title="Close"
                                                                            className="btn btn-sm btn-danger custom-Btns"
                                                                            onClick={() => {
                                                                                setClosedId(
                                                                                    item?.jobid
                                                                                );
                                                                                setDisModal(
                                                                                    true
                                                                                );
                                                                            }}
                                                                        >
                                                                            Close
                                                                        </button>
                                                                        &nbsp;
                                                                    </div>
                                                                </Tooltip>
                                                            )}
                                                        </div>
                                                    </ul>
                                                </div>
                                                <div></div>
                                            </div>
                                        </div>
                                    </span>
                                );
                            })}
                    </ul>
                </div>
            )}
            <div>
                <Modal
                    show={disModal}
                    onHide={() => {
                        setDisModal(false);
                    }}
                    className="modal fade modal-bx-info editor"
                >
                    <div
                        className="modal-dialog my-0  mx-0 w-100 "
                        role="document"
                    >
                        <div className="modal-content" id="closeContent">
                            <div className="modal-header" id="closeHeader">
                                {" "}
                                <h5 className="modal-title" id="closeTitle">
                                    {" "}
                                    Close Job Confirmation{" "}
                                </h5>{" "}
                                <button
                                    style={{ color: "white" }}
                                    type="button"
                                    className="close"
                                    onClick={() => {
                                        setDisModal(false);
                                        setClosedId("");
                                        setClosedJob("");
                                    }}
                                >
                                    {" "}
                                    <i
                                        style={{ color: "white" }}
                                        className="fa fa-times"
                                        aria-hidden="true"
                                    ></i>{" "}
                                </button>{" "}
                            </div>
                            <div className="modal-body">
                                <h6>
                                    Please let us know why you are closing this
                                    job
                                </h6>
                                <input
                                    type="radio"
                                    value={"Postion filled"}
                                    id="close1"
                                    name="closeRd"
                                    onChange={(e: any) => {
                                        e.target.checked
                                            ? setClosedJob("Postion filled")
                                            : setClosedJob("");
                                    }}
                                />{" "}
                                <label htmlFor="close1">Position filled</label>{" "}
                                <br />
                                <input
                                    type="radio"
                                    value={"Postion not filled"}
                                    id="close2"
                                    name="closeRd"
                                    onChange={(e: any) => {
                                        e.target.checked
                                            ? setClosedJob("Postion not filled")
                                            : setClosedJob("");
                                    }}
                                />{" "}
                                <label htmlFor="close2">
                                    Position not filled
                                </label>{" "}
                                <br />
                                <input
                                    type="radio"
                                    value={
                                        "Postion on hold/cancelled by client"
                                    }
                                    id="close3"
                                    name="closeRd"
                                    onChange={(e: any) => {
                                        e.target.checked
                                            ? setClosedJob(
                                                "Postion on hold/cancelled by client"
                                            )
                                            : setClosedJob("");
                                    }}
                                />{" "}
                                <label htmlFor="close3">
                                    Position on hold/cancelled by client
                                </label>{" "}
                                <br />
                                <input
                                    type="radio"
                                    value={"None of the above options"}
                                    id="close4"
                                    name="closeRd"
                                    onChange={(e: any) => {
                                        e.target.checked
                                            ? setClosedJob(
                                                "None of the above options"
                                            )
                                            : setClosedJob("");
                                    }}
                                />{" "}
                                <label htmlFor="close4">
                                    None of the above options
                                </label>
                                <br />
                                <h6>Note:</h6>
                                The selected Job will be removed from the site.
                                It will still be available as an closed job in
                                your account.
                            </div>
                            <div className="modal-footer">
                                <button
                                    disabled={closeJob ? false : true}
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => {
                                        closeHandler();
                                    }}
                                >
                                    Close Job
                                </button>
                                <button
                                    type="button"
                                    className="site-button site-warning-button"
                                    onClick={() => {
                                        setDisModal(false);
                                        setClosedId("");
                                        setClosedJob("");
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
            {!internalJobLoading &&
                internalJobsRes?.jobs &&
                internalJobsRes?.jobs?.length === 0 && (
                    <center>
                        {" "}
                        <div className="col-lg-6">
                            {" "}
                            <img src={notfoundImg} alt="" />{" "}
                            <h6
                                style={{ fontSize: "13px", fontWeight: "bold" }}
                            >
                                {" "}
                                Oops no record found.{" "}
                            </h6>
                        </div>
                    </center>
                )}

            {!internalJobLoading &&
                internalJobsRes?.jobs &&
                internalJobsRes?.jobs?.length !== 0 && (
                    <div className="pagination-bx float-right m-b30  m-t20">
                        <Pagination
                            className="pagination-data"
                            onChange={PaginationChange}
                            total={internalJobsRes?.totalCount}
                            current={currentpage}
                            pageSize={size}
                            showSizeChanger={true}
                            itemRender={PrevNextArrow}
                            onShowSizeChange={PerPageChange}
                        />
                    </div>
                )}
        </>
    );
}

export default JobCard;
