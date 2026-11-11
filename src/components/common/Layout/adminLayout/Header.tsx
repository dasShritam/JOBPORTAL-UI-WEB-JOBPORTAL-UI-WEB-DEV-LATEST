import { useContext, useEffect, useState } from "react";

import { Badge } from "@mui/material";
import jwtDecode from "jwt-decode";
import { FaTelegramPlane } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../../../assets/customCss/header-profile/HeaderProfile.css";
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
import {
  ADMIN_PERMISSIONS,
  RoleGroup,
  RoleType,
} from "../../../../routes/roles";
import { UI_ROUTES, getUI_ROUTES } from "../../../../shared/ui-route.shared";
import Notifications from "../../../shared/Notifications";
import { RiDownload2Fill } from "react-icons/ri";
import { BsCloudDownload, BsEyeFill } from "react-icons/bs";
import { environment } from "../../../../environments/environment";
var pdfFile = require("../../../../assets/usermanual/CaptiveJobs-Administrator_UserManual.pdf");

const Header = () => {
  const {
    userInfo,
    setUserInfo,
    notifySocketCount,
    setNotifySocketCount,
    setNotifySocketData,
  } = useContext(AppContext);
  const [, setPageURl] = useState("");
  const showSnackAlert = UseToastAlert();
  const logoutfns = useSelector((state: any) => state.logout);
  const [isActive, setIsActive] = useState(false);
  const [subMenuActive, setsubMenuActive] = useState(false);
  const [homeActive, sethomeActive] = useState(false);
  const [mainproActive, setmainproActive] = useState(false);
  const [displaySideBar1, setDisplaySideBar1] = useState(false);
  const [, setTrigState1] = useState();
  const { res } = logoutfns;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const errorlogout = res?.response?.data?.message;
  const decodedToken: any = sessionStorage.getItem("access_token")
    ? jwtDecode(sessionStorage.getItem("access_token")!)
    : "";
  const role = decodedToken?.roles?.length ? decodedToken?.roles[0] : "";
  const email = decodedToken?.username;
  const name = decodedToken?.name;
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

    const fileUrl = require("../../../../assets/usermanual/CaptiveJobs-Administrator_UserManual.pdf");

    fetch(fileUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "CaptiveJobs-Administrator_UserManual.pdf";
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
  useEffect(() => {}, [displaySideBar1]);
  useEffect(() => {
    if (
      userInfo &&
      userInfo.roles.length &&
      RoleGroup.EMP_ADMIN_RECRUITER.includes(userInfo.roles[0])
    ) {
      setPageURl("/employerSignin");
    } else if (
      userInfo &&
      userInfo.roles.length &&
      userInfo.roles[0] === ROLES.JOBSEEKER
    ) {
      setPageURl("/jobSeekerSignin");
    }
  }, [userInfo?.roles]);

  useEffect(() => {
    if (res.code === 200) {
      dispatch(resetLogout());
      navigate("/adminSignin");
    } else if (
      (res && res.response && res.response.status === 401) ||
      (res && res.response && res.response.status === 400)
    ) {
      showSnackAlert("warning", errorlogout);
    } else if (res && res.response && res.response.status !== 200) {
      showSnackAlert("error", errorlogout);
    }
  }, [navigate, res, errorlogout]);

  const reqLogout = (event: any) => {
    event.preventDefault();
    dispatch(logout());
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
      text: `Oops..! looks like you do not have permission to access this feature (${values}), please contact your Super Administrator.`,
      showCancelButton: false,
      confirmButtonColor: "red",
      confirmButtonText: "OK",
    }).then((result) => {});
  };
  const pageOpen = (value: any, backDrop: any) => {
    setTrigState1(value);
    backDrop ? setDisplaySideBar1(true) : setDisplaySideBar1(false);
  };

  useEffect(() => {
    if (notifySocketCount?.data) {
      setNCount(1 + ncount);
      setNotifySocketCount({});
    }
  }, [notifySocketCount]);

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
          <div
            className="main-bar clearfix"
            style={{
              backgroundColor: "#fff",
              boxShadow: "0 0 15px 0 rgba(0,24,128,.2)",
            }}
          >
            <div className="container clearfix">
              <div className="logo-header emplogo-header mostion">
                <img
                  src={logo2}
                  className="logo"
                  alt="img"
                  style={{ height: "70px", cursor: "pointer" }}
                  onClick={() => {
                    navigate("/adminDashboard");
                  }}
                />
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
                className="header-nav empheader-nav navbar-collapse collapse myNavbar justify-content-start"
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
                  <div></div>
                </div>

                <ul className="nav navbar-nav">
                  <li>
                    <Link to={"/adminDashboard"} className="menuname">
                      <i className="fa fa-home menuicon" aria-hidden="true"></i>
                      <div className="submenu-name">Dashboard</div>
                    </Link>
                  </li>

                  <li>
                    <Link to={"#"} className="menuname">
                      <i
                        className="fa fa-user-plus menuicon"
                        aria-hidden="true"
                      ></i>
                      <div
                        className="submenu-name"
                        onClick={() => {
                          toggleDiv("toggleUsers");
                        }}
                      >
                        Manage User
                      </div>
                    </Link>
                    <ul
                      className="sub-menu child-menu child-res toggleUsers"
                      style={{
                        display: subMenuActive ? "block" : "",
                      }}
                    >
                      <li>
                        <Link
                          to={
                            userInfo?.roles?.includes(
                              RoleType.SUPER_ADMINISTRATOR
                            ) && "/SuperAdmin/UserManagement"
                          }
                          onClick={() => {
                            !userInfo?.roles?.includes(
                              RoleType.SUPER_ADMINISTRATOR
                            ) && handleConfirmSwal("Native User Management");
                          }}
                          className="dez-page"
                        >
                          Native User
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={"/admin/jobSeekerRegistration"}
                          className="dez-page"
                        >
                          Job Seeker
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={"/admin/employerRegistration"}
                          className="dez-page"
                        >
                          Employer
                        </Link>
                      </li>
                    </ul>
                  </li>

                  <li>
                    <Link to={"#"} className="menuname">
                      <i className="fa fa-cogs menuicon" aria-hidden="true"></i>
                      <div
                        className="submenu-name"
                        onClick={() => {
                          toggleDiv("toggleConfig");
                        }}
                      >
                        Configuration
                      </div>
                    </Link>
                    <ul
                      className="sub-menu child-menu child-res toggleConfig"
                      style={{
                        display: subMenuActive ? "block" : "",
                      }}
                    >
                      <li>
                        <Link
                          to={
                            userInfo?.permission?.includes(
                              ADMIN_PERMISSIONS?.FAQM
                            ) && "/admin/faq"
                          }
                          onClick={() => {
                            !userInfo?.permission?.includes(
                              ADMIN_PERMISSIONS?.FAQM
                            ) &&
                              handleConfirmSwal("Frequently Asked Questions");
                          }}
                          className="dez-page"
                        >
                          FAQ
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={
                            userInfo?.permission?.includes(
                              ADMIN_PERMISSIONS?.CM
                            ) && "/admin/manageContact"
                          }
                          onClick={() => {
                            !userInfo?.permission?.includes(
                              ADMIN_PERMISSIONS?.CM
                            ) && handleConfirmSwal("Contact Management");
                          }}
                          className="dez-page"
                        >
                          Manage Contact
                        </Link>
                      </li>
                      {environment?.HackerEarth && (
                        <li>
                          <Link
                            to={
                              userInfo?.permission?.includes(
                                ADMIN_PERMISSIONS?.AM
                              ) && "/admin/AssessmentManage"
                            }
                            onClick={() => {
                              !userInfo?.permission?.includes(
                                ADMIN_PERMISSIONS?.AM
                              ) && handleConfirmSwal("Assessment Management");
                            }}
                            className="dez-page"
                          >
                            Manage Assessment
                          </Link>
                        </li>
                      )}
                      <li>
                        <Link
                          to={
                            userInfo?.permission?.includes(
                              ADMIN_PERMISSIONS?.PM
                            ) && "/admin/polls"
                          }
                          onClick={() => {
                            !userInfo?.permission?.includes(
                              ADMIN_PERMISSIONS?.PM
                            ) && handleConfirmSwal("Polls");
                          }}
                          className="dez-page"
                        >
                          Polls
                        </Link>
                      </li>
                      <li>
                        <Link
                          to={
                            userInfo?.permission?.includes(
                              ADMIN_PERMISSIONS?.TP
                            ) && "/admin/TermsAndCondition"
                          }
                          onClick={() => {
                            !userInfo?.permission?.includes(
                              ADMIN_PERMISSIONS?.TP
                            ) &&
                              handleConfirmSwal(
                                "Terms and conditions | Privacy policy"
                              );
                          }}
                          className="dez-page"
                        >
                          Manage Pages
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Link to={"#"} className="menuname">
                      <FaTelegramPlane style={{ fontSize: "29px" }} />
                      <div
                        className="submenu-name"
                        onClick={() => {
                          toggleDiv("toggleSupport");
                        }}
                      >
                        Support
                      </div>
                    </Link>
                    <ul
                      className="sub-menu child-menu child-res toggleSupport"
                      style={{
                        display: subMenuActive ? "block" : "",
                      }}
                    >
                      <li>
                        <Link
                          to={
                            userInfo?.permission?.includes(
                              ADMIN_PERMISSIONS?.CSM
                            ) && "/admin/ticketManagement  "
                          }
                          onClick={() => {
                            !userInfo?.permission?.includes(
                              ADMIN_PERMISSIONS?.CSM
                            ) && handleConfirmSwal("Customer Support Tickets");
                          }}
                          className="dez-page"
                        >
                          Manage Tickets
                        </Link>
                      </li>
                    </ul>
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
                          style={{ fontSize: "28px", cursor: "pointer" }}
                          onClick={() => {
                            setDisplaySideBar1(true);
                          }}
                        ></IoIosNotifications>
                      </Badge>
                    ) : (
                      <IoIosNotifications
                        style={{ fontSize: "28px", cursor: "pointer" }}
                        onClick={() => {
                          setDisplaySideBar1(true);
                        }}
                      ></IoIosNotifications>
                    )}
                  </div>
                  <ul className="nav navbar-nav" onClick={handleMainProfile}>
                    <li className="profilehov">
                      <button
                        style={{
                          border: "none",
                          backgroundColor: "transparent",
                          cursor: "pointer",
                        }}
                        className="menuname profileicon"
                      >
                        <i
                          className="fa fa-user-o menuicon"
                          aria-hidden="true"
                        ></i>
                      </button>

                      <ul
                        className="sub-menu child-menu p-child-menu child-res"
                        style={{
                          display: mainproActive ? "block" : "",
                          borderRadius: "4px 0px 4px 4px!important",
                        }}
                      >
                        <li>
                          <div className="profileinfo">
                            <span>Hi, {userInfo?.name}</span>
                            <span
                              style={{
                                color: "#fff",
                                fontSize: "12px",
                                fontVariant: "none",
                              }}
                            >
                              {email}
                            </span>
                            <span style={{ color: "#fff", fontSize: "12px" }}>
                              {role}
                            </span>
                          </div>
                        </li>
                        {/* <li>
                          <Link
                            to={"admin/changePassword"}
                            className="dez-page chngpass"
                          >
                            <i className=" logout"></i>
                            <span> Change Password</span>
                          </Link>
                        </li> */}
                        {/* <li>
                          <div
                            className="lgbt ml-4"
                            style={{ display: "flex" }}
                          >
                            <span
                              className="dez-page text-light"
                              style={{ textTransform: "none" }}
                            >
                              User Manual
                            </span>
                            <span
                              className="mt-1"
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
                                  cursor: "pointer",
                                  fontSize: "15px",
                                  fontWeight: "bold",
                                }}
                                className="ml-4"
                                onClick={handleDownload}
                              />
                            </span>
                            <i className=" logout"></i>
                          </div>
                        </li> */}
                        <li className="">
                          <Link
                            to={"#"}
                            // className="dez-page"
                            style={{ display: "flex" }}
                          >
                            <span>User Manual</span>
                            <span style={{ float: "right", marginLeft: "20%" }}>
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
                        <li>
                          <div
                            className="dez-page text-light"
                            style={{ textTransform: "none" }}
                          >
                            <span>
                              <a
                                href="/public/quick-contact"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Quick Contact
                              </a>
                            </span>
                          </div>
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

export default Header;
