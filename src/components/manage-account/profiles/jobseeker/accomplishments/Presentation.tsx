import { Formik } from "formik";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { UseToastAlert } from "../../../../../hooks/useToastAlert";
import { getJobSeekerrData } from "../../../../../redux/features/manage-account/profile/JsSlice";
import {
  deletePresentationDetail,
  resetDeletePresentationSl,
  resetPresentationSl,
  updatePresentationDetails,
} from "../../../../../redux/features/manage-account/profile/Presentation";
import { BsPencil } from "react-icons/bs";
import "../../../../../assets/customCss/Projects.css";
import Swal from "sweetalert2";
import { environment } from "../../../../../environments/environment";
import { regex } from "../../../../../common/validation";

const INITIAL_FORM_STATE = {
  _id: "",
  title: "",
  uri: "",
  desc: "",
};

const FORM_VALIDATION = Yup.object().shape({
  _id: Yup.string().notRequired(),
  title: Yup.string().required("Please enter Presentation Title."),
  uri: Yup.string()
    .matches(regex.url, "Please enter a valid URL.")
    .required("Please enter URL."),
  desc: Yup.string().notRequired(),
});
function Presentation() {
  const [presentation, setPresentation] = useState(false);
  const [presentationDataList, setPresentationDataList] = useState<any>([]);
  const [formValue, setFormValue] = useState<any>(null);
  const [deletepopup, setdeletePopup] = useState(false);
  const [count, setCount] = useState<any>();

  const presentationDetails = useSelector(
    (state: any) => state.presentationDetails
  );
  const deletePresentationDetails = useSelector(
    (state: any) => state.deletePresentationDetails
  );

  const { PresentationDetails, Persentationloading } = presentationDetails;

  const { PresentationDetailsRes, deletePresentationLoading } =
    deletePresentationDetails;

  const dispatch = useDispatch();

  const showSnackAlert = UseToastAlert();

  const JobSeekerProfileData = useSelector(
    (state: any) => state.JobSeekerProfile2
  );

  const { JobSeekerProfile, loading } = JobSeekerProfileData;

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
        handleDeleteProfile(formValue);
      }
    });
  };

  const handleDeleteProfile = (formValue) => {
    dispatch(deletePresentationDetail(formValue._id));
    setPresentation(false);
  };

  useEffect(() => {
    if (PresentationDetails.message) {
      if (!loading && PresentationDetails.code === 200) {
        // setChipKeyValues(UpdatedSkills?.data[0]);
        showSnackAlert("success", PresentationDetails.message);
        dispatch(getJobSeekerrData());
        dispatch(resetPresentationSl());
      }
      if (PresentationDetails.code === 500) {
        showSnackAlert("error", PresentationDetails.message);
        dispatch(resetPresentationSl());
      }
      if (PresentationDetails.code === 206) {
        showSnackAlert("warning", PresentationDetails.message);
        dispatch(resetPresentationSl());
      }
    }
  }, [PresentationDetails?.code, Persentationloading]);

  useEffect(() => {
    if (PresentationDetailsRes) {
      if (!loading && PresentationDetailsRes.code === 200) {
        showSnackAlert("success", PresentationDetailsRes.message);
        dispatch(getJobSeekerrData());
        dispatch(resetDeletePresentationSl());
      }
      if (PresentationDetailsRes.code === 500) {
        showSnackAlert("error", PresentationDetailsRes.message);
        dispatch(resetDeletePresentationSl());
      }
      if (PresentationDetailsRes.code === 206) {
        showSnackAlert("warning", PresentationDetailsRes.message);
        dispatch(resetDeletePresentationSl());
      }
    }
  }, [PresentationDetailsRes?.code, deletePresentationLoading]);

  useEffect(() => {
    setPresentationDataList(JobSeekerProfile?.js_profile?.online_ppt);
  }, [JobSeekerProfile.js_profile]);

  const handelCancelBtn = () => {
    setPresentation(false);
  };

  return (
    <>
      <Formik
        initialValues={formValue || { ...INITIAL_FORM_STATE }}
        enableReinitialize={true}
        validationSchema={FORM_VALIDATION}
        onSubmit={(values, { resetForm }) => {
          const presentationData: any = {
            title: values.title,
            desc: values.desc,
            uri: values.uri,
          };
          if (formValue) {
            presentationData["_id"] = formValue._id;
            dispatch(updatePresentationDetails(presentationData));
            setFormValue(null);
            resetForm();
            setPresentation(false);
          } else {
            dispatch(updatePresentationDetails(presentationData));
            setPresentation(false);
            resetForm();
          }
        }}
        isInitialValid={false}
      >
        {(formik: any) => {
          const { resetForm, values, handleChange, handleSubmit, handleBlur } =
            formik;
          return (
            <div className="list-line">
              <div className="d-flex">
                <h6 className="c_content_inner_header">Presentation</h6>
                {presentationDataList?.length <
                  environment.Jobseeker_Profile_Data_Limits
                    .presentation_limit && (
                  <button
                    onClick={() => {
                      setCount(0);
                      setPresentation(true);
                      setFormValue(null);
                    }}
                    className="site-button add-btn button-sm"
                  >
                    Add
                  </button>
                )}
              </div>
              <p className="c_content_desc">
                Add links to your online presentations (e.g. Slideshare
                presentation links etc.).
              </p>
              {!loading && presentationDataList
                ? presentationDataList.map((presentation: any) => {
                    return (
                      <div>
                        <div className="c_content_subheader">
                          <b>
                            <span style={{ wordWrap: "break-word" }}>
                              {presentation.title}
                            </span>
                          </b>
                          <Link
                            to={"#"}
                            className="edit-icon"
                            title="Click here to update Presentation Details"
                            onClick={() => {
                              setFormValue(presentation);
                              setCount(presentation.desc.length);
                              setPresentation(true);
                            }}
                          >
                            <BsPencil />
                          </Link>
                        </div>
                        <div className="c_content_details">
                          <a
                            href={`//${presentation.uri}`}
                            target="_blank"
                            className="text-break"
                          >
                            {" "}
                            {presentation.uri}
                          </a>
                        </div>
                        <span
                          style={{ wordWrap: "break-word" }}
                          className="c_content_details"
                        >
                          {presentation.desc}
                        </span>
                        <br />
                        <br />
                      </div>
                    );
                  })
                : ""}

              <Modal
                className="modal fade browse-job modal-bx-info editor"
                id="presentation"
                backdrop="static"
                show={presentation}
                onHide={() => {
                  setFormValue(null);
                  formik.resetForm();
                  setPresentation(false);
                }}
              >
                <div className="modal-dialog my-0" role="document">
                  <div className="modal-content">
                    <div className="modal-body">
                      <div className="modal-custom-header">
                        <h5
                          className="modal-title"
                          id="PresentationModalLongTitle"
                        >
                          Presentation
                        </h5>
                        {formValue && (
                          <button
                            className="btn btn-sm btn-danger d-block d-md-inline-block mr-md-2 mb-2 mb-md-0 ml-auto"
                            type="button"
                            onClick={() => {
                              handleDeleteSwal(values._id);
                            }}
                          >
                            Delete
                          </button>
                        )}
                        <button
                          type="button"
                          className="close"
                          onClick={() => {
                            formik.resetForm();
                            setPresentation(false);
                          }}
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <form onSubmit={handleSubmit}>
                        <div className="row">
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>Title</label>
                              <span style={{ color: "red" }}>*</span>
                              <input
                                type="text"
                                name="title"
                                maxLength={150}
                                onBlur={handleBlur}
                                className={`form-control  ${
                                  formik.touched.title && formik.errors.title
                                    ? "border-red-400"
                                    : ""
                                }`}
                                value={formik.values.title}
                                onChange={handleChange}
                                placeholder="Enter Title"
                              />
                              {formik.touched.title && formik.errors.title ? (
                                <p className="form-error">
                                  {formik.errors.title}
                                </p>
                              ) : null}
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>URL</label>
                              <span style={{ color: "red" }}>*</span>
                              <input
                                type="text"
                                onBlur={handleBlur}
                                maxLength={500}
                                className={`form-control  ${
                                  formik.touched.uri && formik.errors.uri
                                    ? "border-red-400"
                                    : ""
                                }`}
                                name="uri"
                                value={formik.values.uri}
                                onChange={handleChange}
                                placeholder="www.google.com"
                              />
                              {formik.touched.uri && formik.errors.uri ? (
                                <p className="form-error">
                                  {formik.errors.uri}
                                </p>
                              ) : null}
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>Description</label>
                              <textarea
                                maxLength={500}
                                className={`form-control  ${
                                  formik.touched.desc && formik.errors.desc
                                    ? "border-red-400"
                                    : ""
                                }`}
                                name="desc"
                                value={formik.values.desc}
                                onChange={(e) => {
                                  setCount(e.target.value.length);
                                  handleChange(e);
                                }}
                                placeholder="Type Description"
                              ></textarea>
                              <span className="custom-char-count">
                                {500 - count} Character(s) left
                              </span>
                              {formik.touched.desc && formik.errors.desc ? (
                                <p className="form-error">
                                  {formik.errors.desc}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </div>
                        <div className="modal-custom-footer">
                          <button
                            type="button"
                            className="site-button site-warning-button"
                            data-dismiss="modal"
                            onClick={() => {
                              resetForm();
                              handelCancelBtn();
                              setFormValue(null);
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
              {
                <Modal
                  show={deletepopup}
                  onHide={() => {
                    setdeletePopup(false);
                  }}
                  className="modal fade modal-bx-info editor"
                >
                  <div
                    className="modal-dialog my-0 deleteModal"
                    role="document"
                  >
                    <div className="modal-content ">
                      <div className="modal-header">
                        <h5
                          className="modal-title"
                          id="KeyskillsModalLongTitle"
                          style={{
                            marginTop: "13px",
                            marginLeft: "10px",
                            color: "#6060b4",
                            fontSize: "15px",
                          }}
                        >
                          Presentation
                        </h5>
                        <button
                          type="button"
                          className="close"
                          onClick={() => {
                            setdeletePopup(false);
                          }}
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>

                      <div className="modal-body">
                        <div className="col-lg-12 col-md-6">
                          <h6>
                            Are you sure you want to delete Presentation ?
                          </h6>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="site-button"
                          onClick={() => {
                            setdeletePopup(false);
                          }}
                        >
                          Cancel{" "}
                        </button>
                        <button
                          type="button"
                          className="site-button"
                          onClick={(c: any) => {
                            setdeletePopup(false);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </Modal>
              }
            </div>
          );
        }}
      </Formik>
    </>
  );
}

export default Presentation;
