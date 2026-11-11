import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "rc-pagination";
import "../../../assets/customCss/Pagination.css";
import "../../../assets/customCss/jobs/manage-jobs.css";
import { useDispatch, useSelector } from "react-redux";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import {
    getAssessmentData,
    getAssessmentStatistics,
} from "../../../redux/features/jobSeeker/JsAssessmentSlice";
import { Button, Modal } from "react-bootstrap";
import { BsClock, BsCloudDownload, BsPersonWorkspace } from "react-icons/bs";
import { MdOutlineCurrencyRupee } from "react-icons/md";
import AssessAdmin_Sk from "./AssessAdmin_Skl";
import { Chip, IconButton, Switch, Tooltip } from "@mui/material";
import {
    EnableDisableAssessment,
    UpdateCost,
    getDownloadAssessment,
    resetAddAssessment,
    resetEditAssessment,
    resetStatusAssessment,
    resetUpdateCurrency,
    resetviewAssessmentSl,
} from "../../../redux/features/admin/Assessment/manageAssessmentSlice";
import { BiEditAlt } from "react-icons/bi";
import {
    convertSecondsToHours,
    getTimestampToDate,
} from "../../../common/common";
import { SlCalender } from "react-icons/sl";
import { CgNotes } from "react-icons/cg";
import { FaChartLine } from "react-icons/fa";
var notfoundImg = require("../../../assets/images/background/No-record.png");

