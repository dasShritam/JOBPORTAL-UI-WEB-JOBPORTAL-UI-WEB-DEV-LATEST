import { useCallback, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Field, Formik } from "formik";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import Select from "react-select";
import { debounce } from "lodash";
import "../../../../assets/customCss/Projects.css";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteProjectData,
  resetDeleteProjSl,
  resetProjectSl,
  updateProjectDetails,
} from "../../../../redux/features/manage-account/profile/ProjectSlice";
import { UseToastAlert } from "../../../../hooks/useToastAlert";
import {
  createData,
  customStyles,
  GetFutureOrPastMonths,
  GetMonthNameFromTimeStamp,
  GetYearFromTimeStamp,
} from "../../../../common/common";
import { getJobSeekerrData } from "../../../../redux/features/manage-account/profile/JsSlice";
import { BsPencil } from "react-icons/bs";
import Swal from "sweetalert2";
import { environment } from "../../../../environments/environment";
import AsyncCreatableSelect from "react-select/async-creatable";

import {
  companyNamesMasterData,
  designationMasterData,
  locationsMasterData,
  skillsMasterData,
} from "../../../../ApiCall/masterData";
import { profileStrength } from "../../../../redux/features/manage-account/profile/BasicDetailsSlice";

function SelectField(props: any) {
  return <Select {...props} />;
}

const INITIAL_FORM_STATE = {
  _id: "",
  title: "",
  client: null,
  ProjectStatus: "In Progress",
  StartedFromYear: null,
  StartedFromMonth: null,
  WorkedTillYear: null,
  WorkedTillMonth: null,
  desc: "",
  location: null,
  on_site: "false",
  employment_type: "FullTime",
  team_size: "",
  name: null,
  roleDesc: "",
  skills: [],
  edu_tag: "",
};
const FORM_VALIDATION = Yup.object().shape({
  _id: Yup.string().notRequired(),
  title: Yup.string()
    .required("Please specify Project Title.")
    .trim("Empty space not allowed."),
  edu_tag: Yup.string().nullable(),
  client: Yup.object().nullable().required("Please specify Client Name."),
  ProjectStatus: Yup.string().required(),
  StartedFromYear: Yup.object()
    .nullable()
    .required("Please select start Year."),
  StartedFromMonth: Yup.object()
    .nullable()
    .required("Please select start Month."),
  WorkedTillYear: Yup.object()
    .nullable()
    .when("ProjectStatus", {
      is: "Finished",
      then: Yup.object().required("Please select end Year.").nullable(),
    }),
  WorkedTillMonth: Yup.object()
    .nullable()
    .when("ProjectStatus", {
      is: "Finished",
      then: Yup.object().required("Please select end Month.").nullable(),
    }),
  desc: Yup.string().required("Please mention Project Details."),
  location: Yup.object().notRequired().nullable(),
  on_site: Yup.string().notRequired(),
  employment_type: Yup.string().notRequired().nullable(),
  team_size: Yup.object().notRequired().nullable(),
  name: Yup.object().notRequired().nullable(),
  roleDesc: Yup.string().notRequired().nullable(),
  skills: Yup.array().notRequired().nullable(),
});
type propsState = {
  displayModel?: boolean;
  trigger?: any;
};

