import React from "react";
import PollList from "./PollList";
function ManagePolls() {
  return (
    <>
      <div className="page-content bg-white">
        <div className="content-block">
          <div className="browse-job section-full bg-white p-t50 p-b20">
            <div className="container">
              <div className="job-bx browse-job clearfix m-b30 mt-5">
                <PollList />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default ManagePolls;
