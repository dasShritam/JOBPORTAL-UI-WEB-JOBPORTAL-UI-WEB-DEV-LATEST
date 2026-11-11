import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../assets/customCss/JsDashboard.css";
import { environment } from "../../environments/environment";
import {
  getJSAssessmentData,
  getJobSeekrAssessment,
} from "../../redux/features/jobSeeker/JsAssessmentSlice";
import { profileStrength } from "../../redux/features/manage-account/profile/BasicDetailsSlice";
import {
  fetchJobSummary,
  fetchMatchingJobs,
} from "../../redux/features/manage-account/profile/JsDashboardSlice";
import PollSystem from "../admin/polls/PollPreview";

const JobSeekerDashboard = (props: any) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //Percentage
  const [profileStr, setProfileStr] = useState<any>();
  const [newAssessmentCount, setnewAssessmentCount] = useState<any>("");
  const [doneAssessmentCount, setDoneAssessmentCount] = useState<any>("");
  const [profileWeightageValue, setprofileWeightageValue] = useState<any>();

  const profileStrengthRes = useSelector((state: any) => state.profileStrength);
  const { pflStrnRes, loading2 } = profileStrengthRes;

  useEffect(() => {
    if (!loading2 && pflStrnRes?.code === 200) {
      setProfileStr(pflStrnRes);
      setprofileWeightageValue(pflStrnRes?.data?.profileWeightage);
    }
    dispatch(profileStrength());
  }, [pflStrnRes?.code, profileStr, dispatch]);

  //Matching counts
  const [jsJobSummary, setJobSummary] = useState<any>();

  const jobSummaryRes = useSelector((state: any) => state.jobSummary);
  const { jbSRes, jbload } = jobSummaryRes;

  useEffect(() => {
    if (!jbload && jbSRes?.code === 200) {
      setJobSummary(jbSRes);
    }
    dispatch(fetchJobSummary());
  }, [jbSRes.code, jsJobSummary, dispatch]);

  //Matching Jobs

  const [matchingJobs, setMatchingJobs] = useState<any>(null);

  const matchingJobsRes = useSelector((state: any) => state.matchingJobs);
  const { matchingUserJobs, jsMatchingloading } = matchingJobsRes;

  useEffect(() => {
    if (!jsMatchingloading && matchingUserJobs?.code === 200) {
      setMatchingJobs(matchingUserJobs.data);
    }
    dispatch(fetchMatchingJobs());
  }, [matchingUserJobs.code, matchingJobs, dispatch]);

  // assessment

  const AssessDetails = useSelector((state: any) => state.JSAssessmentData);
  const { JsAssRes, Jsloading } = AssessDetails;

  useEffect(() => {
    const assessmentJs = {
      pageId: 1,
      pageLimit: 1,
      status: "ALL",
    };

    dispatch(getJSAssessmentData(assessmentJs));
  }, [dispatch]);

  useEffect(() => {
    if (!Jsloading && JsAssRes?.code === 200 && JsAssRes?.data) {
      setnewAssessmentCount(JsAssRes?.data);
    }
  }, [JsAssRes?.code, newAssessmentCount, JsAssRes?.data]);

  // End Assessmemt

  // completd Assessmemt

  const JobSeekrAssessment = useSelector(
    (state: any) => state.getJobSeekrAssess
  );
  const { jobSeekerAssess, Jobseekerloading } = JobSeekrAssessment;

  useEffect(() => {
    const assessJs = {
      pageId: 1,
      pageLimit: 1,
      status: "COMPLETED",
    };

    dispatch(getJobSeekrAssessment(assessJs));
  }, [dispatch]);

  useEffect(() => {
    if (
      !Jobseekerloading &&
      jobSeekerAssess?.code === 200 &&
      jobSeekerAssess?.data
    ) {
      setDoneAssessmentCount(jobSeekerAssess?.data);
    }
  }, [
    Jobseekerloading,
    jobSeekerAssess?.code,
    doneAssessmentCount,
    dispatch,
    jobSeekerAssess?.data,
  ]);

  // end

  let series = [
    {
      name: "",
      data: [0],
    },
  ];

  const textlimit = 20;
  const textlimitName = 15;

  let options = {};
  if (profileWeightageValue) {
    const profileWeightage_1: number[] = Object.values(profileWeightageValue);
    const profileWeightageKeys = Object.keys(profileWeightageValue);
    const modifiedprofileWeightage = profileWeightageKeys?.map((item) => {
      switch (item) {
        case "ph_verified":
          return "Mob No.Verify";
        case "email_verified":
          return "Email Verify";
        case "cv":
          return "CV";
        case "headline":
          return "Headline";
        case "key_skill":
          return "Skill";
        case "education":
          return "Education";
        case "project":
          return "Project";
        case "des_job_loc":
          return "Location";
        case "dept":
          return "Department";
        case "ind_type":
          return "Industry type";
        case "photo":
          return "Photo";
        case "gender":
          return "Gender";
        case "dob":
          return "DOB";
        case "lang":
          return "Language";
        case "intro_video":
          return "Video";
        case "mob":
          return "Mobile No.";
        case "prof_summery":
          return "Profile summery";
        case "job_profile":
          return "Profile";
        case "designation":
          return "Designation";
        default:
          return item;
      }
    });

    series = [
      //data on the y-axis
      {
        name: "Percentage",
        data: profileWeightage_1,
      },
    ];

    options = {
      //data on the x-axis
      chart: {
        id: "bar-chart",
      },
      xaxis: {
        categories: modifiedprofileWeightage ? modifiedprofileWeightage : "",
      },
      fill: {
        colors: ["#B47AEA"],
      },
      plotOptions: {
        bar: {
          columnWidth: "70%",
          borderRadius: 2,
          dataLabels: {
            position: "center", // top, center, bottom
          },
        },
      },
    };
  }
  return (
    <>
      <div className="job-bx browse-job clearfix">
        <div className="job-categories_d dashboard content-inner-2 bg-white">
          {/* Section 1 */}
          <div className="m-b30 job-bx dashSty">
            <div className="row sp20" style={{ cursor: "pointer" }}>
             {environment?.HackerEarth &&(<div
                className="col-lg-3 col-md-12 col-sm-12"
                onClick={() => {
                  sessionStorage.access_token
                    ? navigate("/jobs/appliedjobs")
                    : navigate("");
                }}
              >
                <div className="smCard dash1">
                  <div
                    className="icon-content smcon"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <i
                        className="fa fa-briefcase"
                        style={{
                          color: "#ffffff",
                          fontSize: "42px",
                          marginTop: "19px",
                        }}
                        aria-hidden="true"
                      ></i>
                    </div>
                    <div>
                      <div className="dashCount">
                        {jsJobSummary?.data?.applied
                          ? jsJobSummary?.data?.applied
                          : "0"}
                      </div>
                      <div className="iDash">Applied Jobs</div>
                    </div>
                  </div>
                </div>
              </div> )}
              {environment?.HackerEarth===false &&(<div
                className="col-lg-6 col-md-6 col-sm-12"
                onClick={() => {
                  sessionStorage.access_token
                    ? navigate("/jobs/appliedjobs")
                    : navigate("");
                }}
              >
                <div className="smCard dash1">
                  <div
                    className="icon-content smcon"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <i
                        className="fa fa-briefcase"
                        style={{
                          color: "#ffffff",
                          fontSize: "42px",
                          marginTop: "19px",
                        }}
                        aria-hidden="true"
                      ></i>
                    </div>
                    <div>
                      <div className="dashCount">
                        {jsJobSummary?.data?.applied
                          ? jsJobSummary?.data?.applied
                          : "0"}
                      </div>
                      <div className="iDash">Applied Jobs</div>
                    </div>
                  </div>
                </div>
              </div>)}
              {environment?.HackerEarth &&(<div
                className="col-lg-3 col-md-12 col-sm-12"
                onClick={() => {
                  sessionStorage.access_token
                    ? navigate(`/jobs/savedjobs`)
                    : navigate(``);
                }}
              >
                <div className="smCard dash2">
                  <div
                    className="icon-content smcon"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <i
                        className="fa fa-cart-arrow-down"
                        style={{
                          color: "#ffffff",
                          fontSize: "42px",
                          marginTop: "19px",
                        }}
                        aria-hidden="true"
                      ></i>
                    </div>
                    <div>
                      <div className="dashCount">
                        {jsJobSummary?.data?.saved
                          ? jsJobSummary?.data?.saved
                          : "0"}
                      </div>
                      <div className="iDash1" style={{ cursor: "pointer" }}>
                        Saved Jobs
                      </div>
                    </div>
                  </div>
                </div>
              </div>)}
              {environment?.HackerEarth===false &&( <div
                className="col-lg-6 col-md-6 col-sm-12"
                onClick={() => {
                  sessionStorage.access_token
                    ? navigate(`/jobs/savedjobs`)
                    : navigate(``);
                }}
              >
                <div className="smCard dash2">
                  <div
                    className="icon-content smcon"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <i
                        className="fa fa-cart-arrow-down"
                        style={{
                          color: "#ffffff",
                          fontSize: "42px",
                          marginTop: "19px",
                        }}
                        aria-hidden="true"
                      ></i>
                    </div>
                    <div>
                      <div className="dashCount">
                        {jsJobSummary?.data?.saved
                          ? jsJobSummary?.data?.saved
                          : "0"}
                      </div>
                      <div className="iDash1" style={{ cursor: "pointer" }}>
                        Saved Jobs
                      </div>
                    </div>
                  </div>
                </div>
              </div>)}
             {environment?.HackerEarth && (<div
                className="col-lg-3 col-md-12 col-sm-12"
                onClick={() => {
                  sessionStorage.access_token
                    ? navigate(`/js/selfAssessment`)
                    : navigate(``);
                }}
              >
                <div className="smCard dash3">
                  <div
                    className="icon-content smcon"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <i
                        className="fa fa-graduation-cap"
                        style={{
                          color: "#ffffff",
                          fontSize: "42px",
                          marginTop: "19px",
                        }}
                        aria-hidden="true"
                      ></i>
                    </div>
                    <div>
                      {/* <div className="dashCount">
                        {doneAssessmentCount && doneAssessmentCount?.asmt
                          ? doneAssessmentCount?.count?.count
                          : "0"}
                      </div> */}
                      {doneAssessmentCount?.asmt &&
                      doneAssessmentCount?.asmt?.length ? (
                        <div className="dashCount">
                          {doneAssessmentCount?.asmt
                            ? doneAssessmentCount?.count?.count
                            : "0"}
                        </div>
                      ) : (
                        <div className="dashCount">{"0"}</div>
                      )}

                      <div className="iDash2" style={{ cursor: "pointer" }}>
                        Taken Assessment
                      </div>
                    </div>
                  </div>
                </div>
              </div>) }
              {environment?.HackerEarth && ( <div
                className="col-lg-3 col-md-12 col-sm-12"
                onClick={() => {
                  sessionStorage.access_token
                    ? navigate(`/js/selfAssessment`)
                    : navigate(``);
                }}
              >
                <div className="smCard dash4">
                  <div
                    className="icon-content smcon"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <i
                        className="fa fa-clipboard"
                        style={{
                          color: "#ffffff",
                          fontSize: "42px",
                          marginTop: "19px",
                        }}
                        aria-hidden="true"
                      ></i>
                    </div>
                    <div>
                      {newAssessmentCount?.asmt &&
                      newAssessmentCount?.asmt?.length ? (
                        <div className="dashCount">
                          {newAssessmentCount?.asmt
                            ? newAssessmentCount?.count?.count
                            : "0"}
                        </div>
                      ) : (
                        <div className="dashCount">{"0"}</div>
                      )}

                      <div className="iDash3" style={{ cursor: "pointer" }}>
                        New Assessment
                      </div>
                    </div>
                  </div>
                </div>
              </div>)}
            </div>
          </div>
          {/* Section 2 */}
          <div>
            <div className="row">
              <div className="col-lg-9 col-md-12 col-sm-12">
                <div className="m-b30 job-bx dashSty">
                  <div className="">
                    <ul className="post-job-bx browse-job-grid row">
                      <li className="">
                        <div className="dez-tilte card2dash">
                          Profile Progress Statistics
                        </div>
                        <div className="">
                          {" "}
                          <div style={{ overflowY: "clip", overflowX: "auto" }}>
                            <Chart
                              options={options}
                              series={series}
                              type="bar"
                              width="1090"
                              height="250"
                            />
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-12 col-sm-12">
                <div className="m-b30 job-bx dashSty" style={{ height: "88%" }}>
                  <div className="">
                    <div style={{ display: "flex" }}>
                      <div
                        style={{
                          maxWidth: "82%",
                          margin: "auto",
                        }}
                      >
                        <div>
                          <span
                            className="job-post-info dez-tilte card2dash"
                            style={{
                              cursor: "pointer",
                              display: "flex",
                              marginBottom: "11px",
                            }}
                            onClick={() => {
                              sessionStorage.access_token
                                ? navigate(`/jobseekerprofile`)
                                : navigate(``);
                            }}
                          >
                            Profile Progress
                          </span>
                        </div>
                        {!loading2 && profileStr && (
                          <CircularProgressbar
                            styles={buildStyles({
                              pathColor: "#FF6700",
                              textColor: "#FF6700",
                              trailColor: "#ff670024",
                              backgroundColor: "#3e98c7",
                            })}
                            value={
                              profileStr?.data?.completionPercentage === null
                                ? "0"
                                : profileStr?.data?.completionPercentage
                            }
                            text={`${
                              profileStr?.data?.completionPercentage === null
                                ? "0"
                                : profileStr?.data?.completionPercentage
                            } %`}
                          />
                        )}
                        <div className="infoprofile">
                          <i
                            className="fa fa-info-circle"
                            style={{
                              color: "#191cd6",
                              fontSize: "12",
                              marginRight: "3px",
                            }}
                            aria-hidden="true"
                          ></i>
                          Profile Strength details provided by you, will
                          strengthen your profile for job success.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <br />
          {/* <div className="m-b30 job-bx dashSty">
              <div className="page-content bg-white">
                <div className="content-block">
                  {matchingJobs ? (
                    <ul className="post-job-bx browse-job-grid row">
                      {matchingJobs?.length &&
                        matchingJobs?.map((item, index) => (
                          <li key={index} className="col-lg-3 col-md-3">
                            <div className="post-bx">
                              <div className="d-flex m-b30">
                                <div className="job-post-info">
                                  <ul>
                                    <li>
                                      <Tooltip title={`${item?.title}`} arrow>
                                        <span
                                          style={{
                                            color: "#2e55fa",
                                            fontSize: "16px",
                                          }}
                                          className="job-title"
                                        >
                                          {Content(
                                            item?.title
                                              ? item?.title
                                                  ?.toString()
                                                  ?.replaceAll(",", " | ")
                                              : "Not available",
                                            textlimit
                                          )}
                                        </span>
                                      </Tooltip>
                                    </li>
                                    <li>
                                      <div className="job-content" title="Salary">
                                        <span className="ml-1">
                                          {item?.ctc?.visible ? (
                                            <>
                                              {item?.ctc?.currency === "USD"
                                                ? "$"
                                                : "₹"}
                                              {formatNumberToSalary(
                                                item?.ctc?.min
                                              )}{" "}
                                              -{" "}
                                              {item?.ctc?.max ? (
                                                <>
                                                  {item?.ctc?.currency === "USD"
                                                    ? "$"
                                                    : "₹"}
                                                  {formatNumberToSalary(
                                                    item?.ctc?.max
                                                  )}
                                                </>
                                              ) : (
                                                "₹ Not disclosed"
                                              )}
                                            </>
                                          ) : (
                                            "₹ Not disclosed"
                                          )}
                                        </span>
                                      </div>
                                    </li>
                                    <li>
                                      <span style={{ color: "#2e55fa" }}>
                                        Posted on :
                                        <Tooltip
                                          title={`${item?.employerName}`}
                                          arrow
                                        >
                                          <span
                                            style={{ color: "#2e55fa" }}
                                            className=""
                                          >
                                            {Content(
                                              item?.employerName
                                                ? item?.employerName
                                                    ?.toString()
                                                    ?.replaceAll(",", " | ")
                                                : "Not available",
                                              textlimitName
                                            )}
                                          </span>
                                        </Tooltip>
                                      </span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              <div className="d-flex">
                                <div className="job-time mr-auto">
                                  <span
                                    className="job-post-info"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      sessionStorage.setItem("jobid", item.jobid);
                                      setGoBack({
                                        url: window?.location?.href,
                                      });
                                      sessionStorage.access_token
                                        ? navigate(
                                            `/jobs/js/previewjob/${item.jobid}`
                                          )
                                        : navigate(``);
                                    }}
                                  >
                                    View
                                  </span>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
            </div> */}
          <div className="">
            <div className=" bg-white">
              <div className="content-block">
                <PollSystem></PollSystem>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobSeekerDashboard;
