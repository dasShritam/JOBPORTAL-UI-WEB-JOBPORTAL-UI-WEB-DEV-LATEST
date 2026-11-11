import { Form, Formik } from "formik";
import moment from "moment";
import { EducationOption, initialValues, validateSchema } from "./formData";
// import JobDescription from "./JobDescription";
// import JobRequirement from "./JobRequirement";
import Questions from "./questions/Questions";
// import CompanyInfo from "./CompanyInfo";
// import JobPostListingSidebar from "../../../shared/JobPostListingSidebar";
// import AddQuestionModal from "./questions/AddQuestionModal";
// import PrefillJobs from "./PrefillJobs";
import PrivatejobSkeleton from "./privatejobSkeleton";
import Swal from "sweetalert2";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import React, { lazy, useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { DesignationMasterData } from "../../../../redux/features/masterData/DesignationSlice";
import { SkillsMasterData } from "../../../../redux/features/masterData/SkillsSlice";
import {
  GetPremiumCollege,
  PatchPrivateJob,
  PostPrivateJob,
  resetPostJob,
  resetUpdatejob,
} from "../../../../redux/features/jobs/job-post/private-job/PrivateJobSlice";
import { CompanyMasterData } from "../../../../redux/features/masterData/CompanySlice";
import { LocationcityMasterData } from "../../../../redux/features/masterData/LocationcitySlice";
import { getIndustryType } from "../../../../redux/features/masterData/industrySlice";
import { DepartmentMasterData } from "../../../../redux/features/masterData/DepartmentSlice";
import {
  listingMinimalJobs,
  manageJobsData,
  resetManageJobs,
  resetlistingMinimalJob,
} from "../../../../redux/features/jobs/manage-jobs/ManageJobsSlice";
import { UseToastAlert } from "../../../../hooks/useToastAlert";
import { jobSeekerProfileMasterData } from "../../../../redux/features/masterData/MasterDataInfoSlice";
import {
  GetDayFromTimeStamp,
  GetDisplayDateFromTimeStamp,
  GetMonthNameFromTimeStamp,
  GetYearFromTimeStamp,
  getTimeStampForTime,
} from "../../../../common/common";

import { getProfileDetails } from "../../../../redux/features/manage-account/profile/EmployerProfileSlice";
import dayjs from "dayjs";
import { string } from "yup";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FcBusinesswoman } from "react-icons/fc";
import { fontSize } from "@mui/system";
import Loader from "../../../common/Loader/Loader";
import { getEpmMails } from "../../../../redux/features/employer/EmployerManageUser/getEpmMailSlice";
import { resetInternalJobs } from "../../../../redux/features/jobs/manage-jobs/MangeJobs-rjp-ijpSlice";
const JobDescription = lazy(() => import("./JobDescription"));
const JobRequirement = lazy(() => import("./JobRequirement"));
const CompanyInfo = lazy(() => import("./CompanyInfo"));
const JobPostListingSidebar = lazy(
  () => import("../../../shared/JobPostListingSidebar")
);
const PrefillJobs = lazy(() => import("./PrefillJobs"));
const AddQuestionModal = lazy(() => import("./questions/AddQuestionModal"));

