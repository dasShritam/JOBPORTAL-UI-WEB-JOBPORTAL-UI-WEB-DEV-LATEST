import { Badge } from "@mui/material";
import jwtDecode from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { IoIosNotifications } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "../../../assets/customCss/notification.css";
import logo2 from "../../../assets/images/Techkri-logo-blue.png";
import { convertformatTimestamp } from "../../../common/common";
import { ROLES } from "../../../config/app.config";
import { AppContext } from "../../../context/AppContext";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import { environment } from "../../../environments/environment";
import {
  logout,
  resetLogout,
} from "../../../redux/features/authentication/logoutSlice";
import {
  getNotifications,
  viewNotifyReset,
} from "../../../redux/features/notification/NotificationSlice";
import { RoleGroup } from "../../../routes/roles";
import { UI_ROUTES, getUI_ROUTES } from "../../../shared/ui-route.shared";
import Notifications from "../../shared/Notifications";
import ProfileSideBar from "../../shared/ProfileSideBar";

const JsHeader = () => {
  const {
    userInfo,
    setUserInfo,
    notifySocketCount,
    setNotifySocketCount,
    notifySocketData,
    setNotifySocketData,
  } = useContext(AppContext);
  const showSnackAlert = UseToastAlert();
  const logoutfns = useSelector((state: any) => state.logout);
  const { res } = logoutfns;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const errorlogout = res?.response?.data?.message;
  const [urls, setURl] = useState<any>();
  const [isActive, setIsActive] = useState(false);
  const decodedToken: any = sessionStorage.getItem("access_token")
    ? jwtDecode(sessionStorage.getItem("access_token")!)
    : "";
  const [displaySideBar, setDisplaySideBar] = useState(false);
  const [displaySideBar1, setDisplaySideBar1] = useState(false);
  const [, setTrigState] = useState();
  const [, setTrigState1] = useState();
  const [slideBarByRole, setslideBarByRole] = useState(false);
  const { viewNotify, loadNv } = useSelector((state: any) => state.viewNotify);
  const { image, load } = useSelector((state: any) => state.downloadImage);
  const { getNotify, loadNg, actionGn } = useSelector(
    (state: any) => state.getNotify
  );
  const [ncount, setNCount] = useState<number>(0);
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
  useEffect(() => {}, [displaySideBar, displaySideBar1]);

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
  const loggedEmail = decodedToken?.username;
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
    },
    pageOpen = (value: any, backDrop: any) => {
      setTrigState1(value);
      backDrop ? setDisplaySideBar1(true) : setDisplaySideBar1(false);
    };

  const handleClick = () => {
    setIsActive((current) => !current);
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
          <div
            className="main-bar clearfix Main-header"
            style={{
              backgroundColor: "#fff",
              boxShadow: "0 0 15px 0 rgba(0,24,128,.2)",
            }}
          >
            <div className="container clearfix">
              <div className="logo-header mostion">
                <img
                  src={logo2}
                  className="logo"
                  alt="img"
                  style={{ height: "70px", cursor: "pointer" }}
                  onClick={() => {
                    navigate("/jobseekerDashboard");
                  }}
                />
              </div>

              <button
                className="navbar-toggler collapsed navicon  justify-content-end"
                type="button"
                id="menuToggleButton"
                // style={{ display: "none" }}
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
                        src={
                          image?.data || load
                            ? `data:image/png;base64,${image?.data}`
                            : require("../../../assets/images/av-pic-01.png")
                        }
                      />
                    </div>
                    <div className="d-flex flex-column ml-1">
                      <span className="userName">{loggedName}</span>
                      <span className="userEmail">{loggedEmail}</span>
                    </div>
                  </div>
                  <div>
                    <Link to={"/jobseekerprofile"}>
                      <span
                        className="profile_link"
                        style={{ color: "#b1b1ff" }}
                      >
                        View &amp; Update Profile
                      </span>
                    </Link>
                  </div>
                </div>
                <ul className="nav navbar-nav">
                  <li>
                    <Link to={"/jobseekerDashboard"} className="menuname">
                      <i className="fa fa-home menuicon" aria-hidden="true"></i>
                      <div className="submenu-name">Dashboard</div>
                    </Link>
                  </li>
                  <li>
                    <Link to={"#"} className="menuname">
                      <i
                        className="fa fa-search menuicon"
                        aria-hidden="true"
                      ></i>
                      <div
                        onClick={() => {
                          toggleDiv("togglejobs");
                        }}
                        className="submenu-name"
                      >
                        Jobs
                      </div>
                    </Link>
                    <ul className="sub-menu child-menu child-res togglejobs">
                      <li>
                        <Link to={"/jobs/appliedjobs"} className="dez-page">
                          Applied Jobs
                        </Link>
                      </li>
                      <li>
                        <Link to={"/jobs/savedjobs"} className="dez-page">
                          Saved Jobs
                        </Link>
                      </li>
                      <li>
                        <Link to={"/jobs/joblisting"} className="dez-page">
                          Search Jobs
                        </Link>
                      </li>
                    </ul>
                  </li>
                  {environment?.HackerEarth && (
                    <li>
                      <Link to={"#"} className="menuname">
                        <i
                          className="fa fa-book menuicon"
                          aria-hidden="true"
                        ></i>
                        <div
                          onClick={() => {
                            toggleDiv("toggleAssess");
                          }}
                          className="submenu-name"
                        >
                          Assessment
                        </div>
                      </Link>
                      <ul className="sub-menu child-menu child-res toggleAssess">
                        <li>
                          <Link to={"/js/selfAssessment"} className="dez-page">
                            Skills Test
                          </Link>
                        </li>
                      </ul>
                    </li>
                  )}
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
                  <div className="mt-3 mr-3">
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
                  <ul className="nav navbar-nav">
                    <li>
                      {/* <button
                        style={{
                          border: "none",
                          backgroundColor: "transparent",
                          cursor: "pointer",
                        }}
                       
                      > */}
                      <BsPersonCircle
                        style={{
                          fontSize: "40px",
                          color: "#3c4857",
                          marginTop: "23px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setDisplaySideBar(true);
                        }}
                      />
                      {/* </button> */}
                      {displaySideBar && !slideBarByRole && (
                        <ProfileSideBar trigger={trigger} />
                      )}
                      {slideBarByRole && (
                        <ul
                          className="sub-menu"
                          style={{ marginLeft: "-92px" }}
                        >
                          <li>
                            <Link to={"#"} className="dez-page">
                              <span style={{ color: "#64696e" }}>
                                {loggedName}
                              </span>
                            </Link>
                          </li>
                          {userInfo &&
                            userInfo.roles.length &&
                            userInfo.roles[0] && (
                              <li>
                                <Link to={`${urls}`} className="dez-page">
                                  <i className="fa fa-user logout"></i>
                                  <span style={{ color: "#142f52 " }}>
                                    Profile
                                  </span>
                                </Link>
                              </li>
                            )}

                          <li>
                            <Link to={"/changePassword"} className="dez-page">
                              <i className="fa fa-exchange logout"></i>
                              <span style={{ color: "#142f52 " }}>
                                {" "}
                                Change Password
                              </span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              to={"#"}
                              className="dez-page"
                              onClick={reqLogout}
                            >
                              <span style={{ color: "#142f52 " }}> Logout</span>
                              <i className="fa fa-sign-out logout"></i>
                            </Link>
                          </li>
                        </ul>
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* {displaySideBar && <ProfileSideBar/>} */}
      {displaySideBar1 && <Notifications pageOpen={pageOpen} />}
    </>
  );
};

export default JsHeader;
