import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  GetDayFromTimeStamp,
  GetMonthNameFromTimeStamp,
  GetYearFromTimeStamp,
} from "../../../common/common";

interface propsType {
  userId: string;
  jobId: string;
  isEmployer?: boolean;
}

const WorkExp = (props: propsType) => {
  const [profileValue, setProfileValue] = useState<any>("");
  const [bindAppProfile, setBindAppProfile] = useState<any>();
  const [worke, setworke] = useState<any>();

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
      setworke(bindAppProfile?.employments);
    }
  }, [bindAppProfile?.employments]);

  return (
    <>
      <div id="Work_Experience_bx" className=" job-bx bg-white m-b30">
        <div className="d-flex">
          <span className="m-b15 card-heading cardprop">Work Experience</span>
        </div>
        <div className="mainline" style={{ marginBottom: "10px" }}></div>
        {worke && worke?.length ? (
          <div>
            {worke?.length &&
              worke.map((items) => {
                return (
                  <div>
                    <div className="com">{items.company}</div>
                    <div className="desh">
                      {items?.fulltime?.role}
                      {items?.internship?.role} |{" "}
                      {GetDayFromTimeStamp(items?.join_date)}{" "}
                      {GetMonthNameFromTimeStamp(items?.join_date)}{" "}
                      {GetYearFromTimeStamp(items?.join_date)} -
                      {items?.work_till ? (
                        <span>
                          {GetDayFromTimeStamp(items?.work_till)}{" "}
                          {GetMonthNameFromTimeStamp(items?.work_till)}{" "}
                          {GetYearFromTimeStamp(items?.work_till)}
                        </span>
                      ) : (
                        <span> to Present</span>
                      )}
                    </div>
                    <div className="desh">{items?.fulltime?.job_desc}</div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="notavail">Not Available</div>
        )}
      </div>
    </>
  );
};

export default WorkExp;
