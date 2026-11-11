import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { BsBuildingsFill } from "react-icons/bs";
import { FaShoppingBag } from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { ImLocation } from "react-icons/im";
import { MdMilitaryTech } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Ribbon, RibbonContainer } from "react-ribbons";
import {
  Content,
  convertHtmlToText,
  formatNumberToSalary,
  getDateDifference,
} from "../../common/common";
import { PatchSaveUnSaveJob } from "../../redux/features/jobs/saved-jobs/SavedJobsSlice";
const textLimit = 30;
const descLimit = 150;
const titleLimit = 30;
function JobCard(props: any) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [img, setImg] = useState("");
  const handleSaveClick = (jobid: any, status: string) => {
    if (!sessionStorage.getItem("access_token")) {
      sessionStorage.setItem("jobid", jobid);
      navigate({
        pathname: "/jobSeekerSignin",
      });
    } else {
      const datamdl = {
        jobSeekerResp: {
          jobid: jobid,
          status:
            status === "SAVED" || status === "save" || status === "SAVE"
              ? "DELETE"
              : "SAVE",
        },
      };
      dispatch(PatchSaveUnSaveJob(datamdl));
    }
  };

  const handleApplyClick = (jobid: any) => {
    if (!sessionStorage.getItem("access_token")) {
      sessionStorage.setItem("job_id", jobid);
      navigate({
        pathname: "/jobSeekerSignin",
      });
    } else {
      navigate({
        pathname: `/jobs/js/previewjob/${jobid}`,
      });
    }
  };

  useEffect(() => {
    if (props?.img?.length)
      setImg(
        props?.img?.filter((e) => {
          return e?.id === props?.compId;
        })[0]?.img_sas
      );
  }, [props?.img?.length]);

  return (
    <RibbonContainer>
      <div className="job-card">
        <div className="d-flex justify-content-between">
          <div className="com_logo d-flex justify-content-around ">
            {img ? (
              <img
                style={{ borderRadius: "10px", height: "100%", width: "100%" }}
                src={img}
              />
            ) : (
              <i className="fa-2x mt-2">
                <BsBuildingsFill />
              </i>
            )}
          </div>
          <div>
            {props?.application_status?.self === "save" ||
            props?.application_status?.self === "SAVED" ||
            props?.application_status?.self === "SAVE" ? (
              <Tooltip title="Unsave job" arrow>
                <BookmarkAddedIcon
                  color="primary"
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    handleSaveClick(
                      props?.jobid,
                      props?.application_status?.self
                    );
                  }}
                />
              </Tooltip>
            ) : (
              <Tooltip title="Save job" arrow>
                <BookmarkBorderIcon
                  sx={{ cursor: "pointer" }}
                  color="primary"
                  id={props?.jobid}
                  onClick={() => {
                    sessionStorage.setItem("goBack", window?.location?.href);
                    handleSaveClick(
                      props?.jobid,
                      props?.application_status?.self
                    );
                  }}
                />
              </Tooltip>
            )}
          </div>
        </div>
        <div>
          <Tooltip title={props.title} arrow>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => {
                sessionStorage.setItem("goBack", window?.location?.href);
                // sessionStorage.setItem("jobid", props.jobid);
                if (sessionStorage.access_token) {
                  navigate({
                    pathname: `/jobs/js/previewjob/${props.jobid}`,
                  });
                } else {
                  navigate({
                    pathname: `/jobs/public/previewjob/${props.jobid}`,
                  });
                }
              }}
              className="job-title-name "
            >
              {Content(props.title, titleLimit)}
            </span>
          </Tooltip>
        </div>
        <div>
          <HiBuildingOffice2
            className="custom-job-icon"
            title="Company Namessssss"
          />{" "}
          &nbsp;
          <span className="job-requirements">
            {props?.companyName
              ? Content(props?.companyName, textLimit)
              : "-NA-"}
          </span>
          <div>
            <FaShoppingBag className="custom-job-icon" title="Experience" />
            &nbsp;
            <span className="job-requirements">
              {`${
                props?.exp?.max
                  ? props?.exp?.min || "0"
                  : props?.exp?.min || "Not available"
              }-${props?.exp?.max ? `${props.exp.max} years` : "-NA-"} `}
            </span>
          </div>
          <div>
            <ImLocation className="custom-job-icon" title="Location" />
            &nbsp;
            <Tooltip title={`${props?.location}`} arrow>
              <span className="job-requirements">
                {Content(
                  props?.location ? props?.location?.join(", ") : "-NA-",
                  textLimit
                )}
              </span>
            </Tooltip>
          </div>
          <div>
            <MdMilitaryTech className="custom-job-icon" title="Skills" />
            &nbsp;
            <Tooltip title={`${props?.skills}`} arrow>
              <span className="job-requirements text-break">
                {Content(
                  props?.skills
                    ? props?.skills?.toString()?.replaceAll(",", " | ")
                    : "Not available",
                  textLimit
                )}
              </span>
            </Tooltip>
          </div>
          <div>
            <GiMoneyStack className="custom-job-icon" title="Salary" />
            &nbsp;
            {props?.salary?.visible === true ? (
              <span className="job-requirements">{`${
                props?.salary?.min
                  ? props?.salary?.currency === "INR"
                    ? "₹"
                    : "$"
                  : ""
              }${
                props?.salary?.min
                  ? formatNumberToSalary(props?.salary?.min)
                  : "Not Disclosed"
              }${props?.salary?.min ? "-" : ""}${
                props?.salary?.max
                  ? formatNumberToSalary(props?.salary?.max)
                  : ""
              } `}</span>
            ) : (
              <span className="job-requirements">Not Disclosed</span>
            )}
          </div>
          <div className="jobHeight">
            <Tooltip
              title={
                convertHtmlToText(props?.jobDesc)
                  ? convertHtmlToText(props?.jobDesc)
                  : "Not available"
              }
              arrow
            >
              <span className="job-requirements text-break mt-2">
                {convertHtmlToText(props?.jobDesc)
                  ? Content(
                      convertHtmlToText(
                        props.jobDesc
                          .replace(
                            "Roles And Responsibilities",
                            "Roles And Responsibilities: "
                          )
                          .replace(
                            "Desired Candidate Profile",
                            " Desired Candidate Profile: "
                          )
                      ),
                      descLimit
                    )
                  : "Not available"}
              </span>
            </Tooltip>
          </div>
          <div className="d-flex justify-content-between mt-2 align-items-end">
            {!props.hideApply ? (
              <button
                type="button"
                className="apply-button"
                // onClick={() => {
                //     navigate({
                //         pathname: `/jobs/js/previewjob/${props.jobid}`,
                //     })
                // }}
                onClick={() => {
                  handleApplyClick(props?.jobid);
                  sessionStorage.setItem("goBack", window?.location?.href);
                }}
              >
                Apply
              </button>
            ) : (
              ""
            )}
            {/* <button  type='button' className='apply-button' >Apply</button> */}
            <span className="custom-timeDiff">
              &nbsp; Posted {getDateDifference(props?.createdAt)}
            </span>
          </div>
          {props?.recommended == true && (
            <Ribbon
              side="left"
              type="corner"
              size="normal"
              backgroundColor="#339966"
              color="#ccffff"
              fontFamily="sans"
              withStripes={false}
            >
              <span style={{ fontSize: "10px" }}> Recommended</span>
            </Ribbon>
          )}
        </div>
      </div>
    </RibbonContainer>
  );
}

export default JobCard;
