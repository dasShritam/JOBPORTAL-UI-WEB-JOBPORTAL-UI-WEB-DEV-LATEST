import { Formik, useField } from "formik";

import { useEffect, useState, useRef } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Select from "react-select";
import * as Yup from "yup";
import numberToWords from "number-to-words";
import numWords from "num-words";
import {
  patchUpdateCareerProfile,
  resetCareerProfile,
} from "../../../../redux/features/manage-account/profile/CareerProfileSlice";
import { getJobSeekerrData } from "../../../../redux/features/manage-account/profile/JsSlice";
import {
  StateWiesPlaces,
  createData,
  customStyles,
} from "../../../../common/common";
import { UseToastAlert } from "../../../../hooks/useToastAlert";
import { BsPencil } from "react-icons/bs";
import {
  RollCategoryMasterData,
  RollMasterData,
} from "../../../../ApiCall/masterData";
import { profileStrength } from "../../../../redux/features/manage-account/profile/BasicDetailsSlice";
import { log } from "console";

export interface ExpertiseOption {
  readonly value: string;
  readonly label: string;
}

interface selectType {
  label: string;
  value: string;
}
const emptySelect: selectType = {
  label: "",
  value: "",
};

const INITIAL_VALUE = {
  currentIndustry: "",
  department: "",
  roleCategory: "",
  role: "",
  jobTypecheckbox: [],
  empTypecheckbox: [],
  preferedShift: "",
  currency: "",
  salary: "",
  preferedLocation: [],
};
type propsState = {
  displayModel?: boolean;
  trigger?: any;
};

