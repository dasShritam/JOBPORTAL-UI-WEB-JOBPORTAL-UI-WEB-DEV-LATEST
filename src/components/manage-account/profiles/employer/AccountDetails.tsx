import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useFormik } from "formik";
import { AccountDetailsSchema } from "../employer/employerTypes";
import { useDispatch, useSelector } from "react-redux";
import { accountDetails } from "../../../../redux/features/manage-account/profile/EmployerProfileSlice";
import jwtDecode from "jwt-decode";
import { UseToastAlert } from "../../../../hooks/useToastAlert";

function AccountDetails() {
  const showSnackAlert = UseToastAlert();

  const [formvalue, setformvalue] = useState<any>();
  const [loader, setLoader] = useState(false);
  const [updatebtn, setUpdatebtn] = useState({
    className: "site-button btn btn-sm",
    style: { cursor: "default", backgroundColor: "#bdbebf" },
  });
  const dispatch = useDispatch();
  const [bindAccInfo, setBindAccInfo] = useState({
    username: "",
    reportingManager: "",
    communicationEmail: "",
    role: "",
    mobileNumber: "",
  });

  // Employe data bind
  const empDetails = useSelector((state: any) => state.employeeProfile);
  const { EmployerProfile, loading, error } = empDetails;
  // Update Account info
  const AccDetails = useSelector((state: any) => state.accountInfo);
  const { AccountInfo } = AccDetails;
  const AccerrorMessage = AccountInfo?.response?.data?.message;

  useEffect(() => {
    if (!loading && EmployerProfile?.data && EmployerProfile?.data) {
      setformvalue(EmployerProfile?.data?.acountInfo);
    }
  }, [EmployerProfile?.data, loading]);

  useEffect(() => {
    if (formvalue) {
      setBindAccInfo({
        username: formvalue.name,
        reportingManager: formvalue.Rm,
        communicationEmail: formvalue.email,
        role: formvalue.role,
        mobileNumber: formvalue.phno,
      });
    }
  }, [formvalue]);

  const updateCompanyInfo = () => {
    const accountinfomodel = {
      role: values.role,
      phno: values.mobileNumber,
    };
    dispatch(accountDetails(accountinfomodel));
    setLoader(true);
  };

  useEffect(() => {
    if (AccountInfo.code === 200) {
      showSnackAlert("success", AccountInfo.message);
      setLoader(false);
    } else if (
      (AccountInfo &&
        AccountInfo.response &&
        AccountInfo.response.status === 401) ||
      (AccountInfo &&
        AccountInfo.response &&
        AccountInfo.response.status === 400)
    ) {
      showSnackAlert("warning", AccerrorMessage);
      setLoader(false);
    } else if (
      AccountInfo &&
      AccountInfo.response &&
      AccountInfo.response.status !== 200
    ) {
      showSnackAlert("error", AccerrorMessage);
      setLoader(false);
    }
  }, [AccountInfo, AccerrorMessage]);

  const onSubmit = async (values: any, actions: any) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    actions.resetForm();
  };

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: bindAccInfo,
    validationSchema: AccountDetailsSchema,
    enableReinitialize: true,
    onSubmit,
  });
  const y = errors.username && touched.username ? "input-error" : "";
  const t = `form-control ${y} `;

  const isEnablebtn =
    !errors.username &&
    !errors.communicationEmail &&
    !errors.role &&
    !errors.mobileNumber;

  useEffect(() => {
    if (isEnablebtn) {
      setUpdatebtn({
        className: "site-button btn btn-sm",
        style: { cursor: "pointer", backgroundColor: "" },
      });
    } else {
      setUpdatebtn({
        className: "site-button btn btn-sm",
        style: { cursor: "default", backgroundColor: "#bdbebf" },
      });
    }
  }, [isEnablebtn]);

  return (
    <>
      <div className="job-bx submit-resume" id="Account_Details_bx">
        <div className="job-bx-title clearfix">
          <h5 className="modal-title">Account Details</h5>
        </div>
        <Form onSubmit={handleSubmit} autoComplete="off">
          <div className="row">
            <div className="col-lg-6 col-md-6">
              <div className="form-group">
                <label>User Name</label>
                <input
                  readOnly
                  type="text"
                  placeholder="Enter User Name"
                  name="username"
                  onChange={handleChange}
                  value={values.username}
                  onBlur={handleBlur}
                  className={t}
                  style={{ color: "#aeb1b3" }}
                />
                {errors.username && touched.username && (
                  <p className="form-error">{errors.username}</p>
                )}
              </div>
            </div>

            <div className="col-lg-6 col-md-6">
              <div className="form-group">
                <label>Communication Email</label>
                <input
                  readOnly
                  type="email"
                  placeholder="Enter Communication Email  e.g.,info@gmail.com"
                  name="communicationEmail"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.communicationEmail}
                  className={t}
                  style={{ color: "#aeb1b3" }}
                />
                {errors.communicationEmail && touched.communicationEmail && (
                  <p className="form-error">{errors.communicationEmail}</p>
                )}
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="form-group">
                <label>Role</label>
                <input
                  readOnly
                  type="text"
                  placeholder="Enter Role"
                  name="role"
                  onChange={handleChange}
                  value={values.role}
                  onBlur={handleBlur}
                  className={t}
                  style={{ color: "#aeb1b3" }}
                />
                {errors.role && touched.role && (
                  <p className="form-error">{errors.role}</p>
                )}
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="text"
                  placeholder="Enter Mobile Number"
                  name="mobileNumber"
                  onChange={handleChange}
                  value={values.mobileNumber}
                  onBlur={handleBlur}
                  className={t}
                />
                {errors.mobileNumber && touched.mobileNumber && (
                  <p className="form-error">{errors.mobileNumber}</p>
                )}
              </div>
            </div>
          </div>
          <div style={{ textAlign: "end" }}>
            <button
              type="submit"
              // className="site-button m-b30"
              className={`${updatebtn.className}`}
              style={updatebtn.style}
              disabled={!isEnablebtn}
              onClick={updateCompanyInfo}
            >
              {loader && (
                <i
                  className="fa fa-circle-o-notch fa-spin"
                  style={{ marginRight: "10px" }}
                ></i>
              )}
              {loader ? "Updating" : "Update"}
            </button>
          </div>
        </Form>
      </div>
    </>
  );
}
export default AccountDetails;
