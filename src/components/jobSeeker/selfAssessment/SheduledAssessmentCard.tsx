import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import { Link, useNavigate } from "react-router-dom";
import { getJSAssessmentData } from "../../../redux/features/jobSeeker/JsAssessmentSlice";
import Pagination from "rc-pagination";
import { Assessment_Skl } from "./Assessment_Sk";
import { BsClock, BsPersonWorkspace } from "react-icons/bs";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import { Chip } from "@mui/material";
import { Content, convertSecondsToHours } from "../../../common/common";
import Tooltip from "@material-ui/core/Tooltip";
import "../../../assets/customCss/assessment.css";
import { VscNote } from "react-icons/vsc";
import { FaChartLine } from "react-icons/fa";
import { CgTimelapse } from "react-icons/cg";
var notfoundImg = require("../../../assets/images/background/No-record.png");

function SheduledAssessmentCard(props: any) {
  const dispatch = useDispatch();
  const [displayData, setDisplayData] = useState<any>([]);

  const JSAssessmentDetails = useSelector(
    (state: any) => state.JSAssessmentData
  );
  const { JsAssRes, Jsloading } = JSAssessmentDetails;

  const StatisticsDetails = useSelector(
    (state: any) => state.JSAssessmentStatistics
  );
  const { StatRes, Statloading } = StatisticsDetails;

  useEffect(() => {
    let combinedData: any = [];
    const data = JsAssRes?.data?.asmt?.map((e: any) => {
      let res = { ...e };
      StatRes?.data?.data?.map((a: any) => {
        if (e?.test_id === a?.id) {
          res.totalCount = a?.count;
        }
      });
      combinedData.push(res);
    });
    setDisplayData([...combinedData]);
  }, [StatRes, JsAssRes]);

  // useEffect(() => {
  //   if (!Jsloading && JsAssRes?.data) {
  //     setDisplayData(JsAssRes?.data);
  //   }
  // }, [JsAssRes, Jsloading]);

  const showSnackAlert = UseToastAlert();
  const navigate = useNavigate();
  const [postData, setPostData] = useState<any>([]);
  const [currentpage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [size, setSize] = useState(perPage);
  const PerPageChange = (value: any) => {
    setSize(value);
    if (JsAssRes?.data) {
      Math.ceil(JsAssRes?.data?.length / value);
    }
  };
  const PrevNextArrow = (current: any, type: any, originalElement: any) => {
    if (type === "prev") {
      return (
        <button
          title="prev"
          className="previous"
          style={{ borderColor: "#eae6e6", borderRadius: "2px" }}
        >
          <i className="ti-arrow-left"></i> Prev{" "}
        </button>
      );
    }

    if (type === "next") {
      return (
        <button
          title="next"
          style={{ borderColor: "#eae6e6", borderRadius: "2px" }}
          className="pagination"
        >
          Next <i className="ti-arrow-right"></i>{" "}
        </button>
      );
    }
    return originalElement;
  };
  const PaginationChange = (page: any, pageSize: any) => {
    setCurrentPage(page);
    setSize(pageSize);
    const paginatedMdl = {
      pageId: page,
      pageLimit: perPage,
      status: "INVITED",
      category: props?.filteredData?.category,
      skill: props?.filteredData?.skill,
    };
    dispatch(getJSAssessmentData(paginatedMdl));
    setDisplayData(JsAssRes);
  };

  const ViewScoreResult = (id: any) => {
    navigate(`/js/certificateCard/${id}`);
  };

  const textLimit: number = 32;
  const categoryLimit: number = 10;

  return (
    <>
      {Jsloading && <Assessment_Skl />}
      {JsAssRes?.data?.asmt &&
        JsAssRes?.data?.asmt?.length === 0 &&
        !Jsloading && (
          <center>
            <div className="col-lg-6">
              <img src={notfoundImg} alt="" />
              <h6 style={{ fontSize: "13px", fontWeight: "bold" }}>
                Oops no record found.
              </h6>
            </div>
          </center>
        )}
      {!Jsloading && (
        <div className="col-lg-12 col-md-12 col-sm-12">
          <ul className="post-job-bx browse-job-grid row">
            {displayData?.length > 0 &&
              displayData?.map((item: any, index: any) => {
                return (
                  <span
                    className="col-lg-6 col-md-12"
                    key={index}
                    style={{ marginBottom: "25px" }}
                  >
                    <div className="post-bx" id="Custom-CardBackgrdColor">
                      <div className="">
                        <div className="job-post-info">
                          <div className="d-flex justify-content-between">
                            <div className="row">
                              <div className="col-lg-12 col-sm-12 pb-12">
                                <h5>
                                  <Link
                                    to={`/js/assessmentPreview?id=${item?.test_id} &status=INVITED`}
                                  >
                                    <Tooltip
                                      title={item.test_name}
                                      placement="top"
                                    >
                                      <span className="namefi testnameh">
                                        {item.test_name
                                          ? Content(item?.test_name, textLimit)
                                          : "Not Available"}{" "}
                                      </span>
                                    </Tooltip>
                                    <Tooltip
                                      title={item.category}
                                      placement="top"
                                    >
                                      <span className="catfi">
                                        ({" "}
                                        {item.category
                                          ? Content(
                                              item.category,
                                              categoryLimit
                                            )
                                          : "Not Available"}
                                        )
                                      </span>
                                    </Tooltip>
                                    &nbsp;
                                  </Link>
                                </h5>
                              </div>
                            </div>
                          </div>
                          <ul>
                            {item?.duration && (
                              <li key={item?.duration}>
                                <BsClock className="custom-job-icon" />
                                &nbsp;
                                <span className="custom-job-content">
                                  <span className="heading-title">
                                    {" "}
                                    Duration :
                                  </span>{" "}
                                  {item?.duration
                                    ? convertSecondsToHours(item?.duration)
                                    : "N/A"}
                                </span>
                              </li>
                            )}

                            {item?.desc && (
                              <div style={{ color: "black" }}>
                                <VscNote className="custom-job-icon" />
                                {"  "}
                                &nbsp;
                                <Tooltip title={item?.desc} placement="top">
                                  <span className="catfi text-dark">
                                    <span className="heading-title">
                                      Description :{" "}
                                    </span>
                                    {item?.desc
                                      ? Content(item?.desc, 30)
                                      : "N/A"}
                                  </span>
                                </Tooltip>
                              </div>
                            )}

                            <li key={item?.max_attempt}>
                              <FaChartLine className="custom-job-icon" /> &nbsp;
                              <span className="custom-job-content">
                                <span className="heading-title">
                                  Max Attempts :
                                </span>{" "}
                                {item?.max_attempt}
                              </span>
                            </li>

                            {item?.attempt_left && (
                              <li key={item?.attempt_left}>
                                <CgTimelapse className="custom-job-icon" />{" "}
                                &nbsp;
                                <span className="custom-job-content">
                                  <span className="heading-title">
                                    Attempt left :{" "}
                                  </span>
                                  {item?.attempt_left}
                                </span>
                              </li>
                            )}

                            <li key={item?.count}>
                              <BsPersonWorkspace className="custom-job-icon" />{" "}
                              &nbsp;
                              <span className="custom-job-content">
                                {item?.totalCount}
                                {item?.totalCount > 500 && ` +`} Assessment
                                taken
                              </span>
                            </li>

                            <li key={item?.fee}>
                              <MdOutlineCurrencyRupee className="custom-job-icon" />{" "}
                              &nbsp;
                              <span className="custom-job-content">
                                {item?.amount?.value}
                              </span>
                            </li>
                          </ul>
                          <footer className="border-top pt-3">
                            <div className="scheduledbtn">
                              <div>
                                {item?.skill?.map((val) => {
                                  return (
                                    <Chip
                                      style={{
                                        borderColor: "#a277f1",
                                        marginRight: "7px",
                                      }}
                                      label={val}
                                      variant="outlined"
                                    />
                                  );
                                })}
                              </div>
                              <div>
                                {item?.attempt_left < 10 && (
                                  <Button
                                    className="testBtn viewResultbtn"
                                    onClick={() =>
                                      ViewScoreResult(item?.test_id)
                                    }
                                    style={{
                                      marginRight: "8px",
                                      fontSize: "11px",
                                    }}
                                  >
                                    <span>View Details</span>
                                  </Button>
                                )}
                                <Button
                                  className="testBtn cancelSheduledbtn"
                                  target="_blank"
                                  href={item?.practice_url}
                                  style={{
                                    marginRight: "8px",
                                    textDecoration: "none",
                                    fontSize: "11px",
                                  }}
                                >
                                  <span
                                    style={{
                                      color: "white",
                                    }}
                                  >
                                    Practice Assessment
                                  </span>
                                </Button>
                                <Button
                                  className="testBtn taketestbtn"
                                  target="_blank"
                                  href={item?.test_url}
                                  style={{
                                    fontSize: "11px",
                                    textDecoration: "none",
                                  }}
                                >
                                  <span
                                    style={{
                                      color: "white",
                                    }}
                                  >
                                    {" "}
                                    Take Assessment
                                  </span>
                                </Button>
                              </div>
                            </div>
                          </footer>
                        </div>
                      </div>
                    </div>
                  </span>
                );
              })}
          </ul>
        </div>
      )}

      {JsAssRes?.jobs && JsAssRes?.jobs?.length === 0 && (
        <center>
          {" "}
          <div className="col-lg-6">
            {" "}
            <img src={notfoundImg} alt="" />{" "}
            <h6 style={{ fontSize: "13px" }}> Oops No record found... </h6>
          </div>
        </center>
      )}

      {JsAssRes?.data?.asmt &&
        JsAssRes?.data?.asmt.length > 0 &&
        !Jsloading && (
          <div className="pagination-bx float-right m-t10 m-b30">
            <Pagination
              className="pagination-data"
              onChange={PaginationChange}
              total={JsAssRes?.data?.count?.count}
              current={currentpage}
              pageSize={size}
              showSizeChanger={true}
              itemRender={PrevNextArrow}
              onShowSizeChange={PerPageChange}
            />
          </div>
        )}
    </>
  );
}

export default SheduledAssessmentCard;
