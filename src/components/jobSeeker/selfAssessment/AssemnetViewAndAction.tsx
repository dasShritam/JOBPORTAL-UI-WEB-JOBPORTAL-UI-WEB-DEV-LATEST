import { Chip, Tooltip } from "@material-ui/core";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { BsClock } from "react-icons/bs";
import { GrSecure } from "react-icons/gr";
import * as Yup from "yup";
import {
  MdCreditScore,
  MdOutlineCreditScore,
  MdOutlineCurrencyRupee,
  MdOutlineScoreboard,
  MdSubdirectoryArrowRight,
} from "react-icons/md";
import useRazorpay, { RazorpayOptions } from "react-razorpay";
import { useDispatch, useSelector } from "react-redux";
import {
  PaymentAftertxn,
  Paymentbeforetxn,
  getAssessmentBrief,
  ResetPaymentbeforetxnData,
  ResetPaymentAftertxnData,
} from "../../../redux/features/jobSeeker/JsAssessmentSlice";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { VscGistSecret } from "react-icons/vsc";
import { useFormik } from "formik";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import { Content, convertSecondsToHours } from "../../../common/common";
import { AppContext } from "../../../context/AppContext";
import { CiSquareQuestion } from "react-icons/ci";
import AssessmentViewSkeleton from "./AssessmentViewSkeleton";
import "../../../assets/customCss/assessment.css";
import Loader from "../../common/Loader/Loader";

var Captive_logo = require("../../../assets/images/Techkri-logo-blue.png");

