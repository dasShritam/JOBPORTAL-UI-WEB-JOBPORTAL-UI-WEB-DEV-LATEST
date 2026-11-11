import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import { Tooltip } from "@mui/material";
import { useEffect } from "react";
import { FaFire, FaShoppingBag } from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { ImLocation } from "react-icons/im";
import { MdDescription, MdMilitaryTech } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import {
  Content,
  convertHtmlToText,
  formatNumberToSalary,
  getDateDifference,
} from "../../../common/common";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import {
  PatchSaveUnSaveJob,
  resetSaveUnsaveCreator,
} from "../../../redux/features/jobs/saved-jobs/SavedJobsSlice";
import "../saved-jobs/SavedJobs";
import Swal from "sweetalert2";

function SavedJobCard({ job }: any) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const textlimit = 60;
  useEffect(() => {}, [job]);
  const showSnackAlert = UseToastAlert();
  const { saveOrUnsave, loadingSave } = useSelector(
    (state: any) => state.PatchSaveUnSaveJobSlice
  );
  useEffect(() => {
    if (saveOrUnsave && saveOrUnsave?.code && saveOrUnsave?.code === 200) {
      showSnackAlert("success", saveOrUnsave?.message);
      dispatch(resetSaveUnsaveCreator());
    } else if (
      saveOrUnsave &&
      saveOrUnsave?.code &&
      (saveOrUnsave?.code < 300 || saveOrUnsave?.code === 500)
    ) {
      showSnackAlert("warning", saveOrUnsave?.message);
      dispatch(resetSaveUnsaveCreator());
    } else if (saveOrUnsave?.code === 400 || saveOrUnsave?.code === 403) {
      showSnackAlert("warning", "Bad Request");
    }
  }, [saveOrUnsave, saveOrUnsave?.code]);
  const handleConfirmSwal = (value: any) => {
    Swal.fire({
      title: `JOB IS ${
        new Date(job?.walkin?.end_ts * 1000)?.toLocaleString() >=
        new Date()?.toLocaleString()
          ? "EXPIRED"
          : value !== "CLOSE"
          ? "EXPIRED"
          : value
      }`,
      text: `Oops..! You can't preview this ${
        new Date(job?.walkin?.end_ts * 1000)?.toLocaleString() >=
        new Date()?.toLocaleString()
          ? "EXPIRED"
          : value !== "CLOSE"
          ? "EXPIRED"
          : value
      } job.`,
      showCancelButton: false,
      confirmButtonColor: "red",
      confirmButtonText: "OK",
    }).then((result) => {});
  };

  return (
    <>
      {/* UI Enhancement changes */}
      <div>
        <ul className="post-job-bx  browse-job-grid row ">
          <li>
            <div className="post-bx" style={{ backgroundColor: "white" }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>
                    {job.job_type === "HOT JOB" ? (
                      <Tooltip title="Hot job">
                        <span
                          style={{ color: "red", fontSize: "80%" }}
                          className="mr-1"
                        >
                          <FaFire />
                        </span>
                      </Tooltip>
                    ) : (
                      ""
                    )}
                    <Link
                      to={
                        job?.status === "CLOSE" ||
                        job?.status === "EXPIRED" ||
                        new Date(job?.walkin?.end_ts * 1000)?.toLocaleString() <
                          new Date()?.toLocaleString()
                          ? ""
                          : `/jobs/js/previewjob/${job.jobid}`
                      }
                      onClick={() => {
                        if (
                          job?.status === "CLOSE" ||
                          job?.status === "EXPIRED" ||
                          new Date(
                            job?.walkin?.end_ts * 1000
                          )?.toLocaleString() < new Date()?.toLocaleString()
                        ) {
                          handleConfirmSwal(job?.status);
                        } else {
                          sessionStorage.setItem(
                            "goBack",
                            window?.location?.href
                          );
                        }
                      }}
                      style={{ textDecoration: "none" }}
                      className="mr-1"
                    >
                      {job?.title
                        ? Content(
                            `${
                              job.title.charAt(0).toUpperCase() +
                              job.title.slice(1)
                            }`,
                            40
                          )
                        : "Not available"}
                    </Link>
                    {job.status === "CLOSE" ? (
                      <span
                        style={{
                          fontSize: "10px",
                          height: "17px",
                        }}
                        className="badge badge-danger text-justify-center"
                      >
                        Closed
                      </span>
                    ) : "" ||
                      (job?.walkin.end_ts &&
                        new Date(job?.walkin.end_ts * 1000).toLocaleString() <
                          new Date().toLocaleString()) ? (
                      <span
                        style={{
                          fontSize: "10px",
                          height: "17px",
                        }}
                        className="badge badge-danger"
                      >
                        WalkIn ended
                      </span>
                    ) : "" ||
                      (job?.walkin?.start_ts &&
                        new Date(job?.walkin?.end_ts * 1000).toLocaleString() >=
                          new Date().toLocaleString()) ? (
                      <span
                        style={{
                          fontSize: "10px",
                          height: "17px",
                        }}
                        className="badge badge-primary "
                      >
                        Walk In
                      </span>
                    ) : (
                      ""
                    )}
                  </h5>
                </div>
                <div>
                  {job?.application_status?.self === "save" ||
                    job?.application_status?.self === "SAVED" ||
                    (job?.application_status?.self === "SAVE" && (
                      <Tooltip title="Unsave job" arrow>
                        <BookmarkAddedIcon
                          color="primary"
                          sx={{ cursor: "pointer" }}
                          onClick={() => {
                            const unsaveMdl = {
                              jobSeekerResp: {
                                jobid: job?.jobid,
                                status: "DELETE",
                              },
                            };
                            dispatch(PatchSaveUnSaveJob(unsaveMdl));
                          }}
                        />
                      </Tooltip>
                    ))}
                </div>
              </div>
              <div className="d-flex">
                <div
                  className="job-post-info"
                  style={
                    job?.status === "CLOSE" ||
                    job?.status === "EXPIRED" ||
                    new Date(job?.walkin?.end_ts * 1000)?.toLocaleString() <
                      new Date()?.toLocaleString()
                      ? { cursor: "default" }
                      : { cursor: "pointer" }
                  }
                  onClick={() => {
                    if (
                      job?.status === "CLOSE" ||
                      job?.status === "EXPIRED" ||
                      new Date(job?.walkin?.end_ts * 1000)?.toLocaleString() <
                        new Date()?.toLocaleString()
                    ) {
                      handleConfirmSwal(job?.status);
                    } else {
                      sessionStorage.setItem("goBack", window?.location?.href);
                      sessionStorage.setItem("id", job.jobid);
                      navigate({
                        pathname: `/jobs/js/previewjob/${job.jobid}`,
                      });
                    }
                  }}
                >
                  <>
                    <HiBuildingOffice2
                      className="custom-job-icon"
                      title="Comapany name"
                    />
                    &nbsp;
                    <span
                      className="custom-job-content text-break"
                      title={
                        job?.employer?.company_name
                          ? job?.employer?.company_name
                          : ""
                      }
                    >
                      {job?.employer?.company_name
                        ? Content(job?.employer?.company_name, textlimit)
                        : "Not Available"}
                    </span>
                    &nbsp;
                  </>
                  <ul>
                    <li>
                      <FaShoppingBag
                        className="custom-job-icon"
                        title="Experience"
                      />
                      &nbsp;
                      <span className="custom-job-content">
                        {`${
                          job?.exp?.max
                            ? job?.exp?.min || "0"
                            : job?.exp?.min || "Not available"
                        }-${
                          job?.exp?.max
                            ? `${job.exp.max} years`
                            : "Not available"
                        } `}
                      </span>
                    </li>
                    <li>
                      <ImLocation
                        className="custom-job-icon mr-1"
                        title="Location"
                      />
                      <Tooltip title={`${job?.location}`} arrow>
                        <span className="custom-job-content text-break">
                          {Content(
                            job?.location
                              ? job?.location?.join(", ")
                              : "Not available",
                            textlimit
                          )}
                        </span>
                      </Tooltip>
                    </li>

                    <li>
                      <MdMilitaryTech
                        className="custom-job-icon mr-1"
                        title="Skills"
                      />
                      <Tooltip title={`${job?.skills}`} arrow>
                        <span className="custom-job-content text-break">
                          {Content(
                            job?.skills
                              ? job?.skills?.toString()?.replaceAll(",", " | ")
                              : "Not available",
                            textlimit
                          )}
                        </span>
                      </Tooltip>
                    </li>
                    <li>
                      <MdDescription
                        className="custom-job-icon mr-1"
                        title="Job description"
                      />
                      <Tooltip
                        title={`${convertHtmlToText(
                          job?.job_desc ? job?.job_desc : ""
                        )}`}
                        arrow
                      >
                        <span className="custom-job-content text-break">
                          {job?.job_desc
                            ? Content(
                                convertHtmlToText(
                                  job?.job_desc
                                    ? job?.job_desc
                                        .replace(
                                          "Roles And Responsibilities",
                                          "Roles And Responsibilities: "
                                        )
                                        .replace(
                                          "Desired Candidate Profile",
                                          " Desired Candidate Profile: "
                                        )
                                    : "Not available"
                                ),
                                textlimit
                              )
                            : "Not available"}
                        </span>
                      </Tooltip>
                    </li>
                    <li>
                      <GiMoneyStack
                        className="custom-job-icon"
                        title="Salary"
                      />
                      &nbsp;
                      {job?.salary?.visible ? (
                        <span className="custom-job-content">{`${
                          job?.salary?.min
                            ? job?.salary?.currency === "INR"
                              ? "₹"
                              : "$"
                            : ""
                        }${
                          job?.salary?.min
                            ? formatNumberToSalary(job?.salary?.min)
                            : "Not Disclosed"
                        }${job?.salary?.min ? "-" : ""}${
                          job?.salary?.max
                            ? formatNumberToSalary(job?.salary?.max)
                            : ""
                        } `}</span>
                      ) : (
                        <span className="custom-job-content">
                          Not Disclosed
                        </span>
                      )}
                    </li>
                  </ul>
                  <div className="d-flex flex-wrap justify-content-between align-items-center">
                    <div>
                      <span className="custom-timeDiff">
                        &nbsp; Posted{" "}
                        {getDateDifference(
                          job?.posted_on ? job?.posted_on : "Not available"
                        )}
                      </span>
                    </div>
                    <div>
                      <button
                        type="button"
                        style={
                          job?.status === "CLOSE" ||
                          job?.status === "EXPIRED" ||
                          new Date(
                            job?.walkin?.end_ts * 1000
                          )?.toLocaleString() < new Date()?.toLocaleString()
                            ? { cursor: "pointer" }
                            : { cursor: "default" }
                        }
                        disabled={
                          job?.status === "CLOSE" ||
                          job?.status === "EXPIRED" ||
                          new Date(
                            job?.walkin?.end_ts * 1000
                          )?.toLocaleString() < new Date()?.toLocaleString()
                            ? true
                            : false
                        }
                        className="btn site-button btn-sm mr-2 justify-content-end"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}

export default SavedJobCard;
