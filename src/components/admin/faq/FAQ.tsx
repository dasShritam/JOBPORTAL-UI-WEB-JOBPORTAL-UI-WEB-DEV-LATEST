import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import * as Yup from "yup";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@material-ui/core/IconButton";

import Typography from "@mui/material/Typography";
import Select from "react-select";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import "../../../assets/customCss/jobs/manage-jobs.css";
import { MdDeleteOutline } from "react-icons/md";
import ReactQuill from "react-quill";
import { Formik } from "formik";
import { Accordion } from "react-bootstrap";
import { customStyles } from "../../../common/common";
import { Avatar, Chip, Stack } from "@mui/material";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Swal from "sweetalert2";
import "../../../assets/customCss/jobs/manage-jobs.css";
import { useDispatch, useSelector } from "react-redux";
import { HiThumbDown, HiThumbUp } from "react-icons/hi";
import "../../../assets/customCss/faq.css";

import {
  deleteFaqData,
  fetchFaq,
  postFaqData,
  resetDeleteFaq,
  resetPostFaq,
  resetUpdateFaq,
  updateFaqData,
} from "../../../redux/features/admin/faq/FaqSlice";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import Faq_sk from "./Faq_sk";
import "../../../assets/customCss/Pagination.css";
import "../../../assets/customCss/faq.css";
import { jobSeekerProfileMasterData } from "../../../redux/features/masterData/MasterDataInfoSlice";
import Pagination from "rc-pagination";
import "../../../assets/customCss/faq.css";

import { BiEditAlt } from "react-icons/bi";
import { BsEye } from "react-icons/bs";
var notfoundImg = require("../../../assets/images/background/No-record.png");

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const INITIAL_FORM_STATE = {
  question: "",
  category: "",
  answer: "",
  tag: [],
};

const FORM_VALIDATION = Yup.object().shape({
  question: Yup.string().required("Please enter Question."),
  category: Yup.object().required("Please select Category.").nullable(),
  answer: Yup.string().required("Please enter Answer."),
  tag: Yup.array().notRequired(),
});

