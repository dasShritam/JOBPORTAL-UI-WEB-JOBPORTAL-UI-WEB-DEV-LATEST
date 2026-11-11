import { Formik } from "formik";
import Pagination from "rc-pagination";
import React, { useEffect, useRef, useState } from "react";
import { Accordion, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { BsCloudDownload, BsPersonCircle, BsPersonFill } from "react-icons/bs";
import { MdOutlineReplay } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { regex } from "../../../common/validation";
import {
  addUserLimit,
  authEmpRegister,
  downloadUserInfo,
  getMasterDataLimit,
  resetUserLimit,
} from "../../../redux/features/admin/AuthEmployerRegSlice";
import {
  resetEmpActionCreator,
  validateUser,
} from "../../../redux/features/authentication/userMailSlice";
import { getCountryCode } from "../../../redux/features/masterData/countrySlice";
import { getIndustryType } from "../../../redux/features/masterData/industrySlice";

import { Avatar, Chip, IconButton, Switch } from "@mui/material";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { TbClearAll } from "react-icons/tb";
import {
  Content,
  GetTimeFromTimeStamp,
  customStyles,
  getTimestampToDate,
} from "../../../common/common";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import {
  companyDetails,
  employersDetails,
  resendMail,
  resetCompanyUserManage,
  resetEmployerUserProfileMange,
  resetResendMail,
  resetuserAccessibility,
  userAccessibility,
} from "../../../redux/features/admin/userManagement/UserManagementSlice";
import {
  downloadSAS,
  successSAS,
} from "../../../redux/features/jobs/job-applications/downloadSASSlice";
import AdminRegistration_Skeleton from "./adminRegistration_Skeleton";
import "../../../assets/customCss/EmployeeRegister.css";
import "../../../assets/customCss/EmpUserManagement.css";
import {
  companySAS,
  resetCompnySAS,
} from "../../../redux/features/jobs/job-applications/downloadCompSASSlice";
import { Tooltip } from "@material-ui/core";
import { RiDownload2Fill } from "react-icons/ri";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
let bnr = require("../../../assets/images/background/tech-04.png");
var notFoundimg = require("../../../assets/images/background/No-record.png");

const INITIAL_FORM_STATE: any = {
  firstname: "",
  lastname: "",
  userEmail: "",
  mobileNumber: "",
  country: "",
  companyName: "",
  industryName: "",
  designation: "",
  pinCode: "",
  address: "",
  access: "true",
};
const PATENT_FORM_VALIDATION = Yup.object().shape({
  firstname: Yup.string()
    .matches(regex.firstname, "Numeric and special characters are not allowed.")
    .trim("Empty space not allowed.")
    .min(1, "First Name must contains minimum 3 characters.")
    .max(100)
    .required("Please enter First Name."),
  lastname: Yup.string()
    .matches(regex.lastName, "Numeric and special characters are not allowed.")
    .trim("Empty space not allowed.")
    .required("Please enter Last Name."),
  userEmail: Yup.string()
    .matches(
      regex.email,
      "Sorry, Only Letters, Numbers and Periods(.) are allowed."
    )
    .trim("Empty space not allowed")
    .required("Please enter Email Address."),
  country: Yup.string().notRequired(),
  mobileNumber: Yup.string()
    .required("Please enter Mobile Number.")
    .trim("Empty space not allowed.")
    .matches(
      regex.international_mobile,
      "Please enter Mobile Number with minimum of 6 digits and maximum of 12 digits."
    ),
  companyName: Yup.string()
    .matches(
      regex.companyName,
      `Please enter valid Company Name. Start with alphabets and allowed characters are numbers, spaces and ( & ' . , ( ) - @ _) `
    )
    .trim("Empty space not allowed.")
    .required("Please enter Company Name."),
  industryName: Yup.object().nullable().required("Please select Industry."),
  designation: Yup.string()
    .trim("Empty space not allowed.")
    .min(1, "Please enter Designation.")
    .required("Please enter Designation.")
    .matches(
      regex.designation,
      "Please enter valid Designation. Start with alphabets and allowed characters are numbers, spaces and (- .)."
    ),
  pinCode: Yup.string()
    .trim("Empty space not allowed.")
    .matches(
      regex.pinCode,
      "Please enter Company Pin Code with minimum of 4 digits and maximum of 6 digits."
    )
    .required("Please enter Company Pin Code."),
  address: Yup.string()
    .trim("Empty space not allowed.")
    .min(1, "Please enter the correct company Address.")
    .required("Please enter Company Address."),
  access: Yup.string().required("Please select Access."),
});
const FILTERACTIVEOPTION = [
  { label: "ALL Company", value: null },
  { label: "Only Active Company", value: "ACTIVE" },
  { label: "Only Inactive Company", value: "INACTIVE" },
];
const FILTERACTIVEOPTION2 = [
  { label: "ALL User", value: null },
  { label: "Only Active User", value: "ACTIVE" },
  { label: "Only Inactive User", value: "INACTIVE" },
];
let countries = new Array<Country>();
interface Country {
  value: string;
  label: string;
  phone: string;
}
let industries: any = new Array<Industry>();
interface Industry {
  value: String;
  label: string;
}
const EmployerRegistration = () => {
  const dispatch = useDispatch();
  const [emailreg, setEmailreg] = useState(false),
    [mailErr, setMailErr] = useState(false),
    [mobileErr, setMobileErr] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState<any>({
    value: "0",
    label: "India",
    phone: "+91",
  });
  const [selectedPhone, setSelectedPhone] = useState("");
  const [industryValue, setIndustryValue] = useState<any>();
  const [clear, setClear] = useState<any>();
  const [accessVal, setAccessVal] = useState("true");
  const { UserCheck, loadingU } = useSelector(
    (state: any) => state.userMailVerify
  ),
    { authEmpReg, loading } = useSelector((state: any) => state.authEmpReg),
    { IndustryType } = useSelector((state: any) => state.industryType),
    { CountryCode } = useSelector((state: any) => state.countryCode);

  //useEffect
  const [showTable, setShowtable] = useState(false);
  const [CountryCodes, setCountryCode] = useState<any>();
  const [allData, setAllData] = useState<any>([]);
  const [companyTable, setCompanyTable] = useState<any>("");
  const [empTable, setEmpTable] = useState<any>("");
  const [userid, setUserid] = useState<any>("");
  const [companyName, setCompanyName] = useState("");
  const JobData = useSelector((state: any) => state.JobSeekerData1);
  const sCompanyDetail = useSelector((state: any) => state.companyDetails);
  const employerDetails = useSelector((state: any) => state.employersDetails);
  const { JobSeekerArray, loadingJobSeeker } = JobData;
  const [resetFilter, setResetFilter] = useState(false);
  const [Ename, setEname] = useState("");
  const [searchTrigger, setSearchTrigger] = useState<any>(null);
  const [aa, setaa] = useState<any>("");
  const [expState, setExpState] = useState<any>("");
  const [IsactiveState, setIsactivestate] = useState<any>({
    label: "ALL Users",
    value: null,
  });
  const [filterbyanyone, setFilterbyanyone] = useState<any>(true);
  const [withPaginationFilter, setWithpaginationFilter] = useState<any>(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showJSEditPopup, setShowJSEditPopup] = useState(false);
  const [userLimit, setUserLimit] = useState<any>(0);
  // const [AddUserLimit,setAddUserLimit]=useState<any>("")
  const [defaultlimit, setDefaultLimit] = useState<any>("");
  const [jspreviewLimit, setJspreviewLimit] = useState<any>("");
  const [reachedLimit, setReachedLimit] = useState("");
  const [addlimit, setAddlimit] = useState("0");
  const [totallimit, setTotalLimit] = useState<any>("");
  const [editUserid, setEditUserid] = useState<any>();
  const [MasterUserLimit, setMasterUserLimit] = useState<any>();
  const [PopupErr, setPopupErr] = useState(false);
  const [popupTotalLimitErr, setPopupTotalLimitErr] = useState(false);
  const [DaysErr, setDaysErr] = useState(false);
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [disEndDate, setdisEndDate] = useState<any>(null);
  const [DateErr, setDateErr] = useState<any>("");
  const snackAlert = UseToastAlert();
  const [loaderr, setLoaderr] = useState<any>({});
  const [loaderid, setloaderid] = useState<any>();
  const myRef = useRef<any>(null);
  const executeScroll = () =>
    myRef?.current?.scrollIntoView({ behavior: "smooth" });
  let resendMailState = useSelector((state: any) => state.resendMail);
  let userAccessibilityState = useSelector(
    (state: any) => state.userAccessibility
  );
  const { AddUserlimitRes, AddUserlimitloading } = useSelector(
    (state: any) => state.AddUserLimitData
  );
  const { cmasterDataLimit, cmasterDataloading } = useSelector(
    (state: any) => state.AddMasterdataLimitData
  );
  const [page] = useState(1);
  useEffect(() => {
    if (resendMailState?.loading) {
      setLoaderr((prevState) => ({ ...prevState, [loaderid]: true }));
    } else {
      setLoaderr((prevState) => ({ ...prevState, [loaderid]: false }));
    }
  }, [resendMailState?.loading]);
  useEffect(() => {
    if (AddUserlimitRes && AddUserlimitRes?.code === 200) {
      showSnackAlert("success", AddUserlimitRes?.message);
      dispatch(
        companyDetails({
          pageid: page,
          pageLimit: 10,
          companyId: userid ? userid : "",
          active: withPaginationFilter ? IsactiveState.value : null,
          companyName: withPaginationFilter && Ename ? Ename : null,
        })
      );
      setShowEditPopup(false);
      setShowJSEditPopup(false);
      dispatch(resetUserLimit());
    } else if (
      (AddUserlimitRes && AddUserlimitRes?.data?.code === 401) ||
      (AddUserlimitRes && AddUserlimitRes?.data?.code === 400) ||
      (AddUserlimitRes && AddUserlimitRes?.data?.code === 500)
    ) {
      showSnackAlert("warning", AddUserlimitRes?.data?.message[0]);
      dispatch(resetUserLimit());
    }
  }, [AddUserlimitRes]);

  useEffect(() => {
    const masterDataObj = [
      {
        group: "APPCON",
        active: 1,
      },
    ];

    dispatch(getMasterDataLimit(masterDataObj));
  }, []);

  useEffect(() => {
    if (cmasterDataLimit && cmasterDataLimit?.data) {
      cmasterDataLimit?.data.map((e: any) => {
        let typeOptions: any = [];
        if (e.group == "APPCON") {
          e?.data?.map((e: any) => {
            setMasterUserLimit(JSON.parse(e.value));
          });
        }
      });
    }
  }, [cmasterDataLimit]);

  useEffect(() => {
    dispatch(getCountryCode({ pageno: -1, search: "" }));
    dispatch(getIndustryType({ pageno: -1, search: "" }));
    setEmailreg(false);
    setMobileErr(false);
    setMailErr(false);
    dispatch(resetEmpActionCreator());
    // dispatchfunction();
  }, []);

  useEffect(() => {
    if (authEmpReg?.code === 200) {
      setEmailreg(true);
      clearFunc();
      dispatch(resetEmpActionCreator());
    }
  }, [authEmpReg]);

  useEffect(() => {
    if (
      CountryCode &&
      CountryCode?.code &&
      CountryCode?.code === 200 &&
      !countries.length
    ) {
      CountryCode?.data.map((e: any, i: number) => {
        countries.push({ value: `${1 + i}`, label: e.name, phone: e.code });
      });
    }
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
  }, [CountryCode, IndustryType]);

  useEffect(() => {
    if (UserCheck && UserCheck.code && UserCheck.code === 200) {
      if (
        UserCheck?.data[0]?.key === "email" &&
        UserCheck?.data[0]?.exist === true
      ) {
        setMailErr(true);
      } else if (
        UserCheck?.data[0]?.key === "email" &&
        UserCheck?.data[0]?.exist === false
      ) {
        setMailErr(false);
      }
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
  }, [UserCheck, mailErr, mobileErr]);

  //Internal function
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

  const validateEmail = (e: any) => {
    e.preventDefault();
    const email = regex.email.test(e?.target?.value);
    if (email) {
      dispatch(
        validateUser({
          data: [{ key: "email", value: e?.target?.value.toLowerCase() }],
        })
      );
    }
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

  const validatePhone = () => {
    let code = selectedCountryCode?.phone ? selectedCountryCode?.phone : "91";
    const phone = regex.international_mobile.test(selectedPhone);
    if (phone) {
      dispatch(
        validateUser({
          data: [
            {
              key: "phone",
              code: `${selectedCountryCode?.phone}`,
              value: `${selectedPhone}`,
            },
          ],
        })
      );
    }
  };
  useEffect(() => {
    validatePhone();
  }, [selectedCountryCode, selectedPhone]);

  const clearFunc = () => {
    clear.v.industryName = "";
    clear.e();
    clear.v.industryName = "";
    setMobileErr(false);
    setMailErr(false);
    setSelectedCountryCode({
      value: "0",
      lable: "India",
      phone: "+91",
    });

    // setClear(undefined);
  };
  const handleConfirmSwal = (empRegDetails: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to register this Employer?",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(authEmpRegister(empRegDetails));
      }
    });
  };

  const [hideEmployer, setHideEmployer] = useState<boolean>(false);

  const handleClose = () => {
    setHideEmployer(false);
  };
  const handleHideTable = () => {
    setHideEmployer(true);
  };
  const tableRef = useRef(null);
  interface CardData {
    FullName: string;
    EmailAdress: string;
    DOB: Number;
    MobileNo: Number;
    WorkStatus: string;
    IsPortalAccessallowed: boolean;
    // Resume:
  }
  const [currentpage, setCurrentPage] = useState(1),
    [currentpage1, setCurrentPage1] = useState(1),
    [perPage, setPerPage] = useState(10),
    [size, setSize] = useState(perPage),
    [count, setCount] = useState(0),
    [data, setData] = useState<CardData[]>([]),
    showSnackAlert = UseToastAlert(),
    PerPageChange = (value: any) => {
      setSize(value);
      if (data) {
        Math.ceil(data?.length / value);
      }
    };

  const PaginationChange = (page: any, pageSize: any) => {
    executeScroll();
    setCurrentPage(page);
    // setCurrentPage1(page);
    setSize(pageSize);
    if (!showTable) {
      dispatch(resetEmployerUserProfileMange);
      dispatch(resetCompanyUserManage);
      dispatch(
        companyDetails({
          pageid: page,
          pageLimit: 10,
          companyId: userid ? userid : "",
          active: withPaginationFilter ? IsactiveState.value : null,
          companyName: withPaginationFilter && Ename ? Ename : null,
        })
      );
    }
  };

  const PaginationChangeEmp = (page: any, pageSize: any) => {
    executeScroll();
    // setCurrentPage(page);
    setCurrentPage1(page);
    setSize(pageSize);
    if (showTable) {
      dispatch(resetEmployerUserProfileMange);
      dispatch(resetCompanyUserManage);
      dispatch(
        employersDetails({
          pageid: page,
          pageLimit: 10,
          companyId: userid ? userid : "",
        })
      );
    }
  };
  const PrevNextArrow = (current: any, type: any, originalElement: any) => {
    if (type === "prev") {
      return (
        <button
          title="prev"
          className="previous"
          style={{ borderColor: "#eae6e6", borderRadius: "2px" }}
        >
          <i className="ti-arrow-left"></i> Prev
        </button>
      );
    }

    if (type === "next") {
      return (
        <button
          title="next"
          style={{ borderColor: "#eae6e6", borderRadius: "2px" }}
          className="pagination"
        >
          Next <i className="ti-arrow-right"></i>
        </button>
      );
    }
    return originalElement;
  };

  useEffect(() => {
    if (userAccessibilityState?.res?.code === 200) {
      showSnackAlert("success", userAccessibilityState?.res?.message);
      dispatch(resetuserAccessibility());
      dispatchfunction();
    } else if (userAccessibilityState?.res?.code === 400) {
      showSnackAlert("warning", userAccessibilityState?.res?.message);
    } else if (userAccessibilityState?.res?.code === 500) {
      showSnackAlert("error", userAccessibilityState?.res?.message);
      dispatch(resetuserAccessibility());
    }
  }, [userAccessibilityState]);
  useEffect(() => {
    if (resendMailState?.res?.code === 200) {
      showSnackAlert("success", resendMailState?.res?.message);
      dispatch(resetResendMail());
    } else if (resendMailState?.res?.code === 400) {
      showSnackAlert("warning", resendMailState?.res?.message);
      dispatch(resetResendMail());
    } else if (resendMailState?.res?.code === 500) {
      showSnackAlert("error", resendMailState?.res?.message);
      dispatch(resetResendMail());
    }
  }, [resendMailState]);
  function handleDeleteSwal(data) {
    const Ddata = {
      userId: data?.id,
      accessType: !data?.active ? "ENABLE" : "DISABLE",
    };
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${Ddata.accessType == "ENABLE" ? "enable" : "disable"
        } user!`,
      showCancelButton: true,
      confirmButtonColor: "#2a9f2a ",
      cancelButtonColor: "#db1919 ",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(userAccessibility(Ddata));
      }
    });
  }

  const handleSwal = () => {
    Swal.fire({
      title: "Do you want to add one more user",
      showCancelButton: true,
      confirmButtonColor: "#2a9f2a ",
      cancelButtonColor: "#db1919 ",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (!result.isConfirmed) {
        setHideEmployer(false);
        setResetFilter(!resetFilter);
      } else {
        setResetFilter(!resetFilter);
      }
    });
  };

  function changeIsActiveCompany(data, companyId) {
    const Ddata = {
      userId: null,
      accessType: data.target.checked ? "ENABLE" : "DISABLE",
      companyId: companyId ? companyId : null,
    };
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${data.target.checked ? "enable" : "disable"
        } this company`,
      showCancelButton: true,
      confirmButtonColor: "#2a9f2a ",
      cancelButtonColor: "#db1919 ",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(userAccessibility(Ddata));
      }
    });
  }

  function dispatchfunction() {
    {
      if (!showTable) {
        dispatch(resetEmployerUserProfileMange);
        dispatch(resetCompanyUserManage);
        dispatch(
          companyDetails({
            pageid: currentpage ? currentpage : 1,
            pageLimit: 10,
            companyId: !showTable ? (userid ? userid : "") : "",
            active: IsactiveState.value,
            companyName: Ename ? Ename : "",
          })
        );
      }
    }
    // setResetFilter(false);
    // setSearchTrigger(null);
  }
  function dispatchEmpfunction(c_id) {
    if (showTable) {
      dispatch(resetEmployerUserProfileMange);
      dispatch(resetCompanyUserManage);
      dispatch(
        employersDetails({
          pageid: currentpage1 ? currentpage1 : 1,
          pageLimit: 10,
          companyId: c_id ? c_id : userid ? userid : "",
        })
      );
      // setResetFilter(false);
    }
  }
  function dispatchUpdateFunction() {
    const defaultDate =
      Math.floor(+new Date() / 1000) + 86400 * MasterUserLimit?.sub_dur_days;
    const selectedDate = `${endDate?.$M + 1}/${endDate?.$D}/${endDate?.$y}`;
    let timestampForDate = new Date(`${selectedDate}`);
    timestampForDate.setHours(23);
    timestampForDate.setMinutes(59);
    timestampForDate.setSeconds(59);
    dispatch(
      addUserLimit({
        employerUsersLimit: defaultlimit
          ? Number(userLimit) + Number(defaultlimit)
          : Number(userLimit) === 0
            ? MasterUserLimit?.company_users_limit
              ? MasterUserLimit?.company_users_limit
              : 1
            : Number(userLimit),
        co_id: editUserid,
        // jspAccDuration: Number(subType),
        // jsProfileViewCnt: Number(totallimit),
        till_ts:
          timestampForDate.getTime() / 1000
            ? timestampForDate.getTime() / 1000
            : defaultDate,
        profileCnt: jspreviewLimit
          ? Number(addlimit) + Number(jspreviewLimit)
          : Number(addlimit),
      })
    );
    setUserLimit("");
  }
  function setUpdatevalue(item: any) {
    setEditUserid(item?.co_id);
    // setUserLimit(
    //   item?.users_limit
    //     ? item?.users_limit
    //     : MasterUserLimit?.company_users_limit
    //       ? MasterUserLimit?.company_users_limit
    //       : ""
    // );
    setDefaultLimit(
      item?.users_limit
        ? item?.users_limit
        : MasterUserLimit?.company_users_limit
          ? MasterUserLimit?.company_users_limit
          : ""
    );

    setJspreviewLimit(
      item?.blLeft === 0 || item?.blLeft
        ? item?.blLeft
        : MasterUserLimit?.profile_limit
    );
    setStartDate(
      dayjs(
        new Date(
          item?.jsPrfAccFrom
            ? item?.jsPrfAccFrom * 1000
            : MasterUserLimit?.employer_jsp_acc_till * 1000
        ).toDateString()
      )
    );
    setEndDate(
      dayjs(
        new Date(
          item?.jsPrfAccTill
            ? item?.jsPrfAccTill * 1000
            : MasterUserLimit?.employer_jsp_acc_till * 1000
        ).toDateString()
      )
    );
    setdisEndDate(
      dayjs(
        new Date(
          item?.jsPrfAccTill
            ? item?.jsPrfAccTill * 1000
            : MasterUserLimit?.employer_jsp_acc_till * 1000
        ).toDateString()
      )
    );
    setReachedLimit(item?.currentUserCount);
    setAddlimit("0");
    setTotalLimit("");
  }
  useEffect(() => {
    showTable && userid && dispatchEmpfunction(userid);
  }, [userAccessibilityState, userid, resetFilter]);

  useEffect(() => {
    setEmpTable(employerDetails?.res?.data?.empInfo);
  }, [employerDetails?.res?.data?.empInfo]);

  useEffect(() => {
    if (showTable && IsactiveState?.value == "ACTIVE") {
      let filteredData = employerDetails?.res?.data?.empInfo?.filter((e) => {
        if (
          e?.contact?.mail?.val?.toUpperCase().includes(Ename.toUpperCase()) &&
          IsactiveState?.value == "ACTIVE"
        ) {
          return e?.active == true;
        }
      });
      filteredData && setEmpTable(filteredData);
    } else if (showTable && IsactiveState?.value == "INACTIVE") {
      let filteredData = employerDetails?.res?.data?.empInfo?.filter((e) => {
        if (
          e?.contact?.mail?.val
            ?.toUpperCase()
            .startsWith(Ename.toUpperCase()) &&
          IsactiveState?.value == "INACTIVE"
        ) {
          return e?.active == false;
        }
      });
      filteredData && setEmpTable(filteredData);
    } else if (Ename && IsactiveState?.value == null) {
      let filteredData = employerDetails?.res?.data?.empInfo?.filter((e) => {
        if (
          e?.contact?.mail?.val?.toUpperCase().startsWith(Ename.toUpperCase())
        ) {
          return e;
        }
      });
      filteredData && setEmpTable(filteredData);
    }

    // if (showTable && Ename != "") {
    //   let a = employerDetails?.res?.data?.empInfo?.filter((e) => {
    //     if (
    //       e?.contact?.mail?.val?.toUpperCase().includes(Ename.toUpperCase())
    //     ) {
    //       return e;
    //     }
    //   });
    //   a && setEmpTable(a);
    //   // setSearchTrigger(false);
    // }
    // if (showTable && IsactiveState) {
    //   let a = employerDetails?.res?.data?.empInfo?.filter((e) => {
    //     if (IsactiveState?.value == "ACTIVE") {
    //       return e?.active == true;
    //     } else if (IsactiveState?.value == "INACTIVE") {
    //       return e?.active == false;
    //     } else {
    //       return employerDetails?.res?.data?.empInfo;
    //     }
    //   });
    //   // setSearchTrigger(false);
    //   a && setEmpTable(a);
    // }
    if (Ename == "" && IsactiveState?.value == null) {
      setEmpTable(employerDetails?.res?.data?.empInfo);
      // setff(false);
    }
  }, [searchTrigger, filterbyanyone]);
  useEffect(() => {
    // resetFilter && setEname("");
    setExpState("");
    !showTable
      ? setIsactivestate({ label: "ALL Company", value: null })
      : setIsactivestate({ label: "ALL User", value: null });
  }, [resetFilter]);
  useEffect(() => {
    !showTable && dispatchfunction();
  }, [
    // userAccessibilityState,
    resetFilter,
    // userid,
    // currentpage,
    // showTable,
    // filterbyanyone,
    searchTrigger,
  ]);

  useEffect(() => {
    const groupedData = JobSeekerArray?.userInfo?.reduce((result, obj) => {
      const { companyId } = obj.companyInfo;
      if (!result[companyId]) {
        result[companyId] = [];
      }
      result[companyId].push(obj);
      return result;
    }, {});
    setCompanyTable(groupedData);
    // userid && setEmpTable(groupedData[userid]);
  }, [userAccessibilityState, userid, loadingJobSeeker]);

  useEffect(() => {
    dispatch(resetuserAccessibility());
  }, [useLocation().pathname]);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClosee = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const [popovershow, setPopovershow] = useState(""),
    { sasData, load } = useSelector((state: any) => state.downloadSAS),
    { sasComp, loadC } = useSelector((state: any) => state.companySAS);

  useEffect(() => {
    if (
      sCompanyDetail &&
      sCompanyDetail?.res?.code &&
      sCompanyDetail?.res?.code === 200
    ) {
      const userids = sCompanyDetail?.res?.data?.compInfo?.map((e: any) => {
        return e?.co_id;
      });
      dispatch(resetCompnySAS());
      sCompanyDetail?.res?.data?.compInfo?.length
        ? dispatch(
          companySAS({
            id: [...userids],
            sasFor: "CO_LOGO",
          })
        )
        : dispatch(successSAS());
    }
  }, [sCompanyDetail]);
  useEffect(() => {
    if (
      employerDetails &&
      employerDetails?.res?.code &&
      employerDetails?.res?.code === 200
    ) {
      const userids = employerDetails?.res?.data?.empInfo?.map((e: any) => {
        return e?.id;
      });
      employerDetails?.res?.data?.empInfo?.length
        ? dispatch(
          downloadSAS({
            id: [...userids],
            sasFor: "EMPIMG",
            companyId: userid,
          })
        )
        : dispatch(successSAS());
    }
  }, [employerDetails]);

  // DownloadUserInfo

  const { downUserInfo, loadingD } = useSelector(
    (state: any) => state.DownloadUserInfoData
  );
  function disableRandomDates(date) {
    return date < new Date();
  }

  return (
    <>
      <Formik
        initialValues={{
          ...INITIAL_FORM_STATE,
        }}
        validationSchema={PATENT_FORM_VALIDATION}
        onSubmit={(values: any, { resetForm }) => {
          const empRegDetails = {
            empName: `${values.firstname} ${values.lastname}`,
            empMail: `${values.userEmail}`.toLowerCase(),
            empPhoneCode: values.country ? `${values.country}` : "+91",
            empPhoneNo: String(values.mobileNumber),
            empCompany: values.companyName,
            empType: values.industryName.label,
            empDesignation: values.designation,
            empPin: String(values.pinCode),
            empAddress: values.address,
            empAccess: values.access === "true" ? true : false,
          };
          setAccessVal(values.access);
          !mailErr && !mobileErr && handleConfirmSwal(empRegDetails);
          setClear({ e: resetForm, v: values });
        }}
        isInitialValid={false}
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
            isValid,
          } = formik;
          return (
            <>
              <div>
                {hideEmployer && (
                  <div>
                    <div>
                      <center>
                        <h4
                          className="font-weight-700 m-b20"
                          style={{
                            color: "#7777d3",
                            marginBottom: "24px",
                          }}
                        >
                          MANAGE EMPLOYER
                        </h4>
                      </center>
                    </div>
                  </div>
                )}
                <div>
                  {hideEmployer && (
                    <div className="col-lg-12 col-md-12 col-sm-12 m-b30">
                      <button
                        type="button"
                        className="close"
                        onClick={() => {
                          handleClose();
                          setResetFilter(!resetFilter);
                          setFieldValue("firstname", "");
                          setFieldValue("lastname", "");
                          setFieldValue("userEmail", "");
                          setFieldValue("country", "");
                          setFieldValue("country", {
                            value: "0",
                            label: "India",
                            phone: "+91",
                          });
                          setFieldValue("mobileNumber", "");
                          setFieldValue("companyName", "");
                          setFieldValue("industryName", "");
                          setFieldValue("designation", "");
                          setFieldValue("pinCode", "");
                          setFieldValue("address", "");
                          setFieldValue("access", "true");
                          values.country = "";
                          values.country = {
                            value: "0",
                            label: "India",
                            phone: "+91",
                          };
                          setSelectedCountryCode({
                            value: "0",
                            label: "India",
                            phone: "+91",
                          });
                        }}
                        style={{
                          position: "absolute",
                          marginTop: "8%",
                          marginLeft: "65%",
                          zIndex: "1",
                        }}
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                      <div
                        className="content-inner browse-job"
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <div className="container">
                          <div className="row">
                            <div
                              className="col-md-12 m-b30"
                              id="empinfo"
                              style={{ marginTop: "20px" }}
                            >
                              <div
                                className="p-a30 job-bx max-w500 radius-sm bg-white m-auto"
                                style={{
                                  paddingBottom: "90px",
                                }}
                              >
                                <div className="tab-content">
                                  <div className="tab-pane active">
                                    <center>
                                      <h4
                                        className="font-weight-700 m-b5"
                                        style={{
                                          color: "#7777d3",
                                          marginBottom: "24px",
                                          marginLeft: "20px",
                                        }}
                                      >
                                        EMPLOYER INFORMATION
                                      </h4>
                                    </center>
                                    <section>
                                      <div>
                                        <div className="accessDiv d-flex">
                                          <div
                                            style={{
                                              width: "200px",
                                              marginLeft: "13px",
                                            }}
                                          >
                                            <label>
                                              <input
                                                type="radio"
                                                name="access"
                                                value="true"
                                                className="card-input-element"
                                                checked={
                                                  values.access === "true"
                                                }
                                                onChange={handleChange}
                                              />
                                              <div
                                                className="panel panel-default card-input "
                                                style={{
                                                  padding: "10px",
                                                  backgroundColor: "",
                                                }}
                                              >
                                                <div className="panel-heading btn-design">
                                                  Portal access allowed
                                                </div>
                                              </div>
                                            </label>
                                          </div>
                                          <div>
                                            <label>
                                              <input
                                                type="radio"
                                                value="false"
                                                name="access"
                                                className="card-input-element"
                                                checked={
                                                  values.access === "false"
                                                }
                                                onChange={handleChange}
                                              />
                                              <div
                                                className="panel panel-default card-input"
                                                style={{ padding: "10px" }}
                                              >
                                                <div className="panel-heading btn-designs">
                                                  Portal access denied
                                                </div>
                                              </div>
                                            </label>
                                          </div>
                                          {errors.access && touched.access && (
                                            <p className="form-error">
                                              {errors.access}
                                            </p>
                                          )}
                                        </div>
                                        <form
                                          id="formreg"
                                          autoComplete="off"
                                          onSubmit={handleSubmit}
                                        >
                                          <div className="form-group">
                                            <label className="font-weight-700">
                                              First Name
                                            </label>
                                            <span className="error">*</span>
                                            <input
                                              maxLength={100}
                                              name="firstname"
                                              autoComplete="off"
                                              placeholder="Enter First Name"
                                              type="text"
                                              onChange={handleChange}
                                              value={values.firstname}
                                              onBlur={handleBlur}
                                              className="form-control"
                                            />
                                            {errors.firstname &&
                                              touched.firstname && (
                                                <p className="form-error">
                                                  {errors.firstname}
                                                </p>
                                              )}
                                          </div>
                                          <div className="form-group">
                                            <label className="font-weight-700">
                                              Last Name
                                            </label>
                                            <span className="error">*</span>
                                            <input
                                              maxLength={50}
                                              autoComplete="off"
                                              name="lastname"
                                              placeholder="Enter Last Name"
                                              type="text"
                                              onChange={handleChange}
                                              onBlur={handleBlur}
                                              value={values.lastname}
                                              className="form-control"
                                            />
                                            {errors.lastname &&
                                              touched.lastname && (
                                                <p className="form-error">
                                                  {errors.lastname}
                                                </p>
                                              )}
                                          </div>
                                          <div className="form-group">
                                            <label className="font-weight-700">
                                              Email Address
                                            </label>
                                            <span className="error">*</span>
                                            <input
                                              maxLength={150}
                                              name="userEmail"
                                              autoComplete="off"
                                              placeholder="Enter Email Address"
                                              type="email"
                                              onChange={handleChange}
                                              onBlur={(e) => {
                                                handleBlur(e);
                                                validateEmail(e);
                                              }}
                                              value={values.userEmail}
                                              className="form-control"
                                            />
                                            {!errors.userEmail && mailErr && (
                                              <p className="form-error">
                                                Please check, Entered Email
                                                Address already exists!
                                              </p>
                                            )}
                                            {errors.userEmail &&
                                              touched.userEmail && (
                                                <>
                                                  <p className="form-error">
                                                    {errors.userEmail}
                                                  </p>
                                                </>
                                              )}
                                          </div>
                                          <div className="form-group">
                                            <label htmlFor="country">
                                              Mobile Number
                                            </label>
                                            <span className="error">*</span>
                                            <div id="phonenumbers">
                                              <div
                                                style={{ width: "120px" }}
                                                id="mob"
                                              >
                                                <Select
                                                  maxMenuHeight={200}
                                                  minMenuHeight={200}
                                                  id="codemob "
                                                  className="dropstyle"
                                                  name="country"
                                                  options={countries}
                                                  value={selectedCountryCode}
                                                  placeholder="Select Code"
                                                  defaultValue={{
                                                    value: "0",
                                                    label: "India",
                                                    phone: "+91",
                                                  }}
                                                  onChange={(option: any) => {
                                                    setCountryCode(
                                                      option?.phone
                                                    );
                                                    setSelectedCountryCode(
                                                      option
                                                    );
                                                    setFieldValue(
                                                      "country",
                                                      option.phone
                                                    );
                                                  }}
                                                  onInputChange={(e) => {
                                                    if (e?.length > 5)
                                                      return "";
                                                  }}
                                                  formatOptionLabel={
                                                    formatOptionLabel
                                                  }
                                                  filterOption={customFilter}
                                                />
                                              </div>

                                              <input
                                                name="mobileNumber"
                                                id="phonenums"
                                                autoComplete="off"
                                                minLength={6}
                                                maxLength={12}
                                                title=""
                                                placeholder="Enter Mobile Number"
                                                onChange={(e) => {
                                                  regex.numberTyping.test(
                                                    e.target.value
                                                  ) && handleChange(e);
                                                }}
                                                value={values.mobileNumber}
                                                onBlur={(e) => {
                                                  handleBlur(e);
                                                  setSelectedPhone(
                                                    e?.target?.value
                                                  );
                                                }}
                                                className="form-control"
                                              />
                                            </div>
                                            {!errors.mobileNumber &&
                                              mobileErr && (
                                                <p className="form-error">
                                                  Please check, Entered Mobile
                                                  Number already exists!{" "}
                                                </p>
                                              )}
                                            {errors.mobileNumber &&
                                              touched.mobileNumber && (
                                                <p className="form-error">
                                                  {errors.mobileNumber}
                                                </p>
                                              )}
                                          </div>
                                          <div>
                                            <div className="form-group">
                                              <label className="font-weight-700">
                                                Company Name
                                              </label>
                                              <span className="error">*</span>
                                              <input
                                                maxLength={100}
                                                name="companyName"
                                                autoComplete="off"
                                                placeholder="Enter Company Name"
                                                type="text"
                                                onChange={handleChange}
                                                value={values.companyName}
                                                onBlur={handleBlur}
                                                className="form-control"
                                              />
                                              {errors.companyName &&
                                                touched.companyName && (
                                                  <p className="form-error">
                                                    {errors.companyName}
                                                  </p>
                                                )}
                                            </div>
                                            <div className="form-group">
                                              <label htmlFor="industryName">
                                                Select Industry
                                              </label>
                                              <span className="error">*</span>
                                              <Select
                                                className="dropstyle"
                                                isSearchable={true}
                                                isClearable={true}
                                                isDisabled={false}
                                                options={industries}
                                                name="industryName"
                                                placeholder="Select Industry"
                                                value={values.industryName}
                                                onBlur={setFieldTouched}
                                                onChange={(option: any) => {
                                                  setFieldValue(
                                                    "industryName",
                                                    option
                                                  );
                                                }}
                                              />

                                              {errors.industryName && (
                                                <div className="form-error">
                                                  {errors.industryName}
                                                </div>
                                              )}
                                            </div>
                                            <div className="form-group">
                                              <label className="font-weight-700">
                                                Designation
                                              </label>
                                              <span className="error">*</span>
                                              <input
                                                maxLength={100}
                                                autoComplete="off"
                                                name="designation"
                                                placeholder="Enter Designation"
                                                type="text"
                                                onChange={handleChange}
                                                value={values.designation}
                                                onBlur={handleBlur}
                                                className="form-control"
                                              />
                                              {errors.designation &&
                                                touched.designation && (
                                                  <p className="form-error">
                                                    {errors.designation}
                                                  </p>
                                                )}
                                            </div>
                                            <div className="form-group">
                                              <label className="font-weight-700">
                                                Company Pin Code
                                              </label>
                                              <span className="error">*</span>
                                              <input
                                                name="pinCode"
                                                placeholder="Enter Company Pin Code"
                                                type="text"
                                                autoComplete="off"
                                                title=""
                                                maxLength={6}
                                                minLength={4}
                                                onChange={(e) => {
                                                  regex.numberTyping.test(
                                                    e.target.value
                                                  ) && handleChange(e);
                                                }}
                                                value={values.pinCode}
                                                onBlur={handleBlur}
                                                className="form-control"
                                              />
                                              {errors.pinCode &&
                                                touched.pinCode && (
                                                  <p className="form-error">
                                                    {errors.pinCode}
                                                  </p>
                                                )}
                                            </div>
                                            <div className="form-group">
                                              <label className="font-weight-700">
                                                Company Address
                                              </label>
                                              <span className="error">*</span>
                                              <textarea
                                                style={{
                                                  paddingLeft: "20px",
                                                  paddingTop: "16px",
                                                }}
                                                id="address"
                                                name="address"
                                                autoComplete="off"
                                                maxLength={500}
                                                placeholder="Enter Company Address"
                                                onChange={handleChange}
                                                value={values.address}
                                                onBlur={handleBlur}
                                                className="form-control"
                                              ></textarea>
                                              {errors.address &&
                                                touched.address && (
                                                  <p className="form-error">
                                                    {errors.address}
                                                  </p>
                                                )}
                                            </div>
                                            <div>
                                              {!isValid && (
                                                <button
                                                  type="submit"
                                                  className="site-button float-center btn-lg mt-3"
                                                  disabled={
                                                    industryValue ===
                                                    undefined &&
                                                    (UserCheck?.code !== 200 ||
                                                      loading ||
                                                      loadingU)
                                                  }
                                                  style={{
                                                    cursor: "default",
                                                    float: "right",
                                                    fontSize: "17px",
                                                    padding: "1.5% 10%",
                                                    backgroundColor: "#bdbebf",
                                                  }}
                                                >
                                                  Register
                                                </button>
                                              )}
                                              {isValid && (
                                                <button
                                                  type="submit"
                                                  className="site-button float-center btn-lg mt-3"
                                                  disabled={
                                                    (industryValue !==
                                                      undefined &&
                                                      UserCheck?.code !==
                                                      200) ||
                                                    mailErr ||
                                                    mobileErr
                                                  }
                                                  style={{
                                                    cursor: "pointer",
                                                    fontSize: "14px",
                                                    marginLeft: "69%",
                                                    width: "32%",
                                                    backgroundColor: `${mobileErr || mailErr
                                                      ? "#bdbebf"
                                                      : ""
                                                      }`,
                                                  }}
                                                >
                                                  {loading && (
                                                    <i
                                                      className="fa fa-circle-o-notch fa-spin"
                                                      style={{
                                                        marginRight: "10px",
                                                      }}
                                                    ></i>
                                                  )}
                                                  {loading
                                                    ? "Registering..."
                                                    : "Register"}
                                                </button>
                                              )}
                                            </div>
                                          </div>
                                        </form>
                                      </div>
                                    </section>
                                  </div>
                                  <div />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Modal
                        show={emailreg}
                        onHide={() => {
                          setEmailreg(false);
                        }}
                        className="modal fade modal-bx-info editor"
                      >
                        <div
                          className="modal-dialog my-0 mx-0 w-100 "
                          role="document"
                        >
                          <div className="modal-content">
                            <div className="modal-body">
                              <h5 style={{ textAlign: "center" }}>
                                REGISTRATION SUCCESSFULL
                              </h5>
                              <div className="success-checkmark">
                                <div className="check-icon">
                                  <span className="icon-line line-tip"></span>
                                  <span className="icon-line line-long"></span>
                                  <div className="icon-circle"></div>
                                  <div className="icon-fix"></div>
                                </div>
                              </div>
                              <center>
                                <p style={{ fontFamily: "Montserrat" }}>
                                  Employer information registered successfully.
                                </p>
                              </center>
                              {accessVal === "true" && (
                                <center>
                                  <p
                                    style={{
                                      color: "#0070a6",
                                      fontWeight: "bold",
                                      fontSize: "14px",
                                    }}
                                  >
                                    An account activation link has been sent to
                                    respective registered email address.
                                    <br />
                                  </p>
                                </center>
                              )}
                              {accessVal === "false" && (
                                <center>
                                  <p
                                    style={{
                                      color: "#0070a6",
                                      fontWeight: "bold",
                                      fontSize: "14px",
                                    }}
                                  >
                                    Account has been created and Employer
                                    information has been saved in our database.
                                    <br />
                                  </p>
                                </center>
                              )}
                              <hr></hr>
                              <button
                                type="button"
                                className="site-button border border-primary btn-sm"
                                style={{
                                  background: "white",
                                  color: "#2e55fa",
                                  borderColor: "#2e55fa",
                                  float: "right",
                                }}
                                onClick={() => {
                                  setEmailreg(false);
                                  handleSwal();
                                }}
                              >
                                GOT IT!
                              </button>
                              <br></br>
                            </div>
                          </div>
                        </div>
                      </Modal>
                    </div>
                  )}
                </div>
              </div>
              {/* ----------------------------------------- */}

              {!hideEmployer &&
                !loadingJobSeeker &&
                !sCompanyDetail?.loading && (
                  <div className="page-content bg-white">
                    <div className="content-block">
                      <div
                        className="browse-job section-full bg-white p-t50 p-b20"
                      // ref={inputRef}
                      >
                        <div className="container">
                          <div className="row" ref={myRef}>
                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 m-b30 mt-5">
                              <div className="job-bx browse-job clearfix">
                                <div className="job-bx-title  clearfix">
                                  <h5 className="font-weight-700 pull-left text-uppercase">
                                    MANAGE EMPLOYER
                                  </h5>
                                  <div className="float-right">
                                    <Chip
                                      label={
                                        <span className="custom-job-content text-bold">
                                          Total Count
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
                                          {!showTable
                                            ? sCompanyDetail?.res?.data
                                              ?.totalCount
                                              ? sCompanyDetail?.res?.data
                                                ?.totalCount
                                              : "0"
                                            : employerDetails?.res?.data
                                              ?.totalCount
                                              ? employerDetails?.res?.data
                                                ?.totalCount
                                              : "0"}
                                        </Avatar>
                                      }
                                    />
                                    {showTable && empTable?.length !== 0 && (
                                      <Link
                                        // style={{ marginLeft: "90%" }}
                                        className="ml-3 "
                                        to={""}
                                        style={{
                                          borderRadius: "0px",
                                          color: "white",
                                          backgroundColor: "rgb(14 173 105)",
                                        }}
                                        id="down-icon"
                                        download="filename.csv"
                                        onClick={() => {
                                          const details = {
                                            userType: "COMPANY_USER",
                                            id: userid,
                                          };
                                          dispatch(downloadUserInfo(details));
                                        }}
                                        title="Download total Users"
                                      >
                                        <BsCloudDownload />
                                      </Link>
                                    )}
                                    {!showTable &&
                                      sCompanyDetail?.res?.data?.compInfo
                                        ?.length !== 0 && (
                                        <Link
                                          // style={{ marginLeft: "90%" }}
                                          className="ml-3"
                                          to={""}
                                          style={{
                                            borderRadius: "0px",
                                            color: "white",
                                            backgroundColor: "rgb(14 173 105)",
                                          }}
                                          id="down-icon"
                                          download="filename.csv"
                                          onClick={() => {
                                            const details = {
                                              userType: "COMPANY",
                                              id: 1,
                                            };
                                            dispatch(downloadUserInfo(details));
                                          }}
                                          title="Download total Employer Info"
                                        >
                                          <BsCloudDownload />
                                        </Link>
                                      )}
                                  </div>
                                  <br />
                                </div>
                                <div className="row d-flex ">
                                  {!showTable ? (
                                    <>
                                      <input
                                        className="col-lg-3 sm-3 md-3 form-control ml-3 mb-2"
                                        type="search"
                                        value={Ename}
                                        placeholder={
                                          !showTable
                                            ? "Enter company name"
                                            : "Enter email address"
                                        }
                                        aria-label="Search "
                                        onChange={(e: any) => {
                                          setEname(e.target.value);
                                        }}
                                      />
                                      <Select
                                        name="AreaOfConcern "
                                        className="col-lg-3 sm-3 md-3 dropstyle mb-2"
                                        styles={customStyles}
                                        placeholder="Filter by user status"
                                        id="react-select-4-listbox areaOfConcern"
                                        defaultValue={
                                          !showTable
                                            ? {
                                              label: "ALL Company",
                                              value: null,
                                            }
                                            : {
                                              label: "ALL User",
                                              value: null,
                                            }
                                        }
                                        options={
                                          !showTable
                                            ? FILTERACTIVEOPTION
                                            : FILTERACTIVEOPTION2
                                        }
                                        value={IsactiveState}
                                        onChange={(option: any) => {
                                          setIsactivestate(option);
                                        }}
                                      />
                                      <button
                                        className="site-button add-btn mb-2 ml-2"
                                        style={{ zIndex: "0" }}
                                        onClick={() => {
                                          setSearchTrigger(!searchTrigger);
                                          setWithpaginationFilter(true);
                                          setCurrentPage(1);
                                          setCurrentPage1(1);

                                          // setFilterbyanyone(false);
                                        }}
                                      >
                                        Search
                                      </button>
                                      <button
                                        className=" site-button add-btn mb-2 ml-2"
                                        style={{ zIndex: "0" }}
                                        onClick={() => {
                                          setEname("");
                                          setIsactivestate({
                                            label: "ALL Company",
                                            value: null,
                                          });
                                          setResetFilter(!resetFilter);
                                          setWithpaginationFilter(false);
                                        }}
                                      >
                                        Reset
                                      </button>
                                      <button
                                        className="site-button btn-success add-btn mb-2"
                                        onClick={handleHideTable}
                                        style={{
                                          marginRight: "20px",
                                          float: "right",
                                        }}
                                      >
                                        Invite Employer
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <Tooltip title={companyName}>
                                        <h5
                                          style={{
                                            position: "absolute",

                                            marginLeft: "25%",
                                          }}
                                        >
                                          Company Name:{" "}
                                          {companyName &&
                                            Content(
                                              companyName
                                                .charAt(0)
                                                .toUpperCase() +
                                              companyName.slice(1),
                                              33
                                            )}
                                        </h5>
                                      </Tooltip>

                                      <button
                                        type="button"
                                        className="close"
                                        onClick={() => {
                                          setShowtable(false);
                                          setUserid("");
                                          // setIsactivestate({
                                          //   label: "ALL Company",
                                          //   value: null,
                                          // });
                                        }}
                                        style={{
                                          fontSize: "30px",
                                          position: "relative",
                                          left: "97%",
                                          marginRight: "20px",
                                        }}
                                      >
                                        <span aria-hidden="true">&times;</span>
                                      </button>
                                    </>
                                  )}
                                </div>
                                <div className="row">
                                  {showTable && (
                                    <div className="col-xl-3 col-lg-4 col-md-5 col-sm-12 m-b30">
                                      <aside
                                        id="accordion1"
                                        className="sidebar-filter bg-white"
                                      >
                                        <Accordion defaultActiveKey="0">
                                          <h6 className="title">
                                            <div className="d-flex justify-content-between align-items-center">
                                              <div>
                                                <i
                                                  className="fa fa-filter"
                                                  aria-hidden="true"
                                                  style={{ color: "orange" }}
                                                ></i>{" "}
                                                Filters{" "}
                                              </div>
                                              <div>
                                                <Link
                                                  to={"#"}
                                                  onClick={() => {
                                                    setEname("");
                                                    setIsactivestate({
                                                      label: "ALL Company",
                                                      value: null,
                                                    });
                                                    setResetFilter(
                                                      !resetFilter
                                                    );
                                                    setWithpaginationFilter(
                                                      false
                                                    );
                                                  }}
                                                  className="font-12 float-right"
                                                >
                                                  <TbClearAll /> Reset
                                                </Link>{" "}
                                              </div>
                                            </div>
                                          </h6>
                                          <Accordion.Collapse eventKey="0">
                                            <div
                                              id="companies"
                                              className="acod-body collapse show"
                                            >
                                              <div className="acod-content">
                                                <input
                                                  className="form-control   "
                                                  type="search"
                                                  value={Ename}
                                                  placeholder={
                                                    !showTable
                                                      ? "Enter company name"
                                                      : "Enter email address"
                                                  }
                                                  aria-label="Search "
                                                  onChange={(e: any) => {
                                                    setEname(e.target.value);
                                                  }}
                                                />
                                                {/* <span
                                                style={{
                                                  position: "absolute",
                                                  top: "70px",
                                                  left: "81%",
                                                  fontSize: "14px",
                                                  cursor: "pointer",
                                                }}
                                              >
                                                <GrSearch
                                                  onClick={() => {
                                                    // dispatchfunction();

                                                    setSearchTrigger(!searchTrigger);
                                                    setFilterbyanyone(true);
                                                    setff(true);
                                                    // setFilterbyanyone(true);

                                                    // emailSearchHandler();
                                                  }}
                                                />
                                              </span> */}
                                                <hr />

                                                <Select
                                                  name="AreaOfConcern "
                                                  className="dropstyle"
                                                  styles={customStyles}
                                                  placeholder="Filter by user status"
                                                  id="react-select-4-listbox areaOfConcern"
                                                  defaultValue={
                                                    !showTable
                                                      ? {
                                                        label: "ALL Company",
                                                        value: null,
                                                      }
                                                      : {
                                                        label: "ALL User",
                                                        value: null,
                                                      }
                                                  }
                                                  options={
                                                    !showTable
                                                      ? FILTERACTIVEOPTION
                                                      : FILTERACTIVEOPTION2
                                                  }
                                                  value={IsactiveState}
                                                  onChange={(option: any) => {
                                                    setIsactivestate(option);
                                                  }}
                                                />
                                                <br />

                                                <button
                                                  className="col-lg-12 site-button border border-primary btn-sm  mb-2"
                                                  style={{ zIndex: "0" }}
                                                  onClick={() => {
                                                    setSearchTrigger(
                                                      !searchTrigger
                                                    );
                                                    setWithpaginationFilter(
                                                      true
                                                    );
                                                    // setCurrentPage(1);
                                                    setCurrentPage1(1);

                                                    // setFilterbyanyone(false);
                                                  }}
                                                >
                                                  Search
                                                </button>
                                              </div>
                                            </div>
                                          </Accordion.Collapse>
                                        </Accordion>
                                      </aside>
                                    </div>
                                  )}
                                  {(((sCompanyDetail?.res?.data?.compInfo
                                    ?.length == undefined || sCompanyDetail?.res?.data?.compInfo
                                      ?.length == 0)) ||
                                    showTable && (empTable?.length == 0 || empTable?.length == undefined)) && (
                                      <center>
                                        <div
                                          className="col-xl-12 col-lg-12 col-md-12"
                                          style={{ marginLeft: "29%" }}
                                        >
                                          <img src={notFoundimg} alt="" />
                                          <h6
                                            style={{
                                              fontWeight: "bold",
                                            }}
                                          >
                                            {"No Record Found."}
                                          </h6>
                                        </div>
                                      </center>
                                    )}

                                  {/* table */}

                                  {!showTable &&
                                    sCompanyDetail?.res?.data?.compInfo
                                      ?.length !== 0 && sCompanyDetail?.res?.data?.compInfo
                                        ?.length !== undefined && (
                                      <div className="col-xl-12 col-lg-12 col-md-12">
                                        <table className="table-job-bx cv-manager company-manage-job">
                                          <thead>
                                            <tr>
                                              <th>Employer Info</th>
                                              <th>Contact Number</th>
                                              <th className="text-center">
                                                Address
                                              </th>
                                              <th>User Limit</th>
                                              <th title="Job Seeker Profile Preview Limit">
                                                JS Profile Preview Limit
                                              </th>
                                              <th className="text-center">
                                                Action
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {sCompanyDetail?.res?.data?.compInfo.map(
                                              (item, index) => (
                                                <tr>
                                                  <td className=" d-flex ">
                                                    <>
                                                      <div
                                                        style={{
                                                          color: "lightgray",
                                                          width: "42px",
                                                        }}
                                                      >
                                                        {sasComp?.code ===
                                                          200 &&
                                                          sasComp?.data?.filter(
                                                            (e) =>
                                                              e?.id ===
                                                              item?.co_id
                                                          )[0]?.img_sas
                                                            ?.length !== 0 && (
                                                            <img
                                                              alt=""
                                                              style={{
                                                                borderRadius:
                                                                  "50%",
                                                                width: "42px",
                                                                height: "42px",
                                                              }}
                                                              src={
                                                                sasComp?.data?.filter(
                                                                  (e) =>
                                                                    e?.id ===
                                                                    item?.co_id
                                                                )[0]?.img_sas
                                                              }
                                                            />
                                                          )}
                                                        {(sasComp?.code !==
                                                          200 ||
                                                          sasComp?.data?.filter(
                                                            (e) =>
                                                              e?.id ===
                                                              item?.co_id
                                                          )[0]?.img_sas
                                                            ?.length === 0) && (
                                                            <BsPersonCircle
                                                              style={{
                                                                width: "42px",
                                                                fontSize: "42px",
                                                                color:
                                                                  "lightgray",
                                                              }}
                                                            />
                                                          )}
                                                      </div>
                                                    </>
                                                    <div className=" ml-2">
                                                      <div
                                                        className=" job-name"
                                                        title={item?.name}
                                                      >
                                                        {item?.name
                                                          ? Content(
                                                            item?.name,
                                                            25
                                                          )
                                                          : "Not mentioned"}
                                                      </div>
                                                      <div className="job-post-info  ">
                                                        <>
                                                          <span
                                                            className="job-name"
                                                            style={{
                                                              fontSize: "14px",
                                                            }}
                                                          >
                                                            {" "}
                                                            Registered On:
                                                          </span>{" "}
                                                          &nbsp;
                                                          <span
                                                            style={{
                                                              fontSize: "14px",
                                                            }}
                                                          >
                                                            {item?.created_at
                                                              ? `${getTimestampToDate(
                                                                item?.created_at
                                                              )} ${GetTimeFromTimeStamp(
                                                                item?.created_at
                                                              )}`
                                                              : "Not mentioned"}
                                                          </span>
                                                        </>
                                                      </div>
                                                    </div>
                                                  </td>
                                                  <td className="application   ">
                                                    <div className=" d-flex ">
                                                      <span className="">
                                                        {
                                                          item?.contact?.ph
                                                            ?.prim?.code
                                                        }
                                                        &nbsp;
                                                        {
                                                          item?.contact?.ph
                                                            ?.prim?.val
                                                        }
                                                      </span>
                                                    </div>
                                                  </td>

                                                  <td className="application  tabletd text-center">
                                                    <li>
                                                      {item?.address?.street ? (
                                                        <div>
                                                          {" "}
                                                          <div
                                                            className=""
                                                            aria-describedby={
                                                              id
                                                            }
                                                            onClick={(
                                                              e: any
                                                            ) => {
                                                              handleClick(e);
                                                              setPopovershow(
                                                                item?.address
                                                                  ?.street
                                                              );
                                                            }}
                                                          >
                                                            {" "}
                                                            <Link
                                                              to={"#"}
                                                              title="Click to view address"
                                                            >
                                                              {item?.address
                                                                ?.street
                                                                ? Content(
                                                                  item?.address?.street
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                  item?.address?.street.slice(
                                                                    1
                                                                  ),
                                                                  15
                                                                )
                                                                : "Not available"}
                                                            </Link>
                                                          </div>{" "}
                                                          <Popover
                                                            id={id}
                                                            open={open}
                                                            anchorEl={anchorEl}
                                                            onClose={
                                                              handleClosee
                                                            }
                                                            anchorOrigin={{
                                                              vertical:
                                                                "bottom",
                                                              horizontal:
                                                                "left",
                                                            }}
                                                            style={{
                                                              boxShadow:
                                                                "0px 1px 1px 0px #dacdcd",
                                                            }}
                                                          >
                                                            {" "}
                                                            <Typography
                                                              sx={{ p: 2 }}
                                                            >
                                                              {popovershow}
                                                            </Typography>{" "}
                                                          </Popover>{" "}
                                                        </div>
                                                      ) : (
                                                        "Not mentioned"
                                                      )}
                                                    </li>
                                                  </td>
                                                  <td
                                                    className="application  tabletd"
                                                    style={{
                                                      textAlign: "center",
                                                    }}
                                                  >
                                                    <Link
                                                      to={"#"}
                                                      title="Click here to edit User Limit"
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                      onClick={() => {
                                                        setShowEditPopup(true);
                                                        setUpdatevalue(item);
                                                      }}
                                                    >
                                                      {item?.users_limit
                                                        ? item?.users_limit
                                                        : MasterUserLimit?.company_user_limit
                                                          ? MasterUserLimit?.company_user_limit
                                                          : "Not Available"}
                                                    </Link>
                                                  </td>
                                                  <td
                                                    className="application  tabletd"
                                                    style={{
                                                      textAlign: "center",
                                                    }}
                                                  >
                                                    <Link
                                                      to={"#"}
                                                      title="Click here to edit JS Profile Preview Limit"
                                                      style={{
                                                        cursor: "pointer",
                                                      }}
                                                      onClick={() => {
                                                        setUpdatevalue(item);
                                                        setShowJSEditPopup(
                                                          true
                                                        );
                                                      }}
                                                    >
                                                      {item?.blLeft === null ||
                                                        (!item?.blLeft &&
                                                          item?.blLeft !== 0)
                                                        ? MasterUserLimit?.profile_limit
                                                        : item?.blLeft}
                                                    </Link>
                                                  </td>
                                                  <td
                                                    className="application  tabletd"
                                                    style={{
                                                      textAlign: "center",
                                                    }}
                                                  >
                                                    <div className="d-flex justify-content-around align-items-center">
                                                      <label
                                                        className="mt-1"
                                                        onClick={() => {
                                                          setShowtable(true);
                                                          setUserid(
                                                            item?.co_id
                                                          );
                                                          setCompanyName(
                                                            item?.name
                                                          );
                                                          executeScroll();
                                                          setCurrentPage1(1);
                                                          // setEname("");
                                                          // setIsactivestate({
                                                          //   label: "ALL Users",
                                                          //   value: null,
                                                          // });
                                                        }}
                                                      >
                                                        <IconButton title="Click to view users">
                                                          <BsPersonFill
                                                            style={{
                                                              fontSize: "20px",
                                                            }}
                                                          />
                                                        </IconButton>
                                                      </label>
                                                      &nbsp;
                                                      <Switch
                                                        checked={
                                                          item?.active &&
                                                          item?.active
                                                        }
                                                        title={
                                                          item?.active
                                                            ? "Click to disable user"
                                                            : "Click to enable user"
                                                        }
                                                        onClick={(e) => {
                                                          changeIsActiveCompany(
                                                            e,
                                                            item.co_id
                                                          );
                                                        }}
                                                        inputProps={{
                                                          "aria-label":
                                                            "controlled",
                                                        }}
                                                      />
                                                    </div>
                                                  </td>
                                                </tr>
                                              )
                                            )}
                                          </tbody>
                                        </table>
                                      </div>
                                    )}
                                  {showTable &&
                                    empTable?.length != 0 &&
                                    !employerDetails?.loading &&
                                    !employerDetails?.loading && (
                                      <div className="col-xl-9 col-lg-8 col-md-7">
                                        <table className="table-job-bx cv-manager company-manage-job">
                                          <thead>
                                            <tr>
                                              <th>User Details</th>
                                              <th>Contact Number</th>
                                              <th>Created by</th>
                                              <th className="text-center">
                                                Action
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {showTable &&
                                              empTable?.map((item, index) => (
                                                <tr>
                                                  <td className="d-flex">
                                                    <>
                                                      {sasData?.code === 200 &&
                                                        sasData?.data?.filter(
                                                          (e) =>
                                                            e?.id === item?.id
                                                        )[0]?.img_sas
                                                          ?.length !== 0 && (
                                                          <img
                                                            alt=""
                                                            style={{
                                                              borderRadius:
                                                                "50%",
                                                              width: "42px",
                                                              height: "42px",
                                                            }}
                                                            src={
                                                              sasData?.data?.filter(
                                                                (e) =>
                                                                  e?.id ===
                                                                  item?.id
                                                              )[0]?.img_sas
                                                            }
                                                          />
                                                        )}
                                                      {(sasData?.code !== 200 ||
                                                        sasData?.data?.filter(
                                                          (e) =>
                                                            e?.id === item?.id
                                                        )[0]?.img_sas
                                                          ?.length === 0) && (
                                                          <BsPersonCircle
                                                            style={{
                                                              width: "42px",
                                                              fontSize: "42px",
                                                              color: "lightgray",
                                                            }}
                                                          />
                                                        )}
                                                    </>
                                                    <div className="ml-2">
                                                      <ul>
                                                        <li
                                                          className="tabletd"
                                                          title={item?.name}
                                                        >
                                                          {item?.name
                                                            ? Content(
                                                              item?.name,
                                                              25
                                                            )
                                                            : "Not mentioned"}
                                                        </li>
                                                      </ul>
                                                      <ul className="job-post-info">
                                                        <li className="">
                                                          <Link
                                                            style={{
                                                              color: "#007bff",
                                                              fontSize: "14px",
                                                            }}
                                                            to={`mailto:${item?.contact?.mail?.val}`}
                                                            title={
                                                              item?.contact
                                                                ?.mail?.val
                                                            }
                                                          >
                                                            {Content(
                                                              item?.contact
                                                                ?.mail?.val,
                                                              25
                                                            )}
                                                          </Link>
                                                        </li>
                                                      </ul>
                                                    </div>
                                                  </td>

                                                  <td className="application">
                                                    <li>
                                                      {item?.contact?.ph?.code}
                                                      &nbsp;
                                                      {item?.contact?.ph?.val
                                                        ? item.contact.ph.val
                                                        : "Not mentioned"}
                                                    </li>
                                                  </td>
                                                  <td className="application">
                                                    <li>
                                                      {item?.created_by
                                                        ? item?.created_by
                                                        : "Not mentioned"}
                                                    </li>
                                                  </td>
                                                  <td className="application">
                                                    <div className="d-flex justify-content-around align-items-center">
                                                      <ul>
                                                        <li>
                                                          <IconButton
                                                            title={
                                                              "Resend Activation Link"
                                                            }
                                                            style={{
                                                              cursor: "pointer",
                                                            }}
                                                            key={item?.id}
                                                          >
                                                            {!loaderr[
                                                              item?.id
                                                            ] ? (
                                                              <MdOutlineReplay
                                                                className={
                                                                  "tabletd"
                                                                }
                                                                onClick={() => {
                                                                  setloaderid(
                                                                    item?.id
                                                                  );
                                                                  dispatch(
                                                                    resendMail({
                                                                      userId:
                                                                        item?.id,
                                                                    })
                                                                  );
                                                                }}
                                                                style={{
                                                                  fontSize:
                                                                    "20px",
                                                                }}
                                                              />
                                                            ) : (
                                                              <i
                                                                className="fa fa-circle-o-notch fa-spin"
                                                                style={{
                                                                  fontSize:
                                                                    "16px",
                                                                }}
                                                              ></i>
                                                            )}
                                                          </IconButton>
                                                        </li>
                                                      </ul>
                                                      &nbsp;
                                                      <Switch
                                                        checked={item?.active}
                                                        title={
                                                          item?.active
                                                            ? "Click to disable user"
                                                            : "Click to enable user"
                                                        }
                                                        onChange={(e) => {
                                                          handleDeleteSwal(
                                                            item
                                                          );
                                                        }}
                                                        inputProps={{
                                                          "aria-label":
                                                            "controlled",
                                                        }}
                                                      />
                                                    </div>
                                                  </td>
                                                </tr>
                                              ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    )}
                                </div>

                                <div className="pagination-bx float-right m-t10">
                                  {!showTable && (sCompanyDetail?.res?.data?.compInfo
                                    ?.length != undefined) && (
                                      <Pagination
                                        className="pagination-data mt-4"
                                        onChange={PaginationChange}
                                        total={
                                          sCompanyDetail?.res?.data?.totalCount
                                        }
                                        current={currentpage}
                                        pageSize={size}
                                        showSizeChanger={true}
                                        itemRender={PrevNextArrow}
                                      // onShowSizeChange={PerPageChange}
                                      />
                                    )} {(showTable && (empTable?.length != 0 || empTable?.length != undefined)) && (
                                      <Pagination
                                        className="pagination-data mt-4"
                                        onChange={PaginationChange}
                                        total={empTable?.length}
                                        current={currentpage1}
                                        pageSize={size}
                                        showSizeChanger={true}
                                        itemRender={PrevNextArrow}
                                      // onShowSizeChange={PerPageChange}
                                      />
                                    )
                                  }
                                </div >
                              </div >
                            </div >
                          </div >
                        </div >
                      </div >
                    </div >
                  </div >
                )}

              {
                (loadingJobSeeker ||
                  sCompanyDetail?.loading ||
                  employerDetails?.loading) &&
                !showTable && <AdminRegistration_Skeleton />
              }
            </>
          );
        }}
      </Formik >
      <Modal
        show={showEditPopup}
        onHide={() => {
          setShowEditPopup(false);
        }}
        className="modal fade editor"
      >
        <div
          className="modal-dialog my-0 "
          role="document"
          id="modalpopupstyle"
          style={{ width: "770px" }}
        >
          {" "}
          <div className="modal-content">
            {" "}
            {/* <div className="modal-header" id="headerjds">
              {" "}
              <div className="row">

              </div>
              <h5 className=" headCost" id="titlejds">
                User Limit<span className="form-error">*</span>
              </h5>{" "}
              <button
                style={{ color: "white" }}
                type="button"
                className="close"
                onClick={() => {
                  setShowEditPopup(false);
                  setPopupErr(false);
                }}
              >
                <i
                  style={{ color: "white" }}
                  className="fa fa-times"
                  aria-hidden="true"
                ></i>
              </button>{" "}
            </div>{" "} */}
            <div className="modal-body">
              <div className="browse-job">
                <div className="col-lg-12 col-md-8 col-sm-6 form-group d-flex">
                  <div className="form-group">
                    <label className="ml-0" id="titlejds">
                      User Limit
                    </label>
                    <input
                      autoComplete="off"
                      maxLength={2}
                      name="hybridPolicy"
                      type="text"
                      className="form-control col-lg-10"
                      value={defaultlimit !== 0 ? defaultlimit : ""}
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label className="ml-0" id="titlejds">
                      Current User Count
                    </label>
                    <input
                      autoComplete="off"
                      maxLength={2}
                      name="hybridPolicy"
                      placeholder="Enter User Limit"
                      type="text"
                      disabled
                      className="form-control col-lg-10"
                      value={reachedLimit}
                    />
                  </div>
                </div>
                <div className="col-lg-12 col-md-8 col-sm-6 form-group d-flex">
                  <div className="form-group">
                    <label className="ml-0" id="titlejds">
                      Add User Limit<span className="error">*</span>
                    </label>
                    <input
                      autoComplete="off"
                      maxLength={2}
                      name="hybridPolicy"
                      placeholder="Enter User Limit"
                      type="text"
                      className="form-control col-lg-10"
                      value={userLimit !== 0 ? userLimit : ""}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        if (/^[0-9]+$/.test(inputValue) && inputValue !== "0") {
                          setUserLimit(inputValue);
                          setPopupErr(false);
                        } else {
                          setUserLimit("");
                        }
                      }}
                    />
                    {PopupErr && (
                      <p className="form-error">Please enter User Limit.</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="ml-0" id="titlejds">
                      Total User Limit
                    </label>
                    <input
                      autoComplete="off"
                      maxLength={2}
                      name="hybridPolicy"
                      placeholder="Enter User Limit"
                      type="text"
                      className="form-control col-lg-10"
                      value={Number(defaultlimit) + Number(userLimit)}
                      disabled
                    />
                  </div>
                </div>
              </div>
              {/* <div className="row"> */}
              <div className="modal-footer">
                {" "}
                <button
                  style={{ fontSize: "13px" }}
                  type="button"
                  className="site-button"
                  disabled={PopupErr}
                  onClick={async () => {
                    (await userLimit) == "" && setPopupErr(true);
                    if (!PopupErr && userLimit) {
                      dispatchUpdateFunction();
                    }
                  }}
                >
                  Update
                </button>{" "}
                <button
                  style={{
                    fontSize: "13px",
                    backgroundColor: "#fca245",
                  }}
                  type="button"
                  className="site-button"
                  onClick={() => {
                    setShowEditPopup(false);
                    setPopupErr(false);
                    setAddlimit("0");
                    setTotalLimit("");
                    setUserLimit("");
                  }}
                >
                  Cancel
                </button>{" "}
              </div>{" "}
            </div>{" "}
          </div>
        </div>
      </Modal>
      <Modal
        show={showJSEditPopup}
        onHide={() => {
          setShowJSEditPopup(false);
          setDateErr("");
          setPopupTotalLimitErr(false);
          setUserLimit("");
        }}
        className="modal fade editor mt-5"
      >
        <div
          className="modal-dialog my-0 "
          role="document"
          id="modalpopupstyle"
          style={{ width: "700px" }}
        >
          {" "}
          <div className="modal-content" style={{ width: "570px" }}>
            {" "}
            {/* <div className="modal-header" id="headerjds">
              {" "}
              <h5 className=" headCost" id="titlejds">
                JS Profile Preview Limit<span className="form-error">*</span>
              </h5>{" "}
              <button
                style={{ color: "white" }}
                type="button"
                className="close"
                onClick={() => {
                  setShowJSEditPopup(false);
                }}
              >
                <i
                  style={{ color: "white" }}
                  className="fa fa-times"
                  aria-hidden="true"
                ></i>
              </button>{" "}
            </div>{" "} */}
            <div className="modal-body">
              <div className="browse-job">
                <div className="col-lg-12 col-md-12 col-sm-6">
                  <div className="row">
                    <div className="mb-3 d-flex">
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 d-inline form-group">
                        <label className=" ml-0" id="titlejds">
                          Profile preview limit left
                        </label>
                        <input
                          autoComplete="off"
                          maxLength={6}
                          name="hybridPolicy"
                          style={{ cursor: "not-allowed" }}
                          placeholder="limit left"
                          type="text"
                          className="form-control col-lg-10"
                          value={jspreviewLimit !== null ? jspreviewLimit : 0}
                          disabled
                        />
                      </div>

                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 d-inline form-group">
                        <label className="ml-0" id="titlejds">
                          End Date
                        </label>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DemoContainer components={["DatePicker"]}>
                            <DatePicker
                              className="datepickerWalkIn col-lg-10"
                              format="DD-MM-YYYY"
                              shouldDisableDate={disableRandomDates}
                              disabled
                              value={disEndDate}
                              onClose={() => { }}
                            />
                          </DemoContainer>
                        </LocalizationProvider>
                      </div>
                    </div>
                  </div>
                  {/* --------------------------------------- */}
                  <div className="row mb-3 d-flex">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 d-inline form-group">
                      <label className="ml-0" id="titlejds">
                        Add Limit<span className="error">*</span>
                      </label>
                      <input
                        autoComplete="off"
                        maxLength={6}
                        name="hybridPolicy"
                        placeholder="Enter JS Profile "
                        type="text"
                        className="form-control col-lg-10 "
                        // value={addlimit}
                        value={addlimit}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          if (/^[0-9]+$/.test(inputValue)) {
                            setAddlimit(inputValue);
                            setTotalLimit(
                              Number(jspreviewLimit) + Number(inputValue)
                            );
                            setPopupTotalLimitErr(false);
                          } else {
                            setAddlimit("");
                            // setJspreviewLimit("");
                            setPopupTotalLimitErr(true);
                          }
                        }}
                      />
                      {popupTotalLimitErr && (
                        <p className="form-error">
                          Please enter JS Profile Preview Limit.
                        </p>
                      )}
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 d-inline form-group">
                      <label className=" ml-0" id="titlejds">
                        Total
                      </label>
                      <input
                        autoComplete="off"
                        maxLength={6}
                        name="hybridPolicy"
                        placeholder="Total "
                        type="text"
                        className="form-control col-lg-10"
                        value={Number(addlimit) + Number(jspreviewLimit)}
                        // value={jspreviewLimit !== 0 ? jspreviewLimit : ""}
                        disabled
                        style={{ cursor: "not-allowed" }}
                      />
                    </div>
                  </div>
                  {/* --------------------------------------- */}

                  {/* <div className="row">
                    <div className="d-flex">

                      <h5 className=" headCost ml-0" id="titlejds">
                        Total<span className="form-error">*</span>
                      </h5>
                    </div>
                  </div> */}
                  <div className="row mt-2">
                    <div className=" col-xl-6 col-lg-6 col-md-6 col-sm-12 d-inline form-group">
                      <label className="  ml-0" id="titlejds">
                        Date to be Extended Till
                        <span className="error">*</span>
                      </label>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DatePicker"]}>
                          <DatePicker
                            className="datepickerWalkIn"
                            format="DD-MM-YYYY"
                            sx={{ gridColumn: "span 3" }}
                            shouldDisableDate={disableRandomDates}
                            disablePast
                            minDate={disEndDate}
                            value={endDate}
                            onChange={(newValue: any) => {
                              const selectedDate = `${newValue?.$D}/${newValue?.$M + 1
                                }/${newValue?.$y}`;
                              const EDate = `${disEndDate?.$D}/${disEndDate?.$M + 1
                                }/${disEndDate?.$y}`;

                              if (
                                isNaN(newValue?.$D) ||
                                isNaN(newValue?.$M + 1) ||
                                isNaN(newValue?.$y)
                              ) {
                                setDateErr("Please enter Date.");
                              } else if (
                                newValue?.$D &&
                                newValue?.$M + 1 &&
                                newValue?.$y &&
                                new Date(
                                  `${newValue?.$M + 1}/${newValue?.$D}/${newValue?.$y
                                  }`
                                ) < new Date(disEndDate)
                              ) {
                                setDateErr(
                                  "Extended Till Date should be greater than End Date."
                                );
                              } else {
                                setDateErr("");
                              }

                              setEndDate(newValue);
                            }}
                            onClose={() => { }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                      {DateErr && <p className="form-error">{DateErr}</p>}
                    </div>
                  </div>
                  {/*
                  <div className="row mt-2" id="headerjds">
                    <h5 className=" headCost ml-0" id="titlejds">
                      Subscription Type<span className="form-error">*</span>
                    </h5>
                  </div>

                */}
                </div>
              </div>
              {/* <div className="row"> */}
              <div className="modal-footer">
                {" "}
                <button
                  style={{ fontSize: "13px" }}
                  type="button"
                  className="site-button"
                  disabled={popupTotalLimitErr}
                  onClick={() => {
                    addlimit == "" && setPopupTotalLimitErr(true);
                    if (Number(addlimit) + Number(jspreviewLimit) === 0) {
                      setPopupTotalLimitErr(true);
                    }
                    if (
                      addlimit != "" &&
                      !DateErr &&
                      Number(addlimit) + Number(jspreviewLimit)
                    ) {
                      dispatchUpdateFunction();
                    }
                  }}
                >
                  Update
                </button>{" "}
                <button
                  style={{
                    fontSize: "13px",
                    backgroundColor: "#fca245",
                  }}
                  type="button"
                  className="site-button"
                  onClick={() => {
                    setShowJSEditPopup(false);
                    setPopupTotalLimitErr(false);
                    setDateErr("");
                  }}
                >
                  Cancel
                </button>{" "}
              </div>{" "}
            </div>{" "}
          </div>
        </div>
      </Modal>
    </>
  );
};
export default EmployerRegistration;
