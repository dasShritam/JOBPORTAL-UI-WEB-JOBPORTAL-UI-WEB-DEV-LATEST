import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import "../../../../assets/customCss/ItSkills.css";
import { environment } from "../../../../environments/environment";
import { Content, customStyles } from "../../../../common/common";
import Select from "react-select";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { UseToastAlert } from "../../../../hooks/useToastAlert";
import { getJobSeekerrData } from "../../../../redux/features/manage-account/profile/JsSlice";
import {
  postITSkillDetails,
  deleteITSkillDetails,
  resetITSkillsSl,
  resetDeleteItSkillsSl,
} from "../../../../redux/features/manage-account/profile/ItSkillSlice";
import { BsPencil } from "react-icons/bs";
import "../../../../assets/customCss/Projects.css";
import AsyncCreatableSelect from "react-select/async-creatable";

interface ColourOption {
  label: string;
  value: string;
}

interface skill {
  _id: string;
  name: string;
  version: string;
  last_used: string | number;
  experience: {
    month: any;
    year: string | number;
  };
}
const IntialValueForm = {
  _id: "",
  name: "",
  ver: "",
  last_used: "",
  ExperienceYear: "",
  ExperienceMonth: "",
};

const SignupSchema = Yup.object().shape({
  name: Yup.object().required("Please enter Skill/Software Name.").nullable(),
  ver: Yup.string().notRequired().nullable(),
  last_used: Yup.object().notRequired().nullable(),
  ExperienceYear: Yup.object().notRequired().nullable(),
  ExperienceMonth: Yup.object().notRequired().nullable(),
});

