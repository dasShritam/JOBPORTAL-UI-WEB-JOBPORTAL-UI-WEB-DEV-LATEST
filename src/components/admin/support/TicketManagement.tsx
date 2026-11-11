import { Link } from "react-router-dom";
import React, { lazy, useEffect, useRef, useState } from "react";
import { Modal, OverlayTrigger } from "react-bootstrap";
import Select from "react-select";
import { BsEye } from "react-icons/bs";
import { BsEyeFill } from "react-icons/bs";
import { MdEmojiObjects } from "react-icons/md";
import { BsCloudDownload } from "react-icons/bs";
import { TbClearAll, TbMessageCircle2Filled } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTickets,
  resetFetchTickets,
} from "../../../redux/features/admin/support/FetchTicketsSlice";
import {
  Content,
  customStyles,
  getDateDifference,
} from "../../../common/common";
import { Avatar, Chip, IconButton } from "@mui/material";
import { regex } from "../../../common/validation";
import { Accordion } from "react-bootstrap";
import {
  addActivity,
  resetAddActivityCreator,
} from "../../../redux/features/admin/support/AddActivitySlice";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import { resetPatchContactInfo } from "../../../redux/features/admin/support/ManageContactInfoSlice";
import {
  resetUpdateTicketStatus,
  updateTicketStatus,
} from "../../../redux/features/admin/support/TicketStatusSlice";
import Swal from "sweetalert2";
import { GrSearch } from "react-icons/gr";
import { jobSeekerProfileMasterData } from "../../../redux/features/masterData/MasterDataInfoSlice";
import TicketManagement_SK from "./TicketManagement_SK";
import "../../../assets/customCss/Pagination.css";
import {
  downloadQueryImg,
  resetDownloadQueryImg,
} from "../../../redux/features/admin/support/DownloadQueryImg";
import { Tooltip } from "@material-ui/core";

const Pagination = lazy(() => import("rc-pagination"));

