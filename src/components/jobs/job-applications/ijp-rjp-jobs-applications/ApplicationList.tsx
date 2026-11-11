import CheckIcon from "@mui/icons-material/Check";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import { Button } from "@mui/material";
import Pagination from "rc-pagination";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import "../../../../assets/customCss/Pagination.css";
import { getTimestampToDate } from "../../../../common/common";
import { environment } from "../../../../environments/environment";
import { UseToastAlert } from "../../../../hooks/useToastAlert";
import { resetAppStatusRestset2 } from "../../../../redux/features/jobs/job-applications/ApplicationStatusSlice";
import { resetSAS } from "../../../../redux/features/jobs/job-applications/downloadSASSlice";
import { resetViewIjpRjpAppActionCreator } from "../../../../redux/features/jobs/job-applications/ijp-rjp-jobs-applications/IjpRjpApplicationSlice";
import { updateIjpRjpAppStatus2 } from "../../../../redux/features/jobs/job-applications/ijp-rjp-jobs-applications/IjpRjpApplicationStatusSlice";
import ApplicantCardSkeleton from "../ApplicantCardSkeleton";
import ApplicantCard from "./ApplicantCard";
import { useNavigate } from "react-router-dom";
const NodataFound = require("../../../../assets/images/background/No-record.png");

interface CardData {
  userid: string;
  jobid: string;
  name: string;
  img: string;
  reason: string;
  role: string;
  ms: boolean;
  status: string;
  exp: string;
  expectedCtc: string;
  currentLoc: string;
  email: string;
  joiningDate: string;
  education: string[];
  reLoc: boolean;
  refer: string;
  referId: string;
  keySkills: string[]; //["Reactjs", "java", "javaScript"];
  checked: boolean;
  certification: null;
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
    { viewApp, lodingV } = useSelector(
      (state: any) => state.viewIjpRjpApplication
    ),
    { sasData, load } = useSelector((state: any) => state.downloadSAS),
    { ApplicationStatus2, loadingStatus2, appln_info } = useSelector(
      (state: any) => state.appIjpRjpStatus
    );
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
      showSnackAlert("success", ApplicationStatus2?.message);
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
      data.splice(0, data?.length + 1);
      setCount(viewApp?.data?.totalCount);
      viewApp?.data?.application?.map(async (e: any) => {
        const val = e?.applicantInfo;
        let tempImg = "",
          tempData: CardData | any = {};
        tempData = {
          userid: val?.application_id,
          jobid: e?.jobInfo?.jobid,
          name: val?.name ? val?.name : "Not Available",
          ms: val?.over_all_status_empl !== null ? true : false,
          joiningDate: val?.joining_date
            ? getTimestampToDate(val?.joining_date)
            : "Not Available",
          exp: val?.experiance
            ? `${Math.floor(val?.experiance / 12)}y ${val?.experiance % 12}m`
            : "Not Available",
          img: tempImg ? tempImg : "",
          reason: val?.reason ? val?.reason : "Not Available",
          role: val?.role ? val?.role : "Not Available",
          expectedCtc:
            val?.expected_salary?.val && val?.expected_salary?.cy
              ? `${val?.expected_salary?.cy === "INR" ? "₹" : "$"}${
                  val?.expected_salary?.val
                }`
              : "Not Available",
          currentLoc: val?.location ? val?.location : "Not Available",
          email: val?.mail ? val?.mail : "Not Available",
          status: val?.over_all_status_empl,
          education: val?.education[0]?.course
            ? [val?.education[0]?.course]
            : [],
          keySkills: val?.skills ? [...val?.skills] : [],
          reLoc: val?.reLocations_assistance,
          checked: false,
          refer: val?.reference_details?.name
            ? val?.reference_details?.name
            : "Not Available",
          referId: val?.reference_details?.emp_id
            ? val?.reference_details?.emp_id
            : "Not Available",
          certification: val?.certification ? val?.certification : [],
        };
        data.push(tempData);
        setData([...data]);
      });
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
              _id: c?.userid,
            };
          }),
      };
      dispatch(resetViewIjpRjpAppActionCreator());
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
          dispatch(updateIjpRjpAppStatus2(inputData));
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
                      sx={{
                        color: "grey",
                        height: 42,
                        textTransform: "none",
                      }}
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
                      sx={{
                        color: "grey",
                        height: 42,
                        textTransform: "none",
                      }}
                      variant="text"
                      onClick={() => isChecked && bulkStateUpdate("REJECT")}
                    >
                      <DoNotDisturbAltIcon fontSize="small" />
                      &nbsp; Reject
                    </Button>
                  </div>
                </div>
              </div>

              <ul className="post-job-bx">
                {data?.map((item, index) => {
                  return (
                    <li key={index}>
                      <ApplicantCard
                        selectAll={selectAll}
                        item={item}
                        handleCheckboxChange={handleCheckboxChange}
                      />
                    </li>
                  );
                })}
              </ul>
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
