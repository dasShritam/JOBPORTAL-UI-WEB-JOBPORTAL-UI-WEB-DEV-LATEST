import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import {
  GetFutureOrPastMonths,
  GetMonthNameFromTimeStamp,
  GetYearFromTimeStamp,
  customStyles,
} from "../../../../../common/common";
import {
  deletePatentDetails,
  updatePatentDetails,
} from "../../../../../redux/features/manage-account/profile/PatentSlice";
import { getJobSeekerrData } from "../../../../../redux/features/manage-account/profile/JsSlice";
import { useDispatch, useSelector } from "react-redux";
import { UseToastAlert } from "../../../../../hooks/useToastAlert";
import Swal from "sweetalert2";
import { BsPencil } from "react-icons/bs";
import { environment } from "../../../../../environments/environment";
import { regex } from "../../../../../common/validation";

interface patenttype {
  _id: string;
  title: string;
  uri: string;
  office: string | undefined;
  status: string | undefined;
  app_no: string | undefined;
  PublishedOn: string | undefined;
  PublishedOnYear: string | undefined;
  desc: string | undefined;
}
interface data {
  app_no: string;
  title: string;
  desc: string;
  uri: string;
  status: string;
  office: string;
  issued_ts: number;
  patentid: string;
}

const INITIAL_FORM_STATE: patenttype = {
  _id: "",
  title: "",
  uri: "",
  office: "",
  status: "Patent issued",
  app_no: "",
  PublishedOn: "",
  PublishedOnYear: "",
  desc: "",
};

const PATENT_FORM_VALIDATION = Yup.object().shape({
  title: Yup.string().required("Please add Patent Title.").trim(""),
  uri: Yup.string()
    .required("Please add URL.")
    .matches(regex.url, "Please enter a valid URL."),
  PublishedOnYear: Yup.object().nullable().notRequired(),
  PublishedOn: Yup.number().notRequired().nullable(),
  desc: Yup.string().notRequired().nullable(),
});

