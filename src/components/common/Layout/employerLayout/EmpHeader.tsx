import { Badge, Switch } from "@mui/material";
import jwtDecode from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import { MdManageAccounts } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../../../assets/customCss/notification.css";
import logo2 from "../../../../assets/images/Techkri-logo-blue.png";
import { convertformatTimestamp } from "../../../../common/common";
import { ROLES } from "../../../../config/app.config";
import { AppContext } from "../../../../context/AppContext";
import { UseToastAlert } from "../../../../hooks/useToastAlert";
import {
  logout,
  resetLogout,
} from "../../../../redux/features/authentication/logoutSlice";
import {
  getNotifications,
  viewNotifyReset,
} from "../../../../redux/features/notification/NotificationSlice";
import { EMP_PERMISSIONS, RoleGroup, RoleType } from "../../../../routes/roles";
import { UI_ROUTES, getUI_ROUTES } from "../../../../shared/ui-route.shared";
import Notifications from "../../../shared/Notifications";
import { BsCloudDownload, BsEyeFill } from "react-icons/bs";
import { RiDownload2Fill } from "react-icons/ri";
import { SetEmailNotification } from "../../../../redux/features/common/public/EmailNotification";
import { getProfileDetails } from "../../../../redux/features/manage-account/profile/EmployerProfileSlice";
var pdfFile = require("../../../../assets/usermanual/Captive Jobs - Employer_User Manual.pdf");

