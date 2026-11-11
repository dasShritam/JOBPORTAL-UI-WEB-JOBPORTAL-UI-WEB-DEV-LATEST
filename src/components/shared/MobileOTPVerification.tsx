// import React, { useEffect, useState } from "react";
// import { Modal } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import API from "../../config/axios.config";
// import { UseToastAlert } from "../../hooks/useToastAlert";

// interface props {
//   data: string;
// }
// const MobileOTPVerification = ({ data }: props) => {
//   const [popup1, setPopup1] = useState(false),
//     [time, setTime] = useState(59),
//     [mask, setMask] = useState(false),
//     [otp, setOtp] = useState(""),
//     [mob, setMob] = useState(""),
//     [fullPopup, setFullPopup] = useState(true),
//     [btnDis, setBtnDis] = useState(true),
//     showSnackAlert = UseToastAlert(),
//     [err, setErr] = useState(""),
//     regex = /^[7-9][0-9]{9}$/,
//     sendOTP = async () => {
//       try {
//         if (!regex.test(mob)) {
//           setErr("Invalid mobile number");
//         }
//         const mobileData = {
//           code: "+91",
//           commInfo: mob,
//           channel: "sms",
//         };

//         const {data} = await API.post(`auth/sendOtpJobseeker`, mobileData);

//         if (data.code === 200 && data.message === "OTP sent successfully") {
//           setMask(true);
//           setBtnDis(true);
//           showSnackAlert("success", data.message)
//         } else {
//           showSnackAlert("error", data.message);
//         }
//       } catch (error: any) {
//         showSnackAlert("error", data);
//       }
//     };

//   const verifieOTP = async () => {
//     const verificationData = {
//       code: "+91",
//       phno: mob,
//       otp: otp,
//     };

//     const { data } = await API.post(`auth/verifyOtpJobseeker`, verificationData);
//     if (data.code === 200) {
//       showSnackAlert("success", "Successfully verified mobile number");
//       setTimeout(() => {
//         // navigate("/jobseekerprofile");
//       }, 5000);
//     } else {
//       showSnackAlert("error", `${data.message}`);
//     }
//   };
//   useEffect(() => {
//     if (popup1) {
//       const timer: any = time > 0 && setInterval(() => setTime(time - 1), 1000);
//       return () => clearInterval(timer);
//     }
//   }, [popup1, time, btnDis]);

//   const navigate = useNavigate();

//   return (
//     <div>
//       {fullPopup && (
//         <>
//           <Modal
//             data-keyboard="false"
//             data-backdrop="static"
//             show={true}
//             onHide={() => {
//               setPopup1(false);
//             }}
//             className="modal fade modal-bx-info editor"
//           >
//             {" "}
//             <div className="modal-dialog my-0 mx-0 w-100 " data-keyboard="false" data-backdrop="static" role="document">
//               {" "}
//               <div className="modal-content ">
//                 {" "}
//                 <div className="modal-header ">
//                   {" "}
//                   <p className=" font-weight-600" id="KeyskillsModalLongTitle">
//                     {" "}
//                     PHONE NUMBER VERIFICATION OTP{" "}
//                   </p>{" "}
//                   <button
//                     type="button"
//                     className="close"
//                     onClick={() => {
//                       navigate("/jobseekerprofile");
//                       setFullPopup(false);
//                     }}
//                   >
//                     {" "}
//                     <span aria-hidden="true">&times;</span>{" "}
//                   </button>{" "}
//                 </div>{" "}
//                 <div className="modal-body">
//                   {" "}
//                   {!mask && (
//                     <>
//                       {" "}
//                       <p> Please enter your phone number.</p>{" "}
//                       <input
//                         type="text"
//                         onChange={(e) => {
//                           setErr("");
//                           e.target.value.length === 10 ? setBtnDis(false) : setBtnDis(true);
//                           setMob(e.target.value);
//                         }}
//                         className="form-control"
//                         placeholder="Phone Number"
//                         maxLength={10}
//                       />
//                       <br />
//                       {err && <label style={{ color: "red", marginBottom: "20px" }}>{err}</label>}
//                       <div className="float-right">
//                         {" "}
//                         <button
//                           onClick={() => {
//                             if (mob.length === 10) {
//                             }
//                             sendOTP();
//                           }}
//                           className="btn site-button outline outline-2"
//                           disabled={btnDis}
//                         >
//                           Send OTP
//                         </button>{" "}
//                         <button
//                           onClick={() => {
//                             navigate("/jobseekerprofile");
//                             setFullPopup(false);
//                           }}
//                           className="ml-3 btn site-button outline outline-2"
//                         >
//                           Cancel
//                         </button>{" "}
//                       </div>{" "}
//                     </>
//                   )}
//                   {mask && (
//                     <>
//                       {" "}
//                       <p> An OTP has been sent to registered number, to verify and continue please enter OTP</p>{" "}
//                       <form>
//                         {" "}
//                         <div className="row">
//                           {" "}
//                           <div className="col-lg-12 col-md-12">
//                             {" "}
//                             <div className="input-group mt-3 mb-3">
//                               {" "}
//                               <input
//                                 type="text"
//                                 maxLength={6}
//                                 minLength={6}
//                                 required
//                                 className="form-control"
//                                 placeholder="Type sent OTP here"
//                                 value={otp}
//                                 onChange={(e) => {
//                                   e.target.value.length === 6 ? setBtnDis(false) : setBtnDis(true);
//                                   setOtp(e.target.value);
//                                 }}
//                               />{" "}
//                             </div>{" "}
//                             <button disabled={btnDis} className="site-button float-center w-100" onClick={verifieOTP}>
//                               {" "}
//                               {/* <Link to={"/employerSignin"}> */}
//                               verify
//                             </button>{" "}
//                             <div className="mt-3">
//                               {" "}
//                               <label onClick={sendOTP}>
//                                 {" "}
//                                 Resend OTP in
//                                 {Boolean(time) && time > 9 && <span className="text-danger"> 00:{time}</span>}
//                                 {Boolean(time) && time < 10 && <span className="text-danger"> 00:0{time}</span>}
//                                 {Boolean(!time) && <span className="text-secondary"> 00:00</span>}
//                               </label>{" "}
//                             </div>{" "}
//                             <div> {/* <Link to={"#"}>Resend OTP </Link>{" "} */}</div>{" "}
//                           </div>{" "}
//                         </div>{" "}
//                       </form>{" "}
//                     </>
//                   )}
//                 </div>{" "}
//               </div>{" "}
//             </div>{" "}
//           </Modal>
//         </>
//       )}
//     </div>
//   );
// };

