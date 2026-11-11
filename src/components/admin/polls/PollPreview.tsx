import React, { useEffect, useState } from "react";
import { Button, CloseButton } from "react-bootstrap";
import { FormControlLabel, Paper, Radio, RadioGroup } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  GetSinglePoll,
  GetSinglePollGraph,
  PollPreview,
  SavePollAnswer,
  resetPollRes,
} from "../../../redux/features/admin/polls/PollPreviewSlice";
import "../../../assets/customCss/polls/PollPreview.css";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import { Modal } from "react-bootstrap";
import PollGraph from "./PollGraph";
import Chart from "react-apexcharts";
import Select from "react-select";
import { Link } from "react-router-dom";
import { Content } from "../../../common/common";
let polls = require("../../../assets/images/pollsGraph.png");
const PollSystem = () => {
  // Toaster
  const showSnackAlert = UseToastAlert();

  const dispatch = useDispatch();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [pollIDG, setPollIDG] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [questionState, setQuestionState] = useState<any>();
  const [defaultQes, setDefautQes] = useState<any>();
  const [selectedValue, setSelectedValue] = useState("");
  const [graph, setGraph] = React.useState<any>([]);

  //Poll graph
  const [showGraph, setShowGraph] = useState(false);
  const [pollObject, setPollObject] = useState<any>();

  const [showModal, setShowModal] = useState(false);

  const handleCancelClick = () => {
    setShowGraph(false);
    setShowModal(false);
  };

  //Get all polls and graph
  const pollRes = useSelector((state: any) => state?.fetchPollPreviewSlice);
  const { pollResponse, ploading } = pollRes;

  //Get all polls
  const getPollsData = useSelector((state: any) => state?.singlePollx);
  const { singlepollResponse, sploading } = getPollsData;

  //Get all polls for graph
  const getPolls = useSelector((state: any) => state?.singlePollxGraph);
  const { singleGraphpollResponse, spGloading } = getPolls;

  //Save answers
  const pollSavedRes = useSelector((state: any) => state?.savePollAnswerSlice);
  const { savedResponse, sloading } = pollSavedRes;
  const [pollId, setPollId] = useState("");

  useEffect(() => {
    const options = {
      pollId: "",
      pageid: 0,
      pageLimit: 1,
    };
    dispatch(PollPreview(options));
  }, []);

  let questions = [
    {
      question: "",
      vote: true,
      pollId: "",
      options: [
        {
          val: "",
          _id: "",
        },
      ],
    },
  ];

  useEffect(() => {
    if (singlepollResponse?.pollInfo?.length > 0) {
      const pollsDetails = singlepollResponse?.pollInfo[0];
      setPollObject(pollsDetails);
    }
  }, [singlepollResponse]);

  if (!ploading && pollResponse?.data?.pollInfo) {
    questions = [];
    questions = pollResponse?.data?.pollInfo
      .filter((poll) => !poll.voted)
      .map((poll) => {
        let options = poll?.options.map((option) => ({
          val: option.val,
          _id: option._id,
        }));

        return {
          question: poll?.description,
          options: options,
          pollId: poll.pollId,
        };
      });
  }
  const questionFilterdata = (data: any) => {
    const options: any = [];

    const filteredArray = data?.filter((item) => item.voted === true);

    filteredArray?.map((d: any) => {
      options.push({ label: d?.description, value: d?.pollId });
    });
    setQuestionState(options);
    if (options.length) {
      setSelectedValue(options[0]);
      fn_getGraphData(options[0]);
    }
  };
  useEffect(() => {
    questionFilterdata(pollResponse?.data?.pollInfo);
  }, [pollResponse]);

  const handleNextQuestion = () => {
    if (selectedOption) {
      setAnswers([...answers, selectedOption]);
    }
    if (questionIndex < questions?.length - 1) {
      setQuestionIndex(questionIndex + 1);
      setSelectedOption(null);
    }
  };

  const handlePreviousQuestion = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
      setSelectedOption(null);
    }
  };

  //Radio button click
  const handleOptionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    pollId
  ) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);

    const saveOptions = {
      pollId: pollId,
      voteOptId: selectedValue,
    };
    setPollIDG(pollId);
    dispatch(SavePollAnswer(saveOptions));
  };
  useEffect(() => {
    if (
      !sloading &&
      savedResponse &&
      savedResponse?.code &&
      savedResponse?.code === 200
    ) {
      showSnackAlert("success", savedResponse.message);
      const masterDataObj = {
        pollId: pollId,
        pageid: 1,
        pageLimit: 10,
      };
      dispatch(GetSinglePoll(masterDataObj));

      const filteredPolls = pollResponse?.data?.pollInfo.filter(
        (poll) => poll.pollId === pollIDG
      );

      const values = filteredPolls.map((poll) => poll).flat()[0];
      setPollObject(values);
      setShowGraph(true);
      setShowModal(true);
      const options = {
        pollId: "",
        pageid: 0,
        pageLimit: 1,
      };
      dispatch(PollPreview(options));
      dispatch(resetPollRes());
    } else if (
      !sloading &&
      savedResponse &&
      savedResponse?.code &&
      savedResponse?.code !== 200
    ) {
      setShowGraph(false);
      setShowModal(false);
      showSnackAlert("warning", savedResponse.message);
    }
  }, [savedResponse, showGraph, showModal]);

  const handleChoosedOption = (
    event: React.ChangeEvent<HTMLInputElement>,
    pollId,
    options
  ) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You want to answer with the selected option '${
        options.find((c) => c._id == event.target.value).val
      }'.`,
      showCancelButton: true,
      confirmButtonColor: "#2a9f2a ",
      cancelButtonColor: "#db1919 ",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        handleOptionChange(event, pollId);
      }
      handlePreviousQuestion();
    });
  };
  let series = [
    {
      name: "",
      data: [0],
    },
  ];

  let goptions = {};
  let xoption = [];
  let valInPer = [];
  const fn_getGraphData = (_pollId) => {
    const masterDataObj = {
      pollId: _pollId?.value,
      pageid: 1,
      pageLimit: 10,
    };
    dispatch(GetSinglePollGraph(masterDataObj));
  };

  if (!spGloading && singleGraphpollResponse?.pollInfo[0]?.options?.length) {
    const filteredOptions =
      singleGraphpollResponse?.pollInfo[0]?.options.filter(
        (option) => option?.voted
      );

    const totalvote = singleGraphpollResponse?.pollInfo[0]?.options?.reduce(
      (total, option) => total + (option?.vote || 0),
      0
    );
    let votes;

    if (totalvote !== 0) {
      votes = singleGraphpollResponse?.pollInfo[0]?.options?.map((option) => {
        const percentage = ((Number(option?.vote) / totalvote) * 100).toFixed(
          2
        );
        return percentage ? percentage : 0;
      });
    }
    const updatedValues = votes?.map((value) =>
      isNaN(parseFloat(value)) ? "0" : value
    );

    xoption = singleGraphpollResponse?.pollInfo[0]?.options?.map(
      (item) => item?.val
    );
    valInPer = updatedValues;

    if (xoption?.length && valInPer?.length) {
      series = [
        //data on the y-axis
        {
          name: "Percentage",
          data: valInPer,
        },
      ];

      goptions = {
        //data on the x-axis
        chart: {
          id: "bar-chart",
        },
        xaxis: {
          categories: xoption,
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return value.toFixed(0);
            },
          },
        },
        fill: {
          colors: ["#17a2b8"],
        },
        plotOptions: {
          bar: {
            borderRadius: 5,
            dataLabels: {
              position: "center", // top, center, bottom
            },
          },
        },
        noData: {
          text: "No data text",
          align: "center",
          verticalAlign: "middle",
          color: "#56a50d",
        },
      };
    }
  }
  const handleSelectChange = (selectedOption) => {
    setSelectedValue(selectedOption);
    fn_getGraphData(selectedOption);
  };

  return (
    <>
      <div className="">
        <div className="d-flex flex-wrap">
          {!ploading && questions?.length && questions?.length > 0 ? (
            <div className="col-lg-6 col-md-7  col-sm-12">
              <div className="m-b30 job-bx dashSty" style={{ height: "90%" }}>
                <div className="overflow-scroll">
                  <div>
                    <h5
                      style={{
                        color: "#8962fb",
                        marginBottom: "30px",
                        fontSize: "19px",
                      }}
                    >
                      {questionIndex + 1}.
                      {questions?.length === 1
                        ? questions[0]?.question
                        : questions[questionIndex]?.question}
                    </h5>
                  </div>
                  {!ploading && questions ? (
                    <div className="">
                      <RadioGroup
                        className="options_d"
                        name={`question-${
                          questions?.length === 1 ? 0 : questionIndex
                        }`}
                        value={selectedOption}
                        onChange={(e) => {
                          // handleOptionChange(
                          //   e,
                          //   questions[questionIndex].pollId
                          // )
                          setPollId(
                            questions?.length === 1
                              ? questions[0]?.pollId
                              : questions[questionIndex]?.pollId
                          );
                          handleChoosedOption(
                            e,
                            questions?.length === 1
                              ? questions[0]?.pollId
                              : questions[questionIndex]?.pollId,
                            questions?.length === 1
                              ? questions[0]?.options
                              : questions[questionIndex]?.options
                          );
                        }}
                      >
                        {questions[questionIndex]?.options?.map((option) => (
                          <FormControlLabel
                            className={`job-bx-d ${
                              selectedOption === option._id
                                ? "selected-option"
                                : ""
                            }`}
                            key={option._id}
                            value={option._id}
                            control={
                              <Radio
                                checked={selectedOption === option._id}
                                sx={{
                                  color:
                                    selectedOption === option._id
                                      ? "black"
                                      : "",
                                }}
                              />
                            }
                            title={option.val}
                            label={Content(option.val, 35)}
                          />
                        ))}
                      </RadioGroup>
                      {!ploading && questions?.length > 1 ? (
                        <div className="row">
                          <div
                            className="col-md-11 button-container"
                            style={{ marginLeft: "-13px" }}
                          >
                            <Button
                              style={{ float: "right" }}
                              variant="contained"
                              color="gray"
                              onClick={handlePreviousQuestion}
                              disabled={questionIndex === 0}
                            >
                              <i
                                className="fa fa-backward "
                                aria-hidden="true"
                              ></i>
                            </Button>
                          </div>
                          <div className="col-md-1 button-container">
                            <Button
                              color="secondary"
                              onClick={handleNextQuestion}
                              disabled={questions?.length === questionIndex + 1}
                            >
                              <i
                                className="fa fa-forward"
                                aria-hidden="true"
                              ></i>
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Paper className="paper_d">{""}</Paper>
                      )}
                    </div>
                  ) : (
                    <Paper className="paper_d">{""}</Paper>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div
              className="col-lg-6 col-md-7  col-sm-12"
              style={{ height: "90%" }}
            >
              <div className="m-b30 job-bx dashSty">
                <div>
                  <img src={polls} style={{ width: "96%", height: "288px" }} />
                  <div
                    style={{
                      textAlign: "center",
                      marginRight: "10%",
                      marginTop: "-17px",
                    }}
                  >
                    There are no polls available at the moment.
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="col-lg-6 col-md-5 col-sm-12 mb-5">
            <div className="m-b30 job-bx dashSty">
              <Select
                placeholder="Poll Name"
                isSearchable={true}
                isClearable={true}
                isDisabled={false}
                defaultValue={selectedValue}
                className="dropstyle mt-2 mb-2"
                options={questionState}
                value={selectedValue}
                name="Question"
                onChange={handleSelectChange}
              />
              {xoption?.length ? (
                <div style={{ overflowY: "clip", overflowX: "auto" }}>
                  <Chart
                    options={goptions}
                    series={series}
                    type="bar"
                    height="250"
                  />
                </div>
              ) : (
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
                      src={require("../../../assets/images/No data.png")}
                    />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showModal && (
        <Modal
          show={showGraph}
          backdrop="static"
          onHide={() => {
            handleCancelClick();
          }}
          className="modal browse-job fade modal-bx-info editor"
        >
          <div
            className="modal-dialog my-0"
            style={{ width: "100%" }}
            role="document"
          >
            <div className="modal-content">
              <div className="modal-body">
                <div className="modal-custom-header">
                  <h5 className="modal-title" id="ResumeheadlineModalLongTitle">
                    {pollObject?.title}
                  </h5>
                  <CloseButton
                    onClick={() => {
                      handleCancelClick();
                    }}
                  />
                </div>
                <p className="modal-custom-desc">{pollObject?.description}</p>
                {<PollGraph pollsDetails={pollObject} />}
              </div>
              <div className="modal-custom-footer"></div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default PollSystem;