function Patent() {
  const [patentList, setPatentList] = useState<data[]>([]);
  const [patent, setPatent] = useState(false);
  const handleHidePatent = () => {
    setPatent(false);
  };
  const [editvalue, setEditValue] = useState<any | null>(null);
  const dispatch = useDispatch();
  const showSnackAlert = UseToastAlert();
  const [count, setCount] = useState(0);
  const [disedt, setDisedt] = useState("");
  const patentx = useSelector((state: any) => state.patentx);
  const { Patent } = patentx;
  useEffect(() => {
    if (Patent.message) {
      if (Patent.code === 200) showSnackAlert("success", Patent.message);
      if (Patent.code === 206) showSnackAlert("warning", Patent.message);
      dispatch(getJobSeekerrData());
    }
  }, [Patent]);

  const JobSeekerProfileData = useSelector(
    (state: any) => state.JobSeekerProfile2
  );
  const { JobSeekerProfile, loading } = JobSeekerProfileData;

  useEffect(() => {
    setPatentList(JobSeekerProfile?.js_profile?.patent);
  }, [JobSeekerProfile.js_profile]);

  const [issueYear, setIssueYear] = useState<any>(null);
  const [issueMonth, setIssueMonth] = useState<any>(null);

  const handleIssueYear = (data: any) => {
    setIssueYear(data);
  };
  const handleIssueMonth = (data: any) => {
    setIssueMonth(data);
  };

  const handleDeleteSwal = (del: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, You will not be able to recover this Record!",
      showCancelButton: true,
      confirmButtonColor: "#2a9f2a ",
      cancelButtonColor: "#db1919 ",
      confirmButtonText: "Yes, Delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deletePatentDetails(del));
      }
    });
  };

  const yearmonthData = useSelector((state: any) => state.yearmonthMasterdata);
  const { allYearMonth } = yearmonthData;

  const [year, setyear] = useState<any>([]);
  const [months, setmonths] = useState<any>([]);

  const GetMonths = () => {
    allYearMonth?.map((opt: any) => {
      if (opt.group === "GTMO") {
        let obj: any = [];
        opt.data.map((item: any) => {
          obj.push({ label: item.value, value: item.id });
        });
        setmonths(obj);
      }
    });
  };

  useEffect(() => {
    if (allYearMonth.length > 0) {
      allYearMonth?.map((opt: any) => {
        if (opt.group === "PAYE") {
          let obj: any = [];
          opt.data.map((item: any) => {
            obj.push({ value: item, label: Number(item) });
          });
          setyear(obj.reverse());
        }
      });
    }
  }, [allYearMonth]);

  useEffect(() => {
    if (allYearMonth.length > 0) {
      GetMonths();
    }
  }, [allYearMonth]);
  useEffect(() => {}, [year, months]);

  return (
    <>
      <Formik
        initialValues={
          editvalue || {
            ...INITIAL_FORM_STATE,
          }
        }
        enableReinitialize={true}
        validationSchema={PATENT_FORM_VALIDATION}
        onSubmit={(values: patenttype, { resetForm }) => {
          if (editvalue) {
            const intigrData = {
              patentid: values._id,
              app_no: values.app_no,
              ofc: values.office,
              issued_month:
                issueMonth && issueYear ? Number(issueMonth.value) - 0 : null,
              issued_year:
                issueYear && issueMonth ? Number(issueYear.label) : null,
              status: values.status,
              title: values.title,
              uri: values.uri.toLowerCase(),
              desc: values.desc,
            };
            dispatch(updatePatentDetails(intigrData));
            resetForm();
            setEditValue(null);
            setPatent(false);
          } else {
            const intigrData = {
              app_no: values.app_no,
              ofc: values.office,
              issued_month:
                issueMonth.value && issueYear
                  ? Number(issueMonth.value) - 0
                  : null,
              issued_year:
                issueYear.label && issueMonth ? Number(issueYear.label) : null,
              status: values.status,
              title: values.title,
              uri: values.uri.toLowerCase(),
              desc: values.desc,
            };

            dispatch(updatePatentDetails(intigrData));

            resetForm();
            setEditValue(null);
            setPatent(false);
          }
        }}
        isInitialValid={false}
      >
        {(formik: any) => {
          const {
            values,
            setFieldValue,
            handleChange,
            handleSubmit,
            errors,
            touched,
            handleBlur,
            resetForm,
          } = formik;

          return (
            <div className="list-line">
              <div className="d-flex ">
                <h6 className="c_content_inner_header">Patent</h6>
                {patentList?.length <
                  Number(
                    environment.Jobseeker_Profile_Data_Limits.patent_limit
                  ) && (
                  <button
                    data-toggle="modal"
                    data-target="#patent"
                    onClick={() => {
                      setPatent(true);
                      formik.resetForm();
                      setEditValue(null);
                      setIssueYear("");
                      setIssueMonth("");
                      setCount(0);
                    }}
                    className="site-button add-btn button-sm"
                  >
                    Add
                  </button>
                )}
              </div>
              <p className="c_content_desc">
                Add details of patents you have filed.
              </p>

              {!loading && patentList
                ? patentList.map((c) => (
                    <div className="mt-2 text-break text-justify">
                      {c.title ? (
                        <b>
                          <span className="c_content_subheader">{c.title}</span>
                        </b>
                      ) : (
                        ""
                      )}
                      &nbsp;
                      <span className="c_content_details">
                        <Link
                          to={"#"}
                          data-toggle="modal"
                          data-target="#patent"
                          className="edit-icon"
                          title="Click to edit or Remove Patent"
                          onClick={(e: any) => {
                            e.preventDefault();
                            setDisedt(c.title);
                            c.issued_ts
                              ? setIssueYear({
                                  label: `${GetYearFromTimeStamp(c.issued_ts)}`,
                                  value: `${GetYearFromTimeStamp(c.issued_ts)}`,
                                })
                              : setIssueYear(null);
                            c.issued_ts
                              ? setIssueMonth({
                                  label: `${GetMonthNameFromTimeStamp(
                                    c.issued_ts,
                                    false
                                  )}`,
                                  value: GetMonthNameFromTimeStamp(
                                    c.issued_ts,
                                    false,
                                    true
                                  ),
                                })
                              : setIssueMonth(null);
                            setPatent(true);
                            c.issued_ts
                              ? setFieldValue("status", "Patent issued")
                              : setFieldValue("status", "Patent pending");
                            setEditValue(c);
                            setDisedt(c.title);
                          }}
                        >
                          <BsPencil />
                        </Link>
                        &nbsp;
                      </span>
                      <div className="c_content_details">
                        {c.uri ? (
                          <div>
                            <a
                              className="text-break text-justify"
                              href={`//${c.uri}`}
                              target="_blank"
                            >
                              {c.uri}
                            </a>
                          </div>
                        ) : (
                          ""
                        )}
                        <div>
                          Patent Office :
                          {c.office ? (
                            <span className="text-break text-justify">
                              {" "}
                              {c.office}
                            </span>
                          ) : (
                            <span> Not mentioned</span>
                          )}
                        </div>
                        <span>Application Number :</span>
                        {c.app_no ? (
                          <span className="text-break text-justify">
                            {" "}
                            {c.app_no}
                          </span>
                        ) : (
                          <span> Not mentioned</span>
                        )}
                        <div>
                          Issued On:
                          {c.issued_ts ? (
                            <span>
                              {" "}
                              {GetMonthNameFromTimeStamp(c.issued_ts, false)}
                            </span>
                          ) : (
                            <span> Not mentioned</span>
                          )}
                          {c.issued_ts ? (
                            <span> {GetYearFromTimeStamp(c.issued_ts)}</span>
                          ) : (
                            ""
                          )}
                        </div>
                        {c.desc ? (
                          <div className="text-break text-justify">
                            {" "}
                            {c.desc}
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  ))
                : ""}

              <Modal
                className="modal fade browse-job modal-bx-info editor"
                backdrop="static"
                show={patent}
                onHide={() => {
                  setEditValue(null);
                  handleHidePatent();
                }}
              >
                <div className="modal-dialog my-0" role="document">
                  <div className="modal-content">
                    <div className="modal-body">
                      <div className="modal-custom-header">
                        <h5
                          className="modal-title text-truncate text-ellipsis"
                          id="PatentModalLongTitle"
                        >
                          {editvalue ? (
                            <span title={`${editvalue.title}`}>
                              Edit-{disedt}
                            </span>
                          ) : (
                            `Add Patent`
                          )}
                        </h5>
                        {editvalue && (
                          <button
                            className="btn btn-sm btn-danger d-block d-md-inline-block mr-md-2 mb-2 mb-md-0 ml-auto"
                            type="button"
                            title="Delete"
                            onClick={() => {
                              setEditValue(null);
                              setPatent(false);
                              handleDeleteSwal(values._id);
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
                            setEditValue(null);
                            setPatent(false);
                            resetForm();
                            setIssueYear("");
                            setIssueMonth("");
                            setCount(0);
                          }}
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <p className="modal-custom-desc">
                        Add details of Patents you have filed.
                      </p>
                      <form onSubmit={handleSubmit}>
                        <div className="row">
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>
                                Patent Title
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <Field
                                name="title"
                                type="text"
                                className="form-control"
                                maxLength={150}
                                placeholder="Enter Title"
                                title={values.title ? values.title : ""}
                              />

                              {errors.title && touched.title ? (
                                <p className="form-error">{errors.title}</p>
                              ) : null}
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>
                                URL <span style={{ color: "red" }}>*</span>
                              </label>
                              <Field
                                name="uri"
                                type="text"
                                maxLength={500}
                                className="form-control"
                                placeholder="www.google.com"
                                title={values.uri ? values.uri : ""}
                              />
                              {errors.uri && touched.uri ? (
                                <p className="form-error">{errors.uri}</p>
                              ) : null}
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>Patent Office</label>
                              <Field
                                name="office"
                                type="text"
                                maxLength={150}
                                className="form-control"
                                placeholder="Enter Patent Office"
                                title={values.office ? values.office : ""}
                              />
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>Status</label>
                              <div className="row">
                                <div className="col-lg-6 col-md-6">
                                  <div className="custom-control custom-radio">
                                    <input
                                      type="radio"
                                      name="status"
                                      checked={
                                        values.status === "Patent issued"
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={"Patent issued"}
                                      className="custom-control-input"
                                      id="check2"
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="check2"
                                    >
                                      Patent Issued
                                    </label>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6">
                                  <div className="custom-control custom-radio">
                                    <input
                                      type="radio"
                                      name="status"
                                      checked={
                                        values.status === "Patent pending"
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={"Patent pending"}
                                      onClick={() => {
                                        setIssueYear("");
                                        setIssueMonth("");
                                        setFieldValue();
                                      }}
                                      className="custom-control-input"
                                      id="check3"
                                    />
                                    <label
                                      className="custom-control-label"
                                      htmlFor="check3"
                                    >
                                      Patent pending
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>Application Number</label>
                              <Field
                                type="text"
                                name="app_no"
                                className="form-control"
                                maxLength={150}
                                placeholder="Enter Application Number"
                                title={values.app_no ? values.app_no : null}
                              />
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12">
                            {values.status === "Patent issued" && (
                              <div className="form-group">
                                <label>Issued Date</label>
                                <div className="row">
                                  <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                    <Select
                                      maxMenuHeight={200}
                                      className={` ${
                                        formik.touched.PublishedOnYear &&
                                        formik.errors.PublishedOnYear
                                          ? "dropstyle border-red-400"
                                          : "dropstyle"
                                      }`}
                                      name="PublishedOnYear"
                                      placeholder="Year"
                                      options={year}
                                      isClearable={true}
                                      styles={customStyles}
                                      value={issueYear}
                                      onChange={(option: any) => {
                                        if (
                                          Number(option?.label) ===
                                          new Date().getFullYear()
                                        ) {
                                          setmonths(
                                            GetFutureOrPastMonths(
                                              new Date().getFullYear(),
                                              months,
                                              true
                                            )
                                          );
                                        } else {
                                          GetMonths();
                                        }
                                        handleIssueYear(option);
                                        let event = {
                                          target: {
                                            name: "PublishedOnYear",
                                            value: option?.label,
                                          },
                                        };
                                        handleChange(event);
                                        // setFieldValue(
                                        //   "PublishedOnYear",
                                        //   option?.label
                                        // );
                                      }}
                                    />
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                    <Select
                                      maxMenuHeight={200}
                                      className={` ${
                                        formik.touched.PublishedOn &&
                                        formik.errors.PublishedOn
                                          ? "dropstyle border-red-400"
                                          : "dropstyle"
                                      }`}
                                      styles={customStyles}
                                      name="PublishedOn"
                                      placeholder="Month"
                                      options={months}
                                      isClearable={true}
                                      value={issueMonth}
                                      onChange={(option: any) => {
                                        handleIssueMonth(option);
                                        let event = {
                                          target: {
                                            name: "PublishedOn",
                                            value: option?.value,
                                          },
                                        };
                                        handleChange(event);
                                        // setFieldValue(
                                        //   "PublishedOn",
                                        //   option?.value
                                        // );
                                      }}
                                    />
                                    {errors.PublishedOn &&
                                    touched.PublishedOn ? (
                                      <p className="form-error">
                                        {errors.PublishedOn}
                                      </p>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group ">
                              <label>Description</label>
                              <Field
                                as="textarea"
                                name="desc"
                                className="form-control"
                                maxLength={500}
                                value={values.desc}
                                onChange={(e: any) => {
                                  handleChange(e);
                                  setCount(e.target.value.length);
                                }}
                                placeholder="Type Description"
                                title={values.desc ? values.desc : ""}
                              />
                              <span className="custom-char-count">
                                {values?.desc?.length
                                  ? 500 - values.desc.length
                                  : 500 - count}{" "}
                                Character(s) Left
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="modal-custom-footer">
                          <button
                            type="button"
                            className="site-button site-warning-button"
                            onClick={() => {
                              setPatent(false);
                              setEditValue(null);
                              resetForm();
                              setIssueYear("");
                              setIssueMonth("");
                              setCount(0);
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
            </div>
          );
        }}
      </Formik>
    </>
  );
}

export default Patent;
