import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PersonIcon from "@mui/icons-material/Person";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { Badge } from "react-bootstrap";
import { Tooltip } from "@mui/material";

interface propsType {
  userId: string;
  jobId: string;
}

const QuestionList = (props: propsType) => {
  const applicantProfile = useSelector((state: any) => state.jsPrfilePreview);
  const { ApplicantInfo, loading } = applicantProfile;
  const [profileValue, setProfileValue] = useState<any>("");
  const [bindAppProfile, setBindAppProfile] = useState<any>();

  useEffect(() => {
    if (!loading && ApplicantInfo?.data && ApplicantInfo?.data) {
      setProfileValue(ApplicantInfo);
    }
  }, [ApplicantInfo, loading]);

  useEffect(() => {
    if (profileValue.code === 200) {
      setBindAppProfile(profileValue?.data?.applicant_info);
    }
  }, [profileValue]);
  return (
    <>
      <div id="Questionnaire_bx" className=" job-bx bg-white m-b30">
        <div className="d-flex">
          <span className="m-b15 card-heading cardprop">
            Questionnaires answered by Candidate
          </span>
        </div>
        <div className="mainline" style={{ marginBottom: "10px" }}></div>
        <div>
          {bindAppProfile?.questions?.length ? (
            bindAppProfile?.questions?.map((item, index) => (
              <div key={item._id} className="job-bx bg-white m-b30">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>
                      {index + 1}. {item?.name}
                    </strong>
                  </div>
                </div>
                <div>
                  {item.type !== "SINGLE_LINE" ? (
                    <ul style={{ listStyle: "none" }}>
                      {item?.options?.map((c) => (
                        <li>
                          {
                            <div
                              className={
                                item?.type == "SINGLE_CHOICE"
                                  ? "custom-control custom-radio d-flex"
                                  : "custom-control custom-checkbox d-flex"
                              }
                            >
                              <input
                                type={
                                  item?.type == "SINGLE_CHOICE"
                                    ? "radio"
                                    : item?.type == "MULTI_CHOICE"
                                    ? "checkbox"
                                    : ""
                                }
                                id={`opt_${c._id}`}
                                name={item.id}
                                value={c.val}
                                disabled
                                checked={bindAppProfile?.qna[
                                  index
                                ]?.ans?.includes(c.val)}
                                onClick={() => {}}
                                className="custom-control-input"
                              />
                              <label
                                htmlFor={`opt_${c._id}`}
                                className="custom-control-label"
                                title={`${
                                  bindAppProfile?.qna[index]?.ans?.includes(
                                    c.val
                                  )
                                    ? "Answered"
                                    : "Not Answered"
                                }`}
                              >
                                {c.val}
                              </label>
                              <span className="ml-4">
                                {c.pref ? (
                                  <span
                                    className="badge badge-pill badge-info"
                                    title="preffered Answer"
                                  >
                                    Preffered
                                  </span>
                                ) : (
                                  // <Badge title="preffered Answer">Preffered</Badge>
                                  ""
                                )}
                              </span>
                            </div>
                          }
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type your answer."
                      disabled
                      value={bindAppProfile?.qna[index]?.ans}
                    />
                  )}
                </div>
              </div>
            ))
          ) : (
            <>
              <div style={{ color: "#c2c0bf", fontSize: "13px" }}>
                No Question has been Asked.
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default QuestionList;
