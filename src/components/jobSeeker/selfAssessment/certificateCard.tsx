import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ReportJobseeker,
  resetUpdatereportData,
  updateReportData,
} from "../../../redux/features/jobSeeker/JsAssessmentSlice";
import {
  GetDisplayDateFromTimeStamp,
  GetTimeFromTimeStamp,
} from "../../../common/common";
import { Link, useParams } from "react-router-dom";
import { SiHackerearth } from "react-icons/si";
import { Switch, ToggleButton, ToggleButtonGroup } from "@mui/material";
import Swal from "sweetalert2";
import { UseToastAlert } from "../../../hooks/useToastAlert";
var NodataFound = require("../../../assets/images/background/No-record.png");

const CertificateCard = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const cerificate = useSelector((state: any) => state.ReportDataJs);
  const { ReportData, ReportLoad } = cerificate;

  const [selectedOption, setSelectedOption] = useState("");
  const [visibilityState, setVisibilityState] = useState<any>(null);
  const [selectId, setSelectId] = useState<any>();

  const [reporttest, setReport] = useState<any>("");

  useEffect(() => {
    dispatch(ReportJobseeker(id));
  }, [dispatch]);

  useEffect(() => {
    if (!ReportLoad && ReportData?.data && ReportData?.code === 200) {
      setReport(ReportData?.data);
    }
  }, [ReportData, ReportData?.data, ReportLoad]);

  const { reportRes, reportloading } = useSelector(
    (state: any) => state.UpdateReportDetails
  );
  const snackAlert = UseToastAlert();

  useEffect(() => {
    if (reportRes && reportRes?.code && reportRes?.code === 200) {
      snackAlert("success", reportRes?.message);
      dispatch(ReportJobseeker(id));
      dispatch(resetUpdatereportData());
    } else if (reportRes?.response?.data?.code === 400) {
      snackAlert("warning", "Bad Request");
      dispatch(resetUpdatereportData());
    } else if (reportRes && reportRes?.code && reportRes?.code !== 200) {
      snackAlert("warning", reportRes?.message);
      dispatch(resetUpdatereportData());
    }
  }, [reportRes, reportRes?.code]);

  const handleOptionChange = (item: any, visibility) => {
    Swal.fire({
      title: "Are you sure?",

      text: `You want to ${
        item?.visible === true
          ? "UnPublish Your Score"
          : "Publish  Your Score, Once Published it will be visible to Employer"
      }   `,

      showCancelButton: true,

      confirmButtonColor: "green",

      cancelButtonColor: "red",

      confirmButtonText: "Yes",

      cancelButtonText: "No",
    }).then((result) => {
      if (result?.isConfirmed) {
        setSelectId(item?.report_id);
        setVisibilityState(false);
        dispatch(
          updateReportData({
            reportId: item?.report_id,
            visibleType: visibility,
          })
        );
        setSelectedOption("");
      }
    });
  };

  return (
    <>
      <div>
        <React.Fragment key={"right"}>
          <div className="page-content">
            <div className="content-block">
              <div className="section-full browse-job content-inner-2">
                <div className="container">
                  <div className="d-flex justify-content-between job-bx bg-white m-t10 heading-score">
                    <div className="">
                      <h5
                        className="m-t10"
                        style={{ color: "#7777d3", fontSize: "16px" }}
                      >
                        {" "}
                        SCORE CARD{" "}
                      </h5>
                    </div>
                    <div>
                      {" "}
                      <Link
                        to={"/js/selfAssessment"}
                        className="site-button right-arrow button-sm float-right backlink"
                      >
                        Go Back
                      </Link>{" "}
                    </div>
                  </div>

                  <div className="row">
                    {reporttest?.reports?.length &&
                      reporttest?.reports?.map((item: any) => {
                        return (
                          <>
                            <div className="float-right"></div>
                            {reporttest?.test_info?.length &&
                              reporttest?.test_info?.map(
                                (inneritem: any, index: any) => {
                                  return (
                                    <div
                                      key={item?.report_id}
                                      className="col-lg-8 col-md-10 "
                                      style={{
                                        marginLeft: "16%",
                                      }}
                                    >
                                      <div
                                        className="job-bx bg-white m-b30   assessment_box"
                                        id="headingjas"
                                        style={{
                                          marginTop: "31px",
                                          borderRadius: "10px",
                                        }}
                                      >
                                        <div className="d-flex justify-content-between">
                                          <div className="gon">
                                            {`Generated On - ${GetDisplayDateFromTimeStamp(
                                              item?.report?.end_date
                                            )?.replace(
                                              ",",
                                              ""
                                            )} ${GetTimeFromTimeStamp(
                                              item?.report?.end_date
                                            )}`}
                                          </div>
                                          <div className="gon">
                                            Provided By: HackerEarth{" "}
                                            <span className="text-dark">
                                              <SiHackerearth />
                                            </span>
                                          </div>
                                          <Switch
                                            title="Edit Report"
                                            key={item?.report_id}
                                            value={item?.report_id}
                                            checked={item?.visible}
                                            defaultChecked={item?.visible}
                                            onChange={(e) => {
                                              handleOptionChange(
                                                item,
                                                e.target.checked
                                              );
                                            }}
                                          />
                                        </div>
                                        <center>
                                          <div style={{ marginTop: "8%" }}>
                                            <div className="testnsam">
                                              {inneritem.name}
                                            </div>
                                          </div>
                                          <div
                                            className="col-lg-3 md-3 sm-3"
                                            style={{
                                              textAlign: "center",
                                              borderRadius: "10px",
                                            }}
                                          >
                                            <div className="scoreb">
                                              {item?.report?.score} /{" "}
                                              {inneritem?.total_src}
                                            </div>
                                          </div>
                                          <span
                                            style={{
                                              fontSize: "12px",
                                              color: "gray",
                                            }}
                                          >
                                            Total Score
                                          </span>
                                        </center>

                                        <div className="d-flex">
                                          <footer className="border-top section-scorecard col-lg-12 md-12 sm-12 ">
                                            <span
                                              style={{
                                                fontFamily: "sans-serif",
                                                fontSize: "12px",
                                                color: "gray",
                                              }}
                                              className="ml-2"
                                            >
                                              Section Score
                                            </span>
                                            <table>
                                              <tr>
                                                <th></th>
                                                <th
                                                  style={{
                                                    color: "#947a4a",
                                                    fontWeight: "300",
                                                    fontSize: "12px",
                                                  }}
                                                >
                                                  Scored
                                                </th>
                                                <th
                                                  style={{
                                                    color: "#947a4a",
                                                    fontWeight: "300",
                                                    fontSize: "12px",
                                                  }}
                                                >
                                                  Total Score
                                                </th>
                                              </tr>
                                              {item?.avrg_scr?.map(
                                                (section: any, i) => {
                                                  return (
                                                    <tr>
                                                      <td>
                                                        <span
                                                          style={{
                                                            color: "orange",
                                                          }}
                                                        >
                                                          {section.name}
                                                        </span>
                                                      </td>
                                                      <td
                                                        style={{
                                                          color: "#4b4a4a",
                                                        }}
                                                      >
                                                        {
                                                          item?.avrg_scr[i]
                                                            ?.score
                                                        }
                                                      </td>
                                                      <td
                                                        style={{
                                                          color: "#4b4a4a",
                                                        }}
                                                      >
                                                        {
                                                          inneritem
                                                            ?.qes_weightAge[i]
                                                            ?.score
                                                        }
                                                      </td>
                                                    </tr>
                                                  );
                                                }
                                              )}
                                            </table>
                                          </footer>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                          </>
                        );
                      })}
                    {reporttest?.length === 0 && (
                      <center>
                        <img
                          src={NodataFound}
                          alt=""
                          style={{ width: "65%", marginTop: "15%" }}
                        />
                        <br />
                        <h6 className="font-weight-bold">Oops no record found.</h6>
                      </center>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      </div>
    </>
  );
};

export default CertificateCard;
