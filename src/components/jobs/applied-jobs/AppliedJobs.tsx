import { useEffect, useRef, useState } from "react";
import Chip from "@mui/material/Chip";
import { BsCheckCircleFill } from "react-icons/bs";
import "../../../assets/customCss/jobs/appStatus.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getJobAddApplicationStatus,
  getJobApplicationStatus,
  getJobAppliedCount,
  resetJobApplication,
} from "../../../redux/features/jobs/applied-jobs/AppliedJobSlice";
import { getDateDifference } from "../../../common/common";
import ApplicationStatus from "./ApplicationStatus";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import AppliedJobSkeleton from "./AppliedJobSkeleton";
import { Link, useParams } from "react-router-dom";
import Pagination from "rc-pagination";
import { log } from "console";
var NodataFound = require("../../../assets/images/background/No-record.png");

function AppliedJobs() {
  const [recruiterActions, setRecruiterActions] = useState(false);
  const [applytoNaukri, setApplytoNaukri] = useState(true);
  const [data, setData] = useState<any>([]);
  const [page] = useState(1);
  const [currentpage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [size, setSize] = useState(perPage);
  const [childPage, setChildpage] = useState<any>();
  const [userCount, setUserCount] = useState<any>();
  const [displayData, setDisplayData] = useState<any>([]);
  const [totalCount, setTotalCount] = useState<any>(0);

  const [jobDetailsoption, setJobDetailsoption] = useState<any>([]);

  const [selectedData, setSelectedData] = useState(displayData[0]);

  const { id }: any = useParams();
  const dispatch = useDispatch();
  const JobApplicationOptions = {
    status: "APPLY",
    mode: "all",
    pageid: page,
  };

  const JobCountData = {
    applied: "",
    emp_action: "",
  };
  const { ApplicationStatuss, loading } = useSelector(
    (state: any) => state.JobApplicationData
  );

  useEffect(() => {
    if (!loading && ApplicationStatuss?.code == 200) {
      const output = [...ApplicationStatuss?.data?.jobs];
      const sorting = output?.sort((a: any, b: any) => {
        return b?.created_at - a?.created_at;
      });
      setTotalCount(ApplicationStatuss?.data?.totalCount);
      setDisplayData(sorting);
    }
  }, [loading]);

  useEffect(() => {}, [displayData]);

  const appliedCount = useSelector((state: any) => state?.JobAppliedCountData);

  const { AppliedCount } = appliedCount;
  useEffect(() => {
    if (AppliedCount) {
    }
  }, [AppliedCount]);

  useEffect(() => {
    dispatch(getJobAppliedCount(JobCountData));
  }, []);

  useEffect(() => {
    setJobDetailsoption(displayData);
  }, [ApplicationStatuss]);

  const { AddApplicationStatuss, loadingA } = useSelector(
    (state: any) => state.JobAdditionalApplicationData
  );

  const handleApplyNaukri = () => {
    setApplytoNaukri(true);

    if (displayData?.length > 0) {
      setSelectedData(displayData[0]);
    }
    setRecruiterActions(false);
    setJobDetailsoption(displayData);
  };
  let filteredDatas: any = [];
  const filterHandler = () => {
    if (ApplicationStatuss?.data?.jobs) {
      let count = 0;
      ApplicationStatuss?.data?.jobs?.filter((job: any) => {
        job?.milestone?.map((milestone: any) => {
          if (
            milestone?.sts !== "APPLY" &&
            milestone?.sts !== "SAVE" &&
            milestone?.sts !== "VIEW" &&
            milestone?.sts !== null
          ) {
            if (count === 0) {
              filteredDatas?.push(job);
            }
            count++;
          }
        });
        count = 0;
      });
      setDisplayData([...filteredDatas]);

      setData([...filteredDatas]);
    }
  };

  useEffect(() => {
    if (jobDetailsoption) {
      setData([...jobDetailsoption]);
      handleApplyNaukri();
    }
  }, [jobDetailsoption]);

  useEffect(() => {
    if (displayData[0]) {
      handleDivClick(displayData[0]?.jobid);
      setSelectedData(displayData[0]);
    }
    if (id) {
      const selectedJob: any = displayData?.filter((e) => {
        return e?.jobid === id;
      });
      handleDivClick(id);
      setSelectedData(selectedJob[0]);
    }
  }, [displayData[0], id]);

  const handleRecruiteraction = (e: any) => {
    if (AppliedCount?.data?.emp_action && displayData?.length === 0) {
      setSelectedData(null);
    } else if (AppliedCount?.data?.emp_action && displayData?.length !== 0) {
      setSelectedData(displayData[0]);
    } else setSelectedData(null);
    setRecruiterActions(true);
    setApplytoNaukri(false);
  };

  const handleCardClick = (data: any) => {
    setSelectedData(data);
  };
  useEffect(() => {
    dispatch(
      getJobAddApplicationStatus({
        jobid: data?.jobid,
        pageid: page,
        status: "APPLY",
        mode: "all",
      })
    );
  }, []);
  useEffect(() => {
    dispatch(
      getJobApplicationStatus({
        pageid: 1,
        status: "APPLY",
        mode: "all",
        recruit: true,
      })
    );
  }, [recruiterActions]);

  const [highlightedDiv, setHighlightedDiv] = useState(
    displayData?.length > 0 ? displayData[0]?.jobid : null
  );

  const firstDivRef = useRef(null);

  useEffect(() => {
    if (firstDivRef?.current !== null) {
      const jobid = (firstDivRef?.current as any).jobid;
      setHighlightedDiv(jobid);
    }
  }, []);
  function handleDivClick(jobid: string) {
    setHighlightedDiv(jobid);
  }

  useEffect(() => {
    dispatch(getJobApplicationStatus(JobApplicationOptions));
    handleApplyNaukri();
  }, []);

  const PerPageChange = (value: any) => {
    setSize(value);
    if (displayData) {
      Math.ceil(displayData?.length / value);
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
          {" "}
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
          {" "}
          Next <i className="ti-arrow-right"></i>{" "}
        </button>
      );
    }
    return originalElement;
  };
  <div className="pagination-bx m-t30 float-right">
    <ul className="pagination">
      <li className="previous">
        <Link to={"#"}>
          <i className="ti-arrow-left"></i> Prev
        </Link>
      </li>
      <li className="active">
        <Link to={"#"}>1</Link>
      </li>
      <li>
        <Link to={"#"}>2</Link>
      </li>
      <li>
        <Link to={"#"}>3</Link>
      </li>
      <li className="next">
        <Link to={"#"}>
          Next <i className="ti-arrow-right"></i>
        </Link>
      </li>
    </ul>
  </div>;

  const PaginationChange = (page: any, pageSize: any) => {
    setCurrentPage(page);
    setSize(pageSize);
    dispatch(
      getJobApplicationStatus({
        status: "APPLY",
        mode: "all",
        pageid: page,
      })
    );
    setChildpage(page);
  };

  return (
    <>
      <div className="page-content bg-white">
        <div className="content-block">
          <div className="browse-job section-full bg-white p-t50 p-b20">
            <div className="container">
              <div className="job-bx browse-job clearfix mt-5 m-b30">
                <div className="job-bx-title clearfix NativeTitle">
                  <h5 className="font-weight-700 pull-left text-uppercase">
                    Job Application Status
                  </h5>
                  <div className="d-flex float-right" id="chipjas">
                    <Stack direction="row" spacing={1} id="appliedupdate">
                      <Chip
                        avatar={
                          <Avatar className="bg-info text-light">
                            {AppliedCount?.data?.emp_action !== 0
                              ? AppliedCount?.data?.emp_action
                              : "0"}
                          </Avatar>
                        }
                        label="Application Updates"
                      />
                    </Stack>
                    &nbsp;
                    <Stack direction="row" spacing={1}>
                      <Chip
                        avatar={
                          <Avatar className="bg-success text-light">
                            {AppliedCount?.data?.applied !== 0
                              ? AppliedCount?.data?.applied
                              : "0"}
                          </Avatar>
                        }
                        label="Total Applies"
                      />
                    </Stack>
                  </div>
                </div>

                {!loading && AppliedCount?.data?.applied !== 0 && (
                  <div className="row">
                    <div className="col-lg-5 col-md-5 col-sm-5">
                      <div>
                        <Chip
                          label={`Recruiter Actions (${
                            AppliedCount?.data?.emp_action
                              ? AppliedCount?.data?.emp_action
                              : "0"
                          })`}
                          className=""
                          onClick={(e: any) => {
                            dispatch(resetJobApplication());
                            // filterHandler();
                            dispatch(getJobAppliedCount(JobCountData));
                            setHighlightedDiv(displayData[0]?.jobid);
                            handleRecruiteraction(e);
                          }}
                          color={recruiterActions ? "primary" : "default"}
                        />

                        <Chip
                          label={`All Applies (${
                            AppliedCount?.data?.applied
                              ? AppliedCount?.data?.applied
                              : "0"
                          })`}
                          className="ml-3"
                          onClick={() => {
                            dispatch(
                              getJobApplicationStatus(JobApplicationOptions)
                            );
                            handleApplyNaukri();
                            dispatch(getJobAppliedCount(JobCountData));
                            setHighlightedDiv(displayData[0]?.jobid);
                            setData([...jobDetailsoption]);
                          }}
                          color={applytoNaukri ? "primary" : "default"}
                        />
                        <br />
                      </div>

                      {!loading && displayData?.length > 0 && (
                        <div
                          className="mt-3"
                          id="carddiv"
                          style={{ overflowY: "scroll", height: "450px" }}
                        >
                          {!loading &&
                            displayData?.map((data: any, index: any) => {
                              return (
                                <div
                                  className="job-bx"
                                  key={data?.jobid}
                                  style={{
                                    cursor: "pointer",
                                    backgroundColor:
                                      highlightedDiv === data?.jobid
                                        ? "#d8ecf56b"
                                        : "white",
                                  }}
                                  onClick={() => {
                                    handleCardClick(data);
                                    dispatch(
                                      getJobAddApplicationStatus({
                                        jobid: data?.jobid,
                                        pageid: childPage,
                                        status: "APPLY",
                                        mode: "all",
                                      })
                                    );
                                    handleDivClick(data?.jobid);
                                  }}
                                  ref={index === 0 ? firstDivRef : null} // Add a ref to the first div element
                                >
                                  <h6>{data?.title}</h6>
                                  <span>{data?.employer?.company_name}</span>
                                  <div className="d-flex justify-content-between">
                                    <div
                                      style={
                                        data?.application_status?.self ===
                                          "APPLIED" ||
                                        "APPLY" ||
                                        "SAVE" ||
                                        "SHORTLIST"
                                          ? {
                                              fontSize: "13px",
                                              color: "#2ac52a",
                                              padding: "5px",
                                            }
                                          : {
                                              fontSize: "13px",
                                              color: "#cec6c6",
                                              padding: "5px",
                                            }
                                      }
                                    >
                                      <i
                                        className="fa-12px"
                                        style={
                                          data?.application_status?.self ===
                                            "APPLIED" ||
                                          "APPLY" ||
                                          "SAVE" ||
                                          "SHORTLIST" ||
                                          "VIEWED"
                                            ? { color: "#2ac52a" }
                                            : { color: "gray" }
                                        }
                                      >
                                        <BsCheckCircleFill />
                                      </i>{" "}
                                      {/* APPLICATION SENT TODAY */}
                                      <label>
                                        {data?.application_status?.self ===
                                        "APPLY"
                                          ? "Applied"
                                          : ""}{" "}
                                        {data?.application_status?.self ===
                                        "REJECT"
                                          ? "Rejected"
                                          : ""}{" "}
                                        {data?.application_status?.self ===
                                        "SAVE"
                                          ? "Saved"
                                          : ""}{" "}
                                        {data?.application_status?.self ===
                                        "SHORTLIST"
                                          ? "Shortlisted"
                                          : ""}{" "}
                                        {data?.application_status?.self ===
                                        "DRAFT"
                                          ? "Drafted"
                                          : ""}{" "}
                                        {data?.application_status?.self ===
                                        "VIEW"
                                          ? "Viewed"
                                          : ""}{" "}
                                        {getDateDifference(data?.created_at)}
                                      </label>
                                    </div>
                                    <span
                                      className="mt-1"
                                      style={{
                                        fontSize: "13px",
                                        color: "gray",
                                      }}
                                    >
                                      Last update{" "}
                                      {getDateDifference(data?.updated_at)}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>

                    <div className="col-lg-7 col-md-7 col-sm-7">
                      {selectedData && (
                        <ApplicationStatus data={selectedData} />
                      )}
                    </div>
                  </div>
                )}
                {!loading && displayData?.length !== 0 && (
                  <div className="pagination-bx float-right m-t20">
                    <Pagination
                      className="pagination-data"
                      onChange={PaginationChange}
                      total={totalCount}
                      current={currentpage}
                      pageSize={size}
                      showSizeChanger={true}
                      itemRender={PrevNextArrow}
                      onShowSizeChange={PerPageChange}
                    />
                  </div>
                )}
                {!loading && displayData?.length === 0 && (
                  <center>
                    <img
                      src={NodataFound}
                      alt=""
                      style={{
                        width: "40%",
                      }}
                    />
                    <br />
                    <h6 className="font-weight-bold">Oops no record found.</h6>
                  </center>
                )}
              </div>
              {loading && loadingA && <AppliedJobSkeleton />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AppliedJobs;
