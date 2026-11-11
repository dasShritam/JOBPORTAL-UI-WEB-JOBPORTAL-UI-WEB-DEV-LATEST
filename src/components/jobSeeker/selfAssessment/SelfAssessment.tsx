import React, { useEffect, useState } from "react";
import FilterAssessment from "./FilterAssessment";
import AssessmentListing from "./AssessmentListing";
import { Link } from "react-router-dom";
import {
  getJSAssessmentData,
  getJSAssessmentStatistics,
} from "../../../redux/features/jobSeeker/JsAssessmentSlice";
import { useDispatch, useSelector } from "react-redux";
import AssessmentCard from "./AssessmentCard";
import SheduledAssessmentCard from "./SheduledAssessmentCard";
import CompltedAssessment from "./CompltedAssessment";

var draftJobsImg = require("../../../assets/images/background/draftJobImg.png");

type initialState = {
  hideFilterHandler?: any;
};
function SelfAssessment() {
  const [hideFilter, setHideFilter] = useState(true);

  const hideFilterHandler = (bool: boolean) => {
    setHideFilter(bool);
  };

  const [allAssess, setAllAssess] = useState(true);
  const [scheduledAssess, setScheduledAssess] = useState(false);
  const [doneAssess, setDoneAssess] = useState(false);
  const dispatch = useDispatch();
  const [aStatus, setAstatus] = useState<any>(null);
  const [filteredData, setFilteredData] = useState<any>(null);
  // const { filter } = useContext(AppContext);

  const JSAssessmentDetails = useSelector(
    (state: any) => state.JSAssessmentData
  );
  const { JsAssRes, Jsloading } = JSAssessmentDetails;

  const StatisticsDetails = useSelector(
    (state: any) => state.AssessmentStatistics
  );
  const { StatRes, Statloading } = StatisticsDetails;

  useEffect(() => {
    if (scheduledAssess) {
      const saMdl = {
        pageLimit: 10,
        pageId: 1,
        status: "INVITED",
      };
      dispatch(getJSAssessmentData(saMdl));
      dispatch(getJSAssessmentStatistics());
      setAstatus("INVITED");
    } else if (doneAssess) {
      const completedMdl = {
        pageLimit: 10,
        pageId: 1,
        status: "COMPLETED",
      };
      dispatch(getJSAssessmentData(completedMdl));
      dispatch(getJSAssessmentStatistics());
      setAstatus("COMPLETED");
    } else {
      const allMdl = {
        pageLimit: 10,
        pageId: 1,
        status: "ALL",
      };
      dispatch(getJSAssessmentData(allMdl));
      dispatch(getJSAssessmentStatistics());
      setAstatus("ALL");
    }
  }, [allAssess, scheduledAssess, doneAssess]);

  const draftDataHandler = () => {
    // const AssessListOptions = {
    //   category: [],
    //   skills: [],
    // };
    // dispatch(getAssessmentData(AssessListOptions));
  };
  const completeHandler = () => {
    // const AssessListOptions = {
    //   category: [],
    //   skills: [],
    // };
    // dispatch(getAssessmentData(AssessListOptions));
  };

  const handleFilterData = (data: any) => {
    setFilteredData(data);
  };

  return (
    <>
      <div className="page-content ">
        <div className="content-block">
          <div className="section-full browse-job content-inner-1">
            <div className="container" style={{ marginTop: "-10px" }}>
              <div className="job-bx-title clearfix custom-page-header">
                <div
                  className="d-flex justify-content-between job-bx bg-white m-t10"
                  id="main-header"
                >
                  <div>
                    <h5
                      className="m-t10"
                      style={{ color: "#7777d3", fontSize: "16px" }}
                    >
                      {" "}
                      SELF ASSESSMENT{" "}
                    </h5>
                  </div>

                  <div className="float-right p-tb5 p-r20"></div>
                </div>
              </div>
              <div className="row">
                <div className="col-xl-3 col-lg-4 col-md-5 col-sm-12 m-b30 mt-2">
                  {hideFilter && (
                    <FilterAssessment
                      aStatus={aStatus}
                      handleFilteredDataFn={handleFilterData}
                    />
                  )}
                  {!hideFilter && (
                    <img
                      src={draftJobsImg}
                      className="m-t50 img-fluid"
                      alt=""
                    />
                  )}
                </div>
                <div className="col-xl-9 col-lg-8 col-md-9">
                  {/* <AssessmentListing hideFilterHandler={hideFilterHandler} /> */}
                  <div className="m-b10 ml-3">
                    <button
                      type="button"
                      className={
                        allAssess
                          ? "btn btn-primary allButton mt-2"
                          : "btn btn-outline-primary allButton mt-2"
                      }
                      onClick={() => {
                        setAllAssess(true);
                        setScheduledAssess(false);
                        setDoneAssess(false);
                        hideFilterHandler(true);
                        // allDataHandler();
                      }}
                    >
                      All Assessments
                    </button>{" "}
                    &nbsp;
                    <button
                      type="button"
                      className={
                        scheduledAssess
                          ? "btn btn-primary allButton mt-2"
                          : "btn btn-outline-primary allButton mt-2"
                      }
                      onClick={(e: any) => {
                        setScheduledAssess(true);
                        setDoneAssess(false);
                        setAllAssess(false);
                        hideFilterHandler(true);
                        draftDataHandler();
                      }}
                    >
                      Scheduled Assessments
                    </button>
                    &nbsp;
                    <button
                      type="button"
                      className={
                        doneAssess
                          ? "btn btn-primary allButton mt-2"
                          : "btn btn-outline-primary allButton mt-2"
                      }
                      onClick={(e: any) => {
                        setScheduledAssess(false);
                        setDoneAssess(true);
                        setAllAssess(false);
                        hideFilterHandler(true);
                        completeHandler();
                      }}
                    >
                      Completed Assessments
                    </button>
                  </div>

                  <div>
                    {allAssess && (
                      <AssessmentCard
                        aStatus={aStatus}
                        filteredData={filteredData}
                      />
                    )}
                    {scheduledAssess && (
                      <SheduledAssessmentCard
                        aStatus={aStatus}
                        filteredData={filteredData}
                      />
                    )}
                    {doneAssess && (
                      <CompltedAssessment
                        aStatus={aStatus}
                        filteredData={filteredData}
                      />
                    )}
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

export default SelfAssessment;
