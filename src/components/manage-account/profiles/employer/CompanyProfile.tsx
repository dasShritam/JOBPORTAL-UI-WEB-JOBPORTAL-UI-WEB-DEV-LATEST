import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DropdownButton, Form } from "react-bootstrap";
import ListingEmpProfileBar from "../../../common/Elements/ListingEmpProfileBar";
import AccountDetails from "./AccountDetails";
import KYCDetails from "./KYCDetails";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { EmployeeProfilesSchema } from "./employerTypes";
import Select from "react-select";
import {
  companyDetails,
  getProfileDetails,
  uploadLogo,
  downloadLogo,
  resetProfile,
  resetCompanyDetails,
} from "../../../../redux/features/manage-account/profile/EmployerProfileSlice";
import { UseToastAlert } from "../../../../hooks/useToastAlert";
import "../../../../assets/customCss/header-profile/EmpProfile.css";
import { resetEmpLogActionCreator } from "../../../../redux/features/authentication/LoginSlice";
import { getIndustryType } from "../../../../redux/features/masterData/industrySlice";
import { bytesToMegabytes, customStyles } from "../../../../common/common";
import { regex } from "../../../../common/validation";
import EmployerProfileSkelton from "./employerProfileSkelton";

import "../.././../../assets/images/av-pic-01.png";
import { validateUser } from "../../../../redux/features/authentication/userMailSlice";
import { environment } from "../../../../environments/environment";
import { getCountryCode } from "../../../../redux/features/masterData/countrySlice";
let countries: any = new Array<Country>();
interface Country {
  value: string;
  label: string;
  phone: string;
}
let industries: any = new Array<Industry>();
interface Industry {
  value: String;
  label: string;
}

