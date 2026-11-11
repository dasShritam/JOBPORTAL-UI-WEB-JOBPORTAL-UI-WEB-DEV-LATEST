import { Formik, Form } from "formik";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { UseToastAlert } from "../../../../hooks/useToastAlert";
import { getJobSeekerrData } from "../../../../redux/features/manage-account/profile/JsSlice";
import { patchUpdateProfileSummary } from "../../../../redux/features/manage-account/Registration/ProfileSummarySlice";
import { BsPencil } from "react-icons/bs";
import { profileStrength } from "../../../../redux/features/manage-account/profile/BasicDetailsSlice";
interface profilesummarytype {
  summary: string;
}

const INITIAL_FORM_STATE: profilesummarytype = {
  summary: " ",
};

const FORM_VALIDATION = Yup.object().shape({
  summary: Yup.string()
    .required("Profile Summary is required.")
    .min(50, "Minimum 50 characters are required.")
    .nullable()
    .trim("Empty space not allowed."),
});
type propsState = {
  displayModel?: boolean;
  change?: any;
};

function ProfileSummary({ displayModel, change }: propsState) {
  const [display, setDisplay] = useState(false);
  const [value, setValue] = useState();
  const [profilesummary, setProfileSummary] = useState(false);

  const [count, setCount] = useState<number>(0);
  const [summary, setSummary] = useState<any>();

  const updatedProfileSummary: any = useSelector(
    (state: any) => state.updateProfileSummary
  );
  const { UpdatedProfileSummary } = updatedProfileSummary;
  const dispatch = useDispatch();
  const showSnackAlert = UseToastAlert();

  const JobSeekerProfileData = useSelector(
    (state: any) => state.JobSeekerProfile2
  );
  const { JobSeekerProfile, loading } = JobSeekerProfileData;
  const [hideSummary, setHideSummary] = useState(true);

  const pflStrength = useSelector((state: any) => state.profileStrength);

  useEffect(() => {
    if (displayModel === true) {
      setProfileSummary(true);
      setHideSummary(false);
    } else {
      setHideSummary(true);
    }
  }, [displayModel]);

  useEffect(() => {
    if (UpdatedProfileSummary.code === 200 && display) {
      setDisplay(false);
      showSnackAlert("success", UpdatedProfileSummary.message, 200);
      dispatch(getJobSeekerrData());
      dispatch(profileStrength());
    }
  }, [UpdatedProfileSummary]);

  useEffect(() => {
    setSummary(JobSeekerProfile?.js_profile?.career_profile?.summary);
    setValue(JobSeekerProfile);
    setCount(JobSeekerProfile?.js_profile?.career_profile?.summary?.length);
  }, [JobSeekerProfile?.js_profile, profilesummary]);

  const handleHideProfileSummary = () => {
    setProfileSummary(false);
  };

  return (
    <Formik
      initialValues={value || { ...INITIAL_FORM_STATE }}
      validationSchema={FORM_VALIDATION}
      enableReinitialize={true}
      onSubmit={(values: any) => {
        setDisplay(true);
        setSummary(values.summary);
        setProfileSummary(false);
        dispatch(patchUpdateProfileSummary(values));
      }}
    >
      {(formik: any) => {
        const {
          setFieldValue,
          handleSubmit,
          handleChange,
          values,
          touched,
          errors,
        } = formik;

        return (
          <>
            <Modal
              className="modal fade browse-job modal-bx-info editor"
              show={profilesummary}
              backdrop="static"
              onHide={() => {
                formik.resetForm();
                handleHideProfileSummary();
              }}
            >
              <div className="modal-dialog my-0" role="document">
                <Form onSubmit={handleSubmit}>
                  <div className="modal-content">
                    <div className="modal-body">
                      <div className="modal-custom-header">
                        <h5 className="modal-title">Profile Summary</h5>

                        <button
                          type="button"
                          className="close"
                          onClick={() => {
                            change && change(false);
                            formik.resetForm();
                            setProfileSummary(false);
                            setSummary(values.summary);
                          }}
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <p className="modal-custom-desc">
                        Your Profile Summary should mention the highlights of
                        your career and education, what your professional
                        interests are, and what kind of a career you are looking
                        for. Write a meaningful summary of more than 50
                        characters.
                      </p>

                      <div className="row">
                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <textarea
                              maxLength={1000}
                              style={{ resize: "none" }}
                              placeholder="Type here..."
                              name="summary"
                              value={values.summary}
                              onChange={(e: any) => {
                                setCount(e.target.value.length);
                                handleChange(e);
                              }}
                              className={`form-control ${
                                formik.touched.summary && formik.errors.summary
                                  ? "border-red-400"
                                  : ""
                              }`}
                            ></textarea>
                            <span className="custom-char-count">
                              {count ? 1000 - count : 1000} Characters left
                            </span>
                            {errors.summary && touched.summary ? (
                              <p className="form-error">{errors.summary}</p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-custom-footer">
                      <button
                        type="button"
                        className="site-button site-warning-button"
                        onClick={() => {
                          setProfileSummary(false);
                          change && change(false);
                          formik.resetForm();
                        }}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="site-button">
                        Save
                      </button>
                    </div>
                  </div>
                </Form>
              </div>
            </Modal>
            {hideSummary && (
              <div id="profile_summary_bx" className="job-bx bg-white m-b30">
                <div className="d-flex">
                  <h5 className="m-b15 c_content_header">
                    Profile Summary{" "}
                    <span className="font-14">
                      {pflStrength?.pflStrnRes?.data?.profileWeightage
                        ?.prof_summery
                        ? `(${pflStrength?.pflStrnRes?.data?.profileWeightage?.prof_summery}%)`
                        : ""}
                    </span>
                  </h5>
                  <Link
                    to={"#"}
                    title="Click here to update profile summary."
                    onClick={() => {
                      setProfileSummary(true);
                      setSummary(values.summary);
                      setFieldValue("summary", summary);
                      setDisplay(true);
                    }}
                    className="edit-icon"
                  >
                    <BsPencil />
                  </Link>
                </div>
                <p className="c_content_desc">
                  Your Profile Summary should mention the highlights of your
                  career and education, what your professional interests are,
                  and what kind of a career you are looking for. Write a
                  meaningful summary of more than 50 characters.
                </p>
                {!loading && summary ? (
                  <p className="c_content_subheader text-break text-justify">
                    {summary}
                  </p>
                ) : (
                  ""
                )}
              </div>
            )}
          </>
        );
      }}
    </Formik>
  );
}

export default ProfileSummary;
