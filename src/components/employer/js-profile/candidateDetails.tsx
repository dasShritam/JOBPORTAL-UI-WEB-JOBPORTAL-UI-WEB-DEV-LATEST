import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  GetDayFromTimeStamp,
  GetMonthNameFromTimeStamp,
  GetYearFromTimeStamp,
  StateWiesPlaces,
} from "../../../common/common";

interface propsType {
  userId: string;
  jobId: string;
  isEmployer?: boolean;
}

const CandidateDetails = (props: propsType) => {
  const [profileValue, setProfileValue] = useState<any>("");
  const [bindAppProfile, setBindAppProfile] = useState<any>();
  const [workDesig, setWorkDesig] = useState<any>();

  const applicantProfile = useSelector((state: any) => state.jsPrfilePreview);
  const { ApplicantInfo, loading } = applicantProfile;

  const jsProfile = useSelector((state: any) => state.jsProfileDetails);
  const { details, loadingg } = jsProfile;

  const dynicRes = props.isEmployer ? details : ApplicantInfo;
  const dynLoading = props.isEmployer ? loadingg : loading;

  useEffect(() => {
    if (!dynLoading && dynicRes?.data && dynicRes?.data) {
      setProfileValue(dynicRes);
    }
  }, [dynicRes, dynLoading]);

  useEffect(() => {
    if (profileValue.code === 200) {
      setBindAppProfile(profileValue?.data?.applicant_info);
    }
  }, [profileValue]);

  useEffect(() => {
    if (!dynLoading && dynicRes?.data && dynicRes?.data) {
      setWorkDesig(bindAppProfile?.employments);
    }
  }, [bindAppProfile?.employments]);

  return (
    <>
      <div id="Candidate_details_bx" className=" job-bx bg-white m-b30">
        <div className="d-flex">
          <span className="m-b15 card-heading cardprop">Candidate Details</span>
        </div>
        <div className="mainline" style={{ marginBottom: "10px" }}></div>
        <div className="row">
          <div className="col-xl-6 col-lg-4 m-b30">
            <div>
              <div className="candi">
                Current Location :{" "}
                <span className="val">
                  {bindAppProfile?.profile?.location?.city
                    ? bindAppProfile?.profile?.location?.city
                    : "Not Available"}
                  ,{bindAppProfile?.profile?.location?.country}
                </span>
              </div>
              <div className="candi">
                Preferred Location :{" "}
                <span className="val">
                  {bindAppProfile?.career_profile?.location?.length
                    ? StateWiesPlaces(
                        bindAppProfile?.career_profile?.location
                      )?.join(" | ")
                    : "Not Available"}
                </span>
              </div>
              <div className="candi">
                Department :{" "}
                <span className="val">
                  {" "}
                  {bindAppProfile?.career_profile?.dept
                    ? bindAppProfile?.career_profile?.dept
                    : "Not Available"}
                </span>
              </div>
              <div className="candi">
                Role :{" "}
                <span className="val">
                  {bindAppProfile?.career_profile?.role
                    ? bindAppProfile?.career_profile?.role
                    : "Not Available"}
                </span>
              </div>
              <div className="candi">
                Industry :{" "}
                <span className="val">
                  {bindAppProfile?.career_profile?.industry
                    ? bindAppProfile?.career_profile?.industry
                    : "Not Available"}
                </span>
              </div>
              {/* displayData?.map((item: any, index: any) => {
              }) */}
              <div className="candi">
                Key Skills :{" "}
                <span className="val">
                  {bindAppProfile?.skills?.key?.length
                    ? bindAppProfile?.skills?.key?.join(", ")
                    : "Not Available"}
                </span>
              </div>
            </div>
          </div>

          <div className="col-xl-6 col-lg-4 m-b30">
            {workDesig &&
              workDesig.map((items) => {
                return (
                  <>
                    <div className="candi">
                      Current Designation :{" "}
                      <span className="val">
                        {items?.fulltime?.role
                          ? items?.fulltime?.role
                          : items?.internship?.role}
                      </span>
                    </div>
                    <div className="candi">
                      Current Company :{" "}
                      <span className="val">
                        {items?.company ? items?.company : "Not Available"}
                      </span>
                    </div>
                    <div className="candi">
                      Notice Period :{" "}
                      <span className="val">
                        {items?.fulltime?.notice_period?.term
                          ? items?.fulltime?.notice_period?.term
                          : "Not Available"}
                      </span>
                    </div>
                  </>
                );
              })}
            <div className="candi">
              Experience :{" "}
              <span className="val">
                {bindAppProfile?.career_profile?.total_exp?.year} Year(s) ,
                {bindAppProfile?.career_profile?.total_exp?.month} Month(s)
              </span>
            </div>
            <div className="candi">
              Current Salary :{" "}
              <span className="val">
                {bindAppProfile?.career_profile?.total_exp?.curr_ctc?.value
                  ? bindAppProfile?.career_profile?.total_exp?.curr_ctc?.value
                  : "Not Available"}
                {"("}
                {bindAppProfile?.career_profile?.total_exp?.curr_ctc?.currency
                  ? bindAppProfile?.career_profile?.total_exp?.curr_ctc
                      ?.currency
                  : "Not Available"}
                {")"}
              </span>
            </div>
          </div>
        </div>
        <div className="mainline" style={{ marginBottom: "10px" }}></div>

        {props.isEmployer ? (
          ""
        ) : (
          <div className="row">
            <div className="col-xl-12 col-lg-4 m-b3">
              <div style={{ fontSize: "14px" }}>
                Application date :{" "}
                {GetDayFromTimeStamp(bindAppProfile?.created_at)}{" "}
                {GetMonthNameFromTimeStamp(bindAppProfile?.created_at)}{" "}
                {GetYearFromTimeStamp(bindAppProfile?.created_at)}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CandidateDetails;
