import React, { useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";

function Filter() {
  const [disSearch, setDisSearch] = useState(false);
  const [activeJob, setActiveJob] = useState(false);
  const [closedJob, setClosedJob] = useState(false);
  const [expiredJob, setExpiredJob] = useState(false);
  const disSearchBar = () => {
    activeJob || closedJob || expiredJob
      ? setDisSearch(true)
      : setDisSearch(false);
  };
  useEffect(() => {
    disSearchBar();
  }, [activeJob, closedJob, expiredJob]);

  return (
    <aside id="accordion1" className="sidebar-filter bg-white">
      <Accordion defaultActiveKey="0">
        <h6 className="title">
          <i className="fa fa-filter" aria-hidden="true"></i> Filters
        </h6>
        {/* <Accordion.Collapse eventKey="0"> */}

        <div id="companies" className="acod-body collapse show">
          <div className="acod-content">
            <input
              className="form-control"
              type="text"
              placeholder="Job Title/Job Id"
              aria-label="Search "
            />
            <h6 className="title"> Job Status </h6>
            <div className="custom-control custom-checkbox">
              <input
                className="custom-control-input"
                id="companies3"
                type="checkbox"
                name="checkbox-companies"
              />
              <label className="custom-control-label" htmlFor="companies3">
                Active Jobs <span>(235)</span>
              </label>
            </div>
            <div className="custom-control custom-checkbox">
              <input
                className="custom-control-input"
                id="companies4"
                type="checkbox"
                name="checkbox-companies"
              />
              <label className="custom-control-label" htmlFor="companies4">
                Closed Jobs <span>(568)</span>
              </label>
            </div>
            <div className="custom-control custom-checkbox">
              <input
                className="custom-control-input"
                id="companies5"
                type="checkbox"
                name="checkbox-companies"
              />
              <label className="custom-control-label" htmlFor="companies5">
                Expired Jobs <span>(798)</span>
              </label>
            </div>
          </div>
          {disSearch && (
            <div className="acod-content">
              <button type="submit" className="site-button btn-block">
                Search
              </button>
            </div>
          )}
        </div>
      </Accordion>
    </aside>
  );
}

export default Filter;