function FAQ() {
  const sklArray = [1, 2, 3, 4, 5];
  const [hideSave, setHideSave] = useState(true);
  const [faqid, setFaqid] = useState("");
  const [updateFaq, setUpdateFaq] = useState(false);
  const [inpTag, setInpTag] = useState("");
  const [chipKeyValues, setChipKeyValues] = useState<string[]>([]);
  const [count, setCount] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [faqQuestions, setFaqQuestions] = useState<any[]>([]);
  const [categoryOpt, setCategoryOpt] = useState<any>([]);
  const [currentpage, setCurrentPage] = useState(1);
  const [postData, setPostData] = useState<any>([]);
  const [perPage, setPerPage] = useState(10);
  const [size, setSize] = useState(perPage);
  const formikRef = useRef<any>();
  const [answerErr, setAnswerErr] = useState(false);

  const showSnackAlert = UseToastAlert();
  const dispatch = useDispatch(),
    postFaqDatas = useSelector((state: any) => state.postFAQData),
    { allPostFaq, allPostFaqLoading } = postFaqDatas,
    fetchFaqData = useSelector((state: any) => state.fetchFAQData),
    { allFetchFaq, fetchFaqLoading } = fetchFaqData,
    deleteFaqDatas = useSelector((state: any) => state.deleteFAQData),
    { deleteFaq, deleteFaqLoading } = deleteFaqDatas,
    updateFaqDatas = useSelector((state: any) => state.updateFAQData),
    { updateAllFaq, updateAllFaqLoading } = updateFaqDatas,
    categoryData = useSelector((state: any) => state.jobSeekerMasterData),
    { JSMasterData, loading } = categoryData;

  useEffect(() => {
    const masterDataObj = [
      {
        group: "TTYPE",
        active: 1,
      },
    ];
    dispatch(fetchFaq(fetchData));
    dispatch(jobSeekerProfileMasterData(masterDataObj));
  }, []);

  useEffect(() => {
    if (JSMasterData) {
      JSMasterData?.map((opt: any) => {
        if (opt.group === "TTYPE") {
          setCategoryOpt([
            ...opt.data.map((item: any) => {
              return { value: item.id, label: item.value };
            }),
          ]);
        }
      });
    }
  }, [JSMasterData]);

  const fetchData = {
    faqId: null,
    question: "",
    category: "",
    tag: [],
    pageId: currentpage,
  };

  useEffect(() => {
    if (allFetchFaq) {
      setFaqQuestions(allFetchFaq?.res);
    }
  }, [allFetchFaq]);

  useEffect(() => {
    if (!allPostFaqLoading && allPostFaq?.code == 200) {
      showSnackAlert("success", allPostFaq.message);
      handleClose();
      setUpdateFaq(false);
      handleClosePreview();
      dispatch(fetchFaq(fetchData));
      dispatch(resetPostFaq());
    } else if (!allPostFaqLoading && allPostFaq?.response?.data?.code === 400) {
      showSnackAlert("warning", allPostFaq?.response?.data?.message);
      handleClosePreview();
      dispatch(resetPostFaq());
    }
  }, [allPostFaq]);

  useEffect(() => {
    if (updateAllFaq?.code === 200) {
      showSnackAlert("success", updateAllFaq?.message);
      handleClose();
      handleClosePreview();
      dispatch(fetchFaq(fetchData));
      dispatch(resetUpdateFaq());
    } else if (updateAllFaq?.response?.data?.code === 400) {
      showSnackAlert("warning", updateAllFaq?.response?.data?.message);
      handleClosePreview();
      dispatch(resetUpdateFaq());
    } else if (updateAllFaq?.response?.data?.code === 500) {
      showSnackAlert("warning", updateAllFaq?.response?.data?.message);
      handleClosePreview();
      dispatch(resetUpdateFaq());
    }
  }, [updateAllFaq]);

  useEffect(() => {
    if (!deleteFaqLoading && deleteFaq?.code === 200) {
      showSnackAlert("success", deleteFaq?.message);
      dispatch(
        fetchFaq({
          faqId: null,
          question: "",
          category: "",
          tag: [],
          pageId: currentpage,
        })
      );
      dispatch(resetDeleteFaq());
    } else if (!deleteFaqLoading && deleteFaq?.response?.data?.code === 400) {
      showSnackAlert("warning", deleteFaq?.response?.data?.message);
      dispatch(resetDeleteFaq());
    }
  }, [deleteFaq]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {}, [allFetchFaq]);
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
    "video",
  ];

  interface ChipData {
    key: number;
    label: string;
  }
  const [chipData, setChipData] = useState<string[]>([]);

  const handleDelete = (chipToDelete: any) => () => {
    setChipData((chips) => chips.filter((chip) => chip !== chipToDelete));
    const deletedChip = chipToDelete;
    const updatedKeyValues = chipKeyValues.filter(
      (chip) => chip !== deletedChip
    );
    setChipKeyValues(updatedKeyValues);
  };

  const handleEnterKey = (e: any) => {
    const text = e?.target?.value;
    if (text) {
      if (chipData?.includes(text)) {
        setInpTag("");
        return;
      } else {
        setChipData([...chipData, text]);
        setInpTag("");
      }
    }
  };

  // Preview Modal
  const [openPreview, setopenPreview] = React.useState(false);
  const [scroll, setScroll] = React.useState<DialogProps["scroll"]>("paper");

  const handleClosePreview = () => {
    setopenPreview(false);
  };

  const answerElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (openPreview) {
      const { current: answerElement } = answerElementRef;
      if (answerElement !== null) {
        answerElement.focus();
      }
    }
  }, [openPreview]);
  // Preview Modal end

  function handleDeleteSwal(id: any) {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this record!",
      showCancelButton: true,
      confirmButtonColor: "#2a9f2a ",
      cancelButtonColor: "#db1919 ",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteFaqData(id));
      }
    });
  }

  // Pagination

  const PerPageChange = (value: any) => {
    setSize(value);
    if (postData) {
      Math.ceil(postData?.length / value);
    }
  };

  const PrevNextArrow = (current: any, type: any, originalElement: any) => {
    if (type === "prev") {
      return (
        <button
          title="prev"
          className="previous"
          style={{ borderColor: "#eae6e6", borderRadius: "2px" }}
        >
          <i className="ti-arrow-left"></i> Prev
        </button>
      );
    }

    if (type === "next") {
      return (
        <button
          title="next"
          style={{ borderColor: "#eae6e6", borderRadius: "2px" }}
          className="pagination"
        >
          Next <i className="ti-arrow-right"></i>
        </button>
      );
    }

    return originalElement;
  };

  const PaginationChange = (page: any, pageSize: any) => {
    setCurrentPage(page);
    setSize(pageSize);
    const fetchData = {
      faqId: null,
      question: "",
      category: "",
      tag: [],
      pageId: page,
    };
    dispatch(fetchFaq(fetchData));
  };

  return (
    <>
      <Formik
        initialValues={{
          ...INITIAL_FORM_STATE,
        }}
        validationSchema={FORM_VALIDATION}
        onSubmit={(values: any) => {}}
        innerRef={formikRef}
      >
        {(formik: any) => {
          const {
            setFieldValue,
            handleSubmit,
            values,
            touched,
            errors,
            handleChange,
            handleBlur,
          } = formik;

          const editHandler = (e: any, index: number) => {
            e.preventDefault();

            allFetchFaq?.res[index]?.question
              ? setFieldValue("question", allFetchFaq?.res[index]?.question)
              : setFieldValue("question", "");

            allFetchFaq?.res[index]?.category
              ? setFieldValue("category", {
                  label: allFetchFaq?.res[index]?.category,
                  value: allFetchFaq?.res[index]?.category,
                })
              : setFieldValue("category", "");

            allFetchFaq?.res[index]?.answer
              ? setFieldValue("answer", allFetchFaq?.res[index]?.answer)
              : setFieldValue("answer", "");

            setChipData(allFetchFaq?.res[index]?.tags);
            setCount(allFetchFaq?.res[index]?.question?.length);
          };

          return (
            <>
              <div className="page-content bg-white">
                <div className="content-block">
                  <div className="browse-job section-full bg-white p-t50 p-b20">
                    <div className="container m-b30 mt-5">
                      <div className="job-bx clearfix">
                        <div className="job-bx-title NativeTitle clearfix">
                          <div className="d-flex justify-content-between">
                            <div>
                              <h5 className="font-weight-700 pull-left text-uppercase">
                                <a href="/public/faq" target="_blank">
                                  {" "}
                                  Frequently Asked Questions (FAQ)
                                </a>
                              </h5>
                            </div>

                            <div className="float-right p-tb5 p-r20">
                              <Stack direction="row" spacing={1}>
                                <Chip
                                  label={
                                    <span className="custom-job-content text-bold">
                                      Total FAQ
                                    </span>
                                  }
                                  avatar={
                                    <Avatar
                                      className="btn site-button btn-sm "
                                      style={{
                                        color: "white",
                                        backgroundColor: "blue",
                                      }}
                                    >
                                      {allFetchFaq?.totalCount
                                        ? allFetchFaq?.totalCount
                                        : "0"}
                                    </Avatar>
                                  }
                                />
                              </Stack>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                            <div className="float-right p-tb5">
                              <button
                                type="button"
                                style={{
                                  marginRight: "20px",
                                }}
                                className="site-button add-btn button-sm float-right"
                                onClick={(e: any) => {
                                  formik.resetForm();
                                  handleClickOpen();
                                  setFieldValue("answer", "");
                                  values.answer = "";
                                  values.category = "";
                                  values.question = "";
                                  setChipData([]);
                                }}
                              >
                                Post FAQ
                              </button>
                            </div>
                          </div>
                        </div>
                        <br />
                        <div className="post-job-bx browse-job-grid row">
                          {fetchFaqLoading &&
                            sklArray?.map((e) => {
                              return <Faq_sk />;
                            })}
                          {!fetchFaqLoading &&
                            faqQuestions?.map((item: any, index: any) => {
                              return (
                                <div className="col-lg-12 col-md-12">
                                  <div
                                    id="job_req_bx"
                                    className="job-bx bg-white m-b20"
                                  >
                                    <div className="row">
                                      <div className="col-lg-9 col-md-9 col-sm-12 ">
                                        <p
                                          style={{
                                            marginTop: "10px",
                                            fontSize: "13px",
                                            display: "inline-block",
                                            fontWeight: 600,
                                            wordBreak: "break-all",
                                          }}
                                        >
                                          {`${
                                            currentpage > 1
                                              ? index +
                                                1 +
                                                (currentpage - 1) * 10
                                              : index + 1
                                          }. `}{" "}
                                          {item?.question}
                                        </p>
                                      </div>
                                      <div className="col-lg-3 col-md-3 col-sm-12">
                                        <div className="float-right">
                                          <div className="d-flex justify-content-between">
                                            <IconButton
                                              title="edit"
                                              onClick={(e: any) => {
                                                editHandler(e, index);
                                                setFaqid(item.faqId);
                                                handleClickOpen();
                                                setUpdateFaq(true);
                                              }}
                                            >
                                              <BiEditAlt
                                                style={{
                                                  color: "#2e55fa",
                                                  fontSize: "17px",
                                                }}
                                              ></BiEditAlt>
                                            </IconButton>{" "}
                                            <IconButton
                                              title="preview"
                                              onClick={(e: any) => {
                                                setopenPreview(true);
                                                editHandler(e, index);
                                                setHideSave(false);
                                              }}
                                            >
                                              <BsEye
                                                style={{
                                                  color: "#353131",
                                                  fontSize: "17px",
                                                }}
                                              />
                                            </IconButton>{" "}
                                            <IconButton
                                              title="delete"
                                              onClick={() => {
                                                handleDeleteSwal(item?.faqId);
                                              }}
                                            >
                                              <MdDeleteOutline
                                                style={{
                                                  color: "#e53232",
                                                  fontSize: "17px",
                                                }}
                                              />
                                            </IconButton>
                                            <div
                                              style={{
                                                marginTop: "11px",
                                                marginLeft: "11px",
                                              }}
                                            >
                                              <HiThumbUp
                                                style={{
                                                  color: "green",
                                                  fontSize: "17px",
                                                }}
                                              ></HiThumbUp>{" "}
                                              <span
                                                style={{
                                                  fontSize: "15px",
                                                }}
                                              >
                                                {item?.upVote}
                                              </span>
                                            </div>
                                            <div
                                              style={{
                                                marginTop: "11px",
                                                marginLeft: "11px",
                                              }}
                                            >
                                              <HiThumbDown
                                                style={{
                                                  color: "#fb2c2c",
                                                  fontSize: "17px",
                                                }}
                                              ></HiThumbDown>{" "}
                                              <span
                                                style={{
                                                  fontSize: "15px",
                                                }}
                                              >
                                                {item?.downVote}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}

                          {allFetchFaq?.res &&
                            allFetchFaq?.res?.length === 0 && (
                              <div
                                className="col-lg-12"
                                style={{
                                  textAlign: "center",
                                }}
                              >
                                {" "}
                                <img
                                  style={{
                                    width: "35%",
                                  }}
                                  src={notfoundImg}
                                  alt=""
                                />{" "}
                                <h6
                                  style={{
                                    fontSize: "13px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {" "}
                                  Oops no questions found.{" "}
                                </h6>
                              </div>
                            )}

                          {allFetchFaq?.res &&
                            allFetchFaq?.res?.length !== 0 && (
                              <div className="pagination-bx float-right m-b30 m-t20 ml-auto ">
                                <div className="pagination">
                                  <Pagination
                                    className="pagination-data float-right "
                                    onChange={PaginationChange}
                                    total={allFetchFaq?.totalCount}
                                    current={currentpage}
                                    pageSize={size}
                                    showSizeChanger={true}
                                    itemRender={PrevNextArrow}
                                    onShowSizeChange={PerPageChange}
                                  />
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Full Screen Modal */}
              <form action="">
                <div>
                  <Dialog
                    fullScreen
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={Transition}
                  >
                    <AppBar sx={{ position: "relative" }}>
                      <Toolbar>
                        <Typography
                          sx={{ ml: 2, flex: 1 }}
                          variant="h6"
                          component="div"
                        >
                          Post FAQ
                        </Typography>
                        <Button
                          autoFocus
                          color="inherit"
                          type="submit"
                          onClick={(e: any) => {
                            handleSubmit();

                            if (
                              values?.question?.length > 0 &&
                              values?.category?.label?.length > 0 &&
                              values?.answer?.length > 0 &&
                              values?.answer !== "<p><br></p>"
                            ) {
                              setAnswerErr(false);
                              setopenPreview(true);
                            } else if (values?.answer === "<p><br></p>") {
                              setAnswerErr(true);
                            }
                          }}
                        >
                          Preview
                        </Button>{" "}
                        &nbsp; &nbsp; &nbsp; &nbsp;
                        <IconButton
                          edge="start"
                          color="inherit"
                          onClick={() => {
                            handleClose();
                            formik.resetForm();
                            setUpdateFaq(false);
                          }}
                          aria-label="close"
                          style={{ color: "red" }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Toolbar>
                    </AppBar>
                    <div className="row" style={{ width: "100%" }}>
                      <div className="col-xl-5 col-lg-5 col-md-5 col-sm-12 m-t50 m-l50 custom_quesDiv ">
                        <aside
                          id="accordion1"
                          className="sidebar-filter bg-white"
                        >
                          <Accordion defaultActiveKey="0">
                            <div>
                              <div
                                className="container"
                                style={{
                                  minHeight: "450px",
                                }}
                              >
                                <div className="row">
                                  <div className="col-lg-12 col-md-12">
                                    <div className="form-group">
                                      <label
                                        style={{
                                          marginTop: "50px",
                                        }}
                                      >
                                        Question
                                      </label>{" "}
                                      &nbsp;
                                      <span
                                        style={{
                                          color: "red",
                                        }}
                                      >
                                        *
                                      </span>
                                      <textarea
                                        className="form-control"
                                        name="question"
                                        value={values.question}
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                          setCount(e.target.value.length);
                                          handleChange(e);
                                        }}
                                        maxLength={200}
                                        style={{
                                          resize: "none",
                                          height: "130px",
                                        }}
                                        placeholder="Type Question"
                                      ></textarea>
                                      <span
                                        className=""
                                        style={{
                                          display: "inline-block",
                                          fontSize: "0.85em",
                                          color: "grey",
                                        }}
                                      >
                                        {count === 200 ? (
                                          <span className="text-yellow">
                                            You have exceeded the question
                                            limit.
                                          </span>
                                        ) : (
                                          `${200 - count} Character(s) left`
                                        )}
                                      </span>
                                      {formik.touched.question &&
                                      formik.errors.question ? (
                                        <p className="form-error">
                                          {formik.errors.question}
                                        </p>
                                      ) : null}
                                    </div>
                                  </div>
                                  <div className="col-lg-12 col-md-12">
                                    <div className="form-group">
                                      <label>Category</label> &nbsp;
                                      <span
                                        style={{
                                          color: "red",
                                        }}
                                      >
                                        *
                                      </span>
                                      <Select
                                        className="dropstyle"
                                        placeholder="Select Category"
                                        isSearchable={true}
                                        isClearable={true}
                                        isDisabled={false}
                                        name="category"
                                        styles={customStyles}
                                        value={values.category}
                                        options={categoryOpt}
                                        onChange={(e: any) => {
                                          setFieldValue("category", e);
                                        }}
                                      />
                                      {formik.touched.category &&
                                      formik.errors.category ? (
                                        <p className="form-error">
                                          {formik.errors.category}
                                        </p>
                                      ) : null}
                                    </div>
                                  </div>
                                  <div className="col-lg-12 col-md-12">
                                    <div className="form-group">
                                      <label>Tag</label>{" "}
                                      <input
                                        type="text"
                                        className="form-control tags_input mb-2"
                                        maxLength={150}
                                        name="tag"
                                        placeholder="Enter tag (You can add multiple tags by clicking enter.)"
                                        onChange={(e) => {
                                          formik.handleChange(e);
                                        }}
                                        value={values.tag}
                                        onKeyUp={(event) => {
                                          event.preventDefault();

                                          if (event.key === "Enter") {
                                            handleEnterKey(event);
                                            setFieldValue("tag", []);
                                          }
                                        }}
                                      />
                                      {chipData?.map((data) => {
                                        return (
                                          <Chip
                                            label={data}
                                            onDelete={handleDelete(data)}
                                            color="primary"
                                            variant="outlined"
                                          />
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Accordion>
                        </aside>
                      </div>
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 m-t50 m-l30">
                        <aside
                          id="accordion1"
                          className="sidebar-filter bg-white"
                        >
                          <Accordion defaultActiveKey="0">
                            <div>
                              <div
                                className="container"
                                style={{
                                  minHeight: "450px",
                                }}
                              >
                                <div>
                                  <div className="col-lg-12 col-md-12">
                                    <div className="form-group">
                                      <label
                                        style={{
                                          marginTop: "50px",
                                        }}
                                      >
                                        Answer
                                      </label>{" "}
                                      &nbsp;
                                      <span
                                        style={{
                                          color: "red",
                                        }}
                                      >
                                        *
                                      </span>
                                      <div>
                                        <ReactQuill
                                          id="reactquill"
                                          value={values.answer}
                                          onChange={(e: any) => {
                                            setFieldValue("answer", e);
                                            e?.target?.value === ""
                                              ? setFieldValue("answer", "") &&
                                                setAnswerErr(true)
                                              : setFieldValue("answer", e) &&
                                                setAnswerErr(false);
                                          }}
                                          modules={modules}
                                          formats={formats}
                                          placeholder="Type here..."
                                        />
                                        {formik.errors.answer &&
                                          formik.touched.answer && (
                                            <p
                                              className="form-error"
                                              style={{
                                                marginTop: "90px",
                                              }}
                                            >
                                              {formik.errors.answer}
                                            </p>
                                          )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {!formik.errors.answer && answerErr && (
                                  <p className="form-error ml-2">
                                    Please enter Answer.
                                  </p>
                                )}
                              </div>
                            </div>
                          </Accordion>
                        </aside>
                      </div>
                    </div>
                  </Dialog>
                </div>
              </form>

              {/* Preview Popup Modal */}
              <div>
                <Dialog
                  open={openPreview}
                  scroll={scroll}
                  aria-labelledby="dialog-title"
                  aria-describedby="dialog-description"
                >
                  <DialogTitle id="scroll-dialog-title">Preview</DialogTitle>
                  <DialogContent dividers={scroll === "paper"}>
                    <DialogContentText
                      style={{
                        minHeight: "400px",
                        minWidth: "500px",
                      }}
                      id="scroll-dialog-description"
                      ref={answerElementRef}
                      tabIndex={-1}
                    >
                      <b>{values.question}</b>
                      <br />
                      <div
                        dangerouslySetInnerHTML={{
                          __html: values.answer,
                        }}
                      ></div>
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={(e: any) => {
                        handleClosePreview();
                        setHideSave(true);
                      }}
                    >
                      Close
                    </Button>
                    {hideSave && (
                      <Button
                        onClick={(e: any) => {
                          if (updateFaq) {
                            const updateData = {
                              faqId: faqid,
                              question: values.question,
                              category: values.category?.label,
                              tag: chipData,
                              answer: values.answer,
                            };
                            dispatch(updateFaqData(updateData));
                          } else {
                            const postData = {
                              question: values.question,
                              category: values.category.label,
                              tag: chipData,
                              answer: values.answer,
                            };
                            dispatch(postFaqData(postData));
                          }
                        }}
                      >
                        Save
                      </Button>
                    )}
                  </DialogActions>
                </Dialog>
              </div>
            </>
          );
        }}
      </Formik>
    </>
  );
}

export default FAQ;
