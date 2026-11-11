import { Formik } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import { Form, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  DeletePublication,
  PatchPublication,
} from "../../../../../redux/features/manage-account/profile/WhitePaperSlice";
import Select from "react-select";
import {
  GetFutureOrPastMonths,
  GetMonthNameFromTimeStamp,
  GetYearFromTimeStamp,
  customStyles,
} from "../../../../../common/common";
import { UseToastAlert } from "../../../../../hooks/useToastAlert";
import Swal from "sweetalert2";
import { getJobSeekerrData } from "../../../../../redux/features/manage-account/profile/JsSlice";
import { BsPencil } from "react-icons/bs";
import { environment } from "../../../../../environments/environment";
import { regex } from "../../../../../common/validation";

interface state {
  id: string;
  title: string;
  uri: string;
  year: object | null;
  month: object | null;
  desc: string;
}
interface form {
  _id: string;
  title: string;
  uri: string;
  publ_ts: number;
  desc: string;
}

let INITIAL_FORM_STATE: state = {
  id: "",
  title: "",
  uri: "",
  year: null,
  month: null,
  desc: "",
};

const FORM_VALIDATION = Yup.object().shape({
  title: Yup.string()
    .required(
      "Please add White Paper / Research Publication / Journal Entry Title."
    )
    .trim(""),

  uri: Yup.string()
    .required("Please add URL.")
    .matches(regex.url, "Please enter a valid URL."),
  year: Yup.object().nullable().notRequired(),
  month: Yup.object()
    .when("year", {
      is: (year: any) => year !== null,
      then: Yup.object().required("Please enter Month.").nullable(),
      otherwise: Yup.object().nullable(),
    })
    .notRequired()
    .nullable(),
  desc: Yup.string().notRequired(),
});