function AssessAdminCard(props: any) {
    const dispatch = useDispatch();
    const [displayData, setDisplayData] = useState<any>([]);

    const AssessDetails = useSelector((state: any) => state.AssessmentData);
    const { jsAssRes, jsloading } = AssessDetails;

    // Assesment details API
    const AssessmentDetails = useSelector(
        (state: any) => state.AssessmentBrief
    );
    const { assessmentBrief, assessLoading } = AssessmentDetails;

    // Update Staus Test
    const StatusTest = useSelector((state: any) => state.UpdateStausTest);
    const { statusAssessRes, updateStatusloading } = StatusTest;

    //Update Cost
    const CostUpdate = useSelector((state: any) => state.UpdateCurrencyText);
    const { UpdateCurrency, UpdateCostloading } = CostUpdate;

    const TestCount = useSelector((state: any) => state.AssessmentStatistics);

    // download assessment
    const downloadAsmnt = useSelector((state: any) => state.DownloadAssessment);
    const { downloadRes, downloadLoading } = downloadAsmnt;

    // useEffect(() => {
    //   if (!jsloading && jsAssRes?.data) {
    //     setDisplayData(jsAssRes?.data);
    //   }
    // }, [jsAssRes, jsloading]);

    const showSnackAlert = UseToastAlert();
    const navigate = useNavigate();
    const [postData, setPostData] = useState<any>([]);
    const [currentpage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [size, setSize] = useState(perPage);
    const [onButton, SetOnButton] = useState<any>(false);
    const [testS, setTestStatus] = useState<any>("");
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showEditRetakeCost, setEditRetakeCost] = useState(false);
    const [cost, setCost] = useState<any>();
    const [disableTog, setDisableTog] = useState(false);
    const [retakeCost, setRetakeCost] = useState<any>();
    const [editRetakeId, setEditReatakeId] = useState();
    const [editId, setEditId] = useState<any>();
    const PerPageChange = (value: any) => {
        setSize(value);
        if (jsAssRes?.data) {
            Math.ceil(jsAssRes?.data?.length / value);
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
            status: "ALL",
            category: props?.filteredData?.category,
            skill: props?.filteredData?.skill,
        };
        dispatch(getAssessmentData(paginatedMdl));
        setDisplayData(jsAssRes);
    };

    useEffect(() => {
        dispatch(getAssessmentStatistics());
    }, []);

    useEffect(() => {
        let combinedData: any = [];
        jsAssRes?.data?.asmt?.map((e: any) => {
            let res = { ...e };

            TestCount?.Res?.data?.data?.map((a: any) => {
                if (e?.test_id === a?.id) {
                    res.totalCount = a?.count;
                } else {
                    res.totalCount = null;
                }
            });

            combinedData.push(res);
        });

        setDisplayData([...combinedData]);
    }, [TestCount?.Res, jsAssRes]);

    const handleEdit = (id: string) => {
        dispatch(resetAddAssessment());
        dispatch(resetEditAssessment());
        dispatch(resetviewAssessmentSl());
        navigate("/admin/addAssessment", { state: id });
    };

    const handleTestStatus = (TestStatus: any, idtest: any) => {
        dispatch(resetStatusAssessment());
        // if (TestStatus === true) {
        //     setTestStatus("D");
        // } else {
        //     setTestStatus("E");
        // }
        let Ischecked = TestStatus ? "E" : "D";
        const data = {
            testS: Ischecked,
            idtest,
        };
        dispatch(EnableDisableAssessment(data));
    };

    useEffect(() => {
        if (!updateStatusloading && statusAssessRes?.code === 200) {
            showSnackAlert("success", statusAssessRes?.message);
            const AssessListOptions = {
                pageId: 1,
                pageLimit: 10,
                status: "All",
            };

            dispatch(getAssessmentData(AssessListOptions));
            dispatch(resetStatusAssessment());
        } else if (
            statusAssessRes?.data?.code === 401 ||
            statusAssessRes?.data?.code === 400
        ) {
            showSnackAlert("warning", statusAssessRes?.data?.message);
            dispatch(resetStatusAssessment());
        } else if (
            statusAssessRes &&
            statusAssessRes &&
            statusAssessRes.code !== 200
        ) {
        }
    }, [statusAssessRes]);

    useEffect(() => {
        if (UpdateCurrency && UpdateCurrency?.code === 200) {
            const AssessListOptions = {
                pageId: 1,
                pageLimit: 10,
                status: "All",
            };
            dispatch(getAssessmentData(AssessListOptions));
            showSnackAlert("success", UpdateCurrency?.message);
            setShowEditPopup(false);
            setEditRetakeCost(false);
            dispatch(resetUpdateCurrency());
        } else if (
            (UpdateCurrency && UpdateCurrency && UpdateCurrency.code === 401) ||
            (UpdateCurrency && UpdateCurrency && UpdateCurrency.code === 400)
        ) {
            showSnackAlert("warning", UpdateCurrency?.message);
            dispatch(resetUpdateCurrency());
        } else if (
            UpdateCurrency &&
            UpdateCurrency &&
            UpdateCurrency.code !== 200
        ) {
            // showSnackAlert("error", statusAssessRes?.message);
        }
    }, [UpdateCurrency]);

    return (
        <>
            {jsloading && <AssessAdmin_Sk />}
            {jsAssRes?.data?.asmt &&
                jsAssRes?.data?.asmt?.length === 0 &&
                !jsloading && (
                    <center>
                        <div className="col-lg-6">
                            <img src={notfoundImg} alt="" />
                            <h6
                                style={{ fontSize: "13px", fontWeight: "bold" }}
                            >
                                Oops no record found.
                            </h6>
                        </div>
                    </center>
                )}
            {!jsloading && (
                <div className="col-lg-12 col-md-12 col-sm-12">
                    <ul className="post-job-bx browse-job-grid row">
                        {displayData?.length > 0 &&
                            displayData?.map((item: any, index: any) => {
                                return (
                                    <span
                                        className="col-lg-12 col-md-12"
                                        key={index}
                                        style={{ marginBottom: "25px" }}
                                    >
                                        <div
                                            className="post-bx"
                                            id="Custom-CardBackgrdColor"
                                        >
                                            <div className="">
                                                <div className="job-post-info">
                                                    <div className="">
                                                        <div className="row">
                                                            <div className="col-lg-6 col-sm-12 pb-12">
                                                                <h5>
                                                                    <span></span>{" "}
                                                                    <span className="namefi">
                                                                        {" "}
                                                                        {item.test_name
                                                                            ? item.test_name
                                                                            : "Not Available"}{" "}
                                                                    </span>{" "}
                                                                    &nbsp;
                                                                </h5>

                                                                <li
                                                                    key={
                                                                        item?.category
                                                                    }
                                                                >
                                                                    <li
                                                                        key={
                                                                            item?.category
                                                                        }
                                                                    >
                                                                        <CgNotes className="custom-job-icon" />
                                                                        &nbsp;
                                                                        <span className="custom-job-content">
                                                                            <span
                                                                                style={{
                                                                                    color: "#a09d9d",
                                                                                }}
                                                                            >
                                                                                {" "}
                                                                                Assessment
                                                                                Category
                                                                                :
                                                                            </span>{" "}
                                                                            {
                                                                                item?.category
                                                                            }
                                                                        </span>
                                                                    </li>
                                                                </li>
                                                            </div>
                                                            <div className="col-lg-3 col-sm-12 pb-12">
                                                                <Tooltip
                                                                    title={`Test ${
                                                                        item.active
                                                                            ? "Enabled"
                                                                            : "Disabled"
                                                                    }`}
                                                                    arrow
                                                                >
                                                                    <Switch
                                                                        checked={
                                                                            item.active
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            handleTestStatus(
                                                                                e
                                                                                    .target
                                                                                    .checked,
                                                                                // item?.active,
                                                                                item?.test_id
                                                                            );
                                                                        }}
                                                                        inputProps={{
                                                                            "aria-label":
                                                                                "controlled",
                                                                        }}
                                                                    />
                                                                </Tooltip>
                                                            </div>
                                                            <div className="col-lg-3 col-sm-12 pb-12">
                                                                <Tooltip
                                                                    title="Edit assessment"
                                                                    arrow
                                                                >
                                                                    <Button
                                                                        className="testBtn edittestbtn"
                                                                        onClick={async () => {
                                                                            dispatch(
                                                                                resetAddAssessment()
                                                                            );
                                                                            await handleEdit(
                                                                                item?.test_id
                                                                            );
                                                                        }}
                                                                    >
                                                                        <span>
                                                                            {" "}
                                                                            <i
                                                                                className="fa fa-pencil-square-o"
                                                                                aria-hidden="true"
                                                                            ></i>{" "}
                                                                            Assessment
                                                                        </span>
                                                                    </Button>
                                                                </Tooltip>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <ul>
                                                        {item?.duration && (
                                                            <li
                                                                key={
                                                                    item?.duration
                                                                }
                                                            >
                                                                <BsClock className="custom-job-icon" />
                                                                &nbsp;
                                                                <span className="custom-job-content">
                                                                    <span
                                                                        style={{
                                                                            color: "#a09d9d",
                                                                        }}
                                                                    >
                                                                        {" "}
                                                                        Duration
                                                                        :
                                                                    </span>{" "}
                                                                    {convertSecondsToHours(
                                                                        item?.duration
                                                                    )}
                                                                </span>
                                                            </li>
                                                        )}

                                                        <li
                                                            key={
                                                                item?.max_attempt
                                                            }
                                                        >
                                                            <FaChartLine className="heading-title" />
                                                            &ensp;
                                                            <span className="custom-job-content">
                                                                <span className="heading-title">
                                                                    Max Attempts
                                                                    :
                                                                </span>{" "}
                                                                {
                                                                    item?.max_attempt
                                                                }
                                                            </span>
                                                        </li>

                                                        {item?.end_date !==
                                                            0 && (
                                                            <li
                                                                key={
                                                                    item?.end_date
                                                                }
                                                            >
                                                                <SlCalender className="custom-job-icon" />
                                                                &nbsp;
                                                                <span className="custom-job-content">
                                                                    <span
                                                                        style={{
                                                                            color: "#a09d9d",
                                                                        }}
                                                                    >
                                                                        {" "}
                                                                        End Date
                                                                        :
                                                                    </span>{" "}
                                                                    {getTimestampToDate(
                                                                        item?.end_date
                                                                    )}
                                                                </span>
                                                            </li>
                                                        )}
                                                        <li
                                                            key={
                                                                item?.totalCount
                                                            }
                                                        >
                                                            <BsPersonWorkspace className="custom-job-icon" />{" "}
                                                            &nbsp;
                                                            <span className="custom-job-content">
                                                                {item?.totalCount ===
                                                                null
                                                                    ? `No Assessment Taken`
                                                                    : `${
                                                                          item?.totalCount
                                                                      } ${
                                                                          item?.totalCount >
                                                                              500 &&
                                                                          ` + `
                                                                      } Assessment
                                taken`}
                                                            </span>
                                                        </li>

                                                        <div className="row">
                                                            <div className="col-lg-5 col-sm-12 pb-12">
                                                                <div className="d-flex">
                                                                    <div>
                                                                        <li
                                                                            key={
                                                                                item?.amount
                                                                            }
                                                                        >
                                                                            <span
                                                                                style={{
                                                                                    color: "#a09d9d",
                                                                                }}
                                                                                className="custom-job-content"
                                                                            >
                                                                                Assessment
                                                                                cost
                                                                                :
                                                                            </span>
                                                                            <MdOutlineCurrencyRupee className="custom-job-icon" />
                                                                            &nbsp;
                                                                            <span className="custom-job-content">
                                                                                {
                                                                                    item
                                                                                        ?.amount
                                                                                        ?.value
                                                                                }
                                                                            </span>
                                                                        </li>
                                                                    </div>
                                                                    <div>
                                                                        <Tooltip
                                                                            title="Edit Cost"
                                                                            placement="right"
                                                                        >
                                                                            <Link
                                                                                to={
                                                                                    "#"
                                                                                }
                                                                            >
                                                                                <BiEditAlt
                                                                                    className="text-primary"
                                                                                    onClick={() => {
                                                                                        setShowEditPopup(
                                                                                            true
                                                                                        );
                                                                                        setEditId(
                                                                                            item?.test_id
                                                                                        );
                                                                                        setCost(
                                                                                            item
                                                                                                ?.amount
                                                                                                ?.value
                                                                                        );
                                                                                        setRetakeCost(
                                                                                            item
                                                                                                ?.amount
                                                                                                ?.retake_value
                                                                                        );
                                                                                    }}
                                                                                ></BiEditAlt>
                                                                            </Link>
                                                                        </Tooltip>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-5 col-sm-12 pb-12">
                                                                <div className="d-flex">
                                                                    <div>
                                                                        <li
                                                                            key={
                                                                                item?.amount
                                                                            }
                                                                        >
                                                                            <span
                                                                                style={{
                                                                                    color: "#a09d9d",
                                                                                }}
                                                                                className="custom-job-content"
                                                                            >
                                                                                Retake
                                                                                cost
                                                                                :
                                                                            </span>
                                                                            <MdOutlineCurrencyRupee className="custom-job-icon" />
                                                                            &nbsp;
                                                                            <span className="custom-job-content">
                                                                                {
                                                                                    item
                                                                                        ?.amount
                                                                                        ?.retake_value
                                                                                }
                                                                            </span>
                                                                        </li>
                                                                    </div>
                                                                    <div>
                                                                        <Tooltip
                                                                            title="Edit Cost"
                                                                            placement="right"
                                                                        >
                                                                            <Link
                                                                                to={
                                                                                    "#"
                                                                                }
                                                                            >
                                                                                <BiEditAlt
                                                                                    className="text-primary"
                                                                                    onClick={() => {
                                                                                        setEditRetakeCost(
                                                                                            true
                                                                                        );
                                                                                        setEditReatakeId(
                                                                                            item?.test_id
                                                                                        );
                                                                                        setCost(
                                                                                            item
                                                                                                ?.amount
                                                                                                ?.value
                                                                                        );
                                                                                        setRetakeCost(
                                                                                            item
                                                                                                ?.amount
                                                                                                ?.retake_value
                                                                                        );
                                                                                    }}
                                                                                ></BiEditAlt>
                                                                            </Link>
                                                                        </Tooltip>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-lg-2 col-sm-12 pb-12">
                                                                <div>
                                                                    <Tooltip
                                                                        title="Download Assessment"
                                                                        placement="right"
                                                                    >
                                                                        <Link
                                                                            to={
                                                                                "#"
                                                                            }
                                                                        >
                                                                            <BsCloudDownload
                                                                                onClick={() => {
                                                                                    dispatch(
                                                                                        getDownloadAssessment(
                                                                                            item?.test_id
                                                                                        )
                                                                                    );
                                                                                }}
                                                                                style={{
                                                                                    color: " #007bff",
                                                                                    cursor: "pointer",
                                                                                }}
                                                                            />
                                                                        </Link>
                                                                    </Tooltip>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </ul>

                                                    <footer className="border-top pt-3">
                                                        {item?.skill?.map(
                                                            (val) => {
                                                                return (
                                                                    <Chip
                                                                        style={{
                                                                            borderColor:
                                                                                "#a277f1",
                                                                            marginRight:
                                                                                "7px",
                                                                        }}
                                                                        label={
                                                                            val
                                                                        }
                                                                        variant="outlined"
                                                                    />
                                                                );
                                                            }
                                                        )}
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

            {jsAssRes?.data?.asmt &&
                jsAssRes?.data?.asmt?.length > 0 &&
                !jsloading && (
                    <div className="pagination-bx float-right m-t10 m-b30">
                        <Pagination
                            className="pagination-data"
                            onChange={PaginationChange}
                            total={jsAssRes?.data?.count?.count}
                            current={currentpage}
                            pageSize={size}
                            showSizeChanger={true}
                            itemRender={PrevNextArrow}
                            onShowSizeChange={PerPageChange}
                        />
                    </div>
                )}

            <Modal
                show={showEditPopup}
                onHide={() => {
                    setShowEditPopup(false);
                }}
                className="modal fade editor"
            >
                <div
                    className="modal-dialog my-0 "
                    role="document"
                    id="modalpopupstyle"
                    style={{ width: "770px" }}
                >
                    {" "}
                    <div className="modal-content">
                        {" "}
                        <div className="modal-header" id="headerjds">
                            {" "}
                            <h5 className=" headCost" id="titlejds">
                                Assessment Cost
                            </h5>{" "}
                            <button
                                style={{ color: "white" }}
                                type="button"
                                className="close"
                                onClick={() => {
                                    setShowEditPopup(false);
                                }}
                            >
                                <i
                                    style={{ color: "white" }}
                                    className="fa fa-times"
                                    aria-hidden="true"
                                ></i>
                            </button>{" "}
                        </div>{" "}
                        <div className="modal-body">
                            <div className="browse-job">
                                <div className="col-lg-12 col-md-8 col-sm-6 form-group">
                                    <input
                                        autoComplete="off"
                                        maxLength={4}
                                        name="hybridPolicy"
                                        placeholder="Update Assessment Cost"
                                        type="text"
                                        className="form-control"
                                        value={cost != 0 ? cost : ""}
                                        onChange={(e) => {
                                            if (
                                                /^[0-9.]*$/.test(e.target.value)
                                            ) {
                                                setCost(e.target.value);
                                            } else if (
                                                e.target.value.length == 0
                                            ) {
                                                e.target.value = "";
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            {/* <div className="row"> */}
                            <div className="modal-footer">
                                {" "}
                                <button
                                    style={{ fontSize: "13px" }}
                                    type="button"
                                    className="site-button"
                                    onClick={() => {
                                        dispatch(
                                            UpdateCost({
                                                test_id: editId,
                                                fee: {
                                                    currency: "INR",
                                                    value: cost,
                                                    retake_value:
                                                        Number(retakeCost),
                                                },
                                                remark: "fdsfd",
                                            })
                                        );
                                    }}
                                >
                                    Update
                                </button>{" "}
                                <button
                                    style={{
                                        fontSize: "13px",
                                        backgroundColor: "#fca245",
                                    }}
                                    type="button"
                                    className="site-button"
                                    onClick={() => {
                                        setShowEditPopup(false);
                                    }}
                                >
                                    Cancel
                                </button>{" "}
                            </div>{" "}
                        </div>{" "}
                    </div>
                </div>
            </Modal>
            <Modal
                show={showEditRetakeCost}
                onHide={() => {
                    setEditRetakeCost(false);
                }}
                className="modal fade editor"
            >
                <div
                    className="modal-dialog my-0 "
                    role="document"
                    id="modalpopupstyle"
                    style={{ width: "770px" }}
                >
                    {" "}
                    <div className="modal-content">
                        {" "}
                        <div className="modal-header" id="headerjds">
                            {" "}
                            <h5 className=" headCost" id="titlejds">
                                Retake Cost
                            </h5>{" "}
                            <button
                                style={{ color: "white" }}
                                type="button"
                                className="close"
                                onClick={() => {
                                    setEditRetakeCost(false);
                                }}
                            >
                                <i
                                    style={{ color: "white" }}
                                    className="fa fa-times"
                                    aria-hidden="true"
                                ></i>
                            </button>{" "}
                        </div>{" "}
                        <div className="modal-body">
                            <div className="browse-job">
                                <div className="col-lg-12 col-md-8 col-sm-6 form-group">
                                    <input
                                        autoComplete="off"
                                        maxLength={4}
                                        name="hybridPolicy"
                                        placeholder="Update Cost"
                                        type="text"
                                        className="form-control"
                                        value={
                                            retakeCost != 0 ? retakeCost : ""
                                        }
                                        onChange={(e) => {
                                            if (
                                                /^[0-9.]*$/.test(e.target.value)
                                            ) {
                                                setRetakeCost(e.target.value);
                                            } else if (
                                                e.target.value.length == 0
                                            ) {
                                                e.target.value = "";
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            {/* <div className="row"> */}
                            <div className="modal-footer">
                                {" "}
                                <button
                                    style={{ fontSize: "13px" }}
                                    type="button"
                                    className="site-button"
                                    onClick={() => {
                                        dispatch(
                                            UpdateCost({
                                                test_id: editRetakeId,
                                                fee: {
                                                    currency: "INR",
                                                    value: cost,
                                                    retake_value:
                                                        Number(retakeCost),
                                                },
                                                remark: "fdsfd",
                                            })
                                        );
                                    }}
                                >
                                    Update
                                </button>{" "}
                                <button
                                    style={{
                                        fontSize: "13px",
                                        backgroundColor: "#fca245",
                                    }}
                                    type="button"
                                    className="site-button"
                                    onClick={() => {
                                        setEditRetakeCost(false);
                                    }}
                                >
                                    Cancel
                                </button>{" "}
                            </div>{" "}
                        </div>{" "}
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default AssessAdminCard;