function CareerProfile({ displayModel, trigger }: propsState) {
  const [ind, setInd] = useState(true);
  const [us, setUS] = useState(false);
  const [hideCareerContent, setHideCareerContent] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    setTimeout(() => {
      if (inputRef?.current) {
        inputRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 500);
  };

  const [roleCategoryMeta, setRoleCategoryMeta] = useState<any>([]);
  const [JobroleMeta, setJobRoleMeta] = useState<any>([]);

  const [industryState, setIndustryState] = useState<selectType | null>();
  const [departmentState, setDepartmentState] = useState<selectType | null>();
  const handleDepartmentStateChange = (option: any) => {
    setDepartmentState(option);
    handleRoleCategoryStateChange(emptySelect);
  };

  const [roleCategoryState, setRoleCategoryState] =
    useState<selectType | null>();
  const handleRoleCategoryStateChange = (option: any) => {
    setRoleCategoryState(option);

    handleRoleStateChange(emptySelect);
  };

  const [roleState, setRoleState] = useState<selectType | null>();
  const handleRoleStateChange = (option: any) => {
    setRoleState(option);
  };

  const [careerprofile, setCareerProfile] = useState<boolean>(false);
  const handleHideCareerProfile = () => {
    setCareerProfile(false);
  };

  const [formikData, setFormikData] = useState<any>({});
  const [selectDisable, setSelectDisable] = useState<boolean>(false);

  const [isSubmited, setIsSubmited] = useState<any>(false);

  const [formData, setFormData] = useState<any>({ ...INITIAL_VALUE });
  const [categoryValue, setCategoryValue] = useState<object>();
  const [roleCategoryValue, setRoleCategoryValue] = useState<object>();

  const [showmoney, setShowmoney] = useState(false);
  const career_profile_Detail = useSelector(
    (state: any) => state.careerProfile
  );
  const industry_master_data = useSelector((state: any) => state.industryType);
  const designation_master_data = useSelector(
    (state: any) => state.designation
  );
  const pflStrength = useSelector((state: any) => state.profileStrength);

  const [bindEmpData, setBindEmpData] = useState({
    currentIndustry: emptySelect,
    department: emptySelect,
    roleCategory: emptySelect,
    role: emptySelect,
    jobTypecheckbox: [],
    empTypecheckbox: [],
    preferedShift: "",
    currency: "",
    salary: "",
    preferedLocation: [],
  });
  const department_master_data = useSelector(
    (state: any) => state.departmentdata
  );

  const location_master_data = useSelector((state: any) => state.locationcity);

  const [sal, setSal] = useState<any>("");

  const JobSeekerProfileData = useSelector(
    (state: any) => state.JobSeekerProfile2
  );
  const { JobSeekerProfile, loading, error } = JobSeekerProfileData;
  const [currencyvalue, setCurrencyvalue] = useState<any>("en-IN");

  const setsalaryfunction = () => {
    JobSeekerProfile?.js_profile?.career_profile?.expected_ctc?.value
      ? setSal(
          nf.format(
            Number(
              JobSeekerProfile?.js_profile?.career_profile?.expected_ctc?.value
            )
          )
        )
      : setSal("");
  };

  const nf = new Intl.NumberFormat(currencyvalue, {
    // maximumFractionDigits: 2,
  });

  const ChangeSalary = (cValue, salary) => {
    const nf2 = new Intl.NumberFormat(cValue, {
      // maximumFractionDigits: 2,
    });

    setSal(nf2.format(salary.replace(/\,/g, "")));
    setCurrencyvalue(cValue);
  };

  const setcurrencyfunction = () => {
    setCurrencyvalue(
      JobSeekerProfile?.js_profile?.career_profile?.expected_ctc?.currency ==
        "USD"
        ? "en-US"
        : "en-IN"
    );
  };

  const [industrymasterData, setIndustrymasterData] = useState([
    { label: "", value: "" },
  ]);
  const [designationmasterDatas, setDesignationmasterDatas] = useState([
    { label: "", value: "" },
  ]);
  const [deptState, setDeptstate] = useState<any>([{ label: "", value: "" }]);
  const [locationstate, setLocationstate] = useState<any>();
  const masterdatafunction = (data: any) => {
    const dummy: any = [];
    data?.data?.map((d: any) => {
      dummy.push({ label: d, value: d });
    });
    setIndustrymasterData(dummy);
  };
  const departmentmasterdata = (data: any) => {
    setDeptstate(
      data?.map((d: any) => {
        return { label: d.name, value: d.id };
      })
    );
  };

  const locationmasterdata = (data: any) => {
    setLocationstate(
      data?.map((d: any, i: any) => {
        return { value: `${i}`, label: d };
      })
    );
  };
  const designationdatafunction = (data: any) => {
    const dummy: any = [];
    data?.map((d: any) => {
      dummy.push({ value: d, label: d });
    });
    setDesignationmasterDatas(dummy);
  };

  const getRoleCategories = async (
    value: string,
    valueBindRequired: boolean = false
  ) => {
    const data = { pageNo: -1, parent_id: value, active: 1 };
    const rc = await RollCategoryMasterData(data);
    const optionData = rc?.map((d: any, i: any) => {
      return { value: `${d.id}`, label: d.name };
    });
    setRoleCategoryMeta(optionData);

    if (valueBindRequired) {
      const roleInputData = optionData.find((d: any) => {
        return (
          JobSeekerProfile?.js_profile?.career_profile?.category === d.label
        );
      });

      setRoleCategoryState(roleInputData);
      getJobRole(roleInputData?.value, true);
    }
  };

  const getJobRole = async (
    value: string,
    valueBindRequired: boolean = false
  ) => {
    const data = { pageNo: -1, parent_id: value, active: 1 };
    const rm = await RollMasterData(data);
    const optionData = rm?.map((d: any, i: any) => {
      return { value: `${d.id}`, label: d.name };
    });
    setJobRoleMeta(optionData);

    if (valueBindRequired) {
      const jobInputData = optionData.find((d: any) => {
        return JobSeekerProfile?.js_profile?.career_profile?.role === d.label;
      });
      setRoleState(jobInputData);
    }
  };

  const setNumtoword = () => {
    if (
      JobSeekerProfile?.js_profile?.career_profile?.expected_ctc?.currency ==
      "USD"
    ) {
      setInd(false);
      setUS(true);
    } else {
      setInd(true);
      setUS(false);
    }
  };

  useEffect(() => {
    designationdatafunction(designation_master_data?.DesignationData);
    masterdatafunction(industry_master_data?.IndustryType);
    departmentmasterdata(department_master_data?.DepartmentData);
    locationmasterdata(location_master_data?.LocationcityData);
    setcurrencyfunction();
    setDepartmentState({
      label: JobSeekerProfile.js_profile?.career_profile?.dept,
      value: JobSeekerProfile.js_profile?.career_profile?.dept,
    });
    setRoleCategoryState({
      label: JobSeekerProfile.js_profile?.career_profile?.category,
      value: JobSeekerProfile.js_profile?.career_profile?.category,
    });
    setRoleState({
      label: JobSeekerProfile.js_profile?.career_profile?.role,
      value: JobSeekerProfile.js_profile?.career_profile?.role,
    });
    {
      setFormikData(() => {
        return {
          currentIndustry:
            JobSeekerProfile?.js_profile?.career_profile?.industry,
          department: JobSeekerProfile?.js_profile?.career_profile?.dept,
          roleCategory: JobSeekerProfile?.js_profile?.career_profile?.category,
          role: JobSeekerProfile?.js_profile?.career_profile?.role,
          jobTypecheckbox:
            JobSeekerProfile?.js_profile?.career_profile?.job_type,
          empTypecheckbox:
            JobSeekerProfile?.js_profile?.career_profile?.emp_type,
          preferedShift: JobSeekerProfile?.js_profile?.career_profile?.shift,
          currency:
            JobSeekerProfile?.js_profile?.career_profile?.expected_ctc
              ?.currency,
          salary:
            JobSeekerProfile?.js_profile?.career_profile?.expected_ctc?.value,
          preferedLocation: JobSeekerProfile?.js_profile?.career_profile
            ?.location
            ? JobSeekerProfile?.js_profile?.career_profile?.location
            : [],
        };
      });

      JobSeekerProfile?.js_profile?.career_profile &&
        setBindEmpData({
          currentIndustry: {
            label: JobSeekerProfile?.js_profile?.career_profile?.industry,
            value: JobSeekerProfile?.js_profile?.career_profile?.industry,
          },
          department: {
            label: JobSeekerProfile?.js_profile?.career_profile?.dept,
            value: JobSeekerProfile?.js_profile?.career_profile?.dept,
          },
          roleCategory: {
            label: JobSeekerProfile?.js_profile?.career_profile?.category,
            value: JobSeekerProfile?.js_profile?.career_profile?.category,
          },
          role: {
            label: JobSeekerProfile?.js_profile?.career_profile?.role,
            value: JobSeekerProfile?.js_profile?.career_profile?.role,
          },
          jobTypecheckbox:
            JobSeekerProfile?.js_profile?.career_profile?.job_type,
          empTypecheckbox:
            JobSeekerProfile?.js_profile?.career_profile?.emp_type,
          preferedShift: JobSeekerProfile?.js_profile?.career_profile?.shift,
          currency: JobSeekerProfile?.js_profile?.career_profile?.expected_ctc
            ?.currency
            ? JobSeekerProfile?.js_profile?.career_profile?.expected_ctc
                ?.currency
            : "IR",
          salary:
            JobSeekerProfile?.js_profile?.career_profile?.expected_ctc?.value,
          preferedLocation: JobSeekerProfile?.js_profile?.career_profile
            ?.location
            ? JobSeekerProfile?.js_profile?.career_profile?.location
            : [],
        });
    }
    setIndustryState({
      label: JobSeekerProfile?.js_profile?.career_profile?.industry,
      value: JobSeekerProfile?.js_profile?.career_profile?.industry,
    });

    setsalaryfunction();
  }, [JobSeekerProfile.js_profile?.career_profile]);

  const showSnackAlert = UseToastAlert();
  useEffect(() => {
    {
      if (career_profile_Detail?.UpdatedCareerProfile?.code === 200) {
        showSnackAlert(
          "success",
          career_profile_Detail.UpdatedCareerProfile.message
        );
        dispatch(getJobSeekerrData());
        dispatch(resetCareerProfile());
        dispatch(profileStrength());
      }
    }
  }, [career_profile_Detail?.UpdatedCareerProfile]);

  useEffect(() => {
    if (isSubmited) setFormData(formData);

    setFormData(JobSeekerProfile?.js_profile?.career_profile);
  }, [isSubmited, JobSeekerProfile?.js_profile?.career_profile]);
  const dispatch = useDispatch();

  const SignupSchema = Yup.object().shape({
    currentIndustry: Yup.object().required("Please select Industry."),
    department: Yup.object().required("Please select Department."),
    roleCategory: Yup.object().required("Please select Role Category."),
    role: Yup.object().required("Please select Job Role."),
    desiredJobType: Yup.array(),
    desiredEmpType: Yup.array(),
    preferedShift: Yup.string(),
    currency: Yup.string().notRequired(),
    salary: Yup.string().nullable(),
    preferedLocation: Yup.array(),
  });

  const resetFromHandler = (reset: Function, values: any) => {
    isSubmited || setFormData({ ...INITIAL_VALUE });
  };

  const limitLocation = (e: any) => {
    if (e?.length >= 9) {
      setSelectDisable(true);
    }
    if (e?.length <= 9) {
      setSelectDisable(false);
    }
  };

  const onLocationSelectHandler = (
    values: any,
    location: string,
    type: string
  ) => {
    switch (type) {
      case "select-option":
        if (!values?.preferedLocation?.length) {
          values.preferedLocation = [];
        }

        if (!values?.preferedLocation?.includes(location)) {
          values.preferedLocation = [...values?.preferedLocation, location];
        }
        return;
      case "remove-value":
        let locations = values?.preferedLocation?.filter(
          (loc: string) => loc !== location
        );
        values.preferedLocation = locations;
        return;

      default:
        return;
    }
  };

  const bindDataOnEdit = () => {
    setRoleCategoryState({
      label: JobSeekerProfile.js_profile?.career_profile?.category,
      value: JobSeekerProfile.js_profile?.career_profile?.category,
    });
    setCareerProfile(true);
    setFormikData(() => {
      return {
        currentIndustry: JobSeekerProfile.js_profile?.career_profile?.industry,
        department: JobSeekerProfile.js_profile?.career_profile?.dept,
        roleCategory: JobSeekerProfile.js_profile?.career_profile?.category,
        role: JobSeekerProfile.js_profile?.career_profile?.role,
        jobTypecheckbox: JobSeekerProfile.js_profile?.career_profile?.job_type,
        empTypecheckbox: JobSeekerProfile.js_profile?.career_profile?.emp_type,
        preferedShift: JobSeekerProfile.js_profile?.career_profile?.shift,
        currency: JobSeekerProfile.js_profile?.career_profile?.expected_ctc
          ?.currency
          ? JobSeekerProfile.js_profile?.career_profile?.expected_ctc?.currency
          : "IR",
        salary:
          JobSeekerProfile.js_profile?.career_profile?.expected_ctc?.value,
        preferedLocation: JobSeekerProfile.js_profile?.career_profile?.location
          ? JobSeekerProfile.js_profile?.career_profile?.location
          : [],
      };
    });
  };

  const [salary, setSalary] = useState<any>(null);
  const [dis, setDis] = useState<any>();
  useEffect(() => {
    if (typeof salary === "number") setDis(true);
    else if (typeof salary === "string") setDis(false);
    else setDis(false);
  }, [salary, setDis]);

  const handleSalaryChangeInWords = (event) => {
    const newSalary = Number(event.target.value.replace(/\,/g, ""));
    setSalary(newSalary);
  };

  const getRupeeText = () => {
    if (salary) {
      if (sal == 0) {
        return;
      }
      const convertedSalary = `${numWords(salary)?.toLowerCase()}`;
      const capitalizedSalary =
        convertedSalary?.charAt(0).toUpperCase() + convertedSalary?.slice(1);
      return capitalizedSalary;
    }
  };

  const getDollarText = () => {
    if (!Number.isNaN(salary) && salary) {
      const convertedSalary = `${numberToWords
        ?.toWords(salary)
        ?.toLowerCase()}`;
      const capitalizedSalary =
        convertedSalary.charAt(0).toUpperCase() + convertedSalary.slice(1);
      return capitalizedSalary + " " + "dollars";
    }
  };

  const bindSelectControlValues = async () => {
    bindDataOnEdit();
    if (
      JobSeekerProfile?.js_profile?.career_profile?.expected_ctc?.currency ==
      "USD"
    ) {
      setInd(false);
      setUS(true);
    } else {
      setInd(true);
      setUS(false);
    }

    setsalaryfunction();

    setNumtoword();
    if (JobSeekerProfile.js_profile?.career_profile?.industry != undefined) {
      const deptInputData = deptState.find((d: any) => {
        return JobSeekerProfile?.js_profile?.career_profile?.dept === d.label;
      });
      setDepartmentState(deptInputData);
      await getRoleCategories(deptInputData?.value, true);
    } else {
      setIndustryState(null);
      setDepartmentState(null);
      setRoleCategoryState(null);
      setRoleState(null);
    }
  };
  useEffect(() => {
    if (displayModel == true) {
      setCareerProfile(true);
      setHideCareerContent(false);
    } else {
      setHideCareerContent(true);
    }
  }, [displayModel]);
  useEffect(() => {}, [departmentState, roleCategoryMeta]);

  return (
    <>
      <Formik
        initialValues={bindEmpData}
        enableReinitialize={true}
        validationSchema={SignupSchema}
        onSubmit={(values) => {
          setShowmoney(false);
          values?.salary && typeof values?.salary !== "number"
            ? (values.salary = values.salary.replace(/\,/g, ""))
            : (values.salary = values.salary);
          let obj = {
            currentIndustry: values?.currentIndustry?.label,
            department: departmentState?.label,
            roleCategory: roleCategoryState?.label,
            jobRole: roleState?.label,
            jobTypecheckbox: values.jobTypecheckbox,
            empTypecheckbox: values.empTypecheckbox,
            preferedShift: values.preferedShift,
            exp_ctc: {
              currency: values.currency,
              val: values.salary,
            },
            preferedLocation: values.preferedLocation,
          };
          setCareerProfile(false);
          dispatch(patchUpdateCareerProfile(obj));
        }}
      >
        {(formik: any) => {
          const {
            values,
            handleSubmit,
            handleChange,
            errors,
            touched,
            handleBlur,
            isValid,
            resetForm,
          } = formik;
          if (values.department.label == undefined) values.department = "";
          if (industryState?.label == undefined) values.currentIndustry = "";

          return (
            <>
              <Modal
                className="modal fade browse-job modal-bx-info editor mt-4"
                show={careerprofile}
                backdrop="static"
                onHide={() => {
                  handleHideCareerProfile();
                  trigger && trigger(false);
                  resetFromHandler(resetForm, values);
                }}
              >
                <div className="modal-dialog my-0" role="document">
                  <div className="modal-content">
                    <div className="modal-body">
                      <div className="modal-custom-header">
                        <h5
                          className="modal-title"
                          id="DesiredprofileModalLongTitle"
                        >
                          Career Profile
                        </h5>

                        <button
                          type="button"
                          className="close"
                          onClick={() => {
                            setCareerProfile(false);
                            setcurrencyfunction();
                            setShowmoney(false);
                            resetForm();
                            trigger && trigger(false);

                            isSubmited || resetFromHandler(resetForm, values);
                          }}
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <form onSubmit={handleSubmit}>
                        <div className="row">
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>
                                Current Industry
                                <span className="form-error"> *</span>
                              </label>
                              <Select
                                placeholder="Select Industry"
                                isSearchable={true}
                                isClearable={false}
                                isDisabled={false}
                                maxMenuHeight={200}
                                options={industrymasterData}
                                value={
                                  industryState?.value == undefined
                                    ? ""
                                    : industryState
                                }
                                className="dropstyle"
                                styles={customStyles}
                                name="currentIndustry"
                                onChange={(option: any) => {
                                  let event = {
                                    target: {
                                      name: "currentIndustry",
                                      value: option,
                                    },
                                  };
                                  handleChange(event);
                                  setIndustryState(option);
                                }}
                              />

                              {errors.currentIndustry &&
                                touched.currentIndustry && (
                                  <p className="form-error">
                                    {errors.currentIndustry}
                                  </p>
                                )}
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>
                                Department <span className="form-error">*</span>
                              </label>
                              <Select
                                placeholder="Select Department"
                                isSearchable={true}
                                isClearable={false}
                                isDisabled={false}
                                maxMenuHeight={200}
                                options={deptState}
                                value={departmentState}
                                className="dropstyle"
                                styles={customStyles}
                                name="department"
                                onChange={(option: any) => {
                                  let event = {
                                    target: {
                                      name: "department",
                                      value: option,
                                    },
                                  };
                                  handleDepartmentStateChange(option);
                                  getRoleCategories(option.value);
                                  handleChange(event);
                                  values.roleCategory = "";
                                  values.role = "";
                                }}
                              />
                              {errors.department && touched.department ? (
                                <p className="form-error">
                                  {errors.department}
                                </p>
                              ) : null}
                            </div>
                          </div>
                          {departmentState && departmentState.label ? (
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>
                                  Role Category{" "}
                                  <span className="form-error">*</span>
                                </label>
                                <Select
                                  placeholder="Select Role Category"
                                  isSearchable={true}
                                  isClearable={false}
                                  isDisabled={false}
                                  maxMenuHeight={200}
                                  options={roleCategoryMeta}
                                  value={
                                    roleCategoryState?.label === ""
                                      ? roleCategoryState?.label
                                      : roleCategoryState
                                  }
                                  className="dropstyle"
                                  styles={customStyles}
                                  name="roleCategory"
                                  onChange={(option: any) => {
                                    let event = {
                                      target: {
                                        name: "roleCategory",
                                        value: option,
                                      },
                                    };
                                    handleRoleCategoryStateChange(option);
                                    getJobRole(option.value);
                                    handleChange(event);
                                    values.role = "";
                                  }}
                                />
                                {errors.roleCategory && touched.roleCategory ? (
                                  <p className="form-error">
                                    {errors.roleCategory}
                                  </p>
                                ) : null}
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                          {roleCategoryState && roleCategoryState.label ? (
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>
                                  Job Role <span className="form-error">*</span>
                                </label>
                                <Select
                                  placeholder="Select Job Role"
                                  isSearchable={true}
                                  isClearable={false}
                                  isDisabled={false}
                                  maxMenuHeight={200}
                                  options={JobroleMeta}
                                  value={
                                    roleState?.value == ""
                                      ? roleState?.value
                                      : roleState
                                  }
                                  className="dropstyle"
                                  styles={customStyles}
                                  name="role"
                                  onChange={(option: any) => {
                                    let event = {
                                      target: { name: "role", value: option },
                                    };
                                    handleRoleStateChange(option);
                                    handleChange(event);
                                  }}
                                />

                                {errors.role && touched.role ? (
                                  <p className="form-error">{errors.role}</p>
                                ) : null}
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>Desired Job Type</label>
                              <div className="row">
                                <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                                  <div className="custom-control custom-checkbox">
                                    <input
                                      type="checkbox"
                                      className="custom-control-input"
                                      id="Permanent"
                                      name="jobTypecheckbox"
                                      value={"Permanent"}
                                      onChange={handleChange}
                                      checked={values.jobTypecheckbox?.includes(
                                        "Permanent"
                                      )}
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="Permanent"
                                    >
                                      Permanent
                                    </label>
                                  </div>
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                                  <div className="custom-control custom-checkbox">
                                    <input
                                      type="checkbox"
                                      className="custom-control-input"
                                      id="contractual"
                                      name="jobTypecheckbox"
                                      value={"Contractual"}
                                      onChange={handleChange}
                                      checked={values.jobTypecheckbox?.includes(
                                        "Contractual"
                                      )}
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
                              <label>Desired Employment Type</label>
                              <div className="row">
                                <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                                  <div className="custom-control custom-checkbox">
                                    <input
                                      type="checkbox"
                                      className="custom-control-input"
                                      id="fulltime"
                                      name="empTypecheckbox"
                                      value={"Full Time"}
                                      onChange={handleChange}
                                      checked={values.empTypecheckbox?.includes(
                                        "Full Time"
                                      )}
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="fulltime"
                                    >
                                      Full Time
                                    </label>
                                  </div>
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                                  <div className="custom-control custom-checkbox">
                                    <input
                                      type="checkbox"
                                      className="custom-control-input"
                                      id="parttime"
                                      name="empTypecheckbox"
                                      value={"Part Time"}
                                      onChange={handleChange}
                                      checked={values.empTypecheckbox?.includes(
                                        "Part Time"
                                      )}
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="parttime"
                                    >
                                      Part Time
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>Preferred Shift</label>
                              <div className="row">
                                <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                                  <div className="custom-control custom-radio">
                                    <input
                                      type="radio"
                                      className="custom-control-input"
                                      id="day"
                                      name="preferedShift"
                                      onChange={handleChange}
                                      value="Day"
                                      checked={values.preferedShift === "Day"}
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="day"
                                    >
                                      Day
                                    </label>
                                  </div>
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                                  <div className="custom-control custom-radio">
                                    <input
                                      type="radio"
                                      className="custom-control-input"
                                      id="night"
                                      name="preferedShift"
                                      onChange={handleChange}
                                      value="Night"
                                      checked={values.preferedShift === "Night"}
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="night"
                                    >
                                      Night
                                    </label>
                                  </div>
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                                  <div className="custom-control custom-radio">
                                    <input
                                      type="radio"
                                      className="custom-control-input"
                                      id="flexible"
                                      name="preferedShift"
                                      onChange={handleChange}
                                      value="Flexible"
                                      checked={
                                        values.preferedShift === "Flexible"
                                      }
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="flexible"
                                    >
                                      Flexible
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>Expected Salary</label>
                              <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                  <div className="custom-control custom-radio">
                                    <input
                                      type="radio"
                                      className="custom-control-input"
                                      id="rupees"
                                      name="currency"
                                      value="IR"
                                      onChange={(e: any) => {
                                        handleChange(e);
                                        setTimeout(() => {
                                          setInd(true);
                                          setUS(false);
                                          setShowmoney(true);
                                          ChangeSalary("en-IN", sal);
                                        }, 0);
                                      }}
                                      checked={values.currency === "IR"}
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="rupees"
                                    >
                                      Indian Rupees
                                    </label>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                  <div className="custom-control custom-radio">
                                    <input
                                      type="radio"
                                      className="custom-control-input"
                                      id="usdollars"
                                      name="currency"
                                      value="USD"
                                      onChange={(e: any) => {
                                        handleChange(e);

                                        setTimeout(() => {
                                          ChangeSalary("en-US", sal);
                                          setInd(false);
                                          setUS(true);
                                          setShowmoney(true);
                                        }, 0);
                                      }}
                                      checked={values.currency === "USD"}
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="usdollars"
                                    >
                                      US Dollars
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-6">
                            <div className="form-group">
                              <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                  <input
                                    type="text"
                                    min={0}
                                    className="form-control"
                                    name="salary"
                                    maxLength={11}
                                    onInput={(e: any) => {
                                      if (/^[0-9,]+$/.test(e.target.value)) {
                                        setShowmoney(true);
                                        handleChange(e);
                                        handleSalaryChangeInWords(e);
                                        e.target.value = nf.format(
                                          e.target.value.replace(/\,/g, "")
                                        );
                                        setSal(e.target.value);
                                        values.salary = e.target.value;
                                      } else if (e.target.value?.length == 0) {
                                        setSal("");
                                        setSalary("");
                                        values.salary = "";
                                      } else {
                                        setSalary("");
                                      }
                                    }}
                                    placeholder="E.g. 4,50,000"
                                    value={sal != 0 ? sal : ""}
                                  />
                                  {ind && showmoney && sal != 0 && (
                                    <p
                                      className="fs-6  text-success"
                                      style={{ fontSize: "80%" }}
                                    >
                                      {getRupeeText()
                                        ? getRupeeText() + " Rupees"
                                        : ""}
                                    </p>
                                  )}
                                  {us && showmoney && sal != 0 && (
                                    <p
                                      className="fs-6  text-success"
                                      style={{ fontSize: "80%" }}
                                    >
                                      {getDollarText()}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>Preferred Work Location (Max 10)</label>
                              <Select
                                defaultValue={locationstate?.filter(
                                  (city: any) =>
                                    values?.preferedLocation?.includes(
                                      city?.label
                                    )
                                )}
                                isOptionDisabled={() => selectDisable}
                                isMulti={true}
                                isClearable={false}
                                maxMenuHeight={200}
                                name="preferedLocation"
                                placeholder="Tell us your location preferences to work"
                                options={locationstate}
                                className="dropstyle"
                                styles={customStyles}
                                menuPlacement="top"
                                onChange={(e: any, actionObject: any) => {
                                  switch (actionObject.action) {
                                    case "select-option":
                                      limitLocation(e);
                                      onLocationSelectHandler(
                                        values,
                                        actionObject?.option?.label,
                                        actionObject?.action
                                      );
                                      return;
                                    case "remove-value":
                                      limitLocation(e);
                                      onLocationSelectHandler(
                                        values,
                                        actionObject.removedValue.label,
                                        actionObject.action
                                      );
                                      break;
                                    default:
                                      break;
                                  }
                                }}
                              />
                              <div ref={inputRef} />
                            </div>
                          </div>
                        </div>
                        <div className="modal-custom-footer">
                          <button
                            type="button"
                            className="site-button site-warning-button"
                            onClick={() => {
                              isSubmited || resetFromHandler(resetForm, values);
                              setCareerProfile(false);
                              resetForm();
                              setShowmoney(false);
                              setcurrencyfunction();
                              trigger && trigger(false);
                            }}
                          >
                            Cancel
                          </button>
                          <button type="submit" className="site-button m-1">
                            Save
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </Modal>

              {hideCareerContent && (
                <div
                  id="desired_career_profile_bx"
                  className="job-bx bg-white m-b30"
                >
                  <div className="d-flex">
                    <h5 className="c_content_header">
                      Career Profile
                      <span className="font-14 ">
                        {/* {`(${
                        Number(pflStrength?.pflStrnRes?.data?.profileWeightage?.des_job_loc) +
                        Number(pflStrength?.pflStrnRes?.data?.profileWeightage?.dept) +
                        Number(pflStrength?.pflStrnRes?.data?.profileWeightage?.ind_type)
                      }%)`} */}
                        {pflStrength?.pflStrnRes?.data?.profileWeightage
                          ? ` (${
                              Number(
                                pflStrength?.pflStrnRes?.data?.profileWeightage
                                  ?.des_job_loc
                              ) +
                              Number(
                                pflStrength?.pflStrnRes?.data?.profileWeightage
                                  ?.dept
                              ) +
                              Number(
                                pflStrength?.pflStrnRes?.data?.profileWeightage
                                  ?.ind_type
                              )
                            }%)`
                          : ""}
                      </span>
                    </h5>
                    <Link
                      to={"#"}
                      title="Click here to edit career profile."
                      onClick={(e: any) => {
                        e.preventDefault();
                        values.roleCategory = {
                          label:
                            JobSeekerProfile?.js_profile?.career_profile
                              ?.category,
                          value:
                            JobSeekerProfile?.js_profile?.career_profile
                              ?.category,
                        };
                        values.role = {
                          label:
                            JobSeekerProfile?.js_profile?.career_profile?.role,
                          value:
                            JobSeekerProfile?.js_profile?.career_profile?.role,
                        };

                        values.preferedLocation =
                          JobSeekerProfile.js_profile?.career_profile?.location;
                        bindSelectControlValues();
                        setIndustryState({
                          label:
                            JobSeekerProfile.js_profile?.career_profile
                              ?.industry,
                          value:
                            JobSeekerProfile.js_profile?.career_profile
                              ?.industry,
                        });
                        JobSeekerProfile.js_profile?.career_profile?.industry ==
                          undefined && resetForm();
                      }}
                      className="edit-icon"
                    >
                      <BsPencil />
                    </Link>
                  </div>

                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-6">
                      <div
                        className="clearfix m-b20 "
                        style={{ marginTop: "-22px" }}
                      >
                        <br />
                        <span className="clearfix font-13">
                          Current Industry
                        </span>
                        <label>
                          {formikData.currentIndustry ? (
                            formikData.currentIndustry
                          ) : (
                            <Link
                              to={"#"}
                              onClick={() => {
                                values.roleCategory = {
                                  label:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.category,
                                  value:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.category,
                                };
                                values.role = {
                                  label:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.role,
                                  value:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.role,
                                };
                                setCareerProfile(true);
                                bindSelectControlValues();
                                values.preferedLocation = JobSeekerProfile
                                  .js_profile?.career_profile?.location
                                  ? JobSeekerProfile.js_profile?.career_profile
                                      ?.location
                                  : [];
                              }}
                            >
                              Add current Industry
                            </Link>
                          )}
                        </label>
                      </div>
                      <div className="clearfix m-b20">
                        <span className="clearfix font-13">Role Category</span>
                        <label>
                          {formikData.roleCategory ? (
                            formikData.roleCategory
                          ) : (
                            <Link
                              to={"#"}
                              onClick={() => {
                                values.roleCategory = {
                                  label:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.category,
                                  value:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.category,
                                };
                                values.role = {
                                  label:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.role,
                                  value:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.role,
                                };
                                setCareerProfile(true);
                                bindSelectControlValues();
                                values.preferedLocation = JobSeekerProfile
                                  .js_profile?.career_profile?.location
                                  ? JobSeekerProfile.js_profile?.career_profile
                                      ?.location
                                  : [];
                              }}
                            >
                              Add Role Category
                            </Link>
                          )}
                        </label>
                      </div>
                      <div className="clearfix m-b20">
                        <span className="clearfix font-13">
                          Desired Job Type
                        </span>
                        <label>
                          {formikData?.jobTypecheckbox?.length != 0 ? (
                            formikData.jobTypecheckbox?.join(", ")
                          ) : (
                            <Link
                              to={"#"}
                              onClick={() => {
                                values.roleCategory = {
                                  label:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.category,
                                  value:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.category,
                                };
                                values.role = {
                                  label:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.role,
                                  value:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.role,
                                };
                                setCareerProfile(true);
                                bindSelectControlValues();

                                values.preferedLocation = JobSeekerProfile
                                  .js_profile?.career_profile?.location
                                  ? JobSeekerProfile.js_profile?.career_profile
                                      ?.location
                                  : [];
                              }}
                            >
                              Add Desired Job Type
                            </Link>
                          )}
                        </label>
                      </div>
                      <div className="clearfix m-b20">
                        <span className="clearfix font-13">
                          Preferred Shift
                        </span>
                        <label>
                          {formikData.preferedShift ? (
                            formikData.preferedShift
                          ) : (
                            <Link
                              to={"#"}
                              onClick={() => {
                                values.roleCategory = {
                                  label:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.category,
                                  value:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.category,
                                };
                                values.role = {
                                  label:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.role,
                                  value:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.role,
                                };
                                setCareerProfile(true);
                                bindSelectControlValues();
                                values.preferedLocation = JobSeekerProfile
                                  .js_profile?.career_profile?.location
                                  ? JobSeekerProfile.js_profile?.career_profile
                                      ?.location
                                  : [];
                              }}
                            >
                              Add Preferred Shift
                            </Link>
                          )}
                        </label>
                      </div>
                      <div className="clearfix m-b20">
                        <span className="clearfix font-13">
                          Expected Salary
                        </span>
                        <label>
                          {formikData?.salary ? (
                            <>
                              {formikData?.currency === "IR" ? "₹ " : "$ "}{" "}
                              {nf.format(Number(formikData?.salary))}{" "}
                            </>
                          ) : (
                            <Link
                              to={"#"}
                              onClick={() => {
                                values.roleCategory = {
                                  label:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.category,
                                  value:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.category,
                                };
                                values.role = {
                                  label:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.role,
                                  value:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.role,
                                };
                                handleClick();
                                setCareerProfile(true);
                                bindSelectControlValues();
                                values.preferedLocation = JobSeekerProfile
                                  .js_profile?.career_profile?.location
                                  ? JobSeekerProfile.js_profile?.career_profile
                                      ?.location
                                  : [];
                              }}
                            >
                              Add Expected Salary
                            </Link>
                          )}
                        </label>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-6">
                      <div className="clearfix m-b20">
                        <span className="clearfix font-13">Department</span>
                        <label>
                          {formikData.department ? (
                            formikData.department
                          ) : (
                            <Link
                              to={"#"}
                              onClick={() => {
                                values.roleCategory = {
                                  label:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.category,
                                  value:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.category,
                                };
                                values.role = {
                                  label:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.role,
                                  value:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.role,
                                };
                                setCareerProfile(true);
                                bindSelectControlValues();
                                values.preferedLocation = JobSeekerProfile
                                  .js_profile?.career_profile?.location
                                  ? JobSeekerProfile.js_profile?.career_profile
                                      ?.location
                                  : [];
                              }}
                            >
                              Add Department
                            </Link>
                          )}
                        </label>
                      </div>
                      <div className="clearfix m-b20">
                        <span className="clearfix font-13">Job Role</span>
                        <label>
                          {formikData.role ? (
                            formikData.role
                          ) : (
                            <Link
                              to={"#"}
                              onClick={() => {
                                values.roleCategory = {
                                  label:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.category,
                                  value:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.category,
                                };
                                values.role = {
                                  label:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.role,
                                  value:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.role,
                                };
                                setCareerProfile(true);
                                bindSelectControlValues();
                                values.preferedLocation = JobSeekerProfile
                                  .js_profile?.career_profile?.location
                                  ? JobSeekerProfile.js_profile?.career_profile
                                      ?.location
                                  : [];
                              }}
                            >
                              Add job role
                            </Link>
                          )}
                        </label>
                      </div>
                      <div className="clearfix m-b20">
                        <span className="clearfix font-13">
                          Desired Employment Type
                        </span>
                        <label>
                          {formikData?.empTypecheckbox?.length != 0 ? (
                            formikData?.empTypecheckbox
                              ?.filter(String)
                              .join(", ")
                          ) : (
                            <Link
                              to={"#"}
                              onClick={() => {
                                values.roleCategory = {
                                  label:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.category,
                                  value:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.category,
                                };
                                values.role = {
                                  label:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.role,
                                  value:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.role,
                                };
                                setCareerProfile(true);
                                bindSelectControlValues();
                                values.preferedLocation = JobSeekerProfile
                                  .js_profile?.career_profile?.location
                                  ? JobSeekerProfile.js_profile?.career_profile
                                      ?.location
                                  : [];
                              }}
                            >
                              Add Desired Employment Type
                            </Link>
                          )}
                        </label>
                      </div>
                      <div className="clearfix m-b20">
                        <span className="clearfix font-13">
                          Preferred Work Location
                        </span>
                        <label>
                          {formikData?.preferedLocation?.length != 0 ? (
                            StateWiesPlaces(formikData?.preferedLocation)?.join(
                              " | "
                            )
                          ) : (
                            <Link
                              to={"#"}
                              onClick={() => {
                                values.roleCategory = {
                                  label:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.category,
                                  value:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.category,
                                };
                                values.role = {
                                  label:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.role,
                                  value:
                                    JobSeekerProfile?.js_profile?.career_profile
                                      ?.role,
                                };
                                handleClick();
                                setCareerProfile(true);
                                bindSelectControlValues();
                                values.preferedLocation = JobSeekerProfile
                                  .js_profile?.career_profile?.location
                                  ? JobSeekerProfile.js_profile?.career_profile
                                      ?.location
                                  : [];
                              }}
                            >
                              Add Preferred Work Location
                            </Link>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          );
        }}
      </Formik>
    </>
  );
}

export default CareerProfile;
