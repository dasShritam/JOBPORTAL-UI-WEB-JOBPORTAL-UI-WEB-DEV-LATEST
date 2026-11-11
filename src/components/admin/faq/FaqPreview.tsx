import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchFaq,
  fetchSingleFaq,
  resetVoteFaq,
  voteFaq,
} from "../../../redux/features/admin/faq/FaqSlice";
import "../../../assets/customCss/jobs/manage-jobs.css";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import IconButton from "@material-ui/core/IconButton";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import { HiThumbDown, HiThumbUp } from "react-icons/hi";
import { TbSearch } from "react-icons/tb";
import { BsFillEyeFill } from "react-icons/bs";
import { IoSettingsSharp } from "react-icons/io5";
import { MdLibraryBooks, MdOutlineSecurity } from "react-icons/md";
import { RiContactsFill } from "react-icons/ri";
import "../../../assets/customCss/faq.css";
var faqImage = require("../../../assets/images/Public-Faq.png");

function FaqPreview() {
  const [faqData, setFaqData] = useState([]);
  const [filterData, setFilterData] = useState<any>([]);
  const [id, setId] = useState(0);
  const [voteId, setVoteId] = useState(0);
  const [categoryClick, setCategoryClick] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [highlightedDiv, setHighlightedDiv] = useState();
  const [displayFaq, setDisplayFaq] = useState<any[]>([]);
  const [disVote, setDisVote] = useState(false);

  const [catIndex, setCatIndex] = useState<number>();

  const dispatch = useDispatch(),
    fetchFaqData = useSelector((state: any) => state.fetchFAQData),
    { allFetchFaq, fetchFaqLoading } = fetchFaqData,
    fetchSingleData = useSelector((state: any) => state.SingleFAQData),
    { singleFaqRes, singleFaqLoading } = fetchSingleData,
    voteFaqData = useSelector((state: any) => state.voteFAQCount),
    { voteFaqRes, voteFaqLoading } = voteFaqData;

  const inputRef = useRef<HTMLInputElement>(null);
  const showSnackAlert = UseToastAlert();

  const handleClick = () => {
    setTimeout(() => {
      if (inputRef?.current) {
        inputRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 500);
  };

  const scrollToPageEnd = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  const fetchData = {
    faqId: null,
    question: "",
    category: "",
    tag: [],
    pageId: 0,
  };

  useEffect(() => {
    dispatch(fetchSingleFaq(fetchData));
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<any[]>([]);

  const handleInputChanges = (e, value) => {
    setSearchQuery(value);
    setSearchValue(value);
    let data: any = [];

    if (value) {
      singleFaqRes?.res?.map((item: any) => {
        if (item?.tags?.length) {
          item?.tags?.map((a: any) => {
            if (a?.toLowerCase()?.includes(value.toLowerCase()))
              data.push(item?.question);
          });
        }
      });

      if (data?.length > 0) {
        setFilteredOptions(data);
      } else {
        singleFaqRes?.res?.map((item: any) => {
          if (item?.question?.toLowerCase()?.includes(value.toLowerCase()))
            data.push(item?.question);
        });
        setFilteredOptions(data);
      }
    } else {
      setFilteredOptions([]);
    }
  };

  useEffect(() => {
    dispatch(fetchFaq(fetchData));
  }, []);

  useEffect(() => {
    if (allFetchFaq) {
      setId(0);
      setFaqData(allFetchFaq?.res);
      if (allFetchFaq?.res?.length) {
        setVoteId(allFetchFaq?.res[0]?.faqId);
        setHighlightedDiv(allFetchFaq?.res[0]?.faqId);
        setVoteId(allFetchFaq?.res[0]?.faqId);
        if (categoryClick) {
          setDisplayFaq([...allFetchFaq?.res]);
        }
      } else {
        setDisplayFaq([]);
      }
    }
  }, [allFetchFaq]);

  useEffect(() => {
    if (singleFaqRes?.res) {
      setFilterData([...singleFaqRes?.res]);
    }
  }, [singleFaqRes]);

  const handleCategoryQues = (catData: string) => {
    const data = {
      faqId: null,
      question: "",
      category: catData,
      pageId: 1,
      tag: [],
    };
    dispatch(fetchFaq(data));
  };

  const SearchHandler = () => {
    const data = {
      faqId: null,
      question: searchValue,
      category: "",
      pageId: 1,
      tag: [],
    };
    dispatch(fetchFaq(data));
    setFilterData([]);
    setCategoryClick(true);
  };

  const voteHandler = (voteType: string) => {
    const votesData = {
      faqId: voteId,
      vote: voteType,
    };
    dispatch(voteFaq(votesData));
  };

  useEffect(() => {
    if (voteFaqRes?.code === 200) {
      dispatch(resetVoteFaq());
      setDisVote(true);
    } else if (voteFaqRes?.response?.data?.code) {
      showSnackAlert("warning", voteFaqRes?.response?.data?.message);
      dispatch(resetVoteFaq());
    }
  }, [voteFaqRes]);

  const categoryOpts = [
    {
      category: "Create Captive job Profile",
      icon: <RiContactsFill />,
    },
    {
      category: "Search",
      icon: <TbSearch />,
    },
    {
      category: "Apply",
      icon: <MdLibraryBooks />,
    },
    {
      category: "Overview",
      icon: <BsFillEyeFill />,
    },
    {
      category: "Settings",
      icon: <IoSettingsSharp />,
    },
    {
      category: "Security Advice",
      icon: <MdOutlineSecurity />,
    },
  ];

  return (
    <>
      <div className="page-content ">
        <div
          className="dez-bnr-inr dez-bnr-inr-md"
          style={{ backgroundColor: "#f8f8f8" }}
        >
          <div className="container custom-topdiv" style={{ marginTop: "3%" }}>
            <div className="dez-bnr-inr-entry align-m ">
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-6 m-t25">
                  <div className="custom-heading-faq">
                    <h2>FAQ</h2>
                    <h3>Hi..! How may I help you.</h3>
                  </div>
                  <div className="input-group ">
                    <Autocomplete
                      className="text-div"
                      style={{ width: "70%" }}
                      freeSolo
                      options={filteredOptions}
                      inputValue={searchQuery}
                      onInputChange={handleInputChanges}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Search by keyword "
                          margin="none"
                          variant="outlined"
                          style={{
                            backgroundColor: "white",
                            borderRadius: "20px 0px 0px 20px",
                            border: "none",
                          }}
                        />
                      )}
                    />
                    <div className="input-group-prepend">
                      <button
                        className="site-button custom faq-search-btn"
                        onClick={(e: any) => {
                          SearchHandler();
                          handleClick();
                          setDisVote(false);
                        }}
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6 col-md-6 col-sm-12 col-xs-6 m-t25">
                  <div className="faq-image">
                    <img src={faqImage} alt="" style={{ width: "75%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="content-block">
          <div className="section-full browse-job content-inner-1 m-b10">
            <div className="container">
              <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                  <h2 className="browser-heading">
                    BROWSE BY <span>TOPIC</span>
                  </h2>
                </div>
              </div>
              <div className="row">
                {categoryOpts?.map((item: any, index: any) => (
                  <div
                    className="col-lg-2 col-sm-12 col-md-2 m-b30"
                    onClick={() => {
                      handleCategoryQues(item?.category);
                      setCategoryClick(true);
                      setDisVote(false);
                      setVoteId(item.faqId);
                      handleClick();
                      setCatIndex(index);
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: `${
                          catIndex === index ? "grey" : "#cdcdcd"
                        }`,
                        cursor: "pointer",
                      }}
                      className="city-bx align-items-end d-flex"
                    >
                      <div
                        className="category-info"
                        style={{
                          textDecoration: "none",
                        }}
                      >
                        <div
                          className="icon"
                          style={{
                            marginBottom: "15%",
                          }}
                        >
                          <h1
                            style={{
                              width: "90px",

                              marginLeft: "66px",
                              color: "#016acb",
                            }}
                          >
                            {" "}
                            {item?.icon}
                          </h1>

                          <h6
                            className="category-box"
                            style={{
                              marginLeft: "20px",
                              textAlign: "center",
                            }}
                          >
                            {item?.category}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="suggestion-category">
              <div className="container">
                <div className="row">
                  {!categoryClick && (
                    <div className="container">
                      <div className="row">
                        <div className="col-12">
                          <div className="quick-solution">
                            <h2>
                              QUICK SOLUTION{" "}
                              <span>as per the recent search</span>
                            </h2>

                            <div className="row">
                              {faqData
                                ?.slice(0, 4)
                                ?.map((item: any, index: any) => (
                                  <div
                                    className="col-lg-3 col-md-4 col-sm-6"
                                    key={item.faqId}
                                  >
                                    <div className="question-item">
                                      <div className="questions">
                                        <span>Q.</span>{" "}
                                        <Link
                                          to="#"
                                          className="question-list"
                                          style={{
                                            textDecoration: "none",
                                            color: "black",
                                          }}
                                          onClick={(e: any) => {
                                            setDisVote(false);
                                            e.preventDefault();
                                            setDisplayFaq([faqData[index]]);
                                            setHighlightedDiv(item.faqId);
                                            setVoteId(item.faqId);
                                            setCategoryClick(true);
                                          }}
                                        >
                                          {item.question}
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="container">
              {displayFaq?.length > 0 && categoryClick && (
                <div className="row">
                  <div className="col-lg-5 col-md-5 col-sm-5">
                    <div
                      className=" mt-4 ml-4"
                      id="carddiv"
                      style={{
                        overflowY: "scroll",
                        height: "450px",
                        cursor: "pointer",
                      }}
                    >
                      {displayFaq?.map((data: any, index: any) => (
                        <div
                          key={data?.faqId}
                          style={{
                            padding: "20px 15px",
                            borderBottom: "1px solid #f0f0f0",
                            backgroundColor:
                              highlightedDiv === data?.faqId
                                ? "#d8ecf56b"
                                : "white",
                          }}
                          onClick={() => {
                            setHighlightedDiv(data?.faqId);
                            setId(index);
                            setVoteId(data?.faqId);
                            setDisVote(false);
                          }}
                        >
                          <h6
                            style={{
                              fontSize: "16px",
                            }}
                          >
                            {data?.question}
                          </h6>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div ref={inputRef} />
                  <div className="col-lg-7 col-md-7 col-sm-7 m-t30">
                    <h6 className="question-answer">
                      {displayFaq[id]?.question}
                    </h6>
                    <div
                      className="videoFAQ"
                      style={{ fontSize: "16px" }}
                      dangerouslySetInnerHTML={{
                        __html: displayFaq[id]?.answer,
                      }}
                    ></div>
                  </div>
                </div>
              )}
              <hr />
              {displayFaq?.length > 0 && categoryClick && (
                <>
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-4 text-center m-b40">
                    {!disVote && (
                      <div className="default_content">
                        <p>
                          Was this article helpful?
                          <IconButton>
                            <HiThumbUp
                              style={{
                                color: "green",
                              }}
                              onClick={() => {
                                voteHandler("UPVOTE");
                              }}
                            ></HiThumbUp>
                          </IconButton>
                          <IconButton>
                            <HiThumbDown
                              style={{
                                color: "#fb2c2c",
                              }}
                              onClick={() => {
                                voteHandler("DOWNVOTE");
                              }}
                            ></HiThumbDown>
                          </IconButton>
                        </p>
                      </div>
                    )}
                    {disVote && (
                      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-4 text-center">
                        <div className="default_content">
                          <span className="custom_error_content">
                            Thank you for sharing your feedback.{" "}
                          </span>{" "}
                          &nbsp;
                          <Link
                            to="/public/quick-contact"
                            onClick={scrollToPageEnd}
                            style={{
                              textDecoration: "none",
                            }}
                          >
                            Please click for any query.
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FaqPreview;
