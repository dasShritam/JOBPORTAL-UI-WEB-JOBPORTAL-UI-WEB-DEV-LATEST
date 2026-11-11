// import React, { ChangeEvent, useEffect, useRef, useState } from "react";
// import { Link } from "react-router-dom";
// import { Button, Form, Modal } from "react-bootstrap";
// import logo2 from "../../../../assets/images/banner/kyc header.jpg";
// import { BsPencil } from "react-icons/bs";
// import "../../../../assets/customCss/kycinfo.css";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import {
//   Box,
//   Step,
//   StepContent,
//   StepLabel,
//   Stepper,
//   Typography,
// } from "@mui/material";
// import { KYCInformation } from "../../../../redux/features/manage-account/profile/EmployerProfileSlice";
// import { FORM_VALIDATION_KYC, KYCDetailsSchema } from "./employerTypes";
// import { useDispatch, useSelector } from "react-redux";
// import { UseToastAlert } from "../../../../hooks/useToastAlert";

// function KYCDetails() {
//   const showSnackAlert = UseToastAlert();
//   const [openModel, setOpenModel] = useState<boolean>(false);
//   const [openVerifyModel, setOpenVerifyModel] = useState<boolean>(false);
//   const [btnClass, setBtnClass] = useState({
//     className: "site-button float-center",
//     style: { cursor: "default", backgroundColor: "#bdbebf" },
//   });
//   const [createbtn, setCreatebtn] = useState({
//     className: "site-button float-center",
//     style: { cursor: "default", backgroundColor: "#bdbebf" },
//   });
//   const [activeStep, setActiveStep] = React.useState(0);
//   const [skipped, setSkipped] = React.useState(new Set<number>());
//   const [activeOtpIndex, setActiveOtpIndex] = useState(0);
//   const [otp, setOtp] = useState(new Array(6).fill(""));
//   const inputRef = useRef<HTMLInputElement>(null);
//   // Employe data bind
//   const empDetails = useSelector((state: any) => state.employeeProfile);
//   const { EmployerProfile, loading, error } = empDetails;

//   // Update Account info
//   const KYCData = useSelector((state: any) => state.kycInfo);
//   const { KYCInfo } = KYCData;
//   const kycerrorMessage = KYCInfo?.response?.data?.message;

//   const [formvalue, setformvalue] = useState<any>();
//   const [bindAccInfo, setBindAccInfo] = useState({
//     kycstatus: "",
//     pannumber: "",
//     panName: "",
//     DatePan: "",
//     Addresslabel: "",
//     address: "",
//     country: "",
//     state: "",
//     city: "",
//     pincode: "",
//     GSTIN: "",
//   });
//   const dispatch = useDispatch();
//   const [loader, setLoader] = useState(false);

//   useEffect(() => {
//     if (!loading && EmployerProfile?.data && EmployerProfile?.data) {
//       setformvalue(EmployerProfile?.data?.kyc);
//     }
//   }, [EmployerProfile?.data, loading]);

//   useEffect(() => {
//     if (formvalue) {
//       setBindAccInfo({
//         kycstatus: formvalue.sts,
//         pannumber: formvalue.pan.no,
//         panName: formvalue.pan.name,
//         DatePan: formvalue.pan.date,
//         Addresslabel: formvalue.adr.state,
//         address: formvalue.adr.state,
//         country: formvalue.adr.state,
//         state: formvalue.adr.state,
//         city: formvalue.adr.state,
//         pincode: formvalue.adr.state,
//         GSTIN: formvalue.gstin,
//       });
//     }
//   }, [formvalue]);

//   const updateKYCInfo = (e) => {
//     e.preventDefault();
//     const KYCmodel = {
//       status: values.kycstatus,
//       panNo: values.pannumber,
//       panName: values.panName,
//       panDate: values.DatePan,
//       gstin: values.GSTIN,
//     };
//     dispatch(KYCInformation(KYCmodel));
//     setLoader(true);
//   };

//   useEffect(() => {
//     if (KYCInfo.code === 200) {
//       showSnackAlert("success", KYCInfo.message);
//       setLoader(false);
//     } else if (
//       (KYCInfo && KYCInfo.response && KYCInfo.response.status === 401) ||
//       (KYCInfo && KYCInfo.response && KYCInfo.response.status === 400)
//     ) {
//       showSnackAlert("warning", kycerrorMessage);
//       setLoader(false);
//     } else if (KYCInfo && KYCInfo.response && KYCInfo.response.status !== 200) {
//       showSnackAlert("error", kycerrorMessage);
//       setLoader(false);
//     }
//   }, [KYCInfo, kycerrorMessage]);

//   const hideKYCmodel = () => {
//     setOpenModel(false);
//   };

//   const hideVerificationmodel = () => {
//     setOpenVerifyModel(false);
//   };

//   const openModelFn = () => {
//     setOpenModel(true);
//   };

//   const openVerifyModelFn = () => {
//     setOpenVerifyModel(true);
//   };

