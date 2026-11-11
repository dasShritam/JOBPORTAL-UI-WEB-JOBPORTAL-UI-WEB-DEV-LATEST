import { CgWorkAlt } from "react-icons/cg";
import { HiBuildingOffice2 } from "react-icons/hi2";
import {
  formatNumberToSalary,
  formatTimestamp,
  getDateDifference,
  getTimestampToDate,
} from "../../../../common/common";
import { HiOutlineLocationMarker } from "react-icons/hi";
import exp from "constants";
import { EducationOption } from "./formik";
import { useEffect, useState } from "react";
import education from "../../../employer/js-profile/education";
import { timeStamp } from "console";

function JobPreview(props: any) {
  const [eduData, setEduData] = useState<any>([]);
  const getEducation = () => {
    if (props?.isFromPreview) {
      //   const edudata = props?.eduQualification?.map((c) => {
      //     return { course: c.course, stream: c.stream };
      //   });
      //   const edudata = props?.eduQualification?.map((c) => {
      //     return {
      //       course: c.course,
      //       stream: c?.stream,
      //     };
      //   });
      setEduData(props?.eduQualification);
    } else {
      const eduCourses = props?.eduQualification?.filter(
        (c) => c?.isCourse || EducationOption?.includes(c?.label)
      );

      const eduData: any = eduCourses?.map((c) => {
        return {
          course: c?.label,
          stream: EducationOption?.includes(c?.label)
            ? []
            : props?.eduQualification
                ?.filter((x) => x?.parentId == c?.id)
                ?.map((z) => {
                  return z?.label;
                }),
        };
      });

      setEduData(eduData);
    }
  };

  const getDate = (date) => {
    if (typeof date == "number") {
      return formatTimestamp(date);
    } else {
      let dateInfo = date.$d;
      const dates = new Date(dateInfo);
      const tsDate = dates.getTime() / 1000;

      let a = formatTimestamp(tsDate);

      return formatTimestamp(tsDate);
    }
  };

  function isDate(value) {
    return value instanceof Date;
  }

  useEffect(() => {
    getEducation();
  }, []);

  return (
    <>
      <div className="job-bx bg-white m-b10">
        <div className="d-flex justify-content-between">
          {props && (
            <div className="d-flex flex-column">
              <span className="job-title mb-2" style={{ fontSize: "15px" }}>
                {props?.designation?.label ?? "Not Available"}
              </span>

              {props?.referenceCode && (
                <div className="job-content" style={{ fontSize: "14px" }}>
                  <span>Reference code : </span>
                  <span className="ml-1">
                    {props?.referenceCode ?? "Not Available"}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <div className="c_content_details d-flex flex-column m-b15">
            <div>
              <div className="d-flex">
                <div
                  className="job-content mr-2"
                  title="Experience"
                  style={{ fontSize: "14px" }}
                >
                  <CgWorkAlt />
                  {/* <span className="ml-1">
                    {props?.workExp
                      ? `${props?.workExp[0]} - ${props?.workExp[1]} years`
                      : "Not mentioned"}
                  </span> */}
                  <span className="ml-1">
                    {props?.workExp[0] === 0 && props?.workExp[1] === 0
                      ? "Fresher"
                      : props?.workExp
                      ? `${props?.workExp[0]} - ${props?.workExp[1]} years`
                      : "Not mentioned"}
                  </span>
                </div>
                <span>|</span>
                <div
                  className="job-content ml-2"
                  title="Salary"
                  style={{ fontSize: "14px" }}
                >
                  {/* <span className="ml-1">
                    {!props?.isSalaryHidden ? (
                      <>
                        {props?.currency === "USD" ? "$" : "₹"}
                        {formatNumberToSalary(props?.salary[0])} -{" "}
                        {props?.salary[1] ? (
                          <>
                            {props?.currency === "USD" ? "$" : "₹"}
                            {formatNumberToSalary(props?.salary[1])}
                          </>
                        ) : (
                          "₹ Not disclosed"
                        )}
                      </>
                    ) : (
                      "₹ Not disclosed"
                    )}
                  </span> */}

                  <span className="ml-1">
                    {!props?.isSalaryHidden ? (
                      <>
                        {props?.currency === "USD" ? "$" : "₹"}
                        {props?.salary[0] !== 0 ? (
                          <>
                            {formatNumberToSalary(props?.salary[0])}
                            {props?.salary[1] ? " - " : ""}{" "}
                            {props?.salary[1] ? (
                              <>
                                {props?.currency === "USD" ? "$" : "₹"}
                                {formatNumberToSalary(props?.salary[1])}
                              </>
                            ) : (
                              ""
                            )}
                          </>
                        ) : (
                          " Not disclosed"
                        )}
                      </>
                    ) : (
                      "₹ Not disclosed"
                    )}
                  </span>
                </div>
              </div>
              <div
                className="job-content"
                title="Location"
                style={{ fontSize: "14px" }}
              >
                <HiOutlineLocationMarker height={"15px"} width={"2em"} />
                <span className=" ml-2 word-break">
                  {props?.location
                    ? props?.location?.join("| ")
                    : "Not Available"}
                </span>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <div style={{ fontSize: "14px" }}>
              <div className="job-content">
                <span>Posted :&nbsp;</span>
                <span>
                  Today
                  {/* {getDateDifference(props?.created_at ?? "Not available")} */}
                </span>
              </div>
              <div className="job-content" style={{ fontSize: "14px" }}>
                <span>Openings : </span>
                <span className="ml-1">
                  {props?.vacancy ? props?.vacancy : "Not Mentioned"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="job-bx bg-white m-b15">
        <span className="job-subtitle" style={{ fontSize: "15px" }}>
          Job description
        </span>

        <div className="m-b15 " style={{ fontSize: "14px" }}>
          <div
            className="jobDessContent isHotDiv mb-2"
            style={{ wordWrap: "break-word" }}
          >
            <span
              style={{ fontSize: "14px" }}
              dangerouslySetInnerHTML={{
                __html:
                  props?.jobDesc?.replace(/<br\s*\/?>/gm, "") ||
                  "Not Available",
              }}
              className=" text-break"
            ></span>
          </div>
          <div className="job-desc" style={{ fontSize: "14px" }}>
            <span className="job-desc-label">Department :&nbsp;</span>
            <span className="job-desc-content " style={{ fontSize: "14px" }}>
              {props?.department?.label ?? "Not Available"}
            </span>
          </div>
          <div className="job-desc" style={{ fontSize: "14px" }}>
            <span className="job-desc-label">Role Category :&nbsp;</span>
            <span className="job-desc-content" style={{ fontSize: "14px" }}>
              {props?.roleCategory?.label ?? "Not Available"}
            </span>
          </div>

          <div className="job-desc" style={{ fontSize: "14px" }}>
            <span className="job-desc-label">Role :&nbsp;</span>
            <span className="job-desc-content" style={{ fontSize: "14px" }}>
              {props?.role?.label ?? "Not Available"}
            </span>
          </div>
        </div>
        <div className="m-b15">
          <span className="job-subtitle" style={{ fontSize: "15px" }}>
            Education
          </span>

          <div style={{ fontSize: "14px" }}>
            {eduData &&
              eduData.map((c: any) => (
                <div key={c.id}>
                  <span className="job-desc-label">{c.course} </span>
                  <span className="job-desc-content">
                    {c.stream && Array.isArray(c.stream)
                      ? c.stream.join(",")
                      : ""}
                  </span>
                </div>
              ))}
          </div>
        </div>
        <div className="m-b15">
          <span className="job-subtitle" style={{ fontSize: "15px" }}>
            Key Skills
          </span>
          <div className="job-desc" style={{ fontSize: "14px" }}>
            {/* <span className="job-desc-content">
              {props?.keySkills?.map((c: any) => (
                <span className="custom-chip word-break" key={c.label}>
                  {c.label}
                </span>
              ))}
            </span> */}

            <span className="job-desc-content" style={{ fontSize: "14px" }}>
              {Array.isArray(props.keySkills) ? (
                // Handle array of objects
                props.keySkills.map((item: any) => {
                  if (Array.isArray(item)) {
                    // Handle array of arrays
                    return item.map((c: any, index: number) => (
                      <span className="custom-chip word-break" key={index}>
                        {c}
                      </span>
                    ));
                  } else if (typeof item === "object" && item.label) {
                    // Handle array of objects
                    return (
                      <span className="custom-chip word-break" key={item.label}>
                        {item.label}
                      </span>
                    );
                  } else {
                    return null; // Invalid data
                  }
                })
              ) : (
                <span>Not Available</span>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="job-bx bg-white m-b15" style={{ fontSize: "14px" }}>
        <div className="job-desc" style={{ fontSize: "14px" }}>
          <span className="job-desc-label">Application Starts on :&nbsp;</span>
          <span className="job-desc-content" style={{ fontSize: "14px" }}>
            {props?.startDate ? getDate(props?.startDate) : "Not Available"}
          </span>
        </div>
        <div className="job-desc" style={{ fontSize: "14px" }}>
          <span className="job-desc-label">Application Ends on :&nbsp;</span>
          <span className="job-desc-content" style={{ fontSize: "14px" }}>
            {props?.endDate ? getDate(props?.endDate) : "Not Available"}
          </span>
        </div>

        <div className="job-desc" style={{ fontSize: "14px" }}>
          <span className="job-desc-label">Hiring Manager :&nbsp;</span>
          <span className="job-desc-content" style={{ fontSize: "14px" }}>
            {props?.hiringManager?.label ?? "Not Available"}
          </span>
        </div>

        {props?.bonus && (
          <div style={{ fontSize: "14px" }}>
            <div className="job-desc">
              <span className="job-desc-label">Bonus :&nbsp;</span>
              <span className="job-desc-content" style={{ fontSize: "14px" }}>
                {props?.bonus}
              </span>
            </div>
            {props?.bonusCondition && (
              <>
                <div className="job-desc">
                  <span className="job-desc-label">
                    Bonus Condition :&nbsp;
                  </span>
                </div>

                <div className="">
                  <span
                    className="job-desc-content"
                    style={{
                      fontSize: "14px",
                      wordBreak: "break-word",
                      fontWeight: "500px",
                    }}
                  >
                    {props?.bonusCondition}
                  </span>
                </div>
              </>
            )}
          </div>
        )}

        {!props?.isFromPreview && (
          <div className="d-flex flex-column" style={{ fontSize: "14px" }}>
            <span className="job-desc-label">Share with</span>
            <div className="">
              {props?.shareWith?.map((c) => (
                <span
                  className="custom-chip"
                  style={{ fontSize: "14px" }}
                  key={c}
                >
                  {c}
                </span>
              ))}
            </div>
            {/* <span className="job-desc-content text-break isHotDiv">
            {props?.shareWith?.join(",")}
          </span> */}
          </div>
        )}

        <div>
          <div className="d-flex justify-content-between mt-3">
            <div style={{ fontSize: "15px" }}>
              <label>
                EEO (
                <span className="font_italic_sm">
                  Equal Equipment Opportunity
                </span>
                )
              </label>
            </div>
          </div>
          <div className="post-bx">
            <div className="d-flex isHotDiv" style={{ fontSize: "14px" }}>
              <label>
                EEO-A statement that the company is an equal opportunity
                employer and does not discriminate based on race, colour,
                religion, sex, national origin, age, disability, or any other
                legally protected status.
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default JobPreview;
