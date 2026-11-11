import { Avatar, Chip, Skeleton, Stack } from "@mui/material";
import Pagination from "rc-pagination";
import { lazy, useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import { TbClearAll } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import "../../../assets/customCss/Pagination.css";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import { getEpmMails } from "../../../redux/features/employer/EmployerManageUser/getEpmMailSlice";
import {
  getEmpUserManage,
  getEmpUserManageSliceReset,
} from "../../../redux/features/employer/EmployerManageUser/userEmpManagementSlice";
import { userEnDisManageReset } from "../../../redux/features/employer/EmployerManageUser/userEnDisManageSlice";
import { patchEmpUserManageSliceReset } from "../../../redux/features/employer/EmployerManageUser/userPatchEmpManageSlice";
import { postEmpUserManageSliceReset } from "../../../redux/features/employer/EmployerManageUser/userPostEmpMangeSlice";
import {
  downloadSAS,
  successSAS,
} from "../../../redux/features/jobs/job-applications/downloadSASSlice";
import {
  DesignationMasterData,
  resetDesignationMasterData,
} from "../../../redux/features/masterData/DesignationSlice";
import {
  getCountryCode,
  resetcountryCode,
} from "../../../redux/features/masterData/countrySlice";
import UserTable from "./UserTable";
const NodataFound = require("../../../assets/images/background/No-record.png");
const AddEditEmpUser = lazy(() => import("./AddEditEmpUser"));

interface DropdownI {
  value: boolean | null;
  label: string;
}
let mailIdList = new Array<any>();
const filterList: DropdownI[] = [
  { value: null, label: "All Users" },
  { value: true, label: "Only Active Users" },
  { value: false, label: "Only Inactive User" },
];

function EmployerManageUser() {
  const dispatch = useDispatch(),
    showSnackAlert = UseToastAlert(),
    [modal, setModal] = useState(false),
    [id, setID] = useState(""),
    [page, setPage] = useState(1),
    [rowsPerPage, setRowsPerPage] = useState(10),
    [perPage, setPerPage] = useState(10),
    [currentpage, setCurrentPage] = useState(1),
    [size, setSize] = useState(perPage),
    [count, setCount] = useState<any>(0),
    [datas, setDatas] = useState<any>([]),
    [isChecked, setIsChecked] = useState(false),
    [mail, setMail] = useState<any>(),
    [loader, setLoader] = useState<boolean>(false),
    [filter, setFilter] = useState<any>({ value: null, label: "All Users" }),
    { userData, loadingU } = useSelector(
      (state: any) => state.getuserEmpManagement
    ),
    { userDataP, loadingUP } = useSelector(
      (state: any) => state.postuserEmpManagement
    ),
    { userDataPa, loadingUPa } = useSelector(
      (state: any) => state.patchuserEmpMangement
    ),
    { empStateData, loadingE } = useSelector((state: any) => state.EnDisUser),
    { MailIDs, loadingM } = useSelector((state: any) => state.getEpmMails),
    { sasData, load } = useSelector((state: any) => state.downloadSAS),
    modalFunc = (val: boolean) => {
      !val && setID("");
      setModal(val);
    },
    PaginationChange = (page: any, pageSize: any) => {
      setCurrentPage(page);
      setSize(pageSize);
      setPage(page);
      dispatch(
        getEmpUserManage({
          pageId: page,
          pageLimit: rowsPerPage,
          isactive: filter?.value,
        })
      );
    },
    PerPageChange = (value: any) => {
      setSize(value);
      if (datas) {
        Math.ceil(datas?.length / value);
      }
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
    handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = event?.target;
      setDatas((prev) =>
        prev?.map((checkbox) =>
          checkbox?.userid === name ? { ...checkbox, checked } : checkbox
        )
      );
      setIsChecked(datas?.every((checkbox) => checkbox?.checked === true));
    },
    filterUniversities = (inputValue: string): any => {
      return mailIdList?.filter((i) =>
        i?.label?.toLowerCase()?.includes(inputValue?.toLowerCase())
      );
    },
    promiseOptions = (inputValue: string) =>
      new Promise<[]>((resolve) => {
        setTimeout(() => {
          resolve(filterUniversities(inputValue));
        }, 1000);
      });
  useEffect(() => {
    if (
      MailIDs &&
      MailIDs?.code &&
      MailIDs?.code === 200 &&
      !mailIdList.length
    ) {
      MailIDs?.data?.map((e, i) => {
        mailIdList.push({ value: `${1 + i}`, label: e?.email });
      });
    }
  }, [MailIDs]);
  useEffect(() => {
    dispatch(
      getEmpUserManage({
        pageId: page,
        pageLimit: rowsPerPage,
        isactive: filter?.value,
      })
    );
    dispatch(getEpmMails());
    dispatch(getCountryCode({ pageno: -1, search: "" }));
    dispatch(DesignationMasterData({ pageno: -1, search: "" }));
    return () => {
      dispatch(resetcountryCode());
      dispatch(resetDesignationMasterData());
      dispatch(getEmpUserManageSliceReset());
      dispatch(postEmpUserManageSliceReset());
      dispatch(patchEmpUserManageSliceReset());
      dispatch(userEnDisManageReset());
    };
  }, []);
  useEffect(() => {
    setLoader(true);
    if (userData && userData?.code && userData?.code === 200) {
      const userids = userData?.data?.users?.map((e: any) => {
        return e?.user_id;
      });
      userData?.data?.users?.length
        ? dispatch(
            downloadSAS({
              id: [...userids],
              sasFor: "EMPIMG",
            })
          )
        : dispatch(successSAS());
    }
    setLoader(false);
  }, [userData]);
  useEffect(() => {
    setLoader(true);
    if (
      sasData &&
      ((sasData?.code && sasData?.code === 200) ||
        sasData?.response?.status === 400)
    ) {
      setCount(userData?.data?.totalCount);
      datas.splice(0, datas?.length + 1);
      userData?.data?.users.map((e) => {
        let tempImg = "";
        sasData?.data?.map((f: any) => {
          if (f?.id === e?.user_id) {
            tempImg = f?.img_sas;
          }
        });
        datas.push({
          ...e,
          pic: tempImg ? tempImg : undefined,
        });
      });
      setDatas([...datas]);
    }
    setLoader(false);
  }, [sasData]);
  useEffect(() => {
    if (!loadingUP && userDataP && userDataP?.code && userDataP?.code === 200) {
      dispatch(
        getEmpUserManage({
          pageId: page,
          pageLimit: rowsPerPage,
          isactive: filter?.value,
        })
      );
      dispatch(getEpmMails());
      dispatch(postEmpUserManageSliceReset());
      showSnackAlert("success", userDataP?.message);
    }
    if (
      (!loadingUP && userDataP && userDataP?.code && userDataP?.code == 206) ||
      userDataP?.code == 500 ||
      userDataP?.code == 400
    ) {
      dispatch(postEmpUserManageSliceReset());
      showSnackAlert("warning", userDataP?.message);
    }

    if (userDataP && userDataP?.code && userDataP?.code === 429) {
      dispatch(postEmpUserManageSliceReset());
      Swal.fire({
        html: 'Apologies, but we are unable to proceed with your request at the moment due to reaching the maximum limit of users. Please <a href="/public/quick-contact"  target="_blank">contact support</a>.',
        icon: "warning",
        showCancelButton: false,
        confirmButtonColor: "red",
        confirmButtonText: "OK",
      });
    }
  }, [userDataP]);
  useEffect(() => {
    if (
      !loadingUPa &&
      userDataPa &&
      userDataPa?.code &&
      userDataPa?.code === 200
    ) {
      dispatch(
        getEmpUserManage({
          pageId: page,
          pageLimit: rowsPerPage,
          isactive: filter?.value,
        })
      );
      dispatch(patchEmpUserManageSliceReset());
      showSnackAlert("success", userDataPa?.message);
    }
    if (
      !loadingUPa &&
      userDataPa &&
      userDataPa?.code &&
      userDataPa?.code !== 200
    ) {
      dispatch(patchEmpUserManageSliceReset());
      showSnackAlert("warning", userDataPa?.message);
    }
  }, [userDataPa]);
  useEffect(() => {
    if (
      !loadingE &&
      empStateData &&
      empStateData?.code &&
      empStateData.code === 200
    ) {
      dispatch(
        getEmpUserManage({
          pageId: page,
          pageLimit: rowsPerPage,
          isactive: filter?.value,
        })
      );
      dispatch(userEnDisManageReset());
      showSnackAlert("success", empStateData?.message);
    }
    if (
      !loadingE &&
      empStateData &&
      empStateData?.code &&
      empStateData?.code !== 200
    ) {
      dispatch(userEnDisManageReset());
      showSnackAlert("warning", userDataPa?.message);
    }
  }, [empStateData]);

  return (
    <>
      <div className="page-content bg-white">
        <div className="content-block">
          <div className="browse-job section-full bg-white p-t50 p-b20">
            <div className="container">
              <div className="job-bx browse-job clearfix mt-5 m-b30">
                <div className="job-bx-title clearfix NativeTitle">
                  <div className="pull-left">
                    <h5 className="font-weight-700 pull-left text-uppercase">
                      USER LIST
                    </h5>
                  </div>
                  {!modal && (
                    <div className="float-right">
                      <Stack direction="row" spacing={1}>
                        <Chip
                          label={
                            <span className="custom-job-content text-bold">
                              Total Users
                            </span>
                          }
                          avatar={
                            <Avatar
                              className="btn site-button btn-sm "
                              style={{
                                color: "white",
                                backgroundColor: "blue",
                              }}
                            >
                              {count}
                            </Avatar>
                          }
                        />
                      </Stack>
                    </div>
                  )}
                </div>
                {!modal && (
                  <>
                    <div className="row">
                      <div className="col w-100">
                        <button
                          type="button"
                          className="site-button border border-primary btn-sm mb-3 float-right"
                          onClick={() => setModal(true)}
                        >
                          Add Recruiter
                        </button>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-xl-3 col-lg-4 col-md-5 col-sm-12">
                        <aside
                          id="accordion1"
                          className="sidebar-filter bg-white"
                        >
                          <Accordion defaultActiveKey="0">
                            <h6 className="title">
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <i
                                    className="fa fa-filter"
                                    aria-hidden="true"
                                    style={{ color: "orange" }}
                                  ></i>{" "}
                                  Filters{" "}
                                </div>
                                <div>
                                  <Link
                                    to={"#"}
                                    onClick={() => {
                                      setMail(null);
                                      setFilter({
                                        value: null,
                                        label: "All Users",
                                      });
                                      dispatch(
                                        getEmpUserManage({
                                          pageId: 1,
                                          pageLimit: rowsPerPage,
                                          isactive: null,
                                          user_email: null,
                                        })
                                      );
                                    }}
                                    className="font-12 float-right"
                                  >
                                    <TbClearAll /> Reset
                                  </Link>{" "}
                                </div>
                              </div>
                            </h6>
                            <Accordion.Collapse eventKey="0">
                              <div
                                id="companies"
                                className="acod-body collapse show"
                              >
                                <div className="acod-content">
                                  <div className="custom-btn mb-2">
                                    <AsyncSelect
                                      components={{ DropdownIndicator: null }}
                                      cacheOptions
                                      isClearable={true}
                                      value={mail}
                                      onChange={(e: any) => {
                                        setMail(e);
                                      }}
                                      className="dropstyle"
                                      placeholder="Search by Email"
                                      loadOptions={promiseOptions}
                                    />
                                  </div>

                                  <div style={{ width: "100%" }}>
                                    <Select
                                      className="dropstyle"
                                      options={filterList}
                                      placeholder="Select user by status"
                                      isDisabled={false}
                                      defaultValue={{
                                        value: null,
                                        label: "All Users",
                                      }}
                                      value={filter}
                                      onChange={(option: any) => {
                                        setFilter(option);
                                      }}
                                    />
                                  </div>

                                  <br />
                                  <button
                                    className="col-lg-12 site-button border border-primary btn-sm  mb-2"
                                    style={{ zIndex: "0" }}
                                    onClick={(selectedOption: any) => {
                                      dispatch(
                                        getEmpUserManage({
                                          pageId: 1,
                                          pageLimit: rowsPerPage,
                                          isactive: filter?.value,
                                          user_email: mail?.label,
                                        })
                                      );
                                    }}
                                  >
                                    Search
                                  </button>
                                </div>
                              </div>
                            </Accordion.Collapse>
                          </Accordion>
                        </aside>
                      </div>

                      {datas && (
                        <div className="col-xl-9 col-lg-8 col-md-7">
                          <table className="table-job-bx cv-manager company-manage-job">
                            <thead>
                              <tr>
                                <th className="table-head-JSR">User Info</th>
                                <th className="table-head-JSR">
                                  Contact number
                                </th>
                                <th className="table-head-JSR">Role</th>
                                <th className="table-head-JSR">
                                  Permission &<br />
                                  Restriction
                                </th>
                                <th className="table-head-JSR text-center">
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {!loadingU &&
                                datas.length !== 0 &&
                                datas?.map((e: any) => (
                                  <UserTable
                                    key={e.user_id}
                                    row={e}
                                    setShow={setModal}
                                    id={setID}
                                    handleCheckboxChange={handleCheckboxChange}
                                  />
                                ))}
                              {loadingU && (
                                <>
                                  <tr>
                                    <td
                                      className="d-flex float-left job-name"
                                      // style={{ marginBottom: "-30px" }}
                                    >
                                      <div className="job-post-company">
                                        <span style={{ borderRadius: "50%" }}>
                                          <div
                                            className="job-post-company"
                                            style={{ marginRight: "0px" }}
                                          >
                                            <div className="round-box">
                                              <Skeleton
                                                animation="wave"
                                                variant="circular"
                                                style={{
                                                  borderRadius: "100%",
                                                  width: "70px",
                                                  height: "70px",
                                                }}
                                              />
                                            </div>
                                          </div>
                                        </span>
                                      </div>
                                      <div className="job-post-info">
                                        <h6 className="application text-primary">
                                          <span className="text text-dark">
                                            <Skeleton
                                              className="font-12 "
                                              animation="wave"
                                              style={{ position: "absolute" }}
                                              height={20}
                                              width="6%"
                                            />
                                          </span>
                                        </h6>
                                        <ul>
                                          <li
                                            key={11}
                                            className="text text-dark"
                                          >
                                            <Skeleton
                                              animation="wave"
                                              variant="rectangular"
                                              height={30}
                                              width="60%"
                                            />
                                          </li>
                                          <li
                                            key={22}
                                            className="text text-dark"
                                          >
                                            <Skeleton
                                              animation="wave"
                                              variant="rectangular"
                                              height={30}
                                              width="60%"
                                            />
                                          </li>
                                        </ul>
                                      </div>
                                    </td>

                                    <td className="application text-primary">
                                      <Skeleton
                                        className="font-12 "
                                        animation="wave"
                                        height={20}
                                        width="60%"
                                      />
                                    </td>

                                    <td className="application text-primary">
                                      <Skeleton
                                        className="font-12 "
                                        animation="wave"
                                        height={20}
                                        width="60%"
                                      />
                                    </td>
                                    <td className="application text-primary">
                                      <Skeleton
                                        className="font-12 "
                                        animation="wave"
                                        height={20}
                                        width="60%"
                                      />
                                    </td>
                                    <td className="application text-primary">
                                      <Skeleton
                                        className="font-12 "
                                        animation="wave"
                                        height={20}
                                        width="100%"
                                      />
                                    </td>
                                  </tr>
                                </>
                              )}
                            </tbody>
                          </table>

                          {count > 0 && (
                            <div className="pagination-bx float-right m-t20">
                              <Pagination
                                className="pagination-data"
                                onChange={PaginationChange}
                                total={count}
                                current={currentpage}
                                pageSize={size}
                                showSizeChanger={true}
                                itemRender={PrevNextArrow}
                                onShowSizeChange={PerPageChange}
                              />
                            </div>
                          )}
                        </div>
                      )}
                      {!datas && (
                        <div style={{ marginLeft: "120px" }}>
                          <center>
                            <h6 className="font-weight-bold">
                              Oops no record found.
                            </h6>
                            <img
                              src={NodataFound}
                              alt=""
                              style={{ width: "65%" }}
                            />
                            <br />
                            <p>
                              No applications are present for this filter
                              options or selection
                            </p>
                          </center>
                        </div>
                      )}
                    </div>
                  </>
                )}
                {id && modal && (
                  <AddEditEmpUser
                    show={modal}
                    func={modalFunc}
                    data={datas.filter((e) => e.user_id === id)}
                  />
                )}
                {!id && modal && (
                  <AddEditEmpUser show={modal} func={modalFunc} />
                )}
                <br />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EmployerManageUser;
