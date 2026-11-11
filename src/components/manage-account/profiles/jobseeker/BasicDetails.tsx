import { ChangeEvent, useEffect, useRef, useState } from "react";
import Select from "react-select";
import * as Yup from "yup";
import { Form, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ProfileStateType } from "./jobseekertypes";
import { Formik } from "formik";
import numWords from "num-words";
import {
  GetDaysInMonth,
  GetFutureYears,
  GetMonthOfExp,
  GetMonths,
  GetYearOfExp,
  createData,
  GetYearFromTimeStamp,
  GetMonthNameFromTimeStamp,
  GetDayFromTimeStamp,
  Content,
  bytesToMegabytes,
} from "../../../../common/common";
import { useDispatch, useSelector } from "react-redux";
import {
  profileStrength,
  resetBasicDetSl,
  updateBasicDetails,
} from "../../../../redux/features/manage-account/profile/BasicDetailsSlice";
import Salary from "../../../shared/Salary";
import { downloadImage } from "../../../../redux/features/manage-account/profile/userFilesSlice";
import {
  resetsendotpAction,
  sendOtp,
} from "../../../../redux/features/authentication/sendOtpSlice";
import {
  resetVerifyOtpSl,
  verifyOtp,
} from "../../../../redux/features/authentication/jobseekerVerifyOtpSlice";
import { UseToastAlert } from "../../../../hooks/useToastAlert";
import { getProfileDetails } from "../../../../redux/features/manage-account/profile/EmployerProfileSlice";
import { getJobSeekerrData } from "../../../../redux/features/manage-account/profile/JsSlice";
import {
  BsExclamationLg,
  BsFillCheckCircleFill,
  BsPencil,
} from "react-icons/bs";

import {
  jobSeekerprofile,
  resetProfile,
} from "../../../../redux/features/manage-account/profile/JobSeekerProfileSlice";
import { environment } from "../../../../environments/environment";
import { getCountryCode } from "../../../../redux/features/masterData/countrySlice";
import AsyncCreatableSelect from "react-select/async-creatable";
import numberToWords from "number-to-words";
import { style } from "@mui/system";
import { regex } from "../../../../common/validation";
import { locationsMasterData } from "../../../../ApiCall/masterData";
import { validateUser } from "../../../../redux/features/authentication/userMailSlice";

var bnr = require("../../../../assets/images/banner/bnr1.jpg");

export interface ExpertiseOption {
  readonly value: string;
  readonly label: string;
}
interface ColourOption {
  label: string;
  value: string;
}
const FORM_VALIDATION = Yup.object().shape({
  name: Yup.string()
    .required("Name is required.")
    .matches(regex.fullName, "Numeric and special characters are not allowed.")
    .trim("Empty space not allowed.")
    .min(1, "Full Name must contains minimum 1 characters."),
  expYear: Yup.object().when("isFresher", {
    is: "false",
    then: Yup.object().required("Please select Experience Year.").nullable(),
  }),
  expMonth: Yup.object().when("isFresher", {
    is: "false",
    then: Yup.object().required("Please select Experience Month.").nullable(),
  }),
  currency: Yup.object().nullable(),
  salary: Yup.string()
    .nullable()
    .when("isFresher", {
      is: "false",
      then: Yup.string()
        .required("Please specify your Current Salary.")
        .nullable(),
    }),
  country: Yup.object()
    .when("rdoLocation", {
      is: "outside",
      then: Yup.object().required("Please select Country.").nullable(),
    })
    .nullable(),
  mobile: Yup.string()
    .required("Please enter Mobile Number.")
    .matches(regex.indian_mobile, "Please enter valid Mobile Number.")
    .nullable(),
  countryCode: Yup.string(),
  countryCodeTelph: Yup.string(),
  areaCode: Yup.string(),
  phoneNumber: Yup.number(),
  noticePeriod: Yup.string().nullable(),
  noticePeriodYear: Yup.object()
    .nullable()
    .when("noticePeriod", {
      is: "Serving Notice Period",
      then: Yup.object().required("Please select Year.").nullable(),
    }),
  noticePeriodMonth: Yup.object()
    .nullable()
    .when("noticePeriod", {
      is: "Serving Notice Period",
      then: Yup.object().required("Please select Month.").nullable(),
    }),
  location: Yup.object()
    .nullable()
    .when("rdoLocation", {
      is: "India",
      then: Yup.object().required("Please select your Location.").nullable(),
    }),
  locationOther: Yup.string().when("rdoLocation", {
    is: "outside",
    then: Yup.string().required("Please specify City."),
    // .matches(regex.locationRegex, "Location contains only alphabet's, Space and (, - ' . )."),
  }),
  noticePeriodDay: Yup.object()
    .nullable()
    .when("noticePeriod", {
      is: "Serving Notice Period",
      then: Yup.object().required("Please select Day.").nullable(),
    }),
  isFresher: Yup.string(),
  rdoLocation: Yup.string(),
  availability: Yup.object().nullable(),
});

let countriesCode = new Array<Country>();
interface Country {
  value: string;
  label: string;
  phone: string;
}

type propsState = {
  displayModel?: boolean;
  trigger?: any;
};

