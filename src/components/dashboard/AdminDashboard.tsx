import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Chart from "react-apexcharts";
import "../../assets/customCss/AdminDashboard.css";
import {
  fetchJobPostTrend,
  fetchRegTrend,
  fetchSupportTktTrend,
  fetchUserStaticts,
  getAssessmentTred,
} from "../../redux/features/dashboard/AdminDashboardSlice";
import DateTimeRangePicker from "react-datetime-range-picker";
import CountUp from "react-countup";
import moment from "moment";
import PollSystem from "../admin/polls/PollPreview";
// import { DateRangePicker } from "react-date-range";
// import "react-date-range/dist/styles.css";
// import "react-date-range/dist/theme/default.css";

// date range picker new
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import "react-calendar/dist/Calendar.css";
import { Link } from "react-router-dom";
import { totalDownloadCsvFile } from "../../redux/features/dashboard/AdminDownloadCSVSlice";
import { BsCloudDownload } from "react-icons/bs";
import { environment } from "../../environments/environment";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [assesmentInfo, setAssesmentInfo] = useState<any>({});
  const [assesmentval, setAssessmentVal] = useState<any>("");
  const [assesmentID, setAssessmentID] = useState<any>([]);
  const [assesmentKeys, setAssessmentKeys] = useState<any>("");

  // Assessment
  const AssessmentTred = useSelector((state: any) => state.assessmentTread);
  const { assessmentTredRes, assessloading } = AssessmentTred;
  const [graphTicketStDate, setGraphTicketStDate] = useState<any>("");
  const [graphTicketEndDate, setGraphTicketEndData] = useState<any>("");
  const [graphAssStDate, setGraphAssStDate] = useState<any>("");
  const [graphAssEndDate, setGraphAssEndDate] = useState<any>("");
  const [graphJobPostStDate, setGraphJobPostStDate] = useState<any>("");
  const [graphJobPostEndDate, setGraphJobPostEndDate] = useState<any>("");
  const { downCsvFile, downCsvFileLoading } = useSelector(
    (state: any) => state.TotalDownloadCsvFileData
  );

  // useEffect(() => {}, [downCsvFile]);
  useEffect(() => {
    const range_load = {
      start: new Date(
        new Date().getFullYear(),
        new Date().getMonth() - 1,
        new Date().getDate()
      ),
      end: new Date(),
    };
    const timestamp1: number = Math.floor(range_load.start.getTime() / 1000);
    const timestamp2: number = Math.floor(range_load.end.getTime() / 1000);
    setGraphAssStDate(timestamp1);
    setGraphAssEndDate(timestamp2);

    const Assessment = {
      from: timestamp1,
      till: timestamp2,
    };

    dispatch(getAssessmentTred(Assessment));

    // if (assesData) {
    //   const details = {
    //     startDate: timestamp1,
    //     endDate: timestamp2,
    //     type: "ASSESMENTS",
    //   };
    //   dispatch(totalDownloadCsvFile(details));
    //   setAssesData(false);
    // }
  }, [dispatch]);

  useEffect(() => {
    if (
      !assessloading &&
      assessmentTredRes?.data &&
      assessmentTredRes?.code === 200
    ) {
      setAssesmentInfo(assessmentTredRes?.data);
    }
  }, [assessloading, assessmentTredRes?.data, assesmentInfo]);

  useEffect(() => {
    if (
      !assessloading &&
      assessmentTredRes?.code === 200 &&
      assessmentTredRes
    ) {
      setAssessmentVal(
        assesmentInfo?.asmt_data?.reduce((acc, val) => [...acc, val.name], [])
      );
      setAssessmentKeys(
        assesmentInfo?.asmt_data?.reduce((acc, val) => [...acc, val.count], [])
      );
      setAssessmentID(
        assesmentInfo?.asmt_data?.reduce((acc, val) => [...acc, val.id], [])
      );
    }
  }, [assessloading, assessmentTredRes?.code, assesmentInfo]);

  //End assessment

  //UserStatistics counts
  const [disRole, setDisRole] = useState<string>();
  const [roleName, setRoleName] = useState<string>("of total Jobseeker(s)");

  const [selectedRangeFrom_reg, setSelectedRangeFrom_reg] = useState<number>();
  const [selectedRangeTill_reg, setSelectedRangeTill_reg] = useState<number>();

  const userStatsRes = useSelector((state: any) => state.UserStatistics);
  const { adUserStatictsRes, usloading } = userStatsRes;

  //Regi counts

  const regRes = useSelector((state: any) => state.RegTrend);
  const { adRegistrationCountsRes, jsloading } = regRes;
  //JobPost counts

  const jobpostSummaryRes = useSelector((state: any) => state.JobPostTrend);
  const { adjobpostRes, jploading } = jobpostSummaryRes;

  //SupportTkt counts

  const supportTicketRes = useSelector((state: any) => state.SupportTktTrend);
  const { adSupportTktRes, jstloading } = supportTicketRes;
  useEffect(() => {
    const range_load = {
      start: new Date(
        new Date().getFullYear(),
        new Date().getMonth() - 1,
        new Date().getDate()
      ),
      end: new Date(),
    };
    const timestamp1: number = Math.floor(range_load.start.getTime() / 1000);
    const timestamp2: number = Math.floor(range_load.end.getTime() / 1000);
    setGraphTicketStDate(timestamp1);
    setGraphTicketEndData(timestamp2);
    setGraphJobPostStDate(timestamp1);
    setGraphJobPostEndDate(timestamp2);

    const regOptions = {
      role: "jobseeker",
      from: timestamp1,
      till: timestamp2,
    };
    dispatch(fetchRegTrend(regOptions));

    const options_load = {
      from: timestamp1,
      till: timestamp2,
    };

    dispatch(fetchJobPostTrend(options_load));
    dispatch(fetchSupportTktTrend(options_load));

    dispatch(fetchUserStaticts());

    // if (ticketData) {
    //   const detail = {
    //     startDate: timestamp1,
    //     endDate: timestamp2,
    //     type: "TICKETS",
    //   };
    //   dispatch(totalDownloadCsvFile(detail));
    //   setTicketData(false);
    // }

    // if (jobPostData) {
    //   const details = {
    //     startDate: timestamp1,
    //     endDate: timestamp2,
    //     type: "JOBS",
    //   };
    //   dispatch(totalDownloadCsvFile(details));
    //   setJobPostData(false);
    // }
  }, []);

  function fn_refreshData() {
    dispatch(fetchUserStaticts());
  }
  let series = [
    {
      name: "",
      data: [0],
      labels: {},
    },
  ];
  let baroptions = {};

  let seriesJP = [
    {
      name: "",
      data: [0],
      labels: {},
    },
  ];
  let optionsJP = {};

  let seriesST = [
    {
      name: "",
      data: [0],
      labels: {},
    },
  ];
  let optionsST = {};
  if (adRegistrationCountsRes?.data) {
    const dates = adRegistrationCountsRes?.data?.map((item) => item.date);
    const formattedDates = dates.map((date) => {
      return moment(date).format(" Do MMM YY");
    });
    formattedDates.sort((a, b) => {
      const date2: any = moment(b, "Do MMM YY").toDate();
      const date1: any = moment(a, "Do MMM YY").toDate();
      return date1.getTime() - date2.getTime();
    });
    const countByDay = {};
    adRegistrationCountsRes?.data?.forEach((item) => {
      const { date, count } = item;
      countByDay[date] = countByDay[date] ? countByDay[date] + count : count;
    });

    const countData = formattedDates.map((formattedDate) => {
      const date = moment(formattedDate, " Do MMM YY").format("YYYY-MM-DD");
      const count = countByDay[date] || 0;
      return count;
    });

    baroptions = {
      chart: {
        id: "bar-chart",
      },
      xaxis: {
        categories: formattedDates,
        labels: {
          formatter: function (value) {
            return value;
          },
          rotate: -45,
        },
      },

      fill: {
        colors: ["#FEB019"],
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

    series = [
      {
        name: "Count",
        data: countData,
        labels: {
          style: {
            fontSize: "12px",
            fontFamily: "Arial, sans-serif",
            cssClass: "x-axis-label",
            lineHeight: "16px",
            verticalAlign: "middle", // Set the vertical alignment to middle,
          },
        },
      },
    ];
  }

  if (adjobpostRes.data) {
    const dates = adjobpostRes?.data?.results?.map((item) => item.date);
    const formattedDates = dates.map((date) => {
      return moment(date).format(" Do MMM YY");
    });
    formattedDates.sort((a, b) => {
      const date2: any = moment(b, "Do MMM YY").toDate();
      const date1: any = moment(a, "Do MMM YY").toDate();
      return date1.getTime() - date2.getTime();
    });
    const countByDay = {};
    adjobpostRes?.data?.results?.forEach((item) => {
      const { date, count } = item;
      countByDay[date] = countByDay[date] ? countByDay[date] + count : count;
    });

    const countData = formattedDates.map((formattedDate) => {
      const date = moment(formattedDate, " Do MMM YY").format("YYYY-MM-DD");
      const count = countByDay[date] || 0;
      return count;
    });
    optionsJP = {
      chart: {
        id: "bar-chart",
      },
      xaxis: {
        categories: formattedDates,
        labels: {
          rotate: -45,
        },
      },

      fill: {
        colors: ["#17a2b8"],
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

    seriesJP = [
      {
        name: "Count",
        data: countData,
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
  }

  if (adSupportTktRes.data) {
    const dates = adSupportTktRes?.data?.results?.map((item) => item.date);
    const counts = adSupportTktRes?.data?.results?.map((item) => item.count);
    const formattedDates = dates.map((date) => {
      return moment(date).format(" Do MMM YY");
    });
    formattedDates.sort((a, b) => {
      const date2: any = moment(b, "Do MMM YY").toDate();
      const date1: any = moment(a, "Do MMM YY").toDate();
      return date1.getTime() - date2.getTime();
    });
    const countByDay = {};
    adSupportTktRes?.data?.results?.forEach((item) => {
      const { date, count } = item;
      countByDay[date] = countByDay[date] ? countByDay[date] + count : count;
    });

    const countData = formattedDates.map((formattedDate) => {
      const date = moment(formattedDate, " Do MMM YY").format("YYYY-MM-DD");
      const count = countByDay[date] || 0;
      return count;
    });
    optionsST = {
      chart: {
        id: "bar-chart",
      },
      xaxis: {
        categories: formattedDates,
        labels: {
          rotate: -45,
        },
      },

      fill: {
        colors: ["#8a7bef"],
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

    seriesST = [
      {
        name: "Count",
        data: countData,
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
  }

  const toPascalCase = (str) =>
    (str.match(/[a-zA-Z0-9]+/g) || [])
      .map((w) => `${w?.charAt(0).toUpperCase()}${w?.slice(1)}`)
      .join("");

  const fn_getDate = () => {
    if (!selectedRangeFrom_reg || !selectedRangeTill_reg) {
      const start = new Date(
        new Date().getFullYear(),
        new Date().getMonth() - 1,
        new Date().getDate()
      );
      const end = new Date();
      const timestamp1: number = Math.floor(start.getTime() / 1000);
      const timestamp2: number = Math.floor(end.getTime() / 1000);
      setSelectedRangeFrom_reg(timestamp1);
      setSelectedRangeTill_reg(timestamp2);
    }
  };
  const fn_getGraph = (role: string | undefined, timestamp1, timestamp2) => {
    setDisRole(role);
    if (role === "admin") {
      setRoleName("of total Native User(s)");
    } else {
      setRoleName(`of total ${toPascalCase(role)}(s)`);
    }

    if (!selectedRangeFrom_reg) {
      fn_getDate();
    }
    if (timestamp1 && timestamp2) {
      const options = {
        role: role,
        from: timestamp1,
        till: timestamp2,
      };
      dispatch(fetchRegTrend(options));
    }
  };

  const fn_getGraph_JobPost = (graphJobPostStDate, graphJobPostEndDate) => {
    const options = {
      from: graphJobPostStDate,
      till: graphJobPostEndDate,
    };

    dispatch(fetchJobPostTrend(options));
  };
  // useEffect(() => {
  //   fn_getGraph_JobPost(graphJobPostStDate, graphJobPostEndDate);
  //   // const options = {
  //   //   from: graphJobPostStDate,
  //   //   till: graphJobPostEndDate,
  //   // };
  //   // dispatch(fetchJobPostTrend(options));
  // }, [graphJobPostStDate, graphJobPostEndDate]);

  const fn_getGraph_Sup = (graphTicketStDate, graphTicketEndDate) => {
    const options = {
      from: graphTicketStDate,
      till: graphTicketEndDate,
    };

    dispatch(fetchSupportTktTrend(options));
  };

  // if (ticketData) {
  //   const detail = {
  //     startDate: timestamp1,
  //     endDate: timestamp2,
  //     type: "TICKETS",
  //   };
  //   dispatch(totalDownloadCsvFile(detail));
  //   setTicketData(false);
  // }

  // if (jobPostData) {
  //   const details = {
  //     startDate: timestamp1,
  //     endDate: timestamp2,
  //     type: "JOBS",
  //   };
  //   dispatch(totalDownloadCsvFile(details));
  //   setJobPostData(false);
  // }
  const fn_getGraph_Assessment = (graphAssStDate, graphAssEndDate) => {
    const options = {
      from: graphAssStDate,
      till: graphAssEndDate,
    };

    dispatch(getAssessmentTred(options));
  };

  const handleRangeChange = (range) => {
    const _range = range;
    if (_range) {
      const timestamp1: number = Math.floor(_range[0].getTime() / 1000);
      const timestamp2: number = Math.floor(_range[1].getTime() / 1000);
      setGraphJobPostStDate(timestamp1);
      setGraphJobPostEndDate(timestamp2);
    }
  };
  useEffect(() => {
    fn_getGraph_JobPost(graphJobPostStDate, graphJobPostEndDate);
  }, [graphJobPostStDate, graphJobPostEndDate]);

  const handleRangeChange_sup = (range) => {
    const _range = range;
    if (_range) {
      const timestamp1: number = Math.floor(_range[0].getTime() / 1000);
      const timestamp2: number = Math.floor(_range[1].getTime() / 1000);
      setGraphTicketStDate(timestamp1);
      setGraphTicketEndData(timestamp2);
    }
  };

  useEffect(() => {
    fn_getGraph_Sup(graphTicketStDate, graphTicketEndDate);
  }, [graphTicketStDate, graphTicketEndDate]);

  const handleRangeChange_Assessment = (range) => {
    const _range = range;
    if (_range) {
      const timestamp1: number = Math.floor(_range[0].getTime() / 1000);
      const timestamp2: number = Math.floor(_range[1].getTime() / 1000);
      setGraphAssStDate(timestamp1);
      setGraphAssEndDate(timestamp2);
    }
  };

  useEffect(() => {
    fn_getGraph_Assessment(graphAssStDate, graphAssEndDate);
  }, [graphAssStDate, graphAssEndDate]);

  const handleRangeChange_reg = (range) => {
    const _range = range;
    if (_range) {
      const timestamp1: number = Math.floor(_range[0].getTime() / 1000);
      const timestamp2: number = Math.floor(_range[1].getTime() / 1000);
      // setSelectedRangeFrom_reg(timestamp1);
      // setSelectedRangeTill_reg(timestamp2);
      fn_getGraph(!disRole ? "jobseeker" : disRole, timestamp1, timestamp2);
    }
  };

  const [selectedRange_reg, setSelectedRange_reg] = useState<any>([
    new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      new Date().getDate()
    ),
    new Date(),
  ]);
  const [selectedRange_jp, setSelectedRange_jp] = useState<any>([
    new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      new Date().getDate()
    ),
    new Date(),
  ]);

  const [selectedRange_Assessment, setSelectedRange_Assessment] = useState<any>(
    [
      new Date(
        new Date().getFullYear(),
        new Date().getMonth() - 1,
        new Date().getDate()
      ),
      new Date(),
    ]
  );
  const [selectedRange_sup, setSelectedRange_sup] = useState<any>([
    new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      new Date().getDate()
    ),
    new Date(),
  ]);

  const handleSelect_reg = (ranges) => {
    setSelectedRange_reg(ranges);
    handleRangeChange_reg(ranges);
  };
  const handleSelect_jp = (ranges) => {
    setSelectedRange_jp(ranges);
    handleRangeChange(ranges);
  };
  const handleSelect_sup = (ranges) => {
    setSelectedRange_sup(ranges);
    handleRangeChange_sup(ranges);
  };
  const handleSelect_Assessment = (ranges) => {
    setSelectedRange_Assessment(ranges);
    handleRangeChange_Assessment(ranges);
  };

  // date range picker new
  const [value, onChange] = useState<any>([new Date(), new Date()]);

  let assesmentReport = {};
  if (!assessloading && assessmentTredRes?.code === 200 && assessmentTredRes) {
    assesmentReport = {
      chart: {
        id: "bar-chart",
      },
      xaxis: {
        categories: assesmentval,
        labels: {
          // formatter: function (sss) {
          //   return sss.substr(0, 7);
          // },
          formatter: function (value, timestamp, opts) {
            return value.length > 15 ? value.substring(0, 15) + "..." : value;
          },
          rotate: -45,
        },
      },

      fill: {
        colors: ["#17a2b8"],
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
  }

  const AssessmentSeries = [
    {
      name: "Count",
      data: assesmentKeys,
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

  return (
    <>
      <div className="job-bx browse-job clearfix">
        <div className="job-categories_d dashboard content-inner-2 bg-white">
          <div className="m-b30 job-bx dashSty">
            {!usloading && adUserStatictsRes && adUserStatictsRes.data && (
              <div className="row" style={{ cursor: "pointer" }}>
                <div
                  className="col-lg-4 col-md-6 col-sm-12"
                  onClick={() => {
                    fn_getGraph(
                      "jobseeker",
                      selectedRangeFrom_reg,
                      selectedRangeTill_reg
                    );
                  }}
                  title="Click to see total number of Job seekers in graphical representation"
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
                          {adUserStatictsRes?.data?.jobseekers
                            ? adUserStatictsRes?.data?.jobseekers
                            : "0"}
                        </div>
                        <div className="iDash"> JOB SEEKER(s)</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="col-lg-4 col-md-12 col-sm-12"
                  onClick={() => {
                    fn_getGraph(
                      "employer",
                      selectedRangeFrom_reg,
                      selectedRangeTill_reg
                    );
                  }}
                  title="Click to see total number of users in graphical representation"
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
                          {adUserStatictsRes?.data?.employers
                            ? adUserStatictsRes?.data?.employers
                            : "0"}
                        </div>
                        <div className="iDash1"> EMPLOYER(s)</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="col-lg-4 col-md-12 col-sm-12"
                  onClick={() => {
                    fn_getGraph(
                      "admin",
                      selectedRangeFrom_reg,
                      selectedRangeTill_reg
                    );
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
                          {adUserStatictsRes?.data?.app_user
                            ? adUserStatictsRes?.data?.app_user
                            : "0"}
                        </div>
                        <div className="iDash2"> NATIVE USER(s)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="m-b30 job-bx dashSty">
            {!usloading && (
              <div className="row">
                <div className="col-lg-12 col-md-12 col-md-12">
                  <div className="dez-tilte titleFont">
                    <div className="row">
                      <div className="col-lg-9 col-md-6 col-sm-12">
                        Statical Information {roleName}{" "}
                        <span style={{ color: "#b2b2ab9c" }}>
                          {" "}
                          - only three month of past data available
                        </span>
                      </div>
                      <div
                        className="col-lg-3 col-md-6 col-sm-12 datepicktrans"
                        style={{ marginBottom: "16px" }}
                      >
                        <DateRangePicker
                          maxDate={new Date()}
                          minDate={
                            new Date(
                              new Date().getFullYear(),
                              new Date().getMonth() - 3,
                              new Date().getDate()
                            )
                          }
                          value={selectedRange_reg}
                          onChange={handleSelect_reg}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="">
                    {" "}
                    <div style={{ overflowY: "clip", overflowX: "auto" }}>
                      {adRegistrationCountsRes?.data?.length ? (
                        <Chart
                          options={baroptions}
                          series={series}
                          type="bar"
                          height="200"
                          width={
                            adRegistrationCountsRes.data.length < 10
                              ? "1240"
                              : adRegistrationCountsRes.data.length < 20
                              ? "1690"
                              : adRegistrationCountsRes.data.length > 30
                              ? "5990"
                              : "2690"
                          }
                        />
                      ) : (
                        <div>
                          <Link to={"#"}>
                            <img
                              style={{
                                height: "100%",
                                width: "34%",
                                marginTop: "-21px",
                                marginLeft: "34%",
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
            )}
          </div>

          {environment?.HackerEarth && (
            <div className="row">
              <div className="col-lg-9 col-md-12 col-md-12">
                <div className="m-b30 job-bx dashSty">
                  {!usloading && (
                    <div className="dez-tilte titleFont">
                      <div className="row">
                        <div className="col-lg-8 col-md-6 col-sm-12">
                          ASSESSMENT REPORT{" "}
                          <span style={{ color: "#b2b2ab9c" }}>
                            {" "}
                            - only three month of past data available
                          </span>
                        </div>
                        <div
                          className="col-lg-3 col-md-6 col-sm-12 datepicktrans d-flex"
                          style={{ marginBottom: "16px" }}
                        >
                          <DateRangePicker
                            maxDate={new Date()}
                            minDate={
                              new Date(
                                new Date().getFullYear(),
                                new Date().getMonth() - 3,
                                new Date().getDate()
                              )
                            }
                            value={selectedRange_Assessment}
                            onChange={handleSelect_Assessment}
                          />
                          <Link
                            // style={{ marginLeft: "90%" }}
                            className="ml-3"
                            to={""}
                            style={{
                              borderRadius: "0px",
                              backgroundColor: "rgb(14 173 105)",
                            }}
                            title="Download total Users"
                            id="down-icon"
                            download="filename.csv"
                            onClick={() => {
                              const details = {
                                startDate: graphAssStDate,
                                endDate: graphAssEndDate,
                                type: "ASSESMENTS",
                              };
                              dispatch(totalDownloadCsvFile(details));
                            }}
                          >
                            <BsCloudDownload
                              style={{
                                marginBottom: "-3px",
                                color: "white",
                                cursor: "pointer",
                              }}
                            />
                          </Link>
                        </div>
                        <div className="col-lg-12 col-md-12 col-md-12">
                          {" "}
                          <div style={{ overflowY: "clip", overflowX: "auto" }}>
                            {assesmentval?.length ? (
                              <Chart
                                options={assesmentReport}
                                series={AssessmentSeries}
                                type="bar"
                                height="250"
                                width={
                                  assesmentval?.length < 10
                                    ? "905"
                                    : assesmentval?.length < 20
                                    ? "1240"
                                    : assesmentval?.length > 30
                                    ? "2990"
                                    : "1900"
                                }
                              />
                            ) : (
                              <div>
                                <Link to={"#"}>
                                  <img
                                    style={{
                                      height: "100%",
                                      width: "34%",
                                      marginTop: "-21px",
                                      marginLeft: "34%",
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
                  )}
                </div>
              </div>
              <div className="col-lg-3 col-md-12 col-md-12">
                <div className="m-b30 job-bx dashSty" style={{ height: "87%" }}>
                  <div className=" align-items-end  ">
                    <div>
                      <div>
                        <div style={{ marginTop: "10px" }}>
                          <div
                            className="assessSMcard1"
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div>Total Assessment </div>
                            <div>
                              {assesmentInfo?.total_asmt
                                ? assesmentInfo?.total_asmt
                                : "0"}
                            </div>
                          </div>
                          <div
                            className="assessSMcard2"
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div>Active Assessment</div>

                            <div>
                              {assesmentInfo?.active_asmt
                                ? assesmentInfo?.active_asmt
                                : "0"}
                            </div>
                          </div>
                          <div
                            className="assessSMcard3"
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div>Inactive Assessment</div>
                            <div>
                              {assesmentInfo?.inActive_asmt
                                ? assesmentInfo?.inActive_asmt
                                : "0"}
                            </div>
                          </div>
                          <div
                            className="assessSMcard4"
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div>Purchased Assessment</div>
                            <div>
                              {assesmentInfo?.total_asmt_sch
                                ? assesmentInfo?.total_asmt_sch
                                : "0"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="row">
            <div className="col-lg-9 col-md-12 col-md-12">
              <div className="m-b30 job-bx dashSty">
                {!usloading && (
                  <div className="dez-tilte titleFont">
                    <div className="row">
                      <div className="col-lg-8 col-md-6 col-sm-12">
                        TOTAL JOB POSTED{" "}
                        <span style={{ color: "#b2b2ab9c" }}>
                          {" "}
                          - only three month of past data available
                        </span>
                      </div>
                      <div
                        className="col-lg-3 col-md-6 col-sm-12 datepicktrans d-flex"
                        style={{ marginBottom: "16px" }}
                      >
                        <DateRangePicker
                          maxDate={new Date()}
                          minDate={
                            new Date(
                              new Date().getFullYear(),
                              new Date().getMonth() - 3,
                              new Date().getDate()
                            )
                          }
                          value={selectedRange_jp}
                          onChange={handleSelect_jp}
                        />
                        <Link
                          // style={{ marginLeft: "90%" }}
                          className="ml-3"
                          to={""}
                          style={{
                            borderRadius: "0px",
                            backgroundColor: "rgb(14 173 105)",
                          }}
                          title="Download total Users"
                          id="down-icon"
                          download="filename.csv"
                          onClick={() => {
                            const details = {
                              startDate: graphJobPostStDate,
                              endDate: graphJobPostEndDate,
                              type: "JOBS",
                            };
                            dispatch(totalDownloadCsvFile(details));
                          }}
                        >
                          <BsCloudDownload
                            style={{
                              marginBottom: "-3px",
                              color: "white",
                              cursor: "pointer",
                            }}
                          />
                        </Link>
                      </div>
                      <div className="col-lg-12 col-md-12 col-md-12">
                        {" "}
                        <div style={{ overflowY: "clip", overflowX: "auto" }}>
                          {adjobpostRes?.data?.results?.length ? (
                            <Chart
                              options={optionsJP}
                              series={seriesJP}
                              type="bar"
                              height="250"
                              width={
                                adjobpostRes?.data?.results?.length < 10
                                  ? "905"
                                  : adjobpostRes?.data?.results?.length < 20
                                  ? "1240"
                                  : adjobpostRes?.data?.results?.length > 30
                                  ? "2990"
                                  : "1900"
                              }
                            />
                          ) : (
                            <div>
                              <Link to={"#"}>
                                <img
                                  style={{
                                    height: "100%",
                                    width: "34%",
                                    marginTop: "-21px",
                                    marginLeft: "34%",
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
                )}
              </div>
            </div>
            <div className="col-lg-3 col-md-12 col-md-12">
              <div
                className="m-b30 job-bx dashSty"
                style={{ height: "87%", backgroundColor: "#51d8ed" }}
              >
                <div className=" align-items-end  ">
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ color: "white", marginTop: "10px" }}>
                        TOTAL JOB POST
                      </div>
                      <div style={{ color: "#3da1b0", fontSize: "40px" }}>
                        <i className="fa fa-newspaper-o" aria-hidden="true"></i>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "45px",
                        textAlign: "center",
                        marginTop: "53px",
                        color: "white",
                      }}
                    >
                      {adjobpostRes?.data?.totalCount}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-9 col-md-12 col-md-12">
              <div className="m-b30 job-bx dashSty">
                {!usloading && (
                  <div className="dez-tilte titleFont">
                    <div className="row">
                      <div className="col-lg-8 col-md-6 col-sm-12 ">
                        TOTAL TICKET RAISED{" "}
                        <span style={{ color: "#b2b2ab9c" }}>
                          {" "}
                          - only three month of past data available
                        </span>
                      </div>
                      <div
                        className="col-lg-3 col-md-6 col-sm-12 datepicktrans d-flex"
                        style={{ marginBottom: "16px" }}
                      >
                        <DateRangePicker
                          maxDate={new Date()}
                          minDate={
                            new Date(
                              new Date().getFullYear(),
                              new Date().getMonth() - 3,
                              new Date().getDate()
                            )
                          }
                          value={selectedRange_sup}
                          onChange={handleSelect_sup}
                        />
                        <Link
                          // style={{ marginLeft: "90%" }}
                          className="ml-3"
                          to={""}
                          style={{
                            borderRadius: "0px",
                            backgroundColor: "rgb(14 173 105)",
                          }}
                          id="down-icon"
                          title="Download total Users"
                          download="filename.csv"
                          onClick={() => {
                            const detail = {
                              startDate: graphTicketStDate,
                              endDate: graphTicketEndDate,
                              type: "TICKET",
                            };
                            dispatch(totalDownloadCsvFile(detail));
                            // setTicketData(false);
                          }}
                        >
                          <BsCloudDownload
                            style={{
                              marginBottom: "-3px",
                              color: "white",
                              cursor: "pointer",
                            }}
                          />
                        </Link>
                      </div>
                      <div className="col-lg-12 col-md-12 col-md-12">
                        {" "}
                        <div style={{ overflowY: "clip", overflowX: "auto" }}>
                          {adSupportTktRes?.data?.results?.length ? (
                            <Chart
                              options={optionsST}
                              series={seriesST}
                              type="bar"
                              height="250"
                              width={
                                adSupportTktRes?.data?.results?.length < 10
                                  ? "905"
                                  : adSupportTktRes?.data?.results?.length < 20
                                  ? "1240"
                                  : adSupportTktRes?.data?.results?.length > 30
                                  ? "2990"
                                  : "1900"
                              }
                            />
                          ) : (
                            <div>
                              <Link to={"#"}>
                                <img
                                  style={{
                                    height: "100%",
                                    width: "34%",
                                    marginTop: "-21px",
                                    marginLeft: "34%",
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
                )}
              </div>
            </div>
            <div className="col-lg-3 col-md-12 col-md-12">
              <div
                className="m-b30 job-bx dashSty"
                style={{ height: "87%", backgroundColor: "#a99df5" }}
              >
                <div className=" align-items-end  ">
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ color: "white", marginTop: "10px" }}>
                        SUPPORT TICKETS{" "}
                      </div>
                      <div style={{ color: "#857bc4", fontSize: "40px" }}>
                        {" "}
                        <i className="fa fa-ticket" aria-hidden="true"></i>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "45px",
                        textAlign: "center",
                        marginTop: "53px",
                        color: "white",
                      }}
                    >
                      {adSupportTktRes?.data?.totalCount
                        ? adSupportTktRes?.data?.totalCount
                        : "0"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
