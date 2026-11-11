import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Accordion } from "react-bootstrap";
import { TbClearAll } from "react-icons/tb";
import { GrSearch } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { customStyles } from "../../../../common/common";
import Select from "react-select";
import { GetHiringManagers } from "../../../../redux/features/jobs/internal_ref_job/Internal_Ref_Job";
import { internalJobsData } from "../../../../redux/features/jobs/manage-jobs/MangeJobs-rjp-ijpSlice";

function FilterJobs({ filterRecord }) {
  const [activeJob, setActiveJob] = useState(false);
  const [closedJob, setClosedJob] = useState(false);
  const [expiredJob, setExpiredJob] = useState(false);
  const [hiringManagerOptions, setHiringManagerOptions] = useState<any>([]);
  const [hiringMan, setHiringMan] = useState<any>(null);
  const [selectedId, setSelectedId] = useState<any>([]);

  const internalJobList = useSelector((state: any) => state.InternalJobs);
  const { internalJobsRes, internalJobLoading } = internalJobList;

  const hiringManager = useSelector((state: any) => state.GetHiringManager);
  const { hmdata, hmloading, hmerror } = hiringManager;

  useEffect(() => {
    dispatch(GetHiringManagers());
  }, []);

  useEffect(() => {
    if (!hmloading) {
      setHiringManagerOptions(
        hmdata?.data?.map((c) => {
          return {
            label: `${c.email}`,
            value: c.id,
          };
        })
      );
    }
  }, [hmloading]);

  const totalCounts = useSelector(
    (state: any) => state.EmpInternalStatisticsData
  );
  const { empIntStatisticsData } = totalCounts;

  useEffect(() => {}, [empIntStatisticsData]);

  useEffect(() => {}, [internalJobsRes]);

  useEffect(() => {}, [activeJob, closedJob, expiredJob]);

  const [filterData, setFilterData] = useState<any>([]);
  const dispatch = useDispatch();

  const handleFilter = () => {
    const JobListOptions = {
      mode: "minimal",
      pageId: 1,
      search: filterData,
      pageLimit: 10,
      jobid: null,
      status: [],
    };
    filterRecord(JobListOptions);
    dispatch(internalJobsData(JobListOptions));
  };
  useEffect(() => {}, [hiringManagerOptions]);

  const resetHandler = (e: any) => {
    e.preventDefault();
    setFilterData("");
    setActiveJob(false);
    setClosedJob(false);
    setExpiredJob(false);
    setHiringMan([]);

    const JobListOptions = {
      mode: "minimal",
      pageId: 1,
      search: "",
      jobid: null,
      pageLimit: 10,
      status: ["PUBLISH", "CLOSE"],
    };
    filterRecord({});
    dispatch(internalJobsData(JobListOptions));
    dispatch(empIntStatisticsData());
  };

  const searchHandler = () => {
    let status: any = [];
    if (activeJob) {
      status.push("ACTIVE");
    }
    if (closedJob) {
      status.push("CLOSE");
    }
    if (expiredJob) {
      status.push("EXPIRED");
    }
    let id: any = [];
    hiringMan?.map((a: any) => {
      id.push(a.value);
      setSelectedId([...id]);
    });

    const fetchInfo = {
      mode: "minimal",
      pageId: 1,
      search: filterData,
      pageLimit: 10,
      jobid: null,
      status: status,
      empids: id,
    };
    filterRecord(fetchInfo);
    dispatch(internalJobsData(fetchInfo));
  };

  return (
    <aside id="accordion1" className="sidebar-filter bg-white">
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
                onClick={(e: any) => {
                  resetHandler(e);
                }}
                className="font-12 float-right"
              >
                <TbClearAll /> Reset
              </Link>{" "}
            </div>
          </div>
        </h6>
        <Accordion.Collapse eventKey="0">
          <div id="companies" className="acod-body collapse show">
            <div className="acod-content">
              <input
                className="form-control"
                type="search"
                value={filterData}
                placeholder="Job Title"
                aria-label="Search "
                onChange={(e: any) => {
                  setFilterData(e.target.value);
                }}
              />
              <span
                style={{
                  position: "relative",
                  top: "-30px",
                  left: "90%",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                <GrSearch
                  onClick={() => {
                    handleFilter();
                  }}
                />
              </span>
              <h6> Filter By Job Status </h6>
              <div className="custom-control custom-checkbox">
                <input
                  className="custom-control-input"
                  id="companies3"
                  type="checkbox"
                  checked={activeJob}
                  readOnly
                  name="checkbox-companies"
                  onClick={() => {
                    setActiveJob(!activeJob);
                  }}
                />
                <label className="custom-control-label" htmlFor="companies3">
                  Active Jobs{" "}
                  <span>({empIntStatisticsData?.job_status?.active_jobs})</span>{" "}
                </label>
              </div>
              <div className="custom-control custom-checkbox">
                <input
                  className="custom-control-input"
                  id="companies4"
                  type="checkbox"
                  checked={closedJob}
                  readOnly
                  name="checkbox-companies"
                  onChange={(e: any) => {
                    setClosedJob(!closedJob);
                  }}
                />
                <label className="custom-control-label" htmlFor="companies4">
                  Closed Jobs{" "}
                  <span>({empIntStatisticsData?.job_status?.closed_jobs})</span>
                </label>
              </div>
              <div className="custom-control custom-checkbox">
                <input
                  className="custom-control-input"
                  id="companies5"
                  type="checkbox"
                  checked={expiredJob}
                  readOnly
                  name="checkbox-companies"
                  onChange={(e: any) => {
                    setExpiredJob(!expiredJob);
                  }}
                />
                <label className="custom-control-label" htmlFor="companies5">
                  Expired Jobs{" "}
                  <span>
                    ({empIntStatisticsData?.job_status?.expired_jobs})
                  </span>
                </label>
              </div>
            </div>
            <div className="acod-content">
              <h6> Filter By Employer </h6>
              <Select
                placeholder="Select"
                isMulti
                isSearchable={true}
                isClearable={true}
                isDisabled={false}
                name="hiringManager"
                options={hiringManagerOptions}
                value={hiringMan}
                onChange={(option: any, e: any) => {
                  let event = {
                    target: {
                      name: "hiringManager",
                      value: option,
                    },
                  };
                  setHiringMan(event.target.value);
                }}
                className={"dropstyle"}
                styles={customStyles}
              />
            </div>

            <div className="acod-content">
              <button
                type="submit"
                className="site-button btn-block"
                onClick={searchHandler}
                style={{ zIndex: "0" }}
              >
                Search
              </button>
            </div>
          </div>
        </Accordion.Collapse>
      </Accordion>
    </aside>
  );
}

export default FilterJobs;