function TicketManagement() {
  var notfoundImg = require("../../../assets/images/background/No-record.png");
  const label = { inputProps: { "aria-label": "Switch demo" } };
  const dispatch = useDispatch();
  const showSnackAlert = UseToastAlert();
  const [query, setQuery] = useState<any>("");
  const [queryId, setQueryId] = useState<any>(null);
  const [attachment, setAttachment] = useState<any>(null);
  const [category, setCategory] = useState<any>("");
  const [areaOfConcernList, setAreaOfConcernList] = useState<any>([]);
  const [emailAddress, setEmailAddress] = useState<any>(null);
  const [areaOfConcernListInp, setAreaOfConcernListInp] = useState<any>(null);
  const [ticketStatusInp, setTicketStatusInp] = useState<any>(null);
  const [queryCreated, setQueryCreated] = useState<any>(null);
  const [userTypeInp, setUserTypeInp] = useState<any>(null);
  const [activityModal, setActivityModal] = useState(false);
  const [viewQueryMdl, setViewQueryMdl] = useState(false);
  const [activityMsg, setActivityMsg] = useState<any>([]);
  const [createdAt, setCreatedAt] = useState<any>([]);
  const [activityInp, setActivityInp] = useState<any>("");
  const [activityInpErr, setActivityInpErr] = useState<any>(false);
  const [ticketId, setTicketId] = useState<any>("");
  const [activityStatus, setActivityStatus] = useState("");
  const[apiParameter,setApiparameter]=useState<any>(null)
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClickScroll = () => {
    if (inputRef?.current) {
      inputRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const JS_MASTER_DATA = useSelector((state: any) => state.jobSeekerMasterData);

  const [currentpage, setCurrentPage] = useState(1),
    [perPage, setPerPage] = useState(10),
    [size, setSize] = useState(perPage);

  const { ftresponse, ftloading } = useSelector(
    (state: any) => state.fetchTickets
  );
  const { acresponse, acloading } = useSelector(
    (state: any) => state.addActivity
  );
  const { tsResponse, tsloading } = useSelector(
    (state: any) => state.updateTicketStatus
  );

  const { image, load, error } = useSelector(
    (state: any) => state.downloadQueryImg
  );

  const PerPageChange = (value: any) => {
    setSize(value);
    if (ftresponse?.data?.jobs) {
      Math.ceil(ftresponse?.data?.totalCount / value);
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

  const PaginationChange = (page: any, pageSize: any) => {
    setCurrentPage(page);
    setSize(pageSize);
    searchHandler(page,apiParameter);
    handleClickScroll();
  };

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    const ticketMdl = {
      user_type: -1,
      pageId: 1,
      pageLimit: 10,
    };
    const obj={
        pageLimit: 10,
        user_type:  -1,
      
    }
    setApiparameter({...obj})
    dispatch(fetchTickets(ticketMdl));
  }, []);

  const handleAddActivity = () => {
    const addActivityMdl = {
      tktid: ticketId,
      msg: activityInp,
    };

    if (activityInp && activityInp !== "") {
      setActivityInpErr(false);
      dispatch(addActivity(addActivityMdl));
    } else {
      setActivityInpErr(true);
    }
  };

  useEffect(() => {
    if (acresponse && acresponse?.code && acresponse?.code === 200) {
      showSnackAlert("success", acresponse?.message);
      const ticketMdl = {
        user_type: -1,
        pageId: currentpage,
        pageLimit: 10,
      };
      dispatch(fetchTickets(ticketMdl));
      setActivityInp("");
      setActivityModal(false);
      dispatch(resetAddActivityCreator());
    } else if (
      acresponse?.response &&
      acresponse?.response?.data &&
      acresponse?.response?.data?.code !== 200
    ) {
      showSnackAlert("warning", acresponse?.response?.data?.message);
      dispatch(resetAddActivityCreator());
    }
  }, [acresponse, acresponse?.code]);

  useEffect(() => {
    if (image && image?.code && image?.code === 200) {
      window.location.href = image?.data[0]?.img_sas;
      dispatch(resetDownloadQueryImg());
    } else if (
      image?.response &&
      image?.response?.data &&
      image?.response?.data?.code !== 200
    ) {
      showSnackAlert("warning", image?.response?.data?.message);
      dispatch(resetDownloadQueryImg());

    }
  }, [image, image?.code]);

  useEffect(() => {
    if (
      ftresponse?.response &&
      ftresponse?.response?.data &&
      ftresponse?.response?.data?.code !== 200
    ) {
      showSnackAlert("warning", ftresponse?.response?.data?.message);
      dispatch(resetFetchTickets());
    }
  }, [ftresponse, ftresponse?.code]);

  useEffect(() => {
    if (tsResponse && tsResponse?.code && tsResponse?.code === 200) {
      showSnackAlert("success", tsResponse?.message);
      const ticketMdl = {
        user_type: -1,
        pageId: 1,
        pageLimit: 10,
      };
      dispatch(fetchTickets(ticketMdl));
      dispatch(resetUpdateTicketStatus());
    } else if (
      tsResponse?.response &&
      tsResponse?.response?.data &&
      tsResponse?.response?.data?.code !== 200
    ) {
      showSnackAlert("warning", tsResponse?.response?.data?.message);
      dispatch(resetAddActivityCreator());
    }
  }, [tsResponse, tsResponse?.code]);

  const handleStatusSwal = (tsMdl) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to reopen this ticket after it has been closed!",
      showCancelButton: true,
      confirmButtonColor: "#2a9f2a ",
      cancelButtonColor: "#db1919 ",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(updateTicketStatus(tsMdl));
      }
    });
  };

  useEffect(() => {
    const masterDataObj = [
      {
        group: "TTYPE",
        active: 1,
      },
    ];

    dispatch(jobSeekerProfileMasterData(masterDataObj));
  }, []);

  useEffect(() => {
    if (JS_MASTER_DATA && JS_MASTER_DATA?.JSMasterData) {
      JS_MASTER_DATA?.JSMasterData?.map((e, i) => {
        let modeoptions: any = [];
        if (e.group == "TTYPE") {
          e.data.map((e) => {
            modeoptions?.push({
              label: e?.value,
              value: e?.id,
            });
          });
          setAreaOfConcernList(modeoptions);
        }
      });
    }
  }, [JS_MASTER_DATA]);

  const TicketStatusOptions = [
    { value: "OPEN", label: "Open" },
    { value: "CLOSED", label: "Close" },
  ];
  const UserTypeOptions = [
    { value: "1", label: "Existing" },
    { value: "0", label: "Anonymous" },
  ];

  const emailSearchHandler = () => {
    regex.email.test(emailAddress);
    if (regex.email.test(emailAddress) && emailAddress && emailAddress !== "") {
      const emailMdl = {
        pageId: 1,
        pageLimit: 10,
        mail: emailAddress ? emailAddress : "",
      };
      dispatch(fetchTickets(emailMdl));
    }
  };

  const searchHandler = (page?: any,parameter?:any) => {
    const pageId = page === "searched" ? 1 : page;
    let searchMdl;
    if(parameter){
      searchMdl = {
        user_type: userTypeInp !== null ? parseInt(userTypeInp.value) : -1,
        category:
          areaOfConcernListInp !== null ? areaOfConcernListInp.label : "",
        pageId: pageId,
        pageLimit: 10,
      };
      if(parameter?.ticketStatusInp){
        searchMdl.status= ticketStatusInp !== null ? ticketStatusInp?.value : "OPEN"
      }
      if(parameter?.emailAddress){
        searchMdl.mail=parameter?.emailAddress
      }
      dispatch(fetchTickets(searchMdl));
      setCurrentPage(pageId);
    }
    else if (ticketStatusInp === null && emailAddress === null) {
      searchMdl = {
        user_type: userTypeInp !== null ? parseInt(userTypeInp.value) : -1,
        category:
          areaOfConcernListInp !== null ? areaOfConcernListInp.label : "",
        pageId: pageId,
        pageLimit: 10,
      };
      dispatch(fetchTickets(searchMdl));
      setCurrentPage(pageId);
    } else if (ticketStatusInp === null && emailAddress !== null ) {
      searchMdl = {
        user_type: userTypeInp !== null ? parseInt(userTypeInp.value) : -1,
        mail: emailAddress,
        category:
          areaOfConcernListInp !== null ? areaOfConcernListInp.label : "",
        pageId: pageId,
        pageLimit: 10,
      };
      dispatch(fetchTickets(searchMdl));
      setCurrentPage(pageId);
    } else if (ticketStatusInp !== null && emailAddress === null ) {
      searchMdl = {
        user_type: userTypeInp !== null ? parseInt(userTypeInp.value) : -1,
        category:areaOfConcernListInp !== null ? areaOfConcernListInp.label : "",
        status: ticketStatusInp !== null ? ticketStatusInp?.value : "OPEN",
        pageId: pageId,
        pageLimit: 10,
      };
      dispatch(fetchTickets(searchMdl));
      setCurrentPage(pageId);
    } else {
      searchMdl = {
        user_type: userTypeInp !== null ? parseInt(userTypeInp.value) : -1,
        category:
          areaOfConcernListInp !== null ? areaOfConcernListInp.label : "",
        status: ticketStatusInp !== null ? ticketStatusInp?.value : "OPEN",
        pageId: pageId,
        pageLimit: 10,
      };
      dispatch(fetchTickets(searchMdl));
      setCurrentPage(pageId);
    }
  };

  const resetHandler = () => {
    setEmailAddress("");
    setTicketStatusInp(null);
    setAreaOfConcernListInp(null);
    setUserTypeInp(null);
    const ticketMdl = {
      user_type: -1,
      pageId: 1,
      pageLimit: 10,
    };
    dispatch(fetchTickets(ticketMdl));
    setCurrentPage(1);
  };

  const handleDownloadImg = (id) => {
    const downloadMdl = {
      id: [id],
      sasFor: "TICKET",
    };
    dispatch(downloadQueryImg(downloadMdl));
    dispatch(resetDownloadQueryImg());
  };
  const textLimit: number = 25;

  return (
    <>
      {ftloading && <TicketManagement_SK />}
      {!ftloading && (
        <div className="page-content bg-white">
          <div className="content-block">
            <div
              className="browse-job section-full bg-white p-t50 p-b20"
              ref={inputRef}
            >
              <div className="container">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 m-b30 mt-5">
                    <div className="job-bx browse-job clearfix">
                      <div className="job-bx-title  clearfix">
                        <h5 className="font-weight-700 pull-left text-uppercase">
                          Manage Tickets
                        </h5>
                        <div className="float-right">
                          <Chip
                            label={
                              <span className="custom-job-content text-bold">
                                Total Tickets
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
                                {ftresponse?.data?.totalCount
                                  ? ftresponse?.data?.totalCount
                                  : "0"}
                              </Avatar>
                            }
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-xl-3 col-lg-4 col-md-5 col-sm-12 m-b30">
                          <aside
                            id="accordion1"
                            className="sidebar-filter bg-white"
                          >
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
                                      onClick={() => {
                                        resetHandler();
                                      }}
                                      className="font-12 float-right"
                                    >
                                      <TbClearAll /> Reset
                                    </Link>{" "}
                                  </div>
                                </div>
                              </h6>
                              <Accordion.Collapse eventKey="0">
                                <div
                                  id="companies"
                                  className="acod-body collapse show"
                                >
                                  <div className="acod-content">
                                    <input
                                      className="form-control mb-3"
                                      type="search"
                                      value={emailAddress}
                                      placeholder="Email Address"
                                      aria-label="Search "
                                      onChange={(e: any) => {
                                        setEmailAddress(e.target.value);
                                      }}
                                    />
                                    {/* <span
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
                                          emailSearchHandler();
                                        }}
                                      />
                                    </span> */}

                                    <Select
                                      name="AreaOfConcern mb-3"
                                      className="dropstyle"
                                      styles={customStyles}
                                      placeholder="Area Of Concern"
                                      id="react-select-4-listbox areaOfConcern"
                                      isClearable={true}
                                      options={areaOfConcernList}
                                      value={areaOfConcernListInp}
                                      onChange={(option: any) => {
                                        let event = {
                                          target: {
                                            name: "AreaOfConcern",
                                            value: option,
                                          },
                                        };
                                        setAreaOfConcernListInp(
                                          event.target.value
                                        );
                                      }}
                                    />
                                    <br />
                                    <Select
                                      name="UserType"
                                      className="dropstyle"
                                      styles={customStyles}
                                      placeholder="User Type"
                                      id="react-select-4-listbox areaOfConcern"
                                      isClearable={true}
                                      options={UserTypeOptions}
                                      value={userTypeInp}
                                      onChange={(option: any) => {
                                        let event = {
                                          target: {
                                            name: "UserType",
                                            value: option,
                                          },
                                        };
                                        setUserTypeInp(event.target.value);
                                      }}
                                    />
                                    <br />
                                    <Select
                                      name="TicketStatus"
                                      className="dropstyle"
                                      styles={customStyles}
                                      placeholder="Ticket Status"
                                      id="react-select-4-listbox areaOfConcern"
                                      isClearable={true}
                                      options={TicketStatusOptions}
                                      value={ticketStatusInp}
                                      onChange={(option: any) => {
                                        let event = {
                                          target: {
                                            name: "TicketStatus",
                                            value: option,
                                          },
                                        };
                                        setTicketStatusInp(event.target.value);
                                      }}
                                    />
                                    <br />
                                    <button
                                      className="col-lg-12 site-button border border-primary btn-sm  mb-2"
                                      style={{ zIndex: "0" }}
                                      onClick={() => {
                                        let searched = "searched";
                                        const obj:any={
                                          pageLimit: 10,
                                          user_type: userTypeInp !== null ? parseInt(userTypeInp.value) : -1,
                                          category:areaOfConcernListInp !== null ? areaOfConcernListInp.label : "",
                                        }
                                        if(emailAddress){
                                        obj.mail=emailAddress
                                        }
                                        if(ticketStatusInp){
                                          obj.status= ticketStatusInp !== null ? ticketStatusInp?.value:"OPEN"
                                        }
                                        setApiparameter({...obj})
                                        searchHandler(searched);
                                      }}
                                    >
                                      Search
                                    </button>
                                  </div>
                                </div>
                              </Accordion.Collapse>
                            </Accordion>
                          </aside>
                        </div>

                        {ftresponse?.data?.tickets &&
                          ftresponse?.data?.tickets?.length === 0 &&
                          !ftloading && (
                            <center>
                              <div className="col-xl-9 col-lg-8 col-md-7">
                                <img src={notfoundImg} alt="" />
                                <h6
                                  style={{
                                    fontSize: "13px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Oops no record found.
                                </h6>
                              </div>
                            </center>
                          )}

                        {ftresponse?.data?.tickets?.length > 0 &&
                          !ftloading && (
                            <>
                              <div className="col-xl-9 col-lg-8 col-md-7">
                                <table className="table-job-bx cv-manager company-manage-job">
                                  <thead>
                                    <tr>
                                      <th>Ticket Id</th>
                                      <th>Applicant</th>
                                      <th>Contact Number</th>
                                      <th>Activities</th>
                                      <th>Query</th>
                                      <th>Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {ftresponse?.data?.tickets?.map(
                                      (item, index) => (
                                        <tr>
                                          <td className="job-name">
                                            <span title="Ticket Id">
                                              {item?.service_req_no
                                                ? item?.service_req_no
                                                : "Not-Available"}
                                            </span>
                                          </td>
                                          <td className="job-name">
                                            <>
                                              <Tooltip
                                                title={item?.name}
                                                placement="top"
                                              >
                                                <p>
                                                  {Content(
                                                    item?.name,
                                                    textLimit
                                                  )}
                                                </p>
                                              </Tooltip>
                                            </>
                                            <ul
                                              className="job-post-info"
                                              style={{ marginTop: "-15px" }}
                                            >
                                              <li key={index}>
                                                {/* <Link
                                                  to={`mailto:${item?.contact_info?.mail}`}
                                                  style={{
                                                    color: "#007bff",
                                                    fontSize: "14px",
                                                  }}
                                                >
                                                  {item?.contact_info?.mail}
                                                </Link> */}
                                                <Tooltip
                                                  title={
                                                    item?.contact_info?.mail
                                                  }
                                                  placement="top"
                                                >
                                                  <Link
                                                    to={`mailto:${item?.contact_info?.mail}`}
                                                    style={{
                                                      color: "#007bff",
                                                      fontSize: "14px",
                                                    }}
                                                  >
                                                    {Content(
                                                      item?.contact_info?.mail,
                                                      textLimit
                                                    )}
                                                  </Link>
                                                </Tooltip>
                                              </li>
                                            </ul>
                                          </td>

                                          <td className="application tabletd">
                                            &nbsp;&nbsp;
                                            {item?.contact_info?.phone}
                                            &nbsp;
                                          </td>

                                          <td
                                            className="application tabletd"
                                            style={{ color: "#007bff" }}
                                          >
                                            <a
                                              href="#"
                                              title="Manage Activity"
                                              style={{ cursor: "pointer" }}
                                              onClick={() => {
                                                setActivityMsg(
                                                  item?.ticket_activity?.map(
                                                    (v) => {
                                                      return {
                                                        message:
                                                          v?.msg && v?.msg,
                                                        created_at:
                                                          v?.created_at &&
                                                          v?.created_at,
                                                        _id: v?._id && v?._id,
                                                        created_by:
                                                          v?.created_by &&
                                                          v?.created_by,
                                                      };
                                                    }
                                                  )
                                                );
                                                setActivityStatus(item?.status);
                                                setCreatedAt(
                                                  item?.ticket_activity?.map(
                                                    (c) => {
                                                      return (
                                                        c?.created_at &&
                                                        c?.created_at
                                                      );
                                                    }
                                                  )
                                                );
                                                setTicketId(item?.ticket_id);

                                                setActivityModal(true);
                                              }}
                                            >
                                              {`${item?.ticket_activity?.length}`}
                                              &nbsp;Activities
                                            </a>
                                          </td>

                                          <td className="application text-primary">
                                            &nbsp;
                                            <BsEyeFill
                                              className="text-primary"
                                              style={{
                                                fontSize: "18px",
                                                cursor: "pointer",
                                              }}
                                              aria-describedby={id}
                                              title="View Query"
                                              onClick={(e: any) => {
                                                handleClick(e);
                                                setViewQueryMdl(true);
                                                setQueryId(item?.ticket_id);
                                                setAttachment(item?.attchment);
                                                setQuery(item?.description);
                                                setCategory(item?.category);
                                                setQueryCreated({
                                                  name: item?.name,
                                                  created_at: item?.created_at,
                                                });
                                              }}
                                            />
                                          </td>

                                          <td className="application text-primary">
                                            {item?.status === "OPEN" ? (
                                              <span title="Close the tickets by clicking here.">
                                                <a
                                                  color="error"
                                                  style={{
                                                    cursor: "pointer",
                                                  }}
                                                  onClick={() => {
                                                    const tsMdl = {
                                                      tktid: item?.ticket_id,
                                                      status:
                                                        item?.status === "OPEN"
                                                          ? "CLOSED"
                                                          : "OPEN",
                                                    };
                                                    if (
                                                      item?.ticket_activity
                                                        ?.length === 0 &&
                                                      item?.status === "OPEN"
                                                    ) {
                                                      showSnackAlert(
                                                        "warning",
                                                        "Please add at least one activity before closing this ticket"
                                                      );
                                                    } else {
                                                      handleStatusSwal(tsMdl);
                                                    }
                                                  }}
                                                >
                                                  Open
                                                </a>
                                              </span>
                                            ) : (
                                              <span title="Closed">
                                                <p style={{ color: "gray" }}>
                                                  Closed
                                                </p>
                                              </span>
                                            )}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>

                              <div className="container">
                                <div className="pagination-bx pull-right float-right m-t10 w-100">
                                  <Pagination
                                    className="pagination-data"
                                    onChange={PaginationChange}
                                    total={ftresponse?.data?.totalCount}
                                    current={currentpage}
                                    pageSize={size}
                                    showSizeChanger={true}
                                    itemRender={PrevNextArrow}
                                    onShowSizeChange={PerPageChange}
                                  />
                                </div>
                              </div>
                            </>
                          )}
                      </div>

                      <Modal
                        show={activityModal}
                        style={{ maxHeight: "100%", overflowY: "auto" }}
                        className="modal fade modal-bx-info editor"
                      >
                        <div
                          className="modal-dialog my-0 mx-0 w-100 "
                          role="document"
                        >
                          <div className="browse-job modal-content">
                            <div className="modal-body">
                              <div className="d-flex justify-content-between text-break">
                                <div>
                                  <h5
                                    style={{
                                      textAlign: "center",
                                      wordWrap: "break-word",
                                    }}
                                  >
                                    Manage Activity
                                  </h5>
                                </div>
                                <div></div>
                                <button
                                  type="button"
                                  className="close mb-3 ml-2"
                                  onClick={() => {
                                    setActivityModal(false);
                                    setActivityInp("");
                                    setActivityInpErr(false);
                                  }}
                                >
                                  <span aria-hidden="true">&times;</span>
                                </button>
                              </div>

                              {activityStatus === "OPEN" ? (
                                <div className="col-lg-12 col-md-12">
                                  <label>Add Activity</label>
                                  <span>
                                    <button
                                      type="button"
                                      className="site-button border border-primary btn-sm  mb-2"
                                      style={{
                                        float: "right",
                                      }}
                                      onClick={() => {
                                        handleAddActivity();
                                        handleClickScroll();
                                      }}
                                    >
                                      Add
                                    </button>
                                  </span>
                                  {activityStatus === "OPEN" ? (
                                    <textarea
                                      name="AddActivity"
                                      autoComplete="off"
                                      maxLength={500}
                                      style={{
                                        resize: "none",
                                        maxHeight: "75%",
                                      }}
                                      placeholder="Enter your Activity"
                                      onChange={(e) => {
                                        setActivityInp(e.target.value);
                                      }}
                                      value={activityInp}
                                      className="form-control"
                                    ></textarea>
                                  ) : (
                                    ""
                                  )}

                                  {activityInpErr && activityInp === "" && (
                                    <p className="form-error">
                                      {"To add an activity, kindly enter it."}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                ""
                              )}

                              {
                                <>
                                  {activityMsg &&
                                    activityMsg?.map((v) => (
                                      <div className="job-bx bg-white mt-2 text-break">
                                        <h6>{v.message}</h6>
                                        <span className="custom-timeDiff">
                                          Posted &nbsp;
                                          {v?.created_at && v?.created_at
                                            ? getDateDifference(v?.created_at)
                                            : " : Not Mentioned."}
                                        </span>
                                        <span
                                          className="custom-timeDiff"
                                          style={{ float: "right" }}
                                        >
                                          Posted By : &nbsp;
                                          {v?.created_by && v?.created_by?.email
                                            ? v?.created_by?.email
                                            : "Not Mentioned."}
                                        </span>
                                      </div>
                                    ))}
                                </>
                              }

                              <hr></hr>

                              <br></br>
                            </div>
                          </div>
                        </div>
                      </Modal>

                      <Modal
                        show={viewQueryMdl}
                        style={{
                          maxHeight: "100%",
                          overflowY: "auto",
                        }}
                        className="modal fade modal-bx-info editor"
                      >
                        <div
                          className="modal-dialog my-0 mx-0 w-100 "
                          role="document"
                        >
                          <div
                            className="browse-job modal-content"
                            // style={{ minHeight: "300px" }}
                          >
                            <div className="modal-body">
                              <div className="d-flex justify-content-between text-break">
                                <div>
                                  <h5
                                    style={{
                                      textAlign: "center",
                                      wordWrap: "break-word",
                                    }}
                                  >
                                    View Query
                                  </h5>
                                </div>
                                <div>
                                  <button
                                    type="button"
                                    className="close"
                                    onClick={() => {
                                      setViewQueryMdl(false);
                                    }}
                                  >
                                    <span aria-hidden="true">&times;</span>
                                  </button>
                                </div>
                              </div>

                              <div className="d-flex justify-content-between">
                                <div className="mt-2">
                                  <label htmlFor="">Query Description</label>
                                </div>
                                <div>
                                  <span>
                                    {attachment !== null ? (
                                      <IconButton>
                                        <BsCloudDownload
                                          className="text-primary"
                                          title="Click to download image."
                                          style={{
                                            cursor: "pointer",
                                          }}
                                          onClick={() => {
                                            handleDownloadImg(queryId);
                                          }}
                                        />
                                      </IconButton>
                                    ) : (
                                      ""
                                    )}
                                  </span>
                                </div>
                              </div>
                              <div className="mt-3">
                                <div style={{ minHeight: "200px" }}>
                                  <span>
                                    <p>{query}</p>
                                  </span>
                                </div>

                                {queryCreated && (
                                  <div>
                                    <span className="custom-timeDiff">
                                      Posted &nbsp;
                                      {queryCreated?.created_at &&
                                      queryCreated?.created_at
                                        ? getDateDifference(
                                            queryCreated?.created_at
                                          )
                                        : " : Not Mentioned."}
                                    </span>
                                    <span
                                      className="custom-timeDiff"
                                      style={{ float: "right" }}
                                    >
                                      Posted By : &nbsp;
                                      {queryCreated?.name
                                        ? queryCreated?.name
                                        : "Not Mentioned."}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Modal>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default TicketManagement;
