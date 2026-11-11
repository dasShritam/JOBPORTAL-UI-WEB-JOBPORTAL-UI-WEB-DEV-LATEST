import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/features/authentication/logoutSlice";
import jwtDecode from "jwt-decode";
import { UseToastAlert } from "../../hooks/useToastAlert";
import { downloadImage } from "../../redux/features/manage-account/profile/userFilesSlice";
import { Content } from "../../common/common";
import { getJobSeekerrData } from "../../redux/features/manage-account/profile/JsSlice";
import { BsCloudDownload, BsEyeFill } from "react-icons/bs";
import { RiDownload2Fill } from "react-icons/ri";
import { Switch } from "@mui/material";
import { SetEmailNotification } from "../../redux/features/common/public/EmailNotification";
import { getProfileDetails } from "../../redux/features/manage-account/profile/EmployerProfileSlice";
var pdfFile = require("../../assets/usermanual/Captive Jobs - Job Seeker_User Manual.pdf");
type Anchor = "top" | "left" | "bottom" | "right";

const ProfileSideBar = ({ trigger }) => {
  const handleOpenPdf = () => {
    window.open(pdfFile, "_blank");
  };

  // const handleDownload = () => {
  //   const link = document.createElement("a");
  //   link.href = pdfFile;
  //   link.download = "Captive Jobs - Job Seeker_User Manual.pdf";
  //   link.click();
  // };
  const handleDownload = (e) => {
    e.preventDefault();

    const fileUrl = require("../../assets/usermanual/Captive Jobs - Job Seeker_User Manual.pdf");

    fetch(fileUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Captive Jobs - Job Seeker_User Manual.pdf";
        a.click();
        URL.revokeObjectURL(url);
      });
  };
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const handleSwitch = (data: any) => {
    dispatch(SetEmailNotification(data ? 1 : 0));
  };
  const dispatch = useDispatch(),
    [backClose, setBackClose] = React.useState(true),
    logoutfns = useSelector((state: any) => state.logout),
    { res } = logoutfns,
    navigate = useNavigate(),
    showSnackAlert = UseToastAlert(),
    errorlogout = res?.response?.data?.message,
    JobSeekerProfileData = useSelector((state: any) => state.JobSeekerProfile2),
    { JobSeekerProfile } = JobSeekerProfileData,
    { image, load } = useSelector((state: any) => state.downloadImage);

  const [basicInfo, setBaicInfo] = useState<any>();

  const EmailNotification = useSelector(
      (state: any) => state.EmailNotification
    ),
    { emailSub } = EmailNotification,
    mailError = emailSub?.response?.data?.message;

  useEffect(() => {
    setBaicInfo(JobSeekerProfile?.acc_info);
  }, [JobSeekerProfile?.acc_info]);

  useEffect(() => {
    dispatch(getJobSeekerrData());
  }, []);

  useEffect(() => {
    if (res.code === 200) {
      navigate(`/home`);
      sessionStorage.removeItem("isSkiped");
    } else if (
      (res && res.response && res.response.status === 401) ||
      (res && res.response && res.response.status === 400)
    ) {
      showSnackAlert("warning", errorlogout);
    } else if (res && res.response && res.response.status !== 200) {
      showSnackAlert("error", errorlogout);
    }
  }, [res, errorlogout, dispatch]);

  useEffect(() => {
    if (emailSub.length && emailSub.code === 200) {
      showSnackAlert("success", emailSub.message);
      dispatch(getJobSeekerrData());
    } else if (
      (emailSub && emailSub.response && emailSub.response.status === 401) ||
      (emailSub && emailSub.response && emailSub.response.status === 400)
    ) {
      showSnackAlert("warning", mailError);
    } else if (
      emailSub &&
      emailSub.response &&
      emailSub.response.status !== 200
    ) {
      showSnackAlert("error", mailError);
    }
  }, [emailSub, mailError]);

  const reqLogout = (event: any) => {
    event.preventDefault();
    dispatch(logout());
  };

  useEffect(() => {
    dispatch(downloadImage());
  }, []);

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setState({ ...state, [anchor]: open });
    };
  const decodedToken: any = sessionStorage.getItem("access_token")
    ? jwtDecode(sessionStorage.getItem("access_token")!)
    : "";
  const loggedName = decodedToken?.name,
    [degreeCourse, setDegreeCourse] = useState(""),
    [companyName, setCompanyName] = useState(""),
    displayEmp = (data: any) => {
      let year = 0;
      let course = "";
      let university = "";
      if (data?.js_profile?.education?.degree?.length > 0) {
        data.js_profile.education?.degree?.map((e: any) => {
          if (e.completion_year > year) {
            year = e.completion_year;
            course = e.course;
            university = e.institute;
          }
        });
      }

      if (data?.js_profile?.employments?.length > 0) {
        data?.js_profile?.employments?.map((e: any) => {
          if (e?.fulltime?.notice_period.end_ts !== null && e?.fulltime) {
            if (
              new Date(e.fulltime.notice_period.end_ts * 1000).getFullYear() >
              year
            ) {
              course = e.fulltime.role;
              university = e.company;
            }
          }
        });

        data?.js_profile?.employments?.map((e: any) => {
          if (e.fulltime.notice_period.end_ts === null && e?.fulltime) {
            course = e.fulltime.role;
            university = e.company;
          }
        });
      }
      setDegreeCourse(course);
      setCompanyName(university);
    };

  useEffect(() => {
    if (JobSeekerProfile) {
      displayEmp(JobSeekerProfile);
    }
  }, [JobSeekerProfile.code]);

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: "400px" }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <div className="flex-container" style={{ color: "#f3f4fa" }}>
        <div className="flex-child magenta mt-3">
          <Link to={"/jobseekerprofile"}>
            <img
              style={{
                height: "80px",
                width: "80px",
                marginLeft: "30px",
                borderRadius: "50%",
                border: "2px solid #e1dbdb",
                objectFit: "fill",
              }}
              alt="Profile_Image"
              src={
                image?.data || load
                  ? `data:image/png;base64,${image?.data}`
                  : require("../../assets/images/av-pic-01.png")
              }
            />
          </Link>
        </div>
        <div className="flex-child green mt-3">
          <span
            title={basicInfo?.name}
            style={{
              display: "inline-block",
              // cursor: "pointer",
              color: "#393b3e",
            }}
            // onClick={() => {
            //   setBackClose(false);
            // }}
          >
            <strong>
              {basicInfo?.name
                ? Content(
                    basicInfo?.name.charAt(0).toUpperCase() +
                      basicInfo?.name.slice(1),
                    25
                  )
                : "Name Not Mentioned"}
            </strong>
          </span>
          <br />

          {degreeCourse ? (
            <div
              className="profile_content"
              title={`${degreeCourse} at ${companyName}`}
            >
              <span>{degreeCourse}</span>
              {/* <span> at {Content(companyName, 10)}</span>{" "} */}
              <span> at {companyName}</span>{" "}
            </div>
          ) : (
            <span className="profile_content">Not Specified</span>
          )}

          {/* <span
            style={{ color: "black" }}
            
          >
            {degreeCourse
              ? `${degreeCourse} at ${companyName}`
              : "Not Specified"}
          </span> */}
          <br />
          <Link to={"/jobseekerprofile"}>
            <span className="profile_link">View &amp; Update Profile</span>
          </Link>
        </div>
      </div>
      <hr style={{ width: "90%" }} />
      <ul className="sub-menu submenuul">
        <li className="custom-li" style={{ height: 30, cursor: "pointer" }}>
          <Link
            to={"#"}
            className=""
            style={{ textDecoration: "none", display: "flex" }}
          >
            <span style={{ color: "#142f52 " }}> User Manual</span>
            <span style={{ float: "right", marginLeft: "2%" }}>
              <BsEyeFill
                className="ml-2"
                title="View"
                style={{
                  fontSize: "18px",
                  cursor: "pointer",
                  color: "rgb(90 81 81)",
                }}
                onClick={handleOpenPdf}
              />
              <BsCloudDownload
                title="Download"
                style={{
                  fontSize: "15px",
                  color: "rgb(14 173 105)",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
                className="ml-3"
                onClick={handleDownload}
              />
            </span>
          </Link>
        </li>
        <li className="custom-li" style={{ height: 30, cursor: "pointer" }}>
          <Link to={"/changePassword"} className="dez-page">
            {/* <i
              className="fa fa-exchange logout"
              style={{ marginLeft: "20px" }}
            ></i> */}
            <span style={{ color: "#142f52 " }}> Change Password</span>
          </Link>
        </li>
        <li className="custom-li" style={{ height: 30, cursor: "pointer" }}>
          <Link to={"#"} className="dez-page" style={{ display: "flex" }}>
            {/* // <div > */}
            <span style={{ color: "#142f52 " }}>Email Notification</span>
            {/* <span
              
            > */}
            {basicInfo?.mail_sub ? (
              <span
                style={{
                  float: "right",
                  marginLeft: "2%",
                  color: "Green",
                }}
                onClick={(e) => {
                  handleSwitch(false);
                }}
              >
                Enabled
              </span>
            ) : (
              <span
                style={{
                  float: "right",
                  marginLeft: "2%",
                  color: "red",
                }}
                onClick={(e) => {
                  handleSwitch(true);
                }}
              >
                Disabled
              </span>
            )}
          </Link>
          {/* </div> */}
        </li>

        <li
          className="custom-li"
          style={{
            height: 30,
            cursor: "pointer",
          }}
        >
          <span>
            <a
              href="/public/quick-contact"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#142f52" }}
            >
              Quick Contact
            </a>
          </span>
        </li>
        <li style={{ height: 30, cursor: "pointer" }}>
          <Link to={"#"} className="dez-page" onClick={reqLogout}>
            {/* <i
              className="fa fa-sign-out logout"
              style={{ marginLeft: "20px" }}
            ></i> */}
            <span style={{ color: "#142f52 " }}> Logout</span>
          </Link>
        </li>
      </ul>
    </Box>
  );

  useEffect(() => {
    trigger(toggleDrawer("right", true), backClose);
  }, [backClose]);

  return (
    <>
      <style>
        {`
        .flex-container {
            display: flex;
        }
        
        .flex-child {
            flex: 1;
            margin-top:"10px"
        }  
        
        .flex-child:first-child {
            margin-right: -143px;
            margin-top: "-15px"
        } 
        .flex-child magenta {
            width: "150px"
        }
        .css-1160xiw-MuiPaper-root-MuiDrawer-paper{
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
            color:"#e3dcdc"
        }
        .MuiBox-root css-1ivgbss{

        }
        `}
      </style>
      <div
        onClick={() => {
          setBackClose(false);
        }}
      >
        {(["right"] as const).map((anchor) => (
          <React.Fragment key={"right"}>
            <SwipeableDrawer
              anchor={"right"}
              open={state["right"]}
              onClose={() => {
                toggleDrawer("right", false);
                setBackClose(false);
              }}
              style={{}}
              onOpen={toggleDrawer("right", true)}
            >
              {list("right")}
            </SwipeableDrawer>
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default ProfileSideBar;
