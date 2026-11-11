import { Autocomplete, Skeleton, TextField } from "@mui/material";
import { lazy, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import { successSAS } from "../../../redux/features/jobs/job-applications/downloadSASSlice";
import {
  authfindJob,
  findJob,
  resetAuthJobSearchCreator,
  resetJobSearchCreator,
} from "../../../redux/features/jobs/job-listing/JobListingSlice";
import {
  PatchSaveUnSaveJob,
  resetSaveUnsaveCreator,
} from "../../../redux/features/jobs/saved-jobs/SavedJobsSlice";
import {
  DesignationMasterData,
  resetDesignationMasterData,
} from "../../../redux/features/masterData/DesignationSlice";
import {
  LocationcityMasterData,
  resetLocationcityMasterData,
} from "../../../redux/features/masterData/LocationcitySlice";
import {
  getIndustryType,
  resetIndustryType,
} from "../../../redux/features/masterData/industrySlice";
import JobCard from "../../shared/JobCard";
import {
  companySAS,
  successCompnySAS,
} from "../../../redux/features/jobs/job-applications/downloadCompSASSlice";

import JobCardSk from "../../shared/JobCard_Sk";
import { Modal } from "react-bootstrap";
import { log } from "console";

var bnr = require("../../../assets/images/banner/bnr6.png");
const Pagination = lazy(() => import("rc-pagination"));

function Homepage(dataProp2) {
  const [showRecords, setShowRecords] = useState(false);

  const handleShowRecords = () => {
    setShowRecords(true);
  };

  const dispatch = useDispatch();

  const { IndustryType } = useSelector((state: any) => state.industryType);
  const [ind, setInd] = useState<any>([]);
  const [locProp, setLocProp] = useState<any>([]);
  const [desigValue, setDesigValue] = useState<any>(null);
  const [locationValue, setLocationValue] = useState<any>(null);
  const [industryValue, setIndustryValue] = useState<any>(null);
  const [dataProp, setDataProp] = useState<any>(null);

  const { LocationcityData } = useSelector(
    (state: any) => state.LocationCitiesData
  );

  const DesignationmasterData = useSelector((state: any) => state.designation);
  const { DesignationData } = DesignationmasterData;
  const [desig, setDesig] = useState<any>([]);

  const isLoggedIn = sessionStorage.getItem("access_token") ? true : false;

  let industries: any = new Array<Industry>();
  interface Industry {
    value: String;
    label: string;
  }
  let locations: any = new Array<Location>();

  let designations: any = new Array<Designation>();

  interface Location {
    value: String;
    label: string;
  }
  interface Designation {
    value: String;
    label: string;
  }

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  useEffect(() => {
    dispatch(getIndustryType({ pageno: -1, search: "" }));
    dispatch(LocationcityMasterData({ pageno: -1, search: "" }));
    dispatch(DesignationMasterData({ pageno: -1, search: "" }));
    const initialJobmdl = {
      pageid: 1,
      pageLimit: 12,
      mode: "minimal",
    };

    dispatch(findJob(initialJobmdl));

    setDataProp(initialJobmdl);

    return () => {
      dispatch(resetJobSearchCreator());
      dispatch(resetAuthJobSearchCreator());
    };
  }, []);

  useEffect(() => {
    if (IndustryType?.data?.length > 0) {
      IndustryType?.data.map((e: any, i: number) => {
        industries.push({ value: `${1 + i}`, label: e });
      });

      const industriesProps = {
        options: industries,
        getOptionLabel: (option: any | string) => option.label || option,
      };
      setInd(industriesProps);
    } else {
      const industriesProps = {
        options: [{ label: "No data", value: 1 }],
        getOptionLabel: (option: any | string) => option.label || option,
      };
      setInd(industriesProps);
    }
  }, [IndustryType]);

  useEffect(() => {
    if (LocationcityData?.length > 0) {
      LocationcityData?.map((e: any, i: number) => {
        locations.push({ value: `${1 + i}`, label: e });
      });

      const locationProps = {
        options: locations,
        getOptionLabel: (option: any | string) => option.label || option,
      };

      setLocProp(locationProps);
    } else {
      const locationProps = {
        options: [{ label: "No data", value: 1 }],
        getOptionLabel: (option: any | string) => option.label || option,
      };

      setLocProp(locationProps);
    }
  }, [LocationcityData]);

  useEffect(() => {
    if (DesignationData?.length > 0) {
      DesignationData?.map((e: any, i: number) => {
        designations.push({ value: `${1 + i}`, label: e });
      });
      const designationProps = {
        options: designations,
        getOptionLabel: (option: any | string) => option.label || option,
      };

      setDesig(designationProps);
    } else {
      const designationProps = {
        options: [{ label: "No data", value: 1 }],
        getOptionLabel: (option: any | string) => option.label || option,
      };

      setDesig(designationProps);
    }
  }, [DesignationData]);

  const handleJobSearch = () => {
    handleShowRecords();
    handleClick();
    const desigType = typeof desigValue;
    const locationType = typeof locationValue;
    const indType = typeof industryValue;

    const jobFilterModal = {
      mode: "minimal",
      pageid: 1,
      title: desigType == "string" ? desigValue : desigValue?.label,
      location: locationType == "string" ? locationValue : locationValue?.label,
      industry: indType == "string" ? industryValue : industryValue?.label,
      pageLimit: 12,
    };
    dispatch(findJob(jobFilterModal));
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    if (inputRef?.current) {
      inputRef.current.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  };
  const navigate = useNavigate();

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleJobSearch();
    }
  };

  useEffect(() => {
    return () => {
      dispatch(resetJobSearchCreator());
      dispatch(resetIndustryType());
      dispatch(resetLocationcityMasterData());
      dispatch(resetDesignationMasterData());
    };
  }, []);

  var notfoundImg = require("../../../assets/images/background/No-record.png");

  const { res, loading } = useSelector((state: any) => state.findJob);
  const { response, load } = useSelector((state: any) => state.authfindJob);
  const showSnackAlert = UseToastAlert();
  const { saveOrUnsave, loadingSave } = useSelector(
    (state: any) => state.PatchSaveUnSaveJobSlice
  );
  const { sasComp, loadC } = useSelector((state: any) => state.companySAS);
  const [currentpage, setCurrentPage] = useState(1),
    [perPage, setPerPage] = useState(12),
    [size, setSize] = useState(perPage);

  const dynamicRes = isLoggedIn ? response : res;
  const dynamicLoading = isLoggedIn ? load : loading;

  const handleClickScroll = () => {
    const element = document.getElementById("section-II");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const PerPageChange = (value: any) => {
    setSize(value);
    if (dynamicRes?.data?.jobs) {
      Math.ceil(dynamicRes?.data?.totalCount / value);
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
  const handleSaveClick = (jobid: any, status: string) => {
    sessionStorage.setItem("jobid", jobid);
    if (!sessionStorage.getItem("access_token")) {
      navigate({
        pathname: "/jobSeekerSignin",
      });
    } else {
      const datamdl = {
        jobSeekerResp: {
          jobid: jobid,
          status:
            status === "SAVED" || status === "save" || status === "SAVE"
              ? "DELETE"
              : "SAVE",
        },
      };
      dispatch(PatchSaveUnSaveJob(datamdl));
    }
  };

  const PaginationChange = (page: any, pageSize: any) => {
    setCurrentPage(page);
    setSize(pageSize);
    const paginatedJobmdl = {
      mode: "minimal",
      pageid: page,
      title: dataProp?.dataProp?.data?.title,
      jobid: dataProp?.dataProp?.data?.jobid,
      location: dataProp?.dataProp?.data?.location,
      industry: dataProp?.dataProp?.data?.industry,
      pageLimit: 12,
    };
    isLoggedIn
      ? dispatch(authfindJob(paginatedJobmdl))
      : dispatch(findJob(paginatedJobmdl));

    handleClickScroll();
  };

  useEffect(() => {}, [size, currentpage]);

  useEffect(() => {
    if (saveOrUnsave && saveOrUnsave?.code && saveOrUnsave?.code === 200) {
      const paginatedJobmdl = {
        mode: "minimal",
        pageid: currentpage,
        title: dataProp?.dataProp?.data?.title,
        jobid: dataProp?.dataProp?.data?.jobid,
        location: dataProp?.dataProp?.data?.location,
        industry: dataProp?.dataProp?.data?.industry,
        pageLimit: 12,
      };
      isLoggedIn
        ? dispatch(authfindJob(paginatedJobmdl))
        : dispatch(findJob(paginatedJobmdl));
      showSnackAlert("success", saveOrUnsave?.message);
      dispatch(resetSaveUnsaveCreator());
    } else if (
      saveOrUnsave?.response &&
      saveOrUnsave?.response?.data &&
      saveOrUnsave?.response?.data?.code !== 200
    ) {
      showSnackAlert("warning", saveOrUnsave?.response?.data?.message);
      dispatch(resetSaveUnsaveCreator());
    }
  }, [saveOrUnsave, saveOrUnsave?.code]);

  useEffect(() => {
    if (dynamicRes?.code === 200) {
      const companyId = dynamicRes?.data?.jobs?.map((e: any) => {
        return e?.companyid;
      });
      companyId.length
        ? dispatch(companySAS({ id: [...companyId], sasFor: "CO_LOGO" }))
        : dispatch(successCompnySAS());
    }
    if (dynamicRes?.response?.status !== undefined) {
      showSnackAlert("warning", dynamicRes?.response?.statusText);
      isLoggedIn
        ? dispatch(resetAuthJobSearchCreator())
        : dispatch(resetJobSearchCreator());
    }
  }, [dynamicRes, dynamicRes?.response?.status]);
  const textLimit = 70;

  return (
    <div className="page-content" style={{ backgroundColor: "#f8f8f8" }}>
      <div
        className="homepageHeader overlay-black-dark"
        style={{
          backgroundImage: "url(" + bnr + ")",
        }}
      >
        <div className="container homepage-container">
          <div className="find-job-bx home-headline">
            <h2 style={{ color: "#f8f8f8" }}>
              {dynamicRes?.data?.totalCount &&
                dynamicRes?.data?.totalCount > 0 && (
                  <>
                    Search Between More Than <br />
                    <span style={{ color: "#ffbf01" }}>
                      {dynamicRes?.data?.totalCount}
                    </span>
                    &nbsp; Open Jobs.
                  </>
                )}
            </h2>
            <div
              className="section-full browse-job-find"
              style={{ marginTop: "76px" }}
            >
              <div className="find-job-bx">
                <form className="dezPlaceAni filterjob">
                  <div className="row">
                    <div className="col-lg-4 col-md-6">
                      <div className="form-group">
                        <Autocomplete
                          {...desig}
                          value={desigValue}
                          id="jobtitle-autocomplete"
                          autoComplete
                          freeSolo
                          includeInputInList
                          onChange={(event, newValue) => {
                            setDesigValue(newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Job Title"
                              variant="standard"
                              onChange={(e) => {
                                setDesigValue(e.target.value);
                              }}
                              onKeyUp={handleKeyDown}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="form-group">
                        <Autocomplete
                          {...locProp}
                          id="auto-complete"
                          autoComplete
                          freeSolo
                          includeInputInList
                          value={locationValue}
                          onChange={(event, newValue) => {
                            setLocationValue(newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Location"
                              variant="standard"
                              onChange={(e) => {
                                setLocationValue(e.target.value);
                              }}
                              onKeyUp={handleKeyDown}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                      <div className="form-group">
                        <Autocomplete
                          {...ind}
                          id="auto-complete"
                          autoComplete
                          freeSolo
                          includeInputInList
                          value={industryValue}
                          onChange={(event, newValue) => {
                            setIndustryValue(newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Industry"
                              variant="standard"
                              onChange={(e) => {
                                setIndustryValue(e.target.value);
                              }}
                              onKeyUp={handleKeyDown}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="col-lg-2 col-md-6 d-flex align-items-center">
                      <button
                        type="button"
                        className="site-button btn-block searchJob"
                        onClick={(e) => {
                          e.preventDefault();
                          handleJobSearch();
                        }}
                      >
                        Search Job
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div ref={inputRef} style={{ animationDelay: "2s" }}></div>
      </div>
      <div className="section-full job-categories content-inner-2">
        <div className="container">
          <div className="row job-grid" style={{ textAlign: "center" }}>
            {dynamicRes?.data?.jobs &&
              dynamicRes?.data?.jobs?.length === 0 &&
              !dynamicLoading && (
                <div className="col-xl-12 col-lg-12 col-md-12">
                  <img src={notfoundImg} alt="" />
                  <h6
                    style={{
                      fontSize: "13px",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    Oops no jobs found.
                  </h6>
                </div>
              )}
          </div>
          <div className="row job-grid">
            {!dynamicLoading ? (
              dynamicRes &&
              dynamicRes?.data?.jobs?.length > 0 &&
              dynamicRes?.data?.jobs?.map((c) => {
                const modal = {
                  title: c?.title,
                  companyName: c.employer?.company_name,
                  exp: c?.exp,
                  location: c?.location,
                  skills: c?.skills,
                  jobDesc: c?.job_desc,
                  salary: c.salary,
                  application_status: {
                    self: "",
                  },
                  jobid: c.jobid,
                  compId: c.companyid,
                  createdAt: c.created_at,
                  hideApply: false,
                  img: sasComp?.code === 200 ? sasComp?.data : [],
                };
                return (
                  <div className="col-md-4 col-lg-4 col-sm-12 mb-4">
                    <JobCard {...modal} />
                  </div>
                );
              })
            ) : (
              <>
                <div className="col-md-4 col-lg-4 col-sm-12 mb-4">
                  <JobCardSk />
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 mb-4">
                  <JobCardSk />
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 mb-4">
                  <JobCardSk />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="row job-grid" style={{ width: "100%" }}>
        <div className="col-md-6 col-lg-6 col-sm-12 mb-2">
          <div className="faqdiv">
            <h4>Frequently Asked Questions (FAQ)</h4>
            <p>
              Find answers to commonly asked questions about our
              products/services. If you have a question that isn't answered
              here, feel free to contact our support team for further
              assistance.
            </p>
            <Link to={"/public/faq"}>
              <button type="button" className="gotoButton">
                Go to FAQ
              </button>
            </Link>
          </div>
        </div>
        <div className="col-md-6 col-lg-6 col-sm-12 mb-2">
          <div className="faqdiv">
            <h4>Quick Contact Page</h4>
            <p>
              A quick contact page is a dedicated section on a website or
              application that allows users to quickly an easily submit queries
              or requests for customer support.
            </p>
            <Link to={"/public/quick-contact"}>
              <button type="button" className="gotoButton">
                Go to Quick Contact
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Homepage;
