import React, { useEffect, useRef, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";

import { values } from "lodash";
import { BsFillTrashFill, BsPencil } from "react-icons/bs";

import Swal from "sweetalert2";
import AsyncCreatableSelect from "react-select/async-creatable";
import CreatableSelect from "react-select/creatable";
import { getJobSeekerrData } from "../../../redux/features/manage-account/profile/JsSlice";
import {
  deleteEducationDetails,
  postEducationDetails,
  resetEducationPost,
} from "../../../redux/features/manage-account/profile/EducationSlice";
import { profileStrength } from "../../../redux/features/manage-account/profile/BasicDetailsSlice";
import {
  createData,
  createDataWithId,
  customStyles,
} from "../../../common/common";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import { specializationMasterData } from "../../../ApiCall/masterData";
import { environment } from "../../../environments/environment";
interface option {
  label: string | undefined;
  value: string | undefined;
}
let educationEvent: any = null;
interface educationtype {
  Education: option | null;
  UniversityInstitute: option | null;
  Course: string;
  OtherCourse: string;
  Specialization: string;
  OtherSpecialization: string;
  CourseType: string;
  CourseDurationStart: string;
  CourseDurationEnd: string;
  GradingSystem: string | undefined;
  Marks: string;
  Board: string;
  checkbox: any;
  PassingOutYear: string;
  SchoolMedium: string;
  TotalMarks: string;
  EnglishMarks: string | undefined;
  MathsMarks: string | undefined;
  id: string | undefined;
}

interface ColourOption {
  label: string;
  value: string;
}

let specializationArray: any = [];

let universities: any = [];

// const year = GetPastYears();
const IntialValueForm = {
  Education: null,
  UniversityInstitute: null,
  Course: "",
  OtherCourse: "",
  Specialization: "",
  OtherSpecialization: "",
  CourseType: "Full Time",
  CourseDurationStart: "",
  CourseDurationEnd: "",
  GradingSystem: "",
  Marks: "",
  checkbox: "true",
  Board: "",
  PassingOutYear: "",
  SchoolMedium: "",
  TotalMarks: "",
  EnglishMarks: "",
  MathsMarks: "",
  id: "",
};

const SignupSchema = Yup.object().shape({
  Education: Yup.object().required("Please specify Qualification.").nullable(),
  UniversityInstitute: Yup.object()
    .nullable()
    .when("Education", {
      is: (Education: option) =>
        (Education !== null &&
          Education?.label !== "10th" &&
          Education?.label !== "12th" &&
          Education?.label !== "Below 10th") ||
        Education === null,
      then: Yup.object()
        .nullable()
        .required("Please specify University/Institute."),
    }),

  Course: Yup.object().when("Education", {
    is: (Education: option) =>
      (Education !== null &&
        Education?.label !== "10th" &&
        Education?.label !== "12th" &&
        Education?.label !== "Below 10th") ||
      Education === null,
    then: Yup.object().nullable().required("Please select Course."),
  }),
  OtherCourse: Yup.string().when("Course", {
    is: "Other",
    then: Yup.string()
      .required("Please specify Course.")
      .trim("Empty space not allowed.")
      .matches(
        /^[a-zA-Z0-9&'.,()-@\s]{1,70}$/,
        "special characters other than &,.'()-@ are not allowed."
      ),
  }),

  Specialization: Yup.mixed().when("Education", {
    is: (Education: option) =>
      Education?.label !== "10th" &&
      Education?.label !== "12th" &&
      Education?.label !== "Below 10th",
    then: Yup.mixed().nullable().required("Please select Specialization."),
    otherwise: Yup.mixed().nullable(),
  }),
  OtherSpecialization: Yup.string().when("Specialization", {
    is: (val: any) => val === "Other",
    then: Yup.string()
      .required("Please specify Specialization.")
      .trim()
      .max(50)
      .matches(
        /^[a-zA-Z0-9&'.,()-@\s]{1,70}$/,
        "special characters other than &,.'()-@ are not allowed."
      ),
    otherwise: Yup.string().nullable(),
  }),
  CourseType: Yup.string().required("Please select Course Type."),
  CourseDurationStart: Yup.string().when("Education", {
    is: (Education: option) =>
      Education?.label !== "10th" &&
      Education?.label !== "12th" &&
      Education?.label !== "Below 10th",
    then: Yup.string().required("Please select Start Year."),
  }),
  CourseDurationEnd: Yup.string().when("Education", {
    is: (Education: option) =>
      Education?.label !== "10th" &&
      Education?.label !== "12th" &&
      Education?.label !== "Below 10th",
    then: Yup.string().required("Please select Passout Year."),
  }),
  GradingSystem: Yup.string().notRequired(),
  Marks: Yup.string().when("GradingSystem", {
    is: "Sclae 10 Grading System",
    then: Yup.string()
      .required("Please enter valid Marks.")
      .trim("Empty space not allowed.")
      .matches(
        /^((?!0\.0)[0-9](\.\d)?|10(\.0)?)$/,
        "The Marks should lie between 0.1 and 10."
      ),
    otherwise: Yup.string().when("GradingSystem", {
      is: "Scale 4 Gading System",
      then: Yup.string()
        .required("Please enter valid Marks.")
        .trim("Empty space not allowed.")
        .matches(
          /^((?!0\.0)[4](\.0{1,2})?|[0-3](\.\d{1,2})?|0(\.[1-9]\d{0,1})?)$/,
          "The Marks should lie between 0.1 and 4."
        ),
      otherwise: Yup.string().when("GradingSystem", {
        is: "% Marks of 100 Maximum",
        then: Yup.string()
          .required("Please enter a valid Marks.")
          .trim("Empty space not allowed.")
          .matches(
            /^(?:0(?:\.[1-9]|[1-9]\d?)|[1-9]\d?(?:\.\d{1,2})?|100(?:\.0{1,2})?)$/,
            "The Marks should lie between 0.1 and 100."
          ),
        otherwise: Yup.string(),
      }),
    }),
  }),
  checkbox: Yup.boolean().notRequired().nullable(),

  Board: Yup.string().when("Education", {
    is: (Education: option) =>
      Education?.label == "10th" ||
      Education?.label == "12th" ||
      Education?.label == "Below 10th",
    then: Yup.string().required("Please select Board."),
  }),
  PassingOutYear: Yup.string().when("Education", {
    is: (Education: option) =>
      Education?.label == "10th" ||
      Education?.label == "12th" ||
      Education?.label == "Below 10th",
    then: Yup.string().required("Please select Passing Out Year."),
  }),
  SchoolMedium: Yup.string().when("Education", {
    is: (Education: option) =>
      Education?.label == "10th" ||
      Education?.label == "12th" ||
      Education?.label == "Below 10th",
    then: Yup.string().required("Please select School Medium."),
  }),
  TotalMarks: Yup.string().when("Education", {
    is: (Education: option) =>
      Education?.label == "10th" ||
      Education?.label == "12th" ||
      Education?.label == "Below 10th",
    then: Yup.string().required("Please select Marks."),
  }),

  MathsMarks: Yup.string()
    .trim("Empty space not allowed")
    .matches(/^(0|[1-9][0-9]?|100)$/, "The Marks should lie between 1 to 100."),
  EnglishMarks: Yup.string()
    .trim("Empty space not allowed")
    .matches(/^(0|[1-9][0-9]?|100)$/, "The Marks should lie between 1 to 100."),
});

// type propsState = {
//   displayModel?: boolean;
//   trigger?: any;
// };

function RPEducation(props: any) {
  const components = {
    DropdownIndicator: null,
  };
  const numReg = new RegExp(/^\d*\.?\d*$/);
  const [education, setEducation] = useState(true);
  const handleHideEducation = () => {
    setEducation(true);
  };
  const [displaymarkInput, setDisplaymarkInput] = useState(false);
  const [display12thinput, setDisplay12thinput] = useState(false);
  const [educationList, setEducationList] = useState<any>(null);
  const dispatch = useDispatch();
  const showSnackAlert = UseToastAlert();
  const educationx = useSelector((state: any) => state.EducationPostx);
  const { PostEducation, Postloading } = educationx;
  const institutes = useSelector((state: any) => state.institue);
  const pflStrength = useSelector((state: any) => state.profileStrength);

  const { universityData, universityloading } = institutes;
  const formikRef = useRef<any>();

  const [deleteBtnDis, setDeleteBtnDis] = useState(false);
  const [displayCheckbox, setDisplayCheckbox] = useState(true);
  const [hideEducationContent, setHideEducationContent] = useState(true);

  const deleteBtnHandler = () => {
    let count = 0;
    if (JobSeekerProfile?.js_profile?.education?.degree?.length > 0) {
      count = JobSeekerProfile?.js_profile?.education?.degree?.length;
    }
    if (JobSeekerProfile?.js_profile?.education?.schools?.length > 0) {
      count += JobSeekerProfile?.js_profile?.education?.schools.length;
    }
  };
  const filterUniversities = (inputValue: string) => {
    return universities.filter((i) =>
      i?.label?.toLowerCase().includes(inputValue?.toLowerCase())
    );
  };

  const promiseOptions = (inputValue: string) =>
    new Promise<[]>((resolve) => {
      setTimeout(() => {
        resolve(filterUniversities(inputValue));
      }, 1000);
    });

  //   useEffect(() => {
  //     if (displayModel == true) {
  //       setEducation(true);
  //       setHideEducationContent(false);
  //     } else {
  //       setHideEducationContent(true);
  //     }
  //   }, [displayModel]);

  useEffect(() => {
    if (universityData && !universityloading) {
      universities = universityData?.map((e: any) => {
        return {
          label: e,
          value: e,
        };
      });
    }
  }, [universityData]);
  const [eduData, setEduData] = useState<any>([]);

  useEffect(() => {
    if (PostEducation && PostEducation?.code == 200 && !Postloading) {
      showSnackAlert("success", PostEducation.message);
      educationEvent = null;
      dispatch(getJobSeekerrData());
      dispatch(resetEducationPost());
      dispatch(profileStrength());
    }
    if (PostEducation?.code == 206)
      showSnackAlert("warning", PostEducation.message);
  }, [PostEducation, PostEducation?.code, Postloading]);
  const JobSeekerProfileData = useSelector(
    (state: any) => state.JobSeekerProfile2
  );
  const { JobSeekerProfile, loading, error } = JobSeekerProfileData;

  const checkBoxDegreeHandler = (degree?: string, JobSeekerProfile?: any) => {
    if (JobSeekerProfile?.js_profile?.education?.degree?.length > 0) {
      let count = 0;
      JobSeekerProfile?.js_profile?.education?.degree.map((e: any) => {
        if (e.edutype === degree) {
          count++;
        }
      });
      if (count >= 1) {
        setDisplayCheckbox(true);
      } else {
        setDisplayCheckbox(false);
      }
    }
  };
  useEffect(() => {
    checkBoxDegreeHandler();
  }, [displayCheckbox]);

  const [editvalue, setEditValue] = useState<educationtype | null>(
    IntialValueForm
  );

  const handleMarkInput = (value: any) => {
    if (value !== "Course Requires a Pass") {
      setDisplaymarkInput(true);
    } else {
      setDisplaymarkInput(false);
    }
  };

  const handle12thInput = (value: string | undefined | null) => {
    if (value === "12th" || value === "10th") {
      setDisplay12thinput(true);
    } else {
      setDisplay12thinput(false);
    }
  };

  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (editvalue) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [editvalue]);
  const [forcerender, setForcerender] = useState(false);

  const [educationArray, setEducationArray] = useState<any>([]);

  const yearmonthData = useSelector((state: any) => state.yearmonthMasterdata);
  const [yearOptions, setYearOptions] = useState<any>([]);
  const [pastyearOptions, setPastYearOptions] = useState<any>([]);
  const { allYearMonth } = yearmonthData,
    [yearData, setYearData] = useState<any>();
  useEffect(() => {
    if (allYearMonth) {
      let yearData: any = [];
      allYearMonth?.map((opt: any) => {
        if (opt.group === "FUYE") {
          opt.data.map((item: any, index) => {
            if (index > 0)
              yearData.push({ value: `${item}`, label: `${item}` });
          });
          yearData = yearData.reverse();
        }
        if (opt.group === "PAYE") {
          let pastYear: any = [];
          opt.data.map((item: any, index) => {
            pastYear.push({ value: item, label: item });
          });
          pastYear = pastYear.reverse();
          setPastYearOptions(pastYear);
          yearData = yearData.concat(pastYear);
          setYearOptions(yearData);
          setYearData(pastYear);
        }
      });
    }
  }, [allYearMonth]);
  useEffect(() => {}, [yearData]);

  const masterDatas = useSelector((state: any) => state.jobSeekerMasterData);
  const { JSMasterData } = masterDatas,
    [educationtData, setEducationData] = useState<any>([]),
    [GradingSystem, setGradingSystem] = useState<any>([]),
    [board, setBoard] = useState<any>([]),
    [sclMdm, setSclMdm] = useState<any>([]),
    [prcnt, setPrcnt] = useState<any>([]);

  useEffect(() => {
    if (JSMasterData) {
      JSMasterData?.map((opt: any) => {
        if (opt?.group === "EDUN") {
          const eduObj: any = opt.data.map((data) => data.value);
          const obj: any = createData(eduObj);
          setEducationArray(obj);
          setEducationData(obj);
        }
        if (opt.group === "GSYS") {
          let obj: any = [];
          opt?.data?.map((item: any, index) => {
            obj.push({ value: item.value, label: item.value });
          });
          setGradingSystem(obj);
        }
        if (opt.group === "SBCB") {
          let obj: any = [];
          opt.data.map((item: any, index) => {
            obj.push({ value: item.value, label: item.value });
          });
          setBoard(obj);
        }
        if (opt.group === "EDUM") {
          let obj: any = [];
          opt.data.map((item: any, index) => {
            obj.push({ value: item.value, label: item.value });
          });
          setSclMdm(obj);
        }
        if (opt.group === "TMPE") {
          let obj: any = [];
          opt.data.map((item: any, index) => {
            obj.push({ value: item.value, label: item.value });
          });
          setPrcnt(obj);
        }
      });
    }
  }, [JSMasterData]);
  const filterColors = async (inputValue: string) => {
    if (inputValue) {
      const body = { active: 1, parent_id: inputValue };
      const specDaata: any = await specializationMasterData(body);

      if (specDaata.length) {
        const specData = specDaata.map((spc) => {
          return { label: spc.name, value: spc.name };
        });
        setSpecializationData(specData);
      } else {
        setSpecializationData([]);
      }
    } else {
      setSpecializationData([]);
    }
  };

  useEffect(() => {}, [educationtData, GradingSystem]);
  const [edu, setEdu] = useState<any>();

  const setCourseOptions = (edu: any) => {
    if (JSMasterData) {
      JSMasterData.map((opt: any) => {
        if (opt.group === "DPHD" && edu?.label == "Doctorate/PhD") {
          const obj: any = createDataWithId(opt.data, true);
          setCourseData(obj);
        }
        if (opt.group === "MAPG" && edu?.label == "Masters/Post-Graduation") {
          const obj: any = createDataWithId(opt.data, true);
          setCourseData(obj);
        }
        if (
          opt.group === "BAUG" &&
          edu &&
          edu?.label == "Batchelor/Under-Graduation"
        ) {
          const obj: any = createDataWithId(opt.data, true);
          setCourseData(obj);
        }
        if (opt.group === "BAUG" && edu && edu?.label == "Diploma/Graduation") {
          const obj: any = createDataWithId(opt.data, true);
          setCourseData(obj);
        }
      });
    }
  };

  const EduArray: any = educationtData.map((singleObj: any) => {
    const obj = {
      value: `${singleObj}`,
      label: `${singleObj}`,
    };
    return obj;
  });

  const [courseArr, setCourseData] = useState<any>([]);
  var catRoleArray: any = [];

  const [specializationData, setSpecializationData] = useState<any>([]);

  const handleEducation = (option: any) => {
    setEdu(option);
  };

  const [course, setCourse] = useState<any>();
  const handleCrse = (option: any) => {
    setCourse(option);
  };

  const [special, setSpecial] = useState<any>();
  const handleSpec = (option: any) => {
    setSpecial(option);
  };

  const [ten, setTen] = useState<any>(true);
  const [twelve, setTwelve] = useState(true);
  const [docPhd, setDocPhd] = useState(true);
  const [masters, setMasters] = useState(true);
  const [graduation, setGraduation] = useState(true);

  const [dynamic, setDynamic] = useState<any>([]);
  const dynamicDropdown = () => {
    if (educationList) {
      if (
        educationList?.degree?.length !== 0 ||
        educationList?.schools?.length !== 0
      ) {
        const eduArray = educationtData?.findIndex((val: any) => {
          return val?.label == "Below 10th";
        });
        if (eduArray >= 0) {
          educationtData?.splice(eduArray, 1);
        }
        setEducationData(educationtData);
      } else {
        setEducationData(educationtData);
      }
      const filte = educationList?.schools?.filter(
        (val: any) => val?.course === "10th"
      );
      if (filte?.length > 0) {
        const eduArray = educationtData?.findIndex((val: any) => {
          return val?.label == "10th";
        });
        if (eduArray >= 0) {
          educationtData?.splice(eduArray, 1);
        }
        setEducationData(educationtData);
        setTen(false);
      } else {
        setEducationData(educationtData);
        setTen(true);
      }
      const filte12 = educationList?.schools?.filter(
        (val: any) => val?.course === "12th"
      );
      if (filte12?.length > 0) {
        const eduArray = educationtData?.findIndex((val: any) => {
          return val?.label == "12th";
        });
        if (eduArray >= 0) {
          educationtData?.splice(eduArray, 1);
        }
        setEducationData(educationtData);
        setTwelve(false);
      } else {
        setEducationData(educationtData);
        setTwelve(true);
      }
      const filtePhd = educationList?.degree?.filter(
        (val: any) => val.edu_type === "Doctorate/PhD"
      );
      if (filtePhd?.length > 0) {
        setDocPhd(false);
      } else {
        setDocPhd(true);
      }
      const filteGraduation = educationList?.degree?.filter(
        (val: any) => val?.edu_type === "Batchelor/Under-Graduation"
      );
      if (filteGraduation?.length > 0) {
        setGraduation(false);
      } else {
        setGraduation(true);
      }
      const filteMaster = educationList?.degree?.filter(
        (val: any) => val?.edu_type === "Masters/Post-Graduation"
      );
      if (filteMaster?.length > 0) {
        setMasters(false);
      } else {
        setMasters(true);
      }
    }
  };
  useEffect(() => {
    if (educationList) {
      const filte = educationList?.schools?.filter(
        (val: any) => val.course === "10th"
      );
      if (filte?.length > 0) {
        setTen(false);
      } else {
        setTen(true);
      }
      const filter = educationList?.schools?.filter(
        (val: any) => val.course === "12th"
      );
      if (filter?.length > 0) {
        setTwelve(false);
      } else {
        setTwelve(true);
      }
      const filterPhd = educationList?.degree?.filter(
        (val: any) => val.course === "Doctorate/PhD"
      );
      if (filterPhd?.length > 2) {
        setDocPhd(false);
      } else {
        setDocPhd(true);
      }
      const filterMasters = educationList?.degree?.filter(
        (val: any) => val.course === "Masters/Post-Graduation"
      );
      if (filterMasters?.length > 2) {
        setMasters(false);
      } else {
        setMasters(true);
      }
      const filterGraduation = educationList?.degree?.filter(
        (val: any) => val.course === "Batchelor/Under-Graduation"
      );
      if (filterGraduation?.length > 2) {
        setGraduation(false);
      } else {
        setGraduation(true);
      }
    }
  }, [educationList]);
  useEffect(() => {
    dynamicDropdown();
  }, [docPhd, masters, graduation]);

  const [courseStart, setCourseStart] = useState<any>();
  const handleCourseStart = (option: any) => {
    setCourseStart(option);
  };
  const [courseEnd, setCourseEnd] = useState<any>();
  const handleCourseEnd = (option: any) => {
    setCourseEnd(option);
  };

  const [grading, setGrading] = useState<any>();

  const handleGrading = (option: any) => {
    setGrading(option);
  };

  const [school, setSchool] = useState<any>();
  const handleSchool = (option: any) => {
    setSchool(option);
  };
  const [schoolPassing, setSchoolPassing] = useState<any>();
  const handleSchoolPassing = (option: any) => {
    setSchoolPassing(option);
  };
  const [medium, setMedium] = useState<any>();
  const handleSchoolMedium = (option: any) => {
    setMedium(option);
  };

  const [tmarks, setTmarks] = useState<any>();
  const handleSchoolMarks = (option: any) => {
    setTmarks(option);
  };
  const [err, setErr] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleClear = () => {
    setTmarks("");
    setMedium("");
    setSchoolPassing("");
    setSchool("");
    setGrading("");
    setCourseEnd("");
    setCourseStart("");
    setSpecial("");
    setCourse("");
    setEdu("");
  };

  const [dis, setDis] = useState(false);

  const resumeLsData = useSelector((state: any) => state.ResumeDatax);
  const { rmArray } = resumeLsData;
  useEffect(() => {
    if (rmArray?.code == 200 && Object.keys(rmArray?.data)?.length > 0) {
      handleBindData(rmArray?.data);
    }
  }, [rmArray]);

  const handleBindData = (bindData: any) => {
    setDis(true);
    const obj: any = {
      UniversityInstitute:
        bindData?.university?.length > 0
          ? {
              label: bindData?.university[0]?.name,
              value: bindData?.university[0]?.name,
            }
          : "",

      CourseType: "",
      CourseDurationStart: "",
      GradingSystem: "",
      checkbox: "true",
      Board: "",

      SchoolMedium: "",

      EnglishMarks: "",
      MathsMarks: "",

      id: bindData._id,
    };
    obj.Education = "";
    obj.CourseDurationEnd = "";
    obj.PassingOutYear = "";
    obj.Marks = "";
    obj.TotalMarks = "";

    obj.Course =
      bindData?.course?.length > 0
        ? { label: bindData?.course[0]?.name, value: bindData?.course[0]?.name }
        : "";
    obj.Specialization =
      bindData?.specialization?.length > 0
        ? {
            label: bindData?.specialization[0]?.name,
            value: bindData?.specialization[0]?.name,
          }
        : "";
    setSpecial(obj.Specialization);

    obj.OtherSpecialization = "";

    obj.TotalMarks = setTmarks(null);
    obj.SchoolMedium = setMedium(null);
    obj.PassingOutYear = setSchoolPassing(null);
    obj.Board = setSchool(null);
    obj.GradingSystem = setGrading(null);
    obj.CourseDurationEnd = setCourseEnd(null);
    obj.CourseDurationStart = setCourseStart(null);

    setEditValue(obj);
  };

  const [erro, setError] = useState(false);
  const validating = (values: educationtype) => {
    if (values.CourseDurationStart && values.CourseDurationEnd) {
      if (
        Number(values.CourseDurationStart) > Number(values.CourseDurationEnd)
      ) {
        setError(true);
      } else {
        setError(false);
      }
    } else {
      setError(false);
    }
  };

  const [inputValue, setInputValue] = useState("");
  const handleInputInstitute = (newValue: string) => {
    setInputValue(newValue.replace(/[^a-zA-Z0-9. , - _ ’ ' & ()\ @ \s]*$/, ""));
  };

  return (
    <>
      <Formik
        initialValues={editvalue || IntialValueForm}
        validationSchema={SignupSchema}
        enableReinitialize={true}
        validate={validating}
        onSubmit={(values, { resetForm }) => {
          if (erro) {
          } else {
            if (
              values?.Education?.label === "12th" ||
              values?.Education?.label === "10th" ||
              values?.Education?.label === "Below 10th"
            ) {
              const intigrData = {
                type: "school",
                educationid: values.id ? values.id : null,
                education: values?.Education?.label
                  ? values?.Education.label
                  : null,
                board: values.Board ? values.Board : null,
                passingOutYear: values.PassingOutYear
                  ? Number(values.PassingOutYear)
                  : null,
                schoolMedium: values.SchoolMedium ? values.SchoolMedium : null,
                totalMarks: values.TotalMarks ? values.TotalMarks : null,
                englishMarks: values.EnglishMarks
                  ? Number(values.EnglishMarks)
                  : null,
                mathsMarks: values.MathsMarks
                  ? Number(values.MathsMarks)
                  : null,
              };

              dispatch(postEducationDetails(intigrData));
            } else {
              const intigrData = {
                type: "degree",
                educationid: values.id ? values.id : null,
                education: values?.Education?.label,
                universityInstitute: values.UniversityInstitute?.label,
                course:
                  values.Course !== "Other"
                    ? values.Course
                    : values.OtherCourse,
                specialization:
                  values.Specialization !== "Other"
                    ? values.Specialization
                    : values.OtherSpecialization,
                courseType: values.CourseType,
                courseDurationStart: Number(values.CourseDurationStart),
                courseDurationEnd: Number(values.CourseDurationEnd),
                gradingSystem: values.GradingSystem
                  ? values.GradingSystem
                  : null,
                marks: values.Marks ? Number(values.Marks) : null,
              };
              const crc: any = values.Course;
              intigrData.course =
                crc?.label !== "Other" ? crc?.label : values.OtherCourse;
              if (intigrData.gradingSystem == "Course Requires a Pass") {
                intigrData.marks = null;
              }
              dispatch(postEducationDetails(intigrData));
              props.next();
            }

            if (editvalue) {
              if (
                editvalue?.Education?.label === "10th" ||
                editvalue?.Education?.label === "12th" ||
                editvalue?.Education?.label === "Below 10th"
              ) {
                const intigrData = {
                  educationid: values.id ? values.id : null,
                  type: "school",
                  education: values?.Education?.label,
                  board: values.Board,
                  passingOutYear: Number(values.PassingOutYear),
                  schoolMedium: values.SchoolMedium,
                  totalMarks: values.TotalMarks,
                  englishMarks: values.EnglishMarks
                    ? Number(values.EnglishMarks)
                    : null,
                  mathsMarks: values.MathsMarks
                    ? Number(values.MathsMarks)
                    : null,
                };
              } else {
                const intigrData = {
                  educationid: values.id ? values.id : null,
                  type: "degree",
                  education: values?.Education?.label,
                  universityInstitute: values.UniversityInstitute,
                  course:
                    values.Course !== "Other"
                      ? values.Course
                      : values.OtherCourse,
                  specialization:
                    values.Specialization !== "Other"
                      ? values.Specialization
                      : values.OtherSpecialization,
                  courseType: values.CourseType,
                  courseDurationStart: Number(values.CourseDurationStart),
                  courseDurationEnd: Number(values.CourseDurationEnd),
                  gradingSystem: values.GradingSystem
                    ? values.GradingSystem
                    : null,
                  marks: values.Marks ? Number(values.Marks) : null,
                };
                if (intigrData.gradingSystem == "Course Requires a Pass") {
                  intigrData.marks = null;
                }
                dispatch(postEducationDetails(intigrData));
              }
            }
            setEducation(false);
            setEditValue(null);
            resetForm();
            handleClear();
          }
        }}
        innerRef={formikRef}
      >
        {(formik) => {
          const {
            values,
            handleChange,
            handleSubmit,
            setFieldValue,
            errors,
            touched,
            handleBlur,
            isValid,
            dirty,
            resetForm,
          } = formik;

          return (
            <>
              <h5>
                {values?.Education?.label
                  ? `Education-${values?.Education?.label}`
                  : " Mention your education"}
              </h5>

              <p className="modal-custom-desc ">
                Adding your education details will help recuiters know your
                value as a potential candidate.
              </p>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-lg-12 col-md-12">
                    <div>
                      <div className="form-group" style={{ width: "100%" }}>
                        <label>Qualification</label>
                        <span style={{ color: "red" }}>*</span>
                        <Select
                          placeholder="Select Education"
                          isDisabled={isDisabled}
                          name="Education"
                          value={values.Education}
                          onChange={(option: any) => {
                            setFieldValue("CourseDurationStart", "");
                            setFieldValue("CourseDurationEnd", "");
                            let event = {
                              target: {
                                name: "Education",
                                value: option,
                              },
                            };
                            educationEvent = option;
                            handleChange(event);
                            handleClear();

                            setSpecial(null);
                            setCourse(null);

                            setFieldValue("Course", "");
                            setFieldValue("Specialization", "");
                            if (option == null) {
                              setFieldValue("Course", "");
                              setFieldValue("Specialization", "");
                            }
                            if (option?.label) {
                              handle12thInput(option?.label);
                            }
                            setCourseOptions(option);
                          }}
                          isClearable={true}
                          isSearchable={true}
                          options={educationtData}
                          className={"dropstyle "}
                          styles={customStyles}
                        />

                        {errors?.Education &&
                        touched.Education &&
                        educationEvent === null ? (
                          <>
                            <span className="form-error">
                              {errors.Education}
                            </span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  {!(
                    values?.Education?.label == "10th" ||
                    values?.Education?.label == "12th" ||
                    values?.Education?.label == "Below 10th"
                  ) && (
                    <div style={{ width: "100%" }}>
                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <label>University/Institute</label>
                          <span style={{ color: "red" }}>*</span>
                          <AsyncCreatableSelect
                            name="UniversityInstitute"
                            components={components}
                            maxMenuHeight={200}
                            cacheOptions
                            noOptionsMessage={() => "Enter keyword to search"}
                            isClearable={true}
                            styles={customStyles}
                            value={values.UniversityInstitute}
                            onChange={(e: any) => {
                              let event = {
                                target: {
                                  name: "UniversityInstitute",
                                  value: e,
                                },
                              };
                              handleChange(event);
                            }}
                            className={`${
                              errors.UniversityInstitute &&
                              touched.UniversityInstitute
                                ? "input-error dropstyle"
                                : "dropstyle"
                            }`}
                            placeholder="Select University/Institute"
                            loadOptions={promiseOptions}
                            onInputChange={handleInputInstitute}
                            inputValue={inputValue}
                          />
                          {
                            <span className="form-error">
                              {errors?.UniversityInstitute &&
                                touched.UniversityInstitute && (
                                  <>
                                    {Object.values(
                                      errors.UniversityInstitute
                                    ).map((error, index) => (
                                      <span key={index}>{error}</span>
                                    ))}
                                  </>
                                )}
                            </span>
                          }
                        </div>
                      </div>

                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <label>Course</label>
                          <span style={{ color: "red" }}>*</span>
                          <CreatableSelect
                            placeholder="Select Course"
                            value={values.Course}
                            name="Course"
                            onBlur={handleBlur}
                            styles={customStyles}
                            onChange={(option: any) => {
                              handleCrse(option);
                              setFieldValue("OtherCourse", "");
                              setFieldValue("Course", option?.value);
                              setFieldValue("Specialization", "");
                              if (option == null) {
                                setFieldValue("Course", "");
                              }
                              let event = {
                                target: {
                                  name: "Course",
                                  value: option,
                                },
                              };
                              handleChange(event);
                              setSpecial(null);

                              if (option?.value)
                                if (option == null) {
                                  setFieldValue("Course", "");

                                  touched.Course = true;
                                }

                              filterColors(event?.target?.value?.value);
                            }}
                            isClearable={true}
                            isSearchable={true}
                            options={courseArr}
                            className={"dropstyle"}
                            maxMenuHeight={200}
                          />
                          {errors.Course && touched.Course && (
                            <span className="form-error">{errors.Course}</span>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          {values.Course == "Other" && (
                            <div>
                              {" "}
                              <input
                                type="text"
                                maxLength={150}
                                onBlur={handleBlur}
                                value={values.OtherCourse}
                                onChange={handleChange}
                                name="OtherCourse"
                                className={`form-control ${
                                  errors.OtherCourse && touched.OtherCourse
                                    ? "input-error"
                                    : ""
                                }`}
                                placeholder="Enter Course"
                              />
                              {errors.OtherCourse && touched.OtherCourse && (
                                <span className="form-error">
                                  {errors.OtherCourse}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <label>Specialization</label>
                          <span style={{ color: "red" }}>*</span>
                          <CreatableSelect
                            placeholder="Select specialization"
                            value={special}
                            name="Specialization"
                            onBlur={handleBlur}
                            onChange={(option: any) => {
                              handleSpec(option);

                              setFieldValue("OtherSpecialization", "");
                              setFieldValue("Specialization", option?.value);
                              if (option === null) {
                                touched.Specialization = true;
                                setFieldValue("Specialization", "");
                              }
                            }}
                            isClearable={true}
                            isSearchable={true}
                            options={specializationData}
                            className={"dropstyle"}
                            styles={customStyles}
                            maxMenuHeight={200}
                          />
                          {errors.Specialization && touched.Specialization && (
                            <span className="form-error">
                              {errors.Specialization}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          {values.Specialization == "Other" && (
                            <div>
                              {" "}
                              <input
                                type="text"
                                value={values.OtherSpecialization}
                                onBlur={handleBlur}
                                maxLength={150}
                                onChange={handleChange}
                                name="OtherSpecialization"
                                className={`form-control ${
                                  errors.OtherSpecialization &&
                                  touched.OtherSpecialization
                                    ? "input-error"
                                    : ""
                                }`}
                                placeholder="Enter Specialization"
                              />
                              {errors.OtherSpecialization &&
                                touched.OtherSpecialization && (
                                  <span className="form-error">
                                    {errors.OtherSpecialization}
                                  </span>
                                )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <label>Course Type</label>
                          <span style={{ color: "red" }}>*</span>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div className="form-check form-check-inline ">
                              <input
                                className="form-check-input"
                                type="radio"
                                checked={values.CourseType == "Full Time"}
                                value="Full Time"
                                name="CourseType"
                                id="inlineRadio1"
                                onChange={(e: any) => {
                                  handleChange(e);
                                  setFieldValue("CourseType", "Full Time");
                                }}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="inlineRadio1"
                              >
                                Full Time
                              </label>
                            </div>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                checked={values.CourseType == "Part Time"}
                                value="Part Time"
                                name="CourseType"
                                id="inlineRadio2"
                                onChange={(e: any) => {
                                  handleChange(e);
                                  setFieldValue("CourseType", "Part Time");
                                }}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="inlineRadio2"
                              >
                                Part Time
                              </label>
                            </div>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                checked={
                                  values.CourseType ==
                                  "Correspondence/ Distance Learning"
                                }
                                value="Correspondence/ Distance Learning"
                                name="CourseType"
                                id="inlineRadio3"
                                onChange={(e: any) => {
                                  handleChange(e);
                                  setFieldValue(
                                    "CourseType",
                                    "Correspondence/ Distance Learning"
                                  );
                                }}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="inlineRadio3"
                              >
                                Correspondence/ Distance Learning
                              </label>
                            </div>
                          </div>
                          {errors.CourseType && touched.CourseType && (
                            <span className="form-error">
                              {errors.CourseType}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <label>Course duration</label>
                          <span style={{ color: "red" }}>*</span>
                          <div style={{ display: "flex" }}>
                            <div style={{ width: "45%" }}>
                              <Select
                                placeholder="Year"
                                value={courseStart}
                                name="CourseDurationStart"
                                onBlur={handleBlur}
                                onChange={(option: any) => {
                                  handleCourseStart(option);
                                  setFieldValue(
                                    "CourseDurationStart",
                                    option?.value
                                  );

                                  if (option == null) {
                                    setFieldValue("CourseDurationStart", "");
                                    touched.CourseDurationStart = true;
                                  }
                                }}
                                isClearable={true}
                                isSearchable={true}
                                options={pastyearOptions}
                                className={"dropstyle"}
                                styles={customStyles}
                                maxMenuHeight={200}
                              />

                              {errors.CourseDurationStart &&
                                touched.CourseDurationStart && (
                                  <span className="form-error">
                                    {errors.CourseDurationStart}
                                  </span>
                                )}
                            </div>
                            <label
                              style={{
                                marginLeft: "5%",
                                marginRight: "5%",
                                marginTop: "2%",
                              }}
                            >
                              To
                            </label>
                            <div style={{ width: "45%" }}>
                              <Select
                                placeholder="Year"
                                value={courseEnd}
                                onBlur={handleBlur}
                                name="CourseDurationEnd"
                                onChange={(option: any) => {
                                  handleCourseEnd(option);
                                  setFieldValue(
                                    "CourseDurationEnd",
                                    option?.value
                                  );

                                  if (option == null) {
                                    setFieldValue("CourseDurationEnd", "");
                                    touched.CourseDurationEnd = true;
                                  }
                                }}
                                isClearable={true}
                                isSearchable={true}
                                options={yearOptions}
                                className={"dropstyle"}
                                styles={customStyles}
                                maxMenuHeight={200}
                              />
                              {errors.CourseDurationEnd &&
                                touched.CourseDurationEnd && (
                                  <span className="form-error">
                                    {errors.CourseDurationEnd}
                                  </span>
                                )}
                            </div>
                          </div>
                          {erro && (
                            <span className="form-error">
                              End year must be greater than start year.{" "}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {(values?.Education?.value == "10th" ||
                    values?.Education?.value == "12th" ||
                    values?.Education?.value === "Below 10th") && (
                    <div
                      className="row"
                      style={{
                        marginLeft: "0.50%",
                        marginRight: "0.50%",
                        width: "99%",
                      }}
                    >
                      <div className="col-lg-12 col-md-12 ">
                        <div className="form-group">
                          <label>Board</label>
                          <span style={{ color: "red" }}>*</span>
                          <Select
                            placeholder="Select Board"
                            value={school}
                            name="Board"
                            maxMenuHeight={200}
                            onBlur={handleBlur}
                            onChange={(option: any) => {
                              handleSchool(option);
                              setFieldValue("Board", option?.value);

                              if (option == null) {
                                setFieldValue("Board", "");
                                touched.Board = true;
                              }
                            }}
                            isClearable={true}
                            isSearchable={true}
                            options={board}
                            className={"dropstyle"}
                            styles={customStyles}
                          />
                          {errors.Board && touched.Board && (
                            <span className="form-error">{errors.Board}</span>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <label>School Medium</label>
                          <span style={{ color: "red" }}>*</span>
                          <Select
                            placeholder="Select School Medium"
                            value={medium}
                            name="SchoolMedium"
                            onBlur={handleBlur}
                            onChange={(option: any) => {
                              handleSchoolMedium(option);
                              setFieldValue("SchoolMedium", option?.value);

                              if (option == null) {
                                setFieldValue("SchoolMedium", "");
                                touched.SchoolMedium = true;
                              }
                            }}
                            isClearable={true}
                            isSearchable={true}
                            options={sclMdm}
                            className={"dropstyle"}
                            styles={customStyles}
                            menuPlacement="top"
                            maxMenuHeight={200}
                          />

                          {errors.SchoolMedium && touched.SchoolMedium && (
                            <span className="form-error">
                              {errors.SchoolMedium}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="row">
                          <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="form-group">
                              <label>Passing Out Year</label>
                              <span style={{ color: "red" }}>*</span>
                              <Select
                                placeholder="Select Passing out year"
                                value={schoolPassing}
                                name="PassingOutYear"
                                onBlur={handleBlur}
                                onChange={(option: any) => {
                                  handleSchoolPassing(option);
                                  setFieldValue(
                                    "PassingOutYear",
                                    option?.value
                                  );

                                  if (option == null) {
                                    setFieldValue("PassingOutYear", "");
                                    touched.PassingOutYear = true;
                                  }
                                }}
                                isClearable={true}
                                isSearchable={true}
                                options={yearData}
                                maxMenuHeight={200}
                                className={"dropstyle"}
                                styles={customStyles}
                              />
                              {errors.PassingOutYear &&
                                touched.PassingOutYear && (
                                  <span className="form-error">
                                    {errors.PassingOutYear}
                                  </span>
                                )}
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="form-group">
                              <label>Total Marks</label>
                              <span style={{ color: "red" }}>*</span>
                              <Select
                                placeholder="Select Total Marks"
                                value={tmarks}
                                name="TotalMarks"
                                onBlur={handleBlur}
                                onChange={(option: any) => {
                                  handleSchoolMarks(option);
                                  setFieldValue("TotalMarks", option?.value);

                                  if (option == null) {
                                    setFieldValue("TotalMarks", "");
                                    touched.TotalMarks = true;
                                  }
                                }}
                                menuPlacement="top"
                                maxMenuHeight={200}
                                isClearable={true}
                                isSearchable={true}
                                options={prcnt}
                                className={"dropstyle"}
                                styles={customStyles}
                              />

                              {errors.TotalMarks && touched.TotalMarks && (
                                <span className="form-error">
                                  {errors.TotalMarks}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      {!(
                        values.Education.label === "10th" ||
                        values.Education.label === "Below 10th"
                      ) && (
                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <label>English Marks</label>
                            <input
                              type="text"
                              name="EnglishMarks"
                              maxLength={3}
                              value={values.EnglishMarks}
                              onChange={(e: any) => {
                                numReg.test(e.target.value) && handleChange(e);
                              }}
                              className={`form-control txtbx_css${
                                errors.EnglishMarks && touched.EnglishMarks
                                  ? "input-error txtbx_css"
                                  : ""
                              }`}
                              placeholder="Marks(out of 100)"
                            />
                            {errors.EnglishMarks &&
                              touched.EnglishMarks &&
                              values.EnglishMarks == "" && (
                                <span className="form-error">
                                  {errors.EnglishMarks}
                                </span>
                              )}
                            {!values.EnglishMarks?.match(
                              /^(0|[1-9][0-9]?|100)$/
                            ) &&
                              values.EnglishMarks !== "" && (
                                <span className="form-error">
                                  {errors.EnglishMarks}
                                </span>
                              )}
                          </div>
                        </div>
                      )}
                      {!(
                        values.Education.label === "10th" ||
                        values.Education.label === "Below 10th"
                      ) && (
                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <label>Maths Marks</label>
                            <input
                              type="text"
                              placeholder="Marks(out of 100)"
                              name="MathsMarks"
                              maxLength={3}
                              value={values.MathsMarks}
                              onChange={(e: any) => {
                                numReg.test(e.target.value) && handleChange(e);
                              }}
                              className={`form-control txtbx_css${
                                errors.MathsMarks && touched.MathsMarks
                                  ? "input-error txtbx_css"
                                  : ""
                              }`}
                            />
                            {errors.MathsMarks &&
                              touched.MathsMarks &&
                              values.MathsMarks == "" && (
                                <span className="form-error">
                                  {errors.MathsMarks}
                                </span>
                              )}
                            {!values.MathsMarks?.match(
                              /^(0|[1-9][0-9]?|100)$/
                            ) &&
                              values.MathsMarks !== "" && (
                                <span className="form-error">
                                  {errors.MathsMarks}
                                </span>
                              )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div></div>
                <div className="modal-custom-footer">
                  <button
                    type="submit"
                    className="site-button "
                    style={{ zIndex: "unset" }}
                  >
                    {!Postloading && (
                      <i
                        className="fa fa-circle-o-notch fa-spin"
                        style={{
                          marginRight: "10px",
                        }}
                      ></i>
                    )}
                    {!Postloading ? "Saving..." : "Save and Continue"}
                  </button>
                </div>
              </form>
            </>
          );
        }}
      </Formik>
    </>
  );
}

export default RPEducation;