//   const formikKyc = useFormik({
//     initialValues: {
//       termsAndConditions: false,
//       companyType: "",
//     },
//     onSubmit: (e: any) => {
//       e.preventDefault();
//       formikKyc.resetForm();
//     },
//   });

//   const formikPan = useFormik({
//     initialValues: {
//       panNumber: "",
//       panName: "",
//     },
//     validationSchema: FORM_VALIDATION_KYC,
//     onSubmit: (e: any) => {
//       e.preventDefault();
//       handleNext();
//     },
//   });

//   const formikaadhar = useFormik({
//     initialValues: {
//       aadharNumber: "",
//     },
//     validationSchema: FORM_VALIDATION_KYC,
//     onSubmit: (e: any) => {
//       e.preventDefault();
//       handleNext();
//     },
//   });

//   const formikaadhar2 = useFormik({
//     initialValues: {
//       addresstype: "",
//     },
//     validationSchema: FORM_VALIDATION_KYC,
//     onSubmit: (e: any) => {
//       e.preventDefault();
//       handleNext();
//     },
//   });

//   const isEnabled = !formikPan.errors.panNumber && !formikPan.errors.panName;

//   const isStepSkipped = (step: number) => {
//     return skipped.has(step);
//   };

//   const handleNext = () => {
//     let newSkipped = skipped;
//     if (isStepSkipped(activeStep)) {
//       newSkipped = new Set(newSkipped.values());
//       newSkipped.delete(activeStep);
//     }

//     setActiveStep((prevActiveStep) => prevActiveStep + 1);
//     setSkipped(newSkipped);
//   };

//   const handleBack = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep - 1);
//   };

//   const handleReset = () => {
//     setActiveStep(0);
//   };

//   useEffect(() => {
//     if (isEnabled) {
//       setBtnClass({
//         className: "site-button mt-3",
//         style: { cursor: "pointer", backgroundColor: "" },
//       });
//     } else {
//       setBtnClass({
//         className: "site-button mt-3",
//         style: { cursor: "default", backgroundColor: "#bdbebf" },
//       });
//     }
//   }, [isEnabled]);

//   useEffect(() => {
//   }, [formikKyc.values.companyType]);

//   const kycsteps = ["PAN card verification", "Address verification"];
//   const aadharsteps = [
//     "Aadhaar card verification via OTP",
//     "Address verification",
//     "Photo verification",
//   ];
//   const otpChanges = (
//     { target }: ChangeEvent<HTMLInputElement>,
//     index: number
//   ) => {
//     const { value } = target;
//     const otpArr: string[] = [...otp];
//     otpArr[index] = value.substring(value.length - 1);
//     if (!value) setActiveOtpIndex(index);
//     else setActiveOtpIndex(index + 1);
//     setOtp(otpArr);
//   };
//   const otpKeyChanges = (
//     { key }: React.KeyboardEvent<HTMLInputElement>,
//     index: number
//   ) => {
//     if (key === "Backspace" && !otp[index]) setActiveOtpIndex(index - 1);
//     else if (key === "Backspace") setActiveOtpIndex(index - 0);
//   };

//   useEffect(() => {
//     inputRef.current?.focus();
//   }, [activeOtpIndex]);

//   function getStepContent(step: any) {
//     switch (step) {
//       case 0:
//         return (
//           <div>
//             <form autoComplete="off">
//               <div className="form-group">
//                 <label className="font-weight-700">
//                   Company PAN number
//                   <span className="maditory">*</span>
//                 </label>
//                 <input
//                   name="panNumber"
//                   className="form-control"
//                   placeholder="Please enter Pan Number."
//                   type="text"
//                   maxLength={200}
//                   autoComplete="new-text"
//                   onChange={formikPan.handleChange}
//                   onBlur={formikPan.handleBlur}
//                   value={formikPan.values.panNumber}
//                 />
//                 {formikPan.errors.panNumber && formikPan.touched.panNumber && (
//                   <p className="form-error">{formikPan.errors.panNumber}</p>
//                 )}
//               </div>
//               <div className="form-group">
//                 <label className="font-weight-700">
//                   Name on PAN card
//                   <span className="maditory">*</span>
//                 </label>
//                 <input
//                   name="panName"
//                   className="form-control"
//                   placeholder="Please enter Pan Name"
//                   type="text"
//                   maxLength={200}
//                   autoComplete="new-text"
//                   onChange={formikPan.handleChange}
//                   onBlur={formikPan.handleBlur}
//                   value={formikPan.values.panName}
//                 />
//                 {formikPan.errors.panName && formikPan.touched.panName && (
//                   <p className="form-error">{formikPan.errors.panName}</p>
//                 )}
//               </div>
//             </form>
//           </div>
//         );
//       case 1:
//         return (
//           <div>
//             <form autoComplete="off">
//               <div className="form-group">
//                 <label style={{ fontWeight: "bold" }}>Address proof type</label>
//                 <div className="row" style={{ width: "190%" }}>
//                   <div className="col-lg-4 col-md-4 col-sm-4 col-4">
//                     <div className="custom-control custom-radio">
//                       <input
//                         type="radio"
//                         name="pankycType"
//                         value="pancard"
//                         className="custom-control-input"
//                         id="pancard_radio"
//                         onChange={formikKyc.handleChange}
//                         checked={formikKyc.values.companyType === "pancard"}
//                       />
//                       <label
//                         className="custom-control-label"
//                         htmlFor="pancard_radio"
//                       >
//                         PAN Card
//                       </label>
//                     </div>
//                   </div>
//                   <div className="col-lg-4 col-md-4 col-sm-4 col-4">
//                     <div className="custom-control custom-radio">
//                       <input
//                         type="radio"
//                         name="pankycType"
//                         value="pancoi"
//                         className="custom-control-input"
//                         id="pancoi_radio"
//                         onChange={formikKyc.handleChange}
//                         checked={formikKyc.values.companyType === "pancoi"}
//                       />
//                       <label
//                         className="custom-control-label"
//                         htmlFor="pancoi_radio"
//                       >
//                         PAN COI
//                       </label>
//                     </div>
//                   </div>
//                 </div>
//                 <div style={{ fontSize: "14px", marginTop: "14px" }}>
//                   Address from PAN Card:
//                 </div>
//                 <div
//                   style={{
//                     fontSize: "13px",
//                     color: "#959191",
//                     marginBottom: "17px",
//                   }}
//                 >
//                   mg Road, kasturba building, 560027
//                 </div>
//                 <div>
//                   <i
//                     className="fa fa-exclamation-circle"
//                     aria-hidden="true"
//                     style={{ fontSize: "12px", color: "#e0d57f" }}
//                   ></i>{" "}
//                   <span style={{ fontSize: "12px" }}>
//                     We will update this address as your registered address.
//                   </span>
//                 </div>
//               </div>
//             </form>
//           </div>
//         );
//     }
//   }

