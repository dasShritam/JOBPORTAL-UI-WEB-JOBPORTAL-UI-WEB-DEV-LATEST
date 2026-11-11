import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CloseButton, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  DeletePoll,
  FetchPollSlice,
  GetPolls,
  resetDeletePollSlice,
} from "../../../redux/features/admin/polls/ManagePollsSlice";
import Pagination from "rc-pagination";
import { Content, getTimestampToDate } from "../../../common/common";
import Swal from "sweetalert2";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import ManagePollsSkeleton from "./ManagePollsSkeleton";
import { FormikProps } from "formik";
import {
  Avatar,
  Chip,
  IconButton,
  Popover,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import PollGraph from "./PollGraph";
import NewPoll from "./NewPoll";
var NodataFound = require("../../../assets/images/background/No-record.png");
function PollList() {
  const [company, setCompany] = useState(false);
  const getpoll = useSelector((state: any) => state?.fetchPollx);
  const { PollArray, loadpolls, pollerror } = getpoll;
  const [pollData, setPollData] = useState<any>([]);
  const [postData, setPostData] = useState<any>([]);
  const [currentpage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [size, setSize] = useState(perPage);
  const showSnackAlert = UseToastAlert();
  const [popoverDesc, setPopoverDesc] = useState();
  const deletepoll = useSelector((state: any) => state?.deletePollx);
  const { DeletepollArray, deleteloadpolls } = deletepoll;
  useEffect(() => {
    const masterDataObj = {
      pollId: "",
      pageid: 1,
      pageLimit: 10,
    };
    dispatch(GetPolls(masterDataObj));
  }, []);

  useEffect(() => {
    if (DeletepollArray?.code === 200 && !deleteloadpolls) {
      showSnackAlert("success", DeletepollArray.message);
      const masterDataObj = {
        pollId: "",
        pageid: currentpage,
        pageLimit: 10,
      };
      dispatch(GetPolls(masterDataObj));
      dispatch(resetDeletePollSlice());
    } else if (DeletepollArray?.code === 400 && !deleteloadpolls) {
      showSnackAlert("warning", DeletepollArray?.message);
      dispatch(resetDeletePollSlice());
    }
  }, [DeletepollArray, deleteloadpolls]);

  useEffect(() => {
    if (PollArray?.code === 200 && !loadpolls) {
      if (PollArray?.data?.pollsData?.length > 0) {
        setPollData((prevData) => [...prevData, ...PollArray?.data?.pollsData]);
      }
    } else if (PollArray?.response?.data?.code === 400) {
      showSnackAlert("warning", "Bad Request");
    }
  }, [PollArray, loadpolls]);

  const PerPageChange = (value: any) => {
    setSize(value);
    if (postData) {
      Math.ceil(postData?.length / value);
    }
  };

  const PrevNextArrow = (current: any, type: any, originalElement: any) => {
    if (type === "prev") {
      return <button title="prev"> Prev </button>;
    }
    if (type === "next") {
      return <button title="next"> Next </button>;
    }
    return originalElement;
  };
  const dispatch = useDispatch();
  const [displayData, setDisplayData] = useState<any>([]);
  const PaginationChange = (page: any, pageSize: any) => {
    setSize(pageSize);
    const masterDataObj = {
      pollId: "",
      pageid: page == 0 ? 1 : page,
      pageLimit: 10,
    };
    dispatch(GetPolls(masterDataObj));
    setDisplayData(masterDataObj);
  };
  function isPastTimestamp(timestamp) {
    const currentDate = new Date().setHours(0, 0, 0, 0);
    const endTillDate = new Date(timestamp * 1000).setHours(0, 0, 0, 0);
    return endTillDate >= currentDate;
  }

  const handleDeleteSwal = (del: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, You will not be able to recover this Record!",
      showCancelButton: true,
      confirmButtonColor: "#2a9f2a ",
      cancelButtonColor: "#db1919 ",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result?.isConfirmed) {
        dispatch(DeletePoll(del));
      }
    });
  };

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const [filterPoll, setFilterPoll] = useState("");
  const [filteredData, setFilteredData] = useState(PollArray?.data?.pollsData);

  const handleFilterchange = (e: any) => {
    const searchValue = e?.target?.value;
    setFilterPoll(searchValue);
    const filteredData = PollArray?.data?.pollsData?.filter((item) =>
      item.title?.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredData(filteredData);
  };

  useEffect(() => {
    if (!loadpolls) {
      setFilteredData(PollArray?.data?.pollsData);
    }
  }, [loadpolls]);

  const count = 0;
  const [showGraph, setShowGraph] = useState(false);
  const [pollObject, setPollObject] = useState<any>();
  const [showModal, setShowModal] = useState(false);
  const [showAddpoll, setShowAddpoll] = useState(false);

  const handleCancelClick = () => {
    setShowModal(false);
  };
  return (
    <>
      <div className="job-bx-title clearfix NativeTitle">
        <h5 className="font-weight-700 pull-left text-uppercase">
          Manage polls
        </h5>
        {!showAddpoll && (
          <div className="float-right">
            <Stack direction="row" spacing={1} className="ml-auto">
              {!loadpolls ? (
                <Chip
                  avatar={
                    <Avatar
                      className="btn site-button btn-sm "
                      style={{ color: "white", backgroundColor: "blue" }}
                    >
                      {PollArray?.data?.totalCount
                        ? PollArray?.data?.totalCount
                        : "0"}
                    </Avatar>
                  }
                  label={
                    <span className="custom-job-content text-bold">
                      Total Polls
                    </span>
                  }
                />
              ) : (
                <Chip
                  avatar={
                    <Skeleton
                      animation="wave"
                      variant="circular"
                      width={20}
                      height={20}
                    />
                  }
                  label={<Skeleton style={{ width: "100px" }} />}
                />
              )}
            </Stack>
          </div>
        )}
      </div>

      {!showAddpoll && (
        <>
          <div className="d-flex justify-content-between mb-2">
            <div>
              <input
                className="form-control"
                value={filterPoll}
                type="text"
                placeholder="Search Poll Title/Question"
                onChange={(e: any) => {
                  handleFilterchange(e);
                }}
              />
            </div>
            <button
              type="submit"
              className="btn site-button btn-sm ml-auto mb-2"
              onClick={() => {
                setShowAddpoll(true);
              }}
            >
              New Poll
            </button>
          </div>

          {filteredData?.length !== 0 && (
            <table className="table-job-bx cv-manager company-manage-job">
              <thead>
                <tr>
                  <th>Poll Title</th>
                  <th>Survey </th>
                  <th>Active from & till</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {!loadpolls &&
                  filteredData?.map((pollData: any) => {
                    return (
                      <tr
                        key={
                          pollData.pollId ? pollData.pollId : "Not available"
                        }
                      >
                        <td className="job-name">
                          <div
                            title={
                              pollData.title
                                ? pollData.title.charAt(0).toUpperCase() +
                                  pollData.title.slice(1)
                                : ""
                            }
                            style={{ marginTop: "0%" }}
                          >
                            {pollData?.title
                              ? Content(
                                  pollData.title.charAt(0).toUpperCase() +
                                    pollData.title.slice(1),
                                  40
                                )
                              : "Not available"}
                          </div>
                          {/* <div
                            aria-describedby={id}
                            onClick={(e: any) => {
                              handleClick(e);
                              setPopoverDesc(pollData?.description);
                            }}
                            style={{ fontWeight: "normal" }}
                            title="Click here to view complete Question"
                          >
                            {pollData?.description ? (
                              <a href="#" style={{ color: "blue" }}>
                                {Content(
                                  pollData.description.charAt(0).toUpperCase() +
                                    pollData.description.slice(1),
                                  50
                                )}
                              </a>
                            ) : (
                              <span>Not available</span>
                            )}
                          </div> */}
                          {pollData?.description ? (
                            <Link
                              to={"#"}
                              className="primary"
                              aria-describedby={id}
                              onClick={(e: any) => {
                                handleClick(e);
                                setPopoverDesc(pollData?.description);
                              }}
                              style={{ fontWeight: "normal", color: "blue" }}
                              title="Click here to view complete Question"
                            >
                              <span>
                                {Content(
                                  pollData.description.charAt(0).toUpperCase() +
                                    pollData.description.slice(1),
                                  50
                                )}
                              </span>
                            </Link>
                          ) : (
                            <span>Not available</span>
                          )}
                          <div>
                            <span style={{ fontWeight: "normal" }}>
                              Poll visible to :{" "}
                            </span>
                            {pollData?.access.map((val, index) => (
                              <span
                                key={index}
                                style={{ fontWeight: "normal" }}
                              >
                                {val
                                  ? val
                                  : "JOBSEEKER | EMPLOYER ADMINISTRATOR | RECRUITER"}
                                {index !== pollData?.access.length - 1 && " | "}
                              </span>
                            ))}
                          </div>
                          <Popover
                            id={id}
                            // PaperProps={{
                            //   style: { width: 300 },
                            // }}
                            open={open}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "left",
                            }}
                            style={{
                              boxShadow: "0px 1px 1px 0px #dacdcd",
                            }}
                          >
                            <Typography sx={{ p: 2 }}>
                              <div>
                                <p>{popoverDesc}</p>
                              </div>
                            </Typography>{" "}
                          </Popover>
                          <label style={{ fontWeight: "normal" }}>
                            Created On :{" "}
                          </label>
                          <span
                            className="ml-1"
                            style={{ fontWeight: "normal" }}
                          >
                            {pollData?.postedOn
                              ? getTimestampToDate(pollData?.postedOn)
                              : "Not available"}
                          </span>
                        </td>
                        <td className="application text-primary">
                          {pollData?.options?.length > 0 && (
                            <div style={{ marginTop: "-47px" }}>
                              <Link
                                title="Click here to view Graphical Information"
                                to="#"
                                onClick={(e: any) => {
                                  setShowGraph(true);
                                  e.preventDefault();
                                  setPollObject(
                                    filteredData?.filter(
                                      (poll) =>
                                        poll?.pollId === pollData?.pollId
                                    )[0]
                                  );
                                }}
                              >
                                {pollData.options.reduce(
                                  (total: number, option: any) =>
                                    total + (option.vote || 0),
                                  0
                                )}
                                &nbsp; votes
                              </Link>
                            </div>
                          )}
                        </td>
                        <td
                          className="application"
                          style={{ marginTop: "-47px" }}
                        >
                          <div style={{ marginTop: "-47px" }}>
                            <span
                              style={{
                                fontWeight: "normal",
                              }}
                            >
                              {getTimestampToDate(pollData.startFrom)} To{" "}
                              {getTimestampToDate(pollData.endTill)}
                            </span>
                          </div>
                          <div style={{ marginBottom: "0" }}>
                            {" "}
                            <label style={{ fontWeight: "normal" }}>
                              Created By :
                            </label>
                            <span
                              style={{
                                fontWeight: "normal",
                                color: "blue",
                              }}
                            >
                              {" "}
                              {pollData.createdBy
                                ? pollData.createdBy
                                : "Not available"}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div style={{ marginTop: "-48px" }}>
                            <span
                              className="application "
                              style={{ color: "#37b35e" }}
                            >
                              {isPastTimestamp(pollData?.endTill) ? (
                                "Active"
                              ) : (
                                <span style={{ color: "red" }}>Expired</span>
                              )}
                            </span>
                          </div>
                        </td>
                        <td style={{ verticalAlign: "top" }}>
                          <div style={{ textAlign: "center" }}>
                            <IconButton
                              title="Delete poll"
                              onClick={() => handleDeleteSwal(pollData.pollId)}
                              style={{
                                display: "block",
                                margin: " 0 auto",
                                color: "red",
                                background: "white",
                              }}
                            >
                              <i className="ti-trash"></i>
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
        </>
      )}

      {showAddpoll && (
        <>
          <div className="row">
            <button
              type="submit"
              // className="btn site-button btn-sm ml-auto"
              className="site-button right-arrow button-sm ml-auto"
              style={{
                lineHeight: "1",
              }}
              onClick={() => {
                setShowAddpoll(false);
              }}
            >
              Go Back
            </button>
          </div>
          <div className="d-flex justify-content-center">
            <div className="col-lg-8 col-md-8">
              <NewPoll />
            </div>
          </div>
        </>
      )}

      {!showAddpoll && filteredData?.length == 0 && (
        <center>
          <img src={NodataFound} alt="" style={{ width: "40%" }} />
          <br />
          <h6 className="font-weight-bold">Oops no record found.</h6>
        </center>
      )}
      {!showAddpoll && pollData && pollData.length !== 0 && (
        <div className="pagination-bx float-right m-b30  m-t20">
          <Pagination
            className="pagination-data"
            onChange={(page, pageSize) => {
              setCurrentPage(page);
              PaginationChange(page, pageSize);
            }}
            total={PollArray?.data?.totalCount}
            current={currentpage}
            pageSize={size}
            showSizeChanger={true}
            itemRender={PrevNextArrow}
            onShowSizeChange={PerPageChange}
          />
        </div>
      )}

      {loadpolls && <ManagePollsSkeleton />}

      <Modal
        show={showGraph}
        backdrop="static"
        onHide={() => {
          setShowGraph(false);
          handleCancelClick();
        }}
        className="modal browse-job fade modal-bx-info editor"
      >
        <div
          className="modal-dialog my-0"
          style={{ width: "100%" }}
          role="document"
        >
          <div className="modal-content">
            <div className="modal-body">
              <div className="modal-custom-header">
                <h5 className="modal-title" id="ResumeheadlineModalLongTitle">
                  {pollObject?.title}
                </h5>
                <CloseButton
                  onClick={() => {
                    setShowGraph(false);
                    handleCancelClick();
                  }}
                />
              </div>
              <p className="modal-custom-desc">{pollObject?.description}</p>
              {<PollGraph pollsDetails={pollObject} />}
            </div>
            <div className="modal-custom-footer"></div>
          </div>
        </div>
      </Modal>
    </>
  );
}
export default PollList;
