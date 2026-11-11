import Slider from "@mui/material/Slider";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { Accordion, Card } from "react-bootstrap";
import { TbClearAll } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Select from "react-select";
import AsyncCreatableSelect from "react-select/async-creatable";
import { skillsMasterData } from "../../../ApiCall/masterData";
import { regex } from "../../../common/validation";
import { resetViewAppActionCreator } from "../../../redux/features/jobs/job-applications/ApplicationSlice";
import { resetSAS } from "../../../redux/features/jobs/job-applications/downloadSASSlice";
import { CompanyMasterData } from "../../../redux/features/masterData/CompanySlice";
import { universitiesMasterData } from "../../../redux/features/masterData/InstituteSlice";
import { LocationcityMasterData } from "../../../redux/features/masterData/LocationcitySlice";
import { SkillsMasterData } from "../../../redux/features/masterData/SkillsSlice";
import { getIndustryType } from "../../../redux/features/masterData/industrySlice";
interface DropDown {
  value: String;
  label: string;
}
let industries: any = new Array<DropDown>(),
  universities: any = new Array<DropDown>(),
  locations: any = new Array<DropDown>(),
  allSkills: any = new Array<DropDown>(),
  jobTitles: any = new Array<DropDown>();
const marks = [
  { value: 0, label: "" },
  { value: 1, label: "" },
  { value: 2, label: "" },
  { value: 3, label: "" },
  { value: 4, label: "" },
  { value: 5, label: "" },
  { value: 6, label: "" },
  { value: 7, label: "" },
  { value: 8, label: "" },
  { value: 9, label: "" },
  { value: 10, label: "" },
  { value: 11, label: "" },
  { value: 12, label: "" },
  { value: 13, label: "" },
  { value: 14, label: "" },
  { value: 15, label: "" },
  { value: 16, label: "" },
  { value: 17, label: "" },
  { value: 18, label: "" },
  { value: 19, label: "" },
  { value: 20, label: "" },
  { value: 21, label: "" },
  { value: 22, label: "" },
  { value: 23, label: "" },
  { value: 24, label: "" },
  { value: 25, label: "" },
  { value: 26, label: "" },
  { value: 27, label: "" },
  { value: 28, label: "" },
  { value: 29, label: "" },
  { value: 30, label: "" },
];
const salarymin = 5000,
  salarymax = 50000000,
  salaryinc = 25000;