//   function getStepContentAadhar(step: any) {
//     switch (step) {
//       case 0:
//         return (
//           <div>
//             <form autoComplete="off">
//               <div className="form-group">
//                 <label
//                   className="font-weight-700"
//                   style={{ marginTop: "11px" }}
//                 >
//                   Aadhaar Card Number
//                   <span className="maditory">*</span>
//                 </label>
//                 <input
//                   style={{ width: "52%" }}
//                   name="aadharNumber"
//                   className="form-control"
//                   placeholder="Please enter Aadhar Number."
//                   type="text"
//                   maxLength={200}
//                   autoComplete="new-text"
//                   onChange={formikaadhar.handleChange}
//                   onBlur={formikaadhar.handleBlur}
//                   value={formikaadhar.values.aadharNumber}
//                 />
//                 {formikaadhar.errors.aadharNumber &&
//                   formikaadhar.touched.aadharNumber && (
//                     <p className="form-error">
//                       {formikaadhar.errors.aadharNumber}
//                     </p>
//                   )}
//               </div>
//               <div>
//                 <i
//                   className="fa fa-exclamation-circle"
//                   aria-hidden="true"
//                   style={{ fontSize: "12px", color: "#e0d57f" }}
//                 ></i>{" "}
//                 <span style={{ fontSize: "12px" }}>
//                   We will update your contact name same as your Aadhar card.
//                 </span>
//               </div>
//               {/* <div className="jobs">
//                 <div>
//                   <button
//                     className="site-button backbon"
//                     id="backbtns"
//                     type="button"
//                     disabled={activeStep === 0}
//                     onClick={(e: any) => {
//                       handleBack();
//                       e.preventDefault();
//                     }}
//                   >
//                     <ArrowBackIosIcon className="backicons" />
//                     BACK
//                   </button>
//                 </div>
//                 <div>
//                   <button
//                     id="nextbtns"
//                     type="button"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       formikaadhar.handleSubmit();
//                     }}
//                     className={`${btnClass.className}`}
//                     style={btnClass.style}
//                     disabled={!isEnabled}
//                   >
//                     NEXT
//                     <ArrowForwardIosIcon className="nexticons" />
//                   </button>
//                 </div>
//               </div> */}
//             </form>
//           </div>
//         );
//       case 1:
//         return (
//           <div>
//             <form autoComplete="off">
//               <div className="form-group">
//                 <label style={{ fontWeight: "bold" }}>Address proof type</label>
//                 <div className="row" style={{ width: "190%" }}>
//                   <div className="col-lg-4 col-md-4 col-sm-4 col-4">
//                     <div className="custom-control custom-radio">
//                       <input
//                         type="radio"
//                         name="addresstype"
//                         value="aadharcard"
//                         className="custom-control-input"
//                         id="aadharcard_radio"
//                         onChange={formikaadhar2.handleChange}
//                         checked={
//                           formikaadhar2.values.addresstype === "aadharcard"
//                         }
//                       />
//                       <label
//                         className="custom-control-label"
//                         htmlFor="aadharcard_radio"
//                       >
//                         Aadhar Card
//                       </label>
//                     </div>
//                   </div>
//                   <div className="col-lg-4 col-md-4 col-sm-4 col-4">
//                     <div className="custom-control custom-radio">
//                       <input
//                         type="radio"
//                         name="addresstype"
//                         value="aadharGST"
//                         className="custom-control-input"
//                         id="aadharGST_radio"
//                         onChange={formikaadhar2.handleChange}
//                         checked={
//                           formikaadhar2.values.addresstype === "aadharGST"
//                         }
//                       />