const AssessmentViewAndAction = () => {
  // Toaster
  const showSnackAlert = UseToastAlert();
  const { setpaymentdata } = useContext(AppContext);
  // const { id } = useParams();
  const [test] = useSearchParams(),
    id: any = test?.get("id"),
    current_status: any = test?.get("status");

  const Razorpay = useRazorpay();
  const dispatch = useDispatch();
  const [emailreg, setEmailreg] = useState(false);
  const [displayData, setDisplayData] = useState<any>([]);
  const [ttlQn, setttlQn] = useState<any>("");
  const [paymentDetails, setPaymentDetails] = useState<any>("");
  const [beforePay, setbeforeP] = useState<any>("");
  const [currencyVal, setCurrency] = useState<any>("");
  const [amountVal, setAmount] = useState<any>("");
  const [testid, setTestId] = useState<any>("");
  const [ftestid, setFailId] = useState<any>("");
  const [paymentCred, setPaymentCred] = useState<any>("");
  const [paymentError, setPaymentError] = useState(null);

  const navigate = useNavigate();

  // Assesment details API
  const AssessmentDetails = useSelector((state: any) => state.AssessmentBrief);
  const { assessmentBrief, assessLoading } = AssessmentDetails;

  // payment after tsx API
  const PaymentAfter = useSelector((state: any) => state.PaymentAfterTns);
  const { PayafterBtxn, PayafterBtxnLoading } = PaymentAfter;

  // Js statistics API
  const StatisticsDetails = useSelector(
    (state: any) => state.JSAssessmentStatistics
  );
  const { StatRes, Statloading } = StatisticsDetails;

  useEffect(() => {
    dispatch(getAssessmentBrief(id));
  }, [dispatch]);

  //payment before txn
  const paymentTxn = useSelector((state: any) => state.PaymentBeforeTns);
  const { PayBtxn, PayBtxnLoading } = paymentTxn;

  useEffect(() => {
    if (
      PayBtxn?.response &&
      PayBtxn?.response?.data &&
      PayBtxn?.response?.data?.code !== 200
    ) {
      showSnackAlert("warning", PayBtxn?.response?.data?.message);
      dispatch(ResetPaymentbeforetxnData());
    }
  }, [PayBtxn, PayBtxn?.code]);

  useEffect(() => {
    if (
      PayafterBtxn?.response &&
      PayafterBtxn?.response?.data &&
      PayafterBtxn?.response?.data?.code !== 200
    ) {
      showSnackAlert("warning", PayafterBtxn?.response?.data?.message);
      dispatch(ResetPaymentAftertxnData());
      dispatch(ResetPaymentbeforetxnData());
    }
  }, [PayafterBtxn, PayafterBtxn?.code]);

  // dispatch payment before txn
  const fnPaymentbeofretxn = () => {
    const paymentBeTxn = {
      test_id: testid,
      fee: {
        currency: currencyVal,
        value: amountVal,
      },
      remark: values.Remarks,
    };
    dispatch(Paymentbeforetxn(paymentBeTxn));
  };

  // Initial Data
  const [bindEmpData, setBindEmpData] = useState({
    Gateway: "",
    Currency: "",
    Amount: "",
    Remarks: "",
  });

  //Set data from Assessment details API
  // useEffect(() => {
  //   if (!assessLoading && assessmentBrief?.data) {
  //     setDisplayData(assessmentBrief?.data);
  //   }
  // }, [assessmentBrief, assessLoading]);

  //Get data from Assessment Details
  useEffect(() => {
    if (!assessLoading && assessmentBrief?.data) {
      displayData?.map((items: any) => {
        items?.question_wtg?.reduce((n, { ttl_qn }) => n + ttl_qn, 0);
        setttlQn(items?.question_wtg?.reduce((n, { ttl_qn }) => n + ttl_qn, 0));
        setCurrency(items?.amount?.currency);
        setAmount(items?.amount?.value);
        setTestId(items?.test_id);
      });
    }
  });

  // To get Count for test taken
  useEffect(() => {
    let combinedData: any = [];
    const data = assessmentBrief?.data?.map((e: any) => {
      let res = { ...e };
      StatRes?.data?.data?.map((a: any) => {
        if (e?.test_id === a?.id) {
          res.totalCount = a?.count;
        }
      });
      combinedData.push(res);
    });

    setDisplayData([...combinedData]);
  }, [StatRes, assessmentBrief]);

  //Close model
  const closeModel = () => {
    setEmailreg(false);
  };

  //payment model Schema
  const paymentSchema = Yup.object().shape({
    Gateway: Yup.string()
      .nullable()
      .trim("Empty space not allowed.")
      .required("Please enter Payment Gateway."),
    Currency: Yup.string()
      .nullable()
      .trim("Empty space not allowed.")
      .required("Please enter Currency Type."),
    Amount: Yup.string()
      .nullable()
      .trim("Empty space not allowed.")
      .required("Please enter Payable Amount."),
    Remarks: Yup.string()
      .nullable()
      .trim("Empty space not allowed.")
      .required("Please enter your Remarks."),
  });

  const onSubmit: any = async (values: any, actions: any) => {
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
    setFieldValue,
  } = useFormik({
    initialValues: bindEmpData,
    validationSchema: paymentSchema,
    enableReinitialize: true,
    onSubmit,
  });

  //For bind data in model
  useEffect(() => {
    if (displayData) {
      setBindEmpData({
        Gateway: "RAZOR PAY",
        Currency: currencyVal,
        Amount: amountVal,
        Remarks: values.Remarks,
      });
    }
  }, [amountVal, currencyVal, displayData]);

  // For close model on 200

  useEffect(() => {
    if (PayBtxn?.code === 200) {
      setPaymentCred(PayBtxn);
      closeModel();
    } else {
      // showSnackAlert("warning", PayBtxn.message);
    }
  }, [PayBtxn?.data]);

  // To call razor pay function
  useEffect(() => {
    if (!PayBtxnLoading && PayBtxn?.status === 200) {
      handlePayment(PayBtxn?.data?.data);
      setbeforeP(PayBtxn?.data?.data);
    }
  }, [PayBtxn?.data, PayBtxnLoading]);

  // Razor pay function
  const handlePayment = useCallback(
    (paymentInfo: any) => {
      const options: any = {
        key: paymentInfo?.key_id,
        amount: paymentInfo?.amount?.toString(),
        currency: paymentInfo.currency?.toString(),
        name: "Captive Jobs",
        description: "Payment Captive Jobs",
        image: Captive_logo,
        order_id: paymentInfo?.ord_id,
        handler: (response) => {
          const resObj = {
            response: response,
            amount: paymentInfo?.amount?.toString(),
            currency: paymentInfo.currency?.toString(),
            err_reason: paymentError,
          };
          setPaymentDetails(resObj);
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: () => {
            dispatch(ResetPaymentbeforetxnData());
          },
        },
      };
      const rzpay = new Razorpay(options);

      // rzpay.on("payment.failed", function (response) {});
      rzpay.on("payment.failed", function (response) {
        if (response?.error && displayData) {
          const afterPay = {
            test_id: testid,
            paymentId: paymentInfo.id,
            razorpay_payment_id: response?.error?.metadata?.payment_id,
            razorpay_order_id: response?.error?.metadata?.order_id,
            payment_status: "FAILED",
            err_reason: response?.error.description,
          };
          dispatch(PaymentAftertxn(afterPay));
          dispatch(ResetPaymentbeforetxnData());
        }
      });
      rzpay.open();
    },
    [Razorpay, PayBtxn?.data]
  );

  useEffect(() => {
    if (paymentDetails) {
      const afterPay = {
        test_id: testid,
        paymentId: beforePay.id,
        razorpay_payment_id: paymentDetails?.response?.razorpay_payment_id,
        razorpay_order_id: paymentDetails?.response?.razorpay_order_id,
        razorpay_signature: paymentDetails?.response?.razorpay_signature,
        payment_status: paymentDetails ? "SUCCESS" : "FAILED",
        err_reason: paymentError,
      };
      dispatch(PaymentAftertxn(afterPay));
    }
  }, [paymentDetails]);

  useEffect(() => {
    if (
      PayafterBtxn &&
      PayafterBtxn?.data?.code &&
      PayafterBtxn?.data?.code === 200
    ) {
      navigate("/js/paymentStatus");
      setpaymentdata(paymentDetails);
      dispatch(ResetPaymentbeforetxnData());
      dispatch(ResetPaymentAftertxnData());
    }
  }, [PayafterBtxn, PayafterBtxn?.code]);

  const textLimit: number = 50;

  return (
    <>
      <div>
        <React.Fragment key={"right"}>
          <div className="page-content">
            <div className="content-block">
              <div className="section-full browse-job content-inner-2">
                <div className="container">
                  {!assessLoading && (
                    <div className="row">
                      <div
                        className="col-lg-10 col-md-10 viewSizeass"
                        style={{ marginLeft: "7%" }}
                      >
                        <div className="job-bx-title backli clearfix">
                          <Link
                            to={"/js/selfAssessment"}
                            className="site-button mt-2 right-arrow button-sm float-right"
                          >
                            Go Back
                          </Link>
                        </div>
                        {displayData &&
                          displayData?.length !== 0 &&
                          displayData?.map((items: any) => {
                            return (
                              <>
                                <div
                                  className="job-bx bg-white m-b30   assessment_box"
                                  id="headingjas"
                                  style={{
                                    borderRadius: "10px",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <div>
                                      <div className="testnsam">
                                        <Tooltip title={items?.test_name}>
                                          <span>
                                            {items?.test_name
                                              ? Content(
                                                  items?.test_name,
                                                  textLimit
                                                )
                                              : "Not Available"}
                                          </span>
                                        </Tooltip>
                                      </div>
                                      <div className="testcnt">
                                        {items?.totalCount}{" "}
                                        {items?.totalCount > 500 && ` + `}
                                        Assessment taken
                                      </div>
                                    </div>
                                    <div>
                                      {current_status === "ALL" && (
                                        <Button
                                          className="testBtn taketestbtn"
                                          onClick={() => setEmailreg(true)}
                                        >
                                          <span> Take Assessment</span>
                                        </Button>
                                      )}
                                    </div>
                                  </div>

                                  {current_status === "ALL" && (
                                    <footer className="border-top pt-3 practicetest">
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div>
                                          <div
                                            className="testn"
                                            style={{ marginBottom: "13px" }}
                                          >
                                            Practice Assessment Available
                                          </div>
                                        </div>
                                        <div>
                                          <Button
                                            className="testBtn practest"
                                            target="_blank"
                                            href={items.test_url}
                                          >
                                            Practice Assessment
                                          </Button>
                                        </div>
                                      </div>
                                    </footer>
                                  )}

                                  <footer className="border-top pt-3">
                                    <div>
                                      <div className="testdesc">
                                        Assessment Highlights
                                      </div>

                                      <div className="row d-flex justify-content-between">
                                        <ul className="col-lg-6 md-6 sm-6">
                                          {items?.duration && (
                                            <li className="list-style">
                                              <BsClock className="custom-job-icon" />
                                              &ensp;
                                              <span className="custom-job-content">
                                                <span
                                                  style={{ color: "#6f6f6f" }}
                                                >
                                                  {" "}
                                                  Duration :
                                                </span>{" "}
                                                {items.duration
                                                  ? convertSecondsToHours(
                                                      items.duration
                                                    )
                                                  : "Not Available"}
                                              </span>
                                            </li>
                                          )}

                                          <li className="list-style">
                                            <MdOutlineScoreboard className="custom-job-icon" />{" "}
                                            &nbsp;
                                            <span className="custom-job-content">
                                              <span
                                                style={{ color: "#6f6f6f" }}
                                              >
                                                {" "}
                                                Assessment Score :
                                              </span>{" "}
                                              {items.total_src
                                                ? items.total_src
                                                : "Not Available"}
                                            </span>
                                          </li>

                                          <li className="list-style">
                                            <MdOutlineCreditScore className="custom-job-icon" />{" "}
                                            &nbsp;
                                            <span className="custom-job-content">
                                              <span
                                                style={{ color: "#6f6f6f" }}
                                              >
                                                {" "}
                                                Cut Off marks :
                                              </span>{" "}
                                              {items.cut_off
                                                ? items.cut_off
                                                : "Not Available"}
                                            </span>
                                          </li>
                                        </ul>
                                        <ul className="col-lg-6 md-6 sm-6">
                                          <li className="list-style">
                                            <VscGistSecret className="custom-job-icon" />{" "}
                                            &nbsp;
                                            <span className="custom-job-content">
                                              <span
                                                style={{ color: "#6f6f6f" }}
                                              >
                                                {" "}
                                                Section(s):
                                              </span>{" "}
                                              {items?.question_wtg?.length
                                                ? items?.question_wtg?.length
                                                : "Not Available"}
                                            </span>
                                          </li>

                                          <li className="list-style">
                                            <CiSquareQuestion className="custom-job-icon" />{" "}
                                            &nbsp;
                                            <span className="custom-job-content">
                                              <span
                                                style={{ color: "#6f6f6f" }}
                                              >
                                                {" "}
                                                Number of Question(s) :
                                              </span>{" "}
                                              {items?.total_qes
                                                ? items?.total_qes
                                                : "Not Available"}
                                            </span>
                                          </li>

                                          <li className="list-style">
                                            <MdOutlineCurrencyRupee className="custom-job-icon" />
                                            &nbsp;
                                            <span className="custom-job-content">
                                              {items?.amount?.value
                                                ? items?.amount?.value
                                                : "Not Available"}
                                            </span>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                    <div className="testdesc">
                                      Assessment Details
                                    </div>
                                    <div className="assesDesc">
                                      <div className="testdesc">
                                        {items?.desc}
                                      </div>
                                      <div>
                                        <ul>
                                          <li className="list-style">
                                            <span>
                                              {" "}
                                              <MdCreditScore className="custom-job-icon" />{" "}
                                            </span>
                                            Qualifying Score -{" "}
                                            {items.cut_off && items.total_src
                                              ? `${items.cut_off} / ${items.total_src}`
                                              : "NA"}
                                            {/* {items.total_src
                                              ? items.total_src
                                              : "NA"} */}
                                          </li>
                                          <li className="scoret">
                                            <MdSubdirectoryArrowRight className="custom-job-icon" />{" "}
                                            Section(s):{" "}
                                            {
                                              <ul className="ml-4">
                                                {items?.question_wtg?.map(
                                                  (res) => {
                                                    return (
                                                      <li className="scoret">
                                                        <span>
                                                          {res?.name} -
                                                        </span>{" "}
                                                        {res?.score}
                                                      </li>
                                                    );
                                                  }
                                                )}
                                              </ul>
                                            }
                                          </li>
                                        </ul>
                                      </div>

                                      <div>
                                        {items?.skill?.map((val) => {
                                          return (
                                            <Chip
                                              style={{
                                                borderColor: "#a277f1",
                                                marginRight: "7px",
                                              }}
                                              label={val}
                                              variant="outlined"
                                            />
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </footer>
                                </div>
                              </>
                            );
                          })}
                      </div>
                    </div>
                  )}
                  {assessLoading && <AssessmentViewSkeleton />}
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      </div>

      {/* payment Model */}
      <Modal show={emailreg} className="modal fade modal-bx-info editor">
        <div
          className="modal-dialog my-0 mx-0 w-100 browse-job "
          role="document"
        >
          <div className="modal-content">
            <div className="modal-body">
              <h5 className="paymentHead">
                <span>
                  <i className="fa fa-shield" aria-hidden="true"></i>
                </span>
                Payment
              </h5>
              <footer className="border-top pt-3"></footer>
              <div className="row">
                <div className="col-lg-6 col-md-10 col-sm-12">
                  <form autoComplete="off">
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <label>Payment Gateway</label>

                          <input
                            readOnly
                            maxLength={35}
                            type="text"
                            name="Gateway"
                            onChange={handleChange}
                            className="form-control"
                            onBlur={handleBlur}
                            value={values.Gateway}
                            placeholder="Enter Your Payment Gateway"
                          />
                          {errors.Gateway ? (
                            <p className="form-error">{errors.Gateway}</p>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-lg-3 col-md-12">
                        <div className="form-group">
                          <label>Currency</label>

                          <input
                            readOnly
                            maxLength={35}
                            type="text"
                            name="Currency"
                            onChange={handleChange}
                            className="form-control assessCur"
                            onBlur={handleBlur}
                            value={values.Currency}
                            placeholder="Enter your Payable Currency"
                          />
                          {errors.Currency ? (
                            <p className="form-error">{errors.Currency}</p>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-lg-7 col-md-12">
                        <div className="form-group">
                          <label>Payable amount</label>

                          <input
                            readOnly
                            maxLength={35}
                            type="text"
                            name="Amount"
                            onChange={handleChange}
                            className="form-control"
                            onBlur={handleBlur}
                            value={values.Amount}
                            placeholder="Enter your Payable Amount"
                          />
                          {errors.Amount ? (
                            <p className="form-error">{errors.Amount}</p>
                          ) : null}
                        </div>
                      </div>
                      <div className="col-lg-2 col-md-12 limittsx">
                        <Tooltip
                          placement="top"
                          title="Check Transaction Limit"
                          arrow
                        >
                          <Link
                            style={{ backgroundColor: "#03256c" }}
                            target="_blank"
                            to={
                              "https://razorpay.com/docs/payments/payment-methods/transaction-limits/"
                            }
                            className="site-button border"
                          >
                            <i
                              className="fa fa-credit-card"
                              aria-hidden="true"
                            ></i>
                          </Link>
                        </Tooltip>
                      </div>
                      {/* <div className="col-lg-12 col-md-12">
                        <div className="form-group">
                          <label>Remarks</label>

                          <textarea
                            maxLength={35}
                            name="Remarks"
                            onChange={handleChange}
                            className="form-control"
                            onBlur={handleBlur}
                            value={values.Remarks}
                            placeholder="Enter Your Remarks"
                          />
                          {errors.Remarks ? (
                            <p className="form-error">{errors.Remarks}</p>
                          ) : null}
                        </div>
                      </div> */}
                      <div className="col-lg-12 col-md-12">
                        <div
                          style={{
                            textAlign: "center",
                            marginTop: "10px",
                            marginBottom: "8px",
                          }}
                        >
                          <button
                            type="button"
                            className="site-button border Paybtn"
                            onClick={fnPaymentbeofretxn}
                          >
                            Pay &nbsp;
                            {PayBtxnLoading && (
                              <i
                                className="fa fa-circle-o-notch fa-spin"
                                style={{
                                  marginRight: "10px",
                                }}
                              ></i>
                            )}
                          </button>
                          <button
                            type="button"
                            className="site-button border Paycancelbtn"
                            onClick={closeModel}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="col-lg-6 col-md-10 col-sm-12">
                  <div id="Comments_bx assessimg" className=" bg-white m-b30">
                    <div className="">
                      <Link to={"#"}>
                        <img
                          style={{ height: "100%" }}
                          alt="Comment"
                          src={require("../../../assets/images/payment-image-new-one-updated.jpg")}
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Loader for payment after transaction */}
      {PayafterBtxnLoading ? <Loader /> : ""}
    </>
  );
};

export default AssessmentViewAndAction;
