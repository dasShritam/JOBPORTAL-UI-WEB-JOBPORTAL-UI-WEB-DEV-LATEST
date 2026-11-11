import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSuitcase } from "react-icons/fa";
import { FcMoneyTransfer } from "react-icons/fc";
import { MdLocationPin } from "react-icons/md";
import {
  formatNumberToSalary,
  formatTimestamp,
} from "../../../../common/common";
import { useSelector } from "react-redux";

var notFoundimg = require("../../../../assets/images/background/No-record.png");
function PrefillJobs({ closeSlider, Alljob, onclick }) {
  const [formvalue, setformvalue] = useState<any>();
  const empDetails = useSelector((state: any) => state.employeeProfile);
  const { EmployerProfile, loading } = empDetails;
  useEffect(() => {
    if (!loading && EmployerProfile?.data && EmployerProfile?.data)
      setformvalue(EmployerProfile?.data?.acountInfo);
  }, [EmployerProfile?.data, loading]);

  const [prefillJobsData, setPrefillJobData] = useState<any>([]);
  const [displayJobsData, setDisplayJobsData] = useState<any>([]);

  const filetSearched = (e: any) => {
    const filteredData: any = [];
    prefillJobsData.map((item) => {
      if (item.title.toLowerCase().includes(e.target.value.toLowerCase())) {
        filteredData.push(item);
      }
    });
    // setPrefillJobData([...filteredData.length ? filteredData : prefillJobsData])
    setDisplayJobsData([...(filteredData.length ? filteredData : [])]);
  };
  useEffect(() => {
    let dummydata;
    if (Alljob) {
      dummydata = Alljob.map((e) => {
        return {
          id: e?.jobid,
          title: e?.title,
          exp: `${e?.exp.min}-${e?.exp.max}year`,
          // "1-2year"
          sal: `${formatNumberToSalary(e?.salary.min)}-${formatNumberToSalary(
            e.salary.max
          )}`,
          // "1 lac - 1.5lacs"
          localtion: e?.location.join(","),
          skills: e?.skills.join(","),
          posted: `Posted on ${
            formatTimestamp(e?.created_at).split("-")[0]
          } Apr by ${e?.created_by}`,
        };
      });
    } else {
      dummydata = [
        {
          title: "",
          exp: "",
          sal: "",
          localtion: "",
          skills: "",
          posted: "",
        },
      ];
    }

    setPrefillJobData(dummydata?.reverse());
    setDisplayJobsData(dummydata?.reverse());
  }, [Alljob]);

  return (
    <div className="custom-top bg-white" style={{ top: "80px" }}>
      <div className=" onepage">
        <div className="modal-custom-header">
          <h5>Prefill from Drafted jobs</h5>
          <button
            type="button"
            className="close"
            onClick={() => {
              closeSlider();
            }}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div>
          <input
            type="search"
            placeholder="Search Drafted jobs"
            className="form-control"
            onChange={(e: any) => {
              filetSearched(e);
            }}
          />{" "}
          <br />
        </div>
        <div style={{ height: "450px", overflowY: "auto" }}>
          {displayJobsData.map((item: any, i) => {
            return (
              <div key={item.id}>
                <div
                  className="card"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    onclick(item.id);
                  }}
                >
                  <div className="card-body word-break">
                    <label
                      style={{ fontWeight: "bold", cursor: "pointer" }}
                      className="card-title"
                    >
                      {item.title}
                    </label>
                    <div>
                      <FaSuitcase />{" "}
                      <span className="font-13">&nbsp;{item.exp}</span>
                    </div>
                    <div>
                      <FcMoneyTransfer />
                      <span className="font-13">&nbsp; {item.sal}</span>
                    </div>
                    <div>
                      <MdLocationPin />
                      <span className="font-13">&nbsp;{item.localtion}</span>
                    </div>
                    <div>
                      <span className="font-13">{item.skills}</span>
                    </div>
                  </div>
                </div>
                <div>
                  {" "}
                  <p
                    className="modal-custom-desc"
                    style={{ fontSize: "12px", marginLeft: "4px" }}
                  >
                    {" "}
                    {item.posted}
                  </p>
                </div>
              </div>
            );
          })}
          {!displayJobsData[0]?.title && (
            <div className="text-center">
              <img src={notFoundimg} width={"88%"} height={"40%"} alt="" />
              <span>Data not found</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PrefillJobs;
