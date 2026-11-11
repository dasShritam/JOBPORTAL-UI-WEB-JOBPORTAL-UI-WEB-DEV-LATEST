import { useEffect, useState } from "react";
import { Badge, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { JobApply } from "../../redux/features/jobs/apply-job/ApplyJob";
import { UseToastAlert } from "../../hooks/useToastAlert";

function ApplyJob({ showModal, toggleModal, questionsList }: any) {
  const [answers, setAnswers] = useState<any>([]);

  const preview = useSelector((state: any) => state.Jobpreviews);
  const { JobPreviewDetails, loadingJobPreview } = preview;

  const apply = useSelector((state: any) => state.JobApply);
  const { applyJob, loadjobs } = apply;

  useEffect(() => {
    if (applyJob?.code === 200 && !loadjobs) {
      if (showModal === true) {
        toggleModal();
      }
    }
    if (applyJob?.code === 400 && !loadjobs) {
      if (showModal === true) {
        toggleModal();
      }
    }
  }, [applyJob]);

  const [jobs, setJobs] = useState<any>([]);

  const showSnackAlert = UseToastAlert();

  useEffect(() => {
    // if (answers?.some((c) => c?.req && !c?.ans?.length)) {
    //   showSnackAlert(
    //     "warning",
    //     "Please answer the all required questions before apply."
    //   );

    //   return;
    // }

    if (!loadingJobPreview) {
      setAnswers(
        JobPreviewDetails?.data?.jobs[0]?.questions?.map((c) => {
          return { qesid: c.id, question: c.name, ans: [], req: c.required };
        })
      );
      setJobs(JobPreviewDetails?.data?.jobs);
    }
  }, [JobPreviewDetails]);

  const dispatch = useDispatch();

  const handleChangeQuestion = (qid: any, type: string, e: any) => {
    const index = answers?.findIndex((c) => c.qesid === qid);
    let newAnswers = [...answers];

    switch (type) {
      case "single":
        if (!newAnswers[index].ans.includes(e?.target?.value)) {
          newAnswers[index].ans =
            e?.target?.value?.trim()?.length > 0 ? [e?.target?.value] : null;
        }
        break;
      case "multi":
        if (!newAnswers[index].ans.includes(e?.target?.value)) {
          newAnswers[index].ans.push(e?.target?.value);
        } else {
          const ans = newAnswers[index].ans.filter(
            (c) => c !== e?.target?.value
          );
          newAnswers[index].ans = ans;
        }
        break;
      case "ans":
        newAnswers[index].ans =
          e?.target?.value?.trim()?.length > 0 ? [e?.target?.value] : null;

        break;
      default:
        break;
    }
    setAnswers(newAnswers);
  };

  const handleApplyJob = () => {
    if (answers?.some((c) => c?.req && !c?.ans?.length)) {
      showSnackAlert(
        "warning",
        "Please answer all mandatory questions before apply."
      );
      return;
    }

    if (jobs[0]?.questions?.length > 0) {
      const updatedAns = answers.map((item) => {
        const { req, ...rest } = item;
        return rest;
      });

      const apply = {
        jobid: jobs[0]?.jobid,
        status: "APPLY",
        qna: updatedAns,

        // mode: "all",
        // qna:[{}],
      };

      let data = new FormData();
      data.append("jobSeekerResp", JSON.stringify(apply));
      dispatch(JobApply(data));
    }
  };

  return (
    <>
      <Modal
        show={showModal}
        backdrop="static"
        className="modal browse-job fade modal-bx-info editor"
      >
        <div className="" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <div className="modal-custom-header">
                <h5 className="modal-title" id="ResumeheadlineModalLongTitle">
                  Answer Questions
                </h5>

                <button
                  type="button"
                  className="close"
                  onClick={() => {
                    toggleModal();
                  }}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <p className="modal-custom-desc">
                These answers will be visible to the employer.
              </p>

              <div className="row">
                <div
                  className="col-md-12 col-lg-12 col-sm12"
                  style={{ height: "380px", overflowY: "scroll" }}
                >
                  <div>
                    {jobs?.length &&
                      jobs[0]?.questions.map((question, index) => (
                        <div
                          key={question._id}
                          className="job-bx bg-white m-b30"
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <strong>
                                {index + 1}. {question?.name}
                              </strong>{" "}
                              <span style={{ color: "red" }}>
                                {question?.required ? "*" : ""}
                              </span>
                            </div>
                          </div>
                          <div>
                            {question.type !== "SINGLE_LINE" ? (
                              <ul style={{ listStyle: "none" }}>
                                {question?.options?.map((c) => (
                                  <li>
                                    {
                                      <div
                                        className={
                                          question?.type === "SINGLE_CHOICE"
                                            ? "custom-control custom-radio"
                                            : "custom-control custom-checkbox"
                                        }
                                      >
                                        <input
                                          type={
                                            question?.type === "SINGLE_CHOICE"
                                              ? "radio"
                                              : question?.type ===
                                                "MULTI_CHOICE"
                                              ? "checkbox"
                                              : ""
                                          }
                                          id={`opt_${c._id}`}
                                          name={question.id}
                                          value={c.val}
                                          checked={c.ans?.includes(c.val)}
                                          onClick={(e) => {
                                            handleChangeQuestion(
                                              question.id,
                                              question?.type === "SINGLE_CHOICE"
                                                ? "single"
                                                : "multi",
                                              e
                                            );
                                          }}
                                          className="custom-control-input"
                                        />
                                        <label
                                          htmlFor={`opt_${c._id}`}
                                          className="custom-control-label"
                                        >
                                          {c.val}
                                        </label>
                                        <span>
                                          {c.pref ? (
                                            <Badge>Preffered</Badge>
                                          ) : (
                                            ""
                                          )}
                                        </span>
                                      </div>
                                    }
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              // <ul style={{ listStyle: "none" }}>
                              //   {question?.options?.map((c) => (
                              //     <li key={c._id}>
                              //       <div
                              //         className={
                              //           question?.type === "SINGLE_CHOICE"
                              //             ? "custom-control custom-radio"
                              //             : "custom-control custom-checkbox"
                              //         }
                              //       >
                              //         <input
                              //           type={
                              //             question?.type === "SINGLE_CHOICE"
                              //               ? "radio"
                              //               : question?.type === "MULTI_CHOICE"
                              //               ? "checkbox"
                              //               : ""
                              //           }
                              //           id={`opt_${c._id}`}
                              //           name={question.id}
                              //           value={c.val}
                              //           checked={c.ans?.includes(c.val)}
                              //           onChange={(e) => {
                              //             handleChangeQuestion(
                              //               question.id,
                              //               question?.type === "SINGLE_CHOICE"
                              //                 ? "single"
                              //                 : "multi",
                              //               e
                              //             );
                              //           }}
                              //           className="custom-control-input"
                              //         />
                              //         <label
                              //           htmlFor={`opt_${c._id}`}
                              //           className="custom-control-label"
                              //         >
                              //           {c.val}
                              //         </label>
                              //         <span>
                              //           {c.pref ? <Badge>Preferred</Badge> : ""}
                              //         </span>
                              //       </div>
                              //     </li>
                              //   ))}
                              // </ul>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Type your answer."
                                onChange={(e) => {
                                  handleChangeQuestion(question.id, "ans", e);
                                }}
                              />
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className="modal-custom-footer">
                <button
                  type="submit"
                  className="site-button"
                  onClick={() => {
                    handleApplyJob();
                  }}
                >
                  Apply Job
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ApplyJob;
