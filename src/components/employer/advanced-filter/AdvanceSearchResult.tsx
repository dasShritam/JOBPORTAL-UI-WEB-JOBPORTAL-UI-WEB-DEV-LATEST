import React, { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { Avatar, CircularProgress, Stack } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Chip from "@mui/material/Chip";
import "../../../assets/customCss/jobs/advanceFilterSearch.css";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import AsyncCreatableSelect from "react-select/async-creatable";
import { Alert, Button } from "react-bootstrap";
import Select, { components } from "react-select";
import { Formik } from "formik";

import makeAnimated from "react-select/animated";
import PropTypes from "prop-types";
import ReactSelect from "react-select";
import { skillsMasterData } from "../../../ApiCall/masterData";
import { useDispatch, useSelector } from "react-redux";
import { jobSeekerProfileMasterData } from "../../../redux/features/masterData/MasterDataInfoSlice";
import { getYearMonth } from "../../../redux/features/masterData/YearMonthSlice";
import { SkillsMasterData } from "../../../redux/features/masterData/SkillsSlice";
import { DepartmentMasterData } from "../../../redux/features/masterData/DepartmentSlice";
import { getIndustryType } from "../../../redux/features/masterData/industrySlice";
import { CompanyMasterData } from "../../../redux/features/masterData/CompanySlice";
import { DesignationMasterData } from "../../../redux/features/masterData/DesignationSlice";
import { universitiesMasterData } from "../../../redux/features/masterData/InstituteSlice";
import { createDataWithId, customStyles } from "../../../common/common";
import { LocationcityMasterData } from "../../../redux/features/masterData/LocationcitySlice";
import {
  SearchProfiles,
  resetPostSearchProfile,
} from "../../../redux/features/jobs/search-profile/SearchProfileSlice";
import {
  downloadSAS,
  resetSAS,
} from "../../../redux/features/jobs/job-applications/downloadSASSlice";
import { FaFilter } from "react-icons/fa";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import { recruitmentMailReset } from "../../../redux/features/employer/recruitmentMailslice";
import { regex } from "../../../common/validation";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import ApplicantCard from "./ApplicantCard";
import ApplicantCardSk from "./ApplicantCardSk";

type Anchor = "top" | "left" | "bottom" | "right";
//Images
var NodataFound = require("../../../assets/images/background/No-record.png");
export interface ColourOption {
  readonly value: string;
  readonly label: string;
}
let industries: any = new Array<ColourOption>();
type MultiNestedOption = {
  label: string;
  value: string;
  children?: MultiNestedOption[];
};

export interface ExperienceYears {
  readonly value: number;
  readonly label: number;
}
const experienceYearsFn = () => {
  let year: any = [];
  for (let i = 1; i <= 60; i++) {
    year.push({ label: i, value: i });
  }
  return year;
};

export const ExperienceYears: readonly ExperienceYears[] = experienceYearsFn();

let universities: any = [];
let pgcourse: any = [];

interface IntialValueForm {
  keySkills: any[];
  keySkillsCheckbox: boolean;
  excludeKeyword: any[];
  ItSkills: any[];
  experienceYearFrom: any;
  experienceYearTo: any;
  currentLocation: any[];
  locationCheckbox: false;
  currency: any;
  minSalary: any;
  maxSalary: any;
  salaryCheckbox: boolean;
  departmentalArea: any[];
  industy: any[];
  IncludeCompany: any[];
  IncludeCompanyCheckbox: boolean;
  IncludeCompanyStatus: string;
  ExcludeCompany: any[];
  ExcludeCompanyCheckbox: boolean;
  ExcludeCompanyStatus: string;
  Desination: any[];
  DesinationCheckbox: boolean;
  NoticePeriod: any[];
  candidates: string;
  disability: boolean;
  candidateCatagory: any;
  candidateAgeFrom: any;
  candidateAgeTo: any;
  jobType: any;
  employmentType: any;
  workPermitFor: any;
  DisplayDetailsShow: string;
  DisplayDetailsShowOnlyCandidate: any;
  ugFrom: any;
  ugTo: any;
  pgFrom: any;
  pgTo: any;
  ppgFrom: any;
  ppgTo: any;
  personwithDisabilitiesCheckbox: boolean;
  activeIn: any;
  minimumAge: any;
  maximumAge: any;
  ugIns: any[];
  pgIns: any[];
  ppgIns: any[];
  ugCrc: any[];
  pgCrc: any[];
  ppgCrc: any[];
}
const IntialValueForm: IntialValueForm = {
  keySkills: [],
  keySkillsCheckbox: false,
  excludeKeyword: [],
  ItSkills: [],
  experienceYearFrom: null,
  experienceYearTo: null,
  currentLocation: [],
  locationCheckbox: false,
  currency: "INR",
  minSalary: "",
  maxSalary: "",
  salaryCheckbox: false,
  departmentalArea: [],
  industy: [],
  IncludeCompany: [],
  IncludeCompanyCheckbox: false,
  IncludeCompanyStatus: "Current Company",
  ExcludeCompany: [],
  ExcludeCompanyCheckbox: false,
  ExcludeCompanyStatus: "Current Company",
  Desination: [],
  DesinationCheckbox: false,
  NoticePeriod: ["Any"],
  candidates: "",
  disability: false,
  candidateCatagory: null,
  candidateAgeFrom: null,
  candidateAgeTo: null,
  jobType: null,
  employmentType: null,
  workPermitFor: [],
  DisplayDetailsShow: "All Candidate",
  DisplayDetailsShowOnlyCandidate: null,
  ugFrom: null,
  ugTo: null,
  pgFrom: { value: "", label: "" },
  pgTo: { value: "", label: "" },
  ppgFrom: { value: "", label: "" },
  ppgTo: { value: "", label: "" },
  personwithDisabilitiesCheckbox: false,
  activeIn: null,
  minimumAge: null,
  maximumAge: null,
  ugIns: [],
  pgIns: [],
  ppgIns: [],
  ugCrc: [],
  pgCrc: [],
  ppgCrc: [],
};

function AdvanceSearchResult() {
  const [pagenation, setPagination] = useState(false);
  const [touchedUgFrom, setTouchedUgFrom] = useState(false);
  const [touchedPgFrom, setTouchedPgFrom] = useState(false);
  const [touchedUgTo, setTouchedUgTo] = useState(false);
  const [touchedPgTo, setTouchedPgTo] = useState(false);
  const [ftime, setFtime] = React.useState(false);
  const [partTime, setPartTime] = React.useState(false);
  const [anyug, setAnyUg] = React.useState(false);
  const [spUg, setSpUg] = React.useState(false);
  const [noUg, setNoUg] = React.useState(false);
  const [corr, setCorr] = React.useState(false);

  const [fromPgValue, setFromPgValue] = useState();
  const [toPgValue, setToPgValue] = useState();
  const [fPgtime, setFPgtime] = React.useState(false);
  const [partTimePg, setPartTimePg] = React.useState(false);
  const [anyPg, setAnyPg] = React.useState(false);
  const [spPg, setSpPg] = React.useState(false);
  const [noPg, setNoPg] = React.useState(false);
  const [corrPg, setCorrPg] = React.useState(false);
  const [fPpgtime, setFPpgtime] = React.useState(false);
  const [partTimePpg, setPartTimePpg] = React.useState(false);
  const [anyPpg, setAnyPpg] = React.useState(false);
  const [spPpg, setSpPpg] = React.useState(false);
  const [noPpg, setNoPpg] = React.useState(false);
  const [corrPpg, setCorrPpg] = React.useState(false);
  const [bodyDatas, setBodyData] = React.useState<any>(null);
  const [minAge, setMinAge] = useState({ value: 18, label: "18" });
  const [maxAge, setMaxAge] = useState({ value: 60, label: "60+" });
  const [workPermitLimit, setWorkPermitLimit] = useState<boolean>(false);

  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  const [anyUgLimit, setAnyUgLimit] = useState(false),
    [specificUgLimit, setSpecificUgLimit] = useState(false),
    [specificPgCourLimit, setSpecificPgCourLimit] = useState(false),
    [specificPgInstLimit, setSpecificPgInstLimit] = useState(false),
    [locationLimit, setLocationLimit] = useState(false);

  const ugLimit = (type: string, e: any) => {
    switch (type) {
      case "Location":
        if (e?.length >= 9) {
          setLocationLimit(true);
        }
        if (e?.length <= 9) {
          setLocationLimit(false);
        }
        break;
      case "AnyUG":
        if (e?.length >= 9) {
          setAnyUgLimit(true);
        }
        if (e?.length <= 9) {
          setAnyUgLimit(false);
        }
        break;
      case "SpecificUG":
        if (e?.length >= 9) {
          setSpecificUgLimit(true);
        }
        if (e?.length <= 9) {
          setSpecificUgLimit(false);
        }
        break;
      case "SpecificPgCourse":
        if (e?.length >= 9) {
          setSpecificPgCourLimit(true);
        }
        if (e?.length <= 9) {
          setSpecificPgCourLimit(false);
        }
        break;
      case "SpecificPgInst":
        if (e?.length >= 9) {
          setSpecificPgInstLimit(true);
        }
        if (e?.length <= 9) {
          setSpecificPgInstLimit(false);
        }
        break;
      default:
        if (e?.length >= 9) {
          setWorkPermitLimit(true);
        }
        if (e?.length <= 9) {
          setWorkPermitLimit(false);
        }
        break;
    }
  };

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event.type === "keydown" &&
          ((event as React.KeyboardEvent).key === "Tab" ||
            (event as React.KeyboardEvent).key === "Shift")
        ) {
          return;
        }

        setState({ ...state, [anchor]: open });
      };

  const EmploymentTypeOptions = [
    { value: "1", label: "Any" },
    { value: "2", label: "Full Time" },
    { value: "3", label: "Part Time" },
  ];

  const monthOption: any = [];
  for (let i = 0; i <= 31; i++) {
    monthOption.push({ label: i, value: i });
  }

  const Option = (props) => {
    return (
      <div>
        <components.Option {...props}>
          <input
            type="checkbox"
            checked={props.isSelected}
            onChange={() => null}
          />{" "}
          <label>{props.label}</label>
        </components.Option>
      </div>
    );
  };

  const MultiValue = (props) => (
    <components.MultiValue {...props}>
      <span>{props.data.label}</span>
    </components.MultiValue>
  );

  const animatedComponents = makeAnimated();

  const MySelect = (props: any) => {
    const { placeholder } = props;
    if (props.allowSelectAll) {
      return (
        <Select
          isMulti
          closeMenuOnSelect={false}
          className="col-lg-12 mr-5"
          placeholder={placeholder}
          hideSelectedOptions={false}
          components={{
            Option,
            MultiValue,
            animatedComponents,
          }}
          {...props}
          options={[props.allOption, ...props.options]}
          onChange={(selected: any) => {
            if (
              selected !== null &&
              selected.length > 0 &&
              selected[selected.length - 1].value === props.allOption.value
            ) {
              return props.onChange(props.options);
            }
            return props.onChange(selected);
          }}
        />
      );
    }
    return <Select {...props} />;
  };

  MySelect.propTypes = {
    options: PropTypes.array,
    value: PropTypes.any,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    allowSelectAll: PropTypes.bool,
    allOption: PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  };

  MySelect.defaultProps = {
    allOption: {
      label: "Select all",
      value: "*",
    },
    placeholder: "Please select institutes",
  };

  useEffect(() => {
    if (anyug === true) {
      setNoUg(false);
      setSpUg(false);
    } else if (spUg === true) {
      setNoUg(false);
      setAnyUg(false);
    } else if (noUg === true) {
      setAnyUg(false);
      setSpUg(false);
    }
  }, [anyug, noUg, spUg]);

  useEffect(() => {
    if (anyPg === true) {
      setNoPg(false);
      setSpPg(false);
    } else if (spPg === true) {
      setNoPg(false);
      setAnyPg(false);
    } else if (noPg === true) {
      setAnyPg(false);
      setSpPg(false);
    }
  }, [anyPg, spPg, noPg]);

  useEffect(() => {
    if (anyPpg === true) {
      setNoPpg(false);
      setSpPpg(false);
    } else if (spPpg === true) {
      setNoPpg(false);
      setAnyPpg(false);
    } else if (noPpg === true) {
      setAnyPpg(false);
      setSpPpg(false);
    }
  }, [anyPpg, spPpg, noPpg]);

  useEffect(() => {
    if (ftime === true) {
      setPartTime(false);
      setCorr(false);
    } else if (partTime === true) {
      setCorr(false);
      setFtime(false);
    } else if (corr === true) {
      setFtime(false);
      setPartTime(false);
    }
  }, [ftime, partTime, corr]);

  useEffect(() => {
    if (fPgtime === true) {
      setPartTimePg(false);
      setCorrPg(false);
    } else if (partTimePg === true) {
      setCorrPg(false);
      setFPgtime(false);
    } else if (corrPg === true) {
      setFPgtime(false);
      setPartTimePg(false);
    }
  }, [fPgtime, partTimePg, corrPg]);

  useEffect(() => {
    if (fPpgtime === true) {
      setPartTimePpg(false);
      setCorrPpg(false);
    } else if (partTimePpg === true) {
      setCorrPpg(false);
      setFPpgtime(false);
    } else if (corrPpg === true) {
      setFPpgtime(false);
      setPartTimePpg(false);
    }
  }, [fPpgtime, partTimePpg, corrPpg]);

  const ageOptions: any = [];
  for (let i = minAge.value; i <= maxAge.value; i++) {
    ageOptions.push({ value: i, label: i.toString() });
  }

  const masterDatas = useSelector((state: any) => state.jobSeekerMasterData);
  const { JSMasterData } = masterDatas;
  const [options, setOptions] = useState<any>([]);
  const [categoryOpt, setCategoryOpt] = useState<any>([]);
  const [ugcourseArr, setugCourseData] = useState<any>([]);
  const [pgcourseArr, setpgCourseData] = useState<any>([]);
  const searchProfilesData = useSelector((state: any) => state.searchProfile);

  const { SearchProfileData, loadingSp } = searchProfilesData;
  const { sasData, load } = useSelector((state: any) => state.downloadSAS);

  interface selectType {
    label: string;
    value: string;
  }
  const isValidNewOption = (inputValue, selectValue, selectOptions) => {
    if (inputValue.length === 0 || inputValue.length > 70) {
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
  interface InputField {
    id: number;
    skill: any;
    exp: any;
  }
  const [inputFields, setInputFields] = useState<InputField[]>([]);

  const handleAddFields = () => {
    const values = [...inputFields];
    values.push({
      id: Math.floor(Math.random() * 100000) + 1,
      skill: null,
      exp: null,
    });
    setInputFields(values);
  };

  const handleRemoveFields = (id: number) => {
    const values = [...inputFields];
    const index = values.findIndex((field) => field.id === id);
    values.splice(index, 1);
    setInputFields(values);
  };
  const handleSkillChange = (id: number, option: any) => {
    const values = [...inputFields];
    const index = values.findIndex((field) => field.id === id);
    if (index !== -1) {
      values[index].skill = option;
    }
    setInputFields(values);
  };
  const handleExpChange = (id: number, option: any) => {
    const values = [...inputFields];
    const index = values.findIndex((field) => field.id === id);
    if (index !== -1) {
      values[index].exp = option;
    }
    setInputFields(values);
  };

  const [clickedButtons, setClickedButtons] = useState<any>([]);
  const [ugEducationType, setUgEducationType] = useState<any>([]);
  const [pgEducationType, setPgEducationType] = useState<any>([]);
  const [PpgEducationType, setPpgEducationType] = useState<any>([]);
  const [showCandidateButtons, setShowCandidateButtons] = useState<any>([]);
  const [showPg, setShowPg] = useState<any>(false);
  //const [showPpg, setShowPpg] = useState<any>(false);

  const [currentpage, setCurrentPage] = useState(1);
  const formikRef = useRef<any>(null);
  function handleOutsideSubmit() {
    if (formikRef.current) {
      formikRef.current.handleSubmit();
    }
  }

  const handleShowugEducationType = (value: any) => {
    if (ugEducationType.includes(value)) {
      setUgEducationType(ugEducationType.filter((id) => id !== value));
    } else {
      setUgEducationType([...ugEducationType, value]);
    }
  };

  const handleShowPgEducationType = (value: any) => {
    if (pgEducationType.includes(value)) {
      setPgEducationType(pgEducationType.filter((id) => id !== value));
    } else {
      setPgEducationType([...pgEducationType, value]);
    }
  };

  const handleShowPpgEducationType = (value: any) => {
    if (PpgEducationType.includes(value)) {
      setPpgEducationType(PpgEducationType.filter((id) => id !== value));
    } else {
      setPpgEducationType([...PpgEducationType, value]);
    }
  };

  const handleShowCandidateClick = (buttonId: any) => {
    if (showCandidateButtons.includes(buttonId)) {
      // If the button is already clicked, remove it from the array
      setShowCandidateButtons(
        showCandidateButtons.filter((id) => id !== buttonId)
      );
    } else {
      // If the button is not clicked, add it to the array
      setShowCandidateButtons([...showCandidateButtons, buttonId]);
    }
  };
  const handleButtonClick = (buttonId: any) => {
    let newClickedButtons;
    if (buttonId === "Any") {
      // If the clicked button is button 1, add or remove it from the array
      if (clickedButtons.includes(buttonId)) {
        newClickedButtons = clickedButtons.filter((id) => id !== buttonId);
      } else {
        newClickedButtons = [buttonId];
      }
    } else {
      // If the clicked button is not button 1, remove button 1 from the array
      newClickedButtons = clickedButtons.filter((id) => id !== "Any");
      // Add or remove the clicked button from the array
      if (clickedButtons.includes(buttonId)) {
        newClickedButtons = newClickedButtons.filter((id) => id !== buttonId);
      } else {
        newClickedButtons = [...newClickedButtons, buttonId];
      }
    }
    // Remove the color from button 1 if more than 3 buttons are clicked
    if (newClickedButtons.length > 3 && newClickedButtons.includes("Any")) {
      newClickedButtons = newClickedButtons.filter((id) => id !== "Any");
    }
    setClickedButtons(newClickedButtons);
  };
  const [expError, setExpError] = useState(false);
  const [salaryError, setSalaryError] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const validate = (values: any) => {
    if (
      Number(values?.experienceYearFrom?.value) >
      Number(values?.experienceYearTo?.value)
    ) {
      setExpError(true);
    } else {
      setExpError(false);
    }
    if (values.minSalary !== "" && values.maxSalary !== "") {
      if (Number(values?.minSalary) > Number(values?.maxSalary)) {
        setSalaryError(true);
      } else {
        setSalaryError(false);
      }
    }
    if (values?.minimumAge?.value > values?.maximumAge?.value) {
      setAgeError(true);
    } else {
      setAgeError(false);
    }
  };
  const [selectedOptions, setSelectedOptions] = useState<MultiNestedOption[]>(
    []
  ),
    [output, setOutput] = useState<MultiNestedOption[]>([]);

  const handleOptionSelect = (option: MultiNestedOption) => {
    const index = selectedOptions.findIndex((o) => o.value === option.value);
    if (index !== -1) {
      setSelectedOptions(output.filter((o) => o.value !== option.value));
      setOutput(output.filter((o) => o.value !== option.value)); // remove unchecked option from output
    } else {
      if (!option.children) {
        setOutput([...output, option]);
      }
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const renderOption = (option: MultiNestedOption, depth: number = 0) => {
    const isOptionGroup = option.children !== undefined;
    const optionClassName = isOptionGroup ? "option-group" : "option";
    const isSelected = selectedOptions.some((o) => o.value === option.value);

    return (
      <div
        key={option.value}
        className={`${optionClassName} depth-${depth}`}
        style={{
          paddingLeft: `${(depth + 1) * 10}px`,
        }}
      >
        <label>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => handleOptionSelect(option)}
          />
          {option.label}
        </label>
        {isOptionGroup && isSelected && (
          <div className="option-children">
            {option.children?.map((childOption) =>
              renderOption(childOption, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  const [companyInputValue, setCompanyInputValue] = useState("");
  const handleInputChanges = (newValue: string) => {
    setCompanyInputValue(newValue.replace(/[^a-zA-Z0-9-.',()&@*\s]*$/, ""));
  };

  const [excCompanyInputValue, setEcxCompanyInputValue] = useState("");
  const handleExCoInputChanges = (newValue: string) => {
    setEcxCompanyInputValue(newValue.replace(/[^a-zA-Z0-9-.',()&@*\s]*$/, ""));
  };

  const [desigInputValue, setdesigInputValue] = useState("");
  const handledesigInputChanges = (newValue: string) => {
    setdesigInputValue(newValue.replace(/[^a-zA-Z0-9-.',:!()&+#/>\s]*$/, ""));
  };

  const [inputValue, setInputValue] = useState("");
  const handleInputInstitute = (newValue: string) => {
    setInputValue(newValue.replace(/[^a-zA-Z0-9. , - _ ’ ' & ()\ @ \s]*$/, ""));
  };

  const [ugInputValue, setUgInputValue] = useState("");
  const handleUgInputInstitute = (newValue: string) => {
    setUgInputValue(
      newValue.replace(/[^a-zA-Z0-9. , - _ ’ ' & ()\ @ \s]*$/, "")
    );
  };

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
  const loadSkillsOptions = useCallback(debounce(filterSkills, 1000), []);

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
  const yearmonthData = useSelector((state: any) => state.yearmonthMasterdata);
  const { allYearMonth } = yearmonthData;
  const [year, setyear] = useState<any>([]);
  const CompanymasterData = useSelector((state: any) => state.compnayname);
  const { CompanyData } = CompanymasterData;
  const [yearData, setYearData] = useState<any>();

  const [companyname, setcompanyname] = useState<any>([]);
  useEffect(() => {
    if (Array.isArray(CompanyData)) {
      const Data = CompanyData?.map((c: any) => {
        return {
          label: c,
          value: c,
        };
      });
      setcompanyname(Data);
    }
  }, [CompanyData]);
  useEffect(() => { }, [companyname]);

  const filterColors3 = (inputValue: string) => {
    return companyname.filter((i) =>
      i.label?.toLowerCase().includes(inputValue?.toLowerCase())
    );
  };
  const promiseOptions3: any = (inputValue: string) =>
    new Promise<selectType[]>((resolve) => {
      setTimeout(() => {
        resolve(filterColors3(inputValue));
      }, 1000);
    });

  const filterColors4 = (inputValue: string) => {
    return desig.filter((i) =>
      i.label?.toLowerCase().includes(inputValue?.toLowerCase())
    );
  };
  const promiseOptions4 = (inputValue: string) =>
    new Promise<selectType[] | any>((resolve) => {
      setTimeout(() => {
        resolve(filterColors4(inputValue));
      }, 1000);
    });

  const filterUniversities = (inputValue: string) => {
    return universities.filter((i) =>
      i?.label?.toLowerCase().includes(inputValue?.toLowerCase())
    );
  };

  const instituteOptions = (inputValue: string) =>
    new Promise<[]>((resolve) => {
      setTimeout(() => {
        resolve(filterUniversities(inputValue));
      }, 1000);
    });

  const filterUgCourseArray = (inputValue: string) => {
    return ugcourseArr.filter((i) =>
      i?.label?.toLowerCase().includes(inputValue?.toLowerCase())
    );
  };

  const ugCourseOptions = (inputValue: string) => {
    return new Promise<[]>((resolve) => {
      setTimeout(() => {
        resolve(filterUgCourseArray(inputValue));
      }, 1000);
    });
  };

  const filterPgCourseArray = (inputValue: string) => {
    return pgcourseArr.filter((i) =>
      i?.label?.toLowerCase().includes(inputValue?.toLowerCase())
    );
  };

  const pgCourseOptions = (inputValue: string) => {
    return new Promise<[]>((resolve) => {
      setTimeout(() => {
        resolve(filterPgCourseArray(inputValue));
      }, 1000);
    });
  };

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
      allYearMonth.map((opt: any) => {
        if (opt.group === "PAYE") {
          let obj: any = [];
          opt.data.map((item: any, index) => {
            obj.push({ value: item, label: item });
          });
          setYearData(obj.reverse());
        }
      });
    }
  }, [allYearMonth]);
  const DesignationmasterData = useSelector((state: any) => state.designation);
  const { DesignationData } = DesignationmasterData;
  const [desig, setDesig] = useState<any>([]);
  useEffect(() => {
    if (Array.isArray(DesignationData)) {
      const data = DesignationData?.map((c: any) => {
        return {
          label: c,
          value: c,
        };
      });
      setDesig(data);
    }
  }, [DesignationData]);

  const [deptState, setDeptstate] = useState<any>();

  const { IndustryType } = useSelector((state: any) => state.industryType);
  const department_master_data = useSelector(
    (state: any) => state.departmentdata
  );
  const institutes = useSelector((state: any) => state.institue);
  const { universityData, universityloading } = institutes;
  const departmentmasterdata = (data: any) => {
    setDeptstate(
      data?.map((d: any) => {
        return { label: d?.name, value: d?.id };
      })
    );
  };
  useEffect(() => {
    if (
      department_master_data &&
      department_master_data?.DepartmentData &&
      Array.isArray(department_master_data?.DepartmentData)
    )
      departmentmasterdata(department_master_data?.DepartmentData);
  }, [
    !department_master_data?.dptloading,
    department_master_data?.DepartmentData,
  ]);
  useEffect(() => {
    if (
      IndustryType &&
      IndustryType?.code &&
      IndustryType?.code === 200 &&
      !industries.length
    ) {
      IndustryType?.data.map((e: any, i: number) => {
        industries.push({ value: `${1 + i}`, label: e });
      });
    }
  }, [IndustryType]);

  useEffect(() => {
    if (universityData && !universityloading && Array.isArray(universityData)) {
      universities = universityData.map((e: any) => {
        return {
          label: e,
          value: e,
        };
      });
    }
  }, [universityData]);
  const citymasterData = useSelector((state: any) => state.locationcity);
  const { LocationcityData } = citymasterData;
  const [locationcity, setLocationcity] = useState<any>([]);
  const snackAlert = UseToastAlert();
  const [searchData, setSearchData] = useState<any[]>([]);
  const [intialCall, setIntialCall] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [loadedPages, setLoadedPages] = useState<number[]>([]);
  const [displayNoMore, setDisplayNoMore] = useState(false);
  const [myLoading, setMyLoading] = useState(false);
  const showSnackAlert = UseToastAlert();
  const { Emails, loadReM } = useSelector((state: any) => state.emailSend);

  useEffect(() => {
    if (!loadReM && Emails?.code == 200) {
      showSnackAlert("success", Emails?.message);
      dispatch(recruitmentMailReset());
    }
    if (!loadReM && Emails?.code == 400) {
      showSnackAlert("warning", Emails?.message[0]);
      dispatch(recruitmentMailReset());
    }
    if (
      !loadReM &&
      Emails?.code > 200 &&
      Emails.code < 410 &&
      Emails.code != 400
    ) {
      showSnackAlert("warning", Emails?.message);
      dispatch(recruitmentMailReset());
    }
    if (!loadReM && Emails?.code >= 500) {
      showSnackAlert("error", Emails?.message);
      dispatch(recruitmentMailReset());
    }
  }, [Emails, loadReM]);
  useEffect(() => {
    setMyLoading(true);
    if (SearchProfileData?.code == 200 && !loadingSp) {
      if (SearchProfileData?.data?.js?.length > 0) {
        const userids = SearchProfileData?.data?.js?.map((e: any) => {
          return e?.user_id;
        });
        dispatch(
          downloadSAS({
            id: [...userids],
            sasFor: "IMG",
          })
        );

        setSearchData((prevData) => [
          ...prevData,
          ...SearchProfileData?.data?.js,
        ]);
        setCurrentPage((prevPage) => prevPage + 1);
      }
    } else if (
      SearchProfileData?.code > 200 &&
      SearchProfileData?.code < 410 &&
      !loadingSp
    ) {
      snackAlert("warning", SearchProfileData?.message);
      dispatch(resetPostSearchProfile());
    } else if (SearchProfileData?.code >= 500 && !loadingSp) {
      snackAlert("error", SearchProfileData?.message);
      dispatch(resetPostSearchProfile());
    }
    setMyLoading(false);
  }, [SearchProfileData]);
  useEffect(() => {
    setMyLoading(true);
    if (sasData?.code == 200 && !load) {
      if (sasData?.data?.length > 0) {
        setImages((prevData) => [...prevData, ...sasData?.data]);
      }
    }
    setMyLoading(false);
  }, [sasData]);

  useEffect(() => {
    if (Array.isArray(LocationcityData)) {
      const data = LocationcityData?.map((c: any) => {
        return {
          label: c,
          value: c,
        };
      });
      setLocationcity(data);
    }
  }, [LocationcityData]);
  useEffect(() => {
    if (JSMasterData) {
      if (Array.isArray(JSMasterData)) {
        let dphd: any = [];
        let mpag: any = [];
        JSMasterData?.map((opt: any) => {
          if (opt?.group === "DPHD") {
            dphd = createDataWithId(opt?.data, true);
          }
          if (opt?.group === "MAPG") {
            mpag = createDataWithId(opt?.data, true);
          }
          if (opt?.group === "BAUG") {
            const obj: any = createDataWithId(opt?.data, false);
            setugCourseData(obj);
          }
          if (opt?.group === "CTGY") {
            setCategoryOpt([
              ...opt?.data?.map((item: any) => {
                return { value: item?.id, label: item?.value };
              }),
            ]);
          }
          if (opt.group === "WPOC") {
            setOptions([
              ...opt?.data?.map((item) => {
                return { value: item?.id, label: item?.value };
              }),
            ]);
          }
        });
        pgcourse = dphd.concat(mpag);
        setpgCourseData(pgcourse);
      }
    }
  }, [JSMasterData]);
  useEffect(() => {
    setIntialCall(true);
    setLoadedPages([]);
    setSearchData([]);
    setCurrentPage(1);
    dispatch(recruitmentMailReset());
    dispatch(resetPostSearchProfile());
    dispatch(resetSAS());
    setPagination(false);
    const masterDataObj = [
      {
        group: "All",
        active: 1,
      },
    ];
    dispatch(jobSeekerProfileMasterData(masterDataObj));
    const yearmonthObj = [
      {
        group: "All",
        params: [],
      },
    ];
    dispatch(getYearMonth(yearmonthObj));
    dispatch(SkillsMasterData({ pageno: -1, search: "" }));
    dispatch(DepartmentMasterData({ pageno: -1, search: "" }));
    dispatch(getIndustryType({ pageno: -1, search: "" }));
    dispatch(CompanyMasterData({ pageno: -1, search: "" }));
    dispatch(DesignationMasterData({ pageno: -1, search: "" }));
    dispatch(universitiesMasterData({ pageno: -1, search: "" }));
    dispatch(LocationcityMasterData({ pageno: -1, search: "" }));
    setDisplayNoMore(false);
    const bodyData = {
      pageid: 1,
      // displaydetails: { show_only_candidate: ["Verified Mobile Number"] },
    };

    dispatch(SearchProfiles(bodyData));
    return () => {
      dispatch(recruitmentMailReset());
      dispatch(resetPostSearchProfile());
      dispatch(resetSAS());
    };
  }, []);

  const handleClear = () => {
    dispatch(resetPostSearchProfile());
    setPagination(false);
    setCurrentPage(1);
    setDisplayNoMore(false);
    setLoadedPages([]);
    setSearchData([]);
    setIntialCall(true);
    const bodyData = {
      pageid: 1,
      // displaydetails: { show_only_candidate: ["Verified Mobile Number"] },
    };
    dispatch(SearchProfiles(bodyData));
  };

  const dispatch = useDispatch();

  const ref = useRef<HTMLDivElement>(null);
  const [selectAll, setSelectAll] = React.useState(false);

  function handleScroll() {
    const { scrollTop, clientHeight, scrollHeight } = ref.current || {};
    if (
      scrollTop &&
      clientHeight &&
      scrollHeight &&
      scrollTop + clientHeight >= scrollHeight - 5
    ) {
      // Trigger function to load more data
      if (
        SearchProfileData?.data?.js?.length == 10 &&
        !loadingSp &&
        !loadedPages.includes(currentpage)
      ) {
        setLoadedPages((prevLoadedPages) => [...prevLoadedPages, currentpage]);
        setDisplayNoMore(true);
        if (intialCall) {
          const bodyData = {
            pageid: currentpage,
            displaydetails: {
              // show_only_candidate: ["Verified Mobile Number"],
            },
          };
          dispatch(SearchProfiles(bodyData));
        } else {
          let data = { ...bodyDatas, pageid: currentpage };
          dispatch(SearchProfiles(data));
        }
        setLoadedPages((prevLoadedPages) => [...prevLoadedPages, currentpage]);
      }
    }
  }
  return (
    <div
      style={{ overflowY: "auto", maxHeight: "100vh" }}
      onScroll={handleScroll}
      ref={ref}
    >
      <Formik
        initialValues={IntialValueForm}
        enableReinitialize={true}
        validate={validate}
        validateOnMount={true}
        onSubmit={(values, { resetForm }) => {
          // dispatch(resetPostSearchProfile());

          const bodyData = { pageid: currentpage };

          if (values.keySkills.length > 0) {
            bodyData["keyskills"] = values?.keySkills?.map((e) => e?.label);
          }
          if (inputFields?.length > 0) {
            bodyData["itskills"] = [];

            inputFields?.map((e) => {
              if (e?.skill?.label) {
                bodyData["itskills"].push({
                  skill: e?.skill?.label,

                  exp: e?.exp?.value ? e?.exp?.value : 0,
                });
              } else {
                return;
              }
            });
          }

          if (values.experienceYearFrom && values.experienceYearTo) {
            bodyData["exp"] = {
              min: values.experienceYearFrom.label,
              max: values.experienceYearTo.label,
            };
          }
          if (values.currentLocation.length > 0) {
            bodyData["location"] = values?.currentLocation?.map(
              (e) => e?.label
            );
          }
          if (values.minSalary && values.maxSalary) {
            bodyData["currency"] = values.currency;
            bodyData["salary"] = {
              min: Number(values.minSalary) * 100000,
              max: Number(values.maxSalary) * 100000,
            };
          }
          let empl: any = {};
          if (values.departmentalArea.length > 0) {
            empl["department"] = values.departmentalArea.map((e) => e.label);
          }
          if (values.industy.length > 0) {
            empl["industry"] = values.industy.map((e) => e.label);
          }
          if (values.IncludeCompany.length > 0) {
            empl["company"] = values.IncludeCompany.map((e) => e.label);
          }
          if (values.ExcludeCompany.length > 0) {
            empl["exclude_company"] = values.ExcludeCompany.map((e) => e.label);
          }
          if (values.Desination.length > 0) {
            empl["designation"] = values.Desination.map((e) => e.label);
          }
          if (clickedButtons.length > 0) {
            empl["notice_period"] = clickedButtons;
          }
          if (Object.keys(empl).length > 0) {
            bodyData["employment"] = empl;
          }

          let edu: any = {};
          let uqQual: any = {};
          let pgQual: any = {};
          if (anyug || spUg || noUg) {
            if (noUg) {
              uqQual["type"] = "no";
            } else {
              uqQual["type"] = "any";
            }
          }
          if (values.ugCrc.length > 0)
            uqQual["course"] = values.ugCrc.map((e) => e.label);
          if (values.ugIns.length > 0)
            uqQual["institute"] = values.ugIns.map((e) => e.label);
          if (ugEducationType.length > 0)
            uqQual["edu_type"] = ugEducationType.map((e) => e);
          if (values.ugFrom != null) uqQual["start_year"] = values.ugFrom.value;
          if (values.ugTo != null) uqQual["end_year"] = values.ugTo.value;

          if (Object.keys(uqQual).length > 0) {
            edu["ugQualification"] = uqQual;
          }
          if (anyPg || spPg || noPg) {
            if (noPg) {
              pgQual["type"] = "no";
            } else {
              pgQual["type"] = "any";
            }
          }
          if (values.pgCrc.length > 0)
            pgQual["course"] = values.pgCrc.map((e) => e.label);
          if (values.pgIns.length > 0)
            pgQual["institute"] = values.pgIns.map((e) => e.label);
          if (pgEducationType.length > 0)
            pgQual["edu_type"] = pgEducationType.map((e) => e);
          if (values?.pgFrom?.value) pgQual["start_year"] = values.pgFrom.value;
          if (values?.pgTo?.value) pgQual["end_year"] = values.pgTo.value;
          if (Object.keys(pgQual).length > 0) {
            edu["pgQualification"] = pgQual;
          }

          if (Object.keys(edu).length > 0) {
            bodyData["education"] = edu;
          }
          let diversity = {};
          if (values?.candidates) {
            diversity["gender"] = values.candidates;
          }
          if (values?.employmentType?.label) {
            diversity["emp_type"] = values?.employmentType?.label;
          }
          if (values.disability) diversity["pwd"] = values.disability;
          if (values?.candidateCatagory?.length > 0)
            diversity["category"] = values?.candidateCatagory?.map(
              (e) => e.label
            );
          if (values.minimumAge && values.maximumAge) {
            const ages = {
              min: values.minimumAge.value,
              max: values.maximumAge.value,
            };
            diversity["age"] = ages;
          }
          if (values.workPermitFor.length > 0)
            diversity["work_permit"] = values.workPermitFor.map((e) => e.label);

          if (Object.keys(diversity).length > 0) {
            bodyData["diversity"] = diversity;
          }
          let displayDetails = {};
          if (showCandidateButtons.length > 0)
            displayDetails["show_only_candidate"] = showCandidateButtons;
          if (values.activeIn)
            displayDetails["active_in"] = values.activeIn.label;
          if (Object.keys(displayDetails).length > 0) {
            bodyData["displaydetails"] = displayDetails;
          }

          dispatch(SearchProfiles(bodyData));
          setBodyData(bodyData);
          resetForm();
        }}
        innerRef={formikRef}
      >
        {(formik: any) => {
          const {
            values,
            resetForm,
            handleChange,
            handleSubmit,
            setFieldValue,
            errors,
            touched,
            handleBlur,
            isValid,
            dirty,
          } = formik;
          return (
            <div>
              <React.Fragment key={"right"}>
                <div className="page-content bg-white">
                  <div className="content-block">
                    <div className="browse-job section-full bg-white p-t50 p-b20">
                      <div className="container">
                        <div className="job-bx browse-job clearfix mt-5 m-b30">
                          <div className="job-bx-title clearfix NativeTitle">
                            <div>
                              <h5 className="font-weight-700 pull-left text-uppercase">
                                ADVANCE FILTER
                              </h5>
                            </div>
                            <div className="float-right">
                              <Stack direction="row" spacing={1}>
                                <Chip
                                  label={
                                    <span className="custom-job-content text-bold">
                                      Total Applicants
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
                                      {SearchProfileData?.data?.totalCount
                                        ? SearchProfileData?.data?.totalCount
                                        : "0"}
                                    </Avatar>
                                  }
                                />
                              </Stack>
                            </div>
                          </div>

                          <div className="row mb-2">
                            <div className="col">
                              <div
                                className="float-right"
                                style={{
                                  width: "250px",
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                <div>
                                  {pagenation && (
                                    <Button
                                      className="mr-2"
                                      variant="secondary"
                                      style={{
                                        width: "100px",
                                      }}
                                      onClick={() => {
                                        handleClear();
                                        formik.resetForm();
                                      }}
                                    >
                                      Refresh
                                    </Button>
                                  )}
                                </div>

                                <div>
                                  <Button onClick={toggleDrawer("right", true)}>
                                    <FaFilter />
                                    {"Advance filter"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <Drawer anchor={"right"} open={state["right"]}>
                            <Box
                              sx={{
                                width: 600,
                                paddingLeft: 2,
                                paddingRight: 2,
                              }}
                              role="presentation"
                            >
                              {" "}
                              <div className="modal-custom-header float-right ml-aut m-r10">
                                <button
                                  type="button"
                                  className="close"
                                  onClick={toggleDrawer("right", false)}
                                >
                                  <span aria-hidden="true">&times;</span>
                                </button>
                              </div>{" "}
                              <br />
                              <br />
                              <div>
                                <form
                                  className="tab-pane active"
                                  autoComplete="off"
                                  onSubmit={(e) => {
                                    e.preventDefault();
                                    setSearchData([]);
                                    setLoadedPages([]);
                                    setCurrentPage(1);
                                    setDisplayNoMore(false);
                                    setPagination(true);
                                    setIntialCall(false);
                                    handleSubmit();
                                  }}
                                >
                                  <Accordion
                                    className="mb-3"
                                    sx={{
                                      boxShadow: "none",
                                    }}
                                  >
                                    <AccordionSummary
                                      expandIcon={<ExpandMoreIcon />}
                                      aria-controls="panel1a-content"
                                      id="panel1a-header"
                                      style={{
                                        padding: "0px 0px",
                                      }}
                                    >
                                      <Typography>
                                        <b>BASIC DETAILS</b>
                                      </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                      <div className="form-group">
                                        {" "}
                                        <label className="font-weight-700">
                                          {" "}
                                          Key Skills{" "}
                                        </label>{" "}
                                        {!values.keySkillsCheckbox && (
                                          <AsyncCreatableSelect
                                            components={components}
                                            placeholder="Enter your area of Expertise/Specilization"
                                            cacheOptions
                                            isClearable={true}
                                            className="dropstyle"
                                            name="keySkills"
                                            isMulti
                                            noOptionsMessage={() =>
                                              "Enter keyword to search"
                                            }
                                            value={values.keySkills}
                                            onChange={(options) => {
                                              let event = {
                                                target: {
                                                  name: "keySkills",
                                                  value: options,
                                                },
                                              };
                                              handleChange(event);
                                            }}
                                            loadOptions={loadSkillsOptions}
                                          />
                                        )}{" "}
                                        {values.keySkillsCheckbox && (
                                          <div>
                                            <input
                                              type="text"
                                              placeholder="Enter keySkills"
                                              className="form-control"
                                              style={{
                                                paddingLeft: "10px",
                                                width: "100%",
                                                border: "0px",
                                                fontSize: "13px",
                                                minHeight: "38px",
                                                boxShadow:
                                                  "0 0 10px 0 rgb(0 24 128 / 10%) ",
                                              }}
                                            />
                                          </div>
                                        )}
                                      </div>{" "}
                                      <div className="form-group">
                                        {" "}
                                        <label className="font-weight-700">
                                          IT Skills
                                        </label>{" "}
                                        <Alert
                                          key="primary"
                                          variant="primary"
                                          style={{
                                            fontSize: "12px",
                                            color: "black",
                                          }}
                                        >
                                          {" "}
                                          Candidates often miss filling the IT
                                          skills section in their profile.
                                          Searching for them based on IT skills
                                          might lead to limit search result.{" "}
                                        </Alert>{" "}
                                      </div>{" "}
                                      <div>
                                        {" "}
                                        {inputFields.map((field, index) => (
                                          <div
                                            className="form-group"
                                            key={index}
                                          >
                                            <div className="row">
                                              <div className="col-lg-5 col-md-5 col-sm-5 col-5">
                                                <AsyncCreatableSelect
                                                  placeholder="Enter skills"
                                                  value={field.skill}
                                                  noOptionsMessage={() =>
                                                    "Enter keyword to search"
                                                  }
                                                  cacheOptions
                                                  isClearable={true}
                                                  onChange={(option: any) => {
                                                    handleSkillChange(
                                                      field.id,
                                                      option
                                                    );
                                                  }}
                                                  name="skills"
                                                  loadOptions={promiseOptions}
                                                />
                                              </div>
                                              <div className="col-lg-5 col-md-5 col-sm-5 col-5">
                                                <Select
                                                  className="basic-single"
                                                  classNamePrefix="select"
                                                  placeholder="Enter experience"
                                                  isClearable={true}
                                                  isSearchable={true}
                                                  value={field.exp}
                                                  name="color"
                                                  options={year}
                                                  onChange={(option: any) => {
                                                    handleExpChange(
                                                      field.id,
                                                      option
                                                    );
                                                  }}
                                                />
                                              </div>
                                              <div className="col-lg-2 col-md-2 col-sm-2 col-2">
                                                <Button
                                                  onClick={() =>
                                                    handleRemoveFields(field.id)
                                                  }
                                                  style={{
                                                    backgroundColor: "white",
                                                    borderColor: "white",
                                                  }}
                                                >
                                                  <RemoveCircleIcon
                                                    style={{
                                                      color: "red",
                                                    }}
                                                  />
                                                </Button>{" "}
                                              </div>
                                            </div>
                                          </div>
                                        ))}{" "}
                                        <Button
                                          onClick={() => handleAddFields()}
                                          style={{
                                            backgroundColor: "white",
                                            borderColor: "white",
                                            color: "blue",
                                          }}
                                        >
                                          {" "}
                                          +Add IT Skills{" "}
                                        </Button>{" "}
                                      </div>{" "}
                                      <div className="form-group">
                                        <label>Experience in years</label>

                                        <div className="row">
                                          <div className="col-lg-4 col-md-4 col-sm-4 col-4">
                                            <Select
                                              className="dropstyle"
                                              placeholder="From"
                                              classNamePrefix="select"
                                              isClearable={true}
                                              value={values.experienceYearFrom}
                                              isSearchable={true}
                                              name="experienceYearFrom"
                                              onChange={(options) => {
                                                let event = {
                                                  target: {
                                                    name: "experienceYearFrom",
                                                    value: options,
                                                  },
                                                };
                                                handleChange(event);
                                              }}
                                              options={ExperienceYears}
                                            />
                                          </div>

                                          <div className="col-lg-4 col-md-4 col-sm-4 col-4">
                                            <Select
                                              className="dropstyle"
                                              classNamePrefix="select"
                                              placeholder="To"
                                              value={values.experienceYearTo}
                                              isClearable={true}
                                              isSearchable={true}
                                              name="experienceYearTo"
                                              onChange={(options) => {
                                                let event = {
                                                  target: {
                                                    name: "experienceYearTo",
                                                    value: options,
                                                  },
                                                };
                                                handleChange(event);
                                              }}
                                              options={ExperienceYears}
                                            />
                                          </div>
                                        </div>
                                        {expError && (
                                          <p className="form-error">
                                            Experience To must be greater than
                                            Experience From.{" "}
                                          </p>
                                        )}
                                      </div>
                                      <div>
                                        <div className="form-group">
                                          <label>
                                            Current location of candidates (max
                                            10)
                                          </label>
                                          <div>
                                            <Select
                                              isOptionDisabled={() =>
                                                locationLimit
                                              }
                                              isMulti={true}
                                              isClearable={true}
                                              maxMenuHeight={200}
                                              name="currentLocation"
                                              placeholder="Select Current Location"
                                              options={locationcity}
                                              className="dropstyle"
                                              value={values.currentLocation}
                                              onChange={(selectedOption) => {
                                                ugLimit(
                                                  "Location",
                                                  selectedOption
                                                );
                                                let event = {
                                                  target: {
                                                    name: "currentLocation",
                                                    value: selectedOption,
                                                  },
                                                };
                                                handleChange(event);
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                      <div></div>
                                      <div className="form-group">
                                        <label>Annual Salary</label>

                                        <div className="col-lg-12  d-flex">
                                          <div>
                                            <select
                                              id="cars"
                                              form="carform"
                                              name="currency"
                                              value={values.currency}
                                              onChange={(e) => {
                                                setFieldValue(
                                                  "currency",
                                                  e?.target?.value
                                                );
                                              }}
                                            >
                                              <option value="INR">INR</option>
                                              <option value="USD">USD</option>
                                            </select>
                                          </div>
                                          <div>
                                            <input
                                              type="text"
                                              min="0"
                                              maxLength={2}
                                              style={{
                                                textAlign: "center",
                                                borderWidth: "0px 0px 2px 0px",
                                                outline: "none",
                                                width: "150px",
                                              }}
                                              name="minSalary"
                                              value={values.minSalary}
                                              onChange={(e) => {
                                                if (
                                                  regex.numberRegx.test(
                                                    e.target.value
                                                  )
                                                ) {
                                                  setFieldValue(
                                                    "minSalary",
                                                    e?.target?.value
                                                  );
                                                }
                                              }}
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: "2%",
                                              marginRight: "2%",
                                            }}
                                          >
                                            {" "}
                                            <span>To</span>
                                          </div>
                                          <div>
                                            <input
                                              type="text"
                                              min="0"
                                              maxLength={3}
                                              value={values.maxSalary}
                                              name="maxSalary"
                                              style={{
                                                textAlign: "center",
                                                borderWidth: "0px 0px 2px 0px",
                                                outline: "none",
                                                width: "150px",
                                              }}
                                              onChange={(e) => {
                                                if (
                                                  regex.numberRegx.test(
                                                    e.target.value
                                                  )
                                                ) {
                                                  setFieldValue(
                                                    "maxSalary",
                                                    e?.target?.value
                                                  );
                                                }
                                              }}
                                            />
                                          </div>
                                          <div
                                            style={{
                                              marginLeft: "2%",
                                            }}
                                          >
                                            {values.currency == "INR" && (
                                              <span>lakhs</span>
                                            )}
                                            {values.currency == "USD" && (
                                              <span>hundred dollar</span>
                                            )}
                                          </div>
                                        </div>
                                        {salaryError && (
                                          <p className="form-error">
                                            Maximum salary must be greater than
                                            Minimum salary.{" "}
                                          </p>
                                        )}
                                      </div>
                                      <div>
                                        <div
                                          className="form-group"
                                          style={{
                                            marginLeft: "3%",
                                          }}
                                        ></div>
                                      </div>
                                    </AccordionDetails>
                                  </Accordion>
                                  <Accordion
                                    className="mb-3"
                                    sx={{
                                      boxShadow: "none",
                                    }}
                                  >
                                    <AccordionSummary
                                      expandIcon={<ExpandMoreIcon />}
                                      aria-controls="panel1a-content"
                                      id="panel1a-header"
                                      style={{
                                        padding: "0px 0px",
                                      }}
                                    >
                                      <Typography>
                                        <b>EMPLOYMENT DETAILS</b>
                                      </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                      <div className="form-group">
                                        <label>Departmental Area</label>
                                        <div>
                                          <Select
                                            isMulti
                                            name="departmentalArea"
                                            placeholder="Select Departmental Area"
                                            value={values.departmentalArea}
                                            onChange={(options) => {
                                              let event = {
                                                target: {
                                                  name: "departmentalArea",
                                                  value: options,
                                                },
                                              };
                                              handleChange(event);
                                            }}
                                            options={deptState}
                                            className="dropstyle"
                                            classNamePrefix="select"
                                          />
                                        </div>
                                      </div>
                                      <div className="form-group ">
                                        <label>Industry</label>
                                        <div>
                                          <Select
                                            isMulti
                                            name="industy"
                                            placeholder="Select Industry"
                                            value={values.industy}
                                            onChange={(selectedOption) => {
                                              let event = {
                                                target: {
                                                  name: "industy",
                                                  value: selectedOption,
                                                },
                                              };
                                              handleChange(event);
                                            }}
                                            options={industries}
                                            className="dropstyle"
                                            classNamePrefix="select"
                                          />
                                        </div>
                                      </div>

                                      <div className="form-group">
                                        <label>Company</label>{" "}
                                        <div>
                                          {" "}
                                          {!values.IncludeCompanyCheckbox && (
                                            <AsyncCreatableSelect
                                              className="dropstyle"
                                              isMulti
                                              name="IncludeCompany"
                                              placeholder="Enter Company"
                                              cacheOptions
                                              noOptionsMessage={() =>
                                                "Enter keyword to search"
                                              }
                                              isValidNewOption={
                                                isValidNewOption
                                              }
                                              value={values.IncludeCompany}
                                              styles={customStyles}
                                              maxMenuHeight={200}
                                              isClearable={true}
                                              onChange={(selectedOption) => {
                                                let event = {
                                                  target: {
                                                    name: "IncludeCompany",
                                                    value: selectedOption,
                                                  },
                                                };
                                                handleChange(event);
                                              }}
                                              classNamePrefix="select"
                                              loadOptions={promiseOptions3}
                                              onInputChange={handleInputChanges}
                                              inputValue={companyInputValue}
                                            />
                                          )}
                                          {values.IncludeCompanyCheckbox && (
                                            <div>
                                              <input
                                                type="text"
                                                placeholder="Enter KeySkills"
                                                className="text-keySkills"
                                                style={{
                                                  paddingLeft: "10px",
                                                  width: "100%",
                                                  border: "0px",
                                                  fontSize: "13px",
                                                  minHeight: "38px",
                                                  boxShadow:
                                                    "0 0 10px 0 rgb(0 24 128 / 10%) ",
                                                }}
                                              />
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="form-group">
                                        <div className=" tab-content">
                                          <label>Exclude Company</label>
                                        </div>
                                        <div>
                                          {" "}
                                          {!values.ExcludeCompanyCheckbox && (
                                            <AsyncCreatableSelect
                                              isMulti
                                              name="ExcludeCompany"
                                              placeholder="Enter Exclude Company"
                                              noOptionsMessage={() =>
                                                "Enter keyword to search"
                                              }
                                              cacheOptions
                                              value={values.ExcludeCompany}
                                              onChange={(selectedOption) => {
                                                let event = {
                                                  target: {
                                                    name: "ExcludeCompany",
                                                    value: selectedOption,
                                                  },
                                                };
                                                handleChange(event);
                                              }}
                                              isClearable={true}
                                              maxMenuHeight={200}
                                              styles={customStyles}
                                              className="dropstyle"
                                              classNamePrefix="select"
                                              isValidNewOption={
                                                isValidNewOption
                                              }
                                              loadOptions={promiseOptions3}
                                              onInputChange={
                                                handleExCoInputChanges
                                              }
                                              inputValue={excCompanyInputValue}
                                            />
                                          )}{" "}
                                          {values.ExcludeCompanyCheckbox && (
                                            <div>
                                              <input
                                                type="text"
                                                placeholder="Enter KeySkills"
                                                className="text-keySkills"
                                                style={{
                                                  paddingLeft: "10px",
                                                  width: "100%",
                                                  border: "0px",
                                                  fontSize: "13px",
                                                  minHeight: "38px",
                                                  boxShadow:
                                                    "0 0 10px 0 rgb(0 24 128 / 10%) ",
                                                }}
                                              />
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="form-group">
                                        <label>Designation</label>
                                        <div></div>
                                        <div>
                                          {" "}
                                          {!values.DesinationCheckbox && (
                                            <AsyncCreatableSelect
                                              isMulti
                                              name="Desination"
                                              placeholder="Enter Designation"
                                              cacheOptions
                                              isValidNewOption={
                                                isValidNewOption
                                              }
                                              noOptionsMessage={() =>
                                                "Enter keyword to search"
                                              }
                                              isClearable={true}
                                              maxMenuHeight={200}
                                              styles={customStyles}
                                              value={values.Desination}
                                              onChange={(selectedOption) => {
                                                let event = {
                                                  target: {
                                                    name: "Desination",
                                                    value: selectedOption,
                                                  },
                                                };
                                                handleChange(event);
                                              }}
                                              options={desig}
                                              className="dropstyle"
                                              classNamePrefix="select"
                                              loadOptions={promiseOptions4}
                                              onInputChange={
                                                handledesigInputChanges
                                              }
                                              inputValue={desigInputValue}
                                            />
                                          )}{" "}
                                          {values.DesinationCheckbox && (
                                            <div>
                                              <input
                                                type="text"
                                                placeholder="Enter KeySkills"
                                                className="text-keySkills"
                                                style={{
                                                  paddingLeft: "10px",
                                                  width: "100%",
                                                  border: "0px",
                                                  fontSize: "13px",
                                                  minHeight: "38px",
                                                  boxShadow:
                                                    "0 0 10px 0 rgb(0 24 128 / 10%) ",
                                                }}
                                              />
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="form-group">
                                        <label>Notice Period</label>
                                        <div className="row mb-2">
                                          &emsp;
                                          <Chip
                                            label="Any"
                                            variant="outlined"
                                            style={{
                                              backgroundColor:
                                                clickedButtons.includes("Any")
                                                  ? "#0275d8"
                                                  : "",
                                              color: clickedButtons.includes(
                                                "Any"
                                              )
                                                ? "white"
                                                : "black",
                                            }}
                                            onClick={() => {
                                              handleButtonClick("Any");
                                            }}
                                          />
                                          &emsp;
                                          <Chip
                                            label="0-15 days"
                                            variant="outlined"
                                            style={{
                                              backgroundColor:
                                                clickedButtons.includes(
                                                  "15 Days or less"
                                                )
                                                  ? "#0275d8"
                                                  : "",
                                              color: clickedButtons.includes(
                                                "15 Days or less"
                                              )
                                                ? "white"
                                                : "black",
                                            }}
                                            onClick={() => {
                                              handleButtonClick(
                                                "15 Days or less"
                                              );
                                            }}
                                          />
                                          &emsp;
                                          <Chip
                                            label="1 month"
                                            variant="outlined"
                                            style={{
                                              backgroundColor:
                                                clickedButtons.includes(
                                                  "1 Month"
                                                )
                                                  ? "#0275d8"
                                                  : "",
                                              color: clickedButtons.includes(
                                                "1 Month"
                                              )
                                                ? "white"
                                                : "black",
                                            }}
                                            onClick={() => {
                                              handleButtonClick("1 Month");
                                            }}
                                          />
                                          &emsp;
                                          <Chip
                                            label="2 months"
                                            variant="outlined"
                                            style={{
                                              backgroundColor:
                                                clickedButtons.includes(
                                                  "2  Months"
                                                )
                                                  ? "#0275d8"
                                                  : "",
                                              color: clickedButtons.includes(
                                                "2  Months"
                                              )
                                                ? "white"
                                                : "black",
                                            }}
                                            onClick={() => {
                                              handleButtonClick("2  Months");
                                            }}
                                          />
                                        </div>
                                        <div className="row">
                                          &emsp;
                                          <Chip
                                            label="3 months"
                                            variant="outlined"
                                            style={{
                                              backgroundColor:
                                                clickedButtons.includes(
                                                  "3 Months"
                                                )
                                                  ? "#0275d8"
                                                  : "",
                                              color: clickedButtons.includes(
                                                "3 Months"
                                              )
                                                ? "white"
                                                : "black",
                                            }}
                                            onClick={() => {
                                              handleButtonClick("3 Months");
                                            }}
                                          />
                                          &emsp;
                                          <Chip
                                            label="more than 3-months"
                                            variant="outlined"
                                            style={{
                                              backgroundColor:
                                                clickedButtons.includes(
                                                  "More than 3  Months"
                                                )
                                                  ? "#0275d8"
                                                  : "",
                                              color: clickedButtons.includes(
                                                "More than 3  Months"
                                              )
                                                ? "white"
                                                : "black",
                                            }}
                                            onClick={() => {
                                              handleButtonClick(
                                                "More than 3  Months"
                                              );
                                            }}
                                          />
                                          &emsp;
                                          <Chip
                                            label="currently serving notice period"
                                            variant="outlined"
                                            style={{
                                              backgroundColor:
                                                clickedButtons.includes(
                                                  "Serving Notice Period"
                                                )
                                                  ? "#0275d8"
                                                  : "",
                                              color: clickedButtons.includes(
                                                "Serving Notice Period"
                                              )
                                                ? "white"
                                                : "black",
                                            }}
                                            onClick={() => {
                                              handleButtonClick(
                                                "Serving Notice Period"
                                              );
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </AccordionDetails>
                                  </Accordion>
                                  <Accordion
                                    className="mb-3"
                                    sx={{
                                      boxShadow: "none",
                                    }}
                                  >
                                    <AccordionSummary
                                      expandIcon={<ExpandMoreIcon />}
                                      aria-controls="panel1a-content"
                                      id="panel1a-header"
                                      style={{
                                        padding: "0px 0px",
                                      }}
                                    >
                                      <Typography>
                                        <b>EDUCATION DETAILS</b>
                                      </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                      <div className="form-group">
                                        <div className="page-wraper">
                                          <div
                                            className="page-content"
                                            style={{
                                              paddingBottom: "0px",
                                            }}
                                          >
                                            <div className="bg-white">
                                              <div
                                                className="container"
                                                style={{
                                                  paddingRight: "0px",
                                                  paddingLeft: "0px",
                                                  margin: "0px",
                                                }}
                                              >
                                                <div className="row">
                                                  <div className="col-lg-12 col-md-12">
                                                    <div className="row">
                                                      <div
                                                        className="col-xl-12 col-lg-12 col-md-12 col-sm-12"
                                                        style={{
                                                          paddingLeft: "0px",
                                                          paddingRight: "0px",
                                                        }}
                                                      >
                                                        <div className=" bg-white">
                                                          <div className="row col-lg-12 col-md-12 col-sm-12">
                                                            <div className="col-lg-12 col-md-12 col-sm-12">
                                                              <div>
                                                                <h5>
                                                                  UG
                                                                  Qualification
                                                                </h5>
                                                                <div className="row">
                                                                  &emsp;
                                                                  <Chip
                                                                    label="Any UG Qualification"
                                                                    style={{
                                                                      fontSize:
                                                                        "12px",
                                                                    }}
                                                                    onClick={() => {
                                                                      setAnyUg(
                                                                        (a) =>
                                                                          !a
                                                                      );
                                                                      setNoUg(
                                                                        false
                                                                      );
                                                                      setSpUg(
                                                                        false
                                                                      );
                                                                    }}
                                                                    color={
                                                                      anyug
                                                                        ? "primary"
                                                                        : "default"
                                                                    }
                                                                    className="col-lg-2"
                                                                  />
                                                                  &emsp;
                                                                  <Chip
                                                                    style={{
                                                                      fontSize:
                                                                        "12px",
                                                                    }}
                                                                    label="Specific UG Qualification"
                                                                    onClick={() => {
                                                                      setSpUg(
                                                                        (s) =>
                                                                          !s
                                                                      );
                                                                      setNoUg(
                                                                        false
                                                                      );
                                                                      setAnyUg(
                                                                        false
                                                                      );
                                                                    }}
                                                                    color={
                                                                      spUg
                                                                        ? "primary"
                                                                        : "default"
                                                                    }
                                                                    className="col-lg-2"
                                                                  />
                                                                  &emsp;
                                                                  <Chip
                                                                    style={{
                                                                      fontSize:
                                                                        "12px",
                                                                    }}
                                                                    label="No UG Qualification"
                                                                    onClick={() => {
                                                                      setNoUg(
                                                                        (n) =>
                                                                          !n
                                                                      );
                                                                      setSpUg(
                                                                        false
                                                                      );
                                                                      setAnyUg(
                                                                        false
                                                                      );
                                                                    }}
                                                                    color={
                                                                      noUg
                                                                        ? "primary"
                                                                        : "default"
                                                                    }
                                                                    className="col-lg-2"
                                                                  />
                                                                </div>
                                                                {noUg && (
                                                                  <p
                                                                    className="mt-4"
                                                                    style={{
                                                                      backgroundColor:
                                                                        "#cce5ff",
                                                                      fontFamily:
                                                                        "montserrat",
                                                                      marginBottom:
                                                                        "-3%",
                                                                      fontSize:
                                                                        "14px",
                                                                    }}
                                                                  >
                                                                    No Ug
                                                                    Qualification
                                                                    :- Candidate
                                                                    who have
                                                                    only
                                                                    completed
                                                                    10th or 12th
                                                                    but are not
                                                                    pursuing /
                                                                    have /
                                                                    pursued
                                                                    graduation
                                                                    appear in
                                                                    the result.
                                                                  </p>
                                                                )}
                                                                {spUg && (
                                                                  <div className="mt-2">
                                                                    <div className="form-group">
                                                                      <label>
                                                                        Choose
                                                                        Course
                                                                        (max 10)
                                                                      </label>
                                                                      <div>
                                                                        <AsyncCreatableSelect
                                                                          isOptionDisabled={() =>
                                                                            anyUgLimit
                                                                          }
                                                                          cacheOptions
                                                                          isClearable={
                                                                            true
                                                                          }
                                                                          components={
                                                                            components
                                                                          }
                                                                          isMulti={
                                                                            true
                                                                          }
                                                                          maxMenuHeight={
                                                                            200
                                                                          }
                                                                          name="ugCrc"
                                                                          placeholder="Enter Courses"
                                                                          value={
                                                                            values.ugCrc
                                                                          }
                                                                          noOptionsMessage={() =>
                                                                            "Enter keyword to search"
                                                                          }
                                                                          className="dropstyle"
                                                                          onChange={(
                                                                            selectedOption
                                                                          ) => {
                                                                            let event =
                                                                            {
                                                                              target:
                                                                              {
                                                                                name: "ugCrc",
                                                                                value:
                                                                                  selectedOption,
                                                                              },
                                                                            };
                                                                            handleChange(
                                                                              event
                                                                            );
                                                                            ugLimit(
                                                                              "AnyUG",
                                                                              selectedOption
                                                                            );
                                                                          }}
                                                                          loadOptions={
                                                                            ugCourseOptions
                                                                          }
                                                                        />
                                                                      </div>
                                                                    </div>
                                                                  </div>
                                                                )}
                                                                {(anyug ||
                                                                  spUg) && (
                                                                    <div className="mt-2">
                                                                      <div className="form-group">
                                                                        <label>
                                                                          Institute
                                                                          (max 10)
                                                                        </label>
                                                                        <div>
                                                                          <AsyncCreatableSelect
                                                                            isOptionDisabled={() =>
                                                                              specificUgLimit
                                                                            }
                                                                            components={
                                                                              components
                                                                            }
                                                                            maxMenuHeight={
                                                                              200
                                                                            }
                                                                            isClearable={
                                                                              true
                                                                            }
                                                                            noOptionsMessage={() =>
                                                                              "Enter keyword to search"
                                                                            }
                                                                            styles={
                                                                              customStyles
                                                                            }
                                                                            cacheOptions
                                                                            isMulti={
                                                                              true
                                                                            }
                                                                            value={
                                                                              values.ugIns
                                                                            }
                                                                            name="ugIns"
                                                                            placeholder="Enter Institutes"
                                                                            className="dropstyle"
                                                                            onChange={(
                                                                              selectedOption
                                                                            ) => {
                                                                              let event =
                                                                              {
                                                                                target:
                                                                                {
                                                                                  name: "ugIns",
                                                                                  value:
                                                                                    selectedOption,
                                                                                },
                                                                              };
                                                                              handleChange(
                                                                                event
                                                                              );
                                                                              ugLimit(
                                                                                "SpecificUG",
                                                                                selectedOption
                                                                              );
                                                                            }}
                                                                            loadOptions={
                                                                              instituteOptions
                                                                            }
                                                                            onInputChange={
                                                                              handleInputInstitute
                                                                            }
                                                                            inputValue={
                                                                              inputValue
                                                                            }
                                                                          />
                                                                        </div>
                                                                      </div>
                                                                    </div>
                                                                  )}
                                                                {(anyug ||
                                                                  spUg) && (
                                                                    <div className="mt-4">
                                                                      <div className="form-group">
                                                                        <label>
                                                                          Education
                                                                          Type
                                                                        </label>
                                                                        <div className="row mt-2">
                                                                          &emsp;
                                                                          <Chip
                                                                            label="Full Time"
                                                                            variant="outlined"
                                                                            onClick={() => {
                                                                              handleShowugEducationType(
                                                                                "Full Time"
                                                                              );
                                                                            }}
                                                                            style={{
                                                                              backgroundColor:
                                                                                ugEducationType.includes(
                                                                                  "Full Time"
                                                                                )
                                                                                  ? "#0275d8"
                                                                                  : "",
                                                                              color:
                                                                                ugEducationType.includes(
                                                                                  "Full Time"
                                                                                )
                                                                                  ? "white"
                                                                                  : "black",
                                                                            }}
                                                                            className="col-lg-1"
                                                                          />
                                                                          &emsp;
                                                                          <Chip
                                                                            label="Part Time"
                                                                            variant="outlined"
                                                                            onClick={() => {
                                                                              handleShowugEducationType(
                                                                                "Part Time"
                                                                              );
                                                                            }}
                                                                            style={{
                                                                              backgroundColor:
                                                                                ugEducationType.includes(
                                                                                  "Part Time"
                                                                                )
                                                                                  ? "#0275d8"
                                                                                  : "",
                                                                              color:
                                                                                ugEducationType.includes(
                                                                                  "Part Time"
                                                                                )
                                                                                  ? "white"
                                                                                  : "black",
                                                                            }}
                                                                            className="col-lg-1"
                                                                          />
                                                                          &emsp;
                                                                          <Chip
                                                                            label="Correspondence/ Distance Learning"
                                                                            variant="outlined"
                                                                            onClick={() => {
                                                                              handleShowugEducationType(
                                                                                "Correspondence/ Distance Learning"
                                                                              );
                                                                            }}
                                                                            style={{
                                                                              backgroundColor:
                                                                                ugEducationType.includes(
                                                                                  "Correspondence/ Distance Learning"
                                                                                )
                                                                                  ? "#0275d8"
                                                                                  : "",
                                                                              color:
                                                                                ugEducationType.includes(
                                                                                  "Correspondence/ Distance Learning"
                                                                                )
                                                                                  ? "white"
                                                                                  : "black",
                                                                            }}
                                                                            className="col-lg-1"
                                                                          />
                                                                        </div>
                                                                      </div>
                                                                    </div>
                                                                  )}
                                                                {(anyug ||
                                                                  spUg) && (
                                                                    <div className="mt-4">
                                                                      <div className="form-group">
                                                                        <label>
                                                                          Year of
                                                                          degree
                                                                          completion
                                                                        </label>
                                                                        <div className="row">
                                                                          <div className="col-lg-6">
                                                                            <Select
                                                                              name="ugFrom"
                                                                              className="dropstyle"
                                                                              placeholder="From"
                                                                              isClearable={
                                                                                true
                                                                              }
                                                                              value={
                                                                                formik
                                                                                  ?.values
                                                                                  ?.ugFrom
                                                                              }
                                                                              onChange={(
                                                                                option: any
                                                                              ) => {
                                                                                let event =
                                                                                {
                                                                                  target:
                                                                                  {
                                                                                    name: "From",
                                                                                    value:
                                                                                      option,
                                                                                  },
                                                                                };
                                                                                formik.setFieldValue(
                                                                                  "ugFrom",
                                                                                  option
                                                                                );
                                                                                setTouchedUgFrom(
                                                                                  true
                                                                                );
                                                                              }}
                                                                              options={
                                                                                yearData
                                                                              }
                                                                            />
                                                                          </div>
                                                                          <div className="col-lg-6">
                                                                            <Select
                                                                              name="ugTo"
                                                                              className="dropstyle"
                                                                              placeholder="To"
                                                                              isClearable={
                                                                                true
                                                                              }
                                                                              value={
                                                                                formik
                                                                                  ?.values
                                                                                  ?.ugTo
                                                                              }
                                                                              onChange={(
                                                                                option: any
                                                                              ) => {
                                                                                let event =
                                                                                {
                                                                                  target:
                                                                                  {
                                                                                    name: "ugTo",
                                                                                    value:
                                                                                      option,
                                                                                  },
                                                                                };
                                                                                formik.handleChange(
                                                                                  event
                                                                                );

                                                                                setTouchedUgTo(
                                                                                  true
                                                                                );
                                                                              }}
                                                                              options={
                                                                                yearData
                                                                              }
                                                                            />
                                                                          </div>
                                                                        </div>
                                                                        {touchedUgFrom &&
                                                                          touchedUgTo &&
                                                                          formik
                                                                            .values
                                                                            ?.ugFrom
                                                                            ?.value >
                                                                          formik
                                                                            .values
                                                                            ?.ugTo
                                                                            ?.value && (
                                                                            <p className="form-error">
                                                                              Please
                                                                              select
                                                                              from
                                                                              year
                                                                              less
                                                                              than
                                                                              to
                                                                              year.
                                                                            </p>
                                                                          )}
                                                                      </div>
                                                                    </div>
                                                                  )}
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>{" "}
                                            </div>{" "}
                                          </div>{" "}
                                        </div>
                                        {/* Pg Qualification ******************************************/}
                                        {!showPg && (
                                          <Button
                                            onClick={() => setShowPg(true)}
                                            style={{
                                              marginLeft: "-15px",
                                              marginTop: "10px",
                                              backgroundColor: "white",
                                              borderColor: "white",
                                              color: "blue",
                                            }}
                                          >
                                            {" "}
                                            +Add Pg Qualification{" "}
                                          </Button>
                                        )}
                                        {showPg && (
                                          <div className="page-wraper">
                                            <div
                                              className="page-content"
                                              style={{
                                                paddingBottom: "0px",
                                              }}
                                            >
                                              <div className="job-categories  bg-white">
                                                <div className="container">
                                                  <div className="row">
                                                    <div className="col-lg-12 col-md-12">
                                                      <div className="row">
                                                        <div
                                                          className="col-xl-12 col-lg-12 col-md-12 col-sm-12"
                                                          style={{
                                                            paddingLeft: "0px",
                                                            paddingRight: "0px",
                                                          }}
                                                        >
                                                          <div className="bg-white mt-4">
                                                            <div
                                                              className="row col-lg-12 col-md-12 col-sm-12"
                                                              style={{
                                                                paddingLeft:
                                                                  "0px",
                                                                paddingRight:
                                                                  "0px",
                                                              }}
                                                            >
                                                              <div
                                                                className="col-lg-12 col-md-12"
                                                                style={{
                                                                  paddingLeft:
                                                                    "0px",
                                                                  paddingRight:
                                                                    "0px",
                                                                }}
                                                              >
                                                                <div>
                                                                  <h5>
                                                                    PG
                                                                    Qualification
                                                                  </h5>
                                                                  <div className="row">
                                                                    &emsp;
                                                                    <Chip
                                                                      label="Any PG Qualification"
                                                                      onClick={() => {
                                                                        setAnyPg(
                                                                          (a) =>
                                                                            !a
                                                                        );
                                                                        setSpPg(
                                                                          false
                                                                        );
                                                                        setNoPg(
                                                                          false
                                                                        );
                                                                      }}
                                                                      color={
                                                                        anyPg
                                                                          ? "primary"
                                                                          : "default"
                                                                      }
                                                                      className="col-lg-2"
                                                                    />
                                                                    &emsp;
                                                                    <Chip
                                                                      label="Specific PG Qualification"
                                                                      onClick={() => {
                                                                        setSpPg(
                                                                          (s) =>
                                                                            !s
                                                                        );
                                                                        setAnyPg(
                                                                          false
                                                                        );
                                                                        setNoPg(
                                                                          false
                                                                        );
                                                                      }}
                                                                      color={
                                                                        spPg
                                                                          ? "primary"
                                                                          : "default"
                                                                      }
                                                                      className="col-lg-2"
                                                                    />
                                                                    &emsp;
                                                                    <Chip
                                                                      label="No PG Qualification"
                                                                      onClick={() => {
                                                                        setNoPg(
                                                                          (n) =>
                                                                            !n
                                                                        );
                                                                        setAnyPg(
                                                                          false
                                                                        );
                                                                        setSpPg(
                                                                          false
                                                                        );
                                                                      }}
                                                                      color={
                                                                        noPg
                                                                          ? "primary"
                                                                          : "default"
                                                                      }
                                                                      className="col-lg-2"
                                                                    />
                                                                  </div>
                                                                  {noPg && (
                                                                    <p
                                                                      className="mt-4"
                                                                      style={{
                                                                        backgroundColor:
                                                                          "#cce5ff",
                                                                        fontFamily:
                                                                          "montserrat",
                                                                        marginBottom:
                                                                          "-3%",
                                                                        fontSize:
                                                                          "14px",
                                                                      }}
                                                                    >
                                                                      No Pg
                                                                      Qualification
                                                                      :-
                                                                      Candidate
                                                                      who have
                                                                      only
                                                                      completed
                                                                      Under
                                                                      graduation
                                                                      but are
                                                                      not
                                                                      pursuing /
                                                                      have /
                                                                      pursued
                                                                      Post
                                                                      graduation
                                                                      appear in
                                                                      the
                                                                      result.
                                                                    </p>
                                                                  )}
                                                                  {spPg && (
                                                                    <div className="mt-2">
                                                                      <div className="form-group">
                                                                        <label>
                                                                          Choose
                                                                          Course
                                                                          (max
                                                                          10)
                                                                        </label>
                                                                        <div>
                                                                          <AsyncCreatableSelect
                                                                            isOptionDisabled={() =>
                                                                              specificPgCourLimit
                                                                            }
                                                                            isMulti={
                                                                              true
                                                                            }
                                                                            components={
                                                                              components
                                                                            }
                                                                            noOptionsMessage={() =>
                                                                              "Enter keyword to search"
                                                                            }
                                                                            cacheOptions
                                                                            isClearable={
                                                                              true
                                                                            }
                                                                            maxMenuHeight={
                                                                              200
                                                                            }
                                                                            name="pgCrc"
                                                                            placeholder="Enter Courses"
                                                                            styles={
                                                                              customStyles
                                                                            }
                                                                            className="dropstyle"
                                                                            loadOptions={
                                                                              pgCourseOptions
                                                                            }
                                                                            onChange={(
                                                                              selectedOption
                                                                            ) => {
                                                                              ugLimit(
                                                                                "SpecificPgCourse",
                                                                                selectedOption
                                                                              );
                                                                              let event =
                                                                              {
                                                                                target:
                                                                                {
                                                                                  name: "pgCrc",
                                                                                  value:
                                                                                    selectedOption,
                                                                                },
                                                                              };
                                                                              handleChange(
                                                                                event
                                                                              );
                                                                            }}
                                                                          />
                                                                        </div>
                                                                      </div>
                                                                    </div>
                                                                  )}
                                                                  {(anyPg ||
                                                                    spPg) && (
                                                                      <div className="mt-2">
                                                                        <div className="form-group">
                                                                          <label>
                                                                            Institute
                                                                            (max
                                                                            10)
                                                                          </label>
                                                                          <div>
                                                                            <AsyncCreatableSelect
                                                                              isOptionDisabled={() =>
                                                                                specificPgInstLimit
                                                                              }
                                                                              components={
                                                                                components
                                                                              }
                                                                              isMulti={
                                                                                true
                                                                              }
                                                                              noOptionsMessage={() =>
                                                                                "Enter keyword to search"
                                                                              }
                                                                              styles={
                                                                                customStyles
                                                                              }
                                                                              cacheOptions
                                                                              isClearable={
                                                                                true
                                                                              }
                                                                              maxMenuHeight={
                                                                                200
                                                                              }
                                                                              name="pgIns"
                                                                              placeholder="Enter Institutes"
                                                                              value={
                                                                                values.pgIns
                                                                              }
                                                                              className="dropstyle"
                                                                              onChange={(
                                                                                selectedOption
                                                                              ) => {
                                                                                ugLimit(
                                                                                  "SpecificPgInst",
                                                                                  selectedOption
                                                                                );
                                                                                let event =
                                                                                {
                                                                                  target:
                                                                                  {
                                                                                    name: "pgIns",
                                                                                    value:
                                                                                      selectedOption,
                                                                                  },
                                                                                };
                                                                                handleChange(
                                                                                  event
                                                                                );
                                                                              }}
                                                                              loadOptions={
                                                                                instituteOptions
                                                                              }
                                                                              onInputChange={
                                                                                handleUgInputInstitute
                                                                              }
                                                                              inputValue={
                                                                                ugInputValue
                                                                              }
                                                                            />
                                                                          </div>
                                                                        </div>
                                                                      </div>
                                                                    )}
                                                                  {(anyPg ||
                                                                    spPg) && (
                                                                      <div className="mt-4">
                                                                        <div className="form-group">
                                                                          <label>
                                                                            Education
                                                                            Type
                                                                          </label>
                                                                          <div className="row mt-2">
                                                                            &emsp;
                                                                            <Chip
                                                                              label="Full Time"
                                                                              onClick={() => {
                                                                                handleShowPgEducationType(
                                                                                  "Full Time"
                                                                                );
                                                                              }}
                                                                              variant="outlined"
                                                                              style={{
                                                                                fontSize:
                                                                                  "12px",
                                                                                backgroundColor:
                                                                                  pgEducationType.includes(
                                                                                    "Full Time"
                                                                                  )
                                                                                    ? "#0275d8"
                                                                                    : "",
                                                                                color:
                                                                                  pgEducationType.includes(
                                                                                    "Full Time"
                                                                                  )
                                                                                    ? "white"
                                                                                    : "black",
                                                                              }}
                                                                              className="col-lg-1"
                                                                            />
                                                                            &emsp;
                                                                            <Chip
                                                                              label="Part Time"
                                                                              onClick={() => {
                                                                                handleShowPgEducationType(
                                                                                  "Part Time"
                                                                                );
                                                                              }}
                                                                              variant="outlined"
                                                                              style={{
                                                                                backgroundColor:
                                                                                  pgEducationType.includes(
                                                                                    "Part Time"
                                                                                  )
                                                                                    ? "#0275d8"
                                                                                    : "",
                                                                                color:
                                                                                  pgEducationType.includes(
                                                                                    "Part Time"
                                                                                  )
                                                                                    ? "white"
                                                                                    : "black",
                                                                              }}
                                                                              className="col-lg-1"
                                                                            />
                                                                            &emsp;
                                                                            <Chip
                                                                              label="Correspondence/ Distance Learning"
                                                                              onClick={() => {
                                                                                handleShowPgEducationType(
                                                                                  "Correspondence/ Distance Learning"
                                                                                );
                                                                              }}
                                                                              variant="outlined"
                                                                              style={{
                                                                                fontSize:
                                                                                  "12px",
                                                                                backgroundColor:
                                                                                  pgEducationType.includes(
                                                                                    "Correspondence/ Distance Learning"
                                                                                  )
                                                                                    ? "#0275d8"
                                                                                    : "",
                                                                                color:
                                                                                  pgEducationType.includes(
                                                                                    "Correspondence/ Distance Learning"
                                                                                  )
                                                                                    ? "white"
                                                                                    : "black",
                                                                              }}
                                                                              className="col-lg-1"
                                                                            />
                                                                          </div>
                                                                        </div>
                                                                      </div>
                                                                    )}
                                                                  {(anyPg ||
                                                                    spPg) && (
                                                                      <div className="mt-4">
                                                                        <div className="form-group">
                                                                          <label>
                                                                            Year
                                                                            of
                                                                            degree
                                                                            completion
                                                                          </label>
                                                                          <div className="row">
                                                                            <div className="col-lg-6">
                                                                              <ReactSelect
                                                                                options={
                                                                                  yearData
                                                                                }
                                                                                name="pgFrom"
                                                                                className="dropstyle"
                                                                                placeholder="From"
                                                                                isClearable={
                                                                                  true
                                                                                }
                                                                                value={
                                                                                  fromPgValue
                                                                                }
                                                                                onChange={(
                                                                                  option: any
                                                                                ) => {
                                                                                  let event =
                                                                                  {
                                                                                    target:
                                                                                    {
                                                                                      name: "pgFrom",
                                                                                      value:
                                                                                        option,
                                                                                    },
                                                                                  };

                                                                                  formik.handleChange(
                                                                                    event
                                                                                  );
                                                                                  setTouchedPgFrom(
                                                                                    true
                                                                                  );
                                                                                }}
                                                                              />
                                                                            </div>
                                                                            <div className="col-lg-6">
                                                                              <ReactSelect
                                                                                options={
                                                                                  yearData
                                                                                }
                                                                                name="pgTo"
                                                                                className="dropstyle"
                                                                                placeholder="To"
                                                                                isClearable={
                                                                                  true
                                                                                }
                                                                                value={
                                                                                  toPgValue
                                                                                }
                                                                                onChange={(
                                                                                  option: any
                                                                                ) => {
                                                                                  let event =
                                                                                  {
                                                                                    target:
                                                                                    {
                                                                                      name: "pgTo",
                                                                                      value:
                                                                                        option,
                                                                                    },
                                                                                  };

                                                                                  formik.handleChange(
                                                                                    event
                                                                                  );
                                                                                  setTouchedPgTo(
                                                                                    true
                                                                                  );
                                                                                }}
                                                                              />
                                                                            </div>
                                                                          </div>
                                                                          {touchedPgFrom &&
                                                                            touchedPgTo &&
                                                                            formik
                                                                              .values
                                                                              ?.pgFrom
                                                                              ?.value >
                                                                            formik
                                                                              .values
                                                                              ?.pgTo
                                                                              ?.value && (
                                                                              <p className="form-error">
                                                                                Please
                                                                                select
                                                                                from
                                                                                year
                                                                                less
                                                                                than
                                                                                to
                                                                                year.
                                                                              </p>
                                                                            )}
                                                                        </div>
                                                                      </div>
                                                                    )}
                                                                </div>
                                                              </div>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>{" "}
                                              </div>{" "}
                                            </div>{" "}
                                          </div>
                                        )}
                                      </div>
                                    </AccordionDetails>
                                  </Accordion>
                                  <Accordion
                                    className="mb-3"
                                    sx={{
                                      boxShadow: "none",
                                    }}
                                  >
                                    <AccordionSummary
                                      expandIcon={<ExpandMoreIcon />}
                                      aria-controls="panel1a-content"
                                      id="panel1a-header"
                                      style={{
                                        padding: "0px 0px",
                                      }}
                                    >
                                      <Typography>
                                        <b className="text-uppercase">
                                          Diversity and Additional Details
                                        </b>
                                      </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                      <div className="form-group">
                                        {/* <div
                                                                                    className="section-full content-inner browse-job shop-account"
                                                                                    style={{
                                                                                        paddingTop:
                                                                                            "0px",
                                                                                    }}
                                                                                > */}{" "}
                                        {/* <div className=" job-bx radius-sm bg-white m-auto col-sm-6"> */}{" "}
                                        <h6>Diversity details</h6>
                                        <div className="form-group">
                                          <label>Gender</label>
                                          <div className="workStatusDiv">
                                            <div className="col-lg-4 col-md-4 col-sm-4 col-4">
                                              <label>
                                                <input
                                                  type="radio"
                                                  name="candidates"
                                                  value="All candidates"
                                                  className="card-input-element-status"
                                                  style={{
                                                    padding: "10px",
                                                  }}
                                                  onChange={handleChange}
                                                />
                                                <div
                                                  className="panel panel-default card-input "
                                                  style={{
                                                    padding: "14px 20px",
                                                  }}
                                                >
                                                  <div className="">
                                                    {" "}
                                                    <i
                                                      style={{
                                                        fontWeight: "400",
                                                      }}
                                                    >
                                                      All Candidates
                                                    </i>
                                                  </div>
                                                </div>
                                              </label>
                                            </div>
                                            <div className="col-lg-4 col-md-4 col-sm-4 col-4">
                                              <label>
                                                <input
                                                  type="radio"
                                                  value="Male"
                                                  name="candidates"
                                                  className="card-input-element-status"
                                                  onChange={handleChange}
                                                />
                                                <div
                                                  className="panel panel-default card-input"
                                                  style={{
                                                    padding: "14px 20px",
                                                  }}
                                                >
                                                  <div
                                                    style={{
                                                      fontFamily: "Open Sans",
                                                    }}
                                                  >
                                                    <i
                                                      style={{
                                                        fontWeight: "400",
                                                      }}
                                                    >
                                                      Male Candidates
                                                    </i>
                                                  </div>
                                                </div>
                                              </label>
                                            </div>
                                            <div className="col-lg-4 col-md-4 col-sm-4 col-4">
                                              <label>
                                                <input
                                                  type="radio"
                                                  name="candidates"
                                                  value="Female"
                                                  className="card-input-element-status"
                                                  onChange={handleChange}
                                                />
                                                <div
                                                  className="panel panel-default card-input "
                                                  style={{
                                                    padding: "14px 16px",
                                                  }}
                                                >
                                                  <div className="">
                                                    <i
                                                      style={{
                                                        fontWeight: "400",
                                                      }}
                                                    >
                                                      Female Candidates
                                                    </i>
                                                  </div>
                                                </div>
                                              </label>
                                            </div>
                                          </div>
                                        </div>
                                        <div>
                                          <input
                                            type="checkbox"
                                            checked={values.disability}
                                            name="disability"
                                            value={values.disability}
                                            onChange={handleChange}
                                            style={{
                                              cursor: "pointer",
                                            }}
                                          />{" "}
                                          Person with Disabilities only
                                        </div>
                                        <br />
                                        <label>Candidate Catagory</label>
                                        <div>
                                          <Select
                                            isMulti
                                            placeholder="Select Categories"
                                            name="candidateCatagory"
                                            value={values.candidateCatagory}
                                            onChange={(selectedOption) => {
                                              let event = {
                                                target: {
                                                  name: "candidateCatagory",
                                                  value: selectedOption,
                                                },
                                              };
                                              handleChange(event);
                                            }}
                                            isClearable={true}
                                            options={categoryOpt}
                                            className="dropstyle"
                                            classNamePrefix="select"
                                          />{" "}
                                        </div>
                                        <br />
                                        <label>Candidate age in years</label>
                                        <div className="row">
                                          <div className="col-lg-4 col-md-4 col-sm-4">
                                            <Select
                                              name="minimumAge"
                                              className="dropstyle"
                                              placeholder="From"
                                              value={values.minimumAge}
                                              onChange={(
                                                selectedOption: any
                                              ) => {
                                                let event = {
                                                  target: {
                                                    name: "minimumAge",
                                                    value: selectedOption,
                                                  },
                                                };
                                                handleChange(event);
                                              }}
                                              options={ageOptions}
                                              isClearable={true}
                                            />
                                          </div>

                                          <div className="col-lg-4 col-md-4 col-sm-4">
                                            <Select
                                              name="maximumAge"
                                              className="dropstyle"
                                              placeholder="To"
                                              value={values.maximumAge}
                                              onChange={(
                                                selectedOption: any
                                              ) => {
                                                let event = {
                                                  target: {
                                                    name: "maximumAge",
                                                    value: selectedOption,
                                                  },
                                                };
                                                handleChange(event);
                                              }}
                                              isClearable={true}
                                              options={ageOptions.filter(
                                                (option: any) =>
                                                  option.value >= minAge.value
                                              )}
                                            />
                                          </div>
                                        </div>
                                        {ageError && (
                                          <p className="form-error">
                                            Maximum age must be greater than
                                            Minimum age.{" "}
                                          </p>
                                        )}
                                        <br />
                                        <label>Work Details</label>
                                        <div className="row">
                                          <div className="col-lg-8 col-md-8 col-sm-6">
                                            <Select
                                              name="employmentType"
                                              className="dropstyle"
                                              value={values.employmentType}
                                              placeholder="Select Employment Type"
                                              onChange={(
                                                selectedOption: any
                                              ) => {
                                                let event = {
                                                  target: {
                                                    name: "employmentType",
                                                    value: selectedOption,
                                                  },
                                                };
                                                handleChange(event);
                                              }}
                                              isClearable={true}
                                              options={EmploymentTypeOptions}
                                              classNamePrefix="select"
                                            />
                                          </div>
                                        </div>
                                        <br />
                                        <label>Work Permit For (max 10)</label>
                                        <div>
                                          <Select
                                            isOptionDisabled={() =>
                                              workPermitLimit
                                            }
                                            isMulti={true}
                                            isClearable={true}
                                            maxMenuHeight={200}
                                            value={values.workPermitFor}
                                            name="workPermitFor"
                                            placeholder="Select Countries"
                                            options={options}
                                            className="dropstyle"
                                            onChange={(selectedOption) => {
                                              ugLimit("", selectedOption);
                                              let event = {
                                                target: {
                                                  name: "workPermitFor",
                                                  value: selectedOption,
                                                },
                                              };
                                              handleChange(event);
                                            }}
                                          />
                                        </div>
                                      </div>{" "}
                                      {/* </div> */}
                                    </AccordionDetails>
                                  </Accordion>
                                  <Accordion
                                    className="mb-3"
                                    sx={{
                                      boxShadow: "none",
                                    }}
                                  >
                                    <AccordionSummary
                                      expandIcon={<ExpandMoreIcon />}
                                      aria-controls="panel1a-content"
                                      id="panel1a-header"
                                      style={{
                                        padding: "0px 0px",
                                      }}
                                    >
                                      <Typography>
                                        <b>OTHER DETAILS</b>
                                      </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                      <div className="form group">
                                        {/* <h6>Display Details</h6> */}

                                        {/* <div className="form-group">
                                          <label htmlFor="">
                                            Show only candidate with
                                          </label>
                                          <div className="row">
                                            &emsp;
                                            <Chip
                                              label="Verified Mobile Number"
                                              variant="outlined"
                                              style={{
                                                backgroundColor:
                                                  showCandidateButtons.includes(
                                                    "Verified Mobile Number"
                                                  )
                                                    ? "#0275d8"
                                                    : "",
                                                color:
                                                  showCandidateButtons.includes(
                                                    "Verified Mobile Number"
                                                  )
                                                    ? "white"
                                                    : "black",
                                              }}
                                              onClick={() => {
                                                handleShowCandidateClick(
                                                  "Verified Mobile Number"
                                                );
                                              }}
                                            />
                                            &emsp;
                                            <Chip
                                              label="Verified Email-id"
                                              variant="outlined"
                                              style={{
                                                backgroundColor:
                                                  showCandidateButtons.includes(
                                                    "Verified Email-id"
                                                  )
                                                    ? "#0275d8"
                                                    : "",
                                                color:
                                                  showCandidateButtons.includes(
                                                    "Verified Email-id"
                                                  )
                                                    ? "white"
                                                    : "black",
                                              }}
                                              onClick={() => {
                                                handleShowCandidateClick(
                                                  "Verified Email-id"
                                                );
                                              }}
                                            />
                                            &emsp;
                                            <Chip
                                              label="Attached Resume"
                                              variant="outlined"
                                              style={{
                                                backgroundColor:
                                                  showCandidateButtons.includes(
                                                    "Attached Resume"
                                                  )
                                                    ? "#0275d8"
                                                    : "",
                                                color:
                                                  showCandidateButtons.includes(
                                                    "Attached Resume"
                                                  )
                                                    ? "white"
                                                    : "black",
                                              }}
                                              onClick={() => {
                                                handleShowCandidateClick(
                                                  "Attached Resume"
                                                );
                                              }}
                                            />
                                          </div>
                                        </div> */}
                                      </div>
                                      <div
                                        className="form-group d-flex"
                                        style={{
                                          marginTop: "5%",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                          }}
                                        >
                                          <div>Active in - &nbsp;</div>
                                          <div
                                            style={{
                                              marginTop: "-8px",
                                            }}
                                          >
                                            <Select
                                              defaultValue={monthOption[0]}
                                              className="dropstyle"
                                              isSearchable={true}
                                              name="activeIn"
                                              value={values.activeIn}
                                              onChange={(
                                                selectedOption: any
                                              ) => {
                                                let event = {
                                                  target: {
                                                    name: "activeIn",
                                                    value: selectedOption,
                                                  },
                                                };
                                                handleChange(event);
                                              }}
                                              options={monthOption}
                                              menuPlacement="top"
                                            />
                                          </div>
                                          <span>&nbsp; days ago</span>
                                        </div>
                                      </div>
                                    </AccordionDetails>
                                  </Accordion>

                                  <br />

                                  <Box
                                    sx={{
                                      position: "relative",
                                      bottom: 0,
                                      left: 0,
                                      right: 0,
                                    }}
                                  >
                                    <Button
                                      variant="contained"
                                      type="submit"
                                      style={{
                                        width: "100%",
                                        marginTop: "80px",
                                        marginBottom: "20px",
                                        background: "#0d6efd",
                                        color: "white",
                                      }}
                                      onClick={toggleDrawer("right", false)}
                                    >
                                      Search Candidate
                                    </Button>
                                  </Box>
                                </form>
                              </div>
                            </Box>
                          </Drawer>

                          <div className="">
                            <div
                              className="row job-grid"
                              style={{
                                padding: "0px",
                              }}
                            >
                              {sasData?.code === 200 &&
                                !myLoading &&
                                images.length > 0 &&
                                searchData.length > 0 &&
                                searchData?.map((item, index) => (
                                  <div
                                    className={
                                      "col-xl-6 col-lg-6 col-md-6 col-sm-12 mt-1 mb-1"
                                    }
                                  >
                                    <ApplicantCard
                                      key={index}
                                      selectAll={selectAll}
                                      item={item}
                                      image={images}
                                    />
                                  </div>
                                ))}

                              {sasData?.code !== 200 &&
                                !loadingSp &&
                                !myLoading &&
                                searchData?.length > 0 &&
                                searchData?.map((item, index) => (
                                  <div
                                    className={
                                      "col-xl-6 col-lg-6 col-md-6 col-sm-12 mt-1 mb-1"
                                    }
                                  >
                                    <ApplicantCard
                                      key={index}
                                      selectAll={selectAll}
                                      item={item}
                                      image={images}
                                    />
                                  </div>
                                ))}
                              {loadingSp && searchData.length == 0 && (
                                <>
                                  <div
                                    className={
                                      "col-xl-6 col-lg-6 col-md-6 col-sm-12 mt-1 mb-1"
                                    }
                                  >
                                    <ApplicantCardSk />
                                  </div>
                                  <div
                                    className={
                                      "col-xl-6 col-lg-6 col-md-6 col-sm-12 mt-1 mb-1"
                                    }
                                  >
                                    <ApplicantCardSk />
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {loadingSp && searchData.length !== 0 && (
                            <div
                              className="mt-3"
                              style={{
                                textAlign: "center",
                              }}
                            >
                              <CircularProgress />
                            </div>
                          )}
                          {!loadingSp &&
                            displayNoMore &&
                            !myLoading &&
                            searchData?.length !== 0 &&
                            searchData?.length ===
                            SearchProfileData?.data?.totalCount && (
                              <div
                                className="mt-5"
                                style={{
                                  textAlign: "center",
                                }}
                              >
                                <h6>No more records...</h6>
                              </div>
                            )}
                          {((SearchProfileData.code &&
                            SearchProfileData?.data?.js?.length == 0) ||
                            SearchProfileData.code != 200) &&
                            !loadingSp &&
                            searchData.length == 0 && (
                              <center>
                                <img
                                  src={NodataFound}
                                  alt=""
                                  style={{
                                    width: "40%",
                                  }}
                                />
                                <br />
                                <h6 className="font-weight-bold">
                                  Oops no record found.
                                </h6>
                              </center>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            </div>
          );
        }}
      </Formik>
    </div>
  );
}

export default AdvanceSearchResult;
