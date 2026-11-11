import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AssessAdminFilter from "./AssessAdminFilter";
import AssessAdminListing from "./assessAdminListing";
import { Button } from "react-bootstrap";
import {
  resetAddAssessment,
  resetEditAssessment,
  resetviewAssessmentSl,
} from "../../../redux/features/admin/Assessment/manageAssessmentSlice";
import { useDispatch } from "react-redux";
import AssessAdminCard from "./AssessAdminCard";

var draftJobsImg = require("../../../assets/images/background/draftJobImg.png");

function MainAssessment() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [hideFilter, setHideFilter] = useState(true);
  const [filteredData, setFilteredData] = useState<any>(null);
  const [allAssess, setAllAssess] = useState(true);
  const hideFilterHandler = (bool: boolean) => {
    setHideFilter(bool);
  };

  const addAssessment = async () => {
    dispatch(resetviewAssessmentSl());
    dispatch(resetEditAssessment());
    navigate("/admin/addAssessment", { state: 1 });
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
                      MANAGE ASSESSMENT{" "}
                    </h5>
                  </div>
                  <div>
                    <Button
                      className="testBtn taketestbtn"
                      onClick={async () => {
                        dispatch(resetAddAssessment());
                        addAssessment();
                      }}
                    >
                      <span>
                        {" "}
                        <i className="fa fa-plus" aria-hidden="true"></i> Add
                        Assessment
                      </span>
                    </Button>
                  </div>

                  {/* <div className="float-right p-tb5 p-r20"></div> */}
                </div>
              </div>
              <div className="row">
                <div className="col-xl-3 col-lg-4 col-md-5 col-sm-12 m-b30">
                  {hideFilter && (
                    <AssessAdminFilter
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
                <div className="col-xl-7 col-lg-8 col-md-7">
                  {/* <AssessAdminListing hideFilterHandler={hideFilterHandler} /> */}
                  {allAssess && <AssessAdminCard filteredData={filteredData} />}
                </div>
                <div
                  className="col-xl-2 col-lg-8 col-md-7"
                  style={{ marginTop: "63px" }}
                >
                  <div
                    id="Comments_bx assessimg"
                    className="job-bx bg-white m-b30"
                  >
                    <div className="">
                      <div>
                        <Link to={"#"}>
                          <img
                            style={{ height: "100%" }}
                            alt="Comment"
                            src={require("../../../assets/images/Assessment.png")}
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
    </>
  );
}

export default MainAssessment;
