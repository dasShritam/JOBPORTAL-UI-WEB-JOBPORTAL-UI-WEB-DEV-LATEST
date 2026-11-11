import Select from "react-select";
import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Formik, Field } from "formik";
import * as Yup from "yup";

import {
  GetYearFromTimeStamp,
  GetMonthNameFromTimeStamp,
  GetFutureOrPastMonths,
  customStyles,
} from "../../../../../common/common";
import { useDispatch, useSelector } from "react-redux";
import { UseToastAlert } from "../../../../../hooks/useToastAlert";
import {
  DeleteWorkSample,
  PatchWorkSample,
} from "../../../../../redux/features/manage-account/profile/WorkSampleSlice";
import { getJobSeekerrData } from "../../../../../redux/features/manage-account/profile/JsSlice";
import Swal from "sweetalert2";
import { BsPencil } from "react-icons/bs";
import { environment } from "../../../../../environments/environment";
import { regex } from "../../../../../common/validation";

interface OptionsTypes {
  value: string;
  label: string | number;
}
interface worksampletype {
  _id?: string;
  WorkTitle: string;
  uri: string;
  DurationFrom: OptionsTypes | null;
  DurationFrommonth: OptionsTypes | null;
  DurationTo: OptionsTypes | null;
  DurationTomonth: OptionsTypes | null;
  checkbox: boolean;
  Description: string | undefined;
}

const INITIAL_FORM_STATE: worksampletype = {
  WorkTitle: "",
  uri: "",
  DurationFrom: null,
  DurationFrommonth: null,
  DurationTo: null,
  DurationTomonth: null,
  checkbox: true,
  Description: "",
};

const PATENT_FORM_VALIDATION = Yup.object().shape({
  WorkTitle: Yup.string().required("Please add Work Title.").trim(""),
  uri: Yup.string()
    .required("Please add URL.")
    .matches(regex.url, "Please enter valid URL."),
  DurationFrom: Yup.object()
    .nullable()
    .notRequired()
    .when("checkbox", {
      is: false,
      then: Yup.object().required("Please select Year.").nullable(),
    }),
  DurationFrommonth: Yup.object()
    .notRequired()
    .nullable()
    .when("DurationFrom", {
      is: (DurationFrom: any) => DurationFrom !== null,
      then: Yup.object().required("Please select Month.").nullable(),
      otherwise: Yup.object().nullable(),
    }),
  checkbox: Yup.boolean().notRequired(),
  DurationTo: Yup.object()
    .nullable()
    .when("checkbox", {
      is: false,
      then: Yup.object()
        .required("Please specify a Valid Date Range.")
        .nullable(),
    })
    .notRequired(),
  DurationTomonth: Yup.object()
    .nullable()
    .when("DurationTo", {
      is: (DurationTo: any) => DurationTo !== null,
      then: Yup.object().required("Please select Month.").nullable(),
      otherwise: Yup.object().nullable(),
    })
    .notRequired(),
  Description: Yup.string().notRequired(),
});

