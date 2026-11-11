import { Formik } from "formik";
import { lazy, useEffect, useRef, useState } from "react";
import { EducationOption, initialValues, validateSchema } from "./formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { DesignationMasterData } from "../../../../redux/features/masterData/DesignationSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  DepartmentMasterData,
  resetDepartmentMasterData,
} from "../../../../redux/features/masterData/DepartmentSlice";
import { jobSeekerProfileMasterData } from "../../../../redux/features/masterData/MasterDataInfoSlice";
import { Modal } from "react-bootstrap";
import JobPreview from "./JobPreview";
import {
  GetInternalOrRefJob,
  PatchInternalOrRefJob,
  PostInternalOrRefJob,
  resetGetInternalJob,
  resetPatchInternalJob,
  resetPostInternalOrRefJob,
} from "../../../../redux/features/jobs/internal_ref_job/Internal_Ref_Job";
import { UseToastAlert } from "../../../../hooks/useToastAlert";
import Loader from "../../../common/Loader/Loader";
import dayjs from "dayjs";
import PrivatejobSkeleton from "../private-job/privatejobSkeleton";
import JobRequirementSkeleton from "../private-job/JobRequirementSkeleton";
import JobdescriptionSkeleton from "../private-job/JobDescriptionSkeleton";
import Swal from "sweetalert2";
const ListingSidebar = lazy(() => import("./ListingSideBar"));
const JobDescription = lazy(() => import("./JobDescription"));
const JobRequirement = lazy(() => import("./JobRequirement"));
const OtherInfo = lazy(() => import("./OtherInfo"));

