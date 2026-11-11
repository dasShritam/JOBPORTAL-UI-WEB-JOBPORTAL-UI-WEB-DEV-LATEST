import { lazy, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Autocomplete } from "@mui/material";
import TextField from "@mui/material/TextField";
import { getIndustryType } from "../../../redux/features/masterData/industrySlice";
import { LocationcityMasterData } from "../../../redux/features/masterData/LocationcitySlice";
import { DesignationMasterData } from "../../../redux/features/masterData/DesignationSlice";
import {
  authfindJob,
  resetAuthJobSearchCreator,
} from "../../../redux/features/jobs/job-listing/JobListingSlice";

const JobsList = lazy(() => import("./JobsList"));

function JobListing() {
  const dispatch = useDispatch();

  const { IndustryType, loadingI } = useSelector(
    (state: any) => state.industryType
  );
  const [showRecords, setShowRecords] = useState(false);
  const [ind, setInd] = useState<any>([]);
  const [locProp, setLocProp] = useState<any>([]);
  const [desigValue, setDesigValue] = useState<any>(null);
  const [locationValue, setLocationValue] = useState<any>(null);
  const [industryValue, setIndustryValue] = useState<any>(null);
  const [dataProp, setDataProp] = useState<any>(null);

  const { LocationcityData, Locationloading } = useSelector(
    (state: any) => state.LocationCitiesData
  );

  const DesignationmasterData = useSelector((state: any) => state.designation);
  const { DesignationData, desloading } = DesignationmasterData;
  const [desig, setDesig] = useState<any>([]);

  let industries: any = new Array<Industry>();
  interface Industry {
    value: String;
    label: string;
  }
  let locations: any = new Array<Location>();

  let designations: any = new Array<Designation>();

  interface Location {
    value: String;
    label: string;
  }
  interface Designation {
    value: String;
    label: string;
  }

  useEffect(() => {
    dispatch(getIndustryType({ pageno: -1, search: "" }));
    dispatch(LocationcityMasterData({ pageno: -1, search: "" }));
    dispatch(DesignationMasterData({ pageno: -1, search: "" }));
    const initialJobmdl = {
      pageid: 1,
      mode: "minimal",
      pageLimit: 12,
    };

    dispatch(authfindJob(initialJobmdl));
    setDataProp(initialJobmdl);
  }, []);

  useEffect(() => {
    if (IndustryType?.data?.length > 0) {
      IndustryType?.data.map((e: any, i: number) => {
        industries.push({ value: `${1 + i}`, label: e });
      });

      const industriesProps = {
        options: industries,
        getOptionLabel: (option: any | string) => option.label || option,
      };
      setInd(industriesProps);
    } else {
      const industriesProps = {
        options: [{ label: "No data", value: 1 }],
        getOptionLabel: (option: any | string) => option.label || option,
      };
      setInd(industriesProps);
    }
  }, [IndustryType, loadingI]);

  useEffect(() => {
    if (LocationcityData?.length > 0 && !Locationloading) {
      LocationcityData?.map((e: any, i: number) => {
        locations.push({ value: `${1 + i}`, label: e });
      });

      const locationProps = {
        options: locations,
        getOptionLabel: (option: any | string) => option.label || option,
      };

      setLocProp(locationProps);
    } else {
      const locationProps = {
        options: [{ label: "No data", value: 1 }],
        getOptionLabel: (option: any | string) => option.label || option,
      };

      setLocProp(locationProps);
    }
  }, [LocationcityData, Locationloading]);

  useEffect(() => {
    if (DesignationData?.length > 0 && !desloading) {
      DesignationData?.map((e: any, i: number) => {
        designations?.push({ value: `${1 + i}`, label: e });
      });

      const designationProps = {
        options: designations,
        getOptionLabel: (option: any | string) => option.label || option,
      };
      setDesig(designationProps);
    } else {
      const designationProps = {
        options: [{ label: "No data", value: 1 }],
        getOptionLabel: (option: any | string) => option.label || option,
      };
      setDesig(designationProps);
    }
  }, [DesignationData, desloading]);

  const handleJobSearch = () => {
    setShowRecords(true);

    const desigType = typeof desigValue;
    const locationType = typeof locationValue;
    const indType = typeof industryValue;
    const jobFilterModal = {
      mode: "minimal",
      pageid: 1,
      title: desigType == "string" ? desigValue : desigValue?.label,
      location: locationType == "string" ? locationValue : locationValue?.label,
      industry: indType == "string" ? industryValue : industryValue?.label,
      pageLimit: 12,
    };
    // dispatch(findJob(jobcredMdl));
    dispatch(authfindJob(jobFilterModal));
    setDataProp(jobFilterModal);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleJobSearch();
    }
  };

  useEffect(() => {
    return () => {
      dispatch(resetAuthJobSearchCreator());
    };
  }, []);

  return (
    <>
      <div className="page-content bg-white">
        <div className="container">
          <div className="dez-bnr-inr-entry">
            <div className="breadcrumb-row">
              <ul className="list-inline">
                <li>{/* <Link to={"#"}>Browse Job Filter Grid</Link> */}</li>
              </ul>
            </div>
          </div>
        </div>

        <div
          className="section-full browse-job-find"
          style={{ marginTop: "100px" }}
        >
          <div className="container">
            <div className="find-job-bx">
              <form className="dezPlaceAni">
                <div className="row">
                  <div className="col-lg-4 col-md-6">
                    <div className="form-group">
                      <Autocomplete
                        {...desig}
                        value={desigValue}
                        id="jobtitle-autocomplete"
                        autoComplete
                        freeSolo
                        includeInputInList
                        onChange={(event, newValue) => {
                          setDesigValue(newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Job Title"
                            variant="standard"
                            onChange={(e) => {
                              setDesigValue(e.target.value);
                            }}
                            onKeyUp={handleKeyDown}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="form-group">
                      <div>
                        <Autocomplete
                          {...locProp}
                          id="auto-complete"
                          autoComplete
                          freeSolo
                          includeInputInList
                          value={locationValue}
                          onChange={(event, newValue) => {
                            setLocationValue(newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Location"
                              variant="standard"
                              onChange={(e) => {
                                setLocationValue(e.target.value);
                              }}
                              onKeyUp={handleKeyDown}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="form-group">
                      <Autocomplete
                        {...ind}
                        id="auto-complete"
                        autoComplete
                        freeSolo
                        includeInputInList
                        value={industryValue}
                        onChange={(event, newValue) => {
                          setIndustryValue(newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Industry"
                            variant="standard"
                            onChange={(e) => {
                              setIndustryValue(e.target.value);
                            }}
                            onKeyUp={handleKeyDown}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="col-lg-2 col-md-6">
                    <button
                      type="button"
                      className="site-button btn-block"
                      onClick={(e) => {
                        e.preventDefault();
                        handleJobSearch();
                      }}
                    >
                      Find Job
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="content-block">
          <div className="section-full browse-job p-b50">
            <div className="container">
              <div className="row">
                <div className="col-xl-12 col-lg-12 col-md-12 ">
                  <JobsList data={dataProp} showRecords={showRecords} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default JobListing;