const EmpHeader = () => {
  const {
    userInfo,
    setUserInfo,
    notifySocketCount,
    setNotifySocketCount,
    setNotifySocketData,
  } = useContext(AppContext);
  const showSnackAlert = UseToastAlert();
  const logoutfns = useSelector((state: any) => state.logout);
  const { res } = logoutfns;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const errorlogout = res?.response?.data?.message;
  const [urls, setURl] = useState<any>();
  const [displaySideBar1, setDisplaySideBar1] = useState(false);
  const [, setTrigState1] = useState();
  const decodedToken: any = sessionStorage.getItem("access_token")
    ? jwtDecode(sessionStorage.getItem("access_token")!)
    : "";
  const [displaySideBar, setDisplaySideBar] = useState(false);
  const [, setTrigState] = useState();
  const [slideBarByRole, setslideBarByRole] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [subMenuActive, setsubMenuActive] = useState(false);
  const [homeActive, sethomeActive] = useState(false);
  const [mainproActive, setmainproActive] = useState(false);
  const [emailSubscribe, setEmailSubscribe] = useState<any>(false);
  const { getNotify, loadNg, actionGn } = useSelector(
    (state: any) => state.getNotify
  );
  const [ncount, setNCount] = useState<number>(0);
  const { viewNotify, loadNv } = useSelector((state: any) => state.viewNotify);

  const handleOpenPdf = () => {
    window.open(pdfFile, "_blank");
  };

  const handleDownload = (e) => {
    e.preventDefault();

    const fileUrl = require("../../../../assets/usermanual/Captive Jobs - Employer_User Manual.pdf");

    fetch(fileUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Captive Jobs - Employer_User Manual.pdf";
        a.click();
        URL.revokeObjectURL(url);
      });
  };
  useEffect(() => {
    if (decodedToken) {
      setUserInfo(decodedToken);
    }
    dispatch(
      getNotifications({
        action: "load",
        pageId: 1,
        pageLimit: 25,
      })
    );
  }, []);
  const [empInfo, setEmpInfo] = useState<any>();

  const handleSwitch = (data: any) => {
    dispatch(SetEmailNotification(data ? 1 : 0));
  };
  useEffect(() => {}, [displaySideBar, displaySideBar1]);
  const empDetails = useSelector((state: any) => state.employeeProfile);
  const { EmployerProfile, loading } = empDetails;
  // useEffect(() => {
  //   if (!loading && EmployerProfile?.data && EmployerProfile?.data)
  //     setEmpInfo(EmployerProfile?.data?.acountInfo);
  // }, [EmployerProfile?.data, loading]);
  useEffect(() => {
    dispatch(getProfileDetails());
  }, [dispatch]);
  useEffect(() => {
    console.log(EmployerProfile?.data?.mail_sub, "ssssssssssssssssssssssss");

    setEmailSubscribe(EmployerProfile?.data?.mail_sub);
  }, [EmployerProfile?.data, EmployerProfile?.data?.mail_sub]);

  useEffect(() => {
    if (
      userInfo &&
      userInfo.roles.length &&
      RoleGroup.EMP_ADMIN_RECRUITER.includes(userInfo.roles[0])
    ) {
      setURl("/employer/employerProfile");
      setslideBarByRole(true);
    } else if (
      userInfo &&
      userInfo.roles.length &&
      userInfo.roles[0] === ROLES.JOBSEEKER
    ) {
      setURl("/jobseekerProfile");
      setslideBarByRole(false);
    }
  }, [userInfo?.roles[0]]);

  const loggedName = decodedToken?.name;
  const role = decodedToken?.roles?.length ? decodedToken?.roles[0] : "";
  const email = decodedToken?.username;
  const pageOpen = (value: any, backDrop: any) => {
    setTrigState1(value);
    backDrop ? setDisplaySideBar1(true) : setDisplaySideBar1(false);
  };

  const { userData, loadingU } = useSelector(
    (state: any) => state.getuserEmpManagement
  );
  const [name, setName] = useState(loggedName);

  useEffect(() => {
    if (!loadingU && userData?.code == 200) {
      if (userData?.data?.users?.length > 0) {
        setName(userData?.data?.users[0]?.name);
      }
    }
  }, [loadingU]);

  const { emailSub } = useSelector((state: any) => state.EmailNotification),
    mailError = emailSub?.response?.data?.message;

  useEffect(() => {
    if (emailSub?.code === 200) {
      showSnackAlert("success", emailSub?.message);
      dispatch(getProfileDetails());
    } else if (
      (emailSub && emailSub?.response && emailSub?.response?.status === 401) ||
      (emailSub && emailSub?.response && emailSub?.response?.status === 400)
    ) {
      showSnackAlert("warning", mailError);
    } else if (
      emailSub &&
      emailSub?.response &&
      emailSub?.response?.status !== 200
    ) {
      showSnackAlert("error", mailError);
    }
  }, [emailSub, mailError, dispatch]);

  useEffect(() => {
    if (res.code === 200) {
      dispatch(resetLogout());

      navigate(`/home`);
    } else if (
      (res && res.response && res.response.status === 401) ||
      (res && res.response && res.response.status === 400)
    ) {
      showSnackAlert("warning", errorlogout);
    } else if (res && res.response && res.response.status !== 200) {
      showSnackAlert("error", errorlogout);
    }
  }, [res, errorlogout, dispatch]);

  const reqLogout = (event: any) => {
    event.preventDefault();
    dispatch(logout());
  };

  const trigger = (value: any, backDrop: any) => {
    setTrigState(value);
    backDrop ? setDisplaySideBar(true) : setDisplaySideBar(false);
  };

  const handleClick = () => {
    setIsActive((current) => !current);
  };
  const handlesubmenu = () => {
    setsubMenuActive((open) => !open);
  };
  const handleHome = () => {
    sethomeActive((open) => !open);
  };
  const handleMainProfile = () => {
    setmainproActive((open) => !open);
  };
  const handleConfirmSwal = (values: any) => {
    Swal.fire({
      title: `<h4 style="color:red;">Permission Denied</h4>`,
      text: `Oops..! looks like you do not have permission to access this feature (${values}), please contact your Administrator.`,
      showCancelButton: false,
      confirmButtonColor: "red",
      confirmButtonText: "OK",
    }).then((result) => {});
  };

  function isMobile() {
    return window.innerWidth < 768;
  }

  function toggleDiv(divName) {
    if (isMobile()) {
      const div = document.getElementsByClassName(divName);
      if (div.length > 0) {
        div[0].classList.toggle("show");
      }
    }
  }

  useEffect(() => {
    if (notifySocketCount?.data) {
      setNCount(1 + ncount);
      setNotifySocketCount({});
    }
  }, [notifySocketCount]);
  useEffect(() => {
    if (!loadNv && viewNotify && viewNotify?.code && viewNotify?.code === 200) {
      dispatch(
        getNotifications({
          action: "load",
          pageId: 1,
          pageLimit: 25,
        })
      );
      dispatch(viewNotifyReset());
    } else if (
      !loadNv &&
      viewNotify &&
      viewNotify?.code &&
      viewNotify?.code !== 200
    ) {
      showSnackAlert("warning", viewNotify?.message);
      dispatch(viewNotifyReset());
    }
  }, [viewNotify]);
  useEffect(() => {
    if (!loadNg && getNotify && getNotify?.code && getNotify?.code === 200) {
      if (getNotify?.data?.count || getNotify?.data?.count === 0) {
        setNCount(getNotify?.data?.count);
      }
      if (actionGn === "load") setNotifySocketData([]);
      let temp: any[] = [];
      getNotify?.data?.notifications?.map((e: any) => {
        const content = JSON?.parse(e?.content);
        let url: string;
        if (content?.userId) {
          url = `${getUI_ROUTES(content?.code)}/${content?.userId}`;
        } else if (content?.jobid) {
          url = `${getUI_ROUTES(content?.code)}/${content?.jobid}`;
          if (content?.code === "R025") {
            sessionStorage.setItem("goBack", UI_ROUTES.R024);
          }
        } else {
          url = getUI_ROUTES(content?.code);
        }
        temp?.push({
          id: e?.id,
          title: e?.title,
          content: content?.msg,
          date: convertformatTimestamp(e?.created_at),
          url: url,
          read: e?.read,
        });
      });
      setNotifySocketData((prev) => [...prev, ...temp]);
      if (actionGn === "load") setNotifySocketData(temp);
      temp = [];
    } else if (
      !loadNg &&
      getNotify &&
      getNotify?.code &&
      getNotify?.code !== 200
    ) {
      showSnackAlert("warning", getNotify?.error);
    }
  }, [loadNg]);

  return (
    <>
      <header className="site-header mo-left header fullwidth">
        <div className="sticky-header main-bar-wraper navbar-expand-lg">
          <div className="main-bar clearfix headerStyle">
            <div className="container clearfix">
              <div className="logo-header emplogo-header mostion">
                <div>
                  <img
                    style={{ cursor: "pointer" }}
                    src={logo2}
                    className="logo"
                    alt="img"
                    onClick={() => {
                      navigate("/empDashboard");
                    }}
                  />
                </div>
              </div>
              <button
                className="navbar-toggler collapsed navicon  justify-content-end"
                type="button"
                data-toggle="collapse"
                data-target="#navbarNavDropdown"
                aria-controls="navbarNavDropdown"
                aria-expanded="false"
                aria-label="Toggle navigation"
                onClick={handleClick}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>

              <div
                className="header-nav empheader-nav navbar-collapse collapse myNavbar justify-content-start respon"
                id="navbarNavDropdown"
                style={{
                  width: isActive ? "100%" : "",
                }}
              >
                <div className="profileDivMobile mt-2 mb-2">
                  <div
                    className="d-flex align-items-center"
                    style={{ width: "55%" }}
                  >
                    <div className="profileImgMobile">
                      <img
                        style={{
                          borderRadius: "50%",
                        }}
                        alt="Profile_Image"
                        src={require("../../../../assets/images/av-pic-01.png")}
                      />
                    </div>
                    <div className="d-flex flex-column ml-1">
                      <span className="userName">{name}</span>
                      <span className="userEmail">{email}</span>
                    </div>
                  </div>
                  <div>
                    <span className="userEmail">{role}</span>
                  </div>
                  <div>
                    <Link to={urls}>
                      <span
                        className="profile_link"
                        style={{ color: "#b1b1ff", fontSize: "13px" }}
                      >
                        Update Profile
                      </span>
                    </Link>
                    <br />
                    <Link to={"/employer/companyprofile"}>
                      <span
                        className="profile_link"
                        style={{ color: "#b1b1ff", fontSize: "13px" }}
                      >
                        Update Company Profile
                      </span>
                    </Link>
                  </div>
                </div>
                <ul className="nav navbar-nav">
                  <li className="listyle">
                    <Link to={"/empDashboard"} className="menuname">
                      <i className="fa fa-home menuicon" aria-hidden="true"></i>
                      <div className="submenu-name">Dashboard</div>
                    </Link>
                  </li>
                  <li className="listyle">
                    <Link to={"#"} className="menuname">
                      <MdManageAccounts style={{ fontSize: "29px" }} />
                      <div
                        className="submenu-name"
                        onClick={() => {
                          toggleDiv("toggleManage");
                        }}
                      >
                        Manage
                      </div>
                    </Link>
                    <ul
                      className="sub-menu child-menu child-res toggleManage"
                      // style={{
                      //   display: subMenuActive ? "block" : "",
                      // }}
                    >
                      <li>
                        <Link
                          to={
                            userInfo?.roles?.includes(
                              RoleType.EMPLOYER_ADMINISTRATOR
                            ) && "/employer/userManagement"
                          }
                          className="dez-page"
                          onClick={() => {
                            !userInfo?.roles?.includes(
                              RoleType.EMPLOYER_ADMINISTRATOR
                            ) && handleConfirmSwal("user management");
                          }}
                        >
                          Users
                        </Link>
                      </li>
                      <li>
                        <Link to={"/privatejsprofile"} className="dez-page">
                          Private DB
                        </Link>
                      </li>
                    </ul>
                  </li>

                  <li onClick={handlesubmenu} className="listyle">
                    <Link to={"#"} className="menuname">
                      <i
                        className="fa fa-suitcase menuicon"
                        aria-hidden="true"
                      ></i>
                      <div
                        className="submenu-name"
                        onClick={() => {
                          toggleDiv("toggleJobs");
                        }}
                      >
                        Jobs
                      </div>
                    </Link>
                    <ul
                      className="sub-menu child-menu child-res toggleJobs"
                      style={{
                        display: subMenuActive ? "block" : "",
                      }}
                    >
                      <li>
                        <Link
                          to={"#"}
                          className="dez-page"
                          onClick={() => {
                            toggleDiv("toggleextjobs");
                          }}
                        >
                          External Jobs <i className="fa fa-angle-right"></i>
                        </Link>
                        <ul
                          className="sub-menu child-menu child-res toggleextjobs"
                          style={{
                            marginLeft: "104%",
                          }}
                        >
                          <li>
                            <Link
                              to={
                                userInfo?.permission?.includes(
                                  EMP_PERMISSIONS?.MEJ
                                ) && "/postjob/hotjob"
                              }
                              onClick={() => {
                                !userInfo?.permission?.includes(
                                  EMP_PERMISSIONS?.MEJ
                                ) && handleConfirmSwal("post hot jobs");
                              }}
                              className="dez-page"
                            >
                              Post Hot Job
                            </Link>
                          </li>
                          <li>
                            <Link
                              to={
                                userInfo?.permission?.includes(
                                  EMP_PERMISSIONS?.MEJ
                                ) && "/postjob/privatejob"
                              }
                              onClick={() => {
                                !userInfo?.permission?.includes(
                                  EMP_PERMISSIONS?.MEJ
                                ) && handleConfirmSwal("post private jobs");
                              }}
                              className="dez-page"
                            >
                              Post Private Job
                            </Link>
                          </li>
                        </ul>
                      </li>

                      <li>
                        <Link
                          to={"#"}
                          className="dez-page"
                          onClick={() => {
                            toggleDiv("toggleinrjobs");
                          }}
                        >
                          Internal Jobs <i className="fa fa-angle-right"></i>
                        </Link>
                        <ul
                          className="sub-menu child-menu child-res toggleinrjobs"
                          style={{
                            marginLeft: "104%",
                          }}
                        >
                          <li>
                            <Link
                              to={
                                userInfo?.permission?.includes(
                                  EMP_PERMISSIONS?.MIJ
                                ) && "/postjob/internaljob"
                              }
                              onClick={() => {
                                !userInfo?.permission?.includes(
                                  EMP_PERMISSIONS?.MIJ
                                ) && handleConfirmSwal("post internal jobs");
                              }}
                              className="dez-page"
                            >
                              Post IJP
                            </Link>
                          </li>
                          <li>
                            <Link
                              to={
                                userInfo?.permission?.includes(
                                  EMP_PERMISSIONS?.MIJ
                                ) && "/postjob/referaljob"
                              }
                              onClick={() => {
                                !userInfo?.permission?.includes(
                                  EMP_PERMISSIONS?.MIJ
                                ) && handleConfirmSwal("post referral jobs");
                              }}
                              className="dez-page"
                            >
                              Post RJP
                            </Link>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li onClick={handleHome} className="listyle">
                    <Link to={"#"} className="menuname">
                      <i
                        className="fa fa-location-arrow menuicon"
                        aria-hidden="true"
                      ></i>
                      <div
                        className="submenu-name"
                        onClick={() => {
                          toggleDiv("toggleResponse");
                        }}
                      >
                        Response
                      </div>
                    </Link>
                    <ul
                      className="sub-menu child-menu child-res toggleResponse"
                      style={{
                        display: homeActive ? "block" : "",
                      }}
                    >
                      <li>
                        <Link
                          to={"#"}
                          className="dez-page"
                          onClick={() => {
                            toggleDiv("toggleExtResponse");
                          }}
                        >
                          External Job <i className="fa fa-angle-right"></i>
                        </Link>
                        <ul
                          className="sub-menu child-menu child-res toggleExtResponse"
                          style={{
                            marginLeft: "104%",
                          }}
                        >
                          <li>
                            <Link
                              to={
                                userInfo?.permission?.includes(
                                  EMP_PERMISSIONS?.MEJ
                                ) && "jobs/manage-hot-private"
                              }
                              onClick={() => {
                                !userInfo?.permission?.includes(
                                  EMP_PERMISSIONS?.MEJ
                                ) &&
                                  handleConfirmSwal(
                                    "manage Hot & Private job response"
                                  );
                              }}
                              className="dez-page"
                            >
                              Hot & Private Response
                            </Link>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <Link
                          to={"#"}
                          className="dez-page"
                          onClick={() => {
                            toggleDiv("toggleInrResponse");
                          }}
                        >
                          Internal Job <i className="fa fa-angle-right"></i>
                        </Link>
                        <ul
                          className="sub-menu child-menu child-res toggleInrResponse"
                          style={{
                            marginLeft: "104%",
                          }}
                        >
                          <li>
                            <Link
                              to={
                                userInfo?.permission?.includes(
                                  EMP_PERMISSIONS?.MIJ
                                ) && "/employer/manage-ijp-rjp"
                              }
                              onClick={() => {
                                !userInfo?.permission?.includes(
                                  EMP_PERMISSIONS?.MIJ
                                ) &&
                                  handleConfirmSwal(
                                    "manage IJP & RJP response"
                                  );
                              }}
                              className="dez-page"
                            >
                              IJP & RJP Response
                            </Link>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <Link to={"jobs/advanceFilter"} className="dez-page">
                          Advance Filter
                        </Link>
                      </li>
                    </ul>
                  </li>
                </ul>
                <ul
                  className="sub-menu submenuul buttonsMobile"
                  style={{
                    display: "none",
                    marginLeft: "167px",
                    position: "absolute",
                    bottom: "15%",
                  }}
                >
                  <li style={{ height: 30, cursor: "pointer" }}>
                    <Link
                      to={"/changePassword"}
                      className="dez-page site-button add-btn button-sm emplog"
                    >
                      <span>Change Password</span>
                    </Link>
                  </li>
                  <li style={{ height: 30, cursor: "pointer" }}>
                    <Link
                      to={"#"}
                      className="dez-page site-button add-btn button-sm emplog"
                      onClick={reqLogout}
                    >
                      <span> Logout</span>
                    </Link>
                  </li>
                </ul>

                <div className="prosection align-items-center">
                  <div className="mt-2">
                    {ncount ? (
                      <Badge
                        badgeContent={ncount}
                        color="primary"
                        max={99}
                        overlap="circular"
                      >
                        <IoIosNotifications
                          style={{
                            fontSize: "28px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setDisplaySideBar1(true);
                          }}
                        ></IoIosNotifications>
                      </Badge>
                    ) : (
                      <IoIosNotifications
                        style={{
                          fontSize: "28px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setDisplaySideBar1(true);
                        }}
                      ></IoIosNotifications>
                    )}
                  </div>
                  <ul
                    className="nav navbar-nav listyle"
                    onClick={handleMainProfile}
                  >
                    <li className="profilehov">
                      <button
                        style={{
                          border: "none",
                          backgroundColor: "transparent",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setDisplaySideBar(true);
                        }}
                        className="menuname profileicon"
                      >
                        <i
                          className="fa fa-user-o menuicon"
                          aria-hidden="true"
                        ></i>
                      </button>

                      {slideBarByRole && (
                        <>
                          <ul
                            className="sub-menu child-menu p-child-menu child-res"
                            style={{
                              display: mainproActive ? "block" : "",
                            }}
                          >
                            <li>
                              <div className="profileinfo">
                                <span>Hi, {name}</span>
                                <span
                                  style={{
                                    color: "#fff",
                                    fontSize: "12px",
                                    fontVariant: "none",
                                  }}
                                >
                                  {email}
                                </span>
                                <span
                                  style={{
                                    color: "#fff",
                                    fontSize: "12px",
                                  }}
                                >
                                  {role}
                                </span>
                              </div>
                            </li>
                            <li className="" style={{ cursor: "pointer" }}>
                              <Link
                                to={"#"}
                                className="dez-page"
                                style={{ display: "flex" }}
                              >
                                <i className="logout"></i>
                                <span>User Manual</span>
                                <span
                                  style={{ float: "right", marginLeft: "20%" }}
                                >
                                  <BsEyeFill
                                    className="ml-2"
                                    title="View"
                                    style={{
                                      fontSize: "18px",
                                      cursor: "pointer",
                                      color: "#ffffff",
                                    }}
                                    onClick={handleOpenPdf}
                                  />
                                  <BsCloudDownload
                                    title="Download"
                                    style={{
                                      color: "rgb(14 173 105)",
                                      fontSize: "15px",
                                      fontWeight: "bold",
                                    }}
                                    className="ml-4"
                                    onClick={handleDownload}
                                  />
                                </span>
                              </Link>
                            </li>

                            {userInfo &&
                              userInfo.roles.length &&
                              userInfo.roles[0] && (
                                <li>
                                  <Link
                                    to={`${urls}`}
                                    className="dez-page chngpass"
                                  >
                                    <i className="logout"></i>
                                    <span>My Profile</span>
                                  </Link>
                                </li>
                              )}
                            <li>
                              <Link
                                to={"/employer/companyprofile"}
                                className="dez-page chngpass"
                              >
                                <i className=" logout"></i>
                                <span> Company Profile</span>
                              </Link>
                            </li>

                            <li>
                              <Link
                                to={"/employer/changePassword"}
                                className="dez-page chngpass"
                              >
                                <i className=" logout"></i>
                                <span> Change Password</span>
                              </Link>
                            </li>
                            {userInfo.roles[0].includes(
                              ROLES.EMPLOYER_ADMINISTRATOR
                            ) ? (
                              <li>
                                <Link
                                  to={"#"}
                                  style={{
                                    display: "flex",
                                    textDecoration: "none",
                                  }}
                                  className="dez-page"
                                >
                                  {/* <div
                                  style={{
                                    display: "flex",
                                  }}
                                  className="dez-page "
                                > */}
                                  <i className="logout"></i>
                                  <span>Email Notification</span>
                                  <span
                                    style={{ float: "right", marginLeft: "2%" }}
                                  >
                                    <div className="ml-2">
                                      {EmployerProfile?.data?.mail_sub ? (
                                        <span
                                          style={{ color: "#17a2b8" }}
                                          onClick={(e) => {
                                            handleSwitch(false);
                                          }}
                                        >
                                          Enabled
                                        </span>
                                      ) : (
                                        <span
                                          style={{ color: "red" }}
                                          onClick={(e) => {
                                            handleSwitch(true);
                                          }}
                                        >
                                          Disabled
                                        </span>
                                      )}

                                      {/* <Switch
                                        className="custom-switch"
                                        title={`${
                                          EmployerProfile?.data?.mail_sub
                                            ? "Disable"
                                            : "Enable"
                                        } notification`}
                                        checked={
                                          EmployerProfile?.data?.mail_sub
                                        }
                                        style={{
                                          cursor: "pointer",
                                        }}
                                        color="default"
                                        onChange={(e) => {
                                          handleSwitch(e);
                                        }}
                                        inputProps={{
                                          "aria-label": "controlled",
                                        }}
                                      /> */}
                                    </div>
                                  </span>
                                </Link>
                                {/* </div> */}
                              </li>
                            ) : null}

                            <li>
                              <span className="dez-page chngpass">
                                <a
                                  href="/public/quick-contact"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <i className=" logout"></i>
                                  Quick Contact
                                </a>
                              </span>
                            </li>
                            <li>
                              <div className="lgbt">
                                <button
                                  className="dez-page site-button add-btn button-sm emplog"
                                  onClick={reqLogout}
                                >
                                  <span className="logbtn">Logout</span>
                                  <i className=" logout"></i>
                                </button>
                              </div>
                            </li>
                          </ul>
                        </>
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {displaySideBar1 && <Notifications pageOpen={pageOpen} />}
    </>
  );
};

export default EmpHeader;
