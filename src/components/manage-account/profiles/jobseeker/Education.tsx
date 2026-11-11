import React, { useEffect, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { environment } from "../../../../environments/environment";
import { useDispatch, useSelector } from "react-redux";
import { UseToastAlert } from "../../../../hooks/useToastAlert";
import { getJobSeekerrData } from "../../../../redux/features/manage-account/profile/JsSlice";

import Select from "react-select";
import {
    createData,
    createDataWithId,
    customStyles,
    GetPastYears,
} from "../../../../common/common";
import { values } from "lodash";
import { BsFillTrashFill, BsPencil } from "react-icons/bs";

import Swal from "sweetalert2";
import { jobSeekerprofile } from "../../../../redux/features/manage-account/profile/JobSeekerProfileSlice";
import AsyncCreatableSelect from "react-select/async-creatable";
import { specializationMasterData } from "../../../../ApiCall/masterData";
import CreatableSelect from "react-select/creatable";
import { profileStrength } from "../../../../redux/features/manage-account/profile/BasicDetailsSlice";
import {
    deleteEducationDetails,
    postEducationDetails,
    resetEducationPost,
} from "../../../../redux/features/manage-account/profile/EducationSlice";
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
    Education: Yup.object().required("Please specify Education.").nullable(),
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
    Specialization: Yup.string().when("Education", {
        is: (Education: option) =>
            Education?.label !== "10th" &&
            Education?.label !== "12th" &&
            Education?.label !== "Below 10th",
        then: Yup.string().nullable().required("Please select Specialization."),
    }),
    OtherSpecialization: Yup.string().when("Specialization", {
        is: "Other",
        then: Yup.string()
            .required("Please specify Specialization.")
            .trim("Empty space not allowed.")

            .max(50)
            .matches(
                /^[a-zA-Z0-9&'.,()-@\s]{1,70}$/,
                "special characters other than &,.'()-@ are not allowed."
            ),
    }),
    CourseType: Yup.string().notRequired(),
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
            is: "Scale 4 Grading System",
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
        .matches(
            /^(0|[1-9][0-9]?|100)$/,
            "The Marks should lie between 1 to 100."
        ),
    EnglishMarks: Yup.string()
        .trim("Empty space not allowed")
        .matches(
            /^(0|[1-9][0-9]?|100)$/,
            "The Marks should lie between 1 to 100."
        ),
});

type propsState = {
    displayModel?: boolean;
    trigger?: any;
};

