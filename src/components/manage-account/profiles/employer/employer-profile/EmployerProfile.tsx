import React, { Fragment, useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { regex } from "../../../../../common/validation";
import { useDispatch, useSelector } from "react-redux";
import { getCountryCode } from "../../../../../redux/features/masterData/countrySlice";
import { validateUser } from "../../../../../redux/features/authentication/userMailSlice";
import { UseToastAlert } from "../../../../../hooks/useToastAlert";
import {
  resetProfileImg,
  uploadPrfimg,
} from "../../../../../redux/features/employer/employerProfileSlice";
import Select from "react-select";
import {
  downloadSAS,
  successSAS,
} from "../../../../../redux/features/jobs/job-applications/downloadSASSlice";
import {
  accountDetails,
  resetAccountDetails,
} from "../../../../../redux/features/manage-account/profile/EmployerProfileSlice";
import { getEmpUserManage } from "../../../../../redux/features/employer/EmployerManageUser/userEmpManagementSlice";
import { Chip, Typography } from "@mui/material";
import {
  GetDisplayDateFromTimeStamp,
  GetTimeFromTimeStamp,
  bytesToMegabytes,
  convertformatTimestamp,
} from "../../../../../common/common";
import EmployerProfileSkelton from "../employerProfileSkelton";
import EmployerProfileSkeleton from "./EmployerProfileSkeleton";
import jwtDecode from "jwt-decode";
import { environment } from "../../../../../environments/environment";
let countries: any = new Array<Country>();
interface Country {
  value: string;
  label: string;
  phone: string;
}

const CompanyProfileSchema = Yup.object().shape({
  fullname: Yup.string()
    .required("Please enter Full Name.")
    .matches(regex.firstname, "Numeric and special characters are not allowed.")
    .trim("Empty space not allowed.")
    .min(1, "Full Name must contains minimum 1 characters."),
  userName: Yup.string().nullable(),
  role: Yup.string()
    .nullable()
    .matches(
      regex.designation,
      "Please enter valid Role. Start with alphabets and allowed characters are numbers, spaces and ( - . )."
    )
    .trim("Empty space not allowed.")
    .min(1, "Please enter Role.")
    .required("Please enter Role."),
  country: Yup.string().notRequired(),
  mobileNumber: Yup.string()
    .required("Please enter Mobile Number.")
    .trim("Empty space not allowed.")
    .matches(
      regex.international_mobile,
      "Please enter Mobile Number with minimum of 6 digits and maximum of 12 digits."
    ),
  altCountry: Yup.string().notRequired().nullable(),
  alternateMobileNumber: Yup.string()
    .trim("Empty space not allowed.")
    .matches(
      regex.international_mobile,
      "Please enter Mobile Number with minimum of 6 digits and maximum of 12 digits."
    )
    .nullable(),
  altenateEmailAddress: Yup.string()
    .matches(regex.email, "Please specify valid Email Address.")
    .trim("Empty space not allowed.")
    .nullable(),
  address: Yup.string()
    .trim("Empty space not allowed.")
    .min(1, "Please enter the correct Address.")
    .required("Please enter Address."),
  Pincode: Yup.string()
    .trim("Empty space not allowed.")
    .matches(
      regex.pinCode,
      "Please enter Company Pin Code with minimum of 4 digits and maximum of 6 digits."
    )
    .required("Please enter Company Pin Code."),
});

function EmployerProfile() {
  const formikRef = useRef<any>();
  const dispatch = useDispatch();
  const [mobileErr, setMobileErr] = useState(false);

  const [selectedCountryCode, setSelectedCountryCode] = useState<any>({
    value: "0",
    label: "India",
    phone: "+91",
  });
  const [selectedCountryCode2, setSelectedCountryCode2] = useState<any>();
  const [mobileErr2, setMobileErr2] = useState(false);
  const showSnackAlert = UseToastAlert();
  const [formvalue, setformvalue] = useState<any>();
  const [loader, setLoader] = useState(false);
  const [mob, setMob] = useState(""),
    [phoneNo, setPhoneNo] = useState(""),
    [phoneCode, setPhoneCode] = useState("");
  const [CountryCodes, setCountryCode] = useState<any>();
  const [selectedPhone, setSelectedPhone] = useState("");
  const { UserCheck } = useSelector((state: any) => state.userMailVerify);
  const { userData, loadingU } = useSelector(
    (state: any) => state.getuserEmpManagement
  );

  const AccDetails = useSelector((state: any) => state.accountInfo);
  const { AccountInfo, loading } = AccDetails;
  const AccerrorMessage = AccountInfo?.response?.data?.message;

  const profileImageSize = bytesToMegabytes(
    Number(environment.profileImageSize)
  );

  const [bindCompData, setBindCompData] = useState({
    user_id: "",
    fullname: "",
    userName: "",
    role: "",
    country: "",
    altCountry: "",
    mobileNumber: "",
    alternateMobileNumber: null,
    altenateEmailAddress: null,
    address: "",
    Pincode: "",
    permissions: [],
    accessibility: {
      days: [],
    },
  });

  useEffect(() => {
    if (!loadingU && userData?.data && userData?.data) {
      setformvalue(userData?.data?.users[0]);
    }
  }, [userData?.data, loadingU]);

  useEffect(() => {
    const token: any = jwtDecode(sessionStorage?.getItem("access_token")!);

    dispatch(
      getEmpUserManage({
        user_id: token?.sub,
        pageId: 1,
        pageLimit: 2,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (formvalue) {
      setBindCompData({
        user_id: formvalue?.user_id,
        fullname: formvalue?.name,
        userName: formvalue?.contact?.primary.mail,
        role: formvalue?.designation,
        country: formvalue?.contact?.primary?.ph?.code,
        mobileNumber: formvalue?.contact?.primary?.ph?.phno,
        altCountry: formvalue?.contact?.secondary[0]?.code,
        alternateMobileNumber: formvalue?.contact?.secondary[0]?.phno,
        altenateEmailAddress: formvalue?.contact?.secondary[0]?.email,
        address: formvalue?.address?.street,
        Pincode: formvalue?.address?.zip,
        permissions: formvalue?.permissions,
        accessibility: {
          days: formvalue?.accessibility?.days,
        },
      });
      setPhoneNo(formvalue?.contact?.primary?.ph?.phno);
      setPhoneCode(formvalue?.contact?.primary?.ph?.code);
      setSelectedCountryCode(formvalue?.contact?.primary?.ph?.code);
      setSelectedCountryCode2(formvalue?.contact?.secondary[0]?.code);
    }
  }, [formvalue]);

  const updateCompanyInfo = () => {
    const accountinfomodel = {
      fullName: formikRef.current.values.fullname,
      designation: formikRef.current.values.role,
      prim_code: formikRef.current.values.country,
      prim_phno: formikRef.current.values.mobileNumber,
      secdContact: {
        mail: formikRef.current.values.altenateEmailAddress
          ? formikRef.current.values.altenateEmailAddress
          : null,
        ph: formikRef?.current?.values?.alternateMobileNumber
          ? formikRef?.current?.values?.alternateMobileNumber
          : null,
        code: formikRef.current.values.altCountry
          ? formikRef.current.values.altCountry
          : "+91",
      },
      address: {
        street: formikRef.current.values.address,
        zip: formikRef.current.values.Pincode,
      },
    };

    dispatch(accountDetails(accountinfomodel));
    setLoader(true);
  };

  useEffect(() => {
    if (
      !loadingU &&
      AccountInfo.code === 200 &&
      !loadingU &&
      userData?.data &&
      userData?.data
    ) {
      const token: any = jwtDecode(sessionStorage?.getItem("access_token")!);
      showSnackAlert("success", AccountInfo.message);
      setLoader(false);
      dispatch(resetAccountDetails());
      dispatch(
        getEmpUserManage({
          user_id: token?.sub,
          pageId: 1,
          pageLimit: 2,
        })
      );
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
      dispatch(resetAccountDetails());
    } else if (
      AccountInfo &&
      AccountInfo.response &&
      AccountInfo.response.status !== 200
    ) {
      showSnackAlert("error", AccerrorMessage);
      setLoader(false);
      dispatch(resetAccountDetails());
    }
  }, [loadingU, userData, AccountInfo, AccerrorMessage]);

  const onSubmit = async (values: any, actions: any) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    actions.resetForm();
  };

  useEffect(() => {
    if (UserCheck && UserCheck.code && UserCheck.code === 200) {
      if (
        UserCheck?.data[0]?.key === "phone" &&
        UserCheck?.data[0]?.exist === true
      ) {
        if (UserCheck?.data[0]?.value === mob) setMobileErr(true);
        setMobileErr(true);
      } else if (
        UserCheck?.data[0]?.key === "phone" &&
        UserCheck?.data[0]?.exist === false
      ) {
        if (UserCheck?.data[0]?.value === mob) setMobileErr(false);
        setMobileErr(false);
      }
      if (phoneNo === UserCheck?.data[0]?.value) {
        setMobileErr(false);
        setMobileErr2(false);
      }
      if (
        phoneNo === UserCheck?.data[0]?.value &&
        selectedCountryCode === UserCheck?.data[0]?.code
      ) {
        setMobileErr(false);
      }
    }
  }, [UserCheck, mobileErr]);

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

  useEffect(() => {
    dispatch(getCountryCode({ pageno: -1, search: "" }));
    setMobileErr(false);
  }, []);

  const validatePhone = () => {
    const phone = regex.international_mobile.test(selectedPhone);
    if (
      phone &&
      (phoneNo !== selectedPhone || phoneCode !== selectedCountryCode)
    ) {
      dispatch(
        validateUser({data:[
          {
            key: "phone",
            code: `${selectedCountryCode}`,
            value: `${selectedPhone}`,
          },
        ]})
      );
    }
    if (phoneNo === selectedPhone && phoneCode === selectedCountryCode) {
      setMobileErr(false);
    }
  };
  useEffect(() => {
    validatePhone();
  }, [selectedPhone, selectedCountryCode]);
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

  //img api
  const UploadImg = useSelector((state: any) => state.uploadProfileImgData);
  const { response, loads } = UploadImg;

  const { sasData, load } = useSelector((state: any) => state.downloadSAS);

  useEffect(() => {
    if (response?.code === 200) {
      showSnackAlert("success", "Your profile uploaded successfully.");
      if (userData && userData?.code && userData?.code === 200) {
        const userids = userData?.data?.users?.map((e: any) => {
          return e?.user_id;
        });

        userData?.data?.users?.length
          ? dispatch(
              downloadSAS({
                id: [...userids],
                sasFor: "EMPIMG",
              })
            )
          : dispatch(successSAS());
      }
      setTimeout(() => {
        dispatch(resetProfileImg());
      }, 1000);
    } else if (
      UploadImg &&
      UploadImg.response &&
      UploadImg.response.response &&
      UploadImg.response?.code !== 200
    ) {
      showSnackAlert("warning", response.message);
      setTimeout(() => {
        dispatch(resetProfileImg());
      }, 1000);
    }
  }, [response?.code, response]);

  const handleProfileChange = (e: any) => {
    let regexImg = new RegExp(
      /[^\s]+(.*?).(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/
    );
    const uploadData = e.target?.files[0].type,
      logoName = e?.target?.files[0].name;
    if (!regex.imageNameRegex.test(logoName))
      showSnackAlert("warning", "Please give valid image name, without # % .");
    else {
      if (uploadData) {
        if (regexImg.test(uploadData) == true) {
          if (e.target?.files[0].size > environment.profileImageSize) {
            showSnackAlert(
              "warning",
              `Profile image size should not exceed ${profileImageSize}MB.`
            );
          } else {
            let formData = new FormData(); //formdata object
            formData.append("profileImg", e.target?.files[0]);
            dispatch(uploadPrfimg(formData));
          }
        } else {
          showSnackAlert(
            "warning",
            "Profile image type should be JPG, JPEG, PNG, GIF."
          );
          e.target.files[0] = null;
          e.target.files = [];
        }
      }
    }
  };

  const [downImg, setDownImg] = useState<any>("");
  useEffect(() => {
    setLoader(true);
    if (userData && userData?.code && userData?.code === 200) {
      const userids = userData?.data?.users?.map((e: any) => {
        return e?.user_id;
      });

      // setDownImg(sasData?.data?.img_sas);
      userData?.data?.users?.length
        ? dispatch(
            downloadSAS({
              id: [...userids],
              sasFor: "EMPIMG",
            })
          )
        : dispatch(successSAS());
    }
    setLoader(false);
  }, [userData]);
  useEffect(() => {
    if (sasData && sasData?.code && sasData?.code === 200) {
      setDownImg(sasData?.data[0]?.img_sas);
    }
  }, [sasData]);

  useEffect(() => {
    if (!loading && AccountInfo?.code == 200) {
      const token: any = jwtDecode(sessionStorage?.getItem("access_token")!);
      dispatch(
        getEmpUserManage({
          user_id: token?.sub,
          pageId: 1,
          pageLimit: 2,
        })
      );
    }
  }, [loading]);

  return (
    <>
      <div className="page-content bg-white">
        <div className="content-block">
          <div className="section-full bg-white p-t50 p-b20">
            <div className="container">
              <div className="job-bx browse-job clearfix m-b30 mt-5">
                <div className="job-bx-title clearfix NativeTitle">
                  <h5 className="font-weight-700 pull-left text-uppercase">
                    My Profile
                  </h5>
                </div>

                {!loadingU && (
                  <div className="row">
                    <div className="col-xl-3 col-lg-4 m-b30">
                      <div>
                        <div className="company-info can-info">
                          <div className="candidate-info candidate-detail text-center can-details">
                            <div
                              className="canditate-des"
                              style={{
                                border: "2px solid #c7c4c4",
                                borderRadius: "5px",
                              }}
                            >
                              <Link to={"#"}>
                                <img
                                  alt="Company_logo"
                                  style={{
                                    height: "140px",
                                    width: "150px",
                                  }}
                                  src={
                                    downImg && !load
                                      ? `${downImg}`
                                      : require("../../../../../assets/images/av-pic-01.png")
                                  }
                                />
                              </Link>
                              <div
                                className="upload-link"
                                title="Upload Employer Picture"
                                data-toggle="tooltip"
                                data-placement="right"
                                onChange={(event: any) => {
                                  handleProfileChange(event);
                                }}
                              >
                                <input
                                  type="file"
                                  className="update-flie"
                                  accept="image/*"
                                  onChange={(event: any) => {
                                    handleProfileChange(event);
                                  }}
                                />
                                <i className="fa fa-camera"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-9 col-lg-8 col-md-8 col-sm-12">
                      <div
                        id="Company_Details_bx"
                        className="job-bx submit-resume m-b30"
                      >
                        <Formik
                          initialValues={{ ...bindCompData }}
                          validationSchema={CompanyProfileSchema}
                          enableReinitialize={true}
                          onSubmit={() => {
                            updateCompanyInfo();
                          }}
                          innerRef={formikRef}
                        >
                          {(formik: any) => {
                            const {
                              setFieldValue,
                              values,
                              handleChange,
                              handleSubmit,
                              errors,
                              touched,
                              handleBlur,
                              setFieldTouched,
                              isValid,
                            } = formik;

                            return (
                              <>
                                <div className="row">
                                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                    <div className="form-group">
                                      <label>Full Name</label>
                                      <span className="error"> *</span>
                                      <input
                                        type="text"
                                        placeholder="Enter Full Name"
                                        maxLength={150}
                                        name="fullname"
                                        value={values.fullname}
                                        onChange={(e) => {
                                          handleChange(e);
                                        }}
                                        onBlur={handleBlur}
                                        className="form-control"
                                      />
                                      {errors.fullname && touched.fullname && (
                                        <p className="form-error">
                                          {errors.fullname}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                    <div className="form-group">
                                      <label>User Name</label>
                                      <input
                                        readOnly
                                        type="email"
                                        placeholder="Enter User Name  e.g.,info@gmail.com"
                                        name="userName"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.userName}
                                        className="form-control"
                                        style={{
                                          color: "#aeb1b3",
                                          cursor: "default",
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                      <label>Role</label>
                                      <span className="error"> *</span>
                                      <input
                                        type="text"
                                        placeholder="Enter Role"
                                        name="role"
                                        maxLength={150}
                                        onChange={handleChange}
                                        value={values.role}
                                        onBlur={handleBlur}
                                        className="form-control"
                                      />
                                      {errors.role && touched.role && (
                                        <p className="form-error">
                                          {errors.role}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="form-group col-lg-6 col-md-6 col-sm-6">
                                    <label htmlFor="country">
                                      Mobile Number
                                    </label>
                                    <span className="error"> *</span>
                                    <div id="phonenumbers">
                                      <div style={{ width: "120px" }} id="mob">
                                        <Select
                                          maxMenuHeight={200}
                                          minMenuHeight={200}
                                          id="codemob"
                                          className="dropstyle"
                                          name="country"
                                          value={countries.find(
                                            (e) =>
                                              selectedCountryCode === e.phone
                                          )}
                                          options={countries}
                                          placeholder="Select Code"
                                          defaultValue={{
                                            value: "0",
                                            label: "India",
                                            phone: "+91",
                                          }}
                                          onChange={(option: any) => {
                                            setCountryCode(option?.phone);
                                            setSelectedCountryCode(
                                              option.phone
                                            );
                                            setFieldValue(
                                              "country",
                                              option.phone
                                            );
                                          }}
                                          onInputChange={(e) => {
                                            if (e?.length > 5) return "";
                                          }}
                                          formatOptionLabel={formatOptionLabel}
                                          filterOption={customFilter}
                                        />
                                      </div>
                                      {/* primaryNo  */}
                                      <input
                                        name="mobileNumber"
                                        id="phonenums"
                                        autoComplete="off"
                                        minLength={6}
                                        maxLength={12}
                                        title=""
                                        placeholder="Enter Mobile Number"
                                        onChange={(e) => {
                                          setMobileErr(false);
                                          regex.numberTyping.test(
                                            e.target.value
                                          ) && handleChange(e);
                                        }}
                                        value={values.mobileNumber}
                                        onBlur={(e) => {
                                          handleBlur(e);
                                          setSelectedPhone(e?.target?.value);
                                          setMob(e?.target?.value);
                                        }}
                                        className="form-control"
                                      />
                                    </div>
                                    {!errors.mobileNumber && mobileErr && (
                                      <p className="form-error">
                                        Please check, entered Mobile Number is
                                        already exists!
                                      </p>
                                    )}
                                    {errors.mobileNumber &&
                                      touched.mobileNumber && (
                                        <p className="form-error">
                                          {errors.mobileNumber}
                                        </p>
                                      )}
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                      <label>Address</label>
                                      <span className="error"> *</span>
                                      <input
                                        type="text"
                                        placeholder="Enter Company Address."
                                        name="address"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.address}
                                        className="form-control"
                                        maxLength={500}
                                      />
                                      {errors.address && touched.address && (
                                        <p className="form-error">
                                          {errors.address}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                      <label>Pincode</label>
                                      <span className="error"> *</span>
                                      <input
                                        maxLength={6}
                                        minLength={4}
                                        type="text"
                                        placeholder="Enter Company Pin code."
                                        name="Pincode"
                                        onChange={(e) => {
                                          regex.numberTyping.test(
                                            e.target.value
                                          ) && handleChange(e);
                                        }}
                                        onBlur={handleBlur}
                                        value={values.Pincode}
                                        className="form-control"
                                      />
                                      {errors.Pincode && touched.Pincode && (
                                        <p className="form-error">
                                          {errors.Pincode}
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  <div className=" col-xl-6 col-lg-6 col-md-6 col-sm-12 d-inline">
                                    <div className="form-group">
                                      <label>Alternate Mobile Number</label>
                                      <div id="phonenumbers">
                                        <div
                                          style={{ width: "140px" }}
                                          id="mob"
                                        >
                                          <Select
                                            maxMenuHeight={200}
                                            minMenuHeight={200}
                                            id="codemob"
                                            className="dropstyle"
                                            name="altCountry"
                                            options={countries}
                                            value={countries.find(
                                              (e) =>
                                                selectedCountryCode2 === e.phone
                                            )}
                                            placeholder="Select Code"
                                            defaultValue={{
                                              value: "0",
                                              label: "India",
                                              phone: "+91",
                                            }}
                                            onChange={(option: any) => {
                                              setSelectedCountryCode2(option);
                                              setFieldValue(
                                                "altCountry",
                                                option.phone
                                              );
                                            }}
                                            onInputChange={(e) => {
                                              if (e?.length > 5) return "";
                                            }}
                                            formatOptionLabel={
                                              formatOptionLabel
                                            }
                                            filterOption={customFilter}
                                          />
                                        </div>
                                        {/* <input
                                        name="mobileNumber"
                                        id="phonenums"
                                        autoComplete="off"
                                        minLength={6}
                                        maxLength={12}
                                        title=""
                                        placeholder="Enter Mobile Number"
                                        onChange={(e) => {
                                          setMobileErr(false);
                                          regex.numberTyping.test(
                                            e.target.value
                                          ) && handleChange(e);
                                        }}
                                        value={values.mobileNumber}
                                        onBlur={(e) => {
                                          handleBlur(e);
                                          validatePhone(e);
                                          setMob(e?.target?.value);
                                        }}
                                        className="form-control"
                                      /> */}
                                        <input
                                          name="alternateMobileNumber"
                                          id="phonenums"
                                          autoComplete="off"
                                          minLength={6}
                                          maxLength={12}
                                          title=""
                                          placeholder="Enter Alternate Contact Number"
                                          onChange={(e) => {
                                            if (
                                              regex.numberTyping.test(
                                                e.target.value
                                              )
                                            ) {
                                              handleChange(e);
                                            } else {
                                              e.target.value = "";
                                            }
                                          }}
                                          value={
                                            values.alternateMobileNumber || ""
                                          }
                                          onBlur={handleBlur}
                                          className="form-control w-100"
                                        />
                                      </div>

                                      {errors.alternateMobileNumber &&
                                        touched.alternateMobileNumber && (
                                          <p className="form-error">
                                            {errors.alternateMobileNumber}
                                          </p>
                                        )}
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                      <label className="font-weight-700">
                                        Alternate Email Address
                                      </label>
                                      <input
                                        autoComplete="off"
                                        maxLength={150}
                                        name="altenateEmailAddress"
                                        placeholder="Enter Alternate Email Address"
                                        type="email"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={
                                          values.altenateEmailAddress || ""
                                        }
                                        className="form-control"
                                      />
                                      {errors.altenateEmailAddress &&
                                        touched.altenateEmailAddress && (
                                          <p className="form-error">
                                            {errors.altenateEmailAddress}
                                          </p>
                                        )}
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                      <label className="font-weight-700">
                                        Permission
                                      </label>
                                      <div>
                                        {userData?.data?.users[0]?.permissions?.map(
                                          // (e: any) => e
                                          (e: any) => {
                                            if (e === "MIJ")
                                              return (
                                                <Fragment>
                                                  <Chip
                                                    className="mt-1"
                                                    label="Manage Internal Jobs"
                                                  />
                                                  <br />
                                                  <Chip
                                                    className="mt-1 ml-5"
                                                    label="Internal Job "
                                                  />
                                                  <br />
                                                  <Chip
                                                    className="mt-1 ml-5"
                                                    label="Referral Job "
                                                  />
                                                  <br />
                                                </Fragment>
                                              );
                                            if (e === "MEJ")
                                              return (
                                                <Fragment>
                                                  <Chip
                                                    className="mt-1"
                                                    label="Manage External Jobs"
                                                  />
                                                  <br />
                                                  <Chip
                                                    className="mt-1 ml-5"
                                                    label="Hot Job "
                                                  />
                                                  <br />
                                                  <Chip
                                                    className="mt-1 ml-5"
                                                    label="Private Job"
                                                  />
                                                  <br />
                                                </Fragment>
                                              );
                                          }
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 col-md-6">
                                    <div className="form-group">
                                      <label className="font-weight-700">
                                        Accessibility
                                      </label>
                                      <div>
                                        <Chip
                                          label={
                                            <Typography variant="body2">
                                              {userData?.data?.users[0]
                                                ?.accessibility?.start_date ? (
                                                <>
                                                  {"\nFrom\n" +
                                                    `${convertformatTimestamp(
                                                      userData?.data?.users[0]
                                                        ?.accessibility
                                                        ?.start_date
                                                    )}` +
                                                    "\nTo\n" +
                                                    `${convertformatTimestamp(
                                                      userData?.data?.users[0]
                                                        ?.accessibility
                                                        ?.end_date
                                                    )}`}
                                                </>
                                              ) : (
                                                "No Restriction"
                                              )}
                                            </Typography>
                                          }
                                        />
                                      </div>
                                      <div>
                                        {userData?.data?.users[0]?.accessibility?.days?.map(
                                          // (e: any) => e
                                          (e: any) => {
                                            if (e === 0)
                                              return (
                                                <Fragment>
                                                  <Chip
                                                    className="mt-1"
                                                    label="Sunday"
                                                  />{" "}
                                                </Fragment>
                                              );
                                            if (e === 1)
                                              return (
                                                <Fragment>
                                                  <Chip
                                                    className="mt-1"
                                                    label="Monday"
                                                  />{" "}
                                                </Fragment>
                                              );
                                            if (e === 2)
                                              return (
                                                <Fragment>
                                                  <Chip
                                                    className="mt-1"
                                                    label="Tuesday"
                                                  />{" "}
                                                </Fragment>
                                              );
                                            if (e === 3)
                                              return (
                                                <Fragment>
                                                  <Chip
                                                    className="mt-1"
                                                    label="Wednesday"
                                                  />{" "}
                                                </Fragment>
                                              );
                                            if (e === 4)
                                              return (
                                                <Fragment>
                                                  <Chip
                                                    className="mt-1"
                                                    label="Thursday"
                                                  />{" "}
                                                </Fragment>
                                              );
                                            if (e === 5)
                                              return (
                                                <Fragment>
                                                  <Chip
                                                    className="mt-1"
                                                    label="Friday"
                                                  />{" "}
                                                </Fragment>
                                              );
                                            if (e === 6)
                                              return (
                                                <Fragment>
                                                  <Chip
                                                    className="mt-1"
                                                    label="Saturday"
                                                  />{" "}
                                                </Fragment>
                                              );
                                          }
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div style={{ textAlign: "end" }}>
                                  <button
                                    type="submit"
                                    className="site-button btn btn-sm"
                                    disabled={!isValid}
                                    onClick={(e) => handleSubmit(e)}
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
                              </>
                            );
                          }}
                        </Formik>
                      </div>
                    </div>
                  </div>
                )}
                {loadingU && <EmployerProfileSkeleton />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default EmployerProfile;
