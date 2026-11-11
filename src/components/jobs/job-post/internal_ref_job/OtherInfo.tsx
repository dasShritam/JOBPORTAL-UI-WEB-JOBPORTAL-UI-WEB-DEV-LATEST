import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { customStyles } from "../../../../common/common";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { BsPersonCircle } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { GetHiringManagers } from "../../../../redux/features/jobs/internal_ref_job/Internal_Ref_Job";
import { regex } from "../../../../common/validation";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";

function OtherInfo(props: any) {
  const isInternal = useLocation().pathname?.includes("internal");
  const [startDateTouched, setStartDateTouched] = useState(false);
  const [endDateTouched, setEndDateTouched] = useState(false);
  const pageUrl = useLocation();

  const [walkindateError, setWalkindateError] = useState("");
  const [startDate, setStartDate] = useState<any>(null);
  const [edateError, setEdateError] = useState(false);
  const [endDate, setEndDate] = useState<any>(null);

  const [refreshsenddateError, setRefreshenddateError] = useState("");

  useEffect(() => {
    setStartDateTouched(false);
    setEndDateTouched(false);
  }, [pageUrl]);

  //#region get meta data

  useEffect(() => {
    setEndDate(props?.values?.endDate);
  }, [props]);

  const [hiringManagerOptions, setHiringManagerOptions] = useState<any>([]);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(GetHiringManagers());
  }, []);

  const { hmdata, hmloading, hmerror } = useSelector(
    (state: any) => state.GetHiringManager
  );
  function isSameDay(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  useEffect(() => {
    if (!hmloading) {
      setHiringManagerOptions(
        hmdata?.data?.map((c) => {
          return {
            label: `${c.name} [${c.email}]`,
            value: c.email,
          };
        })
      );
    }
  }, [hmloading]);
  //#endregion

  //#region jobUpdate
  const { jobData, jobLoading } = useSelector(
    (state: any) => state.GetInternalJobs
  );

  useEffect(() => {
    if (!jobLoading && jobData?.data?.jobs.length && hiringManagerOptions) {
      const event = {
        target: {
          name: "hiringManager",
          value: hiringManagerOptions.find(
            (c) => c.value == jobData?.data?.jobs[0]?.recrutier?.name
          ),
        },
      };
      props.handleChange(event);
    }
  }, [jobLoading, hiringManagerOptions]);
  //#endregion

  return (
    <div className="job-bx" id="dv_otherInfo_bx">
      <h5 className="mb-2">Other Info</h5>
      <div className="row">
        <div className="col-md-4 col-lg-4 col-sm-12">
          <label className="font-weight-700">
            Start Date<span className="form-error">*</span>
          </label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                className="dropstyle"
                value={
                  props && props.values && props.values.startDate
                    ? props?.values?.startDate
                    : null
                }
                format="DD-MM-YYYY"
                disablePast
                onChange={(newValue) => {
                  setEndDate(null);
                  const selectedDate = `${newValue?.$D}/${newValue?.$M + 1}/${
                    newValue?.$y
                  }`;
                  const addtionDate = `${newValue?.$y}/${newValue?.$M + 1}/${
                    newValue?.$D
                  }`;

                  props.values.startDate = null;
                  if (
                    newValue?.$D &&
                    newValue?.$M + 1 &&
                    newValue?.$y &&
                    new Date(newValue.$y, newValue.$M, newValue.$D) <
                      new Date() &&
                    !isSameDay(
                      new Date(newValue.$y, newValue.$M, newValue.$D),
                      new Date()
                    )
                  ) {
                    setStartDate(null);
                    props.values.endDate = "";
                    props.setFieldValue("startDate", null);
                    setWalkindateError("Please select the future date.");
                  } else {
                    setStartDate(newValue);
                    setWalkindateError("");
                    props.setFieldValue("startDate", newValue);
                  }
                }}
                onClose={() => {
                  setStartDateTouched(true);
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
          {walkindateError && <p className="form-error">{walkindateError}</p>}
          {/* {!walkindateError &&
            props.values.startDate === null &&
            startDateTouched && (
              <p className="form-error">{"Please select the start date."}</p>
            )} */}
          {!walkindateError &&
            props.errors.startDate &&
            props.touched.startDate && (
              <p className="form-error">{props.errors.startDate}</p>
            )}
          {props.errors.startDate && <div className="error-scroll"> </div>}
        </div>
        <div className="col-md-4 col-lg-4 col-sm-12">
          <label className="font-weight-700">
            End Date<span className="form-error">*</span>
          </label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                value={endDate ? endDate : null}
                format="DD-MM-YYYY"
                minDate={
                  props.values.startDate
                    ? dayjs(props.values.startDate).add(1, "day")
                    : undefined
                }
                disabled={!props.values.startDate}
                onChange={(newValue) => {
                  setEdateError(false);

                  props.values.endDate = null;
                  if (
                    newValue?.$D &&
                    newValue?.$M + 1 &&
                    newValue?.$y &&
                    new Date(
                      `${newValue?.$M + 1}-${newValue?.$D}-${newValue?.$y}`
                    ) <
                      new Date(
                        `${startDate?.$M + 1}-${startDate?.$D}-${startDate?.$y}`
                      )
                  ) {
                    setEndDate(null);
                    setRefreshenddateError(
                      "End date should be greater than Start date."
                    );
                    props.setFieldValue("endDate", "");
                  } else if (
                    newValue.isSame(dayjs(props.values.startDate), "day")
                  ) {
                    setEndDate(null);
                    setRefreshenddateError(
                      "End date should be greater than Start date."
                    );
                  } else if (
                    newValue.isBefore(dayjs(props.values.startDate), "day")
                  ) {
                    setEndDate(null);
                    setRefreshenddateError(
                      "End date should be greater than Start date."
                    );
                  } else {
                    setEndDate(newValue);
                    setRefreshenddateError("");
                    props.setFieldValue("endDate", newValue);
                  }
                }}
                onClose={() => {
                  setEndDateTouched(true);
                }}
              />
            </DemoContainer>
          </LocalizationProvider>

          {refreshsenddateError && !edateError && (
            <p className="form-error">{refreshsenddateError}</p>
          )}
          {/* {props.values.endDate === null && endDateTouched && (
            <p className="form-error">{"Please select the start date."}</p>
          )} */}
          {edateError && <p className="form-error">Please Select End Date.</p>}
          {!edateError && props.errors.endDate && props.touched.endDate && (
            <p className="form-error">{props.errors.endDate}</p>
          )}
          {props.errors.endDate && <div className="error-scroll"> </div>}
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-md-7 col-lg-7 col-sm-12">
          <label>
            Hiring Manager<span className="form-error">*</span>
          </label>
          <Select
            placeholder="Select Hiring Manager"
            isSearchable={true}
            isDisabled={false}
            options={hiringManagerOptions}
            value={props.values.hiringManager}
            className="dropstyle"
            styles={customStyles}
            name="hiringManager"
            onChange={(option: any) => {
              let event = {
                target: {
                  name: "hiringManager",
                  value: option,
                },
              };
              props.handleChange(event);
            }}
          />
          {props.errors.hiringManager && props.touched.hiringManager && (
            <span>
              <p className="form-error">{props.errors.hiringManager}</p>
            </span>
          )}
          {props.errors.hiringManager && <div className="error-scroll"> </div>}
        </div>
      </div>
      <div>
        <div className="d-flex justify-content-between mt-3">
          <div>
            <label>
              EEO (
              <span className="font_italic_sm">
                Equal Equipment Opportunity
              </span>
              )
            </label>
          </div>
        </div>
        <div className="post-bx">
          <div className="d-flex isHotDiv">
            <label>
              EEO-A statement that the company is an equal opportunity employer
              and does not discriminate based on race, colour, religion, sex,
              national origin, age, disability, or any other legally protected
              status.
            </label>
          </div>
        </div>
      </div>
      {!isInternal && (
        <>
          <div className="custom-control custom-checkbox m-t10">
            <input
              type="checkbox"
              className="custom-control-input"
              name={"isBonus"}
              id="chkisBonus"
              value={props.values.isBonus}
              checked={props.values.isBonus}
              onChange={(e: any) => {
                props.handleChange(e);

                if (!props.values.isBonus) {
                  props.values.bonus = "";
                  props.values.bonusCondition = "";
                }
              }}
            />
            <label className="custom-control-label" htmlFor="chkisBonus">
              Is there a bonus on successful selection?
            </label>
          </div>
          {props.values.isBonus && (
            <>
              <div className="row">
                <div className="col-md-4 col-lg4 col-sm-12">
                  <label>
                    Bonus Amount{" "}
                    {props.values.isBonus && (
                      <span className="form-error">*</span>
                    )}{" "}
                  </label>
                  <input
                    type="text"
                    name="bonus"
                    className="form-control"
                    value={props.values.bonus}
                    maxLength={6}
                    onChange={(e) => {
                      if (regex.numberRegx.test(e.target.value))
                        props.handleChange(e);
                    }}
                  />
                  {props.errors.bonus && props.touched.bonus && (
                    <span className="form-error">{props.errors.bonus}</span>
                  )}
                  {props.errors.bonus && <div className="error-scroll"> </div>}
                </div>
              </div>
              <div className='className="form-group"'>
                <label>Condition if any</label>
                <textarea
                  rows={3}
                  name="bonusCondition"
                  style={{ minHeight: "100px" }}
                  maxLength={500}
                  className="form-control"
                  value={props.values.bonusCondition}
                  onChange={(e) => {
                    props.handleChange(e);
                  }}
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default OtherInfo;
