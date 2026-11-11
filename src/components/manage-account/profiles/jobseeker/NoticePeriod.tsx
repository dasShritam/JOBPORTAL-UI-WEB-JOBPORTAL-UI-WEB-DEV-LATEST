import { useEffect, useState } from "react";

import Select from "react-select";
import numberToWords from "number-to-words";
import numWords from "num-words";
import {
  GetAllMonths,
  GetDaysInMonth,
  GetFutureOrPastMonths,
  GetFutureYears,
} from "../../../../common/common";
import { useSelector } from "react-redux";
import AsyncCreatableSelect from "react-select/async-creatable";
const year: any = GetFutureYears(2);
// const month = GetAllMonths(false, true);
function NoticePeriod(props: any) {
  interface ColourOption {
    label: string;
    value: string;
  }

  const Field = props.formikField;
  const values = props.formikValue;
  const errors = props.formikerror;
  const change = props.formikChange;
  const touch = props.formiktouched;
  const blur = props.formikblur;
  const [month,setMonth]= useState<any>(GetAllMonths(false, true))
  const [selectedYear, setSelectedYear] = useState<any>();
  const [selectedMonth, setSelectedMonth] = useState<any>("");
  const [selectedDay, setSelectedDay] = useState<any>("");
  const [sal, setSal] = useState<any>("");
  const handleChangeYear = (e: any) => {
    setSelectedYear(e);
  };

  const handleChangeMonth = (e: any) => {
    setSelectedMonth(e);
  };
  const handleChangeDay = (e: any) => {
    const selectedDay=e?.label;
    setSelectedDay(e);
  };



  useEffect(() => {
    setCurrencyvalue(values.offeredCurrency == "USD" ? "en-US" : "en-IN");
    if (values.offeredSalary) {
      setsalaryfunction();
    }

    if (
      values.expectedLastWorkingDay_year &&
      values.expectedLastWorkingDay_month &&
      values.expectedLastWorkingDay_day
    ) {
      setSelectedYear(
        year.filter(
          (data: { label: any }) =>
            data.label == values.expectedLastWorkingDay_year
        )
      );
      if (!selectedMonth) {
        setSelectedMonth(
          month.find((data: any) => data.label === values.expectedLastWorkingDay_month)
        );
      }   
      setSelectedDay(
        GetDaysInMonth(
          Number(values.expectedLastWorkingDay_year),
          values.expectedLastWorkingDay_month
        ).filter((data: any) => data.value == values.expectedLastWorkingDay_day)
      );
    }
    if (!values.expectedLastWorkingDay_year) {
      setSal("");
    }
  }, [values]);

  useEffect(() => {
    if (selectedYear) {
      const selectedYearLabel = selectedYear?.label;
      if (selectedYearLabel === new Date().getFullYear().toString()) {
        setMonth(GetFutureOrPastMonths(new Date().getFullYear(), month, false));
      } else {
        setMonth(GetAllMonths(false, true));
      }
    }
  }, [selectedYear]);
  useEffect(()=>{
    if(values?.expectedLastWorkingDay_year){
      if (
        Number(values.expectedLastWorkingDay_year) ===
        new Date().getFullYear()
      ) {
        setMonth(
          GetFutureOrPastMonths(
            new Date().getFullYear(),
            month,
            false
          )
        );
      } else {
         setMonth(GetAllMonths(false, true));
      }
    }
   
  },[values,values?.expectedLastWorkingDay_year])
  const [currencyvalue, setCurrencyvalue] = useState<any>("en-IN");
  const nf = new Intl.NumberFormat(currencyvalue, {
    maximumFractionDigits: 2,
  });
  const setsalaryfunction = () => {
    values.offeredSalary
      ? setSal(nf.format(Number(values.offeredSalary)))
      : setSal("");
  };

  const ChangeSalary = (cValue, salary) => {
    const nf2 = new Intl.NumberFormat(cValue, {
      maximumFractionDigits: 2,
    });

    setSal(nf2.format(salary.replace(/\,/g, "")));
    setCurrencyvalue(cValue);
  };
  const [salary, setSalary] = useState(0);
  const [ind, setInd] = useState(false);
  const [us, setUS] = useState(false);

  useEffect(() => {
    if (values.offeredCurrency == "USD") {
      setUS(true);
    } else {
      setInd(true);
    }
    setSalary(values.offeredSalary);
  }, []);

  const handleSalaryChange = (event) => {
    const newSalary = Number(event.target.value.replace(/\,/g, ""));
    setSalary(newSalary);
  };
  const getRupeeText = () => {
    if (sal == 0) {
      return;
    }
    const convertedSalary = `${numWords(salary).toLowerCase()}`;
    const capitalizedSalary =
      convertedSalary.charAt(0).toUpperCase() + convertedSalary.slice(1);
    return capitalizedSalary;
  };

  const getDollarText = () => {
    if (sal == 0) {
      return;
    }
    const convertedSalary = `${numberToWords.toWords(salary).toLowerCase()}`;
    const capitalizedSalary =
      convertedSalary.charAt(0).toUpperCase() + convertedSalary.slice(1);
    return capitalizedSalary + " " + "dollars";
  };
  /*master data fetching */
  const masterDatas = useSelector((state: any) => state.jobSeekerMasterData);
  const { JSMasterData, loading } = masterDatas,
    [nt, setNt] = useState<any>([]);
  useEffect(() => {
    if (!loading == JSMasterData) {
      JSMasterData.map((opt: any) => {
        if (opt.group === "NPRD") {
          setNt(opt.data);
        }
      });
    }
  }, [JSMasterData]);
  useEffect(() => {}, [nt, loading]);

  const DesignationmasterData = useSelector((state: any) => state.designation);
  const { DesignationData } = DesignationmasterData;
  const [desig, setDesig] = useState<any>([]);
  useEffect(() => {
    if (DesignationData) {
      const data = DesignationData?.map((c: any) => {
        return {
          label: c,
          value: c,
        };
      });
      setDesig(data);
    }
  }, [DesignationData]);

  const CompanymasterData = useSelector((state: any) => state.compnayname);
  const { CompanyData } = CompanymasterData;
  const [companyname, setcompanyname] = useState<any>([]);
  useEffect(() => {
    if (CompanyData) {
      const Data = CompanyData?.map((c: any) => {
        return {
          label: c,
          value: c,
        };
      });
      setcompanyname(Data);
    }
  }, [CompanyData]);

  useEffect(() => {}, [companyname]);
  const filterColors3 = (inputValue: string) => {
    return companyname.filter((i) =>
      i.label?.toLowerCase().includes(inputValue?.toLowerCase())
    );
  };
  const promiseOptions3: any = (inputValue: string) =>
    new Promise<ColourOption[]>((resolve) => {
      setTimeout(() => {
        resolve(filterColors3(inputValue));
      }, 1000);
    });

  const filterColors4 = (inputValue: string) => {
    return desig.filter((i) =>
      i.label?.toLowerCase().includes(inputValue?.toLowerCase())
    );
  };
  const promiseOptions4 = (inputValue: string) =>
    new Promise<ColourOption[] | any>((resolve) => {
      setTimeout(() => {
        resolve(filterColors4(inputValue));
      }, 1000);
    });

  const [inputValue, setInputValue] = useState("");
  const handleInputChange = (newValue: string) => {
    setInputValue(newValue.replace(/[^a-zA-Z0-9-.',:!()&+#/>\s]*$/, ""));
  };

  const [nextEmpValue, setNextEmpValue] = useState("");
  const handleNextEmpChange = (newValue: string) => {
    setNextEmpValue(newValue.replace(/[^a-zA-Z0-9-.',:!()&+#/>\s]*$/, ""));
  };

  return (
    <>
      <div className="col-lg-12 col-md-12">
        <div className="form-group">
          <label>Offered Salary</label>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-6 col-6">
              <div className="custom-control custom-radio">
                <input
                  type="radio"
                  className="custom-control-input"
                  id="usdollarss"
                  name="offeredCurrency"
                  value="USD"
                  onChange={(e: any) => {
                    change(e);
                    setInd(false);
                    setUS(true);
                    setTimeout(() => {
                      ChangeSalary("en-US", sal);
                    }, 0);
                  }}
                  checked={values?.offeredCurrency === "USD"}
                />
                <label className="custom-control-label" htmlFor="usdollarss">
                  US Dollars
                </label>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-6 col-6">
              <div className="custom-control custom-radio">
                <input
                  type="radio"
                  className="custom-control-input"
                  id="rupeess"
                  name="offeredCurrency"
                  value="INR"
                  onChange={(e: any) => {
                    change(e);
                    setInd(true);
                    setUS(false);
                    setTimeout(() => {
                      ChangeSalary("en-IN", sal);
                    }, 0);
                  }}
                  checked={values?.offeredCurrency === "INR"}
                />
                <label className="custom-control-label" htmlFor="rupeess">
                  Indian Rupees
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-12 col-md-6">
        <div className="form-group">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-6 col-6">
              <input
                type="text"
                min={0}
                name="offeredSalary"
                maxLength={11}
                onBlur={() => {
                  // setInd(true);
                  // setUS(false);
                }}
                onChange={(e: any) => {
                  // setInd(true);
                  // setUS(false);
                }}
                onInput={(e: any) => {
                  if (/^[0-9,]+$/.test(e.target.value)) {
                    handleSalaryChange(e);
                    e.target.value = nf.format(
                      e.target.value.replace(/\,/g, "")
                    );
                    setSal(e.target.value);
                    values.offeredSalary = e.target.value?.replace(/\,/g, "");
                  } else if (e.target.value?.length == 0) {
                    setSal("");
                  }
                }}
                className="form-control"
                placeholder="E.g. 4,50,000"
                value={sal != 0 ? sal : ""}
              />
              {ind && salary !== 0 && (
                <p className="fs-6  text-success" style={{ fontSize: "80%" }}>
                  {getRupeeText() ? getRupeeText() + " Rupees" : ""}
                </p>
              )}
              {us && salary !== 0 && (
                <p className="fs-6  text-success" style={{ fontSize: "80%" }}>
                  {getDollarText()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-12 col-md-12">
        <div className="form-group">
          <label>Expected Last Working Day</label>
          <span style={{ color: "red" }}>*</span>
          <div className="row">
            <div className="col-lg-4 col-md-4 col-sm-4 col-4">
              <div className="form-group">
                <Select
                  placeholder="Year"
                  name="expectedLastWorkingDay_year"
                  value={selectedYear}
                  isClearable={false}
                  onBlur={blur}
                  menuPlacement="auto"
                  onChange={(option) => {
                    handleChangeYear(option);
                    Field("expectedLastWorkingDay_year", option?.label);
                    if (option == null) {
                      Field("expectedLastWorkingDay_year", "");
                    }  
                    // if (
                    //   option?.label ===
                    //   new Date().getFullYear()
                    // ) {
                      
                    //   setMonth(
                    //     GetFutureOrPastMonths(
                    //       new Date().getFullYear(),
                    //       month,
                    //       false
                    //     )
                    //   );
                    // } else {
                    //    setMonth(GetAllMonths(false, true));
                    // }
                  }}
                  maxMenuHeight={170}
                  isSearchable={true}
                  options={year}
                  className={"dropstyle"}
                />
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-4 col-4">
              <div className="form-group">
                <Select
                  placeholder="Month"
                  value={selectedMonth}
                  menuPlacement="auto"
                  onBlur={blur}
                  maxMenuHeight={170}
                  name="expectedLastWorkingDay_month"
                  onChange={(option) => {
                    handleChangeMonth(option);
                    Field("expectedLastWorkingDay_month", option?.label);
                    if (option == null) {
                      Field("expectedLastWorkingDay_month", "");
                    }
                  }}
                  isSearchable={true}
                  options={month}
                  isClearable={false}
                  className={"dropstyle"}
                />
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-4 col-4">
              <div className="form-group">
                <Select
                  placeholder="Day"
                  value={selectedDay}
                  maxMenuHeight={170}
                  onBlur={blur}
                  menuPlacement="auto"
                  name="expectedLastWorkingDay_day"
                  onChange={(option) => {
                    handleChangeDay(option);
                    Field("expectedLastWorkingDay_day", option?.label);
                    if (option == null) {
                      Field("expectedLastWorkingDay_day", "");
                    }
                  }}
                  isClearable={false}
                  isSearchable={selectedYear && selectedMonth ? true : false}
                  options={
                    values?.expectedLastWorkingDay_month &&
                    values?.expectedLastWorkingDay_year &&
                    GetDaysInMonth(
                      Number(values?.expectedLastWorkingDay_year),
                      values?.expectedLastWorkingDay_month
                    )
                  }
                  className={"dropstyle"}
                />
              </div>
            </div>
          </div>
          {!(
            values.expectedLastWorkingDay_year &&
            values.expectedLastWorkingDay_month &&
            values.expectedLastWorkingDay_day
          ) &&
            touch.expectedLastWorkingDay_year &&
            touch.expectedLastWorkingDay_month &&
            touch.expectedLastWorkingDay_day && (
              <p className="form-error">
                Please specify your Last Working Day in current company.
              </p>
            )}
        </div>
      </div>
      <div className="col-lg-12 col-md-12 col-sm-12 col-12">
        <div className="form-group">
          <label>Offered Designation</label>
          {/* <input
            type="text"
            name="offeredDesg"
            maxLength={150}
            placeholder="Offered Designation"
            value={values.offeredDesg}
            onChange={change}
            className="form-control"
          /> */}

          <AsyncCreatableSelect
            className="dropstyle"
            placeholder="Type Your Designation"
            cacheOptions
            isClearable={true}
            name="offeredDesg"
            value={values.offeredDesg}
            noOptionsMessage={() => "Enter keyword to search"}
            onChange={(e: any) => {
              let event = {
                target: {
                  name: "offeredDesg",
                  value: e,
                },
              };

              // setFieldValue(
              //   "currentCompanyName",
              //   e.value
              // );
              change(event);
            }}
            loadOptions={promiseOptions4}
            // isValidNewOption={isValidInput}
            onInputChange={handleInputChange}
            inputValue={inputValue}
          />
          <p className="form-error">{errors.offeredDesg}</p>
        </div>
      </div>
      <div className="col-lg-12 col-md-12 col-sm-12 col-12">
        <div className="form-group">
          <label>Next Employment</label>
          {/* <input
            type="text"
            name="nextEmployer"
            placeholder="Next Employer"
            maxLength={150}
            value={values.nextEmployer}
            onChange={change}
            className="form-control"
          /> */}
          <AsyncCreatableSelect
            className="dropstyle"
            placeholder="Type Your Organization"
            cacheOptions
            isClearable={true}
            noOptionsMessage={() => "Enter keyword to search"}
            name="nextEmployer"
            value={values.nextEmployer}
            onChange={(e: any) => {
              let event = {
                target: {
                  name: "nextEmployer",
                  value: e,
                },
              };

              change(event);
            }}
            loadOptions={promiseOptions3}
            onInputChange={handleNextEmpChange}
            inputValue={nextEmpValue}
          />
          <p className="form-error">{errors.nextEmployer}</p>
        </div>
      </div>
    </>
  );
}

export default NoticePeriod;
