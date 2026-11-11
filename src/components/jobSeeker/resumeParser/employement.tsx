import { useCallback, useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import numberToWords from "number-to-words";
import { Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import numWords from "num-words";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { regex } from "../../../common/validation";
import { getJobSeekerrData } from "../../../redux/features/manage-account/profile/JsSlice";
import { profileStrength } from "../../../redux/features/manage-account/profile/BasicDetailsSlice";
import {
  deleteEmployement,
  resetDeleteEmployement,
  updateEmployementDetails,
  resetEmployement,
} from "../../../redux/features/manage-account/profile/EmploymentSlice";
import {
  RollCategoryMasterData,
  RollMasterData,
  skillsMasterData,
} from "../../../ApiCall/masterData";
import { environment } from "../../../environments/environment";
import { BsPencil } from "react-icons/bs";
import AsyncCreatableSelect from "react-select/async-creatable";
import {
  GetMonthNameFromTimeStamp,
  GetYearFromTimeStamp,
  customStyles,
} from "../../../common/common";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import { getResumeData } from "../../../redux/features/jobSeeker/resumeParserSlice";
import NoticePeriod from "../../manage-account/profiles/jobseeker/NoticePeriod";
interface selectType {
  label: string;
  value: string;
}
interface employmentType {
  isCurrentEmployment: string;
  isFullTime: string;
  currentCompanyName: selectType | null;
  currentDesignation: selectType | null;
  previousCompanyName: selectType | null;
  previousDesignation: selectType | null;
  experienceYear: selectType | null;
  experienceMonth: selectType | null;
  fresher: boolean | null;
  location: selectType | null;
  department: selectType | null;
  roleCategory: selectType | null;
  roleName: selectType | null;
  skillsUsed: Array<any>;
  joiningDate_year: selectType | null;
  joiningDate_month: selectType | null;
  workingFrom_year: selectType | null;
  workingFrom_month: selectType | null;
  workingTill_year: selectType | null;
  workingTill_month: selectType | null;
  currentSalary: string;
  monthlyStipend: string;
  currency: string;
  jobProfileDesc: string;
  noticePeriod: selectType | null;
  expectedLastWorkingDay_year: string;
  expectedLastWorkingDay_month: string;
  expectedLastWorkingDay_day: string;
  offeredSalary: string;
  offeredCurrency: string;
  offeredDesg: selectType | null;
  nextEmployer: selectType | null;
  projectlink: string;
  id: string;
}

const employmentData: employmentType[] = [
  {
    isCurrentEmployment: "true",
    isFullTime: "true",
    currentCompanyName: null,
    currentDesignation: null,
    previousCompanyName: null,
    previousDesignation: null,
    experienceYear: null,
    experienceMonth: null,
    fresher: false,
    location: null,
    department: null,
    roleCategory: null,
    roleName: null,
    joiningDate_year: null,
    joiningDate_month: null,
    workingFrom_year: null,
    workingFrom_month: null,
    workingTill_year: null,
    workingTill_month: null,
    currentSalary: "",
    monthlyStipend: "",
    currency: "USD",
    skillsUsed: [],
    jobProfileDesc: "",
    noticePeriod: null,
    expectedLastWorkingDay_year: "",
    expectedLastWorkingDay_month: "",
    expectedLastWorkingDay_day: "",
    offeredSalary: "",
    offeredCurrency: "USD",
    offeredDesg: null,
    nextEmployer: null,
    projectlink: "",
    id: "",
  },
];

const schema = Yup.object().shape({
  isCurrentEmployment: Yup.string().notRequired(),
  isFullTime: Yup.string().notRequired(),
  currentCompanyName: Yup.object()
    .nullable()
    .when("isCurrentEmployment", {
      is: "true",
      then: Yup.object()
        .required("Please specify your Company Name.")
        .nullable(),
    }),

  currentDesignation: Yup.object()
    .nullable()
    .when(["isCurrentEmployment", "isFullTime"], {
      is: (isCurrentEmployment: string, isFullTime: string) =>
        isCurrentEmployment === "true" && isFullTime === "true",
      then: Yup.object()
        .required("Please specify your Designation.")
        .nullable(),
    }),

  previousCompanyName: Yup.object()
    .nullable()
    .when("isCurrentEmployment", {
      is: "false",
      then: Yup.object()
        .required("Please specify your Company Name.")
        .nullable(),
    }),
  previousDesignation: Yup.object()
    .nullable()
    .when(["isCurrentEmployment", "isFullTime"], {
      is: (isCurrentEmployment: string, isFullTime: string) =>
        isCurrentEmployment === "false" && isFullTime === "true",
      then: Yup.object()
        .required("Please specify your Designation.")
        .nullable(),
    }),

  joiningDate_year: Yup.object().when(["isFullTime"], {
    is: (isFullTime: string) => isFullTime === "true",
    then: Yup.object().nullable().required("Please specify joining Year."),
    otherwise: Yup.object().nullable().notRequired(),
  }),
  joiningDate_month: Yup.object()
    .nullable()
    .when(["isFullTime"], {
      is: (isFullTime: string) => isFullTime === "true",
      then: Yup.object().nullable().required("Please specify joining Month."),
      otherwise: Yup.object().nullable().notRequired(),
    }),

  workingFrom_year: Yup.object().when("isFullTime", {
    is: "false",
    then: Yup.object().nullable().required("Please specify start Year."),
    otherwise: Yup.object().nullable().notRequired(),
  }),
  workingFrom_month: Yup.object()
    .nullable()
    .when("isFullTime", {
      is: "false",
      then: Yup.object().required("Please specify start Month.").nullable(),
      otherwise: Yup.object().nullable().notRequired(),
    }),
  workingTill_year: Yup.object().when(["isCurrentEmployment"], {
    is: (isCurrentEmployment: string, isFullTime: string) =>
      isCurrentEmployment === "false",
    then: Yup.object().required("Please select valid till Year.").nullable(),
    otherwise: Yup.object().nullable().notRequired(),
  }),
  workingTill_month: Yup.object()
    .nullable()
    .when(["isCurrentEmployment"], {
      is: (isCurrentEmployment: string, isFullTime: string) =>
        isCurrentEmployment === "false",
      then: Yup.object().nullable().required("Please select valid till Month."),
      otherwise: Yup.object().nullable().notRequired(),
    }),
  skillsUsed: Yup.array().when(["isCurrentEmployment", "isFullTime"], {
    is: (isCurrentEmployment: string, isFullTime: string) =>
      isCurrentEmployment === "true" && isFullTime === "true",
    then: Yup.array()
      .min(1, "Please specify atleast one Key Skill.")
      .required("Please specify atleast one Key Skill."),
  }),
  location: Yup.object().when("isFullTime", {
    is: "false",
    then: Yup.object().nullable().required("Please specify Location."),
    otherwise: Yup.object().nullable().notRequired(),
  }),
  currentSalary: Yup.string().when(["isCurrentEmployment", "isFullTime"], {
    is: (isCurrentEmployment: string, isFullTime: string) =>
      isCurrentEmployment === "true" && isFullTime === "true",
    then: Yup.string().required("Please specify your Current Salary."),
  }),
  monthlyStipend: Yup.string().notRequired().nullable(),
  currency: Yup.string().notRequired(),
  jobProfileDesc: Yup.string().notRequired(),
  projectlink: Yup.string().when("isFullTime", {
    is: "false",
    then: Yup.string().matches(regex.url, "Please specify correct url."),
  }),

  noticePeriod: Yup.object()
    .nullable()
    .when(["isCurrentEmployment", "isFullTime"], {
      is: (isCurrentEmployment: string, isFullTime: string) =>
        isCurrentEmployment === "true" && isFullTime === "true",
      then: Yup.object().nullable().required("Please specify Notice Period."),
      otherwise: Yup.object().nullable().notRequired(),
    }),
  offeredDesg: Yup.object()
    .nullable()
    .when("noticePeriod", {
      is: (c) => c?.label === "Serving Notice Period",
      then: Yup.object().notRequired().nullable(),
    }),
  nextEmployer: Yup.object()
    .nullable()
    .when("noticePeriod", {
      is: (c) => c?.label === "Serving Notice Period",
      then: Yup.object().notRequired().nullable(),
    }),
  offeredCurrency: Yup.string().notRequired(),
  offeredSalary: Yup.number().when("noticePeriod", {
    is: (c) => c?.label === "Serving Notice Period",
    then: Yup.number().notRequired(),
  }),
  expectedLastWorkingDay_year: Yup.string().when("noticePeriod", {
    is: (c) => c?.label === "Serving Notice Period",
    then: Yup.string().required().nullable(),
  }),
  expectedLastWorkingDay_month: Yup.string().when("noticePeriod", {
    is: (c) => c?.label === "Serving Notice Period",
    then: Yup.string().required().nullable(),
  }),
  expectedLastWorkingDay_day: Yup.string().when("noticePeriod", {
    is: (c) => c?.label === "Serving Notice Period",
    then: Yup.string().required().nullable(),
  }),

  department: Yup.object().when("isFullTime", {
    is: "false",
    then: Yup.object().required("Please select Department.").nullable(),
    otherwise: Yup.object().nullable().notRequired(),
  }),
  roleCategory: Yup.object().when("isFullTime", {
    is: "false",
    then: Yup.object().required("Please select Role Catagory.").nullable(),
    otherwise: Yup.object().nullable().notRequired(),
  }),
  roleName: Yup.object().when("isFullTime", {
    is: "false",
    then: Yup.object().required("Please select Role Name.").nullable(),
    otherwise: Yup.object().nullable().notRequired(),
  }),
  id: Yup.string().notRequired(),
  experienceYear: Yup.object().when(["isCurrentEmployment", "isFullTime"], {
    is: (isCurrentEmployment: string, isFullTime: string) =>
      isCurrentEmployment === "true" && isFullTime === "true",
    then: Yup.object().required("Please specify Experience Years.").nullable(),
    otherwise: Yup.object().nullable().notRequired(),
  }),
  experienceMonth: Yup.object().when(["isCurrentEmployment", "isFullTime"], {
    is: (isCurrentEmployment: string, isFullTime: string) =>
      isCurrentEmployment === "true" && isFullTime === "true",
    then: Yup.object().required("Please specify Experience Months").nullable(),
    otherwise: Yup.object().nullable().notRequired(),
  }),
});

type propsState = {
  displayModel?: boolean;
  trigger?: any;
};

const convertToNumber = (value: string) => {
  return value?.replace(/\,/g, "");
};

function Employment(props: any) {
  const JobSeekerProfileData = useSelector(
    (state: any) => state.JobSeekerProfile2
  );

  const { JobSeekerProfile, loading, error } = JobSeekerProfileData;
  const [ind, setInd] = useState(true);
  const [us, setUS] = useState(false);
  const editRef = useRef<any>();

  const cancelBtnRef = useRef<any>();

  useEffect(() => {
    setFresh(JobSeekerProfile?.js_profile?.career_profile?.fresher);
    setTotalexpCurr(
      JobSeekerProfile?.js_profile?.career_profile?.total_exp?.curr_ctc
        ?.currency
    );
    setTotalexpSal(
      JobSeekerProfile?.js_profile?.career_profile?.total_exp?.curr_ctc?.value
    );
    if (
      JobSeekerProfile?.js_profile?.career_profile?.total_exp?.curr_ctc
        ?.currency == "USD"
    ) {
      setInd(false);
      setUS(true);
    }
  }, [JobSeekerProfile?.js_profile]);

  const [fresh, setFresh] = useState(false);
  const [totalexpSal, setTotalexpSal] = useState(0);
  const [totalexpCurr, setTotalexpCurr] = useState("");
  const [yearOfExp, setYearofExp] = useState<any>([]);
  const [monthOfExp, setMonthOfExp] = useState<any>([]);
  const employmentInitialValues: employmentType = {
    isCurrentEmployment: "true",
    isFullTime: "true",
    currentCompanyName: null,
    currentDesignation: null,
    previousCompanyName: null,
    previousDesignation: null,
    experienceYear:
      JobSeekerProfile?.js_profile?.career_profile?.total_exp?.year ||
      JobSeekerProfile?.js_profile?.career_profile?.total_exp?.year == 0
        ? yearOfExp.find(
            (c) =>
              c.value ==
              JobSeekerProfile?.js_profile?.career_profile?.total_exp?.year
          )
        : null,
    experienceMonth:
      JobSeekerProfile?.js_profile?.career_profile?.total_exp?.month ||
      JobSeekerProfile?.js_profile?.career_profile?.total_exp?.month == 0
        ? monthOfExp.find(
            (c) =>
              c.value ==
              JobSeekerProfile?.js_profile?.career_profile?.total_exp?.month
          )
        : null,
    fresher: fresh,
    location: null,
    department: null,
    roleCategory: null,
    roleName: null,
    skillsUsed: [],
    workingFrom_year: null,
    workingFrom_month: null,
    workingTill_year: null,
    workingTill_month: null,
    joiningDate_year: null,
    joiningDate_month: null,
    currentSalary: "",
    monthlyStipend: "",
    currency: "INR",
    jobProfileDesc: "",
    noticePeriod: null,
    expectedLastWorkingDay_year: "",
    expectedLastWorkingDay_month: "",
    expectedLastWorkingDay_day: "",
    offeredSalary: "",
    offeredCurrency: "INR",
    offeredDesg: null,
    nextEmployer: null,
    projectlink: "",
    id: "",
  };
  const [errorData, setDateError] = useState(false);
  const [count, setCount] = useState(0);
  const [radio, setRadio] = useState(true);
  const [editvalue, setEditvalue] = useState<
    employmentType | undefined | null
  >();
  const [employment, setEmployment] = useState(false);
  const [hideContect, setHideContent] = useState(true);
  const [hideModel, setHideModel] = useState(true);
  const [showmoney, setShowmoney] = useState(false);

  const handleHideEmployment = () => {
    setEmployment(false);
  };

  const [employmentList, setEmploymentList] = useState(employmentData);
  const handleEmploymentList = (data: employmentType) => {
    setEmploymentList([...employmentList, data]);
  };

  const [isCurrentEmployment, setIsCurrentEmployment] = useState(true);
  const handleIsCurrentEmployment = (event: any) => {
    setIsCurrentEmployment(event.target.value == "true" ? true : false);
  };

  const [selectedJoinYear, setSelectedJoinYear] = useState<any>("");
  const [selectedJoinMonth, setSelectedJoinMonth] = useState<any>("");
  const handleChangeJoiningYear = (e: any) => {
    setSelectedJoinYear(e);
  };

  const handleChangeJoiningMonth = (e: any) => {
    setSelectedJoinMonth(e);
  };

  const [selectedWorktillYear, setSelectedWorktillYear] = useState<any>("");
  const [selectedWorktillMonth, setSelectedWorktillMonth] = useState<any>("");
  const handleChangeWorktillYear = (e: any) => {
    setSelectedWorktillYear(e);
  };

  const handleChangeWorktillMonth = (e: any) => {
    setSelectedWorktillMonth(e);
  };

  const [noticehook, setNoticehook] = useState<any>("");
  const handleChangeNotice = (e: any) => {
    setNoticehook(e);
  };

  const employerProfileDetail = useSelector(
    (state: any) => state.employmentDetail
  );
  const resumeData = useSelector((state: any) => state.ResumeDatax);
  const { rmArray } = resumeData;

  const dispatch = useDispatch();
  const department_master_data = useSelector(
    (state: any) => state.departmentdata
  );

  const showSnackAlert = UseToastAlert();

  useEffect(() => {
    if (rmArray.length > 0) {
      getResumeData();
    }
  }, [rmArray]);

  useEffect(() => {
    if (!loading) {
      departmentmasterdata(department_master_data?.DepartmentData);
      setEmploymentList(JobSeekerProfile?.js_profile?.employments);
    }
  }, [JobSeekerProfile?.js_profile, loading]);

  const validate = (values: any) => {
    let endDate: Date | undefined;
    let startDate: Date | undefined;

    if (values?.joiningDate_month && values?.joiningDate_year) {
      startDate = new Date(
        values.joiningDate_year.value,
        values.joiningDate_month.value,
        1
      );
    }

    if (values?.workingFrom_year && values?.workingFrom_month) {
      startDate = new Date(
        values.workingFrom_year.value,
        values.workingFrom_month.value,
        1
      );
    }

    if (values?.workingTill_year && values?.workingTill_month) {
      endDate = new Date(
        values.workingTill_year.value,
        values.workingTill_month.value,
        1
      );
    }

    if (startDate && endDate && endDate < startDate) {
      setDateError(true);
    } else {
      setDateError(false);
    }
  };

  //   useEffect(() => {
  //     if (displayModel) {
  //       setHideContent(false);
  //       setHideModel(true);
  //       setEmployment(true);
  //     } else {
  //       setHideContent(true);
  //       setHideModel(true);
  //     }
  //     setTimeout(() => {
  //       editRef?.current?.click();
  //     }, 0);
  //   }, [displayModel]);

  const departmentData = [
    {
      id: 1,
      name: "IT & Information Security",
      roleCat: [
        {
          roleCatName: "IT Infrastructure Services",
          roles: [{ roleName: "Cloud System Administration" }],
        },
      ],
    },
    {
      id: 999,
      name: "Other",
      roleCat: [
        {
          roleCatName: "Other",
          roles: [{ roleName: "Other" }],
        },
        {
          roleCatName: "Other2",
          roles: [{ roleName: "Other2" }],
        },
      ],
    },
  ];
  const [deptData, setDeptData] = useState<any>([]);
  const deptDataArray: any = departmentData.map((singleObj: any) => {
    const obj = {
      value: `${singleObj.id}`,
      label: `${singleObj.name}`,
    };
    return obj;
  });
  const [catRoleArray, setCatRoleData] = useState<any>([]);
  const deptFilterHandler = (e: any) => {
    if (e) {
      if (e?.label !== "") {
        const deptSingleobj = departmentData.find((data: any) => {
          return data.name === e.label;
        });
        setDeptData(deptSingleobj);
        let catRoleArray: any = [];
        deptSingleobj?.roleCat.forEach((data: any) => {
          catRoleArray.push({
            value: `${data.roleCatName}`,
            label: `${data.roleCatName}`,
          });
        });
        setCatRoleData(catRoleArray);
      }
    }
  };
  const [roleData, setRoleData] = useState<any>([]);
  const roleCatFilterHandler = (e: any) => {
    if (e.label !== "") {
      var roleArray: any = [];
      var roleDisplayArray: any = [];

      deptData?.roleCat.forEach((data: any) => {
        if (data.roleCatName === e.label) {
          roleArray = data?.roles;
        }
      });
    }
    roleArray?.forEach((roles: any) => {
      roleDisplayArray.push({
        value: `${roles.roleName}`,
        label: `${roles.roleName}`,
      });
    });

    setRoleData(roleDisplayArray);
  };

  const handleReactSelect = () => {
    setSelectedJoinYear("");
    setSelectedJoinMonth("");
    setSelectedWorktillMonth("");
    setSelectedWorktillYear("");
    setNoticehook("");
    setSal("");
  };

  useEffect(() => {
    if (editvalue) {
      if (editvalue.joiningDate_year) {
        setSelectedJoinYear(
          year.filter(
            (data: { label: string; value: string }) =>
              data.label == editvalue.joiningDate_year?.label
          )
        );
        setSelectedJoinMonth(
          month.filter((data: any) => data.label == editvalue.joiningDate_month)
        );
      } else {
        setSelectedJoinYear(
          year.filter(
            (data: { label: string; value: string }) =>
              data.label == editvalue.workingFrom_year?.label
          )
        );
        setSelectedJoinMonth(
          month.filter((data: any) => data.label == editvalue.workingFrom_month)
        );
      }

      setCurrencyvalue(editvalue.currency == "USD" ? "en-US" : "en-IN");
      setsalaryfunction();
      setSelectedWorktillYear(
        year.filter(
          (data: { label: string; value: string }) =>
            data.label == editvalue.workingTill_year?.label
        )
      );
      setSelectedWorktillMonth(
        month.filter((data: any) => data.label == editvalue.workingTill_month)
      );

      if (
        editvalue.isCurrentEmployment == "true" &&
        editvalue.isFullTime == "true"
      )
        setNoticehook(
          notice.filter(
            (data: { value: string }) =>
              data.value == editvalue.noticePeriod?.label
          )
        );
    }
    setFresh(false);
  }, [editvalue]);

  const [serivice, setService] = useState("true");

  const GetDateFromTimeStamp = (timeStamp: number): number => {
    return new Date(timeStamp * 1000).getDate();
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [sal, setSal] = useState<any>("");

  const handleEditValue = (c: any) => {
    const employmentValues = {
      isCurrentEmployment: "true",
      isFullTime: "true",
      currentCompanyName: null,
      currentDesignation:
        c?.jobRole?.length > 0
          ? { label: c?.jobRole[0]?.name, value: c?.jobRole[0]?.id }
          : null,
      previousCompanyName: null,
      previousDesignation: null,
      experienceYear:
        JobSeekerProfile?.js_profile?.career_profile?.total_exp?.year ||
        JobSeekerProfile?.js_profile?.career_profile?.total_exp?.year == 0
          ? yearOfExp.find(
              (c) =>
                c.value ==
                JobSeekerProfile?.js_profile?.career_profile?.total_exp?.year
            )
          : null,
      experienceMonth:
        JobSeekerProfile?.js_profile?.career_profile?.total_exp?.month ||
        JobSeekerProfile?.js_profile?.career_profile?.total_exp?.month == 0
          ? monthOfExp.find(
              (c) =>
                c.value ==
                JobSeekerProfile?.js_profile?.career_profile?.total_exp?.month
            )
          : null,
      fresher: false,
      location: null,
      department:
        c?.department?.length > 0
          ? { label: c?.department[0]?.name, value: c?.department[0]?.id }
          : null,
      roleCategory: null,
      roleName: null,
      joiningDate_year: null,
      joiningDate_month: null,
      workingFrom_year: null,
      workingFrom_month: null,
      workingTill_year: null,
      workingTill_month: null,
      currentSalary: "",
      monthlyStipend: "",
      currency: "INR",
      skillsUsed:
        c?.skills?.length > 0
          ? c?.skills?.map((val: any) => {
              return { label: val?.name, value: val?.id };
            })
          : [],
      jobProfileDesc: "",
      noticePeriod: null,
      expectedLastWorkingDay_year: "",
      expectedLastWorkingDay_month: "",
      expectedLastWorkingDay_day: "",
      offeredSalary: "",
      offeredCurrency: "INR",
      offeredDesg: null,
      nextEmployer: null,
      projectlink: "",
      id: "",
    };
    setEditvalue(employmentValues);
  };
  const currentSalaryFn = () => {
    if (totalexpSal) {
      totalexpSal ? setSal(nf.format(Number(totalexpSal))) : setSal("");
    }
  };
  useEffect(() => {}, [sal]);

  const setsalaryfunction = () => {
    if (editvalue?.currentSalary) {
      editvalue?.currentSalary
        ? setSal(nf.format(Number(editvalue?.currentSalary)))
        : setSal("");
      setSalary(editvalue?.currentSalary);
    } else if (editvalue?.monthlyStipend) {
      editvalue?.monthlyStipend
        ? setSal(nf.format(Number(editvalue?.monthlyStipend)))
        : setSal("");
      setSalary(editvalue?.monthlyStipend);
    }
  };
  const [currencyvalue, setCurrencyvalue] = useState<any>("en-IN");

  const nf = new Intl.NumberFormat(currencyvalue, {
    maximumFractionDigits: 2,
  });
  const ChangeSalary = (cValue, salary) => {
    const nf2 = new Intl.NumberFormat(cValue, {
      maximumFractionDigits: 2,
    });

    setSal(nf2.format(salary.replace(/\,/g, "")));
    setCurrencyvalue(cValue);
  };

  const handleExperience = (start, end) => {
    const currentDate = new Date(
        new Date().toLocaleString("fr-CA", { dateStyle: "short" })
      ),
      arrDoj = moment([
        GetYearFromTimeStamp(start),
        GetMonthNameFromTimeStamp(start, true, true),
        1,
      ]),
      arrCurrentDate =
        end !== null
          ? moment([
              GetYearFromTimeStamp(end),
              GetMonthNameFromTimeStamp(end, true, true),
              1,
            ])
          : moment([currentDate.getFullYear(), currentDate.getMonth(), 1]),
      momentdiffInMonths = Math.abs(arrCurrentDate.diff(arrDoj, "months")),
      diffInYear = Number(Math.floor(momentdiffInMonths / 12)),
      diffInMonth = Number(momentdiffInMonths % 12),
      experience: any = {};

    if (diffInYear > 0 && diffInMonth > 0) {
      return `${diffInYear} ${
        diffInYear == 1 ? "Year" : "Years"
      } ${diffInMonth}  ${diffInMonth == 1 ? "month" : "months"}`;
    } else if (diffInYear === 0) {
      return `${diffInMonth} ${diffInMonth == 1 ? "Month" : "Months"}`;
    } else {
      return `${diffInYear} ${diffInYear == 1 ? "Year" : "Years"}`;
    }
  };
  const [iscurr, setIscurr] = useState("true");
  const [iscurrency, setIscurrency] = useState("INR");
  const [dis, setDis] = useState<any>();

  const [salary, setSalary] = useState<any>(null);

  //   const resumeData = useSelector((state: any) => state.ResumeDatax);
  //   const { rmArray } = resumeData;
  useEffect(() => {
    if (rmArray.code == 200 && Object.keys(rmArray.data).length > 0) {
      handleEditValue(rmArray.data);
    }
  }, [rmArray]);

  useEffect(() => {
    if (typeof salary === "number") setDis(true);
    else if (typeof salary === "string") setDis(false);
    else setDis(false);
  }, [salary, setDis]);
  const handleSalaryChange = (event) => {
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
    if (sal == 0) {
      return;
    }
    const convertedSalary = `${numberToWords.toWords(salary)?.toLowerCase()}`;
    const capitalizedSalary =
      convertedSalary.charAt(0).toUpperCase() + convertedSalary.slice(1);
    return capitalizedSalary + " " + "Dollars";
  };

  /*master Data fetching */
  const masterDatas = useSelector((state: any) => state.jobSeekerMasterData);
  const { JSMasterData } = masterDatas;
  const [notice, setNotice] = useState<any>([]);
  useEffect(() => {
    if (Array.isArray(JSMasterData)) {
      JSMasterData?.map((opt: any) => {
        if (opt.group === "NPRD") {
          let obj: any = [];
          opt.data.map((item: any, index) => {
            obj.push({ value: item.value, label: item.value });
          });
          setNotice(obj);
        }
      });
    }
  }, [JSMasterData]);
  useEffect(() => {}, [notice]);

  const fnResetModal = () => {
    setEmployment(false);
    setEditvalue(null);
    handleReactSelect();
    if (
      JobSeekerProfile?.js_profile?.career_profile?.total_exp?.curr_ctc
        ?.currency == "USD"
    ) {
      setInd(false);
      setUS(true);
    } else {
      setInd(true);
      setUS(false);
    }
  };

  /* skills master data */
  const [skillsCount, setSkillsCount] = useState<number>(0);
  const [skillsUsed, setSkillsUsed] = useState<any>();
  let countNumber: any = 0;

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

  useEffect(() => {
    if (countNumber) {
      setSkillsCount(countNumber);
    }
  }, [countNumber]);

  const skillsmasterData = useSelector((state: any) => state.skills);
  const { SkillsData } = skillsmasterData;
  const [skillMeta, setSkillMeta] = useState<any>([]);
  useEffect(() => {
    if (Array.isArray(SkillsData)) {
      const data = SkillsData?.map((c: any) => {
        return {
          label: c,
          value: c,
        };
      });
      setSkillMeta(data);
    }
  }, [SkillsData]);
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

  /*designation master data */
  const [designt, setDesignt] = useState<any>("");
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

  /*year and month data */
  const yearmonthData = useSelector((state: any) => state.yearmonthMasterdata);
  const { allYearMonth } = yearmonthData;

  const [year, setyear] = useState<any>([]);
  const [month, setmonth] = useState<any>([]);

  useEffect(() => {
    if (Array.isArray(allYearMonth)) {
      allYearMonth.map((opt: any) => {
        if (opt.group === "PAYE") {
          let obj: any = opt.data.map((item: any, index) => {
            return { value: item, label: item };
          });
          setyear(obj.reverse());
        }
        if (opt.group === "GTMO") {
          let obj: any = [];
          opt.data.map((item: any, index) => {
            obj.push({ value: index, label: item.value });
          });
          setmonth(obj);
        }
        if (opt.group === "YOEP") {
          let obj: any = opt.data.map((item: any, index) => {
            return { value: item.id, label: item.value };
          });
          setYearofExp(obj);
          setYearChangeYearExp(obj);
        }
        if (opt.group === "MOEP") {
          let obj: any = opt.data.map((item: any, index) => {
            return { value: item.id, label: item.value };
          });
          setMonthOfExp(obj);
          setMonthChangeYearExp(obj);
        }
      });
    }
  }, [allYearMonth]);
  const [MonthChangeYearExp, setMonthChangeYearExp] = useState<any>([]);
  const [YearChangeYearExp, setYearChangeYearExp] = useState<any>([]);
  const handleYearOfExp = (value: any) => {
    if (value == "0 Month") {
      const arr = yearOfExp?.filter((val: any) => val?.label !== "0 Year");

      setYearChangeYearExp(arr);
    } else {
      setYearChangeYearExp(yearOfExp);
    }
  };
  const handleMonthOfExp = (value: any) => {
    if (value == "0 Year") {
      const arr = monthOfExp?.filter((val: any) => val?.label !== "0 Month");

      setMonthChangeYearExp(arr);
    } else {
      setMonthChangeYearExp(monthOfExp);
    }
  };
  /*city master data */
  const [city, setCity] = useState<any>();
  const citymasterData = useSelector((state: any) => state.locationcity);
  const { LocationcityData } = citymasterData;
  const [locationcity, setLocationcity] = useState<any>([]);
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

  const filterColors1 = (inputValue: string) => {
    return locationcity.filter((i) =>
      i.label?.toLowerCase().includes(inputValue?.toLowerCase())
    );
  };
  const promiseOptions1 = (inputValue: string) =>
    new Promise<selectType[] | any>((resolve) => {
      setTimeout(() => {
        resolve(filterColors1(inputValue));
      }, 1000);
    });

  /*department master data */
  const [dpt, setDpt] = useState<any>();
  const departmentmasterData = useSelector(
    (state: any) => state.departmentdata
  );
  const { DepartmentData } = departmentmasterData;
  const [deptdata1, setDeptdata1] = useState<any>([]);

  useEffect(() => {
    if (Array.isArray(DepartmentData)) {
      const data = DepartmentData?.map((c: any) => {
        return { label: c.name, value: c.id };
      });
      setDeptdata1([...data]);
    }
  }, [DepartmentData]);
  const filterColors2 = (inputValue: string) => {
    return deptdata1?.filter((i) =>
      i?.label?.toLowerCase().includes(inputValue?.toLowerCase())
    );
  };
  const promiseOptions2 = (inputValue: string) =>
    new Promise<selectType[]>((resolve) => {
      setTimeout(() => {
        resolve(filterColors2(inputValue));
      }, 1000);
    });

  /* comapny master data */
  const [cmpny, setCmpny] = useState<any>();
  const [precmpny, setPrecmpny] = useState<any>();
  const CompanymasterData = useSelector((state: any) => state.compnayname);
  const { CompanyData } = CompanymasterData;
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

  useEffect(() => {}, [companyname]);

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

  const [deptState, setDeptstate] = useState<any>([{ label: "", value: "" }]);
  const [departmentState, setDepartmentState] = useState<selectType | null>();
  const [roleCategoryMeta, setRoleCategoryMeta] = useState<any>([]);
  const [roleCategoryState, setRoleCategoryState] =
    useState<selectType | null>();
  const [JobroleMeta, setJobRoleMeta] = useState<any>([]);
  const [roleState, setRoleState] = useState<selectType | null>();
  const handleDepartmentStateChange = (option: any) => {
    setDepartmentState(option);
  };
  const handleRoleCategoryStateChange = (option: any) => {
    setRoleCategoryState(option);
  };
  const handleRoleStateChange = (option: any) => {
    setRoleState(option);
  };

  const departmentmasterdata = (data: any) => {
    setDeptstate(
      data?.map((d: any) => {
        return { label: d?.name, value: d?.id };
      })
    );
  };
  const getRoleCategories = async (
    value: string,
    valueBindRequired: boolean = false,
    roleCatValue: string = "",
    roleValue: string = ""
  ) => {
    const data = { pageNo: -1, parent_id: value, active: 1 };
    const rc = await RollCategoryMasterData(data);
    const optionData = rc?.map((d: any, i: any) => {
      return { value: `${d?.id}`, label: d?.name };
    });
    setRoleCategoryMeta(optionData);

    if (valueBindRequired) {
      const roleInputData = optionData?.find((d: any) => {
        return roleCatValue === d?.label;
      });

      setRoleCategoryState(roleInputData);
      getJobRole(roleInputData?.value, true, roleValue);
    }
  };

  const [empData, setEmpData] = useState<any>([]);

  useEffect(() => {
    if (JobSeekerProfile?.js_profile?.employments?.length > 0) {
      JobSeekerProfile?.js_profile?.employments?.map((data: any) => {
        if (!data.work_till) {
          if (!data.fulltime.job_desc) {
            setEmpData([{ ...data }]);
          }
        }
      });
    }
    setTimeout(() => {
      editRef?.current?.click();
    }, 0);
  }, [JobSeekerProfile]);

  const getJobRole = async (
    value: string,
    valueBindRequired: boolean = false,
    roleValue = ""
  ) => {
    const data = { pageNo: -1, parent_id: value, active: 1 };
    const rm = await RollMasterData(data);
    const optionData = rm?.map((d: any, i: any) => {
      return { value: `${d.id}`, label: d.name };
    });
    setJobRoleMeta(optionData);

    if (valueBindRequired) {
      const jobInputData = optionData.find((d: any) => {
        return roleValue === d.label;
      });
      handleRoleStateChange(jobInputData);
    }
  };
  const pflStrength = useSelector((state: any) => state.profileStrength);

  const bindSelectControlValues = async (c: any) => {
    if (c?.internship?.dept) {
      const deptInputData = deptState.find((d: any) => {
        return c?.internship?.dept === d.label;
      });
      setDepartmentState(deptInputData);
      await getRoleCategories(
        deptInputData?.value,
        true,
        c?.internship?.category,
        c?.internship?.role
      );
    }
  };

  const [inputValue, setInputValue] = useState("");
  const [inputJTValue, setInputJTValue] = useState("");
  const [companyInputValue, setCompanyInputValue] = useState("");
  const [locationInputValue, setLocationInputValue] = useState("");

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue.replace(/[^a-zA-Z0-9-.',:!()&+#/>\s]*$/, ""));
  };
  const handleInputChanges = (newValue: string) => {
    setCompanyInputValue(newValue.replace(/[^a-zA-Z0-9-.',()&@*\s]*$/, ""));
  };
  const handleInputLocation = (newValue: string) => {
    setLocationInputValue(newValue.replace(/[^a-zA-Z\s]*$/, ""));
  };

  return (
    <Formik
      validationSchema={schema}
      initialValues={editvalue || employmentInitialValues}
      enableReinitialize={true}
      validate={validate}
      onSubmit={(values, { resetForm }) => {
        setDepartmentState(null);
        setRoleCategoryMeta(null);
        setRoleState(null);
        if (errorData) {
          return;
        }
        let data: any = {};
        if (editvalue) {
          if (values.isFullTime === "true") {
            data = {
              employement_id: values.id,
              start_year: values.joiningDate_year
                ? Number(values.joiningDate_year.label)
                : null,
              start_month: values.joiningDate_month
                ? Number(values.joiningDate_month.value)
                : null,
              end_year:
                values.isCurrentEmployment == "false" && values.workingTill_year
                  ? Number(values.workingTill_year.label)
                  : null,
              end_month:
                values.isCurrentEmployment == "false" &&
                values.workingTill_month
                  ? Number(values.workingTill_month.value)
                  : null,
              org: values.currentCompanyName
                ? values.currentCompanyName?.label
                : values.previousCompanyName?.label,
              experience: {
                currency: values.currency ? values.currency : null,
              },
              fullTime: {
                role:
                  values.isCurrentEmployment === "true"
                    ? values.currentDesignation?.label
                    : values.previousDesignation?.label,
                job_desc: values.jobProfileDesc ? values.jobProfileDesc : null,
                skills: values.skillsUsed
                  ? values.skillsUsed.map((val) => val.label)
                  : null,
                noticePeriod: {
                  term:
                    values.isCurrentEmployment == "true"
                      ? values.noticePeriod?.label
                        ? values.noticePeriod.label
                        : null
                      : null,
                  offered_role:
                    values.noticePeriod?.label == "Serving Notice Period"
                      ? values.offeredDesg?.label
                        ? values.offeredDesg.label
                        : null
                      : null,
                  company:
                    values.noticePeriod?.label == "Serving Notice Period"
                      ? values.nextEmployer?.label
                        ? values.nextEmployer.label
                        : null
                      : null,
                  offer_salary: {
                    currency:
                      values.noticePeriod?.label == "Serving Notice Period"
                        ? values.offeredCurrency
                          ? values.offeredCurrency
                          : null
                        : null,
                    ctc:
                      values.noticePeriod?.label == "Serving Notice Period"
                        ? values.offeredSalary
                          ? Number(values.offeredSalary)
                            ? values.offeredSalary
                            : Number(values.offeredSalary.replace(/\,/g, ""))
                          : null
                        : null,
                  },
                  end_year:
                    values.noticePeriod?.label == "Serving Notice Period"
                      ? values.expectedLastWorkingDay_year
                        ? Number(values.expectedLastWorkingDay_year)
                        : null
                      : null,
                  end_day:
                    values.noticePeriod?.label == "Serving Notice Period"
                      ? values.expectedLastWorkingDay_day
                        ? Number(values.expectedLastWorkingDay_day)
                        : null
                      : null,
                },
              },
            };
          } else {
            data = {
              employement_id: values.id,
              start_year: values.workingFrom_year
                ? Number(values.workingFrom_year.label)
                : null,
              start_month: values.workingFrom_month
                ? Number(values.workingFrom_month.value)
                : null,
              end_year:
                values.isCurrentEmployment == "false" && values.workingTill_year
                  ? Number(values.workingTill_year.label)
                  : null,
              end_month:
                values.isCurrentEmployment == "false" &&
                values.workingTill_month
                  ? Number(values.workingTill_month.value)
                  : null,
              org: values.currentCompanyName
                ? values.currentCompanyName?.label
                : values.previousCompanyName?.label,
              experience: {
                currency: values.currency ? values.currency : null,
              },
              internship: {
                role: values.roleName?.label,
                location: values.location ? values.location.label : null,
                dept: values.department ? values.department.label : null,
                category: values.roleCategory
                  ? values.roleCategory.label
                  : null,
                proj: {
                  uri: values.projectlink ? values.projectlink : null,
                  desc: values.jobProfileDesc ? values.jobProfileDesc : null,
                },
              },
            };
          }
        } else {
          if (values.isFullTime === "true") {
            data = {
              employement_id: values.id,
              start_year: values.joiningDate_year
                ? Number(values.joiningDate_year.value)
                : null,
              start_month: values.joiningDate_month
                ? Number(values.joiningDate_month.value)
                : null,
              end_year:
                values.isCurrentEmployment == "false" && values.workingTill_year
                  ? Number(values.workingTill_year.label)
                  : null,
              end_month:
                values.isCurrentEmployment == "false" &&
                values.workingTill_month
                  ? Number(values.workingTill_month.value)
                  : null,
              org: values.currentCompanyName
                ? values.currentCompanyName?.label
                : values.previousCompanyName?.label,
              experience: {
                currency: values.currency ? values.currency : null,
              },
              fullTime: {
                role:
                  values.isCurrentEmployment === "true"
                    ? values.currentDesignation?.label
                    : values.previousDesignation?.label,
                job_desc: values.jobProfileDesc ? values.jobProfileDesc : null,
                skills: values.skillsUsed
                  ? values.skillsUsed.map((val) => val.label)
                  : null,
                noticePeriod: {
                  term: values.noticePeriod?.label
                    ? values.noticePeriod.label
                    : null,
                  offered_role: values.offeredDesg?.label
                    ? values.offeredDesg.label
                    : null,
                  company: values.nextEmployer?.label
                    ? values.nextEmployer.label
                    : null,
                  offer_salary: {
                    currency: values.offeredCurrency
                      ? values.offeredCurrency
                      : null,
                    ctc: values.offeredSalary
                      ? Number(values.offeredSalary)
                        ? values.offeredSalary
                        : Number(values.offeredSalary.replace(/\,/g, ""))
                      : null,
                  },
                  end_year: values.expectedLastWorkingDay_year
                    ? Number(values.expectedLastWorkingDay_year)
                    : null,
                  end_day: values.expectedLastWorkingDay_day
                    ? Number(values.expectedLastWorkingDay_day)
                    : null,
                },
              },
            };
          } else {
            data = {
              employement_id: values.id,
              start_year: values.workingFrom_year?.label
                ? Number(values.workingFrom_year.label)
                : Number(values.workingFrom_year?.label),
              start_month: values.workingFrom_month?.value
                ? Number(values.workingFrom_month.value)
                : Number(values.workingFrom_month?.value),
              end_year:
                values.isCurrentEmployment == "false" && values.workingFrom_year
                  ? Number(values.workingFrom_year.value)
                  : null,
              end_month:
                values.isCurrentEmployment == "false" &&
                values.workingFrom_month
                  ? Number(values.workingFrom_month.value)
                  : null,
              org: values.currentCompanyName
                ? values.currentCompanyName?.label
                : values.previousCompanyName?.label,
              experience: {
                currency: values.currency ? values.currency : null,
                curr_ctc: null,
              },
              internship: {
                role: values.roleName?.label ? values.roleName?.label : null,
                location: values.location?.label ? values.location.label : null,
                dept: values.department?.label ? values.department.label : null,
                category: values.roleCategory?.label
                  ? values.roleCategory.label
                  : null,
                proj: {
                  uri: values.projectlink ? values.projectlink : null,
                  desc: values.jobProfileDesc ? values.jobProfileDesc : null,
                },
              },
            };
          }
        }

        const Allmonth = [
          "Janaury",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        if (values.workingTill_month) {
          data.end_month = values.workingTill_month
            ? values.workingTill_month?.value
            : null;
        }

        if (values.expectedLastWorkingDay_month) {
          const foundlasttill = Allmonth.findIndex(
            (val: any) => val == values.expectedLastWorkingDay_month
          );
          data.fullTime.noticePeriod.end_month = foundlasttill
            ? foundlasttill
            : null;
        }
        if (values.currentSalary && values.currentSalary !== "") {
          data.experience.curr_ctc = Number(values.currentSalary)
            ? Number(values.currentSalary)
            : Number(values.currentSalary.replace(/\,/g, ""));
        } else if (values.monthlyStipend && values.monthlyStipend != "") {
          data.experience.curr_ctc = Number(values.monthlyStipend)
            ? Number(values.monthlyStipend)
            : Number(values.monthlyStipend.replace(/\,/g, ""));
        } else data.experience.curr_ctc = null;

        if (
          values.isCurrentEmployment == "false" &&
          values.isFullTime == "true"
        ) {
          data.experience.currency = "";
        }

        if (values.experienceMonth && values.experienceYear) {
          data.expMonth = values.experienceMonth.value;
          data.expYear = values.experienceYear.value;
        }
        dispatch(getResumeData(data));
        dispatch(updateEmployementDetails(data));
        dispatch(resetEmployement(data));
        props.next();
        resetForm();
        setEmployment(false);
        handleReactSelect();
      }}
    >
      {({
        handleSubmit,
        resetForm,
        handleChange,
        handleBlur,
        values,
        touched,
        isValid,
        errors,
        setFieldValue,
      }) => {
        return (
          <>
            <h5>Add your employment</h5>
            <p className="modal-custom-desc mb-3 ">
              Employment details help recruiters understand your background.
            </p>

            <div className="" role="">
              <div className="">
                <Form onSubmit={handleSubmit}>
                  <div className="">
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <label>Are you currently employed?</label>
                          <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                              <div className="custom-control custom-radio">
                                <input
                                  type="radio"
                                  name="isCurrentEmployment"
                                  checked={values.isCurrentEmployment == "true"}
                                  onChange={(e: any) => {
                                    handleChange(e);
                                    setIscurr(e.target.value);
                                  }}
                                  onClick={(e: any) => {
                                    resetForm();
                                    setFieldValue("isFullTime", serivice);

                                    handleChange(e);
                                    if (editvalue) {
                                      setFieldValue(
                                        "isFullTime",
                                        values.isFullTime
                                      );
                                      if (values.isFullTime == "true") {
                                        setCurrencyvalue(
                                          totalexpCurr == "USD"
                                            ? "en-US"
                                            : "en-IN"
                                        );
                                        currentSalaryFn();
                                        setFieldValue("currency", totalexpCurr);
                                        setFieldValue(
                                          "currentSalary",
                                          totalexpSal
                                        );
                                      }

                                      if (values.previousCompanyName)
                                        values.currentCompanyName =
                                          values.previousCompanyName;
                                      values.currentDesignation =
                                        values.previousDesignation;
                                      if (values.previousCompanyName)
                                        values.currentCompanyName =
                                          values.previousCompanyName;
                                      values.currentDesignation =
                                        values.previousDesignation;
                                    }
                                  }}
                                  onBlur={handleBlur}
                                  value="true"
                                  className="custom-control-input"
                                  id="employ_yes"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="employ_yes"
                                >
                                  Yes
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                              <div className="custom-control custom-radio">
                                <input
                                  type="radio"
                                  name="isCurrentEmployment"
                                  onChange={(e: any) => {
                                    handleChange(e);
                                    setIscurr(e.target.value);
                                    setFieldValue("workingTill_year", null);
                                    setFieldValue("workingTill_month", null);
                                  }}
                                  onBlur={handleBlur}
                                  value="false"
                                  onClick={(e: any) => {
                                    resetForm();
                                    setFieldValue("isFullTime", serivice);

                                    handleChange(e);
                                    if (editvalue) {
                                      setFieldValue(
                                        "isFullTime",
                                        values.isFullTime
                                      );

                                      if (values.isFullTime == "true") {
                                        setCurrencyvalue(
                                          totalexpCurr == "USD"
                                            ? "en-US"
                                            : "en-IN"
                                        );
                                        currentSalaryFn();
                                        setFieldValue("currency", totalexpCurr);
                                        setFieldValue(
                                          "currentSalary",
                                          totalexpSal
                                        );
                                      }
                                      if (values.currentCompanyName)
                                        values.previousCompanyName =
                                          values.currentCompanyName;
                                      values.previousDesignation =
                                        values.currentDesignation;
                                      if (values.previousCompanyName)
                                        values.currentCompanyName =
                                          values.previousCompanyName;
                                      values.currentDesignation =
                                        values.previousDesignation;
                                    }
                                  }}
                                  checked={
                                    values.isCurrentEmployment == "false"
                                  }
                                  className="custom-control-input"
                                  id="employ_no"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="employ_no"
                                >
                                  No
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <label>Employment Type</label>

                          <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                              <div className="custom-control custom-radio">
                                <input
                                  type="radio"
                                  name="isFullTime"
                                  defaultChecked={true}
                                  onClick={(e) => {
                                    resetForm();
                                    handleChange(e);
                                    setFieldValue(
                                      "isCurrentEmployment",
                                      iscurr
                                    );
                                    setFieldValue("currency", iscurrency);
                                  }}
                                  onChange={(e) => {
                                    handleChange(e);
                                    setService(e.target.value);
                                  }}
                                  onBlur={handleBlur}
                                  value={"true"}
                                  className="custom-control-input"
                                  id="rdoEmpTypeFull"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="rdoEmpTypeFull"
                                >
                                  Full Time
                                </label>
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                              <div className="custom-control custom-radio">
                                <input
                                  type="radio"
                                  name="isFullTime"
                                  onClick={(e) => {
                                    resetForm();
                                    handleChange(e);
                                    setFieldValue(
                                      "isCurrentEmployment",
                                      iscurr
                                    );
                                    setFieldValue("currency", iscurrency);
                                  }}
                                  onChange={(e) => {
                                    handleChange(e);
                                    setService(e.target.value);
                                  }}
                                  onBlur={handleBlur}
                                  value={"false"}
                                  className="custom-control-input"
                                  id="rdoEmpTypeInternship"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="rdoEmpTypeInternship"
                                >
                                  Internship
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {values.isCurrentEmployment == "true" &&
                        values.isFullTime == "true" && (
                          <div className="col-lg-12 col-md-12">
                            <div className="">
                              <label>Total Work Experience</label>
                              <span style={{ color: "red" }}>*</span>
                              <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                  <Select
                                    placeholder="Years"
                                    value={values.experienceYear}
                                    name="experienceYear"
                                    maxMenuHeight={200}
                                    onChange={(option: any) => {
                                      handleMonthOfExp(option?.label);
                                      let event = {
                                        target: {
                                          name: "experienceYear",
                                          value: option,
                                        },
                                      };
                                      handleChange(event);
                                    }}
                                    onBlur={handleBlur}
                                    isSearchable={true}
                                    isClearable={true}
                                    options={YearChangeYearExp}
                                    className={"dropstyle"}
                                    styles={customStyles}
                                  />
                                  {errors.experienceYear &&
                                    touched.experienceYear && (
                                      <p className="form-error">
                                        {errors.experienceYear}
                                      </p>
                                    )}
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                  <Select
                                    placeholder="Months"
                                    value={values.experienceMonth}
                                    name="experienceMonth"
                                    maxMenuHeight={200}
                                    onBlur={handleBlur}
                                    onChange={(option: any) => {
                                      handleYearOfExp(option?.label);
                                      let event = {
                                        target: {
                                          name: "experienceMonth",
                                          value: option,
                                        },
                                      };
                                      handleChange(event);
                                    }}
                                    isSearchable={true}
                                    isClearable={true}
                                    options={MonthChangeYearExp}
                                    className={"dropstyle"}
                                    styles={customStyles}
                                  />
                                  {errors.experienceMonth &&
                                    touched.experienceMonth && (
                                      <p className="form-error">
                                        {errors.experienceMonth}
                                      </p>
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                      {values.isCurrentEmployment == "true" && (
                        <div className="col-lg-12 col-md-12 col-xs-12 mt-2">
                          <div className="form-group ">
                            {values.isCurrentEmployment === "true" ? (
                              <label>Current Company Name</label>
                            ) : (
                              <label>Previous Company Name</label>
                            )}
                            <span style={{ color: "red" }}>*</span>
                            <AsyncCreatableSelect
                              className="dropstyle"
                              placeholder="Type Your Current Company"
                              cacheOptions
                              styles={customStyles}
                              noOptionsMessage={() => "Enter keyword to search"}
                              maxMenuHeight={200}
                              isValidNewOption={isValidNewOption}
                              isClearable={true}
                              name="currentCompanyName"
                              value={values.currentCompanyName}
                              onChange={(e: any) => {
                                let event = {
                                  target: {
                                    name: "currentCompanyName",
                                    value: e,
                                  },
                                };
                                setCmpny(e);
                                handleChange(event);
                              }}
                              loadOptions={promiseOptions3}
                              onInputChange={handleInputChanges}
                              inputValue={companyInputValue}
                            />

                            {errors.currentCompanyName &&
                              touched.currentCompanyName && (
                                <p className="form-error">
                                  {values.isCurrentEmployment == "true" &&
                                    errors.currentCompanyName}
                                </p>
                              )}
                          </div>
                        </div>
                      )}

                      {values.isCurrentEmployment == "false" && (
                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <label>Previous Company Name</label>
                            <span style={{ color: "red" }}>*</span>
                            <AsyncCreatableSelect
                              maxMenuHeight={200}
                              className="dropstyle"
                              styles={customStyles}
                              placeholder="Type Your Previous Company"
                              cacheOptions
                              isValidNewOption={isValidNewOption}
                              noOptionsMessage={() => "Enter keyword to search"}
                              isClearable={true}
                              name="previousCompanyName"
                              value={values.previousCompanyName}
                              formatCreateLabel={(inputValue) => {
                                return inputValue.length > 5
                                  ? inputValue.substring(0, 50)
                                  : inputValue;
                              }}
                              onChange={(e: any) => {
                                let event = {
                                  target: {
                                    name: "previousCompanyName",
                                    value: e,
                                  },
                                };
                                setPrecmpny(e);
                                handleChange(event);
                              }}
                              loadOptions={promiseOptions3}
                              onInputChange={handleInputChanges}
                              inputValue={companyInputValue}
                            />

                            {errors.previousCompanyName &&
                              touched.previousCompanyName && (
                                <p className="form-error">
                                  {errors.previousCompanyName}
                                </p>
                              )}
                          </div>
                        </div>
                      )}
                      {values.isFullTime == "false" ? (
                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <label>Location</label>
                            <span style={{ color: "red" }}>*</span>
                            <AsyncCreatableSelect
                              maxMenuHeight={200}
                              styles={customStyles}
                              className="dropstyle"
                              placeholder="Select location"
                              cacheOptions
                              isValidNewOption={isValidNewOption}
                              noOptionsMessage={() => "Enter keyword to search"}
                              isClearable={true}
                              name="location"
                              value={values.location}
                              onChange={(e: any) => {
                                let event = {
                                  target: {
                                    name: "location",
                                    value: e,
                                  },
                                };
                                handleChange(event);
                              }}
                              loadOptions={promiseOptions1}
                              onInputChange={handleInputLocation}
                              inputValue={locationInputValue}
                            />
                            {errors.location && touched.location && (
                              <p className="form-error">{errors.location}</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                      {values.isFullTime == "false" ? (
                        <div className="col-lg-12 col-md-12 col-xs-12">
                          <div className="form-group">
                            <label>Department</label>
                            <span style={{ color: "red" }}>*</span>

                            {/* -------------- */}
                            <Select
                              placeholder="Select Department"
                              isSearchable={true}
                              isClearable={false}
                              maxMenuHeight={200}
                              isDisabled={false}
                              options={deptState}
                              value={values.department}
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
                                setRoleCategoryState(null);
                                setRoleState(null);
                              }}
                            />
                            {errors.department && touched.department && (
                              <p className="form-error">{errors.department}</p>
                            )}
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                      {values.isFullTime == "false" && (
                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <label>Role Category</label>
                            <span style={{ color: "red" }}>*</span>

                            {/* --------------- */}

                            <Select
                              placeholder="Select Role Category"
                              isSearchable={true}
                              isClearable={true}
                              isDisabled={false}
                              maxMenuHeight={200}
                              options={roleCategoryMeta}
                              value={
                                roleCategoryState?.label == ""
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
                                setRoleState(null);
                              }}
                            />

                            {errors.roleCategory && touched.roleCategory && (
                              <p className="form-error">
                                {errors.roleCategory}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      {values.isFullTime == "false" && (
                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <label>Role</label>
                            <span style={{ color: "red" }}>*</span>
                            <Select
                              maxMenuHeight={200}
                              placeholder="Select Role"
                              isSearchable={true}
                              isClearable={true}
                              isDisabled={false}
                              options={JobroleMeta}
                              value={roleState}
                              className="dropstyle"
                              styles={customStyles}
                              name="roleName"
                              onChange={(option: any) => {
                                let event = {
                                  target: {
                                    name: "roleName",
                                    value: option,
                                  },
                                };
                                handleRoleStateChange(option);
                                handleChange(event);
                              }}
                            />
                            {errors.roleName && touched.roleName && (
                              <p className="form-error">{errors.roleName}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {values.isFullTime == "true" &&
                        values.isCurrentEmployment == "true" && (
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>Current Job Title</label>
                              <span style={{ color: "red" }}>*</span>
                              <AsyncCreatableSelect
                                className="dropstyle"
                                placeholder="Type Your Job Tilte"
                                cacheOptions
                                isValidNewOption={isValidNewOption}
                                noOptionsMessage={() =>
                                  "Enter keyword to search"
                                }
                                isClearable={true}
                                maxMenuHeight={200}
                                styles={customStyles}
                                name="currentDesignation"
                                value={values.currentDesignation}
                                onChange={(e: any) => {
                                  let event = {
                                    target: {
                                      name: "currentDesignation",
                                      value: e,
                                    },
                                  };
                                  setDesignt(e);
                                  setFieldValue("currentDesignation", e?.value);
                                  handleChange(event);
                                }}
                                loadOptions={promiseOptions4}
                              />{" "}
                              {errors.currentDesignation &&
                                touched.currentDesignation && (
                                  <p className="form-error">
                                    {errors.currentDesignation}
                                  </p>
                                )}
                            </div>
                          </div>
                        )}

                      {values.isFullTime == "true" &&
                        values.isCurrentEmployment == "false" && (
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>Previous Job Title</label>
                              <span style={{ color: "red" }}>*</span>
                              <AsyncCreatableSelect
                                maxMenuHeight={200}
                                className="dropstyle"
                                placeholder="Type Your Designation"
                                noOptionsMessage={() =>
                                  "Enter keyword to search"
                                }
                                cacheOptions
                                isValidNewOption={isValidNewOption}
                                isClearable={true}
                                name="previousDesignation"
                                value={values.previousDesignation}
                                onChange={(e: any) => {
                                  let event = {
                                    target: {
                                      name: "previousDesignation",
                                      value: e,
                                    },
                                  };
                                  setDesignt(e);
                                  setFieldValue("previousDesignation", e.value);
                                  handleChange(event);
                                }}
                                loadOptions={promiseOptions4}
                                onInputChange={handleInputChange}
                                inputValue={inputValue}
                              />
                              {errors.previousDesignation &&
                                touched.previousDesignation && (
                                  <p className="form-error">
                                    {errors.previousDesignation}
                                  </p>
                                )}
                            </div>
                          </div>
                        )}
                      {values.isFullTime == "true" && (
                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <label>Joining Date </label>
                            <span style={{ color: "red" }}>*</span>
                            <div className="row">
                              <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                <Select
                                  placeholder="Year"
                                  value={values.joiningDate_year}
                                  onBlur={handleBlur}
                                  name="joiningDate_year"
                                  onChange={(option: any) => {
                                    let event = {
                                      target: {
                                        name: "joiningDate_year",
                                        value: option,
                                      },
                                    };
                                    handleChange(event);
                                  }}
                                  isClearable={true}
                                  isSearchable={true}
                                  options={year}
                                  maxMenuHeight={200}
                                  className={"dropstyle"}
                                  styles={customStyles}
                                />
                                {errors.joiningDate_year &&
                                  touched.joiningDate_year && (
                                    <p className="form-error">
                                      {errors.joiningDate_year}
                                    </p>
                                  )}
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                <Select
                                  placeholder="Month"
                                  value={values.joiningDate_month}
                                  onBlur={handleBlur}
                                  name="joiningDate_month"
                                  onChange={(option: any) => {
                                    let event = {
                                      target: {
                                        name: "joiningDate_month",
                                        value: option,
                                      },
                                    };
                                    handleChange(event);
                                  }}
                                  isSearchable={true}
                                  isClearable={true}
                                  options={month}
                                  maxMenuHeight={200}
                                  className={"dropstyle"}
                                  styles={customStyles}
                                />
                                {errors.joiningDate_month &&
                                  touched.joiningDate_month && (
                                    <p className="form-error">
                                      {errors.joiningDate_month}
                                    </p>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {values.isFullTime == "false" && (
                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <label>Working From </label>
                            <span style={{ color: "red" }}>*</span>
                            <div className="row">
                              <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                <Select
                                  placeholder="Year"
                                  maxMenuHeight={200}
                                  value={values.workingFrom_year}
                                  name="workingFrom_year"
                                  onBlur={handleBlur}
                                  onChange={(option: any) => {
                                    let event = {
                                      target: {
                                        name: "workingFrom_year",
                                        value: option,
                                      },
                                    };
                                    handleChange(event);
                                    if (option == null) {
                                      setFieldValue("workingFrom_year", "");
                                    }
                                  }}
                                  isSearchable={true}
                                  isClearable={true}
                                  options={year}
                                  className={"dropstyle"}
                                  styles={customStyles}
                                />
                                {errors.workingFrom_year &&
                                  touched.workingFrom_year && (
                                    <p className="form-error">
                                      {errors.workingFrom_year}
                                    </p>
                                  )}
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                <Select
                                  placeholder="Month"
                                  value={values.workingFrom_month}
                                  maxMenuHeight={200}
                                  name="workingFrom_month"
                                  onChange={(option: any) => {
                                    let event = {
                                      target: {
                                        name: "workingFrom_month",
                                        value: option,
                                      },
                                    };
                                    handleChange(event);
                                  }}
                                  isSearchable={true}
                                  onBlur={handleBlur}
                                  isClearable={true}
                                  options={month}
                                  className={"dropstyle"}
                                  styles={customStyles}
                                />
                                {errors.workingFrom_month &&
                                  touched.workingFrom_month && (
                                    <p className="form-error">
                                      {errors.workingFrom_month}
                                    </p>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {values.isCurrentEmployment == "false" && (
                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <label>Working Till</label>
                            <span style={{ color: "red" }}>*</span>
                            <div className="row">
                              <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                <Select
                                  placeholder="Year"
                                  value={values.workingTill_year}
                                  name="workingTill_year"
                                  onBlur={handleBlur}
                                  maxMenuHeight={200}
                                  onChange={(option: any) => {
                                    let event = {
                                      target: {
                                        name: "workingTill_year",
                                        value: option,
                                      },
                                    };

                                    handleChange(event);
                                  }}
                                  isSearchable={true}
                                  isClearable={true}
                                  options={year}
                                  className={"dropstyle"}
                                />
                                {errors.workingTill_year &&
                                  touched.workingTill_year && (
                                    <p className="form-error">
                                      {errors.workingTill_year}
                                    </p>
                                  )}
                              </div>
                              <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                <Select
                                  maxMenuHeight={200}
                                  placeholder="Month"
                                  value={values.workingTill_month}
                                  name="workingTill_month"
                                  onChange={(option: any) => {
                                    let event = {
                                      target: {
                                        name: "workingTill_month",
                                        value: option,
                                      },
                                    };
                                    handleChange(event);
                                  }}
                                  isSearchable={true}
                                  onBlur={handleBlur}
                                  isClearable={true}
                                  options={month}
                                  className={"dropstyle"}
                                  styles={customStyles}
                                />
                                {errors.workingTill_month &&
                                  touched.workingTill_month && (
                                    <p className="form-error">
                                      {errors.workingTill_month}
                                    </p>
                                  )}
                              </div>
                              {errorData && (
                                <p className="form-error ml-3">
                                  {
                                    "Working Till must be greater than Working From."
                                  }
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {values.isCurrentEmployment == "true" &&
                        values.isFullTime == "true" && (
                          <>
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>Current Salary</label>
                                <span style={{ color: "red" }}>*</span>
                                <div className="row">
                                  <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                    <div className="custom-control custom-radio">
                                      <input
                                        type="radio"
                                        className="custom-control-input "
                                        id="usdollars"
                                        name="currency"
                                        value="USD"
                                        onChange={(e: any) => {
                                          handleChange(e);
                                          setTimeout(() => {
                                            ChangeSalary("en-US", sal);
                                            setInd(false);
                                            setUS(true);
                                          }, 0);
                                          setIscurrency("USD");
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
                                  <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                    <div className="custom-control custom-radio">
                                      <input
                                        type="radio"
                                        className="custom-control-input"
                                        id="rupees"
                                        name="currency"
                                        value="INR"
                                        onChange={(e: any) => {
                                          handleChange(e);
                                          setTimeout(() => {
                                            ChangeSalary("en-IN", sal);
                                            setInd(true);
                                            setUS(false);
                                          }, 0);
                                          setIscurrency("INR");
                                        }}
                                        checked={values.currency === "INR"}
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor="rupees"
                                      >
                                        Indian Rupees
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12">
                              <div className="form-group">
                                <div className="row">
                                  <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                    <input
                                      type="text"
                                      min={0}
                                      name="currentSalary"
                                      maxLength={11}
                                      onInput={(e: any) => {
                                        if (/^[0-9,]+$/.test(e.target.value)) {
                                          handleChange(e);
                                          handleSalaryChange(e);
                                          e.target.value = nf.format(
                                            e.target.value.replace(/\,/g, "")
                                          );

                                          setSal(e.target.value);
                                          values.currentSalary = e.target.value;
                                        } else if (
                                          e.target.value?.length === 0
                                        ) {
                                          setSal("");
                                          setSalary("");
                                          values.currentSalary = "";
                                        } else {
                                          setSalary("");
                                          setSal("");
                                        }
                                      }}
                                      className="form-control txtbx_css"
                                      placeholder="E.g. 4,50,000"
                                      value={sal != 0 ? sal : ""}
                                    />
                                    {errors.currentSalary &&
                                      touched.currentSalary && (
                                        <p className="form-error">
                                          {errors?.currentSalary}
                                        </p>
                                      )}
                                    {ind && salary !== 0 && sal != "" && (
                                      <p
                                        className="fs-6  text-success"
                                        style={{ fontSize: "80%" }}
                                      >
                                        {getRupeeText()
                                          ? getRupeeText() + " Rupees"
                                          : ""}
                                      </p>
                                    )}
                                    {us && salary !== 0 && sal != "" && (
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
                          </>
                        )}

                      {values.isFullTime == "false" && (
                        <>
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>Annual salary</label>
                              <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                  <div className="custom-control custom-radio">
                                    <input
                                      type="radio"
                                      className="custom-control-input "
                                      id="usdollars"
                                      name="currency"
                                      value="USD"
                                      onChange={(e: any) => {
                                        handleChange(e);
                                        setInd(false);
                                        setUS(true);
                                        setTimeout(() => {
                                          ChangeSalary("en-US", sal);
                                        }, 0);
                                        setIscurrency("USD");
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
                                <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                  <div className="custom-control custom-radio">
                                    <input
                                      type="radio"
                                      className="custom-control-input"
                                      id="rupees"
                                      name="currency"
                                      value="INR"
                                      onChange={(e: any) => {
                                        handleChange(e);
                                        setInd(true);
                                        setUS(false);
                                        setTimeout(() => {
                                          ChangeSalary("en-IN", sal);
                                        }, 0);
                                        setIscurrency("INR");
                                      }}
                                      checked={values.currency === "INR"}
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="rupees"
                                    >
                                      Indian Rupees
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-6 col-sm-12">
                            <div className="form-group">
                              <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-12 col-6">
                                  <input
                                    type="text"
                                    min={0}
                                    name="monthlyStipend"
                                    maxLength={6}
                                    onInput={(e: any) => {
                                      if (/^[0-9,]+$/.test(e.target.value)) {
                                        handleChange(e);
                                        handleSalaryChange(e);
                                        e.target.value = nf.format(
                                          e.target.value.replace(/\,/g, "")
                                        );

                                        setSal(e.target.value);
                                        values.monthlyStipend = e.target.value;
                                      } else if (e.target.value?.length == 0) {
                                        setSal("");
                                      }
                                    }}
                                    className="form-control txtbx_css"
                                    placeholder="Eg. 50,000"
                                    value={sal != 0 ? sal : ""}
                                  />
                                  {ind && salary !== 0 && (
                                    <p
                                      className="fs-6  text-success"
                                      style={{ fontSize: "80%" }}
                                    >
                                      {getRupeeText()
                                        ? getRupeeText() + " Rupees"
                                        : ""}
                                    </p>
                                  )}
                                  {us && salary !== 0 && (
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
                        </>
                      )}
                      {values.isCurrentEmployment == "true" &&
                        values.isFullTime == "true" && (
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>Skills used</label>
                              <span style={{ color: "red" }}>*</span>
                              <AsyncCreatableSelect
                                className="dropstyle"
                                placeholder="Select Skills Used"
                                cacheOptions
                                isValidNewOption={isValidNewOption}
                                noOptionsMessage={() =>
                                  "Enter keyword to search"
                                }
                                isClearable={true}
                                name="skillsUsed"
                                isMulti
                                value={values.skillsUsed}
                                onChange={(e: any) => {
                                  let event = {
                                    target: {
                                      name: "skillsUsed",
                                      value: e,
                                    },
                                  };
                                  setFieldValue("skillsUsed", e);
                                  handleSkillInput(e);
                                  // handleChangeInput(e);
                                  handleChange(event);
                                }}
                                defaultOptions
                                onInputChange={handleInputChange}
                                loadOptions={debounceOptions}
                                inputValue={inputValue}
                              />
                              <span
                                className=""
                                style={{
                                  display: "inline-block",
                                  fontSize: "0.85em",
                                  color: "grey",
                                }}
                              >
                                {500 - skillsCount} Character(s) left
                              </span>
                              {errors.skillsUsed && touched.skillsUsed && (
                                <p className="form-error">
                                  {errors.skillsUsed?.toString()}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      {values.isCurrentEmployment == "true" &&
                        values.isFullTime == "true" && (
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>Notice Period</label>
                              <span style={{ color: "red" }}>*</span>

                              <Select
                                maxMenuHeight={200}
                                placeholder="Select notice period"
                                value={values.noticePeriod}
                                menuPlacement="top"
                                onBlur={handleBlur}
                                name="noticePeriod"
                                isClearable={true}
                                onChange={(option: any) => {
                                  let event = {
                                    target: {
                                      name: "noticePeriod",
                                      value: option,
                                    },
                                  };
                                  handleChange(event);
                                }}
                                isSearchable={true}
                                options={notice}
                                className={"dropstyle"}
                                styles={customStyles}
                              />
                              {errors.noticePeriod && touched.noticePeriod && (
                                <p className="form-error">
                                  {errors.noticePeriod}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      {values.noticePeriod?.label === "Serving Notice Period" &&
                        values.isCurrentEmployment == "true" &&
                        values.isFullTime == "true" && (
                          <NoticePeriod
                            formikValue={values}
                            formikblur={handleBlur}
                            formikField={setFieldValue}
                            formikerror={errors}
                            formiktouched={touched}
                            formikChange={handleChange}
                          />
                        )}
                    </div>
                  </div>
                  <div className="modal-custom-footer">
                    <button
                      type="submit"
                      className="site-button"
                      style={{ zIndex: "unset" }}
                    >
                      {loading && (
                        <i
                          className="fa fa-circle-o-notch fa-spin"
                          style={{
                            marginRight: "10px",
                          }}
                        ></i>
                      )}
                      {loading ? "Saving..." : "Save and Continue"}
                    </button>
                  </div>
                </Form>
              </div>
            </div>
          </>
        );
      }}
    </Formik>
  );
}

export default Employment;
