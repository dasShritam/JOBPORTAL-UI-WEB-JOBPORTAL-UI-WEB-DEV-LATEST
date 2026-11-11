import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "../../../assets/customCss/RegisterSuccess.css";


const RegisterSuccessPopup = () => {
  const [emailreg, setEmailreg] = useState(true),
    [, setTime] = useState(60);

  return (
    <div>
      
      <Modal
        show={emailreg}
        onHide={() => {
          setEmailreg(false);
        }}
        className="modal fade modal-bx-info editor"
      >
        <div className="modal-dialog my-0  mx-0 w-100 " role="document">
          <div className="modal-content">
            <div className="modal-body">
              <h5 style={{ textAlign: "center" }}>REGISTRATION SUCCESSFULL</h5>
              <div className="success-checkmark">
                <div className="check-icon">
                  <span className="icon-line line-tip"></span>
                  <span className="icon-line line-long"></span>
                  <div className="icon-circle"></div>
                  <div className="icon-fix"></div>
                </div>
              </div>
              <h6
                style={{
                  textAlign: "center",
                  color: "green",
                  fontFamily: "Montserrat",
                }}
              >
                CONGRATULATIONS
              </h6>
              <center>
                <p style={{ fontFamily: "Montserrat" }}>
                  Your account has been created successfully!
                  <br />
                  Thank you for joining us.
                </p>
              </center>

              {/* <center>
                <p style={{ color: "#0070a6", fontWeight: "bold" }}>
                  An account activation link has been sent to your registered email address. Please activate the
                  account.
                  <br />
                </p>
              </center> */}
              <hr></hr>
              <button
                type="button"
                className="site-button border border-primary btn-sm"
                style={{
                  background: "white",
                  color: "#2e55fa",
                  borderColor: "#2e55fa",
                  float: "right",
                }}
                onClick={() => setEmailreg(false)}
              >
                OK
              </button>
              <br></br>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RegisterSuccessPopup;
