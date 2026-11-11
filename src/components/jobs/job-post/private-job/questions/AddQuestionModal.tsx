import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";
import { getRandomNumber } from "../../../../../common/common";
import Question from "./Question";
import { AiOutlineCloseCircle, AiOutlineDelete } from "react-icons/ai";
import { BiEdit, BiEditAlt } from "react-icons/bi";
import { Modal } from "react-bootstrap";
import IconButton from "@mui/material/IconButton";
import { MdControlPointDuplicate, MdOutlineDeleteSweep } from "react-icons/md";
import { choiceType } from "../formData";
import Questions from "./Questions";
import { useDispatch, useSelector } from "react-redux";
import {
  GetQuestionTemplates,
  PostTemplate,
  deleteTemplate,
} from "../../../../../redux/features/jobs/job-post/private-job/PrivateJobSlice";
import { UseToastAlert } from "../../../../../hooks/useToastAlert";
import { Badge, Chip } from "@mui/material";
import Swal from "sweetalert2";

interface propsType {
  formik: any;
  showModal: boolean;
  toggleModal: any;
}

interface choiceError {
  id: number;
  error: string;
}

const defaultQuestionType = { label: "Single Line", value: "SINGLE_LINE" };

const generateEmptyChoice = () => {
  return {
    id: getRandomNumber(100000),
    choice: "",
    isPrefered: false,
    error: "",
  };
};

