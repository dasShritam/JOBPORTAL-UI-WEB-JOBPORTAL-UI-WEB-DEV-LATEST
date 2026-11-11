import { useDispatch, useSelector } from "react-redux";
import { lazy, useEffect, useRef, useState } from "react";
import {
  formatNumberToSalary,
  getDateDifference,
  Content,
  convertHtmlToText,
  openInNewTab,
} from "../../../common/common";
import { Tooltip } from "@mui/material";
import {
  PatchSaveUnSaveJob,
  resetSaveUnsaveCreator,
} from "../../../redux/features/jobs/saved-jobs/SavedJobsSlice";
import {
  authfindJob,
  findJob,
  resetAuthJobSearchCreator,
  resetJobSearchCreator,
} from "../../../redux/features/jobs/job-listing/JobListingSlice";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import { useNavigate } from "react-router-dom";
import {
  companySAS,
  successCompnySAS,
} from "../../../redux/features/jobs/job-applications/downloadCompSASSlice";
import JobCardSk from "../../shared/JobCard_Sk";

const JobCard = lazy(() => import("../../shared/JobCard"));
const Pagination = lazy(() => import("rc-pagination"));

function JobsList(dataProp) {
  const { res, loading } = useSelector((state: any) => state.findJob);
  const { response, load } = useSelector((state: any) => state.authfindJob);

  const isLoggedIn = sessionStorage.getItem("access_token") ? true : false;
  const dynamicRes = isLoggedIn ? response : res;

  var notfoundImg = require("../../../assets/images/background/No-record.png");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const showSnackAlert = UseToastAlert();
  const { saveOrUnsave, loadingSave } = useSelector(
    (state: any) => state.PatchSaveUnSaveJobSlice
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const { sasComp, loadC } = useSelector((state: any) => state.companySAS);
  const [currentpage, setCurrentPage] = useState(1),
    [perPage, setPerPage] = useState(12),
    [size, setSize] = useState(perPage),
    [data, setData] = useState<any[]>([]),
    [myLoading, setMyLoading] = useState(false);

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
    setMyLoading(true);
    if (dynamicRes && dynamicRes?.code && dynamicRes?.code === 200) {
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
    setMyLoading(false);
  }, [dynamicRes, dynamicRes?.response?.status]);
  const textLimit = 70;

  return (
    <>
      {dataProp?.showRecords && (
        <div className="job-bx-title clearfix">
          <h5 className="font-weight-700 pull-left text-uppercase">
            {dynamicRes?.data?.totalCount
              ? `${dynamicRes?.data?.totalCount} Job${
                  dynamicRes?.data?.totalCount > 0 ? `s` : ""
                } Found`
              : `${dynamicRes?.data?.jobs?.length} Job${
                  dynamicRes?.data?.totalCount > 0 ? `s` : ""
                } Found`}
          </h5>
          <div className="float-right"></div>
        </div>
      )}

      <div className="col-xl-12 col-lg-12 col-md-12">
        {/* <JobCard dataProp={dataProp} /> */}
        <div className="content-block">
          {dynamicRes?.data &&
            dynamicRes?.data?.jobs?.length === 0 &&
            !dynamicLoading && (
              <center>
                <div className="col-lg-6">
                  <img src={notfoundImg} alt="" />
                  <h6 style={{ fontSize: "13px", fontWeight: "bold" }}>
                    Oops no record found.
                  </h6>
                </div>
              </center>
            )}

          <div className="row">
            {!dynamicLoading ? (
              dynamicRes &&
              dynamicRes?.data?.jobs?.length > 0 &&
              dynamicRes?.data?.jobs?.map((c) => {
                const modal = {
                  title: c.title,
                  companyName: c.employer?.company_name,
                  exp: c.exp,
                  location: c?.location,
                  skills: c?.skills,
                  jobDesc: c.job_desc,
                  salary: c.salary,
                  application_status: {
                    self: c?.application_status?.self,
                  },
                  jobid: c.jobid,
                  compId: c.companyid,
                  createdAt: c.updated_at ? c.updated_at : c.created_at,
                  hideApply: true,
                  recommended: c.recommended,
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

          {/* {dynamicLoading && <JobCard_Sk />} */}

          {dynamicRes?.data?.jobs &&
            dynamicRes?.data?.jobs?.length > 0 &&
            !dynamicLoading && (
              <div className="pagination-bx float-right m-t10">
                <Pagination
                  className="pagination-data"
                  onChange={PaginationChange}
                  total={dynamicRes?.data?.totalCount}
                  current={currentpage}
                  pageSize={size}
                  showSizeChanger={true}
                  itemRender={PrevNextArrow}
                  onShowSizeChange={PerPageChange}
                />
              </div>
            )}
        </div>
      </div>
    </>
  );
}

export default JobsList;
