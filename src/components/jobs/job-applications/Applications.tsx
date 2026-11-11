import { Avatar, Chip } from "@mui/material";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { past_timestamp } from "../../../common/common";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import { resetAppStatusRestset } from "../../../redux/features/employer/applicationStatusslice";
import { recruitmentMailReset } from "../../../redux/features/employer/recruitmentMailslice";
import {
  resetViewAppActionCreator,
  viewApplication,
} from "../../../redux/features/jobs/job-applications/ApplicationSlice";
import { resetAppStatusRestset2 } from "../../../redux/features/jobs/job-applications/ApplicationStatusSlice";
import { resetSAS } from "../../../redux/features/jobs/job-applications/downloadSASSlice";
import { resetCompanyMasterData } from "../../../redux/features/masterData/CompanySlice";
import { resetUniversityData } from "../../../redux/features/masterData/InstituteSlice";
import { resetLocationcityMasterData } from "../../../redux/features/masterData/LocationcitySlice";
import { resetSkillMasterData } from "../../../redux/features/masterData/SkillsSlice";
import { resetIndustryType } from "../../../redux/features/masterData/industrySlice";
import ApplicationList from "./ApplicationList";
import Filter from "./Filter";

const initialValues = {
    description: "",
    skills: "",
    location: "",
    institute: "",
    experience: [null, null],
    scoreHigh: false,
    scoreMedium: false,
    scoreLow: false,
    salary: [null, null],
    currencySymbole: "INR",
    salaryNo: false,
    noticePeriod: [],
    noticePeriod1: false,
    noticePeriod2: false,
    noticePeriod3: false,
    noticePeriod4: false,
    noticePeriod5: false,
    noticePeriod6: false,
    company: "",
    industry: "",
    education: "",
    option: "",
    access: "all",
    refine: "all",
    pageNo: 1,
  },
  validateSchema = Yup.object().shape({});

