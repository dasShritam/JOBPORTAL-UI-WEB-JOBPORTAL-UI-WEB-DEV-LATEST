import React from "react";
import { useEffect, useState } from "react";
import { Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
// import { UseToastAlert } from "../../../../hooks/useToastAlert";
import { useDispatch, useSelector } from "react-redux";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import { profileStrength } from "../../../redux/features/manage-account/profile/BasicDetailsSlice";
import { getJobSeekerrData } from "../../../redux/features/manage-account/profile/JsSlice";
import {
  patchUpdateResumeHeadline,
  resetResumeHeadline,
} from "../../../redux/features/manage-account/Registration/ResumeHandleSlice";
import { values } from "pdf-lib";

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

function LastStep(props: any) {
  const [count, setCount] = useState(0);
  const [resume, setResume] = useState(true);
  const [bindonload, setBindOnload] = useState<any>();
  const [resumeheadline, setResumeHeadline] = useState<any>();
  const handleHideResume = () => {
    setResume(false);
  };
  const pflStrength = useSelector((state: any) => state.profileStrength);
  const updatedResumeHeadline: any = useSelector(
    (state: any) => state.updateResumeHeadline
  );
  const { UpdatedResumeHeadline, loading1, error1 } = updatedResumeHeadline;
  const dispatch = useDispatch();
  const showSnackAlert = UseToastAlert();

  const JobSeekerProfileData = useSelector(
    (state: any) => state.JobSeekerProfile2
  );
  const { JobSeekerProfile, loading, error } = JobSeekerProfileData;
  const resumeLsData = useSelector((state: any) => state.ResumeDatax);
  const { rmArray } = resumeLsData;
  useEffect(() => {
    if (rmArray?.code == 200 && Object.keys(rmArray?.data?.headline)) {
      setBindOnload({ headline: rmArray?.data?.headline });
    } else {
      setBindOnload({ headline: "" });
    }
  }, [rmArray]);

  useEffect(() => {
    if (UpdatedResumeHeadline.code === 200) {
      showSnackAlert("success", UpdatedResumeHeadline.message, 200);
      dispatch(profileStrength());
      dispatch(getJobSeekerrData());
      dispatch(resetResumeHeadline());
    }
  }, [UpdatedResumeHeadline]);

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
          dispatch(patchUpdateResumeHeadline(values));
          props.hide();
          props.next();
        }}
        isInitialValid={false}
      >
        {(formik: any) => {
          const {
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            isValid,
            errors,
          } = formik;
        
          return (
            <>
              <div className="" role="">
                <Form onSubmit={handleSubmit}>
                  <div className="">
                    <div className="">
                      <div className="">
                        <h5 className="modal-title mt-3" id="">
                          Add headline and preferences
                        </h5>
                      </div>
                      <p className="modal-custom-desc mb-4">
                        Add preferences to get relevant job recommendations &
                        make your profile stronger.
                      </p>
                      <h6 className="modal-title " id="">
                        Resume Headline <span style={{ color: "red" }}>*</span>
                      </h6>

                      <div className="row">
                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <textarea
                              placeholder="Minimum 20 characters. Add resume headline and preferences to make your profile stronger and get relevant  job recommendations."
                              maxLength={250}
                              style={{
                                resize: "none",
                                height: "120px !important",
                              }}
                              name="headline"
                              onChange={(e: any) => {
                                setCount(e.target.value.length);
                                handleChange(e);
                              }}
                              value={values.headline ? values.headline : ""}
                              className={` form-control txtbx_css ${
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
                      <button type="submit" className="site-button mt-3 mb-2">
                        Finish
                      </button>
                    </div>
                  </div>
                </Form>
              </div>
            </>
          );
        }}
      </Formik>
    </>
  );
}

export default LastStep;
