import Select from "react-select";
import "../.../../../assets/customCss/empDashboard.css";
import Chart from "react-apexcharts";
import { customStyles } from "../../common/common";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  getJobPostResponse,
  getJobPostStatics,
  getJobResponsePost,
} from "../../redux/features/dashboard/employerDashboardSlice";
import PollSystem from "../admin/polls/PollPreview";
import { Link, useNavigate } from "react-router-dom";
const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [categoryInp, setCategoryInp] = useState<any>(null);
  const dispatch = useDispatch();
  const [jobPost, setJP] = useState<any>();
  const [jobPostR, setJR] = useState<any>();
  const [SecondJobPostR, setSecondJR] = useState<any>();
  const [dateFilter, setDateFilter] = useState<any>();
  const [date2Filter, setDate2Filter] = useState<any>();

  const [ExternalJobval, setExternalVal] = useState<any>("");
  const [ExternalKeys, setExternalKeys] = useState<any>("");
  const [InternalVal, setInternalVal] = useState<any>("");
  const [Internalkeys, setInternalkeys] = useState<any>("");

  const [ExtResval, setExtResVal] = useState<any>("");
  const [ExtResKeys, setExtResKeys] = useState<any>("");
  const [IntResVal, setIntResVal] = useState<any>("");
  const [IntReskeys, setIntReskeys] = useState<any>("");

  const [ExtShortList, setExtShortList] = useState<any>("");
  const [IntShortList, setIntShortList] = useState<any>("");
  const [Extrejected, setExtrejected] = useState<any>("");
  const [IntRejected, setIntRejected] = useState<any>("");

  const [TotalJobsStatics, setTotalJobs] = useState<any>("");

  const [status, setStatus] = useState<any>({
    label: "Month",
    value: "Month",
  });
  const [Dropstatus, setDropStatus] = useState<any>({
    label: "Month",
    value: "Month",
  });
  const [bindAppProfile, setBindAppProfile] = useState<any>();

  //Job post statics
  const jobpostSts = useSelector((state: any) => state.JobPostStatistics);
  const { JobPostStatics, JPloading } = jobpostSts;

  useEffect(() => {
    if (!JPloading && JobPostStatics?.code === 200) {
      setJP(JobPostStatics?.data);
    }
    dispatch(getJobPostStatics());
  }, [JobPostStatics?.code, jobPost, dispatch]);

  useEffect(() => {
    if (!JPloading && JobPostStatics?.code === 200) {
      setExtShortList(
        jobPost?.ext_app_status?.shortlist
          ? jobPost?.ext_app_status?.shortlist
          : 0
      );
      setExtrejected(
        jobPost?.ext_app_status?.reject ? jobPost?.ext_app_status?.reject : 0
      );
      setIntShortList(
        jobPost?.int_app_status?.shortlist
          ? jobPost?.int_app_status?.shortlist
          : 0
      );
      setIntRejected(
        jobPost?.int_app_status?.shortlist
          ? jobPost?.int_app_status?.shortlist
          : 0
      );
    }
  }, [JPloading, jobPost, JobPostStatics?.code]);

  useEffect(() => {
    if (!JPloading && JobPostStatics?.code === 200 && jobPost) {
      setExternalVal(
        jobPost?.ext_job_type?.reduce((acc, val) => [...acc, val.job_type], [])
      );

      setExternalKeys(
        jobPost?.ext_job_type?.reduce((acc, val) => [...acc, val.count], [])
      );
      setInternalVal(
        jobPost?.int_job_type?.reduce((acc, val) => [...acc, val.job_type], [])
      );
      setInternalkeys(
        jobPost?.int_job_type?.reduce((acc, val) => [...acc, val.count], [])
      );
    }
  }, [JPloading, JobPostStatics?.code, jobPost]);

  useEffect(() => {
    if (
      !JPloading &&
      JobPostStatics?.code === 200 &&
      jobPost &&
      jobPost?.ext_job_type &&
      jobPost?.int_job_type
    ) {
      var itotal = jobPost?.ext_job_type?.reduce(
        (accum, item) => accum + item.count,
        0
      );
      var jtotal = jobPost?.int_job_type?.reduce(
        (accum, item) => accum + item.count,
        0
      );
    }
    setTotalJobs(itotal + jtotal);
  }, [
    JPloading,
    JobPostStatics?.code,
    jobPost,
    jobPost?.ext_job_type,
    jobPost?.int_job_type,
  ]);

  //job post Response External

  const jobPostRes = useSelector((state: any) => state.JobResponseStatistics);
  const { JobPostResponse, JRloading } = jobPostRes;

  useEffect(() => {
    const Year = new Date().getFullYear();
    const mon = new Date().getMonth();
    const startMonth = Math.floor(
      new Date(`${Year}-${mon + 1}-1`).getTime() / 1000
    );
    const tillMonth = Math.floor(new Date().getTime() / 1000);

    const modal = {
      from: startMonth,
      till: tillMonth,
      job_type: "EXTERNAL_JOB",
      type: "Month",
    };
    const modal2 = {
      from: startMonth,
      till: tillMonth,
      job_type: "INTERNAL_JOB",
      type: "Month",
    };
    dispatch(getJobPostResponse(modal));
    dispatch(getJobResponsePost(modal2));
  }, []);

  useEffect(() => {
    if (!JRloading && JobPostResponse?.code === 200) {
      setJR(JobPostResponse?.data);
    }
    if (
      !JRloading &&
      JobPostResponse?.code === 200 &&
      jobPostR &&
      jobPostR?.external
    ) {
      let data1 = [...jobPostR?.external];
      const data = data1?.sort(function (a, b) {
        return parseInt(a.job_date) - parseInt(b.job_date);
      });
      if (data?.length > 0) {
        if (dateFilter?.toLowerCase() !== "year") {
          const newData = data?.map((c: any) => {
            const date = new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              c?.job_date
            );
            return moment(date).format("Do MMM YY");
          });
          setExtResVal(newData);
          setExtResKeys(data?.map((c) => c?.count));
        } else {
          setExtResVal(
            data?.map((c: any) => {
              return new Date(new Date().getFullYear(), c?.job_date - 1)
                .toLocaleString("en-US", { month: "long" })
                .toUpperCase();
            })
          );
          setExtResKeys(data?.map((c) => c?.count));
        }
      } else {
        setExtResVal([]);
        setExtResKeys([]);
      }
    }
  }, [
    JRloading,
    JobPostResponse?.code,
    JobPostResponse?.data?.external,
    jobPostR,
  ]);

  // end external

  const getJobResponse = useSelector((state: any) => state.getJobResponsePost);
  const { JobResPost, jobloading } = getJobResponse;

  useEffect(() => {
    if (!jobloading && JobResPost?.data?.code === 200) {
      setSecondJR(JobResPost?.data);
    }
    if (
      !jobloading &&
      JobResPost?.code === 200 &&
      JobResPost?.data?.internal?.length > 0
    ) {
      let data2 = [...JobResPost?.data?.internal];
      const data = data2?.sort(function (a, b) {
        return parseInt(a.job_date) - parseInt(b.job_date);
      });

      if (data?.length > 0) {
        if (date2Filter?.toLowerCase() !== "year") {
          const newData = data?.map((c: any) => {
            const date = new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              c?.job_date
            );
            return moment(date).format("Do MMM YY");
          });
          setIntResVal(newData);
          setIntReskeys(data?.map((c) => c?.count));
        } else {
          setIntResVal(
            data?.map((c: any) => {
              return new Date(new Date().getFullYear(), c?.job_date - 1)
                .toLocaleString("en-US", { month: "long" })
                .toUpperCase();
            })
          );
          setIntReskeys(data?.map((c) => c?.count));
        }
      } else {
        setIntResVal([]);
        setIntReskeys([]);
      }
    }
  }, [jobloading, JobResPost?.data?.code]);
  const custmStyles = {
    option: (styles, state) => ({
      ...styles,
      cursor: "pointer",
    }),
    menu: (styles, state) => ({
      ...styles,
      overflowX: "hidden",
      zIndex: 1099,
    }),
  };
  useEffect(() => {}, [custmStyles]);
  const changeDropExternal = (option) => {
    const Year = new Date().getFullYear();
    const mon = new Date().getMonth();
    const startMonth = Math.floor(
      new Date(`${Year}-${mon + 1}-1`).getTime() / 1000
    );
    const StartYear = Math.floor(new Date(`${Year}-1-1`).getTime() / 1000);
    const tillMonth = Math.floor(new Date().getTime() / 1000);
    const tillYear = Math.floor(new Date().getTime() / 1000);
    setDateFilter(option);

    const jobres = {
      from: option === "Month" ? startMonth : StartYear,
      till: option === "Month" ? tillMonth : tillYear,
      job_type: "EXTERNAL_JOB",
      type: option,
    };
    dispatch(getJobPostResponse(jobres));
  };

  const changeDropInternal = (option) => {
    const Year = new Date().getFullYear();
    const mon = new Date().getMonth();
    const startMonth = Math.floor(
      new Date(`${Year}-${mon + 1}-1`).getTime() / 1000
    );
    const StartYear = Math.floor(new Date(`${Year}-1-1`).getTime() / 1000);
    const tillMonth = Math.floor(new Date().getTime() / 1000);
    const tillYear = Math.floor(new Date().getTime() / 1000);
    setDate2Filter(option);

    const jobPostRes = {
      from: option === "Month" ? startMonth : StartYear,
      till: option === "Month" ? tillMonth : tillYear,
      job_type: "INTERNAL_JOB",
      type: option,
    };
    dispatch(getJobResponsePost(jobPostRes));
  };

  //End job post Response External

  const [bindEmpData, setBindEmpData] = useState({
    monthYearInternal: "",
    monthYearExternal: "",
  });

  const SerachSchema = Yup.object().shape({
    monthYear: Yup.string()
      .nullable()
      .notRequired()
      .trim("Empty space not allowed"),
  });

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: bindEmpData,
    onSubmit: (values: any) => {
      filtermethod();
    },
    validationSchema: SerachSchema,
    enableReinitialize: true,
  });

  const filtermethod = () => {};

  const externalOptions = {
    chart: {
      id: "bar-chart",
    },
    xaxis: {
      categories: !JRloading && ExtResval,
    },
    fill: {
      colors: ["#918ef4"],
    },

    plotOptions: {
      bar: {
        borderRadius: 2,
        dataLabels: {
          position: "center", // top, center, bottom
        },
      },
    },
  };

  const externalSeries = [
    {
      name: "Count",
      data: ExtResKeys,
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "Arial, sans-serif",
          cssClass: "x-axis-label",
          lineHeight: "16px",
          verticalAlign: "middle", // Set the vertical alignment to middle
        },
      },
    },
  ];

  //End External Bar graph

  //Internal Bar graph
  const internalOptions = {
    chart: {
      id: "bar-chart2",
    },
    xaxis: {
      categories: !jobloading && IntResVal,
    },
    yaxis: {
      labels: {
        formatter: function (value: any) {
          return value.toFixed(0);
        },
      },
    },
    fill: {
      colors: ["#f08700"],
    },

    plotOptions: {
      bar: {
        borderRadius: 2,
        dataLabels: {
          position: "center", // top, center, bottom
        },
      },
    },
  };

  const internalSeries = [
    {
      name: "Count",
      data: IntReskeys,
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "Arial, sans-serif",
          cssClass: "x-axis-label",
          lineHeight: "16px",
          verticalAlign: "middle", // Set the vertical alignment to middle
        },
      },
    },
  ];

  //end Internal Bar graph

  //Internal Pie Chart

  const SimpleDountchart = {
    series: Internalkeys,
    options: {
      dataLabels: {
        enabled: false,
      },
      labels: InternalVal,
      colors: ["#32908f", "#63c7b2"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  };

  //End Internal Pie Chart

  // External Pie

  const fulldonutchart = {
    series: ExternalKeys,
    options: {
      dataLabels: {
        enabled: false,
      },
      labels: ExternalJobval,
      colors: ["#00a7e1", "#e57a44"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              show: false,
            },
          },
        },
      ],
    },
  };

  // End External Pie

  // Job status shortlist rejected

  const roundDonutchart = {
    series: [IntShortList + ExtShortList, IntRejected + Extrejected],
    options: {
      dataLabels: {
        enabled: false,
      },
      labels: ["SHORTLIST", "REJECT"],
      colors: ["#8fcb9b", "#ffbd00"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              show: false,
            },
          },
        },
      ],
    },
    noData: {
      text: "No Data",
      align: "center",
      verticalAlign: "middle",
      offsetX: 0,
      offsetY: 0,
      style: {
        color: undefined,
        fontSize: "14px",
        fontFamily: undefined,
      },
    },
  };

  const actionOptions: any = [
    { value: "Month", label: "Month" },
    { value: "Year", label: "Year" },
  ];
  const actionOptionsinternal: any = [
    { value: "Month", label: "Month" },
    { value: "Year", label: "Year" },
  ];
  const statusArray = ["Month", "Year"];

  useEffect(() => {}, [bindAppProfile]);

  useEffect(() => {}, [bindAppProfile]);
  //End  Job status shortlist rejected

  useEffect(() => {
    if (!JPloading && JobPostStatics?.code === 200 && jobPost) {
    }
  }, [ExternalKeys, Internalkeys, JPloading, JobPostStatics?.code, jobPost]);

  return (
    <>
      <div className="job-bx browse-job clearfix">
        <div className="job-categories_d dashboard content-inner-2 bg-white">
          <div className="m-b30 job-bx dashSty">
            <div className="">
              <div className="row">
                <div className="col-lg-3 col-md-12 col-sm-12">
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
                          className="fa fa-id-card"
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
                          {jobPost?.user_count ? jobPost?.user_count : "0"}
                        </div>
                        <div className="iDash">Recruiters</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-12 col-sm-12">
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
                          className="fa fa-line-chart"
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
                          {TotalJobsStatics ? TotalJobsStatics : "0"}
                        </div>
                        <div className="iDash1">Total Jobs</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-12 col-sm-12">
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
                          className="fa fa-check-square-o"
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
                          {IntShortList + ExtShortList
                            ? IntShortList + ExtShortList
                            : "0"}
                        </div>
                        <div className="iDash2">Shortlisted</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-12 col-sm-12">
                  <div className="smCard dash4">
                    <div
                      className="icon-content smcon"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      {" "}
                      <div>
                        <i
                          className="fa fa-user-times"
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
                          {" "}
                          {IntRejected + Extrejected
                            ? IntRejected + Extrejected
                            : "0"}
                        </div>
                        <div className="iDash3">Rejected</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="row">
              <div className="col-lg-4 col-md-12 col-sm-12">
                <div className="m-b30 job-bx dashSty">
                  <div className="" style={{ cursor: "pointer" }}>
                    <div className="card2dash">External Jobs</div>
                    <div style={{ height: "170px" }}>
                      {ExternalKeys?.length ? (
                        <Chart
                          options={fulldonutchart.options}
                          series={fulldonutchart.series}
                          type="donut"
                          width="350"
                          height="350"
                        />
                      ) : (
                        <div>
                          <Link to={"#"}>
                            <img
                              style={{
                                height: "100%",
                                width: "65%",
                                marginTop: "-21px",
                                marginLeft: "58px",
                              }}
                              alt="Profile_Image"
                              src={require("../../assets/images/No data.png")}
                            />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-12 col-sm-12">
                <div className="m-b30 job-bx dashSty">
                  <div className="" style={{ cursor: "pointer" }}>
                    <div className="card2dash">Internal Jobs</div>
                    <div className="donut" style={{ height: "170px" }}>
                      {Internalkeys?.length ? (
                        <Chart
                          options={SimpleDountchart.options}
                          series={SimpleDountchart.series}
                          type="pie"
                          width="350"
                        />
                      ) : (
                        <div>
                          <Link to={"#"}>
                            <img
                              style={{
                                height: "100%",
                                width: "65%",
                                marginTop: "-21px",
                                marginLeft: "58px",
                              }}
                              alt="Profile_Image"
                              src={require("../../assets/images/No data.png")}
                            />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-12 col-sm-12">
                <div className="m-b30 job-bx dashSty">
                  <div className="" style={{ cursor: "pointer" }}>
                    <div className="card2dash">Jobs Status</div>
                    <div className="donut" style={{ height: "170px" }}>
                      {jobPost &&
                      jobPost?.ext_app_status &&
                      (Object.keys(jobPost?.ext_app_status)?.length ||
                        Object.keys(jobPost?.int_app_status)?.length) ? (
                        <Chart
                          options={roundDonutchart.options}
                          series={roundDonutchart.series}
                          type="donut"
                          width="330"
                        />
                      ) : (
                        <div>
                          <Link to={"#"}>
                            <img
                              style={{
                                height: "100%",
                                width: "65%",
                                marginTop: "-21px",
                                marginLeft: "58px",
                              }}
                              alt="Profile_Image"
                              src={require("../../assets/images/No data.png")}
                            />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="row">
              <div className="col-lg-6 col-md-12 col-sm-12">
                <div className="m-b30 job-bx dashSty" style={{ height: "86%" }}>
                  <div className="" style={{ cursor: "pointer" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className="card2dash">External Jobs Statistics</div>
                      <div
                        style={{
                          width: "21%",
                          marginTop: "-8px",
                          marginBottom: "26px",
                        }}
                      >
                        <Select
                          className="dropstyle mt-2 mb-2 custmclasswidth"
                          options={actionOptions}
                          name="monthYearExternal"
                          value={status}
                          isClearable={false}
                          styles={custmStyles}
                          //  style={{
                          //   width: "100%"}}
                          defaultValue={{
                            label: "Month",
                            value: "Month",
                          }}
                          onChange={(option: any) => {
                            setStatus(option);
                            changeDropExternal(option.label);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    {ExtResval?.length ? (
                      <div style={{ overflowY: "clip", overflowX: "auto" }}>
                        <Chart
                          options={externalOptions}
                          series={externalSeries}
                          type="bar"
                          height="200"
                          width={
                            ExtResval?.length <= 6
                              ? "575"
                              : ExtResval?.length <= 10
                              ? "800"
                              : ExtResval?.length >= 20
                              ? "3000"
                              : ""
                          }
                        />
                      </div>
                    ) : (
                      // <div className="nodataDash">
                      //   No External Jobs got registered
                      // </div>

                      <div>
                        <Link to={"#"}>
                          <img
                            style={{
                              height: "100%",
                              width: "50%",
                              marginTop: "-21px",
                              marginLeft: "22%",
                            }}
                            alt="Profile_Image"
                            src={require("../../assets/images/No data.png")}
                          />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-lg-6 col-md-12 col-sm-12">
                <div className="m-b30 job-bx dashSty" style={{ height: "86%" }}>
                  <div className="" style={{ cursor: "pointer" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className="card2dash">Internal Jobs Statistics</div>
                      <div
                        style={{
                          width: "21%",
                          marginTop: "-8px",
                          marginBottom: "26px",
                        }}
                      >
                        <Select
                          options={actionOptions}
                          isClearable={false}
                          className="dropstyle mt-2 mb-2"
                          styles={custmStyles}
                          name="monthYearInternal"
                          value={Dropstatus}
                          defaultValue={{
                            label: "Month",
                            value: "Month",
                          }}
                          onChange={(option: any) => {
                            setDropStatus(option);
                            changeDropInternal(option.label);
                          }}
                        />
                      </div>
                    </div>
                    {IntResVal?.length ? (
                      <div style={{ overflowY: "clip", overflowX: "auto" }}>
                        <Chart
                          options={internalOptions}
                          series={internalSeries}
                          type="bar"
                          height="200"
                          width={
                            IntResVal?.length <= 6
                              ? "575"
                              : IntResVal?.length <= 10
                              ? "800"
                              : IntResVal?.length >= 20
                              ? "3000"
                              : ""
                          }
                        />
                      </div>
                    ) : (
                      // <div className="nodataDash">
                      //   No Internal Jobs got registered
                      // </div>
                      <div>
                        <Link to={"#"}>
                          <img
                            style={{
                              height: "100%",
                              width: "50%",
                              marginTop: "-21px",
                              marginLeft: "22%",
                            }}
                            alt="Profile_Image"
                            src={require("../../assets/images/No data.png")}
                          />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="m-b30 job-bx dashSty"> */}
          <div className=" bg-white">
            <div className="content-block">
              <PollSystem></PollSystem>
            </div>
          </div>
          {/* </div> */}
        </div>
      </div>
    </>
  );
};

export default EmployerDashboard;
