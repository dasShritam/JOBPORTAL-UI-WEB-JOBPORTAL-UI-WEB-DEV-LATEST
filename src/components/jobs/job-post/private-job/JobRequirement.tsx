import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { components } from "react-select";
import AsyncCreatableSelect from "react-select/async-creatable";
import Slider from "@mui/material/Slider";
import { EducationOption } from "./formData";
import Select from "react-select";
import { Modal } from "react-bootstrap";
import WalkInSchedule from "./WalkInSchedule";
import { useSelector } from "react-redux";
import {
  RollCategoryMasterData,
  RollMasterData,
  skillsMasterData,
  specializationMasterData,
} from "../../../../ApiCall/masterData";
import { debounce } from "lodash";
import { regex } from "../../../../common/validation";
import { BsInfoCircle } from "react-icons/bs";
import { Alert, FormControl, Input } from "@mui/material";
import { customStyles } from "../../../../common/common";

interface selectType {
  label: string;
  value: string;
}
const emptySelect: selectType = {
  label: "",
  value: "",
};

type Option = {
  label: string;
  value: string;
  children?: Option[];
  type: string;
  id: string;
  isCourse: boolean;
};

const salarymin = 10000,
  salarymax = 50000000,
  salaryinc = 25000;

function JobRequirement(props: any) {
  const [showpercentage, setShowpercentage] = useState(false);
  const [hidechange, setHidechange] = useState(true);

  //omar
  const [deptState, setDeptstate] = useState([{ label: "", value: "" }]);
  const [locationstate, setLocationstate] = useState<any>();
  const [selectDisable, setSelectDisable] = useState(false);
  const [selectDisableIndus, setSelectDisableIndus] = useState(false);

  const location_master_data = useSelector((state: any) => state.locationcity);
  const department_master_data = useSelector(
    (state: any) => state.departmentdata
  );
  const industry_master_data = useSelector((state: any) => state.industryType);

  const GetColleges = useSelector((state: any) => state.GetPremiumCollege);
  const [maxExp, setMaxExp] = useState(30);
  const [maxExpChanged, setMaxExpChanged] = useState(props?.values.workExp[1]);
  const [minExpChanged, setMinExpChanged] = useState(props?.values.workExp[0]);

  const [maxSal, setMaxSal] = useState(salarymax);
  const [maxSalChanged, setMaxSalChanged] = useState(props.values.currency[1]);
  const [minSalChanged, setMinSalChanged] = useState(props.values.currency[0]);

  const handleMinExpChange = (e) => {
    if (e.target.value >= maxExp) {
      return;
    } else {
      const maxValue = props.values?.workExp[1];
      const minValue = Number(e.target.value);
      let array: any = [];
      if (minValue > maxValue) {
        setMinExpChanged(maxValue);
        setMaxExpChanged(minValue);
        array = [maxValue, minValue];
      } else {
        setMinExpChanged(minValue);
        array = [minValue, maxValue];
      }

      const event = {
        target: {
          name: "workExp",
          value: array,
        },
      };
      props.handleChange(event);
    }
  };

  const handleMaxExpChange = (e) => {
    if (e.target.value > maxExp) {
      if (e.target.value > 30) return;
      setMaxExp(Number(e.target.value));
    } else {
      const minExp = props.values?.workExp[0];
      const event = {
        target: {
          name: "workExp",
          value: [minExp, Number(e.target.value)],
        },
      };
      setMaxExpChanged(Number(e.target.value));
      props.handleChange(event);
    }
  };
  const handleWorkExpSliderChange = (value) => {
    if (value[1] === 0 && value[0] > 0) {
      setMaxExpChanged(value[0]);
      setMinExpChanged(value[1]);
    } else {
      setMaxExpChanged(value[1]);
      setMinExpChanged(value[0]);
    }
  };

  const handleMinSalChange = (e) => {
    if (e.target.value >= maxSal) {
      return;
    } else {
      const maxValue = props.values.currency[1];
      const minValue = Number(e.target.value);
      let array: any = [];
      if (minValue > maxValue) {
        setMinSalChanged(maxValue);
        setMaxSalChanged(minValue);
        array = [maxValue, minValue];
      } else {
        setMinSalChanged(minValue);
        array = [minValue, maxValue];
      }

      const event = {
        target: {
          name: "currency",
          value: array,
        },
      };
      props.handleChange(event);
    }
  };

  const handleMaxSalChange = (e) => {
    if (e.target.value > maxSal) {
      if (e.target.value > salarymax) return;
      setMaxSal(Number(e.target.value));
    } else {
      const minSal = props.values.currency[0];
      const event = {
        target: {
          name: "currency",
          value: [minSal, Number(e.target.value)],
        },
      };
      setMaxSalChanged(Number(e.target.value));
      props.handleChange(event);
    }
  };

  const handleSalSliderChange = (value) => {
    if (value[1] === 0 && value[0] > 0) {
      setMaxSalChanged(value[0]);
      setMinSalChanged(value[1]);
    } else {
      setMaxSalChanged(value[1]);
      setMinSalChanged(value[0]);
    }
  };

  //

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [checkedItems, setCheckedItems] = useState<any>("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const handleCheckAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckedItems = GetColleges?.data?.data.reduce((acc, item) => {
      acc[item] = event.target.checked;
      return acc;
    }, {});
    setCheckedItems(newCheckedItems);
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedItems({
      ...checkedItems,
      [event.target.name]: event.target.checked,
    });
  };
  const handleSaveSelections = async () => {
    const newSelectedItems = await Object.entries(checkedItems)
      .filter(([key, value]) => value)
      .map(([key]) => key);
    setSelectedItems(newSelectedItems);
    const event = {
      target: {
        name: "premium",
        value: newSelectedItems,
      },
    };
    props.handleChange(event);
    // props.values.premium = newSelectedItems
    setDisplayModel(false);
  };
  const limitLocation = (e: any) => {
    if (e?.length >= 10) {
      setSelectDisable(true);
    }
    if (e?.length < 10) {
      setSelectDisable(false);
    }
  };
  const limitIndustry = (e: any) => {
    if (e?.length >= 10) {
      setSelectDisableIndus(true);
    }
    if (e?.length < 10) {
      setSelectDisableIndus(false);
    }
  };

  const handleCancelSelections = () => {
    setCheckedItems(
      selectedItems.reduce((acc: any, item: any) => {
        acc[item] = true;
        return acc;
      }, {})
    );
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredItems =
    GetColleges?.data?.data &&
    GetColleges?.data?.data.filter((item) =>
      item.toLowerCase().includes(searchQuery.toLowerCase())
    );

  useEffect(() => {
    setMinExpChanged(props?.values.workExp[0]);
    setMaxExpChanged(props?.values.workExp[1]);
    setMinSalChanged(props.values.currency[0]);
    setMaxSalChanged(props.values.currency[1]);
  }, [props?.values?.currency]);

  const [roleCategoryMeta, setRoleCategoryMeta] = useState<any>([]);
  const [JobroleMeta, setJobRoleMeta] = useState<any>([]);
  const [optionsRendered, setOptionsRendered] = useState<any>(false);

  const handleDepartmentStateChange = (option: any) => {
    handleRoleCategoryStateChange(emptySelect);
  };
  const handleRoleCategoryStateChange = (option: any) => {
    // handleRoleStateChange(emptySelect);
  };

  const getRoleCategories = async (
    value: string,
    valueBindRequired: boolean = false
  ) => {
    const data = { pageNo: -1, parent_id: value, active: 1 };
    const rc = await RollCategoryMasterData(data);
    const optionData = rc?.map((d: any, i: any) => {
      return { value: `${d.id}`, label: d.name };
    });
    setRoleCategoryMeta(optionData);
    if (roleCategoryMeta?.length === 0) {
      let role: any = optionData.find((e) => {
        if (e?.label === props?.values?.roleCategory?.label) return e;
      });

      const eventt = {
        target: {
          name: "roleCategory",
          value: role,
        },
      };
      props.handleChange(eventt);
      // props.values.roleCategory = role
      props.values.roleCategory && getJobRole(role.value);
    }

    // let role: any = optionData.find((e) => {

    //   if (e?.label == props?.values?.role?.label)

    //     return e
    // })
    // setRoleCategoryState(role)
    // if (valueBindRequired) {
    //   const roleInputData = optionData.find((d: any) => { return JobSeekerProfile?.js_profile?.career_profile?.category === d.label });

    //   setRoleCategoryState(roleInputData);
    //   // getJobRole(roleInputData?.value, true)
    // }
  };

  const getJobRole = async (
    value: string,
    valueBindRequired: boolean = false
  ) => {
    const data = { pageNo: -1, parent_id: value, active: 1 };
    const rm = await RollMasterData(data);
    const optionData = rm?.map((d: any, i: any) => {
      return { value: `${d.id}`, label: d.name };
    });
    setJobRoleMeta(optionData);
    if (JobroleMeta?.length === 0) {
      let role: any = optionData.find((e) => {
        if (e?.label === props?.values?.role?.label) return e;
      });

      const eventt = {
        target: {
          name: "role",
          value: role,
        },
      };
      props.handleChange(eventt);
    }

    // if (valueBindRequired) {
    //   const jobInputData = optionData.find((d: any) => { return JobSeekerProfile?.js_profile?.career_profile?.role === d.label });
    //   setRoleState(jobInputData);
    // }
  };

  const locationmasterdata = (data: any) => {
    const options: any = [];
    data?.map((d: any) => {
      options.push({ label: d, value: d });
    });
    setLocationstate(options);
  };

  const departmentmasterdata = async (data: any) => {
    await setDeptstate(
      data?.map((d: any) => {
        return { label: d.name, value: d.id };
      })
    );
  };

  const listingJob = useSelector((state: any) => state.ManageJobs);
  const { allManageJobs } = listingJob;

  const PostJob = useSelector((state: any) => state.PostJob);

  useEffect(() => {
    if (PostJob?.res?.code === 200) {
      setSelectedItems([]);
      setCheckedItems([]);
      setSelectedOptions([]);
    }
  }, [PostJob?.res?.code]);

  useEffect(() => {
    locationmasterdata(location_master_data?.LocationcityData);
    departmentmasterdata(department_master_data?.DepartmentData);
    Industrymasterdatafunction(industry_master_data?.IndustryType);
    let depart: any = deptState.find((e) => {
      if (e?.label === props?.values?.department?.label) return e;
    });

    depart && getRoleCategories(depart?.value);
    // props?.values?.industry && props?.values?.industry
    if (roleCategoryMeta?.length !== 0) {
      let role: any = roleCategoryMeta.find((e) => {
        if (e?.label === props?.values?.roleCategory?.label) return e;
      });
      const eventt = {
        target: {
          name: "roleCategory",
          value: role,
        },
      };
      props.handleChange(eventt);
      // props.values.variablePercent &&  setShowpercentage(true);setHidechange(false);
    }
  }, [
    department_master_data,
    industry_master_data,
    location_master_data,
    optionsRendered,
  ]);

  useEffect(() => {
    if (props.values.variablePercent && props.values.currency) {
      setHidechange(false);
      setShowpercentage(true);
      setpercentage(
        (props.values.currency[0] / 100) * props.values.variablePercent
      );
      setMaxpercentage(
        (props.values.currency[1] / 100) * props.values.variablePercent
      );
    } else {
      setHidechange(true);
      setShowpercentage(false);
      setpercentage(0);
    }
  }, [props.values.variablePercent, props.values.currency]);
  const [industrymasterData, setIndustrymasterData] = useState([
    { label: "", value: "" },
  ]);
  useEffect(() => {
    setSkillsCount(
      props?.values?.keySkills?.map((skill) => skill?.label)?.join("")?.length
    );
    limitLocation(props.values.location);
    limitIndustry(props.values.industry);
  }, [props?.values?.keySkills]);

  const Industrymasterdatafunction = (data: any) => {
    const options: any = [];
    data?.data?.map((d: any) => {
      options.push({ label: d, value: d });
    });
    setIndustrymasterData(options);
  };

  //

  /*Key skills */
  const [skillsCount, setSkillsCount] = useState<number>(0);
  let countNumber: any = 0;

  const [displayModel, setDisplayModel] = useState(false);
  const handleDisplayModel = () => {
    setDisplayModel(true);
  };
  useEffect(() => {
    if (countNumber) {
      setSkillsCount(countNumber);
    }
  }, [countNumber]);

  /*Work Experience */
  function valuetext(value: number) {
    return `${value}`;
  }
  const marks = [
    { value: 0, label: "" },
    { value: 1, label: "" },
    { value: 2, label: "" },
    { value: 3, label: "" },
    { value: 4, label: "" },
    { value: 5, label: "" },
    { value: 6, label: "" },
    { value: 7, label: "" },
    { value: 8, label: "" },
    { value: 9, label: "" },
    { value: 10, label: "" },
    { value: 11, label: "" },
    { value: 12, label: "" },
    { value: 13, label: "" },
    { value: 14, label: "" },
    { value: 15, label: "" },
    { value: 16, label: "" },
    { value: 17, label: "" },
    { value: 18, label: "" },
    { value: 19, label: "" },
    { value: 20, label: "" },
    { value: 21, label: "" },
    { value: 22, label: "" },
    { value: 23, label: "" },
    { value: 24, label: "" },
    { value: 25, label: "" },
    { value: 26, label: "" },
    { value: 27, label: "" },
    { value: 28, label: "" },
    { value: 29, label: "" },
    { value: 30, label: "" },
  ];
  const [percentage, setpercentage] = useState<any>();
  const [maxpercentage, setMaxpercentage] = useState<any>();

  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]),
    [output, setOutput] = useState<Option[]>([]);

  const masterDatas = useSelector((state: any) => state.jobSeekerMasterData);
  const { JSMasterData, loading } = masterDatas;
  const [option, setOption] = useState<any>([]);
  // let options: Option[] = [];
  useEffect(() => {
    if (!loading) {
      const data = JSMasterData?.find((c) => c.group === "EDUN")?.data?.map(
        (d) => {
          if (!EducationOption?.includes(d.value)) {
            return {
              label: d.value,
              value: d.value,
              desc: d.value,
              isCourse: false,
              children: [],
              type: d.group,
            };
          } else {
            return {
              label: d.value,
              value: d.value,
              desc: d.value,
              isCourse: false,
            };
          }
        }
      );
      for (let i = 0; i < data?.length; i++) {
        switch (data[i]?.value) {
          case "Doctorate/PhD":
            const doct = JSMasterData?.find(
              (c) => c.group === "DPHD"
            )?.data?.map((d: any) => {
              return {
                label: d.value,
                value: d.value,
                isCourse: true,
                desc: d.value,
                id: d.id,
                type: "DPHD",
              };
            });
            data[i].children = doct;
            data[i].type = "DPHD";
            break;
          case "Masters/Post-Graduation":
            const masters = JSMasterData?.find(
              (c) => c.group === "MAPG"
            )?.data?.map((d: any) => {
              return {
                label: d.value,
                value: d.value,
                id: d.id,
                isCourse: true,
                desc: d.value,
                type: "MAPG",
              };
            });
            data[i].children = masters;
            data[i].type = "MAPG";
            break;
          case "Batchelor/Under-Graduation":
            const bach = JSMasterData?.find(
              (c) => c.group === "BAUG"
            )?.data?.map((d: any) => {
              return {
                label: d.value,
                value: d.value,
                id: d.id,
                isCourse: true,
                desc: d.value,
                type: "BAUG",
              };
            });
            data[i].children = bach;
            data[i].type = "BAUG";
        }

        setOption(data);
        setOptionsRendered(true);
      }
    }
  }, [loading]);

  useEffect(() => {
    if (allManageJobs?.jobs?.length && optionsRendered && option.length > 0) {
      const selectedJob =
        allManageJobs?.jobs?.length === 1 ? allManageJobs?.jobs[0] : undefined;
      if (selectedJob) {
        const array: any = [];
        const array2: any = [];

        // get data from options
        selectedJob?.education.forEach((edu) => {
          let found = false;
          option.forEach((op) => {
            const foundEdu: any = op?.children?.find(
              (c) => edu?.course === c.label
            );
            if (foundEdu) {
              array.push(foundEdu);
              if (!found && !array2?.some((c) => c.label === op?.label)) {
                array2.push(op);
                found = true;
              }
            } else {
              if (op.label === edu.course) {
                array.push(op);
                found = true;
              }
            }
          });
        });
        array.forEach(async (selectedOption) => {
          if (!selectedOption.id) {
            return null;
          }
          const courseId = selectedOption?.id;
          const body = { active: 1, parent_id: selectedOption.id };
          const specDaata: any = await specializationMasterData(body);
          const data3 = specDaata.map((c) => {
            return {
              label: c.name,
              value: c.name,
              desc: c.name,
              parentId: courseId,
            };
          });
          let newOptions: any = [...option];
          const mainIndex = newOptions.findIndex(
            (c) => c.type === selectedOption.type
          );
          const index = newOptions
            .find((c) => c.type === selectedOption?.type)
            .children?.findIndex((d) => d.id === courseId);
          newOptions[mainIndex].children[index].children = data3;
          data3.forEach((item) => {
            if (
              selectedJob?.education
                ?.find((c) => c?.course === selectedOption.label)
                ?.stream?.map((d) => d)
                .includes(item.label)
            ) {
              array4.push(item);
            }
          });

          setOption(newOptions);
        });

        const array4 = array.concat(array2);
        setOutput(array4);
        setSelectedOptions(array4);

        props.values.eduQualification = array4;
      }
    }
  }, [allManageJobs?.jobs, optionsRendered]);

  useEffect(() => {
    if (
      allManageJobs?.jobs?.length &&
      allManageJobs?.jobs[0]?.prem_colleges.length > 0
    ) {
      setSelectedItems(allManageJobs?.jobs[0]?.prem_colleges);
      // setCheckedItems(props.values.premium.map((e) => { [e]: true }))

      const newObj = allManageJobs?.jobs[0]?.prem_colleges.reduce(
        (acc, val) => {
          acc[val] = true;
          return acc;
        },
        {}
      );
      setCheckedItems(newObj);
    }
  }, [allManageJobs?.jobs]);

  async function getEduRebindingData(data: any, options: any) {
    var array: any = [];
    for (let index = 0; index < options.length; index++) {
      for (let j = 0; j < options[index]?.children.length; j++) {
        let isFound = false;
        for (let k = 0; k < data.length; k++) {}
        if (isFound) {
          array.push(options[index]);
          isFound = false;
        }
      }
      return array;
    }
  }

  const handleOptionSelect = async (
    selectedOption: Option,
    isSelected: boolean
  ) => {
    if (isSelected) {
      const index = selectedOptions.findIndex(
        (o) => o?.value === selectedOption?.value
      );
      if (index !== -1) {
        setSelectedOptions(
          output.filter((o) => o?.value !== selectedOption?.value)
        );
        setOutput(output.filter((o) => o?.value !== selectedOption?.value)); // remove unchecked selectedOption from output
      } else {
        if (!selectedOption.children) {
          setOutput([...output, selectedOption]);
        }
        setSelectedOptions([...selectedOptions, selectedOption]);
      }
      if (selectedOption?.isCourse) {
        const courseId = selectedOption?.id;
        const body = { active: 1, parent_id: selectedOption.id };
        const specDaata: any = await specializationMasterData(body);
        const data3 = specDaata.map((c) => {
          return {
            label: c.name,
            value: c.name,
            desc: c.name,
            parentId: courseId,
          };
        });

        let newOptions: any = [...option];
        const mainIndex = newOptions.findIndex(
          (c) => c.type === selectedOption.type
        );
        const index = newOptions
          .find((c) => c.type === selectedOption?.type)
          .children?.findIndex((d) => d.id === courseId);
        newOptions[mainIndex].children[index].children = data3;
        setOption(newOptions);
      }
      const event = {
        target: {
          name: "eduQualification",
          value: [...selectedOptions, selectedOption],
        },
      };

      props.handleChange(event);
    } else {
      let newData: any = [];

      if (selectedOption?.type && selectedOption?.isCourse === false) {
        const parentIds = selectedOptions
          ?.filter((c) => c.type === selectedOption?.type && c.isCourse)

          ?.map((d) => d.id);
        newData = selectedOptions.filter(
          (c: any) =>
            c.label !== selectedOption.label &&
            !parentIds.includes(c?.parentId) &&
            !parentIds.includes(c?.id)
        );
      } else {
        newData = selectedOptions.filter(
          (c: any) =>
            c.label !== selectedOption.label &&
            (selectedOption?.id ? c?.parentId !== selectedOption?.id : true)
        );
        // const newData = selectedOptions.filter((c) => c.label !== selectedOption.label);
      }
      setSelectedOptions(newData);
      setOutput(newData);
      const event = { target: { name: "eduQualification", value: newData } };
      props.handleChange(event);
      // setEduData(newData)
    }
  };

  useEffect(() => {
    let eduCourses = selectedOptions?.filter(
      (c) => c.isCourse || EducationOption.includes(c.label)
    );
    let eduData: any = eduCourses.map((c: any) => {
      return {
        course: c.label,
        stream: EducationOption.includes(c.label)
          ? []
          : selectedOptions
              ?.filter((x: any) => x.parentId == c.id)
              ?.map((z) => {
                return z.label;
              }),
      };
    });
    // if (eduData?.length == 0) {
    //   props.setFieldError("eduQualification", "please seleeeeee")
    // }
    //  setEduError(true) : setEduError(false);
  }, [props.values.eduQualification, selectedOptions, output]);

  const formatOptionLabel = (
    { label, desc }: any,
    { context }: { context: string }
  ) => {
    if (context === "value") {
      return label;
    }
    return <div>{desc}</div>;
  };

  const renderOption = (option: Option, depth: number = 0) => {
    const isOptionGroup = option?.children !== undefined;
    const optionClassName = isOptionGroup ? "option-group" : "option";
    const isSelected = selectedOptions.some((o) => o?.value === option?.value);

    return (
      <div
        key={option?.label}
        className={`${optionClassName} depth-${depth}`}
        style={{
          paddingLeft: `${(depth + 1) * 10}px`,
        }}
      >
        <input
          type="checkbox"
          value={"check"}
          id={`eduCheck_${option.id}`}
          checked={isSelected}
          onChange={() => {
            handleOptionSelect(option, isSelected === true ? false : true);
          }}
        />
        <label
          style={{ cursor: "pointer" }}
          onClick={() => {
            handleOptionSelect(option, isSelected === true ? false : true);
          }}
        >
          {option?.value}
        </label>
        {isOptionGroup && isSelected && (
          <div className="option-children">
            {option.children?.map((childOption) =>
              renderOption(childOption, depth + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  const filterSkills: any = (inputValue: string, callback) => {
    if (inputValue.length >= 1) {
      const data = { pageno: 1, search: `${inputValue}` };
      skillsMasterData(data).then((res) =>
        callback(
          res.map((skill) => {
            return { label: skill, value: skill };
          })
        )
      );
    } else {
      return [];
    }
  };

  const loadSkillsOptions = useCallback(debounce(filterSkills, 1000), []);

  const handleSelectOption = (option) => {
    const res = handleChangeInputt(option);
    if (res) {
      //  setInpSkill(option);
      let event = {
        target: {
          name: "keySkills",
          value: option,
        },
      };
      props.handleChange(event);
      // props.values.keySkills = option;
    }
  };

  const handleChangeInputt = (e): boolean => {
    const skills = e
      .map((skill) => skill.value)
      .toString()
      .replaceAll(",", "");

    if (skills.length > 250) {
      return false;
    } else if (skills.length) {
      // setErrorMsg(false);
    } else {
      // setErrorMsg(true);
      setSkillsCount(skills.length);
      return true;
    }
    setSkillsCount(skills.length);
    return true;
  };

  return (
    <div id="job_req_bx" className="job-bx bg-white m-b30">
      <h5 className="mb-2 mt-4">Job Requirements</h5>
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <div className="row">
          <div className="col-lg-12 col-md-12">
            <div className="">
              <label>
                Key Skills
                <span style={{ color: "red" }}>*</span>
              </label>
              <div className="d-flex justify-content-between">
                <span
                  className="font_italic_sm mb-2 "
                  style={{ color: "#f8b065" }}
                >
                  Specify Key skills required for this job role.
                </span>
                {/* {props.values.keySkills?.length > 0 && (
                  <Link
                    to="#"
                    onClick={() => {
                      props.setFieldValue("keySkills", []);
                      setSkillsCount(0);
                    }}
                  >
                    Clear All
                  </Link>
                )} */}
              </div>
              <AsyncCreatableSelect
                components={components}
                placeholder="Enter your area of expertise/specialization"
                cacheOptions
                isClearable={true}
                noOptionsMessage={() => "Enter keyword to search"}
                className="dropstyle"
                name="keySkills"
                isMulti
                value={props.values.keySkills}
                onChange={(e) => {
                  // props.handleChange(e);
                  handleSelectOption(e);

                  // props.handleChange(inpSkill)
                }}
                loadOptions={loadSkillsOptions}
              />

              <div className="d-flex justify-content-between">
                <div>
                  {props.errors.keySkills && props.touched.keySkills ? (
                    <span>
                      <p className="form-error">{props.errors.keySkills}</p>
                    </span>
                  ) : (
                    ""
                  )}
                  {props.errors.keySkills && (
                    <div className="error-scroll"></div>
                  )}
                </div>
                <span className="custom-char-count mb-2">
                  {!isNaN(250 - skillsCount) ? 250 - skillsCount : 250}{" "}
                  Character(s) Left
                </span>
              </div>

              <div className="isHotDiv mb-4">
                <label>
                  Work Experience(Year)
                  <span style={{ color: "red" }}>*</span>
                </label>
                <div className="d-flex align-items-center ">
                  <div className="d-flex">
                    <input
                      type="text"
                      className="form-control"
                      style={{ width: "50px" }}
                      value={minExpChanged}
                      onChange={(e) => {
                        if (regex.numberRegx.test(e.target.value)) {
                          handleMinExpChange(e);
                        }
                      }}
                    />
                    <input
                      type="text"
                      style={{ width: "50px" }}
                      className="form-control"
                      value={maxExpChanged}
                      onChange={(e: any) => {
                        if (regex.numberRegx.test(e.target.value)) {
                          handleMaxExpChange(e);
                        }
                      }}
                    />
                  </div>
                  <div style={{ width: "70%" }} className="mt-4">
                    <Slider
                      getAriaLabel={() => "Temperature range"}
                      value={props.values.workExp}
                      onChange={(e: any) => {
                        if (e.target !== null) {
                          e.target.name = "workExp";
                          handleWorkExpSliderChange(e.target.value);
                        }
                        props.handleChange(e);
                      }}
                      valueLabelDisplay="auto"
                      getAriaValueText={valuetext}
                      min={0}
                      max={marks.length - 1}
                      marks={marks}
                      className="props.classes.thumb"
                      valueLabelFormat={(value) => <div>{value * 1}</div>}
                    />
                  </div>
                </div>
                {props.errors.workExp && props.touched.workExp && (
                  <p className="form-error">{props.errors.workExp}</p>
                )}
              </div>
              <div className="isHotDiv">
                <label>
                  Annual Salary Range
                  <span style={{ color: "red" }}>*</span>
                </label>
                <div className="font_italic_sm mb-5">
                  Please select the salary offered for this job using the slider
                  below. Move the slider left or right to adjust the salary
                  amount
                </div>
                <div className="d-flex align-items-center">
                  <div
                    className="btn-group "
                    role="group"
                    aria-label="Toggle manual switch"
                  >
                    {/* <button
                      type="button"
                      className="btn btn-outline-primary "
                      onClick={handleIndianrupee}
                    >
                      ₹
                    </button> */}
                    <label>
                      <input
                        type="radio"
                        name="currencySymbole"
                        value="INR"
                        className="card-input-element"
                        checked={props.values.currencySymbole === "INR"}
                        onChange={props.handleChange}
                      />
                      <div
                        className={
                          props.values.currencySymbole === "INR"
                            ? "btn btn-primary btn-sm"
                            : "btn btn-outline-primary btn-sm"
                        }
                      >
                        ₹
                      </div>
                    </label>
                    <label className="mr-3">
                      <input
                        type="radio"
                        name="currencySymbole"
                        value="USD"
                        className="card-input-element"
                        checked={props.values.currencySymbole === "USD"}
                        onChange={props.handleChange}
                      />
                      <div
                        className={
                          props.values.currencySymbole === "USD"
                            ? "btn btn-primary btn-sm"
                            : "btn btn-outline-primary btn-sm"
                        }
                      >
                        $
                      </div>
                    </label>
                  </div>
                  <div className="d-flex">
                    <input
                      type="text"
                      className="form-control"
                      value={minSalChanged}
                      onBlur={(e: any) => {
                        if (e.target.value == 0 || e.target.value < salarymin) {
                          e.target.value = salarymin;
                          handleMinSalChange(e);
                        }
                      }}
                      onChange={(e) => {
                        if (regex.numberRegx.test(e.target.value)) {
                          handleMinSalChange(e);
                        }
                      }}
                    />
                    <input
                      type="text"
                      className="form-control"
                      value={maxSalChanged}
                      onBlur={(e: any) => {
                        if (e.target.value == 0 || e.target.value < salarymin) {
                          e.target.value = salarymax;
                          handleMaxSalChange(e);
                        }
                      }}
                      onChange={(e: any) => {
                        if (regex.numberRegx.test(e.target.value)) {
                          handleMaxSalChange(e);
                        }
                      }}
                    />
                  </div>
                </div>
                <div
                  className="d-flex align-items-center"
                  style={{ width: "100%" }}
                >
                  <Slider
                    getAriaLabel={() => "Temperature range"}
                    value={props.values.currency}
                    valueLabelDisplay="auto"
                    getAriaValueText={valuetext}
                    min={salarymin}
                    max={salarymax}
                    step={salaryinc}
                    className="props.classes.thumb"
                    valueLabelFormat={(value) => <div>{value}</div>}
                    onChange={(e: any) => {
                      if (e.target !== null) {
                        e.target.name = "currency";
                        handleSalSliderChange(e.target.value);
                      }
                      props.handleChange(e);
                      // setpercentage(
                      //   (props.values.currency[0] / 100) *
                      //   props.values.variablePercent
                      // );
                      // setMaxpercentage(
                      //   (props.values.currency[1] / 100) *
                      //   props.values.variablePercent
                      // );
                    }}
                  />
                  {props.errors.currency && props.touched.currency ? (
                    <span>
                      <p className="form-error">{props.errors.currency}</p>
                    </span>
                  ) : null}
                </div>

                {
                  // props.values.variablePercent ==''
                  hidechange && (
                    <div className="c_content_desc ">
                      Entire salary is fixed.It does not include any variable
                      component.
                      <Link
                        to="#"
                        style={{ textDecoration: "none" }}
                        className="p-2"
                        onClick={() => {
                          setShowpercentage(true);
                          setHidechange(false);
                        }}
                      >
                        Change
                      </Link>
                    </div>
                  )
                }
              </div>
              {showpercentage && (
                // props.values.variablePercent !=''

                <div className="mt-3">
                  Percentage of salary that is variable
                  <div>
                    <div className="input-group mb-3 mt-2">
                      <div className="input-group-prepend">
                        <span className="input-group-text">%</span>
                      </div>
                      <input
                        type="number"
                        value={props.values.variablePercent}
                        onInput={(e: any) => {
                          e.target.value = e.target.value.slice(0, 3);
                          if (e.target.value > 99) {
                            e.target.value = "100";
                          }
                        }}
                        onChange={(e: any) => {
                          if (e.target !== null) {
                            e.target.name = "variablePercent";
                          }
                          props.handleChange(e);

                          // setpercentage(
                          //   (props.values.currency[0] / 100) * e.target.value
                          // );
                          // setMaxpercentage(
                          //   (props.values.currency[1] / 100) * e.target.value
                          // );
                        }}
                        className="form-control col-lg-1 col-md-2 text-center"
                        placeholder="00"
                        maxLength={2}
                      />
                      {percentage !== undefined && percentage !== 0 ? (
                        <div className="mt-2">
                          {/* <label htmlFor="">{`${props.values.₹}? ₹ ${percentage} ${props.values.$}` :` $ ${percentage}`}</label> */}
                          {/* <label htmlFor="">{props.values.₹ ?` ₹ ${percentage} ${props.values.$}`:`$ ${percentage}`}</label> */}
                          {percentage !== undefined
                            ? `${
                                props.values.currencySymbole === "INR"
                                  ? "₹"
                                  : "$"
                              }  ${percentage} is variable `
                            : "Entire salary is fixed"}
                          {maxpercentage !== undefined
                            ? `${
                                props.values.currencySymbole === "INR"
                                  ? " - ₹"
                                  : " - $"
                              }  ${maxpercentage} is variable`
                            : null}
                        </div>
                      ) : (
                        <div className="mt-2">Entire salary is fixed</div>
                      )}
                    </div>

                    <span className="c_content_desc">
                      Specify the percentage of variable component which is
                      included in salary above
                    </span>
                  </div>
                </div>
              )}
              <div>
                <input
                  type="checkbox"
                  className="mr-2 mt-3"
                  name={"isSalaryHidden"}
                  id="isSalaryHidden"
                  value={props.values.isSalaryHidden}
                  checked={props.values.isSalaryHidden}
                  onChange={(e: any) => {
                    props.handleChange(e);
                  }}
                />
                <label htmlFor="isSalaryHidden" className="">
                  Hide salary details from candidates
                </label>
                {props.values.isSalaryHidden && (
                  <Alert severity="info" style={{ fontFamily: "poppins" }}>
                    Displaying salary invites higher number of responses.
                    However, if you want to show salary, Please enter correct
                    salary to reach out to a relevant pool of candidates.
                  </Alert>
                )}
              </div>
              <div>
                <label>
                  Location (MAX 10)
                  <span style={{ color: "red" }}>*</span>
                </label>
                <Select
                  placeholder="Search and add locations"
                  isClearable={true}
                  className="dropstyle mt-2 mb-2"
                  styles={customStyles}
                  isOptionDisabled={() => selectDisable}
                  name="location"
                  isMulti
                  value={props.values.location}
                  onChange={(e: any) => {
                    limitLocation(e);
                    let event = {
                      target: {
                        name: "location",
                        value: e,
                      },
                    };
                    props.handleChange(event);
                  }}
                  options={locationstate}
                  //  loadOptions={}
                />
                {props.errors.location && props.touched.location && (
                  <span>
                    <p className="form-error">{props.errors.location}</p>
                  </span>
                )}
                {props.errors.location && <div className="error-scroll"></div>}
                <span className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="Relocate"
                    name="isReadyToRelocate"
                    value={props.values.isReadyToRelocate}
                    checked={props.values.isReadyToRelocate}
                    onChange={(e: any) => {
                      props.handleChange(e);
                    }}
                  />
                  <label
                    className="custom-control-label c_content_desc m-b-2"
                    htmlFor="Relocate"
                  >
                    Also willing to hire candidates who are ready to relocate to
                    above locations
                  </label>
                </span>
              </div>
              <div>
                {/* <label>Locality</label> */}
                {/* <div
                  className="nested-multi-select"

                > */}
                {/* <Select
                    options={options}
                    isMulti
                    isSearchable={true}
                    isClearable={true}
                    isDisabled={false}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    onChange={(e: any) => {
                      setSelectedOptions(e);
                      if (!e.children) {
                        setOutput(e);
                      }
                    }}
                    value={output}
                    components={{ Option: (props: any) => renderOption(props.data) }}
                  /> */}
                {/* {renderSelectedOptions()} */}

                {/* <Chip label={""} color="primary" /> */}
                {/* {displayOutputValue} */}
                {/* </div> */}

                {/* <AsyncCreatableSelect
                  components={components}
                  placeholder="Search and add localities"
                  cacheOptions
                  isClearable={false}
                  className="dropstyle mt-2 mb-2"
                  name="locality"
                  isMulti
                  value={props.values.locality}
                  onChange={(e: any) => {
                    let event = {
                      target: {
                        name: "locality",
                        value: e,
                      },
                    };
                    props.handleChange(event);
                  }}
                  defaultOptions
                //  loadOptions={}
                /> */}
              </div>
              <div className="mt-2">
                <label>
                  Preferred Industries (MAX 10)
                  <span style={{ color: "red" }}>*</span>
                </label>
                <div
                  className="font_italic_sm mb-1"
                  style={{ color: "#f8b065" }}
                >
                  Add the industries you're looking to hire candidates from
                </div>
                <Select
                  placeholder="Select Industries"
                  isSearchable={true}
                  isClearable={true}
                  isOptionDisabled={() => selectDisableIndus}
                  isMulti={true}
                  isDisabled={false}
                  options={industrymasterData}
                  value={props.values.industry}
                  // value={
                  //   industryState?.value != ""
                  //     ? industryState
                  //     : ""
                  // }
                  className="dropstyle"
                  styles={customStyles}
                  name="industry"
                  onChange={(option: any) => {
                    limitIndustry(option);
                    let event = {
                      target: {
                        name: "industry",
                        value: option,
                      },
                    };
                    props.handleChange(event);
                  }}
                />
                {props.errors.industry && props.touched.industry && (
                  <span>
                    <p className="form-error">{props.errors.industry}</p>
                  </span>
                )}
                {props.errors.industry && <div className="error-scroll"></div>}
              </div>
              <div className="mt-3">
                <label>Department</label>
                <span style={{ color: "red" }}>*</span>
                &nbsp;
                <BsInfoCircle title="It is the department of the company you are hiring for.Ex: Marketing, Sales, Accounts." />
                <Select
                  placeholder="Select Department"
                  isSearchable={true}
                  isDisabled={false}
                  options={deptState}
                  // value={departmentState?.label != "" ? departmentState : ""}
                  value={props.values.department}
                  className="dropstyle"
                  styles={customStyles}
                  name="department"
                  onChange={(option: any) => {
                    let event = {
                      target: {
                        name: "department",
                        value: option,
                      },
                    };
                    handleDepartmentStateChange(option);
                    props.handleChange(event);
                    getRoleCategories(option.value);
                    props.values.roleCategory = "";
                  }}
                />
              </div>
              {props.errors.department && props.touched.department ? (
                <span>
                  <p className="form-error">{props.errors.department}</p>
                </span>
              ) : (
                ""
              )}
              {props.errors.department && <div className="error-scroll"></div>}
              {props.values.department && (
                <div className="mt-3">
                  <label>Role Category</label>
                  <span className="p-1" style={{ color: "red" }}>
                    *
                  </span>
                  <BsInfoCircle title="It is the role category in a company you are hiring for." />
                  <Select
                    placeholder="Select Role Category"
                    isSearchable={true}
                    isClearable={false}
                    isDisabled={false}
                    options={roleCategoryMeta}
                    value={props.values.roleCategory}
                    // value={
                    //   roleCategoryState?.label != "" ? roleCategoryState : ""

                    // }
                    className="dropstyle"
                    styles={customStyles}
                    name="roleCategory"
                    onChange={(option: any) => {
                      let event = {
                        target: {
                          name: "roleCategory",
                          value: option,
                        },
                      };
                      props.handleChange(event);

                      getJobRole(option.value);
                      props.values.role = "";
                    }}
                  />
                  {props.errors.roleCategory && props.touched.roleCategory ? (
                    <span>
                      <p className="form-error">{props.errors.roleCategory}</p>
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              )}

              {props.errors.roleCategory && (
                <div className="error-scroll"></div>
              )}
            </div>

            {props.values.roleCategory ? (
              <div className="mt-3">
                <label>
                  Role <span className="form-error">*</span>
                </label>
                <Select
                  placeholder="Select Job Role"
                  isSearchable={true}
                  isClearable={false}
                  isDisabled={false}
                  options={JobroleMeta}
                  value={props.values.role}
                  // value={
                  //   roleState?.value == ""
                  //     ? roleState?.value
                  //     : roleState
                  // }
                  className="dropstyle"
                  styles={customStyles}
                  name="role"
                  onChange={(option: any) => {
                    let event = {
                      target: { name: "role", value: option },
                    };

                    props.handleChange(event);
                  }}
                />
                {props.errors.role && props.touched.role ? (
                  <span>
                    <p className="form-error">{props.errors.role}</p>
                  </span>
                ) : (
                  ""
                )}
                {props.errors.role && <div className="error-scroll"></div>}

                {/* {errors.role && touched.role ? (
                    <p className="form-error">{errors.role}</p>
                  ) : null} */}
              </div>
            ) : null}
          </div>
          <div className="col-lg-12 d-flex mt-3">
            <label className="mr-1">Reference code</label>
            <BsInfoCircle title="Add a unique reference code for this job." />
            <label style={{ marginLeft: "11%" }}>Number of vacancies</label>
          </div>

          <div className="col-lg-6 col-md-12 col-sm-12 d-flex">
            <input
              type="text"
              className="form-control"
              name="referenceCode"
              value={props.values.referenceCode}
              maxLength={20}
              placeholder="Reference code "
              onChange={(e: any) => {
                props.handleChange(e);
              }}
            />

            <input
              type="text"
              name="noOfVacancies"
              value={
                props.values.noOfVacancies != null &&
                props.values.noOfVacancies != 0
                  ? props.values.noOfVacancies
                  : ""
              }
              className="form-control"
              maxLength={4}
              placeholder="No of vacancies"
              onInput={(e: any) => {
                if (regex.numberTyping.test(e.target.value)) {
                  props.handleChange(e);
                } else if (e.target.value.length === 0) {
                  e.target.value = "";
                }
              }}
            />
          </div>
        </div>

        <label className="mt-3">
          Education Qualification
          <span style={{ color: "red" }}>*</span>
        </label>
        <div>
          <Select
            options={option}
            isMulti
            placeholder="Select education"
            isSearchable={true}
            isClearable={true}
            isDisabled={false}
            formatOptionLabel={formatOptionLabel}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            name="eduQualification"
            onChange={(e: any) => {
              setSelectedOptions(e);
              if (!e.children) {
                setOutput(e);
                props.values.eduQualification = e;
                let find = props.values.eduQualification.find((e) => {
                  return e.label === "B.Tech/B.E";
                });
                find === undefined && setSelectedItems([]);
                props.values.isPremium = false;
                props.values.premium = "";
                setCheckedItems("");
              }
            }}
            value={props.values.eduQualification}
            className="dropstyle"
            styles={customStyles}
            components={{
              Option: (props: any) => renderOption(props.data),
            }}
          />
        </div>
        {props.errors.eduQualification && <div className="error-scroll"> </div>}
        {/* {Eduerror && !props.errors.eduQualification && props.touched.eduQualification && <div className="error-scroll form-error ">Please provide atleast one education. </div>} */}
        {props.errors.eduQualification && props.touched.eduQualification ? (
          <span>
            <p className="form-error">{props.errors.eduQualification}</p>
          </span>
        ) : (
          ""
        )}

        {props.values.eduQualification &&
          props.values.eduQualification.find((e: any) => {
            return e.label === "B.Tech/B.E";
          }) && (
            <div>
              <span className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  name={"isPremium"}
                  id="isPremium"
                  checked={props.values.isPremium}
                  // value={props.values.isPremium}
                  onChange={(e: any) => {
                    props.handleChange(e);
                  }}
                />
                <label className="custom-control-label" htmlFor="isPremium">
                  Premium B.Tech(all)
                </label>
              </span>
              {props.values.isPremium && (
                <div>
                  <p>
                    Candidates from selected premium colleges will be sent to
                    Applies Matching section.
                    <br />
                    <Link
                      to="#"
                      style={{ color: "blue", textDecoration: "none" }}
                      onClick={() => {
                        handleDisplayModel();
                      }}
                      title="Cadidates from selected premium B.Tech colleges will be considered as matched."
                    >
                      Customise Premium Colleges
                    </Link>
                    <br />
                    {selectedItems.length > 0 && (
                      <span className="badge badge-pill badge-info">
                        You have selected {selectedItems.length} premium
                        colleges
                      </span>
                    )}
                  </p>
                </div>
              )}
              <Modal
                show={displayModel}
                onHide={() => {
                  setDisplayModel(false);
                  handleCancelSelections();
                }}
                className="modal fade modal-lg-bx-info editor"
              >
                <div
                  className="modal-dialog my-0"
                  role="document"
                  style={{ width: "100%" }}
                >
                  <div className="modal-content">
                    <div className="modal-custom-header p-2 ">
                      <h5 className="modal-title">
                        Select Premium B.Tech Institutes
                      </h5>{" "}
                      <button
                        type="button"
                        className="close"
                        onClick={() => {
                          setDisplayModel(false);
                          handleCancelSelections();
                        }}
                      >
                        {/* <span aria-hidden="true">&times;</span> */}
                        <i
                          // style={{ color: "white" }}
                          className="fa fa-times"
                          aria-hidden="true"
                        ></i>
                      </button>
                    </div>
                    <div className="modal-body">
                      <div>
                        <div className="row align-items-end">
                          <div className="col-md-6 col-lg-6 col-sm-12 custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              style={{ cursor: "pointer" }}
                              id="chk_selectAll_colg"
                              onChange={handleCheckAll}
                              className="custom-control-input"
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="chk_selectAll_colg"
                            >
                              Select All
                            </label>
                          </div>
                          <div className="col-md-6 col-lg-6 col-sm-12">
                            <FormControl
                              variant="standard"
                              sx={{ m: 1, width: "95%" }}
                            >
                              <Input
                                aria-describedby="search"
                                inputProps={{
                                  "aria-label": "Serach",
                                }}
                                onChange={handleSearch}
                                placeholder="Search"
                              />
                            </FormControl>
                          </div>
                        </div>
                      </div>
                      <div className="row mt-3">
                        {filteredItems &&
                          filteredItems.map((item, i) => (
                            <div
                              className="col-md-6 custom-control custom-checkbox"
                              key={item}
                            >
                              <input
                                type="checkbox"
                                name={item}
                                checked={
                                  checkedItems[item] === true ? true : false
                                  // || checkedItems[i] !== undefined && checkedItems[i] && checkedItems[item] == true ? true : false
                                }
                                onChange={handleChange}
                                id={`chk_college_${i}`}
                                className="custom-control-input"
                              />
                              <label
                                className="custom-control-label"
                                htmlFor={`chk_college_${i}`}
                              >
                                {item}
                                {/* <span className="form-check-label c_pointer"></span> */}
                              </label>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className="modal-footer">
                      {" "}
                      <button
                        type="button"
                        className="site-button btn-secondary btn-sm"
                        onClick={() => {
                          setDisplayModel(false);
                          handleCancelSelections();
                        }}
                      >
                        Cancel
                      </button>{" "}
                      <button
                        type="button"
                        className="site-button btn-sm"
                        onClick={handleSaveSelections}
                      >
                        Add Suggestions
                      </button>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>
              </Modal>
            </div>
          )}
        <div className="mb-2">
          <span className="custom-control custom-checkbox mt-1">
            <input
              type="checkbox"
              className="custom-control-input"
              name={"requestVideoProfile"}
              id="Request"
              value={props.values.requestVideoProfile}
              checked={props.values.requestVideoProfile === true}
              onChange={(e: any) => {
                props.handleChange(e);
              }}
            />
            <label className="custom-control-label" htmlFor="Request">
              Request candidates for video profile
            </label>
            &nbsp;
            <BsInfoCircle
              title="Nudge candidates that having video profile is preferred for this job. 
            However, candidates without video profile can also apply for this job"
            />
          </span>
          {/* <input
            type="checkbox"
            className="mr-2 mt-3"
            name={"requestVideoProfile"}
            id="Request"
            value={props.values.requestVideoProfile}
            checked={props.values.requestVideoProfile == true}
            onChange={(e: any) => {
              props.handleChange(e);
            }}
          />
          <label htmlFor="Request" className="c_content_desc mr-1">
            Request candidates for video profile
          </label>
          <i
            style={{ color: "gray", cursor: "pointer" }}
            title="Nudge candidates that having video profile is preferred for this job. However, candidates without video profile can also apply for this job"
          >
            <VscInfo />
          </i> */}
        </div>
        <div className="mb-3">
          <span className="custom-control custom-checkbox">
            <input
              type="checkbox"
              className="custom-control-input"
              name={"includeWalkIn"}
              id="includewalkin"
              value={props.values.includeWalkIn}
              checked={props.values.includeWalkIn === true}
              onChange={(e: any) => {
                props.handleChange(e);
                if (props.values.includeWalkIn == false) {
                  props.setFieldValue("startDate", null);
                }
              }}
            />
            <label className="custom-control-label" htmlFor="includewalkin">
              Include walk-in details
            </label>
          </span>
          {props.values.includeWalkIn && <WalkInSchedule {...props} />}
        </div>
      </form>
    </div>
  );
}

export default JobRequirement;
