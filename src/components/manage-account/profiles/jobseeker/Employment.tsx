import { useCallback, useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import NoticePeriod from "./NoticePeriod";
import numberToWords from "number-to-words";
import { Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import numWords from "num-words";
import Select from "react-select";
import Swal from "sweetalert2";
import {
  GetMonthNameFromTimeStamp,
  GetYearFromTimeStamp,
  customStyles,
} from "../../../../common/common";
import { useDispatch, useSelector } from "react-redux";
import { UseToastAlert } from "../../../../hooks/useToastAlert";
import {
  deleteEmployement,
  resetDeleteEmployement,
  updateEmployementDetails,
} from "../../../../redux/features/manage-account/profile/EmploymentSlice";
import { getJobSeekerrData } from "../../../../redux/features/manage-account/profile/JsSlice";
import { BsPencil } from "react-icons/bs";
import { environment } from "../../../../environments/environment";
import AsyncCreatableSelect from "react-select/async-creatable";
import {
  RollCategoryMasterData,
  RollMasterData,
  skillsMasterData,
} from "../../../../ApiCall/masterData";
import { profileStrength } from "../../../../redux/features/manage-account/profile/BasicDetailsSlice";
import { regex } from "../../../../common/validation";
import { debounce } from "lodash";

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
  fresher: boolean;
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

function Employment({ displayModel, trigger }: propsState) {
  const JobSeekerProfileData = useSelector(
    (state: any) => state.JobSeekerProfile2
  );

  const { JobSeekerProfile, loading } = JobSeekerProfileData;
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
  const [editvalue, setEditvalue] = useState<
    employmentType | undefined | null
  >();
  const [employment, setEmployment] = useState(false);
  const [hideContect, setHideContent] = useState(true);
  const [hideModel, setHideModel] = useState(true);
  const handleHideEmployment = () => {
    setEmployment(false);
  };

  const employerProfileDetail = useSelector(
    (state: any) => state.employmentDetail
  );
  const { employmentDetails: employmentDetails, loading1 } =
    employerProfileDetail;
  const dispatch = useDispatch();
  const department_master_data = useSelector(
    (state: any) => state.departmentdata
  );

  const showSnackAlert = UseToastAlert();

  useEffect(() => {
    if (employmentDetails.message) {
      if (!loading1 && employmentDetails.code === 200) {
        showSnackAlert("success", employmentDetails.message);

        dispatch(getJobSeekerrData());
        dispatch(profileStrength());
      }
      if (!loading1 && employmentDetails.code === 206) {
        showSnackAlert("warning", employmentDetails.message);
      }
    }
  }, [employmentDetails?.code, loading1]);

  useEffect(() => {
    if (!loading) {
      departmentmasterdata(department_master_data?.DepartmentData);
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

  useEffect(() => {
    if (displayModel) {
      setHideContent(false);
      setHideModel(true);
      setEmployment(true);
    } else {
      setHideContent(true);
      setHideModel(true);
    }
    setTimeout(() => {
      editRef?.current?.click();
    }, 0);
  }, [displayModel]);

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

  const handleReactSelect = () => {
    setSal("");
  };

  useEffect(() => {
    if (editvalue) {
      setCurrencyvalue(editvalue.currency == "USD" ? "en-US" : "en-IN");
      setsalaryfunction();
    }
    setFresh(false);
  }, [editvalue]);

  const [serivice, setService] = useState("true");

  const handleDeleteEmployement = (values: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, You will not be able to recover this Record!",
      showCancelButton: true,
      confirmButtonColor: "#2a9f2a ",
      cancelButtonColor: "#db1919 ",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteEmployement(values));
        setEmployment(false);
        setEditvalue(null);
        handleReactSelect();
      }
    });
  };
  const deleteEmployementDetails = useSelector(
    (state: any) => state.deleteEmploymentDetail
  );
  const { deleteEmpl, deleteEmplLoading } = deleteEmployementDetails;
  useEffect(() => {
    if (deleteEmpl.message) {
      if (!deleteEmplLoading && deleteEmpl.code === 200) {
        showSnackAlert("success", deleteEmpl.message);
        dispatch(profileStrength());
        dispatch(getJobSeekerrData());
      }
      if (!deleteEmplLoading && deleteEmpl.code === 206) {
        showSnackAlert("warning", employmentDetails.message);
      }

      dispatch(resetDeleteEmployement());
    }
  }, [deleteEmpl?.code, deleteEmplLoading]);
  const GetDateFromTimeStamp = (timeStamp: number): number => {
    return new Date(timeStamp * 1000).getDate();
  };

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleClick = () => {
    setTimeout(() => {
      if (textareaRef?.current) {
        textareaRef?.current?.focus();
        const el = document.querySelector<HTMLTextAreaElement>("descri");
        el?.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
        el?.focus();
      }
    }, 500);
  };

  const [sal, setSal] = useState<any>("");

  const handleEditValue = (c: any) => {
    const employmentValues: any = {
      isCurrentEmployment: c?.work_till ? "false" : "true",
      isFullTime: c?.internship.dept ? "false" : "true",
      location: c?.internship?.location
        ? { label: c?.internship?.location, value: c?.internship?.location }
        : null,
      department: c?.internship?.dept
        ? { label: c?.internship?.dept, value: c?.internship?.dept }
        : null,
      roleCategory: c?.internship?.category
        ? { label: c?.internship?.category, value: c?.internship?.category }
        : null,
      roleName: c?.internship
        ? { label: c?.internship?.role, value: c?.internship?.role }
        : null,
      skillsUsed: c?.fulltime?.skill
        ? c?.fulltime?.skill.map((val: any) => {
            return { label: val, value: val };
          })
        : [],
      workingFrom_year: c?.internship
        ? {
            label: GetYearFromTimeStamp(c.join_date).toString(),
            value: GetYearFromTimeStamp(c.join_date).toString(),
          }
        : "",
      workingFrom_month: c?.internship
        ? {
            label: GetMonthNameFromTimeStamp(c.join_date, false),
            value: GetMonthNameFromTimeStamp(c.join_date, false, true),
          }
        : "",
      workingTill_year: c?.work_till
        ? {
            label: GetYearFromTimeStamp(c.work_till).toString(),
            value: GetYearFromTimeStamp(c.work_till).toString(),
          }
        : "",
      workingTill_month: c?.work_till
        ? {
            label: GetMonthNameFromTimeStamp(c.work_till, false),
            value: GetMonthNameFromTimeStamp(c.work_till, false, true),
          }
        : "",
      joiningDate_year: c?.join_date
        ? {
            label: GetYearFromTimeStamp(c.join_date).toString(),
            value: GetYearFromTimeStamp(c.join_date).toString(),
          }
        : "",
      joiningDate_month: c?.join_date
        ? {
            label: GetMonthNameFromTimeStamp(c.join_date, false),
            value: GetMonthNameFromTimeStamp(c.join_date, false, true),
          }
        : "",

      monthlyStipend: c?.internship ? c?.ctc?.value : 0,
      currency: c?.ctc?.currency ? c?.ctc?.currency : "INR",
      jobProfileDesc: c?.fulltime?.job_desc ? c?.fulltime?.job_desc : "",
      noticePeriod: c?.fulltime?.notice_period.term
        ? {
            label: c?.fulltime?.notice_period.term,
            value: c?.fulltime?.notice_period.term,
          }
        : "",
      expectedLastWorkingDay_year: c?.fulltime?.notice_period.end_ts
        ? GetYearFromTimeStamp(c?.fulltime?.notice_period.end_ts).toString()
        : "",
      expectedLastWorkingDay_month: c?.fulltime?.notice_period.end_ts
        ? GetMonthNameFromTimeStamp(
            c?.fulltime?.notice_period.end_ts,
            false
          ).toString()
        : "",
      expectedLastWorkingDay_day: c?.fulltime?.notice_period.end_ts
        ? GetDateFromTimeStamp(c?.fulltime?.notice_period?.end_ts)
        : "",
      offeredSalary: c?.fulltime?.notice_period.offered_ctc.value
        ? c?.fulltime?.notice_period.offered_ctc.value
        : "",
      offeredCurrency: c?.fulltime?.notice_period.offered_ctc.currency
        ? c?.fulltime?.notice_period.offered_ctc.currency
        : "INR",
      offeredDesg: c?.fulltime?.notice_period.offered_role
        ? {
            label: c?.fulltime?.notice_period.offered_role,
            value: c?.fulltime?.notice_period.offered_role,
          }
        : "",
      nextEmployer: c?.fulltime?.notice_period.company
        ? {
            label: c?.fulltime?.notice_period.company,
            value: c?.fulltime?.notice_period.company,
          }
        : "",
      projectlink: c?.internship?.project?.uri
        ? c?.internship?.project?.uri
        : "",
      id: c._id,
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
    };
    employmentValues.currentCompanyName =
      employmentValues.isCurrentEmployment == "true"
        ? { label: c.company, value: c.company }
        : null;
    employmentValues.currentDesignation =
      employmentValues.isCurrentEmployment == "true" &&
      employmentValues.isFullTime == "true"
        ? { label: c?.fulltime?.role, value: c?.fulltime?.role }
        : "";
    employmentValues.previousCompanyName =
      employmentValues.isCurrentEmployment == "false"
        ? { label: c.company, value: c.company }
        : null;
    employmentValues.previousDesignation =
      employmentValues.isCurrentEmployment == "false" &&
      employmentValues.isFullTime == "true"
        ? { label: c?.fulltime?.role, value: c?.fulltime?.role }
        : "";
    if (employmentValues.isFullTime === "false")
      employmentValues.jobProfileDesc = c?.internship?.project.desc;
    if (
      c?.work_till === null &&
      JobSeekerProfile?.js_profile?.career_profile?.total_exp?.curr_ctc
    )
      employmentValues.currentSalary =
        JobSeekerProfile?.js_profile?.career_profile?.total_exp?.curr_ctc?.value;
    else employmentValues.currentSalary = "";
    if (employmentValues.isCurrentEmployment == "false") {
      employmentValues.noticePeriod = null;
    }
    handleMonthOfExp(employmentValues?.experienceYear?.label);
    handleMonthOfExp(employmentValues?.experienceMonth?.label);
    setEditvalue(employmentValues);
    if (employmentValues.jobProfileDesc) {
      setCount(employmentValues.jobProfileDesc.length);
    } else {
      setCount(0);
    }
  };
  const currentSalaryFn = () => {
    if (totalexpSal) {
      totalexpSal ? setSal(nf.format(Number(totalexpSal))) : setSal("");
    }
  };
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
      diffInMonth = Number(momentdiffInMonths % 12);

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

  const [salary, setSalary] = useState<any>(null);
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
    const convertedSalary = `${numberToWords.toWords(salary).toLowerCase()}`;
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
    trigger && trigger(false);
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
  // const [skillsUsed, setSkillsUsed] = useState<any>();
  let countNumber: any = 0;

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
  // const filterColors = (inputValue: string) => {
  //   return skillMeta.filter((i) => i.label?.toLowerCase().includes(inputValue?.toLowerCase()));
  // };
  // const promiseOptions = (inputValue: string) =>
  //   new Promise<selectType[]>((resolve) => {
  //     setTimeout(() => {
  //       resolve(filterColors(inputValue));
  //     }, 1000);
  //   });
  /*designation master data */
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

  /* comapny master data */
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
    if (displayModel) {
      setHideContent(false);
      setHideModel(true);
    } else {
      setHideContent(true);
      setHideModel(true);
    }
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
  }, [displayModel, JobSeekerProfile]);

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
  const [inputValueskill, setInputValueskill] = useState("");
  const [companyInputValue, setCompanyInputValue] = useState("");
  const [locationInputValue, setLocationInputValue] = useState("");

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue.replace(/[^a-zA-Z0-9-.',:!()&+#/>\s]*$/, ""));
  };
  const handleSKillInput = (newValue: string) => {
    setInputValueskill(newValue.replace(/[^a-zA-Z0-9-.',:!()&+#/>\s]*$/, ""));
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

        dispatch(updateEmployementDetails(data));
        // cancelBtnRef?.current.click();
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
            {displayModel && (
              <button
                ref={editRef}
                className="d-none"
                onClick={(e: any) => {
                  if (empData.length > 0) {
                    handleEditValue(empData[0]);
                    setEmployment(true);
                  } else {
                    setEmployment(true);
                  }
                }}
              ></button>
            )}
            {hideContect && (
              <div id="employment_bx" className="job-bx bg-white m-b30 ">
                <div className="d-flex">
                  <h5 className="m-b15">
                    Employment
                    <span className="font-14">
                      {pflStrength?.pflStrnRes?.data?.profileWeightage &&
                      fresh !== true
                        ? `(${
                            Number(
                              pflStrength?.pflStrnRes?.data?.profileWeightage
                                ?.designation
                            ) +
                            Number(
                              pflStrength?.pflStrnRes?.data?.profileWeightage
                                ?.job_profile
                            )
                          }%)`
                        : ""}
                    </span>
                  </h5>
                  {JobSeekerProfile?.js_profile?.employments?.length <
                    Number(
                      environment.Jobseeker_Profile_Data_Limits
                        .employement_limit
                    ) && (
                    <button
                      onClick={() => {
                        setEmployment(true);
                        setCount(0);
                        setService("true");
                        setIscurr("true");

                        setSkillsCount(0);
                        // setYearChangeYearExp("");
                        // setMonthChangeYearExp("");
                      }}
                      className="site-button add-btn button-sm"
                    >
                      Add
                    </button>
                  )}
                </div>
                {JobSeekerProfile?.js_profile?.employments &&
                JobSeekerProfile?.js_profile?.employments?.length ? (
                  ""
                ) : (
                  <p className="c_content_desc">
                    {" "}
                    Mention your employment details including your current and
                    previous company work experience.{" "}
                  </p>
                )}
                {!loading && JobSeekerProfile?.js_profile?.employments
                  ? JobSeekerProfile?.js_profile?.employments?.map((c: any) => {
                      const exp = handleExperience(c.join_date, c.work_till);

                      return (
                        <div className="d-flex flex-column mb-2 text-break text-justify ">
                          <h6 className="c_content_subheader ">
                            {c.fulltime?.role && <b>{c.fulltime.role}</b>}
                            {c.internship?.role && <b>{c.internship.role}</b>}
                            <Link
                              to={"#"}
                              title="Click here to add and remove employment"
                              className="edit-icon"
                              data-toggle="modal"
                              data-target="#patent"
                              onClick={(e) => {
                                e.preventDefault();
                                handleEditValue(c);
                                bindSelectControlValues(c);
                                setEmployment(true);
                              }}
                            >
                              <BsPencil />
                            </Link>
                          </h6>
                          <span className="c_content_details ">
                            {c.company}
                          </span>
                          {c.work_till ? (
                            <span className="c_content_details">{`${
                              c?.fulltime?.role ? "FullTime" : "Internship"
                            }.${GetYearFromTimeStamp(
                              c.join_date
                            )} ${GetMonthNameFromTimeStamp(
                              c.join_date,
                              true
                            )} to ${GetYearFromTimeStamp(
                              c.work_till
                            )} ${GetMonthNameFromTimeStamp(
                              c.work_till,
                              true
                            )}  (${exp})`}</span>
                          ) : (
                            <span className="c_content_details">{`${
                              c.fulltime?.role ? "Full-Time: " : "Internship: "
                            } ${GetYearFromTimeStamp(
                              c.join_date
                            )} ${GetMonthNameFromTimeStamp(
                              c.join_date,
                              true
                            )} to Present  (${exp})`}</span>
                          )}

                          {c?.fulltime?.notice_period?.term ? (
                            <span className="c_content_details ">
                              {" "}
                              <span>{`${
                                c?.fulltime?.notice_period?.term !== notice[5]
                                  ? `Notice Period: ${c?.fulltime?.notice_period?.term}`
                                  : `${c?.fulltime?.notice_period?.term}`
                              }`}</span>
                            </span>
                          ) : (
                            ""
                          )}
                          {c?.fulltime?.job_desc ? (
                            <span className="c_content_details ">
                              {c?.fulltime?.job_desc}
                            </span>
                          ) : (
                            ""
                          )}
                          {c?.fulltime?.skills?.length > 0 ? (
                            <div>
                              <span className="c_content_details">
                                <b>Top 5 Key Skill:</b>
                              </span>
                              {c?.fulltime?.skills.map(
                                (e: any, index: number) => {
                                  if (index === 0) {
                                    return (
                                      <span className="c_content_details">
                                        {e}
                                      </span>
                                    );
                                  } else {
                                    return (
                                      <span className="c_content_details">
                                        &nbsp;,&nbsp;{e}
                                      </span>
                                    );
                                  }
                                }
                              )}
                              {!c?.fulltime?.job_desc && (
                                <h6>
                                  {" "}
                                  <Link
                                    to={"#"}
                                    data-toggle="modal"
                                    data-target="#patent"
                                    style={{ color: "blue" }}
                                    onClick={() => {
                                      handleEditValue(c);
                                      setEmployment(true);
                                      handleClick();
                                    }}
                                  >
                                    Add Job Profile
                                  </Link>
                                </h6>
                              )}
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      );
                    })
                  : ""}
              </div>
            )}
            {hideModel && (
              <Modal
                show={employment}
                backdrop="static"
                onHide={() => {
                  handleHideEmployment();
                  setEditvalue(null);
                  handleReactSelect();
                  resetForm();
                  trigger && trigger(false);
                }}
                className="modal fade browse-job modal-bx-info editor"
              >
                <div className="modal-dialog my-0" role="document">
                  <div className="modal-content">
                    <Form onSubmit={handleSubmit}>
                      <div className="modal-body">
                        <div className="modal-custom-header">
                          <h5
                            className="modal-title text-truncate text-ellipsis"
                            id="EmploymentModalLongTitle"
                          >
                            {editvalue ? (
                              <span
                                title={`${
                                  editvalue.currentDesignation
                                    ? editvalue.currentDesignation
                                    : editvalue.previousDesignation
                                }`}
                              >
                                Edit -
                                {editvalue.isFullTime == "true" &&
                                editvalue.currentDesignation?.label
                                  ? editvalue.currentDesignation?.label
                                  : editvalue.isFullTime == "true" &&
                                    editvalue.previousDesignation?.label
                                  ? editvalue.previousDesignation?.label
                                  : editvalue.isFullTime == "false"
                                  ? editvalue.roleName?.label
                                  : ""}
                              </span>
                            ) : (
                              `Add Employment`
                            )}
                          </h5>
                          {editvalue && (
                            <button
                              className="btn btn-sm btn-danger d-block d-md-inline-block mr-md-2 mb-2 mb-md-0 ml-auto"
                              type="button"
                              title="Delete"
                              onClick={() => {
                                handleDeleteEmployement(values.id);
                              }}
                            >
                              Delete
                            </button>
                          )}
                          <button
                            type="button"
                            className="close"
                            title="Close"
                            onClick={() => {
                              setEditvalue(null);
                              handleReactSelect();
                              setEmployment(false);
                              resetForm();
                              setDepartmentState(null);
                              setRoleCategoryMeta(null);
                              setRoleState(null);
                              trigger && trigger(false);
                              if (
                                JobSeekerProfile?.js_profile?.career_profile
                                  ?.total_exp?.curr_ctc?.currency == "USD"
                              ) {
                                setInd(false);
                                setUS(true);
                              } else {
                                setInd(true);
                                setUS(false);
                              }
                            }}
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>

                        <div className="row">
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>Is this your current employment?</label>
                              <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                  <div className="custom-control custom-radio">
                                    <input
                                      type="radio"
                                      name="isCurrentEmployment"
                                      checked={
                                        values.isCurrentEmployment == "true"
                                      }
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
                                            setFieldValue(
                                              "currency",
                                              totalexpCurr
                                            );
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
                                        setFieldValue(
                                          "workingTill_month",
                                          null
                                        );
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
                                            setFieldValue(
                                              "currency",
                                              totalexpCurr
                                            );
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
                              {editvalue ? (
                                <h6
                                  style={{
                                    color: "#666",
                                  }}
                                >
                                  {values.isFullTime == "true"
                                    ? "Fulltime"
                                    : "Internship"}
                                </h6>
                              ) : (
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
                              )}
                            </div>
                          </div>

                          {values.isCurrentEmployment == "true" &&
                            values.isFullTime == "true" && (
                              <div className="col-lg-12 col-md-12">
                                <div className="form-group">
                                  <label>Experience</label>
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
                            <div className="col-lg-12 col-md-12 col-xs-12">
                              <div className="form-group ">
                                {values.isCurrentEmployment === "true" ? (
                                  <label>Current Company Name</label>
                                ) : (
                                  <label>Previous Company Name</label>
                                )}
                                <span style={{ color: "red" }}>*</span>
                                <AsyncCreatableSelect
                                  className="dropstyle"
                                  placeholder="Type Your Organization"
                                  cacheOptions
                                  noOptionsMessage={() =>
                                    "Enter keyword to search"
                                  }
                                  styles={customStyles}
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
                                  placeholder="Type Your Organization"
                                  noOptionsMessage={() =>
                                    "Enter keyword to search"
                                  }
                                  cacheOptions
                                  isValidNewOption={isValidNewOption}
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
                                  noOptionsMessage={() =>
                                    "Enter keyword to search"
                                  }
                                  cacheOptions
                                  isValidNewOption={isValidNewOption}
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
                                  <p className="form-error">
                                    {errors.location}
                                  </p>
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
                                    setRoleCategoryState(null);
                                    setRoleState(null);
                                  }}
                                />
                                {errors.department && touched.department && (
                                  <p className="form-error">
                                    {errors.department}
                                  </p>
                                )}
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                          {values.isFullTime == "false" &&
                          departmentState?.label ? (
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

                                {errors.roleCategory &&
                                  touched.roleCategory && (
                                    <p className="form-error">
                                      {errors.roleCategory}
                                    </p>
                                  )}
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                          {values.isFullTime == "false" &&
                          roleCategoryState?.label ? (
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
                                {/* <Select
                                  placeholder="Select role"
                                  value={roleList}
                                  name="roleName"
                                  isClearable={true}
                                  onChange={(option: any) => {
                                    handleRoleList(option);

                                    setFieldValue("roleName", option?.label);
                                    if (option == null) {
                                      setFieldValue("roleName", "");
                                    }
                                  }}
                                  isSearchable={true}
                                  options={roleData}
                                  className={"dropstyle"}
                                /> */}
                                {/* <AsyncCreatableSelect
                                  placeholder="Select role"
                                  cacheOptions
                                  isClearable={true}
                                  name="roleName"
                                  value={roleList}
                                  onChange={(e: any) => {
                                    let event = {
                                      target: {
                                        name: "roleName",
                                        value: e,
                                      },
                                    };
                                    setRoleList(e);
                                    setFieldValue("roleName", e.value);
                                     handleChange(event);
                                  }}
                                  defaultOptions
                                  loadOptions={promiseOptions4}
                                /> */}
                                {errors.roleName && touched.roleName && (
                                  <p className="form-error">
                                    {errors.roleName}
                                  </p>
                                )}
                              </div>
                            </div>
                          ) : (
                            ""
                          )}

                          {values.isFullTime == "true" &&
                            values.isCurrentEmployment == "true" && (
                              <div className="col-lg-12 col-md-12">
                                <div className="form-group">
                                  <label>Current Designation</label>
                                  <span style={{ color: "red" }}>*</span>
                                  {/* <input
                                    type="text"
                                    className="form-control"
                                    maxLength={150}
                                    onBlur={handleBlur}
                                    name="currentDesignation"
                                    onChange={handleChange}
                                    value={values.currentDesignation}
                                    placeholder="Type Your Designation"
                                  /> */}
                                  <AsyncCreatableSelect
                                    className="dropstyle"
                                    placeholder="Type Your Designation"
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

                                      setFieldValue(
                                        "currentDesignation",
                                        e?.value
                                      );
                                      handleChange(event);
                                    }}
                                    loadOptions={promiseOptions4}
                                    onInputChange={handleInputChange}
                                    inputValue={inputValue}
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
                                  <label>Previous Designation</label>
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

                                      setFieldValue(
                                        "previousDesignation",
                                        e.value
                                      );
                                      handleChange(event);
                                    }}
                                    loadOptions={promiseOptions4}
                                    onInputChange={handleInputChange}
                                    inputValue={inputValue}
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
                                  <label>Previous Designation</label>
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

                                      setFieldValue(
                                        "previousDesignation",
                                        e.value
                                      );
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
                                        "Working Till must be greater than Joining Date."
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
                                <div className="col-lg-12 col-md-6">
                                  <div className="form-group">
                                    <div className="row">
                                      <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                        <input
                                          type="text"
                                          min={0}
                                          name="currentSalary"
                                          maxLength={11}
                                          onInput={(e: any) => {
                                            if (
                                              /^[0-9,]+$/.test(e.target.value)
                                            ) {
                                              handleChange(e);
                                              handleSalaryChange(e);
                                              e.target.value = nf.format(
                                                e.target.value.replace(
                                                  /\,/g,
                                                  ""
                                                )
                                              );

                                              setSal(e.target.value);
                                              values.currentSalary =
                                                e.target.value;
                                            } else if (
                                              e.target.value?.length == 0
                                            ) {
                                              setSal("");
                                            }
                                          }}
                                          className="form-control"
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
                                  <label>Monthly Stipend</label>
                                  <div className="row">
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
                              <div className="col-lg-12 col-md-6">
                                <div className="form-group">
                                  <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                      <input
                                        type="text"
                                        min={0}
                                        name="monthlyStipend"
                                        maxLength={6}
                                        onInput={(e: any) => {
                                          if (
                                            /^[0-9,]+$/.test(e.target.value)
                                          ) {
                                            handleChange(e);
                                            handleSalaryChange(e);
                                            e.target.value = nf.format(
                                              e.target.value.replace(/\,/g, "")
                                            );

                                            setSal(e.target.value);
                                            values.monthlyStipend =
                                              e.target.value;
                                          } else if (
                                            e.target.value?.length == 0
                                          ) {
                                            setSal("");
                                          }
                                        }}
                                        className="form-control"
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
                                      // handleSkillInput(e);
                                      handleChangeInput(e);
                                      handleChange(event);
                                    }}
                                    defaultOptions
                                    onInputChange={handleSKillInput}
                                    loadOptions={debounceOptions}
                                    inputValue={inputValueskill}
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
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>Describe your Job Profile</label>
                              <textarea
                                className="form-control"
                                ref={textareaRef}
                                name="jobProfileDesc"
                                id="descri"
                                value={values.jobProfileDesc}
                                onChange={(e) => {
                                  handleChange(e);
                                  setCount(e.target.value.length);
                                }}
                                maxLength={4000}
                                style={{ resize: "none" }}
                                placeholder="Type Description"
                              ></textarea>
                              <span className="custom-char-count">
                                {4000 - count} Character(s) left
                              </span>
                            </div>
                          </div>
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
                                  {errors.noticePeriod &&
                                    touched.noticePeriod && (
                                      <p className="form-error">
                                        {errors.noticePeriod}
                                      </p>
                                    )}
                                </div>
                              </div>
                            )}
                          {values.noticePeriod?.label ===
                            "Serving Notice Period" &&
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
                        {values.isFullTime == "false" && (
                          <div className="form-group">
                            <label>Project Link</label>
                            <input
                              type="text"
                              className="form-control"
                              name="projectlink"
                              value={values.projectlink}
                              onChange={handleChange}
                              placeholder="Type Your Project Link"
                            />
                            {errors.projectlink && touched.projectlink && (
                              <p className="form-error">{errors.projectlink}</p>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="modal-custom-footer">
                        <button
                          type="button"
                          className="site-button site-warning-button"
                          ref={cancelBtnRef}
                          onClick={() => {
                            resetForm();
                            fnResetModal();
                            setDepartmentState(null);
                            setRoleCategoryMeta(null);
                            setRoleState(null);
                          }}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="site-button">
                          Save
                        </button>
                      </div>
                    </Form>
                  </div>
                </div>
              </Modal>
            )}
          </>
        );
      }}
    </Formik>
  );
}

export default Employment;
