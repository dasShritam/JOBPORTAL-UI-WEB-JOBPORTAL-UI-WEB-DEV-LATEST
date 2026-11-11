import React, { useEffect, useState } from "react";
import { BsCloudDownload } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { resetDownloadResume } from "../../../redux/features/manage-account/profile/userFilesSlice";
import { Link } from "react-router-dom";
import { downloadAppResume } from "../../../redux/features/employer/downloadMedia";
import { Button } from "react-bootstrap";

interface propsType {
  userId: string;
  jobId: string;
  isEmployer?: boolean;
}

const AttachResume = (props: propsType) => {
  const dispatch = useDispatch();

  /* Start Resume Download API */

  const jsProfile = useSelector((state: any) => state.jsProfileDetails);

  let { resume, loading1 } = useSelector((state: any) => state.downloadAppRes);

  const resumeDownload = () => {
    dispatch(downloadAppResume(props.userId));
  };

  useEffect(() => {
    if (!loading1 && resume.code === 200) {
      window.location.href = resume.data;
      dispatch(resetDownloadResume());
    }
  }, [loading1, resume]);

  /* End Resume Download API */

  // get profile

  const applicantProfile = useSelector((state: any) => state.jsPrfilePreview);
  const { ApplicantInfo, loading } = applicantProfile;
  const [profileValue, setProfileValue] = useState<any>("");
  const [bindAppProfile, setBindAppProfile] = useState<any>();

  const { details, loadingg } = jsProfile;
  const dynicRes = props.isEmployer ? details : ApplicantInfo;
  const dynLoading = props.isEmployer ? loadingg : loading;

  useEffect(() => {
    if (!dynLoading && dynicRes?.data && dynicRes?.data) {
      setProfileValue(dynicRes);
    }
  }, [dynicRes, dynLoading]);
  // useEffect(() => {
  //   if (!loading && ApplicantInfo?.data && ApplicantInfo?.data) {
  //     setProfileValue(ApplicantInfo);
  //   }
  // }, [ApplicantInfo, loading]);

  useEffect(() => {
    if (profileValue.code === 200) {
      setBindAppProfile(
        profileValue?.data?.applicant_info?.career_profile?.cv?.name
      );
    }
  }, [profileValue]);

  return (
    <>
      <div className=" job-bx bg-white m-b30">
        <div className="d-flex resm" id="Attached_Resume_bx">
          <div>
            <span className="m-b15 card-heading cardprop">Attached Resume</span>
          </div>
          {bindAppProfile ? (
            <div title="Click here to Download Resume">
              <Button
                className="float-right resumeDown"
                onClick={() => {
                  resumeDownload();
                }}
              >
                <BsCloudDownload />
              </Button>
            </div>
          ) : (
            <div className="notavail">Not Available</div>
          )}
        </div>
      </div>
    </>
  );
};

export default AttachResume;
