import { IconButton, Tooltip } from "@mui/material";
import { BsBuildingsFill } from "react-icons/bs";
import { FaSuitcase } from "react-icons/fa";
import { FcGraduationCap } from "react-icons/fc";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { ImLocation } from "react-icons/im";
import { IoMdWallet } from "react-icons/io";
import { MdLocationOn, MdMail, MdMilitaryTech } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { Content, StateWiesPlaces, openInNewTab } from "../../../common/common";
import EmailModel from "../../shared/emailModel";
import { useEffect, useRef, useState } from "react";
import { environment } from "../../../environments/environment";
import "../../../assets/customCss/ApplicantCard.css";

const ApplicantCard = (props: any) => {
    let comObj = props?.item?.emp?.filter((e) => {
            return e?.end_ts == null;
        }),
        education: any;
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
    const navigate = useNavigate(),
        [textLimit, setTextLimit] = useState(0),
        [mailLimt, setMailLimit] = useState(0),
        [showEmailModel, setShowEmailModel] = useState(false),
        [sendEmail, setSendEmail] = useState(true),
        company = comObj?.length > 0 && comObj[0]?.co ? comObj[0]?.co : "",
        handleOpenEmailModel = () => {
            setShowEmailModel(false);
        };
    useEffect(() => {
        setTextLimit(window?.screen?.width >= 500 ? 70 : 30);

        setMailLimit(window?.screen?.width >= 500 ? 40 : 10);
    }, [window?.screen?.width, textLimit, mailLimt]);
    return (
        <>
            <div className="myCard3 border" style={{ fontFamily: "poppins" }}>
                <div className="">
                    <div className={"row"}>
                        <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12">
                            <div className="job-name d-flex">
                                <div className="com_logo d-flex justify-content-around ">
                                    {props.image.length > 0 ? (
                                        <img
                                            style={{
                                                borderRadius: "10px",
                                                height: "100%",
                                                width: "100%",
                                            }}
                                            src={`${
                                                props?.image?.filter(
                                                    (e: any) =>
                                                        e.id ==
                                                        props?.item?.user_id
                                                )?.[0]?.img_sas === ""
                                                    ? require("../../../assets/images/av-pic-01.png")
                                                    : props?.image?.filter(
                                                          (e: any) =>
                                                              e.id ==
                                                              props?.item
                                                                  ?.user_id
                                                      )?.[0]?.img_sas
                                            }`}
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
                                    >
                                        <Tooltip
                                            title={`${props?.item?.profile?.name}`}
                                            arrow
                                        >
                                            <Link
                                                className="text text-black"
                                                to={`/employer/jsProfile/${props?.item?.user_id}`}
                                                style={{
                                                    textDecoration: "none",
                                                }}
                                            >
                                                {Content(
                                                    props?.item?.profile?.name,
                                                    30
                                                )}
                                            </Link>
                                        </Tooltip>
                                    </li>
                                    <li className="job-requirements">
                                        <Tooltip
                                            title={`${props?.item?.personnalDetails?.mail?.val}`}
                                            arrow
                                        >
                                            <Link
                                                to={`mailto:${props?.item?.personnalDetails?.mail?.val}`}
                                            >
                                                {Content(
                                                    props?.item
                                                        ?.personnalDetails?.mail
                                                        ?.val,
                                                    mailLimt
                                                )}
                                            </Link>
                                        </Tooltip>
                                    </li>
                                    <li className="job-requirements">
                                        {`${props?.item?.personnalDetails?.ph?.code} ${props?.item?.personnalDetails?.ph?.val}`}
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
                            <button
                                type="button"
                                className="myBtn1 btn-sm float-right"
                                onClick={() => {
                                    setShowEmailModel(true);
                                    setSendEmail(true);
                                }}
                            >
                                Send Email
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="d-flex ">
                        <div>
                            <FaSuitcase
                                className="custom-job-icon"
                                title="Experience"
                            />
                            &nbsp;
                            <span className="job-requirements">
                                {(props?.item?.career_prof?.experience?.yr ||
                                    props?.item?.career_prof?.experience?.yr ===
                                        0) &&
                                (props?.item?.career_prof?.experience?.mos ||
                                    props?.item?.career_prof?.experience
                                        ?.mos === 0)
                                    ? `${
                                          props?.item?.career_prof?.experience
                                              ?.yr
                                      }${
                                          props?.item?.career_prof?.experience
                                              ?.yr >= 2
                                              ? "years"
                                              : "year"
                                      } ${
                                          props?.item?.career_prof?.experience
                                              ?.mos
                                      }${
                                          props?.item?.career_prof?.experience
                                              ?.mos >= 2
                                              ? "months"
                                              : "month"
                                      }`
                                    : "Not Available"}
                            </span>
                        </div>
                        <div>
                            <IoMdWallet
                                className="custom-job-icon ml-3"
                                title="Salary"
                            />
                            &nbsp;
                            <span className="job-requirements">
                                {`${
                                    props?.item?.career_prof?.experience?.cctc
                                        ?.val
                                        ? props?.item?.career_prof?.experience
                                              ?.cctc?.cy === "INR"
                                            ? `₹ ${props?.item?.career_prof?.experience?.cctc?.val}`
                                            : `$ ${props?.item?.career_prof?.experience?.cctc?.val}`
                                        : "Not Available"
                                }`}
                            </span>
                        </div>
                    </div>
                    <div>
                        <MdLocationOn
                            className="custom-job-icon"
                            title="Location"
                        />
                        &nbsp;
                        <Tooltip title={props?.item?.profile?.location} arrow>
                            <span className="job-requirements">
                                {Content(
                                    props?.item?.profile?.location
                                        ? props?.item?.profile?.location
                                        : "Not Available",
                                    textLimit
                                )}
                            </span>
                        </Tooltip>
                    </div>
                    <div>
                        <HiBuildingOffice2
                            className="custom-job-icon"
                            title="Company"
                        />
                        &nbsp;
                        <Tooltip title={company} arrow>
                            <span className="job-requirements">
                                {Content(
                                    company ? company : "Not Available",
                                    textLimit
                                )}
                            </span>
                        </Tooltip>
                    </div>
                    <div>
                        <FcGraduationCap
                            className="custom-job-icon"
                            title="Eduction"
                        />
                        &nbsp;
                        <Tooltip title={education} arrow>
                            <span className="job-requirements">
                                {Content(
                                    education ? education : "Not Available",
                                    textLimit
                                )}
                            </span>
                        </Tooltip>
                    </div>
                    <div>
                        <ImLocation
                            className="custom-job-icon"
                            title="Pref. Location"
                        />
                        &nbsp;
                        <Tooltip
                            title={StateWiesPlaces(
                                props?.item?.career_prof?.prefer_location
                            ).join(" | ")}
                            arrow
                        >
                            <span className="job-requirements">
                                {Content(
                                    props?.item?.career_prof?.prefer_location
                                        .length
                                        ? StateWiesPlaces(
                                              props?.item?.career_prof
                                                  ?.prefer_location
                                          ).join(" | ")
                                        : "Not Available",
                                    textLimit
                                )}
                            </span>
                        </Tooltip>
                    </div>
                    <div>
                        <MdMilitaryTech
                            className="custom-job-icon"
                            title="Skills"
                        />
                        &nbsp;
                        <Tooltip
                            title={props?.item?.skills?.key_skills.join(" | ")}
                            arrow
                        >
                            <span className="job-requirements text-break">
                                {Content(
                                    props?.item?.skills?.key_skills?.length
                                        ? props?.item?.skills?.key_skills.join(
                                              " | "
                                          )
                                        : "Not Available",
                                    textLimit
                                )}
                            </span>
                        </Tooltip>
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
};

export default ApplicantCard;
