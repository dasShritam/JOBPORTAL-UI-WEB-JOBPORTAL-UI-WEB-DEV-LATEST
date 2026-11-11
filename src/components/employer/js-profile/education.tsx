import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface propsType {
  userId: string;
  jobId: string;
  isEmployer?: boolean;
}

const Education = (props: propsType) => {
  const [profileValue, setProfileValue] = useState<any>("");
  const [bindAppProfile, setBindAppProfile] = useState<any>();
  const [edu, setEdu] = useState<any>();

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
      setEdu(bindAppProfile?.education?.degree);
    }
  }, [bindAppProfile?.education]);

  return (
    <>
      <div id="Education_bx" className=" job-bx bg-white m-b30">
        <div className="d-flex">
          <span className="m-b15 card-heading cardprop">Education</span>
        </div>
        <div className="mainline" style={{ marginBottom: "10px" }}></div>
        {edu && edu?.length ? (
          <div>
            {edu?.length &&
              edu.map((items) => {
                return (
                  <div>
                    <div className="com">
                      {items.edu_type} {items.course_type}
                    </div>
                    <div className="desh">
                      {items.course} {items.stream}
                    </div>
                    <div className="desh">
                      {items.institute} in {items.completion_year}
                    </div>
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

export default Education;