function PrivateJob() {
  const formikRef = useRef<any>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const PostJob = useSelector((state: any) => state.PostJob);
  const UpdateJob = useSelector((state: any) => state.PatchPrivate);
  const GetColleges = useSelector((state: any) => state.GetPremiumCollege);
  const [viewSize, setViewSize] = useState(9);
  const [disPrefillJob, setDisPrefillJob] = useState(false);
  const [initValues, setInitValues] = useState<any>(initialValues);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const empDetails = useSelector((state: any) => state.employeeProfile);
  const { EmployerProfile, loading } = empDetails;

  const isHot = useLocation().pathname?.includes("hot");
  const typeName = isHot ? "Hot Job" : "Private Job";

  const [isRenderRequirement, setIsRenderRequirement] =
    useState<boolean>(false);

  const handleChange = () => {
    viewSize === 9 ? setViewSize(6) : setViewSize(9);
    viewSize === 6 ? setDisPrefillJob(false) : setDisPrefillJob(true);
  };
  const showSnackAlert = UseToastAlert();

  useEffect(() => {
    return () => {
      dispatch(resetManageJobs());
      dispatch(resetInternalJobs());
      // dispatch(resetlistingMinimalJob());
      formikRef?.current?.resetForm();
      setEditvalues(initValues);
      dispatch(resetPostJob());
      dispatch(resetUpdatejob());
      setIsRenderRequirement(false);
    };
  }, [typeName]);

  useEffect(() => {
    if (PostJob?.res?.code === 200) {
      showSnackAlert("success", PostJob.res.message);
      dispatch(resetPostJob());
      if (formikRef?.current) {
        formikRef?.current?.resetForm();
        setEditvalues(initValues);
      }
    } else if (PostJob?.res?.code === 400) {
      showSnackAlert("warning", PostJob.res.message);
    } else if (PostJob?.res?.code === 500) {
      showSnackAlert("error", PostJob.res.message);
    }
  }, [PostJob]);
  useEffect(() => {
    if (UpdateJob?.res?.code === 200) {
      // showSnackAlert("success", UpdateJob.res.message);
      handleDeleteSwal(UpdateJob.res.message);
      dispatch(resetUpdatejob());
      if (formikRef?.current) {
        formikRef?.current?.resetForm();
        setEditvalues(initValues);
      }
    } else if (UpdateJob?.res?.code === 400) {
      showSnackAlert("warning", UpdateJob.res.message);
    } else if (UpdateJob?.res?.code === 500) {
      showSnackAlert("error", UpdateJob?.res?.code);
    }
  }, [UpdateJob]);

  //masterdata
  useEffect(() => {
    dispatch(DesignationMasterData({ pageno: -1, search: "" }));
    // return () => {
    //   // Dispatch the reset action when the component is unmounted
    //   dispatch(resetPrivatejob());
    // };
  }, []);

  useEffect(() => {
    dispatch(SkillsMasterData({ pageno: -1, search: "" }));
  }, []);

  useEffect(() => {
    dispatch(getProfileDetails());
  }, []);
  useEffect(() => {
    let data = [
      {
        label: EmployerProfile?.data?.acountInfo?.email,
        value: EmployerProfile?.data?.acountInfo?.email,
      },
    ];
    setInitValues({ ...initValues, notifyMatch: data });
  }, [EmployerProfile]);

  useEffect(() => {
    dispatch(CompanyMasterData({ pageno: -1, search: "" }));
  }, []);
  useEffect(() => {
    dispatch(LocationcityMasterData({ pageno: -1, search: "" }));
  }, []);

  useEffect(() => {
    dispatch(getIndustryType({ pageno: -1, search: "" }));
  }, []);

  useEffect(() => {
    dispatch(DepartmentMasterData({ pageno: -1, search: "" }));
  }, []);
  useEffect(() => {
    dispatch(getEpmMails());
  }, []);

  useEffect(() => {
    const University = {
      pageno: -1,
      search: "IIT",
      premium: true,
    };
    dispatch(GetPremiumCollege(University));
  }, []);

  function addDays(date, days) {
    let inputDate = new Date(date);
    inputDate.setDate(inputDate.getDate() + days - 1);
    let outputDate: any;
    const day = inputDate.getDate();
    const month = inputDate.getMonth() + 1;
    const year = inputDate.getFullYear();
    return (outputDate = `${day}/${month}/${year}`);
  }
  const handleDeleteSwal = (message: any) => {
    Swal.fire({
      title: message,
      text: "Now you will be redirected to Manage Jobs Page.",
      // showCancelButton: true,
      confirmButtonColor: "#2a9f2a ",
      allowOutsideClick: false,
      // cancelButtonColor: "#db1919 ",
      confirmButtonText: "Okay",
      // cancelButtonText: "No",
    }).then((result) => {
      if (result?.isConfirmed) {
        navigate("/jobs/manage-hot-private");
      }
    });
  };

  useEffect(() => {
    const emp_type_options = [
      {
        group: "EMPT",
        active: 1,
      },
      {
        group: "WMODE",
        active: 1,
      },
      {
        group: "EDUN",
        active: 1,
      },
      {
        group: "DPHD",
        active: 1,
      },
      {
        group: "MAPG",
        active: 1,
      },
      {
        group: "BAUG",
        active: 1,
      },
    ];
    dispatch(jobSeekerProfileMasterData(emp_type_options));
  }, []);

  const listingJob = useSelector((state: any) => state.ManageJobs);
  const { allManageJobs, manageJobLoading } = listingJob;
  const allPrefillJobs = useSelector((state: any) => state.Listingalljobs);
  const prefillData = allPrefillJobs.allManageJobs;

  const { id } = useParams();

  const iid = useParams();
  useEffect(() => {
    if (id?.length == 24) {
      setIsRenderRequirement(false);
      const JobListOptions = {
        mode: "all",
        pageid: 1,
        jobid: id,
      };
      dispatch(manageJobsData(JobListOptions));
      setEditvalues(initialValues);
      setShowSkeleton(true);
    } else {
      formikRef?.current?.resetForm();
      setIsRenderRequirement(true);
    }
  }, []);

  function callingalljobs() {
    if (!id) {
      const JobListOptions = {
        mode: "minimal",
        pageid: -1,
        jobid: "",
        status: ["DRAFT"],
      };
      dispatch(listingMinimalJobs(JobListOptions));
    }
  }

  //calling all jobs

  //

  const [editvalues, setEditvalues] = useState<any>();
  const seteditvaluefunction = () => {
    const Evalue =
      allManageJobs?.jobs?.length == 1 ? allManageJobs?.jobs[0] : undefined;
    if (
      (Evalue && allManageJobs.length != 0 && prefillData.length != 0) ||
      (allManageJobs.length != 0 && id)
    ) {
      let skills: any = [],
        location: any = [],
        ind,
        Mail: any = [];
      Evalue?.skills.map((e) => {
        skills.push({ label: e, value: e });
      });

      Evalue?.location.map((e) => {
        location.push({ label: e, value: e });
      });
      Evalue?.pref_industry?.map((e) => {
        ind = { label: e, value: e };
      });
      {
        Evalue?.notify?.mail != undefined &&
          Evalue?.notify?.mail.map((e) => {
            Mail.push({ label: e, value: e });
          });
      }
      let selectedOption =
        modeOption != undefined &&
        modeOption.find((e) => {
          return Evalue?.work_mode?.value == e.label;
        });
      let Yesterday =
        new Date(
          `${GetMonthNameFromTimeStamp(
            Evalue?.walkin?.end_ts
          )}-${GetDayFromTimeStamp(
            Evalue?.walkin?.end_ts
          )}-${GetYearFromTimeStamp(Evalue?.walkin?.end_ts)}`
        ).toDateString() < new Date().toDateString();
      let Today_pastday =
        new Date(
          `${GetMonthNameFromTimeStamp(
            Evalue?.walkin?.end_ts
          )}-${GetDayFromTimeStamp(
            Evalue?.walkin?.end_ts
          )}-${GetYearFromTimeStamp(Evalue?.walkin?.end_ts)}`
        ).toDateString() <= new Date().toDateString();
      setEditvalues({
        ...initialValues,
        id: Evalue?.id,
        designation: { label: Evalue?.title, value: Evalue?.title },
        empType: { label: Evalue?.emp_type, value: Evalue?.emp_type },
        workMode: selectedOption
          ? selectedOption
          : {
              label: Evalue?.work_mode?.value,
              description: Evalue?.work_mode?.policy,
            },
        hybridPolicy:
          Evalue?.work_mode?.value == "Hybrid" ? Evalue?.work_mode?.policy : "",
        jobDesc: `${Evalue?.job_desc}`,
        keySkills: skills,
        workExp: [Evalue?.exp?.min, Evalue?.exp?.max],
        checkbox: false,
        currency: [Evalue?.salary?.min, Evalue?.salary?.max],
        currencySymbole: Evalue?.salary?.currency === "USD" ? "USD" : "INR",
        salaryOutput: "",
        isSalaryHidden: !Evalue?.salary?.visible,
        variablePercent: Evalue?.salary?.varpay,
        googleMapUrl: Evalue?.walkin.location_uri,
        location: Evalue?.location.map((e) => {
          return { label: e, value: e };
        }),
        locality: null,
        isReadyToRelocate: Evalue?.relocate,
        industry: Evalue?.industry.map((e) => {
          return { label: e, value: e };
        }),
        department:
          // "HR"
          { label: Evalue?.department, value: Evalue?.department },
        roleCategory:
          // "Banking Operation"
          { label: Evalue?.role_category, value: Evalue?.role_category },
        role: { label: Evalue?.role, value: Evalue?.role },

        referenceCode: id?.length == 24 ? Evalue?.alias : "",
        noOfVacancies: Evalue?.vacancy,
        isPremium: Evalue?.prem_colleges.length > 0 ? true : false,
        premium: Evalue?.prem_colleges,
        eduQualification: [{}],
        requestVideoProfile: Evalue?.include_video,
        includeWalkIn: Evalue?.walkin?.address ? true : false,
        contactPerson: Evalue?.walkin?.contact?.name,
        contactNumber: Evalue?.walkin?.contact?.phone,
        startDate:
          //  Evalue?.status?.value == "DRAFT" &&
          !Today_pastday && Evalue?.walkin?.start_ts
            ? dayjs(
                new Date(Evalue?.walkin?.start_ts * 1000)
                  .toISOString()
                  .substr(0, 10)
              )
            : "",
        // dayjs(new Date(`${GetYearFromTimeStamp(Evalue?.refresh?.start_ts)}-${GetMonthNameFromTimeStamp(Evalue?.refresh?.start_ts)}-${GetDisplayDateFromTimeStamp(Evalue?.refresh?.start_ts)}`))

        // new Date(`${GetYearFromTimeStamp(Evalue?.walkin.start_ts)}-${GetMonthNameFromTimeStamp(Evalue?.walkin.start_ts)}-${GetDisplayDateFromTimeStamp(Evalue?.walkin.start_ts)}`)
        // startDate:Evalue?.walkin.start_ts&& new Date(GetDisplayDateFromTimeStamp(Evalue?.walkin.start_ts)),
        startTime:
          !Today_pastday &&
          new Date(Evalue?.walkin?.end_ts * 1000).toDateString() ==
            new Date().toDateString() &&
          Evalue?.walkin?.time != undefined
            ? dayjs(
                getTimeStampForTime(
                  Evalue?.walkin?.time.split("-")[0]
                ).getTime()
              )
            : "",
        // ""
        endTime:
          !Today_pastday &&
          new Date(Evalue?.walkin?.end_ts * 1000).toDateString() ==
            new Date().toDateString() &&
          Evalue?.walkin?.time != undefined
            ? dayjs(
                getTimeStampForTime(
                  Evalue?.walkin?.time.split("-")[1]
                ).getTime()
              )
            : "",
        duration: { label: 1, value: 1 },
        venue: Evalue?.walkin?.address,
        questions: Evalue?.questions,
        jobType: id == "hotjob" ? true : false,
        companyName: "",
        companyUrl: "",
        clientName: {
          label: Evalue?.client?.name,
          value: Evalue?.client?.name,
        },
        clientDetails: Evalue?.client?.address,
        showRecruiterDetails: Evalue?.visible,
        recruiterName: "",
        recruiterEmail: "",
        isNotifyMatch: Evalue?.notify?.mail?.length > 0 ? true : false,
        // Evalue?.notify.match
        notifyMatch:
          Mail?.length == 0
            ? Mail
            : [
                {
                  label: EmployerProfile?.data?.acountInfo?.email,
                  value: EmployerProfile?.data?.acountInfo?.email,
                },
              ],
        OftenMail: {
          label: Evalue?.notify?.frequency,
          value: Evalue?.notify?.frequency,
        },
        schedule: Evalue?.refresh?.frequency
          ? {
              refreshType: Evalue?.refresh?.frequency,
              start: Evalue?.refresh?.start_ts
                ? new Date(Evalue?.refresh?.start_ts * 1000)
                    .toISOString()
                    .substr(0, 10)
                : "",
              // new Date(`${GetYearFromTimeStamp(Evalue?.refresh?.start_ts)}-${GetMonthNameFromTimeStamp(Evalue?.refresh?.start_ts)}-${GetDisplayDateFromTimeStamp(Evalue?.refresh?.start_ts)}`)
              refreshEndsAfter: Evalue?.refresh?.end_ts ? "ON" : "After",
              noOfRefresh: null,
              refreshDate: Evalue?.refresh?.end_ts
                ? new Date(Evalue?.refresh?.end_ts * 1000)
                    .toISOString()
                    .substr(0, 10)
                : "",
              // new Date(`${GetYearFromTimeStamp(Evalue?.refresh?.start_ts)}-${GetMonthNameFromTimeStamp(Evalue?.refresh?.start_ts)}-${GetDisplayDateFromTimeStamp(Evalue?.refresh?.start_ts)}`)
            }
          : initialValues?.schedule,

        Questions: Evalue?.questions,
      });

      skills = [];

      setIsRenderRequirement(true);
    } else {
    }
  };

  useEffect(() => {
    if (allManageJobs.length != 0) {
      seteditvaluefunction();
    } else {
      formikRef?.current?.resetForm();
      setEditvalues(initialValues);
      setIsRenderRequirement(true);
    }
  }, [allManageJobs]);
  const [modeOption, setModeOption] = useState<any>();
  const JS_MASTER_DATA = useSelector((state: any) => state.jobSeekerMasterData);
  useEffect(() => {
    if (id?.length == 24 && !allManageJobs?.jobs) {
      setShowSkeleton(true);
    } else {
      setShowSkeleton(false);
    }
  }, [manageJobLoading, showSkeleton]);
  useEffect(() => {
    // if (!manageJobLoading && id != "hotjob") {
    //   seteditvaluefunction();
    // }
    JS_MASTER_DATA.JSMasterData.map((e, i) => {
      let modeoptions: any = [];
      if (e.group == "WMODE") {
        e.data.map((e) => {
          modeoptions.push({
            label: e.value,
            value: e.id,
            description: e.desc,
          });
        });
        setModeOption(modeoptions);
      }
    });
  }, [allManageJobs, JS_MASTER_DATA]);
  async function handleIsRenderRequired() {
    await setIsRenderRequirement(false);
  }
  async function fromchild(index) {
    // setEditvalues(initialValues);
    await handleIsRenderRequired();
    const JobListOptions = {
      mode: "all",
      pageid: 1,
      jobid: index,
    };
    await dispatch(manageJobsData(JobListOptions));
    // seteditvaluefunction();
  }

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <ul className="tooltipBullet">
        <li>
          Your job will be specially highlighted to women candidates, but other
          interested candidates will still be able to apply
        </li>
        <li>
          You can focus on applications from women by using the diversity filter
          in your responses
        </li>
      </ul>
    </Tooltip>
  );
  const handleCheckSubmit = (formikProps: any) => {
    if (Object.keys(formikProps.errors).length > 0) {
      const firstErrorField = document.querySelector(".error-scroll");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }

    formikProps.handleSubmit(formikProps); // Proceed with form submission
  };

  //
  return (
    <>
      {!showSkeleton && (
        <div className="page-content">
          <div className="content-block">
            <div className="section-full browse-job content-inner-2">
              <div className="container" style={{ marginTop: "2%" }}>
                <div className="row">
                  {!disPrefillJob && (
                    <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12 m-b30">
                      <JobPostListingSidebar />
                    </div>
                  )}
                  <div className={`col-xl-9 col-lg-9 col-md-9 col-sm-12`}>
                    <div>
                      <h5>
                        {!id
                          ? `Post a Job - ${typeName}`
                          : `Update a Job - ${typeName}`}
                      </h5>
                      {!id && !disPrefillJob && (
                        <>
                          <span>Begin from scratch or&nbsp;</span>
                          {
                            <Link
                              to={""}
                              onClick={async () => {
                                await setShowSkeleton(true);
                                handleChange();
                                callingalljobs();
                              }}
                            >
                              Prefill from Drafted jobs
                            </Link>
                          }
                        </>
                      )}
                    </div>
                    <br />
                    <Formik
                      initialValues={editvalues || { ...initValues }}
                      enableReinitialize={true}
                      validationSchema={validateSchema}
                      innerRef={formikRef}
                      onSubmit={(values: any, { setFieldError, resetForm }) => {
                        let ArrLocation: any = [],
                          ArrNotifyMatch: any = [],
                          ArrSkills: any = [];
                        values?.location?.map((loc) => {
                          ArrLocation.push(loc.label);
                        });
                        values?.notifyMatch?.map((mail) => {
                          ArrNotifyMatch.push(mail.label);
                        });
                        values?.keySkills?.map((skill) => {
                          ArrSkills.push(skill.label);
                        });

                        const eduCourses = values?.eduQualification?.filter(
                          (c) => c.isCourse || EducationOption.includes(c.label)
                        );
                        const eduData: any = eduCourses.map((c) => {
                          return {
                            course: c.label,
                            stream: EducationOption.includes(c.label)
                              ? []
                              : values.eduQualification
                                  ?.filter((x) => x.parentId == c.id)
                                  ?.map((z) => {
                                    return z.label;
                                  }),
                          };
                        });

                        eduData.length == 0 &&
                          setFieldError(
                            "eduQualification",
                            "Please select at least one course under the selected qualification."
                          );
                        let walkinEDate = values.endDate
                          .split("/")
                          .reverse()
                          .join("-");
                        let QNS;
                        if (values?.questions) {
                          QNS = values?.questions.map((c) => {
                            return {
                              id: c.id.length > 20 ? c.id : "",
                              qes: c.qes ? c.qes : c.name ? c.name : c.question,
                              type: c.type,
                              options: c.options
                                ? c.options.map((d) => {
                                    return {
                                      value: d.value ? d.value : d.name,
                                      preferred: d.preferred,
                                    };
                                  })
                                : c.choices?.map((d) => {
                                    return {
                                      value: d.value ? d.value : d.choice,
                                      preferred: d.isPrefered,
                                    };
                                  }),
                              required: c.required ? c.required : c.isMandatory,
                            };
                          });
                        } else {
                          QNS = null;
                        }

                        let Data: any = {
                          job_type: isHot ? "HOT VACANCIES JOB" : "PRIVATE JOB",
                          title: values.designation.label,
                          emp_type: values?.empType?.label,
                          work_mode: {
                            value: values.workMode.label,
                            policy:
                              values.workMode.label == "Hybrid"
                                ? values.hybridPolicy
                                : values.workMode.description,
                          },
                          job_desc: values.jobDesc,
                          // values.jobDesc
                          skills: ArrSkills,
                          //  [
                          //   "skills",
                          //   "skills",
                          //   "skills"
                          // ]
                          exp: {
                            min: values.workExp[0],
                            max: values.workExp[1],
                          },
                          salary: {
                            currency: values.currencySymbole,
                            min: values.currency[0],
                            max: values.currency[1],
                            varpay: values.variablePercent
                              ? values.variablePercent
                              : null,
                            visible: values.isSalaryHidden,
                          },
                          location: values?.location?.map((loc) => loc.label),
                          // [
                          //   "location",
                          //   "banglore"
                          // ]
                          relocate: values.isReadyToRelocate,
                          industry: values?.industry.map((c) => c.label),
                          // [
                          //   "bfkdfds"
                          // ]
                          department: values.department.label,
                          role:
                            // "Acquisition Manager"
                            values.role.label,
                          role_ctgy: values.roleCategory.label,
                          alias: values.referenceCode,
                          vacancy:
                            Number(values.noOfVacancies) != 0
                              ? Number(values.noOfVacancies)
                              : null,
                          education: eduData,
                          // [
                          //   {
                          //     course: "BE",
                          //     stream: [
                          //       "CSE"
                          //     ]
                          //   }]
                          prem_colleges: values.premium ? values.premium : null,
                          include_video: values.requestVideoProfile,
                          walkin: values.startDate
                            ? {
                                start_date: values.startDate.$y
                                  ? `${values.startDate.$y}-${
                                      values.startDate.$M + 1
                                    }-${values.startDate.$D}`
                                  : values.startDate,
                                // "2023-4-24"
                                end_date:
                                  walkinEDate != ""
                                    ? walkinEDate
                                    : allManageJobs?.jobs?.length == 1
                                    ? new Date(
                                        allManageJobs?.jobs[0]?.walkin
                                          ?.start_ts * 1000
                                      )
                                        .toISOString()
                                        .substr(0, 10)
                                    : "",
                                time: `${
                                  values.startTime.$H < 10
                                    ? "0" + values.startTime.$H
                                    : values.startTime.$H
                                }:${
                                  values.startTime.$m > 10
                                    ? values.startTime.$m
                                    : "0" + values.startTime.$m
                                }-${
                                  values.endTime.$H < 10
                                    ? "0" + values.endTime.$H
                                    : values.endTime.$H
                                }:${
                                  values.endTime.$m > 10
                                    ? values.endTime.$m
                                    : "0" + values.endTime.$m
                                }`,
                                // "09:00-16:00"
                                contact: {
                                  name: values.contactPerson,
                                  phone: values.contactNumber
                                    ? `${values.contactNumber}`
                                    : null,
                                },
                                address: values.venue,
                                location_uri: null,
                                // values.googleMapUrl
                              }
                            : null,
                          diversity: false,
                          client: {
                            name: values?.clientName?.label,
                            address: values.clientDetails,
                          },
                          visible: values.showRecruiterDetails,
                          notify: {
                            match: "HIGH MATCH", //high prefer low prefer
                            mail: values?.isNotifyMatch
                              ? ArrNotifyMatch
                              : [EmployerProfile?.data?.acountInfo?.email],
                            frequency: values?.OftenMail?.label,
                            // "frequency"
                            sub_field: ["sub_field"], //skills
                          },
                          repost:
                            values.schedule.start &&
                            values.schedule.refreshType != "Do not refresh"
                              ? {
                                  frequency: values.schedule.refreshType,
                                  // values?.schedule?.noOfRefresh?.label,
                                  start_date: values.schedule.start.$y
                                    ? `${values.schedule.start.$y}-${
                                        values.schedule.start.$M + 1
                                      }-${values.schedule.start.$D}`
                                    : values.schedule.start,
                                  // "2023-3-24"
                                  end_date:
                                    values.schedule.refreshEndsAfter ==
                                      "After" &&
                                    values.schedule.noOfRefresh != null
                                      ? addDays(
                                          values.schedule.start.$d,
                                          values.schedule.noOfRefresh.value
                                        )
                                          .split("/")
                                          .reverse()
                                          .join("-")
                                      : values.schedule.refreshDate.$y
                                      ? `${values.schedule.refreshDate.$y}-${
                                          values.schedule.refreshDate.$M + 1
                                        }-${values.schedule.refreshDate.$D}`
                                      : values.schedule.refreshDate,
                                  // "2023-5-23"
                                }
                              : null,
                          status: values.Published ? "PUBLISH" : "DRAFT",
                          questions: QNS,
                        };
                        if (eduData?.length != 0) {
                          if (id && allManageJobs?.jobs?.length != 0) {
                            Data = {
                              ...Data,
                              id: id,
                            };
                            dispatch(PatchPrivateJob(Data));
                          } else {
                            dispatch(PostPrivateJob(Data));
                          }
                        }
                      }}
                    >
                      {(formikProps: any) => {
                        return (
                          <div>
                            <JobDescription {...formikProps} />
                            {isRenderRequirement && (
                              <JobRequirement {...formikProps} />
                            )}
                            <AddQuestionModal {...formikProps} />
                            {isHot && (
                              <div className="isHotDiv mb-4">
                                <label style={{ fontSize: "16px" }}>
                                  Diversity Hiring
                                </label>
                                <div className="d-flex justify-content-between">
                                  <div className="custom-control custom-checkbox">
                                    <input
                                      type="checkbox"
                                      className="custom-control-input"
                                      checked={true}
                                      name="jobType"
                                      id={`chk_isHot`}
                                      onChange={() => {
                                        return null;
                                      }}
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="chk_isHot"
                                      style={{ fontSize: "16px" }}
                                    >
                                      Prefer hiring <b>women candidates</b> for
                                      this role and promote diversity in the
                                      workplace.
                                    </label>
                                    <div>
                                      <OverlayTrigger
                                        placement="right"
                                        delay={{ show: 250, hide: 200 }}
                                        overlay={renderTooltip}
                                      >
                                        <span style={{ cursor: "pointer" }}>
                                          <i>How it works?</i>
                                        </span>
                                      </OverlayTrigger>
                                    </div>
                                  </div>
                                  <div>
                                    <FcBusinesswoman
                                      style={{ fontSize: "80px" }}
                                    />
                                  </div>
                                </div>
                                <div></div>
                              </div>
                            )}

                            {/* {isHot && (
                            <div className="job-bx bg-white m-b30">
                              <div className="row">
                                <span className="custom-control custom-checkbox d-flex ">
                                  <input
                                    type="checkbox"
                                    checked={true}
                                    id="jobtype"
                                    name="jobType"
                                    className="custom-checkbox "
                                  />
                                  &nbsp;
                                  <label
                                    htmlFor="jobtype"
                                    className="align-items-center mt-2"
                                  >
                                    Check to post as a Hot Job
                                  </label>
                                </span>
                              </div>
                            </div>
                          )} */}

                            <CompanyInfo {...formikProps} />
                            <div className="d-flex justify-content-end">
                              <button
                                type="submit"
                                className="site-button"
                                style={{ backgroundColor: "rgb(16, 50, 71)" }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  dispatch(resetPostJob());
                                  dispatch(resetUpdatejob());
                                  // dispatch(resetManageJobs());
                                  formikProps.values.Published = false;
                                  // formikProps.handleSubmit();
                                  handleCheckSubmit(formikProps);
                                }}
                              >
                                Save as Draft
                              </button>{" "}
                              &nbsp;
                              <button
                                type="submit"
                                className="site-button "
                                onClick={(e) => {
                                  dispatch(resetPostJob());
                                  dispatch(resetUpdatejob());
                                  formikProps.values.Published = true;
                                  handleCheckSubmit(formikProps);
                                }}
                              >
                                Post Job
                                {/* {!id ? "Post Job" : "Update Job"} */}
                              </button>
                            </div>
                          </div>
                        );
                      }}
                    </Formik>
                  </div>
                  {disPrefillJob && (
                    <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12 m-b30">
                      <PrefillJobs
                        closeSlider={handleChange}
                        Alljob={prefillData.jobs}
                        onclick={fromchild}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showSkeleton && <PrivatejobSkeleton />}
      {PostJob?.loading ? <Loader /> : ""}
      {UpdateJob?.loading ? <Loader /> : ""}
    </>
  );
}

export default PrivateJob;
