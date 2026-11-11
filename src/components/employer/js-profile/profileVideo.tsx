import React, { useEffect, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { BsFileEarmarkPlay } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { downloadAppVideo } from "../../../redux/features/employer/downloadMedia";
import { ClassNames } from "@emotion/react";

interface propsType {
  userId: string;
  jobId: string;
  isEmployer?: boolean;
}

const ProfileVideo = (props: propsType) => {
  const dispatch = useDispatch();
  const { video } = useSelector((state: any) => state.downloadAppVid);
  const [vdoDwnBtn, setVdoDwnBtn] = useState(false);
  const [videoUrl, setVideoUrl] = useState(""),
    [disPopup, setDisPopUp] = useState(false),
    [close, setClose] = useState(false);

  useEffect(() => {
    if (video.code === 200) {
      setVideoUrl(video?.data);
    }
  }, [video, video.data]);

  const handleVideo = () => {
    dispatch(downloadAppVideo(props.userId));
  };

  //get profile

  const applicantProfile = useSelector((state: any) => state.jsPrfilePreview);
  const { ApplicantInfo, loading } = applicantProfile;
  const [profileValue, setProfileValue] = useState<any>("");
  const [bindAppProfile, setBindAppProfile] = useState<any>();

  useEffect(() => {
    if (!loading && ApplicantInfo?.data && ApplicantInfo?.data) {
      setProfileValue(ApplicantInfo);
    }
  }, [ApplicantInfo, loading]);

  useEffect(() => {
    if (profileValue.code === 200) {
      setBindAppProfile(profileValue?.data?.applicant_info);
    }
  }, [profileValue]);

  const jsProfile = useSelector((state: any) => state.jsProfileDetails);
  const { details, loadingg } = jsProfile;
  const [data, setData] = useState<any>();
  const dynicRes = props.isEmployer ? details : ApplicantInfo;
  const dynLoading = props.isEmployer ? loadingg : loading;

  useEffect(() => {
    if (!dynLoading && dynicRes?.data && dynicRes?.data) {
      setData(dynicRes);
    }
  }, [dynicRes, dynLoading]);
  return (
    <div id="Profile_video_bx" className=" job-bx bg-white m-b30">
      <div className="">
        <div className="row">
          <div className="col-lg-12 col-md-12">
            <div>
              <span className="m-b15 card-heading cardprop">Profile Video</span>
            </div>
          </div>
          <div className="col-lg-12 col-md-12 vidprop">
            {data?.data?.applicant_info?.profile?.intro_video?.name ? (
              <div>
                <div>
                  <p
                    title={
                      close
                        ? "Click here to close video"
                        : "Click here to play video"
                    }
                    style={{ float: "right", cursor: "pointer" }}
                  >
                    {!close && (
                      <button
                        onClick={() => {
                          handleVideo();
                          setClose(true);
                        }}
                        className="VideoDown"
                      >
                        <BsFileEarmarkPlay />
                      </button>
                    )}
                    {close && (
                      <button
                        className="crossbtn"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setClose(false);
                        }}
                      >
                        <AiOutlineCloseCircle />
                      </button>
                    )}
                  </p>
                </div>
                <div style={{ textAlign: "center" }}>
                  {videoUrl && close && (
                    <video
                      width="95%"
                      height="400"
                      controls
                      autoPlay
                      disablePictureInPicture
                    >
                      <source src={videoUrl} type="video/mp4"></source>
                    </video>
                  )}
                </div>
              </div>
            ) : (
              <div className="notavail">Not Available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileVideo;
