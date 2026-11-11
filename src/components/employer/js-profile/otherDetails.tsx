import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Project = {
  Physical: "No.",
};

interface propsType {
  id: any;
  userId: string;
  jobId: string;
  isEmployer?: boolean;
}
const OtherDetails = (props: propsType) => {
  const [profileValue, setProfileValue] = useState<any>("");
  const [bindAppProfile, setBindAppProfile] = useState<any>();

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

  return (
    <>
      <div id="Other_Details_bx" className=" job-bx bg-white m-b30">
        <div className="d-flex">
          <span className="m-b15 card-heading cardprop">Other Details</span>
        </div>
        <div className="mainline" style={{ marginBottom: "10px" }}></div>
        <div className="textValue">Desired Job Details</div>
        <div>
          <div className="desh">
            <span className="candi">Job Type:</span>{" "}
            {bindAppProfile?.career_profile?.job_type[0]
              ? bindAppProfile?.career_profile?.job_type
              : "Not Available"}
          </div>
          <div className="desh" id={props.id}>
            <span className="candi">Employement Status:</span>{" "}
            {bindAppProfile?.career_profile?.emp_type[0]
              ? bindAppProfile?.career_profile?.emp_type
              : "Not Available"}
          </div>
          <div className="textValue">Affirmation Action</div>
          <div className="desh">
            <span className="candi">Physical Challenged:</span>{" "}
            {bindAppProfile?.profile?.disability_type === null
              ? "No"
              : bindAppProfile?.profile?.disability_type}
          </div>
        </div>
      </div>
    </>
  );
};

export default OtherDetails;
