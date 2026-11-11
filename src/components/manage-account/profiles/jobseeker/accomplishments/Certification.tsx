import { Field, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Select from "react-select";
import Swal from "sweetalert2";
import * as Yup from "yup";
import {
  customStyles,
  GetFutureOrPastMonths,
  GetMonthNameFromTimeStamp,
  GetYearFromTimeStamp,
} from "../../../../../common/common";
import { UseToastAlert } from "../../../../../hooks/useToastAlert";
import {
  deleteCertification,
  patchUpdateCertification,
  resetCertificateSl,
  resetDelete,
} from "../../../../../redux/features/manage-account/profile/CertificationSlice";
import { getJobSeekerrData } from "../../../../../redux/features/manage-account/profile/JsSlice";
import { BsPencil } from "react-icons/bs";
// import { environment } from "../../../../../environments/environment";
import { environment } from "../../../../../environments/environment";
import AsyncCreatableSelect from "react-select/async-creatable";
import {
  certificateNameMasterData,
  certificateProviderMasterData,
} from "../../../../../ApiCall/masterData";
import { BiInfoCircle } from "react-icons/bi";
interface OptionsTypes {
  value: number | string;
  label: string | number;
}

interface CertificateProviderOption {
  label: string;
  value: string;
}

interface CertificateNameOption {
  label: string;
  value: string;
}

interface certificatetype {
  _id: string;
  cert_id: string;
  issued_ts: number;
  expiry_ts: number;
  certName: any;
  issued_by: OptionsTypes | any;
  cname: OptionsTypes | any;
  uri: string;
  FromMonth: OptionsTypes | any;
  FromYear: OptionsTypes | any;
  ToMonth: OptionsTypes | any;
  ToYear: OptionsTypes | any;
  checkbox: boolean;
}

const INITIAL_FORM_STATE: certificatetype = {
  _id: "",
  certName: null,
  issued_by: null,
  cname: null,
  issued_ts: 0,
  expiry_ts: 0,
  cert_id: "",
  uri: "",
  FromMonth: null,
  FromYear: null,
  ToMonth: null,
  ToYear: null,
  checkbox: false,
};

const FORM_VALIDATION = Yup.object().shape({
  cname: Yup.object()
    .required("Please enter your Certification Name.")
    .nullable(),
  issued_by: Yup.object()
    .required("Please mention your Certification Provider.")
    .nullable(),
  cert_id: Yup.string()
    .nullable()
    .notRequired()
    .matches(
      /^[\w_:\-]+$/,
      "Special characters other than _ - : are not allowed."
    ),
  uri: Yup.string()
    .nullable()
    .matches(
      /https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}| HTTPS?:\/\/(?:WWW\.|(?!WWW))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|WWW\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|HTTPS?:\/\/(?:WWW\.|(?!WWW))[a-zA-Z0-9]+\.[^\s]{2,}|WWW\.[a-zA-Z0-9]+\.[^\s]{2,}/,
      "Please enter a valid URL."
    ),
  FromMonth: Yup.object()
    .nullable()
    .when("FromYear", {
      is: (FromYear: any) => FromYear !== null,
      then: Yup.object().required("Please select Month.").nullable(),
      otherwise: Yup.object().nullable(),
    }),
  FromYear: Yup.object().notRequired().nullable(),
  ToMonth: Yup.object()
    .nullable()
    .when("ToYear", {
      is: (ToYear: any) => ToYear !== null,
      then: Yup.object().required("Please select Month.").nullable(),
      otherwise: Yup.object().nullable(),
    }),
  ToYear: Yup.object().notRequired().nullable(),

  checkbox: Yup.boolean().notRequired(),
});

