import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GetTermsAndConditions,
  resetGetTermsAndConditions,
} from "../../../redux/features/common/public/TermsAndConditionSlice";
import { UseToastAlert } from "../../../hooks/useToastAlert";

function Consent() {
  const dispatch = useDispatch();

  const TermsAndConditionsDetails = useSelector(
    (state: any) => state.GetTermsAndConditions
  );
  const { conditions, loadConditions } = TermsAndConditionsDetails;
  const showSnackAlert = UseToastAlert();

  useEffect(() => {
    const concentMdl = {
      type: "DECLARATION",
    };
    dispatch(GetTermsAndConditions(concentMdl));
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
                    Employer Concent
                  </h5>
                </div>
                <div className="row">
                  <div className="col-lg-8 col-md-8 col-sm-12">
                    <div
                      className="jobDessContent"
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

export default Consent;