//                       <label
//                         className="custom-control-label"
//                         htmlFor="aadharGST_radio"
//                       >
//                         GST certification
//                       </label>
//                     </div>
//                   </div>
//                 </div>
//                 <div style={{ fontSize: "14px", marginTop: "24px" }}>
//                   Address from Aadhar Card:
//                 </div>
//                 <div
//                   style={{
//                     fontSize: "13px",
//                     color: "#959191",
//                     marginBottom: "17px",
//                   }}
//                 >
//                   mg Road, kasturba building, 560027
//                 </div>
//                 <div>
//                   <i
//                     className="fa fa-exclamation-circle"
//                     aria-hidden="true"
//                     style={{ fontSize: "12px", color: "#e0d57f" }}
//                   ></i>{" "}
//                   <span style={{ fontSize: "12px" }}>
//                     We will update this address as your registered address.
//                   </span>
//                 </div>
//                 <div></div>
//               </div>
//             </form>
//           </div>
//         );
//       case 2:
//         return (
//           <div>
//             <form autoComplete="off">
//               <div className="form-group">
//                 <label style={{ fontWeight: "bold" }}>Address proof type</label>
//                 <div className="row" style={{ width: "190%" }}>
//                   <div className="col-lg-4 col-md-4 col-sm-4 col-4">
//                     <div className="custom-control custom-radio">
//                       <input
//                         type="radio"
//                         name="pankycType"
//                         value="pancard"
//                         className="custom-control-input"
//                         id="pancard_radio"
//                         onChange={formikKyc.handleChange}
//                         checked={formikKyc.values.companyType === "pancard"}
//                       />
//                       <label
//                         className="custom-control-label"
//                         htmlFor="pancard_radio"
//                       >
//                         PAN Card
//                       </label>
//                     </div>
//                   </div>
//                   <div className="col-lg-4 col-md-4 col-sm-4 col-4">
//                     <div className="custom-control custom-radio">
//                       <input
//                         type="radio"
//                         name="pankycType"
//                         value="pancoi"
//                         className="custom-control-input"
//                         id="pancoi_radio"
//                         onChange={formikKyc.handleChange}
//                         checked={formikKyc.values.companyType === "pancoi"}
//                       />
//                       <label
//                         className="custom-control-label"
//                         htmlFor="pancoi_radio"
//                       >
//                         PAN COI
//                       </label>
//                     </div>
//                   </div>
//                 </div>
//                 <div style={{ fontSize: "14px", marginTop: "14px" }}>
//                   Address from PAN Card:
//                 </div>
//                 <div
//                   style={{
//                     fontSize: "13px",
//                     color: "#959191",
//                     marginBottom: "17px",
//                   }}
//                 >
//                   mg Road, kasturba building, 560027
//                 </div>
//                 <div>
//                   <i
//                     className="fa fa-exclamation-circle"
//                     aria-hidden="true"
//                     style={{ fontSize: "12px", color: "#e0d57f" }}
//                   ></i>{" "}
//                   <span style={{ fontSize: "12px" }}>
//                     We will update this address as your registered address.
//                   </span>
//                 </div>
//                 <div></div>
//                 {/* buttons */}
//                 {/* <div className="jobs">
//                   <div>
//                     <button
//                       className="site-button"
//                       id="backbtns"
//                       type="button"
//                       disabled={activeStep === 0}
//                       onClick={(e: any) => {
//                         handleBack();
//                         e.preventDefault();
//                       }}
//                     >
//                       <ArrowBackIosIcon className="backicons" />
//                       BACK
//                     </button>
//                   </div>
//                   <div>
//                     <button
//                       id="finalBtn"
//                       onClick={(e) => {
//                         e.preventDefault();
//                         formikPan.handleSubmit();
//                       }}
//                       type="submit"
//                       className={`${createbtn.className}`}
//                       style={createbtn.style}
//                     >
//                       Submit
//                     </button>
//                   </div>
//                 </div> */}
//               </div>
//             </form>
//           </div>
//         );
//     }
//   }

//   const onSubmit = async (values: any, actions: any) => {
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     actions.resetForm();
//   };

//   const {
//     values,
//     errors,
//     touched,
//     isSubmitting,
//     handleBlur,
//     handleChange,
//     handleSubmit,
//   } = useFormik({
//     initialValues: bindAccInfo,
//     validationSchema: KYCDetailsSchema,
//     enableReinitialize: true,
//     onSubmit,
//   });