function Certification() {
  const components = {
    DropdownIndicator: null,
  };
  const [certificationHeader, setCertificationHeader] = useState("");
  const [dateError, setDateError] = useState<Boolean>(false);
  const [certificateDeatails, setCertificateDeatails] = useState<any>([]);
  const [check, setCheck] = useState(false);
  const [certification, setCertification] = useState(false);
  const [editvalue, setEditValue] = useState<certificatetype | null>(null);
  const dispatch = useDispatch();
  const showSnackAlert = UseToastAlert();

  const [selectedJoinYear, setSelectedJoinYear] = useState<any>();
  const [selectedJoinMonth, setSelectedJoinMonth] = useState<any>();
  const [selectedToYear, setSelectedToYear] = useState<any>(null);
  const [selectedToMonth, setSelectedToMonth] = useState<any>(null);

  const handleChangeJoiningYear = (e: any) => {
    setSelectedJoinYear(e);
  };
  const handleChangeJoiningMonth = (e: any) => {
    setSelectedJoinMonth(e);
  };
  const handleChangeToYear = (e: any) => {
    setSelectedToYear(e);
  };
  const handleChangeToMonth = (e: any) => {
    setSelectedToMonth(e);
  };

  const handleSetCheck = (isChecked: boolean) => {
    setCheck(isChecked);
    if (isChecked) {
      handleChangeToMonth("");
      handleChangeToYear("");
      setDateError(false);
    }
  };

  /*Binding master data certification provider input filed*/

  const filterProviders = async (inputValue: string) => {
    if (inputValue.length >= 2) {
      const params = { pageNo: 1, search: inputValue, active: 1 };
      const certificateProviderData: any = await certificateProviderMasterData(
        params
      );

      if (certificateProviderData.length) {
        return certificateProviderData.map((certificate) => {
          return { label: certificate.name, value: certificate.name };
        });
      } else {
        return [];
      }
    } else {
      return [];
    }
  };
  const promiseOptions = (inputValue: string) => {
    return new Promise<CertificateProviderOption[]>((resolve) => {
      resolve(filterProviders(inputValue));
    });
  };

  /*Binding master data certification name input filed*/

  const filterNames = async (inputValue: string) => {
    if (inputValue.length >= 2) {
      const params = { pageNo: 1, search: inputValue, active: 1 };
      const certificateNameData: any = await certificateNameMasterData(params);

      if (certificateNameData.length) {
        return certificateNameData.map((certificate) => {
          return { label: certificate.name, value: certificate.name };
        });
      } else {
        return [];
      }
    } else {
      return [];
    }
  };
  const promiseOptions1 = (inputValue: string) => {
    return new Promise<CertificateNameOption[]>((resolve) => {
      resolve(filterNames(inputValue));
    });
  };

  const certificationExpireRef = useRef<any>(null);

  const JobSeekerProfileData = useSelector(
    (state: any) => state.JobSeekerProfile2
  );
  const { JobSeekerProfile, loading } = JobSeekerProfileData;

  const certificationStatus = useSelector(
    (state: any) => state.CertificateStatus
  );
  const { UpdatedCertification, loadingCert } = certificationStatus;

  const certificationDelete = useSelector(
    (state: any) => state.certificationDeleteSl
  );

  const { DeletedCertification, lodingCerti } = certificationDelete;
  useEffect(() => {
    setCertificateDeatails(JobSeekerProfile?.js_profile?.certification);
  }, [JobSeekerProfile?.js_profile?.certification]);

  useEffect(() => {
    if (UpdatedCertification.code) {
      if (!loadingCert && UpdatedCertification.code === 200) {
        showSnackAlert("success", UpdatedCertification.message);
        dispatch(getJobSeekerrData());
        dispatch(resetCertificateSl());
      }
    }
  }, [UpdatedCertification?.code, loadingCert]);

  useEffect(() => {
    if (DeletedCertification.message) {
      if (!lodingCerti && DeletedCertification.code === 200) {
        showSnackAlert("success", DeletedCertification.message);
        dispatch(getJobSeekerrData());
        dispatch(resetDelete());
      } else if (
        DeletedCertification &&
        DeletedCertification.res &&
        DeletedCertification?.res.data.code !== 200
      ) {
        showSnackAlert("warning", DeletedCertification.res.data.message);
        dispatch(resetDelete());
      }
    }
  }, [DeletedCertification?.code, lodingCerti]);

  const validate = (values: certificatetype) => {
    let endDate: string = "";
    let startDate: string = "";
    if (values.FromYear?.label && values.FromMonth?.value) {
      startDate = new Date(
        ` ${values.FromYear.label}, ${values.FromMonth.value + 1}, 1 `
      )
        .toISOString()
        .slice(0, 10);
    }

    if (values.ToYear?.label) {
      if (values.ToMonth?.value) {
        if (values?.ToYear.value !== "" && values?.ToMonth.value !== "") {
          endDate = new Date(
            `${values?.ToYear.label}, ${values?.ToMonth.value + 1}, 1`
          )
            .toISOString()
            .slice(0, 10);
        }
      } else {
        endDate = new Date(Number(values?.ToYear.label), 0, 1)
          .toISOString()
          .slice(0, 10);
      }
    }
    if (endDate !== "" && endDate < startDate) {
      setDateError(true);
    } else {
      setDateError(false);
    }
  };

  const handleHideCertification = () => {
    setCertification(false);
  };

  const deleteHandler = (values: any) => {
    dispatch(deleteCertification(values));
  };

  const setCertificateDeatailsRef = (data: boolean) => {
    if (certificationExpireRef.current != null)
      certificationExpireRef.current.checked = data;
  };

  const handleDeleteSwal = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, You will not be able to recover this Record!",
      showCancelButton: true,
      confirmButtonColor: "#2a9f2a ",
      cancelButtonColor: "#db1919 ",
      confirmButtonText: "Yes, Delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteHandler(id);
      }
    });
  };

  const handleEmpty = () => {
    setEditValue(null);
    setSelectedJoinMonth({ label: "", value: "" });
    setSelectedToMonth("");
    setSelectedToYear("");
    setSelectedJoinYear({ label: "", value: "" });
  };

  const GetValidityLabel = (
    fromTimeStamp: number | null,
    tillTimeStamp: number | null
  ) => {
    let message: string = "";
    if (
      (fromTimeStamp == 0 || fromTimeStamp == null) &&
      (tillTimeStamp == 0 || tillTimeStamp == null)
    ) {
      message = "Validity not mentioned";
      return message;
    }
    message = "Valid from ";
    message += `${GetMonthNameFromTimeStamp(
      Number(fromTimeStamp)
    )} ${GetYearFromTimeStamp(Number(fromTimeStamp))}`;
    if (tillTimeStamp == 0 || tillTimeStamp == null) {
      message += ". does not expire.";
    } else
      message += ` to ${GetMonthNameFromTimeStamp(
        Number(tillTimeStamp)
      )} ${GetYearFromTimeStamp(Number(tillTimeStamp))}`;
    return message;
  };

  const savehandler = (values: any) => {
    if (values._id) {
      const certificateObj: any = {
        name: values.cname.label,
        certificate_id: values.cert_id,
        uri: values.uri?.toLowerCase(),
        fromMonth: selectedJoinMonth ? selectedJoinMonth.label : null,
        fromYear: selectedJoinYear ? selectedJoinYear.label.toString() : null,
        toMonth: selectedToMonth ? selectedToMonth.label : null,
        toYear: selectedToYear ? selectedToYear.label.toString() : null,
        issued_by: values.issued_by.label,
      };

      certificateObj._id = values._id;
      dispatch(patchUpdateCertification(certificateObj));
    }
    else {
      const certificateObj: any = {
        name: values.cname.value,
        certificate_id: values.cert_id,
        uri: values.uri?.toLowerCase(),
        fromMonth: selectedJoinMonth ? selectedJoinMonth.label : null,
        fromYear: selectedJoinYear ? selectedJoinYear.label.toString() : null,
        toMonth: selectedToMonth ? selectedToMonth.label : null,
        toYear: selectedToYear ? selectedToYear.label.toString() : null,
        issued_by: values.issued_by.value,
      };
      dispatch(patchUpdateCertification(certificateObj));
    }


  };

  const yearmonthData = useSelector((state: any) => state.yearmonthMasterdata);
  const { allYearMonth } = yearmonthData;
  /*year month master data */
  const [yearOptions, setYearOptions] = useState<any>([]);
  const [pastyearOptions, setPastYearOptions] = useState<any>([]);
  const [monthOptionsbackUp, setMonthOptionsbackUp] = useState<any>([]);
  const [fromMonthOptions, setFromMonthOptions] = useState<any>([]);
  const [toMonthOptions, setToMonthOptions] = useState<any>([]);

  const GetMoths = () => {
    allYearMonth?.map((opt: any) => {
      if (opt.group === "GTMO") {
        let obj: any = [];
        opt.data.map((item: any) => {
          obj.push({ value: item.id, label: item.value });
        });
        setMonthOptionsbackUp(obj);
        setFromMonthOptions(obj);
        setToMonthOptions(obj);
      }
    });
  };
  useEffect(() => {
    if (allYearMonth) {
      let yearData: any = [];
      allYearMonth?.map((opt: any) => {
        if (opt.group === "FUYE") {
          opt.data.map((item: any, index) => {
            if (index > 0) yearData.push({ value: item, label: item });
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
        }
      });
      GetMoths();
    }
  }, [allYearMonth]);

  // Adding maxlength to certification name
  const MAX_LENGTH = 150;
  const isValidNewOption = (inputValue, selectValue, selectOptions) => {
    if (inputValue.length === 0 || inputValue.length > MAX_LENGTH) {
      return false;
    }
    const isDuplicate = selectOptions.find(
      (option) => option.label === inputValue
    );
    if (isDuplicate) {
      return false;
    }
    return true;
  };

  const [certificateInputValue, setCertificateInputValue] = useState("");
  const handleInputChanges = (newValue: string) => {
    setCertificateInputValue(
      newValue.replace(
        /[^a-zA-Z0-9\- . ', : ! ( ) & + \[ \] \/ \* @ \| ^]*$/,
        ""
      )
    );
  };

  const [certificatePoviderInputValue, setcertificatePoviderInputValue] =
    useState("");
  const handleInputChangescPovider = (newValue: string) => {
    setcertificatePoviderInputValue(
      newValue.replace(
        /[^a-zA-Z0-9\- . ', : ! ( ) & + \[ \] \/ \* @ \| ^]*$/,
        ""
      )
    );
  };

  return (
    <>
      <>
        <Formik
          initialValues={editvalue || { ...INITIAL_FORM_STATE }}
          enableReinitialize={true}
          validate={validate}
          validationSchema={FORM_VALIDATION}
          onSubmit={(values: any, { resetForm }) => {
            if (!dateError) {
              savehandler(values);
              setCertification(false);
              resetForm();
            }

            // setEditValue(null);
          }}
          isInitialValid={false}
        >
          {(formik: any) => {
            const {
              setFieldTouched,
              resetForm,
              values,
              handleChange,
              handleSubmit,
              errors,
              touched,
            } = formik;

            const handelCancelBtn = () => {
              setCertification(false);
            };
            return (
              <div className="list-line">
                <div className="d-flex">
                  <h6 className="c_content_inner_header">Certification</h6>
                  {certificateDeatails?.length <
                    environment.Jobseeker_Profile_Data_Limits
                      .certification_limit && (
                      <button
                        onClick={() => {
                          resetForm();
                          setEditValue(null);
                          setCertification(true);
                          setSelectedJoinMonth(" ");
                          setSelectedJoinYear("");
                          setSelectedToMonth("");
                          setSelectedToYear("");
                          setCertificateInputValue("");
                          setcertificatePoviderInputValue("");
                          setCheck(false);
                        }}
                        className="site-button add-btn button-sm"
                      >
                        Add
                      </button>
                    )}
                </div>
                <p className="c_content_desc">
                  Add details of certifications you have achieved/completed.
                </p>
                {!loading &&
                  certificateDeatails &&
                  certificateDeatails.map((certificate: any, i) => {
                    return (
                      <div className="mt-2 text-break text-justify">
                        <span className="c_content_subheader">
                          <span className="c_content_subheader">
                            <b>{certificate.name}</b>
                          </span>

                          <Link
                            to={"#"}
                            title="Click here to edit certification."
                            className="edit-icon"
                            onClick={() => {
                              setCertification(true);
                              setCertificationHeader(certificate.name);
                              setEditValue({
                                ...certificate,
                                FromMonth: {
                                  label: certificate.issued_ts
                                    ? GetMonthNameFromTimeStamp(
                                      certificate.issued_ts,
                                      false
                                    )
                                    : setSelectedJoinMonth(""),
                                  value: certificate.issued_ts
                                    ? GetMonthNameFromTimeStamp(
                                      certificate.issued_ts,
                                      false,
                                      true
                                    )
                                    : setSelectedJoinMonth(""),
                                },
                                FromYear: {
                                  label: certificate.issued_ts
                                    ? String(
                                      GetYearFromTimeStamp(
                                        certificate.issued_ts
                                      )
                                    )
                                    : setSelectedJoinYear(""),
                                  value: certificate.issued_ts
                                    ? String(
                                      GetYearFromTimeStamp(
                                        certificate.issued_ts
                                      )
                                    )
                                    : setSelectedJoinYear(""),
                                },
                                ToYear: certificate.expire_ts
                                  ? {
                                    label: GetYearFromTimeStamp(
                                      certificate.expire_ts
                                    ),

                                    value: GetYearFromTimeStamp(
                                      certificate.expire_ts
                                    ),
                                  }
                                  : null,
                                ToMonth: certificate.expire_ts
                                  ? {
                                    label: GetMonthNameFromTimeStamp(
                                      certificate.expire_ts,
                                      false
                                    ),
                                    value: GetMonthNameFromTimeStamp(
                                      certificate.expire_ts,
                                      false,
                                      true
                                    ),
                                  }
                                  : null,

                                _id: certificate._id,
                                cert_id: certificate.cert_id,
                                uri: certificate.uri,

                                issued_by: {
                                  label:
                                    JobSeekerProfile?.js_profile?.certification[
                                      i
                                    ].issued_by,
                                  value:
                                    JobSeekerProfile?.js_profile?.certification
                                      .issued_by,
                                },
                                cname: {
                                  label:
                                    JobSeekerProfile?.js_profile?.certification[
                                      i
                                    ].name,
                                  value:
                                    JobSeekerProfile?.js_profile?.certification
                                      .name,
                                },
                                expiry_ts: certificate.expire_ts,
                                issued_ts: certificate.issued_ts,
                                checkbox: certificate.expire_ts ? false : true,
                              });

                              setTimeout(() => {
                                certificationExpireRef != null &&
                                  setCertificateDeatailsRef(
                                    certificate.expire_ts ? false : true
                                  );
                              }, 0);

                              setCheck(certificate.expire_ts ? false : true);
                              if (certificate.issued_ts) {
                                setSelectedJoinYear({
                                  label: certificate.issued_ts
                                    ? String(
                                      GetYearFromTimeStamp(
                                        certificate.issued_ts
                                      )
                                    )
                                    : setSelectedJoinYear(""),
                                  value: certificate.issued_ts
                                    ? String(
                                      GetYearFromTimeStamp(
                                        certificate.issued_ts
                                      )
                                    )
                                    : setSelectedJoinYear(""),
                                });

                                setSelectedJoinMonth({
                                  label: certificate.issued_ts
                                    ? GetMonthNameFromTimeStamp(
                                      certificate.issued_ts,
                                      false
                                    )
                                    : setSelectedJoinMonth(""),
                                  value: certificate.issued_ts
                                    ? GetMonthNameFromTimeStamp(
                                      certificate.issued_ts,
                                      false,
                                      true
                                    )
                                    : setSelectedJoinMonth(""),
                                });
                              }
                              certificate.expire_ts
                                ? setSelectedToMonth({
                                  label: GetMonthNameFromTimeStamp(
                                    certificate.expire_ts,
                                    false
                                  ),
                                  value: GetMonthNameFromTimeStamp(
                                    certificate.expire_ts,
                                    false,
                                    true
                                  ),
                                })
                                : setSelectedToMonth(null);
                              certificate.expire_ts
                                ? setSelectedToYear({
                                  label: GetYearFromTimeStamp(
                                    certificate.expire_ts
                                  ),
                                  value: String(
                                    GetYearFromTimeStamp(
                                      certificate.expire_ts
                                    )
                                  ),
                                })
                                : setSelectedToYear(null);
                            }}
                          >
                            <BsPencil />
                          </Link>
                        </span>
                        <div className="c_content_details d-flex flex-column">
                          <span>
                            <b>{certificate.issued_by}</b>
                          </span>
                          <span>{certificate.cert_id}</span>
                          <span className="c_content_details">
                            <a
                              href={`//${certificate.uri}`}
                              target="_blank"
                              className="text-break"
                            >
                              {certificate.uri}
                            </a>
                          </span>
                          <span>
                            {GetValidityLabel(
                              certificate.issued_ts,
                              certificate.expire_ts
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                <Modal
                  className="modal fade browse-job modal-bx-info editor"
                  show={certification}
                  backdrop="static"
                  onHide={() => {
                    resetForm();
                    handleHideCertification();
                  }}
                >
                  <div className="modal-dialog my-0" role="document">
                    <div className="modal-content">
                      <div className="modal-body">
                        <div className="modal-custom-header">
                          <h5
                            className="modal-title"
                            id="CertificationModalLongTitle"
                          >
                            {editvalue ? (
                              <>
                                <span title={`${editvalue?.cname.label}`}>
                                  Certification -{certificationHeader}
                                </span>
                              </>
                            ) : (
                              `Certifications`
                            )}
                          </h5>

                          {editvalue && (
                            <button
                              type="button"
                              onClick={() => {
                                setCertification(false);
                                handleDeleteSwal(values._id);
                              }}
                              className="btn btn-sm btn-danger d-block d-md-inline-block mr-md-2 mb-2 mb-md-0 ml-auto"
                            >
                              Delete
                            </button>
                          )}

                          <button
                            type="button"
                            className="close"
                            onClick={() => {
                              setCertification(false);
                              handelCancelBtn();
                              resetForm();
                              handleEmpty();
                              setDateError(false);
                            }}
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <p className="modal-custom-desc">
                          Add details of Certifications you have
                          achieved/completed (You can add maximum 5
                          Certifications.)
                        </p>
                        <form onSubmit={handleSubmit}>
                          <div className="row">
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>
                                  Certification Name
                                  <span style={{ color: "red" }}>*</span>
                                </label>
                                <BiInfoCircle
                                  className="mb-1"
                                  title="Special characters other than ( &amp; ( ) _ - + , &quot; ' [ ] { } . ; : / \\ | # % ! ) are not allowed."
                                />
                                <span></span>

                                <AsyncCreatableSelect
                                  onBlur={setFieldTouched}
                                  className={"dropstyle"}
                                  name="cname"
                                  maxMenuHeight={200}
                                  isValidNewOption={isValidNewOption}
                                  noOptionsMessage={() =>
                                    "Enter keyword to search"
                                  }
                                  components={components}
                                  styles={customStyles}
                                  cacheOptions
                                  isClearable={true}
                                  value={
                                    formik?.values?.cname?.label === ""
                                      ? formik?.values?.cname?.label
                                      : formik?.values?.cname
                                  }
                                  onChange={(e: any) => {
                                    let event = {
                                      target: {
                                        name: "cname",
                                        value: e,
                                      },
                                    };
                                    handleChange(event);
                                  }}
                                  placeholder="Please enter your Certification Name"
                                  loadOptions={promiseOptions1}
                                  onInputChange={handleInputChanges}
                                  inputValue={certificateInputValue}
                                />

                                {errors.cname && touched.cname ? (
                                  <p className="form-error">
                                    {"Please enter your Certification Name."}
                                  </p>
                                ) : null}
                              </div>
                            </div>

                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>
                                  Certification Provider
                                  <span style={{ color: "red" }}>*</span>
                                </label>
                                <BiInfoCircle
                                  className="mb-1"
                                  title="Special characters other than ( &amp; ( ) _ - + , &quot; ' [ ] { } . ; : / \\ | # % ! ) are not allowed."
                                />
                                <span></span>
                                <AsyncCreatableSelect
                                  onBlur={setFieldTouched}
                                  className={"dropstyle"}
                                  noOptionsMessage={() =>
                                    "Enter keyword to search"
                                  }
                                  name="issued_by"
                                  isValidNewOption={isValidNewOption}
                                  components={components}
                                  maxMenuHeight={200}
                                  styles={customStyles}
                                  cacheOptions
                                  isClearable={true}
                                  value={
                                    formik?.values?.issued_by?.label === ""
                                      ? formik?.values?.issued_by?.label
                                      : formik?.values?.issued_by
                                  }
                                  // value={issued_by}
                                  onChange={(e: any) => {
                                    let event = {
                                      target: {
                                        name: "issued_by",
                                        value: e,
                                      },
                                    };
                                    handleChange(event);
                                  }}
                                  placeholder="Please mention your Certification Provider"
                                  loadOptions={promiseOptions}
                                  onInputChange={handleInputChangescPovider}
                                  inputValue={certificatePoviderInputValue}
                                />

                                {errors.issued_by && touched.issued_by ? (
                                  <p className="form-error">
                                    {
                                      "Please mention your Certification Provider."
                                    }
                                  </p>
                                ) : null}
                              </div>
                            </div>

                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>Certification Completion ID</label>
                                <Field
                                  type="text"
                                  name="cert_id"
                                  maxLength={50}
                                  className="form-control"
                                  value={values?.cert_id == null ? "" : values?.cert_id}
                                  placeholder="Please enter your certification Completion ID"
                                />
                                {errors.cert_id && touched.cert_id ? (
                                  <p className="form-error">{errors.cert_id}</p>
                                ) : null}
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>Certification URL</label>
                                <Field
                                  maxLength="500"
                                  type="text"
                                  name="uri"
                                  placeholder="Please enter your Certification URL"
                                  className="form-control"
                                  value={values?.uri == null ? "" : values?.uri}
                                />
                                {errors.uri && touched.uri ? (
                                  <p className="form-error">{errors.uri}</p>
                                ) : null}
                              </div>
                            </div>

                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <label>Certification Validity From</label>
                                <div className="row">
                                  <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                    <Select
                                      placeholder="Year"
                                      value={selectedJoinYear}
                                      maxMenuHeight={200}
                                      name="FromYear"
                                      onChange={(selectedOption: any) => {
                                        if (
                                          Number(selectedOption?.label) ==
                                          new Date().getFullYear()
                                        ) {
                                          setFromMonthOptions(
                                            GetFutureOrPastMonths(
                                              new Date().getFullYear(),
                                              monthOptionsbackUp,
                                              true
                                            )
                                          );
                                          values.month = "";
                                        } else {
                                          GetMoths();
                                        }
                                        let event = {
                                          target: {
                                            name: "FromYear",
                                            value: selectedOption,
                                          },
                                        };
                                        handleChange(event);
                                        handleChangeJoiningYear(selectedOption);
                                      }}
                                      menuPlacement="top"
                                      isSearchable={true}
                                      isClearable={true}
                                      options={pastyearOptions}
                                      className={"dropstyle"}
                                      styles={customStyles}
                                    />
                                  </div>

                                  <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                    <Select
                                      placeholder="Month"
                                      value={selectedJoinMonth}
                                      maxMenuHeight={200}
                                      name="FromMonth"
                                      onChange={(selectedOption: any) => {
                                        let event = {
                                          target: {
                                            name: "FromMonth",
                                            value: selectedOption,
                                          },
                                        };
                                        handleChange(event);
                                        handleChangeJoiningMonth(
                                          selectedOption
                                        );
                                      }}
                                      menuPlacement="top"
                                      isSearchable={true}
                                      isClearable={true}
                                      options={fromMonthOptions}
                                      className={"dropstyle"}
                                      styles={customStyles}
                                    />
                                    {touched.FromMonth && errors.FromMonth ? (
                                      <p className="form-error">
                                        {errors.FromMonth}
                                      </p>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {!check ? (
                              <>
                                <div className="col-lg-12 col-md-12">
                                  <div className="form-group">
                                    <label>Certification Validity To</label>

                                    <div className="row">
                                      <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                        <Select
                                          placeholder="Year"
                                          value={selectedToYear}
                                          maxMenuHeight={200}
                                          name="ToYear"
                                          onChange={(selectedOption: any) => {
                                            let event = {
                                              target: {
                                                name: "ToYear",
                                                value: selectedOption,
                                              },
                                            };
                                            handleChange(event);
                                            handleChangeToYear(selectedOption);
                                          }}
                                          menuPlacement="top"
                                          isSearchable={true}
                                          isClearable={true}
                                          options={yearOptions}
                                          className={"dropstyle"}
                                          styles={customStyles}
                                        />
                                        {dateError && (
                                          <p className="form-error">
                                            Certification Validity To must be
                                            greater than Certification Validity
                                            From.
                                          </p>
                                        )}
                                      </div>
                                      <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                                        <Select
                                          placeholder="Month"
                                          value={selectedToMonth}
                                          maxMenuHeight={200}
                                          name="ToMonth"
                                          onChange={(selectedOption: any) => {
                                            let event = {
                                              target: {
                                                name: "ToMonth",
                                                value: selectedOption,
                                              },
                                            };
                                            handleChange(event);
                                            handleChangeToMonth(selectedOption);
                                          }}
                                          menuPlacement="top"
                                          isSearchable={true}
                                          isClearable={true}
                                          options={toMonthOptions}
                                          className={"dropstyle"}
                                          styles={customStyles}
                                        />
                                        {touched.ToMonth && errors.ToMonth ? (
                                          <p className="form-error">
                                            {errors.ToMonth}
                                          </p>
                                        ) : null}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              ""
                            )}
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <div className="custom-control custom-checkbox">
                                  <input
                                    type="checkbox"
                                    className="custom-control-input"
                                    id="check1"
                                    ref={certificationExpireRef}
                                    value={"2344"}
                                    name="checkbox"
                                    onChange={(e: any) => {
                                      handleSetCheck(e.target.checked);
                                      values.checkbox = e.target.checked;
                                    }}
                                  />
                                  <label
                                    className="custom-control-label"
                                    htmlFor="check1"
                                  >
                                    This certification does not expire
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="modal-custom-footer">
                            <div className="cancelbutton">
                              <button
                                type="button"
                                className="site-button site-warning-button"
                                onClick={() => {
                                  setCertification(false);
                                  certificationExpireRef.current.checked =
                                    false;
                                  setCheck(false);
                                  resetForm();
                                  handleEmpty();
                                  setDateError(false);
                                }}
                              >
                                Cancel
                              </button>
                            </div>
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
    </>
  );
}

export default Certification;
