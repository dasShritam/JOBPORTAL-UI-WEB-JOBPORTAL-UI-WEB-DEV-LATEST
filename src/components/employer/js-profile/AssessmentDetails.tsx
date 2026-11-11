import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Content,
  GetDayFromTimeStamp,
  GetMonthNameFromTimeStamp,
  GetYearFromTimeStamp,
  formatTimestamp,
  getTimestampToDate,
} from "../../../common/common";
import { Box, Chip, Tooltip } from "@mui/material";
import { MdOutlineCopyAll } from "react-icons/md";
import { RxClipboardCopy } from "react-icons/rx";
import { BiCheck } from "react-icons/bi";
import { environment } from "../../../environments/environment";
import { GetAssessmentData } from "../../../redux/features/employer/js-view/AssessmentDetailsSlice";
interface propsType {
  userId: string;
  jobId: string;
  isEmployer?: boolean;
}
const AssessmentDetails = (props: propsType) => {
  const assData = useSelector((state: any) => state.assessmentDetailsx);
  const { Assdetails, Assloading } = assData;

  const dispatch = useDispatch();
  useEffect(() => {
    const res = {
      jsid: props.userId,
      pageId: 1,
      pageLimit: 10,
    };
    dispatch(GetAssessmentData(res));
  }, [dispatch]);

  useEffect(() => {}, [Assdetails]);

  const commonStyles = {
    bgcolor: "background.paper",
    m: 1,
    border: 1,
    width: "10rem",
    height: "4rem",
  };
  const [showCheck, setShowCheck] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const [copiedItemId, setCopiedItemId] = useState(null);

  const handleCopyClick = (id) => {
    const idToCopy = id;
    navigator.clipboard
      .writeText(idToCopy)
      .then(() => {
        setCopiedItemId(id);
        setTimeout(() => {
          setCopiedItemId(null);
        }, 2000);
      })
      .catch((error) => {
        console.error("Error copying ID to clipboard:", error);
      });
  };
  const txtlimit = 55;
  return (
    <>
      {environment?.HackerEarth && (
        <div id="Assessment_details_bx" className=" job-bx bg-white m-b30">
          <div className="d-flex">
            <span
              className="medimMatch headerp"
              style={{ color: " chocolate", fontWeight: "bold" }}
            >
              Assessment Details
            </span>
          </div>
          <div className="mainline" style={{ marginBottom: "10px" }}></div>
          {Assdetails && Assdetails?.length ? (
            <div>
              {!Assloading &&
                Assdetails?.length > 0 &&
                Assdetails?.map((items: any) => {
                  return (
                    <>
                      <div className="row" key={items.test_details.id}>
                        <div className="col-xl-8 col-lg-8 ">
                          <div>
                            <div
                              className="candi "
                              style={{ fontWeight: "bold", lineHeight: "1" }}
                            >
                              {items.test_details.name
                                ? Content(items.test_details.name, txtlimit)
                                : "Not Available"}
                            </div>
                            <div className="candi " style={{ lineHeight: "1" }}>
                              Score :
                              <span
                                className="ml-1"
                                style={{ fontSize: "20px", fontWeight: "bold" }}
                              >
                                {items.assessment_details.total_score
                                  ? items.assessment_details.total_score
                                  : "0"}
                              </span>
                              /
                              <span style={{ fontWeight: "bold" }}>
                                {items.test_details.total_score
                                  ? items.test_details.total_score
                                  : "0"}
                              </span>
                            </div>
                            <div className="candi" style={{ lineHeight: "1" }}>
                              {items.test_details.skills.map((val, index) => (
                                <span key={index}>
                                  {Content(val, txtlimit)}
                                  {index !==
                                    items.test_details.skills.length - 1 &&
                                    " | "}
                                </span>
                              ))}
                            </div>

                            <div className="candi">
                              ID:{" "}
                              {items.test_details.id
                                ? items.test_details.id
                                : "Not available"}
                              <span className="val"></span>
                              {!copiedItemId && (
                                <RxClipboardCopy
                                  title="Copy"
                                  className="ml-2"
                                  style={{ color: "blue" }}
                                  onClick={() => {
                                    handleCopyClick(items.test_details.id);
                                  }}
                                />
                              )}
                              {copiedItemId === items.test_details.id && (
                                <>
                                  <BiCheck size={24} color="green" />
                                  <span className="text-success">copied</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-xl-4 col-lg-4">
                          <div
                            className="candi"
                            style={{ position: "absolute", right: 0 }}
                          >
                            <span
                              className="mr-1"
                              style={{ fontWeight: "bold" }}
                            >
                              Generated on
                            </span>
                            {items.assessment_details.created_at
                              ? formatTimestamp(
                                  items.assessment_details.created_at
                                )
                              : "Not available"}
                          </div>

                          <div
                            className="candi  font-italic "
                            style={{
                              position: "absolute",
                              bottom: 0,
                              right: 0,
                              fontWeight: "bold",
                            }}
                          >
                            Powered by - HackerEarth
                          </div>
                        </div>
                      </div>
                      <div
                        className="mainline"
                        style={{ marginBottom: "10px" }}
                      ></div>
                    </>
                  );
                })}
            </div>
          ) : (
            <div className="notavail">Not Available</div>
          )}
        </div>
      )}
    </>
  );
};

export default AssessmentDetails;
