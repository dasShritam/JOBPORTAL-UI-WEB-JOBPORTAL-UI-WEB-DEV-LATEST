import React, { lazy, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../../assets/customCss/Pagination.css";
import "../../../assets/customCss/jobs/manage-jobs.css";
import {
  filterAssessmentData,
  getAssessmentData,
  getJSAssessmentData,
} from "../../../redux/features/jobSeeker/JsAssessmentSlice";
import { AppContext } from "../../../context/AppContext";
import CompltedAssessment from "./CompltedAssessment";
import FilterAssessment from "./FilterAssessment";
const AssessmentCard = lazy(() => import("./AssessmentCard"));
const SheduledAssessmentCard = lazy(() => import("./SheduledAssessmentCard"));

type initialState = {
  hideFilterHandler?: any;
};
function JobListing({ hideFilterHandler }: initialState) {
  const [allAssess, setAllAssess] = useState(true);
  const [scheduledAssess, setScheduledAssess] = useState(false);
  const [doneAssess, setDoneAssess] = useState(false);
  const dispatch = useDispatch();
  const [aStatus, setAstatus] = useState<any>(null);
  // const { filter } = useContext(AppContext);

  const JSAssessmentDetails = useSelector(
    (state: any) => state.JSAssessmentData
  );
  const { JsAssRes, Jsloading } = JSAssessmentDetails;

  useEffect(() => {
    if (scheduledAssess) {
      const saMdl = {
        pageLimit: 10,
        pageId: 1,
        status: "INVITED",
      };
      dispatch(getJSAssessmentData(saMdl));
      setAstatus("INVITED");
    } else if (doneAssess) {
      const completedMdl = {
        pageLimit: 10,
        pageId: 1,
        status: "COMPLETED",
      };
      dispatch(getJSAssessmentData(completedMdl));
      setAstatus("COMPLETED");
    } else {
      const allMdl = {
        pageLimit: 10,
        pageId: 1,
        status: "ALL",
      };
      dispatch(getJSAssessmentData(allMdl));
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

  return (
    <>
      {/* <div className="job-bx-title clearfix">
        <div className="row">
          <div className="col-xl-3 col-lg-4 col-md-5 col-sm-12 m-b30">
            <FilterAssessment />
          </div>
          <div className="col-xl-7 col-lg-6 col-md-6 pull-left">
            <button
              type="button"
              className={
                allAssess
                  ? "btn btn-primary allButton"
                  : "btn btn-outline-primary allButton"
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
                  ? "btn btn-primary allButton"
                  : "btn btn-outline-primary allButton"
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
                  ? "btn btn-primary allButton"
                  : "btn btn-outline-primary allButton"
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
        </div>
      </div>
      <div>
        {allAssess && <AssessmentCard aStatus={aStatus} />}
        {scheduledAssess && <SheduledAssessmentCard aStatus={aStatus} />}
        {doneAssess && <CompltedAssessment aStatus={aStatus} />}
      </div> */}
    </>
  );
}

export default JobListing;