// export default MobileOTPVerification;

import { useState } from "react";
import { Modal } from "react-bootstrap";

const MobileOTPVerification = () => {
  const [numver, setNumver] = useState(true);

  return (
    <div>
      {/* <Link
        onClick={() => {
          setNumver(true);
          setTime(59);
        }}
        className="site-button-link forget-pass m-t30 m-r60"
        style={{
          fontSize: "14px",
          color: "#5598d2",
          marginLeft: "69px",
        }}
        to={""}
      >
        {" "}
        Contact Number Verification
      </Link> */}
      <Modal
        show={numver}
        onHide={() => {
          setNumver(false);
        }}
        className="modal fade modal-bx-info editor"
      >
        {" "}
        <div className="modal-dialog my-0  mx-0 w-100 " role="document">
          {" "}
          <div className="modal-content">
            {" "}
            <div className="modal-body">
              {" "}
              <div>
                {" "}
                <h5 style={{ textAlign: "center" }}>
                  {" "}
                  CONTACT NUMBER VERIFICATION
                </h5>{" "}
                <div style={{ textAlign: "center" }}>
                  {" "}
                  <i
                    className="fa fa-duotone fa-mobile"
                    style={{
                      fontSize: "90px",
                      color: "rgb(63, 81, 181)",
                      width: "90px",
                      borderRadius: "50%",
                      border: "1px solid rgb(35, 132, 178)",
                      outline: "none",
                      textAlign: "center",
                    }}
                  ></i>{" "}
                </div>{" "}
                <h6
                  style={{
                    textAlign: "center",
                    color: "#0070a6",
                    fontFamily: "Montserrat",
                  }}
                >
                  {" "}
                  VERIFY MOBILE NUMBER
                </h6>{" "}
                <center>
                  {" "}
                  <p style={{ fontFamily: "Montserrat" }}>
                    {" "}
                    To complete the verification process, we need to send a
                    verification code to your mobile number.
                    <br /> Please provide your mobile number to verify.
                  </p>{" "}
                  <input
                    type="text"
                    className="form-control"
                    placeholder="+91 9036127922"
                    maxLength={16}
                    style={{ width: "25%" }}
                  />{" "}
                  <br></br>{" "}
                  <button
                    type="button"
                    className="site-button border border-primary btn-sm"
                    style={{
                      background: "white",
                      color: "#2e55fa",
                      borderColor: "#2e55fa",
                    }}
                    onClick={() => setNumver(false)}
                  >
                    {" "}
                    SEND OTP
                  </button>{" "}
                  &nbsp;
                  <button
                    type="button"
                    className="site-button border border-primary btn-sm"
                    style={{
                      background: "white",
                      color: "#2e55fa",
                      borderColor: "#2e55fa",
                    }}
                    onClick={() => setNumver(false)}
                  >
                    {" "}
                    SKIP
                  </button>{" "}
                </center>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </Modal>
    </div>
  );
};

export default MobileOTPVerification;
