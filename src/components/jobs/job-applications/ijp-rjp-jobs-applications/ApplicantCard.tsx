import { useEffect, useState } from "react";
import { AiOutlineIdcard, AiOutlineMail } from "react-icons/ai";
import { CiCalendarDate } from "react-icons/ci";
import { FaRegIdBadge, FaSuitcase } from "react-icons/fa";
import { FcGraduationCap } from "react-icons/fc";
import { IoMdWallet } from "react-icons/io";
import { MdLocationOn, MdMilitaryTech } from "react-icons/md";
import { TbCertificate } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Select from "react-select";
import Swal from "sweetalert2";
import "../../../../assets/customCss/ApplicantCard.css";
import { Content } from "../../../../common/common";
import { resetViewAppActionCreator } from "../../../../redux/features/jobs/job-applications/ApplicationSlice";
import { resetSAS } from "../../../../redux/features/jobs/job-applications/downloadSASSlice";
import { updateIjpRjpAppStatus2 } from "../../../../redux/features/jobs/job-applications/ijp-rjp-jobs-applications/IjpRjpApplicationStatusSlice";

function ApplicantCard(props) {
  const [status, setStatus] = useState<any>(null),
    [data, setData] = useState<any>(),
    dispatch = useDispatch(),
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
            updateIjpRjpAppStatus2({
              status: option?.label,
              applicants_info: [
                {
                  job_id: data?.jobid,
                  _id: data?.userid,
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
  }, [props?.item]);

  const [certificateData, setCertificateData] = useState<any>([]);
  useEffect(() => {
    if (data) {
      setCertificateData([...data?.certification?.map((e: any) => e.label)]);
    }
  }, [data]);
  return (
    <>
      <div className="post-bx" key={`a${data?.userid}1`}>
        <div className="">
          <div className="job-post-info">
            <div className="">
              <div className="d-inline-flex">
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
                <Link
                  className="text text-black"
                  style={{
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                  to={`/inrjobs/applicantpreview/${data?.userid}`}
                  onClick={() => {
                    !data?.ms &&
                      dispatch(
                        updateIjpRjpAppStatus2({
                          status: "VIEW",
                          applicants_info: [
                            {
                              job_id: data?.jobid,
                              _id: data?.userid,
                            },
                          ],
                        })
                      );
                  }}
                  title={data?.name}
                >
                  <label
                    style={{
                      textDecoration: "none",
                      cursor: "pointer",
                    }}
                  >
                    {Content(data?.name, 80)}
                  </label>
                </Link>
              </div>
              <div className="col-lg-6 col-sm-4 pb-3">
                <ul className="d-flex flex-row">
                  <li className="" title="Experience" key={0}>
                    <i style={{ color: "grey" }}>
                      <FaSuitcase />
                    </i>
                    <span style={{ fontSize: "14px" }}>{data?.exp}</span>
                  </li>

                  <li className="" title="Expected CTC" key={1}>
                    <i style={{ color: "grey" }}>
                      <IoMdWallet />
                    </i>
                    <span style={{ fontSize: "14px" }}>
                      {data?.expectedCtc}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-6 col-sm-4">
                <div className="">
                  <div className="row">
                    <span
                      className="col-lg-5 col-md-5 col-sm-12 clearfix font-13"
                      style={{
                        color: "grey",
                        fontSize: "14px",
                      }}
                    >
                      <i>
                        <FaRegIdBadge className="custom-job-icon" />
                      </i>
                      Role
                    </span>
                    <label
                      className="col-lg-7 col-md-7 col-sm-12"
                      title={data?.role}
                    >
                      {Content(data?.role, 20)}
                    </label>
                  </div>
                  <div className="row">
                    <span
                      className="col-lg-5 col-md-5 col-sm-5 clearfix font-13"
                      style={{
                        color: "grey",
                        fontSize: "14px",
                      }}
                    >
                      <i>
                        <MdLocationOn className="custom-job-icon" />
                      </i>
                      Loaction
                    </span>
                    <label
                      className="col-lg-7 col-md-7 col-sm-7"
                      title={data?.currentLoc}
                    >
                      {data?.currentLoc}
                    </label>
                  </div>

                  <div className="row">
                    <span
                      className="col-lg-5 col-md-5 col-sm-5 clearfix font-13"
                      style={{
                        color: "grey",
                        fontSize: "14px",
                      }}
                    >
                      <i>
                        <TbCertificate className="custom-job-icon" />
                      </i>
                      Certificate(s)
                    </span>
                    <label
                      className="col-lg-7 col-md-7 col-sm-7"
                      title={certificateData?.join(", ")}
                    >
                      {data?.certification?.length
                        ? Content(certificateData?.join(", "), 45)
                        : "Not Available"}
                    </label>
                  </div>

                  <div className="row">
                    <span
                      className="col-lg-5 col-md-5 col-sm-5 clearfix font-13"
                      style={{
                        color: "grey",
                        fontSize: "14px",
                      }}
                    >
                      <i>
                        <MdMilitaryTech className="custom-job-icon" />
                      </i>
                      Key Skills
                    </span>
                    <label
                      className="col-lg-7 col-md-7 col-sm-7"
                      title={data?.keySkills?.join(" | ")}
                    >
                      {data?.keySkills?.length
                        ? Content(data?.keySkills?.join(" | "), 45)
                        : "Not Available"}
                    </label>
                  </div>

                  <div className="row">
                    <span
                      className="col-lg-5 col-md-5 col-sm-5 clearfix font-13"
                      style={{
                        color: "grey",
                        fontSize: "14px",
                      }}
                    >
                      <i>
                        <FcGraduationCap className="custom-job-icon" />
                      </i>
                      Education
                    </span>
                    <label
                      className="col-lg-7 col-md-7 col-sm-7"
                      title={data?.education?.join(", ")}
                    >
                      {data?.education?.length
                        ? Content(data?.education?.join(", "), 45)
                        : "Not Available"}
                    </label>
                  </div>
                </div>
              </div>

              <div className="col-lg-6 col-sm-4">
                <div className="row">
                  <span
                    className="col-lg-5 col-md-5 col-sm-5 clearfix font-13 d-flex"
                    style={{
                      color: "grey",
                      fontSize: "14px",
                    }}
                  >
                    <i>
                      <AiOutlineMail className="custom-job-icon" />
                    </i>
                    Email
                  </span>
                  <label
                    className="col-lg-7 col-md-7 col-sm-7"
                    title={data?.email}
                  >
                    <Link to={`mailto:${data?.email}`}>
                      {Content(data?.email, 22)}
                    </Link>
                  </label>
                </div>

                {data?.refer !== "Not Available" && (
                  <>
                    <div className="row">
                      <span
                        className="col-lg-5 col-md-5 col-sm-5 clearfix font-13 d-flex"
                        style={{
                          color: "grey",
                          fontSize: "14px",
                        }}
                      >
                        <i>
                          <AiOutlineIdcard className="custom-job-icon" />
                        </i>
                        Referred By
                      </span>
                      <label
                        className="col-lg-7 col-md-7 col-sm-7"
                        title={"Refered By"}
                      >
                        {data?.refer}
                      </label>
                    </div>

                    <div className="row">
                      <span
                        className="col-lg-5 col-md-5 col-sm-5 clearfix font-13 d-flex"
                        style={{
                          color: "grey",
                          fontSize: "14px",
                        }}
                      >
                        <i>
                          <AiOutlineIdcard className="custom-job-icon" />
                        </i>
                        Reference ID
                      </span>
                      <label
                        className="col-lg-7 col-md-7 col-sm-7"
                        title={"Reference ID"}
                      >
                        {data?.referId}
                      </label>
                    </div>
                  </>
                )}

                <div className="row">
                  <span
                    className="col-lg-5 col-md-5 col-sm-5 clearfix font-13"
                    style={{
                      color: "grey",
                      fontSize: "14px",
                    }}
                  >
                    <i>
                      <CiCalendarDate className="custom-job-icon" />
                    </i>
                    Joining Date
                  </span>
                  <label
                    className="col-lg-7 col-md-7 col-sm-7"
                    title={"Joining Date"}
                  >
                    {data?.joiningDate}
                  </label>
                </div>
              </div>
            </div>

            {data?.reason !== "Not Available" && (
              <div className="row myCard2">
                <div className="col-lg-12 col-sm-4 forward ">
                  <>
                    <label
                      className=""
                      style={{
                        color: "grey",
                        fontSize: "14px",
                      }}
                    >
                      Relocate Assistance
                    </label>
                    <label
                      className="col-lg-8 col-md-8 col-sm-8"
                      title={"Relocate Assistance"}
                    >
                      {data?.reLoc
                        ? "Relocate assistance needed"
                        : "Relocate assistance not needed"}
                    </label>
                  </>
                  {data?.reason && (
                    <div title={data?.reason} id={""}>
                      <div>
                        <label
                          style={{
                            color: "grey",
                            fontSize: "14px",
                          }}
                        >
                          Job Apply Reason
                        </label>
                        <div>
                          <label
                            style={{
                              fontStyle: "14px",
                            }}
                          >
                            {Content(data?.reason, 150)}
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="border-top pt-3" style={{ height: "35px" }}>
          <span>
            <div
              style={{
                minWidth: 120,
                float: "right",
                marginTop: "0px",
              }}
            >
              <Select
                styles={customStyles}
                className="dropstyle"
                options={actionOptions}
                isSearchable={false}
                name="actionOptions"
                placeholder="Action"
                value={status}
                onChange={(option: any) => {
                  status?.value !== option?.value && handleConfirmSwal(option);
                }}
              />
            </div>
          </span>
        </footer>
      </div>
    </>
  );
}

export default ApplicantCard;
