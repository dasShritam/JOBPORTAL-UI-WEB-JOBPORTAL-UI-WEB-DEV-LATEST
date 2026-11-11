import { Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import "../../../../assets/customCss/Pagination.css";
import { HiOutlineTicket } from "react-icons/hi2";
import { ImLocation } from "react-icons/im";
import Pagination from "rc-pagination";
import { MdMilitaryTech } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { FaShoppingBag } from "react-icons/fa";
import { TbCalendar } from "react-icons/tb";
import { UseToastAlert } from "../../../../hooks/useToastAlert";
import { DaftJobCard_Skl } from "../JobCard_Sk";
import {
    Content,
    getDateDifference,
    getTimestampToDate,
} from "../../../../common/common";
import {
    internalJobsData,
    resetUpdateIntJobSts,
    updateInternalJobStatus,
} from "../../../../redux/features/jobs/manage-jobs/MangeJobs-rjp-ijpSlice";

var notfoundImg = require("../../../../assets/images/background/No-record.png");

function DraftJobCard() {
    const dispatch = useDispatch();
    const internalJobList = useSelector((state: any) => state.InternalJobs);
    const { internalJobsRes, internalJobLoading } = internalJobList;

    const updateIntJobSts = useSelector(
        (state: any) => state.UpdateIntJobStatus
    );
    const { updateInterjobsSts } = updateIntJobSts;

    useEffect(() => {}, [internalJobsRes]);

    const showSnackAlert = UseToastAlert();
    const navigate = useNavigate();
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

    const fetchDraftJobs = (page?: number) => {
        const JobListOptions = {
            mode: "minimal",
            pageId: page ? page : 1,
            jobid: null,
            search: "",
            pageLimit: 10,
            status: ["DRAFT"],
        };
        dispatch(internalJobsData(JobListOptions));
    };
    const PaginationChange = (page: any, pageSize: any) => {
        setCurrentPage(page);
        setSize(pageSize);
        fetchDraftJobs(page);
    };
    const getData = (current: any, pageSize: any) => {
        return internalJobsRes.slice(
            (current - 1) * pageSize,
            current * pageSize
        );
    };
    useEffect(() => {}, [size, currentpage]);

    function handleDeleteSwal(id: any) {
        Swal.fire({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this record!",
            showCancelButton: true,
            confirmButtonColor: "#2a9f2a ",
            cancelButtonColor: "#db1919 ",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                const deleteInfo = {
                    status: "DELETE",
                    jobid: [id],
                    remarks: "",
                };
                dispatch(updateInternalJobStatus(deleteInfo));
            }
        });
    }

    useEffect(() => {
        if (updateInterjobsSts?.code === 200) {
            showSnackAlert("success", updateInterjobsSts.message);
            fetchDraftJobs();
            dispatch(resetUpdateIntJobSts());
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

    return (
        <>
            <div className="col-lg-12 col-md-12">
                {internalJobLoading && <DaftJobCard_Skl />}
                {!internalJobLoading && (
                    <ul className="post-job-bx browse-job-grid row justi">
                        {internalJobsRes?.jobs?.length > 0 &&
                            internalJobsRes?.jobs?.map(
                                (item: any, index: any) => {
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
                                                        {/* <div className="d-flex justify-content-between"> */}

                                                        <div
                                                            className="col-lg-12 col-sm-12 pb-12"
                                                            style={{
                                                                marginRight:
                                                                    "43px",
                                                            }}
                                                        >
                                                            <div className="row">
                                                                <div className="">
                                                                    <h5>
                                                                        {" "}
                                                                        {item?.title
                                                                            .charAt(
                                                                                0
                                                                            )
                                                                            .toUpperCase() +
                                                                            item?.title.slice(
                                                                                1
                                                                            )}{" "}
                                                                        &nbsp;
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
                                                                        </span>
                                                                    </h5>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* </div> */}
                                                        <div className="col-lg-12 col-sm-12 pb-12">
                                                            <div className="row">
                                                                {item?.alias && (
                                                                    <li>
                                                                        <HiOutlineTicket className="custom-job-icon" />
                                                                        &nbsp;
                                                                        <span className="custom-job-content">
                                                                            Ref-Id
                                                                            :{" "}
                                                                            {
                                                                                item?.alias
                                                                            }
                                                                        </span>
                                                                    </li>
                                                                )}
                                                                <li
                                                                    key={
                                                                        item?.location
                                                                    }
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
                                                                    key={
                                                                        item
                                                                            ?.exp
                                                                            ?.min
                                                                    }
                                                                >
                                                                    <FaShoppingBag className="custom-job-icon" />
                                                                    &nbsp;
                                                                    <span className="custom-job-content">
                                                                        {`${item?.exp?.min}-${item?.exp?.max} years`}
                                                                    </span>
                                                                </li>
                                                                <li
                                                                    key={
                                                                        item?.skills
                                                                    }
                                                                >
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
                                                                                128
                                                                            )}
                                                                        </span>
                                                                    </Tooltip>
                                                                </li>
                                                                {/* <li
                                                                    key={
                                                                        item?.job_desc
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
                                                                                      125
                                                                                  )
                                                                                : "Not available"}
                                                                        </span>
                                                                    </Tooltip>
                                                                </li> */}

                                                                {item?.start_date && (
                                                                    <span
                                                                        style={{
                                                                            color: "black",
                                                                        }}
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
                                                                                {
                                                                                    // new Date(
                                                                                    //   parseInt(item?.walkin?.start_ts) *
                                                                                    //     1000
                                                                                    // )
                                                                                    //   .toISOString()
                                                                                    //   .split("T")[0]
                                                                                    getTimestampToDate(
                                                                                        item?.start_date
                                                                                    )
                                                                                }
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
                                                            </div>
                                                        </div>
                                                        <div className="d-flex justify-content-between">
                                                            <div className="row">
                                                                <div className="col-lg-12 col-sm-12 pb-12">
                                                                    <ul>
                                                                        <li
                                                                            key={
                                                                                item?.created_at
                                                                            }
                                                                        >
                                                                            <span className="custom-timeDiff">
                                                                                &nbsp;
                                                                                Created{" "}
                                                                                {getDateDifference(
                                                                                    item?.created_at
                                                                                )}
                                                                            </span>{" "}
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                            <div className="">
                                                                <button
                                                                    type="button"
                                                                    title="Edit"
                                                                    className="btn btn-sm btn-primary"
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
                                                                    Edit
                                                                </button>
                                                                &nbsp;
                                                                <button
                                                                    type="button"
                                                                    title="Delete"
                                                                    className="btn btn-sm btn-danger"
                                                                    onClick={() => {
                                                                        handleDeleteSwal(
                                                                            item?.jobid
                                                                        );
                                                                    }}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </span>
                                    );
                                }
                            )}
                    </ul>
                )}
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
                            </h6>{" "}
                        </div>{" "}
                    </center>
                )}

            {!internalJobLoading &&
                internalJobsRes?.jobs &&
                internalJobsRes?.jobs?.length !== 0 && (
                    <div className="pagination-bx float-right m-b30 m-t20">
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

export default DraftJobCard;
