import Select from "react-select";
import { useEffect, useState } from "react";
import "../../../../assets/customCss/walkInSchedule.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { Modal } from "react-bootstrap";
import dayjs from "dayjs";
import { getTimeStampForTime } from "../../../../common/common";
import { regex } from "../../../../common/validation";

function WalkInSchedule(props: any) {
  const [startDate, setStartDate] = useState<any>(null);
  const [startTime, setStartTime] = useState<any>(null);
  const [endTime, setEndTime] = useState<any>(null);
  const [Days, setDays] = useState<any>(null);
  const [touchedDays, setTouchedDays] = useState(false);
  const [gpModal, setGpModel] = useState(false);
  const [touchedDate, setTouchedDate] = useState(false);
  const [touchedSTime, setTouchedSTime] = useState(false);
  const [touchedETime, setTouchedETime] = useState(false);
  const [dateval, setDateVal] = useState<any>();
  const [addDate, setAddDate] = useState<any>();
  const [dateErr, setDateErr] = useState<any>("");
  const [walkindateError, setWalkindateError] = useState("");

  useEffect(() => {
    if (
      startDate?.$d?.toDateString() == new Date().toDateString() &&
      !props?.error?.startTime
    ) {
      if (
        props?.values?.startTime?.$d?.toTimeString().slice(0, 2) <
        new Date().toTimeString().slice(0, 2) ||
        (props?.values?.startTime?.$d?.toTimeString().slice(0, 2) ==
          new Date().toTimeString().slice(0, 2) &&
          props?.values?.startTime?.$d?.toTimeString().slice(3, 5) <=
          new Date().toTimeString().slice(3, 5))
      ) {
        setDateErr("Select Future Time.");
        props.errors.startTime = "Select Future Time."

        if (touchedSTime) {
          props.setFieldValue("startTime", null);
        }
      }
      else {
        if (!touchedSTime) {
          setDateErr("");
        }
      }
    }
    else {
      if (!touchedSTime) {
        setDateErr("");
      }
    }
  }, [
    props?.values?.duration?.value,
    props?.values?.startTime,
    props?.values?.endTime,
    props?.values?.startDate,
    dateErr,
    touchedSTime
  ]);


  useEffect(() => {
    if (
      props?.values?.duration?.value == 1 &&
      props?.values?.startTime > props?.values?.endTime &&
      touchedSTime &&
      touchedETime &&
      endTime !== null
    ) {
      setDateErr("Please select Start Time less than End Time.");
      props.errors.endTime = "Please select Start Time less than End Time"
      if (touchedETime) {
        props.setFieldValue("endTime", null);
      }
    }
    else if (props?.values?.startTime && props?.values?.endTime && props?.values?.startTime > props?.values?.endTime) {
      props.errors.endTime = "Please select Start Time less than End Time."
    }
    else {
      if (!touchedETime) {
        setDateErr("");
      }
    }

  }, [touchedETime, props?.values?.duration?.value])



  let DurationDays = [
    { value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 3, label: 3 },
    { value: 4, label: 4 },
    { value: 5, label: 5 },
    { value: 6, label: 6 },
    { value: 7, label: 7 },
    { value: 8, label: 8 },
    { value: 9, label: 9 },
  ];

  function addDays(date, days) {
    let inputDate = new Date(date);
    inputDate.setDate(inputDate.getDate() + days - 1);
    let outputDate: any;
    const day = inputDate.getDate();
    const month = inputDate.getMonth() + 1;
    const year = inputDate.getFullYear();
    return (outputDate = `${day}/${month}/${year}`);
  }

  return (
    <div>
      {props.values.includeWalkIn && (
        <>
          <div className="row mt-3">
            <div className="col-md-4">
              <label className="font-weight-700">
                Walk-in Start Date
                <span className="maditory">*</span>
              </label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    className="datepickerWalkIn "
                    value={
                      props?.values?.startDate ? props?.values?.startDate : null
                    }
                    format="DD-MM-YYYY"
                    disablePast
                    onChange={(newValue) => {
                      const selectedDate = `${newValue?.$D}/${newValue?.$M + 1
                        }/${newValue?.$y}`;
                      const addtionDate = `${newValue?.$y}/${newValue?.$M + 1
                        }/${newValue?.$D}`;

                      setDateVal(selectedDate);
                      setAddDate(addtionDate);
                      props.values.duration = null;
                      if (
                        newValue?.$D &&
                        newValue?.$M + 1 &&
                        newValue?.$y &&
                        new Date(
                          `${newValue?.$M + 1}/${newValue?.$D}/${newValue?.$y}`
                        ) < new Date() &&
                        `${new Date(
                          `${newValue?.$M + 1}/${newValue?.$D}/${newValue?.$y}`
                        ).toDateString()}` != `${new Date().toDateString()}`
                      ) {
                        setStartDate(null);
                        props.setFieldValue("startDate", null);
                        setWalkindateError("Please select the future date.");
                      } else {
                        setStartDate(newValue);
                        setWalkindateError("");
                        props.setFieldValue("startDate", newValue);
                      }
                    }}
                    onClose={() => {
                      setTouchedDate(true);
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
              {walkindateError && (
                <p className="form-error">{walkindateError}</p>
              )}
              {/* {!walkindateError && startDate === null && touchedDate && (
                <p className="form-error">{"Please select the start date."}</p>
              )} */}
              {!walkindateError && props.errors.startDate && props.touched.startDate && (
                <p className="form-error">{props.errors.startDate}</p>
              )}
              {props.errors.startDate && <div className="error-scroll"></div>}
            </div>

            <div className="col-md-2 mt-2">
              <label className="font-weight-700">
                Duration Days
                <span className="maditory">*</span>
              </label>
              <Select
                options={DurationDays}
                name="duration"
                className="dropstyle"
                placeholder="Days"
                isClearable={true}
                value={props.values.duration}
                onChange={(option: any) => {
                  let event = {
                    target: {
                      name: "durationDays",
                      value: option,
                    },
                  };
                  props.handleChange(event);

                  const addtionDate = `${props.values.startDate?.$y}/${props.values.startDate?.$M + 1
                    }/${props.values.startDate?.$D}`;
                  setDays(option);
                  props.setFieldValue("duration", option);
                  props.values.endDate = `${addDays(addtionDate, option.value)}`;
                }}
                onBlur={() => {
                  setTouchedDays(true);
                }}
              />
              {/* {touchedDays && Days === null && (
                <p className="form-error">
                  Please select the duration in days.
                </p>
              )} */}
              {props.errors.duration && props.touched.duration && (
                <p className="form-error">{props.errors.duration}</p>
              )}
              {props.errors.duration && <div className="error-scroll"></div>}
            </div>

            <div className="col-md-6">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["MobileTimePicker"]}>
                  <div>
                    <label className="font-weight-700">
                      Start Time
                      <span className="maditory">*</span>
                    </label>
                    <span style={{ fontSize: "11px" }}>(24hr Format)</span>
                    <MobileTimePicker
                      views={["hours", "minutes"]}
                      value={
                        props.values.startTime ? props.values.startTime : null
                      }
                      onOpen={() => { setTouchedSTime(false) }}
                      className="custom-mui-input"
                      ampm={false}
                      // value={dayjs(getTimeStampForTime("16:00").getTime())}
                      onChange={(newValue) => {
                        // setStartDate(newValue);
                        props.setFieldValue("startTime", newValue);
                        setStartTime(newValue);
                      }}
                      onClose={() => {
                        setTouchedSTime(true);
                      }}
                    />
                    {!dateErr && props.errors.startTime && props.touched.startTime && (
                      <p className="form-error">{props.errors.startTime}</p>
                    )}
                    {/* {!props.errors.startTime &&
                      touchedSTime &&
                      startTime === null && (
                        <p className="form-error error-scroll ">
                          Please select Start Time for Walk-In details.
                        </p>
                      )} */}
                    {dateErr && <p className="form-error">{dateErr}</p>}

                    {/* {!dateErr &&
                      props?.values?.duration?.value == 1 &&
                      props?.values?.startTime > props?.values?.endTime &&
                      touchedSTime &&
                      touchedETime &&
                      endTime !== null && (
                        <>
                          <p className="form-error">
                            Please select Start Time less than End Time.a
                          </p>
                        </>
                      )} */}
                  </div>
                  <div className="endTime">
                    <label className="font-weight-700">
                      End Time
                      <span className="maditory">*</span>
                    </label>
                    <span style={{ fontSize: "11px" }}>(24hr Format)</span>
                    <MobileTimePicker
                      className="endtime"
                      views={["hours", "minutes"]}
                      value={props.values.endTime ? props.values.endTime : null}
                      ampm={false}
                      onOpen={() => { setTouchedETime(false) }}
                      onChange={(newValue) => {
                        setEndTime(newValue);
                        props.setFieldValue("endTime", newValue);
                        setEndTime(newValue);
                      }}
                      onClose={() => {
                        setTouchedETime(true);
                      }}
                    />
                    {!dateErr && props.errors.endTime && props.touched.endTime && (
                      <p className="form-error">{props.errors.endTime}</p>
                    )}
                    {/* {touchedETime && endTime === null && (
                      <p className="form-error">
                        Please select End Time for Walk-In details.
                      </p>
                    )} */}
                  </div>
                </DemoContainer>
              </LocalizationProvider>
              {props.errors.endTime && <div className="error-scroll"></div>}


              {/* <div className="d-flex">
                {props.errors.startTime && props.touched.startTime && (
                  <p className="form-error">{props.errors.startTime}</p>
                )}
                {props.errors.endTime && props.touched.endTime && (
                  <p className="form-error">{props.errors.endTime}</p>
                )}
                {!props.errors.startTime &&
                  touchedSTime &&
                  startTime === null && (
                    <p className="form-error">
                      Please select Start Time.
                    </p>
                  )}
                {touchedETime && endTime === null && (
                  <p className="form-error">
                    Please select End Time.
                  </p>
                )}
                {props.errors.endTime && <div className="error-scroll"></div>}
              </div> */}
            </div>
          </div>

          {startDate !== null &&
            props?.values?.duration?.value != undefined &&
            dateval !== undefined && (
              // <p className="subforwalkin">{`Walk-in from ${dateval} to ${addDays(
              //   addDate,
              //   props?.values?.duration?.value
              // )} This job would not be visible to the candidate after walk-in end Date.`}</p>

              <p className="subforwalkin">{`Walk-in will start from ${dateval} to ${addDays(
                addDate,
                props?.values?.duration?.value
              )}. This job will not be visible to candidates after the walk-in date has passed.`}</p>
            )}

          <div className="row mt-2">
            <div className="col-lg-6 col-md-6">
              <label className="font-weight-700">Contact Person</label>

              <input
                className="form-control"
                id="contact-person"
                maxLength={150}
                name="contactPerson"
                onChange={props.handleChange}
                value={props?.values?.contactPerson}
                type="text"
                placeholder="Recruiter Name (if Available) "
              />
              {props?.errors?.contactPerson &&
                props?.touched?.contactPerson && (
                  <p className="form-error">{props?.errors.contactPerson}</p>
                )}
              {props.errors.contactPerson && (
                <div className="error-scroll"></div>
              )}
            </div>
            <div className="col-lg-6 col-md-6">
              <label className="font-weight-700" id="">
                Contact Number
              </label>

              <input
                className="form-control"
                name="contactNumber"
                maxLength={10}
                type="text"
                onInput={(e: any) => {
                  e.target.value = e.target.value.slice(0, 10);
                }}
                onChange={(e) => {
                  if (regex.numberRegx.test(e.target.value)) { props.handleChange(e); }
                }}
                value={props?.values?.contactNumber}
                placeholder="Add mobile number"
              />
              {props?.errors?.contactNumber &&
                props?.touched?.contactNumber && (
                  <p className="form-error">{props?.errors.contactNumber}</p>
                )}
              {props.errors.contactNumber && (
                <div className="error-scroll"></div>
              )}
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-lg-12 col-md-12">
              <label className="font-weight-700">
                Venue
                <span className="maditory">*</span>
              </label>

              <textarea
                name="venue"
                // id="venue"
                style={{ height: "60%" }}
                autoComplete="off"
                maxLength={500}
                // rows={3}
                placeholder="Type Venue here"
                onChange={props?.handleChange}
                value={props?.values?.venue}
                onBlur={props?.handleBlur}
                className="form-control"
              ></textarea>
              {props?.errors?.venue && props?.touched?.venue && (
                <p className="form-error">{props?.errors.venue}</p>
              )}
              {props.errors.venue && <div className="error-scroll"></div>}

              <br />
            </div>

            {/* <div className="col-lg-6 col-md-6">
              <label className="font-weight-700">Googel Map Url</label>
              <input
                className="form-control"
                name="googleMapUrl"
                type="text"
                placeholder="Google map url for venue"
                maxLength={200}
                onChange={props?.handleChange}
                value={props?.values?.googleMapUrl}
              />

              <a href="#" id="search-map" onClick={(e) => setGpModel(!gpModal)}>
                Search on Google Maps
              </a>
              {props?.errors?.googleMapUrl && props?.touched?.googleMapUrl && (
                <p className="form-error">{props?.errors.googleMapUrl}</p>
              )}

              <br />
              <br />
            </div> */}
          </div>
        </>
      )}
      <Modal
        show={gpModal}
        onHide={() => {
          setGpModel(false);
        }}
        className="modal fade modal-bx-info editor"
      >
        <div className="modal-dialog my-0  mx-0 w-100 " role="document">
          <div className="modal-content">
            <div className="modal-body bg-white m-b30" id="walkInmodel"></div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default WalkInSchedule;
