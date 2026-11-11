import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import {
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineFileDone,
} from "react-icons/ai";
import { BsBuildingsFill, BsEyeglasses } from "react-icons/bs";
import { IoMdContact } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../../../assets/customCss/jobs/appStatus.css";
import { convertformatTimestamp } from "../../../common/common";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import {
  getEmpDetailsStatus,
  getJobAddApplicationStatus,
  resetEmplDetails,
} from "../../../redux/features/jobs/applied-jobs/AppliedJobSlice";

interface statusType {
  id: number;
  status: string;
  name: string;
  description: string;
  classValue: "primary" | "info" | "success" | "error" | "secondary";
}

function ApplicationStatus({ data }) {
  const dispatch = useDispatch();
  const [followData, setFollowData] = useState<any>();
  const [empInfo, setempInfo] = useState<any>("");
  const [companyLogo, setComapnyLogo] = useState<any>("");
  const [profileImg, setProfileImg] = useState<any>("");
  const showSnackAlert = UseToastAlert();
  const RecruiterActions: statusType[] = [
    {
      id: 1,
      status: "APPLY",
      name: "Applied",
      description: "You have applied for this job",
      classValue: "secondary",
    },
    {
      id: 2,
      status: "VIEW",
      name: "Viewed",
      description: "Your application is viewed",
      classValue: "primary",
    },
    {
      id: 3,
      status: "SHORTLIST",
      name: "Shortlisted",
      description: "Your application is shortlisted",
      classValue: "success",
    },
    {
      id: 4,
      status: "REJECT",
      name: "Rejected",
      description: "Your application is rejected",
      classValue: "error",
    },
  ];
  const { AddApplicationStatuss, loadingA } = useSelector(
    (state: any) => state.JobAdditionalApplicationData
  );

  useEffect(() => {
    if (
      !loadingA &&
      AddApplicationStatuss?.data &&
      AddApplicationStatuss?.code
    ) {
      dispatch(
        getJobAddApplicationStatus({
          jobid: data?.jobid,
          pageid: 1,
          status: "APPLY",
          mode: "all",
        })
      );
      // dispatch(resetEmpDetailStatus());
    }
  }, [dispatch, AddApplicationStatuss?.code]);

  const { EmpDetailStatus, loadingE } = useSelector(
    (state: any) => state.EmplDetailsData
  );

  // useEffect(() => {
  //   if (!loadingE && EmpDetailStatus?.code) {
  //     setempInfo(EmpDetailStatus);
  //   }
  // }, [EmpDetailStatus]);
  useEffect(() => {
    if (
      EmpDetailStatus &&
      EmpDetailStatus?.code &&
      EmpDetailStatus?.code === 200
    ) {
      showSnackAlert("success", EmpDetailStatus.message);
      dispatch(resetEmplDetails());
    } else if (
      EmpDetailStatus &&
      EmpDetailStatus?.code &&
      EmpDetailStatus?.code !== 200
    ) {
      showSnackAlert("warning", EmpDetailStatus?.response?.data?.message);
      dispatch(resetEmplDetails());
    } else if (
      EmpDetailStatus &&
      EmpDetailStatus?.code &&
      EmpDetailStatus?.code === 400
    ) {
      showSnackAlert("warning", EmpDetailStatus?.response?.data?.message);
      dispatch(resetEmplDetails());
    } else if (
      EmpDetailStatus &&
      EmpDetailStatus?.code &&
      EmpDetailStatus?.code === 500
    ) {
      showSnackAlert("error", EmpDetailStatus?.response?.data?.message);
      dispatch(resetEmplDetails());
    }
  }, [EmpDetailStatus]);

  const handleClick = () => {
    if (followData === true) {
      dispatch(
        getEmpDetailsStatus({
          recruiter_id: data?.employer?.employer_id,
          type: "UNFOLLOW",
        })
      );
      setFollowData(false); // Toggle the state manually
    } else if (followData === false) {
      dispatch(
        getEmpDetailsStatus({
          recruiter_id: data?.employer?.employer_id,
          type: "FOLLOW",
        })
      );
      setFollowData(true); // Toggle the state manually
    }
  };

  useEffect(() => {
    if (AddApplicationStatuss) {
      setComapnyLogo(
        AddApplicationStatuss?.data?.jobs[0]?.employer?.company_logo_sas
      );
      setProfileImg(
        AddApplicationStatuss?.data?.jobs[0]?.employer?.profile_img_sas
      );
    }
    setFollowData(AddApplicationStatuss?.data?.follow);
  }, [AddApplicationStatuss]);

  const getStatusData = (data) => {
    // return
    const code = data?.map((c) => {
      const statusItem = RecruiterActions.find((d) => d.status == c.sts);

      return (
        <TimelineItem>
          {c?.created_at !== null && (
            <TimelineOppositeContent
              sx={{ m: "auto 0" }}
              // align="right"
              // variant="body2"
              // color="text.secondary"
            >
              {convertformatTimestamp(c?.created_at ?? c?.updated_at)}
            </TimelineOppositeContent>
          )}
          <TimelineSeparator>
            <TimelineConnector />
            <TimelineDot color={statusItem?.classValue ?? "primary"}>
              {statusItem?.id == 1 ? (
                <AiOutlineFileDone style={{ fontSize: "20px" }} />
              ) : statusItem?.id == 2 ? (
                <BsEyeglasses style={{ fontSize: "20px" }} />
              ) : statusItem?.id == 3 ? (
                <AiOutlineCheck style={{ fontSize: "20px" }} />
              ) : (
                <AiOutlineClose style={{ fontSize: "20px" }} />
              )}
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ py: "12px", px: 2 }}>
            <Typography
              variant="h6"
              component="span"
              style={{ fontSize: "15px" }}
            >
              {statusItem?.name}
            </Typography>
            <Typography style={{ fontSize: "13px" }}>
              {statusItem?.description}
            </Typography>
          </TimelineContent>
        </TimelineItem>
      );
    });

    return <Timeline position="alternate">{code}</Timeline>;
  };
  let formattedTimestamps;
  if (data && data?.milestone && data?.milestone?.length > 0) {
    const TIimestamp = data?.milestone?.map((item: any) => item?.updated_at);
    const filteredTIimestamp = TIimestamp.filter(
      (item: any) => item !== undefined
    );
    if (filteredTIimestamp?.length > 0) {
    } else {
    }
  } else {
  }

  const output = [...data?.milestone]?.sort((a: any, b: any) => {
    return (
      b?.updated_at - a?.updated_at ||
      b?.created_at - a?.updated_at ||
      b?.updated_at - a?.created_at ||
      b?.created_at - a?.created_at
    );
  });

  return (
    <>
      <div
        className="job-box"
        id="Application-status"
        style={{ height: "550px" }}
      >
        <div className="d-flex ml-2">
          {companyLogo ? (
            <div className="com_logo d-flex justify-content-around ">
              <img
                style={{ borderRadius: "10px", height: "100%", width: "100%" }}
                src={companyLogo ? companyLogo : ""}
              />
            </div>
          ) : (
            <i className="fa-3x mt-2">
              <BsBuildingsFill />
            </i>
          )}
          <div className="ml-3 mt-2">
            <span className="job-title ">
              <Link
                to={`/jobs/js/previewjob/${data?.jobid}`}
                onClick={() => {
                  sessionStorage.setItem("goBack", window?.location?.href);
                }}
              >
                {data?.title}
              </Link>
            </span>
            <br />
            <span>{data?.employer?.company_name}</span>
          </div>
          <span
            className="ml-2 mt-2"
            style={
              data?.status === "CLOSE"
                ? { color: "rgb(224 29 24)" }
                : { color: "rgb(12 231 12)" }
            }
          >
            {data?.status === "CLOSE" ? "[CLOSED]" : ""}
          </span>
        </div>
        <div className="d-flex justify-content-between">
          <div className="d-flex">
            {profileImg ? (
              <div className="ml-3">
                <img
                  alt="Profile_Image"
                  src={profileImg ? profileImg : ""}
                  style={{
                    borderRadius: "100%",
                    width: "50px",
                    height: "50px",
                  }}
                />
              </div>
            ) : (
              <i className="fa-3x ml-2">
                <IoMdContact />
              </i>
            )}
            <div className={profileImg ? "ml-4 mt-1" : "ml-3 mt-1"}>
              <h6>{data?.posted_by}</h6>
              <span>{data?.employer_mailId}</span>
            </div>
          </div>
          <div
            className="mt-4 mr-3"
            onClick={() => {
              handleClick();
            }}
          >
            <button className="site-button btn btn-sm">
              {loadingE && (
                <i
                  className="fa fa-circle-o-notch fa-spin"
                  style={{ marginRight: "10px" }}
                ></i>
              )}
              {followData ? "Unfollow" : "Follow"}
            </button>
          </div>
        </div>
        <hr />
        <div style={{ height: "200px" }}>
          <div className="d-flex justify-content-between mr-3">
            <h5>Application Status</h5>
            <span
              className="f"
              style={
                data?.application_status?.employer === "SHORTLIST" ||
                data?.application_status?.employer === "VIEW"
                  ? { color: "#2ac52a" }
                  : { color: "rgb(224 29 24)" }
              }
            >
              {(data?.application_status?.employer === "SHORTLIST"
                ? "SHORTLISTED"
                : "") ||
                (data?.application_status?.employer === "VIEW"
                  ? "VIEWED"
                  : "") ||
                (data?.application_status?.employer === "REJECT"
                  ? "REJECTED"
                  : "")}
            </span>
          </div>

          <div style={{ maxHeight: "300px", overflowY: "scroll" }}>
            <div>{output && getStatusData(output)}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ApplicationStatus;
