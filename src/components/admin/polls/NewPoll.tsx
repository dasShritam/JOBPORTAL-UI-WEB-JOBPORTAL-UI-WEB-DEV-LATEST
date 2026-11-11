import React, { useEffect, useState, useRef } from "react";
import { Modal } from "react-bootstrap";
import { AiOutlineEye } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Link, TextField, Tooltip } from "@mui/material";
import * as Yup from "yup";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";

import {
  createComment,
  deleteComment,
  fetchComment,
  resetcreateComment,
  updateComment,
} from "../../../redux/features/employer/commentslice";
import { Formik, FormikProps, useFormik } from "formik";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import {
  GetPolls,
  PostPoll,
  resetPostPollSlice,
} from "../../../redux/features/admin/polls/ManagePollsSlice";
import Swal from "sweetalert2";
import "../../../assets/customCss/polls/PollPreview.css";
import { BsInfoCircle } from "react-icons/bs";

interface ListItem {
  id: number;
  name: string;
}
interface ColourOption {
  label: string;
  value: string;
}
interface poll {
  title: string;
  startDate: any;
  description: string;
  endDate: any;
  accessible: { label: string; value: string } | null;
  options: string;
}
function ViewPoll(item: any) {
  const dispatch = useDispatch();
  const [list, setList] = useState<ListItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingItemName, setEditingItemName] = useState("");
  const [optionsErr, setOptionsErr] = useState(false);
  const [multiOptionErr, setMultiOptionErr] = useState(false);
  const showSnackAlert = UseToastAlert();
  const [walkindateError, setWalkindateError] = useState("");
  const [endDateTime, setEndDate] = useState<any>(null);
  const IntialValueForm: poll = {
    title: "",
    startDate: null,
    description: "",
    endDate: null,
    accessible: null,
    options: "",
  };

  const FORM_VALIDATION = Yup.object().shape({
    title: Yup.string()
      .required("Please enter Poll Title.")
      .nullable()
      .trim("Empty space not allowed."),
    startDate: Yup.date().required("Please enter Active From Date.").nullable(),
    description: Yup.string()
      .required("Please enter Description.")
      .nullable()
      .trim("Empty space not allowed."),
    endDate: Yup.string().required("Please enter Active Till Date.").nullable(),
    accessible: Yup.array().required("Please enter Visibility.").nullable(),
    options: Yup.string().notRequired(),
  });
  const handleAddItem = () => {
    if (newItemName.trim() !== "") {
      const newItem: ListItem = { id: Date.now(), name: newItemName };
      setList([...list, newItem]);
      setNewItemName("");
    }
  };
  const postpoll = useSelector((state: any) => state?.postPollx);
  const { PostPollArray, PostPollLoading } = postpoll;

  useEffect(() => {
    if (PostPollArray?.code === 200 && !PostPollLoading) {
      showSnackAlert("success", PostPollArray.message);
      dispatch(resetPostPollSlice());
      formikRef.current.resetForm();
      dispatch(
        GetPolls({
          pollId: "",
          pageid: 1,
          pageLimit: 10,
        })
      );
      setList([]);
    } else if (PostPollArray?.code === 400 && !PostPollLoading) {
      showSnackAlert("warning", PostPollArray?.message);
      dispatch(resetPostPollSlice());
    }
  }, [PostPollArray, PostPollLoading]);

  const handleEditItem = (id: number, newName: string) => {
    const updatedList = list.map((item) => {
      if (item.id === id) {
        return { ...item, name: newName };
      } else {
        return item;
      }
    });
    setList(updatedList);
    setEditingItemId(null);
    setEditingItemName("");
  };
  const handleDeleteItem = (id: number) => {
    const updatedList = list.filter((item) => item.id !== id);
    setList(updatedList);
  };
  const formikRef = useRef<any>();
  const handleAddSwal = (startDate: any, endDate: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once poll added You will not be able to edit this Record!",
      showCancelButton: true,
      confirmButtonColor: "#2a9f2a ",
      cancelButtonColor: "#db1919 ",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        const obj: any = {
          description: formikRef.current.values.description,
          options: formikRef.current.values.options,
          title: formikRef.current.values.title,
          accessible: formikRef.current.values.accessible.map(
            (acc) => acc.value
          ),
        };

        if (
          formikRef.current.values.startDate !== null &&
          formikRef.current.values.endDate !== null &&
          formikRef.current?.values.accessible != null
        ) {
          obj.startDate =
            Date.parse(formikRef.current.values?.startDate) / 1000;
          obj.endDate = Math.floor(endDateTime.getTime()) / 1000;
          obj.options = list.map((e) => e.name);
        }
        obj.pollType = "Single Line";
        dispatch(PostPoll(obj));
      }
    });
  };

  const oftenVoteoption: ColourOption[] = [
    {
      label: "JOBSEEKER",
      value: "JOBSEEKER",
    },
    { label: "EMPLOYER ADMINISTRATOR", value: "EMPLOYER ADMINISTRATOR" },
    { label: "RECRUITER", value: "RECRUITER" },
  ];
  return (
    <>
      <Formik
        initialValues={{ ...IntialValueForm }}
        validationSchema={FORM_VALIDATION}
        enableReinitialize={true}
        innerRef={formikRef}
        onSubmit={(values, { resetForm }) => {
          if (
            formikRef?.current?.values?.startDate <
            formikRef?.current?.values?.endDate
          )
            handleAddSwal(values.startDate, values.endDate);
        }}
      >
        {(formik: any) => {
          const {
            values,
            resetForm,
            handleChange,
            handleSubmit,
            setFieldValue,
            setFieldError,
            errors,
            touched,
            handleBlur,
            isValid,
            dirty,
          } = formik;

          return (
            <>
              <h5 className="font-weight-700 text-uppercase">Add New poll</h5>
              <br />
              <div className="" id="headingjas ">
                <div className="d-flex ">
                  <p className="modal-custom-desc">
                    Add details of Polls you want to publish.
                  </p>
                </div>
                <form>
                  <div className="row">
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group">
                        <label>Poll Title</label>
                        <span style={{ color: "red" }}>*</span>
                        <input
                          name="title"
                          type="text"
                          value={values.title}
                          className="form-control"
                          maxLength={40}
                          placeholder="Enter Title"
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                        {errors.title && touched.title ? (
                          <p className="form-error">{errors.title}</p>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                      <div className="form-group ">
                        <label>Question</label>
                        <span style={{ color: "red" }}>*</span>
                        <input
                          name="description"
                          className="form-control"
                          maxLength={250}
                          value={values.description}
                          placeholder="Enter Question"
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                        {errors.description && touched.description ? (
                          <p className="form-error">{errors.description}</p>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12">
                      <label>Options</label>
                      <span style={{ color: "red" }}>*</span>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                      <div className="d-flex">
                        <input
                          max={6}
                          min={2}
                          maxLength={25}
                          minLength={2}
                          autoComplete="off"
                          type="text"
                          value={newItemName}
                          onChange={(e) => {
                            setOptionsErr(false);
                            setNewItemName(e.target.value);
                          }}
                          className="form-control comsection"
                          placeholder="Enter Option "
                          onBlur={handleBlur}
                        />
                        <div className="addbtn">
                          <button
                            className="site-button border combtn"
                            disabled={list?.length >= 6 ? true : false}
                            onClick={(e: any) => {
                              e.preventDefault();
                              handleAddItem();
                              setFieldValue("options", "");
                            }}
                          >
                            Add option
                          </button>
                        </div>
                      </div>
                      <div>
                        {optionsErr ? (
                          <p
                            className="form-error "
                            style={{ marginTop: "-3%", marginLeft: "-4%" }}
                          >
                            Please enter Option.
                          </p>
                        ) : null}
                        {!optionsErr && multiOptionErr ? (
                          <p
                            className="form-error"
                            style={{ marginTop: "-3%", marginLeft: "-4%" }}
                          >
                            Please enter atleast two Option.
                          </p>
                        ) : null}
                        <ul>
                          {list?.map((item: any) => {
                            list?.length > 1 && setMultiOptionErr(false);
                            return (
                              <li key={item.id} style={{ listStyle: "none" }}>
                                {editingItemId === item.id ? (
                                  <>
                                    <div className="Updatediv">
                                      <div className="commfiled">
                                        <input
                                          type="text"
                                          maxLength={25}
                                          minLength={2}
                                          value={editingItemName}
                                          onBlur={handleBlur}
                                          onChange={(e) =>
                                            setEditingItemName(e.target.value)
                                          }
                                          className="form-control editControl"
                                        />
                                      </div>
                                      <button
                                        onClick={(e: any) => {
                                          handleEditItem(
                                            item.id,
                                            editingItemName
                                          );
                                          e.preventDefault();
                                        }}
                                        className="site-button border updateBtn"
                                      >
                                        <i
                                          className="fa fa-floppy-o btnicon"
                                          aria-hidden="true"
                                        ></i>
                                      </button>
                                      <button
                                        className="site-button border cancelbtn"
                                        onClick={(e: any) => {
                                          setEditingItemId(null);
                                          setEditingItemName("");
                                          e.preventDefault();
                                        }}
                                      >
                                        <i
                                          className="fa fa-times btnicon"
                                          aria-hidden="true"
                                        ></i>
                                      </button>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="viewdiv">
                                      <div className="savedcomments">
                                        <Tooltip
                                          placement="top"
                                          title={item?.cmt}
                                          arrow
                                        >
                                          <div
                                            className="form-control addcontrol"
                                            data-toggle="tooltip"
                                          >
                                            {item?.name}
                                          </div>
                                        </Tooltip>
                                      </div>
                                      <button
                                        onClick={(e: any) => {
                                          setEditingItemId(item.id);
                                          setEditingItemName(item.name);
                                          e.preventDefault();
                                        }}
                                        className="site-button border editbtn"
                                      >
                                        <i
                                          className="fa fa-pencil btnicon "
                                          aria-hidden="true"
                                        ></i>
                                      </button>
                                      <button
                                        onClick={() => {
                                          handleDeleteItem(item.id);
                                        }}
                                        className="site-button border deletebtn"
                                      >
                                        <i
                                          className="fa fa-trash btnicon"
                                          aria-hidden="true"
                                        ></i>
                                      </button>
                                    </div>
                                  </>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex">
                    <div>
                      <label className="font-weight-700">Active From</label>
                      <span style={{ color: "red" }}>*</span>&nbsp;
                      <BsInfoCircle title="The default poll start time is 12:00 AM." />
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            className="datepickerWalkIn "
                            value={values?.startDate}
                            format="DD-MM-YYYY"
                            disablePast
                            onChange={(newValue) => {
                              const selectedDate = `${newValue?.$D}/${
                                newValue?.$M + 1
                              }/${newValue?.$y}`;
                              const addtionDate = `${newValue?.$y}/${
                                newValue?.$M + 1
                              }/${newValue?.$D}`;
                              if (
                                isNaN(newValue?.$D) &&
                                isNaN(newValue?.$M + 1) &&
                                isNaN(newValue?.$y)
                              ) {
                                setFieldError(
                                  "startDate",
                                  "Please enter Valid Active From Date."
                                );
                              } else if (newValue?.$y && newValue?.$y > 2099) {
                                setWalkindateError(
                                  "Please select a date within 2099."
                                );
                              } else if (
                                newValue?.$D &&
                                newValue?.$M + 1 &&
                                newValue?.$y &&
                                new Date(
                                  `${newValue?.$M + 1}/${newValue?.$D}/${
                                    newValue?.$y
                                  }`
                                ) < new Date() &&
                                `${new Date(
                                  `${newValue?.$M + 1}/${newValue?.$D}/${
                                    newValue?.$y
                                  }`
                                ).toDateString()}` !=
                                  `${new Date().toDateString()}`
                              ) {
                                setWalkindateError(
                                  "Please select the future date."
                                );
                              } else {
                                setWalkindateError("");
                                setFieldValue("startDate", newValue);
                              }
                            }}
                            onClose={() => {
                              // setTouchedDate(true);
                            }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                      {!walkindateError &&
                      errors.startDate &&
                      touched.startDate ? (
                        <p className="form-error" style={{ marginTop: "-5px" }}>
                          {errors.startDate}
                        </p>
                      ) : null}
                      {walkindateError && (
                        <p className="form-error">{walkindateError}</p>
                      )}
                    </div>
                    <div className="ml-5">
                      <label className="font-weight-700">Active Till</label>
                      <span style={{ color: "red" }}>*</span>&nbsp;
                      <BsInfoCircle title="The default poll end time is 11:59 PM." />
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            className="datepickerWalkIn "
                            value={values?.endDate}
                            format="DD-MM-YYYY"
                            disablePast
                            onChange={(newValue) => {
                              // setStartDate(newValue);
                              const selectedDate = `${newValue?.$D}/${
                                newValue?.$M + 1
                              }/${newValue?.$y}`;
                              const addtionDate = `${newValue?.$y}/${
                                newValue?.$M + 1
                              }/${newValue?.$D}`;
                              if (
                                isNaN(newValue?.$D) &&
                                isNaN(newValue?.$M + 1) &&
                                isNaN(newValue?.$y)
                              ) {
                                setFieldError(
                                  "endDate",
                                  "Please enter Valid Active Till Date."
                                );
                              } else if (newValue?.$d) {
                                var datePickerDate = new Date(newValue?.$d);

                                // Set the desired time
                                var hours = 23; // 11 PM
                                var minutes = 59;
                                var seconds = 59;

                                // Set the time portion of the date
                                datePickerDate.setHours(hours);
                                datePickerDate.setMinutes(minutes);
                                datePickerDate.setSeconds(seconds);
                                setEndDate(datePickerDate);

                                setFieldValue("endDate", newValue);
                              }
                            }}
                            onClose={() => {}}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                      {new Date(
                        `${values?.startDate?.$y}/${values?.startDate?.$M}/${values?.startDate?.$D}`
                      ) >=
                        new Date(
                          `${values?.endDate?.$y}/${values?.endDate?.$M}/${values?.endDate?.$D}`
                        ) && (
                        <p className="form-error">Please select future date.</p>
                      )}
                      {errors.endDate && touched.endDate ? (
                        <p className="form-error" style={{ marginTop: "-5px" }}>
                          {errors.endDate}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="selectDiv">
                    <label>Visible To</label>
                    <span style={{ color: "red" }}>*</span>
                    <Select
                      menuPlacement="top"
                      name="accessible"
                      isMulti
                      options={oftenVoteoption}
                      placeholder="Select options for visibility"
                      onBlur={handleBlur}
                      value={values.accessible}
                      onChange={(e: any) => {
                        let event = {
                          target: {
                            name: "accessible",
                            value: e,
                          },
                        };

                        handleChange(event);
                      }}
                    />
                    {errors.accessible && touched.accessible ? (
                      <div className="form-error">{errors.accessible}</div>
                    ) : null}
                  </div>
                  <div className="modal-custom-footer">
                    <button
                      style={{ zIndex: 0 }}
                      type="submit"
                      className="site-button"
                      onClick={(e) => {
                        e.preventDefault();
                        list.length
                          ? setOptionsErr(false)
                          : setOptionsErr(true);
                        list.length === 1
                          ? setMultiOptionErr(true)
                          : setMultiOptionErr(false);
                        if (
                          !optionsErr &&
                          !multiOptionErr &&
                          walkindateError == ""
                        ) {
                          handleSubmit();
                        }
                      }}
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </>
          );
        }}
      </Formik>
    </>
  );
}
export default ViewPoll;
