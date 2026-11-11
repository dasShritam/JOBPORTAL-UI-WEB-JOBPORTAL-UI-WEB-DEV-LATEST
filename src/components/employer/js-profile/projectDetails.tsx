import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface propsType {
  userId: string;
  jobId: string;
  isEmployer?: boolean;
}

const ProjectDetails = (props: propsType) => {
  const [profileValue, setProfileValue] = useState<any>("");
  const [bindAppProfile, setBindAppProfile] = useState<any>();
  const [proj, setproj] = useState<any>();

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
      setproj(bindAppProfile?.project);
    }
  }, [bindAppProfile?.project]);

  return (
    <>
      <div id="Projects_bx" className=" job-bx bg-white m-b30">
        <div className="d-flex">
          <span className="m-b15 card-heading cardprop">Project Details</span>
        </div>
        <div className="mainline" style={{ marginBottom: "10px" }}></div>
        {proj && proj?.length ? (
          <div>
            {proj?.length > 0 &&
              proj.map((items: any) => {
                return (
                  <div>
                    <div className="com">{items.title}</div>
                    <div className="desh">
                      <span className="candi">Site:</span>{" "}
                      {items.on_site ? "Onsite" : "Offsite"}
                    </div>
                    <div className="desh">
                      <span className="candi">Team Size:</span>{" "}
                      {items.team_size ? items.team_size : "Not Mentioned"}
                    </div>
                    <div className="desh">
                      <span className="candi">Company Name:</span>{" "}
                      {items.client}
                    </div>
                    <div className="desh">
                      <span className="candi">Requirement details: </span>{" "}
                      {items.desc}
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

export default ProjectDetails;
