import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import "../../../assets/customCss/assessment.css";
import { getJSAssessmentData } from "../../../redux/features/jobSeeker/JsAssessmentSlice";

const PaymentStatus = () => {
  const AssessmentDetails = useSelector((state: any) => state.AssessmentBrief);
  const { assessmentBrief, assessLoading } = AssessmentDetails;
  const { paymentdata } = useContext(AppContext);
  const [testidSp, setTestidSp] = useState("");
  const [testUrlSp, setTestUrlSp] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    if (assessmentBrief?.data.length)
      setTestidSp(assessmentBrief?.data[0]?.test_id);
  }, [assessmentBrief?.data]);

  useEffect(() => {
    const saMdl = {
      pageLimit: 10,
      pageId: 1,
      status: "INVITED",
    };
    dispatch(getJSAssessmentData(saMdl));
  }, []);

  const JSAssessmentDetails = useSelector(
    (state: any) => state.JSAssessmentData
  );
  const { JsAssRes, Jsloading } = JSAssessmentDetails;

  useEffect(() => {
    if (!Jsloading && JsAssRes?.data) {
      JsAssRes?.data?.asmt?.map((item) => {
        if (item?.test_id === testidSp) {
          setTestUrlSp(item?.test_url);
        }
      });
    }
  }, [JsAssRes, assessmentBrief, Jsloading]);

  return (
    <>
      <div>
        <React.Fragment key={"right"}>
          <div className="page-content">
            <div className="content-block">
              <div className="section-full browse-job content-inner-2">
                <div className="container">
                  <div className="row">
                    <div className="col-lg-12 mt-3 col-md-10 col-sm-10 payStatus-btn">
                      <Link
                        to={"/js/selfAssessment"}
                        className="site-button right-arrow button-sm float-right"
                        style={{ marginTop: "10px" }}
                      >
                        Go Back
                      </Link>
                    </div>
                    <div
                      className="col-lg-6 col-md-10 col-sm-10  payment-success-modal"
                      style={{ marginLeft: "27%", marginTop: "3%" }}
                    >
                      <div
                        className="job-bx bg-white m-b30   assessment_box"
                        id="headingjas"
                        style={{
                          marginTop: "31px",
                          borderRadius: "10px",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              textAlign: "center",
                              backgroundColor: "#7ac142",
                              padding: "10px 0px",
                            }}
                          >
                            <div className="wrapper">
                              {" "}
                              <svg
                                style={{ alignItems: "center" }}
                                className="checkmark check-success"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 52 52"
                              >
                                {" "}
                                <circle
                                  className="checkmark__circle"
                                  cx="26"
                                  cy="26"
                                  r="25"
                                  fill="none"
                                />{" "}
                                <path
                                  className="checkmark__check"
                                  fill="none"
                                  d="M14.1 27.2l7.1 7.2 16.7-16.8"
                                />
                              </svg>
                            </div>
                            <div className="PSmsge">Payment Successful</div>
                          </div>
                          <footer className="payBorder pt-3"></footer>
                          <div
                            style={{ marginTop: "32px" }}
                            // className="d-flex justify-content-between"
                          >
                            <div className="paymentD">
                              <div className="payamo">Amount Paid:</div>

                              <div className="payamo">
                                {paymentdata?.currency}&nbsp;
                                {paymentdata?.amount
                                  ? parseInt(paymentdata?.amount) / 100
                                  : "N/A"}
                              </div>
                            </div>
                            <hr />
                            <div className="paymentD">
                              <div className="paytit">Transaction ID:</div>
                              <div className="paytit payment-Id">
                                {/* XXXX98329832983298329832 */}
                                {paymentdata?.response?.razorpay_payment_id
                                  ? paymentdata?.response?.razorpay_payment_id
                                  : "N/A"}
                              </div>
                            </div>
                            <hr />
                            <div className="paymentD">
                              <div className="paytit">
                                Transaction Message:{" "}
                              </div>
                              <div className="paytit">Success</div>
                            </div>
                            <hr />
                            <div style={{ textAlign: "center" }}>
                              <Button
                                className="testBtn taketestbtn"
                                target="_blank"
                                href={testUrlSp}
                                style={{
                                  fontSize: "11px",
                                  textDecoration: "none",
                                }}
                              >
                                <span
                                  style={{
                                    color: "white",
                                  }}
                                >
                                  {" "}
                                  Take Test
                                </span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      </div>
    </>
  );
};

export default PaymentStatus;
