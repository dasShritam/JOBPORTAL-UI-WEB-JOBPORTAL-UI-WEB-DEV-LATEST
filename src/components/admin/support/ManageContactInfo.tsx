import { useEffect, useState } from "react";
import Select from "react-select";
import { Formik } from "formik";
import { regex } from "../../../common/validation";
import * as Yup from "yup";
import { customStyles } from "../../../common/common";
import { useDispatch, useSelector } from "react-redux";
import {
  patchContactInfo,
  resetPatchContactInfo,
} from "../../../redux/features/admin/support/ManageContactInfoSlice";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import { contactInfoMasterData } from "../../../redux/features/masterData/MasterDataInfoSlice";
import { Card, CardActions, CardContent, CardMedia } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import "../../../assets/customCss/ManageContactInfo.css";

var bnr = require("../../../assets/images/banner/manage-contact.png");
function ManageContactInfo() {
  const FORM_VALIDATION_1 = Yup.object().shape({
    PrimaryContactNumber: Yup.string()
      .matches(/^.{6,}$/, "Please enter minimum 6 charecters.")
      .required("Please enter Primary Contact Number.")
      .trim("Empty space not allowed.")
      .matches(
        regex.international_mobile,
        "Please enter valid Primary Contact Number."
      )
      .nullable(),
    SecondaryContactNumber: Yup.string()
      .matches(/^.{6,}$/, "Please enter minimum 6 charecters.")
      .trim("Empty space not allowed.")
      .matches(
        regex.international_mobile,
        "Please enter valid Secondary Contact Number."
      )
      .nullable(),
    StartTime: Yup.string().required("Please select Start Time."),
    EndTime: Yup.string().required("Please select End Time."),
    FirstWorkingDay: Yup.object()
      .required("Please select First Working Day.")
      .nullable(),
    LastWorkingDay: Yup.object()
      .required("Please select Last Working Day.")
      .nullable(),
    PrimaryEmailAddress: Yup.string()
      .required("Please enter Primary Email Address.")
      .matches(regex.email, "Please specify valid Primary Email Address.")
      .trim("Empty space not allowed."),
    SecondaryEmailAddress: Yup.string()
      .matches(regex.email, "Please specify valid Seconday Email Address.")
      .trim("Empty space not allowed."),
  });

  const [initialValues, setInitialValues] = useState({});

  let dayOfWeek = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
  ];

  const dispatch = useDispatch();

  const [firstWorkingTouched, setfirstWorkingTouched] = useState(false);
  const [lastWorkingTouched, setlastWorkingTouched] = useState(false);
  const showSnackAlert = UseToastAlert();

  const CONTACT_INFO_DATA = useSelector(
    (state: any) => state.contactInfoMasterData
  );

  const { patchResponse, patchloading } = useSelector(
    (state: any) => state.patchContactInfo
  );

  useEffect(() => {
    const masterContactObj = [
      {
        group: "CTUS",
        active: 1,
      },
    ];
    dispatch(contactInfoMasterData(masterContactObj));
  }, []);

  const handleSave = (values: any) => {
    const contactMdl = {
      ph: {
        prim: values?.PrimaryContactNumber,

        secd:
          values.SecondaryContactNumber === undefined ||
          values.SecondaryContactNumber === ""
            ? []
            : [values.SecondaryContactNumber],
      },
      mail: {
        prim: values.PrimaryEmailAddress,

        secd:
          values.SecondaryEmailAddress === undefined ||
          values.SecondaryEmailAddress === ""
            ? []
            : [values.SecondaryEmailAddress],
      },
      work_hrs: `${values.StartTime}-${values.EndTime}`,
      work_days: [
        parseInt(values.FirstWorkingDay.value),
        parseInt(values.LastWorkingDay.value),
      ],
    };

    dispatch(patchContactInfo(contactMdl));
  };

  useEffect(() => {
    if (patchResponse && patchResponse?.code && patchResponse?.code === 200) {
      setfirstWorkingTouched(false);
      setlastWorkingTouched(false);
      showSnackAlert("success", patchResponse?.message);
      dispatch(resetPatchContactInfo());
    } else if (
      patchResponse?.response &&
      patchResponse?.response?.data &&
      patchResponse?.response?.data?.code !== 200
    ) {
      showSnackAlert("warning", patchResponse?.response?.data?.message);
      dispatch(resetPatchContactInfo());
    }
  }, [patchResponse, patchResponse?.code]);

  useEffect(() => {
    CONTACT_INFO_DATA?.CInfoMasterData?.map((e, i) => {
      let modeoptions: any = [];
      if (e?.group === "CTUS") {
        e?.data?.map((e) => {
          e?.value.length > 0 && modeoptions?.push(JSON.parse(e?.value));
        });

        const modal = {
          PrimaryContactNumber: modeoptions[0]?.ph?.prim,
          SecondaryContactNumber: modeoptions[0]?.ph?.secd[0],
          StartTime: modeoptions[0]?.work_hrs.split("-")[0],
          EndTime: modeoptions[0]?.work_hrs.split("-")[1],
          FirstWorkingDay: {
            label: modeoptions[0]?.work_days[0]
              ? dayOfWeek[modeoptions[0]?.work_days[0]].label
              : "",
            value: modeoptions[0]?.work_days[0]
              ? modeoptions[0]?.work_days[0]
              : "",
          },
          LastWorkingDay: {
            label:
              modeoptions[0]?.work_days[1] !== null
                ? dayOfWeek[modeoptions[0]?.work_days[1]].label
                : "",
            value:
              modeoptions[0]?.work_days[1] !== null
                ? modeoptions[0]?.work_days[1]
                : "",
          },
          PrimaryEmailAddress: modeoptions[0]?.mail.prim,
          SecondaryEmailAddress: modeoptions[0]?.mail.secd[0],
        };
        setInitialValues(modal);
      }
    });
  }, [CONTACT_INFO_DATA]);

  return (
    <>
      <>
        <div className="page-content bg-white">
          <div className="content-block">
            <div className="browse-job section-full bg-white p-t50 p-b20">
              <div className="container">
                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 m-b30 mt-5">
                    <div className="job-bx browse-job clearfix">
                      <div className="job-bx-title  clearfix">
                        <h5 className="font-weight-700 pull-left text-uppercase">
                          <a
                            href="/public/quick-contact"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Manage Contact
                          </a>
                        </h5>
                      </div>
                      <div className="row">
                        <div className="col-md-4 col-sm-12 col-lg-4">
                          <Card className="">
                            <CardMedia
                              sx={{ height: 200 }}
                              image={bnr}
                              title="green iguana"
                            />
                            <CardContent>
                              <h4 className="">Contact Information</h4>
                              <p style={{ fontStyle: "italic" }}>
                                If you could provide your contact information
                                here, it would be helpful for candidates to post
                                their inquiries.
                              </p>
                            </CardContent>
                          </Card>
                        </div>
                        <div className="col-lg-8 col-md-8 col-sm-12">
                          <div className="m-b30 radius-sm bg-white clearfix ">
                            <>
                              <Formik
                                initialValues={initialValues}
                                enableReinitialize={true}
                                validationSchema={FORM_VALIDATION_1}
                                onSubmit={(values) => {
                                  handleSave(values);
                                }}
                              >
                                {(formik: any) => {
                                  const {
                                    values,
                                    handleChange,
                                    handleSubmit,
                                    errors,
                                    touched,
                                    handleBlur,
                                    isValid,
                                    dirty,
                                  } = formik;

                                  return (
                                    <form onSubmit={handleSubmit}>
                                      <div className="row">
                                        <div className="col-lg-6 col-md-6 ">
                                          <label className="font-weight-400">
                                            Primary Contact Number
                                            <span className="maditory">*</span>
                                          </label>

                                          <input
                                            className="form-control mb-2"
                                            name="PrimaryContactNumber"
                                            maxLength={12}
                                            onBlur={formik.handleBlur}
                                            onChange={(e) => {
                                              e.preventDefault();
                                              regex.numberTyping.test(
                                                e.target.value
                                              ) && formik.handleChange(e);
                                            }}
                                            value={
                                              formik.values.PrimaryContactNumber
                                            }
                                            placeholder="Enter your Primary Contact Number"
                                          />
                                          {formik.errors.PrimaryContactNumber &&
                                            formik.touched
                                              .PrimaryContactNumber && (
                                              <p className="form-error">
                                                {
                                                  formik.errors
                                                    .PrimaryContactNumber
                                                }
                                              </p>
                                            )}
                                        </div>
                                        <div className="col-lg-6 col-md-6">
                                          <label className="font-weight-400">
                                            Primary Email Address
                                            <span className="maditory">*</span>
                                          </label>
                                          <input
                                            type="email"
                                            className="form-control tags_input mb-2"
                                            maxLength={150}
                                            name="PrimaryEmailAddress"
                                            placeholder="Enter your Primary Email Address"
                                            onBlur={handleBlur}
                                            onChange={(e) => {
                                              e.preventDefault();
                                              formik.handleChange(e);
                                            }}
                                            value={
                                              formik.values.PrimaryEmailAddress
                                            }
                                          />
                                          {formik.errors.PrimaryEmailAddress &&
                                            formik.touched
                                              .PrimaryEmailAddress && (
                                              <p className="form-error">
                                                {
                                                  formik.errors
                                                    .PrimaryEmailAddress
                                                }
                                              </p>
                                            )}
                                        </div>
                                      </div>
                                      <div className="row mt-2">
                                        <div className="col-lg-6 col-md-6 ">
                                          <label className="font-weight-400">
                                            Secondary Contact Number
                                          </label>

                                          <input
                                            className="form-control mb-2"
                                            name="SecondaryContactNumber"
                                            maxLength={12}
                                            onBlur={formik.handleBlur}
                                            onChange={(e) => {
                                              e.preventDefault();
                                              regex.numberTyping.test(
                                                e.target.value
                                              ) && formik.handleChange(e);
                                            }}
                                            value={
                                              formik.values
                                                .SecondaryContactNumber
                                            }
                                            placeholder="Enter your Secondary Contact Number"
                                          />
                                          {formik.errors
                                            .SecondaryContactNumber &&
                                            formik.touched
                                              .SecondaryContactNumber && (
                                              <p className="form-error">
                                                {
                                                  formik.errors
                                                    .SecondaryContactNumber
                                                }
                                              </p>
                                            )}
                                        </div>
                                        <div className="col-lg-6 col-md-6">
                                          <label className="font-weight-400">
                                            Secondary Email Address
                                          </label>
                                          <input
                                            type="email"
                                            className="form-control tags_input mb-2"
                                            maxLength={150}
                                            name="SecondaryEmailAddress"
                                            placeholder="Enter your Secondary Email Address"
                                            onBlur={handleBlur}
                                            onChange={(e) => {
                                              e.preventDefault();
                                              formik.handleChange(e);
                                            }}
                                            value={
                                              formik.values
                                                .SecondaryEmailAddress
                                            }
                                          />
                                          {formik.errors
                                            .SecondaryEmailAddress &&
                                            formik.touched
                                              .SecondaryEmailAddress && (
                                              <p className="form-error">
                                                {
                                                  formik.errors
                                                    .SecondaryEmailAddress
                                                }
                                              </p>
                                            )}
                                        </div>
                                      </div>

                                      <div className="row mt-2">
                                        <div className="col-lg-6 col-md-6">
                                          <label className="font-weight-400">
                                            First Working Day
                                            <span className="maditory">*</span>
                                          </label>
                                          <Select
                                            name="FirstWorkingDay"
                                            className="dropstyle"
                                            styles={customStyles}
                                            placeholder="First Working Day"
                                            options={dayOfWeek}
                                            value={
                                              formik.values.FirstWorkingDay
                                            }
                                            onBlur={() => {
                                              setfirstWorkingTouched(true);
                                            }}
                                            onChange={(option: any) => {
                                              let event = {
                                                target: {
                                                  name: "FirstWorkingDay",
                                                  value: option,
                                                },
                                              };
                                              formik.handleChange(event);
                                            }}
                                          />
                                          {values?.FirstWorkingDay?.value ==
                                            undefined &&
                                            firstWorkingTouched && (
                                              <p className="form-error">
                                                Please select First Working Day.
                                              </p>
                                            )}
                                        </div>
                                        <div className="col-lg-6 col-md-6">
                                          <label className="font-weight-400">
                                            Last Working Day
                                            <span className="maditory">*</span>
                                          </label>
                                          <Select
                                            name="LastWorkingDay"
                                            className="dropstyle"
                                            styles={customStyles}
                                            placeholder="Last Working Day"
                                            isClearable={false}
                                            options={dayOfWeek}
                                            value={formik.values.LastWorkingDay}
                                            onBlur={() => {
                                              setlastWorkingTouched(true);
                                            }}
                                            onChange={(option: any) => {
                                              let event = {
                                                target: {
                                                  name: "LastWorkingDay",
                                                  value: option,
                                                },
                                              };
                                              formik.handleChange(event);
                                            }}
                                          />
                                          {values?.LastWorkingDay?.value ==
                                            undefined &&
                                            lastWorkingTouched && (
                                              <p className="form-error">
                                                Please select Last Working Day.
                                              </p>
                                            )}
                                        </div>
                                      </div>

                                      <div className="row mt-2">
                                        <div className="col-lg-6 col-md-3">
                                          <label className="font-weight-400">
                                            Start Time
                                            <span className="maditory">*</span>
                                          </label>
                                          <div className="cs-form">
                                            <input
                                              title=""
                                              name="StartTime"
                                              type="time"
                                              className="form-control"
                                              onBlur={handleBlur}
                                              placeholder="Start Time"
                                              value={formik.values.StartTime}
                                              onChange={(e) => {
                                                formik.handleChange(e);
                                              }}
                                            />
                                            {formik.errors.StartTime &&
                                              formik.touched.StartTime && (
                                                <p className="form-error">
                                                  {formik.errors.StartTime}
                                                </p>
                                              )}
                                          </div>
                                        </div>
                                        <div className="col-lg-6 col-md-3">
                                          <label className="font-weight-400">
                                            End Time
                                            <span className="maditory">*</span>
                                          </label>
                                          <div className="cs-form">
                                            <input
                                              title=""
                                              name="EndTime"
                                              type="time"
                                              className="form-control"
                                              placeholder="End Time"
                                              onBlur={handleBlur}
                                              value={formik.values.EndTime}
                                              onChange={(e) => {
                                                formik.handleChange(e);
                                              }}
                                            />
                                            {formik.errors.EndTime &&
                                              formik.touched.EndTime && (
                                                <p className="form-error">
                                                  {formik.errors.EndTime}
                                                </p>
                                              )}
                                          </div>
                                        </div>
                                      </div>

                                      <LoadingButton
                                        className="mt-4"
                                        type="submit"
                                        style={{ float: "right" }}
                                        onClick={() => {
                                          setfirstWorkingTouched(true);
                                          setlastWorkingTouched(true);
                                        }}
                                        // endIcon={<SendIcon />}
                                        loading={patchloading}
                                        loadingPosition="end"
                                        variant="contained"
                                      >
                                        <span>Save</span>
                                      </LoadingButton>
                                    </form>
                                  );
                                }}
                              </Formik>
                            </>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </>
  );
}

export default ManageContactInfo;