//   const y = errors.kycstatus && touched.kycstatus ? "input-error" : "";
//   const t = `form-control ${y} `;
//   return (
//     <>
//       <div className="page-content bg-white">
//         <div className="content-block">
//           <div className="section-full bg-white p-t50 p-b20">
//             <div className="container">
//               <div className="row">
//                 <div
//                   id="KYC_Compliance_Details_bx"
//                   className="job-bx submit-resume"
//                 >
//                   <div className="job-bx-title clearfix">
//                     <h5 className="font-weight-700 pull-left text-uppercase">
//                       KYC Compliance Details
//                     </h5>
//                     {/* <Link
//                       to={"#"}
//                       onClick={() => {
//                         openModelFn();
//                       }}
//                       className="edit-icon"
//                     >
//                       <span style={{ fontSize: "20px" }}>
//                         <BsPencil />
//                       </span>
//                     </Link> */}
//                   </div>
//                   <form>
//                     <div className="row m-b30">
//                       <div className="col-lg-6 col-md-6">
//                         <div className="form-group">
//                           <label>KYC Status</label>
//                           <input
//                             type="text"
//                             placeholder="Enter KYC Status"
//                             name="kycstatus"
//                             onChange={handleChange}
//                             value={values.kycstatus}
//                             onBlur={handleBlur}
//                             className={t}
//                           />
//                           {errors.kycstatus && touched.kycstatus && (
//                             <p className="error">{errors.kycstatus}</p>
//                           )}
//                         </div>
//                       </div>
//                       <div className="col-lg-6 col-md-6">
//                         <div className="form-group">
//                           <label>PAN Number</label>
//                           <input
//                             type="text"
//                             placeholder="Enter PAN Number"
//                             name="pannumber"
//                             onChange={handleChange}
//                             value={values.pannumber}
//                             onBlur={handleBlur}
//                             className={t}
//                           />
//                           {errors.pannumber && touched.pannumber && (
//                             <p className="error">{errors.pannumber}</p>
//                           )}
//                         </div>
//                       </div>

