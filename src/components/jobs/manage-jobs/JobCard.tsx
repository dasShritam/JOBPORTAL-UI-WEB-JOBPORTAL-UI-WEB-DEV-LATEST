import { useEffect, useState } from "react";
import { MdMilitaryTech } from "react-icons/md";
import { TbCalendar } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { ImLocation } from "react-icons/im";
import { HiOutlineTicket } from "react-icons/hi";
import Pagination from "rc-pagination";
import "../../../assets/customCss/Pagination.css";
import { Modal } from "react-bootstrap";
import "../../../assets/customCss/jobs/manage-jobs.css";
import { useDispatch, useSelector } from "react-redux";
import {
  Content,
  convertTo12HourFormat,
  getDateDifference,
  getTimestampToDate,
} from "../../../common/common";
import {
  empStatisticsDatas,
  manageJobsData,
  resetUpdateStatus,
  totalJobApplicantsData,
  updateJobStatus,
} from "../../../redux/features/jobs/manage-jobs/ManageJobsSlice";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import { Tooltip } from "@mui/material";
import { FaShoppingBag } from "react-icons/fa";
import { IoTime } from "react-icons/io5";
import { JobCard_Skl } from "./JobCard_Sk";
import { BsCloudDownload } from "react-icons/bs";
var notfoundImg = require("../../../assets/images/background/No-record.png");
type initialState = {
  filterData?: any;
};
function JobCard({ filterData }: initialState) {
  const [closeJob, setClosedJob] = useState("");
  const [closedId, setClosedId] = useState("");
  const dispatch = useDispatch();
  const listingJob = useSelector((state: any) => state.ManageJobs);
  const { allManageJobs, manageJobLoading } = listingJob;

  const totalCounts = useSelector((state: any) => state.EmpStatisticsData);
  const { empStatisticsData } = totalCounts;
  useEffect(() => {
    if (allManageJobs?.code === 200) {
      setCurrentPage(1);
    }
  }, [allManageJobs]);
  useEffect(() => { }, [allManageJobs, closedId, empStatisticsData]);

  const totalApplicants = useSelector(
    (state: any) => state.TotalJobsApplicants
  );
  const { totalJobsApplicants } = totalApplicants;

  const updatedStatus = useSelector((state: any) => state.UpdateJobsData);
  const { updatejobsStatus } = updatedStatus;
  const [displayData, setDisplayData] = useState<any>([]);
  useEffect(() => {
    let combinedData: any = [];
    allManageJobs?.jobs?.map((e: any) => {
      let res = { ...e };
      empStatisticsData?.actions?.applicants_lstRpt?.map((a: any) => {
        if (e.jobid === a._id) {
          res.totalResponse = a.count;
        }
        empStatisticsData?.actions?.shortListedRpt?.map((b: any) => {
          if (e.jobid === b._id) {
            res.shortListed = b.count;
          }
        });
      });
      combinedData.push(res);
    });
    setDisplayData([...combinedData]);
  }, [allManageJobs, empStatisticsData]);
  useEffect(() => { });
  const fetchData = () => {
    const JobListOptions = {
      mode: "minimal",
      pageid: 1,
      title: "",
      jobid: "",
      status: ["PUBLISH", "CLOSE"],
    };
    dispatch(manageJobsData(JobListOptions));
  };
  const showSnackAlert = UseToastAlert();
  const navigate = useNavigate();
  const [disModal, setDisModal] = useState(false);
  const [postData] = useState<any>([]);
  const [currentpage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
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

  useEffect(() => {
    let AllJobIDs = {
      jobIds: allManageJobs?.jobs?.map((e) => {
        return e.jobid
      })
    }
    dispatch(empStatisticsDatas(AllJobIDs));

  }, [allManageJobs?.jobs])


  const PaginationChange = (page: any, pageSize: any) => {
    setCurrentPage(page);
    setSize(pageSize);
    if (filterData.title || filterData.status) {
      filterData.pageid = page;
      dispatch(manageJobsData(filterData));
    } else {
      const JobListOptions = {
        mode: "minimal",
        pageid: page,
        title: "",
        jobid: "",
        status: ["PUBLISH", "CLOSE"],
      };
      dispatch(manageJobsData(JobListOptions));
    }
  };

  useEffect(() => { }, [totalJobsApplicants]);

  const closeHandler = () => {
    if (closeJob) {
      setDisModal(false);
      const closeInfo = {
        status: "CLOSE",
        jobid: [closedId],
        remarks: closeJob,
      };
      dispatch(updateJobStatus(closeInfo));
      fetchData();
    }
  };
  useEffect(() => {
    if (updatejobsStatus?.code === 200) {
      showSnackAlert("success", updatejobsStatus.message);
      dispatch(resetUpdateStatus());
      // dispatch(empStatisticsDatas({}));
      const JobListOptions = {
        mode: "minimal",
        pageid: 1,
        title: "",
        jobid: "",
        status: ["PUBLISH", "CLOSE"],
      };
      dispatch(manageJobsData(JobListOptions));
    } else if (updatejobsStatus?.response?.data?.code === 400) {
      showSnackAlert("warning", updatejobsStatus?.response?.data?.message);
      dispatch(resetUpdateStatus());
    } else if (updatejobsStatus?.response?.data?.code === 500) {
      showSnackAlert("error", updatejobsStatus?.response?.data?.message);
      dispatch(resetUpdateStatus());
    }
  }, [updatejobsStatus]);

  useEffect(() => { }, [size, currentpage, displayData]);

  const checkStatus = (status: any, walkin: any) => {
    let res: any = "";
    let color: any = "";
    if (status === "CLOSE") {
      res = "Closed";
      color = "badge badge-danger";
    } else if (
      walkin?.end_ts <= Number(new Date().getTime() / 1000).toFixed()
    ) {
      res = "Expired";
      color = "badge badge-danger";
    } else if (
      walkin?.end_ts >= Number(new Date().getTime() / 1000).toFixed()
    ) {
      res = "Walk In";
      color = "badge badge-primary";
    }
    return { res, color };
  };

  const checkRepost = (status: any, created_at: any, updated_at: any) => {
    let res: any = "";

    if (status === "" || status === "Walk In") {
      if (created_at !== updated_at) {
        res = "Reposted";
      }
    }
    return res;
  };

  return (
    <>
      {manageJobLoading && <JobCard_Skl />}
      {!manageJobLoading && (
        <div className="col-lg-12 col-md-12">
          <ul className="post-job-bx browse-job-grid row">
            {displayData?.length > 0 &&
              displayData?.map((item: any, index: any) => {
                if (item?.status?.value !== "DRAFT") {
                  return (
                    <span
                      className="col-lg-12 col-md-12"
                      key={index}
                      style={{ marginBottom: "25px" }}
                    >
                      <div className="post-bx" id="Custom-CardBackgrdColor">
                        <div className="">
                          <div className="job-post-info">
                            <div className="d-flex justify-content-between">
                              <div className="row">
                                <div className="col-lg-12 col-sm-12 pb-12">
                                  <h5>
                                    <Tooltip title={`${item?.title}`} arrow>
                                      <Link
                                        to={`/jobs/previewjob/${item?.jobid}`}
                                        onClick={() => {
                                          sessionStorage.setItem(
                                            "goBack",
                                            window?.location?.href
                                          );
                                        }}
                                      >
                                        {Content(
                                          item.title.charAt(0).toUpperCase() +
                                          item.title.slice(1),
                                          20
                                        )}
                                        &nbsp;
                                      </Link>
                                    </Tooltip>
                                    <span
                                      style={{
                                        fontSize: "10px",
                                        height: "16px",
                                      }}
                                      className="badge badge-primary "
                                    >
                                      {item?.job_type === "PRIVATE JOB"
                                        ? "Private Job"
                                        : "Hot Job"}
                                    </span>{" "}
                                    <span
                                      style={{
                                        fontSize: "10px",
                                        height: "16px",
                                      }}
                                      className={
                                        checkStatus(
                                          item?.status?.value,
                                          item?.walkin
                                        ).color
                                      }
                                    >
                                      {
                                        checkStatus(
                                          item?.status?.value,
                                          item?.walkin
                                        ).res
                                      }
                                    </span>{" "}
                                    <span
                                      style={{
                                        fontSize: "10px",
                                        height: "16px",
                                      }}
                                      className="badge badge-primary"
                                    >
                                      {checkRepost(
                                        checkStatus(
                                          item?.status?.value,
                                          item?.walkin
                                        ).res,
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
                                    Total Responses:
                                  </span>{" "}
                                  <Tooltip title={"total responses"} arrow>
                                    <span
                                      style={{
                                        fontWeight: "500",
                                        cursor: "pointer",
                                        width: "auto",
                                      }}
                                      className="badge badge-primary "
                                      onClick={() => {
                                        if (item?.totalResponse)
                                          navigate(
                                            `/jobs/applications?id=${item?.jobid}`
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
                                  <Tooltip title={"shortlisted"} arrow>
                                    <span
                                      style={{
                                        fontWeight: "500",
                                        cursor: "pointer",
                                        width: "18px",
                                      }}
                                      className="badge badge-primary "
                                      onClick={() => {
                                        if (item?.shortListed)
                                          navigate(
                                            `/jobs/applications?id=${item?.jobid}&is=1`
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
                                      const JobApplicants = {
                                        jobid: item.jobid,
                                      };
                                      dispatch(
                                        totalJobApplicantsData(JobApplicants)
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
                                <li key={item?.alias}>
                                  <HiOutlineTicket className="custom-job-icon" />
                                  &nbsp;
                                  <span className="custom-job-content">
                                    Ref-Id : {item?.alias}
                                  </span>
                                </li>
                              )}
                              <li key={item?.location}>
                                <ImLocation className="custom-job-icon" />
                                &nbsp;
                                <Tooltip title={`${item?.location}`} arrow>
                                  <span className="custom-job-content">
                                    {Content(item?.location.join("| "), 120)}
                                  </span>
                                </Tooltip>
                              </li>
                              <li key={item?.exp?.max}>
                                <FaShoppingBag className="custom-job-icon" />
                                &nbsp;
                                <span className="custom-job-content">
                                  {`${item?.exp?.min}-${item?.exp?.max} years`}
                                </span>
                              </li>
                              <li key={item?.skills}>
                                <MdMilitaryTech className="custom-job-icon" />
                                &nbsp;
                                <Tooltip title={`${item?.skills}`} arrow>
                                  <span className="custom-job-content text-break">
                                    {Content(
                                      item?.skills
                                        ?.toString()
                                        ?.replaceAll(",", " | "),
                                      120
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
                                                                        item?.job_desc
                                                                    )}`}
                                                                    arrow
                                                                >
                                                                    <span className="custom-job-content text-break">
                                                                        {convertHtmlToText(
                                                                            item?.job_desc
                                                                        )
                                                                            ? Content(
                                                                                  convertHtmlToText(
                                                                                      item?.job_desc
                                                                                  ),
                                                                                  130
                                                                              )
                                                                            : "Not available"}
                                                                    </span>
                                                                </Tooltip>
                                                            </li> */}
                              {item?.walkin.start_ts && (
                                <span key={item?.walkin?.start_ts}>
                                  <TbCalendar className="custom-job-icon" />
                                  &nbsp;
                                  <>
                                    <span className="custom-job-content">
                                      Walk in starts from
                                    </span>{" "}
                                    <span
                                      className="custom-job-content"
                                      style={{
                                        fontWeight: "500",
                                      }}
                                    >
                                      {getTimestampToDate(
                                        item?.walkin?.start_ts
                                      )}
                                    </span>{" "}
                                    <span className="custom-job-content">
                                      to
                                    </span>{" "}
                                    <span
                                      className="custom-job-content"
                                      style={{
                                        fontWeight: "500",
                                      }}
                                    >
                                      {getTimestampToDate(item?.walkin?.end_ts)}
                                    </span>
                                    {item?.walkin.time && (
                                      <li
                                        style={{
                                          color: "black",
                                        }}
                                        key={item?.walkin.time}
                                      >
                                        <IoTime className="custom-job-icon" />
                                        &nbsp;
                                        <>
                                          <span className="custom-job-content">
                                            Walk in Time
                                          </span>{" "}
                                          <label
                                            style={{
                                              fontWeight: "500",
                                            }}
                                          >
                                            {convertTo12HourFormat(
                                              item?.walkin.time.split("-")[0]
                                            )}{" "}
                                            <span className="custom-job-content">
                                              to
                                            </span>{" "}
                                            {convertTo12HourFormat(
                                              item?.walkin.time.split("-")[1]
                                            )}
                                          </label>{" "}
                                        </>{" "}
                                      </li>
                                    )}
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
                                            item?.status?.value,
                                            item?.walkin
                                          ).res,
                                          item?.created_at,
                                          item?.updated_at
                                        ) === "Reposted"
                                          ? "Reposted "
                                          : "Posted "}
                                        {getDateDifference(
                                          checkRepost(
                                            checkStatus(
                                              item?.status?.value,
                                              item?.walkin
                                            ).res,
                                            item?.created_at,
                                            item?.updated_at
                                          ) === "Reposted"
                                            ? item?.updated_at
                                            : item?.created_at
                                        )}
                                      </span>{" "}
                                    </li>
                                  </div>
                                </div>
                                {item?.status?.value === "CLOSE" ? (
                                  <div className="d-flex justify-content-between">
                                    <div className="d-flex justify-content-between">
                                      <Tooltip title={"Repost job"} arrow>
                                        <div className="row">
                                          <button
                                            type="button"
                                            className="btn btn-sm btn-primary custom-Btns"
                                            onClick={() => {
                                              if (
                                                item?.job_type === "PRIVATE JOB"
                                              ) {
                                                navigate(
                                                  `/postjob/privatejob/${item?.jobid}`
                                                );
                                              } else {
                                                navigate(
                                                  `/postjob/hotjob/${item?.jobid}`
                                                );
                                              }
                                            }}
                                          >
                                            Repost Job
                                          </button>
                                          &nbsp;
                                        </div>
                                      </Tooltip>
                                    </div>
                                  </div>
                                ) : (
                                  <Tooltip title={"Close"} arrow>
                                    <div className="row">
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-danger custom-Btns"
                                        onClick={() => {
                                          setClosedId(item.jobid);
                                          setDisModal(true);
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
                }
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
          <div className="modal-dialog my-0  mx-0 w-100 " role="document">
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
                <h6>Please let us know why you are closing this job</h6>
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
                <label htmlFor="close1">Position filled</label> <br />
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
                <label htmlFor="close2">Position not filled</label> <br />
                <input
                  type="radio"
                  value={"Postion on hold/cancelled by client"}
                  id="close3"
                  name="closeRd"
                  onChange={(e: any) => {
                    e.target.checked
                      ? setClosedJob("Postion on hold/cancelled by client")
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
                      ? setClosedJob("None of the above options")
                      : setClosedJob("");
                  }}
                />{" "}
                <label htmlFor="close4">None of the above options</label>
                <br />
                <h6>Note:</h6>
                The selected Job will be removed from the site. It will still be
                available as an closed job in your account.
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
      {!manageJobLoading &&
        allManageJobs?.jobs &&
        allManageJobs?.jobs?.length === 0 && (
          <center>
            {" "}
            <div className="col-lg-6">
              {" "}
              <img src={notfoundImg} alt="" />{" "}
              <h6 style={{ fontSize: "13px", fontWeight: "bold" }}>
                {" "}
                Oops no record found.{" "}
              </h6>
            </div>
          </center>
        )}

      {!manageJobLoading &&
        allManageJobs?.jobs &&
        allManageJobs?.jobs?.length !== 0 && (
          <div className="pagination-bx float-right m-b30  m-t20">
            <Pagination
              className="pagination-data"
              onChange={PaginationChange}
              total={allManageJobs?.totalCount}
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