function WhitePaper() {
  const deletePublication = useSelector(
    (state: any) => state.deletePublication
  );
  const [deleteid, setDeleteid] = useState("");
  const dispatch = useDispatch();
  const publicationDetails = useSelector((state: any) => state.publication);
  const [count, setCount] = useState(0);
  const yearmonthMasterdata = useSelector(
    (state: any) => state.yearmonthMasterdata
  );
  const JobSeekerProfileData = useSelector(
    (state: any) => state.JobSeekerProfile2
  );
  const { JobSeekerProfile, loading } = JobSeekerProfileData;
  const [formValues, setFormValues] = useState<form[]>([]);
  const [editValue, setEditValue] = useState<state>();
  const [whitepaper, setWhitePaper] = useState(false);
  const [yearoption, setYearoption] = useState([]);
  const [monthoption, setmonthoption] = useState([]);
  const handleHideWhitePaper = () => {
    setWhitePaper(false);
  };

  const getMonthOptions = () => {
    if (yearmonthMasterdata?.allYearMonth.length > 0) {
      yearmonthMasterdata?.allYearMonth?.map((opt: any) => {
        if (opt.group === "GTMO") {
          let options: any = [];
          opt.data.map((item: any) => {
            options.push({ value: item.value, label: item.value });
          });
          setmonthoption(options);
        }
      });
    }
  };

  function handleDeleteSwal() {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, You will not be able to recover this Record!",
      showCancelButton: true,
      confirmButtonColor: "#2a9f2a ",
      cancelButtonColor: "#db1919 ",
      confirmButtonText: "Yes, Delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(DeletePublication(deleteid));
        setWhitePaper(false);
      }
    });
  }
  useEffect(() => {
    if (yearmonthMasterdata?.allYearMonth.length > 0) {
      yearmonthMasterdata?.allYearMonth?.map((opt: any) => {
        if (opt.group === "PAYE") {
          let options: any = [];
          opt.data.map((item: any) => {
            options.push({ value: item, label: item });
          });
          setYearoption(options.reverse());
        }
      });
    }
    getMonthOptions();
  }, [JobSeekerProfile?.js_profile?.publications]);

  useEffect(() => {
    if (deletePublication.message.code === 200) {
      showSnackAlert("success", deletePublication.message.message);
      dispatch(getJobSeekerrData());
      setDeleteid("");
    } else if (deletePublication.message.code !== 200) {
    }
  }, [deletePublication?.message]);
  useEffect(() => {
    setFormValues(JobSeekerProfile?.js_profile?.publications);
    setDeleteid("");
  }, [JobSeekerProfile.js_profile]);

  const showSnackAlert = UseToastAlert();
  useEffect(() => {
    if (publicationDetails.res.code === 200) {
      showSnackAlert("success", publicationDetails.res.message);
      dispatch(getJobSeekerrData());
    }
  }, [publicationDetails?.res]);
  return (
    <div className="list-line">
      <div className="d-flex">
        <h6 className="c_content_inner_header">
          White Paper / Research Publication / Journal Entry
        </h6>
        {formValues?.length <
          Number(
            environment.Jobseeker_Profile_Data_Limits.white_paper_limit
          ) && (
          <button
            type="button"
            onClick={() => {
              setWhitePaper(true);
              setEditValue(undefined);

              setCount(0);
              getMonthOptions();
            }}
            className="site-button add-btn button-sm"
          >
            Add
          </button>
        )}
      </div>
      <p className="c_content_desc">Add links to your online publications.</p>

      <div className="savedValues">
        <>
          {!loading && formValues
            ? formValues.map((value, i) => {
                return (
                  <div className="mt-2" style={{ fontSize: "15px" }} key={i}>
                    <ul key={i}>
                      <div className="c_content_subheader">
                        <span>
                          <b className="text-break">{value.title}</b>
                        </span>
                        <BsPencil
                          className="edit-icon"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            if (
                              GetYearFromTimeStamp(value.publ_ts) ===
                              new Date().getFullYear()
                            ) {
                              setmonthoption(
                                GetFutureOrPastMonths(
                                  new Date().getFullYear(),
                                  monthoption,
                                  true
                                )
                              );
                            } else {
                              getMonthOptions();
                            }

                            setDeleteid(value._id);
                            setEditValue(() => {
                              return {
                                id: value._id,
                                desc: value.desc,
                                month: value.publ_ts
                                  ? {
                                      value: GetMonthNameFromTimeStamp(
                                        value.publ_ts,
                                        false
                                      ),
                                      label: GetMonthNameFromTimeStamp(
                                        value.publ_ts,
                                        false
                                      ),
                                    }
                                  : null,
                                year: value.publ_ts
                                  ? {
                                      value: String(
                                        GetYearFromTimeStamp(value.publ_ts)
                                      ),
                                      label: String(
                                        GetYearFromTimeStamp(value.publ_ts)
                                      ),
                                    }
                                  : null,
                                title: value.title,
                                uri: value.uri,
                              };
                            });

                            setWhitePaper(true);
                          }}
                        ></BsPencil>
                      </div>
                      <div className="c_content_details">
                        <a
                          href={`//${value.uri}`}
                          className="text-break"
                          target="_blank"
                        >
                          {value.uri}
                        </a>
                      </div>
                      <div className="c_content_details">
                        Published on:{" "}
                        {value.publ_ts && value.publ_ts
                          ? `${GetMonthNameFromTimeStamp(
                              value.publ_ts,
                              false
                            )} ${GetYearFromTimeStamp(value.publ_ts)}`
                          : "Not mentioned"}
                      </div>
                      <div className="text-break c_content_details">
                        {value.desc}
                      </div>
                    </ul>
                  </div>
                );
              })
            : ""}
        </>
      </div>

      <Modal
        className="modal fade browse-job modal-bx-info editor"
        show={whitepaper}
        backdrop="static"
        onHide={handleHideWhitePaper}
      >
        <div className="modal-dialog my-0" role="document">
          <div className="modal-content">
            <Formik
              initialValues={
                editValue || {
                  ...INITIAL_FORM_STATE,
                }
              }
              enableReinitialize={true}
              validationSchema={FORM_VALIDATION}
              onSubmit={(values, { resetForm }) => {
                const dummy = formValues;

                if (editValue) {
                  setFormValues([...dummy]);

                  dispatch(PatchPublication(values));
                } else {
                  dispatch(PatchPublication(values));
                }

                resetForm();
                setWhitePaper(false);
              }}
              isInitialValid={false}
            >
              {(formik: any) => {
                const {
                  values,
                  handleChange,
                  handleSubmit,
                  errors,
                  touched,
                  handleBlur,
                } = formik;
                return (
                  <Form>
                    <div className="modal-body">
                      <div className="modal-custom-header">
                        <h5
                          className="modal-title"
                          id="JournalentryModalLongTitle"
                        >
                          White Paper / Research Publication / Journal Entry
                        </h5>

                        {editValue && (
                          <button
                            className="site-button btn-sm bg-danger"
                            type="button"
                            onClick={handleDeleteSwal}
                          >
                            Delete
                          </button>
                        )}
                        <button
                          type="button"
                          className="close"
                          onClick={() => setWhitePaper(false)}
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      Add links to your projects (e.g. Github links, etc.).
                      <form className="mt-3">
                        <div className="row">
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>
                                Title <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="title"
                                maxLength={150}
                                onBlur={handleBlur}
                                onChange={(e) => {
                                  handleChange(e);
                                }}
                                placeholder="Enter Title"
                                value={values.title}
                              />
                              {errors.title && touched.title ? (
                                <p className="form-error">{errors.title} </p>
                              ) : null}
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>
                                URL <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="uri"
                                maxLength={500}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                placeholder="www.google.com"
                                value={values.uri}
                              />
                              {errors.uri && touched.uri ? (
                                <p className="form-error">{errors.uri} </p>
                              ) : null}
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>Published On</label>
                              <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                  <Select
                                    placeholder="Year"
                                    isSearchable={true}
                                    isClearable={true}
                                    isDisabled={false}
                                    maxMenuHeight={200}
                                    options={yearoption}
                                    value={values.year}
                                    name="year"
                                    onChange={(selectedOption: any) => {
                                      let event = {
                                        target: {
                                          name: "year",
                                          value: selectedOption,
                                        },
                                      };

                                      handleChange(event);
                                      if (
                                        selectedOption?.label ===
                                        new Date().getFullYear()
                                      ) {
                                        setmonthoption(
                                          GetFutureOrPastMonths(
                                            new Date().getFullYear(),
                                            monthoption,
                                            true
                                          )
                                        );
                                      } else {
                                        getMonthOptions();
                                      }
                                      values.month = null;
                                    }}
                                    className="dropstyle"
                                    styles={customStyles}
                                  />
                                  {errors.year && touched.year ? (
                                    <p className="form-error">{errors.year} </p>
                                  ) : null}
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                  <Select
                                    maxMenuHeight={200}
                                    placeholder="Month"
                                    isSearchable={true}
                                    isClearable
                                    isDisabled={false}
                                    options={monthoption}
                                    value={values.month}
                                    name="month"
                                    onChange={(selectedOption: any) => {
                                      let event = {
                                        target: {
                                          name: "month",
                                          value: selectedOption,
                                        },
                                      };

                                      handleChange(event);
                                    }}
                                    className="dropstyle"
                                    styles={customStyles}
                                  />
                                  {errors.month && touched.month ? (
                                    <p className="form-error">
                                      {errors.month}{" "}
                                    </p>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>Description</label>
                              <textarea
                                className="form-control"
                                name="desc"
                                onChange={(e: any) => {
                                  handleChange(e);
                                  setCount(e.target.value.length);
                                }}
                                maxLength={500}
                                placeholder="Type Description"
                                value={values.desc}
                              ></textarea>
                              <span className="custom-char-count">
                                {values.desc.length
                                  ? 500 - values.desc.length
                                  : 500 - count}{" "}
                                Character(s) Left
                              </span>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="modal-custom-footer">
                      <button
                        type="button"
                        className="site-button site-warning-button"
                        onClick={() => {
                          setWhitePaper(false);
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="site-button"
                        onClick={() => {
                          handleSubmit(values);
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default WhitePaper;