//                       <div className="col-lg-6 col-md-6">
//                         <div className="form-group">
//                           <label>Name on PAN Card</label>
//                           <input
//                             type="text"
//                             placeholder="Enter Name on PAN Card."
//                             name="panName"
//                             onChange={handleChange}
//                             value={values.panName}
//                             onBlur={handleBlur}
//                             className={t}
//                           />
//                           {errors.panName && touched.panName && (
//                             <p className="error">{errors.panName}</p>
//                           )}
//                         </div>
//                       </div>
//                       <div className="col-lg-6 col-md-6">
//                         <div className="form-group">
//                           <label>Date on PAN Card</label>
//                           <input
//                             type="text"
//                             placeholder="Please Date on PAN Card"
//                             name="DatePan"
//                             onChange={handleChange}
//                             value={values.DatePan}
//                             onBlur={handleBlur}
//                             className={t}
//                           />
//                           {errors.DatePan && touched.DatePan && (
//                             <p className="error">{errors.DatePan}</p>
//                           )}
//                         </div>
//                       </div>
//                       <div className="col-lg-6 col-md-6">
//                         <div className="form-group">
//                           <label>Address Lable</label>
//                           <input
//                             readOnly
//                             type="text"
//                             placeholder="Enter Address Lable."
//                             name="Addresslabel"
//                             onChange={handleChange}
//                             value={values.Addresslabel}
//                             onBlur={handleBlur}
//                             className={t}
//                             style={{ color: "#aeb1b3" }}
//                           />
//                           {errors.Addresslabel && touched.Addresslabel && (
//                             <p className="error">{errors.Addresslabel}</p>
//                           )}
//                         </div>
//                       </div>
//                       <div className="col-lg-6 col-md-6">
//                         <div className="form-group">
//                           <label>Address</label>
//                           <input
//                             readOnly
//                             type="text"
//                             placeholder="Enter Address"
//                             name="address"
//                             onChange={handleChange}
//                             value={values.address}
//                             onBlur={handleBlur}
//                             className={t}
//                             style={{ color: "#aeb1b3" }}
//                           />
//                           {errors.address && touched.address && (
//                             <p className="error">{errors.address}</p>
//                           )}
//                         </div>
//                       </div>
//                       <div className="col-lg-4 col-md-4">
//                         <div className="form-group">
//                           <label>Country</label>
//                           <input
//                             readOnly
//                             type="text"
//                             placeholder="Enter Country."
//                             name="country"
//                             onChange={handleChange}
//                             value={values.country}
//                             onBlur={handleBlur}
//                             className={t}
//                             style={{ color: "#aeb1b3" }}
//                           />
//                           {errors.country && touched.country && (
//                             <p className="error">{errors.country}</p>
//                           )}
//                         </div>
//                       </div>
//                       <div className="col-lg-4 col-md-4">
//                         <div className="form-group">
//                           <label>State</label>
//                           <input
//                             readOnly
//                             type="text"
//                             placeholder="Enter State."
//                             name="state"
//                             onChange={handleChange}
//                             value={values.state}
//                             onBlur={handleBlur}
//                             className={t}
//                             style={{ color: "#aeb1b3" }}
//                           />
//                           {errors.state && touched.state && (
//                             <p className="error">{errors.state}</p>
//                           )}
//                         </div>
//                       </div>
//                       <div className="col-lg-4 col-md-4">
//                         <div className="form-group">
//                           <label>City</label>
//                           <input
//                             readOnly
//                             type="text"
//                             placeholder="Enter City."
//                             name="city"
//                             onChange={handleChange}
//                             value={values.city}
//                             onBlur={handleBlur}
//                             className={t}
//                             style={{ color: "#aeb1b3" }}
//                           />
//                           {errors.city && touched.city && (
//                             <p className="error">{errors.city}</p>
//                           )}
//                         </div>
//                       </div>
//                       <div className="col-lg-6 col-md-6">
//                         <div className="form-group">
//                           <label>Pincode</label>
//                           <input
//                             readOnly
//                             type="text"
//                             placeholder="Enter Pincode."
//                             name="pincode"
//                             onChange={handleChange}
//                             value={values.pincode}
//                             onBlur={handleBlur}
//                             className={t}
//                             style={{ color: "#aeb1b3" }}
//                           />
//                           {errors.pincode && touched.pincode && (
//                             <p className="error">{errors.pincode}</p>
//                           )}
//                         </div>
//                       </div>
//                       <div className="col-lg-6 col-md-6">
//                         <div className="form-group">
//                           <label>GSTIN</label>
//                           <input
//                             type="text"
//                             placeholder="Enter GSTIN."
//                             name="GSTIN"
//                             onChange={handleChange}
//                             value={values.GSTIN}
//                             onBlur={handleBlur}
//                             className={t}
//                           />
//                           {errors.GSTIN && touched.GSTIN && (
//                             <p className="error">{errors.GSTIN}</p>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                     <div style={{ textAlign: "end" }}>
//                       <button
//                         type="submit"
//                         className="site-button m-b30"
//                         onClick={updateKYCInfo}
//                       >
//                         {loader && (
//                           <i
//                             className="fa fa-circle-o-notch fa-spin"
//                             style={{ marginRight: "10px" }}
//                           ></i>
//                         )}
//                         {loader ? "Updating" : "Update"}
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* KYC Model for selection of company */}
//           <Modal
//             className="modal fade browse-job modal-bx-info modeldesign editor mt-4"
//             show={openModel}
//             backdrop="static"
//             onHide={() => {
//               hideKYCmodel();
//             }}
//           >
//             <div className="modal-dialog modelwid my-0 kycbox" role="document">
//               <div className="modal-content modelstyle">
//                 <div className="modal-body" style={{ padding: "34px 25px" }}>
//                   <div className="modal-custom-header">
//                     <h5
//                       className="modal-title"
//                       id="DesiredprofileModalLongTitle"
//                     >
//                       <div style={{ textAlign: "center" }}>
//                         <img
//                           src={logo2}
//                           style={{ width: "36%" }}
//                           alt="kyc header"
//                         />
//                       </div>
//                     </h5>
//                     <div style={{ top: "10%" }}>
//                       <button
//                         type="button"
//                         className="close"
//                         onClick={() => {
//                           setOpenModel(false);
//                         }}
//                       >
//                         <span aria-hidden="true">&times;</span>
//                       </button>
//                     </div>
//                   </div>
//                   <div className="headerkyc">Complete your KYC</div>
//                   <form>
//                     <div className="comSelection">
//                       <div className="col-lg-12 col-md-12">
//                         <div className="form-group">
//                           <label style={{ fontWeight: "bold" }}>
//                             Choose one, that best describes your firm "company
//                             name"
//                           </label>
//                           {/* start Radio Buttons  */}
//                           <div className="row">
//                             <div className="col-lg-4 col-md-4 col-sm-4 col-4">
//                               <div className="custom-control custom-radio">
//                                 <input
//                                   type="radio"
//                                   name="companyType"
//                                   value="company"
//                                   className="custom-control-input"
//                                   id="comp_radio"
//                                   onChange={formikKyc.handleChange}
//                                   checked={
//                                     formikKyc.values.companyType === "company"
//                                   }
//                                 />
//                                 <label
//                                   className="custom-control-label"
//                                   htmlFor="comp_radio"
//                                 >
//                                   Company/ Partnership
//                                 </label>
//                               </div>
//                             </div>

//                             <div className="col-lg-4 col-md-4 col-sm-4 col-4">
//                               <div className="custom-control custom-radio">
//                                 <input
//                                   name="companyType"
//                                   type="radio"
//                                   className="custom-control-input"
//                                   id="CompanyPartnership"
//                                   value="CompanyPartnership"
//                                   checked={
//                                     formikKyc.values.companyType ===
//                                     "CompanyPartnership"
//                                   }
//                                   onChange={formikKyc.handleChange}
//                                 />
//                                 <label
//                                   className="custom-control-label"
//                                   htmlFor="CompanyPartnership"
//                                 >
//                                   Proprietorship
//                                 </label>
//                               </div>
//                             </div>
//                             <div className="col-lg-4 col-md-4 col-sm-4 col-4">
//                               <div className="custom-control custom-radio">
//                                 <input
//                                   className="custom-control-input"
//                                   name="companyType"
//                                   type="radio"
//                                   id="Individual"
//                                   value="Individual"
//                                   checked={
//                                     formikKyc.values.companyType ===
//                                     "Individual"
//                                   }
//                                   onChange={formikKyc.handleChange}
//                                 />
//                                 <label
//                                   className="custom-control-label"
//                                   htmlFor="Individual"
//                                 >
//                                   Individual
//                                 </label>
//                               </div>
//                             </div>
//                           </div>