function ItSkills() {
  const [itskills, setItSkills] = useState(false);
  const handleHideItSkills = () => {
    setItSkills(false);
  };
  const [skill, setSkill] = useState<skill[]>([]);
  const [editValue, setEditValue] = useState<any | undefined | null>();
  const dispatch = useDispatch();
  const showSnackAlert = UseToastAlert();

  const components = {
    DropdownIndicator: null,
  };

  const itSkillData = useSelector((state: any) => state.itSkill);
  const { ItSkillResponse, itSkillLoading } = itSkillData;

  const deleteItSkills = useSelector(
    (state: any) => state.DeleteITSkillDetails
  );
  const JobSeekerProfileData = useSelector(
    (state: any) => state.JobSeekerProfile2
  );

  /* skills master data */

  const textlmt = 28;
  const skillsmasterData = useSelector((state: any) => state.skills);
  const { SkillsData } = skillsmasterData;
  const [skillMeta, setSkillMeta] = useState<any>([]);
  useEffect(() => {
    if (SkillsData.length > 0) {
      const data = SkillsData?.map((c: any) => {
        return {
          label: c,
          value: c,
        };
      });
      setSkillMeta(data);
    }
  }, [SkillsData]);

  const filterColors = (inputValue: string) => {
    return skillMeta.filter((i) =>
      i.label?.toLowerCase().includes(inputValue?.toLowerCase())
    );
  };
  const promiseOptions = (inputValue: string) =>
    new Promise<ColourOption[]>((resolve) => {
      setTimeout(() => {
        resolve(filterColors(inputValue));
      }, 1000);
    });

  const { JobSeekerProfile, loading } = JobSeekerProfileData;
  const { response } = deleteItSkills;

  useEffect(() => {
    if (response.code === 200) {
      dispatch(getJobSeekerrData());
      showSnackAlert("success", response.message);
      dispatch(resetDeleteItSkillsSl());
    } else if (
      deleteItSkills &&
      deleteItSkills.response &&
      deleteItSkills.response.response &&
      deleteItSkills.response?.code !== 200
    ) {
      showSnackAlert("warning", response.message);
      dispatch(resetDeleteItSkillsSl());
    }
  }, [response.code, deleteItSkills?.response?.code, response]);

  useEffect(() => {
    if (ItSkillResponse.message) {
      if (!itSkillLoading && ItSkillResponse.code == 200) {
        showSnackAlert("success", ItSkillResponse.message);
        dispatch(getJobSeekerrData());
        dispatch(resetITSkillsSl());
      }
      if (
        ItSkillResponse &&
        ItSkillResponse?.response &&
        ItSkillResponse.response.data &&
        ItSkillResponse.response.data.code !== 206
      ) {
        showSnackAlert("warning", ItSkillResponse.response.data.message);
        dispatch(resetITSkillsSl());
      }
    }
  }, [ItSkillResponse?.code, itSkillLoading]);

  useEffect(() => {
    if (JobSeekerProfile?.js_profile?.skills) {
      setSkill(JobSeekerProfile?.js_profile?.skills?.it);
    }
  }, [JobSeekerProfile.js_profile, response]);

  const handleDeleteItSkill = (values) => {
    const id = values._id;
    dispatch(deleteITSkillDetails(id));
    setEditValue(null);
  };

  const handleDeleteSwal = (values) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted,You will not be able to recover this Record!",
      showCancelButton: true,
      confirmButtonColor: "#2a9f2a ",
      cancelButtonColor: "#db1919 ",
      confirmButtonText: "Yes, Delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteItSkill(values);
      }
    });
  };
  const [disedt, setDisedt] = useState("");
  const yearmonthData = useSelector((state: any) => state.yearmonthMasterdata);
  const { allYearMonth } = yearmonthData;
  const [inyear, setInyear] = useState<any>([]);
  const [year, setyear] = useState<any>([]);
  const [month, setmonths] = useState<any>([]);
  useEffect(() => {
    if (allYearMonth.length > 0) {
      allYearMonth?.map((opt: any) => {
        if (opt.group === "PAYE") {
          let obj: any = [];
          opt.data.map((item: any) => {
            obj.push({ value: item, label: Number(item) });
          });
          setInyear(obj.reverse());
        }
      });
    }
  }, [allYearMonth]);

  useEffect(() => {
    if (allYearMonth.length > 0) {
      allYearMonth?.map((opt: any) => {
        if (opt.group === "YOEP") {
          setyear([
            ...opt.data.map((item: any) => {
              return { label: item.value, value: item.id };
            }),
          ]);
        }
      });
    }
  }, [allYearMonth]);

  useEffect(() => {
    if (allYearMonth.length > 0) {
      allYearMonth?.map((opt: any) => {
        if (opt.group === "MOEP") {
          setmonths([
            ...opt.data.map((item: any) => {
              return { label: item.value, value: item.id };
            }),
          ]);
        }
      });
    }
  }, [allYearMonth]);
  useEffect(() => {}, [year, month]);

  const MAX_LENGTH = 100;
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
  const handleInputChange = (newValue: string) => {
    setInputValue(newValue.replace(/[^a-zA-Z0-9-.',:!()&+#/>\s]*$/, ""));
  };

  return (
    <>
      <Formik
        initialValues={editValue || { ...IntialValueForm }}
        validationSchema={SignupSchema}
        enableReinitialize={true}
        onSubmit={(values, { resetForm }) => {
          if (editValue) {
            const obj1 = {
              _id: values._id,
              name: values?.name?.value,
              ver: values.ver ? values.ver : "",
              last_used: values.last_used?.value,
              exp: {
                month: values?.ExperienceMonth
                  ? Number(values?.ExperienceMonth.value)
                  : 0,
                year: values?.ExperienceYear
                  ? Number(values?.ExperienceYear.value)
                  : 0,
              },
            };
            dispatch(postITSkillDetails(obj1));
          } else {
            const obj = {
              name: values.name.value,
              ver: values.ver,
              last_used: values.last_used.value,
              exp: {
                month: values?.ExperienceMonth
                  ? Number(values?.ExperienceMonth.value)
                  : 0,
                year: values?.ExperienceYear
                  ? Number(values?.ExperienceYear.value)
                  : 0,
              },
            };

            dispatch(postITSkillDetails(obj));
          }
          resetForm();
          setItSkills(false);
        }}
      >
        {(formik: any) => {
          const {
            values,
            resetForm,
            handleChange,
            handleSubmit,
            setFieldValue,
            errors,
          } = formik;
          return (
            <div
              id="it_skills_bx"
              className="job-bx table-job-bx bg-white m-b30"
            >
              <div className="d-flex">
                <h5 className="m-b15 c_content_header">IT Skills</h5>
                {skill?.length <
                  Number(
                    environment.Jobseeker_Profile_Data_Limits.itskills_limit
                  ) && (
                  <button
                    onClick={() => {
                      setItSkills(true);
                      formik.resetForm();
                      setEditValue(null);
                    }}
                    className="site-button add-btn button-sm"
                  >
                    Add
                  </button>
                )}
              </div>
              <p className="c_content_desc">
                Specify details about programming languages (such as Java,
                Python, C/C++, Oracle, SQL etc), softwares (Microsoft Word,
                Excel, Tally etc) or any other software related knowledge.
              </p>

              <table className="table-responsive-sm">
                <thead>
                  {JobSeekerProfile?.js_profile?.skills?.it.length > 0 && (
                    <tr>
                      <th>Skills</th>
                      <th>Version</th>
                      <th>Last Used</th>
                      <th>Experience</th>
                      <th></th>
                    </tr>
                  )}
                </thead>
                <tbody>
                  {!loading &&
                    skill &&
                    skill.map((data) => {
                      return (
                        <tr key={data._id}>
                          <td className="text-ellipsis">
                            {Content(data.name, textlmt)}
                          </td>
                          <td>{data.version ? data.version : "-"}</td>
                          <td>{data.last_used ? data.last_used : "-"}</td>
                          <td>
                            {data.experience.year !== null
                              ? data.experience.year + " Years "
                              : "0 Years "}
                            {data.experience.year !== null
                              ? data.experience.month + " Months"
                              : "0 Months"}
                          </td>
                          <td>
                            <Link
                              to={"#"}
                              title="Click here to Edit or Delete IT Skills"
                              className="m-l15 font-14 edit-icon"
                              onClick={(e: any) => {
                                e.preventDefault();
                                setDisedt(data.name);
                                setEditValue({
                                  ...data,
                                  name: { label: data.name, value: data.name },
                                  ver: data.version ? data.version : "",
                                  last_used: inyear.find(
                                    (c) => c.value == data.last_used
                                  ),
                                  ExperienceMonth: month.find(
                                    (c) => c.value == data.experience.month
                                  ),
                                  ExperienceYear: year.find(
                                    (c) => c.value == data.experience.year
                                  ),
                                });
                                setItSkills(true);
                              }}
                              data-toggle="modal"
                              data-target="#itskills"
                            >
                              <BsPencil />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              <Modal
                className="modal fade browse-job modal-bx-info editor"
                backdrop="static"
                show={itskills}
                onHide={() => {
                  handleHideItSkills();
                  setEditValue(null);
                  resetForm();
                }}
              >
                <div className="modal-dialog my-0" role="document">
                  <div className="modal-content">
                    <div className="modal-body">
                      <div className="modal-custom-header">
                        <h5 className="modal-title">
                          {/* {editValue
                            ? `Edit-${values?.name?.label}`
                            : `IT Skills`} */}
                          {editValue ? (
                            <span title={`${values?.name?.label}`}>
                              {/* Edit-{values?.name?.label}   */}
                              Edit-{disedt}
                            </span>
                          ) : (
                            `IT Skills`
                          )}
                        </h5>
                        {editValue && (
                          <button
                            className="btn btn-sm btn-danger d-block d-md-inline-block mr-md-2 mb-2 mb-md-0 ml-auto"
                            type="button"
                            style={{ cursor: "pointer" }}
                            title="Delete"
                            onClick={() => {
                              setItSkills(false);
                              handleDeleteSwal(values);
                            }}
                          >
                            Delete
                          </button>
                        )}

                        <button
                          type="button"
                          title="Close"
                          className="close"
                          onClick={() => {
                            setItSkills(false);
                            setEditValue(null);
                            resetForm();
                          }}
                        >
                          <span>&times;</span>
                        </button>
                      </div>
                      <p className="modal-custom-desc">
                        Specify details about programming languages (such as
                        Java, Python, C/C++, Oracle, SQL etc), softwares
                        (Microsoft Word, Excel, Tally etc) or any other software
                        related knowledge.
                      </p>

                      <form onSubmit={handleSubmit}>
                        <div className="row">
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>Skill/Software Name</label>
                              <span style={{ color: "red" }}>*</span>
                              <AsyncCreatableSelect
                                components={components}
                                maxMenuHeight={200}
                                placeholder="Skill/Software Name"
                                cacheOptions
                                isClearable={true}
                                styles={customStyles}
                                name="name"
                                isValidNewOption={isValidNewOption}
                                noOptionsMessage={() =>
                                  "Enter keyword to search"
                                }
                                value={formik?.values?.name}
                                onChange={(e: any) => {
                                  let event = {
                                    target: {
                                      name: "name",
                                      value: e,
                                    },
                                  };

                                  setFieldValue("name", e);
                                  handleChange(event);
                                }}
                                onInputChange={handleInputChange}
                                inputValue={inputValue}
                                className={"dropstyle"}
                                loadOptions={promiseOptions}
                              />
                              {errors.name && (
                                <div className="form-error">{errors.name}</div>
                              )}
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                              <label>Software Version</label>
                              <input
                                type="text"
                                name="ver"
                                value={values.ver}
                                onChange={handleChange}
                                maxLength={10}
                                className="form-control"
                                placeholder="Software version"
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="form-group">
                              <label>Last Used</label>
                              <Select
                                placeholder="Last used"
                                value={values.last_used}
                                name="last_used"
                                onChange={(selectedOption) => {
                                  let event = {
                                    target: {
                                      name: "last_used",
                                      value: selectedOption,
                                    },
                                  };
                                  handleChange(event);
                                }}
                                maxMenuHeight={120}
                                menuPlacement="top"
                                isSearchable={true}
                                isClearable={true}
                                options={inyear}
                                className={"dropstyle"}
                                styles={customStyles}
                              />
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>Experience</label>
                              <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                                  <Select
                                    placeholder="Years"
                                    value={values.ExperienceYear}
                                    name="ExperienceYear"
                                    maxMenuHeight={120}
                                    onChange={(selectedOption) => {
                                      let event = {
                                        target: {
                                          name: "ExperienceYear",
                                          value: selectedOption,
                                        },
                                      };
                                      handleChange(event);
                                    }}
                                    menuPlacement="top"
                                    isSearchable={true}
                                    isClearable={true}
                                    options={year}
                                    className={"dropstyle"}
                                    styles={customStyles}
                                  />
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6 expstyle">
                                  <Select
                                    placeholder="Months"
                                    value={values.ExperienceMonth}
                                    name="ExperienceMonth"
                                    maxMenuHeight={120}
                                    menuPlacement="top"
                                    onChange={(selectedOption) => {
                                      let event = {
                                        target: {
                                          name: "ExperienceMonth",
                                          value: selectedOption,
                                        },
                                      };
                                      handleChange(event);
                                    }}
                                    isSearchable={true}
                                    isClearable={true}
                                    options={month}
                                    className={"dropstyle"}
                                    styles={customStyles}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="modal-custom-footer">
                          <button
                            type="button"
                            className="site-button site-warning-button"
                            onClick={() => {
                              setItSkills(false);
                              setEditValue(null);
                              resetForm();
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
                </div>
              </Modal>
            </div>
          );
        }}
      </Formik>
    </>
  );
}
export default ItSkills;