function WorkSample() {
  const [worksample, setWorkSample] = useState(false);
  const handleHideWorkSample = () => {
    setWorkSample(false);
  };
  const [checked, setChecked] = useState(true);
  const [count, setCount] = useState(0);
  const [editvalue, setEditValue] = useState<any>();
  const [dateError, setDateError] = useState<boolean>();

  const JobSeekerProfileData = useSelector(
    (state: any) => state.JobSeekerProfile2
  );
  const { JobSeekerProfile, loading } = JobSeekerProfileData;
  const workSampleDetails = useSelector((state: any) => state.workSample);

  const deleteWorksample = useSelector((state: any) => state.deleteworksample);
  const yearmonthMasterdata = useSelector(
    (state: any) => state.yearmonthMasterdata
  );
  const [deleteid, setDeleteid] = useState("");
  const [worksampleList, setworksampleList] = useState<any>([]);

  const dispatch = useDispatch();
  const showSnackAlert = UseToastAlert();
  const [fromyearoption, setFromyearoption] = useState([]);
  const [toyearoption, setToyearoption] = useState([]);
  const [frommonthoption, setFrommonthoption] = useState([]);
  const [tomonthoption, setTomonthoption] = useState([]);

  const getFromMonthOptions = () => {
    if (yearmonthMasterdata?.allYearMonth.length > 0) {
      yearmonthMasterdata?.allYearMonth?.map((opt: any) => {
        if (opt.group === "GTMO") {
          let options: any = [];
          opt.data.map((item: any) => {
            options.push({ value: item.value, label: item.value });
          });
          setFrommonthoption(options);
        }
      });
    }
  };
  const getToMonthOptions = () => {
    if (yearmonthMasterdata?.allYearMonth.length > 0) {
      yearmonthMasterdata?.allYearMonth?.map((opt: any) => {
        if (opt.group === "GTMO") {
          let options: any = [];
          opt.data.map((item: any) => {
            options.push({ value: item.value, label: item.value });
          });
          setTomonthoption(options);
        }
      });
    }
  };

  useEffect(() => {
    if (yearmonthMasterdata?.allYearMonth.length > 0) {
      yearmonthMasterdata?.allYearMonth?.map((opt: any) => {
        if (opt.group === "PAYE") {
          let options: any = [];
          opt.data.map((item: any) => {
            options.push({ value: item, label: item });
          });
          setFromyearoption(options);
          setToyearoption(options.reverse());
        }
      });
    }
    getFromMonthOptions();
    getToMonthOptions();
  }, [JobSeekerProfile?.js_profile?.work_sample]);
  useEffect(() => {
    if (workSampleDetails.res.code === 200) {
      showSnackAlert("success", workSampleDetails.res.message);
      dispatch(getJobSeekerrData());
    }
  }, [workSampleDetails?.res]);
  useEffect(() => {
    if (deleteWorksample.message.code === 200) {
      showSnackAlert("success", deleteWorksample.message.message);
      dispatch(getJobSeekerrData());
      setDeleteid("");
    }
  }, [deleteWorksample?.message]);
  useEffect(() => {
    setworksampleList(JobSeekerProfile?.js_profile?.work_sample);
    setDeleteid("");
  }, [JobSeekerProfile?.js_profile?.work_sample]);

  const validate = (values: worksampletype) => {
    const isFirefox = /Firefox/.test(navigator.userAgent);
    let endDate: string = "";
    let startDate: string = "";
    if (values.DurationFrommonth && values.DurationFrom) {
      if (!isFirefox) {
        startDate = new Date(
          `  ${values.DurationFrom.label}/  ${
            values.DurationFrommonth.value + 2
          }/ 1,`
        )
          .toISOString()
          // .toDateString()
          .slice(0, 10);
      } else {
        startDate = new Date(
          `  ${values.DurationFrom.label}/  ${values.DurationFrommonth.value}/ 1,`
        )
          // .toISOString()
          .toDateString()
          .slice(0, 10);
      }
    }
    if (values.DurationTo && values.DurationTomonth) {
      if (!isFirefox) {
        endDate = new Date(
          ` ${values.DurationTo.value} /${values.DurationTomonth.value + 2}, 1`
        )
          .toISOString()
          // .toDateString()
          .slice(0, 10);
      } else {
        endDate = new Date(
          ` ${values.DurationTo.value} /${values.DurationTomonth.value}, 1`
        )
          // .toISOString()
          .toDateString()
          .slice(0, 10);
      }
    }
    if (
      endDate !== "" &&
      new Date(
        ` ${values?.DurationTo?.value} /${values?.DurationTomonth?.value}, 1`
      ) <
        new Date(
          `  ${values?.DurationFrom?.label}/  ${values?.DurationFrommonth?.value}/ 1,`
        )
    ) {
      setDateError(true);
    } else {
      setDateError(false);
    }
  };
  const handleDeleteSwal = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, You will not be able to recover this Record!",
      showCancelButton: true,
      confirmButtonColor: "#2a9f2a ",
      cancelButtonColor: "#db1919 ",
      confirmButtonText: "Yes, Delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(DeleteWorkSample(deleteid));
        setWorkSample(false);
      }
    });
  };

  const handleCheck = () => {
    setChecked(!checked);
  };

  return (
    <>
      <Formik
        initialValues={
          editvalue || {
            ...INITIAL_FORM_STATE,
          }
        }
        enableReinitialize={true}
        validate={validate}
        validationSchema={PATENT_FORM_VALIDATION}
        onSubmit={(values: worksampletype, { resetForm }) => {
          dispatch(PatchWorkSample(values));
          resetForm();
          setEditValue(null);
          setWorkSample(false);
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
          } = formik;
          return (
            <div className="list-line ">
              <div className="d-flex">
                <h6 className="c_content_inner_header">Work Sample</h6>
                {worksampleList?.length <
                  environment.Jobseeker_Profile_Data_Limits
                    .white_paper_limit && (
                  <button
                    type="button"
                    onClick={() => {
                      // getFromMonthOptions()
                      // getToMonthOptions()
                      setWorkSample(true);
                      setEditValue(undefined);

                      setChecked(true);
                      formik.resetForm();
                      setCount(0);
                    }}
                    className="site-button add-btn button-sm"
                  >
                    Add
                  </button>
                )}
              </div>
              <p className="c_content_desc">
                Add link to your projects (e.g. Github links etc.).
              </p>
              {/* {list} */}
              {!loading && worksampleList
                ? worksampleList.map((data: any) => {
                    return (
                      <div className="mb-2">
                        <span className="c_content_subheader">
                          <b className="text-break">{data.title}</b> &nbsp;
                          <BsPencil
                            className="edit-icon"
                            title="Click here to edit or delete work sample"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              if (
                                GetYearFromTimeStamp(data.start_ts) ===
                                new Date().getFullYear()
                              ) {
                                setFrommonthoption(
                                  GetFutureOrPastMonths(
                                    new Date().getFullYear(),
                                    frommonthoption,
                                    true
                                  )
                                );
                                formik.values.DurationFrommonth = "";
                              } else {
                                getFromMonthOptions();
                              }
                              if (
                                GetYearFromTimeStamp(data.end_ts) ===
                                new Date().getFullYear()
                              ) {
                                setTomonthoption(
                                  GetFutureOrPastMonths(
                                    new Date().getFullYear(),
                                    frommonthoption,
                                    true
                                  )
                                );
                                formik.values.DurationTomonth = "";
                              } else {
                                getToMonthOptions();
                              }

                              setCount(0);
                              setDeleteid(data._id);
                              setEditValue(() => {
                                return {
                                  id: data._id,
                                  WorkTitle: data.title,
                                  Description: data.desc,
                                  uri: data.uri.toLowerCase(),
                                  DurationFrom: data.start_ts
                                    ? {
                                        value: String(
                                          GetYearFromTimeStamp(data.start_ts)
                                        ),
                                        label: String(
                                          GetYearFromTimeStamp(data.start_ts)
                                        ),
                                      }
                                    : null,
                                  DurationFrommonth: data.start_ts
                                    ? {
                                        value: GetMonthNameFromTimeStamp(
                                          data.start_ts,
                                          false
                                        ),
                                        label: GetMonthNameFromTimeStamp(
                                          data.start_ts,
                                          false
                                        ),
                                      }
                                    : null,
                                  DurationTo: data.end_ts
                                    ? {
                                        value: String(
                                          GetYearFromTimeStamp(data.end_ts)
                                        ),
                                        label: String(
                                          GetYearFromTimeStamp(data.end_ts)
                                        ),
                                      }
                                    : null,
                                  DurationTomonth: data.end_ts
                                    ? {
                                        value: GetMonthNameFromTimeStamp(
                                          data.end_ts,
                                          false
                                        ),
                                        label: GetMonthNameFromTimeStamp(
                                          data.end_ts,
                                          false
                                        ),
                                      }
                                    : null,
                                };
                              });

                              {
                                !data.end_ts
                                  ? setChecked(true)
                                  : setChecked(false);
                              }
                              {
                                !data.end_ts
                                  ? setFieldValue("checkbox", true)
                                  : setFieldValue("checkbox", false);
                              }

                              setWorkSample(true);
                            }}
                          />
                        </span>
                        <div className="c_content_details">
                          <a
                            href={`//${data.uri}`}
                            className="text-break"
                            target="_blank"
                          >
                            {data.uri}
                          </a>
                        </div>
                        <div className="c_content_details">
                          Duration:{" "}
                          {data.start_ts
                            ? data.end_ts
                              ? `${GetMonthNameFromTimeStamp(
                                  data.start_ts,
                                  false
                                )} ${GetYearFromTimeStamp(
                                  data.start_ts
                                )} - ${GetMonthNameFromTimeStamp(
                                  data.end_ts,
                                  false
                                )} ${GetYearFromTimeStamp(data.end_ts)}\
                                              `
                              : `${GetMonthNameFromTimeStamp(
                                  data.start_ts,
                                  false
                                )} ${GetYearFromTimeStamp(
                                  data.start_ts
                                )} - present`
                            : "Not mentioned"}
                        </div>
                        <span className="text-break c_content_details">
                          {data.desc}
                        </span>
                      </div>
                    );
                  })
                : ""}
              <Modal
                className="modal fade browse-job modal-bx-info editor "
                show={worksample}
                backdrop="static"
                onHide={() => {
                  handleHideWorkSample();
                  formik.resetForm();
                }}
              >
                <div className="modal-dialog my-0" role="document">
                  <div className="modal-content">
                    <div className="modal-body">
                      <div className="modal-custom-header">
                        <h5 className="modal-title">Work Sample</h5>

                        {editvalue && (
                          <button
                            className="site-button btn-sm bg-danger btn btn-sm btn-danger d-block d-md-inline-block mr-md-2 mb-2 mb-md-0 ml-auto"
                            type="button"
                            title="Delete"
                            onClick={handleDeleteSwal}
                          >
                            Delete
                          </button>
                        )}

                        <button
                          type="button"
                          className="close"
                          title="Close"
                          onClick={() => {
                            setWorkSample(false);
                            formik.resetForm();
                          }}
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <form>
                        <div className="row">
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>
                                Work Title{" "}
                                <span style={{ color: "red" }}>*</span>
                              </label>
                              <Field
                                type="text"
                                name="WorkTitle"
                                className="form-control"
                                placeholder="Enter Work Title"
                                maxLength={150}
                              />
                              {errors.WorkTitle && touched.WorkTitle ? (
                                <p className="form-error">{errors.WorkTitle}</p>
                              ) : null}
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>
                                URL <span style={{ color: "red" }}>*</span>
                              </label>
                              <Field
                                type="text"
                                name="uri"
                                className="form-control"
                                placeholder="www.google.com"
                                maxLength={500}
                              />
                              {errors.uri && touched.uri ? (
                                <p className="form-error">{errors.uri}</p>
                              ) : null}
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>Duration From</label>
                              <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-6  dropstyle">
                                  <Select
                                    maxMenuHeight={200}
                                    name="DurationFrom"
                                    options={fromyearoption}
                                    isClearable={true}
                                    placeholder="Year"
                                    styles={customStyles}
                                    value={formik.values.DurationFrom}
                                    onChange={(option: any) => {
                                      let event = {
                                        target: {
                                          name: "DurationFrom",
                                          value: option,
                                        },
                                      };
                                      handleChange(event);
                                      formik.values.DurationFrommonth = null;
                                      if (
                                        Number(option?.label) ===
                                        new Date().getFullYear()
                                      ) {
                                        setFrommonthoption(
                                          GetFutureOrPastMonths(
                                            new Date().getFullYear(),
                                            frommonthoption,
                                            true
                                          )
                                        );
                                      } else {
                                        getFromMonthOptions();
                                      }
                                    }}
                                  />
                                  {errors.DurationFrom &&
                                  touched.DurationFrom ? (
                                    <p className="form-error">
                                      {errors.DurationFrom}
                                    </p>
                                  ) : null}
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6  dropstyle">
                                  <Select
                                    placeholder="Month"
                                    maxMenuHeight={200}
                                    id="myMonthDrop"
                                    name="DurationFrommonth"
                                    options={frommonthoption}
                                    isClearable={true}
                                    styles={customStyles}
                                    value={formik.values.DurationFrommonth}
                                    onChange={(option: any) => {
                                      let event = {
                                        target: {
                                          name: "DurationFrommonth",
                                          value: option,
                                        },
                                      };
                                      handleChange(event);
                                    }}
                                  />
                                  {errors.DurationFrommonth &&
                                  touched.DurationFrommonth ? (
                                    <p className="form-error">
                                      {errors.DurationFrommonth}
                                    </p>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </div>

                          {!checked && (
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>Duration To</label>
                                <div className="row">
                                  <div className="col-lg-6 col-md-6 col-sm-6  dropstyle">
                                    <Select
                                      placeholder="Year"
                                      maxMenuHeight={200}
                                      name="DurationTo"
                                      options={toyearoption}
                                      isClearable={true}
                                      styles={customStyles}
                                      value={formik.values.DurationTo}
                                      onChange={(option: any) => {
                                        formik.values.DurationTomonth = null;
                                        setFieldValue("DurationTo", option);
                                        if (
                                          Number(option?.label) ===
                                          new Date().getFullYear()
                                        ) {
                                          setTomonthoption(
                                            GetFutureOrPastMonths(
                                              new Date().getFullYear(),
                                              frommonthoption,
                                              true
                                            )
                                          );
                                        } else {
                                          getToMonthOptions();
                                        }
                                      }}
                                    />
                                    {!dateError &&
                                    errors.DurationTo &&
                                    touched.DurationTo ? (
                                      <p className="form-error">
                                        {errors.DurationTo}
                                      </p>
                                    ) : null}
                                    {!values.checkbox && dateError && (
                                      <p className="form-error">
                                        End year must be greater than start
                                        year.
                                      </p>
                                    )}
                                  </div>
                                  <div className="col-lg-6 col-md-6 col-sm-6  dropstyle">
                                    <Select
                                      placeholder="Month"
                                      maxMenuHeight={200}
                                      id="myMonthDrop"
                                      name="DurationTomonth"
                                      options={tomonthoption}
                                      styles={customStyles}
                                      isClearable={true}
                                      value={formik.values.DurationTomonth}
                                      onChange={(option: any) => {
                                        setFieldValue(
                                          "DurationTomonth",
                                          option
                                        );
                                      }}
                                    />
                                    {errors.DurationTomonth &&
                                    touched.DurationTomonth ? (
                                      <p className="form-error">
                                        {errors.DurationTomonth}
                                      </p>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <div className="custom-control custom-checkbox">
                                <Field
                                  type="checkbox"
                                  name="checkbox"
                                  checked={checked}
                                  onChange={(e: any) => {
                                    handleChange(e);
                                    handleCheck();
                                    if (e.target.checked) {
                                      setFieldValue("DurationTo", null);
                                      setFieldValue("DurationTomonth", null);
                                    }
                                  }}
                                  onClick={() => {
                                    setDateError(false);
                                  }}
                                  className="custom-control-input"
                                  id="check1"
                                />
                                <label
                                  className="custom-control-label"
                                  htmlFor="check1"
                                >
                                  I am currently working on this
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>Description</label>
                              <Field
                                as="textarea"
                                name="Description"
                                className="form-control"
                                onChange={(e: any) => {
                                  handleChange(e);
                                  setCount(e.target.value.length);
                                }}
                                minLength={10}
                                maxLength={500}
                                placeholder="Type Description"
                              />

                              <span className="custom-char-count">
                                {values.Description.length
                                  ? 500 - values.Description.length
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
                          setWorkSample(false);
                          formik.resetForm();
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="site-button"
                        onClick={() => {
                          !dateError && handleSubmit(values);
                        }}
                      >
                        Save
                      </button>
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

export default WorkSample;
