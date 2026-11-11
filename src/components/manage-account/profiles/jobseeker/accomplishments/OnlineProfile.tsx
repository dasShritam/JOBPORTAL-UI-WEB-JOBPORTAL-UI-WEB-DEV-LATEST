import { useEffect } from "react";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { UseToastAlert } from "../../../../../hooks/useToastAlert";
import {
  deleteOnlineProfile,
  resetDeletedProfileSl,
  resetOnlineProfileSl,
  updateOnlineProfile,
} from "../../../../../redux/features/manage-account/profile/onlineProfileSlice";
import { getJobSeekerrData } from "../../../../../redux/features/manage-account/profile/JsSlice";
import { BsPencil } from "react-icons/bs";
import "../../../../../assets/customCss/Projects.css";
import Swal from "sweetalert2";
import { environment } from "../../../../../environments/environment";
import { regex } from "../../../../../common/validation";
interface profileDetails {
  _id: string;
  name: string;
  uri: string;
  desc: string;
}

const INITIAL_FORM_STATE: profileDetails = {
  _id: "",
  name: "",
  uri: "",
  desc: "",
};

function OnlineProfile() {
  const [onlineprofile, setOnlineProfile] = useState(false);
  const [showdelete, setShowdelete] = useState(false);
  const [profileDetails, setProfileDetails] = useState<profileDetails[]>([]);
  const [formValues, setFormValues] = useState<profileDetails>();
  const [count, setCount] = useState<number>(0);
  const profileData = useSelector((state: any) => state.onlineProfileDetails);

  const onlineProfiles = useSelector(
    (state: any) => state.DeleteProfileDetails
  );
  const { DeleteProfileDetails, loadingDS } = onlineProfiles;

  const { OnlineProfileDetails, loadingState } = profileData;

  const discriptionLimit = 500;

  const dispatch = useDispatch();

  const showSnackAlert = UseToastAlert();

  const JobSeekerProfileData = useSelector(
    (state: any) => state.JobSeekerProfile2
  );

  const { JobSeekerProfile, loading } = JobSeekerProfileData;

  useEffect(() => {
    setProfileDetails(JobSeekerProfile?.js_profile?.social_profile);
  }, [JobSeekerProfile?.js_profile?.social_profile]);

  const handleHideOnlineProfile = () => {
    setOnlineProfile(false);
  };

  useEffect(() => {
    if (OnlineProfileDetails.message) {
      if (!loadingState && OnlineProfileDetails.code === 200) {
        showSnackAlert("success", OnlineProfileDetails.message, 2000);
        dispatch(getJobSeekerrData());
        dispatch(resetOnlineProfileSl());
      }
      if (OnlineProfileDetails.code === 500) {
        showSnackAlert("error", OnlineProfileDetails.message);
        dispatch(resetOnlineProfileSl());
      }
      if (OnlineProfileDetails.code === 206) {
        showSnackAlert("warning", OnlineProfileDetails.message);
        dispatch(resetOnlineProfileSl());
      }
    }
  }, [OnlineProfileDetails?.code, loadingState]);

  useEffect(() => {
    if (DeleteProfileDetails?.code === 200 && !loadingDS) {
      showSnackAlert("success", DeleteProfileDetails.message);
      dispatch(getJobSeekerrData());
      dispatch(resetDeletedProfileSl());
      if (DeleteProfileDetails.code === 206)
        showSnackAlert("warning", DeleteProfileDetails.message);
      dispatch(resetDeletedProfileSl());
    }
  }, [DeleteProfileDetails?.code]);

  const FORM_VALIDATION = Yup.object().shape({
    _id: Yup.string().notRequired(),
    name: Yup.string()
      .required(" Please enter Social Profile Name.")
      .trim("Empty space not allowed."),
    uri: Yup.string()
      .required("Please enter Profile URL.")
      .matches(regex.url, "Please enter valid URL."),
    desc: Yup.string().notRequired(),
  });

  const handleDeleteProfile = (val: any) => {
    if (formValues) {
      Swal.fire({
        title: "Are you sure?",
        text: "Once deleted, You will not be able to recover this Record!",
        showCancelButton: true,
        confirmButtonColor: "#2a9f2a ",
        cancelButtonColor: "#db1919 ",
        confirmButtonText: "Yes, Delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(deleteOnlineProfile(val._id));
        }
      });
    }
    setFormValues(INITIAL_FORM_STATE);
    setOnlineProfile(false);
  };

  return (
    <>
      <Formik
        initialValues={formValues || { ...INITIAL_FORM_STATE }}
        validationSchema={FORM_VALIDATION}
        enableReinitialize={true}
        onSubmit={(values, { resetForm }) => {
          const formData: any = {
            name: values.name,
            desc: values.desc,
            uri: values.uri,
          };
          if (formValues) {
            formData["_id"] = values._id;

            dispatch(updateOnlineProfile(formData));

            setFormValues(INITIAL_FORM_STATE);
            setOnlineProfile(false);
            resetForm();
          } else {
            dispatch(updateOnlineProfile(formData));
            setOnlineProfile(false);
            resetForm();
          }
          resetForm();
        }}
        isInitialValid={false}
      >
        {(formik: any) => {
          const { values, handleSubmit, errors, touched, handleBlur } = formik;

          return (
            <>
              <div className="d-flex">
                <h6 className="c_content_inner_header">Online Profile</h6>
                {profileDetails?.length <
                  Number(
                    environment.Jobseeker_Profile_Data_Limits.online_profile
                  ) && (
                  <button
                    onClick={() => {
                      setShowdelete(false);
                      formik.resetForm();
                      setOnlineProfile(true);
                      setCount(0);
                    }}
                    className="site-button add-btn button-sm"
                  >
                    Add
                  </button>
                )}
              </div>
              <p className="c_content_desc text-break ">
                Add link to online profiles (e.g.
                https://www.facebook.com/leigh.grammer etc.).
              </p>
              <div className="c_inner_div">
                {!loading && profileDetails
                  ? profileDetails.map((profile: profileDetails) => {
                      return (
                        <div>
                          <div className="mt-2">
                            <span className="c_content_subheader">
                              <b className="text-break">{profile.name}</b>
                              <Link
                                to={"#"}
                                onClick={() => {
                                  setShowdelete(true);
                                  setFormValues(profile);
                                  setOnlineProfile(true);
                                  setCount(
                                    discriptionLimit - profile.desc.length
                                  );
                                }}
                                className="edit-icon"
                                title="Click here to update this online profile."
                              >
                                <BsPencil />
                              </Link>
                            </span>
                          </div>
                          <div className="c_content_details">
                            <a
                              href={`//${profile.uri}`}
                              className="text-break"
                              target="_blank"
                            >
                              {profile.uri}
                            </a>
                          </div>
                          <span
                            style={{ wordWrap: "break-word" }}
                            className="c_content_details"
                          >
                            {profile.desc}
                          </span>
                          <br />
                        </div>
                      );
                    })
                  : ""}
              </div>
              <Modal
                className="modal fade browse-job modal-bx-info editor"
                show={onlineprofile}
                backdrop="static"
                onHide={() => {
                  setFormValues(INITIAL_FORM_STATE);
                  formik.resetForm();
                  handleHideOnlineProfile();
                }}
              >
                <div className="modal-dialog my-0" role="document">
                  <div className="modal-content">
                    <div className="modal-body">
                      <div className="modal-custom-header">
                        <h5 className="modal-title">Online Profiles</h5>
                        {showdelete && (
                          <button
                            id="btn_DeleteOnlineProfile"
                            type="button"
                            style={{ marginLeft: "50%" }}
                            className="site-button btn-sm btn-danger pe-none"
                            onClick={() => {
                              setOnlineProfile(false);
                              handleDeleteProfile(values);
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
                            setFormValues(INITIAL_FORM_STATE);
                            setOnlineProfile(false);
                          }}
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <p className="modal-custom-desc">
                        Add links to your social profiles (e.g.
                        https://www.facebook.com/leigh.grammer etc.).
                      </p>
                      <form>
                        <div className="row">
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>Social Profile</label>
                              <span style={{ color: "red" }}>*</span>
                              <input
                                type="text"
                                maxLength={150}
                                onBlur={handleBlur}
                                className={`form-control  ${
                                  touched.name && errors.name
                                    ? "border-red-400"
                                    : ""
                                }`}
                                placeholder="Social Profile Name"
                                name="name"
                                value={values.name}
                                onChange={formik.handleChange}
                              />
                              {errors.name && touched.name ? (
                                <p className="form-error">{errors.name}</p>
                              ) : null}
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>URL</label>
                              <span style={{ color: "red" }}>*</span>
                              <input
                                type="text"
                                maxLength={500}
                                onBlur={handleBlur}
                                className={`form-control  ${
                                  formik.touched.uri && formik.errors.uri
                                    ? "border-red-400"
                                    : ""
                                }`}
                                name="uri"
                                placeholder="www.google.com"
                                value={values.uri}
                                onChange={formik.handleChange}
                              />
                              {errors.uri && touched.uri ? (
                                <p className="form-error">{errors.uri}</p>
                              ) : null}
                            </div>
                          </div>
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <label>Description</label>
                              <textarea
                                maxLength={500}
                                className="form-control"
                                name="desc"
                                placeholder="Type Description"
                                value={values.desc}
                                onChange={(e) => {
                                  setCount(e.target.value.length);
                                  formik.handleChange(e);
                                }}
                              ></textarea>
                              <span
                                className=""
                                style={{
                                  display: "inline-block",
                                  fontSize: "0.85em",
                                  color: "grey",
                                }}
                              >
                                {values.desc.length
                                  ? discriptionLimit - values.desc.length
                                  : discriptionLimit - count}{" "}
                                Character(s) left
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
                          setFormValues(INITIAL_FORM_STATE);
                          setOnlineProfile(false);
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
                  </div>
                </div>
              </Modal>
            </>
          );
        }}
      </Formik>
    </>
  );
}

export default OnlineProfile;