function CompanyProfile() {
  // Toaster
  const showSnackAlert = UseToastAlert();

  // eslint-disable-next-line no-restricted-globals
  history.pushState(null, location.href);
  window.onpopstate = function () {
    // eslint-disable-next-line no-restricted-globals
    history.go(1);
  };
  const [selectedCountryCode, setSelectedCountryCode] = useState<any>({
    value: "0",
    label: "India",
    phone: "+91",
  });
  const [selectedCountryCode2, setSelectedCountryCode2] = useState<any>();
  const [selectedIndus, setSelectedIndus] = useState<any>("");
  const [selectedValue, setSelectedValue] = useState<any>("");
  const [formvalue, setformvalue] = useState<any>();
  const [company, setCompany] = useState<any>("");
  const [mob, setMob] = useState("");
  const [mobileErr, setMobileErr] = useState(false);
  const [phoneNo, setPhoneNo] = useState(),
    [phoneCode, setPhoneCode] = useState(""),
    [selectedPhone, setSelectedPhone] = useState(""),
    { UserCheck } = useSelector((state: any) => state.userMailVerify);

  const profileImageSize = bytesToMegabytes(
    Number(environment.profileImageSize)
  );

  const [bindEmpData, setBindEmpData] = useState({
    industrialType: "",
    contactPerson: "",
    alias: "",
    contactPersonDesignation: "",
    websiteUrl: "",
    country: "",
    altCountry: "",
    phoneNumber1: "",
    phoneNumber2: "",
    profileforHotVacancies: "",
    profileforClassifieds: "",
    faxNumber: "",
    TANNumber: "",
    Pincode: "",
    address: "",
  });
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();

  // profile upload and download api
  const UploadLogo = useSelector((state: any) => state.companylogo);
  const { response, loadingg, errorss } = UploadLogo;

  // bind employee profile
  const empDetails = useSelector((state: any) => state.employeeProfile);
  const { EmployerProfile, loading } = empDetails;

  // update company info
  const updateEmpDetails = useSelector((state: any) => state.companyInfo);
  const { companyInfo } = updateEmpDetails;
  const errorMessage = companyInfo?.response?.data?.message;

  // industry
  const { IndustryType } = useSelector((state: any) => state.industryType);

  // download logo api
  const { companyLogo, loads } = useSelector(
    (state: any) => state.downloadLogo
  );

  useEffect(() => {
    if (response?.code === 200) {
      showSnackAlert("success", "Your Company Logo uploaded successfully.");
      dispatch(downloadLogo());
      setTimeout(() => {
        dispatch(resetProfile());
      }, 1000);
    } else if (
      UploadLogo &&
      UploadLogo.response &&
      UploadLogo.response.response &&
      UploadLogo.response?.code !== 200
    ) {
      showSnackAlert("warning", response.message);
      setTimeout(() => {
        dispatch(resetProfile());
      }, 1000);
    }
  }, [response.code, response, dispatch]);

  const handleProfileChange = (e: any) => {
    let regexImg = new RegExp(
      /[^\s]+(.*?).(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/
    );
    const uploadData = e.target?.files[0].type,
      logoName = e?.target?.files[0].name;
    if (!regex.imageNameRegex.test(logoName))
      showSnackAlert("warning", "Please give valid logo name, without # % .");
    else {
      if (uploadData) {
        if (regexImg.test(uploadData) == true) {
          if (e.target?.files[0].size > environment.profileImageSize) {
            showSnackAlert(
              "warning",
              `Logo size should not exceed ${profileImageSize}MB.`
            );
          } else {
            let formData = new FormData(); //formdata object
            formData.append("companyLogo", e.target?.files[0]);
            dispatch(uploadLogo(formData));
          }
        } else {
          showSnackAlert("warning", "Logo type should be JPG, JPEG, PNG, GIF.");
          e.target.files[0] = null;
          e.target.files = [];
        }
      }
    }
  };

  useEffect(() => {
    dispatch(downloadLogo());
  }, []);

  useEffect(() => {
    dispatch(getProfileDetails());
    dispatch(resetEmpLogActionCreator());
    dispatch(getIndustryType({ pageno: -1, search: "" }));
  }, [dispatch]);

  useEffect(() => {
    if (
      IndustryType &&
      IndustryType?.code &&
      IndustryType?.code === 200 &&
      !industries.length
    ) {
      IndustryType?.data.map((e: any, i: number) => {
        industries.push({ value: `${1 + i}`, label: e });
      });
    }
  }, [IndustryType]);

  useEffect(() => {
    if (!loading && EmployerProfile?.data && EmployerProfile?.data) {
      setformvalue(EmployerProfile?.data.profile);
      setCompany(EmployerProfile?.data.profile);
    }
  }, [EmployerProfile?.data, loading]);

  useEffect(() => {
    if (formvalue) {
      setSelectedIndus({
        label: formvalue.ind,
      });
      setBindEmpData({
        industrialType: "",
        contactPerson: formvalue?.poc?.name,
        alias: formvalue?.alias,
        contactPersonDesignation: formvalue?.poc?.role,
        websiteUrl: formvalue?.web,
        country: formvalue?.poc?.ph?.prim?.code,
        altCountry: formvalue?.poc?.ph?.secd
          ? formvalue?.poc?.ph?.secd[0]?.code
          : null,
        phoneNumber1: formvalue?.poc?.ph?.prim?.val,
        phoneNumber2: formvalue?.poc?.ph?.secd
          ? formvalue?.poc?.ph?.secd[0]?.val
          : null,
        profileforHotVacancies: formvalue?.hvpf,
        profileforClassifieds: formvalue?.clpf,
        faxNumber: formvalue?.fax,
        TANNumber: formvalue?.tan,
        address: formvalue?.adr?.street,
        Pincode: formvalue?.adr?.zip,
      });
      setSelectedCountryCode(formvalue?.poc?.ph?.prim?.code);
      // formvalue?.poc?.ph?.prim?.code
      formvalue?.poc?.ph?.secd?.length &&
        setSelectedCountryCode2(formvalue?.poc?.ph?.secd[0]?.code);
    }
    setPhoneNo(formvalue?.poc?.ph?.prim?.code);
    setPhoneCode(formvalue?.poc?.ph?.prim?.code);
  }, [formvalue]);

  useEffect(() => {
    if (companyInfo.code === 200) {
      showSnackAlert("success", companyInfo.message);
      dispatch(getProfileDetails());
      setLoader(false);
      dispatch(resetCompanyDetails());
    } else if (
      (companyInfo &&
        companyInfo.response &&
        companyInfo.response.status === 401) ||
      (companyInfo &&
        companyInfo.response &&
        companyInfo.response.status === 400)
    ) {
      showSnackAlert("warning", errorMessage);
      setLoader(false);
      dispatch(resetCompanyDetails());
    } else if (
      companyInfo &&
      companyInfo.response &&
      companyInfo.response.status !== 200
    ) {
      showSnackAlert("error", errorMessage);
      setLoader(false);
      dispatch(resetCompanyDetails());
    }
  }, [companyInfo, errorMessage]);

  const onSubmit: any = async (values: any, actions: any) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    actions.resetForm();
  };

  const changeHandler = (e: any) => {
    setSelectedIndus(e);
    setSelectedValue(e.label);
  };

  const updateCompanyInfo = () => {
    const companyinfomodel: any = {
      company_info: {
        industry_type: selectedValue || formvalue.ind,
        alias: values.alias,
        poc: {
          ph: {
            primary: {
              val: values.phoneNumber1,
              code: values.country ? values.country : "+91",
            },
            secondary: values.phoneNumber2
              ? [
                  {
                    val: values.phoneNumber2 ? values.phoneNumber2 : null,
                    code: values.altCountry ? values.altCountry : "+91",
                  },
                ]
              : null,
          },
          name: values.contactPerson,
          designation: values.contactPersonDesignation,
        },
        website: values.websiteUrl,
        hv_profile: values.profileforHotVacancies,
        cl_profile: values.profileforClassifieds,
        fax: values.faxNumber,
        tan: values.TANNumber,
        adr: {
          street: values.address,
          zip: values.Pincode,
        },
      },
    };
    dispatch(companyDetails(companyinfomodel));
    setLoader(true);
  };

  const {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: bindEmpData,
    validationSchema: EmployeeProfilesSchema,
    enableReinitialize: true,
    onSubmit: updateCompanyInfo,
  });

  const errorsection =
    errors.contactPerson && touched.contactPerson ? "input-error" : "";
  const nameProp = `form-control ${errorsection} `;

  useEffect(() => {
    if (UserCheck && UserCheck.code && UserCheck.code === 200) {
      if (
        UserCheck?.data[0]?.key === "phone" &&
        UserCheck?.data[0]?.exist === true
      ) {
        setMobileErr(true);
        if (UserCheck?.data[0]?.value === phoneNo) setMobileErr(false);
      } else if (
        UserCheck?.data[0]?.key === "phone" &&
        UserCheck?.data[0]?.exist === false
      ) {
        if (UserCheck?.data[0]?.value === mob) setMobileErr(false);
        setMobileErr(false);
      }
      if (
        phoneNo === UserCheck?.data[0]?.value &&
        selectedCountryCode?.phone === UserCheck?.data[0]?.code
      ) {
        setMobileErr(false);
      }
      if (
        phoneNo === UserCheck?.data[0]?.value &&
        selectedCountryCode === UserCheck?.data[0]?.code
      ) {
        setMobileErr(false);
      }
    }
  }, [UserCheck, mobileErr]);

  useEffect(() => {
    dispatch(getCountryCode({ pageno: -1, search: "" }));
    setMobileErr(false);
  }, []);

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
            code: `${selectedCountryCode ? selectedCountryCode : "+91"}`,
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
  }, [selectedCountryCode, selectedPhone]);

  return (
    <>
      {(loading || loadingg) && <EmployerProfileSkelton />}
      {(!loading || !loadingg) && (
        <div className="page-content bg-white">
          <div className="content-block">
            <div className="browse-job section-full bg-white p-t50 p-b20">
              <div className="container">
                <div className="job-bx browse-job clearfix m-b30 mt-5">
                  <div className="job-bx-title clearfix NativeTitle">
                    <div className="d-flex justify-content-between align-items-end">
                      <h5 className="font-weight-700 pull-left text-uppercase">
                        Company Profile
                      </h5>
                      <h6
                        className="font-weight-700 text-uppercase"
                        style={{
                          color: "#004aad",
                          fontSize: "16px",
                          fontWeight: "500",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        title={company?.name}
                      >
                        {company?.name}
                      </h6>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xl-3 col-lg-4 m-t40">
                      <div>
                        <div className="">
                          <div className="candidate-detail text-center can-details">
                            <div
                              className="canditate-des"
                              style={{
                                border: "2px solid #c7c4c4",
                                borderRadius: "5px",
                              }}
                            >
                              <Link to={"#"}>
                                <img
                                  style={{
                                    height: "140px",
                                    width: "150px",
                                    objectFit: "contain",
                                  }}
                                  alt="Company_logo"
                                  src={
                                    companyLogo?.data?.sas_url
                                      ? `${companyLogo?.data?.sas_url}`
                                      : require("../../../../assets/images/av-pic-01.png")
                                  }
                                />
                              </Link>
                              <div
                                className="upload-link"
                                title="Upload Company Logo"
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
                        <div
                          className="job-bx-title"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <h5 className="modal-title">Company Profile</h5>
                        </div>

                        <Form onSubmit={handleSubmit} autoComplete="off">
                          <div className="row">
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>Industrial Type</label>
                                <span style={{ color: "red" }}>*</span>

                                <Select
                                  placeholder="Please select Industrial Type"
                                  value={selectedIndus}
                                  name="industrialType"
                                  onChange={(option: any) => {
                                    changeHandler(option);
                                    setFieldValue(
                                      "industry_type",
                                      option?.lable
                                    );
                                  }}
                                  isSearchable={true}
                                  options={industries}
                                  className={"dropstyle"}
                                  styles={customStyles}
                                />
                                {/* {errors.industrialType &&
                              touched.industrialType && (
                                <p className="form-error">
                                  {errors.industrialType}
                                </p>
                              )} */}
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>Contact Person</label>
                                <span style={{ color: "red" }}>*</span>
                                <input
                                  type="text"
                                  placeholder="Enter Contact Person name."
                                  name="contactPerson"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.contactPerson}
                                  className={nameProp}
                                />
                                {errors.contactPerson &&
                                  touched.contactPerson && (
                                    <p className="form-error">
                                      {errors.contactPerson}
                                    </p>
                                  )}
                              </div>
                            </div>{" "}
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>Alias</label>
                                <input
                                  type="text"
                                  placeholder="Please provide a common name for your account."
                                  name="alias"
                                  onChange={handleChange}
                                  maxLength={150}
                                  onBlur={handleBlur}
                                  value={values.alias}
                                  className={nameProp}
                                />
                                {errors.alias && touched.alias && (
                                  <p className="form-error">{errors.alias}</p>
                                )}
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>Contact Person's Designation</label>
                                <input
                                  type="text"
                                  placeholder="Enter Contact Person's Designation."
                                  name="contactPersonDesignation"
                                  onChange={handleChange}
                                  maxLength={150}
                                  onBlur={handleBlur}
                                  value={values.contactPersonDesignation}
                                  className={nameProp}
                                />
                                {errors.contactPersonDesignation &&
                                  touched.contactPersonDesignation && (
                                    <p className="form-error">
                                      {errors.contactPersonDesignation}
                                    </p>
                                  )}
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>Primary Phone Number</label>
                                <span style={{ color: "red" }}>*</span>
                                <div id="phonenumbers">
                                  <div style={{ width: "120px" }} id="mob">
                                    <Select
                                      maxMenuHeight={200}
                                      minMenuHeight={200}
                                      id="codemob"
                                      className="dropstyle"
                                      name="country"
                                      value={countries.find(
                                        (e) => selectedCountryCode === e.phone
                                      )}
                                      options={countries}
                                      placeholder="Select Code"
                                      defaultValue={{
                                        value: "0",
                                        label: "India",
                                        phone: "+91",
                                      }}
                                      onChange={(option: any) => {
                                        setSelectedCountryCode(option.phone);
                                        setFieldValue("country", option.phone);
                                      }}
                                      onInputChange={(e) => {
                                        if (e?.length > 5) return "";
                                      }}
                                      formatOptionLabel={formatOptionLabel}
                                      filterOption={customFilter}
                                    />
                                  </div>
                                  <input
                                    type="text"
                                    placeholder="Enter Primary Phone Number."
                                    name="phoneNumber1"
                                    id="phonenums"
                                    minLength={6}
                                    maxLength={12}
                                    onChange={(e: any) => {
                                      regex.numberTyping.test(
                                        e?.target?.value
                                      ) && handleChange(e);
                                    }}
                                    onBlur={(e: any) => {
                                      handleBlur(e);
                                      setSelectedPhone(e?.target?.value);
                                      setMob(e?.target?.value);
                                    }}
                                    value={values.phoneNumber1}
                                    className={nameProp}
                                  />
                                </div>
                                {!errors.phoneNumber1 && mobileErr && (
                                  <p className="form-error">
                                    Please check, entered Phone Number is
                                    already exists!
                                  </p>
                                )}
                                {errors.phoneNumber1 &&
                                  touched.phoneNumber1 && (
                                    <p className="form-error">
                                      {errors.phoneNumber1}
                                    </p>
                                  )}
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>Secondary Phone Number</label>
                                <div id="phonenumbers">
                                  <div style={{ width: "140px" }} id="mob">
                                    <Select
                                      maxMenuHeight={200}
                                      minMenuHeight={200}
                                      id="codemob"
                                      className="dropstyle"
                                      name="altCountry"
                                      options={countries}
                                      value={countries.find(
                                        (e) => selectedCountryCode2 === e.phone
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
                                      formatOptionLabel={formatOptionLabel}
                                      filterOption={customFilter}
                                    />
                                  </div>
                                  <input
                                    type="text"
                                    placeholder="Enter Secondary Phone Number."
                                    name="phoneNumber2"
                                    id="phonenums"
                                    maxLength={12}
                                    onChange={(e: any) => {
                                      if (
                                        regex.numberRegx.test(e.target.value)
                                      ) {
                                        handleChange(e);
                                      } else {
                                        e.target.value = "";
                                      }
                                    }}
                                    onBlur={handleBlur}
                                    value={values.phoneNumber2 || ""}
                                    className={nameProp}
                                  />
                                </div>
                                {errors.phoneNumber2 &&
                                  touched.phoneNumber2 && (
                                    <p className="form-error">
                                      {errors.phoneNumber2}
                                    </p>
                                  )}
                              </div>
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12">
                              <div className="form-group">
                                <label>Website URL</label>
                                <input
                                  type="text"
                                  placeholder="Enter Website URL."
                                  name="websiteUrl"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.websiteUrl}
                                  className={nameProp}
                                />
                                {errors.websiteUrl && touched.websiteUrl && (
                                  <p className="form-error">
                                    {errors.websiteUrl}
                                  </p>
                                )}
                              </div>
                              {/* <div className="form-group">
                                <label>Address</label>
                                <span style={{ color: "red" }}>*</span>
                                <input
                                  type="text"
                                  placeholder="Enter Company Address."
                                  name="address"
                                  onChange={handleChange}
                                  maxLength={500}
                                  onBlur={handleBlur}
                                  value={values.address}
                                  className={nameProp}
                                />
                                {errors.address && touched.address && (
                                  <p className="form-error">{errors.address}</p>
                                )}
                              </div> */}
                            </div>
                            {/* <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <label>Profile for Hot Vacancies</label>
                            <input
                              type="text"
                              placeholder="Enter Profile for Hot Vacancies."
                              name="profileforHotVacancies"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.profileforHotVacancies}
                              className={nameProp}
                            />
                            {errors.profileforHotVacancies &&
                              touched.profileforHotVacancies && (
                                <p className="form-error">
                                  {errors.profileforHotVacancies}
                                </p>
                              )}
                          </div>
                        </div>
                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <label>Profile for Classifieds</label>
                            <input
                              type="text"
                              placeholder="Enter Profile for Classifieds."
                              name="profileforClassifieds"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.profileforClassifieds}
                              className={nameProp}
                            />
                            {errors.profileforClassifieds &&
                              touched.profileforClassifieds && (
                                <p className="form-error">
                                  {errors.profileforClassifieds}
                                </p>
                              )}
                          </div>
                        </div> */}
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>Fax Number</label>
                                <input
                                  type="text"
                                  placeholder="Enter Fax Number."
                                  name="faxNumber"
                                  maxLength={15}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.faxNumber}
                                  className={nameProp}
                                />
                                {errors.faxNumber && touched.faxNumber && (
                                  <p className="form-error">
                                    {errors.faxNumber}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>TAN Number</label>
                                <input
                                  type="text"
                                  placeholder="Enter TAN Number."
                                  name="TANNumber"
                                  maxLength={10}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.TANNumber}
                                  className={nameProp}
                                />
                                {errors.TANNumber && touched.TANNumber && (
                                  <p className="form-error">
                                    {errors.TANNumber}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6 col-sm-6">
                              <div className="form-group">
                                <label>Address</label>
                                <span style={{ color: "red" }}>*</span>
                                <textarea
                                  placeholder="Enter Company Address."
                                  name="address"
                                  onChange={handleChange}
                                  maxLength={500}
                                  onBlur={handleBlur}
                                  value={values.address}
                                  className={nameProp}
                                />
                                {errors.address && touched.address && (
                                  <p className="form-error">{errors.address}</p>
                                )}
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="form-group">
                                <label>Pincode</label>
                                <span style={{ color: "red" }}>*</span>
                                <input
                                  maxLength={6}
                                  minLength={4}
                                  type="text"
                                  placeholder="Enter Company Pin code."
                                  name="Pincode"
                                  onChange={(e) => {
                                    regex.numberTyping.test(e.target.value) &&
                                      handleChange(e);
                                  }}
                                  onBlur={handleBlur}
                                  value={values.Pincode}
                                  className={nameProp}
                                />
                                {errors.Pincode && touched.Pincode && (
                                  <p className="form-error">{errors.Pincode}</p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div style={{ textAlign: "end" }}>
                            <button
                              type="submit"
                              // onClick={updateCompanyInfo}
                              className="site-button m-b30"
                              // className={`${btnupdate.className}`}
                              // style={btnupdate.style}
                              // disabled={loader}
                              disabled={!isValid}
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
                      {/* <AccountDetails /> */}
                      <KYCDetails />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CompanyProfile;
