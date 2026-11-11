import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { regex } from "../../common/validation";
import { validateUser } from "../../redux/features/authentication/userMailSlice";
import { getCountryCode } from "../../redux/features/masterData/countrySlice";
import { UserManagementSchema } from "./userManagementTypes";
import "../../assets/customCss/NativeUserManagement.css";
import Swal from "sweetalert2";
import { RoleType } from "../../routes/roles";
import {
  PatchNativeUserManage,
  PostNativeUserManage,
} from "../../redux/features/admin/NativeuserManagementSlice";
let countries: any = new Array<Country>();
interface Country {
  value: string;
  label: string;
  phone: string;
}
enum AccessabilityOption {
  FAQM = "FAQM",
  CSM = "CSM",
  CM = "CM",
  AM = "AM",
  PM = "PM",
  TP = "TP",
}
const INITIAL_EDIT_VALUE: any = {
  id: "",
  fullName: "",
  userEmail: "",
  country: "",
  mobileNumber: "",
  userRole: RoleType.ADMINISTRATOR,
  allPermission: [],
  FAQM: false,
  CSM: false,
  CM: false,
  AM: false,
  PM: false,
  TP: false,
};

const NativeUsermanagement = ({ row, close }: any) => {
  const [mailErr, setMailErr] = useState(false),
    [mobileErr, setMobileErr] = useState(false),
    [phoneNo, setPhoneNo] = useState(""),
    [phoneCode, setPhoneCode] = useState("");
  const { UserCheck } = useSelector((state: any) => state.userMailVerify);

  const { loadingP } = useSelector(
    (state: any) => state.PatchNativeuserManagementData
  );
  const { loadingS } = useSelector(
    (state: any) => state?.PostNativeuserManagementData
  );
  const dispatch = useDispatch();

  const [editdata, setEditdata] = useState<any>();

  const handleConfirmSwal = (row: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${editdata ? "Update" : "Invite"} this User?`,
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result?.isConfirmed) {
        let temp: any = [];
        if (values?.FAQM) {
          temp.push(AccessabilityOption.FAQM);
        }
        if (values?.CSM) {
          temp.push(AccessabilityOption.CSM);
        }
        if (values?.CM) {
          temp.push(AccessabilityOption.CM);
        }
        if (values?.AM) {
          temp.push(AccessabilityOption.AM);
        }
        if (values?.PM) {
          temp.push(AccessabilityOption.PM);
        }
        if (values?.TP) {
          temp.push(AccessabilityOption.TP);
        }

        if (values?.id) {
          const modal = {
            empId: values?.id,
            empName: values?.fullName,
            empPhoneCode: values?.country ? values?.country : "+91",
            empPhoneNo: values?.mobileNumber,
            empPrm: [...temp],
          };

          dispatch(PatchNativeUserManage(modal));
        } else {
          const modal = {
            empName: values.fullName,
            empMail: values?.userEmail,
            empPhoneCode: values?.country ? values?.country : "+91",
            empPhoneNo: values?.mobileNumber,
            empRole: RoleType.ADMINISTRATOR,
            empPrm: [...temp],
          };

          dispatch(PostNativeUserManage(modal));
        }
      }
    });
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  }: any = useFormik({
    initialValues: { ...editdata } || { ...INITIAL_EDIT_VALUE },
    validationSchema: UserManagementSchema,
    enableReinitialize: true,
    onSubmit: () => {
      !ValuesSelect
        ? !mailErr && !mobileErr && handleConfirmSwal(values)
        : setMsg("Please select Permission");
    },
  });

  useEffect(() => {
    row &&
      setEditdata({
        id: row?.userId,
        fullName: row?.name,
        userEmail: row?.contact?.mail?.val,
        country: row?.contact?.ph?.code,
        mobileNumber: row?.contact?.ph?.val,
        userRole: row?.role,
        allPermission: [...row?.permission],
        FAQM: row?.permission?.indexOf(AccessabilityOption.FAQM) !== -1,
        CSM: row?.permission?.indexOf(AccessabilityOption.CSM) !== -1,
        CM: row?.permission?.indexOf(AccessabilityOption.CM) !== -1,
        AM: row?.permission?.indexOf(AccessabilityOption.AM) !== -1,
        PM: row?.permission?.indexOf(AccessabilityOption.PM) !== -1,
        TP: row?.permission?.indexOf(AccessabilityOption.TP) !== -1,
      });
    setFieldValue("id", row?.userId);
    setFieldValue("fullName", row?.name);
    setFieldValue("userEmail", row?.contact?.mail?.val);
    setFieldValue("country", row?.contact?.ph?.code);
    setFieldValue("mobileNumber", row?.contact?.ph?.val);
    setFieldValue("userRole", row?.role);
    setFieldValue("allPermission", row?.permission);
    setPhoneNo(row?.contact?.ph?.val);
    setPhoneCode(row?.contact?.ph?.code);
  }, [row]);

  useEffect(() => {
    if (UserCheck && UserCheck.code && UserCheck.code === 200) {
      if (
        UserCheck?.data[0]?.key === "email" &&
        UserCheck?.data[0]?.exist === true
      ) {
        setMailErr(true);
      } else if (
        UserCheck?.data[0]?.key === "email" &&
        UserCheck?.data[0]?.exist === false
      ) {
        setMailErr(false);
      }
      if (
        UserCheck?.data[0]?.key === "phone" &&
        UserCheck?.data[0]?.exist === true
      ) {
        setMobileErr(true);
      } else if (
        UserCheck?.data[0]?.key === "phone" &&
        UserCheck?.data[0]?.exist === false
      ) {
        setMobileErr(false);
      }
      if (
        phoneNo === selectPhone
      ) {
        setMobileErr(false);
      }
    }
  }, [UserCheck, mailErr, mobileErr]);
  const [selectPhone, setSelctedPhone] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState<any>({
    value: "0",
    label: "India",
    phone: "+91",
  });
  const [msg, setMsg] = useState("");
  const { CountryCode } = useSelector((state: any) => state.countryCode);

  useEffect(() => {
    if (
      CountryCode &&
      CountryCode?.code &&
      CountryCode?.code === 200 &&
      !countries.length
    ) {
      CountryCode?.data.map((e: any, i: number) => {
        countries.push({ value: `${1 + i}`, label: e.name, phone: e.code });
      });
    }
  }, [CountryCode]);

  //Internal function
  const formatOptionLabel = (
    { label, phone }: Country,
    { context }: { context: string }
  ) => {
    if (context === "value") {
      return phone;
    }
    return (
      <div>
        {label} ({phone})
      </div>
    );
  };
  useEffect(() => {
    dispatch(getCountryCode({ pageno: -1, search: "" }));
    setMailErr(false);
    setMobileErr(false);
  }, []);

  const validatePhone = (e: any) => {
    e.preventDefault();
    const phone = regex.international_mobile.test(e?.target?.value);
    if (
      phone &&
      (phoneNo !== e?.target?.value || phoneCode !== selectedCountryCode)
    ) {
      dispatch(
        validateUser({data:[
          {
            key: "phone",
            value: `${e?.target?.value}`,
            code: `${selectedCountryCode?.phone}`,
          },
        ]})
      );
    }
    if (phoneNo === e?.target?.value && phoneCode === selectedCountryCode) {
      setMobileErr(false);
    }
  };
  const customFilter = (option, searchText) => {
    if (
      option?.data?.label.toLowerCase().includes(searchText.toLowerCase()) ||
      option?.data?.phone.toLowerCase().includes(searchText.toLowerCase())
    ) {
      return true;
    } else {
      return false;
    }
  };

  const ValuesSelect =
    !values?.FAQM &&
    !values?.CSM &&
    !values?.CM &&
    !values?.AM &&
    !values?.PM &&
    !values?.TP;

  const validateEmai = (e: any) => {
    e.preventDefault();
    const email = regex.email.test(e?.target?.value);
    if (email) {
      dispatch(
        validateUser({data:[{ key: "email", value: e?.target?.value.toLowerCase() }]})
      );
    }
  };

  return (
    <>
      <div className="section-full content-inner browse-job shop-account">
        <div
          className="p-a30 job-bx  radius-sm bg-white m-auto "
          style={{ width: "750px", paddingBottom: "5%" }}
        >
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="">
              <div className="modal-custom-header">
                <h5 className="modal-title" id="ProfilenameModalLongTitle">
                  {!editdata ? "Add Native User" : "Edit Native User"}
                </h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => {
                    close(false);
                  }}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-6">
                <div className="form-group">
                  <label className="font-weight-700">Full Name</label>
                  <span className="error"> *</span>
                  <input
                    autoComplete="off"
                    maxLength={150}
                    name="fullName"
                    value={values.fullName}
                    placeholder="Enter Your Full Name"
                    type="text"
                    className="form-control"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.fullName && touched.fullName && (
                    <p className="form-error">{errors.fullName}</p>
                  )}
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-6">
                <div className="form-group">
                  <label className="font-weight-700">Email Address</label>
                  <span className="error"> *</span>
                  <input
                    autoComplete="off"
                    maxLength={150}
                    name="userEmail"
                    value={values.userEmail}
                    placeholder="Enter Your Email Address"
                    type="email"
                    disabled={editdata}
                    className="form-control"
                    onChange={handleChange}
                    onBlur={(e: any) => {
                      handleBlur(e);
                      validateEmai(e);
                    }}
                  />
                  {!errors.userEmail && mailErr && (
                    <p className="form-error">
                      Please check, entered Email Address is already exists!
                    </p>
                  )}
                  {errors.userEmail && touched.userEmail && (
                    <p className="form-error">{errors.userEmail}</p>
                  )}
                </div>
              </div>
            </div>
            <br />
            <div className="row">
              <div className="form-group col-lg-6 col-md-6 col-sm-6">
                <label htmlFor="country">Contact Number</label>
                <span className="error"> *</span>
                <div id="phonenumbers">
                  <div style={{ width: "320px" }} id="mob">
                    <Select
                      maxMenuHeight={200}
                      minMenuHeight={200}
                      id="codemob"
                      isDisabled={true}
                      className="dropstyle"
                      name="country"
                      value={selectedCountryCode}
                      options={countries}
                      placeholder="Select Code"
                      defaultValue={{
                        value: "0",
                        label: "India",
                        phone: "+91",
                      }}
                      onInputChange={(e) => {
                        if (e?.length > 5) return "";
                      }}
                      onChange={(option: any) => {
                        setSelectedCountryCode(option);
                        setFieldValue("country", option.phone);
                      }}
                      formatOptionLabel={formatOptionLabel}
                      filterOption={customFilter}
                    />
                  </div>

                  <input
                    name="mobileNumber"
                    id="phonenums"
                    autoComplete="off"
                    minLength={10}
                    maxLength={10}
                    title=""
                    placeholder="Enter Contact Number"
                    onChange={(e) => {
                      regex.numberTyping.test(e.target.value) &&
                        handleChange(e);
                    }}
                    value={values.mobileNumber}
                    onBlur={(e) => {
                      setSelctedPhone(e?.target?.value)
                      handleBlur(e);
                      validatePhone(e);
                    }}
                    className="form-control"
                  />
                </div>
                {!errors.mobileNumber && mobileErr && (
                  <p className="form-error">
                    Please check, entered Contact Number is already exists!
                  </p>
                )}
                {errors.mobileNumber && touched.mobileNumber && (
                  <p className="form-error">{errors.mobileNumber}</p>
                )}
              </div>
              <div className="col-lg-6 col-md-6 col-sm-6">
                <div className="form-group">
                  <label className="font-weight-700">Role</label>
                  <span className="error"> *</span>
                  <input
                    id="roleBgn"
                    autoComplete="off"
                    maxLength={150}
                    value={RoleType.ADMINISTRATOR}
                    placeholder="Enter Your Role"
                    type="text"
                    className="form-control"
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="form-group" style={{ marginBottom: "-1px" }}>
                <label className="font-weight-700">Permission</label>
                <span className="error"> *</span>
              </div>
              <div className="custom-control custom-checkbox">
                {" "}
                <input
                  className="custom-control-input"
                  id="FAQM"
                  type="checkbox"
                  name="FAQM"
                  checked={values?.FAQM}
                  onChange={(e) => {
                    setMsg("");

                    setFieldValue("FAQM", e?.target?.checked);

                    let temp = values?.allPermission?.indexOf(
                      AccessabilityOption.FAQM
                    );

                    if (temp === -1 && !values?.FAQM) {
                      values?.allPermission?.push(AccessabilityOption.FAQM);
                    }

                    if (temp !== -1 && values?.FAQM) {
                      values?.allPermission?.splice(temp, 1);
                    }
                  }}
                />{" "}
                <label className="custom-control-label" htmlFor="FAQM">
                  Manage FAQ{" "}
                </label>{" "}
              </div>
              <div className="custom-control custom-checkbox">
                {" "}
                <input
                  className="custom-control-input"
                  id="CSM"
                  type="checkbox"
                  name="CSM"
                  checked={values?.CSM}
                  onChange={(e) => {
                    setMsg("");

                    setFieldValue("CSM", e?.target?.checked);

                    let temp = values?.allPermission?.indexOf(
                      AccessabilityOption.CSM
                    );

                    if (temp === -1 && !values?.CSM) {
                      values?.allPermission?.push(AccessabilityOption.CSM);
                    }

                    if (temp !== -1 && values?.CSM) {
                      values?.allPermission?.splice(temp, 1);
                    }
                  }}
                />{" "}
                <label className="custom-control-label" htmlFor="CSM">
                  Manage Customer Support{" "}
                </label>{" "}
              </div>
              <div className="custom-control custom-checkbox">
                <input
                  className="custom-control-input"
                  id="CM"
                  type="checkbox"
                  name="CM"
                  checked={values?.CM}
                  onChange={(e) => {
                    setMsg("");
                    setFieldValue("CM", e?.target?.checked);

                    let temp = values?.allPermission?.indexOf(
                      AccessabilityOption.CM
                    );

                    if (temp === -1 && !values.CM) {
                      values?.allPermission.push(AccessabilityOption.CM);
                    }

                    if (temp !== -1 && values.CM) {
                      values?.allPermission?.splice(temp, 1);
                    }
                  }}
                />{" "}
                <label className="custom-control-label" htmlFor="CM">
                  Manage Quick Contact{" "}
                </label>{" "}
              </div>
              <div className="custom-control custom-checkbox">
                <input
                  className="custom-control-input"
                  id="AM"
                  type="checkbox"
                  name="AM"
                  checked={values?.AM}
                  onChange={(e) => {
                    setMsg("");
                    setFieldValue("AM", e?.target?.checked);

                    let temp = values?.allPermission?.indexOf(
                      AccessabilityOption.AM
                    );

                    if (temp === -1 && !values.AM) {
                      values?.allPermission.push(AccessabilityOption.AM);
                    }

                    if (temp !== -1 && values.AM) {
                      values?.allPermission?.splice(temp, 1);
                    }
                  }}
                />{" "}
                <label className="custom-control-label" htmlFor="AM">
                  Manage Assessment{" "}
                </label>{" "}
              </div>
              <div className="custom-control custom-checkbox">
                {" "}
                <input
                  className="custom-control-input"
                  id="PM"
                  type="checkbox"
                  name="PM"
                  checked={values?.PM}
                  onChange={(e) => {
                    setMsg("");

                    setFieldValue("PM", e?.target?.checked);

                    let temp = values?.allPermission?.indexOf(
                      AccessabilityOption.PM
                    );

                    if (temp === -1 && !values?.PM) {
                      values?.allPermission?.push(AccessabilityOption.PM);
                    }

                    if (temp !== -1 && values?.PM) {
                      values?.allPermission?.splice(temp, 1);
                    }
                  }}
                />{" "}
                <label className="custom-control-label" htmlFor="PM">
                  Poll management{" "}
                </label>{" "}
              </div>
              <div className="custom-control custom-checkbox">
                <input
                  className="custom-control-input"
                  id="TP"
                  type="checkbox"
                  name="TP"
                  checked={values?.TP}
                  onChange={(e) => {
                    setMsg("");

                    setFieldValue("TP", e?.target?.checked);

                    let temp = values?.allPermission?.indexOf(
                      AccessabilityOption.TP
                    );

                    if (temp === -1 && !values?.TP) {
                      values?.allPermission?.push(AccessabilityOption.TP);
                    }

                    if (temp !== -1 && values?.TP) {
                      values?.allPermission?.splice(temp, 1);
                    }
                  }}
                />{" "}
                <label className="custom-control-label" htmlFor="TP">
                  Terms and Privacy Policy management{" "}
                </label>{" "}
              </div>
              <p className="form-error">{msg}</p>
            </div>
            <div style={{ display: "flex", float: "right" }}>
              <div>
                {" "}
                <button
                  className="site-button site-warning-button"
                  onClick={() => {
                    close(false);
                  }}
                >
                  Cancel
                </button>
              </div>
              <div className="ml-2">
                <button
                  type="submit"
                  className="site-button btn "
                  style={{ cursor: "pointer" }}
                >
                  {(loadingS || loadingP) && (
                    <i
                      className="fa fa-circle-o-notch fa-spin"
                      style={{ marginRight: "10px" }}
                    ></i>
                  )}
                  {editdata
                    ? loadingP
                      ? "Updating..."
                      : "Update"
                    : loadingS
                    ? "Inviting..."
                    : "Invite"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default NativeUsermanagement;