function BasicDetails({ displayModel, trigger }: propsState) {
  const INITIAL_FORM_STATE = {
    name: "",
    expYear: "",
    expMonth: "",
    currency: "INR",
    salary: "",
    location: null,
    country: null,
    mobile: "",
    countryCode: "",
    countryCodeTelph: "",
    areaCode: "",
    phoneNumber: "",
    noticePeriod: "",
    noticePeriodYear: null,
    noticePeriodMonth: null,
    noticePeriodDay: null,
    isFresher: true,
    availability: "",
    locationOther: "",
  };

  const [mobileNumber, setMobileNumber] = useState();
  const [basicdetails, setBasicDetails] = useState(false);
  const [salary, setSalary] = useState<any>();
  const [basicDetailsData, setBasicDetailsData] = useState<any>();

  const [verifyemail, setVerifyemail] = useState(false);
  const [email, setEmail] = useState("");
  const [emailErr1, setEmailErr1] = useState(false);
  const [expYear, setExpYear] = useState<any>();
  const [expMonth, setExpMonth] = useState<any>();

  const [loader5, setLoader5] = useState(false);
  const [loader3, setLoader3] = useState(false);
  const [showmoney, setShowmoney] = useState(false);
  const [loader7, setLoader7] = useState(false);
  const [loader10, setLoader10] = useState(false);
  const { CountryCode } = useSelector((state: any) => state.countryCode);
  const editRef = useRef<any>();

  const [disOtrCountryCty, setDisOtrCountryCty] = useState(false);
  const [selectWorking, setSelectWorking] = useState<boolean>(false);

  const [selectNoticePeriod, setSelectNoticePeriod] = useState<any>(null);
  const [selectAvail, setSelectAvail] = useState<any>(null);
  const [yearDisplpay, setYearDisplay] = useState<boolean>(false);
  const [countryDisplpay, setCountryDisplay] = useState<boolean>(false);

  const [employmentData, setEmploymentData] = useState<any>([]);
  const [basicInfo, setBaicInfo] = useState<any>();
  const [day, setDay] = useState<any>();
  const [month, setMonth] = useState<any>();
  const [year, setYear] = useState<any>();
  const [countriesName, setCountriesName] = useState<any>("");
  const [availabilityIn, setAvailability] = useState(true);
  const [emp, setEmp] = useState<any>([]);
  const [editValues, setEditValues] = useState<any>(null);
  const [radioBtn, setRadioBtn] = useState<any>(true);
  const [showEdu, setShowEdu] = useState<any>(false);
  const [showEmp, setShowEmp] = useState<any>(false);
  const [eduData, setEduData] = useState<any>();
  const [degree, setDegree] = useState<any>();
  const [verifynum, setVerifynum] = useState(false);
  const [numver, setNumver] = useState(false);
  const [number, setNumber] = useState("");
  const [pointer, setPointer] = useState("pointer");
  const [numErr1, setNumErr1] = useState(false);
  const [time, setTime] = useState(59);
  const [activeOtpIndex, setActiveOtpIndex] = useState(0);
  const [profileStr, setProfileStr] = useState<any>();
  const [otp, setOtp] = useState<any>(new Array(6).fill(""));
  const inputRef = useRef<HTMLInputElement>(null);
  const [emailver, setEmailver] = useState<any>(false);
  const [strength, setStrength] = useState<string>("");
  const [mins, setMins] = useState(0);
  const [secs, setSecs] = useState(0);
  const [cv, setCv] = useState<any>();
  const [currencyvalue, setCurrencyvalue] = useState<any>("en-IN");
  const [sal, setSal] = useState<any>("");
  const [careerProfileData, setCareerProfileData] = useState<any>();
  const [hideContect, setHideContent] = useState(true);
  const [hideModel, setHideModel] = useState(true);
  const basicData = useSelector((state: any) => state.basicDetails);
  const { BasicDetails, loadingBS } = basicData;
  const dispatch = useDispatch();
  const showSnackAlert = UseToastAlert();
  const UploadPicture = useSelector((state: any) => state.jobseekerProfile);
  const { response, loadingg, errors } = UploadPicture;
  const [mobileErr, setMobileErr] = useState(false);
  const { UserCheck, loadingU } = useSelector(
    (state: any) => state.userMailVerify
  );
  const sendJsOtp = useSelector((state: any) => state.sendOtp);
  const { otpRes } = sendJsOtp;

  const verifyJobseekerOtp = useSelector(
    (state: any) => state.jobseekerotpVerify
  );
  const [txn_id, setTxn_id] = useState("");
  const { res, loadingState, otpError } = verifyJobseekerOtp;
  const [ind, setInd] = useState(true);
  const [us, setUS] = useState(false);
  const [dis, setDis] = useState<any>();

  const profileImageSize = bytesToMegabytes(
    Number(environment.profileImageSize)
  );

  useEffect(() => {
    if (typeof salary === "string") setDis(true);
    else if (typeof salary === "string") setDis(false);
    else setDis(false);
  }, [salary, setDis]);

  useEffect(() => { }, [expYear, expMonth]);
  useEffect(() => {
    if (displayModel) {
      setHideContent(false);
      setHideModel(true);
    } else {
      setHideContent(true);
      setHideModel(true);
    }
    setTimeout(() => {
      editRef?.current?.click();
    }, 0);
  }, [displayModel]);

  const handleSalaryChangeInWords = (event) => {
    const newSalary = Number(event.target.value.replace(/\,/g, ""));
    setSalary(newSalary);
  };
  useEffect(() => { }, [degree]);

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

  useEffect(() => {
    if (otpRes?.code === 200) {
      setTxn_id(otpRes?.data?.txn_id);
      dispatch(resetsendotpAction());
    }
  }, [txn_id, otpRes]);

  const components = {
    DropdownIndicator: null,
  };
  const customFilter = (option, searchText) => {
    if (
      option.data.label.toLowerCase().includes(searchText.toLowerCase()) ||
      option.data.phone.toLowerCase().includes(searchText.toLowerCase())
    ) {
      return true;
    } else {
      return false;
    }
  };

  const [mobileVrfMsg, SetModileVrfMsg] = useState("");
  const [formreset, SetFormReset] = useState(false);

  const setTimeFunc = () => {
    setTime(Number(environment?.otp_time_sec));
  };

  useEffect(() => {
    if (BasicDetails?.response?.data?.code === 400) {
      SetModileVrfMsg("Entered Phone Number already exists.");
      dispatch(resetBasicDetSl());
    }
    if (BasicDetails?.code && BasicDetails?.message) {
      if (BasicDetails.code === 200) {
        showSnackAlert("success", BasicDetails.message);
        dispatch(getJobSeekerrData());
        dispatch(profileStrength());
        dispatch(resetBasicDetSl());
        setBasicDetails(false);
        SetFormReset(true);
      }
      if (BasicDetails.code === 500) {
        showSnackAlert("error", BasicDetails.message);
        dispatch(resetBasicDetSl());
      }

      if (BasicDetails.code === 206) {
        showSnackAlert("warning", BasicDetails.message);
        dispatch(resetBasicDetSl());
      }
    }
  }, [BasicDetails?.code, loadingBS, BasicDetails, mobileVrfMsg]);

  const bindingData = (e?: any) => {
    e.preventDefault();
    const mobileNo = basicDetailsData?.contact
      ? basicInfo?.contact?.primary?.phno
      : null;
    setMobileNumber(mobileNo);
    setSalary(careerProfileData.total_exp?.curr_ctc?.value);

    basicDetailsData?.location?.country === "India" ||
      basicDetailsData?.location?.country === null ||
      basicDetailsData?.location?.country === undefined ||
      basicDetailsData?.location?.country === ""
      ? setDisOtrCountryCty(false)
      : setDisOtrCountryCty(true);

    if (
      basicDetailsData?.location?.country === undefined ||
      basicDetailsData?.location?.country === null ||
      basicDetailsData?.location?.country === ""
    ) {
      setCountriesName(null);
    } else if (basicDetailsData?.location?.country !== "India")
      setCountriesName({
        label: basicDetailsData?.location?.country,
        value: basicDetailsData?.location?.country,
      });
    if (employmentData?.length && emp?.length) {
      setAvailability(false);
    } else {
      setAvailability(true);
    }
    if (employmentData?.length) {
      setRadioBtn(true);
      if (emp?.length) {
        setRadioBtn(false);
        setShowEmp(true);
        setShowEmp(true);
      } else {
        setShowEdu(true);
        setShowEmp(false);
      }
    } else {
      setRadioBtn(true);
    }
    if (
      careerProfileData &&
      careerProfileData?.total_exp &&
      careerProfileData?.total_exp.curr_ctc
    ) {
      setCurrencyvalue(
        careerProfileData?.total_exp?.curr_ctc?.currency === "USD"
          ? "en-US"
          : "en-IN"
      );
      careerProfileData?.total_exp?.curr_ctc?.value
        ? setSal(
          nf.format(
            Number(
              careerProfileData?.total_exp?.curr_ctc?.value
                ? careerProfileData?.total_exp?.curr_ctc?.value
                : ""
            )
          )
        )
        : setSal(null);
    } else {
      setSal("");
    }
    if (careerProfileData?.total_exp?.month === null) {
      setExpMonth("");
    } else {
      careerProfileData &&
        careerProfileData?.total_exp?.month >= 0 &&
        setExpMonth({
          label: `${careerProfileData.total_exp?.month}  ${careerProfileData?.total_exp?.month == 0 ||
              careerProfileData?.total_exp?.month == 1
              ? "Month"
              : "Months"
            }`,
          value: `${careerProfileData.total_exp?.month}  ${careerProfileData?.total_exp?.month == 0 ||
              careerProfileData?.total_exp?.month == 1
              ? "Month"
              : "Months"
            }`,
        });
    }
    if (careerProfileData.total_exp?.year === null) {
      setExpYear("");
    } else {
      careerProfileData &&
        careerProfileData.total_exp?.year >= 0 &&
        setExpYear({
          label: `${careerProfileData.total_exp?.year} ${careerProfileData?.total_exp?.year == 0 ||
              careerProfileData?.total_exp?.year == 1
              ? "Year"
              : "Years"
            }`,
          value: `${careerProfileData?.total_exp?.year} ${careerProfileData?.total_exp?.year == 0 ||
              careerProfileData?.total_exp?.year == 1
              ? "Year"
              : "Years"
            }`,
        });
    }
    basicDetailsData && emp.length && emp[0]?.fulltime?.notice_period?.end_ts
      ? setDay({
        label: `${GetDayFromTimeStamp(
          emp[0]?.fulltime?.notice_period?.end_ts
        )}`,
        value: `${GetDayFromTimeStamp(
          emp[0]?.fulltime?.notice_period.end_ts
        )}`,
      })
      : setDay(null);
    basicDetailsData && emp.length && emp[0]?.fulltime?.notice_period?.end_ts
      ? setMonth({
        label: `${GetMonthNameFromTimeStamp(
          emp[0]?.fulltime?.notice_period?.end_ts,
          true
        )}`,
        value: GetMonthNameFromTimeStamp(
          emp[0]?.fulltime?.notice_period?.end_ts,
          true,
          true
        ),
      })
      : setMonth(null);
    basicDetailsData && emp.length && emp[0]?.fulltime?.notice_period?.end_ts
      ? setYear({
        label: `${GetYearFromTimeStamp(
          emp[0]?.fulltime?.notice_period?.end_ts
        )}`,
        value: `${GetYearFromTimeStamp(
          emp[0]?.fulltime?.notice_period?.end_ts
        )}`,
      })
      : setYear(null);

    !loading &&
      careerProfileData &&
      setEditValues({
        availability: careerProfileData?.avail
          ? careerProfileData?.avail
          : null,

        name: basicInfo.name,
        currency: careerProfileData.total_exp?.curr_ctc?.currency
          ? careerProfileData.total_exp?.curr_ctc?.currency
          : "INR",

        isFresher: careerProfileData?.fresher
          ? `${careerProfileData?.fresher}`
          : "false",

        rdoLocation:
          basicDetailsData?.location?.country === "India" ||
            basicDetailsData?.location?.country === null ||
            basicDetailsData?.location?.country === undefined ||
            basicDetailsData?.location?.country === ""
            ? "India"
            : "outside",

        location:
          basicDetailsData?.location?.country === "India"
            ? {
              label: basicDetailsData?.location?.city,
              value: basicDetailsData?.location?.city,
            }
            : null,
        countryCode: basicDetailsData?.contact?.primary?.code
          ? basicInfo?.contact?.primary?.code
          : "+91",

        country:
          basicDetailsData?.location?.country === "" ||
            basicDetailsData?.location?.country === undefined ||
            basicDetailsData?.location?.country === null
            ? ""
            : basicDetailsData?.location?.country !== "India"
              ? {
                label: basicDetailsData?.location?.country,
                value: basicDetailsData?.location?.country,
              }
              : "",

        locationOther:
          basicDetailsData?.location?.country !== "India"
            ? basicDetailsData?.location?.city
            : "",
        phoneNumber:
          basicDetailsData?.contact && basicDetailsData?.contact[0]
            ? basicDetailsData?.contact[0]?.phno
            : "",

        countryCodeTelph:
          basicDetailsData?.contact && basicDetailsData?.contact[0]
            ? basicDetailsData?.contact[0]?.country_code
            : "",
        areaCode:
          basicDetailsData?.contact && basicDetailsData?.contact[0]
            ? basicDetailsData?.contact[0]?.area_code
            : "",
        mobile: basicDetailsData?.contact
          ? basicInfo?.contact?.primary?.phno
          : null,

        expMonth:
          careerProfileData?.total_exp?.month >= 0
            ? {
              label: `${careerProfileData?.total_exp?.month} ${careerProfileData?.total_exp?.month == 0 ||
                  careerProfileData?.total_exp?.month == 1
                  ? "Month"
                  : "Months"
                }`,
              value: `${careerProfileData?.total_exp?.month} ${careerProfileData?.total_exp?.month == 0 ||
                  careerProfileData?.total_exp?.month == 1
                  ? "Month"
                  : "Months"
                }`,
            }
            : null,
        expYear:
          careerProfileData.total_exp?.year >= 0
            ? {
              label: `${careerProfileData.total_exp?.year} ${careerProfileData?.total_exp?.year == 0 ||
                  careerProfileData?.total_exp?.year == 1
                  ? "Year"
                  : "Years"
                }`,
              value: `${careerProfileData.total_exp?.year} ${careerProfileData?.total_exp?.year == 0 ||
                  careerProfileData?.total_exp?.year == 1
                  ? "Year"
                  : "Years"
                }`,
            }
            : null,
        salary: careerProfileData.total_exp?.curr_ctc?.value
          ? String(careerProfileData.total_exp?.curr_ctc?.value)
          : null,
        noticePeriod:
          emp?.length && emp[0]?.fulltime?.notice_period.term
            ? emp[0]?.fulltime?.notice_period.term
            : "",
        noticePeriodYear:
          emp?.length && emp[0]?.fulltime?.notice_period.end_ts
            ? {
              label: `${GetYearFromTimeStamp(
                emp[0]?.fulltime?.notice_period?.end_ts
              )}`,
              value: `${GetYearFromTimeStamp(
                emp[0]?.fulltime?.notice_period?.end_ts
              )}`,
            }
            : null,
        noticePeriodMonth:
          emp?.length && emp[0]?.fulltime?.notice_period.end_ts
            ? {
              label: `${GetMonthNameFromTimeStamp(
                emp[0]?.fulltime?.notice_period?.end_ts,
                true
              )}`,
              value: GetMonthNameFromTimeStamp(
                emp[0]?.fulltime?.notice_period?.end_ts,
                true,
                true
              ),
            }
            : null,
        noticePeriodDay:
          emp?.length && emp[0]?.fulltime?.notice_period.end_ts
            ? {
              label: `${GetDayFromTimeStamp(
                emp[0]?.fulltime?.notice_period?.end_ts
              )}`,
              value: GetDayFromTimeStamp(
                emp[0]?.fulltime?.notice_period?.end_ts
              ),
            }
            : null,
      });

    emp.length && emp[0]?.fulltime?.notice_period.term
      ? setSelectNoticePeriod({
        label: emp[0].fulltime?.notice_period?.term,
        value: emp[0].fulltime?.notice_period?.term,
      })
      : setSelectNoticePeriod(null);

    getRupeeText();
    getDollarText();
    setBasicDetails(true);
  };
  useEffect(() => { }, [salary]);

  const handleProfileChange = (e: any) => {
    let regexImg = new RegExp(
      /[^\s]+(.*?).(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/
    );
    const image = e.target?.files[0].type;
    const imageName = e.target.files[0].name;
    if (!regex.imageNameRegex.test(imageName))
      showSnackAlert("warning", "Please give valid Image Name, without # % .");
    else {
      if (image) {
        if (regexImg.test(image) == true) {
          if (e.target?.files[0].size > environment.profileImageSize) {
            showSnackAlert(
              "warning",
              `Image size should not exceed ${profileImageSize}MB.`
            );
          } else {
            let formData = new FormData();
            formData.append("image", e.target?.files[0]);
            dispatch(jobSeekerprofile(formData));
          }
        } else {
          showSnackAlert("warning", "Please select a valid image.");
        }
      }
    }
  };

  useEffect(() => {
    if (response?.code === 200) {
      showSnackAlert("success", "Your Profile picture uploaded sucessfully.");
      dispatch(downloadImage());
      dispatch(profileStrength());
      setTimeout(() => {
        dispatch(resetProfile());
      }, 1000);
    } else if (response?.code === 206) {
      showSnackAlert("warning", response.message);
    } else if (
      UploadPicture &&
      UploadPicture.response &&
      UploadPicture.response.response &&
      UploadPicture.response?.code !== 200
    ) {
      showSnackAlert("warning", response.message);
      setTimeout(() => {
        dispatch(resetProfile());
      }, 1000);
    }
  }, [response.code, response]);

  useEffect(() => {
    if (res.code === 200) {
      showSnackAlert("success", res.message);
      setLoader5(false);
      setLoader10(false);
      setVerifyemail(false);
      setVerifynum(false);
      dispatch(getJobSeekerrData());
      dispatch(resetVerifyOtpSl());
      dispatch(profileStrength());
      setOtp(new Array(6).fill(""));
    } else if (res && res.response && res.response?.data.code !== 200) {
      showSnackAlert("warning", res?.response?.data?.message);
      setLoader5(false);
      setLoader10(false);
      dispatch(resetVerifyOtpSl());
      setOtp(new Array(6).fill(""));
    }
  }, [res, res?.response?.data]);

  const Emailmessage = () => {
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailErr1(true);
    } else {
      setEmailErr1(false);
      setEmailver(false);
    }
  };

  const verifyEmailbtn = () => {
    setVerifyemail(true);
    setTimeFunc();
    dispatch(
      sendOtp({
        to: email,
        user_id: basicInfo?.user_id,
        channel: "email",
      })
    );
  };

  const verifyMobileBtn = () => {
    setVerifynum(true);
    setTimeFunc();
    dispatch(
      sendOtp({
        to: `+91${number}`,
        user_id: basicInfo?.user_id,
        channel: "sms",
      })
    );
  };
  useEffect(() => {
    if (verifyemail) {
      const timer: any = time > 0 && setInterval(() => setTime(time - 1), 1000);
      setMins(Math.floor(time / 60));
      setSecs(time % 60);
      return () => clearInterval(timer);
    }
  }, [verifyemail, time]);

  useEffect(() => {
    if (verifynum) {
      const timer: any = time > 0 && setInterval(() => setTime(time - 1), 1000);
      setMins(Math.floor(time / 60));
      setSecs(time % 60);
      return () => clearInterval(timer);
    }
  }, [verifynum, time]);

  const MobileMessage = () => {
    if (!/^\d{10}$/.test(number)) {
      setNumErr1(true);
    } else {
      setNumErr1(false);
      setNumver(false);
    }
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
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOtpIndex]);
  useEffect(() => {
    time > 0 ? setPointer("default") : setPointer("pointer");
  }, [time]);

  const handleHideBasicDetails = () => {
    setBasicDetails(false);
  };

  const JobSeekerProfileData = useSelector(
    (state: any) => state.JobSeekerProfile2
  );
  const { JobSeekerProfile, loading, error } = JobSeekerProfileData;

  const profileStrengthRes = useSelector((state: any) => state.profileStrength);
  const { image, load } = useSelector((state: any) => state.downloadImage);
  const { pflStrnRes, loading2 } = profileStrengthRes;

  const yearmonthData = useSelector((state: any) => state.yearmonthMasterdata);
  const { allYearMonth } = yearmonthData,
    [yearData, setYearData] = useState<any>(),
    [monthData, setMonthData] = useState<any>(),
    [yearOfExpData, setYearOfExpData] = useState<any>(),
    [monthOfExpData, setMonthOfExpData] = useState<any>(),
    [monthOfExpDataBackUP, setMonthOfExpDataBackUP] = useState<any>();
  useEffect(() => {
    if (allYearMonth?.length > 0) {
      allYearMonth?.map((opt: any) => {
        if (opt.group === "PAYE") {
          let obj: any = [];
          opt.data.map((item: any, index) => {
            obj.push({ value: item, label: Number(item) });
          });
          setYearData(obj);
        }
      });
    }
    if (allYearMonth?.length > 0) {
      allYearMonth?.map((opt: any) => {
        if (opt.group === "GHMO") {
          let obj: any = [];
          opt.data.map((item: any, index) => {
            obj.push({ label: item.value, value: item.id });
          });
          setMonthData(obj);
        }
      });
    }
    if (allYearMonth?.length > 0) {
      allYearMonth?.map((opt: any) => {
        if (opt.group === "YOEP") {
          let obj: any = [];
          opt.data.map((item: any, index) => {
            obj.push({ value: item.id, label: item.value });
          });
          setYearOfExpData(obj);
        }
      });
    }
    if (allYearMonth?.length > 0) {
      allYearMonth?.map((opt: any) => {
        if (opt.group === "MOEP") {
          let obj: any = [];
          opt.data.map((item: any, index) => {
            obj.push({ value: item.id, label: item.value });
          });
          setMonthOfExpDataBackUP(obj);
        }
      });
    }
  }, [allYearMonth]);

  const [pendingAction, setPendingAction] = useState<any>([]);

  useEffect(() => {
    dispatch(profileStrength());
  }, []);
  useEffect(() => {
    if (!loading2) {
      setProfileStr(pflStrnRes);
    }
  }, [dispatch, loading2]);

  useEffect(() => {
    if (profileStr?.data) {
      if (
        profileStr?.data?.completionPercentage >= 0 &&
        profileStr?.data?.completionPercentage <= 30
      ) {
        setStrength("Poor");
      } else if (
        profileStr?.data?.completionPercentage >= 30 &&
        profileStr?.data?.completionPercentage <= 60
      ) {
        setStrength("Average");
      } else if (
        profileStr?.data?.completionPercentage >= 60 &&
        profileStr?.data?.completionPercentage <= 90
      ) {
        setStrength("Good");
      } else {
        setStrength("Excellent");
      }
    }
  }, [profileStr]);

  const [dayOptions, SetDayOptions] = useState<any>([]);

  const GetDayOptions = (year: number, month: number) => {
    SetDayOptions(GetDaysInMonth(year, "", month));
  };

  useEffect(() => {
    setBasicDetailsData(JobSeekerProfile?.js_profile?.profile);
    setEduData(JobSeekerProfile?.js_profile?.education);
    setBaicInfo(JobSeekerProfile?.acc_info);
    setCv(JobSeekerProfile?.js_profile?.career_profile?.cv);
    setEmploymentData(JobSeekerProfile?.js_profile?.employments);
    setCareerProfileData(JobSeekerProfile?.js_profile?.career_profile);
  }, [JobSeekerProfile?.js_profile, JobSeekerProfile?.js_profile?.education]);

  useEffect(() => {
    if (basicInfo?.contact?.primary?.email) {
      setEmail(basicInfo?.contact?.primary?.email);
    }
    if (basicInfo?.contact?.primary?.phno) {
      setNumber(basicInfo?.contact?.primary?.phno);
    }
  }, [basicInfo]);

  const [countries, setCountries] = useState<any>();
  const [selectedCountryCode, setSelectedCountryCode] = useState<any>();
  const [selectedCountryCodeTelph, setSelectedCountryCodeTelph] =
    useState<any>();
  useEffect(() => {
    dispatch(getCountryCode());
  }, []);
  const formatOptionLabel = (
    { label, phone }: Country,
    { context }: { context: string }
  ) => {
    if (context === "value") {
      return phone;
    }
    return (
      <div>
        {label} ({phone})
      </div>
    );
  };
  useEffect(() => {
    if (CountryCode) {
      let countryData: any = [];
      CountryCode?.data?.map((val: any) => {
        countryData.push(val.name);
      });
      setCountries(countryData);

      let countryCodeData: any = [];
      CountryCode?.data?.map((e: any, i: number) => {
        countries?.push({
          value: `${1 + i}`,
          label: e.name,
          phone: e.code,
        });
      });
    }
    if (CountryCode) {
      CountryCode?.data?.map((e: any, i: number) => {
        countriesCode.push({
          value: `${1 + i}`,
          label: e.name,
          phone: e.code,
        });
      });
    }
  }, [CountryCode]);

  useEffect(() => {
    if (employmentData) {
      const data = employmentData?.filter((emp: any) => {
        if (emp.work_till === null && emp.fulltime) {
          return emp;
        }
      });
      setEmp(data);
    }
  }, [employmentData]);

  const pendingAct: any = [];

  const [pendingEmp, setPendingEmp] = useState(false);
  useEffect(() => {
    if (employmentData?.length > 0) {
      employmentData?.map((e: any) => {
        if (!e.work_till) {
          if (!e.fulltime.job_desc) {
            setPendingEmp(true);
          }
        }
      });
    }
  }, [employmentData]);

  const [codeDis, setCodeDis] = useState(false);
  useEffect(() => {
    if (basicInfo?.ph_verified) {
      setCodeDis(true);
    } else {
      setCodeDis(false);
    }
  }, [basicInfo]);

  useEffect(() => {
    if (basicInfo) {
      if (!JobSeekerProfile?.acc_info?.contact?.primary?.phno) {
        pendingAct.push({ name: "Add Mobile Number" });
      }

      if (
        JobSeekerProfile?.acc_info?.contact?.primary?.phno &&
        !basicInfo.ph_verified
      ) {
        pendingAct.push({ name: "Verify Mobile Number" });
      }

      if (!basicInfo.email_verified) {
        pendingAct.push({ name: "Verify Email ID" });
      }

      if (!cv?.name) {
        pendingAct.push({ name: "Add Resume" });
      }

      if (!basicDetailsData?.intro_video?.name) {
        pendingAct.push({ name: "Add Intro Video" });
      }

      if (!JobSeekerProfile?.js_profile?.profile?.image?.name) {
        pendingAct.push({ name: "Add Profile Picture" });
      }

      if (JobSeekerProfile?.js_profile?.languages?.length < 1) {
        pendingAct.push({ name: "Add Languages" });
      }

      if (JobSeekerProfile?.js_profile?.skills?.key?.length < 1) {
        pendingAct.push({ name: "Add Key Skills" });
      }

      if (
        JobSeekerProfile?.js_profile?.career_profile?.fresher === false ||
        JobSeekerProfile?.js_profile?.career_profile?.fresher === null
      ) {
        if (!JobSeekerProfile?.js_profile?.career_profile?.summary) {
          pendingAct.push({ name: "Add Summary" });
        }
      }

      if (!JobSeekerProfile?.js_profile?.career_profile?.headline) {
        pendingAct.push({ name: "Add Resume Headline" });
      }

      if (JobSeekerProfile?.js_profile?.career_profile?.location?.length < 1) {
        pendingAct.push({ name: "Add Desired Job Location" });
      }

      if (!JobSeekerProfile?.js_profile?.career_profile?.dept) {
        pendingAct.push({ name: "Add Department" });
      }

      if (!JobSeekerProfile?.js_profile?.career_profile?.industry) {
        pendingAct.push({ name: "Add Industry Type" });
      }

      if (
        JobSeekerProfile?.js_profile?.education?.schools?.length < 1 &&
        JobSeekerProfile?.js_profile?.education?.degree?.length < 1
      ) {
        pendingAct.push({ name: "Add Education" });
      }

      if (JobSeekerProfile?.js_profile?.career_profile?.fresher === true) {
        if (JobSeekerProfile?.js_profile?.project?.length < 1) {
          pendingAct.push({ name: "Add Project" });
        }
      }

      if (!JobSeekerProfile?.js_profile?.profile?.dob) {
        pendingAct.push({ name: "Add Personal Details" });
      } else if (!JobSeekerProfile?.js_profile?.profile?.gender) {
        pendingAct.push({ name: "Add Personal Details" });
      }
      if (!JobSeekerProfile?.js_profile?.career_profile?.fresher) {
        if (JobSeekerProfile?.js_profile?.employments?.length > 0) {
          JobSeekerProfile?.js_profile?.employments?.map((data: any) => {
            if (!data.work_till) {
              if (!data?.fulltime?.job_desc || !data?.company) {
                pendingAct.push({
                  name: "Add Job Profile",
                });
              }
            }
          });
        } else if (JobSeekerProfile?.js_profile?.employments?.length === 0) {
          pendingAct.push({ name: "Add Job Profile" });
        }
      }

      setPendingAction([...pendingAct]);
    }
  }, [JobSeekerProfile, basicInfo, careerProfileData?.location]);

  let data: any = [];
  let data2: any = [];
  useEffect(() => {
    if (eduData) {
      if (eduData?.degree?.length > 0) {
        data = eduData?.degree?.filter((edu: any) => {
          return edu?.edu_type === "Doctorate/PhD";
        });

        if (data.length === 0) {
          data = eduData?.degree.filter((edu: any) => {
            return edu?.edu_type === "Masters/Post-Graduation";
          });
          if (data.length === 0) {
            data = eduData?.degree.filter((edu: any) => {
              return edu?.edu_type === "Graduation/Diploma";
            });
          }
          if (data.length === 0) {
            data = eduData?.degree.filter((edu: any) => {
              return edu?.edu_type === "Batchelor/Under-Graduation";
            });
          }
        }

        data2 = data?.sort(
          (a: any, b: any) => b.completion_year - a.completion_year
        );
        setDegree(data2.length > 1 ? data2[0] : data2[0]);
      }
    } else {
      data = eduData?.schools?.find((c: any) => c.edu_type === "12th")
        ? []
        : [];
    }
  }, [JobSeekerProfile, eduData]);

  useEffect(() => {
    dispatch(downloadImage());
  }, []);
  const nf = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });
  const ChangeSalary = (cValue, salary) => {
    const nf2 = new Intl.NumberFormat(cValue, { maximumFractionDigits: 2 });
    if (salary) {
      setSal(nf2.format(salary.replace(/\,/g, "")));
    }
    setCurrencyvalue(cValue);
  };

  const masterDatas = useSelector((state: any) => state.jobSeekerMasterData);
  const { JSMasterData } = masterDatas;
  const [notice, setnotice] = useState<any>([]);
  const [availablity, setAvailablity] = useState<any>([]);

  useEffect(() => {
    if (JSMasterData?.length > 0) {
      JSMasterData.map((opt: any) => {
        if (opt.group === "NPRD") {
          let obj: any = [];
          opt.data.map((item: any, index) => {
            obj.push({ label: item.value, value: item.id });
          });
          setnotice(obj);
        }
      });
    }
  }, [JSMasterData]);

  useEffect(() => {
    if (availablity) {
      let data: any[] = notice;
      data = data.slice(0, 5);
      setAvailablity([...data]);
    }
  }, [notice]);

  const masterLocationData = useSelector(
    (state: any) => state.LocationCitiesData
  );
  const { LocationcityData } = masterLocationData;
  const [locCity, setLocCity] = useState<any>([]);
  useEffect(() => {
    if (LocationcityData?.length > 0) {
      setLocCity(
        LocationcityData?.map((c: any) => {
          return {
            label: c,
            value: c,
          };
        })
      );
    }
  }, [LocationcityData]);

  const reset = () => {
    setExpYear(null);
    setExpMonth(null);
    setSal(null);
    setSalary(null);
  };
  useEffect(() => {
    if (UserCheck && UserCheck.code && UserCheck.code === 200) {
      if (
        UserCheck?.data[0]?.key === "phone" &&
        UserCheck?.data[0]?.exist === true
      ) {
        setMobileErr(true);
      } else if (
        UserCheck?.data[0]?.key === "phone" &&
        UserCheck?.data[0]?.exist === false
      ) {
        setMobileErr(false);
      }
    }
  }, [UserCheck]);
  const validatePhone = (e: any) => {
    e.preventDefault();
    const phone = regex.indian_mobile.test(e?.target?.value);
    if (phone && e?.target?.value !== basicInfo?.contact?.primary?.phno) {
      dispatch(
        validateUser({
          data: [
            { key: "phone", value: `${e?.target?.value}`, code: `+91` },
          ]
        })
      );
    }
    if (e?.target?.value === basicInfo?.contact?.primary?.phno)
      setMobileErr(false);
  };

  const changeMonthOfExpOptions = (option) => {
    if (option && option.value == 0) {
      let data: any = [];
      monthOfExpDataBackUP.forEach((c) => {
        if (c.value !== 0) {
          data.push(c);
        }
      });
      setMonthOfExpData(data);
    } else {
      setMonthOfExpData(monthOfExpDataBackUP);
    }
  };

  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue.replace(/[^a-zA-Z-.',\s]*$/, ""));
  };
  const textlmt = 15;
  return (
    <>
      <style>
        {`
            .addBtnOnHover:hover{
              text-decoration: underline;
              background-color: transparent;
              color: blue;
              cursor: pointer;
         }
       
           `}
      </style>
      <>
        <Formik
          initialValues={
            editValues || {
              ...INITIAL_FORM_STATE,
            }
          }
          enableReinitialize={true}
          validationSchema={FORM_VALIDATION}
          onSubmit={(values, { resetForm }) => {
            setShowmoney(false);
            values?.salary && typeof values?.salary !== "number"
              ? (values.salary = values.salary.replace(/\,/g, ""))
              : (values.salary = values.salary);
            let ExpYear = expYear?.label?.split(" ");
            let ExpMonth = expMonth?.label?.split(" ");
            let formData = {
              name: values.name,
              fresher: values.isFresher == "true" ? true : false,
              experience: {
                year: expYear ? Number(ExpYear[0]) : null,
                month: expMonth ? Number(ExpMonth[0]) : null,
                currency: values.currency,
                curr_ctc: Number(values.salary),
              },

              notice_period: {
                term: values.noticePeriod ? values.noticePeriod : "",
                end_ts:
                  values.noticePeriod === "Serving Notice Period" &&
                    values.noticePeriodYear &&
                    values.noticePeriodMonth &&
                    values.noticePeriodDay
                    ? new Date(
                      `${values.noticePeriodYear?.label}, ${Number(values.noticePeriodMonth?.value) + 1
                      },${Number(values.noticePeriodDay?.value) + 1}`
                    )
                      .toISOString()
                      .slice(0, 10)
                    : null,
              },
              curr_location: {
                city:
                  values.rdoLocation == "outside"
                    ? values?.locationOther
                    : values.location?.label,
                country:
                  values.rdoLocation == "outside"
                    ? values?.country?.label
                    : "India",
              },
              contacts: {
                type: [],
                country_code: values?.countryCodeTelph,
                area_code: values?.areaCode,
                phno: values?.phoneNumber,
              },

              phno: Number(mobileNumber),
              code: String(values.countryCode),
              join_after: values?.availability ? values?.availability : null,
            };
            if (emp?.length) {
              formData["expId"] = emp[0]?._id;
            }

            if (!mobileErr) {
              dispatch(updateBasicDetails(formData));
              formreset && resetForm();
            }
          }}
        >
          {(formik: any) => {
            const {
              values,
              handleChange,
              handleSubmit,
              errors,
              touched,
              handleBlur,
              isValid,
              dirty,
              setFieldValue,
              resetForm,
            } = formik;
            if (values.isFresher === "false") {
              setYearDisplay(true);
              setAvailability(false);
            } else {
              setYearDisplay(false);
              setAvailability(true);
            }
            if (emp?.length === 0) {
              setAvailability(true);
            } else {
              setAvailability(false);
            }

            if (selectNoticePeriod?.label === "Serving Notice Period") {
              setSelectWorking(true);
            } else {
              setSelectWorking(false);
            }

            return (
              <>
                {displayModel && (
                  <button
                    ref={editRef}
                    className="d-none"
                    onClick={(e: any) => {
                      bindingData(e);
                      setBasicDetails(true);
                    }}
                  ></button>
                )}
                {hideModel && (
                  <Modal
                    className="modal fade browse-job modal-bx-info editor"
                    show={basicdetails}
                    onHide={() => {
                      // handleHideBasicDetails();
                      // trigger && trigger(false);
                    }}
                  >
                    <div className="modal-dialog my-0" role="document">
                      <form
                        onSubmit={(e) => {
                          handleSubmit(e);
                        }}
                      >
                        <div className="modal-content">
                          <div className="modal-body">
                            <div className="modal-custom-header">
                              <h5
                                className="modal-title"
                                id="ProfilenameModalLongTitle"
                              >
                                Basic Details
                              </h5>
                              <button
                                type="button"
                                className="close"
                                onClick={() => {
                                  reset();
                                  resetForm();
                                  setBasicDetails(false);
                                  setShowmoney(false);
                                  trigger && trigger(false);
                                }}
                              >
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>
                            <div className="row">
                              <div className="col-lg-12 col-md-12">
                                <div className="form-group">
                                  <label>
                                    Name
                                    <span
                                      style={{
                                        color: "red",
                                      }}
                                    >
                                      *
                                    </span>
                                  </label>

                                  <input
                                    maxLength={150}
                                    type="text"
                                    name="name"
                                    onChange={handleChange}
                                    className="form-control"
                                    onBlur={handleBlur}
                                    value={values.name}
                                    placeholder="Enter Your Name"
                                  />
                                  {errors.name ? (
                                    <p className="form-error">{errors.name}</p>
                                  ) : null}
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                {!radioBtn &&
                                  (showEmp || showEdu) &&
                                  emp.length ? (
                                  <>
                                    <div
                                      style={{
                                        margin: "5px",
                                        marginBottom: "10px",
                                      }}
                                    >
                                      {" "}
                                      <p
                                        style={{
                                          marginBottom: "0px",
                                        }}
                                      >
                                        {" "}
                                        <b>{`${emp[0]?.fulltime?.role},${emp[0]?.company}`}</b>
                                      </p>
                                      <span
                                        style={{
                                          fontSize: "0.85em",
                                          color: "grey",
                                        }}
                                      >
                                        To edit go to Employment Section
                                      </span>
                                    </div>
                                  </>
                                ) : degree ? (
                                  <>
                                    <div
                                      style={{
                                        margin: "5px",
                                        marginBottom: "10px",
                                      }}
                                    >
                                      <p
                                        style={{
                                          marginBottom: "0px",
                                        }}
                                      >
                                        <b>{`${degree?.course}/${degree?.institute}`}</b>
                                      </p>
                                      <span
                                        style={{
                                          fontSize: "0.85em",
                                          color: "grey",
                                        }}
                                      >
                                        To edit go to Education Section
                                      </span>
                                    </div>
                                  </>
                                ) : null}
                              </div>
                              {radioBtn && (
                                <div className="col-lg-12 col-md-12">
                                  <div className="form-group">
                                    <div className="row">
                                      <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                        <div className="custom-control custom-radio">
                                          <input
                                            type="radio"
                                            name="isFresher"
                                            checked={
                                              values.isFresher === "true"
                                            }
                                            onChange={(e) => {
                                              if (e.target.checked) {
                                                setYearDisplay(false);
                                                setFieldValue("expMonth", "");
                                                setFieldValue("expYear", "");
                                                setFieldValue("salary", "");
                                                setFieldValue(
                                                  "currency",
                                                  "INR"
                                                );
                                                setExpMonth(null);
                                                setExpYear(null);
                                                setSal(null);
                                                setSalary(null);
                                              }
                                              handleChange(e);
                                            }}
                                            onBlur={handleBlur}
                                            value={"true"}
                                            className="custom-control-input"
                                            id="employ_yes"
                                          />
                                          <label
                                            className="custom-control-label"
                                            htmlFor="employ_yes"
                                          >
                                            Fresher
                                          </label>
                                        </div>
                                      </div>
                                      <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                        <div className="custom-control custom-radio">
                                          <input
                                            type="radio"
                                            name="isFresher"
                                            onChange={(e) => {
                                              handleChange(e);
                                              setFieldValue("expYear", "");
                                              setFieldValue("expMonth", "");
                                            }}
                                            onBlur={handleBlur}
                                            value={"false"}
                                            checked={
                                              values.isFresher === "false"
                                            }
                                            className="custom-control-input"
                                            id="employ_no"
                                          />
                                          <label
                                            className="custom-control-label"
                                            htmlFor="employ_no"
                                          >
                                            Experienced
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {yearDisplpay && (
                                <>
                                  <div className="col-lg-12 col-md-12">
                                    <div className="form-group">
                                      <label>
                                        Total Experience
                                        <span
                                          style={{
                                            color: "red",
                                          }}
                                        >
                                          *
                                        </span>
                                      </label>
                                      <div className="row">
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                          <div className="form-group">
                                            <Select
                                              placeholder="Total Years"
                                              isSearchable={true}
                                              isClearable={true}
                                              isDisabled={false}
                                              options={yearOfExpData}
                                              value={expYear}
                                              name="expYear"
                                              onChange={(
                                                selectedOption: any
                                              ) => {
                                                setExpYear(selectedOption);
                                                changeMonthOfExpOptions(
                                                  selectedOption
                                                );
                                                setFieldValue(
                                                  "expYear",
                                                  selectedOption
                                                );
                                              }}
                                              className="dropstyle"
                                            />
                                            {touched.expYear &&
                                              errors.expYear ? (
                                              <p className="form-error">
                                                {errors.expYear}
                                              </p>
                                            ) : null}
                                          </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                          <div className="form-group">
                                            <Select
                                              placeholder="Total Months"
                                              isSearchable={true}
                                              isClearable={true}
                                              isDisabled={false}
                                              options={monthOfExpData}
                                              value={expMonth}
                                              name="expMonth"
                                              onBlur={handleBlur}
                                              onChange={(
                                                selectedOption: any
                                              ) => {
                                                setExpMonth(selectedOption);
                                                setFieldValue(
                                                  "expMonth",
                                                  selectedOption
                                                );
                                              }}
                                              className="dropstyle"
                                            />
                                            {touched.expMonth &&
                                              errors.expMonth ? (
                                              <p className="form-error">
                                                {errors.expMonth}
                                              </p>
                                            ) : null}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-12 col-md-12">
                                    <div className="form-group">
                                      <label>
                                        Current Salary
                                        <span
                                          style={{
                                            color: "red",
                                          }}
                                        >
                                          *
                                        </span>
                                      </label>
                                      <div className="row">
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                          <div className="custom-control custom-radio">
                                            <input
                                              autoComplete="false"
                                              type="radio"
                                              className="custom-control-input"
                                              id="rupees"
                                              name="currency"
                                              value="INR"
                                              onChange={(e: any) => {
                                                handleChange(e);
                                                setTimeout(() => {
                                                  setInd(true);
                                                  setUS(false);
                                                  setShowmoney(true);
                                                  ChangeSalary("en-INR", sal);
                                                }, 0);
                                              }}
                                              checked={
                                                values.currency === "INR"
                                              }
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
                                              checked={
                                                values.currency === "USD"
                                              }
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
                                          <div className="form-group">
                                            <input
                                              type="text"
                                              min={0}
                                              className="form-control"
                                              name="salary"
                                              maxLength={11}
                                              onInput={(e: any) => {
                                                if (
                                                  /^[0-9,]+$/.test(
                                                    e.target.value
                                                  )
                                                ) {
                                                  setShowmoney(true);
                                                  handleChange(e);
                                                  handleSalaryChangeInWords(e);
                                                  e.target.value = nf.format(
                                                    e.target.value.replace(
                                                      /\,/g,
                                                      ""
                                                    )
                                                  );
                                                  setSal(e.target.value);
                                                  values.salary =
                                                    e.target.value;
                                                } else if (
                                                  e.target.value?.length == 0
                                                ) {
                                                  setSal("");
                                                  setSalary("");
                                                  values.salary = "";
                                                } else {
                                                  setSalary("");
                                                  setSal("");
                                                }
                                              }}
                                              placeholder="E.g. 4,50,000"
                                              value={sal != 0 ? sal : ""}
                                            />
                                            {touched.salary && errors.salary ? (
                                              <p className="form-error">
                                                {errors.salary}
                                              </p>
                                            ) : null}
                                            {ind && showmoney && sal != 0 && (
                                              <p
                                                className="fs-6  text-success"
                                                style={{
                                                  fontSize: "80%",
                                                }}
                                              >
                                                {getRupeeText()
                                                  ? getRupeeText() + " Rupees"
                                                  : ""}
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
                                    </div>
                                  </div>
                                </>
                              )}
                              <div className="col-lg-12 col-md-12">
                                <div className="form-group">
                                  <label>
                                    Current Location
                                    <span
                                      style={{
                                        color: "red",
                                      }}
                                    >
                                      *
                                    </span>
                                  </label>
                                  <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                      <div className="custom-control custom-radio">
                                        <input
                                          type="radio"
                                          className="custom-control-input"
                                          id="rdoIndia"
                                          value="India"
                                          checked={
                                            values.rdoLocation === "India"
                                          }
                                          name="rdoLocation"
                                          onChange={(e: any) => {
                                            handleChange(e);
                                            setCountryDisplay(false);
                                            setDisOtrCountryCty(false);
                                            values.locationOther = "";
                                            setCountriesName(null);
                                          }}
                                        />
                                        <label
                                          className="custom-control-label"
                                          htmlFor="rdoIndia"
                                        >
                                          India
                                        </label>
                                      </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                      <div className="custom-control custom-radio">
                                        <input
                                          type="radio"
                                          className="custom-control-input"
                                          id="rdoOutside"
                                          value="outside"
                                          checked={
                                            values.rdoLocation === "outside"
                                          }
                                          name="rdoLocation"
                                          onChange={(e: any) => {
                                            handleChange(e);
                                            setCountryDisplay(true);
                                            setDisOtrCountryCty(true);
                                            values.location = "";
                                          }}
                                        />
                                        <label
                                          className="custom-control-label"
                                          htmlFor="rdoOutside"
                                        >
                                          Outside India
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="form-group">
                                  <div className="row">
                                    <div className="col-lg-6 col-md-6">
                                      <div className="form-group">
                                        {!disOtrCountryCty && (
                                          <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            isClearable={false}
                                            isSearchable={true}
                                            value={values.location}
                                            name="location"
                                            onChange={(e: any) => {
                                              let event = {
                                                target: {
                                                  name: "location",
                                                  value: e,
                                                },
                                              };
                                              handleChange(event);
                                            }}
                                            options={locCity}
                                            placeholder="Tell us about your current location"
                                          />
                                        )}
                                        {!disOtrCountryCty &&
                                          touched.location &&
                                          errors.location ? (
                                          <p className="form-error">
                                            {errors.location}
                                          </p>
                                        ) : null}
                                        {disOtrCountryCty && (
                                          <input
                                            type="text"
                                            className="form-control"
                                            name="locationOther"
                                            value={values.locationOther}
                                            maxLength={100}
                                            placeholder="Tell us about your current location"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                          />
                                        )}
                                        {touched.locationOther &&
                                          errors.locationOther ? (
                                          <p className="form-error">
                                            {errors.locationOther}
                                          </p>
                                        ) : null}
                                      </div>
                                    </div>
                                    {disOtrCountryCty && (
                                      <div className="col-lg-6 col-md-6">
                                        <div className="form-group">
                                          <Select
                                            placeholder="Select Country"
                                            isSearchable={true}
                                            isClearable={true}
                                            isDisabled={false}
                                            options={createData(countries)}
                                            value={countriesName}
                                            name="country"
                                            className="dropstyle"
                                            onChange={(selectedOption: any) => {
                                              setCountriesName(selectedOption);
                                              setFieldValue(
                                                "country",
                                                selectedOption
                                              );
                                            }}
                                          />
                                          <span>
                                            {touched.country &&
                                              errors.country ? (
                                              <p className="form-error">
                                                {errors.country}
                                              </p>
                                            ) : null}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-12 col-sm-12 col-md-12">
                                <div className="form-group">
                                  <label>
                                    Mobile No
                                    <span
                                      style={{
                                        color: "red",
                                      }}
                                    >
                                      *
                                    </span>
                                  </label>
                                  <div className="row d-flex ">
                                    <div className="col-lg-3 col-sm-3 col-md-3">
                                      <span className="form-control pt-2">
                                        +91
                                      </span>
                                    </div>
                                    <br />
                                    <div className="col-lg-9 col-sm-9 col-md-9">
                                      <input
                                        type="text"
                                        name="mobile"
                                        placeholder="Mobile Number"
                                        value={mobileNumber}
                                        minLength={10}
                                        maxLength={10}
                                        onChange={(e: any) => {
                                          if (
                                            e.target.value === "" ||
                                            /^[0-9,]+$/.test(e.target.value)
                                          ) {
                                            SetModileVrfMsg("");
                                            handleChange(e);
                                            setCodeDis(false);
                                            setMobileNumber(e.target.value);
                                          }
                                        }}
                                        className="form-control"
                                        onBlur={(e: any) => {
                                          handleBlur(e);

                                          validatePhone(e);
                                        }}
                                      />
                                    </div>
                                  </div>

                                  {mobileVrfMsg && (
                                    <p className="form-error">{mobileVrfMsg}</p>
                                  )}
                                  {!mobileVrfMsg &&
                                    !errors.mobile &&
                                    mobileErr && (
                                      <p className="form-error">
                                        Entered phone number already exists.
                                      </p>
                                    )}
                                  {touched.mobile && errors.mobile ? (
                                    <p className="form-error">
                                      {errors.mobile}
                                    </p>
                                  ) : null}
                                </div>
                              </div>
                              <div className="col-lg-12 col-sm-12 col-md-12">
                                <div className="form-group">
                                  <label>Telephone Number</label>
                                  <div className="row">
                                    <div className="col-lg-3 col-md-3 col-sm-3 col-3">
                                      <input
                                        maxLength={4}
                                        type="number"
                                        className="form-control"
                                        name="countryCodeTelph"
                                        value={values.countryCodeTelph}
                                        onChange={handleChange}
                                        placeholder="Country Code"
                                        onInput={(e: any) => {
                                          e.target.value = e.target.value.slice(
                                            0,
                                            4
                                          );
                                        }}
                                      />
                                      {touched.countryCodeTelph &&
                                        errors.countryCodeTelph ? (
                                        <p className="form-error">
                                          {errors.countryCodeTelph}
                                        </p>
                                      ) : null}
                                    </div>
                                    <div className="col-lg-3 col-md-3 col-sm-3 col-3">
                                      <input
                                        maxLength={10}
                                        type="number"
                                        className="form-control"
                                        name="areaCode"
                                        value={values.areaCode}
                                        onInput={(e: any) => {
                                          e.target.value = e.target.value.slice(
                                            0,
                                            10
                                          );
                                        }}
                                        onChange={handleChange}
                                        placeholder="Area Code"
                                        onBlur={handleBlur}
                                      />
                                      {touched.areaCode && errors.areaCode ? (
                                        <p className="form-error">
                                          {errors.areaCode}
                                        </p>
                                      ) : null}
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                      <input
                                        minLength={6}
                                        maxLength={12}
                                        type="number"
                                        className="form-control"
                                        name="phoneNumber"
                                        value={values.phoneNumber}
                                        onInput={(e: any) => {
                                          e.target.value = e.target.value.slice(
                                            0,
                                            12
                                          );
                                        }}
                                        onChange={handleChange}
                                        placeholder="Phone Number"
                                        onBlur={handleBlur}
                                      />
                                      {touched.phoneNumber &&
                                        errors.phoneNumber ? (
                                        <p className="form-error">
                                          {errors.phoneNumber}
                                        </p>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="form-group">
                                  <label>Email Address</label>{" "}
                                  <h6 className="m-a0 font-14">
                                    {!loading &&
                                      basicInfo &&
                                      basicInfo.contact &&
                                      basicInfo.contact?.primary?.email}
                                  </h6>
                                </div>
                              </div>
                              {!availabilityIn && (
                                <div className="col-lg-12 col-md-12">
                                  <div className="form-group">
                                    <label>Notice Period</label>
                                    <Select
                                      placeholder="Select Notice Period"
                                      className="dropstyle"
                                      menuPlacement="auto"
                                      isSearchable={true}
                                      isClearable={true}
                                      isDisabled={false}
                                      options={notice}
                                      value={notice.find(
                                        (item: any) =>
                                          item.label === values.noticePeriod
                                      )}
                                      name="noticePeriod"
                                      onBlur={handleBlur}
                                      onChange={(selectedOption: any) => {
                                        if (
                                          selectedOption !==
                                          "Serving Notice Period"
                                        ) {
                                          setYear(null);
                                          setMonth(null);
                                          setDay(null);
                                        }
                                        setSelectNoticePeriod(selectedOption);
                                        setFieldValue(
                                          "noticePeriod",
                                          selectedOption?.label
                                        );
                                      }}
                                    />
                                    {touched.noticePeriod &&
                                      errors.noticePeriod ? (
                                      <p className="form-error">
                                        {errors.noticePeriod}
                                      </p>
                                    ) : null}
                                  </div>
                                </div>
                              )}

                              {availabilityIn && (
                                <div className="col-lg-12 col-md-12">
                                  <div className="form-group">
                                    <label> Availability to join</label>
                                    <Select
                                      menuPlacement="top"
                                      placeholder=" Select Availability "
                                      className={"dropstyle"}
                                      isSearchable={true}
                                      isClearable={true}
                                      options={availablity}
                                      value={availablity.find(
                                        (item: any) =>
                                          item.label === values.availability
                                      )}
                                      name="availability"
                                      onBlur={handleBlur}
                                      onChange={(selectedOption: any) => {
                                        setSelectAvail(selectedOption);
                                        setFieldValue(
                                          "availability",
                                          selectedOption?.label
                                        );
                                      }}
                                    />
                                    {touched.noticePeriod &&
                                      errors.noticePeriod ? (
                                      <p className="form-error">
                                        {errors.noticePeriod}
                                      </p>
                                    ) : null}
                                  </div>
                                </div>
                              )}
                              {selectWorking && (
                                <div className="col-lg-12 col-md-12">
                                  <div className="form-group">
                                    <label>
                                      Expected Last Working Day
                                      <span
                                        style={{
                                          color: "red",
                                        }}
                                      >
                                        *
                                      </span>
                                    </label>
                                    <div className="row">
                                      <div className="col-lg-4 col-md-4">
                                        <div className="form-group">
                                          <Select
                                            maxMenuHeight={100}
                                            className="dropstyle"
                                            placeholder="Year"
                                            menuPlacement="top"
                                            name="noticePeriodYear"
                                            value={year}
                                            options={yearData}
                                            isClearable
                                            onChange={(selectedOption: any) => {
                                              setYear(selectedOption);
                                              setFieldValue(
                                                "noticePeriodYear",
                                                selectedOption
                                              );
                                            }}
                                          ></Select>
                                          {touched.noticePeriodYear &&
                                            errors.noticePeriodYear ? (
                                            <p className="form-error">
                                              {errors.noticePeriodYear}
                                            </p>
                                          ) : null}
                                        </div>
                                      </div>
                                      <div className="col-lg-4 col-md-4">
                                        <div className="form-group">
                                          <Select
                                            maxMenuHeight={100}
                                            placeholder="Select month"
                                            name="noticePeriodMonth"
                                            isClearable
                                            menuPlacement="top"
                                            options={monthData}
                                            value={month}
                                            onChange={(selectedOption: any) => {
                                              setMonth(selectedOption);
                                              setFieldValue(
                                                "noticePeriodMonth",
                                                selectedOption
                                              );
                                              GetDayOptions(
                                                Number(values.year?.label),
                                                Number(selectedOption?.value)
                                              );
                                            }}
                                            className="dropstyle"
                                          />
                                          {touched.noticePeriodMonth &&
                                            errors.noticePeriodMonth ? (
                                            <p className="form-error">
                                              {errors.noticePeriodMonth}
                                            </p>
                                          ) : null}
                                        </div>
                                      </div>
                                      <div className="col-lg-4 col-md-4">
                                        <div className="form-group">
                                          <Select
                                            maxMenuHeight={100}
                                            placeholder="Select day"
                                            isClearable
                                            menuPlacement="top"
                                            name="noticePeriodDay"
                                            value={day}
                                            options={GetDaysInMonth(
                                              Number(year?.label),
                                              month?.label,
                                              0,
                                              true,
                                              false
                                            )}
                                            onChange={(selectedOption: any) => {
                                              setDay(selectedOption);
                                              setFieldValue(
                                                "noticePeriodDay",
                                                selectedOption
                                              );
                                            }}
                                            className="dropstyle"
                                          />
                                          {touched.noticePeriodDay &&
                                            errors.noticePeriodDay ? (
                                            <p className="form-error">
                                              {errors.noticePeriodDay}
                                            </p>
                                          ) : null}
                                        </div>
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
                                reset();
                                resetForm();
                                setBasicDetails(false);
                                setShowmoney(false);
                                trigger && trigger(false);
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="site-button"
                              style={
                                mobileErr
                                  ? {
                                    cursor: "default",

                                    backgroundColor: "#bdbebf",
                                  }
                                  : {
                                    cursor: "pointer",
                                  }
                              }
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </Modal>
                )}
                {hideContect && (
                  <div
                    className="overlay-black-dark profile-edit p-t50 p-b20"
                    style={{
                      backgroundImage: "url(" + bnr + ")",
                    }}
                  >
                    <div className="container" style={{ marginTop: "55px" }}>
                      {!loading ? (
                        <div className="row">
                          {
                            <div className="col-lg-8 col-md-7 candidate-info">
                              <div className="candidate-detail">
                                <div className="canditate-des text-center ">
                                  <Link to={"#"}>
                                    <img
                                      style={{
                                        border: "3px solid #fff",
                                      }}
                                      alt="Profile_Image"
                                      src={
                                        image?.data || load
                                          ? `data:image/png;base64,${image?.data}`
                                          : require("../../../../assets/images/av-pic-01.png")
                                      }
                                    />
                                  </Link>
                                  <div
                                    className="upload-link profileUploadIcon"
                                    title="Change your profile photo"
                                    data-toggle="tooltip"
                                    data-placement="right"
                                  >
                                    <input
                                      type="file"
                                      className="update-flie"
                                      accept="image/*"
                                      onChange={(event: any) => {
                                        handleProfileChange(event);
                                      }}
                                    />
                                    <i
                                      className="fa fa-camera"
                                      style={{
                                        color: "#57585c",
                                      }}
                                    ></i>
                                  </div>
                                </div>
                                <div className="text-white browse-job text-left">
                                  <h4 className="m-b0" title={basicInfo?.name}>
                                    {basicInfo &&
                                      Content(
                                        basicInfo?.name
                                          .charAt(0)
                                          .toUpperCase() +
                                        basicInfo?.name.slice(1),
                                        35
                                      )}
                                    <Link
                                      to={"#"}
                                      onClick={(e: any) => {
                                        bindingData(e);
                                        setBasicDetails(true);
                                      }}
                                      className="m-l15 font-16 text-white"
                                    >
                                      <BsPencil title="Update your basic details" />
                                    </Link>
                                  </h4>

                                  <p className="m-b15">
                                    {emp[0]?.fulltime?.role
                                      ? emp[0]?.fulltime?.role
                                        .charAt(0)
                                        .toUpperCase() +
                                      emp[0]?.fulltime?.role.slice(1)
                                      : "No Employment Added"}
                                  </p>
                                  {!loading &&
                                    basicInfo &&
                                    basicInfo?.contact && (
                                      <ul className="clearfix">
                                        <li
                                          className="modal-title"
                                          title={
                                            basicDetailsData?.location?.city &&
                                              basicDetailsData?.location?.country
                                              ? `${basicDetailsData?.location?.city}, ${basicDetailsData?.location?.country}`
                                              : ""
                                          }
                                        >
                                          <i className="ti-location-pin"></i>
                                          {basicDetailsData?.location &&
                                            basicDetailsData?.location?.city &&
                                            basicDetailsData?.location?.country
                                            ? `${Content(
                                              basicDetailsData?.location
                                                ?.city,
                                              textlmt
                                            )
                                              .charAt(0)
                                              .toUpperCase() +
                                            Content(
                                              basicDetailsData?.location
                                                ?.city,
                                              textlmt
                                            ).slice(1) +
                                            ", " +
                                            Content(
                                              basicDetailsData?.location
                                                ?.country,
                                              10
                                            )
                                              .charAt(0)
                                              .toUpperCase() +
                                            Content(
                                              basicDetailsData?.location
                                                ?.country,
                                              10
                                            ).slice(1)
                                            }`
                                            : "Not Mentioned"}
                                        </li>
                                        <li>
                                          <i className="ti-mobile"></i>{" "}
                                          {basicInfo?.contact?.primary?.phno ? (
                                            basicInfo?.contact?.primary?.phno
                                          ) : (
                                            <span
                                              title="Add phone number"
                                              className="addBtnOnHover"
                                              onClick={(e?: any) => {
                                                setBasicDetails(true);
                                                bindingData(e);
                                              }}
                                            >
                                              Add Phone Number
                                            </span>
                                          )}
                                          {basicInfo?.contact?.primary?.phno &&
                                            (!basicInfo?.ph_verified ? (
                                              <span
                                                className="verify-button"
                                                onClick={() => {
                                                  verifyMobileBtn();
                                                }}
                                              >
                                                Verify
                                              </span>
                                            ) : (
                                              <BsFillCheckCircleFill />
                                            ))}
                                        </li>
                                        <li>
                                          <i className="ti-briefcase"></i>
                                          {careerProfileData?.fresher !== null
                                            ? careerProfileData?.fresher ===
                                              true
                                              ? "Fresher"
                                              : "Experienced"
                                            : "Not Mentioned"}
                                        </li>
                                        <li>
                                          <i className="ti-email"></i>{" "}
                                          <span
                                            title={
                                              basicInfo?.contact?.primary?.email
                                            }
                                          >
                                            {Content(
                                              basicInfo?.contact?.primary?.email
                                                .charAt(0)
                                                .toUpperCase() +
                                              basicInfo?.contact?.primary?.email.slice(
                                                1
                                              ),
                                              30
                                            )}
                                          </span>
                                          {!basicInfo?.email_verified ? (
                                            <span
                                              className="verify-button"
                                              onClick={() => {
                                                verifyEmailbtn();
                                              }}
                                            >
                                              Verify
                                            </span>
                                          ) : (
                                            <BsFillCheckCircleFill />
                                          )}
                                        </li>
                                      </ul>
                                    )}
                                  <div className="progress-box m-t10">
                                    {!loading2 && profileStr && (
                                      <div className="progress-info">
                                        Profile Strength {`(${strength})`}
                                        <span>
                                          {
                                            profileStr?.data
                                              ?.completionPercentage
                                          }
                                          %
                                        </span>
                                      </div>
                                    )}
                                    <div className="progress">
                                      {!loading2 && profileStr && (
                                        <div
                                          className="progress-bar"
                                          style={{
                                            width: `${profileStr?.data?.completionPercentage}%`,
                                            backgroundColor: "#32c553",
                                          }}
                                          role="progressbar"
                                        ></div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          }

                          {pendingAction?.length > 0 && (
                            <div className="col-lg-4 col-md-5">
                              <Link
                                to={"/pendingAction"}
                                style={{
                                  textDecorationLine: "none",
                                }}
                              >
                                <div className="pending-info text-white p-a25">
                                  <h5>Pending Action(s)</h5>
                                  <ul className="">
                                    {!loading &&
                                      JobSeekerProfile &&
                                      pendingAction.map((action, index) => {
                                        if (index <= 2) {
                                          return (
                                            <a>
                                              {" "}
                                              <li
                                                onClick={() => { }}
                                                key={index}
                                              >
                                                {action?.name}
                                              </li>
                                            </a>
                                          );
                                        }
                                      })}
                                  </ul>
                                  <div
                                    style={{
                                      float: "right",
                                      marginTop: "-6px",
                                      fontSize: "14px",
                                    }}
                                  >
                                    View all
                                  </div>
                                </div>
                              </Link>
                            </div>
                          )}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>

                    <Modal
                      show={verifynum}
                      onHide={() => {
                        setVerifynum(false);
                        setTime(0);
                        setOtp(new Array(6).fill(""));
                      }}
                      className="modal fade modal-bx-info editor"
                    >
                      <div
                        className="modal-dialog my-0  mx-0 w-100 "
                        role="document"
                      >
                        <div className="modal-content">
                          <div className="modal-body">
                            <div>
                              <h6
                                style={{
                                  textAlign: "center",
                                  color: "#0070a6",
                                  fontFamily: "Montserrat",
                                }}
                              >
                                VERIFY MOBILE NUMBER
                              </h6>
                              <center>
                                <span
                                  style={{
                                    fontFamily: "Montserrat",
                                  }}
                                >
                                  Enter OTP sent to your mobile number
                                </span>
                                <br></br>
                                <span>{number} </span>
                                {mins > 9 && secs > 9 && (
                                  <p
                                    style={{
                                      fontSize: "13px",
                                    }}
                                  >
                                    OTP will expire in{" "}
                                    <span className="badge badge-pill badge-info">
                                      {mins}:{secs}
                                    </span>{" "}
                                    mins
                                  </p>
                                )}
                                {mins < 10 && secs > 9 && (
                                  <p
                                    style={{
                                      fontSize: "13px",
                                    }}
                                  >
                                    OTP will expire in{" "}
                                    <span className="badge badge-pill badge-info">
                                      0{mins}:{secs}
                                    </span>{" "}
                                    mins
                                  </p>
                                )}
                                {mins > 9 && secs < 10 && (
                                  <p
                                    style={{
                                      fontSize: "13px",
                                    }}
                                  >
                                    OTP will expire in{" "}
                                    <span className="badge badge-pill badge-info">
                                      {mins}
                                      :0
                                      {secs}
                                    </span>{" "}
                                    mins
                                  </p>
                                )}
                                {mins < 10 && secs < 10 && (
                                  <p
                                    style={{
                                      fontSize: "13px",
                                    }}
                                  >
                                    OTP will expire in{" "}
                                    <span className="badge badge-pill badge-info">
                                      0{mins}
                                      :0
                                      {secs}
                                    </span>{" "}
                                    mins
                                  </p>
                                )}
                                {otp.map((_, idx) => (
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
                                    ref={
                                      idx === activeOtpIndex ? inputRef : null
                                    }
                                    onChange={(e) =>
                                      regex.numberTyping.test(e.target.value) &&
                                      otpChanges(e, idx)
                                    }
                                    value={otp[idx]}
                                    onKeyDown={(e) => otpKeyChanges(e, idx)}
                                  />
                                ))}
                                <br></br>
                                <br></br>
                                {otp.join("").length === 6 && time !== 0 && (
                                  <button
                                    type="button"
                                    className="site-button border border-primary btn-sm"
                                    disabled={
                                      otp.join("").length === 6 ? false : true
                                    }
                                    style={{
                                      cursor: "pointer",
                                      background: "white",
                                      color: "#2e55fa",
                                      borderColor: "#2e55fa",
                                    }}
                                    onClick={(e: any) => {
                                      const recivedOtp = otp?.join("");
                                      dispatch(
                                        verifyOtp({
                                          to: `+91${basicInfo?.contact?.primary?.phno}`,
                                          txn_id: txn_id,
                                          otp: recivedOtp,
                                          channel: "sms",
                                        })
                                      );
                                      if (res.code == 200) {
                                        setVerifynum(false);
                                        setOtp(new Array(6).fill(""));
                                      }
                                      setLoader5(true);
                                    }}
                                  >
                                    {" "}
                                    {loader5 && (
                                      <i
                                        className="fa fa-circle-o-notch fa-spin"
                                        style={{
                                          marginRight: "10px",
                                        }}
                                      ></i>
                                    )}
                                    {loader5 ? "VERIFYING OTP" : "VERIFY OTP"}
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
                                      setLoader3(false);
                                      dispatch(
                                        sendOtp({
                                          to: `+91${number}`,
                                          user_id: basicInfo?.user_id,
                                          channel: "sms",
                                        })
                                      );
                                      setTimeFunc();
                                      setLoader3(false);
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

                    <Modal
                      show={verifyemail}
                      onHide={() => {
                        setVerifyemail(false);
                        setOtp(new Array(6).fill(""));
                      }}
                      className="modal fade modal-bx-info editor"
                    >
                      <div
                        className="modal-dialog my-0  mx-0 w-100 "
                        role="document"
                      >
                        <div className="modal-content">
                          <div className="modal-body">
                            <div>
                              <h6
                                style={{
                                  textAlign: "center",
                                  color: "#0070a6",
                                  fontFamily: "Montserrat",
                                }}
                              >
                                VERIFY EMAIL
                              </h6>
                              <center>
                                <span
                                  style={{
                                    fontFamily: "Montserrat",
                                  }}
                                >
                                  Enter OTP sent to your email address
                                </span>
                                <br></br>
                                <span>{email} </span>
                                {mins > 9 && secs > 9 && (
                                  <p
                                    style={{
                                      fontSize: "13px",
                                    }}
                                  >
                                    OTP will expire in{" "}
                                    <span className="badge badge-pill badge-info">
                                      {mins}:{secs}
                                    </span>{" "}
                                    mins
                                  </p>
                                )}
                                {mins < 10 && secs > 9 && (
                                  <p
                                    style={{
                                      fontSize: "13px",
                                    }}
                                  >
                                    OTP will expire in{" "}
                                    <span className="badge badge-pill badge-info">
                                      0{mins}:{secs}
                                    </span>{" "}
                                    mins
                                  </p>
                                )}
                                {mins > 9 && secs < 10 && (
                                  <p
                                    style={{
                                      fontSize: "13px",
                                    }}
                                  >
                                    OTP will expire in{" "}
                                    <span className="badge badge-pill badge-info">
                                      {mins}
                                      :0
                                      {secs}
                                    </span>{" "}
                                    mins
                                  </p>
                                )}
                                {mins < 10 && secs < 10 && (
                                  <p
                                    style={{
                                      fontSize: "13px",
                                    }}
                                  >
                                    OTP will expire in{" "}
                                    <span className="badge badge-pill badge-info">
                                      0{mins}
                                      :0
                                      {secs}
                                    </span>{" "}
                                    mins
                                  </p>
                                )}
                                {otp.map((_, idx) => (
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
                                    ref={
                                      idx === activeOtpIndex ? inputRef : null
                                    }
                                    onChange={(e) => {
                                      regex.numberTyping.test(e.target.value) &&
                                        otpChanges(e, idx);
                                    }}
                                    value={otp[idx]}
                                    onKeyDown={(e) => otpKeyChanges(e, idx)}
                                  />
                                ))}
                                <br></br>
                                <br></br>
                                {otp.join("").length === 6 && time !== 0 && (
                                  <button
                                    type="button"
                                    className="site-button border border-primary btn-sm"
                                    disabled={
                                      otp.join("").length === 6 ? false : true
                                    }
                                    style={{
                                      cursor: "pointer",
                                      background: "white",
                                      color: "#2e55fa",
                                      borderColor: "#2e55fa",
                                    }}
                                    onClick={(e: any) => {
                                      const recivedOtp = otp?.join("");
                                      dispatch(
                                        verifyOtp({
                                          to: email,
                                          txn_id: txn_id,
                                          otp: recivedOtp,
                                          channel: "email",
                                        })
                                      );
                                      if (res.code == 200) {
                                        setVerifyemail(false);

                                        setOtp(new Array(6).fill(""));
                                      }
                                      setLoader10(true);
                                    }}
                                  >
                                    {" "}
                                    {loader10 && (
                                      <i
                                        className="fa fa-circle-o-notch fa-spin"
                                        style={{
                                          marginRight: "10px",
                                        }}
                                      ></i>
                                    )}
                                    {loader10 ? "VERIFYING OTP" : "VERIFY OTP"}
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
                                      setLoader7(true);
                                      dispatch(
                                        sendOtp({
                                          to: email,
                                          user_id: basicInfo?.user_id,
                                          channel: "email",
                                        })
                                      );
                                      setTimeFunc();
                                      setLoader7(false);
                                    }}
                                  >
                                    {" "}
                                    {loader7 && (
                                      <i
                                        className="fa fa-circle-o-notch fa-spin"
                                        style={{
                                          marginRight: "10px",
                                        }}
                                      ></i>
                                    )}
                                    {loader7 ? "RESENDING OTP" : "RESEND OTP"}
                                  </button>
                                )}
                              </center>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Modal>
                  </div>
                )}
              </>
            );
          }}
        </Formik>
      </>
    </>
  );
}

export default BasicDetails;
