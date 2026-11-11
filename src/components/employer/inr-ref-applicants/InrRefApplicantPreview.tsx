import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import {
  convertformatTimestamp,
  convertformatTimestampByNaushad,
  formatExperience,
  formatExperience1,
} from "../../../common/common";
import { InrRefApplicantData } from "../../../redux/features/employer/inr-ref-applicants/InrRefApplicantPreviewSlice";
import InrRefApplicantPreview_Skeleton from "./InrRefApplicantPreview_Skeleton";

function InrRefApplicantPreview() {
  const InrRef = useSelector((state: any) => state.InrRefApplicantData);
  const { InrRefApplicantArray, loadingInrRefApplicant } = InrRef;
  const dispatch = useDispatch();
  const backURL: any =
    sessionStorage && sessionStorage?.getItem("goBack")
      ? sessionStorage?.getItem("goBack")
      : "";
  const id = useParams();
  useEffect(() => {
    let data = {
      params: {
        application_id: id?.id,
      },
    };

    dispatch(InrRefApplicantData(data));
  }, [id]);

  const handleDownloadResume = (data) => {
    window.location.href = data;
  };

  return (
    <div className="page-content">
      <div className="content-block">
        <div className="section-full browse-job content-inner-2">
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12"></div>
          {!loadingInrRefApplicant ? (
            <div className="container" style={{ marginTop: "60px" }}>
              {InrRefApplicantArray?.applicant_info && (
                <div className="row" style={{ alignItems: "center" }}>
                  <div className="col-md-2 col-sm-12 col-lg-2"></div>
                  <div className="col-12 col-md-8 col-lg-8">
                    <div className="job-bx bg-white">
                      <div className="header-container">
                        {/* <div className="job-bx-title backli clearfix">
                          <Link
                            to={goBack?.url}
                            onClick={(e) => {
                              setGoBack(null);
                            }}
                            className="site-button mt-2 right-arrow button-sm float-right"
                          >
                            Go Back
                          </Link>
                        </div> */}
                        <Link
                          to={backURL}
                          onClick={(e) => {
                            sessionStorage.removeItem("goBack");
                          }}
                          className="site-button mt-2 right-arrow button-sm float-right"
                        >
                          Go Back
                        </Link>
                        <div className="d-flex justify-content-between">
                          <span
                            className="job-title"
                            style={{ wordBreak: "break-all" }}
                          >
                            {InrRefApplicantArray?.applicant_info?.name ||
                              "Not available"}
                            {InrRefApplicantArray?.applicant_info?.employee_id
                              ? ` (${InrRefApplicantArray?.applicant_info?.employee_id})`
                              : ""}
                          </span>
                          {/* <button
                            className="site-button btn-sm"
                            onClick={() =>
                              handleDownloadResume(
                                InrRefApplicantArray?.applicant_resume
                              )
                            }
                          >
                            Download Resume
                          </button> */}
                        </div>
                      </div>

                      <br />

                      <div className="row">
                        {/* <div className="d-flex justify-content-between"> */}
                        <div className="col-md-6 col-sm-6 col-lg-6 ">
                          <div className="job-desc">
                            <span className="job-desc-label">
                              Email :&nbsp;
                            </span>
                            <span
                              className="job-desc-content"
                              style={{ wordBreak: "break-word" }}
                            >
                              {InrRefApplicantArray?.applicant_info?.mail
                                ? InrRefApplicantArray?.applicant_info?.mail
                                : "Not available"}
                            </span>
                          </div>
                          {InrRefApplicantArray?.applicant_info?.name && (
                            <div
                              className="job-desc"
                              // style={{
                              //   alignItems: "baseline",
                              //   flexDirection: "column",
                              // }}

                              style={{
                                display: "flex",
                                alignItems: "baseline",
                                flexDirection: "row",
                              }}
                            >
                              <span
                                className="job-desc-label"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                Reference Name :&nbsp;
                              </span>
                              <span
                                className="job-desc-content"
                                style={{
                                  wordBreak: "break-word",
                                  whiteSpace: "normal",
                                }}
                              >
                                {InrRefApplicantArray?.applicant_info?.name
                                  ? InrRefApplicantArray?.applicant_info?.name
                                  : "Not available"}
                              </span>
                            </div>
                          )}
                          <div className="job-desc">
                            <span className="job-desc-label">
                              Expected Salary :&nbsp;
                            </span>
                            <span className="job-desc-content">
                              {InrRefApplicantArray?.applicant_info
                                ?.expected_salary?.cy === "INR"
                                ? "₹"
                                : "$"}{" "}
                              {InrRefApplicantArray?.applicant_info
                                ?.expected_salary?.val || "Not available"}
                            </span>
                          </div>
                          <div
                            className="job-desc"
                            // style={{
                            //   alignItems: "baseline",
                            //   flexDirection: "column",
                            // }}

                            style={{
                              display: "flex",
                              alignItems: "baseline",
                              flexDirection: "row",
                            }}
                          >
                            <span
                              className="job-desc-label"
                              style={{ whiteSpace: "nowrap" }}
                            >
                              Role :&nbsp;
                            </span>
                            <span
                              className="job-desc-content"
                              style={{
                                wordBreak: "break-word",
                                whiteSpace: "normal",
                              }}
                            >
                              {InrRefApplicantArray?.applicant_info?.role
                                ? InrRefApplicantArray?.applicant_info?.role
                                : "Not available"}
                            </span>
                          </div>
                        </div>
                        <div className="col-md-6 col-sm-6 col-lg-6 ">
                          <div>
                            <div className="job-desc">
                              <span className="job-desc-label">
                                Location :&nbsp;
                              </span>
                              <span
                                className="job-desc-content"
                                style={{ wordBreak: "break-word" }}
                              >
                                {InrRefApplicantArray?.applicant_info?.location
                                  ? InrRefApplicantArray?.applicant_info
                                      ?.location
                                  : "Not available"}
                              </span>
                            </div>
                            {InrRefApplicantArray?.applicant_info
                              ?.reference_details?.emp_id && (
                              <div className="job-desc">
                                <span className="job-desc-label">
                                  Reference Id :&nbsp;
                                </span>
                                <span className="job-desc-content">
                                  {InrRefApplicantArray?.applicant_info
                                    ?.reference_details?.emp_id
                                    ? InrRefApplicantArray?.applicant_info
                                        ?.reference_details?.emp_id
                                    : "Not available"}
                                </span>
                              </div>
                            )}
                            <div className="job-desc">
                              <span className="job-desc-label">
                                Experience :&nbsp;
                              </span>
                              {/* <span className="job-desc-content">
                                {formatExperience(
                                  InrRefApplicantArray?.applicant_info
                                    ?.experiance
                                    ? InrRefApplicantArray?.applicant_info
                                        ?.experiance
                                    : "Not available"
                                )}
                              </span> */}

                              <span className="job-desc-content">
                                {formatExperience1(
                                  InrRefApplicantArray?.applicant_info
                                    ?.experiance !== "0"
                                    ? InrRefApplicantArray?.applicant_info
                                        ?.experiance
                                    : "No experience"
                                )}
                              </span>
                            </div>
                            <div className="job-desc">
                              <span className="job-desc-label">
                                Relocation Assistance :&nbsp;
                              </span>
                              <span className="job-desc-content">
                                {InrRefApplicantArray?.applicant_info
                                  ?.reLocations_assistance
                                  ? "Yes"
                                  : "No"}
                              </span>
                            </div>
                          </div>
                        </div>
                        {/* </div> */}
                      </div>
                      <br />
                      <div
                        className="col-md-12 col-sm-12 col-lg-12"
                        style={{ marginLeft: "-16px" }}
                      >
                        <div className="job-desc" style={{ display: "block" }}>
                          <div>
                            <span
                              className="job-desc-label"
                              style={{ wordBreak: "break-word" }}
                            >
                              Skills &nbsp;
                            </span>
                          </div>

                          <div>
                            {/* <span className="job-desc-content">
                            {InrRefApplicantArray?.applicant_info?.skills?.map(
                              (c) => (
                                <span className="custom-chip">{c}</span>
                              )
                            )}
                          </span> */}

                            <span className="job-desc-content">
                              {InrRefApplicantArray?.applicant_info?.skills &&
                              InrRefApplicantArray?.applicant_info?.skills
                                ?.length > 0
                                ? InrRefApplicantArray?.applicant_info?.skills?.map(
                                    (c) => (
                                      <span className="custom-chip">{c}</span>
                                    )
                                  )
                                : "Not available"}
                            </span>
                          </div>
                        </div>
                        <div className="job-desc" style={{ display: "block" }}>
                          <div>
                            {" "}
                            <span
                              className="job-desc-label"
                              style={{ wordBreak: "break-word" }}
                            >
                              Education &nbsp;
                            </span>
                          </div>
                          {/* <span className="job-desc-content">
                          {InrRefApplicantArray?.applicant_info?.education?.map(
                            (edu, index) => (
                              <span key={index}>
                                {edu.course} - {edu.stream}
                              </span>
                            )
                          )}
                        </span> */}
                          <div>
                            {" "}
                            <span className="job-desc-content">
                              {InrRefApplicantArray?.applicant_info
                                ?.education &&
                              InrRefApplicantArray?.applicant_info?.education
                                ?.length > 0
                                ? InrRefApplicantArray?.applicant_info?.education?.map(
                                    (edu, index) => (
                                      <span className="custom-chip" key={index}>
                                        {edu?.course} -{" "}
                                        {edu?.stream?.join(", ")}
                                      </span>
                                    )
                                  )
                                : "Not available"}
                            </span>
                          </div>
                        </div>
                        <div className="job-desc" style={{ display: "block" }}>
                          <div>
                            <span className="job-desc-label">
                              Certificate &nbsp;
                            </span>
                          </div>

                          <div>
                            {/* <span
                              className="custom-chip"
                              style={{ wordBreak: "break-word" }}
                            >
                              {InrRefApplicantArray?.applicant_info
                                ?.certification.length>0 ?
                                 InrRefApplicantArray?.applicant_info
                                    ?.certification?.map(cert,index)=>(
                                      <span className="custom-chip" key={index}>
                                        {cert.label} 
                                    )
                                : "Not available"}
                            </span> */}

                            <span
                              // className="custom-chip"
                              className="job-desc-content"
                              style={{ wordBreak: "break-word" }}
                            >
                              {InrRefApplicantArray?.applicant_info
                                ?.certification?.length > 0
                                ? InrRefApplicantArray?.applicant_info?.certification?.map(
                                    (cert, index) => (
                                      <span className="custom-chip" key={index}>
                                        {cert?.label}
                                      </span>
                                    )
                                  )
                                : "Not available"}
                            </span>
                          </div>
                        </div>
                        <div className="job-desc">
                          <span className="job-desc-label">
                            Available On :&nbsp;
                          </span>
                          <span className="job-desc-content">
                            {convertformatTimestamp(
                              InrRefApplicantArray?.applicant_info?.joining_date
                                ? InrRefApplicantArray?.applicant_info
                                    ?.joining_date
                                : "Not available"
                            )}
                          </span>
                        </div>
                        <div className="job-desc d-flex justify-content-between">
                          <div
                            style={{
                              wordWrap: "break-word",
                              display: "flex",
                              alignItems: "baseline",
                              flexDirection: "row",
                            }}
                          >
                            <span
                              className="job-desc-label"
                              style={{ whiteSpace: "nowrap" }}
                            >
                              Reason to Apply :&nbsp;
                            </span>
                            <span
                              className="job-desc-content"
                              style={{
                                wordBreak: "break-word",
                                whiteSpace: "normal",
                              }}
                            >
                              {InrRefApplicantArray?.applicant_info?.reason
                                ? InrRefApplicantArray?.applicant_info?.reason
                                : "Not available"}
                            </span>
                          </div>
                        </div>
                        <div>
                          <button
                            style={{ marginLeft: "537px" }}
                            className="site-button btn-sm"
                            onClick={() =>
                              handleDownloadResume(
                                InrRefApplicantArray?.applicant_resume
                              )
                            }
                          >
                            Download Resume
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2 col-sm-12 col-lg-2"></div>
                </div>
              )}
            </div>
          ) : (
            <InrRefApplicantPreview_Skeleton />
          )}
        </div>
      </div>
    </div>
  );
}

export default InrRefApplicantPreview;
