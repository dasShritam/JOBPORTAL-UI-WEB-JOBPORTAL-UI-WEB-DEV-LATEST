import { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import Language from "../../../shared/Language";
import Select from "react-select";
import { RxCross2 } from "react-icons/rx";
import { TiTick } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { UseToastAlert } from "../../../../hooks/useToastAlert";
import {
  deleteLanguage,
  patchUpdatePersonalDetails,
  resetDelereActionCreator,
  resetPersonalDetailsCreator,
} from "../../../../redux/features/manage-account/profile/PersonalDetailsSlice";
import {
  GetDayFromTimeStamp,
  GetDaysInMonth,
  GetMonthNameFromTimeStamp,
  GetYearFromTimeStamp,
  customStyles,
  GetFutureOrPastMonths,
} from "../../../../common/common";
import { getJobSeekerrData } from "../../../../redux/features/manage-account/profile/JsSlice";
import { BsPencil } from "react-icons/bs";
import Swal from "sweetalert2";
import { regex } from "../../../../common/validation";
import { profileStrength } from "../../../../redux/features/manage-account/profile/BasicDetailsSlice";
import { values } from "pdf-lib";

interface selectType {
  label: string;
  value: string | number;
}

const emptySelect: selectType = {
  label: "",
  value: "",
};

const INITIAL_FORM_STATE: any = {
  Type: "",
  textArea: "",
  CarrerBreakReason: "",
  BreakStartMonth: null,
  BreakStartYear: null,
  BreakEndMonth: null,
  BreakEndYear: null,
  gender: "",
  address: "",
  date: null,
  month: null,
  year: null,
  martialStatus: "",
  category: "",
  pincode: "",
  town: "",
  workPermit: "",
  DiffAbled: "",
  Carrerbreak: "No",
  preferedCountry: [],
  moreInfo: [],
  checkbox: false,
  language: [],
};
const FORM_VALIDATION = Yup.object().shape({
  Type: Yup.string()
    .nullable()
    .when("DiffAbled", {
      is: (c) => c === "Yes",
      then: Yup.string()
        .required("Please enter Differently Abled type.")
        .nullable(),
    }),

  Carrerbreak: Yup.string().notRequired(),

  CarrerBreakReason: Yup.string()
    .nullable()
    .when("Carrerbreak", {
      is: (c) => c === "Yes",
      then: Yup.string()
        .required("Reason Of Break is a mandatory field. Please select one.")
        .nullable(),
    })
    .nullable(),

  BreakStartMonth: Yup.object()
    .nullable()
    .when("Carrerbreak", {
      is: (c) => c === "Yes",
      then: Yup.object()
        .required("Please enter break starting Month.")
        .nullable(),
    })
    .nullable(),

  BreakStartYear: Yup.object()
    .nullable()
    .when("Carrerbreak", {
      is: (c) => c === "Yes",
      then: Yup.object()
        .required("Please enter break starting Year.")
        .nullable(),
    })
    .nullable(),

  BreakEndMonth: Yup.object()
    .nullable()
    .when("Carrerbreak", {
      is: (c) => c === "Yes",
      then: Yup.object()
        .nullable()
        .when("checkbox", {
          is: (c) => c === false,
          then: Yup.object()
            .required("Please enter break ending Month.")
            .nullable(),
        }),
    })
    .nullable(),

  BreakEndYear: Yup.object()
    .nullable()
    .when("Carrerbreak", {
      is: (c) => c === "Yes",
      then: Yup.object()
        .nullable()
        .when("checkbox", {
          is: (c) => c === false,
          then: Yup.object()
            .required("Please enter break ending Year.")
            .nullable(),
        }),
    })
    .nullable(),
  address: Yup.string().notRequired(),
  date: Yup.object().notRequired().nullable(),
  month: Yup.object().notRequired().nullable(),
  year: Yup.object().nullable().notRequired(),
  gender: Yup.string().notRequired().nullable(),
  martialStatus: Yup.string().notRequired().nullable(),
  category: Yup.string().notRequired().nullable(),
  pincode: Yup.string().notRequired(),
  town: Yup.string().notRequired(),
  workPermit: Yup.string().notRequired().nullable(),
  DiffAbled: Yup.string().notRequired().nullable(),
  preferedCountry: Yup.array().nullable(),
  checkbox: Yup.boolean().notRequired().nullable(),
  textArea: Yup.string().notRequired().nullable(),
  moreInfo: Yup.array().notRequired().nullable(),
  language: Yup.array().of(
    Yup.object().shape({
      name: Yup.string()
        .required("Please enter Language.")
        .matches(regex.alphabetTyping, "Please enter Alphabets only."),
      ability: Yup.array().of(Yup.string()),
      level: Yup.string().required("Please select proficiency."),
    })
  ),
});

type propsState = {
  displayModel?: boolean;
  trigger?: any;
};

function PersonalDetails({ displayModel, trigger }: propsState) {
  const [selectedDOBYear, setSelectedDOBYear] = useState<any>(null);
  const [selectedDOBMonth, setSelectedDOBMonth] = useState<any>(null);
  const [selectedDOBDay, setSelectedDOBDay] = useState<any>(null);
  const handleChangeYear = (e: any) => {
    setSelectedDOBYear(e);
  };
  const handleChangeMonth = (e: any) => {
    setSelectedDOBMonth(e);
  };
  const handleChangeDay = (e: any) => {
    setSelectedDOBDay(e);
  };
  const [count, setCount] = useState(0);
  const [formData, setFormData] = useState<any>({ ...INITIAL_FORM_STATE });
  const [isSubmited, setIsSubmited] = useState<any>(false);
  const numReg = new RegExp(/^[0-9]*$/);
  const [disCheckbox, setDisCheckbox] = useState(false);

  const [selectedStartBreakYear, setSelectedStartBreakYear] = useState<
    selectType | any
  >(null);
  const [selectedStartBreakMonth, setSelectedStartBreakMonth] = useState<
    selectType | any
  >(null);
  const pflStrength = useSelector((state: any) => state.profileStrength);

  const [selectedEndBreakYear, setSelectedEndBreakYear] = useState<
    selectType | any
  >(null);
  const [selectedEndBreakMonth, setSelectedEndBreakMonth] = useState<
    selectType | any
  >(null);

  const [differentlyAble, setDifferntlyAble] = useState(null);
  const [carrerBreakStatus, setCarrerBreakStatus] = useState(null);
  const CurrentlyOnBreakRef = useRef<any>(null);
  const [selectDisable, setSelectDisable] = useState(false);
  const [showAble, setShowAble] = useState(false);
  const [showCarrer, setShowCarrer] = useState(false);
  const [personaldetails, setPersonalDetails] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [preferedLoc, setPreferedLoc] = useState<any>([]);
  const [moreinfos, setMoreInfos] = useState<any>([]);
  const [montherror, setMonthError] = useState(false);
  const [dayerror, setDayError] = useState(false);

  const setCurrentlyOnBreakRef = (data: boolean) => {
    if (CurrentlyOnBreakRef?.current?.checked) {
      CurrentlyOnBreakRef.current.checked = data;
    }
  };

  const [hideDisContent, setHideDisContent] = useState(true);
  const deleteLan = useSelector((state: any) => state.deletePersonalLan);

  useEffect(() => {
    if (displayModel) {
      setHideDisContent(false);
      setPersonalDetails(true);
    } else {
      setHideDisContent(true);
    }
  }, [displayModel]);

  useEffect(() => {
    if (deleteLan?.DeletePersonalLang?.code === 200) {
      dispatch(getJobSeekerrData());
      showSnackAlert("success", deleteLan?.DeletePersonalLang?.message, 2000);
      dispatch(resetDelereActionCreator());
      dispatch(profileStrength());
    }
  }, [deleteLan]);

  const editRef = useRef<any>();

  const handleSetCheck = (isChecked: boolean) => {
    setDisCheckbox(isChecked);
    if (isChecked) {
      setSelectedEndBreakYear(emptySelect);
      setSelectedEndBreakMonth(emptySelect);
      setDateError(false);
    }
  };
  const GetCareerBreakTime = (
    isBreak: boolean,
    from_ts: number,
    till_ts: number
  ) => {
    if (!isBreak) {
      return "No";
    } else {
      let from = `Yes, ${GetMonthNameFromTimeStamp(
        from_ts
      )} ${GetYearFromTimeStamp(from_ts)}`;

      if (till_ts) {
        from += `- ${GetMonthNameFromTimeStamp(till_ts)} ${GetYearFromTimeStamp(
          till_ts
        )}`;
      } else {
        from += " - Present";
      }
      return `${from}  `;
    }
  };
  useEffect(() => {}, [disCheckbox]);

  useEffect(() => {
    if (isSubmited) setFormData(formData);
  }, [isSubmited]);

  const handleHidePersonalDetails = () => {
    setPersonalDetails(false);
  };
  const JobSeekerProfileData = useSelector(
    (state: any) => state.JobSeekerProfile2
  );

  const yearmonthData = useSelector((state: any) => state.yearmonthMasterdata);
  const { allYearMonth } = yearmonthData,
    [yearData, setYearData] = useState<any>(),
    [monthData, setMonthData] = useState<any>();
  const getAllmonthOption = () => {
    if (allYearMonth) {
      allYearMonth?.map((opt: any) => {
        if (opt.group === "GHMO") {
          let obj: any = [];
          opt.data.map((item: any) => {
            obj.push({ value: item.id, label: item.value });
          });
          setMonthData(obj);
        }
      });
    }
  };
  useEffect(() => {
    if (allYearMonth) {
      allYearMonth?.map((opt: any) => {
        if (opt.group === "PAYE") {
          let obj: any = [];
          opt.data.map((item: any, index) => {
            obj.push({ value: item, label: item });
          });
          setYearData(obj.reverse());
        }
      });
    }
    getAllmonthOption();
  }, [allYearMonth]);
  useEffect(() => {}, [yearData, monthData]);
  const [check, setCheck] = useState<any>();
  const masterDatas = useSelector((state: any) => state.jobSeekerMasterData);
  const { JSMasterData } = masterDatas,
    [maritialStatus, setMaritialStatus] = useState<any>([]),
    [categoryOpt, setCategoryOpt] = useState<any>([]),
    [abledTypeOpt, setAbledTypeOpt] = useState<any>([]),
    [carrerBreakOpt, setCarrerBreakOpt] = useState<any>([]),
    [workpermitOpt, setWorkpermitOpt] = useState<any>([]),
    [options, setOptions] = useState<any>([]),
    [moreinfo, setMoreinfo] = useState<any>([]);

  useEffect(() => {
    if (JSMasterData) {
      JSMasterData?.map((opt: any) => {
        if (opt.group === "MAST") {
          setMaritialStatus([
            ...opt.data.map((item: any) => {
              return { value: item.id, label: item.value };
            }),
          ]);
        }
        if (opt.group === "CTGY") {
          setCategoryOpt([
            ...opt.data.map((item: any) => {
              return { value: item.id, label: item.value };
            }),
          ]);
        }
        if (opt.group === "PWDT") {
          setAbledTypeOpt([
            ...opt.data.map((item: any) => {
              return { value: item.id, label: item.value };
            }),
          ]);
        }
        if (opt.group === "REOB") {
          setCarrerBreakOpt([
            ...opt.data.map((item: any) => {
              return { value: item.id, label: item.value };
            }),
          ]);
        }
        if (opt.group === "WPUS") {
          setWorkpermitOpt([
            ...opt.data.map((item: any) => {
              return { value: item.id, label: item.value };
            }),
          ]);
        }
        if (opt.group === "WDIV") {
          setMoreinfo([
            ...opt.data.map((item) => {
              return { value: item.id, label: item.value };
            }),
          ]);
        }
        if (opt.group === "WPOC") {
          setOptions([
            ...opt.data.map((item) => {
              return { value: item.id, label: item.value };
            }),
          ]);
        }
      });
    }
  }, [JSMasterData]);

  useEffect(() => {}, [
    maritialStatus,
    categoryOpt,
    abledTypeOpt,
    carrerBreakOpt,
    workpermitOpt,
    options,
    moreinfo,
  ]);

  const personalData = useSelector((state: any) => state.projectDetails);
  const { PersonalDetails, loading1 } = personalData;
  const showSnackAlert = UseToastAlert();
  const dispatch = useDispatch();
  const [profileData, setProfileData] = useState<any>();
  const [langData, setLangData] = useState<any>();
  const [careerData, setCareerData] = useState<any>();
  const { JobSeekerProfile, loading } = JobSeekerProfileData;

  useEffect(() => {
    if (!loading1 && PersonalDetails?.code === 200) {
      showSnackAlert("success", PersonalDetails?.message, 2000);
      dispatch(getJobSeekerrData());
      dispatch(resetPersonalDetailsCreator());
      dispatch(profileStrength());
      if (profileData?.career_break?.duration?.till_ts === 0) {
        setDisCheckbox(true);
      } else {
        setDisCheckbox(false);
      }
    }
  }, [PersonalDetails?.code, loading1, dispatch]);

  useEffect(() => {
    if (JobSeekerProfile?.js_profile)
      setProfileData(JobSeekerProfile?.js_profile?.profile);
    setCareerData(JobSeekerProfile?.js_profile?.career_profile);
    setLangData(JobSeekerProfile?.js_profile);
  }, [JobSeekerProfile.js_profile, profileData]);

  useEffect(() => {
    if (!loading && JobSeekerProfile?.js_profile && displayModel) {
      setProfileData(JobSeekerProfile?.js_profile?.profile);
      setCareerData(JobSeekerProfile?.js_profile?.career_profile);
      setTimeout(() => {
        editRef?.current?.click();
      }, 0);
    }
  }, [displayModel, loading, JobSeekerProfile?.js_profile]);

  const personalDetail = useSelector((state: any) => state.personalDetails);
  const { UpdatedPersonalDetails } = personalDetail;
  useEffect(() => {
    if (UpdatedPersonalDetails && UpdatedPersonalDetails.code === 200) {
      dispatch(getJobSeekerrData());
      dispatch(resetPersonalDetailsCreator());
      showSnackAlert("success", UpdatedPersonalDetails.message);
      dispatch(profileStrength());
    }
  }, [UpdatedPersonalDetails]);

  const validate = (values: any) => {
    let endDate: string = "";
    let startDate: string = "";
    if (values.BreakStartMonth && values.BreakStartYear) {
      startDate = new Date(
        `${values.BreakStartYear?.label},  ${
          Number(values.BreakStartMonth?.value) + 1
        }, 1`
      )
        .toISOString()
        .slice(0, 10);
    }
    if (values.BreakEndYear && values.BreakEndMonth) {
      endDate = new Date(
        `${values.BreakEndYear?.label},${
          Number(values.BreakEndMonth?.value) + 1
        }, 1,`
      )
        .toISOString()
        .slice(0, 10);
    }
    if (endDate !== "" && endDate < startDate) {
      setDateError(true);
    } else {
      setDateError(false);
    }
  };

  const limitLocation = (e: any) => {
    if (e?.length >= 3) {
      setSelectDisable(true);
    }
    if (e?.length <= 2) {
      setSelectDisable(false);
    }
  };

  const handleStateValue = () => {
    setSelectedDOBDay(null);
    setSelectedDOBMonth(null);
    setSelectedDOBYear(null);
    setSelectedEndBreakMonth(null);
    setSelectedEndBreakYear(null);
    setSelectedStartBreakMonth(null);
    setSelectedStartBreakYear(null);
    setMoreInfos(null);
    setPreferedLoc(null);
  };
  const [dummy, setDummy] = useState<any>();
  useEffect(() => {}, [dummy]);
  const deleteHandler = (
    val: string,
    index: string,
    language: any,
    setFieldValue: any,
    setFieldTouched: any,
    setFieldError: any
  ) => {
    if (val !== undefined) {
      Swal.fire({
        title: "Are you sure?",
        text: "Once deleted,You will not be able to recover this Record!",
        showCancelButton: true,
        confirmButtonColor: "#2a9f2a",
        cancelButtonColor: "#db1919",
        confirmButtonText: "Yes, Delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(deleteLanguage(val));
          language.splice(index, 1);
          setFieldValue("language", [...language]);
          setFieldError("name", "");
        }
      });
    } else {
      language.splice(index, 1);
      setFieldValue("language", [...language]);
      setFieldError("name", "");
    }
    setDummy([...language]);
  };

  const savehandler = (values: any) => {
    if (values.address === undefined) {
      values.address = "";
    }
    if (values.town === undefined) {
      values.town = "";
    }
    if (values.pincode === undefined) {
      values.pincode = "";
    }
    const PersonalObj = {
      gender: values.gender,
      dob_ts: {
        year: selectedDOBYear?.label,
        month: selectedDOBMonth?.value,
        day: selectedDOBDay?.label,
      },
      category: values.category,
      marital_status: values.martialStatus,
      work_permit: values.workPermit,
      work_permitOC: preferedLoc?.map((con: any) => {
        return con.label;
      }),
      disability: values.DiffAbled === "Yes" ? true : false,
      assistance: values.DiffAbled === "Yes" ? values.textArea : "",
      disability_type: values.DiffAbled === "Yes" ? values.Type : "",
      career_break: {
        from_break: values.Carrerbreak === "Yes" ? true : false,
        reason: values.Carrerbreak === "Yes" ? values.CarrerBreakReason : "",
        duration: {
          from_ts: {
            startYear:
              values.Carrerbreak === "Yes" && selectedStartBreakYear
                ? selectedStartBreakYear?.label
                : "",
            startMonth:
              values.Carrerbreak === "Yes" && selectedStartBreakMonth
                ? selectedStartBreakMonth?.value
                : "",
          },
          till_ts: {
            endYear:
              values.Carrerbreak === "Yes" && selectedEndBreakYear
                ? selectedEndBreakYear?.label
                : "",
            endMonth:
              values.Carrerbreak === "Yes" && selectedEndBreakMonth
                ? selectedEndBreakMonth?.value
                : "",
          },
        },
      },
      addresses: [
        {
          street: values.address,
          city: values.town,
          zip: Number(values.pincode),
        },
      ],
      languages: values.language?.length
        ? values.language.map((e: any) => {
            return { name: e?.name, ability: e?.ability, level: e?.level };
          })
        : values.language,
      more_info: moreinfos?.map((con: any) => {
        return con.label;
      }),
    };

    dispatch(patchUpdatePersonalDetails(PersonalObj));
    handleStateValue();
    trigger && trigger(false);
  };

  const displayDateOfBirth = (DOB: any) => {
    if (DOB) {
      const data = `${GetDayFromTimeStamp(
        JobSeekerProfile?.js_profile?.profile?.dob
      )} 
            ${GetMonthNameFromTimeStamp(
              JobSeekerProfile?.js_profile?.profile?.dob
            )} 
            ${GetYearFromTimeStamp(
              JobSeekerProfile?.js_profile?.profile?.dob
            )}`;
      return data;
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    setTimeout(() => {
      if (inputRef?.current) {
        inputRef?.current?.focus();
        const el = document.querySelector<HTMLTextAreaElement>("descri");
        el?.scrollIntoView({ behavior: "smooth", block: "end" });
        el?.focus();
      }
    }, 500);
  };
  useEffect(() => {
    if (options.length && careerData?.more_info?.length) {
      setMoreInfos([
        ...careerData?.more_info?.map((data) => {
          return moreinfo?.filter((opt) => {
            return opt.label === data;
          })[0];
        }),
      ]);
    }
  }, [options, careerData?.more_info]);
  useEffect(() => {
    if (options.length && careerData?.work_permitOC?.length) {
      setPreferedLoc([
        ...careerData?.work_permitOC?.map((data) => {
          return options?.filter((opt) => {
            return opt.label === data;
          })[0];
        }),
      ]);
    }
  }, [options, careerData?.work_permitOC]);

  return (
    <>
      <style>
        {`
             #manditory{
                color: red;
           }
           .border-red-400{
                border:1px solid red;
           }
           .buttonDiv{
                display: flex;
                justify-content: space-around;
                margin-left:60%;
           }
           .CursorsPointer{
            cursor:pointer
           }
           .subStatement{
            fontSize:1px;
           }
          .react-select__option {
            cursor: pointer;
          }
          .react-select__menu-list > div:hover {
            cursor: pointer;
          }
         
           `}
      </style>
      <>
        <Formik
          initialValues={{
            ...INITIAL_FORM_STATE,
          }}
          validate={validate}
          validationSchema={FORM_VALIDATION}
          onSubmit={(values, { resetForm }) => {
            if (dateError) {
            } else {
              if (selectedDOBYear?.label) {
                if (!values.month || !values.month.length) {
                  setMonthError(true);
                } else if (values.month && !selectedDOBDay?.value) {
                  setDayError(true);
                } else {
                  setMonthError(false);
                  setDayError(false);
                  savehandler(values);
                  setPersonalDetails(false);
                }
              } else {
                savehandler(values);
                resetForm();
                setPersonalDetails(false);
              }
              setIsSubmited(true);
            }
          }}
          isInitialValid={false}
        >
          {(formik: any) => {
            const {
              setFieldError,
              setFieldValue,
              values,
              handleChange,
              handleSubmit,
              handleBlur,
              errors,
              touched,
              setFieldTouched,
            } = formik;
            setDifferntlyAble(formik.values.DiffAbled);
            differentlyAble === "Yes" ? setShowAble(true) : setShowAble(false);

            setCarrerBreakStatus(formik.values.Carrerbreak);
            carrerBreakStatus === "Yes"
              ? setShowCarrer(true)
              : setShowCarrer(false);

            const edithandler = (e: any) => {
              e.preventDefault();

              setTimeout(() => {
                setCurrentlyOnBreakRef(
                  careerData?.career_break?.till_ts ? false : true
                );
              }, 0);

              setCount(
                profileData?.assistance?.length > 0
                  ? profileData?.assistance?.length
                  : 0
              );
              !loading && profileData && profileData?.dob
                ? setSelectedDOBYear({
                    label: `${GetYearFromTimeStamp(profileData?.dob)}`,
                    value: `${GetYearFromTimeStamp(profileData?.dob)}`,
                  })
                : setSelectedDOBYear(null);

              profileData?.dob
                ? setSelectedDOBMonth({
                    label: `${GetMonthNameFromTimeStamp(profileData?.dob)}`,
                    value: Number(
                      GetMonthNameFromTimeStamp(profileData?.dob, true, true)
                    ),
                  })
                : setSelectedDOBMonth(null);
              profileData?.dob
                ? setSelectedDOBDay({
                    label: `${GetDayFromTimeStamp(profileData?.dob)}`,
                    value: `${GetDayFromTimeStamp(profileData?.dob)}`,
                  })
                : setSelectedDOBDay(null);
              setFieldValue(
                "month",
                GetMonthNameFromTimeStamp(profileData?.dob)
              );

              if (profileData?.dob !== 0 && profileData?.dob !== null) {
                const yearnumber = GetYearFromTimeStamp(profileData?.dob);
                const monthName = GetMonthNameFromTimeStamp(
                  profileData?.dob,
                  true,
                  true
                );
              }

              setFieldValue("date", {
                label: `Number(${GetDayFromTimeStamp(profileData?.dob)})`,
                value: `Number(${GetDayFromTimeStamp(profileData?.dob)})`,
              });
              setFieldValue("year", {
                label: `${GetYearFromTimeStamp(profileData?.dob)}`,
                value: `${GetYearFromTimeStamp(profileData?.dob)}`,
              });

              setFieldValue("gender", profileData?.gender);
              setFieldValue("martialStatus", profileData?.marital_status);
              setFieldValue("category", profileData?.category);
              setFieldValue("workPermit", careerData?.work_permit);
              setFieldValue(
                "reason",
                careerData?.career_break?.from_break?.reason
              );
              setFieldValue(
                "preferedCountry",
                careerData?.work_permitOC?.map((data) => {
                  return options?.filter((opt) => {
                    return opt.label === data;
                  })[0];
                })
              );
              setMoreInfos(
                careerData?.more_info?.map((data) => {
                  return moreinfo?.filter((opt) => {
                    return opt.label === data;
                  })[0];
                })
              );
              setPreferedLoc(
                careerData?.work_permitOC?.map((data) => {
                  return options?.filter((opt) => {
                    return opt.label === data;
                  })[0];
                })
              );
              setFieldValue(
                "moreInfo",
                careerData?.more_info?.map((data) => {
                  return moreinfo?.filter((opt) => {
                    return opt.label === data;
                  })[0];
                })
              );
              profileData?.address
                ? setFieldValue("address", profileData?.address[0]?.street)
                : setFieldValue("address", "");
              profileData?.address
                ? setFieldValue("town", profileData?.address[0]?.city)
                : setFieldValue("town", "");
              profileData?.address
                ? setFieldValue("pincode", profileData?.address[0]?.zip)
                : setFieldValue("pincode", "");
              setFieldValue(
                "DiffAbled",
                profileData?.disability_type ? "Yes" : "No"
              );
              setFieldValue("Type", profileData?.disability_type);
              setFieldValue("textArea", profileData?.assistance);
              setFieldValue(
                "Carrerbreak",
                careerData?.career_break?.reason &&
                  careerData?.career_break?.reason !== "" &&
                  careerData?.career_break?.reason !== null
                  ? "Yes"
                  : "No"
              );
              careerData?.career_break?.reason &&
              careerData?.career_break?.reason !== "" &&
              careerData?.career_break?.reason !== null
                ? setCheck(true)
                : setCheck(false);

              setFieldValue(
                "CarrerBreakReason",
                careerData?.career_break?.reason === undefined
                  ? ""
                  : careerData?.career_break?.reason
              );

              setFieldValue(
                "checkbox",
                careerData?.career_break?.till_ts &&
                  careerData?.career_break?.reason &&
                  careerData?.career_break?.reason !== null
                  ? false
                  : careerData?.career_break?.reason &&
                    careerData?.career_break?.from_ts
                  ? true
                  : false
              );
              careerData?.career_break?.reason
                ? setDisCheckbox(false)
                : setDisCheckbox(true);
              careerData?.career_break?.till_ts !== null
                ? setDisCheckbox(false)
                : setDisCheckbox(true);

              careerData?.career_break?.from_ts
                ? setSelectedStartBreakMonth({
                    label: `${GetMonthNameFromTimeStamp(
                      careerData?.career_break?.from_ts
                    )}`,
                    value: Number(
                      `${GetMonthNameFromTimeStamp(
                        careerData?.career_break?.from_ts,
                        true,
                        true
                      )}`
                    ),
                  })
                : setSelectedStartBreakMonth(null);
              careerData?.career_break?.from_ts
                ? setSelectedStartBreakYear({
                    label: `${GetYearFromTimeStamp(
                      careerData?.career_break?.from_ts
                    )}`,
                    value: `${GetYearFromTimeStamp(
                      careerData?.career_break?.from_ts
                    )}`,
                  })
                : setSelectedStartBreakYear(null);

              careerData?.career_break?.till_ts
                ? setSelectedEndBreakMonth({
                    label: `${GetMonthNameFromTimeStamp(
                      careerData?.career_break?.till_ts
                    )}`,
                    value: Number(
                      `${GetMonthNameFromTimeStamp(
                        careerData?.career_break?.till_ts,
                        true,
                        true
                      )}`
                    ),
                  })
                : setSelectedEndBreakMonth(null);

              careerData?.career_break?.till_ts
                ? setSelectedEndBreakYear({
                    label: `${GetYearFromTimeStamp(
                      careerData?.career_break?.till_ts
                    )}`,
                    value: `${GetYearFromTimeStamp(
                      careerData?.career_break?.till_ts
                    )}`,
                  })
                : setSelectedEndBreakYear(null);
              setFieldValue(
                "BreakStartMonth",
                careerData?.career_break?.from_ts
                  ? {
                      label: `${GetMonthNameFromTimeStamp(
                        careerData?.career_break?.from_ts
                      )}`,
                      value: `${GetMonthNameFromTimeStamp(
                        careerData?.career_break?.from_ts,
                        true,
                        true
                      )}`,
                    }
                  : ""
              );
              setFieldValue(
                "BreakStartYear",
                careerData?.career_break?.from_ts
                  ? {
                      label: `${GetYearFromTimeStamp(
                        careerData?.career_break?.from_ts
                      )}`,
                      value: `${GetYearFromTimeStamp(
                        careerData?.career_break?.from_ts
                      )}`,
                    }
                  : ""
              );
              setFieldValue(
                "BreakEndMonth",
                careerData?.career_break?.till_ts
                  ? {
                      label: `${GetMonthNameFromTimeStamp(
                        careerData?.career_break?.till_ts
                      )}`,
                      value: `${GetMonthNameFromTimeStamp(
                        careerData?.career_break?.till_ts,
                        true,
                        true
                      )}`,
                    }
                  : null
              );
              setFieldValue(
                "BreakEndYear",
                careerData?.career_break?.till_ts
                  ? {
                      label: `${GetYearFromTimeStamp(
                        careerData?.career_break?.till_ts
                      )}`,
                      value: `${GetYearFromTimeStamp(
                        careerData?.career_break?.till_ts
                      )}`,
                    }
                  : ""
              );
              if (langData?.languages) {
                setFieldValue(
                  "language",
                  JSON.parse(JSON.stringify(langData?.languages))
                );
              }
            };

            return (
              <>
                <div id="personal_details_bx" className="job-bx bg-white m-b30">
                  {displayModel && (
                    <button
                      ref={editRef}
                      className="d-none"
                      onClick={(e: any) => {
                        edithandler(e);
                        setPersonalDetails(true);
                      }}
                    ></button>
                  )}

                  {hideDisContent && (
                    <div className="d-flex">
                      <h5 className="m-b30">
                        Personal Details
                        <span className="font-14">
                          {pflStrength?.pflStrnRes?.data?.profileWeightage
                            ? ` (${
                                Number(
                                  pflStrength?.pflStrnRes?.data
                                    ?.profileWeightage?.gender
                                ) +
                                Number(
                                  pflStrength?.pflStrnRes?.data
                                    ?.profileWeightage?.dob
                                ) +
                                Number(
                                  pflStrength?.pflStrnRes?.data
                                    ?.profileWeightage?.lang
                                )
                              }%)`
                            : ""}
                        </span>
                      </h5>
                      <Link
                        to={"#"}
                        onClick={(e: any) => {
                          edithandler(e);
                          setPersonalDetails(true);
                        }}
                        className="edit-icon"
                        title="Click here to edit personal details."
                      >
                        <BsPencil />
                      </Link>
                    </div>
                  )}
                  <Modal
                    className="modal fade browse-job modal-bx-info editor"
                    show={personaldetails}
                    backdrop="static"
                    onHide={() => {
                      formik.resetForm();
                      handleHidePersonalDetails();
                      handleStateValue();
                    }}
                  >
                    <div className="modal-dialog my-0" role="document">
                      <div className="modal-content">
                        <div className="modal-body">
                          <div className="modal-custom-header">
                            <h5
                              className="modal-title"
                              id="PersonaldetailsModalLongTitle"
                            >
                              Personal Details
                            </h5>
                            <button
                              type="button"
                              className="close"
                              onClick={() => {
                                formik.resetForm();
                                setPersonalDetails(false);
                                trigger && trigger(false);
                                setMonthError(false);
                                setDayError(false);
                              }}
                            >
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <form
                            onSubmit={(e) => {
                              handleSubmit(e);
                              setIsSubmited(true);
                            }}
                          >
                            <div className="row">
                              <div className="col-lg-12 col-md-12">
                                <div className="form-group">
                                  <label>Date of Birth</label>
                                  <div className="row">
                                    <div className="col-lg-4 col-md-4 col-sm-4 col-4">
                                      <Select
                                        placeholder="Year"
                                        isSearchable={true}
                                        value={selectedDOBYear}
                                        name="year"
                                        options={yearData}
                                        onChange={(option: any) => {
                                          handleChangeYear(option);
                                          setFieldValue("year", option?.label);
                                          if (
                                            option?.label ==
                                            new Date().getFullYear()
                                          ) {
                                            setMonthData(
                                              GetFutureOrPastMonths(
                                                new Date().getFullYear(),
                                                monthData,
                                                true
                                              )
                                            );
                                          } else {
                                            getAllmonthOption();
                                          }
                                        }}
                                        className={"dropstyle"}
                                        styles={customStyles}
                                      />
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-sm-4 col-4">
                                      <Select
                                        placeholder="Month"
                                        value={selectedDOBMonth}
                                        name="month"
                                        onChange={(option: any) => {
                                          handleChangeMonth(option);
                                          setFieldValue("month", option?.label);
                                          setMonthError(false);
                                        }}
                                        isSearchable={true}
                                        options={monthData}
                                        className={"dropstyle"}
                                        styles={customStyles}
                                      />
                                      {montherror && (
                                        <p className="form-error">
                                          Please select month
                                        </p>
                                      )}
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-sm-4 col-4">
                                      <Select
                                        placeholder=" Day"
                                        value={selectedDOBDay}
                                        name="date"
                                        onChange={(option: any) => {
                                          handleChangeDay(option);
                                          setFieldValue("date", option?.label);
                                          setDayError(false);
                                        }}
                                        isSearchable={
                                          selectedDOBYear && selectedDOBMonth
                                            ? true
                                            : false
                                        }
                                        options={
                                          selectedDOBYear &&
                                          selectedDOBMonth &&
                                          GetDaysInMonth(
                                            Number(selectedDOBYear.label),
                                            selectedDOBMonth.label,
                                            0,
                                            true,
                                            false
                                          )
                                        }
                                        isDisabled={false}
                                        className={"dropstyle"}
                                        styles={customStyles}
                                      />
                                      {dayerror && (
                                        <p className="form-error">
                                          Please select day
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="form-group">
                                  <label>Gender</label>
                                  <div className="row">
                                    <div className="col-lg-3 col-md-3 col-sm-3 col-3">
                                      <div className="custom-control custom-radio">
                                        <input
                                          name="gender"
                                          value="Male"
                                          onChange={handleChange}
                                          type="radio"
                                          className="custom-control-input"
                                          id="male"
                                          checked={values.gender === "Male"}
                                        />
                                        <label
                                          className="custom-control-label"
                                          htmlFor="male"
                                        >
                                          Male
                                        </label>
                                      </div>
                                    </div>
                                    <div className="col-lg-3 col-md-3 col-sm-3 col-3">
                                      <div className="custom-control custom-radio">
                                        <input
                                          name="gender"
                                          value="Female"
                                          onChange={handleChange}
                                          type="radio"
                                          className="custom-control-input"
                                          id="female"
                                          checked={values.gender === "Female"}
                                        />
                                        <label
                                          className="custom-control-label"
                                          htmlFor="female"
                                        >
                                          Female
                                        </label>
                                      </div>
                                    </div>
                                    <div className="col-lg-3 col-md-3 col-sm-3 col-3">
                                      <div className="custom-control custom-radio">
                                        <input
                                          name="gender"
                                          value="Transgender"
                                          onChange={handleChange}
                                          type="radio"
                                          className="custom-control-input"
                                          id="transgender"
                                          checked={
                                            values.gender === "Transgender"
                                          }
                                        />
                                        <label
                                          className="custom-control-label"
                                          htmlFor="transgender"
                                        >
                                          Transgender
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="col-lg-12 col-md-12">
                                <div className="form-group">
                                  <label>More Information</label>
                                  <div
                                    className="subStatement"
                                    style={{
                                      fontSize: "13px",
                                    }}
                                  >
                                    Companies are focusing on equal
                                    opportunities and might be looking for
                                    candidates from diverse backgrounds.
                                  </div>
                                  <Select
                                    placeholder="Select More Information"
                                    isMulti
                                    isSearchable={true}
                                    isClearable={true}
                                    isDisabled={false}
                                    name="preferedMoreInfo"
                                    options={moreinfo}
                                    value={moreinfos}
                                    onChange={(option) => {
                                      setMoreInfos(option);
                                      setFieldValue("preferedMoreInfo", option);
                                    }}
                                    className={"dropstyle"}
                                    styles={customStyles}
                                  />
                                </div>
                              </div>

                              <div className="col-lg-12 col-md-12">
                                <div className="form-group">
                                  <label>Marital Status</label>
                                  <Select
                                    placeholder="Select Marital Status"
                                    isSearchable={true}
                                    isClearable={true}
                                    isDisabled={false}
                                    maxMenuHeight={200}
                                    name="martialStatus"
                                    options={maritialStatus}
                                    value={maritialStatus.find(
                                      (item: any) =>
                                        item.label === values.martialStatus
                                    )}
                                    onChange={(options: any) => {
                                      setFieldValue(
                                        "martialStatus",
                                        options?.label
                                      );
                                    }}
                                    className={"dropstyle"}
                                    styles={customStyles}
                                  />
                                </div>
                              </div>

                              <div className="col-lg-12 col-md-12">
                                <div className="form-group">
                                  <label>Category</label>
                                  <div
                                    className="subStatement"
                                    style={{
                                      fontSize: "13px",
                                    }}
                                  >
                                    Companies welcome people from various
                                    categories to bring equality among all
                                    citizens
                                  </div>
                                  <Select
                                    placeholder="Select Category"
                                    isSearchable={true}
                                    isClearable={true}
                                    isDisabled={false}
                                    maxMenuHeight={200}
                                    name="category"
                                    options={categoryOpt}
                                    value={categoryOpt.find(
                                      (item: any) =>
                                        item.label === values.category
                                    )}
                                    onChange={(options: any) => {
                                      setFieldValue("category", options?.label);
                                    }}
                                    className={"dropstyle"}
                                    styles={customStyles}
                                  />
                                </div>
                              </div>

                              <div className="col-lg-12 col-md-12">
                                <div className="form-group">
                                  <label>Are you Differently Abled?</label>
                                  <div className="row">
                                    <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                                      <div className="custom-control custom-radio">
                                        <input
                                          value="Yes"
                                          type="radio"
                                          className="custom-control-input"
                                          id="Yes"
                                          name="DiffAbled"
                                          checked={values.DiffAbled === "Yes"}
                                          onChange={(e: any) => {
                                            handleChange(e);
                                          }}
                                        />
                                        <label
                                          className="custom-control-label"
                                          htmlFor="Yes"
                                        >
                                          Yes
                                        </label>
                                      </div>
                                    </div>

                                    <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                                      <div className="custom-control custom-radio">
                                        <input
                                          value="No"
                                          type="radio"
                                          className="custom-control-input"
                                          id="No"
                                          name="DiffAbled"
                                          checked={values.DiffAbled === "No"}
                                          onChange={(e: any) => {
                                            handleChange(e);
                                          }}
                                        />
                                        <label
                                          className="custom-control-label"
                                          htmlFor="No"
                                        >
                                          No
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {showAble && (
                                <>
                                  <div className="col-lg-12 col-md-12">
                                    <div className="form-group">
                                      <label>
                                        Type
                                        <span id="manditory">*</span>
                                      </label>

                                      <Select
                                        placeholder="Select Differently Abled Type"
                                        isSearchable={true}
                                        isClearable={false}
                                        isDisabled={false}
                                        maxMenuHeight={200}
                                        name="Type"
                                        options={abledTypeOpt}
                                        onBlur={handleBlur}
                                        value={abledTypeOpt.find(
                                          (item: any) =>
                                            item.label === values.Type
                                        )}
                                        onChange={(options: any) => {
                                          setFieldValue("Type", options?.label);
                                        }}
                                        className={"dropstyle"}
                                        styles={customStyles}
                                      />
                                      {errors.Type && touched.Type ? (
                                        <p className="form-error">
                                          {errors.Type}
                                        </p>
                                      ) : null}
                                    </div>
                                  </div>
                                  <div className="col-lg-12 col-md-12">
                                    <div className="form-group">
                                      <label>What assistance do you need</label>
                                      <textarea
                                        name="textArea"
                                        value={values.textArea}
                                        maxLength={250}
                                        onChange={(e) => {
                                          handleChange(e);
                                          setCount(e.target.value.length);
                                        }}
                                        className="form-control"
                                        placeholder="Type Description"
                                      ></textarea>
                                      <span className="custom-char-count">
                                        {250 - count} Character(s) left
                                      </span>
                                    </div>
                                  </div>
                                </>
                              )}

                              <div className="col-lg-12 col-md-12">
                                <div className="form-group">
                                  <label>Have you taken a Career Break?</label>
                                  <div className="row">
                                    <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                                      <div className="custom-control custom-radio">
                                        <input
                                          value="Yes"
                                          type="radio"
                                          className="custom-control-input"
                                          id="true"
                                          name="Carrerbreak"
                                          onChange={(e: any) => {
                                            handleChange(e);
                                            e.target.value === "Yes"
                                              ? setDisCheckbox(false)
                                              : setDisCheckbox(true);
                                          }}
                                          checked={values.Carrerbreak === "Yes"}
                                        />
                                        <label
                                          className="custom-control-label"
                                          htmlFor="true"
                                        >
                                          Yes
                                        </label>
                                      </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 col-sm-6 col-6">
                                      <div className="custom-control custom-radio">
                                        <input
                                          value="No"
                                          type="radio"
                                          className="custom-control-input"
                                          id="false"
                                          name="Carrerbreak"
                                          onChange={handleChange}
                                          checked={values.Carrerbreak === "No"}
                                          defaultChecked={true}
                                        />
                                        <label
                                          className="custom-control-label"
                                          htmlFor="false"
                                        >
                                          No
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {showCarrer && (
                                <>
                                  <div className="col-lg-12 col-md-12">
                                    <div className="form-group">
                                      <label>
                                        Reason of Break
                                        <span id="manditory">*</span>
                                      </label>
                                      <Select
                                        placeholder="Select Reason of Break"
                                        isSearchable={true}
                                        isClearable={false}
                                        isDisabled={false}
                                        name="CarrerBreakReason"
                                        options={carrerBreakOpt}
                                        value={carrerBreakOpt.find(
                                          (item: any) =>
                                            item.label ===
                                            values.CarrerBreakReason
                                        )}
                                        onBlur={handleBlur}
                                        onChange={(options: any) => {
                                          setFieldValue(
                                            "CarrerBreakReason",
                                            options?.label
                                          );
                                          handleChange();
                                        }}
                                        className={"dropstyle"}
                                        styles={customStyles}
                                      />

                                      {errors.CarrerBreakReason &&
                                        touched.CarrerBreakReason && (
                                          <p className="form-error">
                                            {errors.CarrerBreakReason}
                                          </p>
                                        )}
                                    </div>
                                  </div>

                                  <div className="col-lg-12 col-md-12">
                                    <div className="form-group">
                                      <label>
                                        Break started from
                                        <span id="manditory">*</span>
                                      </label>
                                      <div className="row">
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                          <Select
                                            placeholder="Year"
                                            value={selectedStartBreakYear}
                                            maxMenuHeight={200}
                                            name="BreakStartYear"
                                            onBlur={handleBlur}
                                            onChange={(selectedOption: any) => {
                                              let event = {
                                                target: {
                                                  name: "BreakStartYear",
                                                  value: selectedOption,
                                                },
                                              };
                                              handleChange(event);
                                              setSelectedStartBreakYear(
                                                selectedOption
                                              );
                                            }}
                                            isSearchable={true}
                                            isClearable={true}
                                            isDisabled={false}
                                            options={yearData}
                                            className={"dropstyle"}
                                            styles={customStyles}
                                          />

                                          {errors.BreakStartYear &&
                                            touched.BreakStartYear && (
                                              <p className="form-error">
                                                {errors.BreakStartYear}
                                              </p>
                                            )}
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                          <Select
                                            placeholder="Month"
                                            value={selectedStartBreakMonth}
                                            name="BreakStartMonth"
                                            onBlur={handleBlur}
                                            maxMenuHeight={200}
                                            onChange={(selectedOption: any) => {
                                              let event = {
                                                target: {
                                                  name: "BreakStartMonth",
                                                  value: selectedOption,
                                                },
                                              };
                                              handleChange(event);
                                              setSelectedStartBreakMonth(
                                                selectedOption
                                              );
                                            }}
                                            isSearchable={true}
                                            isClearable={true}
                                            options={monthData}
                                            isDisabled={false}
                                            className={"dropstyle"}
                                            styles={customStyles}
                                          />
                                          {errors.BreakStartMonth &&
                                            touched.BreakStartMonth && (
                                              <p className="form-error">
                                                {errors.BreakStartMonth}
                                              </p>
                                            )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {!disCheckbox && (
                                    <>
                                      <div className="col-lg-12 col-md-12">
                                        <div className="form-group">
                                          <label>
                                            Break ended in
                                            <span id="manditory">*</span>
                                          </label>
                                          <div className="row">
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                              <Select
                                                placeholder="Year"
                                                value={selectedEndBreakYear}
                                                name="BreakEndYear"
                                                onChange={(
                                                  selectedOption: any
                                                ) => {
                                                  let event = {
                                                    target: {
                                                      name: "BreakEndYear",
                                                      value: selectedOption,
                                                    },
                                                  };
                                                  handleChange(event);
                                                  setSelectedEndBreakYear(
                                                    selectedOption
                                                  );
                                                }}
                                                isSearchable={true}
                                                isClearable={true}
                                                options={yearData}
                                                className={"dropstyle"}
                                                styles={customStyles}
                                                onBlur={handleBlur}
                                              />
                                              {errors.BreakEndYear &&
                                                touched.BreakEndYear && (
                                                  <p className="form-error">
                                                    {errors.BreakEndYear}
                                                  </p>
                                                )}
                                              {dateError && (
                                                <p className="form-error">
                                                  Break Ended In must be greater
                                                  than Break Started From.
                                                </p>
                                              )}
                                            </div>
                                            <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                              <Select
                                                placeholder="Month"
                                                value={selectedEndBreakMonth}
                                                name="BreakEndMonth"
                                                onChange={(
                                                  selectedOption: any
                                                ) => {
                                                  let event = {
                                                    target: {
                                                      name: "BreakEndMonth",
                                                      value: selectedOption,
                                                    },
                                                  };
                                                  handleChange(event);
                                                  setSelectedEndBreakMonth(
                                                    selectedOption
                                                  );
                                                }}
                                                isSearchable={true}
                                                isClearable={true}
                                                options={monthData}
                                                isDisabled={false}
                                                className={"dropstyle"}
                                                styles={customStyles}
                                                onBlur={handleBlur}
                                              />
                                              {errors.BreakEndMonth &&
                                                touched.BreakEndMonth && (
                                                  <p className="form-error">
                                                    {errors.BreakEndMonth}
                                                  </p>
                                                )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  )}

                                  <div className="col-lg-12 col-md-12">
                                    <div className="form-group">
                                      <div className="custom-control custom-checkbox">
                                        <input
                                          type="checkbox"
                                          id="check"
                                          name="checkbox"
                                          defaultChecked={check}
                                          value={"Present"}
                                          ref={CurrentlyOnBreakRef}
                                          className="custom-control-input"
                                          onChange={(e: any) => {
                                            handleSetCheck(e.target.checked);
                                            values.checkbox = e.target.checked;
                                            setSelectedEndBreakMonth(null);
                                            setSelectedEndBreakYear(null);
                                          }}
                                        />
                                        <label
                                          className="custom-control-label"
                                          htmlFor="check"
                                        >
                                          Currently on Break
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}

                              <div className="col-lg-12 col-md-12">
                                <div className="form-group">
                                  <label>Work Permit for USA</label>
                                  <Select
                                    placeholder="Select Work Permit"
                                    isSearchable={true}
                                    isClearable={true}
                                    isDisabled={false}
                                    maxMenuHeight={200}
                                    name="workPermit"
                                    options={workpermitOpt}
                                    value={workpermitOpt.find(
                                      (item: any) =>
                                        item.label === values.workPermit
                                    )}
                                    onChange={(options: any) => {
                                      setFieldValue(
                                        "workPermit",
                                        options?.label
                                      );
                                    }}
                                    className={"dropstyle"}
                                    styles={customStyles}
                                  />
                                </div>
                              </div>

                              <div className="col-lg-12 col-md-12">
                                <div className="form-group">
                                  <label>Work Permit for Other Countries</label>
                                  <div className="multi-selector_box">
                                    <Select
                                      placeholder="Select Countries"
                                      isOptionDisabled={() => selectDisable}
                                      isMulti
                                      name="preferedLocation"
                                      maxMenuHeight={200}
                                      value={preferedLoc}
                                      options={options}
                                      className="dropstyle"
                                      styles={customStyles}
                                      onChange={(option) => {
                                        setPreferedLoc(option);

                                        setFieldValue(
                                          "preferedLocation",
                                          option
                                        );
                                        limitLocation(option);
                                      }}
                                    />
                                  </div>
                                  <div
                                    className="modal-custom-desc"
                                    style={{
                                      fontSize: "13px",
                                    }}
                                  >
                                    You can choose 3 countries at max
                                  </div>
                                </div>
                              </div>

                              <div className="col-lg-12 col-md-12">
                                <div className="form-group">
                                  <label>Permanent Address</label>
                                  <input
                                    maxLength={150}
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Your Permanent Address"
                                    ref={inputRef}
                                    onChange={handleChange}
                                    name="address"
                                    value={values.address}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="form-group">
                                  <label>Home Town</label>
                                  <input
                                    maxLength={25}
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Your Home Town"
                                    onChange={handleChange}
                                    name="town"
                                    value={values.town}
                                  />
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="form-group">
                                  <label>Pincode</label>
                                  <input
                                    maxLength={6}
                                    minLength={6}
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Your Pincode"
                                    onChange={(e: any) => {
                                      numReg.test(e.target.value) &&
                                        handleChange(e);
                                    }}
                                    name="pincode"
                                    value={values.pincode ? values.pincode : ""}
                                  />
                                </div>
                              </div>

                              <div className="col-lg-12 col-md-12">
                                <div className="form-group">
                                  <label>Language(s)</label>
                                  <br />
                                </div>
                                <div>
                                  {values?.language?.map(
                                    (lang: any, index: number) => {
                                      return (
                                        <Language
                                          key={index}
                                          value={lang}
                                          setFieldValue={setFieldValue}
                                          index={index}
                                          handleChange={handleChange}
                                          language={values?.language}
                                          error={errors?.language?.[index]}
                                          touched={touched}
                                          handleBlur={handleBlur}
                                          deleteHandler={deleteHandler}
                                          setFieldTouched={setFieldTouched}
                                          setFieldError={setFieldError}
                                        />
                                      );
                                    }
                                  )}
                                  {values.language.length < 5 ? (
                                    <label>
                                      <Link
                                        to={"#"}
                                        onClick={() => {
                                          setFieldError("name", "");
                                          setFieldValue(`language`, [
                                            ...values.language,
                                            {
                                              name: "",
                                              ability: [],
                                              level: "",
                                            },
                                          ]);
                                        }}
                                      >
                                        {values.language.length > 0
                                          ? "Add another Language"
                                          : "Add Language"}
                                      </Link>
                                    </label>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                            <div className="modal-custom-footer">
                              <button
                                type="button"
                                className="site-button site-warning-button"
                                onClick={() => {
                                  setPersonalDetails(false);
                                  setDisCheckbox(false);
                                  formik.resetForm();
                                  trigger && trigger(false);
                                  setMonthError(false);
                                  setDayError(false);
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

                  {hideDisContent && (
                    <div className="row">
                      <div className="col-lg-6 col-md-6 col-sm-6">
                        <div className="clearfix m-b20">
                          <span className="clearfix font-13">
                            Date of Birth
                          </span>
                          <>
                            <label>
                              {JobSeekerProfile?.js_profile?.profile &&
                              JobSeekerProfile?.js_profile?.profile?.dob ? (
                                displayDateOfBirth(
                                  JobSeekerProfile?.js_profile?.profile?.dob
                                )
                              ) : (
                                <>
                                  <Link
                                    to={"#"}
                                    onClick={(e: any) => {
                                      edithandler(e);
                                      setPersonalDetails(true);
                                    }}
                                  >
                                    Add Date of Birth
                                  </Link>
                                </>
                              )}
                            </label>
                          </>
                        </div>
                        <div className="clearfix m-b20">
                          <span className="clearfix font-13">Gender</span>
                          <label>
                            {JobSeekerProfile?.js_profile?.profile &&
                            JobSeekerProfile?.js_profile?.profile?.gender ? (
                              JobSeekerProfile?.js_profile?.profile &&
                              JobSeekerProfile?.js_profile?.profile?.gender
                            ) : (
                              <Link
                                to={"#"}
                                onClick={(e: any) => {
                                  edithandler(e);
                                  setPersonalDetails(true);
                                }}
                              >
                                Add Gender
                              </Link>
                            )}
                          </label>
                        </div>
                        <div className="clearfix m-b20">
                          <span className="clearfix font-13">
                            Marital Status
                          </span>
                          <label>
                            {JobSeekerProfile?.js_profile?.profile &&
                            JobSeekerProfile?.js_profile?.profile
                              .marital_status ? (
                              JobSeekerProfile?.js_profile?.profile
                                .marital_status
                            ) : (
                              <Link
                                to={"#"}
                                onClick={(e: any) => {
                                  edithandler(e);
                                  setPersonalDetails(true);
                                }}
                              >
                                Add Marital Status
                              </Link>
                            )}
                          </label>
                        </div>
                        <div className="clearfix m-b20">
                          <span className="clearfix font-13">Category</span>
                          <label>
                            {JobSeekerProfile?.js_profile?.profile &&
                            JobSeekerProfile?.js_profile?.profile.category ? (
                              JobSeekerProfile?.js_profile?.profile.category
                            ) : (
                              <Link
                                to={"#"}
                                onClick={(e: any) => {
                                  edithandler(e);
                                  setPersonalDetails(true);
                                }}
                              >
                                Add Category
                              </Link>
                            )}
                          </label>
                        </div>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-6">
                        <div className="clearfix m-b20">
                          <span className="clearfix font-13">Career Break</span>
                          <label>
                            {JobSeekerProfile?.js_profile?.profile ? (
                              GetCareerBreakTime(
                                JobSeekerProfile?.js_profile?.career_profile
                                  ?.career_break?.reason,
                                JobSeekerProfile?.js_profile?.career_profile
                                  ?.career_break?.from_ts,
                                JobSeekerProfile?.js_profile?.career_profile
                                  ?.career_break?.till_ts
                              )
                            ) : (
                              <Link
                                to={"#"}
                                onClick={(e: any) => {
                                  edithandler(e);
                                  setPersonalDetails(true);
                                }}
                              >
                                Add Career Break
                              </Link>
                            )}
                          </label>
                        </div>

                        <div className="clearfix m-b20">
                          <span className="clearfix font-13">
                            Differently Abled
                          </span>
                          <label>
                            {JobSeekerProfile?.js_profile ? (
                              JobSeekerProfile?.js_profile?.profile
                                ?.disability_type ? (
                                `Yes, ${JobSeekerProfile?.js_profile?.profile?.disability_type}`
                              ) : (
                                "No"
                              )
                            ) : (
                              <Link
                                to={"#"}
                                onClick={(e: any) => {
                                  edithandler(e);
                                  setPersonalDetails(true);
                                }}
                              >
                                Add Differently Abled
                              </Link>
                            )}
                          </label>
                        </div>
                        <div className="clearfix m-b20">
                          <span className="clearfix font-13">Work Permit</span>
                          <label>
                            {JobSeekerProfile?.js_profile?.career_profile &&
                            JobSeekerProfile?.js_profile?.career_profile
                              ?.work_permit &&
                            JobSeekerProfile?.js_profile?.career_profile
                              ?.work_permitOC &&
                            (JobSeekerProfile?.js_profile?.career_profile
                              ?.work_permit ||
                              JobSeekerProfile?.js_profile?.career_profile
                                ?.work_permitOC) ? (
                              <>
                                <span>
                                  {
                                    JobSeekerProfile?.js_profile?.career_profile
                                      .work_permit
                                  }
                                </span>
                                <br />
                                <span>
                                  {JobSeekerProfile?.js_profile?.career_profile.work_permitOC
                                    .map((item: any) => {
                                      return `${item}`;
                                    })
                                    .join(", ")}
                                </span>
                              </>
                            ) : (
                              <Link
                                to={"#"}
                                onClick={(e: any) => {
                                  edithandler(e);
                                  setPersonalDetails(true);
                                }}
                              >
                                Add Work Permit
                              </Link>
                            )}
                          </label>
                        </div>
                        <div className="clearfix m-b20">
                          <span className="clearfix font-13">Address</span>
                          <label>
                            {JobSeekerProfile?.js_profile?.profile &&
                            JobSeekerProfile?.js_profile.profile?.address &&
                            (JobSeekerProfile?.js_profile.profile?.address[0]
                              ?.street ||
                              JobSeekerProfile?.js_profile.profile?.address[0]
                                ?.city ||
                              JobSeekerProfile?.js_profile.profile?.address[0]
                                ?.zip) ? (
                              <>
                                <span>
                                  {JobSeekerProfile?.js_profile.profile
                                    .address &&
                                    JobSeekerProfile?.js_profile.profile.address.map(
                                      (addr: any) => {
                                        return (
                                          <span>
                                            {`${addr.street}, ${addr.city}`}
                                            <br />
                                            <span>{`${
                                              addr.zip === 0 ? "" : addr.zip
                                            }`}</span>
                                          </span>
                                        );
                                      }
                                    )}
                                </span>
                              </>
                            ) : (
                              <Link
                                to={"#"}
                                onClick={(e: any) => {
                                  edithandler(e);
                                  setPersonalDetails(true);
                                  handleClick();
                                }}
                              >
                                Add Address
                              </Link>
                            )}
                          </label>
                        </div>
                      </div>

                      <div className="col-lg-12 col-md-12 col-sm-12">
                        <div className="clearfix m-b20">
                          <span className="clearfix font-13">Languages</span>
                          {JobSeekerProfile?.js_profile?.languages?.length >
                          0 ? (
                            <>
                              <table className="table table-sm">
                                <thead>
                                  <tr
                                    style={{
                                      fontSize: "13px",
                                    }}
                                  >
                                    <th scope="col">Language</th>
                                    <th scope="col">Proficiency</th>
                                    <th scope="col">Read</th>
                                    <th scope="col">Write</th>
                                    <th scope="col">Speak</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {JobSeekerProfile?.js_profile?.languages?.map(
                                    (val: any) => {
                                      if (val.name === "") {
                                        return "";
                                      } else {
                                        return (
                                          <>
                                            <tr
                                              style={{
                                                fontSize: "14px",
                                              }}
                                            >
                                              <td scope="row">{val.name}</td>
                                              <td>{val.level}</td>
                                              <td>
                                                {val.ability.includes(
                                                  "Read"
                                                ) ? (
                                                  <span
                                                    id="boot-icon"
                                                    className="bi bi-check"
                                                    style={{
                                                      fontSize: "10 rem",
                                                      color: "rgb(0, 128, 55)",
                                                    }}
                                                  >
                                                    {" "}
                                                    <TiTick />
                                                  </span>
                                                ) : (
                                                  <span
                                                    id="boot-icon"
                                                    className="bi bi-x"
                                                    style={{
                                                      fontSize: "10 rem",
                                                      color: "rgb(255, 0, 0)",
                                                    }}
                                                  >
                                                    <RxCross2 />
                                                  </span>
                                                )}
                                              </td>
                                              <td>
                                                {val.ability.includes(
                                                  "Write"
                                                ) ? (
                                                  <span
                                                    id="boot-icon"
                                                    className="bi bi-check"
                                                    style={{
                                                      fontSize: "10 rem",
                                                      color: "rgb(0, 128, 55)",
                                                    }}
                                                  >
                                                    {" "}
                                                    <TiTick />
                                                  </span>
                                                ) : (
                                                  <span
                                                    id="boot-icon"
                                                    className="bi bi-x"
                                                    style={{
                                                      fontSize: "10 rem",
                                                      color: "rgb(255, 0, 0)",
                                                    }}
                                                  >
                                                    <RxCross2 />
                                                  </span>
                                                )}
                                              </td>
                                              <td>
                                                {val.ability.includes(
                                                  "Speak"
                                                ) ? (
                                                  <span
                                                    id="boot-icon"
                                                    className="bi bi-check"
                                                    style={{
                                                      fontSize: "10 rem",
                                                      color: "rgb(0, 128, 55)",
                                                    }}
                                                  >
                                                    {" "}
                                                    <TiTick />
                                                  </span>
                                                ) : (
                                                  <span
                                                    id="boot-icon"
                                                    className="bi bi-x"
                                                    style={{
                                                      fontSize: "10 rem",
                                                      color: "rgb(255, 0, 0)",
                                                    }}
                                                  >
                                                    <RxCross2 />
                                                  </span>
                                                )}
                                              </td>
                                            </tr>
                                          </>
                                        );
                                      }
                                    }
                                  )}
                                </tbody>
                              </table>
                            </>
                          ) : (
                            <label>
                              <Link
                                to={"#"}
                                onClick={(e: any) => {
                                  edithandler(e);
                                  setPersonalDetails(true);
                                  handleClick();
                                }}
                              >
                                Add Language
                              </Link>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            );
          }}
        </Formik>
      </>
    </>
  );
}

export default PersonalDetails;