function Projects({ displayModel, trigger }: propsState) {
  const MAX_LENGTH = 150;
  const [count, setCount] = useState(0);
  const [projects, setProjects] = useState(false);
  const [hideProjectContent, setHideProjectContent] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [showWorkTill, setShowWorkTill] = useState(false);
  const [showMoreDetails, setShowMoreDetails] = useState(true);
  const [projectStatus, setProjectStatus] = useState(null);
  const [projectDetails, setProjectDetails] = useState<any>([]);
  const [startMonth, setStartMonth] = useState<any>(null);
  const [startYear, setStartYear] = useState<any>(null);
  const [workTillMonth, setWorkTillMonth] = useState<any>(null);
  const [workTillYear, setWorkTillYear] = useState<any>(null);
  const [education, setEducation] = useState<any>();
  const [teamSize, setTeamSize] = useState<any>(null);
  const [role, setRole] = useState<any>(null);

  const [roleDescCount, setRoleDescCount] = useState<any>(0);
  const [skillsCount, setSkillsCount] = useState<number>(0);
  const [client, setClient] = useState<any>();
  const [location, setLocation] = useState<any>([]);
  const [formValues, setFormValues] = useState<any>(null);
  const [skills] = useState<any>([]);

  /*Autocomplete */

  const components = {
    DropdownIndicator: null,
  };
  const pflStrength = useSelector((state: any) => state.profileStrength);

  const yearmonthData = useSelector((state: any) => state.yearmonthMasterdata);
  const { allYearMonth } = yearmonthData,
    [yearData, setYearData] = useState<any>(),
    [fromMonthData, setFromMonthData] = useState<any>(),
    [toMonthData, setToMonthData] = useState<any>();

  const getMonthOptions = () => {
    if (allYearMonth) {
      allYearMonth?.map((opt: any) => {
        if (opt.group === "GTMO") {
          let obj: any = [];
          opt.data.map((item: any) => {
            obj.push({ value: item.id, label: item.value });
          });
          setFromMonthData(obj);
          setToMonthData(obj);
        }
      });
    }
  };
  const [clientInputValue, setClientInputValue] = useState("");

  const handleInputChanges = (newValue: string) => {
    setClientInputValue(
      newValue.replace(
        /[^a-zA-Z0-9- \- . ' , : ! ( ) & + \[ \] \/ \* @ \| ]*$/,
        ""
      )
    );
  };
  // const [text, setText] = useState("");
  // const textRef = useRef<HTMLParagraphElement>(null);
  // const handleCopy = () => {
  //   const textElement = textRef.current;
  //   if (textElement) {
  //     navigator.clipboard.writeText(textElement.innerText);
  //   }
  // };
  useEffect(() => {
    if (allYearMonth) {
      allYearMonth?.map((opt: any) => {
        if (opt.group === "PAYE") {
          let obj: any = [];
          opt.data.map((item: any, index) => {
            obj.push({ value: item, label: item });
          });
          setYearData(obj.reverse());
        }
      });
    }
    getMonthOptions();
  }, [allYearMonth]);

  const skillFilterOptions: any = (inputValue: string, callback) => {
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
  const debounceOptions = useCallback(debounce(skillFilterOptions, 1000), []);

  /*craete tabele for comapny mastere data */
  const companyFilterOptions: any = (inputValue: string, callback) => {
    if (inputValue.length > 0) {
      const data = { pageno: 1, search: `${inputValue}` };
      companyNamesMasterData(data).then((res) =>
        callback(
          res.map((comp) => {
            return { label: comp, value: comp };
          })
        )
      );
    } else {
      return [];
    }
  };
  const companyOptions = useCallback(debounce(companyFilterOptions, 1000), []);

  const roleFilterColors = (inputValue: string, callback) => {
    if (inputValue.length > 0) {
      const data = { pageno: 1, search: `${inputValue}` };
      designationMasterData(data).then((res) =>
        callback(
          res.map((role) => {
            return { label: role, value: role };
          })
        )
      );
    } else {
      return [];
    }
  };

  const loadRoleOptions: any = useCallback(
    debounce(roleFilterColors, 1000),
    []
  );

  const locationsFilterOptions: any = (inputValue: string, callback) => {
    if (inputValue.length > 0) {
      const data = { pageno: 1, search: `${inputValue}` };
      locationsMasterData(data).then((res) =>
        callback(
          res.map((loc) => {
            return { label: loc, value: loc };
          })
        )
      );
    } else {
      return [];
    }
  };

  const locationsPromiseOptions = useCallback(
    debounce(locationsFilterOptions, 1000),
    []
  );

  /*End Autocomplete */
  const [edu, setEdu] = useState<any>([]);
  const [displayprojecttitle, setDisplayprojecttitle] = useState("");
  const [skillsUsed, setSkillsUsed] = useState<any>();

  const projectData = useSelector((state: any) => state.projectDetails);
  const { ProjectDetails, projectLoadingState } = projectData;

  const deleteproject = useSelector((state: any) => state.deleteProject);
  const { res } = deleteproject;

  const dispatch = useDispatch();
  const showSnackAlert = UseToastAlert();

  const JobSeekerProfileData = useSelector(
    (state: any) => state.JobSeekerProfile2
  );

  const { JobSeekerProfile, loading } = JobSeekerProfileData;

  useEffect(() => {
    if (res.message) {
      showSnackAlert("success", res.message);
      dispatch(getJobSeekerrData());
      dispatch(resetDeleteProjSl());
      dispatch(profileStrength());
    } else if (res && res.response && res.response?.data.code !== 200) {
      showSnackAlert("warning", res?.response?.data?.message);
      dispatch(resetDeleteProjSl());
    }
  }, [res, res?.response?.data]);

  useEffect(() => {
    if (ProjectDetails.message) {
      if (!projectLoadingState && ProjectDetails?.code === 200) {
        showSnackAlert("success", ProjectDetails?.message);
        dispatch(getJobSeekerrData());
        dispatch(resetProjectSl());
        dispatch(profileStrength());
      }
      if (ProjectDetails.code === 500) {
        showSnackAlert("error", ProjectDetails.message);
        dispatch(resetProjectSl());
      }
      if (ProjectDetails.code === 206) {
        showSnackAlert("warning", ProjectDetails.message);
        dispatch(resetProjectSl());
      }
    }
  }, [ProjectDetails?.code, projectLoadingState]);

  useEffect(() => {
    setProjectDetails(JobSeekerProfile?.js_profile?.project);
    if (
      JobSeekerProfile?.js_profile?.education &&
      JobSeekerProfile?.js_profile?.employments
    ) {
      setEdu([
        ...JobSeekerProfile?.js_profile?.education?.schools.map(
          (schoo: any) => {
            return { label: schoo?.course, value: schoo?._id };
          }
        ),
        ...JobSeekerProfile.js_profile?.education?.degree?.map((deg: any) => {
          return { label: deg?.course + "-" + deg?.stream, value: deg?._id };
        }),
        ...JobSeekerProfile.js_profile?.employments.map((emp: any) => {
          return {
            label: emp?.fulltime.role
              ? emp?.fulltime?.role + "-" + emp.company
              : emp?.internship?.role + "-" + emp.company,
            value: emp?._id,
          };
        }),
      ]);
    }
  }, [JobSeekerProfile?.js_profile, JobSeekerProfile?.js_profile?.education]);

  /*comapy master data */

  const handleHideProjects = () => {
    setProjects(false);
  };

  const handleDeleteProj = (id: any) => {
    if (formValues) {
      dispatch(deleteProjectData(id));
      handleSet();
      setFormValues(null);
    }
  };

  const handelDeleteProject = (values: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, You will not be able to recover this Record!",
      showCancelButton: true,
      confirmButtonColor: "#2a9f2a ",
      cancelButtonColor: "#db1919 ",
      confirmButtonText: "Yes, Delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setProjects(false);
        handleDeleteProj(values);
        dispatch(profileStrength());
      }
    });
  };
  const handleSet = () => {
    setStartMonth(null);
    setStartYear(null);
    setWorkTillMonth(null);
    setWorkTillYear(null);
    setRole(null);
    setTeamSize(null);
    setSkillsUsed(null);
    setEducation(null);
    setClient(null);
    setLocation(null);
  };
  const handelCancelBtn = () => {
    setCount(0);
    setProjects(false);
    setShowWorkTill(false);
    setShowMoreDetails(false);
  };

  const rows: any[] = [];
  for (let i = 1; i < 23; i++) {
    rows.push(i);
  }
  const validate = (values: any) => {
    let endDate: any = "";
    let startDate: any = "";
    if (values.StartedFromMonth && values.StartedFromYear) {
      startDate = new Date(
        `${values.StartedFromYear.label},${values.StartedFromMonth.value + 1
        }, 1,`
      );
    }
    if (values.WorkedTillYear !== null && values.WorkedTillMonth !== null) {
      endDate = new Date(
        ` ${values.WorkedTillYear?.label} ,${values.WorkedTillMonth?.value + 1
        }, 1`
      );
    }

    if (endDate !== "" && endDate < startDate) {
      setDateError(true);
    } else {
      setDateError(false);
    }
  };

  const handleSkillInput = (option) => {
    const res = handleChangeInput(option);
    if (res) {
      setSkillsUsed(option);
    }
  };

  const handleChangeInput = (e): boolean => {
    const skills = e
      .map((skill) => skill.value)
      .toString()
      .replaceAll(",", "");

    if (skills.length > 500) {
      return false;
    } else {
      setSkillsCount(skills.length);
      return true;
    }
  };

  const isValidNewOption = (inputValue, selectValue, selectOptions) => {
    if (inputValue.length === 0 || inputValue.length > MAX_LENGTH) {
      return false;
    }
    const isDuplicate = selectOptions.find(
      (option) => option.label === inputValue
    );
    if (isDuplicate) {
      return false;
    }
    return true;
  };

  const [inputValue, setInputValue] = useState("");
  const [locationInputValue, setLocationInputValue] = useState("");

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue.replace(/[^a-zA-Z0-9-.',:!()&+#/>\s]*$/, ""));
  };
  const handleInputLocation = (newValue: string) => {
    setLocationInputValue(newValue.replace(/[^a-zA-Z\s]*$/, ""));
  };
  useEffect(() => {
    if (displayModel === true) {
      setProjects(true);
      setHideProjectContent(false);
    } else {
      setHideProjectContent(true);
    }
  }, [displayModel]);

  return (
    <>
      <Formik
        initialValues={formValues || { ...INITIAL_FORM_STATE }}
        validate={validate}
        validationSchema={FORM_VALIDATION}
        enableReinitialize={true}
        onSubmit={(values, { resetForm }) => {
          let endDate: string = "";
          const startDate = `${values?.StartedFromYear?.label},${values?.StartedFromMonth?.value + 1
            } ,1 `;

          if (values.WorkedTillYear && values.WorkedTillMonth) {
            endDate = ` ${values.WorkedTillYear?.label},${values.WorkedTillMonth?.value + 1
              }, 1`;
          }

          const formData: any = {
            title: values?.title,
            desc: values?.desc,
            client: client.value,
            location: location ? location.value : null,
            skills: skillsUsed?.length
              ? skillsUsed.map((skill: any) => skill?.value)
              : null,
            designation: {
              name: values?.name ? values?.name.label : null,
              desc: values?.roleDesc ? values?.roleDesc : null,
            },
            employment_type: values?.employment_type
              ? values?.employment_type
              : null,
            team_size: values.team_size ? Number(values.team_size.label) : null,
            on_site: values.on_site === "true",
            edu_tag: values.Education ? values.Education : null,
            start_ts: startDate ? new Date(startDate).getTime() : "",
            end_ts: endDate !== "" ? new Date(endDate).getTime() : "",
          };
          if (formValues && !dateError) {
            formData["_id"] = values._id;

            dispatch(updateProjectDetails(formData));

            resetForm();
            handleSet();
            setProjects(false);
          } else {
            if (!dateError) {
              dispatch(updateProjectDetails(formData));

              setProjects(false);
              handleSet();
              resetForm();
            }
          }
        }}
        isInitialValid={false}
      >
        {(formik: any) => {
          const {
            setFieldValue,
            values,
            handleChange,
            handleSubmit,
            errors,
            touched,
            handleBlur,
          } = formik;

          setProjectStatus(formik.values.ProjectStatus);
          projectStatus === "Finished"
            ? setShowWorkTill(true)
            : setShowWorkTill(false);

          return (
            <>
              <Modal
                className="modal fade browse-job modal-bx-info editor"
                show={projects}
                backdrop="static"
                onHide={() => {
                  handleSet();
                  formik.resetForm();
                  handleHideProjects();
                  trigger && trigger(false);
                }}
              >
                <div className="modal-dialog my-0" role="document">
                  <div className="modal-content">
                    <div className="modal-custom-header">
                      <h5
                        className="modal-title text-truncate text-ellipsis pt-3 pl-4"
                        id="ProjectsModalLongTitle"
                      >
                        {formValues ? displayprojecttitle : "Add Project"}
                      </h5>
                      {formValues && (
                        <button
                          className="btn btn-sm btn-danger d-block d-md-inline-block mr-md-2 mb-2 mb-md-0 ml-auto"
                          type="button"
                          title="Delete"
                          onClick={() => {
                            handelDeleteProject(values._id);
                            // setDeteteProject(true)
                          }}
                        >
                          Delete
                        </button>
                      )}
                      <button
                        type="button"
                        className="close pt-3 pr-4"
                        onClick={() => {
                          formik.resetForm();
                          setProjects(false);
                          setFormValues(null);
                          handelCancelBtn();
                          trigger && trigger(false);
                        }}
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                      }}
                    >
                      <div className="modal-body">
                        <div className="row">
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>Project Title</label>
                              <span style={{ color: "red" }}>*</span>
                              <input
                                maxLength={100}
                                type="text"
                                name="title"
                                value={formik.values.title}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`form-control  ${formik.touched.title && formik.errors.title
                                    ? "border-red-400"
                                    : ""
                                  }`}
                                placeholder="Enter Project Title"
                              />
                              {formik.touched.title && formik.errors.title ? (
                                <p className="form-error">
                                  {formik.errors.title}
                                </p>
                              ) : null}
                            </div>
                          </div>
                          {edu.length ? (
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>
                                  Tag this project with your
                                  Employment/Education
                                </label>
                                <div className="row">
                                  <div className="col-lg-12 col-md-12 col-sm-12 col-12">
                                    <Field
                                      placeholder="Select Employment/Education"
                                      component={SelectField}
                                      value={education}
                                      className="dropstyle"
                                      styles={customStyles}
                                      name="Education"
                                      options={edu && edu}
                                      isClearable={true}
                                      onChange={(option: any) => {
                                        setEducation(option);
                                        setFieldValue(
                                          "Education",
                                          option?.value
                                        );
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : null}
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>Client</label>
                              <span style={{ color: "red" }}>*</span>
                              <AsyncCreatableSelect
                                placeholder="Enter Client Name"
                                components={components}
                                styles={customStyles}
                                maxMenuHeight={200}
                                cacheOptions
                                isValidNewOption={isValidNewOption}
                                noOptionsMessage={() =>
                                  "Enter keyword to search"
                                }
                                className="dropstyle"
                                isClearable={true}
                                name={"client"}
                                value={client}
                                onChange={(e: any) => {
                                  let event = {
                                    target: {
                                      name: "client",
                                      value: e,
                                    },
                                  };
                                  setClient(e);
                                  handleChange(event);
                                }}
                                defaultOptions
                                loadOptions={companyOptions}
                                onInputChange={handleInputChanges}
                                inputValue={clientInputValue}
                              />

                              {formik.errors.client && formik.touched.client ? (
                                <p className="form-error">
                                  {formik.errors.client}
                                </p>
                              ) : null}
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>Project Status</label>
                              <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                  <div className="custom-control custom-radio">
                                    <input
                                      type="radio"
                                      className="custom-control-input"
                                      value="In Progress"
                                      id="inprogress"
                                      name="ProjectStatus"
                                      checked={
                                        values.ProjectStatus === "In Progress"
                                      }
                                      defaultChecked={
                                        formik.values.ProjectStatus ===
                                        "In Progress"
                                      }
                                      onChange={(e) => {
                                        setFieldValue("WorkedTillYear", null);
                                        setFieldValue("WorkedTillMonth", null);
                                        setWorkTillYear(null);
                                        setWorkTillMonth(null);
                                        setDateError(false);

                                        handleChange(e);
                                      }}
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="inprogress"
                                    >
                                      In Progress
                                    </label>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                  <div className="custom-control custom-radio">
                                    <input
                                      type="radio"
                                      className="custom-control-input"
                                      value="Finished"
                                      id="finished"
                                      name="ProjectStatus"
                                      checked={
                                        values.ProjectStatus === "Finished"
                                      }
                                      onChange={handleChange}
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="finished"
                                    >
                                      Finished
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-6">
                            <div className="form-group">
                              <label>Worked From</label>
                              <span style={{ color: "red" }}>*</span>
                              <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                  <Field
                                    onBlur={handleBlur}
                                    placeholder="Year"
                                    maxMenuHeight={200}
                                    component={SelectField}
                                    className="dropstyle"
                                    styles={customStyles}
                                    name="StartedFromYear"
                                    options={yearData}
                                    isClearable={true}
                                    value={startYear}
                                    onChange={(option: any) => {
                                      setStartYear(option);
                                      setFieldValue("StartedFromYear", option);
                                      if (values.StartedFromMonth) {
                                        setFieldValue("StartedFromMonth", null);
                                        setStartMonth(null);
                                      }
                                      if (
                                        Number(option?.label) ===
                                        new Date().getFullYear()
                                      ) {
                                        setFromMonthData(
                                          GetFutureOrPastMonths(
                                            new Date().getFullYear(),
                                            fromMonthData,
                                            true
                                          )
                                        );
                                      } else {
                                        getMonthOptions();
                                      }
                                    }}
                                  />

                                  {formik.errors.StartedFromYear &&
                                    formik.touched.StartedFromYear && (
                                      <p className="form-error">
                                        {errors.StartedFromYear}
                                      </p>
                                    )}
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                  <Field
                                    onBlur={handleBlur}
                                    placeholder="Month"
                                    maxMenuHeight={200}
                                    className="dropstyle"
                                    styles={customStyles}
                                    component={SelectField}
                                    name="StartedFromMonth"
                                    options={fromMonthData}
                                    isClearable={true}
                                    value={startMonth}
                                    onChange={(option: any) => {
                                      setStartMonth(option);
                                      setFieldValue("StartedFromMonth", option);
                                    }}
                                  />
                                  {formik.errors.StartedFromMonth &&
                                    formik.touched.StartedFromMonth && (
                                      <p className="form-error">
                                        {errors.StartedFromMonth}
                                      </p>
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                          {showWorkTill && (
                            <div className="col-lg-12 col-md-6">
                              <div className="form-group">
                                <label>Worked Till</label>
                                <span style={{ color: "red" }}>*</span>
                                <div className="row">
                                  <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                    <Field
                                      placeholder="Year"
                                      maxMenuHeight={200}
                                      component={SelectField}
                                      className="dropstyle"
                                      styles={customStyles}
                                      name="WorkedTillYear"
                                      options={yearData}
                                      isClearable={true}
                                      value={workTillYear}
                                      onBlur={handleBlur}
                                      onChange={(option: any) => {
                                        setWorkTillYear(option);
                                        if (values.WorkedTillMonth) {
                                          setFieldValue(
                                            "WorkedTillMonth",
                                            null
                                          );
                                          setWorkTillMonth(null);
                                        }
                                        setFieldValue("WorkedTillYear", option);
                                        if (
                                          Number(option?.label) ===
                                          new Date().getFullYear()
                                        ) {
                                          setToMonthData(
                                            GetFutureOrPastMonths(
                                              new Date().getFullYear(),
                                              toMonthData,
                                              true
                                            )
                                          );
                                        } else {
                                          getMonthOptions();
                                        }
                                      }}
                                    />
                                    {formik.errors.WorkedTillYear &&
                                      formik.touched.WorkedTillYear && (
                                        <p className="form-error">
                                          {errors.WorkedTillYear}
                                        </p>
                                      )}
                                    {dateError && (
                                      <p className="form-error">
                                        Worked Till must be greater than Worked
                                        From.{" "}
                                      </p>
                                    )}
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                    <Field
                                      placeholder="Month"
                                      maxMenuHeight={200}
                                      component={SelectField}
                                      name="WorkedTillMonth"
                                      className="dropstyle"
                                      styles={customStyles}
                                      options={toMonthData}
                                      isClearable={true}
                                      value={workTillMonth}
                                      onBlur={handleBlur}
                                      onChange={(option: any) => {
                                        setWorkTillMonth(option);
                                        setFieldValue(
                                          "WorkedTillMonth",
                                          option
                                        );
                                      }}
                                    />
                                    {formik.errors.WorkedTillMonth &&
                                      formik.touched.WorkedTillMonth && (
                                        <p className="form-error">
                                          {errors.WorkedTillMonth}
                                        </p>
                                      )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="col-lg-12 col-md-12">
                            <div className="form-group ">
                              <label>Details of Project</label>
                              <span style={{ color: "red" }}>*</span>

                              <textarea
                                maxLength={1000}
                                style={{ resize: "none" }}
                                name="desc"
                                value={values.desc}
                                onBlur={handleBlur}
                                onChange={(e: any) => {
                                  setCount(e.target.value.length);
                                  handleChange(e);
                                }}
                                className={` form-control ${formik.touched.desc && formik.errors.desc
                                    ? "border-red-400"
                                    : ""
                                  }`}
                                placeholder="Type Description"
                              ></textarea>
                              <span
                                className=""
                                style={{
                                  display: "inline-block",
                                  fontSize: "0.85em",
                                  color: "grey",
                                }}
                              >
                                {count === 1000 ? (
                                  <span className="text-yellow">
                                    You have exceeded the text details of the
                                    project.
                                  </span>
                                ) : (
                                  `${1000 - count} Character(s) left`
                                )}
                              </span>
                              {errors.desc && touched.desc ? (
                                <p className="form-error">{errors.desc}</p>
                              ) : null}
                            </div>
                          </div>
                          {!showMoreDetails && (
                            <div className="col-lg-12 col-md-12">
                              <Link
                                to={"#"}
                                type="button"
                                style={{ textDecorationLine: "none" }}
                                onClick={() => setShowMoreDetails(true)}
                              >
                                Add More Details
                              </Link>
                            </div>
                          )}

                          {showMoreDetails && (
                            <div className="container p-0">
                              <div className="row">
                                <div className="col-lg-12 col-md-12">
                                  <div className="form-group">
                                    <label>Project Location</label>
                                    <AsyncCreatableSelect
                                      placeholder="Enter Location"
                                      components={components}
                                      isValidNewOption={isValidNewOption}
                                      noOptionsMessage={() =>
                                        "Enter keyword to search"
                                      }
                                      cacheOptions
                                      maxMenuHeight={200}
                                      className="dropstyle"
                                      isClearable={true}
                                      name="location"
                                      value={location}
                                      onChange={(e: any) => {
                                        let event = {
                                          target: {
                                            name: "location",
                                            value: e,
                                          },
                                        };
                                        setLocation(e);
                                        handleChange(event);
                                      }}
                                      defaultOptions
                                      loadOptions={locationsPromiseOptions}
                                      onInputChange={handleInputLocation}
                                      inputValue={locationInputValue}
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-12 col-md-12">
                                  <div className="form-group">
                                    <label>Project Site</label>
                                    <div className="row">
                                      <div className="col-lg-4 col-md-4 col-sm-4 col-4">
                                        <div className="custom-control custom-radio">
                                          <input
                                            type="radio"
                                            value="false"
                                            className="custom-control-input"
                                            id="offsite"
                                            name="on_site"
                                            onChange={handleChange}
                                            defaultChecked={
                                              values.on_site === "false"
                                            }
                                          />
                                          <label
                                            className="custom-control-label"
                                            htmlFor="offsite"
                                          >
                                            Offsite
                                          </label>
                                        </div>
                                      </div>
                                      <div className="col-lg-4 col-md-4 col-sm-4 col-4">
                                        <div className="custom-control custom-radio">
                                          <input
                                            type="radio"
                                            value="true"
                                            className="custom-control-input"
                                            id="onsite"
                                            name="on_site"
                                            onChange={handleChange}
                                            checked={values.on_site === "true"}
                                          />
                                          <label
                                            className="custom-control-label"
                                            htmlFor="onsite"
                                          >
                                            Onsite
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-12 col-md-12">
                                  <div className="form-group">
                                    <label>Nature of Employment</label>
                                    <div className="row">
                                      <div className="col-lg-4 col-md-4 col-sm-4 col-4">
                                        <div className="custom-control custom-radio">
                                          <input
                                            type="radio"
                                            className="custom-control-input"
                                            id="fulltime"
                                            value="FullTime"
                                            onChange={handleChange}
                                            checked={
                                              values.employment_type ===
                                              "FullTime"
                                            }
                                            name="employment_type"
                                            defaultChecked={
                                              formik.values.employment_type ===
                                              "FullTime"
                                            }
                                          />
                                          <label
                                            className="custom-control-label"
                                            htmlFor="fulltime"
                                          >
                                            Full Time
                                          </label>
                                        </div>
                                      </div>
                                      <div className="col-lg-4 col-md-4 col-sm-4 col-4">
                                        <div className="custom-control custom-radio">
                                          <input
                                            type="radio"
                                            className="custom-control-input"
                                            id="parttime"
                                            name="employment_type"
                                            value="PartTime"
                                            onChange={handleChange}
                                            checked={
                                              values.employment_type ===
                                              "PartTime"
                                            }
                                          />
                                          <label
                                            className="custom-control-label"
                                            htmlFor="parttime"
                                          >
                                            Part Time
                                          </label>
                                        </div>
                                      </div>
                                      <div className="col-lg-4 col-md-4 col-sm-4 col-4">
                                        <div className="custom-control custom-radio">
                                          <input
                                            type="radio"
                                            className="custom-control-input"
                                            value="contractual"
                                            id="contractual"
                                            name="employment_type"
                                            onChange={handleChange}
                                            checked={
                                              values.employment_type ===
                                              "contractual"
                                            }
                                          />
                                          <label
                                            className="custom-control-label"
                                            htmlFor="contractual"
                                          >
                                            Contractual
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-12 col-md-12">
                                  <div className="form-group">
                                    <label>Team Size</label>

                                    <Field
                                      placeholder="Select Team Size"
                                      className="dropstyle"
                                      styles={customStyles}
                                      maxMenuHeight={200}
                                      component={SelectField}
                                      name="team_size"
                                      options={createData(rows)}
                                      isClearable={true}
                                      value={teamSize}
                                      onChange={(option: any) => {
                                        setTeamSize(option);
                                        setFieldValue("team_size", option);
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-12 col-md-12">
                                  <div className="form-group">
                                    <label>Role</label>

                                    <AsyncCreatableSelect
                                      placeholder="Enter Role"
                                      components={components}
                                      cacheOptions
                                      isValidNewOption={isValidNewOption}
                                      noOptionsMessage={() =>
                                        "Enter keyword to search"
                                      }
                                      className="dropstyle"
                                      isClearable={true}
                                      name="name"
                                      value={role}
                                      onChange={(e: any) => {
                                        let event = {
                                          target: {
                                            name: "name",
                                            value: e,
                                          },
                                        };
                                        setRole(e);
                                        handleChange(event);
                                      }}
                                      defaultOptions
                                      loadOptions={loadRoleOptions}
                                    />
                                  </div>
                                </div>
                                <div className="col-lg-12 col-md-12">
                                  <div className="form-group">
                                    <label>Role Description</label>
                                    <textarea
                                      maxLength={250}
                                      style={{ resize: "none" }}
                                      name="roleDesc"
                                      value={formik.values.roleDesc}
                                      className="form-control"
                                      placeholder="Type Description"
                                      onChange={(e) => {
                                        setRoleDescCount(e.target.value.length);
                                        handleChange(e);
                                      }}
                                    ></textarea>
                                    <span
                                      className=""
                                      style={{
                                        display: "inline-block",
                                        fontSize: "0.85em",
                                        color: "grey",
                                      }}
                                    >
                                      {250 - roleDescCount} Character(s) Left
                                    </span>
                                  </div>
                                </div>
                                <div className="col-lg-12 col-md-12">
                                  <div className="form-group">
                                    <label>Skills Used</label>
                                    <AsyncCreatableSelect
                                      placeholder="Select Skills Used"
                                      cacheOptions
                                      noOptionsMessage={() =>
                                        "Enter keyword to search"
                                      }
                                      className="dropstyle"
                                      isClearable={true}
                                      name="skills"
                                      isMulti
                                      options={skills}
                                      value={skillsUsed}
                                      onChange={(e: any) => {
                                        let event = {
                                          target: {
                                            name: "skills",
                                            value: e,
                                          },
                                        };

                                        handleSkillInput(e);
                                        setFieldValue("skills", e);
                                        handleChange(event);
                                      }}
                                      defaultOptions
                                      loadOptions={debounceOptions}
                                      onInputChange={handleInputChange}
                                      inputValue={inputValue}
                                    />{" "}
                                    <span
                                      className=""
                                      style={{
                                        display: "inline-block",
                                        fontSize: "0.85em",
                                        color: "grey",
                                      }}
                                    >
                                      {500 - skillsCount} Character(s) Left
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="modal-custom-footer">
                        <button
                          type="button"
                          className="site-button site-warning-button"
                          onClick={() => {
                            handleSet();
                            formik.resetForm();
                            setFormValues(null);
                            handelCancelBtn();
                            trigger && trigger(false);
                          }}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="site-button">
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Modal>
              {hideProjectContent && (
                <>
                  {" "}
                  <div id="projects_bx" className="job-bx bg-white m-b30">
                    <div className="d-flex">
                      <h5 className="c_content_header">
                        Projects{" "}
                        <span className="font-14">
                          {pflStrength?.pflStrnRes?.data?.profileWeightage
                            ?.project
                            ? `(${pflStrength?.pflStrnRes?.data?.profileWeightage?.project}%)`
                            : ""}
                        </span>
                      </h5>

                      {projectDetails?.length <
                        environment.Jobseeker_Profile_Data_Limits
                          .projects_limit && (
                          <button
                            onClick={() => {
                              setShowMoreDetails(false);
                              setFormValues(null);
                              handleSet();
                              setProjects(true);
                              setCount(0);
                            }}
                            className="site-button add-btn button-sm"
                          >
                            Add
                          </button>
                        )}
                    </div>
                    <p className="c_content_desc">
                      Add details about projects you have done in college,
                      internship or at work.
                    </p>
                    {!loading && projectDetails ? (
                      <>
                        {projectDetails.map((project: any) => {
                          return (
                            <>
                              <div>
                                <b>
                                  <span className="c_content_subheader">
                                    {project?.title}
                                  </span>
                                </b>
                                <Link
                                  to={"#"}
                                  data-toggle="modal"
                                  className="edit-icon"
                                  data-target="#projects"
                                  title="Click here to update this Project"
                                  onClick={(e) => {
                                    e.preventDefault();

                                    setDisplayprojecttitle(project.title);
                                    setSkillsUsed(createData(project?.skills));
                                    if (
                                      GetYearFromTimeStamp(
                                        project?.start_ts
                                      ) === new Date().getFullYear()
                                    ) {
                                      setFromMonthData(
                                        GetFutureOrPastMonths(
                                          new Date().getFullYear(),
                                          fromMonthData,
                                          true
                                        )
                                      );
                                    } else {
                                      getMonthOptions();
                                    }
                                    if (
                                      project?.end_ts &&
                                      GetYearFromTimeStamp(project?.end_ts) ===
                                      new Date().getFullYear()
                                    ) {
                                      setToMonthData(
                                        GetFutureOrPastMonths(
                                          new Date().getFullYear(),
                                          toMonthData,
                                          true
                                        )
                                      );
                                    } else {
                                      getMonthOptions();
                                    }
                                    project?.skill?.length
                                      ? setSkillsCount(
                                        project?.skill?.join("")?.length
                                      )
                                      : setSkillsCount(0);
                                    setClient({
                                      label: project.client,
                                      value: project.client,
                                    });
                                    setStartMonth({
                                      label: project.start_ts
                                        ? GetMonthNameFromTimeStamp(
                                          project.start_ts,
                                          false
                                        )
                                        : "",
                                      value: project.start_ts
                                        ? GetMonthNameFromTimeStamp(
                                          project.start_ts,
                                          false,
                                          true
                                        )
                                        : "",
                                    });
                                    setCount(project?.desc?.length);
                                    setStartYear({
                                      label: project.start_ts
                                        ? `${GetYearFromTimeStamp(
                                          project.start_ts
                                        )}`
                                        : "",
                                      value: project.start_ts
                                        ? `${GetYearFromTimeStamp(
                                          project.start_ts
                                        )}`
                                        : "",
                                    });
                                    project?.end_ts
                                      ? setWorkTillYear({
                                        label: project.end_ts
                                          ? `${GetYearFromTimeStamp(
                                            project.end_ts
                                          )}`
                                          : "",
                                        value: project.end_ts
                                          ? `${GetYearFromTimeStamp(
                                            project.end_ts
                                          )}`
                                          : "",
                                      })
                                      : setWorkTillYear(null);

                                    project?.end_ts
                                      ? setWorkTillMonth({
                                        label: project.end_ts
                                          ? GetMonthNameFromTimeStamp(
                                            project.end_ts,
                                            false
                                          )
                                          : "",
                                        value: project.end_ts
                                          ? GetMonthNameFromTimeStamp(
                                            project.end_ts,
                                            false,
                                            true
                                          )
                                          : "",
                                      })
                                      : setWorkTillMonth(null);
                                    project?.role?.name
                                      ? setRole({
                                        label: project?.role?.name,
                                        value: project?.role?.name,
                                      })
                                      : setRole(null);

                                    project?.team_size
                                      ? setTeamSize({
                                        label: project?.team_size,
                                        value: project?.team_size,
                                      })
                                      : setTeamSize(null);
                                    setSkillsUsed(createData(project?.skill));
                                    setEducation(
                                      edu.find((ed: any) => {
                                        return project?.edu_id === ed?.value;
                                      })
                                    );
                                    project.location
                                      ? setLocation({
                                        label: project.location,
                                        value: project.location,
                                      })
                                      : setLocation(null);

                                    setFormValues({
                                      ...project,
                                      location: project.location
                                        ? {
                                          label: project.location,
                                          value: project.location,
                                        }
                                        : null,
                                      client: {
                                        label: project.client,
                                        value: project.client,
                                      },
                                      StartedFromYear: {
                                        label: `${GetYearFromTimeStamp(
                                          project?.start_ts
                                        )}`,
                                        value: `${GetYearFromTimeStamp(
                                          project?.start_ts
                                        )}`,
                                      },
                                      StartedFromMonth: {
                                        label: `${GetMonthNameFromTimeStamp(
                                          project?.start_ts,
                                          false
                                        )}`,
                                        value: `${GetMonthNameFromTimeStamp(
                                          project?.start_ts,
                                          false
                                        )}`,
                                      },
                                      WorkedTillYear: project.end_ts
                                        ? {
                                          label: `${GetYearFromTimeStamp(
                                            project?.end_ts
                                          )}`,
                                          value: `${GetYearFromTimeStamp(
                                            project?.end_ts
                                          )}`,
                                        }
                                        : null,
                                      WorkedTillMonth: project?.end_ts
                                        ? {
                                          label: `${GetMonthNameFromTimeStamp(
                                            project?.end_ts,
                                            false
                                          )}`,
                                          value: `${GetMonthNameFromTimeStamp(
                                            project?.end_ts,
                                            false
                                          )}`,
                                        }
                                        : null,
                                      name: project?.role?.name
                                        ? {
                                          label: project?.role?.name,
                                          value: project?.role?.name,
                                        }
                                        : null,
                                      roleDesc: project?.role?.desc,
                                      ProjectStatus: !project?.end_ts
                                        ? "In Progress"
                                        : "Finished",
                                      team_size: project?.team_size
                                        ? {
                                          label: project?.team_size,
                                          value: project?.team_size,
                                        }
                                        : null,
                                      skills: createData(project.skill),
                                      employment_type: project.emp_type,
                                      Education: edu?.find((ed: any) => {
                                        return ed?.value === project?.edu_id;
                                      })?.value,
                                      on_site: String(project?.on_site),
                                    });

                                    setProjects(true);
                                    setShowMoreDetails(true);
                                  }}
                                >
                                  <BsPencil />
                                </Link>
                              </div>
                              <div className="d-flex flex-column">
                                <span className="c_content_details">
                                  {project?.client} (
                                  {project?.location
                                    ? project?.location + ":"
                                    : null}{" "}
                                  {project?.on_site ? "OnSite" : "OffSite"})
                                </span>
                                <span className="c_content_details">
                                  {" "}
                                  {GetMonthNameFromTimeStamp(
                                    project?.start_ts
                                  ).substring(0, 3)}{" "}
                                  {GetYearFromTimeStamp(project?.start_ts)} to{" "}
                                  {project?.end_ts
                                    ? GetMonthNameFromTimeStamp(
                                      project?.end_ts
                                    ).substring(0, 3) +
                                    " " +
                                    GetYearFromTimeStamp(project?.end_ts)
                                    : " Present"}{" "}
                                  ({project?.emp_type}){" "}
                                </span>
                                <span
                                  style={{ wordWrap: "break-word" }}
                                  className="c_content_details"
                                >
                                  {project?.desc}
                                </span>
                              </div>
                              <br />
                            </>
                          );
                        })}
                      </>
                    ) : (
                      ""
                    )}
                  </div>{" "}
                </>
              )}
            </>
          );
        }}
      </Formik>
    </>
  );
}

export default Projects;