//                           {/* End Radio Buttons  */}
//                         </div>
//                       </div>

//                       {/* company and partenership */}
//                       {formikKyc.values.companyType === "company" && (
//                         <div className="col-lg-12 col-md-12">
//                           <label>
//                             As a Company/ Partnership entity you have to do
//                             following steps
//                           </label>
//                           <div style={{ display: "flex" }}>
//                             <div
//                               style={{ marginRight: "50px" }}
//                               className="comdesc"
//                             >
//                               <i
//                                 className="fa fa-check-circle-o greentik"
//                                 aria-hidden="true"
//                               ></i>
//                               Company registered PAN verification
//                             </div>
//                             <div className="comdesc">
//                               <i
//                                 className="fa fa-check-circle-o greentik"
//                                 aria-hidden="true"
//                               ></i>
//                               Address proof verification(GST or COI)
//                             </div>
//                           </div>
//                         </div>
//                       )}

//                       {/* Proprietorship */}
//                       {formikKyc.values.companyType ===
//                         "CompanyPartnership" && (
//                         <div className="col-lg-12 col-md-12">
//                           <label>
//                             As a Proprietorship entity you have to do following
//                             steps
//                           </label>
//                           <div style={{ display: "flex" }}>
//                             <div
//                               style={{ marginRight: "15px" }}
//                               className="comdesc"
//                             >
//                               <i
//                                 className="fa fa-check-circle-o greentik"
//                                 aria-hidden="true"
//                               ></i>
//                               Aadhar card OTP verify
//                             </div>
//                             <div
//                               style={{ marginRight: "15px" }}
//                               className="comdesc"
//                             >
//                               <i
//                                 className="fa fa-check-circle-o greentik"
//                                 aria-hidden="true"
//                               ></i>
//                               Address verify (via GST or Aadhar doc)
//                             </div>
//                             <div>
//                               <i
//                                 className="fa fa-check-circle-o greentik"
//                                 aria-hidden="true"
//                               ></i>
//                               Photo verify
//                             </div>
//                           </div>
//                         </div>
//                       )}

//                       {/* Individual */}
//                       {formikKyc.values.companyType === "Individual" && (
//                         <div className="col-lg-12 col-md-12">
//                           <label>
//                             As an Individual entity you have to do following
//                             steps
//                           </label>
//                           <div style={{ display: "flex" }}>
//                             <div
//                               style={{ marginRight: "15px" }}
//                               className="comdesc"
//                             >
//                               <i
//                                 className="fa fa-check-circle-o greentik"
//                                 aria-hidden="true"
//                               ></i>
//                               Aadhar card OTP verify
//                             </div>
//                             <div
//                               style={{ marginRight: "15px" }}
//                               className="comdesc"
//                             >
//                               <i
//                                 className="fa fa-check-circle-o greentik"
//                                 aria-hidden="true"
//                               ></i>
//                               Address verify (via GST or Aadhar doc)
//                             </div>
//                             <div>
//                               <i
//                                 className="fa fa-check-circle-o greentik"
//                                 aria-hidden="true"
//                               ></i>
//                               Photo verify
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     {/* Check Button KYC */}
//                     <div>
//                       <input
//                         name="termsAndConditions"
//                         id="checkbtn"
//                         type="checkbox"
//                         onChange={formikKyc.handleChange}
//                         onBlur={formikKyc.handleBlur}
//                       />
//                       &nbsp; &nbsp;
//                       <label
//                         style={{
//                           marginTop: "10px",
//                           color: "#00000082",
//                           width: "96%",
//                         }}
//                       >
//                         I provide consent for the verification of the documents,
//                         submitted here on behalf of my company, for purposes
//                         mentioned in the Privacy Policy and Terms and conditions
//                         . I also consent to get this verification done via third
//                         party service provider.
//                       </label>
//                       {formikKyc.errors.termsAndConditions &&
//                         formikKyc.touched.termsAndConditions && (
//                           <p className="form-error">
//                             {formikKyc.errors.termsAndConditions}
//                           </p>
//                         )}
//                     </div>

//                     <div className="buttn">
//                       <button
//                         type="button"
//                         onClick={() => {
//                           openVerifyModelFn();
//                           hideKYCmodel();
//                         }}
//                         className="site-button"
//                         style={{ fontSize: "14px" }}
//                       >
//                         Start KYC Process
//                       </button>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </Modal>