function Education({ displayModel, trigger }: propsState) {
    const components = {
        DropdownIndicator: null,
    };
    const numReg = new RegExp(/^\d*\.?\d*$/);
    const [education, setEducation] = useState(false);
    const handleHideEducation = () => {
        setEducation(false);
    };
    const [displaymarkInput, setDisplaymarkInput] = useState(false);
    const [display12thinput, setDisplay12thinput] = useState(false);
    const [educationList, setEducationList] = useState<any>(null);
    const dispatch = useDispatch();
    const showSnackAlert = UseToastAlert();
    const educationx = useSelector((state: any) => state.EducationPostx);
    const { PostEducation, Postloading } = educationx;
    const educationdelete = useSelector((state: any) => state.EducationDeletex);
    const { EducationDelete, loadingDelete } = educationdelete;
    const institutes = useSelector((state: any) => state.institue);
    const pflStrength = useSelector((state: any) => state.profileStrength);

    const { universityData, universityloading } = institutes;

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

    useEffect(() => {
        if (displayModel == true) {
            setEducation(true);
            setHideEducationContent(false);
        } else {
            setHideEducationContent(true);
        }
    }, [displayModel]);

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
        if (PostEducation) {
            if (PostEducation.code == 200 && !Postloading)
                showSnackAlert("success", PostEducation.message);
            educationEvent = null;
            dispatch(getJobSeekerrData());
            dispatch(resetEducationPost());
            dispatch(profileStrength());
            if (PostEducation.code == 206)
                showSnackAlert("warning", PostEducation.message);
        }
    }, [PostEducation.code, Postloading]);

    useEffect(() => {
        if (EducationDelete) {
            if (EducationDelete.code == 200 && !loadingDelete)
                showSnackAlert("success", EducationDelete.message);
            educationEvent = null;
            dispatch(getJobSeekerrData());
            dispatch(resetEducationPost());
            dispatch(profileStrength());
            if (EducationDelete.code == 206)
                showSnackAlert("warning", EducationDelete.message);
        }
    }, [EducationDelete.code, loadingDelete]);

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

    useEffect(() => {
        if (JobSeekerProfile?.js_profile?.education) {
            setEducationList(JobSeekerProfile?.js_profile?.education);
            const filte = educationList?.schools?.filter(
                (val: any) => val?.course === "10th"
            );
            if (filte?.length == 0) {
                const eduArray = educationtData?.findIndex((val: any) => {
                    return val?.label == "10th";
                });
                if (eduArray == -1) {
                    educationtData?.push({ label: "10th", value: "10th" });
                }
                setEducationData(educationtData);
            } else {
                setEducationData(educationtData);
            }
            const filte2 = educationList?.schools?.filter(
                (val: any) => val?.course === "12th"
            );
            if (filte2?.length == 0) {
                const eduArray = educationtData?.findIndex((val: any) => {
                    return val?.label == "12th";
                });
                if (eduArray == -1) {
                    educationtData?.push({ label: "12th", value: "12th" });
                }
                setEducationData(educationtData);
            } else {
                setEducationData(educationtData);
            }
            if (
                educationList?.degree?.length == 0 &&
                educationList?.schools?.length == 0
            ) {
                const eduArray = educationtData?.findIndex((val: any) => {
                    return val?.label == "Below 10th";
                });
                if (eduArray == -1) {
                    educationtData?.push({
                        label: "Below 10th",
                        value: "Below 10th",
                    });
                }
                setEducationData(educationtData);
            } else {
                setEducationData(educationtData);
            }
        }
        deleteBtnHandler();
    }, [JobSeekerProfile?.js_profile?.education, eduData]);
    const [eduDegree, setEduDegree] = useState<any>([]);
    useEffect(() => {
        if (JobSeekerProfile?.js_profile?.education?.schools?.length > 1) {
            let data: any[] = [
                ...JobSeekerProfile?.js_profile?.education?.schools,
            ];
            data.sort((a: any, b: any) => {
                return b.completion_year - a.completion_year;
            });
            setEduData(data);
        } else {
            setEduData(JobSeekerProfile?.js_profile?.education?.schools);
        }
        if (JobSeekerProfile?.js_profile?.education?.length > 1) {
            let degree: any[] = [
                ...JobSeekerProfile?.js_profile?.education?.degree,
            ];
            degree.sort((a: any, b: any) => {
                return b.completion_year - a.completion_year;
            });
            setEduDegree(degree);
        } else {
            setEduDegree(JobSeekerProfile?.js_profile?.education?.degree);
        }
    }, [deleteBtnDis, displayCheckbox, JobSeekerProfile]);

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
    const handleConfirmSwal = (values: any) => {
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
                dispatch(deleteEducationDetails(values.id));
                setEditValue(null);
                handleClear();
                setEducation(false);
                setForcerender(true);

                setEditValue(null);
            } else {
                setEducation(false);
                setEditValue(null);
            }
        });
    };

    const yearmonthData = useSelector(
        (state: any) => state.yearmonthMasterdata
    );
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
                            yearData.push({
                                value: `${item}`,
                                label: `${item}`,
                            });
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

    useEffect(() => { }, [yearData]);

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

    useEffect(() => { }, [educationtData, GradingSystem]);

    const [edu, setEdu] = useState<any>();

    const setCourseOptions = (edu: any) => {
        if (JSMasterData) {
            JSMasterData.map((opt: any) => {
                if (opt.group === "DPHD" && edu?.label == "Doctorate/PhD") {
                    const obj: any = createDataWithId(opt.data, true);
                    setCourseData(obj);
                }
                if (
                    opt.group === "MAPG" &&
                    edu?.label == "Masters/Post-Graduation"
                ) {
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
                if (
                    opt.group === "BAUG" &&
                    edu &&
                    edu?.label == "Diploma/Graduation"
                ) {
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
                (val: any) => val?.course === "10th"
            );
            if (filte?.length > 0) {
                setTen(false);
            } else {
                setTen(true);
            }
            const filter = educationList?.schools?.filter(
                (val: any) => val?.course === "12th"
            );
            if (filter?.length > 0) {
                setTwelve(false);
            } else {
                setTwelve(true);
            }
            const filterPhd = educationList?.degree?.filter(
                (val: any) => val?.edu_type === "Doctorate/PhD"
            );
            if (filterPhd?.length > 0) {
                setDocPhd(false);
            } else {
                setDocPhd(true);
            }
            const filterMasters = educationList?.degree?.filter(
                (val: any) => val?.edu_type === "Masters/Post-Graduation"
            );
            if (filterMasters?.length > 0) {
                setMasters(false);
            } else {
                setMasters(true);
            }
            const filterGraduation = educationList?.degree?.filter(
                (val: any) => val?.edu_type === "Batchelor/Under-Graduation"
            );
            if (filterGraduation?.length > 0) {
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
    const handleBindData = (e: any, bindData: any) => {
        e.preventDefault();

        setDis(true);
        const obj: any = {
            UniversityInstitute: bindData.institute
                ? { label: bindData.institute, value: bindData.institute }
                : "",
            CourseType: bindData.course_type ? bindData.course_type : "",
            CourseDurationStart: bindData.start_year ? bindData.start_year : "",
            GradingSystem: bindData.grade ? bindData.grade : "",
            checkbox: "true",
            Board: bindData.board ? bindData.board : "",

            SchoolMedium: bindData.medium ? bindData.medium : "",

            EnglishMarks: bindData.eng_marks
                ? bindData.eng_marks.toString()
                : "",
            MathsMarks: bindData.math_marks
                ? bindData.math_marks.toString()
                : "",

            id: bindData._id,
        };
        if (
            bindData.course == "10th" ||
            bindData.course == "12th" ||
            bindData.course == "Below 10th"
        ) {
            obj.Education = { label: bindData.course, value: bindData.course };
            obj.CourseDurationEnd = "";
            obj.PassingOutYear = bindData.completion_year;
            obj.Marks = "";
            obj.TotalMarks = bindData.marks;
        } else {
            obj.Education = {
                label: bindData.edu_type,
                value: bindData.edu_type,
            };
            obj.CourseDurationEnd = bindData.completion_year;
            obj.PassingOutYear = "";
            obj.Marks = bindData.marks === null ? "" : bindData.marks;
            obj.TotalMarks = "";

            setCourseOptions({
                label: bindData.edu_type,
                value: bindData.edu_type,
            });
        }

        if (
            bindData.course != "10th" ||
            bindData.course != "12th" ||
            bindData.course != "Below 10th"
        ) {
            let Edu = educationtData.filter(
                (val: any) => val.label === obj.Education
            );
            let eduobject = Edu[0];
            setEdu(eduobject);

            if (bindData?.course.toLowerCase().includes("other")) {
                obj.Course = { value: "Other", label: "Other" };
                obj.OtherCourse = bindData.course;
            } else {
                obj.Course = { value: bindData.course, label: bindData.course };
                obj.OtherCourse = "";
            }

            const findCourse = courseArr.filter((val: any) => {
                return val?.label == bindData.course;
            });

            if (findCourse?.length > 0) {
                filterColors(findCourse[0]?.value);
            }
            //  filterColors("");
            setSpecial({ value: bindData.stream, label: bindData.stream });
            obj.Specialization = bindData.stream;
            obj.OtherSpecialization = "";
        }

        obj.TotalMarks
            ? setTmarks({ value: obj.TotalMarks, label: obj.TotalMarks })
            : setTmarks(null);
        obj.SchoolMedium
            ? setMedium({ value: obj.SchoolMedium, label: obj.SchoolMedium })
            : setMedium(null);
        obj.PassingOutYear
            ? setSchoolPassing({
                value: String(obj.PassingOutYear),
                label: String(obj.PassingOutYear),
            })
            : setSchoolPassing(null);
        obj.Board
            ? setSchool({ value: obj.Board, label: obj.Board })
            : setSchool(null);
        obj.GradingSystem
            ? setGrading({ value: obj.GradingSystem, label: obj.GradingSystem })
            : setGrading(null);
        obj.CourseDurationEnd
            ? setCourseEnd({
                value: String(obj.CourseDurationEnd),
                label: String(obj.CourseDurationEnd),
            })
            : setCourseEnd(null);
        obj.CourseDurationStart
            ? setCourseStart({
                value: String(obj.CourseDurationStart),
                label: String(obj.CourseDurationStart),
            })
            : setCourseStart(null);

        if (
            obj.Education == "10th" ||
            obj.Education == "12th" ||
            bindData.course == "Below 10th"
        ) {
            obj.Course = "";
            obj.OtherCourse = "";
            obj.Specialization = "";
            obj.OtherSpecialization = "";
            setCourse(null);
        }

        setEditValue(obj);
    };

    const [erro, setError] = useState(false);
    const validating = (values: educationtype) => {
        if (values.CourseDurationStart && values.CourseDurationEnd) {
            if (
                Number(values.CourseDurationStart) >
                Number(values.CourseDurationEnd)
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
        setInputValue(
            newValue.replace(/[^a-zA-Z0-9. , - _ ’ ' & ()\ @ \s]*$/, "")
        );
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
                            values?.Education?.label == "Below 10th"
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
                                schoolMedium: values.SchoolMedium
                                    ? values.SchoolMedium
                                    : null,
                                totalMarks: values.TotalMarks
                                    ? values.TotalMarks
                                    : null,
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
                                universityInstitute:
                                    values.UniversityInstitute?.label,
                                course:
                                    values.Course !== "Other"
                                        ? values.Course
                                        : values.OtherCourse,
                                specialization:
                                    values.Specialization !== "Other"
                                        ? values.Specialization
                                        : values.OtherSpecialization,
                                courseType: values.CourseType,
                                courseDurationStart: Number(
                                    values.CourseDurationStart
                                ),
                                courseDurationEnd: Number(
                                    values.CourseDurationEnd
                                ),
                                gradingSystem: values.GradingSystem
                                    ? values.GradingSystem
                                    : null,
                                marks: values.Marks
                                    ? Number(values.Marks)
                                    : null,
                            };
                            const crc: any = values.Course;
                            intigrData.course =
                                crc?.label !== "Other"
                                    ? crc?.label
                                    : values.OtherCourse;
                            if (
                                intigrData.gradingSystem ==
                                "Course Requires a Pass"
                            ) {
                                intigrData.marks = null;
                            }
                            dispatch(postEducationDetails(intigrData));
                        }

                        if (editvalue) {
                            if (
                                editvalue?.Education?.label == "10th" ||
                                editvalue?.Education?.label == "12th" ||
                                editvalue?.Education?.label == "Below 10th"
                            ) {
                                const intigrData = {
                                    educationid: values.id ? values.id : null,
                                    type: "school",
                                    education: values?.Education?.label,
                                    board: values.Board,
                                    passingOutYear: Number(
                                        values.PassingOutYear
                                    ),
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
                                    universityInstitute:
                                        values.UniversityInstitute,
                                    course:
                                        values.Course !== "Other"
                                            ? values.Course
                                            : values.OtherCourse,
                                    specialization:
                                        values.Specialization !== "Other"
                                            ? values.Specialization
                                            : values.OtherSpecialization,
                                    courseType: values.CourseType,
                                    courseDurationStart: Number(
                                        values.CourseDurationStart
                                    ),
                                    courseDurationEnd: Number(
                                        values.CourseDurationEnd
                                    ),
                                    gradingSystem: values.GradingSystem
                                        ? values.GradingSystem
                                        : null,
                                    marks: values.Marks
                                        ? Number(values.Marks)
                                        : null,
                                };
                                if (
                                    intigrData.gradingSystem ==
                                    "Course Requires a Pass"
                                ) {
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
                            <Modal
                                className="modal fade browse-job modal-bx-info editor"
                                backdrop="static"
                                show={education}
                                onHide={() => {
                                    handleHideEducation();
                                    setEditValue(null);
                                    resetForm();
                                    handleClear();
                                    trigger && trigger(false);
                                }}
                            >
                                <div
                                    className="modal-dialog my-0"
                                    role="document"
                                    style={{ width: "100%" }}
                                >
                                    <div
                                        className="modal-content"
                                        style={{ width: "100%" }}
                                    >
                                        <div
                                            className="modal-body"
                                            style={{ width: "100%" }}
                                        >
                                            <div className="modal-custom-header">
                                                <h5
                                                    className="modal-title"
                                                    id="EducationModalLongTitle"
                                                >
                                                    {values?.Education?.label
                                                        ? `Education-${values?.Education?.label}`
                                                        : "Education"}
                                                </h5>
                                                {deleteBtnDis && (
                                                    <button
                                                        className="btn btn-sm btn-danger d-block d-md-inline-block mr-md-2 mb-2 mb-md-0 ml-auto"
                                                        type="button"
                                                        title="Delete"
                                                        onClick={() => {
                                                            handleConfirmSwal(
                                                                values
                                                            );
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    className="close"
                                                    onClick={() => {
                                                        setEducation(false);
                                                        resetForm();
                                                        handleClear();
                                                        setEditValue(null);
                                                        deleteBtnHandler();
                                                        setError(false);
                                                        trigger &&
                                                            trigger(false);
                                                    }}
                                                >
                                                    <span aria-hidden="true">
                                                        &times;
                                                    </span>
                                                </button>
                                            </div>
                                            <form onSubmit={handleSubmit}>
                                                <div className="row">
                                                    <div className="col-lg-12 col-md-12">
                                                        <div>
                                                            <div
                                                                className="form-group"
                                                                style={{
                                                                    width: "100%",
                                                                }}
                                                            >
                                                                <label>
                                                                    Education
                                                                </label>
                                                                <span
                                                                    style={{
                                                                        color: "red",
                                                                    }}
                                                                >
                                                                    {" "}
                                                                    *
                                                                </span>

                                                                <Select
                                                                    placeholder="Select Education"
                                                                    isDisabled={
                                                                        isDisabled
                                                                    }
                                                                    name="Education"
                                                                    value={
                                                                        values.Education
                                                                    }
                                                                    onChange={(
                                                                        option: any
                                                                    ) => {
                                                                        let event =
                                                                        {
                                                                            target: {
                                                                                name: "Education",
                                                                                value: option,
                                                                            },
                                                                        };
                                                                        educationEvent =
                                                                            option;
                                                                        handleChange(
                                                                            event
                                                                        );
                                                                        handleClear();

                                                                        setSpecial(
                                                                            null
                                                                        );
                                                                        setCourse(
                                                                            null
                                                                        );
                                                                        setFieldValue(
                                                                            "Course",
                                                                            ""
                                                                        );
                                                                        setFieldValue(
                                                                            "Specialization",
                                                                            ""
                                                                        );
                                                                        if (
                                                                            option ==
                                                                            null
                                                                        ) {
                                                                            setFieldValue(
                                                                                "Course",
                                                                                ""
                                                                            );
                                                                            setFieldValue(
                                                                                "Specialization",
                                                                                ""
                                                                            );
                                                                        }
                                                                        if (
                                                                            option?.label
                                                                        ) {
                                                                            handle12thInput(
                                                                                option?.label
                                                                            );
                                                                        }
                                                                        setCourseOptions(
                                                                            option
                                                                        );
                                                                    }}
                                                                    isClearable={
                                                                        true
                                                                    }
                                                                    isSearchable={
                                                                        true
                                                                    }
                                                                    options={
                                                                        educationtData
                                                                    }
                                                                    className={
                                                                        "dropstyle"
                                                                    }
                                                                    styles={
                                                                        customStyles
                                                                    }
                                                                />

                                                                {errors?.Education &&
                                                                    touched.Education &&
                                                                    educationEvent ===
                                                                    null ? (
                                                                    <>
                                                                        <span className="form-error">
                                                                            {
                                                                                errors.Education
                                                                            }
                                                                        </span>
                                                                    </>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {!(
                                                        values?.Education
                                                            ?.label == "10th" ||
                                                        values?.Education
                                                            ?.label == "12th" ||
                                                        values?.Education
                                                            ?.label ==
                                                        "Below 10th"
                                                    ) && (
                                                            <div
                                                                style={{
                                                                    width: "100%",
                                                                }}
                                                            >
                                                                <div className="col-lg-12 col-md-12">
                                                                    <div className="form-group">
                                                                        <label>
                                                                            University/Institute
                                                                        </label>
                                                                        <span
                                                                            style={{
                                                                                color: "red",
                                                                            }}
                                                                        >
                                                                            {" "}
                                                                            *
                                                                        </span>
                                                                        <AsyncCreatableSelect
                                                                            name="UniversityInstitute"
                                                                            components={
                                                                                components
                                                                            }
                                                                            maxMenuHeight={
                                                                                200
                                                                            }
                                                                            cacheOptions
                                                                            isClearable={
                                                                                true
                                                                            }
                                                                            noOptionsMessage={() => "Enter keyword to search"}
                                                                            styles={
                                                                                customStyles
                                                                            }
                                                                            value={
                                                                                values.UniversityInstitute
                                                                            }
                                                                            onChange={(
                                                                                e: any
                                                                            ) => {
                                                                                let event =
                                                                                {
                                                                                    target: {
                                                                                        name: "UniversityInstitute",
                                                                                        value: e,
                                                                                    },
                                                                                };
                                                                                handleChange(
                                                                                    event
                                                                                );
                                                                            }}
                                                                            className={`${errors.UniversityInstitute &&
                                                                                    touched.UniversityInstitute
                                                                                    ? "input-error dropstyle"
                                                                                    : "dropstyle"
                                                                                }`}
                                                                            placeholder="Select University/Institute"
                                                                            loadOptions={
                                                                                promiseOptions
                                                                            }
                                                                            onInputChange={
                                                                                handleInputInstitute
                                                                            }
                                                                            inputValue={
                                                                                inputValue
                                                                            }
                                                                        />
                                                                        {
                                                                            <span className="form-error">
                                                                                {errors?.UniversityInstitute &&
                                                                                    touched.UniversityInstitute && (
                                                                                        <>
                                                                                            {Object.values(
                                                                                                errors.UniversityInstitute
                                                                                            ).map(
                                                                                                (
                                                                                                    error,
                                                                                                    index
                                                                                                ) => (
                                                                                                    <span
                                                                                                        key={
                                                                                                            index
                                                                                                        }
                                                                                                    >
                                                                                                        {
                                                                                                            error
                                                                                                        }
                                                                                                    </span>
                                                                                                )
                                                                                            )}
                                                                                        </>
                                                                                    )}
                                                                            </span>
                                                                        }
                                                                    </div>
                                                                </div>

                                                                <div className="col-lg-12 col-md-12">
                                                                    <div className="form-group">
                                                                        <label>
                                                                            Course
                                                                        </label>
                                                                        <span
                                                                            style={{
                                                                                color: "red",
                                                                            }}
                                                                        >
                                                                            {" "}
                                                                            *
                                                                        </span>

                                                                        <CreatableSelect
                                                                            placeholder="Select Course"
                                                                            value={
                                                                                values.Course
                                                                            }
                                                                            name="Course"
                                                                            onBlur={
                                                                                handleBlur
                                                                            }
                                                                            styles={
                                                                                customStyles
                                                                            }
                                                                            onChange={(
                                                                                option: any
                                                                            ) => {
                                                                                handleCrse(
                                                                                    option
                                                                                );
                                                                                setFieldValue(
                                                                                    "OtherCourse",
                                                                                    ""
                                                                                );
                                                                                setFieldValue(
                                                                                    "Course",
                                                                                    option?.value
                                                                                );
                                                                                setFieldValue(
                                                                                    "Specialization",
                                                                                    ""
                                                                                );
                                                                                if (
                                                                                    option ==
                                                                                    null
                                                                                ) {
                                                                                    setFieldValue(
                                                                                        "Course",
                                                                                        ""
                                                                                    );
                                                                                }
                                                                                let event =
                                                                                {
                                                                                    target: {
                                                                                        name: "Course",
                                                                                        value: option,
                                                                                    },
                                                                                };
                                                                                handleChange(
                                                                                    event
                                                                                );
                                                                                setSpecial(
                                                                                    null
                                                                                );

                                                                                if (
                                                                                    option?.value
                                                                                )
                                                                                    if (
                                                                                        option ==
                                                                                        null
                                                                                    ) {
                                                                                        setFieldValue(
                                                                                            "Course",
                                                                                            ""
                                                                                        );

                                                                                        touched.Course =
                                                                                            true;
                                                                                    }

                                                                                filterColors(
                                                                                    event
                                                                                        ?.target
                                                                                        ?.value
                                                                                        ?.value
                                                                                );
                                                                            }}
                                                                            isClearable={
                                                                                true
                                                                            }
                                                                            isSearchable={
                                                                                true
                                                                            }
                                                                            options={
                                                                                courseArr
                                                                            }
                                                                            className={
                                                                                "dropstyle"
                                                                            }
                                                                            maxMenuHeight={
                                                                                200
                                                                            }
                                                                        />
                                                                        {errors.Course &&
                                                                            touched.Course && (
                                                                                <span className="form-error">
                                                                                    {
                                                                                        errors.Course
                                                                                    }
                                                                                </span>
                                                                            )}
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-12 col-md-12">
                                                                    <div className="form-group">
                                                                        {values.Course ==
                                                                            "Other" && (
                                                                                <div>
                                                                                    {" "}
                                                                                    <input
                                                                                        type="text"
                                                                                        maxLength={
                                                                                            150
                                                                                        }
                                                                                        onBlur={
                                                                                            handleBlur
                                                                                        }
                                                                                        value={
                                                                                            values.OtherCourse
                                                                                        }
                                                                                        onChange={
                                                                                            handleChange
                                                                                        }
                                                                                        name="OtherCourse"
                                                                                        className={`form-control ${errors.OtherCourse &&
                                                                                                touched.OtherCourse
                                                                                                ? "input-error"
                                                                                                : ""
                                                                                            }`}
                                                                                        placeholder="Enter Course"
                                                                                    />
                                                                                    {errors.OtherCourse &&
                                                                                        touched.OtherCourse && (
                                                                                            <span className="form-error">
                                                                                                {
                                                                                                    errors.OtherCourse
                                                                                                }
                                                                                            </span>
                                                                                        )}
                                                                                </div>
                                                                            )}
                                                                    </div>
                                                                </div>

                                                                <div className="col-lg-12 col-md-12">
                                                                    <div className="form-group">
                                                                        <label>
                                                                            Specialization
                                                                        </label>
                                                                        <span
                                                                            style={{
                                                                                color: "red",
                                                                            }}
                                                                        >
                                                                            {" "}
                                                                            *
                                                                        </span>

                                                                        <CreatableSelect
                                                                            placeholder="Select specialization"
                                                                            value={
                                                                                special
                                                                            }
                                                                            name="Specialization"
                                                                            onBlur={
                                                                                handleBlur
                                                                            }
                                                                            onChange={(
                                                                                option: any
                                                                            ) => {
                                                                                handleSpec(
                                                                                    option
                                                                                );

                                                                                setFieldValue(
                                                                                    "OtherSpecialization",
                                                                                    ""
                                                                                );
                                                                                setFieldValue(
                                                                                    "Specialization",
                                                                                    option?.value
                                                                                );
                                                                                if (
                                                                                    option ==
                                                                                    null
                                                                                ) {
                                                                                    touched.Specialization =
                                                                                        true;
                                                                                    setFieldValue(
                                                                                        "Specialization",
                                                                                        ""
                                                                                    );
                                                                                }
                                                                            }}
                                                                            isClearable={
                                                                                true
                                                                            }
                                                                            isSearchable={
                                                                                true
                                                                            }
                                                                            options={
                                                                                specializationData
                                                                            }
                                                                            className={
                                                                                "dropstyle"
                                                                            }
                                                                            styles={
                                                                                customStyles
                                                                            }
                                                                            maxMenuHeight={
                                                                                200
                                                                            }
                                                                        />
                                                                        {errors.Specialization &&
                                                                            touched.Specialization && (
                                                                                <span className="form-error">
                                                                                    {
                                                                                        errors.Specialization
                                                                                    }
                                                                                </span>
                                                                            )}
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-12 col-md-12">
                                                                    <div className="form-group">
                                                                        {values.Specialization ==
                                                                            "Other" && (
                                                                                <div>
                                                                                    {" "}
                                                                                    <input
                                                                                        type="text"
                                                                                        value={
                                                                                            values.OtherSpecialization
                                                                                        }
                                                                                        onBlur={
                                                                                            handleBlur
                                                                                        }
                                                                                        maxLength={
                                                                                            150
                                                                                        }
                                                                                        onChange={
                                                                                            handleChange
                                                                                        }
                                                                                        name="OtherSpecialization"
                                                                                        className={`form-control ${errors.OtherSpecialization &&
                                                                                                touched.OtherSpecialization
                                                                                                ? "input-error"
                                                                                                : ""
                                                                                            }`}
                                                                                        placeholder="Enter Specialization"
                                                                                    />
                                                                                    {errors.OtherSpecialization &&
                                                                                        touched.OtherSpecialization && (
                                                                                            <span className="form-error">
                                                                                                {
                                                                                                    errors.OtherSpecialization
                                                                                                }
                                                                                            </span>
                                                                                        )}
                                                                                </div>
                                                                            )}
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-12 col-md-12">
                                                                    <div className="form-group">
                                                                        <label>
                                                                            Course
                                                                            Type
                                                                        </label>
                                                                        <span
                                                                            style={{
                                                                                color: "red",
                                                                            }}
                                                                        >
                                                                            {" "}
                                                                            *
                                                                        </span>

                                                                        <div
                                                                            style={{
                                                                                display:
                                                                                    "flex",
                                                                                justifyContent:
                                                                                    "space-between",
                                                                            }}
                                                                        >
                                                                            <div className="form-check form-check-inline ">
                                                                                <input
                                                                                    className="form-check-input"
                                                                                    type="radio"
                                                                                    checked={
                                                                                        values.CourseType ==
                                                                                        "Full Time"
                                                                                    }
                                                                                    value="Full Time"
                                                                                    name="CourseType"
                                                                                    id="inlineRadio1"
                                                                                    onChange={
                                                                                        handleChange
                                                                                    }
                                                                                />
                                                                                <label
                                                                                    className="form-check-label"
                                                                                    htmlFor="inlineRadio1"
                                                                                >
                                                                                    Full
                                                                                    Time
                                                                                </label>
                                                                            </div>
                                                                            <div className="form-check form-check-inline">
                                                                                <input
                                                                                    className="form-check-input"
                                                                                    type="radio"
                                                                                    checked={
                                                                                        values.CourseType ==
                                                                                        "Part Time"
                                                                                    }
                                                                                    value="Part Time"
                                                                                    name="CourseType"
                                                                                    id="inlineRadio2"
                                                                                    onChange={
                                                                                        handleChange
                                                                                    }
                                                                                />
                                                                                <label
                                                                                    className="form-check-label"
                                                                                    htmlFor="inlineRadio2"
                                                                                >
                                                                                    Part
                                                                                    Time
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
                                                                                    onChange={
                                                                                        handleChange
                                                                                    }
                                                                                />
                                                                                <label
                                                                                    className="form-check-label"
                                                                                    htmlFor="inlineRadio3"
                                                                                >
                                                                                    Correspondence/
                                                                                    Distance
                                                                                    Learning
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-12 col-md-12">
                                                                    <div className="form-group">
                                                                        <label>
                                                                            Course
                                                                            duration
                                                                        </label>
                                                                        <span
                                                                            style={{
                                                                                color: "red",
                                                                            }}
                                                                        >
                                                                            {" "}
                                                                            *
                                                                        </span>
                                                                        <div
                                                                            style={{
                                                                                display:
                                                                                    "flex",
                                                                            }}
                                                                        >
                                                                            <div
                                                                                style={{
                                                                                    width: "45%",
                                                                                }}
                                                                            >
                                                                                <Select
                                                                                    placeholder="Year"
                                                                                    value={
                                                                                        courseStart
                                                                                    }
                                                                                    name="CourseDurationStart"
                                                                                    onBlur={
                                                                                        handleBlur
                                                                                    }
                                                                                    onChange={(
                                                                                        option: any
                                                                                    ) => {
                                                                                        handleCourseStart(
                                                                                            option
                                                                                        );
                                                                                        setFieldValue(
                                                                                            "CourseDurationStart",
                                                                                            option?.value
                                                                                        );

                                                                                        if (
                                                                                            option ==
                                                                                            null
                                                                                        ) {
                                                                                            setFieldValue(
                                                                                                "CourseDurationStart",
                                                                                                ""
                                                                                            );
                                                                                            touched.CourseDurationStart =
                                                                                                true;
                                                                                        }
                                                                                    }}
                                                                                    isClearable={
                                                                                        true
                                                                                    }
                                                                                    isSearchable={
                                                                                        true
                                                                                    }
                                                                                    options={
                                                                                        pastyearOptions
                                                                                    }
                                                                                    className={
                                                                                        "dropstyle"
                                                                                    }
                                                                                    styles={
                                                                                        customStyles
                                                                                    }
                                                                                    maxMenuHeight={
                                                                                        200
                                                                                    }
                                                                                    menuPlacement="top"
                                                                                />

                                                                                {errors.CourseDurationStart &&
                                                                                    touched.CourseDurationStart && (
                                                                                        <span className="form-error">
                                                                                            {
                                                                                                errors.CourseDurationStart
                                                                                            }
                                                                                        </span>
                                                                                    )}
                                                                            </div>
                                                                            <label
                                                                                style={{
                                                                                    marginLeft:
                                                                                        "5%",
                                                                                    marginRight:
                                                                                        "5%",
                                                                                    marginTop:
                                                                                        "2%",
                                                                                }}
                                                                            >
                                                                                To
                                                                            </label>
                                                                            <div
                                                                                style={{
                                                                                    width: "45%",
                                                                                }}
                                                                            >
                                                                                <Select
                                                                                    placeholder="Year"
                                                                                    value={
                                                                                        courseEnd
                                                                                    }
                                                                                    onBlur={
                                                                                        handleBlur
                                                                                    }
                                                                                    name="CourseDurationEnd"
                                                                                    onChange={(
                                                                                        option: any
                                                                                    ) => {
                                                                                        handleCourseEnd(
                                                                                            option
                                                                                        );
                                                                                        setFieldValue(
                                                                                            "CourseDurationEnd",
                                                                                            option?.value
                                                                                        );

                                                                                        if (
                                                                                            option ==
                                                                                            null
                                                                                        ) {
                                                                                            setFieldValue(
                                                                                                "CourseDurationEnd",
                                                                                                ""
                                                                                            );
                                                                                            touched.CourseDurationEnd =
                                                                                                true;
                                                                                        }
                                                                                    }}
                                                                                    isClearable={
                                                                                        true
                                                                                    }
                                                                                    isSearchable={
                                                                                        true
                                                                                    }
                                                                                    options={
                                                                                        yearOptions
                                                                                    }
                                                                                    className={
                                                                                        "dropstyle"
                                                                                    }
                                                                                    styles={
                                                                                        customStyles
                                                                                    }
                                                                                    maxMenuHeight={
                                                                                        200
                                                                                    }
                                                                                    menuPlacement="top"
                                                                                />
                                                                                {errors.CourseDurationEnd &&
                                                                                    touched.CourseDurationEnd && (
                                                                                        <span className="form-error">
                                                                                            {
                                                                                                errors.CourseDurationEnd
                                                                                            }
                                                                                        </span>
                                                                                    )}
                                                                            </div>
                                                                        </div>
                                                                        {erro && (
                                                                            <span className="form-error">
                                                                                End
                                                                                year
                                                                                must
                                                                                be
                                                                                greater
                                                                                than
                                                                                start
                                                                                year.{" "}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-12 col-md-12">
                                                                    <div className="form-group">
                                                                        <label>
                                                                            Grading
                                                                            System
                                                                        </label>

                                                                        <Select
                                                                            placeholder="Select Grading System"
                                                                            value={
                                                                                grading
                                                                            }
                                                                            name="GradingSystem"
                                                                            onChange={(
                                                                                option: any
                                                                            ) => {
                                                                                handleGrading(
                                                                                    option
                                                                                );
                                                                                setFieldValue(
                                                                                    "GradingSystem",
                                                                                    option?.value
                                                                                );
                                                                                if (
                                                                                    option?.label
                                                                                )
                                                                                    handleMarkInput(
                                                                                        option.label
                                                                                    );
                                                                                if (
                                                                                    option ==
                                                                                    null
                                                                                ) {
                                                                                    setFieldValue(
                                                                                        "GradingSystem",
                                                                                        ""
                                                                                    );
                                                                                }
                                                                            }}
                                                                            isClearable={
                                                                                true
                                                                            }
                                                                            isSearchable={
                                                                                true
                                                                            }
                                                                            options={
                                                                                GradingSystem
                                                                            }
                                                                            className={
                                                                                "dropstyle"
                                                                            }
                                                                            styles={
                                                                                customStyles
                                                                            }
                                                                            maxMenuHeight={
                                                                                200
                                                                            }
                                                                            menuPlacement="top"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                {values.GradingSystem !==
                                                                    "Course Requries a Pass" &&
                                                                    grading && (
                                                                        <div className="col-lg-12 col-md-12">
                                                                            <div className="form-group">
                                                                                <label>
                                                                                    Marks
                                                                                </label>
                                                                                <span
                                                                                    style={{
                                                                                        color: "red",
                                                                                    }}
                                                                                >
                                                                                    {" "}
                                                                                    *
                                                                                </span>
                                                                                <input
                                                                                    type="text"
                                                                                    placeholder="Enter marks"
                                                                                    name="Marks"
                                                                                    onBlur={
                                                                                        handleBlur
                                                                                    }
                                                                                    value={
                                                                                        values.Marks
                                                                                    }
                                                                                    onChange={(
                                                                                        e: any
                                                                                    ) => {
                                                                                        numReg.test(
                                                                                            e
                                                                                                .target
                                                                                                .value
                                                                                        ) &&
                                                                                            handleChange(
                                                                                                e
                                                                                            );
                                                                                    }}
                                                                                    className={`form-control ${errors.Marks &&
                                                                                            touched.Marks
                                                                                            ? "input-error"
                                                                                            : ""
                                                                                        }`}
                                                                                />
                                                                                {errors?.Marks &&
                                                                                    touched?.Marks &&
                                                                                    !values.Marks && (
                                                                                        <span className="form-error">
                                                                                            {
                                                                                                errors?.Marks
                                                                                            }
                                                                                        </span>
                                                                                    )}
                                                                                {values.Marks !==
                                                                                    "" && (
                                                                                        <span className="form-error">
                                                                                            {
                                                                                                errors?.Marks
                                                                                            }
                                                                                        </span>
                                                                                    )}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        )}
                                                    {(values?.Education
                                                        ?.value == "10th" ||
                                                        values?.Education
                                                            ?.value == "12th" ||
                                                        values?.Education
                                                            ?.value ===
                                                        "Below 10th") && (
                                                            <div
                                                                className="row"
                                                                style={{
                                                                    marginLeft:
                                                                        "0.50%",
                                                                    marginRight:
                                                                        "0.50%",
                                                                    width: "99%",
                                                                }}
                                                            >
                                                                <div className="col-lg-12 col-md-12 ">
                                                                    <div className="form-group">
                                                                        <label>
                                                                            Board
                                                                        </label>
                                                                        <span
                                                                            style={{
                                                                                color: "red",
                                                                            }}
                                                                        >
                                                                            {" "}
                                                                            *
                                                                        </span>

                                                                        <Select
                                                                            placeholder="Select Board"
                                                                            value={
                                                                                school
                                                                            }
                                                                            name="Board"
                                                                            maxMenuHeight={
                                                                                200
                                                                            }
                                                                            onBlur={
                                                                                handleBlur
                                                                            }
                                                                            onChange={(
                                                                                option: any
                                                                            ) => {
                                                                                handleSchool(
                                                                                    option
                                                                                );
                                                                                setFieldValue(
                                                                                    "Board",
                                                                                    option?.value
                                                                                );

                                                                                if (
                                                                                    option ==
                                                                                    null
                                                                                ) {
                                                                                    setFieldValue(
                                                                                        "Board",
                                                                                        ""
                                                                                    );
                                                                                    touched.Board =
                                                                                        true;
                                                                                }
                                                                            }}
                                                                            isClearable={
                                                                                true
                                                                            }
                                                                            isSearchable={
                                                                                true
                                                                            }
                                                                            options={
                                                                                board
                                                                            }
                                                                            className={
                                                                                "dropstyle"
                                                                            }
                                                                            styles={
                                                                                customStyles
                                                                            }
                                                                        />
                                                                        {errors.Board &&
                                                                            touched.Board && (
                                                                                <span className="form-error">
                                                                                    {
                                                                                        errors.Board
                                                                                    }
                                                                                </span>
                                                                            )}
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-12 col-md-12">
                                                                    <div className="form-group">
                                                                        <label>
                                                                            Passing
                                                                            Out Year
                                                                        </label>
                                                                        <span
                                                                            style={{
                                                                                color: "red",
                                                                            }}
                                                                        >
                                                                            {" "}
                                                                            *
                                                                        </span>
                                                                        <div
                                                                            style={{
                                                                                display:
                                                                                    "flex",
                                                                            }}
                                                                        >
                                                                            <div
                                                                                style={{
                                                                                    width: "50%",
                                                                                }}
                                                                            >
                                                                                <Select
                                                                                    placeholder="Select Passing out year"
                                                                                    value={
                                                                                        schoolPassing
                                                                                    }
                                                                                    name="PassingOutYear"
                                                                                    onBlur={
                                                                                        handleBlur
                                                                                    }
                                                                                    onChange={(
                                                                                        option: any
                                                                                    ) => {
                                                                                        handleSchoolPassing(
                                                                                            option
                                                                                        );
                                                                                        setFieldValue(
                                                                                            "PassingOutYear",
                                                                                            option?.value
                                                                                        );

                                                                                        if (
                                                                                            option ==
                                                                                            null
                                                                                        ) {
                                                                                            setFieldValue(
                                                                                                "PassingOutYear",
                                                                                                ""
                                                                                            );
                                                                                            touched.PassingOutYear =
                                                                                                true;
                                                                                        }
                                                                                    }}
                                                                                    isClearable={
                                                                                        true
                                                                                    }
                                                                                    isSearchable={
                                                                                        true
                                                                                    }
                                                                                    options={
                                                                                        yearData
                                                                                    }
                                                                                    maxMenuHeight={
                                                                                        200
                                                                                    }
                                                                                    className={
                                                                                        "dropstyle"
                                                                                    }
                                                                                    styles={
                                                                                        customStyles
                                                                                    }
                                                                                />
                                                                                {errors.PassingOutYear &&
                                                                                    touched.PassingOutYear && (
                                                                                        <span className="form-error">
                                                                                            {
                                                                                                errors.PassingOutYear
                                                                                            }
                                                                                        </span>
                                                                                    )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-lg-12 col-md-12">
                                                                    <div className="form-group">
                                                                        <label>
                                                                            School
                                                                            Medium
                                                                        </label>
                                                                        <span
                                                                            style={{
                                                                                color: "red",
                                                                            }}
                                                                        >
                                                                            {" "}
                                                                            *
                                                                        </span>

                                                                        <Select
                                                                            placeholder="Select School Medium"
                                                                            value={
                                                                                medium
                                                                            }
                                                                            name="SchoolMedium"
                                                                            onBlur={
                                                                                handleBlur
                                                                            }
                                                                            onChange={(
                                                                                option: any
                                                                            ) => {
                                                                                handleSchoolMedium(
                                                                                    option
                                                                                );
                                                                                setFieldValue(
                                                                                    "SchoolMedium",
                                                                                    option?.value
                                                                                );

                                                                                if (
                                                                                    option ==
                                                                                    null
                                                                                ) {
                                                                                    setFieldValue(
                                                                                        "SchoolMedium",
                                                                                        ""
                                                                                    );
                                                                                    touched.SchoolMedium =
                                                                                        true;
                                                                                }
                                                                            }}
                                                                            isClearable={
                                                                                true
                                                                            }
                                                                            isSearchable={
                                                                                true
                                                                            }
                                                                            options={
                                                                                sclMdm
                                                                            }
                                                                            className={
                                                                                "dropstyle"
                                                                            }
                                                                            styles={
                                                                                customStyles
                                                                            }
                                                                            menuPlacement="top"
                                                                            maxMenuHeight={
                                                                                200
                                                                            }
                                                                        />

                                                                        {errors.SchoolMedium &&
                                                                            touched.SchoolMedium && (
                                                                                <span className="form-error">
                                                                                    {
                                                                                        errors.SchoolMedium
                                                                                    }
                                                                                </span>
                                                                            )}
                                                                    </div>
                                                                </div>

                                                                <div className="col-lg-12 col-md-12">
                                                                    <div className="form-group">
                                                                        <label>
                                                                            Total
                                                                            Marks
                                                                        </label>
                                                                        <span
                                                                            style={{
                                                                                color: "red",
                                                                            }}
                                                                        >
                                                                            {" "}
                                                                            *
                                                                        </span>

                                                                        <Select
                                                                            placeholder="Select Total Marks"
                                                                            value={
                                                                                tmarks
                                                                            }
                                                                            name="TotalMarks"
                                                                            onBlur={
                                                                                handleBlur
                                                                            }
                                                                            onChange={(
                                                                                option: any
                                                                            ) => {
                                                                                handleSchoolMarks(
                                                                                    option
                                                                                );
                                                                                setFieldValue(
                                                                                    "TotalMarks",
                                                                                    option?.value
                                                                                );

                                                                                if (
                                                                                    option ==
                                                                                    null
                                                                                ) {
                                                                                    setFieldValue(
                                                                                        "TotalMarks",
                                                                                        ""
                                                                                    );
                                                                                    touched.TotalMarks =
                                                                                        true;
                                                                                }
                                                                            }}
                                                                            menuPlacement="top"
                                                                            maxMenuHeight={
                                                                                200
                                                                            }
                                                                            isClearable={
                                                                                true
                                                                            }
                                                                            isSearchable={
                                                                                true
                                                                            }
                                                                            options={
                                                                                prcnt
                                                                            }
                                                                            className={
                                                                                "dropstyle"
                                                                            }
                                                                            styles={
                                                                                customStyles
                                                                            }
                                                                        />

                                                                        {errors.TotalMarks &&
                                                                            touched.TotalMarks && (
                                                                                <span className="form-error">
                                                                                    {
                                                                                        errors.TotalMarks
                                                                                    }
                                                                                </span>
                                                                            )}
                                                                    </div>
                                                                </div>
                                                                {!(
                                                                    values.Education
                                                                        .label ===
                                                                    "10th" ||
                                                                    values.Education
                                                                        .label ===
                                                                    "Below 10th"
                                                                ) && (
                                                                        <div className="col-lg-12 col-md-12">
                                                                            <div className="form-group">
                                                                                <label>
                                                                                    English
                                                                                    Marks
                                                                                </label>
                                                                                <input
                                                                                    type="text"
                                                                                    name="EnglishMarks"
                                                                                    maxLength={
                                                                                        3
                                                                                    }
                                                                                    value={
                                                                                        values.EnglishMarks
                                                                                    }
                                                                                    onChange={(
                                                                                        e: any
                                                                                    ) => {
                                                                                        numReg.test(
                                                                                            e
                                                                                                .target
                                                                                                .value
                                                                                        ) &&
                                                                                            handleChange(
                                                                                                e
                                                                                            );
                                                                                    }}
                                                                                    className={`form-control ${errors.EnglishMarks &&
                                                                                            touched.EnglishMarks
                                                                                            ? "input-error"
                                                                                            : ""
                                                                                        }`}
                                                                                    placeholder="Marks(out of 100)"
                                                                                />
                                                                                {errors.EnglishMarks &&
                                                                                    touched.EnglishMarks &&
                                                                                    values.EnglishMarks ==
                                                                                    "" && (
                                                                                        <span className="form-error">
                                                                                            {
                                                                                                errors.EnglishMarks
                                                                                            }
                                                                                        </span>
                                                                                    )}
                                                                                {!values.EnglishMarks?.match(
                                                                                    /^(0|[1-9][0-9]?|100)$/
                                                                                ) &&
                                                                                    values.EnglishMarks !==
                                                                                    "" && (
                                                                                        <span className="form-error">
                                                                                            {
                                                                                                errors.EnglishMarks
                                                                                            }
                                                                                        </span>
                                                                                    )}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                {!(
                                                                    values.Education
                                                                        .label ===
                                                                    "10th" ||
                                                                    values.Education
                                                                        .label ===
                                                                    "Below 10th"
                                                                ) && (
                                                                        <div className="col-lg-12 col-md-12">
                                                                            <div className="form-group">
                                                                                <label>
                                                                                    Maths
                                                                                    Marks
                                                                                </label>
                                                                                <input
                                                                                    type="text"
                                                                                    placeholder="Marks(out of 100)"
                                                                                    name="MathsMarks"
                                                                                    maxLength={
                                                                                        3
                                                                                    }
                                                                                    value={
                                                                                        values.MathsMarks
                                                                                    }
                                                                                    onChange={(
                                                                                        e: any
                                                                                    ) => {
                                                                                        numReg.test(
                                                                                            e
                                                                                                .target
                                                                                                .value
                                                                                        ) &&
                                                                                            handleChange(
                                                                                                e
                                                                                            );
                                                                                    }}
                                                                                    className={`form-control ${errors.MathsMarks &&
                                                                                            touched.MathsMarks
                                                                                            ? "input-error"
                                                                                            : ""
                                                                                        }`}
                                                                                />
                                                                                {errors.MathsMarks &&
                                                                                    touched.MathsMarks &&
                                                                                    values.MathsMarks ==
                                                                                    "" && (
                                                                                        <span className="form-error">
                                                                                            {
                                                                                                errors.MathsMarks
                                                                                            }
                                                                                        </span>
                                                                                    )}
                                                                                {!values.MathsMarks?.match(
                                                                                    /^(0|[1-9][0-9]?|100)$/
                                                                                ) &&
                                                                                    values.MathsMarks !==
                                                                                    "" && (
                                                                                        <span className="form-error">
                                                                                            {
                                                                                                errors.MathsMarks
                                                                                            }
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
                                                        type="button"
                                                        className="site-button site-warning-button"
                                                        onClick={() => {
                                                            resetForm();
                                                            setEducation(false);
                                                            setEditValue(null);
                                                            handleClear();
                                                            deleteBtnHandler();
                                                            setError(false);
                                                            trigger &&
                                                                trigger(false);
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="site-button"
                                                        onClick={() => { }}
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </Modal>
                            {hideEducationContent && (
                                <div
                                    id="education_bx"
                                    className="job-bx bg-white m-b30"
                                >
                                    <div
                                        className="d-flex"
                                        style={{ width: "100%" }}
                                    >
                                        <h5 className="m-b15 c_content_header">
                                            Education{" "}
                                            <span className="font-14">
                                                {pflStrength?.pflStrnRes?.data
                                                    ?.profileWeightage
                                                    ?.education
                                                    ? `(${Number(
                                                        pflStrength
                                                            ?.pflStrnRes?.data
                                                            ?.profileWeightage
                                                            .education
                                                    )}%)`
                                                    : ""}
                                            </span>
                                        </h5>
                                        {!loading &&
                                            educationList &&
                                            educationList?.schools?.length +
                                            educationList?.degree?.length <
                                            environment
                                                ?.Jobseeker_Profile_Data_Limits
                                                ?.education_limit && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setEducation(true);
                                                        dynamicDropdown();
                                                        setCourseData([]);
                                                        setSpecial("");
                                                        setCourse("");
                                                        setDis(false);
                                                        setIsDisabled(false);
                                                        setDeleteBtnDis(false);
                                                        resetForm();
                                                        // setEducation(false);
                                                        // setEditValue(null);
                                                        handleClear();
                                                    }}
                                                    className="site-button add-btn button-sm"
                                                >
                                                    Add
                                                </button>
                                            )}
                                    </div>

                                    <p className="c_content_desc">
                                        Mention your education details including
                                        your current and previous education
                                    </p>

                                    <div className="row">
                                        <div className="col-lg-12 col-md-12 col-sm-12">
                                            <div className="clearfix m-b20 ">
                                                {!loading && educationList ? (
                                                    <div>
                                                        {eduDegree?.length >
                                                            0 &&
                                                            eduDegree?.map(
                                                                (c: any) => {
                                                                    // eslint-disable-next-line no-lone-blocks
                                                                    {
                                                                        return (
                                                                            <div
                                                                                className="mt-3"
                                                                                key={
                                                                                    c._id
                                                                                }
                                                                            >
                                                                                {c.course ? (
                                                                                    <b>
                                                                                        {" "}
                                                                                        <span className="c_content_subheader text-break text-justify">
                                                                                            {
                                                                                                c.course
                                                                                            }
                                                                                        </span>{" "}
                                                                                    </b>
                                                                                ) : (
                                                                                    ""
                                                                                )}
                                                                                {c.stream ? (
                                                                                    <b>
                                                                                        {" "}
                                                                                        <span className="mr-2 c_content_subheader text-break text-justify">
                                                                                            {
                                                                                                c.stream
                                                                                            }
                                                                                        </span>
                                                                                    </b>
                                                                                ) : (
                                                                                    ""
                                                                                )}
                                                                                <Link
                                                                                    to={
                                                                                        "#"
                                                                                    }
                                                                                    data-toggle="modal"
                                                                                    className="edit-icon"
                                                                                    title="click here to update your course and specialization"
                                                                                    onClick={(
                                                                                        e: any
                                                                                    ) => {
                                                                                        setIsDisabled(
                                                                                            true
                                                                                        );
                                                                                        setEducation(
                                                                                            true
                                                                                        );
                                                                                        handleBindData(
                                                                                            e,
                                                                                            c
                                                                                        );
                                                                                        setDeleteBtnDis(
                                                                                            true
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <BsPencil />
                                                                                </Link>
                                                                                &nbsp;
                                                                                {/* <Link to={"#"} data-toggle="modal" onClick={() => {
                                                            }} >
                                                                <i className="fa fa-trash" aria-hidden="true"></i></Link> */}
                                                                                {c.institute ? (
                                                                                    <p className="m-b0 c_content_details text-break text-justify">
                                                                                        {
                                                                                            c.institute
                                                                                        }
                                                                                    </p>
                                                                                ) : null}
                                                                                {c.start_year ? (
                                                                                    <span className="m-b0 c_content_details text-break text-justify">
                                                                                        {
                                                                                            c.start_year
                                                                                        }
                                                                                    </span>
                                                                                ) : null}
                                                                                <span>
                                                                                    -
                                                                                </span>
                                                                                {c.completion_year ? (
                                                                                    <span className="mr-2 c_content_details text-break text-justify">
                                                                                        {
                                                                                            c.completion_year
                                                                                        }
                                                                                        .
                                                                                    </span>
                                                                                ) : null}
                                                                                {c.course_type ? (
                                                                                    <span className="mr-2 c_content_details text-break text-justify">
                                                                                        {
                                                                                            c.course_type
                                                                                        }
                                                                                    </span>
                                                                                ) : null}
                                                                            </div>
                                                                        );
                                                                    }
                                                                }
                                                            )}
                                                        {educationList?.schools
                                                            ?.length > 0 &&
                                                            eduData?.map(
                                                                (c: any) => {
                                                                    return (
                                                                        <div
                                                                            className="mt-3"
                                                                            key={
                                                                                c._id
                                                                            }
                                                                        >
                                                                            {c.course ? (
                                                                                <span className="c_content_subheader text-break text-justify">
                                                                                    <b>
                                                                                        {c.course !==
                                                                                            "Below 10th"
                                                                                            ? `Class ${c.course ==
                                                                                                "10th"
                                                                                                ? "X"
                                                                                                : "XII"
                                                                                            }`
                                                                                            : "Below 10th"}
                                                                                    </b>
                                                                                </span>
                                                                            ) : null}
                                                                            &nbsp;{" "}
                                                                            <Link
                                                                                to={
                                                                                    "#"
                                                                                }
                                                                                data-toggle="modal"
                                                                                className="edit-icon"
                                                                                data-target="#patent"
                                                                                onClick={(
                                                                                    e: any
                                                                                ) => {
                                                                                    setEducation(
                                                                                        true
                                                                                    );
                                                                                    setIsDisabled(
                                                                                        true
                                                                                    );
                                                                                    handleBindData(
                                                                                        e,
                                                                                        c
                                                                                    );
                                                                                    setDeleteBtnDis(
                                                                                        true
                                                                                    );
                                                                                    deleteBtnHandler();
                                                                                    checkBoxDegreeHandler(
                                                                                        values
                                                                                            ?.Education
                                                                                            ?.label
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <BsPencil />
                                                                            </Link>
                                                                            &nbsp;
                                                                            {/* <Link to={"#"} data-toggle="modal" data-target="#patent" onClick={() => {
                                                        }} >
                                                            <i className="fa fa-trash" aria-hidden="true"></i></Link> */}
                                                                            {c.board ? (
                                                                                <p className="m-b0 c_content_details text-break text-justify">
                                                                                    {
                                                                                        c.board
                                                                                    }
                                                                                </p>
                                                                            ) : (
                                                                                ""
                                                                            )}
                                                                            {c.completion_year ? (
                                                                                <p className="m-b0 c_content_details text-break text-justify">
                                                                                    {
                                                                                        c.completion_year
                                                                                    }
                                                                                </p>
                                                                            ) : (
                                                                                ""
                                                                            )}
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
                                                    </div>
                                                ) : (
                                                    ""
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {docPhd && (
                                        <Link
                                            to={"#"}
                                            className="clearfix"
                                            style={{ textDecoration: "none" }}
                                            onClick={() => {
                                                setDynamic([...educationtData]);
                                                // deptFilterHandler({
                                                //   label: "Doctorate/PhD",
                                                //   value: "Doctorate/PhD",
                                                // });
                                                setEducation(true);
                                                setEdu({
                                                    label: "Doctorate/PhD",
                                                    value: "Doctorate/PhD",
                                                });
                                                setFieldValue("Education", {
                                                    label: "Doctorate/PhD",
                                                    value: "Doctorate/PhD",
                                                });
                                                setCourseOptions({
                                                    label: "Doctorate/PhD",
                                                    value: "Doctorate/PhD",
                                                });
                                                setDis(true);
                                                setIsDisabled(true);
                                                dynamicDropdown();
                                            }}
                                        >
                                            Add Doctorate/PhD
                                        </Link>
                                    )}
                                    {masters && (
                                        <Link
                                            to={"#"}
                                            className="clearfix"
                                            style={{ textDecoration: "none" }}
                                            onClick={() => {
                                                setDynamic([...educationtData]);
                                                // deptFilterHandler({
                                                //   label: "Masters/Post-Graduation",
                                                //   value: "Masters/Post-Graduation",
                                                // });
                                                setEducation(true);
                                                setEdu({
                                                    label: "Masters/Post-Graduation",
                                                    value: "Masters/Post-Graduation",
                                                });
                                                setCourseOptions({
                                                    label: "Masters/Post-Graduation",
                                                    value: "Masters/Post-Graduation",
                                                });
                                                setFieldValue("Education", {
                                                    label: "Masters/Post-Graduation",
                                                    value: "Masters/Post-Graduation",
                                                });
                                                setDis(true);
                                                setIsDisabled(true);
                                                dynamicDropdown();
                                            }}
                                        >
                                            Add Masters/Post-Graduation
                                        </Link>
                                    )}
                                    {graduation && (
                                        <Link
                                            to={"#"}
                                            className="clearfix"
                                            style={{ textDecoration: "none" }}
                                            onClick={() => {
                                                setDynamic([...educationtData]);
                                                // deptFilterHandler({
                                                //   label: "Graduation/Diploma",
                                                //   value: "Graduation/Diploma",
                                                // });
                                                setEducation(true);
                                                setEdu({
                                                    label: "Batchelor/Under-Graduation",
                                                    value: "Batchelor/Under-Graduation",
                                                });
                                                setCourseOptions({
                                                    label: "Batchelor/Under-Graduation",
                                                    value: "Batchelor/Under-Graduation",
                                                });
                                                setFieldValue("Education", {
                                                    label: "Batchelor/Under-Graduation",
                                                    value: "Batchelor/Under-Graduation",
                                                });
                                                setDis(true);
                                                setIsDisabled(true);
                                                dynamicDropdown();
                                            }}
                                        >
                                            Batchelor/Under-Graduation
                                        </Link>
                                    )}

                                    {twelve && (
                                        <Link
                                            to={"#"}
                                            className="clearfix"
                                            style={{ textDecoration: "none" }}
                                            onClick={() => {
                                                setDynamic([...educationtData]);
                                                setEducation(true);
                                                setEdu({
                                                    label: "12th",
                                                    value: "12th",
                                                });
                                                setFieldValue("Education", {
                                                    label: "12th",
                                                    value: "12th",
                                                });
                                                setDis(true);
                                                setIsDisabled(true);
                                                dynamicDropdown();
                                            }}
                                        >
                                            Add Class XII
                                        </Link>
                                    )}
                                    {ten && (
                                        <Link
                                            to={"#"}
                                            className="clearfix"
                                            style={{ textDecoration: "none" }}
                                            onClick={() => {
                                                setDynamic([...EduArray]);
                                                setEducation(true);
                                                setEdu({
                                                    label: "10th",
                                                    value: "10th",
                                                });
                                                setFieldValue("Education", {
                                                    label: "10th",
                                                    value: "10th",
                                                });
                                                setDis(true);
                                                setIsDisabled(true);
                                                dynamicDropdown();
                                            }}
                                        >
                                            Add Class X
                                        </Link>
                                    )}
                                </div>
                            )}
                        </>
                    );
                }}
            </Formik>
        </>
    );
}

export default Education;