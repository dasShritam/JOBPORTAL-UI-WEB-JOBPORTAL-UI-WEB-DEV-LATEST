import { Card, CardMedia, TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import Swal from "sweetalert2";
import * as Yup from "yup";
import "../../../assets/customCss/EmpUserManagement.css";
import { convert_date_unix_ts } from "../../../common/common";
import { regex } from "../../../common/validation";
import { ROLES } from "../../../config/app.config";
import { validateUser } from "../../../redux/features/authentication/userMailSlice";
import { patchEmpUserManage } from "../../../redux/features/employer/EmployerManageUser/userPatchEmpManageSlice";
import { postEmpUserManage } from "../../../redux/features/employer/EmployerManageUser/userPostEmpMangeSlice";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
const userManage = require("../../../assets/images/ManageUsers.jpg");

interface propsTypeI {
  show: boolean;
  func: any;
  data?: any;
}
interface CountryI {
  value: string;
  label: string;
  phone: string;
}
interface DatasI {
  user_id: string;
  name: string;
  email: string;
  codeMob: string;
  phone: string;
  designation: string;
  altEmail: string;
  altCodeMob: string;
  altPhone: string;
  role: DropdownI;
  allPerimission: string[];
  fromDate: string;
  toDate: string;
  fromTimeVal: string;
  toTimeVal: string;
  restrict: boolean;
  mij: boolean;
  mej: boolean;
  weekday: number[];
  permitionAll: boolean;
}
interface DropdownI {
  value: string | number;
  label: string;
}
enum perimissionE {
  MEJ = "MEJ",
  MIJ = "MIJ",
}

let countries = new Array<CountryI>();
let designations = new Array<DropdownI>();
const INITIAL_FORM_STATE: DatasI = {
    user_id: "",
    name: "",
    email: "",
    codeMob: "",
    phone: "",
    designation: "",
    altEmail: "",
    altCodeMob: "",
    altPhone: "",
    role: {
      value: ROLES.RECRUITER,
      label: "Recruiter",
    },
    allPerimission: [],
    fromDate: "",
    toDate: "",
    fromTimeVal: "",
    toTimeVal: "",
    restrict: false,
    mij: false,
    mej: false,
    weekday: [],
    permitionAll: false,
  },
  PATENT_FORM_VALIDATION = Yup.object().shape({
    name: Yup.string()
      .matches(
        regex.firstname,
        "Numeric and special characters are not allowed."
      )
      .trim("Empty space not allowed.")
      .min(1, "Full Name must contains minimum 1 characters.")
      .max(201)
      .required("Please enter Full Name."),
    email: Yup.string()
      .matches(
        regex.email,
        "Sorry, only letters, numbers and periods(.) are allowed."
      )
      .trim("Empty space not allowed")
      .required("Please enter Email Address."),
    codeMob: Yup.string().notRequired(),
    phone: Yup.string()
      .required("Please enter Contact Number.")
      .trim("Empty space not allowed.")
      .matches(
        regex.international_mobile,
        "Please enter Contact Number with minimum of 6 digits and maximum of 12 digits."
      ),
    designation: Yup.object().nullable().notRequired(),
    role: Yup.object().nullable().notRequired(),
    altEmail: Yup.string()
      .nullable()
      .matches(
        regex.email,
        "Sorry, only letters, numbers and periods(.) are allowed."
      )
      .trim("Empty space not allowed"),
    altCodeMob: Yup.string().notRequired().nullable(),
    altPhone: Yup.string()
      .nullable()
      .trim("Empty space not allowed.")
      .matches(
        regex.international_mobile,
        "Please enter Alternate Contact Number with minimum of 6 digits and maximum of 12 digits."
      ),
    allPerimission: Yup.array()
      .required("Please select Permission.")
      .nullable()
      .min(1, "Please select Permission."),
    fromDate: Yup.string()
      .when("restrict", {
        is: true,
        then: Yup.string().required("Please select From Date.").nullable(),
      })
      .nullable(),
    toDate: Yup.string()
      .when("restrict", {
        is: true,
        then: Yup.string().required("Please select Till Date.").nullable(),
      })
      .nullable(),
    fromTimeVal: Yup.string()
      .when("restrict", {
        is: true,
        then: Yup.string().required("Please select From Time.").nullable(),
      })
      .nullable(),
    toTimeVal: Yup.string()
      .when("restrict", {
        is: true,
        then: Yup.string().required("Please select Till Time.").nullable(),
      })
      .nullable(),
    weekday: Yup.array().nullable(),
  }),
  RoleOptions: DropdownI[] = [
    {
      value: ROLES.EMPLOYER_ADMINISTRATOR,
      label: "Employer Administrator",
    },
    { value: ROLES.RECRUITER, label: "Recruiter" },
  ],
  WEEKDAYS: DropdownI[] = [
    { value: 0, label: "SUNDAY" },
    { value: 1, label: "MONDAY" },
    { value: 2, label: "TUESDAY" },
    { value: 3, label: "WENDNESDAY" },
    { value: 4, label: "THURSDAY" },
    { value: 5, label: "FRIDAY" },
    { value: 6, label: "SATURDAY" },
  ];
const AddEditEmpUser = (props: propsTypeI) => {
  const formikRef = useRef<any>(),
    dispatch = useDispatch(),
    [modal, setModal] = useState(props.show),
    [mailErr1, setMailErr1] = useState(false),
    [mailErr2, setMailErr2] = useState(false),
    [mobileErr1, setMobileErr1] = useState(false),
    [mobileErr2, setMobileErr2] = useState(false),
    [mob1, setMob1] = useState(""),
    [mob2, setMob2] = useState(""),
    [mail1, setMail1] = useState(""),
    [mail2, setMail2] = useState(""),
    [selectedCountryCode1, setSelectedCountryCode1] = useState<any>("+91"),
    [selectedCountryCode2, setSelectedCountryCode2] = useState<any>(),
    [dateFrom, setDateFrom] = useState<any>(null),
    [dateTo, setDateTo] = useState<any>(null),
    [resWeekdays, setResWeekdays] = useState<any>([]),
    [datas, setDatas] = useState<any>(null),
    [selectDisable, setSelectDisable] = useState<boolean>(false),
    [clear, setClear] = useState<any>(),
    [touch1, setTouch1] = useState(false),
    [touch2, setTouch2] = useState(false),
    [touch3, setTouch3] = useState(false),
    [touch4, setTouch4] = useState(false),
    [phoneNo, setPhoneNo] = useState(""),
    [selectedPhone, setSelectedPhone] = useState(""),
    [phoneCode, setPhoneCode] = useState(""),
    { UserCheck } = useSelector((state: any) => state.userMailVerify),
    { CountryCode } = useSelector((state: any) => state.countryCode),
    { DesignationData } = useSelector((state: any) => state.designation),
    { userDataP, loadingUP } = useSelector(
      (state: any) => state.postuserEmpManagement
    ),
    { userDataPa, loadingUPa } = useSelector(
      (state: any) => state.patchuserEmpMangement
    ),
    [walkindateError, setWalkindateError] = useState(""),
    [startDate, setStartDate] = useState<any>(null),
    [edateError, setEdateError] = useState(false),
    [endDate, setEndDate] = useState<any>(null),
    [dateErr, setDateErr] = useState<any>(""),
    [touchedSTime, setTouchedSTime] = useState(false),
    [touchedETime, setTouchedETime] = useState(false),
    [endTime, setEndTime] = useState<any>(null),
    [refreshsenddateError, setRefreshenddateError] = useState(""),
    validateEmail = (e: any) => {
      e.preventDefault();
      const email = regex.email.test(e?.target?.value);
      if (email) {
        datas
          ? datas?.email !== e?.target?.value &&
            dispatch(
              validateUser({
                data: [{ key: "email", value: e?.target?.value.toLowerCase() }],
              })
            )
          : dispatch(
              validateUser({
                data: [{ key: "email", value: e?.target?.value.toLowerCase() }],
              })
            );
      }
    },
    validatePhone = () => {
      const phone = regex.international_mobile.test(selectedPhone);
      if (
        phone &&
        (phoneNo !== selectedPhone || phoneCode !== selectedCountryCode1)
      ) {
        dispatch(
          validateUser({
            data: [
              {
                key: "phone",
                value: `${selectedPhone}`,
                code: `${selectedCountryCode1}`,
              },
            ],
          })
        );
      }
      if (phoneNo === selectedPhone) {
        setMobileErr1(false);
        setMobileErr2(false);
      }
    },
    formatOptionLabel = (
      { label, phone }: CountryI,
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
    },
    customFilter = (option, searchText) => {
      if (
        option?.data?.label?.toLowerCase().includes(searchText.toLowerCase()) ||
        option?.data?.phone?.toLowerCase().includes(searchText.toLowerCase())
      ) {
        return true;
      } else {
        return false;
      }
    },
    disableRandomDates = (date) => {
      return date < new Date();
    },
    resetFunc = () => {
      setMailErr1(false);
      setMailErr2(false);
      setMobileErr1(false);
      setMobileErr2(false);
      setMail1("");
      setMail2("");
      setMob1("");
      setMob2("");
      setDatas({ ...INITIAL_FORM_STATE });
    },
    limitLocation = (e: any) => {
      if (e?.length >= resWeekdays?.length - 2) {
        setSelectDisable(true);
      }
      if (e?.length <= resWeekdays?.length - 2) {
        setSelectDisable(false);
      }
    },
    onLocationSelectHandler = (values: any, location: string, type: string) => {
      switch (type) {
        case "select-option":
          if (!values?.weekday?.length) {
            values.weekday = [];
          }

          if (!values?.weekday?.includes(location)) {
            values.weekday = [...values?.weekday, location];
          }
          return;
        case "remove-value":
          let locations = values?.weekday?.filter(
            (loc: string) => loc !== location
          );
          values.weekday = locations;
          return;

        default:
          return;
      }
    },
    clearFunc = () => {
      clear.e();
      clear.v.allPerimission = [];
      resetFunc();
      setModal(false);
      props.func(false);
      setSelectedCountryCode1("+91");
      setSelectedCountryCode2({
        value: "0",
        lable: "India",
        phone: "+91",
      });
      setDateFrom(null);
      setDateTo(null);
    },
    handleConfirmSwal = (val: any) => {
      Swal.fire({
        title: "Are you sure?",
        text: `Do you want to ${datas ? "update" : "add"} this user?`,
        showCancelButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "red",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result?.isConfirmed) {
          !datas && dispatch(postEmpUserManage({ ...val }));
          datas &&
            dispatch(
              patchEmpUserManage({
                ...val,
                user_id: datas?.user_id,
              })
            );
        }
      });
    },
    weekdayFunc = () => {
      if (
        dateTo?.$y - dateFrom?.$y === 0 &&
        dateTo?.$M - dateFrom?.$M === 0 &&
        dateTo?.$D - dateFrom?.$D < 7 &&
        dateTo?.$D - dateFrom?.$D > 1
      ) {
        if (dateFrom?.$W - (dateTo?.$W + 1) < 0)
          setResWeekdays([...WEEKDAYS.slice(dateFrom?.$W, dateTo?.$W + 1)]);
        else {
          setResWeekdays([
            ...WEEKDAYS.slice(dateFrom?.$W, 7).concat(
              WEEKDAYS.slice(0, dateTo?.$W + 1)
            ),
          ]);
        }
      } else if (
        dateTo?.$y - dateFrom?.$y === 0 &&
        dateTo?.$M - dateFrom?.$M === 0 &&
        dateTo?.$D - dateFrom?.$D < 2
      ) {
        setResWeekdays([]);
      } else setResWeekdays(WEEKDAYS);
    };
  useEffect(() => {
    validatePhone();
  }, [selectedPhone, selectedCountryCode1]);
  useEffect(() => {
    if (
      formikRef?.current?.values?.fromTimeVal &&
      formikRef?.current?.values?.toTimeVal &&
      formikRef?.current?.values?.fromTimeVal >
        formikRef?.current?.values?.toTimeVal
    ) {
      formikRef.current.errors.toTimeVal =
        "Please select Till Time greater than From Time.";
    } else {
      if (!touchedETime) {
        setDateErr("");
      }
    }
  }, [touchedETime]);
  const [timeError, setTimeError] = useState("");

  useEffect(() => {
    const currentDate = new Date();
    const selectedDate = startDate ? startDate.$d : null;
    const currentTime = new Date().getTime();

    if (
      selectedDate &&
      selectedDate.toDateString() === currentDate.toDateString() &&
      formikRef?.current?.values.fromTimeVal &&
      new Date(formikRef?.current?.values.fromTimeVal.$d) < currentDate
    ) {
      setDateErr("Please select a future time.");
      formikRef.current.setErrors({
        fromTimeVal: "Please select a future time.",
      });
    } else {
      setDateErr("");
    }
  }, [startDate, formikRef?.current?.values.fromTimeVal]);
  useEffect(() => {
    weekdayFunc();
  }, [dateFrom, dateTo]);
  useEffect(() => {
    if (!loadingUP && userDataP && userDataP?.code && userDataP?.code === 200)
      clearFunc();
    if (
      !loadingUPa &&
      userDataPa &&
      userDataPa?.code &&
      userDataPa?.code === 200
    )
      clearFunc();
    if (userDataP?.code && userDataP?.code === 429) {
      clearFunc();
    }
  }, [userDataPa, userDataP]);
  useEffect(() => {
    return () => {
      resetFunc();
    };
  }, []);
  useEffect(() => {
    setModal(props?.show);
    let temp: any = [];
    props?.data &&
      props?.data[0]?.permissions?.indexOf(perimissionE.MEJ) !== -1 &&
      temp.push(perimissionE.MEJ);
    props?.data &&
      props?.data[0]?.permissions?.indexOf(perimissionE.MIJ) !== -1 &&
      temp.push(perimissionE.MIJ);
    props?.data &&
      setDatas({
        user_id: props?.data[0]?.user_id,
        name: props?.data[0]?.name.trim(),
        email: props?.data[0]?.contact?.primary?.mail,
        codeMob: props?.data[0]?.contact?.primary?.ph?.code,
        phone: props?.data[0]?.contact?.primary?.ph?.phno,
        designation: props?.data[0]?.designation,
        altEmail: props?.data[0]?.contact?.secondary[0]?.email,
        altCodeMob: props?.data[0]?.contact?.secondary[0]?.code,
        altPhone: props?.data[0]?.contact?.secondary[0]?.phno,
        role:
          props?.data[0]?.role === ROLES.RECRUITER
            ? { value: ROLES.RECRUITER, label: "Recruiter" }
            : {},
        restrict: Boolean(
          props?.data[0]?.accessibility?.end_date &&
            props?.data[0]?.accessibility?.start_date
        ),
        mej: props?.data[0]?.permissions?.indexOf(perimissionE.MEJ) !== -1,
        mij: props?.data[0]?.permissions?.indexOf(perimissionE.MIJ) !== -1,
        allPerimission: [...temp],
        fromTimeVal: props?.data[0]?.accessibility?.start_date
          ? dayjs(
              new Date(
                props?.data[0]?.accessibility?.start_date * 1000
              ).toISOString()
            )
          : "",
        fromDate: props?.data[0]?.accessibility?.start_date
          ? dayjs(
              new Date(
                (props?.data[0]?.accessibility?.start_date +
                  (5 * 60 * 60 + 30 * 60)) *
                  1000
              )
                .toISOString()
                .substr(0, 10)
            )
          : null,
        toTimeVal: props?.data[0]?.accessibility?.end_date
          ? dayjs(
              new Date(
                props?.data[0]?.accessibility?.end_date * 1000
              ).toISOString()
            )
          : "",
        toDate: props?.data[0]?.accessibility?.end_date
          ? dayjs(
              new Date(
                (props?.data[0]?.accessibility?.end_date +
                  (5 * 60 * 60 + 30 * 60)) *
                  1000
              )
                .toISOString()
                .substr(0, 10)
            )
          : "",
        weekday: props?.data[0]?.accessibility?.days,
      });
    props?.data && setPhoneNo(props?.data[0]?.contact?.primary?.ph?.phno);
    props?.data &&
      props?.data[0]?.contact?.primary?.ph?.code &&
      setSelectedCountryCode1(props?.data[0]?.contact?.primary?.ph?.code);
    props?.data &&
      props?.data[0]?.contact?.secondary?.code &&
      setSelectedCountryCode2(props?.data[0]?.contact?.secondary[0]?.code);
    props?.data &&
      props?.data[0]?.contact?.primary?.ph?.code &&
      setPhoneCode(props?.data[0]?.contact?.primary?.ph?.code);
  }, [props?.show]);
  useEffect(() => {
    setSelectedCountryCode2(datas?.altCodeMob);
    setDateFrom(datas?.fromDate);
    setDateTo(datas?.toDate);
    setEndDate(datas?.toDate);
  }, [datas]);
  useEffect(() => {
    if (UserCheck && UserCheck.code && UserCheck.code === 200) {
      if (
        UserCheck?.data[0]?.key === "email" &&
        UserCheck?.data[0]?.exist === true
      ) {
        if (UserCheck?.data[0]?.value === mail1) setMailErr1(true);
        if (UserCheck?.data[0]?.value === mail2) setMailErr2(true);
      } else if (
        UserCheck?.data[0]?.key === "email" &&
        UserCheck?.data[0]?.exist === false
      ) {
        if (UserCheck?.data[0]?.value === mail1) setMailErr1(false);
        if (UserCheck?.data[0]?.value === mail2) setMailErr2(false);
      }
      if (phoneNo === UserCheck?.data[0]?.value) {
        setMobileErr1(false);
        setMobileErr2(false);
      }
      if (
        UserCheck?.data[0]?.key === "phone" &&
        UserCheck?.data[0]?.exist === true
      ) {
        if (UserCheck?.data[0]?.value === mob1) setMobileErr1(true);
        if (UserCheck?.data[0]?.value === mob2) setMobileErr2(true);
      } else if (
        UserCheck?.data[0]?.key === "phone" &&
        UserCheck?.data[0]?.exist === false
      ) {
        if (UserCheck?.data[0]?.value === mob1) setMobileErr1(false);
        if (UserCheck?.data[0]?.value === mob2) setMobileErr2(false);
      }
    }
  }, [UserCheck, mailErr1, mobileErr1, mailErr2, mobileErr2]);
  useEffect(() => {
    if (
      CountryCode &&
      CountryCode?.code &&
      CountryCode?.code === 200 &&
      !countries.length
    ) {
      CountryCode?.data?.map((e: any, i: number) => {
        countries.push({ value: `${1 + i}`, label: e?.name, phone: e?.code });
      });
    }
  }, [CountryCode]);
  useEffect(() => {
    if (DesignationData && DesignationData?.length && !designations.length) {
      DesignationData?.map((e: any, i: number) => {
        designations.push({ value: `${1 + i}`, label: e });
      });
    }
  }, [DesignationData]);

  function isSameDay(date1, date2) {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  return (
    <>
      {modal && (
        <>
          <div className="mt-3">
            <div className="my-0 w-sm-120" role="document">
              <div className=" d-xl-flex d-lg-flex d-md-flex d-sm-inline">
                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-0 job-bx bg-white">
                  <Card className="">
                    <CardMedia
                      sx={{ height: 300 }}
                      image={userManage}
                      title="green iguana"
                    />
                  </Card>
                </div>

                <div className="col-xl-8 col-lg-8 col-md-8 col-sm-12 job-bx bg-white">
                  <div className="">
                    <div className="modal-custom-header">
                      <h5
                        className="modal-title"
                        id="ProfilenameModalLongTitle"
                      >
                        {!datas ? "Add User" : "Edit User"}
                      </h5>
                      <button
                        type="button"
                        className="close"
                        onClick={() => {
                          setModal(false);
                          props.func(false);
                          resetFunc();
                        }}
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                  </div>
                  <Formik
                    initialValues={
                      datas
                        ? { ...datas }
                        : {
                            ...INITIAL_FORM_STATE,
                          }
                    }
                    enableReinitialize={true}
                    validationSchema={PATENT_FORM_VALIDATION}
                    onSubmit={(values: any, { resetForm }) => {
                      const val = {
                        fullName: values.name,
                        prim_email: values.email.toLowerCase(),
                        prim_code: values.codeMob ? values.codeMob : "+91",
                        prim_phno: values.phone,
                        designation: values.designation?.label,
                        secdContact: {
                          mail: values.altEmail
                            ? values.altEmail.toLowerCase()
                            : null,
                          ph: values.altPhone ? values.altPhone : null,
                          code: values.altPhone
                            ? values.altCodeMob
                              ? values.altCodeMob
                              : "+91"
                            : null,
                        },
                        role: values.role?.value,
                        permissions: [...values.allPerimission],
                        accessability: values.restrict
                          ? {
                              start_date: convert_date_unix_ts(
                                new Date(
                                  `${values.fromDate?.$y}-${
                                    1 + values.fromDate?.$M
                                  }-${values.fromDate?.$D} ${
                                    values.fromTimeVal.$H < 10
                                      ? values.fromTimeVal.$H === 0
                                        ? "00"
                                        : "0" + values.fromTimeVal.$H
                                      : values.fromTimeVal.$H
                                  }:${
                                    values.fromTimeVal.$m < 10
                                      ? values.fromTimeVal.$m === 0
                                        ? "00"
                                        : "0" + values.fromTimeVal.$m
                                      : values.fromTimeVal.$m
                                  }`
                                )
                              ),
                              end_date: convert_date_unix_ts(
                                new Date(
                                  `${values.toDate?.$y}-${
                                    1 + values.toDate?.$M
                                  }-${values.toDate?.$D} ${
                                    values.toTimeVal.$H < 10
                                      ? values.toTimeVal.$H === 0
                                        ? "00"
                                        : "0" + values.toTimeVal.$H
                                      : values.toTimeVal.$H
                                  }:${
                                    values.toTimeVal.$m < 10
                                      ? values.toTimeVal.$m === 0
                                        ? "00"
                                        : "0" + values.toTimeVal.$m
                                      : values.toTimeVal.$m
                                  }`
                                )
                              ),
                              days: [...values.weekday],
                            }
                          : null,
                      };
                      if (!mobileErr1 && !mailErr1) {
                        if (values.restrict) {
                          if (
                            values?.fromDate?.$y &&
                            values?.fromDate?.$M &&
                            values?.fromDate?.$D &&
                            values?.toDate?.$y &&
                            values?.toDate?.$M &&
                            values?.toDate?.$D &&
                            (values?.fromTimeVal?.$H === 0
                              ? true
                              : values?.fromTimeVal?.$H) &&
                            (values?.fromTimeVal?.$m === 0
                              ? true
                              : values?.fromTimeVal?.$m) &&
                            (values?.toTimeVal?.$H === 0
                              ? true
                              : values?.toTimeVal?.$H) &&
                            (values?.toTimeVal?.$m === 0
                              ? true
                              : values?.toTimeVal?.$m) &&
                            (values?.fromDate?.$D === new Date()?.getDate() &&
                            values?.fromDate?.$M === new Date()?.getMonth() &&
                            values?.fromDate?.$y === new Date()?.getFullYear()
                              ? values?.fromTimeVal?.$H >
                                  new Date().getHours() ||
                                (values?.fromTimeVal?.$H ===
                                  new Date().getHours() &&
                                  values?.fromTimeVal?.$m >
                                    new Date().getMinutes())
                              : true) &&
                            ((values?.toDate?.$D === new Date()?.getDate() &&
                              values?.toDate?.$M === new Date()?.getMonth() &&
                              values?.toDate?.$y ===
                                new Date()?.getFullYear()) ||
                            (values?.toDate?.$D === values?.fromDate?.$D &&
                              values?.toDate?.$M === values?.fromDate?.$M &&
                              values?.toDate?.$y === values?.fromDate?.$y)
                              ? values?.toTimeVal?.$H >
                                  values?.fromTimeVal?.$H ||
                                (values?.toTimeVal?.$H ===
                                  values?.fromTimeVal?.$H &&
                                  values?.toTimeVal?.$m >
                                    values?.fromTimeVal?.$m)
                              : true) &&
                            new Date(values?.fromDate?.$d) <=
                              new Date(values?.toDate?.$d)
                          ) {
                            handleConfirmSwal(val);
                            setClear({ e: resetForm, v: values });
                          }
                        } else {
                          handleConfirmSwal(val);
                          setClear({ e: resetForm, v: values });
                        }
                      }
                    }}
                    innerRef={formikRef}
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
                        setFieldTouched,
                      } = formik;
                      return (
                        <>
                          <div className="p-2">
                            <form
                              id="formreg"
                              autoComplete="off"
                              onSubmit={handleSubmit}
                            >
                              <div className="row browse-job">
                                <div className="col col-12 col-sm-12">
                                  <div className="form-group browse-job">
                                    <label className="">
                                      Full Name
                                      <span className="error">*</span>
                                    </label>
                                    <input
                                      maxLength={100}
                                      name="name"
                                      autoComplete="off"
                                      placeholder="Enter Full Name"
                                      type="text"
                                      onChange={handleChange}
                                      value={values.name}
                                      onBlur={handleBlur}
                                      className="form-control"
                                    />
                                    {errors.name && touched.name && (
                                      <p className="form-error">
                                        {errors.name}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="row">
                                <div className=" col-xl-6 col-lg-6 col-md-6 col-sm-12 d-inline">
                                  <div className="form-group browse-job">
                                    <label className="">
                                      Email Address
                                      <span className="error">*</span>
                                    </label>
                                    <input
                                      maxLength={150}
                                      name="email"
                                      autoComplete="off"
                                      placeholder="Enter Email Address"
                                      type="text"
                                      onChange={handleChange}
                                      value={values.email}
                                      readOnly={datas ? true : false}
                                      onBlur={(e) => {
                                        handleBlur(e);
                                        validateEmail(e);
                                        setMail1(e?.target?.value);
                                      }}
                                      className="form-control"
                                    />
                                    {!errors.email && mailErr1 && (
                                      <p className="form-error">
                                        Please check, entered Email Address
                                        already exists!
                                      </p>
                                    )}
                                    {errors.email && touched.email && (
                                      <>
                                        <p className="form-error">
                                          {errors.email}
                                        </p>
                                      </>
                                    )}
                                  </div>
                                </div>

                                <div className=" col-xl-6 col-lg-6 col-md-6 col-sm-12 d-inline">
                                  <div className="form-group browse-job">
                                    <label>
                                      Contact Number
                                      <span className="error">*</span>
                                    </label>
                                    <div id="phonenumbers">
                                      <div style={{ width: "150px" }} id="mob">
                                        <Select
                                          id="codemob"
                                          className="dropstyle"
                                          name="codeMob"
                                          options={countries}
                                          value={countries.find(
                                            (e) =>
                                              selectedCountryCode1 === e.phone
                                          )}
                                          placeholder="Select Code"
                                          defaultValue={{
                                            value: "0",
                                            label: "India",
                                            phone: "+91",
                                          }}
                                          onChange={(option: any) => {
                                            setSelectedCountryCode1(
                                              option.phone
                                            );
                                            setFieldValue(
                                              "codeMob",
                                              option.phone
                                            );
                                          }}
                                          onInputChange={(e) => {
                                            if (e?.length > 5) return "";
                                          }}
                                          formatOptionLabel={formatOptionLabel}
                                          filterOption={customFilter}
                                        />
                                      </div>
                                      <input
                                        name="phone"
                                        id="phonenums"
                                        autoComplete="off"
                                        minLength={6}
                                        maxLength={12}
                                        placeholder="Enter Contact Number"
                                        onChange={(e) => {
                                          regex.numberTyping.test(
                                            e.target.value
                                          ) && handleChange(e);
                                        }}
                                        value={values.phone}
                                        onBlur={(e) => {
                                          handleBlur(e);
                                          if (
                                            phoneNo &&
                                            phoneNo !== e.target.value
                                          ) {
                                            setSelectedPhone(e?.target?.value);
                                          } else
                                            setSelectedPhone(e?.target?.value);
                                          setMob1(e?.target?.value);
                                        }}
                                        className="form-control w-100"
                                      />
                                    </div>
                                    {!errors.phone && mobileErr1 && (
                                      <p className="form-error">
                                        Please check, entered Contact Number
                                        already exists!
                                      </p>
                                    )}
                                    {errors.phone && touched.phone && (
                                      <p className="form-error">
                                        {errors.phone}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="row">
                                <div className=" col-xl-6 col-lg-6 col-md-6 col-sm-12 d-inline">
                                  <div className="form-group browse-job">
                                    <label>Designation</label>
                                    <Select
                                      className="dropstyle"
                                      isSearchable={true}
                                      isClearable={true}
                                      isDisabled={false}
                                      options={designations}
                                      name="designation"
                                      placeholder="Select Designation"
                                      value={designations.find(
                                        (e) => values.designation === e.label
                                      )}
                                      onBlur={setFieldTouched}
                                      onChange={(option: any) => {
                                        setFieldValue("designation", option);
                                      }}
                                    />
                                    {errors.designation && (
                                      <p className="form-error">
                                        {errors.designation}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className=" col-xl-6 col-lg-6 col-md-6 col-sm-12 d-inline">
                                  <div className="form-group browse-job">
                                    <label>
                                      Role
                                      <span className="error">*</span>
                                    </label>
                                    <Select
                                      className="dropstyle"
                                      isSearchable={true}
                                      options={RoleOptions}
                                      name="role"
                                      placeholder="Select Role"
                                      isDisabled={true}
                                      defaultValue={{
                                        value: ROLES.RECRUITER,
                                        label: "Recruiter",
                                      }}
                                      value={RoleOptions.find(
                                        (e) => values.role === e.label
                                      )}
                                      onBlur={setFieldTouched}
                                      onChange={(option: any) => {
                                        setFieldValue("role", option);
                                      }}
                                    />
                                    {errors.role && touched.role && (
                                      <p className="form-error">
                                        {errors.role}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="row">
                                <div className=" col-xl-6 col-lg-6 col-md-6 col-sm-12 d-inline">
                                  <div className="form-group browse-job">
                                    <label className="">
                                      Alternate Email Address
                                    </label>
                                    <input
                                      maxLength={150}
                                      name="altEmail"
                                      autoComplete="off"
                                      placeholder="Enter Alternate Email Address"
                                      type="text"
                                      onChange={handleChange}
                                      value={values.altEmail}
                                      onBlur={handleBlur}
                                      className="form-control"
                                    />
                                    {values.email?.toLowerCase() ===
                                      values.altEmail?.toLowerCase() &&
                                      values.altEmail && (
                                        <p className="form-error">
                                          Please check, entered Alternate Email
                                          Address is same as Email Address!
                                        </p>
                                      )}
                                    {values.email?.toLowerCase() !==
                                      values.altEmail?.toLowerCase() &&
                                      !errors.altEmail &&
                                      mailErr2 && (
                                        <p className="form-error">
                                          Please check, entered Alternate Email
                                          Address already exists!
                                        </p>
                                      )}
                                    {errors.altEmail && touched.altEmail && (
                                      <>
                                        <p className="form-error">
                                          {errors.altEmail}
                                        </p>
                                      </>
                                    )}
                                  </div>
                                </div>

                                <div className=" col-xl-6 col-lg-6 col-md-6 col-sm-12 d-inline">
                                  <div className="form-group browse-job">
                                    <label>Alternate Contact Number</label>
                                    <div id="phonenumbers">
                                      <div style={{ width: "150px" }} id="mob">
                                        <Select
                                          id="codemob"
                                          className="dropstyle"
                                          name="altCodeMob"
                                          options={countries}
                                          value={countries.find(
                                            (e) =>
                                              selectedCountryCode2 === e.phone
                                          )}
                                          placeholder="Select Code"
                                          defaultValue={{
                                            value: "0",
                                            label: "India",
                                            phone: "+91",
                                          }}
                                          onChange={(option: any) => {
                                            setSelectedCountryCode2(option);
                                            setFieldValue(
                                              "altCodeMob",
                                              option.phone
                                            );
                                          }}
                                          onInputChange={(e) => {
                                            if (e?.length > 5) return "";
                                          }}
                                          formatOptionLabel={formatOptionLabel}
                                          filterOption={customFilter}
                                        />
                                      </div>

                                      <input
                                        name="altPhone"
                                        id="phonenums"
                                        autoComplete="off"
                                        minLength={6}
                                        maxLength={12}
                                        title=""
                                        placeholder="Enter Alternate Contact Number"
                                        onChange={(e) => {
                                          regex.numberTyping.test(
                                            e.target.value
                                          ) && handleChange(e);
                                        }}
                                        value={values.altPhone}
                                        onBlur={handleBlur}
                                        className="form-control w-100"
                                      />
                                    </div>
                                    {values.phone === values.altPhone &&
                                      values.altPhone && (
                                        <p className="form-error">
                                          Please check, entered Alternate
                                          Contact Number is same as Contact
                                          Number!
                                        </p>
                                      )}
                                    {values.phone !== values.altPhone &&
                                      !errors.altPhone &&
                                      mobileErr2 && (
                                        <p className="form-error">
                                          Please check, entered Alternate
                                          Contact Number already exists!
                                        </p>
                                      )}
                                    {errors.altPhone && touched.altPhone && (
                                      <p className="form-error">
                                        {errors.altPhone}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col col-12 col-sm-12">
                                  <fieldset
                                    className="p-2"
                                    style={{
                                      border: "solid black 2px",
                                      borderRadius: "5px",
                                    }}
                                  >
                                    <legend
                                      className="p-1"
                                      style={{ width: "95px" }}
                                    >
                                      <div className="form-group browse-job">
                                        <label>
                                          Permission
                                          <span className="error">*</span>
                                        </label>
                                      </div>
                                    </legend>

                                    <section
                                      style={{ marginTop: "-20px" }}
                                      className="container d-flex justify-content-between"
                                    >
                                      <div className="custom-control custom-checkbox">
                                        <input
                                          className="custom-control-input"
                                          id="mij"
                                          type="checkbox"
                                          name="mij"
                                          checked={values.mij}
                                          onChange={(e) => {
                                            setFieldValue(
                                              "mij",
                                              e.target.checked
                                            );
                                            let temp =
                                              values?.allPerimission?.indexOf(
                                                perimissionE.MIJ
                                              );
                                            if (temp === -1 && !values.mij) {
                                              values?.allPerimission?.push(
                                                perimissionE.MIJ
                                              );
                                            }
                                            if (temp !== -1 && values.mij) {
                                              values?.allPerimission?.splice(
                                                temp,
                                                1
                                              );
                                            }
                                          }}
                                        />
                                        <label
                                          className="custom-control-label"
                                          htmlFor="mij"
                                        >
                                          Manage Internal Job (IJP, RJP)
                                        </label>
                                      </div>

                                      <div className="custom-control custom-checkbox">
                                        <input
                                          className="custom-control-input"
                                          id="mej"
                                          type="checkbox"
                                          name="mej"
                                          checked={values.mej}
                                          onChange={(e) => {
                                            setFieldValue(
                                              "mej",
                                              e.target.checked
                                            );
                                            let temp =
                                              values?.allPerimission?.indexOf(
                                                perimissionE.MEJ
                                              );
                                            if (temp === -1 && !values.mej) {
                                              values.allPerimission.push(
                                                perimissionE.MEJ
                                              );
                                            }
                                            if (temp !== -1 && values.mej) {
                                              values?.allPerimission?.splice(
                                                temp,
                                                1
                                              );
                                            }
                                          }}
                                        />
                                        <label
                                          className="custom-control-label"
                                          htmlFor="mej"
                                        >
                                          Manage External Job (Hot, Private)
                                        </label>
                                      </div>
                                    </section>
                                  </fieldset>
                                  {errors.allPerimission &&
                                    (touched.mij || touched.mej) && (
                                      <p className="form-error">
                                        {errors.allPerimission}
                                      </p>
                                    )}
                                </div>
                              </div>

                              <div className="row">
                                <div className="col col-12 col-sm-12">
                                  <div className="form-group mt-3 browse-job">
                                    <div className="custom-control custom-checkbox">
                                      <input
                                        className="custom-control-input"
                                        id="restrict"
                                        type="checkbox"
                                        name="restrict"
                                        checked={values.restrict}
                                        onChange={(e: any) => {
                                          const event = {
                                            target: {
                                              name: "restrict",
                                              value: e.target.checked,
                                            },
                                          };
                                          handleChange(event);
                                          e?.target?.checked &&
                                            setFieldValue("weekday", []);
                                          e?.target?.checked &&
                                            setFieldValue("fromDate", null);
                                          e?.target?.checked &&
                                            setFieldValue("toDate", null);
                                          e?.target?.checked &&
                                            setFieldValue("fromTimeVal", null);
                                          e?.target?.checked &&
                                            setFieldValue("toTimeVal", null);
                                        }}
                                      />
                                      <label
                                        className="custom-control-label"
                                        htmlFor="restrict"
                                      >
                                        Time Restriction
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {values.restrict && (
                                <div>
                                  <div className="isHotDiv ">
                                    <span>
                                      Here, date and time are used to give the
                                      recruiter access to the application within
                                      that specified date range.
                                    </span>
                                  </div>
                                  <div
                                    className="row d-flex "
                                    style={{ marginTop: "-2%" }}
                                  >
                                    <div>
                                      <div className=" col-xl-12 col-lg-12 col-md-12 col-sm-12 d-inline">
                                        <LocalizationProvider
                                          dateAdapter={AdapterDayjs}
                                        >
                                          <DemoContainer
                                            components={[
                                              "DatePicker",
                                              "MobileTimePicker",
                                            ]}
                                          >
                                            <div className=" col-xl-3 col-lg-3 col-md-3 col-sm-12 d-inline">
                                              <div className="form-group browse-job">
                                                <label>
                                                  From Date
                                                  <span className="error">
                                                    *
                                                  </span>
                                                </label>
                                                <DatePicker
                                                  className="dropstyle"
                                                  value={values.fromDate}
                                                  format="DD-MM-YYYY"
                                                  disablePast
                                                  onChange={(newValue) => {
                                                    setEndDate(null);
                                                    setDateFrom(newValue);
                                                    setFieldValue(
                                                      "weekday",
                                                      []
                                                    );
                                                    values.weekday = [];
                                                    setFieldValue(
                                                      "fromTimeVal",
                                                      null
                                                    );
                                                    if (
                                                      newValue?.$D &&
                                                      newValue?.$M + 1 &&
                                                      newValue?.$y &&
                                                      new Date(
                                                        newValue.$y,
                                                        newValue.$M,
                                                        newValue.$D
                                                      ) < new Date() &&
                                                      !isSameDay(
                                                        new Date(
                                                          newValue.$y,
                                                          newValue.$M,
                                                          newValue.$D
                                                        ),

                                                        new Date()
                                                      )
                                                    ) {
                                                      values.toDate = "";
                                                      setStartDate(null);
                                                      setFieldValue(
                                                        "fromDate",
                                                        null
                                                      );
                                                      setWalkindateError(
                                                        "Please select a future date."
                                                      );
                                                    } else {
                                                      setStartDate(newValue);
                                                      setWalkindateError("");
                                                      setFieldValue(
                                                        "fromDate",
                                                        newValue
                                                      );
                                                    }
                                                    setTouch1(false);
                                                  }}
                                                  onClose={() => {
                                                    setTouch1(true);
                                                  }}
                                                />
                                                {!errors?.fromDate &&
                                                  touch1 &&
                                                  values?.fromDate === null && (
                                                    <p className="form-error">
                                                      Please select From Date.
                                                    </p>
                                                  )}
                                                {walkindateError && (
                                                  <p className="form-error">
                                                    {walkindateError}
                                                  </p>
                                                )}
                                                {!walkindateError &&
                                                  errors.fromDate &&
                                                  touched.fromDate && (
                                                    <p className="form-error">
                                                      {errors.fromDate}
                                                    </p>
                                                  )}
                                              </div>
                                            </div>

                                            <div
                                              className=" col-xl-3 col-lg-3 col-md-3 col-sm-12 d-inline"
                                              style={{ marginLeft: "-10px" }}
                                            >
                                              <div className="form-group browse-job">
                                                <label>
                                                  Till Date
                                                  <span className="error">
                                                    *
                                                  </span>
                                                </label>
                                                <DatePicker
                                                  value={
                                                    endDate ? endDate : null
                                                  }
                                                  format="DD-MM-YYYY"
                                                  minDate={values.fromDate}
                                                  disabled={!dateFrom}
                                                  onChange={(newValue) => {
                                                    setDateTo(newValue);
                                                    setEdateError(false);
                                                    setFieldValue(
                                                      "weekday",
                                                      []
                                                    );
                                                    values.weekday = [];
                                                    setFieldValue(
                                                      "toTimeVal",
                                                      null
                                                    );
                                                    if (
                                                      newValue?.$D &&
                                                      newValue?.$M + 1 &&
                                                      newValue?.$y &&
                                                      new Date(
                                                        `${newValue?.$M + 1}-${
                                                          newValue?.$D
                                                        }-${newValue?.$y}`
                                                      ) <
                                                        new Date(
                                                          `${
                                                            startDate?.$M + 1
                                                          }-${startDate?.$D}-${
                                                            startDate?.$y
                                                          }`
                                                        )
                                                    ) {
                                                      setFieldValue(
                                                        "toDate",
                                                        null
                                                      );
                                                      setEndDate(null);
                                                      setRefreshenddateError(
                                                        "Please select Till Date should be greater than From Date."
                                                      );
                                                    } else if (
                                                      newValue.isBefore(
                                                        dayjs(values.fromDate),
                                                        "day"
                                                      )
                                                    ) {
                                                      setEndDate(null);
                                                      setRefreshenddateError(
                                                        "Till Date should be greater than From Date."
                                                      );
                                                    } else {
                                                      setEndDate(newValue);
                                                      setRefreshenddateError(
                                                        ""
                                                      );
                                                      setFieldValue(
                                                        "toDate",
                                                        newValue
                                                      );
                                                    }
                                                  }}
                                                  onClose={() => {
                                                    setTouch2(true);
                                                  }}
                                                />
                                                {!errors?.toDate &&
                                                  touch2 &&
                                                  values?.toDate === null && (
                                                    <p className="form-error">
                                                      Please select Till Date.
                                                    </p>
                                                  )}
                                                {refreshsenddateError &&
                                                  !edateError && (
                                                    <p className="form-error">
                                                      {refreshsenddateError}
                                                    </p>
                                                  )}
                                                {errors.toDate &&
                                                  touched.toDate && (
                                                    <p className="form-error">
                                                      {errors.toDate}
                                                    </p>
                                                  )}
                                              </div>
                                            </div>

                                            <div className=" col-xl-3 col-lg-3 col-md-3 col-sm-12 d-inline">
                                              <div className="">
                                                <div className="form-group browse-job">
                                                  <label
                                                    style={{
                                                      marginLeft: "-14px",
                                                    }}
                                                  >
                                                    From Time
                                                    <span className="error">
                                                      *
                                                    </span>
                                                  </label>
                                                </div>
                                                <div
                                                  style={{
                                                    marginTop: "-15px",
                                                  }}
                                                  className="row"
                                                >
                                                  <MobileTimePicker
                                                    views={["hours", "minutes"]}
                                                    value={values.fromTimeVal}
                                                    disablePast={
                                                      dateFrom?.$D ===
                                                        new Date().getDate() &&
                                                      dateFrom?.$M ===
                                                        new Date().getMonth() &&
                                                      dateFrom.$y ===
                                                        new Date().getFullYear()
                                                    }
                                                    className="dobselect fs-6"
                                                    ampm={false}
                                                    onOpen={() => {
                                                      setTouchedSTime(false);
                                                    }}
                                                    onChange={(newValue) => {
                                                      setFieldValue(
                                                        "fromTimeVal",
                                                        newValue
                                                      );
                                                      setTouch3(false);
                                                    }}
                                                    onClose={() => {
                                                      setTouch3(true);
                                                    }}
                                                  />
                                                  {timeError && (
                                                    <p className="form-error">
                                                      {timeError}
                                                    </p>
                                                  )}
                                                  {!dateErr &&
                                                    errors.fromTimeVal &&
                                                    touched.fromTimeVal && (
                                                      <p className="form-error">
                                                        {errors.fromTimeVal}
                                                      </p>
                                                    )}
                                                  {dateErr && (
                                                    <p className="form-error">
                                                      {dateErr}
                                                    </p>
                                                  )}
                                                  {timeError && (
                                                    <p className="form-error">
                                                      {timeError}
                                                    </p>
                                                  )}
                                                </div>
                                              </div>
                                            </div>

                                            <div
                                              className="col-xl-3 col-lg-3 col-md-3 col-sm-12 d-inline"
                                              style={{ marginLeft: "-7px" }}
                                            >
                                              <div className="form-group browse-job">
                                                <div>
                                                  <div>
                                                    <label>
                                                      Till Time
                                                      <span className="error">
                                                        *
                                                      </span>
                                                    </label>
                                                  </div>
                                                </div>
                                                <MobileTimePicker
                                                  views={["hours", "minutes"]}
                                                  value={values.toTimeVal}
                                                  className="dobselect fs-6 "
                                                  ampm={false}
                                                  disablePast={
                                                    dateFrom?.$D ===
                                                      dateTo?.$D &&
                                                    dateFrom?.$M ===
                                                      dateTo?.$M &&
                                                    dateFrom?.$y === dateTo?.$y
                                                  }
                                                  onOpen={() => {
                                                    setTouchedETime(false);
                                                  }}
                                                  onChange={(newValue) => {
                                                    setFieldValue(
                                                      "toTimeVal",
                                                      newValue
                                                    );
                                                    setTouch4(false);
                                                  }}
                                                  onClose={() => {
                                                    setTouch4(true);
                                                  }}
                                                />
                                                {!errors?.toTimeVal &&
                                                  datas &&
                                                  new Date(
                                                    values?.toDate?.$d
                                                  )?.getDate() ===
                                                    new Date()?.getDate() &&
                                                  new Date(
                                                    values?.toDate?.$d
                                                  )?.getMonth() ===
                                                    new Date()?.getMonth() &&
                                                  new Date(
                                                    values?.toDate?.$d
                                                  )?.getFullYear() ===
                                                    new Date()?.getFullYear() &&
                                                  values?.fromTimeVal?.$d >
                                                    values?.toTimeVal?.$d &&
                                                  datas?.toTimeVal !==
                                                    values?.toTimeVal && (
                                                    <p className="form-error">
                                                      Please select Till Time
                                                      greater than From Time.
                                                    </p>
                                                  )}
                                                {!errors?.toTimeVal &&
                                                  !datas &&
                                                  new Date(
                                                    values?.toDate?.$d
                                                  )?.getDate() ===
                                                    new Date()?.getDate() &&
                                                  new Date(
                                                    values?.toDate?.$d
                                                  )?.getMonth() ===
                                                    new Date()?.getMonth() &&
                                                  new Date(
                                                    values?.toDate?.$d
                                                  )?.getFullYear() ===
                                                    new Date()?.getFullYear() &&
                                                  values?.fromTimeVal?.$d >
                                                    values?.toTimeVal?.$d && (
                                                    <p className="form-error">
                                                      Please select Till Time
                                                      greater than From Time.
                                                    </p>
                                                  )}
                                                {!errors?.toTimeVal &&
                                                  touch4 &&
                                                  !values?.toTime &&
                                                  values?.toTimeVal ===
                                                    null && (
                                                    <p className="form-error">
                                                      Please select Till Time.
                                                    </p>
                                                  )}
                                                {errors.toTimeVal &&
                                                  touched.toTimeVal && (
                                                    <p className="form-error">
                                                      {errors.toTimeVal}
                                                    </p>
                                                  )}
                                              </div>
                                            </div>
                                          </DemoContainer>
                                        </LocalizationProvider>
                                      </div>
                                    </div>
                                  </div>

                                  <div style={{ marginTop: "-3%" }}>
                                    <label>Weekday Restriction</label>
                                    <div>
                                      <span className="font_italic_sm ">
                                        Here, a weekday restriction is used to
                                        prevent the recruiter from accessing the
                                        application on a specified weekday or
                                        days within those dates.
                                      </span>
                                    </div>
                                  </div>
                                  <div className="row ">
                                    <div className="col col-xl-12 col-lg-12 col-md-12 col-sm-12 d-flex">
                                      <div
                                        className=" col-xl-6 col-lg-6 col-md-6 col-sm-12 d-sm-inline"
                                        style={{ marginLeft: "-12px" }}
                                      >
                                        <div className="mt-2">
                                          <Select
                                            className="dropstyle"
                                            isSearchable={true}
                                            isOptionDisabled={() =>
                                              selectDisable
                                            }
                                            isMulti={true}
                                            isClearable={false}
                                            options={resWeekdays}
                                            menuPlacement="top"
                                            name="weekday"
                                            placeholder="Select WeekDays Restriction"
                                            defaultValue={WEEKDAYS?.filter(
                                              (e: any) =>
                                                values?.weekday?.includes(
                                                  e?.value
                                                )
                                            )}
                                            onBlur={setFieldTouched}
                                            onChange={(
                                              e: any,
                                              actionObject: any
                                            ) => {
                                              switch (actionObject?.action) {
                                                case "select-option":
                                                  limitLocation(e);
                                                  onLocationSelectHandler(
                                                    values,
                                                    actionObject?.option?.value,
                                                    actionObject?.action
                                                  );
                                                  return;
                                                case "remove-value":
                                                  limitLocation(e);
                                                  onLocationSelectHandler(
                                                    values,
                                                    actionObject?.removedValue
                                                      ?.value,
                                                    actionObject?.action
                                                  );
                                                  break;
                                                default:
                                                  break;
                                              }
                                            }}
                                          />
                                        </div>
                                        {errors.weekday && touched.weekday && (
                                          <p className="form-error">
                                            {errors.weekday}
                                          </p>
                                        )}
                                      </div>
                                      <div className=" col-xl-6 col-lg-6 col-md-6 col-sm-12 d-sm-inline">
                                        &nbsp;
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              <button
                                className="btn btn-primary float-right site-button"
                                type={"submit"}
                                style={{ marginTop: "-15px" }}
                              >
                                {loadingUP && (
                                  <i
                                    className="fa fa-circle-o-notch fa-spin"
                                    style={{
                                      marginRight: "10px",
                                    }}
                                  ></i>
                                )}
                                {loadingUP ? "Submiting..." : "Submit"}
                              </button>
                              <button
                                className="mr-2 site-button site-warning-button float-right"
                                type="button"
                                style={{ marginTop: "-15px" }}
                                onClick={() => {
                                  setModal(false);
                                  props.func(false);
                                  resetFunc();
                                }}
                              >
                                Cancel
                              </button>
                            </form>
                          </div>
                        </>
                      );
                    }}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AddEditEmpUser;