function InternalOrReferalJob() {
  const pageUrl = useLocation();
  const navigate = useNavigate();
  const isInternal = pageUrl.pathname?.includes("internal");
  const typeName = isInternal ? "Internal" : "Referal";
  const formikRef = useRef<any>();
  const { id } = useParams();
  const dispatch = useDispatch();
  const showSnackAlert = UseToastAlert();
  const [showSkeleton, setShowSkeleton] = useState(false);
  useEffect(() => {
    dispatch(DesignationMasterData({ pageno: -1, search: "" }));
    dispatch(DepartmentMasterData({ pageno: -1, search: "" }));
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
  }, [isInternal]);

  useEffect(() => {
    return () => {
      dispatch(resetPostInternalOrRefJob());
      dispatch(resetPatchInternalJob());
      dispatch(resetGetInternalJob());
      formikRef?.current?.resetForm();
    };
  }, [typeName]);

  const [showPreview, setShowPPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  const { postJobRes, pjloading } = useSelector(
    (state: any) => state.PostInternalOrReferalJob
  );
  const { patchJobRes, patchJobloading } = useSelector(
    (state: any) => state.PatchInternalJob
  );

  const callBackJobPreview = () => {
    setPreviewData(null);
    setShowPPreview(false);
  };
  const previewJob = (values: any) => {
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
    setPreviewData(values);
    eduData?.length == 0 &&
      showSnackAlert("warning", "specify any particular Education");
    eduData?.length != 0 && setShowPPreview(true);
  };

  enum jobTypes {
    INTERNAL = "INTERNAL JOB",
    REFERRAL = "REFERRAL JOB",
  }
  enum jobAction {
    PUBLISH = "PUBLISH",
    DRAFT = "DRAFT",
  }

  const submitJob = (isPublish: boolean) => {
    const values = formikRef?.current.values;
    let modal = {
      job_type: isInternal ? jobTypes.INTERNAL : jobTypes.REFERRAL,
      title: values.designation?.label,
      bonus:
        !isInternal && values.isBonus
          ? {
              amount: Number(values.bonus),
              policy: values.bonusCondition,
            }
          : null,
      job_desc: values.jobDesc,
      skills: values.keySkills?.map((c) => c.label),
      exp: {
        min: values.workExp[0],
        max: values.workExp[1],
      },
      salary: {
        currency: values.currency,
        min: values.salary[0],
        max: values.salary[1],
        varpay: values.variablePercent,
        visible: !values.isSalaryHidden,
      },
      location: values.location,
      department: values.department?.label,
      role: values.role?.label,
      role_ctgy: values.roleCategory?.label,
      alias: values.referenceCode,
      vacancy: Number(values.vacancy),
      education: null,
      start_date: `${values.startDate?.$y}-${values.startDate?.$M + 1}-${
        values.startDate?.$D
      }`,
      end_date: `${values.endDate?.$y}-${values.endDate?.$M + 1}-${
        values.endDate?.$D
      }`,
      visible: true,
      status: isPublish ? jobAction.PUBLISH : jobAction.DRAFT,
      assignedTo: values.shareWith,
      recruiterInfo: {
        name: values.hiringManager.value,
      },
    };

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

    if (id) {
      const mdl = { ...modal, id: id };
      modal = mdl;
    }

    modal.education = eduData;
    let formData = new FormData();
    formData.append("jobDetails", JSON.stringify(modal));
    formData.append("jobDescription", values.jdFile);
    {
      eduData?.length != 0 &&
        dispatch(
          id ? PatchInternalOrRefJob(formData) : PostInternalOrRefJob(formData)
        );
    }
    {
      eduData?.length == 0 &&
        showSnackAlert("warning", "specify any particular Education");
    }
  };

  const clearPostControls = () => {
    formikRef?.current?.resetForm();
  };

  useEffect(() => {
    if (!pjloading && postJobRes?.code == 200) {
      showSnackAlert("success", postJobRes?.message);
      clearPostControls();
      setShowPPreview(false);
    } else if (!pjloading && postJobRes?.code == 500) {
      showSnackAlert("error", postJobRes?.message);
    } else if (!pjloading && postJobRes?.code == 400) {
      showSnackAlert("warning", postJobRes?.message);
      dispatch(resetPostInternalOrRefJob());
      dispatch(resetPatchInternalJob());
      dispatch(resetGetInternalJob());
    }
  }, [pjloading]);

  //#region update part
  const [isRenderRequirement, setIsRenderRequirement] =
    useState<boolean>(false);
  const [isRenderOtherInfo, setIsRenderOtherInfo] = useState<boolean>(false);
  const [editvalues, setEditvalues] = useState<any>();

  const getJOb = () => {
    const input = {
      jobid: id,
      mode: "all",
      pageId: 1,
      pageLimit: 1,
    };
    dispatch(GetInternalOrRefJob(input));
  };

  useEffect(() => {
    if (id?.length == 24) {
      setIsRenderRequirement(false);
      setIsRenderOtherInfo(false);
      getJOb();
      setEditvalues(initialValues);
      setShowSkeleton(true);
    } else {
      formikRef?.current?.resetForm();
      setIsRenderRequirement(true);
      setIsRenderOtherInfo(true);
    }

    return () => {
      setIsRenderRequirement(false);
      dispatch(resetPostInternalOrRefJob());
      dispatch(resetPatchInternalJob());
      dispatch(resetGetInternalJob());
      formikRef?.current?.resetForm();
      resetDepartmentMasterData();
      setIsRenderRequirement(false);
      setIsRenderOtherInfo(false);
    };
  }, []);

  useEffect(() => {
    setEditvalues(initialValues);
  }, [pageUrl]);

  const { jobData, jobLoading } = useSelector(
    (state: any) => state.GetInternalJobs
  );

  useEffect(() => {
    if (!jobLoading && jobData?.data?.jobs?.length && id?.length == 24) {
      setEditValuesData();
    }
  }, [jobLoading, jobData]);

  useEffect(() => {
    if (id?.length == 24 && jobLoading) {
      setShowSkeleton(true);
    } else {
      setShowSkeleton(false);
    }
  }, [jobLoading, showSkeleton]);

  const handleConfirmSwal = () => {
    Swal.fire({
      title: `${patchJobRes?.message}`,
      text: `Now you will be redirected to Manage Jobs Page`,
      // showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonColor: "green",
      // cancelButtonColor: "red",
      confirmButtonText: "Okay",
      // cancelButtonText: "No",
    }).then((result) => {
      if (result?.isConfirmed) {
        navigate(`/employer/manage-ijp-rjp`);
      }
    });
  };

  useEffect(() => {
    if (!patchJobloading && patchJobRes?.code == 200) {
      showSnackAlert("success", patchJobRes?.message);
      setShowPPreview(false);
      setIsRenderRequirement(true);
      setIsRenderOtherInfo(true);
      // setSuccessPopup(true);
      handleConfirmSwal();
      // setIsRenderRequirement(false);
      dispatch(resetPostInternalOrRefJob());
      dispatch(resetPatchInternalJob());
      dispatch(resetGetInternalJob());
      formikRef?.current?.resetForm();
      resetDepartmentMasterData();

      navigate(`/postjob/internaljob`);
      // getJOb();
    } else if (!patchJobloading && patchJobRes?.code == 500) {
      showSnackAlert("error", patchJobRes?.message);
      dispatch(resetPostInternalOrRefJob());
      dispatch(resetPatchInternalJob());
      dispatch(resetGetInternalJob());
    } else if (!patchJobloading && patchJobRes?.code == 400) {
      showSnackAlert("warning", patchJobRes?.message);
      dispatch(resetPostInternalOrRefJob());
      dispatch(resetPatchInternalJob());
      dispatch(resetGetInternalJob());
    }
  }, [patchJobloading]);

  const updateValues = async () => {
    await setEditValuesData();
  };

  const setEditValuesData = async () => {
    const jobItem =
      jobData?.data?.jobs?.length == 1 ? jobData?.data?.jobs[0] : undefined;
    if (jobItem) {
      setEditvalues({
        ...initialValues,
        id: jobItem?.id,
        designation: { label: jobItem?.title, value: jobItem?.title },
        jobDesc: `${jobItem?.job_desc?.value ?? ""}`,
        keySkills: jobItem?.skills.map((e) => {
          return { label: e, value: e };
        }),
        workExp: [jobItem?.exp?.min, jobItem?.exp?.max],
        salary: [jobItem?.salary?.min, jobItem?.salary?.max],
        currency: jobItem?.salary?.currency,
        isSalaryHidden: jobItem?.salary?.visible,
        variablePercent: jobItem?.salary?.varpay,
        location: jobItem?.location,
        department: { label: jobItem?.department, value: jobItem?.department },
        roleCategory: {
          label: jobItem?.role_category,
          value: jobItem?.role_category,
        },
        role: { label: jobItem?.role, value: jobItem?.role },
        referenceCode: id?.length == 24 ? jobItem?.alias : "",
        vacancy: jobItem?.vacancy,
        startDate: jobItem?.start_date
          ? dayjs(
              new Date(jobItem?.start_date * 1000).toISOString().substr(0, 10)
            )
          : "",
        endDate: jobItem?.start_date
          ? dayjs(
              new Date(jobItem?.end_date * 1000).toISOString().substr(0, 10)
            )
          : "",
        jobType: jobItem?.job_type,
        shareWith: jobItem?.assingedTo,
        jdFileUrl: jobItem?.job_desc?.jd_url,
        jdName: jobItem?.job_desc?.name,
        isBonus: jobItem?.bonus?.amount ? true : false,
        bonus: jobItem?.bonus?.amount,
        bonusCondition: jobItem?.bonus?.policy,
      });
      // formikRef?.current?.setFieldValue(
      //   "endDate",
      //   dayjs(new Date(jobItem?.end_date * 1000).toISOString().substr(0, 10))
      // );
      setIsRenderRequirement(true);
      setIsRenderOtherInfo(true);
      // setEndD
    }
  };

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

    formikProps.handleSubmit(); // Proceed with form submission
  };
  //#endregion

  return (
    <div className="page-content">
      <div className="content-block">
        <div className="section-full browse-job content-inner-2">
          <div className="container" style={{ marginTop: "2%" }}>
            <div className="row">
              <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12 m-b30">
                <ListingSidebar />
              </div>
              <div className={`col-xl-9 col-lg-9 col-md-9 col-sm-12`}>
                <Formik
                  initialValues={editvalues || { ...initialValues }}
                  enableReinitialize={true}
                  validationSchema={validateSchema}
                  innerRef={formikRef}
                  onSubmit={() => {
                    formikRef?.current?.values?.Published
                      ? previewJob(formikRef?.current?.values)
                      : submitJob(false);
                  }}
                >
                  {(formikProps: any) => {
                    return (
                      <div>
                        <div>
                          <h5>
                            {!id
                              ? `Post a Job - ${typeName}`
                              : `Update a Job - ${typeName}`}
                          </h5>
                        </div>
                        {jobLoading ? (
                          <JobdescriptionSkeleton />
                        ) : (
                          <JobDescription {...formikProps} />
                        )}
                        {isRenderRequirement ? (
                          <JobRequirement {...formikProps} />
                        ) : (
                          <JobRequirementSkeleton />
                        )}
                        {isRenderOtherInfo ? (
                          <OtherInfo {...formikProps} />
                        ) : (
                          ""
                        )}
                        <div className="d-flex justify-content-end m-t20">
                          <button
                            type="submit"
                            className="site-button"
                            style={{ backgroundColor: "rgb(16, 50, 71)" }}
                            onClick={(e) => {
                              e.preventDefault();
                              formikProps.values.Published = false;
                              // formikProps.handleSubmit();
                              handleCheckSubmit(formikProps);
                            }}
                            title={
                              id ? "Update this job" : "Save this job as draft"
                            }
                          >
                            {id ? "Update" : "Save as Draft"}
                          </button>{" "}
                          &nbsp;
                          <button
                            type="submit"
                            className="site-button "
                            onClick={(e) => {
                              formikProps.values.Published = true;
                              // formikProps.handleSubmit();
                              handleCheckSubmit(formikProps);
                            }}
                            title={
                              !id
                                ? "Preview this job to save."
                                : "Publish this job"
                            }
                          >
                            {!id ? "Preview" : "Publish"}
                          </button>
                        </div>
                      </div>
                    );
                  }}
                </Formik>
              </div>
            </div>
            {showPreview && (
              <Modal
                show={showPreview}
                backdrop="static"
                onHide={callBackJobPreview}
                className="modal browse-job fade modal-lg-bx-info editor"
              >
                <div
                  className="modal-dialog my-0"
                  style={{ width: "100%" }}
                  role="document"
                >
                  <div className="modal-content">
                    <div className="modal-body">
                      <div className="modal-custom-header">
                        <h5
                          className="modal-title"
                          id="ResumeheadlineModalLongTitle"
                        >
                          JOB PREVIEW
                        </h5>

                        <button
                          type="button"
                          className="close"
                          onClick={callBackJobPreview}
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <JobPreview {...previewData} />
                    </div>
                    <div className="modal-custom-footer">
                      <button
                        type="button"
                        className="site-button site-warning-button"
                        onClick={callBackJobPreview}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="site-button"
                        onClick={() => {
                          submitJob(true);
                        }}
                      >
                        Publish Job
                      </button>
                    </div>
                  </div>
                </div>
              </Modal>
            )}
          </div>
        </div>
      </div>
      {pjloading ? <Loader /> : ""}
      {patchJobloading ? <Loader /> : ""}
    </div>
  );
}

export default InternalOrReferalJob;
