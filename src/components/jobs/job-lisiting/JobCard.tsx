import React, { lazy, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import { ImLocation } from "react-icons/im";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { FaFire, FaShoppingBag } from "react-icons/fa";
import { MdDescription } from "react-icons/md";
import { GiMoneyStack } from "react-icons/gi";
import { MdMilitaryTech } from "react-icons/md";

import {
  formatNumberToSalary,
  getDateDifference,
  Content,
  convertHtmlToText,
  openInNewTab,
} from "../../../common/common";
import { Tooltip } from "@mui/material";
import {
  PatchSaveUnSaveJob,
  resetSaveUnsaveCreator,
} from "../../../redux/features/jobs/saved-jobs/SavedJobsSlice";
import {
  authfindJob,
  findJob,
  resetAuthJobSearchCreator,
  resetJobSearchCreator,
} from "../../../redux/features/jobs/job-listing/JobListingSlice";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import { environment } from "../../../environments/environment";
import JobCard_Sk from "./JobCard_Sk";

const Pagination = lazy(() => import("rc-pagination"));

function JobCard(dataProp) {
  var notfoundImg = require("../../../assets/images/background/No-record.png");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { res, loading } = useSelector((state: any) => state.findJob);
  const { response, load } = useSelector((state: any) => state.authfindJob);
  const showSnackAlert = UseToastAlert();
  const { saveOrUnsave, loadingSave } = useSelector(
    (state: any) => state.PatchSaveUnSaveJobSlice
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const [currentpage, setCurrentPage] = useState(1),
    [perPage, setPerPage] = useState(12),
    [size, setSize] = useState(perPage);

  const isLoggedIn = sessionStorage.getItem("access_token") ? true : false;
  const dynamicRes = isLoggedIn ? response : res;
  const dynamicLoading = isLoggedIn ? load : loading;

  const handleClickScroll = () => {
    const element = document.getElementById("section-II");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const PerPageChange = (value: any) => {
    setSize(value);
    if (dynamicRes?.data?.jobs) {
      Math.ceil(dynamicRes?.data?.totalCount / value);
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
          <i className="ti-arrow-left"></i> Prev{" "}
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
          Next <i className="ti-arrow-right"></i>{" "}
        </button>
      );
    }
    return originalElement;
  };
  const handleSaveClick = (jobid: any, status: string) => {
    sessionStorage.setItem("jobid", jobid);
    if (!sessionStorage.getItem("access_token")) {
      navigate({
        pathname: "/jobSeekerSignin",
      });
    } else {
      const datamdl = {
        jobSeekerResp: {
          jobid: jobid,
          status:
            status === "SAVED" || status === "save" || status === "SAVE"
              ? "DELETE"
              : "SAVE",
        },
      };
      dispatch(PatchSaveUnSaveJob(datamdl));
    }
  };

  const PaginationChange = (page: any, pageSize: any) => {
    setCurrentPage(page);
    setSize(pageSize);
    const paginatedJobmdl = {
      mode: "minimal",
      pageid: page,
      title: dataProp?.dataProp?.data?.title,
      jobid: dataProp?.dataProp?.data?.jobid,
      location: dataProp?.dataProp?.data?.location,
      industry: dataProp?.dataProp?.data?.industry,
      pageLimit: 12,
    };
    isLoggedIn
      ? dispatch(authfindJob(paginatedJobmdl))
      : dispatch(findJob(paginatedJobmdl));

    handleClickScroll();
  };

  useEffect(() => {}, [size, currentpage]);

  useEffect(() => {
    if (saveOrUnsave && saveOrUnsave?.code && saveOrUnsave?.code === 200) {
      const paginatedJobmdl = {
        mode: "minimal",
        pageid: currentpage,
        title: dataProp?.dataProp?.data?.title,
        jobid: dataProp?.dataProp?.data?.jobid,
        location: dataProp?.dataProp?.data?.location,
        industry: dataProp?.dataProp?.data?.industry,
      };
      isLoggedIn
        ? dispatch(authfindJob(paginatedJobmdl))
        : dispatch(findJob(paginatedJobmdl));
      showSnackAlert("success", saveOrUnsave?.message);
      dispatch(resetSaveUnsaveCreator());
    } else if (
      saveOrUnsave?.response &&
      saveOrUnsave?.response?.data &&
      saveOrUnsave?.response?.data?.code !== 200
    ) {
      showSnackAlert("warning", saveOrUnsave?.response?.data?.message);
      dispatch(resetSaveUnsaveCreator());
    }
  }, [saveOrUnsave, saveOrUnsave?.code]);

  useEffect(() => {
    if (dynamicRes?.response?.status !== undefined) {
      showSnackAlert("warning", dynamicRes?.response?.statusText);
      isLoggedIn
        ? dispatch(resetAuthJobSearchCreator())
        : dispatch(resetJobSearchCreator());
    }
  }, [dynamicRes, dynamicRes?.response?.status]);
  const textLimit = 70;

  return (
    <>
      <div className="content-block">
        {dynamicRes?.data &&
          dynamicRes?.data?.jobs?.length === 0 &&
          !dynamicLoading && (
            <center>
              <div className="col-lg-6">
                <img src={notfoundImg} alt="" />
                <h6 style={{ fontSize: "13px", fontWeight: "bold" }}>
                  Oops no jobs found.
                </h6>
              </div>
            </center>
          )}

        {dynamicRes?.data?.jobs &&
          dynamicRes?.data?.jobs?.length > 0 &&
          !dynamicLoading && (
            <div ref={inputRef} id="section-II">
              <>
                <ul className="post-job-bx browse-job-grid row">
                  {dynamicRes?.data?.jobs?.map((item, index) => (
                    <li className="col-lg-6 col-md-6" key={index}>
                      <div
                        className="post-bx"
                        style={{ backgroundColor: "white" }}
                      >
                        <div className="d-flex justify-content-between">
                          <div>
                            <h5>
                              {item.job_type === "HOT JOB" ? (
                                <Tooltip title="hot jobs">
                                  <span
                                    style={{ color: "red", fontSize: "80%" }}
                                    className="mr-1"
                                  >
                                    <FaFire />
                                  </span>
                                </Tooltip>
                              ) : (
                                ""
                              )}
                              <Link
                                to={
                                  sessionStorage.access_token
                                    ? `/jobs/js/previewjob/${item.jobid}`
                                    : `/jobs/public/previewjob/${item.jobid}`
                                }
                                className="mr-1"
                                style={{ textDecoration: "none" }}
                              >
                                {item?.title
                                  ? item.title.charAt(0).toUpperCase() +
                                    item.title.slice(1)
                                  : "Not available"}
                              </Link>

                              {item?.walkin?.end_ts && (
                                <span
                                  style={{
                                    fontSize: "10px",
                                    height: "18px",
                                  }}
                                  className="badge badge-primary "
                                >
                                  Walk In
                                </span>
                              )}
                            </h5>
                          </div>
                          <div>
                            {item?.application_status?.self === "save" ||
                            item?.application_status?.self === "SAVED" ||
                            item?.application_status?.self === "SAVE" ? (
                              <Tooltip title="Unsave job" arrow>
                                <BookmarkAddedIcon
                                  color="primary"
                                  sx={{ cursor: "pointer" }}
                                  onClick={() => {
                                    handleSaveClick(
                                      item?.jobid,
                                      item?.application_status?.self
                                    );
                                  }}
                                />
                              </Tooltip>
                            ) : (
                              <Tooltip title="Save job" arrow>
                                <BookmarkBorderIcon
                                  sx={{ cursor: "pointer" }}
                                  color="primary"
                                  id={item?.jobid}
                                  onClick={() => {
                                    handleSaveClick(
                                      item?.jobid,
                                      item?.application_status?.self
                                    );
                                  }}
                                />
                              </Tooltip>
                            )}
                          </div>
                        </div>
                        <div className="d-flex m-b30">
                          <div
                            className="job-post-info"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              sessionStorage.setItem("jobid", item.jobid);
                              sessionStorage.access_token
                                ? navigate({
                                    pathname: `/jobs/js/previewjob/${item.jobid}`,
                                  })
                                : navigate({
                                    pathname: `/jobs/public/previewjob/${item.jobid}`,
                                  });
                            }}
                          >
                            <>
                              <HiBuildingOffice2
                                className="custom-job-icon"
                                title="Company Name"
                              />
                              &nbsp;
                              <span className="custom-job-content">
                                {item?.employer?.company_name
                                  ? Content(
                                      item?.employer?.company_name,
                                      textLimit
                                    )
                                  : "Not Available"}
                              </span>
                              &nbsp;
                            </>
                            <ul>
                              <li>
                                <FaShoppingBag
                                  className="custom-job-icon"
                                  title="Experience"
                                />
                                &nbsp;
                                <span className="custom-job-content">
                                  {`${
                                    item?.exp?.max
                                      ? item?.exp?.min || "0"
                                      : item?.exp?.min || "Not available"
                                  }-${
                                    item?.exp?.max
                                      ? `${item.exp.max} years`
                                      : "Not available"
                                  } `}
                                </span>
                              </li>
                              <li>
                                <ImLocation
                                  className="custom-job-icon"
                                  title="Location"
                                />
                                &nbsp;
                                <Tooltip title={`${item?.location}`} arrow>
                                  <span className="custom-job-content">
                                    {Content(
                                      item?.location
                                        ? item?.location?.toString()
                                        : "Not available",
                                      textLimit
                                    )}
                                  </span>
                                </Tooltip>
                              </li>
                              <li>
                                <MdMilitaryTech
                                  className="custom-job-icon"
                                  title="Skills"
                                />
                                &nbsp;
                                <Tooltip title={`${item?.skills}`} arrow>
                                  <span className="custom-job-content text-break">
                                    {Content(
                                      item?.skills
                                        ? item?.skills
                                            ?.toString()
                                            ?.replaceAll(",", " | ")
                                        : "Not available",
                                      textLimit
                                    )}
                                  </span>
                                </Tooltip>
                              </li>

                              <li>
                                <MdDescription
                                  className="custom-job-icon"
                                  title="Description"
                                />
                                &nbsp;
                                <Tooltip
                                  title={
                                    convertHtmlToText(item?.job_desc)
                                      ? convertHtmlToText(item?.job_desc)
                                      : "Not available"
                                  }
                                  arrow
                                >
                                  <span className="custom-job-content text-break">
                                    {convertHtmlToText(item?.job_desc)
                                      ? Content(
                                          convertHtmlToText(item?.job_desc),
                                          textLimit
                                        )
                                      : "Not available"}
                                  </span>
                                </Tooltip>
                              </li>

                              <li>
                                <GiMoneyStack
                                  className="custom-job-icon"
                                  title="Salary"
                                />
                                &nbsp;
                                {item?.salary?.visible === true ? (
                                  <span className="custom-job-content">{`${
                                    item?.salary?.min
                                      ? item?.salary?.currency === "INR"
                                        ? "₹"
                                        : "$"
                                      : ""
                                  }${
                                    item?.salary?.min
                                      ? formatNumberToSalary(item?.salary?.min)
                                      : "Not Disclosed"
                                  }${item?.salary?.min ? "-" : ""}${
                                    item?.salary?.max
                                      ? formatNumberToSalary(item?.salary?.max)
                                      : ""
                                  } `}</span>
                                ) : (
                                  <span className="custom-job-content">
                                    Not Disclosed
                                  </span>
                                )}
                              </li>
                            </ul>
                            <span className="custom-timeDiff">
                              &nbsp; Posted{" "}
                              {getDateDifference(item?.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            </div>
          )}

        {dynamicLoading && <JobCard_Sk />}

        {dynamicRes?.data?.jobs &&
          dynamicRes?.data?.jobs?.length > 0 &&
          !dynamicLoading && (
            <div className="pagination-bx float-right m-t10">
              <Pagination
                className="pagination-data"
                onChange={PaginationChange}
                total={dynamicRes?.data?.totalCount}
                current={currentpage}
                pageSize={size}
                showSizeChanger={true}
                itemRender={PrevNextArrow}
                onShowSizeChange={PerPageChange}
              />
            </div>
          )}
      </div>
    </>
  );
}

export default JobCard;