function Filter(props: any) {
  const [inpSkill, setInpSkill] = useState<any>([]),
    [skillsCount, setSkillsCount] = useState<any>(0),
    [locationstate, setLocationstate] = useState<any>(),
    [skillsVal, setSkillsVal] = useState<any>(""),
    [institue, setInstitute] = useState<any>(""),
    [id] = useSearchParams(),
    [is] = useSearchParams(),
    navigate = useNavigate(),
    jid: any = id?.get("id"),
    isShortList: any = is?.get("is"),
    [maxSal, setMaxSal] = useState(salarymax),
    [maxSalChanged, setMaxSalChanged] = useState(salarymin),
    [minSalChanged, setMinSalChanged] = useState(salarymin),
    { viewApp, lodingV } = useSelector((state: any) => state.viewApplication),
    resetFunc = () => {
      navigate({ pathname: "", search: `?id=${jid}` });
      setInpSkill([]);
      props.setFieldValue("skills", "");
      props.setFieldValue("location", "");
      props.setFieldValue("institute", "");
      props.setFieldValue("experience", [null, null]);
      props.setFieldValue("scoreHigh", false);
      props.setFieldValue("scoreMedium", false);
      props.setFieldValue("scoreLow", false);
      props.setFieldValue("salary", [null, null]);
      props.setFieldValue("salaryNo", false);
      props.setFieldValue("noticePeriod", "");
      props.setFieldValue("company", "");
      props.setFieldValue("industry", "");
      props.setFieldValue("education", "");
      props.setFieldValue("option", "");
      props.setFieldValue("noticePeriod1", false);
      props.setFieldValue("noticePeriod2", false);
      props.setFieldValue("noticePeriod3", false);
      props.setFieldValue("noticePeriod4", false);
      props.setFieldValue("noticePeriod5", false);
      props.setFieldValue("noticePeriod6", false);
      props.setFieldValue("currencySymbole", "INR");
      setMaxSalChanged(salarymin);
      setMinSalChanged(salarymin);
    },
    dispatch = useDispatch(),
    { LocationcityData, Locationloading } = useSelector(
      (state: any) => state.LocationCitiesData
    ),
    { universityData, universityloading } = useSelector(
      (state: any) => state.institue
    ),
    { IndustryType, loadingI } = useSelector(
      (state: any) => state.industryType
    ),
    skillsmasterData = useSelector((state: any) => state.skills),
    location_master_data = useSelector((state: any) => state.locationcity),
    { SkillsData } = skillsmasterData;
  useEffect(() => {
    isShortList === "1" && props.setFieldValue("access", "shortlist");
    dispatch(resetViewAppActionCreator());
    dispatch(resetSAS());
    dispatch(LocationcityMasterData({ pageno: -1, search: "" }));
    dispatch(universitiesMasterData({ pageno: -1, search: "" }));
    dispatch(getIndustryType({ pageno: -1, search: "" }));
    dispatch(CompanyMasterData({ pageno: -1, search: "" }));
    dispatch(SkillsMasterData({ pageno: -1, search: "" }));
    locationmasterdata(location_master_data?.LocationcityData);
    props.handleSubmit();
  }, []);
  useEffect(() => {
    if (SkillsData && SkillsData?.length) {
      SkillsData?.map((e: any, i: number) => {
        allSkills?.push({ value: `${1 + i}`, label: e });
      });
    }
    if (LocationcityData && LocationcityData?.length && !locations?.length) {
      LocationcityData?.map((e: any, i: number) => {
        locations?.push({ value: `${1 + i}`, label: e });
      });
    }
    if (universityData && !universityData?.length) {
      universityData?.map((e: any, i: number) => {
        universities?.push({ value: `${1 + i}`, label: e });
      });
    }
    if (
      IndustryType &&
      IndustryType?.code &&
      IndustryType?.code === 200 &&
      !industries?.length
    ) {
      IndustryType?.data.map((e: any, i: number) => {
        industries?.push({ value: `${1 + i}`, label: e });
      });
    }
    locationmasterdata(location_master_data?.LocationcityData);
  }, [LocationcityData, SkillsData, universityData, IndustryType]);
  const filterColors = (inputValue: string) => {
      return universities?.filter((i) =>
        i?.label?.toLowerCase()?.includes(inputValue?.toLowerCase())
      );
    },
    valuetext = (value: number) => {
      return `${value}`;
    },
    loadOptions = (inputValue: string, callback: (options: any) => void) => {
      setTimeout(() => {
        callback(filterColors(inputValue));
      }, 1000);
    },
    handleSelectOption = (option) => {
      const res = handleChangeInput(option);
      if (res) {
        setInpSkill(option);
        props.values.skills = [...option]?.map((e) => e?.label);
      }
    },
    handleChangeInput = (e: any): boolean => {
      const skills = e
        .map((skill) => skill?.value)
        .toString()
        .replaceAll(",", "");

      if (skills?.length > 500) {
        return false;
      } else if (skills?.length) {
      } else {
        setSkillsCount(skills?.length);
        return true;
      }
      setSkillsCount(skills?.length);
      return true;
    },
    filterSkills: any = (inputValue: string, callback) => {
      if (inputValue?.length >= 2) {
        const data = { pageno: 1, search: `${inputValue}` };
        skillsMasterData(data)?.then((res) =>
          callback(
            res?.map((skill) => {
              return { label: skill, value: skill };
            })
          )
        );
      } else {
        return [];
      }
    },
    loadSkillsOptions = useCallback(debounce(filterSkills, 1000), []),
    locationmasterdata = (data: any) => {
      setLocationstate(
        data?.map((d: any, i: any) => {
          return { value: `${i}`, label: d };
        })
      );
    },
    filterUniversities = (inputValue: string) => {
      return universities?.filter((i) =>
        i?.label?.toLowerCase()?.includes(inputValue?.toLowerCase())
      );
    },
    promiseOptions = (inputValue: string) =>
      new Promise<[]>((resolve) => {
        setTimeout(() => {
          resolve(filterUniversities(inputValue));
        }, 1000);
      }),
    handleInputChanges1 = (newValue: string) => {
      setSkillsVal(
        regex?.alphabetSpaceTyping?.test(newValue) ? newValue : skillsVal
      );
    },
    handleInputChanges2 = (newValue: string) => {
      setInstitute(
        regex?.companyName?.test(newValue) ? newValue : handleInputChanges2
      );
    };

  const handleMinSalChange = (e) => {
    if (e.target.value >= maxSal) {
      return;
    } else {
      const maxValue = props.values.salary[1];
      const minValue = Number(e.target.value);
      let array: any = [];
      if (minValue > maxValue) {
        setMinSalChanged(maxValue);
        setMaxSalChanged(minValue);
        array = [maxValue, minValue];
      } else {
        setMinSalChanged(minValue);
        array = [minValue, maxValue];
      }

      const event = {
        target: {
          name: "salary",
          value: array,
        },
      };
      props.handleChange(event);
    }
  };
  const handleMaxSalChange = (e) => {
    if (e.target.value > maxSal) {
      if (e.target.value > salarymax) return;
      setMaxSal(Number(e.target.value));
    } else {
      const minSal = props.values.salary[0];
      const event = {
        target: {
          name: "salary",
          value: [minSal, Number(e.target.value)],
        },
      };
      setMaxSalChanged(Number(e.target.value));
      props.handleChange(event);
    }
  };
  const handleSalSliderChange = (value) => {
    if (value[1] === 0 && value[0] > 0) {
      setMaxSalChanged(value[0]);
      setMinSalChanged(value[1]);
    } else {
      setMaxSalChanged(value[1]);
      setMinSalChanged(value[0]);
    }
  };

  return (
    <div
      className="col-xl-3 col-lg-3 col-md-3 col-sm-12 m-b30"
      style={{ zIndex: "9" }}
    >
      <aside
        id="accordion1"
        className="sticky-top sidebar-filter bg-transparent"
      >
        <div
          id="accordion1"
          className="sticky-top sidebar-filter bg-white  m-b50"
        >
          <Accordion>
            <h6 className="title">
              <i
                className="fa fa-filter"
                aria-hidden="true"
                style={{ color: "orange" }}
              ></i>{" "}
              Filters
              <div>
                <button
                  type="submit"
                  className="font-12 float-right btn border-0 bg-transparent"
                  style={{ marginTop: "-24px", boxShadow: "none" }}
                  onClick={(e: any) => {
                    e?.preventDefault();
                    resetFunc();
                    props?.handleSubmit();
                  }}
                >
                  <Link to={"#"} className="font-12 float-right">
                    <TbClearAll /> Reset
                  </Link>
                </button>
              </div>
            </h6>

            <Accordion.Toggle as={Card} eventKey="1">
              <div className="acod-head" style={{ cursor: "pointer" }}>
                <h6 className="acod-title">
                  <a data-toggle="collapse" className="collapsed">
                    Skills
                  </a>
                </h6>
              </div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="1">
              <div id="skills" className="acod-body collapse show">
                <div className="acod-content">
                  <AsyncCreatableSelect
                    components={{ DropdownIndicator: null }}
                    placeholder="Skills"
                    cacheOptions
                    isClearable={false}
                    name="skills"
                    value={inpSkill}
                    onChange={(e: any) => {
                      handleSelectOption(e);
                    }}
                    isMulti
                    defaultOptions
                    className={"dropstyle"}
                    noOptionsMessage={() => "Enter keyword to search"}
                    loadOptions={loadSkillsOptions}
                    onInputChange={handleInputChanges1}
                    inputValue={skillsVal}
                  />
                </div>
              </div>
            </Accordion.Collapse>

            <Accordion.Toggle as={Card} eventKey="2">
              <div className="acod-head" style={{ cursor: "pointer" }}>
                <h6 className="acod-title">
                  <a data-toggle="collapse" className="collapsed">
                    Relevance Score
                  </a>
                </h6>
              </div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="2">
              <div id="score" className="acod-body collapse show">
                <div className="acod-content">
                  <div className="custom-control custom-checkbox">
                    <input
                      className="custom-control-input"
                      id="scoreHigh"
                      type="checkbox"
                      name="scoreHigh"
                      checked={props?.values?.scoreHigh}
                      onChange={props?.handleChange}
                    />
                    <label className="custom-control-label" htmlFor="scoreHigh">
                      High Match <span></span>{" "}
                    </label>
                  </div>
                  <div className="custom-control custom-checkbox">
                    <input
                      className="custom-control-input"
                      id="scoreMedium"
                      type="checkbox"
                      name="scoreMedium"
                      checked={props?.values?.scoreMedium}
                      onChange={props?.handleChange}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="scoreMedium"
                    >
                      Medium Match <span></span>{" "}
                    </label>
                  </div>
                  <div className="custom-control custom-checkbox">
                    <input
                      className="custom-control-input"
                      id="scoreLow"
                      type="checkbox"
                      name="scoreLow"
                      checked={props?.values?.scoreLow}
                      onChange={props?.handleChange}
                    />
                    <label className="custom-control-label" htmlFor="scoreLow">
                      Low Match <span></span>{" "}
                    </label>
                  </div>
                </div>
              </div>
            </Accordion.Collapse>

            <Accordion.Toggle as={Card} eventKey="3">
              <div className="acod-head" style={{ cursor: "pointer" }}>
                <h6 className="acod-title">
                  <a data-toggle="collapse" className="collapsed">
                    Location
                  </a>
                </h6>
              </div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="3">
              <div id="location" className="acod-body collapse show">
                <div className="acod-content">
                  <Select
                    className="dropstyle"
                    isSearchable={true}
                    isClearable={true}
                    isDisabled={false}
                    options={locations}
                    name="location"
                    placeholder="Location"
                    value={props?.values?.location}
                    onChange={(option: any) => {
                      props.setFieldValue("location", option);
                    }}
                  />
                </div>
              </div>
            </Accordion.Collapse>

            <Accordion.Toggle as={Card} eventKey="4">
              <div className="acod-head" style={{ cursor: "pointer" }}>
                <h6 className="acod-title">
                  <a data-toggle="collapse" className="collapsed">
                    Institute
                  </a>
                </h6>
              </div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="4">
              <div id="institute" className="acod-body collapse show">
                <div className="acod-content">
                  <AsyncCreatableSelect
                    name="institute"
                    components={{ DropdownIndicator: null }}
                    cacheOptions
                    isClearable={true}
                    value={props?.values?.institute}
                    onChange={(e: any) => {
                      let event = {
                        target: {
                          name: "institute",
                          value: e,
                        },
                      };
                      props.handleChange(event);
                    }}
                    noOptionsMessage={() => "Enter keyword to search"}
                    className={"dropstyle"}
                    placeholder="Institute"
                    loadOptions={promiseOptions}
                    onInputChange={handleInputChanges2}
                    inputValue={institue}
                  />
                </div>
              </div>
            </Accordion.Collapse>

            <Accordion.Toggle as={Card} eventKey="5">
              <div className="acod-head" style={{ cursor: "pointer" }}>
                <h6 className="acod-title">
                  <a data-toggle="collapse" className="collapsed">
                    Experience
                  </a>
                </h6>
              </div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="5">
              <div id="experience" className="acod-body collapse show">
                <div className="acod-content">
                  <Slider
                    getAriaLabel={() => "Temperature range"}
                    value={props?.values?.experience}
                    onChange={(e: any) => {
                      if (e?.target !== null) {
                        e.target.name = "experience";
                      }
                      props.handleChange(e);
                    }}
                    valueLabelDisplay="on"
                    getAriaValueText={valuetext}
                    min={0}
                    max={marks?.length - 1}
                    marks={marks}
                    className="props.classes.thumb"
                    valueLabelFormat={(value) => <div>{value * 1}</div>}
                  />
                </div>
              </div>
            </Accordion.Collapse>

            <Accordion.Toggle as={Card} eventKey="6">
              <div className="acod-head" style={{ cursor: "pointer" }}>
                <h6 className="acod-title">
                  <a data-toggle="collapse" className="collapsed">
                    Salary
                  </a>
                </h6>
              </div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="6">
              <div id="salary" className="acod-body collapse show">
                <div className="acod-content">
                  <div className="d-flex ml-2 mt-2">
                    <input
                      type="text"
                      className="form-control"
                      style={{ width: "100px" }}
                      value={minSalChanged}
                      onBlur={(e: any) => {
                        if (e.target.value == 0 || e.target.value < salarymin) {
                          e.target.value = salarymin;
                          handleMinSalChange(e);
                        }
                      }}
                      onChange={(e) => {
                        if (regex.numberRegx.test(e.target.value)) {
                          handleMinSalChange(e);
                        }
                      }}
                    />
                    <input
                      type="text"
                      className="form-control"
                      style={{ width: "100px" }}
                      value={maxSalChanged}
                      onBlur={(e: any) => {
                        if (e.target.value == 0 || e.target.value < salarymin) {
                          e.target.value = salarymax;
                          handleMaxSalChange(e);
                        }
                      }}
                      onChange={(e: any) => {
                        if (regex.numberRegx.test(e.target.value)) {
                          handleMaxSalChange(e);
                        }
                      }}
                    />
                  </div>
                  <div className="m-2 d-flex">
                    <div className="d-flex">
                      <label>
                        <input
                          type="radio"
                          name="currencySymbole"
                          value="INR"
                          className="card-input-element"
                          checked={props.values.currencySymbole === "INR"}
                          onChange={props.handleChange}
                        />
                        <div
                          className={
                            props.values.currencySymbole === "INR"
                              ? "btn btn-primary btn-sm"
                              : "btn btn-outline-primary btn-sm"
                          }
                        >
                          ₹
                        </div>
                      </label>
                      <label className="mr-3">
                        <input
                          type="radio"
                          name="currencySymbole"
                          value="USD"
                          className="card-input-element"
                          checked={props.values.currencySymbole === "USD"}
                          onChange={props.handleChange}
                        />
                        <div
                          className={
                            props.values.currencySymbole === "USD"
                              ? "btn btn-primary btn-sm"
                              : "btn btn-outline-primary btn-sm"
                          }
                        >
                          $
                        </div>
                      </label>
                    </div>
                    <Slider
                      getAriaLabel={() => "Temperature range"}
                      value={props?.values?.salary}
                      valueLabelDisplay="auto"
                      getAriaValueText={valuetext}
                      min={5000}
                      max={50000000}
                      step={5000}
                      className="props.classes.thumb"
                      valueLabelFormat={(value) => <div>{value}</div>}
                      onChange={(e: any) => {
                        if (e?.target !== null) {
                          e.target.name = "salary";
                          handleSalSliderChange(e.target.value);
                        }
                        props.handleChange(e);
                      }}
                    />
                  </div>
                  <div className="custom-control custom-checkbox m-2">
                    <input
                      className="custom-control-input"
                      id="salaryNo"
                      type="checkbox"
                      name="salaryNo"
                      checked={props?.values?.salaryNo}
                      onChange={props?.handleChange}
                    />
                    <label className="custom-control-label" htmlFor="salaryNo">
                      Candidate not mentioned salary
                    </label>
                  </div>
                </div>
              </div>
            </Accordion.Collapse>

            <Accordion.Toggle as={Card} eventKey="7">
              <div className="acod-head" style={{ cursor: "pointer" }}>
                <h6 className="acod-title">
                  <a data-toggle="collapse" className="collapsed">
                    Notice Period
                  </a>
                </h6>
              </div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="7">
              <div id="noticePeriod" className="acod-body collapse show">
                <div className="acod-content">
                  <div className="custom-control custom-checkbox">
                    <input
                      className="custom-control-input"
                      id="noticePeriod1"
                      type="checkbox"
                      name="noticePeriod1"
                      checked={props.values.noticePeriod1}
                      onChange={props.handleChange}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="noticePeriod1"
                    >
                      15 Days or less
                    </label>
                  </div>
                  <div className="custom-control custom-checkbox">
                    <input
                      className="custom-control-input"
                      id="noticePeriod2"
                      type="checkbox"
                      name="noticePeriod2"
                      checked={props.values.noticePeriod2}
                      onChange={props.handleChange}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="noticePeriod2"
                    >
                      1 Month
                    </label>
                  </div>
                  <div className="custom-control custom-checkbox">
                    <input
                      className="custom-control-input"
                      id="noticePeriod3"
                      type="checkbox"
                      name="noticePeriod3"
                      checked={props.values.noticePeriod3}
                      onChange={props.handleChange}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="noticePeriod3"
                    >
                      2 Month
                    </label>
                  </div>
                  <div className="custom-control custom-checkbox">
                    <input
                      className="custom-control-input"
                      id="noticePeriod4"
                      type="checkbox"
                      name="noticePeriod4"
                      checked={props.values.noticePeriod4}
                      onChange={props.handleChange}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="noticePeriod4"
                    >
                      3 Month
                    </label>
                  </div>
                  <div className="custom-control custom-checkbox">
                    <input
                      className="custom-control-input"
                      id="noticePeriod5"
                      type="checkbox"
                      name="noticePeriod5"
                      checked={props.values.noticePeriod5}
                      onChange={props.handleChange}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="noticePeriod5"
                    >
                      More than 3 Months
                    </label>
                  </div>
                  <div className="custom-control custom-checkbox">
                    <input
                      className="custom-control-input"
                      id="noticePeriod6"
                      type="checkbox"
                      name="noticePeriod6"
                      checked={props.values.noticePeriod6}
                      onChange={props.handleChange}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="noticePeriod6"
                    >
                      Serving Notice Period
                    </label>
                  </div>
                </div>
              </div>
            </Accordion.Collapse>

            <Accordion.Toggle as={Card} eventKey="8">
              <div className="acod-head" style={{ cursor: "pointer" }}>
                <h6 className="acod-title">
                  <a data-toggle="collapse" className="collapsed">
                    Company
                  </a>
                </h6>
              </div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="8">
              <div id="company" className="acod-body collapse show">
                <div className="acod-content">
                  <input
                    value={props.values.company}
                    maxLength={100}
                    name="company"
                    placeholder="Search"
                    type="text"
                    className="form-control mt-2 mr-1"
                    onChange={(e) => {
                      if (regex?.companyFilter.test(e?.target?.value))
                        props?.handleChange(e);
                    }}
                  />
                </div>
              </div>
            </Accordion.Collapse>

            <Accordion.Toggle as={Card} eventKey="9">
              <div className="acod-head" style={{ cursor: "pointer" }}>
                <h6 className="acod-title">
                  <a data-toggle="collapse" className="collapsed">
                    Industry
                  </a>
                </h6>
              </div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="9">
              <div id="industry" className="acod-body collapse show">
                <div className="acod-content">
                  <Select
                    className="dropstyle"
                    isSearchable={true}
                    isClearable={true}
                    isDisabled={false}
                    options={industries}
                    name="industry"
                    placeholder="industry"
                    value={props.values.industry}
                    onChange={(option: any) => {
                      props.setFieldValue("industry", option);
                    }}
                  />
                </div>
              </div>
            </Accordion.Collapse>

            <Accordion.Toggle as={Card} eventKey="10">
              <div className="acod-head" style={{ cursor: "pointer" }}>
                <h6 className="acod-title">
                  <a data-toggle="collapse" className="collapsed">
                    Education
                  </a>
                </h6>
              </div>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="10">
              <div id="education" className="acod-body collapse show">
                <div className="acod-content">
                  <input
                    maxLength={100}
                    name="education"
                    placeholder="Search"
                    type="text"
                    className="form-control mt-2 mr-1"
                    value={props.values.education}
                    onChange={(e) => {
                      if (regex?.educationFilter.test(e?.target?.value))
                        props?.handleChange(e);
                    }}
                  />
                </div>
              </div>
            </Accordion.Collapse>
          </Accordion>
        </div>
        <div className="mt-3" style={{ position: "relative", zIndex: "9" }}>
          <button
            type="submit"
            className="btn btn-primary site-button float-center btn-lg w-100"
            onClick={() => {
              props.handleSubmit();
            }}
            style={{ zIndex: "9" }}
          >
            {lodingV && (
              <i
                className="fa fa-circle-o-notch fa-spin"
                style={{ marginRight: "10px" }}
              ></i>
            )}
            {lodingV ? "APPLYING..." : "APPLY"}
          </button>
        </div>
      </aside>
    </div>
  );
}

export default Filter;
