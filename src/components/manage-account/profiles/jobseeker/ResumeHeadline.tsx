import { useEffect, useState } from "react";
import { Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { UseToastAlert } from "../../../../hooks/useToastAlert";
import { useDispatch, useSelector } from "react-redux";
import {
  patchUpdateResumeHeadline,
  resetResumeHeadline,
} from "../../../../redux/features/manage-account/Registration/ResumeHandleSlice";
import { getJobSeekerrData } from "../../../../redux/features/manage-account/profile/JsSlice";
import { BsPencil } from "react-icons/bs";
import { profileStrength } from "../../../../redux/features/manage-account/profile/BasicDetailsSlice";

interface resumeheadlinetype {
  headline: string;
}

const INITIAL_FORM_STATE: resumeheadlinetype = {
  headline: " ",
};
const FORM_VALIDATION = Yup.object().shape({
  headline: Yup.string()
    .nullable()
    .required("Resume Headline is required.")
    .trim("Empty space not allowed.")
    .min(20, "Minimum 20 characters are required.")
    .max(300),
});
type propsState = {
  displayModel?: boolean;
  trigger?: any;
};

function ResumeHeadline({ displayModel, trigger }: propsState) {
  const [count, setCount] = useState(0);
  const [hideResumeContent, setHideResumeContent] = useState(true);
  const [resume, setResume] = useState(false);
  const [bindonload, setBindOnload] = useState<any>();
  const [resumeheadline, setResumeHeadline] = useState<any>();
  const handleHideResume = () => {
    setResume(false);
  };
  const pflStrength = useSelector((state: any) => state.profileStrength);
  const updatedResumeHeadline: any = useSelector(
    (state: any) => state.updateResumeHeadline
  );
  const { UpdatedResumeHeadline } = updatedResumeHeadline;
  const dispatch = useDispatch();
  const showSnackAlert = UseToastAlert();

  const JobSeekerProfileData = useSelector(
    (state: any) => state.JobSeekerProfile2
  );
  const { JobSeekerProfile, loading } = JobSeekerProfileData;
  useEffect(() => {
    if (UpdatedResumeHeadline.code === 200) {
      showSnackAlert("success", UpdatedResumeHeadline.message, 200);
      dispatch(profileStrength());
      dispatch(getJobSeekerrData());
      dispatch(resetResumeHeadline());
    }
  }, [UpdatedResumeHeadline]);

  useEffect(() => {
    if (displayModel === true) {
      setResume(true);
      setHideResumeContent(false);
    } else {
      setHideResumeContent(true);
    }
  }, [displayModel]);

  useEffect(() => {
    setResumeHeadline(JobSeekerProfile.js_profile?.career_profile?.headline);
    setCount(JobSeekerProfile?.js_profile?.career_profile?.headline?.length);
  }, [JobSeekerProfile?.js_profile, resume]);

  return (
    <>
      <style>
        {` .border-red-400{
      border:1px solid red;
  `}
      </style>

      <Formik
        initialValues={bindonload || { ...INITIAL_FORM_STATE }}
        validationSchema={FORM_VALIDATION}
        enableReinitialize={true}
        onSubmit={(values: any) => {
          setResumeHeadline(values.headline);
          setResume(false);
          dispatch(patchUpdateResumeHeadline(values));
        }}
        isInitialValid={false}
      >
        {(formik: any) => {
          const { handleSubmit, handleChange, values, touched, errors } =
            formik;

          return (
            <>
              <Modal
                show={resume}
                backdrop="static"
                onHide={() => {
                  formik.resetForm();
                  handleHideResume();
                  trigger && trigger(false);
                }}
                className="modal browse-job fade modal-bx-info editor"
              >
                <div className="modal-dialog my-0" role="document">
                  <Form onSubmit={handleSubmit}>
                    <div className="modal-content">
                      <div className="modal-body">
                        <div className="modal-custom-header">
                          <h5
                            className="modal-title"
                            id="ResumeheadlineModalLongTitle"
                          >
                            Resume Headline
                          </h5>

                          <button
                            type="button"
                            className="close"
                            onClick={() => {
                              trigger && trigger(false);
                              setResume(false);
                              formik.resetForm();
                              // setResumeHeadline(values.headline);
                            }}
                          >
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <p className="modal-custom-desc">
                          It is the first thing recruiters notice in your
                          profile. Write concisely what makes you unique and
                          right person for the job you are looking for.
                        </p>

                        <div className="row">
                          <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                              <textarea
                                placeholder="Minimum 20 characters. Sample headlines: Sales Manager well versed in Excel and Dynamics CRM. Senior-level Interior Designer with expertise in 3D Modelling."
                                maxLength={250}
                                style={{ resize: "none" }}
                                name="headline"
                                onChange={(e: any) => {
                                  setCount(e.target.value.length);

                                  handleChange(e);
                                }}
                                value={values.headline ? values.headline : ""}
                                className={` form-control ${
                                  formik.touched.headline &&
                                  formik.errors.headline
                                    ? "border-red-400"
                                    : ""
                                }`}
                              ></textarea>
                              <span className="custom-char-count">
                                {count ? 250 - count : 250} Character(s) left
                              </span>

                              {touched.headline && errors.headline ? (
                                <p className="form-error">{errors.headline}</p>
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
                            setResume(false);
                            setBindOnload({ headline: resumeheadline });
                            formik.resetForm();
                            trigger && trigger(false);
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
              {hideResumeContent && (
                <div id="resume_headline_bx" className=" job-bx bg-white m-b30">
                  <>
                    <div className="d-flex">
                      <h5 className="m-b15 c_content_header">
                        Resume Headline
                        <span className="font-14">
                          {pflStrength?.pflStrnRes?.data?.profileWeightage
                            ?.headline
                            ? ` (${pflStrength?.pflStrnRes?.data?.profileWeightage?.headline}%)`
                            : ""}
                        </span>
                      </h5>
                      <Link
                        to={"#"}
                        className="edit-icon"
                        title="Click here to update your resume headline."
                        onClick={() => {
                          setResume(true);
                          setBindOnload({ headline: resumeheadline });
                        }}
                      >
                        <BsPencil />
                      </Link>
                    </div>
                    {!loading && resumeheadline ? (
                      <p className="c_content_subheader text-break text-justify">
                        {resumeheadline}
                      </p>
                    ) : (
                      ""
                    )}{" "}
                  </>
                </div>
              )}
            </>
          );
        }}
      </Formik>
    </>
  );
}

export default ResumeHeadline;
