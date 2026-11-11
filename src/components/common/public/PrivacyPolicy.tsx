import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GetTermsAndConditions,
  resetGetTermsAndConditions,
} from "../../../redux/features/common/public/TermsAndConditionSlice";
import { Link, useNavigate } from "react-router-dom";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import "../../../assets/customCss/policy.css";
let logo = require("../../../assets/images/Techkri-logo-blue.png");

function PrivacyPolicy() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const TermsAndConditionsDetails = useSelector(
    (state: any) => state.GetTermsAndConditions
  );
  const { conditions, loadConditions } = TermsAndConditionsDetails;
  const showSnackAlert = UseToastAlert();

  useEffect(() => {
    const privacyMdl = {
      type: "PRIVACY_POLICY",
    };
    dispatch(GetTermsAndConditions(privacyMdl));
  }, []);

  useEffect(() => {
    if (
      conditions?.response &&
      conditions?.response?.data &&
      conditions?.response?.data?.code !== 200
    ) {
      showSnackAlert("warning", conditions?.response?.data?.message);
      dispatch(resetGetTermsAndConditions());
    }
  }, [conditions, conditions?.code]);
  return (
    <>
      <div className="browse-job section-full bg-white p-b20">
        <div className="container">
          <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 m-b30 mt-5">
              <div className="job-bx browse-job clearfix">
                <div className="job-bx-title  clearfix">
                  <h5 className="font-weight-700 pull-left text-uppercase">
                    Privacy Policy
                  </h5>
                  <div
                    className="d-flex justify-content-end"
                    style={{ float: "right" }}
                  >
                    <img
                      style={{
                        width: "50%",
                        marginTop: "-10px",
                        cursor: "pointer",
                      }}
                      src={logo}
                      className="logo-image"
                      title="Go to home page."
                      onClick={() => {
                        navigate("/home");
                      }}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div
                      style={{ fontSize: "14px", paddingLeft: "15px" }}
                      className="jobDessContent policy "
                      dangerouslySetInnerHTML={{
                        __html: conditions?.data,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PrivacyPolicy;