//           {/* Pan Card Verification */}
//           {/* {formikKyc.values.companyType === "company" && (
//             <Modal
//               className="modal fade browse-job modal-bx-info modeldesign editor mt-4"
//               show={openVerifyModel}
//               backdrop="static"
//               onHide={() => {
//                 hideVerificationmodel();
//               }}
//             >
//               <div className=" my-0 kycbox" role="document">
//                 <div className="modal-content modelstyle">
//                   <div
//                     className="modal-body"
//                     style={{ marginTop: "10px", padding: "34px 25px" }}
//                   >
//                     <div className="modal-custom-header">
//                       <h5
//                         className="modal-title"
//                         id="DesiredprofileModalLongTitle"
//                       >
//                         <div>
//                           <h5>KYC Verification</h5>
//                         </div>
//                       </h5>
//                       <div
//                         style={{
//                           fontSize: "15px",
//                           color: "#7c7cdc",
//                           marginLeft: "60%",
//                         }}
//                       >
//                         Need Help?
//                       </div>
//                       <div style={{ top: "10%" }}>
//                         <button
//                           type="button"
//                           className="close"
//                           onClick={() => {
//                             hideKYCmodel();
//                           }}
//                         >
//                           <span aria-hidden="true">&times;</span>
//                         </button>
//                       </div>
//                     </div>
//                     <div className="subkychead">
//                       Complete KYC verification process to access Techri
//                       features
//                     </div>

//                     <Stepper activeStep={activeStep} alternativeLabel>
//                       {kycsteps.map((label, index) => (
//                         <Step key={label}>
//                           <StepLabel>{label}</StepLabel>
//                           <StepContent>
//                             <div>{getStepContent(index)}</div>
//                             <div></div>
//                           </StepContent>
//                         </Step>
//                       ))}
//                     </Stepper>
//                   </div>
//                 </div>
//               </div>
//             </Modal>
//           )} */}

//           {/* Aadhar card verification  */}
//           {/* {formikKyc.values.companyType === "CompanyPartnership" && (
//             <Modal
//               className="modal fade browse-job modal-bx-info modeldesign editor mt-4"
//               show={openVerifyModel}
//               backdrop="static"
//               onHide={() => {}}
//             >
//               <div className=" my-0 kycbox" role="document">
//                 <div className="modal-content modelstyle">
//                   <div
//                     className="modal-body"
//                     style={{ marginTop: "10px", padding: "34px 25px" }}
//                   >
//                     <div className="modal-custom-header">
//                       <h5
//                         className="modal-title"
//                         id="DesiredprofileModalLongTitle"
//                       >
//                         <div>
//                           <h5>KYC Verification</h5>
//                         </div>
//                       </h5>
//                       <div
//                         style={{
//                           fontSize: "15px",
//                           color: "#7c7cdc",
//                           marginLeft: "60%",
//                         }}
//                       >
//                         Need Help?
//                       </div>
//                       <div style={{ top: "10%" }}>
//                         <button
//                           type="button"
//                           className="close"
//                           onClick={() => {
//                             hideKYCmodel();
//                           }}
//                         >
//                           <span aria-hidden="true">&times;</span>
//                         </button>
//                       </div>
//                     </div>
//                     <div className="subkychead">
//                       Complete KYC verification process to access Techri
//                       features
//                     </div>
//                     <Box sx={{ width: "100%" }}>
//                       <Stepper activeStep={activeStep}>
//                         {aadharsteps.map((label, index) => {
//                           const stepProps: { completed?: boolean } = {};
//                           const labelProps: {
//                             optional?: React.ReactNode;
//                           } = {};

//                           if (isStepSkipped(index)) {
//                             stepProps.completed = false;
//                           }
//                           return (
//                             <Step key={label} {...stepProps}>
//                               <StepLabel {...labelProps}>{label}</StepLabel>
//                             </Step>
//                           );
//                         })}
//                       </Stepper>
//                       {activeStep === aadharsteps.length ? (
//                         <React.Fragment>
//                           <Typography sx={{ mt: 2, mb: 1 }}>
//                             All steps completed - you&apos;re finished
//                           </Typography>
//                           <Box
//                             sx={{
//                               display: "flex",
//                               flexDirection: "row",
//                               pt: 2,
//                             }}
//                           >
//                             <Box sx={{ flex: "1 1 auto" }} />
//                             <Button onClick={handleReset}>Reset</Button>
//                           </Box>
//                         </React.Fragment>
//                       ) : (
//                         <React.Fragment>
//                           <Typography sx={{ mt: 2, mb: 1 }}>
//                             {getStepContentAadhar(activeStep)}
//                           </Typography>
//                           <Box
//                             sx={{
//                               display: "flex",
//                               flexDirection: "row",
//                               pt: 2,
//                             }}
//                           >
//                             <Button
//                               color="inherit"
//                               disabled={activeStep === 0}
//                               onClick={handleBack}
//                             >
//                               Back
//                             </Button>
//                             <Box sx={{ flex: "1 1 auto" }} />

//                             <Button onClick={handleNext}>
//                               {activeStep === aadharsteps.length - 1
//                                 ? "Finish"
//                                 : "Next"}
//                             </Button>
//                           </Box>
//                         </React.Fragment>
//                       )}
//                     </Box>
//                   </div>
//                 </div>
//               </div>
//             </Modal>
//           )} */}
//         </div>
//       </div>
//     </>
//   );
// }
// export default KYCDetails;

import React from "react";

const KYCDetails = () => {
  return <div></div>;
};

export default KYCDetails;
