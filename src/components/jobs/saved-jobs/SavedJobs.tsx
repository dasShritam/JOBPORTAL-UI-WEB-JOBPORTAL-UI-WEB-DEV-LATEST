import React, { lazy, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  GetSavedJobs,
  PatchSaveUnSaveJob,
  resetSaveUnsaveCreator,
} from "../../../redux/features/jobs/saved-jobs/SavedJobsSlice";

import Pagination from "rc-pagination";
import { useNavigate } from "react-router-dom";
import { Chip, Avatar, Skeleton, CircularProgress } from "@mui/material";
import { Stack } from "@mui/system";
import { JobCard_Skl } from "../manage-jobs/JobCard_Sk";

const SavedJobCard = lazy(() => import("./SavedJobCard"));

var NodataFound = require("../../../assets/images/background/No-record.png");

function SavedJobs() {
  const savedjobIndex = useSelector((state: any) => state?.savedjobx);
  const { savedjobs, loadjobs, error } = savedjobIndex;
  const saveUnsave = useSelector((state: any) => state.PatchSaveUnSaveJobSlice);
  const { saveOrUnsave, loadingSave, errorSave } = saveUnsave;
  const [dummyArray, setDummyArray] = useState([1, 2]);
  const dispatch = useDispatch();
  const [postData, setPostData] = useState<any>([]);
  const [loadedPages, setLoadedPages] = useState<number[]>([]);
  const [currentpage, setCurrentPage] = useState(1);
  const [searchData, setSearchData] = useState();
  const [perPage, setPerPage] = useState(10);
  const [filterPoll, setFilterPoll] = useState("");
  const [filteredData, setFilteredData] = useState(savedjobs?.data?.jobs);
  const handleFilterchange = (e: any) => {
    const searchValue = e?.target?.value;
    setFilterPoll(searchValue);
    const filteredData = savedjobs?.data?.jobs.filter((item) =>
      item.title?.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredData(filteredData);
  };

  const [size, setSize] = useState(perPage);
  // const PerPageChange = (value: any) => {
  //   setSize(value);
  //   if (postData) {
  //     Math.ceil(postData?.length / value);
  //   }
  // };
  const [savedData, setSavedData] = useState<any>([]);

  // const PrevNextArrow = (current: any, type: any, originalElement: any) => {
  //   if (type === "prev") {
  //     return <button> Prev </button>;
  //   }
  //   if (type === "next") {
  //     return <button> Next </button>;
  //   }
  //   return originalElement;
  // };

  // const PaginationChange = (page: any, pageSize: any) => {
  //   setCurrentPage(page);
  //   setLoadedPages([1]);
  //   setSize(pageSize);
  //   const JobListOptions = {
  //     pageid: page,
  //     status: "SAVE",
  //   };
  //   dispatch(GetSavedJobs(JobListOptions));
  //   dispatch(resetSaveUnsaveCreator());
  // };
  useEffect(() => {
    if (savedjobs?.data?.jobs?.length > 0) {
      setCurrentPage((prevPage) => prevPage + 1);
      setLoadedPages([1]);
      setSavedData((prevData) => [...prevData, ...savedjobs?.data?.jobs]);
    }
  }, [savedjobs?.data]);

  // useEffect(() => {}, [size, currentpage, savedjobs]);

  useEffect(() => {
    setLoadedPages([1]);
    setCurrentPage(1);
    let savedjobbody = {
      pageid: 1,
      status: "SAVE",
    };

    if (saveOrUnsave.code === 200) {
      dispatch(GetSavedJobs(savedjobbody));
      setSavedData([]);
    }
  }, [saveOrUnsave]);

  useEffect(() => {
    setLoadedPages([1]);
    setSavedData([]);
    setCurrentPage(1);
    let body = {
      pageid: 1,
      status: "SAVE",
    };
    dispatch(GetSavedJobs(body));
    setLoadedPages((prevLoadedPages) => [...prevLoadedPages, currentpage]);
  }, []);
  const ref = useRef<HTMLDivElement>(null);
  function handleScroll() {
    const { scrollTop, clientHeight, scrollHeight } = ref.current || {};

    if (
      scrollTop &&
      clientHeight &&
      scrollHeight &&
      scrollTop + clientHeight >= scrollHeight - 5
    ) {
      if (
        savedjobs?.data?.jobs?.length &&
        savedjobs?.data?.jobs?.length === 10 &&
        !loadjobs
      ) {
        setCurrentPage(1);

        setCurrentPage((prevPage) => prevPage + 1);
        let body = {
          pageid: currentpage,
          status: "SAVE",
        };
        dispatch(GetSavedJobs(body));
        setLoadedPages((prevLoadedPages) => [...prevLoadedPages, currentpage]);
      }
    }
  }

  return (
    <div
      style={{ overflow: "auto", maxHeight: "100vh" }}
      onScroll={() => {
        handleScroll();
      }}
      ref={ref}
    >
      <div className="page-content bg-white contentHeight">
        <div className="content-block">
          <div className="browse-job section-full bg-white p-t50 p-b20">
            <div className="container">
              <div className="job-bx browse-job clearfix mt-5 m-b30">
                <div className="job-bx-title clearfix NativeTitle">
                  <h5 className="font-weight-700 pull-left text-uppercase">
                    My saved jobs
                  </h5>

                  <div className="float-right ">
                    <Stack direction="row" spacing={1}>
                      {!loadjobs ? (
                        <Chip
                          avatar={
                            <Avatar
                              className="btn site-button btn-sm "
                              style={{
                                color: "white",
                                backgroundColor: "blue",
                              }}
                            >
                              {savedjobs?.data?.totalCount
                                ? savedjobs?.data?.totalCount
                                : "0"}
                            </Avatar>
                          }
                          label={
                            <span className="custom-job-content text-bold">
                              Total Saved Jobs
                            </span>
                          }
                        />
                      ) : (
                        <Chip
                          avatar={
                            <Skeleton
                              animation="wave"
                              variant="circular"
                              width={20}
                              height={20}
                            />
                          }
                          label={<Skeleton style={{ width: "100px" }} />}
                        />
                      )}
                    </Stack>
                  </div>
                </div>

                <div className="row">
                  {!loadjobs &&
                    savedData.length > 0 &&
                    savedData.map((c: any) => {
                      return (
                        <div className="col-md-6 mb-3 " key={c?._id}>
                          <SavedJobCard job={c} />
                        </div>
                      );
                    })}
                </div>

                <div className="row">
                  {loadjobs &&
                    dummyArray.map((c: any) => {
                      return (
                        <div className="col-md-6 " key={c?._id}>
                          <JobCard_Skl />
                        </div>
                      );
                    })}
                </div>
                {savedjobs?.data?.totalCount
                  ? savedjobs?.data?.totalCount == 0
                  : true &&
                    savedData.length === 0 && (
                      <center>
                        <img
                          src={NodataFound}
                          alt=""
                          style={{ width: "40%" }}
                        />
                        <br />
                        <h6 className="font-weight-bold">
                          Oops no record found.
                        </h6>
                      </center>
                    )}

                {loadjobs && savedData.length !== 0 && (
                  <div className="mt-3" style={{ textAlign: "center" }}>
                    <CircularProgress />
                  </div>
                )}
                {!loadjobs &&
                  savedData.length !== 0 &&
                  savedData.length == savedjobs?.data?.totalCount &&
                  savedData.length > 10 && (
                    <div className="mt-3" style={{ textAlign: "center" }}>
                      <h6 className="font-weight-bold">
                        Oops no record found.
                      </h6>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SavedJobs;