const AddQuestionModal = (props: any) => {
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [question, setQuestion] = useState("");
  const [questionError, setQuestionError] = useState("");
  const [choices, setChoices] = useState<choiceType[]>([]);
  const [isMandatory, setIsMandatory] = useState(false);
  const [choicesError, setChoicesError] = useState<choiceError[]>([]);
  const [answer, setAnswer] = useState<number[]>([]);
  const [answerError, setAnswerError] = useState<string[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [finalQuestions, setFinalQuestions] = useState<any[]>([]);
  const [questionType, setQuestionType] = useState(defaultQuestionType);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(
    null
  );

  const showSnackAlert = UseToastAlert();
  const [templateName, setTemplateName] = useState("");
  const [isTemplate, setIsTemplate] = useState(false);
  const [isValid, setIsValid] = useState<any>(false);
  const [questionCount, setQuestionCount] = useState(0);
  const dispatch = useDispatch();
  const deleteTemplateData = useSelector(
    (state: any) => state.DeleteTemplateSlicex
  );
  const { deletetemplates, loading, error } = deleteTemplateData;
  useEffect(() => {
    if (deletetemplates.message) {
      if (deletetemplates.code == 200)
        showSnackAlert("success", deletetemplates.message);
      if (deletetemplates.code == 206)
        showSnackAlert("warning", deletetemplates.message);
      const input = {
        pageid: 0,
      };
      dispatch(GetQuestionTemplates(input));
    }
  }, [deletetemplates]);
  const { templates, loadingTemplate } = useSelector(
    (state: any) => state.GetTemplatesSlice
  );
  const { templatePost, loadingTemplatePost } = useSelector(
    (state: any) => state.PostTemplateSlice
  );
  const MAX_QUESTION = 5;

  const PostJob = useSelector((state: any) => state.PostJob);

  useEffect(() => {
    if (!loadingTemplatePost && templatePost.code == 200) {
      const input = {
        pageid: 0,
      };
      dispatch(GetQuestionTemplates(input));
    }
  }, [loadingTemplatePost]);

  useEffect(() => {
    if (PostJob?.res?.code === 200) {
      setQuestions([]);
      setFinalQuestions([]);
    }
  }, [PostJob?.res?.code]);

  const handleIsTemplate = () => {
    setIsTemplate(!isTemplate);
  };

  const handleDeleteAllQuestions = () => {
    setFinalQuestions([]);
    setQuestions([]);
    setQuestionCount(0);
  };

  const [showQuestionModal, setShowQuestionModal] = useState(false);

  const handleOpenQuestionModal = () => {
    setShowQuestionModal(!showQuestionModal);
    setQuestions(finalQuestions);
  };

  const handleCloseQuestionModal = () => {
    setQuestions([]);
    setQuestion("");
    setQuestionType(defaultQuestionType);
    setChoices([]);
    setIsMandatory(false);
    setShowQuestionModal(!showQuestionModal);
    setShowAddQuestion(false);
    setQuestionCount(finalQuestions.length);
    setEditingQuestionId(null);
    setIsTemplate(false);
  };

  const validateQuestion = (e: any) => {
    let isValid = true;
    if (!e.target.value.trim()) {
      setQuestionError("Field cannot be left empty.");
      isValid = false;
    } else {
      setQuestionError("");
    }
  };

  const validateChoices = (index: number) => {
    const item = choices[index];
    let newChoices = [...choices];
    if (!item?.choice.trim()) {
      newChoices[index].error = "Field cannot be left empty.";
    } else {
      newChoices[index].error = "";
    }
    setChoicesError(newChoices);
  };

  const validateForm = () => {
    let isValid = true;
    // Check question
    if (!question.trim()) {
      setQuestionError("Field cannot be left empty.");
      isValid = false;
    } else {
      setQuestionError("");
    }

    if (questionType.label !== "Single Line") {
      // Check choices
      let newChoices = [...choices];
      choices.map((choice, index) => {
        if (!choice.choice.trim()) {
          newChoices[index].error = "Field cannot be left empty.";
          isValid = false;
        } else {
          newChoices[index].error = "";
          isValid = true;
        }
        setChoicesError(newChoices);
      });
    }
    if (
      questions.filter((c) => c.question === question).length == 1 &&
      !editingQuestionId
    ) {
      showSnackAlert("warning", `Duplicate question not allowed.`);
      isValid = false;
    }
    return isValid;
  };

  const checkIsValid = () => {
    const isValid = validateForm();
    setIsValid(isValid);
    return isValid;
  };

  const handleSetIsMandatory = (event) => {
    setIsMandatory(event.target.checked);
  };

  const handlePromptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value);
    setTimeout(() => {
      validateQuestion(event);
    }, 0);
  };
  const handleQuestionTypeChange = (event: any) => {
    setQuestionType(event);
    setChoices([generateEmptyChoice(), generateEmptyChoice()]);
    setAnswer([]);
  };
  const handleChoiceChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number,
    type: string
  ) => {
    const newChoices = [...choices];

    let index = newChoices.findIndex((obj) => obj.id === id);
    switch (type) {
      case "choice":
        newChoices[index].choice = event.target.value;
        break;
      case "isPref":
        if (
          newChoices.filter((c) => c.isPrefered).length ==
          newChoices.length - 1 &&
          event.target.checked
        ) {
          return;
        }
        newChoices[index].isPrefered = event.target.checked;
        break;
    }
    setChoices(newChoices);
    if (type !== "isPref") {
      setTimeout(() => {
        validateChoices(index);
      }, 0);
    }
  };
  const handleAddChoice = () => {
    setChoices([...choices, generateEmptyChoice()]);
  };
  const handleRemoveChoice = (index: number) => {
    const newChoices = [...choices];
    newChoices.splice(index, 1);
    setChoices(newChoices);
  };

  const handleDeleteOfAddedQuestion = (id: number) => {
    setQuestionCount(questionCount - 1);
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const duplicateQuestion = (item: any) => {
    if (questionCount + 1 > MAX_QUESTION) {
      showSnackAlert("warning", `Maximum ${MAX_QUESTION} questions allowed.`);
      return;
    }
    setQuestionCount(questionCount + 1);
    setShowAddQuestion(true);
    setQuestion(item.question);
    setQuestionType({ label: item.type, value: item.type });
    setIsMandatory(item.isMandatory);
    setChoices(item.choices);
  };

  const handleAttachQuestions = () => {
    if (!questions?.length) {
      showSnackAlert("warning", `Please add at least one question.`);
      return;
    }
    const questionModel = questions?.map((c) => {
      return {
        id: c.id,
        qes: c.question,
        type: c.type,
        options: c.choices.map((d) => {
          return { value: d.choice, preferred: d.isPrefered };
        }),
        required: c.isMandatory,
      };
    });
    if (isTemplate && templateName) {
      const questionTempModel = questions.map((c) => {
        return {
          name: c.question,
          type: c.type,
          // type:"SINGLE_LINE",
          options: c?.choices?.map((d) => {
            return { val: d.choice, pref: d.isPrefered };
          }),
          required: c.isMandatory,
        };
      });
      const mdl = {
        name: templateName,
        questions: questionTempModel,
      };
      //call api for storing template
      dispatch(PostTemplate(mdl));
    }
    setFinalQuestions(questions);
    setShowQuestionModal(false);
    setTemplateName("");
    // setIsTemplate(false)
    setQuestions([]);
    props.values.questions = questionModel;
    setIsTemplate(false);
  };

  const handleEditQuestion = (question: any) => {
    setQuestion(question.question);
    setQuestionType(options?.find((c) => c.value == question.type));
    setChoices(question.choices);
    setAnswer(question.answer);
    setIsMandatory(question.isMandatory);
    setEditingQuestionId(question.id);
    setShowAddQuestion(true);
    setIsValid(false);
  };

  const handleShowQuestion = () => {
    if (questionCount + 1 > MAX_QUESTION) {
      showSnackAlert("warning", `Maximum ${MAX_QUESTION} questions allowed.`);
      return;
    }
    setQuestionCount(questionCount + 1);
    setShowAddQuestion(!showAddQuestion);
  };

  const handleExistingDelete = () => {
    setQuestionCount(questionCount - 1);
    setShowAddQuestion(false);
    setQuestion("");
    setChoices([]);
    setIsMandatory(false);
    setIsValid(false);
    setQuestionType(defaultQuestionType);
    setQuestionError("");
    setEditingQuestionId(null);
  };

  const addQuestion = () => {
    if (!checkIsValid()) {
      return true;
    }
    const newQuestion: any = {
      id: questions.length + 1,
      // prompt,
      question: question,
      type: questionType.value,
      choices: choices.slice(),
      isMandatory: isMandatory,
    };
    setQuestions([...questions, newQuestion]);
    setQuestion("");
    setQuestionType({ label: "Single Line", value: "SINGLE_LINE" });
    setChoices([]);
    setAnswer([]);
    setShowAddQuestion(false);
    setIsValid(false);
  };
  const editQuestion = () => {
    if (!checkIsValid()) {
      return true;
    }
    const editedQuestion: any = {
      id: editingQuestionId!,
      question: question,
      type: questionType.value,
      choices: choices,
      isMandatory: isMandatory,
    };
    const newQuestions = questions.map((question) => {
      if (question.id === editingQuestionId) {
        return editedQuestion;
      }
      return question;
    });
    setQuestions(newQuestions);
    setQuestion("");
    setQuestionType({ label: "Single Line", value: "SINGLE_LINE" });
    setChoices([]);
    setAnswer([]);
    setEditingQuestionId(null);

    setIsValid(false);
    setShowAddQuestion(false);
  };

  const handleTemplateClick = (questions: any) => {
    const questionsArray = questions?.questions?.map((c: any) => {
      return {
        question: c.name,
        type: c.type,
        choices: c?.opt?.map((d) => {
          return {
            id: d._id,
            choice: d.val,
            isPreffered: d.pref,
          };
        }),
        id: c._id,
        isMandatory: c.req,
      };
    });

    setQuestions(questionsArray);
  };

  const [filled, setFilled] = useState(false);

  const options: any = [
    { value: "MULTI_CHOICE", label: "Multi Choice" },
    { value: "SINGLE_CHOICE", label: "Single Choice" },
    { value: "SINGLE_LINE", label: "Single Line" },
  ];

  useEffect(() => {
    const input = {
      pageid: 0,
    };
    dispatch(GetQuestionTemplates(input));
  }, []);

  useEffect(() => {
    if (!loadingTemplate) {
    }
  }, [loadingTemplate, templates]);

  const [APIquestions, setAPIquestions] = useState<any>();
  useEffect(
    () => {
      if (props.values.Questions) {
        const data = props.values.Questions?.map((c) => {
          return {
            id: c.id,
            question: c.name,
            choices: c.options?.map((d) => {
              return {
                id: d._id,
                isPrefered: d.pref,
                choice: d.val,
              };
            }),
            isMandatory: c.required,
            type: c.type,
          };
        });
        setFinalQuestions(data);
        props.values.questions = data;
      }
    },
    // [loadingTemplate, templates ]
    // []
    [props.values.Questions]
  );
  const handleDeleteSwal = (del: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, You will not be able to recover this Record!",
      showCancelButton: true,
      confirmButtonColor: "#2a9f2a ",
      cancelButtonText: "No",
      cancelButtonColor: "#db1919",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteTemplate(del));
        const input = {
          pageid: 0,
        };
        dispatch(GetQuestionTemplates(input));
      }
    });
  };
  return (
    <>
      <div id="questions_bx" className="job-bx bg-white m-b30">
        <div className="row">
          {finalQuestions?.length ? (
            <div className="col-lg-12 col-md-12 d-flex align-items-center">
              <h5>Attached Questionnaire</h5>
              <div>
                <IconButton onClick={handleOpenQuestionModal}>
                  <BiEditAlt></BiEditAlt>
                </IconButton>
                <IconButton onClick={handleDeleteAllQuestions}>
                  <MdOutlineDeleteSweep></MdOutlineDeleteSweep>
                </IconButton>
              </div>
            </div>
          ) : (
            <div className="col-lg-12 col-md-12 textValue">
              <span>
                Ask questions to candidates they should respond to when they are
                applying
              </span>
              <br />
              <span>Here are a few suggestions to get you started</span>
            </div>
          )}
          <div className="col-lg-12 col-md-12">
            {finalQuestions.length > 0 ? (
              <div
                key={finalQuestions[0]._id}
                onClick={handleOpenQuestionModal}
              >
                <Chip
                  style={{ cursor: "pointer" }}
                  label={`${finalQuestions[0].question} ${finalQuestions.length > 1
                    ? `+ ${finalQuestions.length - 1}`
                    : ""
                    }`}
                  color="success"
                  variant="outlined"
                />
              </div>
            ) : (
              ""
            )}
          </div>
          {!finalQuestions.length && (
            <div className="col-lg-12 col-md-12">
              <Link
                to={""}
                onClick={handleOpenQuestionModal}
                style={{ fontWeight: 500 }}
              >
                Add Questions
              </Link>
            </div>
          )}
        </div>
      </div>

      <Modal
        show={showQuestionModal}
        backdrop="static"
        onHide={() => {
          setShowQuestionModal(false);
        }}
        className="addquestion modal browse-job fade modal-lg-bx-info editor"
      >
        <div className="" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <div className="modal-custom-header">
                <h5 className="modal-title" id="ResumeheadlineModalLongTitle">
                  Add Questions for candidates
                </h5>

                <button
                  type="button"
                  className="close"
                  onClick={() => {
                    handleCloseQuestionModal();
                  }}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <p className="modal-custom-desc">
                These questions will be asked to the candidates when they apply.
              </p>

              <div className="row">
                <div
                  className="col-md-8 col-lg-8 col-sm12"
                  style={{ height: "380px", overflowY: "auto" }}
                >
                  <div>
                    {showAddQuestion && (
                      <div className="browse-job job-bx bg-white m-b30 activeCardBorder">
                        <label htmlFor="questionType">Question Type</label>
                        <div className="row mb-2 align-items-center">
                          <div className="col-md-6">
                            <Select
                              id="questionType"
                              className="dropstyle"
                              value={questionType}
                              options={options}
                              onChange={(e: any) => {
                                handleQuestionTypeChange(e);
                              }}
                            />
                          </div>
                          <div
                            className="col-md-5"
                            style={{ marginTop: "-10px" }}
                          >
                            <div className="custom-control custom-checkbox">
                              <input
                                type="checkbox"
                                checked={isMandatory}
                                className="custom-control-input"
                                id={`chk_mandatory_${question}`}
                                onChange={(event) => {
                                  handleSetIsMandatory(event);
                                }}
                              />
                              <label
                                className="custom-control-label"
                                htmlFor={`chk_mandatory_${question}`}
                              >
                                Is Mandatory?
                              </label>
                            </div>
                          </div>
                          <div className="col-md-1">
                            <IconButton onClick={handleExistingDelete}>
                              <AiOutlineDelete />
                            </IconButton>
                          </div>
                        </div>

                        <div className="row mb-2">
                          <div className="col-md-12">
                            {/* <label htmlFor="prompt">Type your question</label>{" "} */}
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Type your question"
                              id="prompt"
                              value={question}
                              onChange={(e) => {
                                handlePromptChange(e);
                              }}
                              onBlur={(e) => {
                                handlePromptChange(e);
                              }}
                            />
                            {questionError && (
                              <span className="form-error">
                                {questionError}
                              </span>
                            )}
                          </div>
                        </div>

                        {questionType.label !== "Single Line" && (
                          <div>
                            <label>Add answer options</label>
                            {choices.map((choice, index) => (
                              <div
                                key={choice.id}
                                className="row align-items-center"
                              >
                                <div className="col-md-6 mb-2">
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={choice.choice}
                                    onChange={(event) =>
                                      handleChoiceChange(
                                        event,
                                        choice.id,
                                        "choice"
                                      )
                                    }
                                    onBlur={(event) => {
                                      handleChoiceChange(
                                        event,
                                        choice.id,
                                        "choice"
                                      );
                                    }}
                                  />
                                  {choice.error && (
                                    <span className="form-error">
                                      {choice.error}
                                    </span>
                                  )}
                                </div>
                                <div className="col-md-5">
                                  <div className="custom-control custom-checkbox">
                                    <input
                                      type="checkbox"
                                      checked={choice.isPrefered}
                                      className="custom-control-input"
                                      id={`chkip_${choice.id}`}
                                      onChange={(event) => {
                                        handleChoiceChange(
                                          event,
                                          choice.id,
                                          "isPref"
                                        );
                                      }}
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor={`chkip_${choice.id}`}
                                    >
                                      Is Preffered?
                                    </label>
                                  </div>
                                </div>
                                {choices.length > 2 && (
                                  <>
                                    <div className="col-md-1">
                                      <IconButton
                                        onClick={() =>
                                          handleRemoveChoice(index)
                                        }
                                      >
                                        <AiOutlineCloseCircle />
                                      </IconButton>
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}{" "}
                            <Link to={""} onClick={handleAddChoice}>
                              Add other options
                            </Link>
                          </div>
                        )}
                        {editingQuestionId !== null ? (
                          <button className="btn btn-sm" onClick={editQuestion}>
                            Edit Question
                          </button>
                        ) : (
                          <button className="btn btn-sm" onClick={addQuestion}>
                            Add Question
                          </button>
                        )}
                      </div>
                    )}

                    {questions?.map((question, index) => (
                      <div
                        key={question.id}
                        className="job-bx bg-white m-b20 mt-2"
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <strong>
                              {index + 1}. {question.question}
                            </strong>{" "}
                            <span style={{ color: "red" }}>
                              {question.isMandatory ? "*" : ""}
                            </span>
                          </div>
                          <div>
                            <IconButton
                              title="Edit"
                              onClick={() => handleEditQuestion(question)}
                              className="font18"
                            >
                              <BiEdit />
                            </IconButton>
                            <IconButton
                              title="Duplicate"
                              onClick={() => {
                                !showAddQuestion && duplicateQuestion(question);
                              }}
                              className="font18"
                            >
                              <MdControlPointDuplicate />
                            </IconButton>
                            <IconButton
                              title="Delete"
                              onClick={() =>
                                handleDeleteOfAddedQuestion(question.id)
                              }
                              className="font18"
                            >
                              {" "}
                              <AiOutlineDelete />
                            </IconButton>
                          </div>
                        </div>
                        <div>
                          {question.type !== "SINGLE_LINE" ? (
                            <ul style={{ listStyle: "none" }}>
                              {question.choices.map((c) => (
                                <li key={c.id}>
                                  {
                                    <div
                                      className={
                                        question.type == "SINGLE_CHOICE"
                                          ? "custom-control custom-radio"
                                          : "custom-control custom-checkbox"
                                      }
                                    >
                                      <input
                                        type={
                                          question.type == "SINGLE_CHOICE"
                                            ? "radio"
                                            : question.type == "MULTI_CHOICE"
                                              ? "checkbox"
                                              : ""
                                        }
                                        checked={false}
                                        className="custom-control-input"
                                      />
                                      <label className="custom-control-label">
                                        {c.choice}
                                      </label>
                                      <span className="ml-2">
                                        {c.isPrefered ? (
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
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Type your answer."
                              disabled
                            />
                          )}
                        </div>
                      </div>
                    ))}

                    <hr></hr>
                    <button
                      className="btn btn-sm"
                      disabled={showAddQuestion}
                      onClick={handleShowQuestion}
                    >
                      Add Question
                    </button>
                  </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm12">
                  <div>
                    <h6>Saved Templates</h6>
                  </div>
                  <div style={{ height: "380px", overflowY: "auto" }}>
                    {templates?.data?.template?.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          handleTemplateClick(c);
                        }}
                        className="c_pointer job-bx bg-white mt-2 ml-2 mr-2 m-b20 d-flex p-10 flex-column"
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span className="templateName">{c.name}</span>
                          <IconButton
                            title="Delete template"
                            onClick={() => {
                              handleDeleteSwal(c.template_id);
                            }}
                            style={{ marginLeft: "auto" }}
                          >
                            <i className="ti-trash"></i>
                          </IconButton>
                        </div>

                        {c.questions?.length > 0 ? (
                          <div key={c?.questions[0]._id}>
                            <Chip
                              style={{ cursor: "pointer" }}
                              label={`${c?.questions[0].name} ${c.questions.length > 1
                                ? `+ ${c?.questions.length - 1}`
                                : ""
                                }`}
                              color="success"
                              variant="outlined"
                            />
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-custom-footer">
                <button
                  type="submit"
                  onClick={handleAttachQuestions}
                  className="site-button btn-sm"
                >
                  Attach Questions
                </button>
                {isTemplate ? (
                  <input
                    type="text"
                    placeholder="Type template name"
                    value={templateName}
                    onChange={(e) => {
                      setTemplateName(e.target.value);
                    }}
                    className="form-control w-50"
                  />
                ) : (
                  <Link to={""} onClick={handleIsTemplate}>
                    Save as Template
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddQuestionModal;
