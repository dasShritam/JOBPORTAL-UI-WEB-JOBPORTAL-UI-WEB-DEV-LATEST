import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jobSeekerRegister } from "../../../redux/features/authentication/jobSeekerRegisterSlice";
import HashLoader from "react-spinners/HashLoader";
import { jsSocailMediaLogin } from "../../../redux/features/authentication/LoginSlice";
import { environment } from "../../../environments/environment";
import { PatchSaveUnSaveJob } from "../../../redux/features/jobs/saved-jobs/SavedJobsSlice";
import Loader from "../../common/Loader/Loader";

const loader = require("../../../assets/images/opener-loading.gif");

const Runway = () => {
  const [code] = useSearchParams(),
    [state] = useSearchParams(),
    navigate = useNavigate(),
    dispatch = useDispatch(),
    sid = Math.floor(Math.random() * 0xffffff * 1000000).toString(16),
    jobSeekerLoginRes = useSelector((state: any) => state.JsSocMediaLogin),
    { res } = jobSeekerLoginRes,
    jobSeekerReg = useSelector((state: any) => state.jobSeekerRegister),
    loginInfo = {
      authType: state.get("state"),
      authKey: code.get("code"),
      state: {
        uniqueid: sid,
        ondemandpage: environment.ondemandpage,
        redirect_uri: environment.runwayUrl,
      },
    };

  const twitterRegister = async (loginInfo: any, code: string) => {
    loginInfo.authType = "twitter";
    loginInfo.state.code_verifier = code;
    await dispatch(jobSeekerRegister(loginInfo));
  };
  const twitterLogin = async (loginInfo: any, code: string) => {
    loginInfo.authType = "twitter";
    loginInfo.state.code_verifier = code;
    await dispatch(jsSocailMediaLogin(loginInfo));
  };

  useEffect(() => {
    switch (state.get("state")) {
      case "google":
        google(loginInfo);
        break;
      case "linkedin":
        linkedIn(loginInfo);
        break;
      case "googleRegister":
        googleRegister(loginInfo);
        break;
      case "linkedInRegister":
        linkedInRegister(loginInfo);
        break;
      case "facebook":
        loginInfo.state.redirect_uri = environment.runwayUrl;
        facebook(loginInfo);
        break;
      case "facebookRegister":
        loginInfo.state.redirect_uri = environment.runwayUrl;
        facebookRegister(loginInfo);
        break;
      default:
        const stateInfo: string | null = state.get("state");
        let data;
        if (stateInfo) {
          data = JSON.parse(atob(stateInfo));
        }
        if (data.authType === "twitterRegister") {
          loginInfo.state.redirect_uri = environment.runwayUrl;
          twitterRegister(loginInfo, data.code_challenge);
        } else {
          loginInfo.state.redirect_uri = environment.runwayUrl;
          twitterLogin(loginInfo, data.code_challenge);
        }

        break;
    }
  }, []);

  useEffect(() => {
    if (res && res.code === 200) {
      if (res.code === 200) {
        const jobid = sessionStorage.getItem("jobid");
        const job_id = sessionStorage.getItem("job_id");
        sessionStorage.removeItem("jobid");
        sessionStorage.removeItem("job_id");

        if (jobid) {
          const datamdl = {
            jobSeekerResp: {
              jobid: jobid,
              status: "SAVE",
            },
          };
          dispatch(PatchSaveUnSaveJob(datamdl));
          sessionStorage.removeItem("jobid");
          navigate("/jobs/savedjobs");
        } else if (job_id) {
          sessionStorage?.removeItem("job_id");
          navigate({ pathname: `/jobs/js/previewjob/${job_id}` });
        } else {
          navigate("/jobseekerProfile");
        }
      }
      // navigate("/jobseekerProfile");
    } else if (res && res.response && res.response.code !== 200) {
      navigate("/jobseekerregister");
    }

    if (jobSeekerReg.res && jobSeekerReg.res.code === 200) {
      navigate("/jobseekerProfile");
    } else if (jobSeekerReg.res && jobSeekerReg.res.code === 206) {
      navigate("/jobseekerregister");
    } else if (
      jobSeekerReg.res &&
      jobSeekerReg.res.response &&
      jobSeekerReg.res.response.data &&
      jobSeekerReg.res.response.data.code === 400
    ) {
      navigate("/jobseekerregister");
    }
  }, [navigate, res, jobSeekerReg]);

  const google = async (loginInfo: any) => {
      await dispatch(jsSocailMediaLogin(loginInfo));
    },
    linkedIn = async (loginInfo: any) => {
      await dispatch(jsSocailMediaLogin(loginInfo));
    },
    googleRegister = async (logInfo: any) => {
      logInfo.authType = "google";
      await dispatch(jobSeekerRegister(logInfo));
    },
    linkedInRegister = async (loginInfo: any) => {
      loginInfo.authType = "linkedin";
      await dispatch(jobSeekerRegister(loginInfo));
    },
    facebook = async (loginInfo: any) => {
      await dispatch(jsSocailMediaLogin(loginInfo));
    },
    facebookRegister = async (loginInfo: any) => {
      loginInfo.authType = "facebook";
      await dispatch(jobSeekerRegister(loginInfo));
    };

  return (
    <>
      <Loader />
    </>
  );
};

export default Runway;
