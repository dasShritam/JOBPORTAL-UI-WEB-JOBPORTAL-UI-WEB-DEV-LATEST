import { useEffect, useState } from "react";
import { Tooltip } from "@mui/material";
import { MdLocationOn, MdMail, MdMilitaryTech } from "react-icons/md";

import { FaSuitcase } from "react-icons/fa";
import { IoMdWallet } from "react-icons/io";

import "../../../assets/customCss/ApplicantCard.css";

import { IconButton } from "@mui/material";
import EmailModel from "../../shared/emailModel";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Content, StateWiesPlaces, openInNewTab } from "../../../common/common";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import { recruitmentMailReset } from "../../../redux/features/employer/recruitmentMailslice";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { ImLocation } from "react-icons/im";
import { FcGraduationCap } from "react-icons/fc";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { environment } from "../../../environments/environment";

function ApplicantResultCard(props) {
  let comObj = props?.item?.emp?.filter((e) => {
    return e?.end_ts == null;
  });

  const company = comObj?.length > 0 && comObj[0]?.co ? comObj[0]?.co : "";
  let education: any;
  if (props?.item?.edu?.degree?.length > 0) {
    props?.item?.edu?.degree?.filter((e) => {
      if (e?.level == "Doctorate/PhD") {
        education = "Doctorate/PhD";
      } else if (e?.level == "Masters/Post-Graduation") {
        education = "Masters/Post-Graduation";
      } else if (e?.level == "Batchelor/Under-Graduation")
        education = "Batchelor/Under-Graduation";
      else education = "Diploma/Graduation";
    });
  }

  const [sendEmail, setSendEmail] = useState(true);
  const dispatch = useDispatch();

  const [showEmailModel, setShowEmailModel] = useState(false);

  const handleOpenEmailModel = () => {
    setShowEmailModel(!showEmailModel);
  };

  const showSnackAlert = UseToastAlert();
  const { Emails, loadReM } = useSelector((state: any) => state.emailSend);

  useEffect(() => {
    if (!loadReM && Emails?.code == 200) {
      showSnackAlert("success", Emails?.message);
      setShowEmailModel(false);
      dispatch(recruitmentMailReset());
    }
    if (!loadReM && Emails?.code == 400) {
      showSnackAlert("warning", Emails?.message[0]);
      dispatch(recruitmentMailReset());
    }
    if (
      !loadReM &&
      Emails?.code > 200 &&
      Emails.code < 410 &&
      Emails.code != 400
    ) {
      showSnackAlert("warning", Emails?.message);
      dispatch(recruitmentMailReset());
    }
    if (!loadReM && Emails?.code >= 500) {
      showSnackAlert("error", Emails?.message);
      dispatch(recruitmentMailReset());
    }
  }, [Emails, loadReM]);
  useEffect(() => {
    dispatch(recruitmentMailReset());
  }, []);

  return (
    <>
      <div className="post-bx">
        <div className="">
          <div className="job-post-info">
            <div className="row">
              <div className="col-lg-7 col-sm-4 pb-3">
                <div className="">
                  <div className="form-group">
                    <div className="custom-control">
                      <label style={{ marginLeft: "-4%" }}>
                        <Link
                          className="text text-black"
                          to={""}
                          style={{ textDecoration: "none" }}
                          onClick={() => {
                            openInNewTab(
                              `${environment.baseUiUrl}/employer/jsProfile/${props?.item?.user_id}`
                            );
                          }}
                        >
                          {props?.item?.profile?.name}
                        </Link>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="">
                  <ul className="d-flex flex-row">
                    <li className="" style={{ fontSize: "14px" }}>
                      <Tooltip title={`Experience`} arrow>
                        <span>
                          <i style={{ color: "grey" }}>
                            <FaSuitcase />
                          </i>
                        </span>
                      </Tooltip>
                      {props?.item?.career_prof?.experience?.yr &&
                      (props?.item?.career_prof?.experience?.mos ||
                        props?.item?.career_prof?.experience?.mos == 0) ? (
                        <Tooltip
                          title={`${
                            props?.item?.career_prof?.experience?.yr
                              ? props?.item?.career_prof?.experience?.yr +
                                "year"
                              : "0 year"
                          } ${
                            props?.item?.career_prof?.experience?.mos
                              ? props?.item?.career_prof?.experience?.mos +
                                "month"
                              : "0 month"
                          }`}
                          arrow
                        >
                          <span style={{ color: "grey" }}>
                            {" "}
                            {` ${
                              props?.item?.career_prof?.experience?.yr
                                ? props?.item?.career_prof?.experience?.yr +
                                  "year"
                                : ""
                            }`}
                            {` ${
                              props?.item?.career_prof?.experience?.mos ||
                              props?.item?.career_prof?.experience?.mos == 0
                                ? props?.item?.career_prof?.experience?.mos +
                                  "month"
                                : " "
                            }`}
                          </span>
                        </Tooltip>
                      ) : (
                        <Tooltip title={`Not disclosed`} arrow>
                          <span style={{ color: "grey" }}>Not disclosed</span>
                        </Tooltip>
                      )}
                    </li>

                    <li className="" style={{ fontSize: "14px" }}>
                      <i style={{ color: "grey" }}>
                        <Tooltip title={`Salary`} arrow>
                          <span>
                            <IoMdWallet />
                          </span>
                        </Tooltip>
                      </i>
                      {props?.item?.career_prof?.experience?.cctc?.val ? (
                        <Tooltip
                          title={
                            props?.item?.career_prof?.experience?.cctc?.val
                          }
                          arrow
                        >
                          <span>
                            <span style={{ color: "grey" }}>
                              {props?.item?.career_prof?.experience?.cctc?.cy}
                              &nbsp;
                              {props?.item?.career_prof?.experience?.cctc?.val}
                            </span>
                          </span>
                        </Tooltip>
                      ) : (
                        <Tooltip title={`Not disclosed`} arrow>
                          <span style={{ color: "gray" }}>Not disclosed</span>
                        </Tooltip>
                      )}
                    </li>
                  </ul>
                </div>
                <div className="mt-3">
                  <div className="row">
                    <Tooltip title={"Current company"} arrow>
                      <span className="col-lg-3 col-md-3 col-sm-3 clearfix font-13 ">
                        <MdLocationOn className="custom-job-icon" />
                        &nbsp; Location
                      </span>
                    </Tooltip>
                    {props?.item?.profile?.location ? (
                      <label className="col-lg-9 col-md-9 col-sm-9 ">
                        <Tooltip
                          title={props?.item?.profile?.location}
                          placement="bottom-start"
                          arrow
                        >
                          <span className="text-break">
                            {" "}
                            {Content(props?.item?.profile?.location, 40)}
                          </span>
                        </Tooltip>
                      </label>
                    ) : (
                      <label className="col-lg-9 col-md-9 col-sm-9 ">
                        <Tooltip
                          title={"Not Available"}
                          placement="bottom-start"
                          arrow
                        >
                          <span>Not Available</span>
                        </Tooltip>
                      </label>
                    )}
                  </div>
                  <div className="row">
                    <Tooltip title={"Current company"} arrow>
                      <span className="col-lg-3 col-md-3 col-sm-3 clearfix font-13 ">
                        <HiBuildingOffice2 className="custom-job-icon" />
                        &nbsp; Company
                      </span>
                    </Tooltip>
                    {company ? (
                      <label className="col-lg-9 col-md-9 col-sm-9 ">
                        <Tooltip title={company} placement="bottom-start" arrow>
                          <span>{Content(company, 50)}</span>
                        </Tooltip>
                      </label>
                    ) : (
                      <label className="col-lg-9 col-md-9 col-sm-9 ">
                        <Tooltip
                          title={"Not Available"}
                          placement="bottom-start"
                          arrow
                        >
                          <span>Not Available</span>
                        </Tooltip>
                      </label>
                    )}
                  </div>

                  <div className="row">
                    <Tooltip title={"Higher Education"} arrow>
                      <span className="col-lg-3 col-md-3 col-sm-3 clearfix font-13 ">
                        <FcGraduationCap className="custom-job-icon" />
                        &nbsp; Education
                      </span>
                    </Tooltip>
                    {education ? (
                      <label className="col-lg-9 col-md-9 col-sm-9">
                        {" "}
                        <Tooltip
                          title={education}
                          placement="bottom-start"
                          arrow
                        >
                          <span> {Content(education, 50)}</span>
                        </Tooltip>
                      </label>
                    ) : (
                      <label className="col-lg-9 col-md-9 col-sm-9">
                        <Tooltip
                          title={"Not Available"}
                          placement="bottom-start"
                          arrow
                        >
                          <span> Not Available</span>
                        </Tooltip>
                      </label>
                    )}
                  </div>

                  <div className="row">
                    <Tooltip title={"Prefer location"} arrow>
                      <span className="col-lg-3 col-md-3 col-sm-3 clearfix font-13 ">
                        <ImLocation className="custom-job-icon mr-1" />
                        Pref.location
                      </span>
                    </Tooltip>
                    {props?.item?.career_prof?.prefer_location?.length > 0 ? (
                      <label className="col-lg-9 col-md-9 col-sm-9 ">
                        <Tooltip
                          title={StateWiesPlaces(
                            props?.item?.career_prof?.prefer_location
                          )?.join(" | ")}
                          placement="bottom-start"
                          arrow
                        >
                          <span>
                            {Content(
                              StateWiesPlaces(
                                props?.item?.career_prof?.prefer_location
                              )?.join(" | "),
                              50
                            )}
                          </span>
                        </Tooltip>
                      </label>
                    ) : (
                      <label className="col-lg-9 col-md-9 col-sm-9 ">
                        <Tooltip
                          title={"Not Available"}
                          placement="bottom-start"
                          arrow
                        >
                          <span>Not Available</span>
                        </Tooltip>
                      </label>
                    )}
                  </div>

                  <div className="row">
                    <Tooltip title={"Key skills"} arrow>
                      <span className="col-lg-3 col-md-3 col-sm-3  clearfix font-13">
                        <MdMilitaryTech className="custom-job-icon mr-1" />
                        Key Skills
                      </span>
                    </Tooltip>
                    {props?.item?.skills?.key_skills?.length > 0 ? (
                      <label className="col-lg-9 col-md-9 col-sm-9 ">
                        <Tooltip
                          title={props?.item?.skills?.key_skills?.map(
                            (skill, ind) =>
                              skill +
                              `${
                                ind ==
                                props?.item?.skills?.key_skills?.length - 1
                                  ? " "
                                  : " | "
                              }`
                          )}
                          placement="bottom-start"
                          arrow
                        >
                          <span>
                            {Content(
                              props?.item?.skills?.key_skills?.map(
                                (skill, ind) =>
                                  skill +
                                  `${
                                    ind ==
                                    props?.item?.skills?.key_skills?.length - 1
                                      ? " "
                                      : " | "
                                  }`
                              ),
                              50
                            )}
                          </span>
                        </Tooltip>
                      </label>
                    ) : (
                      <label className="col-lg-9 col-md-9 col-sm-9 ">
                        <Tooltip
                          title={"Not Available"}
                          placement="bottom-start"
                          arrow
                        >
                          <span> Not Available</span>
                        </Tooltip>
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-sm-4">
                <center>
                  <div>
                    <div
                      className="job-post-company"
                      style={{ marginRight: "0px" }}
                    >
                      <div className="round-box">
                        {props.image.length > 0 ? (
                          <img
                            alt="Profile_Image"
                            src={`
                              ${
                                props?.image?.filter(
                                  (e: any) => e.userId == props?.item?.user_id
                                )?.[0]?.img_sas == ""
                                  ? require("../../../assets/images/av-pic-01.png")
                                  : props?.image?.filter(
                                      (e: any) =>
                                        e.userId == props?.item?.user_id
                                    )?.[0]?.img_sas
                              }
                           `}
                            style={{
                              borderRadius: "100%",
                              width: "70px",
                              height: "70px",
                            }}
                          />
                        ) : (
                          <img
                            alt="Profile_Image"
                            src={require("../../../assets/images/av-pic-01.png")}
                          />
                        )}
                      </div>
                    </div>
                    <label>Contact Details</label>
                    <br />
                    <Tooltip title={"Phone number"} arrow>
                      <span>
                        <FaPhoneAlt className="custom-job-icon" />
                      </span>
                    </Tooltip>
                    &nbsp;
                    {props?.item?.personnalDetails?.ph?.val ? (
                      <Tooltip
                        title={props?.item?.personnalDetails?.ph?.val}
                        arrow
                      >
                        <span>
                          {" "}
                          <span>
                            {props?.item?.personnalDetails?.ph?.code}
                          </span>{" "}
                          <span>{props?.item?.personnalDetails?.ph?.val}</span>
                        </span>
                      </Tooltip>
                    ) : (
                      <Tooltip title={"Not Available"} arrow>
                        <span>Not Available</span>
                      </Tooltip>
                    )}
                    <br />
                    <span>
                      {" "}
                      <Tooltip title={"Email id"} arrow>
                        <span>
                          <MdEmail className="custom-job-icon" />
                        </span>
                      </Tooltip>
                      &nbsp;
                    </span>
                    {props?.item?.personnalDetails?.mail?.val ? (
                      <Tooltip
                        title={props?.item?.personnalDetails?.mail?.val}
                        arrow
                      >
                        <span>{props?.item?.personnalDetails?.mail?.val}</span>
                      </Tooltip>
                    ) : (
                      <Tooltip title={"Not Available"} arrow>
                        <span>Not Available</span>
                      </Tooltip>
                    )}
                  </div>
                </center>
              </div>

              <div className="col-lg-1 col-sm-4">
                <center className="center-btn">
                  <div className="col-lg-12 col-sm-4 mail">
                    <IconButton
                      onClick={() => {
                        setShowEmailModel(true);
                        setSendEmail(true);
                      }}
                    >
                      <MdMail />
                    </IconButton>
                  </div>
                  <br />
                  <br />
                  {/* <div className="col-lg-12 col-sm-4 forward ">
                    <IconButton
                      onClick={() => {
                        setShowEmailModel(true);
                        setSendEmail(false);
                      }}
                    >
                      <RiShareForwardFill />
                    </IconButton>
                  </div> */}
                  <br />
                  <br />
                </center>
              </div>
            </div>
            {props?.item?.career_prof?.summary && (
              <div className="row">
                <div className="col-lg-12 col-sm-4 forward ">
                  {props?.item?.career_prof?.summary && (
                    <Tooltip title={props?.item?.career_prof?.summary} arrow>
                      <div>
                        {" "}
                        <label>Description About Applicant</label>
                        <div>
                          <span
                            style={{ fontStyle: "14px" }}
                            className="text-break"
                          >
                            {Content(props?.item?.career_prof?.summary, 120)}{" "}
                          </span>
                        </div>
                      </div>
                    </Tooltip>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <EmailModel
        showModal={showEmailModel}
        sendto={props?.item?.personnalDetails?.mail?.val}
        toggleModal={handleOpenEmailModel}
        formik={props}
        headerName={sendEmail ? "Send Email" : "Forward Email"}
        jobid={""}
      />
    </>
  );
}

export default ApplicantResultCard;
