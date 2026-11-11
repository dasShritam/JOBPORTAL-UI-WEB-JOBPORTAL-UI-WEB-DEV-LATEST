import { Formik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Forge from "node-forge";
import { patchResetPassword, resetPwdActionCreator } from "../../../redux/features/authentication/resetPasswordSlice";
import Swal from "sweetalert2";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { environment } from "../../../environments/environment";
import { regex } from "../../../common/validation";
import { Link } from "react-router-dom";

const INITIAL_FORM_STATE: any = {
  Old_Password: "",
  New_Password: "",
  Confirm_Password: "",
};

const FORM_VALIDATION = Yup.object().shape({
  Old_Password: Yup.string()
    .required("Please enter Current Password.")
    .min(8, "Minimum current Password count should be 8 characters.")
    .max(16, "Maximum current Password count should be 16 characters.")
    .matches(
      regex.password,
      "Password should be 8 to 16 characters with at least one special characters (!@#$%^&*?), one numeric, one small case and one upper case letter (i.e. Abcd@123)."
    ),
  New_Password: Yup.string()
    .required("Please enter New Password.")
    .min(8, "Minimum New Password Count should be 8 characters.")
    .max(16, "Maximum New Password Count should be 16 characters.")
    .matches(
      regex.password,
      "Password should be 8 to 16 characters with at least one special characters (!@#$%^&*?), one numeric, one small case and one upper case letter (i.e. Abcd@123)."
    )
    .notOneOf([Yup.ref("Old_Password"), null], "New Password cannot be same as Old Password!"),
  Confirm_Password: Yup.string()
    .required("Please enter Confirm Password.")
    .min(8, "Minimum confirm New Password count should be 8 characters.")
    .max(16, "Maximum confirm New Password count should be 16 characters.")
    .oneOf([Yup.ref("New_Password"), null], "Confirm new Password should be same as New Password!"),
});

let bnr = require("../../../assets/images/common/setPassword.png");
let logo = require("../../../assets/images/Techkri-logo-blue.png");

function ChangePassword() {
  const dispatch = useDispatch();
  const [conpasserr, setConpasserr] = useState("");
  const [togtypeOld, setTogtypeOld] = useState("password");
  const [togtypeNew, setTogtypeNew] = useState("password");
  const [togtypeCon, setTogtypeCon] = useState("password");
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [conPwd, setConPwd] = useState("");
  const [btnSty, setBtnSty] = useState({
    cousor: "",
    class: "",
  });
  const [loading1, setLoading] = useState(false);
  const showSnackAlert = UseToastAlert();
  const { ResetPwd, loading, error } = useSelector((state: any) => state.resetPassword);
  useEffect(() => {
    if (ResetPwd && ResetPwd.code === 200) {
      showSnackAlert("success", ResetPwd?.message);
      dispatch(resetPwdActionCreator());
      setLoading(false);
    } else if (ResetPwd && ResetPwd.response && ResetPwd.response.data.status !== 200) {
      dispatch(resetPwdActionCreator());
      showSnackAlert("warning", ResetPwd?.response?.data?.message);
      setLoading(false);
    }
  }, [ResetPwd, ResetPwd.code]);
  useEffect(() => {
    if (oldPwd && newPwd && conPwd) {
      setBtnSty({
        cousor: "pointer",
        class: "site-button float-center w-100 positive-Btn mt-4 CP_btns",
      });
    } else {
      setBtnSty({
        cousor: "default",
        class: "site-button float-center w-100 positive-Btn mt-4",
      });
    }
  }, [oldPwd, newPwd, conPwd, loading1]);
  const handleConfirmSwal = (values: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to set the Password for your Account.",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        const rsa = Forge.pki.publicKeyFromPem(environment.publicKey);
        const rsaEncrypted_old = window.btoa(rsa.encrypt(values.Old_Password));
        const rsaEncrypted_new = window.btoa(rsa.encrypt(values.New_Password));
        dispatch(
          patchResetPassword({
            oldPassword: rsaEncrypted_old,
            newPassword: rsaEncrypted_new,
          })
        );
      } else {
        setLoading(false);
      }
    });
  };

  return (
    <>
      <Formik
        initialValues={{
          ...INITIAL_FORM_STATE,
        }}
        validationSchema={FORM_VALIDATION}
        onSubmit={(values, { resetForm }) => {
          if (newPwd !== "") {
            if (newPwd === conPwd) {
              setLoading(true);
            }
          }
          if (values.Confirm_Password == values.New_Password) {
            handleConfirmSwal(values);
            resetForm();
          } else {
            setConpasserr("Password doesn't match with New Password");
          }
        }}
        isInitialValid={false}
      >
        {(formik: any) => {
          const { values, handleChange, handleSubmit, errors, touched, handleBlur, isValid, dirty } = formik;
          return (
            <div className="page-content" style={{ background: "#ededed" }}>
              <div className="content-block">
                <div className="section-full browse-job content-inner-2">
                  <div className="container">
                    <div className="loginDiv" style={{ marginTop: "3%" }}>
                      <div className="row">
                        <div className="col-md-7 col-lg-7 col-sm-12 forgotPassDiv">
                          <div className="d-flex justify-content-around">
                            <img src={bnr} style={{ width: "75%" }}></img>
                          </div>
                        </div>
                        <div className="col-md-5 col-lg-5 col-sm-12 loginDivChild2">
                          <div className="d-flex justify-content-center" style={{ margin: "7% 0" }}>
                            <h4 style={{ color: "#004aad" }}>Set Password</h4>
                          </div>
                          <form
                            id="login"
                            style={{ paddingBottom: "30px" }}
                            onSubmit={handleSubmit}
                            className="tab-pane active P_commonform"
                            autoComplete="off"
                          >
                            <div className="form-group">
                              {/* <label className="font-weight-700">
                                                        Current Password
                                                        <span
                                                            className="maditory"
                                                            style={{ color: "red" }}
                                                        >
                                                            *
                                                        </span>
                                                    </label> */}
                              <input
                                name="Old_Password"
                                className="form-control"
                                placeholder="Current Password"
                                type={togtypeOld}
                                onChange={(e) => {
                                  handleChange(e);
                                  setOldPwd(e.target.value);
                                }}
                                minLength={8}
                                maxLength={16}
                                value={values.Old_Password}
                                onBlur={handleBlur}
                                onCopy={(e) => {
                                  e.preventDefault();
                                  return false;
                                }}
                                onPaste={(e) => {
                                  e.preventDefault();
                                  return false;
                                }}
                              />
                              <span
                                className="eye-btn"
                                onClick={() => {
                                  if (togtypeOld == "password") {
                                    setTogtypeOld("text");
                                  } else {
                                    setTogtypeOld("password");
                                  }
                                }}
                                style={{ top: "-30px", color: "gray" }}
                              >
                                {" "}
                                {togtypeOld === "password" ? (
                                  <BsFillEyeSlashFill className="eyePointer" />
                                ) : (
                                  <BsFillEyeFill className="eyePointer" />
                                )}
                              </span>
                            </div>
                            {errors.Old_Password && touched.Old_Password ? (
                              <p className="form-error" style={{ marginTop: "-20px", marginBottom: " 0px" }}>
                                {errors.Old_Password}
                              </p>
                            ) : null}

                            <div className="form-group">
                              {/* <label className="font-weight-700">
                                                        New Password
                                                        <span
                                                            className="maditory"
                                                            style={{ color: "red" }}
                                                        >
                                                            *
                                                        </span>
                                                    </label> */}
                              <input
                                name="New_Password"
                                className="form-control"
                                placeholder="New Password"
                                type={togtypeNew}
                                onChange={(e) => {
                                  handleChange(e);
                                  setNewPwd(e.target.value);
                                }}
                                minLength={8}
                                maxLength={16}
                                value={values.New_Password}
                                onBlur={handleBlur}
                                onCopy={(e) => {
                                  e.preventDefault();
                                  return false;
                                }}
                                onPaste={(e) => {
                                  e.preventDefault();
                                  return false;
                                }}
                              />
                              <span
                                className="eye-btn"
                                onClick={() => {
                                  if (togtypeNew === "password") {
                                    setTogtypeNew("text");
                                  } else {
                                    setTogtypeNew("password");
                                  }
                                }}
                                style={{ top: "-30px", color: "gray" }}
                              >
                                {" "}
                                {togtypeNew === "password" ? (
                                  <BsFillEyeSlashFill className="eyePointer" />
                                ) : (
                                  <BsFillEyeFill className="eyePointer" />
                                )}
                              </span>
                            </div>
                            {errors.New_Password && touched.New_Password ? (
                              <p className="form-error" style={{ marginTop: "-20px", marginBottom: "0px" }}>
                                {errors.New_Password}
                              </p>
                            ) : null}
                            <div className="form-group">
                              {/* <label className="font-weight-700" >
                                                        Confirm New Password
                                                        <span
                                                            className="maditory"
                                                            style={{ color: "red" }}
                                                        >
                                                            *
                                                        </span>
                                                    </label> */}
                              <input
                                name="Confirm_Password"
                                className="form-control"
                                placeholder="Confirm New Password"
                                onChange={(e) => {
                                  handleChange(e);
                                  setConPwd(e.target.value);
                                }}
                                type={togtypeCon}
                                minLength={8}
                                maxLength={16}
                                value={values.Confirm_Password}
                                onBlur={handleBlur}
                                onCopy={(e) => {
                                  e.preventDefault();
                                  return false;
                                }}
                                onPaste={(e) => {
                                  e.preventDefault();
                                  return false;
                                }}
                              />
                              <span
                                className="eye-btn"
                                onClick={() => {
                                  if (togtypeCon == "password") {
                                    setTogtypeCon("text");
                                  } else {
                                    setTogtypeCon("password");
                                  }
                                }}
                                style={{ top: "-30px", color: "gray" }}
                              >
                                {" "}
                                {togtypeCon === "password" ? (
                                  <BsFillEyeSlashFill className="eyePointer" />
                                ) : (
                                  <BsFillEyeFill className="eyePointer" />
                                )}
                              </span>
                            </div>
                            {errors.Confirm_Password && touched.Confirm_Password ? (
                              <p className="form-error" style={{ marginTop: "-20px" }}>
                                {errors.Confirm_Password}
                              </p>
                            ) : null}
                            <div>
                              <button type="submit" disabled={loading1} className={btnSty.class}>
                                {loading1 && (
                                  <i className="fa fa-circle-o-notch fa-spin" style={{ marginRight: "10px" }}></i>
                                )}
                                {loading1 ? "Processing" : "Change Password"}
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </Formik>
    </>
  );
}
export default ChangePassword;
