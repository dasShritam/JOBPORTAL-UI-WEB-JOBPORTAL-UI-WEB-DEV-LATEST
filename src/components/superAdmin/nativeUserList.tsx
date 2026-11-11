import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Accordion } from "react-bootstrap";
import { BsCloudDownload, BsEyeFill, BsPersonCircle } from "react-icons/bs";
import { MdOutlineReplay } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

import { UseToastAlert } from "../../hooks/useToastAlert";
import {
  Avatar,
  Chip,
  IconButton,
  Popover,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import Swal from "sweetalert2";
import "../../assets/customCss/Pagination.css";
import Pagination from "rc-pagination";
import Select from "react-select";
import { Content, customStyles } from "../../common/common";
import "../../assets/customCss/JobSeekerRegister.css";
import "../../assets/customCss/NativeUserManagement.css";
import NativeUserListSkeleton from "./nativeUserListSkeleton";
import { TbClearAll } from "react-icons/tb";
import { RoleType } from "../../routes/roles";
import {
  resendMail,
  resetResendMail,
} from "../../redux/features/admin/userManagement/UserManagementSlice";
import {
  PatchNativeToggleSwitch,
  PatchNativeToggleSwitchSliceReset,
  getNativeUserManage,
  patchNativeUserManageSliceReset,
  postNativeUserManageSliceReset,
} from "../../redux/features/admin/NativeuserManagementSlice";
import NativeUsermanagement from "./nativeUserManagement";
import { AiOutlineEdit } from "react-icons/ai";
import { downloadUserInfo } from "../../redux/features/admin/AuthEmployerRegSlice";
import { RiDownload2Fill } from "react-icons/ri";
var NodataFound = require("../../assets/images/background/No-record.png");

enum AccessabilityOption {
  FAQM = "FAQM",
  CSM = "CSM",
  CM = "CM",
  AM = "AM",
  PM = "PM",
  TP = "TP",
}

const NativeUserList = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showChildComponent, setShowChildComponent] = useState<boolean>(false);

  const dispatch = useDispatch(),
    [page] = useState(1);
  const [permis, setPermis] = useState();
  const [currentpage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [size, setSize] = useState(perPage);
  const snackAlert = UseToastAlert();

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const [FF, setFF] = useState<any>({ value: null, label: "All User" });
  const ISFRESHEROPTION = [
    { value: null, label: "All User" },
    { value: "ACTIVE", label: "Only Active User" },
    { value: "INACTIVE", label: "Only Inactive User" },
  ];
  const [filteremail, setFilteremail] = useState("");
  const UserListOptions = {
    roleType: RoleType.ADMINISTRATOR,
    exp: "",
    userId: "",
    emailId: filteremail ? filteremail : "",
    pageid: page,
    pageLimit: perPage,
    active: FF && FF?.value ? FF?.value : null,
  };

  const { nativeUserData, loadingG } = useSelector(
    (state: any) => state?.GetNativeuserManagementData
  );

  useEffect(() => {
    dispatch(getNativeUserManage(UserListOptions));
  }, []);

  const handleConfirmSwal = (row: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${row?.active ? "Disable" : "Enable"} this User?`,
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result?.isConfirmed) {
        dispatch(
          PatchNativeToggleSwitch({
            userId: row?.userId,
            accessType: row?.active ? "DISABLE" : "ENABLE",
          })
        );
      }
    });
  };

  const handleAdd = (e: boolean) => {
    setSelectedItem(null);
    setShowChildComponent(e);
  };

  const handleEdit = (row: any) => {
    setSelectedItem(row);
    setShowChildComponent(true);
  };

  const { nativeUserList } = useSelector(
    (state: any) => state?.PostNativeuserManagementData
  );
  const { patchnativeToggle } = useSelector(
    (state: any) => state?.PatchNativeToggleData
  );

  const { patchnativeUserList, loadingP } = useSelector(
    (state: any) => state.PatchNativeuserManagementData
  );

  let resendMailState = useSelector((state: any) => state.resendMail);
  const [loaderr, setLoaderr] = useState<any>({});
  const [loaderid, setloaderid] = useState<any>();
  useEffect(() => {
    if (resendMailState?.loading) {
      setLoaderr((prevState) => ({ ...prevState, [loaderid]: true }));
    } else {
      setLoaderr((prevState) => ({ ...prevState, [loaderid]: false }));
    }
  }, [resendMailState?.loading]);
  useEffect(() => {
    if (
      nativeUserList &&
      nativeUserList?.code &&
      nativeUserList?.code === 200
    ) {
      snackAlert("success", nativeUserList?.message);
      dispatch(getNativeUserManage(UserListOptions));
      dispatch(postNativeUserManageSliceReset());
      handleAdd(false);
    } else if (nativeUserList?.response?.data?.code === 400) {
      snackAlert("warning", "Bad Request");
      dispatch(postNativeUserManageSliceReset());
    } else if (nativeUserList?.response?.data?.code === 500) {
      snackAlert("error", nativeUserList?.message);
      dispatch(postNativeUserManageSliceReset());
    } else if (
      nativeUserList &&
      nativeUserList?.code &&
      nativeUserList?.code !== 200
    ) {
      snackAlert("warning", nativeUserList?.message);
      dispatch(postNativeUserManageSliceReset());
    }
  }, [nativeUserList]);

  useEffect(() => {
    if (
      patchnativeToggle &&
      patchnativeToggle?.code &&
      patchnativeToggle?.code === 200
    ) {
      snackAlert("success", patchnativeToggle?.message);
      dispatch(getNativeUserManage(UserListOptions));
      dispatch(PatchNativeToggleSwitchSliceReset());
    } else if (patchnativeToggle?.response?.data?.code === 400) {
      snackAlert("warning", "Bad Request");
      dispatch(PatchNativeToggleSwitchSliceReset());
    } else if (patchnativeToggle?.response?.data?.code === 500) {
      snackAlert("error", patchnativeToggle?.message);
      dispatch(PatchNativeToggleSwitchSliceReset());
    } else if (
      patchnativeToggle &&
      patchnativeToggle?.code &&
      patchnativeToggle?.code !== 200
    ) {
      snackAlert("warning", patchnativeToggle?.message);
      dispatch(PatchNativeToggleSwitchSliceReset());
    }
  }, [patchnativeToggle]);
  useEffect(() => {
    if (resendMailState?.res?.code === 200) {
      snackAlert("success", resendMailState?.res?.message);
      dispatch(resetResendMail());
    } else if (resendMailState?.res?.code === 400) {
      snackAlert("warning", resendMailState?.res?.message);
      dispatch(resetResendMail());
    } else if (resendMailState?.res?.code === 500) {
      snackAlert("error", resendMailState?.res?.message);
      dispatch(resetResendMail());
    }
  }, [resendMailState]);

  useEffect(() => {
    if (
      patchnativeUserList &&
      patchnativeUserList?.code &&
      patchnativeUserList?.code === 200
    ) {
      snackAlert("success", patchnativeUserList?.message);
      dispatch(getNativeUserManage(UserListOptions));
      dispatch(patchNativeUserManageSliceReset());
      handleAdd(false);
    } else if (patchnativeUserList?.response?.data?.code === 400) {
      snackAlert("warning", "Bad Request");
      dispatch(patchNativeUserManageSliceReset());
    } else if (patchnativeUserList?.response?.data?.code === 500) {
      snackAlert("error", patchnativeUserList?.message);
      dispatch(patchNativeUserManageSliceReset());
    } else if (
      patchnativeUserList &&
      patchnativeUserList?.code &&
      patchnativeUserList?.code !== 200
    ) {
      snackAlert("warning", patchnativeUserList?.message);
      dispatch(patchNativeUserManageSliceReset());
    }
  }, [patchnativeUserList, loadingP]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const PerPageChange = (value: any) => {
    setSize(value);
    if (nativeUserData?.data?.userInfo) {
      Math.ceil(nativeUserData?.data?.userInfo?.length / value);
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
    const UserListOptions = {
      roleType: RoleType.ADMINISTRATOR,
      exp: "",
      userId: "",
      emailId: "",
      pageid: page,
      pageLimit: perPage,
      active: FF && FF?.value ? FF?.value : null,
    };
    dispatch(getNativeUserManage(UserListOptions));
  };

  const resetHandler = () => {
    setFilteremail("");
    setFF({ value: null, label: "All User" });
    const UserListOptions = {
      roleType: RoleType.ADMINISTRATOR,
      exp: "",
      userId: "",
      emailId: "",
      pageid: 1,
      pageLimit: perPage,
    };
    dispatch(getNativeUserManage(UserListOptions));
    setCurrentPage(1);
  };

  const handleToggle = (selectedOption: any) => {
    dispatch(
      getNativeUserManage({
        roleType: RoleType.ADMINISTRATOR,
        exp: "",
        userId: "",
        emailId: filteremail ? filteremail : "",
        pageid: page,
        pageLimit: perPage,
        active:
          selectedOption && selectedOption.value ? selectedOption.value : null,
      })
    );
  };
  //download userdetails
  const { downUserInfo, loadingD } = useSelector(
    (state: any) => state.DownloadUserInfoData
  );
  return (
    <>
      <div className="page-content bg-white">
        <div className="content-block">
          <div className="browse-job section-full bg-white p-t50 p-b20">
            <div className="container">
              <div className="row">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 m-b30 mt-5">
                  <div className="job-bx browse-job clearfix">
                    {!loadingG && (
                      <div>
                        {" "}
                        <div className="job-bx-title clearfix NativeTitle">
                          <h5 className="font-weight-700 pull-left text-uppercase">
                            MANAGE NATIVE USER{" "}
                          </h5>{" "}
                          {!showChildComponent && (
                            <div className="d-flex float-right ">
                              <Stack direction="row" spacing={1}>
                                <Chip
                                  avatar={
                                    <Avatar
                                      className="btn site-button btn-sm "
                                      style={{
                                        color: "white",
                                        backgroundColor: "blue",
                                      }}
                                    >
                                      {nativeUserData?.data?.totalCount
                                        ? nativeUserData?.data?.totalCount
                                        : "0"}
                                    </Avatar>
                                  }
                                  label="Total User"
                                />
                              </Stack>
                              {nativeUserData?.data?.userInfo?.length !== 0 && (
                                <Link
                                  // style={{ marginLeft: "90%" }}
                                  className="ml-3"
                                  to={""}
                                  style={{
                                    borderRadius: "0px",
                                    color: "white",
                                    backgroundColor: "rgb(14 173 105)",
                                  }}
                                  id="down-icon"
                                  title="Download total Users"
                                  download="filename.csv"
                                  onClick={() => {
                                    const details = {
                                      userType: "ADMINISTRATOR",
                                      id: 1,
                                    };
                                    dispatch(downloadUserInfo(details));
                                  }}
                                >
                                  <BsCloudDownload />
                                </Link>
                              )}
                            </div>
                          )}
                        </div>
                        {!showChildComponent && (
                          <div className="row">
                            <div className="col-xl-3 col-lg-4 col-md-5 col-sm-12 m-b30 mt-5">
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
                                      <div className="acod-content ">
                                        <input
                                          className="form-control mb-2"
                                          type="search"
                                          value={filteremail}
                                          aria-label="Search "
                                          onChange={(e: any) => {
                                            setFilteremail(e?.target?.value);
                                          }}
                                          placeholder="Enter Email Address"
                                        />

                                        <div style={{ width: "100%" }}>
                                          <Select
                                            maxMenuHeight={200}
                                            placeholder="Filter by experience"
                                            minMenuHeight={100}
                                            isDisabled={false}
                                            value={FF}
                                            options={ISFRESHEROPTION}
                                            isSearchable={false}
                                            defaultValue={{
                                              value: null,
                                              label: "All User",
                                            }}
                                            onChange={(selectedOption: any) => {
                                              setFF(selectedOption);
                                            }}
                                            className="dropstyle "
                                            styles={customStyles}
                                          />
                                        </div>

                                        <br />
                                        <button
                                          className="col-lg-12 site-button border border-primary btn-sm  mb-2"
                                          style={{ zIndex: "0" }}
                                          onClick={(e: any) => {
                                            handleToggle(FF);
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

                            <div className="col-xl-9 col-lg-8 col-md-7 mt-1">
                              <div
                                className="mb-2"
                                style={{ display: "flex", float: "right" }}
                              >
                                <button
                                  className="site-button btn-success add-btn ml-2"
                                  style={{ marginBottom: "1%" }}
                                  onClick={() => {
                                    handleAdd(true);
                                  }}
                                >
                                  Invite User
                                </button>
                              </div>
                              {nativeUserData?.data?.userInfo?.length !== 0 && nativeUserData?.data?.userInfo?.length != undefined && (
                                <>
                                  <div className="table-scroll-sm">
                                    <table className="table-job-bx cv-manager company-manage-job">
                                      <thead>
                                        <tr>
                                          <th>User Info</th>
                                          <th>Contact Number </th>

                                          <th>Permission(s)</th>
                                          <th className="text-center">
                                            Action
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {nativeUserData?.data?.userInfo?.map(
                                          (row: any) => (
                                            <tr key={row?.userId}>
                                              <td className="job-name d-flex ">
                                                <div
                                                  style={{
                                                    color: "lightgray",
                                                  }}
                                                >
                                                  {" "}
                                                  <BsPersonCircle
                                                    style={{
                                                      fontSize: "42px",
                                                    }}
                                                  />{" "}
                                                </div>{" "}
                                                <ul className="job-post-info ml-1 ">
                                                  <li
                                                    className="job-name"
                                                    style={{
                                                      fontWeight: "600",
                                                      color: "#333",
                                                      fontSize: "14px",
                                                    }}
                                                    title={row?.name}
                                                  >
                                                    {Content(row?.name, 30)}
                                                  </li>
                                                  <br />
                                                  <li>
                                                    <Link
                                                      style={{
                                                        color: "#007bff",
                                                        fontSize: "14px",
                                                      }}
                                                      to={`mailto:${row?.contact?.mail?.val}`}
                                                      title={
                                                        row?.contact?.mail?.val
                                                      }
                                                    >
                                                      {Content(
                                                        row?.contact?.mail?.val,
                                                        30
                                                      )}
                                                    </Link>
                                                  </li>
                                                </ul>
                                              </td>
                                              <td>
                                                <div>
                                                  {"  "}
                                                  <span
                                                    style={{ fontSize: "14px" }}
                                                  >
                                                    {`${row?.contact?.ph?.code} ${row?.contact?.ph?.val}`}
                                                  </span>
                                                </div>
                                              </td>

                                              <td className="">
                                                <div className="float-center">
                                                  <Link
                                                    to={"#"}
                                                    className="primary"
                                                    aria-describedby={id}
                                                    onClick={(e: any) => {
                                                      handleClick(e);
                                                      setPermis(
                                                        row?.permission?.map(
                                                          (e: any) => {
                                                            if (
                                                              e ===
                                                              AccessabilityOption.FAQM
                                                            )
                                                              return (
                                                                <>
                                                                  <Chip
                                                                    className="mt-1"
                                                                    label="Manage FAQ"
                                                                  ></Chip>
                                                                  &nbsp;
                                                                  <br />
                                                                </>
                                                              );
                                                            if (
                                                              e ===
                                                              AccessabilityOption.CSM
                                                            )
                                                              return (
                                                                <>
                                                                  <Chip
                                                                    className="mt-1"
                                                                    label="Manage Customer Support"
                                                                  ></Chip>
                                                                  &nbsp;
                                                                  <br />
                                                                </>
                                                              );
                                                            if (
                                                              e ===
                                                              AccessabilityOption.CM
                                                            )
                                                              return (
                                                                <>
                                                                  <Chip
                                                                    className="mt-1"
                                                                    label="Manage Quick Contact"
                                                                  ></Chip>
                                                                  &nbsp;
                                                                  <br />
                                                                </>
                                                              );
                                                            if (
                                                              e ===
                                                              AccessabilityOption.AM
                                                            )
                                                              return (
                                                                <>
                                                                  <Chip
                                                                    className="mt-1"
                                                                    label="Manage Assessment"
                                                                  ></Chip>
                                                                  &nbsp;
                                                                  <br />
                                                                </>
                                                              );
                                                            if (
                                                              e ===
                                                              AccessabilityOption.PM
                                                            )
                                                              return (
                                                                <>
                                                                  <Chip
                                                                    className="mt-1"
                                                                    label="Poll management"
                                                                  ></Chip>
                                                                  &nbsp;
                                                                  <br />
                                                                </>
                                                              );
                                                            if (
                                                              e ===
                                                              AccessabilityOption.TP
                                                            )
                                                              return (
                                                                <>
                                                                  <Chip
                                                                    className="mt-1"
                                                                    label="Terms and Privacy Policy management"
                                                                  ></Chip>
                                                                  &nbsp;
                                                                  <br />
                                                                </>
                                                              );
                                                          }
                                                        )
                                                      );
                                                    }}
                                                  >
                                                    <IconButton className=" text-primary">
                                                      <BsEyeFill
                                                        title="View"
                                                        style={{
                                                          fontSize: "18px",
                                                          cursor: "pointer",
                                                        }}
                                                      />
                                                    </IconButton>
                                                  </Link>
                                                  <Popover
                                                    id={id}
                                                    open={open}
                                                    anchorEl={anchorEl}
                                                    onClose={handleClose}
                                                    anchorOrigin={{
                                                      vertical: "bottom",
                                                      horizontal: "left",
                                                    }}
                                                    style={{
                                                      boxShadow:
                                                        "0px 1px 1px 0px #dacdcd",
                                                    }}
                                                  >
                                                    <Typography sx={{ p: 2 }}>
                                                      <ul>
                                                        {" "}
                                                        <div className="d-flex">
                                                          <i className="fa fa-lock mt-1"></i>{" "}
                                                          <h6 className="ml-1">
                                                            Permission(s)
                                                          </h6>
                                                        </div>
                                                        {permis}
                                                      </ul>
                                                    </Typography>
                                                  </Popover>
                                                </div>
                                              </td>
                                              <td>
                                                <div className="d-flex justify-content-around align-items-center">
                                                  {!loaderr[row?.userId] && (
                                                    <IconButton
                                                      style={{
                                                        cursor: "pointer",
                                                        fontSize: "20px",
                                                      }}
                                                      title="Resend Activation Link"
                                                      onClick={() => {
                                                        dispatch(
                                                          resendMail({
                                                            userId: row?.userId,
                                                          })
                                                        );
                                                        setloaderid(
                                                          row?.userId
                                                        );
                                                      }}
                                                    >
                                                      <MdOutlineReplay />
                                                    </IconButton>
                                                  )}
                                                  {loaderr[row?.userId] && (
                                                    <>
                                                      &nbsp;
                                                      <i
                                                        className="fa fa-circle-o-notch fa-spin"
                                                        style={{
                                                          marginRight: "10px",
                                                        }}
                                                      ></i>
                                                    </>
                                                  )}
                                                  &nbsp;
                                                  <IconButton
                                                    style={{
                                                      cursor: "pointer",
                                                      fontSize: "20px",
                                                    }}
                                                    className=""
                                                    title="Edit"
                                                    onClick={() => {
                                                      handleEdit(row);
                                                    }}
                                                  >
                                                    <AiOutlineEdit />
                                                  </IconButton>
                                                  &nbsp;
                                                  <Switch
                                                    title={
                                                      row?.active
                                                        ? "Click to disable"
                                                        : "Click to enable"
                                                    }
                                                    checked={row?.active}
                                                    onChange={() => {
                                                      handleConfirmSwal(row);
                                                    }}
                                                    inputProps={{
                                                      "aria-label":
                                                        "controlled",
                                                    }}
                                                  />
                                                </div>
                                              </td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                  <div className="pagination-bx float-right m-t20">
                                    <Pagination
                                      className="pagination-data"
                                      onChange={PaginationChange}
                                      total={nativeUserData?.data?.totalCount}
                                      current={currentpage}
                                      pageSize={size}
                                      showSizeChanger={true}
                                      itemRender={PrevNextArrow}
                                      onShowSizeChange={PerPageChange}
                                    />
                                  </div>
                                </>
                              )}
                              {nativeUserData?.data?.userInfo?.length === 0 || nativeUserData?.data?.userInfo?.length == undefined && (
                                <div>
                                  <center>
                                    <img
                                      src={NodataFound}
                                      alt=""
                                      style={{ width: "50%" }}
                                    />
                                    <br />
                                    <h6 className="font-weight-bold">
                                      Oops no record found.
                                    </h6>
                                  </center>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {showChildComponent && (
                          <NativeUsermanagement
                            row={selectedItem}
                            close={handleAdd}
                          />
                        )}
                      </div>
                    )}
                    {loadingG && <NativeUserListSkeleton />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NativeUserList;
