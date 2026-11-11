import { Chip, IconButton, Tooltip } from "@mui/material";
import { lazy, useEffect, useState } from "react";
import { FaSuitcase } from "react-icons/fa";
import { FcGraduationCap } from "react-icons/fc";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { ImLocation } from "react-icons/im";
import { IoMdWallet } from "react-icons/io";
import { MdLocationOn, MdMail, MdMilitaryTech } from "react-icons/md";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../../assets/customCss/ApplicantCard.css";
import { Content, StateWiesPlaces } from "../../../common/common";
import { updateAppStatus } from "../../../redux/features/employer/applicationStatusslice";
import { resetViewAppActionCreator } from "../../../redux/features/jobs/job-applications/ApplicationSlice";
import { updateAppStatus2 } from "../../../redux/features/jobs/job-applications/ApplicationStatusSlice";
import { resetSAS } from "../../../redux/features/jobs/job-applications/downloadSASSlice";
import Select from "react-select";
const EmailModel = lazy(() => import("../../shared/emailModel"));

const ApplicantCardRe = (props: any) => {
  const dispatch = useDispatch(),
    navigate = useNavigate(),
    [status, setStatus] = useState<any>(null),
    [data, setData] = useState<any>(),
    [textLimit, setTextLimit] = useState(50),
    [mailLimt, setMailLimit] = useState(40),
    [sendEmail, setSendEmail] = useState(false),
    [showEmailModel, setShowEmailModel] = useState(false),
    [img, setImg] = useState(""),
    handleOpenEmailModel = () => {
      setShowEmailModel(!showEmailModel);
    },
    actionOptions: any = [
      { value: "SHORTLIST", label: "SHORTLIST" },
      { value: "REJECT", label: "REJECT" },
    ],
    statusArray = ["SHORTLIST", "REJECT"],
    customStyles = {
      control: (base) => ({
        ...base,
        fontSize: "12px",
      }),
      option: (provided) => ({
        ...provided,
        fontSize: "12px",
      }),
    },
    handleConfirmSwal = (option: any) => {
      Swal.fire({
        title: "Are you sure?",
        text: `Do you want to ${
          option?.label === "SHORTLIST" ? "shortlist" : "reject"
        } selected applicant`,
        showCancelButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "red",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result?.isConfirmed) {
          setStatus(option);
          dispatch(resetViewAppActionCreator());
          dispatch(resetSAS());
          dispatch(
            updateAppStatus({
              status: option?.label,
              applicants_info: [
                {
                  job_id: data?.jobid,
                  applicant_id: data?.userid,
                },
              ],
            })
          );
        }
      });
    };
  useEffect(() => {
    setData(props?.item);
    setStatus(
      statusArray.includes(props?.item?.status)
        ? { label: props?.item?.status, value: props?.item?.status }
        : null
    );
    if (props?.img?.length)
      setImg(
        props?.img?.filter((e) => {
          return e?.id === props?.item?.userid;
        })[0]?.img_sas
      );
  }, [props?.item]);
  return (
    <>
      <div
        className="myCard4 border"
        style={{ fontFamily: "poppins" }}
        key={`a${data?.userid}1`}
      >
        <div className="">
          <div className={"row"}>
            <div className="col-xl-11 col-lg-11 col-md-11 col-sm-12">
              <div className="job-name d-flex">
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    name={data?.userid}
                    className="custom-control-input"
                    id={`chk_mandatory_${data?.userid}`}
                    checked={data?.checked}
                    onChange={props?.handleCheckboxChange}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor={`chk_mandatory_${data?.userid}`}
                  ></label>
                </div>
                <div
                  className="com_logo d-flex justify-content-around"
                  style={{ width: "100px" }}
                >
                  {img ? (
                    <img
                      style={{
                        borderRadius: "10px",
                        height: "100%",
                        width: "100%",
                      }}
                      src={
                        img
                          ? img
                          : require("../../../assets/images/av-pic-01.png")
                      }
                    />
                  ) : (
                    <img
                      alt="Profile_Image"
                      src={require("../../../assets/images/av-pic-01.png")}
                      style={{
                        width: "55px",
                        height: "55px",
                      }}
                    />
                  )}
                </div>
                <ul
                  className="job-post-info ml-2"
                  style={{ listStyleType: "none" }}
                >
                  <li
                    className="job-name"
                    style={{
                      fontWeight: "600",
                      color: "#333",
                      fontSize: "14px",
                    }}
                    key={0}
                  >
                    <Link
                      className="text text-black"
                      style={{ textDecoration: "none", cursor: "pointer" }}
                      to={`/employer/jsProfilePreview?uid=${data?.userid}&jid=${data?.jobid}`}
                      onClick={() => {
                        !data?.ms &&
                          dispatch(
                            updateAppStatus2({
                              status: "VIEW",
                              applicants_info: [
                                {
                                  job_id: data?.jobid,
                                  applicant_id: data?.userid,
                                },
                              ],
                            })
                          );
                      }}
                      title={data?.name}
                    >
                      {Content(data?.name, 25)}
                    </Link>
                  </li>
                  <li className="job-requirements" title={data?.email} key={1}>
                    <Link to={`mailto:${data?.email}`}>
                      {Content(data?.email, mailLimt)}
                    </Link>
                  </li>
                  <li className="job-requirements" key={2}>
                    {data?.phone}
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-xl-1 col-lg-1 col-md-1 col-sm-12 myMail1">
              <IconButton
                className="myIcon1"
                onClick={() => {
                  handleOpenEmailModel();
                  setSendEmail(true);
                }}
                title={"Send Email"}
              >
                <MdMail />
              </IconButton>
            </div>
          </div>
        </div>
        <div>
          <div className="d-flex ">
            <div>
              <FaSuitcase className="custom-job-icon" title="Experience" />
              &nbsp;
              <span className="job-requirements">{data?.exp}</span>
            </div>
            <div>
              <IoMdWallet className="custom-job-icon myIcon2" title="Salary" />
              &nbsp;
              <span className="job-requirements">{data?.expectedCtc}</span>
            </div>
          </div>
          <div>
            <MdLocationOn className="custom-job-icon" title="Location" />
            &nbsp;
            <Tooltip title={data?.currentLoc} arrow>
              <span className="job-requirements">
                {Content(data?.currentLoc, textLimit)}
              </span>
            </Tooltip>
          </div>
          <div>
            <HiBuildingOffice2 className="custom-job-icon" title="Company" />
            &nbsp;
            <Tooltip title={data?.pervious?.join(", ")} arrow>
              <span className="job-requirements">
                {Content(
                  data?.pervious?.length
                    ? data?.pervious?.join(", ")
                    : "Not Available",
                  textLimit
                )}
              </span>
            </Tooltip>
          </div>
          <div>
            <FcGraduationCap className="custom-job-icon" title="Eduction" />
            &nbsp;
            <Tooltip title={data?.education?.join(", ")} arrow>
              <span className="job-requirements">
                {Content(
                  data?.education?.length
                    ? data?.education?.join(", ")
                    : "Not Available",
                  textLimit
                )}
              </span>
            </Tooltip>
          </div>
          <div>
            <ImLocation className="custom-job-icon" title="Pref. Location" />
            &nbsp;
            <Tooltip
              title={StateWiesPlaces(data?.preferLoc)?.join(" | ")}
              arrow
            >
              <span className="job-requirements">
                {Content(
                  data?.preferLoc?.length
                    ? StateWiesPlaces(data?.preferLoc).join(" | ")
                    : "Not Available",
                  textLimit
                )}
              </span>
            </Tooltip>
          </div>
          <div>
            <MdMilitaryTech className="custom-job-icon" title="Skills" />
            &nbsp;
            <Tooltip title={data?.keySkills?.join(" | ")} arrow>
              <span className="job-requirements text-break">
                {Content(
                  data?.keySkills?.length
                    ? data?.keySkills?.join(" | ")
                    : "Not Available",
                  textLimit
                )}
              </span>
            </Tooltip>
          </div>
        </div>
        <footer className="border-top pt-3" style={{ height: "35px" }}>
          {data?.score < 40 && (
            <Chip label="Low Match" color="error" variant="outlined" />
          )}
          {data?.score >= 60 && (
            <Chip label="High Match" color="success" variant="outlined" />
          )}
          {data?.score >= 40 && data?.score < 60 && (
            <Chip label="Medium Match" color="warning" variant="outlined" />
          )}
          <span>
            <div style={{ minWidth: 120, float: "right", marginTop: "0px" }}>
              <Select
                styles={customStyles}
                className="dropstyle"
                options={actionOptions}
                name="actionOptions"
                placeholder="Action"
                value={status}
                isSearchable={false}
                onChange={(option: any) => {
                  status?.value !== option?.value && handleConfirmSwal(option);
                }}
              />
            </div>
          </span>
        </footer>
      </div>
      <EmailModel
        showModal={showEmailModel}
        sendto={props?.item?.email}
        toggleModal={handleOpenEmailModel}
        formik={props}
        headerName={sendEmail ? "Send Email" : "Forward Email"}
        jobid={data?.jobid}
        key={`ZZ${data?.userid}00`}
      />
    </>
  );
};

export default ApplicantCardRe;
