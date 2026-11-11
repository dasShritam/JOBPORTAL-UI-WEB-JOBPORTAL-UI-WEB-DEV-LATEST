import { Chip, Tooltip } from "@material-ui/core";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";
import useRazorpay, { RazorpayOptions } from "react-razorpay";
import { useDispatch, useSelector } from "react-redux";
import {
  PaymentAftertxn,
  Paymentbeforetxn,
  ResetPaymentAftertxnData,
  ResetPaymentbeforetxnData,
  getAssessmentBrief,
} from "../../../redux/features/jobSeeker/JsAssessmentSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { UseToastAlert } from "../../../hooks/useToastAlert";
// import Loader from "../../../common/Loader/Loader";
import Loader from "../../common/Loader/Loader";
import { AppContext } from "../../../context/AppContext";
var Captive_logo = require("../../../assets/images/Techkri-logo-blue.png");
interface propsType {
  showModal: boolean;
  toggleModal: any;
}

const PaymentModel = (props: propsType) => {
  // Toaster
  const showSnackAlert = UseToastAlert();
  const { id } = useParams();
  const Razorpay = useRazorpay();
  const dispatch = useDispatch();
  const [emailreg, setEmailreg] = useState(false);
  const [displayData, setDisplayData] = useState<any>([]);
  const [ttlQn, setttlQn] = useState<any>("");
  const [currencyVal, setCurrency] = useState<any>("");
  const [amountVal, setAmount] = useState<any>("");
  const [testid, setTestId] = useState<any>("");
  const [paymentCred, setPaymentCred] = useState<any>("");
  const [paymentDetails, setPaymentDetails] = useState<any>("");
  const [beforePay, setbeforeP] = useState<any>("");
  const [paymentError, setPaymentError] = useState(null);

  const { setpaymentdata } = useContext(AppContext);
  const navigate = useNavigate();

  // Assesment details API
  const AssessmentDetails = useSelector((state: any) => state.AssessmentBrief);
  const { assessmentBrief, assessLoading } = AssessmentDetails;

  useEffect(() => {
    dispatch(getAssessmentBrief(id));
  }, [dispatch]);

  //payment before txn
  const paymentTxn = useSelector((state: any) => state.PaymentBeforeTns);
  const { PayBtxn, PayBtxnLoading } = paymentTxn;

  const payAftTxn = useSelector((state: any) => state.PaymentAfterTns);
  const { PayafterBtxn, PayafterBtxnLoading } = payAftTxn;

  // dispatch payment before txnss
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
      PayafterBtxn &&
      PayafterBtxn?.response &&
      PayafterBtxn?.response?.data &&
      PayafterBtxn?.response?.data?.code !== 200
    ) {
      showSnackAlert("warning", PayafterBtxn?.response?.data?.message);
      dispatch(ResetPaymentAftertxnData());
      dispatch(ResetPaymentbeforetxnData());
    }
  }, [PayafterBtxn, PayafterBtxn?.code]);

  // Initial Data
  const [bindEmpData, setBindEmpData] = useState({
    Gateway: "",
    Currency: "",
    Amount: "",
    Remarks: "",
  });

  //Set data from Assessment details API
  useEffect(() => {
    if (!assessLoading && assessmentBrief?.data) {
      setDisplayData(assessmentBrief?.data);
    }
  }, [assessmentBrief, assessLoading]);

  //Get data from Assessment Details
  useEffect(() => {
    if (!assessLoading && assessmentBrief?.data) {
      displayData?.map((items: any) => {
        items?.qn_wgt?.reduce((n, { ttl_qn }) => n + ttl_qn, 0);
        setttlQn(items?.qn_wgt?.reduce((n, { ttl_qn }) => n + ttl_qn, 0));
        setCurrency(items?.amount?.currency);
        setAmount(
          items?.amount?.retake_value
            ? items?.amount?.retake_value
            : items?.amount?.value
        );
        setTestId(items?.test_id);
      });
    }
  });

  //Close model
  const closeModel = () => {
    props.toggleModal();
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
        amount: paymentInfo?.amount.toString(),
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

  return (
    <>
      {/* payment Model */}
      <Modal
        show={props.showModal}
        // show={emailreg}
        className="modal fade modal-bx-info editor"
      >
        <div
          className="modal-dialog my-0 mx-0 w-100 browse-job"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-body">
              <h5 className="paymentHead">
                <span style={{ marginLeft: "6px", marginRight: "8px" }}>
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
                            &nbsp;
                            {PayBtxnLoading && (
                              <i
                                className="fa fa-circle-o-notch fa-spin"
                                style={{
                                  marginRight: "10px",
                                }}
                              ></i>
                            )}
                            Pay
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
                  <div>
                    <div
                      id="Comments_bx assessimg"
                      className=" bg-white m-b30"
                      style={{ marginTop: "32px" }}
                    >
                      <div className="">
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
          </div>
        </div>
      </Modal>

      {/* Loader for payment after transaction */}
      {PayafterBtxnLoading ? <Loader /> : ""}
    </>
  );
};

export default PaymentModel;
