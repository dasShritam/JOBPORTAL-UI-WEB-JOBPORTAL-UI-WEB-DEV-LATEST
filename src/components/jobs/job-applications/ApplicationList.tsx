import CheckIcon from "@mui/icons-material/Check";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import { Button } from "@mui/material";
import Pagination from "rc-pagination";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../../../assets/customCss/Pagination.css";
import { StateWiesPlaces } from "../../../common/common";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import { updateAppStatus } from "../../../redux/features/employer/applicationStatusslice";
import { resetViewAppActionCreator } from "../../../redux/features/jobs/job-applications/ApplicationSlice";
import { resetAppStatusRestset2 } from "../../../redux/features/jobs/job-applications/ApplicationStatusSlice";
import {
  downloadSAS,
  resetSAS,
  successSAS,
} from "../../../redux/features/jobs/job-applications/downloadSASSlice";
import ApplicantCardRe from "./ApplicantCardRe";
import ApplicantCardSkeleton from "./ApplicantCardSkeleton";
const NodataFound = require("../../../assets/images/background/No-record.png");

interface CardData {
  userid: string;
  jobid: string;
  name: string;
  resume: string;
  ms: boolean;
  profileid: string;
  fresher: boolean;
  status: string;
  pendingStatus: boolean;
  exp: string; //"4y 1m"
  expectedCtc: string;
  currentLoc: string;
  phone: string; //"+91 8660793556";
  email: string;
  score: number;
  pervious: string[];
  education: string[];
  preferLoc: string[]; //["bangalore", "mysore", "djbhds"];
  keySkills: string[]; //["Reactjs", "java", "javaScript"];
  checked: boolean;
}
function ApplicationList(props: any) {
  const navigate = useNavigate(),
    [selectAll, setSelectAll] = useState(false),
    [currentpage, setCurrentPage] = useState(1),
    [perPage, setPerPage] = useState(10),
    [size, setSize] = useState(perPage),
    [count, setCount] = useState(0),
    [data, setData] = useState<CardData[]>([]),
    [isChecked, setIsChecked] = useState(false),
    [loader, setLoader] = useState(false),
    showSnackAlert = UseToastAlert(),
    PerPageChange = (value: any) => {
      setSize(value);
      if (data) {
        Math.ceil(data?.length / value);
      }
    },
    dispatch = useDispatch(),
    { viewApp, lodingV } = useSelector((state: any) => state.viewApplication),
    { sasData, load } = useSelector((state: any) => state.downloadSAS),
    { ApplicationStatus, loadingStatuss } = useSelector(
      (state: any) => state.appStatus
    ),
    { ApplicationStatus2, loadingStatus2, appln_info } = useSelector(
      (state: any) => state.appStatus2
    );
  useEffect(() => {
    if (
      ApplicationStatus &&
      ApplicationStatus?.code &&
      ApplicationStatus?.code === 200
    ) {
      props?.formik?.handleSubmit();
      showSnackAlert("success", ApplicationStatus?.message);
    }
    if (
      ApplicationStatus &&
      ApplicationStatus?.code &&
      ApplicationStatus?.code !== 200
    ) {
      showSnackAlert("warning", ApplicationStatus?.message);
    }
  }, [ApplicationStatus]);
  useEffect(() => {
    if (
      ApplicationStatus2 &&
      ApplicationStatus2?.code &&
      ApplicationStatus2?.code === 200 &&
      appln_info?.status?.toLowerCase() === "view"
    ) {
      props?.formik?.handleSubmit();
    } else if (
      ApplicationStatus2 &&
      ApplicationStatus2?.code &&
      ApplicationStatus2?.code === 200
    ) {
      props?.formik?.handleSubmit();
    } else if (
      ApplicationStatus2 &&
      ApplicationStatus2?.code &&
      ApplicationStatus2?.code !== 200
    ) {
      showSnackAlert("warning", ApplicationStatus2?.message);
    }
    dispatch(resetAppStatusRestset2());
  }, [loadingStatus2, ApplicationStatus2?.code]);
  useEffect(() => {
    setLoader(true);
    if (viewApp && viewApp?.code && viewApp?.code === 200) {
      setCount(viewApp?.data?.totalCount ? viewApp?.data?.totalCount : 0);
      data.splice(0, data?.length + 1);
      const userids = viewApp?.data?.application?.map((e: any) => {
        const val = e?.applicantInfo;
        data.push({
          userid: val?.userid,
          jobid: e?.jobInfo?.jobid,
          profileid: val?.profileid,
          name: val?.name ? val?.name : "Not Available",
          fresher: val?.fresher,
          ms: e?.jobInfo?.mileStone?.filter((ele: any) => ele.sts === "VIEW")
            ?.length
            ? true
            : false,
          exp:
            (val?.experiance?.yr === 0 || val?.experiance?.yr) &&
            (val?.experiance?.mos === 0 || val?.experiance?.mos)
              ? `${val?.experiance?.yr} Year ${val?.experiance?.mos} Month`
              : "Not Available",
          resume: val?.resume ? val?.resume : "Not Available",
          expectedCtc:
            val?.experiance?.cctc?.val && val?.experiance?.cctc?.cy
              ? `${val?.experiance?.cctc?.cy === "INR" ? "₹" : "$"}${
                  val?.experiance?.cctc?.val
                }`
              : "Not Available",
          currentLoc: val?.location?.city
            ? val?.location?.city
            : "Not Available",
          phone:
            val?.mobileCode && val?.mobileNo
              ? `${val?.mobileCode} ${val?.mobileNo}`
              : "Not Available",
          email: val?.mail ? val?.mail : "Not Available",
          pendingStatus: false,
          status: e?.jobInfo?.status,
          score: e?.jobInfo?.score,
          pervious: val?.company?.length ? [...val?.company] : [],
          education: val?.course.length ? [...val?.course] : [],
          keySkills: val?.skills?.key ? [...val?.skills?.key] : [],
          preferLoc: val?.locations ? StateWiesPlaces(val?.locations) : [],
          checked: false,
        });
        return e?.applicantInfo?.userid;
      });
      setData([...data]);
      userids.length
        ? dispatch(
            downloadSAS({
              id: [...userids],
              sasFor: "IMG",
            })
          )
        : dispatch(successSAS());
    }
    setLoader(false);
  }, [viewApp]);
  const bulkStateUpdate = (state: any) => {
      const inputData = {
        status: state,
        applicants_info: data
          ?.filter((d) => d?.checked === true)
          ?.map((c) => {
            return {
              job_id: c?.jobid,
              applicant_id: c?.userid,
            };
          }),
      };
      dispatch(resetViewAppActionCreator());
      dispatch(resetSAS());
      handleConfirmSwal(inputData);
    },
    handleConfirmSwal = (inputData: any) => {
      Swal.fire({
        title: "Are you sure?",
        text: `Do you want to ${
          inputData?.status === "SHORTLIST" ? "shortlist" : "reject"
        } selected applicant`,
        showCancelButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "red",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result?.isConfirmed) {
          dispatch(updateAppStatus(inputData));
        }
      });
    },
    PrevNextArrow = (current: any, type: any, originalElement: any) => {
      if (type === "prev") {
        return (
          <button
            title="prev"
            className="previous"
            style={{ borderColor: "#eae6e6", borderRadius: "2px" }}
          >
            <i className="ti-arrow-left"></i> Prev
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
            Next <i className="ti-arrow-right"></i>
          </button>
        );
      }
      return originalElement;
    },
    PaginationChange = (page: any, pageSize: any) => {
      setCurrentPage(page);
      setSize(pageSize);
      props.formik.values.pageNo = page;
      props?.formik?.handleSubmit();
    },
    handleAllCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
      setIsChecked(event?.target?.checked);
      setData((prev) =>
        prev.map((checkbox) => ({
          ...checkbox,
          checked: event?.target?.checked,
        }))
      );
    },
    handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = event?.target;
      setData((prev) =>
        prev?.map((checkbox) =>
          checkbox?.userid === name ? { ...checkbox, checked } : checkbox
        )
      );
      setIsChecked(data?.every((checkbox) => checkbox?.checked === true));
    };
  useEffect(() => {
    setIsChecked(data?.every((checkbox) => checkbox?.checked));
  }, [data]);
  return (
    <div className="col-xl-12 col-lg-12 col-md-12">
      {(loader || load || lodingV) && <ApplicantCardSkeleton />}
      {!(loader || load || lodingV) && data?.length !== 0 && (
        <div>
          <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12">
              <div className="m-b30">
                <div
                  className=" form-control d-flex justify-content-between"
                  style={{ height: "50px" }}
                >
                  <div
                    className=" d-flex justify-content-between"
                    style={{ alignItems: "center" }}
                  >
                    <div className="form-group" style={{ marginBottom: "0%" }}>
                      <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          id="check"
                          name="checkbox"
                          checked={isChecked}
                          value={"selectAll"}
                          className="custom-control-input"
                          onChange={handleAllCheck}
                        />
                        <label className="custom-control-label" htmlFor="check">
                          Select All
                        </label>
                      </div>
                    </div>
                    <Button
                      disabled={
                        !isChecked ||
                        props?.formik?.values?.access === "shortlist"
                      }
                      style={
                        !isChecked ||
                        props?.formik?.values?.access === "shortlist"
                          ? { cursor: "default" }
                          : { cursor: "pointer" }
                      }
                      sx={{ color: "grey", height: 42, textTransform: "none" }}
                      variant="text"
                      onClick={() => isChecked && bulkStateUpdate("SHORTLIST")}
                    >
                      <CheckIcon fontSize="small" />
                      &nbsp; Shortlist
                    </Button>
                    <Button
                      disabled={
                        !isChecked ||
                        props?.formik?.values?.access === "rejected"
                      }
                      style={
                        !isChecked ||
                        props?.formik?.values?.access === "rejected"
                          ? { cursor: "default" }
                          : { cursor: "pointer" }
                      }
                      sx={{ color: "grey", height: 42, textTransform: "none" }}
                      variant="text"
                      onClick={() => isChecked && bulkStateUpdate("REJECT")}
                    >
                      <DoNotDisturbAltIcon fontSize="small" />
                      &nbsp; Reject
                    </Button>
                  </div>
                </div>
              </div>

              <div className="row job-grid" style={{ padding: "0px" }}>
                {data?.map((item, index) => (
                  <div
                    key={index}
                    className={"col-xl-6 col-lg-6 col-md-6 col-sm-12 mt-1 mb-1"}
                  >
                    <ApplicantCardRe
                      selectAll={selectAll}
                      item={item}
                      img={sasData?.code === 200 ? sasData?.data : []}
                      handleCheckboxChange={handleCheckboxChange}
                    />
                  </div>
                ))}
              </div>
              <div className="float-right">
                <center className="d-flex">
                  <Pagination
                    className="pagination-data mt-4"
                    onChange={PaginationChange}
                    total={count}
                    current={currentpage}
                    pageSize={size}
                    showSizeChanger={true}
                    itemRender={PrevNextArrow}
                    onShowSizeChange={PerPageChange}
                  />
                </center>
              </div>
            </div>
          </div>
        </div>
      )}
      {((!(loader || load || lodingV) &&
        viewApp?.data?.application?.length == 0 &&
        data?.length === 0) ||
        viewApp?.code === 400) && (
        <center>
          <div>
            <img src={NodataFound} alt="" style={{ width: "65%" }} />
            <br />
            <p>
              No applications are present for this filter options or selection
            </p>
          </div>
        </center>
      )}
    </div>
  );
}

export default ApplicationList;
