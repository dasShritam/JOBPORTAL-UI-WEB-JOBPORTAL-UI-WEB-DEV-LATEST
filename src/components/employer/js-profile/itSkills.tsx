import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface propsType {
  userId: string;
  jobId: string;
  isEmployer?: boolean;
}

const ItSkills = (props: propsType) => {
  const [profileValue, setProfileValue] = useState<any>("");
  const [bindAppProfile, setBindAppProfile] = useState<any>();
  const [SkillsD, setSkills] = useState<any>();

  const applicantProfile = useSelector((state: any) => state.jsPrfilePreview);
  const jsProfile = useSelector((state: any) => state.jsProfileDetails);
  const { ApplicantInfo, loading } = applicantProfile;
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
      setSkills(bindAppProfile?.skills?.it);
    }
  }, [bindAppProfile?.skills]);

  return (
    <>
      <div id="It_Skills_bx" className=" job-bx bg-white m-b30">
        <div className="d-flex">
          <span className="m-b15 card-heading cardprop">It Skills</span>
        </div>
        <div>
          {SkillsD?.length ? (
            <ul className="post-job-bx skilled">
              <>
                <table className="table">
                  <thead>
                    <tr>
                      <th className="tabsec" scope="col">
                        Name
                      </th>
                      <th className="tabsec" scope="col">
                        Version
                      </th>
                      <th className="tabsec" scope="col">
                        Last Used
                      </th>
                      <th className="tabsec" scope="col">
                        Experience
                      </th>
                    </tr>
                  </thead>
                  {SkillsD?.length &&
                    SkillsD?.map((item) => {
                      return (
                        <tbody>
                          <tr>
                            <td className="tabsec">{item.name}</td>
                            <td className="tabsec">{item.version}</td>
                            <td className="tabsec">{item.last_used}</td>
                            <td className="tabsec">
                              {item?.experience?.year} Year(s){" "}
                              {item?.experience?.month} Month(s)
                            </td>
                          </tr>
                        </tbody>
                      );
                    })}
                </table>
              </>
            </ul>
          ) : (
            <div className="notavail">Not Available</div>
          )}
        </div>
      </div>
    </>
  );
};

export default ItSkills;