function Applications() {
  const [id] = useSearchParams(),
    [is] = useSearchParams(),
    navigate = useNavigate(),
    jid: any = id?.get("id"),
    isShortList: any = is?.get("is"),
    dispatch = useDispatch(),
    showSnackAlert = UseToastAlert(),
    [count, setCount] = useState(0),
    { viewApp, lodingV } = useSelector((state: any) => state.viewApplication),
    { Emails, loadReM } = useSelector((state: any) => state.emailSend);

  useEffect(() => {
    dispatch(resetAppStatusRestset2());
    dispatch(recruitmentMailReset());
    sessionStorage.setItem("goBack", `/jobs/applications?id=${jid}`);
  }, []);
  useEffect(() => {
    sessionStorage.setItem("goBack", `/jobs/applications?id=${jid}`);
  }, [jid]);
  useEffect(() => {
    return () => {
      dispatch(resetAppStatusRestset2());
      dispatch(recruitmentMailReset());
      dispatch(resetViewAppActionCreator());
      dispatch(resetSAS());
      dispatch(resetAppStatusRestset());
      dispatch(resetLocationcityMasterData());
      dispatch(resetUniversityData());
      dispatch(resetIndustryType());
      dispatch(resetCompanyMasterData());
      dispatch(resetSkillMasterData());
    };
  }, []);
  useEffect(() => {
    if (!loadReM && Emails && Emails?.code && Emails?.code === 200) {
      dispatch(recruitmentMailReset());
      showSnackAlert("success", Emails?.message);
    } else if (!loadReM && Emails && Emails?.code && Emails?.code !== 200) {
      dispatch(recruitmentMailReset());
      showSnackAlert("warning", Emails?.message);
    }
  }, [Emails]);
  useEffect(() => {
    if (viewApp && viewApp?.code && viewApp?.code === 200)
      setCount(viewApp?.data?.totalCount ? viewApp?.data?.totalCount : 0);
  }, [viewApp]);

  return (
    <>
      <div className="page-content bg-white">
        <div className="content-block">
          <div className="browse-job section-full bg-white p-t50 p-b20">
            <div className="container">
              <div className="job-bx browse-job clearfix mt-5 m-b30">
                <Formik
                  initialValues={initialValues}
                  validationSchema={validateSchema}
                  onSubmit={(values: any) => {
                    let option: any = {};
                    option =
                      isShortList === "1" || values?.access === "shortlist"
                        ? { status: "SHORTLIST" }
                        : { ...option };
                    option =
                      values?.access === "rejected"
                        ? { status: "REJECT" }
                        : { ...option };
                    option =
                      values?.refine === "new"
                        ? { status: "NEW", day: past_timestamp(1) }
                        : { ...option };
                    option =
                      values?.refine === "notView"
                        ? { status: "VIEW" }
                        : { ...option };
                    option =
                      values?.refine === "actionPending"
                        ? { status: "ACTION" }
                        : { ...option };
                    option.noticePeriod = [];
                    values?.noticePeriod1 &&
                      option?.noticePeriod?.push("15 Days or less");
                    values?.noticePeriod2 &&
                      option?.noticePeriod?.push("1 Month");
                    values?.noticePeriod3 &&
                      option?.noticePeriod?.push("2  Months");
                    values?.noticePeriod4 &&
                      option?.noticePeriod?.push("3 Months");
                    values?.noticePeriod5 &&
                      option?.noticePeriod?.push("More than 3  Months");
                    values?.noticePeriod6 &&
                      option?.noticePeriod?.push("Serving Notice Period");
                    option.skills = [];
                    values?.skills?.length &&
                      option?.skills?.push(...values?.skills);
                    option = values?.location
                      ? { location: values?.location?.label, ...option }
                      : { ...option };
                    option = values?.institute
                      ? { institute: [values?.institute?.label], ...option }
                      : { ...option };
                    option = values?.experience[1]
                      ? { experience: [...values?.experience], ...option }
                      : { ...option };
                    option = values?.salary[1]
                      ? values?.salaryNo
                        ? {
                            salary: {
                              salaryRange: [...values?.salary],
                              salaryCurrency:
                                values?.currencySymbole === "INR"
                                  ? true
                                  : false,
                              salaryNeed: values?.salaryNo,
                            },
                            ...option,
                          }
                        : {
                            salary: {
                              salaryRange: [...values?.salary],
                              salaryCurrency:
                                values?.currencySymbole === "INR"
                                  ? true
                                  : false,
                            },
                            ...option,
                          }
                      : { ...option };
                    option = values?.company?.length
                      ? { company: [values?.company], ...option }
                      : { ...option };
                    option = values?.industry
                      ? { industry: [values?.industry?.label], ...option }
                      : { ...option };
                    option = values?.education?.length
                      ? { education: [values?.education], ...option }
                      : { ...option };
                    let temp: any = [];
                    values?.scoreHigh &&
                      temp.push({
                        val: [75, 100],
                      });
                    values?.scoreMedium &&
                      temp.push({
                        val: [5, 74.99],
                      });
                    values?.scoreLow &&
                      temp.push({
                        val: [0, 4.99],
                      });
                    option = temp?.length
                      ? {
                          score: [...temp],
                        }
                      : { ...option };
                    dispatch(
                      viewApplication({
                        pageid: values?.pageNo,
                        jobid: jid,
                        ...option,
                      })
                    );
                  }}
                >
                  {(formikProps: any) => {
                    const { values, handleChange, handleSubmit } = formikProps;
                    return (
                      <>
                        <div className="job-bx-title clearfix NativeTitle">
                          <h5 className="font-weight-700 pull-left text-uppercase">
                            PRIVATE AND HOT APPLICATION
                          </h5>
                          <div className="float-right">
                            <Chip
                              label={
                                <span className="custom-job-content text-bold">
                                  Total Applications
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
                                  {count ? count : 0}
                                </Avatar>
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <div className="myDiv2">
                            <div className="align-items-start flex-column">
                              <label className="mr-1">
                                <input
                                  type="radio"
                                  name="access"
                                  value="all"
                                  className="card-input-element"
                                  checked={values?.access === "all"}
                                  onChange={handleChange}
                                  onClick={() => {
                                    navigate({
                                      pathname: "",
                                      search: `?id=${jid}`,
                                    });
                                    handleSubmit();
                                  }}
                                />
                                <div
                                  className={
                                    values?.access === "all"
                                      ? "btn btn-primary"
                                      : "btn btn-outline-primary"
                                  }
                                >
                                  All Applies <span>{}</span>
                                </div>
                              </label>
                              <label className="mr-1">
                                <input
                                  type="radio"
                                  name="access"
                                  value="shortlist"
                                  className="card-input-element"
                                  checked={values?.access === "shortlist"}
                                  onChange={(e) => {
                                    handleChange(e);
                                    values.refine = "all";
                                  }}
                                  onClick={() => {
                                    handleSubmit();
                                  }}
                                />
                                <div
                                  className={
                                    values?.access === "shortlist"
                                      ? "btn btn-primary"
                                      : "btn btn-outline-primary"
                                  }
                                >
                                  Shortlisted <span>{}</span>
                                </div>
                              </label>
                              <label className="mr-1">
                                <input
                                  type="radio"
                                  name="access"
                                  value="rejected"
                                  className="card-input-element"
                                  checked={values?.access === "rejected"}
                                  onChange={(e) => {
                                    handleChange(e);
                                    values.refine = "all";
                                  }}
                                  onClick={() => {
                                    navigate({
                                      pathname: "",
                                      search: `?id=${jid}`,
                                    });
                                    handleSubmit();
                                  }}
                                />
                                <div
                                  className={
                                    values?.access === "rejected"
                                      ? "btn btn-primary"
                                      : "btn btn-outline-primary"
                                  }
                                >
                                  Rejected <span>{}</span>
                                </div>
                              </label>
                            </div>
                            <div className="float-right">
                              <div className="job-bx-title backli clearfix">
                                <Link
                                  to={"/jobs/manage-hot-private"}
                                  className="site-button mt-2 right-arrow button-sm float-right"
                                >
                                  Go Back
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                        <hr style={{ marginTop: "-4px" }} />
                        <div
                          className="myDiv3 form-check-inline"
                          style={{ marginTop: "-10px" }}
                        >
                          <div style={{}}>
                            <div
                              className="container form-check-inline ml"
                              hidden={values?.access === "all" ? false : true}
                            >
                              <label className="mr-1">
                                <input
                                  type="radio"
                                  name="refine"
                                  value="all"
                                  className="card-input-element"
                                  checked={values?.refine === "all"}
                                  onChange={handleChange}
                                  onClick={() => {
                                    handleSubmit();
                                  }}
                                />
                                <div
                                  className={
                                    values?.refine === "all"
                                      ? "btn btn-primary btn-sm"
                                      : "btn btn-outline-primary btn-sm"
                                  }
                                >
                                  All <span>{}</span>
                                </div>
                              </label>
                              <label
                                className="mr-1"
                                title="Applicant response within 1 day"
                              >
                                <input
                                  type="radio"
                                  name="refine"
                                  value="new"
                                  className="card-input-element"
                                  checked={values?.refine === "new"}
                                  onChange={handleChange}
                                  onClick={() => {
                                    handleSubmit();
                                  }}
                                />
                                <div
                                  className={
                                    values?.refine === "new"
                                      ? "btn btn-primary btn-sm"
                                      : "btn btn-outline-primary btn-sm"
                                  }
                                >
                                  New Applies <span>{}</span>
                                </div>
                              </label>
                              <label
                                className="mr-1"
                                title="Applicants profile not viewed"
                              >
                                <input
                                  type="radio"
                                  name="refine"
                                  value="notView"
                                  className="card-input-element"
                                  checked={values?.refine === "notView"}
                                  onChange={handleChange}
                                  onClick={() => {
                                    handleSubmit();
                                  }}
                                />
                                <div
                                  className={
                                    values?.refine === "notView"
                                      ? "btn btn-primary btn-sm"
                                      : "btn btn-outline-primary btn-sm"
                                  }
                                >
                                  Not Viewed <span>{}</span>
                                </div>
                              </label>
                              <label
                                className="mr-1"
                                title="Applicant is viewed, but not Shortlist/Reject"
                              >
                                <input
                                  type="radio"
                                  name="refine"
                                  value="actionPending"
                                  className="card-input-element"
                                  checked={values?.refine === "actionPending"}
                                  onChange={handleChange}
                                  onClick={() => {
                                    handleSubmit();
                                  }}
                                />
                                <div
                                  className={
                                    values?.refine === "actionPending"
                                      ? "btn btn-primary btn-sm"
                                      : "btn btn-outline-primary btn-sm"
                                  }
                                >
                                  Action Pending <span>{}</span>
                                </div>
                              </label>
                            </div>
                          </div>
                          <div>
                            <div className="job-bx-title clearfix ">
                              <div className="float-right  form-check-inline">
                                <div className="float-right  ml-3 form-check-inline"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <Filter {...formikProps} />
                          <div className="col-xl-9 col-lg-9 col-md-9 col-sm-12">
                            <ul className="post-job-bx browse-job-grid row">
                              <ApplicationList formik={formikProps} />
                            </ul>
                          </div>
                        </div>
                      </>
                    );
                  }}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Applications;
