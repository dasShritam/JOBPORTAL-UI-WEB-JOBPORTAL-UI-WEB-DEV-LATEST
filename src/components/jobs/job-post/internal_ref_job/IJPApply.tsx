import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  certificateNameMasterData,
  skillsMasterData,
  specializationMasterData,
} from "../../../../ApiCall/masterData";
import { debounce } from "lodash";
import AsyncCreatableSelect from "react-select/async-creatable";
import { components } from "react-select";
import { Formik } from "formik";
import * as Yup from "yup";
import { DesignationMasterData } from "../../../../redux/features/masterData/DesignationSlice";
import { LocationcityMasterData } from "../../../../redux/features/masterData/LocationcitySlice";
import Select from "react-select";
import {
  bytesToMegabytes,
  createData,
  createDataWithId,
  customStyles,
} from "../../../../common/common";
import { regex } from "../../../../common/validation";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Slider from "@mui/material/Slider";
import { getYearMonth } from "../../../../redux/features/masterData/YearMonthSlice";
import numWords from "num-words";
import numberToWords from "number-to-words";
import { jobSeekerProfileMasterData } from "../../../../redux/features/masterData/MasterDataInfoSlice";
import CreatableSelect from "react-select/creatable";
import {
  DatePicker,
  LocalizationProvider,
  MobileTimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo/DemoContainer";
import { BsCloudDownload, BsCloudUpload } from "react-icons/bs";
import { UseToastAlert } from "../../../../hooks/useToastAlert";
import { environment } from "../../../../environments/environment";
import { IoCloseCircleOutline } from "react-icons/io5";
import {
  resetsendotpAction,
  sendOtp,
} from "../../../../redux/features/authentication/sendOtpSlice";
import { Modal } from "react-bootstrap";
import { resetVerifyOtpSl } from "../../../../redux/features/authentication/jobseekerVerifyOtpSlice";
import { verifyOtp } from "../../../../redux/features/authentication/verifyOtpSlice";
import {
  PostIntJobApply,
  fetchIjpRjpInfo,
  fetchValidInternalJob,
  postIntApplication,
  resetIntJobApply,
} from "../../../../redux/features/jobs/apply-job/apply-Inr-job/Apply-Internal-JobSlice";
import "../../../../assets/customCss/jobs/internalJob.css";
let logo = require("../../../../assets/images/Techkri-logo-blue.png");

const reloactionOpt = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

interface CertificateNameOption {
  label: string;
  value: string;
}

interface option {
  label: string;
  value: string;
}

function IJPApply() {
  const paramId = useParams().id;
  const [dispReferal, setDispReferal] = useState(true);
  const [appliedDiv, setAppliedDiv] = useState(false);
  const [fetchJobErr, setFetchJobErr] = useState(false);
  const snackAlert = UseToastAlert();

  const fetchIjpRjp = useSelector((state: any) => state.FetchIJPRJP);
  const { fetchJobRes, fetchJobLoading } = fetchIjpRjp;
  const navigate = useNavigate();

  useEffect(() => {
    if (paramId) {
      dispatch(fetchIjpRjpInfo(paramId));
    }
  }, [paramId]);
  useEffect(() => {
    if (fetchJobRes[0]?.job_type === "INTERNAL JOB") {
      setDispReferal(false);
    } else {
      setDispReferal(true);
    }
    if (
      fetchJobRes &&
      !fetchJobLoading &&
      fetchJobRes?.response?.data?.code === 400
    ) {
      snackAlert("warning", "Bad Request");
    } else if (
      fetchJobRes &&
      !fetchJobLoading &&
      fetchJobRes?.response?.data?.code === 500
    ) {
      snackAlert("warning", fetchJobRes?.message);
    }
  }, [!fetchJobErr, fetchJobRes, dispReferal]);

  //#region validation schema
  const validateSchema = Yup.object().shape({
    candidateName: Yup.string()
      .nullable()
      .required("Please enter Candidate Name.")
      .matches(
        regex.fullName,
        "Numeric and special characters are not allowed."
      )
      .trim("Empty space not allowed.")
      .min(1, "Full Name must contains minimum 1 characters."),
    employeeId: Yup.string().notRequired().nullable(),

    emailId: Yup.string()
      .nullable()
      .required("Please enter Candidate Email-Id.")
      .matches(regex.email, "Please enter Valid Candidate Email-Id."),
    role: Yup.object().required("Please select Current Role.").nullable(),
    location: Yup.object()
      .required("Please specify Current Location.")
      .nullable(),
    relocation: Yup.object().required("Please specify Relocation.").nullable(),

    salaries: Yup.string().required("Please enter Salary.").nullable(),
    keySkills: Yup.array().required("Please enter some Key Skills.").nullable(),
    experienceYear: Yup.object()
      .required("Please specify Experience Years.")
      .nullable(),
    experienceMonth: Yup.object()
      .required("Please specify Experience Months.")
      .nullable(),
    education: Yup.object().required("Please specify Education.").nullable(),
    course: Yup.object()
      .when("education", {
        is: (education: option) =>
          (education !== null && !eduData.includes(education?.label)) ||
          education === null,
        then: Yup.object().required("Please specify Course.").nullable(),
      })
      .nullable(),

    specialization: Yup.object().when("education", {
      is: (education: option) =>
        (education !== null && !eduData.includes(education?.label)) ||
        education === null,
      then: Yup.object()
        .nullable()
        .required("Please specify Specialization.")
        .nullable(),
    }),

    certification: Yup.array().notRequired().nullable(),
    availabilityDate: Yup.object()
      .required("Please select Availability Date.")
      .nullable(),
    availabilityTime: Yup.string()
      .required("Please select Availbility Time.")
      .nullable(),
    reason: Yup.string().required("Please enter Reason for Apply.").nullable(),
    resume: Yup.string().required("Please upload Resume.").nullable(),

    referalId:
      fetchJobRes[0]?.job_type === "REFERRAL JOB"
        ? Yup.string()
            .required("Please enter Employee Referal Id.")
            .matches(
              regex.empIdRegex,
              "Please enter Valid Referal Employee Id."
            )
            .nullable()
        : Yup.string().notRequired().nullable(),

    referalName:
      fetchJobRes[0]?.job_type === "REFERRAL JOB"
        ? Yup.string()
            .required("Please enter Employee Referal Name.")
            .matches(
              regex.empIdRegex,
              "Please enter Valid Referal Employee Name."
            )
            .nullable()
        : Yup.string().notRequired().nullable(),

    intEmployeeId:
      fetchJobRes[0]?.job_type === "INTERNAL JOB"
        ? Yup.string()
            .required("Please enter Employee Id.")
            .matches(regex.empIdRegex, "Please enter Valid Employee Id.")
            .nullable()
        : Yup.string().notRequired().nullable(),
  });
  //#endregions

  //#region initialValues
  const initialValues = {
    candidateName: "",
    employeeId: "",
    intEmployeeId: "",
    emailId: "",
    role: null,
    location: null,
    relocation: null,
    referalName: "",
    referalId: "",
    currencySymbole: "INR",
    salaries: "",
    keySkills: null,
    experienceYear: null,
    experienceMonth: null,
    education: null,
    course: null,
    specialization: "",
    certification: null,
    availabilityDate: "",
    availabilityTime: "",
    reason: "",
    resume: "",
  };
  //#endregon

  const [count, setCount] = useState(0);

  const formikRef = useRef<any>();

  const postApplyJob = useSelector((state: any) => state.postInternalJobApply);
  const { postIntJobRes, intJobLoading } = postApplyJob;

  //#Region Send Otp
  const [verifyemail, setVerifyemail] = useState(false),
    [emailver, setEmailver] = useState(true),
    [loader, setLoader] = useState(false),
    [loader2, setLoader2] = useState(false),
    [loader3, setLoader3] = useState(false),
    [err, setErr] = useState(""),
    [mins, setMins] = useState(0),
    [secs, setSecs] = useState(0),
    [time, setTime] = useState<any>(""),
    [activeOtpIndex, setActiveOtpIndex] = useState(0),
    [otp, setOtp] = useState(new Array(6).fill("")),
    inputRef = useRef<HTMLInputElement>(null),
    [pointer, setPointer] = useState("pointer"),
    [dateError, setDateError] = useState(""),
    [txnId, setTxnId] = useState("");
  const [startTime, setStartTime] = useState<any>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);

  const [emailIdValue, setEmailIdValue] = useState("");
  const sendOtpRes = useSelector((state: any) => state.sendOtp);
  const { otpRes, loading } = sendOtpRes;

  useEffect(() => {
    if (verifyemail) {
      const timer: any = time > 0 && setInterval(() => setTime(time - 1), 1000);
      setMins(Math.floor(time / 60));
      setSecs(time % 60);
      return () => clearInterval(timer);
    }
  }, [verifyemail, time]);

  useEffect(() => {
    if (otpRes?.code === 200) {
      showSnackAlert("success", "OTP sent successfully to entered email id");
      setVerifyemail(true);
      setTime(Number(environment.otp_time_sec));
      setTxnId(otpRes?.data?.txn_id);
      dispatch(resetsendotpAction());
      setOtp(new Array(6).fill(""));

      setLoader3(false);
    }
  }, [otpRes]);

  const sendOtp_resend = async () => {
    const sendOtpInfo = {
      to: emailIdValue,
      channel: "email",
    };
    dispatch(sendOtp(sendOtpInfo));
    // setLoader3(false);
  };

  const otpChanges = (
    { target }: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = target;
    const otpArr: string[] = [...otp];
    otpArr[index] = value.substring(value.length - 1);
    if (!value) setActiveOtpIndex(index);
    else setActiveOtpIndex(index + 1);
    setOtp(otpArr);
  };
  const otpKeyChanges = (
    { key }: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (key === "Backspace" && !otp[index]) setActiveOtpIndex(index - 1);
    else if (key === "Backspace") setActiveOtpIndex(index - 0);
  };

  //#end region send otp

  useEffect(() => {
    if (postIntJobRes?.code === 200) {
      setVerifyemail(false);
      setOtp(new Array(6).fill(""));

      dispatch(resetIntJobApply());
      setLoader2(false);

      setAppliedDiv(true);

      formikRef.current.resetForm();
    } else if (postIntJobRes?.response?.data?.code === 400) {
      showSnackAlert("warning", postIntJobRes?.response?.data?.message);
      setOtp(new Array(6).fill(""));
      // setVerifyemail(true);
      dispatch(resetIntJobApply());
      setLoader2(false);
    }
  }, [postIntJobRes]);

  const postHandler = () => {
    const Otp = Number(
      `${otp[0]}${otp[1]}${otp[2]}${otp[3]}${otp[4]}${otp[5]}`
    );

    const dateString = formikRef.current?.values?.availabilityDate; // Date in YYYY-MM-DD format
    const timeString = formikRef.current?.values?.availabilityTime;
    const newDate = new Date(dateString).toISOString().split("T");
    const dateArray = newDate[0].split("-").reverse();
    const date = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;
    const combinedString = `${date} ${timeString}`;
    const combinedDateTime = new Date(combinedString);

    const timestamp = combinedDateTime.setDate(combinedDateTime.getDate() + 1);

    const experience =
      Number(formikRef.current.values.experienceYear?.label.split(" ")[0]) *
        12 +
      Number(formikRef.current.values.experienceMonth?.label.split(" ")[0]);

    const arrayEducation = ["10th", "12th", "Below 10th"];
    const educationData = (educ: any) => {
      if (eduData.includes(educ.label)) {
        return { course: educ.label, special: "" };
      } else {
        return {
          course: formikRef.current.values.course.label,
          special: formikRef.current.values.specialization.label,
        };
      }
    };
    let educt = educationData(formikRef.current.values.education);

    let postApply: any = {
      jobid: paramId,
      emp_id: formikRef.current.values.employeeId,
      name: formikRef.current.values.candidateName,
      mail: formikRef.current.values.emailId,
      designation: formikRef.current.values.role?.label,
      loc: formikRef.current.values.location?.label,
      reloc_asst:
        formikRef.current.values.relocation?.label === "Yes" ? true : false,
      ectc: {
        cy: formikRef.current.values.currencySymbole,
        val: Number(formikRef.current.values.salaries.replace(/,/g, "")),
      },
      skills: formikRef.current.values.keySkills?.map((e: any) => e.label),
      exp: experience,
      edu: [
        {
          course: educt.course,
          stream: [educt.special],
        },
      ],
      cert: formikRef.current.values.certification,
      jng_ts: Number(timestamp) / 1000,
      reason: formikRef.current.values.reason,
      txn_id: txnId,
      otp: Otp,
      channel: "email",
    };
    if (fetchJobRes[0]?.job_type === "REFERRAL JOB") {
      postApply.ref = {
        name: formikRef.current.values.referalName,
        emp_id: formikRef.current.values.referalId,
      };
      postApply.emp_id = formikRef.current.values.employeeId;
    } else {
      postApply.emp_id = formikRef.current.values.intEmployeeId;
    }

    let formData = new FormData();
    formData.append("resume", formikRef.current.values.resume);
    formData.append("applicantDetails", JSON.stringify(postApply));
    dispatch(PostIntJobApply(formData));
    // setLoader2(false);
  };

  // end object

  //#region year of experience
  useEffect(() => {
    const yearmonthObj = [
      {
        group: "All",
        params: [],
      },
    ];
    dispatch(getYearMonth(yearmonthObj));
  }, []);
  const yearmonthData = useSelector((state: any) => state.yearmonthMasterdata);

  const eduData = ["Diploma/Graduation", "10th", "12th", "Below 10th"];

  const { allYearMonth } = yearmonthData;
  const [year, setyear] = useState<any>([]);
  const [month, setmonth] = useState<any>([]);
  const [yearOfExp, setYearofExp] = useState<any>([]);
  const [monthOfExp, setMonthOfExp] = useState<any>([]);
  const [MonthChangeYearExp, setMonthChangeYearExp] = useState<any>([]);
  const [YearChangeYearExp, setYearChangeYearExp] = useState<any>([]);
  const handleYearOfExp = (value: any) => {
    if (value == "0 Month") {
      // const arr = yearOfExp?.filter((val: any) => val?.label !== "0 Year");

      setYearChangeYearExp(yearOfExp);
    } else {
      setYearChangeYearExp(yearOfExp);
    }
  };
  const handleMonthOfExp = (value: any) => {
    if (value == "0 Year") {
      // const arr = monthOfExp?.filter((val: any) => val?.label !== "0 Month");

      setMonthChangeYearExp(monthOfExp);
    } else {
      setMonthChangeYearExp(monthOfExp);
    }
  };

  useEffect(() => {
    allYearMonth.length &&
      allYearMonth?.map((opt: any) => {
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
  }, [allYearMonth]);

  //end region year of experience

  //#region Salary
  const [showmoney, setShowmoney] = useState(false);
  const [salary, setSalary] = useState<any>();
  const [currencyvalue, setCurrencyvalue] = useState<any>("en-IN");
  const [ind, setInd] = useState(true);
  const [us, setUS] = useState(false);
  const [sal, setSal] = useState<any>("");
  const nf = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });
  const ChangeSalary = (cValue, salary) => {
    const nf2 = new Intl.NumberFormat(cValue, { maximumFractionDigits: 2 });
    if (salary) {
      setSal(nf2.format(salary.replace(/\,/g, "")));
    }
    setCurrencyvalue(cValue);
  };

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

  //#end region Salary

  //#Region Education
  useEffect(() => {
    const masterDataObj = [
      {
        group: "All",
        active: 1,
      },
    ];
    dispatch(jobSeekerProfileMasterData(masterDataObj));
  }, []);
  const [educationArray, setEducationArray] = useState<any>([]);
  const [educationtData, setEducationData] = useState<any>([]);
  const [courseArr, setCourseData] = useState<any>([]);
  const [specializationData, setSpecializationData] = useState<any>([]);
  const [dispSpecialization, setDispSpecialization] = useState(true);

  const masterDatas = useSelector((state: any) => state.jobSeekerMasterData);
  const { JSMasterData } = masterDatas;
  useEffect(() => {
    if (JSMasterData) {
      JSMasterData.length &&
        JSMasterData?.map((opt: any) => {
          if (opt?.group === "EDUN") {
            const eduObj: any = opt.data?.map((data) => data.value);
            const obj: any = createData(eduObj);
            setEducationArray(obj);
            setEducationData(obj);
          }
        });
    }
  }, [JSMasterData]);

  const filterColors = async (inputValue: string) => {
    if (inputValue) {
      const body = { active: 1, parent_id: inputValue };
      const specDaata: any = await specializationMasterData(body);

      if (specDaata.length) {
        const specData = specDaata?.map((spc) => {
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

  const [dispCourse, setDispCourse] = useState(true);

  const setCourseOptions = (edu: any) => {
    if (eduData.includes(edu.label)) {
      setDispCourse(false);
    }

    if (JSMasterData) {
      JSMasterData?.map((opt: any) => {
        if (opt.group === "DPHD" && edu?.label == "Doctorate/PhD") {
          const obj: any = createDataWithId(opt.data, true);
          setCourseData(obj);
          setDispCourse(true);
        }
        if (opt.group === "MAPG" && edu?.label == "Masters/Post-Graduation") {
          const obj: any = createDataWithId(opt.data, true);
          setCourseData(obj);
          setDispCourse(true);
        }
        if (
          opt.group === "BAUG" &&
          edu &&
          edu?.label == "Batchelor/Under-Graduation"
        ) {
          const obj: any = createDataWithId(opt.data, true);
          setCourseData(obj);
          setDispCourse(true);
        }
        if (opt.group === "BAUG" && edu && edu?.label == "Diploma/Graduation") {
          const obj: any = createDataWithId(opt.data, true);
          setCourseData(obj);
          setDispCourse(false);
        }
      });
    }
  };

  //#end Region education

  //#region  skills
  const [skillsCount, setSkillsCount] = useState<number>(0);
  const skillsmasterData = useSelector((state: any) => state.skills);
  const { SkillsData } = skillsmasterData;

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

  const handleChangeInputt = (e): boolean => {
    const skills = e
      .map((skill) => skill.value)
      .toString()
      .replaceAll(",", "");

    if (skills.length > 250) {
      return false;
    } else if (!skills.length) {
      setSkillsCount(skills.length);
      return true;
    }
    setSkillsCount(skills.length);
    return true;
  };
  //#endregion skills end

  //#region Date and time
  const [startDate, setStartDate] = useState<any>(null);
  const [touchedDate, setTouchedDate] = useState(false);
  const [touchedSTime, setTouchedSTime] = useState(false);
  const [touchedETime, setTouchedETime] = useState(false);
  const [dateval, setDateVal] = useState<any>();
  const [addDate, setAddDate] = useState<any>();
  const [dateErr, setDateErr] = useState<any>("");

  //#end region date and time

  //#Region Resume file

  const showSnackAlert = UseToastAlert();

  const resumeSize = bytesToMegabytes(Number(environment.resumefile));
  const [undoFile, setUndoFile] = useState(null);
  const [resumeformatError, setResumeformatError] = useState("");
  const [showDownloadBtn, setShowDownloadBtn] = useState(false);
  const [notprotectedError, setNotprotectedError] = useState("");
  const [filesizeError, setFilesizeError] = useState("");

  //region Certificate
  const filterCertifications: any = (inputValue: string, callback) => {
    if (inputValue.length >= 2) {
      const data = { pageNo: 1, search: inputValue, active: 1 };
      certificateNameMasterData(data).then((res) =>
        callback(
          res.map((cert) => {
            return { label: cert.name, value: cert.name };
          })
        )
      );
    } else {
      return [];
    }
  };
  const loadCertificateOptions = useCallback(
    debounce(filterCertifications, 1000),
    []
  );

  const MAX_LENGTH = 150;
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

  const [certificateInputValue, setCertificateInputValue] = useState("");
  const handleInputCertChanges = (newValue: string) => {
    if (/[\w\s-.',:!()&+\[\]/*@|^]/.test(newValue)) {
      setCertificateInputValue("");
    } else {
      setCertificateInputValue(
        "Special characters other than (- . ' , : ! ( ) & + [ ] / * @ | ^) are not allowed."
      );
    }
  };

  //#end region certificate

  //region location
  const [locationMasterData, setLocationMasterData] = useState([]);
  const { LocationcityData, Locationloading } = useSelector(
    (state: any) => state.locationcity
  );

  useEffect(() => {
    if (!Locationloading) {
      locationData(LocationcityData);
    }
  }, [Locationloading]);

  const locationData = (data: any) => {
    data.length &&
      setLocationMasterData(
        data?.map((d: any) => {
          return { label: d, value: d };
        })
      );
  };
  //endregion

  //#region roles
  const dispatch = useDispatch();
  const [roleMasterData, setRoleMasterData] = useState([]);

  useEffect(() => {
    dispatch(DesignationMasterData({ pageno: -1, search: "" }));
    dispatch(LocationcityMasterData({ pageno: -1, search: "" }));
  }, []);

  const { DesignationData, desloading } = useSelector(
    (state: any) => state.designation
  );

  useEffect(() => {
    if (!desloading) {
      roleData(DesignationData);
    }
  }, [desloading]);

  const roleData = (data: any) => {
    const options: any = [];
    data.length &&
      data?.map((d: any) => {
        options.push({ value: d, label: d });
      });

    setRoleMasterData(options);
  };
  const filterRoles = (inputValue: string) => {
    return roleMasterData.filter((i: any) =>
      i.label?.toLowerCase().includes(inputValue?.toLowerCase())
    );
  };

  const roleOptions = (inputValue: string) =>
    new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve(filterRoles(inputValue));
      }, 1000);
    });
  //#endregion

  // useEffect(() => {
  //   if (
  //     startDate?.$d?.toDateString() == new Date().toDateString() &&
  //     !formikRef.current.error?.availabilityTime
  //   ) {
  //     if (
  //       formikRef.current.values?.availabilityTime?.$d
  //         ?.toTimeString()
  //         .slice(0, 2) < new Date().toTimeString().slice(0, 2) ||
  //       (formikRef.current.values?.availabilityTime?.$d
  //         ?.toTimeString()
  //         .slice(0, 2) == new Date().toTimeString().slice(0, 2) &&
  //         formikRef.current.values?.availabilityTime?.$d
  //           ?.toTimeString()
  //           .slice(3, 5) <= new Date().toTimeString().slice(3, 5))
  //     ) {
  //       setDateErr("Select Future Time.");
  //       // formikRef.current.errors.availabilityTime = "Select Future Time.";
  //     } else {
  //       setDateErr("");
  //       // formikRef.current.errors.availabilityTime = "";
  //     }
  //   } else {
  //     setDateErr("");
  //     // formikRef.current.errors.availabilityTime = "";
  //   }
  // }, [formikRef?.current?.values?.availabilityTime, dateErr]);

  // FindJobApplication
  const [appliedErr, setAppliedErr] = useState(false);

  const { PostIntAppRes, PostIntAppLoading } = useSelector(
    (state: any) => state.PostIntAppData
  );

  useEffect(() => {
    if (PostIntAppRes && PostIntAppRes?.code === 200) {
      setAppliedErr(false);
    } else if (
      PostIntAppRes &&
      PostIntAppRes?.response?.data &&
      PostIntAppRes?.response?.data?.code === 500
    ) {
      setAppliedErr(true);
    } else if (
      PostIntAppRes &&
      PostIntAppRes?.response?.data &&
      PostIntAppRes?.response?.data?.code === 400
    ) {
      setAppliedErr(true);
    }
  }, [PostIntAppRes, PostIntAppRes?.response?.data]);

  const validateJobApplied = (e: any) => {
    e.preventDefault();
    const email = regex.email.test(e?.target?.value);
    if (email) {
      dispatch(
        postIntApplication({
          jobid: paramId,
          mail: e?.target?.value.toLowerCase(),
        })
      );
    }
  };

  const [FilterTime, setFilterTime] = useState<any>();
  const [FilterDate, setFilterDate] = useState<any>();

  useEffect(() => {
    const currentDate = new Date();
    if (formikRef?.current?.values?.availabilityTime) {
      const date = new Date(formikRef?.current?.values?.availabilityDate?.$d);
      const timess = formikRef?.current?.values?.availabilityTime.split(":");
      date?.setHours(timess[0]);
      date?.setMinutes(timess[1]);
      if (currentDate < date) {
        setDateErr("");
      } else if (currentDate > date) {
        setDateErr("Please select Future Time.");
      } else {
        setDateErr("");
      }
    }
  }, [FilterTime, FilterDate]);

  // Fetch valid job

  const { fetchValidJobRes, fetchValidJobLoading } = useSelector(
    (state: any) => state.fetchValidJobData
  );

  useEffect(() => {
    if (paramId) {
      dispatch(fetchValidInternalJob(paramId));
    }
  }, [paramId]);

  useEffect(() => {
    if (fetchValidJobRes && fetchValidJobRes?.code === 200) {
      setFetchJobErr(false);
    } else if (
      fetchValidJobRes &&
      fetchValidJobRes?.response?.data &&
      fetchValidJobRes?.response?.data?.code !== 200
    ) {
      setFetchJobErr(true);
    } else if (
      fetchValidJobRes &&
      fetchValidJobRes?.response?.data &&
      fetchValidJobRes?.response?.data?.code === 500
    ) {
      setFetchJobErr(true);
    } else if (
      fetchValidJobRes &&
      fetchValidJobRes?.response?.data &&
      fetchValidJobRes?.response?.data?.code === 400
    ) {
      setFetchJobErr(true);
    }
  }, [fetchValidJobRes?.response?.data?.code]);

  return (
    <>
      {!fetchJobErr && !appliedDiv && (
        <div className="page-content">
          <div className="section-full browse-job">
            <div className="job-bx-title clearfix custom-page-header">
              <div className="job-bx bg-white" id="main-header">
                <div style={{ marginBottom: "-20px" }}>
                  <img
                    src={logo}
                    style={{
                      width: "12%",
                      marginTop: "-24px",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-center align-items-center vh-100">
              <div className="container">
                <div className="row">
                  <div
                    className="col-md-3 col-lg-3 col-sm-12 mx-auto"
                    style={{ marginTop: "24px" }}
                  >
                    <div id="job_req_bx" className="job-bx bg-white m-b30 mt-2">
                      <div
                        style={{
                          fontSize: "20px",
                        }}
                      >
                        <label
                          className="label-font-size"
                          htmlFor=""
                          style={{
                            lineHeight: "0px",
                          }}
                        >
                          Company Name :
                        </label>
                        <br />
                        <span
                          style={{
                            fontSize: "14px",
                            wordWrap: "break-word",
                          }}
                        >
                          {fetchJobRes[0]?.comp_name}
                        </span>
                        <br />
                        <div>
                          <label
                            className="label-font-size"
                            htmlFor=""
                            style={{
                              lineHeight: "0px",
                            }}
                          >
                            Job Title :
                          </label>
                          <br />
                          <span
                            style={{
                              fontSize: "14px",
                              wordWrap: "break-word",
                            }}
                          >
                            {fetchJobRes[0]?.title}
                          </span>
                        </div>
                        <div>
                          <label
                            className="label-font-size"
                            htmlFor=""
                            style={{
                              lineHeight: "0px",
                            }}
                          >
                            Job Type :
                          </label>
                          <br />
                          <span
                            style={{
                              fontSize: "14px",
                              wordWrap: "break-word",
                            }}
                          >
                            {fetchJobRes[0]?.job_type?.charAt(0) +
                              fetchJobRes[0]?.job_type?.slice(1).toLowerCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="" style={{ marginTop: "63px" }}>
                      <div
                        id="Comments_bx assessimg"
                        className="job-bx-img bg-white m-b30"
                      >
                        <div className="">
                          <div>
                            <Link to={"#"}>
                              <img
                                style={{ height: "100%" }}
                                alt="Comment"
                                src={require("../../../../assets/images/background/tech-03.png")}
                              />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-9 col-lg-9 col-sm-12 mx-auto">
                    <br />
                    <Formik
                      initialValues={initialValues}
                      enableReinitialize={true}
                      validationSchema={validateSchema}
                      innerRef={formikRef}
                      onSubmit={() => {
                        const sendOtpInfo = {
                          to: emailIdValue,
                          channel: "email",
                        };
                        dispatch(sendOtp(sendOtpInfo));
                      }}
                    >
                      {({
                        handleBlur,
                        setFieldTouched,
                        setFieldValue,
                        values,
                        errors,
                        handleSubmit,
                        handleChange,
                        touched,
                        resetForm,
                      }: any) => {
                        const CheckFile = (e: any): boolean => {
                          let allowedExt = ["docx", "DOCX", "pdf", "PDF"];
                          const selectedFile: any =
                            e.target.files && e.target.files[0];

                          const reader: any = new FileReader();

                          reader.readAsArrayBuffer(selectedFile);

                          reader.onload = function () {
                            let file: any = new Blob([reader.result], {
                              type: "application/pdf",
                            });

                            file.text().then((x) => {
                              if (x.includes("Encrypt")) {
                                showSnackAlert(
                                  "warning",
                                  "Please select a valid file which is not protected."
                                );

                                e.target.value = null;

                                return false;
                              }

                              const resume = e.target.files[0].type;

                              const extArray =
                                e.target.files[0].name.split(".");
                              const ext = extArray[extArray.length - 1];

                              if (resume) {
                                if (
                                  e.target?.files[0].size >
                                  environment.resumefile
                                ) {
                                  showSnackAlert(
                                    "warning",
                                    `Please select a valid file size, Supported file size upto ${resumeSize} MB`
                                  );

                                  e.target.value = null;

                                  const event = {
                                    target: {
                                      name: "resume",

                                      value: null,
                                    },
                                  };

                                  handleChange(event);

                                  return false;
                                }

                                if (allowedExt.includes(ext)) {
                                  const event = {
                                    target: {
                                      name: "resume",

                                      value: e?.target?.files[0],
                                    },
                                  };

                                  handleChange(event);

                                  return true;
                                } else {
                                  showSnackAlert(
                                    "warning",
                                    `Please select a valid resume format, Supported Formats:  docx, pdf, upto ${resumeSize} MB`
                                  );

                                  e.target.value = null;

                                  const event = {
                                    target: {
                                      name: "resume",

                                      value: null,
                                    },
                                  };

                                  handleChange(event);

                                  return false;
                                }
                              }

                              return false;
                            });
                          };

                          return false;
                        };

                        const deleteFile = () => {
                          setUndoFile(values.resume);
                          const event = {
                            target: {
                              name: "resume",
                              value: null,
                            },
                          };
                          handleChange(event);
                        };

                        const undoJdFile = () => {
                          const event = {
                            target: {
                              name: "resume",
                              value: undoFile,
                            },
                          };
                          handleChange(event);
                          setUndoFile(null);
                        };
                        const handleDownload = () => {
                          window.location = values.jdFileUrl;
                        };

                        //#End Region Resume File
                        return (
                          <div
                            id="job_req_bx"
                            className="job-bx bg-white m-b30"
                          >
                            <>
                              <div className="row mt-4">
                                <div className="col-md-6 col-lg-6 col-sm-12">
                                  <div className="form-group">
                                    <label
                                      style={{ fontSize: "14px" }}
                                      className="label-font-size"
                                    >
                                      Candidate Full Name
                                      <span
                                        style={{
                                          color: "red",
                                        }}
                                      >
                                        *
                                      </span>
                                    </label>
                                    <br />
                                    <input
                                      type="text"
                                      maxLength={150}
                                      className="form-control"
                                      name="candidateName"
                                      onBlur={handleBlur}
                                      value={values.candidateName}
                                      onChange={handleChange}
                                      placeholder="Enter Candidate Full Name"
                                    />
                                    {errors.candidateName &&
                                      touched.candidateName && (
                                        <span>
                                          <p className="form-error">
                                            {errors.candidateName}
                                          </p>
                                        </span>
                                      )}
                                  </div>
                                </div>
                                {!dispReferal && (
                                  <div className="col-md-6 col-lg-6 col-sm-12">
                                    <div className="form-group">
                                      <label className="label-font-size">
                                        Candidate Id
                                        <span
                                          style={{
                                            color: "red",
                                          }}
                                        >
                                          *
                                        </span>
                                      </label>
                                      <br />
                                      <input
                                        type="text"
                                        className="form-control"
                                        name="intEmployeeId"
                                        value={values.intEmployeeId}
                                        maxLength={15}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Candidate Id"
                                      />
                                      {errors.intEmployeeId &&
                                        touched.intEmployeeId && (
                                          <span>
                                            <p className="form-error">
                                              {errors.intEmployeeId}
                                            </p>
                                          </span>
                                        )}
                                    </div>
                                  </div>
                                )}

                                {dispReferal && (
                                  <div className="col-md-6 col-lg-6 col-sm-12">
                                    <div className="form-group">
                                      <label className="label-font-size">
                                        Candidate Id
                                      </label>
                                      <br />
                                      <input
                                        type="text"
                                        className="form-control"
                                        name="employeeId"
                                        value={values.employeeId}
                                        maxLength={15}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Candidate Id"
                                      />
                                    </div>
                                  </div>
                                )}

                                <div className="col-md-6 col-lg-6 col-sm-12">
                                  <div className="form-group">
                                    <label className="label-font-size">
                                      Candidate Email-Id
                                      <span
                                        style={{
                                          color: "red",
                                        }}
                                      >
                                        *
                                      </span>
                                    </label>
                                    <br />
                                    <input
                                      type="text"
                                      className="form-control"
                                      name="emailId"
                                      value={values.emailId}
                                      maxLength={150}
                                      onChange={(e: any) => {
                                        handleChange(e);
                                        setEmailIdValue(e.target.value);
                                      }}
                                      onBlur={(e: any) => {
                                        handleBlur(e);
                                        validateJobApplied(e);
                                      }}
                                      placeholder="Candidate Email-Id"
                                    />
                                    {!errors.emailId && appliedErr && (
                                      <p className="form-error">
                                        You have already applied for this job.
                                      </p>
                                    )}
                                    {errors.emailId && touched.emailId && (
                                      <span>
                                        <p className="form-error">
                                          {errors.emailId}
                                        </p>
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div className="col-md-6 col-lg-6 col-sm-12">
                                  <div className="form-group">
                                    <label className="label-font-size">
                                      Current Role
                                      <span
                                        style={{
                                          color: "red",
                                        }}
                                      >
                                        *
                                      </span>
                                    </label>
                                    <br />
                                    <AsyncCreatableSelect
                                      className="dropstyle"
                                      placeholder="Type your Role"
                                      cacheOptions
                                      isClearable={true}
                                      onBlur={handleBlur}
                                      value={values.role}
                                      name="role"
                                      noOptionsMessage={() =>
                                        "Enter keyword to search"
                                      }
                                      loadOptions={roleOptions}
                                      onChange={(selectedOption) => {
                                        handleChange({
                                          target: {
                                            name: "role",
                                            value: selectedOption,
                                          },
                                        });
                                      }}
                                    />
                                    {touched.role && errors.role && (
                                      <div className="form-error">
                                        {errors?.role}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="col-md-6 col-lg-6 col-sm-12">
                                  <div className="form-group">
                                    <label className="label-font-size">
                                      Current Location
                                      <span
                                        style={{
                                          color: "red",
                                        }}
                                      >
                                        *
                                      </span>
                                    </label>
                                    <Select
                                      components={components}
                                      placeholder="Search and add locations"
                                      isClearable={false}
                                      className="dropstyle"
                                      styles={customStyles}
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
                                      options={locationMasterData}
                                      //  loadOptions={}
                                    />
                                    {errors.location && touched.location && (
                                      <span>
                                        <p className="form-error">
                                          {errors.location}
                                        </p>
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="col-md-6 col-lg-6 col-sm-12">
                                  <div className="form-group">
                                    <label className="label-font-size">
                                      Relocation Assistance
                                      <span
                                        style={{
                                          color: "red",
                                        }}
                                      >
                                        *
                                      </span>
                                    </label>
                                    <br />
                                    <Select
                                      className={"dropstyle"}
                                      placeholder="Select"
                                      styles={customStyles}
                                      options={reloactionOpt}
                                      name="relocation"
                                      value={values.relocation}
                                      onChange={(e: any) => {
                                        let event = {
                                          target: {
                                            name: "relocation",
                                            value: e,
                                          },
                                        };
                                        handleChange(event);
                                      }}
                                    />
                                    {errors.relocation &&
                                      touched.relocation && (
                                        <span>
                                          <p className="form-error">
                                            {errors.relocation}
                                          </p>
                                        </span>
                                      )}
                                  </div>
                                </div>
                              </div>
                              {dispReferal && (
                                <div className="row">
                                  <div className="col-md-6 col-lg-6 col-sm-12">
                                    <div className="form-group">
                                      <label className="label-font-size">
                                        Referal Name
                                        <span
                                          style={{
                                            color: "red",
                                          }}
                                        >
                                          *
                                        </span>
                                      </label>{" "}
                                      <br />
                                      <input
                                        type="text"
                                        maxLength={100}
                                        placeholder="Enter referal name"
                                        className="form-control"
                                        name="referalName"
                                        value={values.referalName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                      {errors.referalName &&
                                        touched.referalName && (
                                          <span>
                                            <p className="form-error">
                                              {errors.referalName}
                                            </p>
                                          </span>
                                        )}
                                    </div>
                                  </div>
                                  <div className="col-md-6 col-lg-6 col-sm-12">
                                    <div className="form-group">
                                      <label className="label-font-size">
                                        Referal Employee Id
                                        <span
                                          style={{
                                            color: "red",
                                          }}
                                        >
                                          *
                                        </span>
                                      </label>{" "}
                                      <br />
                                      <input
                                        type="text"
                                        maxLength={10}
                                        placeholder="Enter referal employee id"
                                        className="form-control"
                                        name="referalId"
                                        value={values.referalId}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                      />
                                      {errors.referalId &&
                                        touched.referalId && (
                                          <span>
                                            <p className="form-error">
                                              {errors.referalId}
                                            </p>
                                          </span>
                                        )}
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div className="row">
                                <div className="col-md-12 col-lg-12 col-sm-12">
                                  <label className="label-font-size">
                                    Key Skills
                                    <span
                                      style={{
                                        color: "red",
                                      }}
                                    >
                                      *
                                    </span>
                                  </label>

                                  <AsyncCreatableSelect
                                    components={components}
                                    placeholder="Enter your area of expertise/specialization"
                                    cacheOptions
                                    isClearable={false}
                                    noOptionsMessage={() =>
                                      "Enter keyword to search"
                                    }
                                    className="dropstyle"
                                    name="keySkills"
                                    isMulti
                                    value={values.keySkills}
                                    onChange={(selectedOption: any) => {
                                      const res =
                                        handleChangeInputt(selectedOption);
                                      if (res) {
                                        const event = {
                                          target: {
                                            name: "keySkills",
                                            value: selectedOption,
                                          },
                                        };
                                        handleChange(event);
                                      }
                                    }}
                                    loadOptions={loadSkillsOptions}
                                  />

                                  <div className="d-flex justify-content-between">
                                    <div>
                                      {errors.keySkills &&
                                        touched.keySkills && (
                                          <p className="form-error">
                                            {errors.keySkills}
                                          </p>
                                        )}
                                    </div>
                                    <span className="custom-char-count ">
                                      {!isNaN(250 - skillsCount)
                                        ? 250 - skillsCount
                                        : 250}{" "}
                                      Character(s) Left
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-md-12 col-lg-12 col-sm-12">
                                  <div className="form-group">
                                    <label className="label-font-size">
                                      Year of Experience
                                      <span
                                        style={{
                                          color: "red",
                                        }}
                                      >
                                        *
                                      </span>
                                    </label>
                                    <br />
                                    <div className="row">
                                      <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                        <Select
                                          placeholder="Select Years"
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
                                          isClearable={false}
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
                                          placeholder="Select Months"
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
                                          isClearable={false}
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
                              </div>

                              <div className="row">
                                <div className="col-md-5 col-lg-5 col-sm-12">
                                  <label className="label-font-size">
                                    Expected Salary
                                    <span
                                      style={{
                                        color: "red",
                                      }}
                                    >
                                      *
                                    </span>
                                  </label>
                                  <br />
                                  <div className="d-flex">
                                    <div className="col-md-1 col-lg-1 col-sm-12 mt-1">
                                      {/* <div
                                        className="btn-group "
                                        role="group"
                                        aria-label="Toggle manual switch"
                                      > */}
                                      <label>
                                        <input
                                          type="radio"
                                          name="currencySymbole"
                                          value="INR"
                                          className="card-input-element"
                                          checked={
                                            values.currencySymbole === "INR"
                                          }
                                          onChange={handleChange}
                                        />
                                        <div
                                          className={
                                            values.currencySymbole === "INR"
                                              ? "btn btn-primary btn-sm"
                                              : "btn btn-outline-primary btn-sm"
                                          }
                                        >
                                          ₹
                                        </div>
                                      </label>
                                      {/* <label className="mr-3">
                                          <input
                                            type="radio"
                                            name="currencySymbole"
                                            value="USD"
                                            className="card-input-element"
                                            checked={
                                              values.currencySymbole === "USD"
                                            }
                                            onChange={handleChange}
                                          />
                                          <div
                                            className={
                                              values.currencySymbole === "USD"
                                                ? "btn btn-primary btn-sm"
                                                : "btn btn-outline-primary btn-sm"
                                            }
                                          >
                                            $
                                          </div>
                                        </label> */}
                                      {/* </div> */}
                                    </div>
                                    <div className="col-md-8 col-lg-8 col-sm-12">
                                      <input
                                        type="text"
                                        min={0}
                                        name="salaries"
                                        maxLength={11}
                                        onInput={(e: any) => {
                                          if (
                                            /^[0-9,]+$/.test(e.target.value)
                                          ) {
                                            setShowmoney(true);
                                            handleChange(e);
                                            handleSalaryChangeInWords(e);
                                            e.target.value = nf.format(
                                              e.target.value.replace(/\,/g, "")
                                            );
                                            setSal(e.target.value);
                                            values.salaries = e.target.value;
                                          } else if (
                                            e.target.value?.length == 0
                                          ) {
                                            setSal("");
                                            setSalary("");
                                            values.salaries = "";
                                          } else {
                                            setSalary("");
                                          }
                                        }}
                                        className="form-control"
                                        placeholder="E.g. 4,50,000"
                                        value={sal != 0 ? sal : ""}
                                      />
                                      {errors.salaries && touched.salaries && (
                                        <span>
                                          <p className="form-error">
                                            {errors.salaries}
                                          </p>
                                        </span>
                                      )}
                                      {ind && showmoney && sal != 0 && (
                                        <p
                                          className="fs-6  text-success"
                                          style={{
                                            fontSize: "80%",
                                          }}
                                        >
                                          {getRupeeText()}
                                        </p>
                                      )}
                                      {us && showmoney && sal != 0 && (
                                        <p
                                          className="fs-6  text-success"
                                          style={{
                                            fontSize: "80%",
                                          }}
                                        >
                                          {getDollarText()}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="col-md-4 col-lg-4 col-sm-12">
                                  <div className="form-group">
                                    <label className="label-font-size">
                                      Availability Date
                                      <span
                                        style={{
                                          color: "red",
                                        }}
                                      >
                                        *
                                      </span>
                                    </label>
                                    <div
                                      className="form-outline"
                                      id="datetimepicker-timeOptions"
                                    >
                                      <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                      >
                                        <DemoContainer
                                          components={["DatePicker"]}
                                        >
                                          <DatePicker
                                            className="datepickerWalkIn "
                                            value={
                                              values?.availabilityDate
                                                ? values?.availabilityDate
                                                : null
                                            }
                                            format="DD-MM-YYYY"
                                            disablePast
                                            onChange={(newValue) => {
                                              setFilterDate(
                                                values?.availabilityDate
                                              );
                                              const selectedDate = `${
                                                newValue?.$D
                                              }/${newValue?.$M + 1}/${
                                                newValue?.$y
                                              }`;
                                              const addtionDate = `${
                                                newValue?.$y
                                              }/${newValue?.$M + 1}/${
                                                newValue?.$D
                                              }`;

                                              setDateVal(selectedDate);
                                              setAddDate(addtionDate);
                                              if (
                                                newValue?.$D &&
                                                newValue?.$M + 1 &&
                                                newValue?.$y &&
                                                new Date(
                                                  `${newValue?.$M + 1}-${
                                                    newValue?.$D
                                                  }-${newValue?.$y}`
                                                ) < new Date() &&
                                                `${new Date(
                                                  `${newValue?.$M + 1}-${
                                                    newValue?.$D
                                                  }-${newValue?.$y}`
                                                ).toDateString()}` !=
                                                  `${new Date().toDateString()}`
                                              ) {
                                                setStartDate(null);
                                                setFieldValue(
                                                  "availabilityDate",
                                                  null
                                                );
                                                setDateError(
                                                  "Please select the future date."
                                                );
                                              } else {
                                                setStartDate(newValue);
                                                setDateError("");
                                                setFieldValue(
                                                  "availabilityDate",
                                                  newValue
                                                );
                                              }
                                            }}
                                            onClose={() => {
                                              setTouchedDate(true);
                                            }}
                                          />
                                        </DemoContainer>
                                      </LocalizationProvider>
                                    </div>
                                    {!errors.availabilityDate && dateError && (
                                      <span className="form-error">
                                        {dateError}
                                      </span>
                                    )}
                                    {errors.availabilityDate &&
                                      touched.availabilityDate && (
                                        <span>
                                          <p
                                            className="form-error"
                                            // style={{
                                            //   marginTop: "-13px",
                                            // }}
                                          >
                                            {errors.availabilityDate}
                                          </p>
                                        </span>
                                      )}
                                  </div>
                                </div>
                                <div className="col-md-3 col-lg-3 col-sm-12">
                                  {/* <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                  >
                                    <DemoContainer
                                      components={["MobileTimePicker"]}
                                    > */}
                                  <div className="form-group">
                                    <label className="label-font-size">
                                      Availability Time
                                      <span
                                        style={{
                                          color: "red",
                                        }}
                                      >
                                        *
                                      </span>
                                    </label>
                                    <br />
                                    {/* <MobileTimePicker
                                          views={["hours", "minutes"]}
                                          value={
                                            values?.availabilityTime
                                              ? values?.availabilityTime
                                              : null
                                          }
                                          className="custom-mui-input"
                                          ampm={false}
                                          // value={dayjs(getTimeStampForTime("16:00").getTime())}
                                          onChange={(newValue) => {
                                            // setStartDate(newValue);
                                            setFieldValue(
                                              "availabilityTime",
                                              newValue
                                            );
                                            setStartTime(newValue);
                                          }}
                                          onClose={() => {
                                            setTouchedSTime(true);
                                          }}
                                        /> */}
                                    <input
                                      title=""
                                      name="availabilityTime"
                                      type="time"
                                      className="form-control"
                                      onBlur={handleBlur}
                                      placeholder="Availability Time"
                                      value={values.availabilityTime}
                                      onChange={(e) => {
                                        handleChange(e);
                                        setFilterTime(values.availabilityTime);
                                      }}
                                      min={
                                        values.availabilityDate
                                          ? new Date().toLocaleTimeString(
                                              "en-US",
                                              {
                                                hour12: false,
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                              }
                                            )
                                          : undefined
                                      }
                                    />
                                    {errors.availabilityTime &&
                                      touched.availabilityTime && (
                                        <p className="form-error">
                                          {errors.availabilityTime}
                                        </p>
                                      )}
                                    {!errors.availabilityTime && dateErr && (
                                      <p className="form-error">{dateErr}</p>
                                    )}
                                    {!errors.availabilityTime &&
                                      touchedSTime &&
                                      startTime === null && (
                                        <p className="form-error">
                                          Please select Start Time.
                                        </p>
                                      )}
                                  </div>
                                  {/* </DemoContainer>
                                  </LocalizationProvider> */}
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-md-6 col-lg-6 col-sm-6">
                                  <div className="form-group">
                                    <label className="label-font-size">
                                      Education
                                      <span
                                        style={{
                                          color: "red",
                                        }}
                                      >
                                        *
                                      </span>
                                    </label>
                                    <br />
                                    <Select
                                      name="education"
                                      value={values.education}
                                      isClearable={true}
                                      isSearchable={true}
                                      options={educationtData}
                                      className={"dropstyle"}
                                      styles={customStyles}
                                      onChange={(option: any) => {
                                        let event = {
                                          target: {
                                            name: "education",

                                            value: option,
                                          },
                                        };

                                        handleChange(event);

                                        if (option == null) {
                                          setFieldValue("course", "");

                                          setFieldValue("specialization", "");
                                        }

                                        if (
                                          option.label === "10th" ||
                                          option.label === "12th" ||
                                          option.label === "Below 10th"
                                        ) {
                                          setFieldValue("course", option);

                                          setFieldValue(
                                            "specialization",
                                            option
                                          );
                                        } else {
                                          setFieldValue("course", "");

                                          setFieldValue("specialization", "");
                                        }

                                        setCourseOptions(option);

                                        setFieldValue("education", option);
                                      }}
                                      placeholder="Enter Education"
                                    />
                                    {errors.education && touched.education && (
                                      <span>
                                        <p className="form-error">
                                          {errors.education}
                                        </p>
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {dispCourse && (
                                  <>
                                    <div className="col-md-6 col-lg-6 col-sm-6">
                                      <div className="form-group">
                                        <label className="label-font-size">
                                          Course
                                          <span
                                            style={{
                                              color: "red",
                                            }}
                                          >
                                            *
                                          </span>
                                        </label>
                                        <br />
                                        <CreatableSelect
                                          placeholder="Select Course"
                                          value={values.course}
                                          name="course"
                                          styles={customStyles}
                                          onChange={(option: any) => {
                                            let event = {
                                              target: {
                                                name: "course",
                                                value: option,
                                              },
                                            };
                                            handleChange(event);
                                            if (option?.value)
                                              if (option == null) {
                                                setFieldValue("course", "");

                                                touched.course = true;
                                              }

                                            filterColors(
                                              event?.target?.value?.value
                                            );
                                          }}
                                          isClearable={false}
                                          isSearchable={true}
                                          options={courseArr}
                                          className={"dropstyle"}
                                          maxMenuHeight={200}
                                        />
                                        {errors.course && touched.course && (
                                          <span className="form-error">
                                            {errors.course}
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    <div className="col-md-6 col-lg-6 col-sm-6">
                                      <div className="form-group">
                                        <label className="label-font-size">
                                          Specialization
                                          <span
                                            style={{
                                              color: "red",
                                            }}
                                          >
                                            *
                                          </span>
                                        </label>
                                        <br />
                                        <CreatableSelect
                                          placeholder="Select specialization"
                                          value={values.specialization}
                                          name="specialization"
                                          onChange={(option: any) => {
                                            let event = {
                                              target: {
                                                name: "specialization",
                                                value: option,
                                              },
                                            };
                                            handleChange(event);
                                            if (option == null) {
                                              touched.specialization = true;
                                              setFieldValue(
                                                "specialization",
                                                ""
                                              );
                                            }
                                          }}
                                          isClearable={false}
                                          isSearchable={true}
                                          options={specializationData}
                                          className={"dropstyle"}
                                          styles={customStyles}
                                          maxMenuHeight={200}
                                        />
                                        {errors.specialization &&
                                          touched.specialization && (
                                            <span className="form-error">
                                              {errors.specialization}
                                            </span>
                                          )}
                                      </div>
                                    </div>
                                  </>
                                )}
                                <div className="col-md-6 col-lg-6 col-sm-6">
                                  <div className="form-group">
                                    <label className="label-font-size">
                                      Certifications
                                    </label>
                                    <br />
                                    <AsyncCreatableSelect
                                      onBlur={setFieldTouched}
                                      className={"dropstyle"}
                                      name="certification"
                                      maxMenuHeight={200}
                                      isValidNewOption={isValidNewOption}
                                      isMulti
                                      components={components}
                                      noOptionsMessage={() =>
                                        "Enter keyword to search"
                                      }
                                      styles={customStyles}
                                      cacheOptions
                                      isClearable={false}
                                      value={values?.certification}
                                      onChange={(e: any) => {
                                        let event = {
                                          target: {
                                            name: "certification",
                                            value: e,
                                          },
                                        };
                                        handleChange(event);
                                        handleInputCertChanges(e?.value);
                                      }}
                                      placeholder="Select Certification Name"
                                      loadOptions={loadCertificateOptions}
                                    />
                                    {!errors.certification && (
                                      <p className="form-error">
                                        {certificateInputValue}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-md-12 col-lg-12 col-sm-12">
                                  <label className="label-font-size">
                                    Upload Resume
                                    <span
                                      style={{
                                        color: "red",
                                      }}
                                    >
                                      *
                                    </span>
                                  </label>
                                  <div
                                    id="attach_resume_bx"
                                    className="job-bx bg-white m-b30"
                                    style={{ fontSize: "13px" }}
                                  >
                                    <p className="c_content_desc">
                                      Resume is the most important document
                                      recruiters look for. Recruiters generally
                                      do not look at profiles without resumes.
                                    </p>
                                    {showDownloadBtn && (
                                      <div
                                        className="c_content_subheader"
                                        style={{
                                          display: "flex",

                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <p>
                                          <b>{values?.jdName?.split("-")[1]}</b>
                                        </p>

                                        <p title="Click here to download this file">
                                          <Link
                                            className="float-right"
                                            to={"#"}
                                            style={{
                                              color: "blue",
                                            }}
                                            onClick={() => {
                                              handleDownload();
                                            }}
                                          >
                                            <BsCloudDownload />
                                          </Link>
                                        </p>
                                      </div>
                                    )}
                                    <form className="attach-resume ">
                                      <div className="row">
                                        <div className="col-lg-12 col-md-12">
                                          {values.resume ? (
                                            <div className="jdfile d-flex justify-content-between isHotDiv">
                                              <div>
                                                <span className="c_content_desc word-break">
                                                  {values.resume?.name}
                                                </span>
                                              </div>

                                              <div onClick={deleteFile}>
                                                <IoCloseCircleOutline
                                                  style={{
                                                    color: "red",
                                                    fontSize: "20px",
                                                    cursor: "pointer",
                                                  }}
                                                />
                                              </div>
                                            </div>
                                          ) : (
                                            <div className="form-group">
                                              {undoFile && (
                                                <div
                                                  style={{
                                                    float: "right",
                                                  }}
                                                >
                                                  <button
                                                    type="button"
                                                    onClick={undoJdFile}
                                                    className="btn btn-sm"
                                                  >
                                                    Undo
                                                  </button>
                                                </div>
                                              )}

                                              <div className="custom-file d-block JP-RVlink">
                                                <p className="m-auto align-self-center Rupload">
                                                  <BsCloudUpload />
                                                  Upload{" "}
                                                  {values.jdName && "New"}{" "}
                                                  Resume
                                                </p>

                                                {notprotectedError ? (
                                                  <span className="form-error">
                                                    {notprotectedError}
                                                  </span>
                                                ) : (
                                                  ""
                                                )}

                                                {filesizeError ? (
                                                  <span className="form-error">
                                                    {filesizeError}
                                                  </span>
                                                ) : (
                                                  ""
                                                )}

                                                {resumeformatError ? (
                                                  <span className="form-error">
                                                    {resumeformatError}
                                                  </span>
                                                ) : (
                                                  ""
                                                )}

                                                <p
                                                  style={{ fontSize: "13px" }}
                                                  className="modal-custom-desc"
                                                >
                                                  {`Supported Formats: docx, pdf, upto ${resumeSize}`}
                                                  MB
                                                </p>

                                                <input
                                                  type="file"
                                                  className="site-button form-control"
                                                  id="customFile"
                                                  title=""
                                                  name="resume"
                                                  style={{
                                                    width: "100%",

                                                    height: "50%",
                                                  }}
                                                  onChange={(e) => {
                                                    CheckFile(e);
                                                  }}
                                                />
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </form>
                                  </div>
                                  {errors?.resume && touched?.resume && (
                                    <p
                                      className="form-error"
                                      style={{
                                        marginTop: "-25px",
                                      }}
                                    >
                                      {errors.resume}
                                    </p>
                                  )}
                                </div>

                                <div className="col-md-12 col-lg-12 col-sm-12">
                                  <label className="font-weight-700 label-font-size">
                                    Reason for Apply
                                    <span className="maditory">*</span>
                                  </label>

                                  <textarea
                                    style={{
                                      height: "80%",
                                    }}
                                    name="reason"
                                    id="reason"
                                    autoComplete="off"
                                    maxLength={1000}
                                    rows={3}
                                    placeholder="Type resaon for apply"
                                    onChange={(e) => {
                                      handleChange(e);
                                      setCount(e.target.value.length);
                                    }}
                                    value={values?.reason}
                                    onBlur={handleBlur}
                                    className="form-control"
                                  ></textarea>
                                  <div className="d-flex justify-content-between">
                                    <div>
                                      {errors?.reason && touched?.reason && (
                                        <p className="form-error">
                                          {errors.reason}
                                        </p>
                                      )}
                                    </div>
                                    <span className="custom-char-count">
                                      {1000 - count} Character(s) left
                                    </span>
                                  </div>
                                  <br />
                                </div>
                              </div>
                              <br />
                              <div className="d-flex justify-content-end m-b10">
                                <button
                                  type="submit"
                                  className="site-button"
                                  onClick={() => {
                                    handleSubmit();
                                  }}
                                  // disabled={appliedErr}
                                >
                                  {loading && (
                                    <i
                                      className="fa fa-circle-o-notch fa-spin"
                                      style={{ marginRight: "10px" }}
                                    ></i>
                                  )}
                                  {loading ? "Applying..." : "Apply"}
                                </button>
                              </div>
                            </>
                          </div>
                        );
                      }}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal show={verifyemail} className="modal fade modal-bx-info editor">
        <div className="modal-dialog my-0  mx-0 w-100 " role="document">
          <div className="modal-content">
            <div className="modal-body">
              <div>
                <div
                  className="d-flex justify-content-between"
                  style={{
                    borderBottom: "1px solid #e9ecef",
                    // paddingBottom: "18px",
                    // marginBottom: "10px",
                  }}
                >
                  <h6
                    style={{
                      textAlign: "center",
                      color: "#0070a6",
                      fontFamily: "Montserrat",
                    }}
                  >
                    VERIFY EMAIL
                  </h6>
                  <button
                    className="close"
                    style={{
                      float: "right",
                    }}
                    onClick={() => {
                      setVerifyemail(false);
                      // setLoader2(false);
                      setOtp(new Array(6).fill(""));
                      setTime("");
                    }}
                  >
                    <i
                      className="fa fa-times model-close"
                      onClick={() => setOtp(new Array(6).fill(""))}
                    ></i>
                  </button>
                </div>
                <center>
                  <span style={{ fontFamily: "Montserrat" }}>
                    An OTP has been sent to the email address you provided.
                    Please verify the OTP to proceed with your job application.
                  </span>
                  <br></br>
                  <span>
                    {emailIdValue}{" "}
                    <i
                      style={{
                        color: "#14377c",
                        cursor: "pointer",
                      }}
                      className="fa fa-light fa-pencil"
                      onClick={() => {
                        setEmailver(true);
                        setVerifyemail(false);
                        setLoader(false);
                        setOtp(new Array(6).fill(""));
                        setLoader2(false);
                        setErr("");
                      }}
                    ></i>
                  </span>
                  {mins > 9 && secs > 9 && (
                    <p style={{ fontSize: "10px" }}>
                      OTP will expire in{" "}
                      <span className="badge badge-pill badge-info">
                        {mins}:{secs}
                      </span>{" "}
                      mins
                    </p>
                  )}
                  {mins < 10 && secs > 9 && (
                    <p style={{ fontSize: "10px" }}>
                      OTP will expire in{" "}
                      <span className="badge badge-pill badge-info">
                        0{mins}:{secs}
                      </span>{" "}
                      mins
                    </p>
                  )}
                  {mins > 9 && secs < 10 && (
                    <p style={{ fontSize: "10px" }}>
                      OTP will expire in{" "}
                      <span className="badge badge-pill badge-info">
                        {mins}:0{secs}
                      </span>{" "}
                      mins
                    </p>
                  )}
                  {mins < 10 && secs < 10 && (
                    <p style={{ fontSize: "10px" }}>
                      OTP will expire in{" "}
                      <span className="badge badge-pill badge-info">
                        0{mins}:0{secs}
                      </span>{" "}
                      mins
                    </p>
                  )}
                  {verifyemail &&
                    otp?.map((_, idx) => (
                      <input
                        type="text"
                        style={{
                          width: "8%",
                          height: "40px",
                          textAlign: "center",
                          marginRight: "3px",
                        }}
                        placeholder="_"
                        maxLength={1}
                        minLength={1}
                        ref={idx === activeOtpIndex ? inputRef : null}
                        onChange={(e) =>
                          regex.numberTyping.test(e.target.value) &&
                          otpChanges(e, idx)
                        }
                        value={otp[idx]}
                        onKeyDown={(e) => otpKeyChanges(e, idx)}
                      />
                    ))}
                  <br />
                  {
                    <span
                      style={{
                        color: "red",
                        fontSize: "13px",
                      }}
                    >
                      {err}
                    </span>
                  }
                  <br></br>
                  <br></br>
                  {otp.join("").length === 6 && time !== 0 && (
                    <button
                      type="button"
                      className="site-button border border-primary btn-sm"
                      disabled={otp.join("").length === 6 ? false : true}
                      style={{
                        background: "white",
                        color: "#2e55fa",
                        borderColor: "#2e55fa",
                        cursor: `${pointer}`,
                      }}
                      onClick={() => {
                        setLoader2(true);
                        setLoader3(false);
                        postHandler();
                      }}
                    >
                      {loader2 && (
                        <i
                          className="fa fa-circle-o-notch fa-spin"
                          style={{
                            marginRight: "10px",
                          }}
                        ></i>
                      )}
                      {loader2 ? "VERIFYING OTP" : "VERIFY OTP"}
                    </button>
                  )}
                  &nbsp;
                  {time == 0 && (
                    <button
                      type="button"
                      className="site-button border border-primary btn-sm"
                      style={{
                        background: "white",
                        color: "#2e55fa",
                        borderColor: "#2e55fa",
                        cursor: `${pointer}`,
                      }}
                      onClick={() => {
                        setLoader2(false);
                        setLoader3(true);
                        sendOtp_resend();
                        setTime(Number(environment.otp_time_sec));
                        // setLoader3(false);
                      }}
                    >
                      {loader3 && (
                        <i
                          className="fa fa-circle-o-notch fa-spin"
                          style={{
                            marginRight: "10px",
                          }}
                        ></i>
                      )}
                      {loader3 ? "RESENDING OTP" : "RESEND OTP"}
                    </button>
                  )}
                </center>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {appliedDiv && (
        <center>
          <div
            className="coustomLoader"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              fontSize: "1.5rem",
            }}
          >
            <h6
              style={{
                color: "#207c20cf",
                fontSize: "40px",
                fontFamily: "fantasy",
              }}
            >
              Job Applied Successfully.
            </h6>
          </div>
        </center>
      )}
      {fetchJobErr && (
        <center>
          <div
            className="coustomLoader"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              fontSize: "1.5rem",
            }}
          >
            <h6
              style={{
                color: "rgb(223 36 15 / 81%)",
                fontSize: "40px",
                fontFamily: "fantasy",
              }}
            >
              {fetchValidJobRes?.response?.data?.message}
            </h6>
          </div>
        </center>
      )}
      {/* {!appliedDiv && (
        <center>
          <div
            className="coustomLoader"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              fontSize: "1.5rem",
            }}
          >
            <h6
              style={{
                color: "rgb(223 36 15 / 81%)",
                fontSize: "40px",
                fontFamily: "fantasy",
              }}
            >
              Job has already Expired.
            </h6>
          </div>
        </center>
      )} */}
    </>
  );
}

export default IJPApply;
