import React, { useCallback, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import AsyncCreatableSelect from "react-select/async-creatable";
import CreatableSelect from "react-select/creatable";
import { components } from "react-select";
import { debounce } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { skillsMasterData } from "../../../ApiCall/masterData";
import "../../../assets/customCss/jobs/manage-jobs.css";
import {
  addAssessment,
  resetAddAssessment,
  resetEditAssessment,
  updateAssessment,
  viewAssessment,
} from "../../../redux/features/admin/Assessment/manageAssessmentSlice";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import {
  getAssessmentBrief,
  resetgetAssessmentBriefData,
} from "../../../redux/features/jobSeeker/JsAssessmentSlice";
import { Link, useLocation } from "react-router-dom";
import { jobSeekerProfileMasterData } from "../../../redux/features/masterData/MasterDataInfoSlice";
import { regex } from "../../../common/validation";
import { customStyles } from "../../../common/common";
import { Chip } from "@mui/material";
import { convertSecondsToHours } from "../../../common/common";

const AddAssessment = () => {
  const dispatch = useDispatch();
  const data = useLocation();
  const showSnackAlert = UseToastAlert();

  const [assessBrief, setAssessmemtBrief] = useState<any>("");
  const [testDetails, setTestDetails] = useState<any>("");
  const [countDesc, setCountDesc] = useState<any>(0);
  const [reAttempt, setReAttempt] = useState<any>(0);

  const skillsmasterData = useSelector((state: any) => state.skills);
  const viewAssessmentState = useSelector((state: any) => state.viewAssessment);

  const RoleOptionsState = useSelector(
    (state: any) => state.jobSeekerMasterData
  );
  const { JSMasterData } = RoleOptionsState;

  const assessmentW = useSelector((state: any) => state.AddAssessment);
  const { AddAssessRes, AddAssessloading } = assessmentW;

  const assessmentE = useSelector((state: any) => state.UpdateAssessment);
  const { updateAssessRes, updateAssessloading } = assessmentE;

  const AssessmentDetails = useSelector((state: any) => state.AssessmentBrief);
  const { assessmentBrief, assessLoading } = AssessmentDetails;

  useEffect(() => {
    if (!assessLoading && assessmentBrief.data) {
      setAssessmemtBrief(assessmentBrief?.data[0]);
    }
  }, [assessmentBrief?.data, assessLoading]);

  useEffect(() => {
    if (data?.state) {
      dispatch(getAssessmentBrief(data.state));
    }
  }, [data.state, dispatch]);
  interface optionType {
    label: string;
    value: string;
  }
  interface stateType {
    Testid: string;
    Testname: string;
    TestDsc: string;
    Role: optionType | null;
    keySkills: [] | null;
    Cost: string;
    RetakeCost: string;
    noOFRetake: string;
    Currency: string;
  }
  let initialState: stateType = {
    Testid: "",
    Testname: "",
    TestDsc: "",
    Role: null,
    keySkills: null,
    Cost: "",
    RetakeCost: "",
    noOFRetake: "",
    Currency: "INR",
  };

  const [bindEmpData, setBindEmpData] = useState(initialState);
  const [inputValue, setInputValue] = useState<any>("");
  const [previousValue, setPreviousValue] = useState<any>("");
  const [Role, setRole] = useState<any>("");
  const [skillsCount, setSkillsCount] = useState<number>(0);
  let countNumber: any = 0;
  const handleChangeInput = (e): void => {
    const skills = e.map((skill) => {
      return skill.value;
    });

    const len = skills.join(",").replace(",", "").length;
    countNumber = len;
    setSkillsCount(len);
  };

  useEffect(() => {
    if (countNumber) {
      setSkillsCount(countNumber);
    }
  }, [countNumber]);

  //payment model Schema
  const paymentSchema = Yup.object().shape({
    Testid: Yup.string()
      .nullable()
      .trim("Empty space not allowed.")
      .required("Please enter Assessment ID."),
    Testname: Yup.string()
      .nullable()
      .trim("Empty space not allowed.")
      .required("Please enter Assessment Name."),
    TestDsc: Yup.string()
      .nullable()
      .trim("Empty space not allowed.")
      .required("Please enter Assessment Description."),
    keySkills: Yup.array().nullable().required("Please enter Skills."),
    noOFRetake: Yup.string().nullable(),
    // .required("Please enter Re-Attempt Count."),
    Cost: Yup.string()
      .nullable()
      .trim("Empty space not allowed.")
      .matches(/[1-9][0-9]*$/, "Assessment Cost should not be zero.")
      .required("Please enter Assessment Cost."),
    RetakeCost: Yup.string()
      .nullable()
      .trim("Empty space not allowed.")
      .matches(/[1-9][0-9]*$/, "Retake Cost should not be zero.")
      .required("Please enter Retake Cost."),
    Currency: Yup.string().nullable().trim("Empty space not allowed."),
    // .required("Please enter Currency.")
    Role: Yup.object().nullable().required("Please enter Role."),
  });

  const AddAssessmntTest = () => {
    const companyinfomodel: any = {
      test_id: values.Testid,
      name: values.Testname,
      desc: values.TestDsc,
      category: values?.Role?.label,
      skill: values.keySkills?.map((c: any) => c.label),
      fee: {
        currency: "INR",
        value: values.Cost,
        retake_value: Number(values.RetakeCost),
      },
      retake_atmpt: Number(reAttempt),
    };
    dispatch(addAssessment(companyinfomodel));
  };

  const UpdateAssessmntTest = () => {
    const AssessModel: any = {
      test_id: values.Testid,
      name: values.Testname,
      desc: values.TestDsc,
      category: values?.Role?.label,
      skill: values.keySkills?.map((c: any) => c.label),
      fee: {
        currency: "INR",
        value: values.Cost,
        retake_value: Number(values.RetakeCost),
      },
      retake_atmpt: Number(reAttempt),
    };
    dispatch(updateAssessment(AssessModel));
  };
  function resetFormikValues() {
    values.keySkills = null;
    values.Testid = "";
    values.Role = null;
    values.Cost = "";
    values.TestDsc = "";
    values.RetakeCost = "";
    values.noOFRetake = "";
    setCountDesc(0);
    setReAttempt(0);
  }

  useEffect(() => {
    if (!AddAssessloading && AddAssessRes.code === 200) {
      showSnackAlert("success", AddAssessRes?.message);
      dispatch(resetAddAssessment());
      dispatch(resetgetAssessmentBriefData());
      resetFormikValues();
    } else if (
      (AddAssessRes && AddAssessRes.status === 401) ||
      (AddAssessRes && AddAssessRes.status === 400)
    ) {
      AddAssessRes?.data?.message &&
        showSnackAlert("warning", AddAssessRes?.data?.message);
    } else if (AddAssessRes && AddAssessRes && AddAssessRes.status !== 200) {
      AddAssessRes?.data?.message &&
        showSnackAlert("error", AddAssessRes?.data?.message);
    }
  }, [AddAssessRes]);
  useEffect(() => {
    if (!updateAssessloading && updateAssessRes?.code === 200) {
      showSnackAlert("success", updateAssessRes?.message);
      dispatch(resetAddAssessment());
      dispatch(resetgetAssessmentBriefData());
      dispatch(resetEditAssessment());
      // resetFormikValues()
    } else if (
      (updateAssessRes && updateAssessRes?.status === 401) ||
      (updateAssessRes && updateAssessRes?.status === 400)
    ) {
      updateAssessRes?.data?.message &&
        showSnackAlert("warning", updateAssessRes?.data?.message);
    } else if (updateAssessRes && updateAssessRes?.status !== 200) {
      updateAssessRes?.data?.message &&
        showSnackAlert("error", updateAssessRes?.data?.message);
    }
  }, [updateAssessRes]);

  const onSubmit: any = async (values: any, actions: any) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    actions.resetForm();
  };

  const handlesubmitt = () => {
    if (assessBrief) {
      UpdateAssessmntTest();
    } else {
      AddAssessmntTest();
    }
  };
  const {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: bindEmpData,
    validationSchema: paymentSchema,
    enableReinitialize: true,
    onSubmit: handlesubmitt,
  });

  const filterSkills: any = (inputValue: string, callback) => {
    if (inputValue.length >= 2) {
      const data = { pageno: 1, search: `${inputValue}` };

      skillsMasterData(data).then((res) =>
        callback(
          res.map((skill) => {
            return { label: skill, value: skill };
          })
        )
      );
    } else {
      return [];
    }
  };

  useEffect(() => {
    if (data?.state) {
      dispatch(getAssessmentBrief(data?.state));
    }
  }, []);
  useEffect(() => {
    dispatch(
      jobSeekerProfileMasterData([
        {
          group: "ASCT",
        },
      ])
    );
  }, []);
  useEffect(() => {
    let Rolemaster = JSMasterData[0]?.data?.map((e) => {
      return { label: e.value, value: e.value };
    });
    setRole(Rolemaster);
  }, [JSMasterData[0]?.data]);
  const [isTestId, setIsTestId] = useState<any>(null);
  useEffect(() => {
    if (bindEmpData.Testname == "") setIsTestId(null);
    if (viewAssessmentState?.viewAssessmentRes?.code == 200) {
      values.Testname = viewAssessmentState?.viewAssessmentRes?.data?.name;
      setIsTestId(true);
    } else if (viewAssessmentState?.viewAssessmentRes?.status == 400) {
      values.Testname = "";
      setIsTestId(false);
    }
  }, [viewAssessmentState?.viewAssessmentloading]);

  useEffect(() => {
    if (viewAssessmentState) {
      setTestDetails(viewAssessmentState?.viewAssessmentRes);
    }
  }, [viewAssessmentState]);
  useEffect(() => {
    let dd = testDetails?.data?.skills?.map((e: any) => {
      return { label: e, value: e };
    });
    values.keySkills = dd;
  }, [testDetails, viewAssessmentState]);

  useEffect(() => {
    setSkillsCount(
      testDetails?.data?.skills
        ?.map((e: any) => {
          return { label: e, value: e };
        })
        ?.join("")?.length
    );
  }, [testDetails?.data?.skills]);

  useEffect(() => {
    if (assessBrief) {
      setBindEmpData({
        Testid: assessBrief?.test_id,
        Testname: assessBrief?.test_name,
        TestDsc: assessBrief?.desc,
        Role: { label: assessBrief?.category, value: assessBrief?.category },
        keySkills: assessBrief?.skill?.map((c: any) => {
          return { label: c, value: c };
        }),
        Cost: assessBrief?.amount?.value,
        RetakeCost: assessBrief?.amount?.retake_value,
        noOFRetake: assessBrief?.max_attempt,
        Currency: assessBrief?.amount?.currency,
      });
      if (assessBrief?.test_id) {
        setInputValue(assessBrief?.test_id);
      }
      if (assessBrief?.max_attempt) {
        setReAttempt(assessBrief?.max_attempt);
      } else {
        setReAttempt(0);
      }
      if (assessBrief?.desc) {
        setCountDesc(assessBrief?.desc.length);
      } else {
        setCountDesc(0);
      }
      values.Testid && dispatch(viewAssessment(assessBrief?.test_id));
    } else {
      dispatch(resetgetAssessmentBriefData());
      setBindEmpData(initialState);
      setCountDesc(0);
      setReAttempt(0);
      setInputValue("");
      setPreviousValue("");
      setIsTestId(null);
      values.Testname = "";
      values.keySkills = null;
      // setFieldValue(
      //   "Testname",
      //   ""
      // );
    }
  }, [assessBrief]);

  const handleSelectOption = (option) => {
    const res = handleChangeInputt(option);
    if (res) {
      const event = {
        target: {
          name: "keySkills",
          value: option,
        },
      };
      handleChange(event);
      // props.values.keySkills = option;
    }
  };

  const handleChangeInputt = (e): boolean => {
    const skills = e
      .map((skill) => skill.value)
      .toString()
      .replaceAll(",", "");
    if (skills.length > 250) {
      return false;
    } else if (skills.length) {
      // setErrorMsg(false);
    } else {
      // setErrorMsg(true);
      setSkillsCount(skills.length);
      return true;
    }
    setSkillsCount(skills.length);
    return true;
  };

  const loadSkillsOptions = useCallback(debounce(filterSkills, 1000), []);

  return (
    <>
      <div className="page-content ">
        <div className="content-block">
          <div className="section-full browse-job content-inner-1">
            <div className="container" style={{ marginTop: "-10px" }}>
              <div className="job-bx-title clearfix custom-page-header">
                <div className="job-bx-title clearfix custom-page-header">
                  <div
                    className="d-flex justify-content-between job-bx bg-white m-t10"
                    id="main-header"
                  >
                    <div>
                      <h5
                        className="m-t10"
                        style={{ color: "#7777d3", fontSize: "16px" }}
                      >
                        {" "}
                        {!bindEmpData.Testid
                          ? "ADD ASSESSMENT"
                          : "UPDATE ASSESSMENT"}{" "}
                      </h5>
                    </div>
                    {/* <div className="job-bx-title backli clearfix text-center "> */}
                    <Link
                      to={"/admin/AssessmentManage"}
                      className="site-button right-arrow button-sm "
                      onClick={() => {
                        setCountDesc(0);
                      }}
                    >
                      Go Back
                    </Link>
                    {/* </div> */}
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-9 col-md-10">
                    <div className=" job-bx bg-white m-t10">
                      <form autoComplete="off">
                        <div className="row">
                          <div className="col-lg-6 col-md-12">
                            <div className="form-group">
                              <label>
                                Assessment ID{" "}
                                <span style={{ color: "red" }}>*</span>
                              </label>

                              <input
                                maxLength={8}
                                type="text"
                                name="Testid"
                                onChange={(e) => {
                                  setInputValue(e.target.value);
                                  if (regex.numberTyping.test(e.target.value)) {
                                    handleChange(e);
                                  } else if (e.target.value.length == 0) {
                                    e.target.value = "";
                                  }
                                }}
                                // disabled={bindEmpData?.Testid}
                                className="form-control"
                                onBlur={(e) => {
                                  handleBlur(e);
                                  // values.keySkills =
                                  //   testDetails?.data?.skills?.map((e: any) => {
                                  //     return { label: e, value: e };
                                  //   });
                                  if (inputValue !== previousValue) {
                                    dispatch(viewAssessment(inputValue));
                                    setPreviousValue(inputValue);
                                  }
                                }}
                                value={inputValue}
                                placeholder="Enter Your Assessment ID"
                              />
                              {errors.Testid && touched.Testid ? (
                                <p className="form-error">{errors.Testid}</p>
                              ) : null}
                              {!errors.Testid &&
                                values.Testid &&
                                isTestId == false &&
                                !values.Testname && (
                                  <p className="form-error">
                                    Entered Assessment ID not Available in
                                    HackerEarth Platform
                                  </p>
                                )}
                              {values.Testid && (
                                <span
                                  className="text-success"
                                  style={{ fontSize: "15px" }}
                                >
                                  {values.Testname}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-12">
                            <div className="form-group">
                              <label>
                                Assessment Category{" "}
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <CreatableSelect
                                hideSelectedOptions
                                id="cancelbtnAs"
                                options={Role}
                                placeholder="Enter Your Role/ Category"
                                styles={customStyles}
                                components={components}
                                isClearable={true}
                                className={"dropstyle"}
                                name="Role"
                                maxMenuHeight={200}
                                value={values?.Role?.label ? values.Role : ""}
                                onChange={(e) => {
                                  let event = {
                                    target: {
                                      name: "Role",
                                      value: e,
                                    },
                                  };
                                  handleChange(event);
                                }}
                              />
                              {errors.Role && touched.Role ? (
                                <p className="form-error">{errors.Role}</p>
                              ) : null}
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-12">
                            <div className="form-group">
                              <label>
                                Skills <span style={{ color: "red" }}>*</span>
                              </label>
                              <AsyncCreatableSelect
                                id="Skillsdropdown"
                                components={components}
                                placeholder="Enter your Skills"
                                cacheOptions
                                isClearable={true}
                                noOptionsMessage={() =>
                                  "Enter keyword to search"
                                }
                                styles={customStyles}
                                className="dropstyle"
                                name="keySkills"
                                isMulti
                                value={values.keySkills}
                                onChange={(e) => {
                                  handleSelectOption(e);
                                }}
                                loadOptions={loadSkillsOptions}
                              />
                              {errors.keySkills && touched.keySkills ? (
                                <p className="form-error">{errors.keySkills}</p>
                              ) : null}
                              {values.Testid && (
                                <span
                                  className="text-success"
                                  style={{ fontSize: "15px" }}
                                >
                                  {/* {
                                    // (testDetails?.data?.skills)?.join(",")
                                    testDetails?.data?.skills &&
                                      testDetails?.data?.skills.map((e) => {
                                        return (
                                          <>
                                            <Chip
                                              label={e}
                                              variant="outlined"
                                              style={{ color: "lightgray" }}
                                            />
                                            &nbsp;
                                          </>
                                        );
                                      })
                                  } */}
                                </span>
                              )}
                              <span className="custom-char-count mb-2">
                                {!isNaN(250 - skillsCount)
                                  ? 250 - skillsCount
                                  : 250}{" "}
                                Character(s) Left
                              </span>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-12">
                            <div className="form-group">
                              <label htmlFor="">
                                Re-Attempt Count{" "}
                                <span className="c_content_desc">
                                  (Max Re-Attempt Count is{" "}
                                  {testDetails?.data?.max_attempt ||
                                    viewAssessmentState?.viewAssessmentRes?.data
                                      ?.max_attempt}
                                  ) {/* {testDetails?.data?.max_attempt} */}
                                </span>
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                maxLength={6}
                                type="text"
                                name="noOFRetake"
                                value={reAttempt}
                                onChange={(e) => {
                                  setReAttempt(e.target.value);
                                  if (regex.numberTyping.test(e.target.value)) {
                                    handleChange(e);
                                  } else if (e.target.value.length == 0) {
                                    e.target.value = "";
                                  }
                                }}
                                className="form-control"
                                onBlur={handleBlur}
                                placeholder="Enter number of Re-attempt count "
                              />
                              {/* {errors.noOFRetake && touched.noOFRetake ? (
                                <p className="form-error">
                                  {errors.noOFRetake}
                                </p>
                              ) : null} */}
                              {reAttempt > 10 && (
                                <p className="form-error">
                                  Re-Attempt Count should be less than 10.
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-12">
                            <div className="form-group">
                              <label>
                                Assessment Cost (INR)
                                <span style={{ color: "red" }}>*</span>
                              </label>

                              {/* {errors.Currency ? (
                                <p className="form-error">{errors.Currency}</p>
                              ) : null} */}

                              <input
                                maxLength={4}
                                type="text"
                                name="Cost"
                                onChange={(e) => {
                                  if (regex.numberTyping.test(e.target.value)) {
                                    handleChange(e);
                                  } else if (e.target.value.length == 0) {
                                    e.target.value = "";
                                  }
                                }}
                                className="form-control"
                                onBlur={handleBlur}
                                value={values.Cost}
                                placeholder="Enter Assessment Cost"
                              />
                              {errors.Cost && touched.Cost ? (
                                <p className="form-error">{errors.Cost}</p>
                              ) : null}
                            </div>
                          </div>
                          {/* -------------Only cost---------------------- */}
                          {reAttempt != 0 && (
                            <>
                              <div className="col-lg-6 col-md-12">
                                <div className="form-group">
                                  <label>
                                    Retake Cost (INR)
                                    <span style={{ color: "red" }}>*</span>
                                  </label>

                                  <input
                                    maxLength={4}
                                    type="text"
                                    name="RetakeCost"
                                    disabled={reAttempt === 0}
                                    value={values.RetakeCost}
                                    onChange={(e) => {
                                      if (
                                        regex.numberTyping.test(e.target.value)
                                      ) {
                                        handleChange(e);
                                      } else if (e.target.value.length == 0) {
                                        e.target.value = "";
                                      }
                                    }}
                                    className="form-control"
                                    onBlur={handleBlur}
                                    placeholder="Enter Retake Cost"
                                  />
                                  {errors.RetakeCost && touched.RetakeCost ? (
                                    <p className="form-error">
                                      {errors.RetakeCost}
                                    </p>
                                  ) : null}
                                </div>
                              </div>
                            </>
                          )}
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>
                                Assessment Description{" "}
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <textarea
                                maxLength={300}
                                // type="text"
                                name="TestDsc"
                                onChange={(e: any) => {
                                  handleChange(e);
                                  setCountDesc(e.target.value.length);
                                }}
                                className="form-control"
                                onBlur={handleBlur}
                                value={values.TestDsc}
                                placeholder="Enter Assessment Description"
                                style={{ height: "70px" }}
                              />
                              <span className="custom-char-count">
                                {300 - countDesc} Character(s) left
                              </span>
                              {errors.TestDsc && touched.TestDsc ? (
                                <p className="form-error">{errors.TestDsc}</p>
                              ) : null}
                            </div>
                          </div>
                          {/* ------------------------------------ */}
                          <div className="col-lg-12 col-md-12">
                            <div
                              style={{
                                textAlign: "right",
                                marginTop: "17px",
                                marginBottom: "8px",
                                paddingRight: "10px",
                              }}
                            >
                              <button
                                type="button"
                                className="site-button border assessCbtn"
                                disabled={
                                  AddAssessloading || updateAssessloading
                                }
                                onClick={() => {
                                  handleSubmit();
                                  setCountDesc(0);
                                }}
                              >
                                {updateAssessloading && (
                                  <i
                                    className="fa fa-circle-o-notch fa-spin"
                                    style={{ marginRight: "10px" }}
                                  ></i>
                                )}
                                {AddAssessloading && (
                                  <i
                                    className="fa fa-circle-o-notch fa-spin"
                                    style={{ marginRight: "10px" }}
                                  ></i>
                                )}
                                {!bindEmpData.Testid
                                  ? "Create Assessment"
                                  : "Update Assessment"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-10">
                    <div className=" job-bx bg-white m-t10">
                      {isTestId == true &&
                        values.Testname &&
                        values.Testid &&
                        testDetails?.data?.name &&
                        testDetails?.data?.duration && (
                          <div
                            className="testU"
                            style={{ marginBottom: "10px" }}
                          >
                            <div>Assessment Details</div>
                            <div className="assessmsge">
                              {" "}
                              {testDetails?.data?.name && (
                                <span style={{ color: "gray" }}>
                                  {testDetails?.data?.name}
                                </span>
                              )}
                            </div>
                            {testDetails?.data?.duration && (
                              <div className="assessmsge">
                                {" "}
                                Duration:{" "}
                                {convertSecondsToHours(
                                  testDetails?.data?.duration
                                )}
                              </div>
                            )}
                            {/* {!testDetails?.data?.duration && (
                              <div className="assessmsge"> Duration: 0</div>
                            )} */}
                            {testDetails?.data?.start_date && (
                              <div className="assessmsge">
                                {" "}
                                {testDetails?.data?.start_date &&
                                  testDetails?.data?.start_date?.split("T")[0]}
                              </div>
                            )}
                            <br />
                            <div className="assessmsge">
                              <span className="text-secondary">Section :</span>
                              {testDetails?.data?.question_weightage.map(
                                (que) => {
                                  return (
                                    <>
                                      <br />
                                      <span>
                                        {que?.name}({que?.sc?.total_score})
                                      </span>
                                    </>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        )}
                      {isTestId == false && (
                        <div className="testD" style={{ marginBottom: "10px" }}>
                          <div>Assessment Info</div>
                          <div className="assessmsge">
                            Entered Assessment ID not Available in HackerEarth
                            Platform, Kindly confirm Again.
                          </div>
                        </div>
                      )}
                      <div className="testC testCost">
                        <div>Cost Explanation</div>
                        <div className="assessmsg">
                          Please note the total cost should include all
                          applicable third-party costs and taxes.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAssessment;
