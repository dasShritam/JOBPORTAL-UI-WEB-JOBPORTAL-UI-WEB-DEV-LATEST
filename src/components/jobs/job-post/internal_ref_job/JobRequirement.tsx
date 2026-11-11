import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Select, { components } from "react-select";
import AsyncCreatableSelect from "react-select/async-creatable";
import { debounce } from "lodash";
import {
  RollCategoryMasterData,
  RollMasterData,
  skillsMasterData,
  specializationMasterData,
} from "../../../../ApiCall/masterData";
import { BsInfoCircle } from "react-icons/bs";
import { regex } from "../../../../common/validation";
import { Alert, Chip, Slider } from "@mui/material";
import { customStyles } from "../../../../common/common";
import { EducationOption, salaryEnum, workExpEnum } from "./formik";
import { useSelector } from "react-redux";
import { getRoles } from "@testing-library/react";

function JobRequirement(props: any) {
  const pageUrl = useLocation();
  const { jobData, jobLoading } = useSelector(
    (state: any) => state.GetInternalJobs
  );

  //#region  skills
  const [skillsCount, setSkillsCount] = useState<number>(0);
  const skillsmasterData = useSelector((state: any) => state.skills);
  const { SkillsData } = skillsmasterData;

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
      const event = {
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
    } else if (!skills.length) {
      setSkillsCount(skills.length);
      return true;
    }
    setSkillsCount(skills.length);
    return true;
  };
  //#endregion skills end

  //#region Work Exp

  function valuetext(value: number) {
    return `${value}`;
  }

  const [maxExp, setMaxExp] = useState(30);
  const [maxExpChanged, setMaxExpChanged] = useState(props?.values.workExp[1]);
  const [minExpChanged, setMinExpChanged] = useState(props?.values.workExp[0]);

  const handleMinExpChange = (e) => {
    if (e.target.value >= maxExp && e.target.value > 30) {
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
    if (value[1] == 0 && value[0] > 0) {
      setMaxExpChanged(value[0]);
      setMinExpChanged(value[1]);
    } else {
      setMaxExpChanged(value[1]);
      setMinExpChanged(value[0]);
    }
  };

  //#endregion Work Exp

  //#region Salary
  const salarymin = 100000,
    salarymax = 50000000,
    salaryinc = 25000;
  const [percentage, setpercentage] = useState<any>();
  const calculatePercentage = () => {
    return (props.values.currency[0] / 100) * props.values.variablePercent;
  };
  const [maxpercentage, setMaxpercentage] = useState<any>();

  const [hideSalaryVariable, setHideSalaryVariable] = useState(true);
  const [showPercentage, setShowPercentage] = useState(false);

  const [maxSal, setMaxSal] = useState(salarymax);
  const [maxSalChanged, setMaxSalChanged] = useState(props?.values.salary[1]);
  const [minSalChanged, setMinSalChanged] = useState(props?.values.salary[0]);

  const handleMinSalChange = (e) => {
    if (e.target.value >= maxSal) {
      return;
    } else {
      const maxValue = props.values?.salary[1];
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
          name: "salary",
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
      const minSal = props.values?.salary[0];
      const event = {
        target: {
          name: "salary",
          value: [minSal, Number(e.target.value)],
        },
      };
      setMaxSalChanged(Number(e.target.value));
      props.handleChange(event);
    }
  };

  const handleSalSliderChange = (value) => {
    if (value[1] == 0 && value[0] > 0) {
      setMaxSalChanged(value[0]);
      setMinSalChanged(value[1]);
    } else {
      setMaxSalChanged(value[1]);
      setMinSalChanged(value[0]);
    }
  };

  //#endregion Salary

  //#region Location
  const [locationList, setLocationList] = useState<string[]>([]);
  const [location, setLocation] = useState<string>("");
  const handleLocation = (event: any, onBlur: boolean = false) => {
    if (onBlur || event?.key == "Enter") {
      const input = event?.target?.value;
      if (input.trim() && !locationList.includes(input)) {
        setLocationList([...locationList, input]);
        props.handleChange({
          target: {
            name: "location",
            value: [...locationList, input],
          },
        });
      }
      setLocation("");
    }
  };

  const handleLocationDelete = (deletedItem: string) => {
    const newLocation = locationList.filter((c) => c !== deletedItem);
    setLocationList(newLocation);
    props.handleChange({
      target: {
        name: "location",
        value: newLocation,
      },
    });
  };
  //#endregion Loacation

  //#region Department,Role,RC
  const [deptState, setDeptstate] = useState<any>([]);
  const [departmentState, setDepartmentState] = useState<any>();
  const [roleCategoryMeta, setRoleCategoryMeta] = useState<any>([]);
  const [roleCategoryState, setRoleCategoryState] = useState<any>();
  const [jobroleMeta, setJobRoleMeta] = useState<any>([]);
  const [roleState, setRoleState] = useState<any>();

  const handleRoleStateChange = (option: any) => {
    setRoleState(option);
  };

  const handleDepartmentStateChange = (option: any) => {
    setDepartmentState(option);
    handleRoleCategoryStateChange(null);
  };
  const handleRoleCategoryStateChange = (option: any) => {
    setRoleCategoryState(option);
  };

  const prepareMasterData = (data: any) => {
    return data?.map((d: any) => {
      return { label: d.name, value: d.id };
    });
  };

  const locationMaster = useSelector((state: any) => state.locationcity);
  const departMasterData = useSelector((state: any) => state.departmentdata);
  const { patchJobRes, patchJobloading } = useSelector(
    (state: any) => state.PatchInternalJob
  );

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
    if (optionData?.length == 0) {
      let role: any = optionData.find((e) => {
        if (e?.label == props?.values?.roleCategory?.label) return e;
      });

      // const eventt = {
      //     target: {
      //         name: "roleCategory",
      //         value: role,
      //     },
      // };
      // props.handleChange(eventt);
      // props.values.roleCategory = role;
      props.values.roleCategory && getJobRole(role.value);
    }
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
    if (jobroleMeta?.length == 0) {
      let role: any = optionData.find((e) => {
        if (e?.label == props?.values?.role?.label) return e;
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

  useEffect(() => {
    if (!departMasterData?.dptloading) {
      const deptData = prepareMasterData(departMasterData?.DepartmentData);
      setDeptstate(deptData);
    }
  }, [departMasterData?.dptloading]);

  useEffect(() => {
    if (!jobLoading && jobData?.data?.jobs?.length) {
      const item = jobData?.data?.jobs[0];
      if (item) {
        let depart: any = deptState?.find((e) => {
          if (e?.label == props?.values?.department?.label) return e;
        });
        props.values.department = depart;
        props?.values?.department && getRoleCategories(depart?.value);
        // if (roleCategoryMeta?.length !== 0) {
        //     let role: any = roleCategoryMeta?.find((e) => {
        //         if (e?.label == props?.values?.roleCategory?.label) return e;
        //     });
        //     const eventt = {
        //         target: {
        //             name: "roleCategory",
        //             value: role,
        //         },
        //     };
        //     props.handleChange(eventt);
        //     props?.values?.department == null && setDepartmentState(null);
        //     props?.values?.role == null && setRoleCategoryState(null);
        // }
      }
    }
  }, [deptState]);

  useEffect(() => {
    if (
      roleCategoryMeta?.length !== 0 &&
      !jobLoading &&
      jobData?.data?.jobs?.length
    ) {
      let role: any = roleCategoryMeta?.find((e) => {
        if (e?.label == props?.values?.roleCategory?.label) return e;
      });
      const eventt = {
        target: {
          name: "roleCategory",
          value: role,
        },
      };
      props.handleChange(eventt);
      props?.values?.role && getJobRole(role?.value);
      // props?.values?.department == null && setDepartmentState(null);
      // props?.values?.role == null && setRoleCategoryState(null);
    }
  }, [roleCategoryMeta]);

  useEffect(() => {
    if (
      jobroleMeta?.length !== 0 &&
      !jobLoading &&
      jobData?.data?.jobs?.length
    ) {
      let role: any = jobroleMeta?.find((e) => {
        if (e?.label == props?.values?.role?.label) return e;
      });
      const eventt = {
        target: {
          name: "role",
          value: role,
        },
      };
      props.handleChange(eventt);
      props?.values?.role && getJobRole(role?.value);
    }
  }, []);

  //#region Education
  const [selectedOptions, setSelectedOptions] = useState<any>([]);
  const [output, setOutput] = useState<any>([]);
  const [optionList, setOptionList] = useState<any>([]);
  const [optionsRendered, setOptionsRendered] = useState<any>(false);

  const masterData = useSelector((state: any) => state.jobSeekerMasterData);
  const { JSMasterData, loading } = masterData;

  const handleOptionSelect = async (
    selectedOption: any,
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
        // setEduData([...selectedOptions, selectedOption])
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
        const data2 = [
          { label: "abcd", value: Math.floor(Math.random() * 1000).toString() },
          { label: "abcd", value: Math.floor(Math.random() * 1000).toString() },
        ];
        let newOptions: any = [...optionList];
        const mainIndex = newOptions.findIndex(
          (c) => c.type == selectedOption.type
        );
        const index = newOptions
          .find((c) => c.type == selectedOption?.type)
          .children?.findIndex((d) => d.id == courseId);
        newOptions[mainIndex].children[index].children = data3;
        setOptionList(newOptions);
      }
      const event = {
        target: {
          name: "eduQualification",
          value: [...selectedOptions, selectedOption],
        },
      };

      props.handleChange(event);
      // setEduData([...selectedOptions, selectedOption])
    } else {
      let newData = [];
      if (selectedOption?.type && selectedOption?.isCourse == false) {
        const parentIds = selectedOptions
          ?.filter((c) => c.type == selectedOption?.type && c.isCourse)
          ?.map((d) => d.id);
        newData = selectedOptions.filter(
          (c) =>
            c.label !== selectedOption.label &&
            !parentIds.includes(c?.parentId) &&
            !parentIds.includes(c?.id)
        );
      } else {
        newData = selectedOptions.filter(
          (c) =>
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

  const formatOptionLabel = (
    { label, desc }: any,
    { context }: { context: string }
  ) => {
    if (context === "value") {
      return label;
    }
    return <div>{desc}</div>;
  };

  const renderOption = (option: any, depth: number = 0) => {
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
            handleOptionSelect(option, isSelected == true ? false : true);
          }}
        />
        <label
          style={{ cursor: "pointer" }}
          onClick={() => {
            handleOptionSelect(option, isSelected == true ? false : true);
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

  useEffect(() => {
    if (!loading) {
      const data = JSMasterData?.find((c) => c.group == "EDUN")?.data?.map(
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
              (c) => c.group == "DPHD"
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
              (c) => c.group == "MAPG"
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
              (c) => c.group == "BAUG"
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

        setOptionList(data);
        setOptionsRendered(true);
      }
    }
  }, [loading]);
  //#endregion

  //#region ShareWith
  const [shareWithList, setShareWithList] = useState<string[]>([]);
  const [shareWith, setShareWith] = useState<string>("");
  const [shareError, setShareError] = useState<string | null>(null);

  const handleShareWith = (event: any, isBlur: boolean = false) => {
    const input = event?.target?.value.trim();
    if (isBlur || event?.key === "," || event?.key === "Enter") {
      if (input === "") {
        setShareWith("");
        setShareError(null);
        return;
      }

      const emails = input.split(",").map((email) => email.trim());
      const invalidEmails = emails.filter((email) => !regex.email.test(email));

      if (invalidEmails.length > 0) {
        setShareError("Please enter valid Email.");
        return;
      }

      const newEmails = emails.filter(
        (email) => email !== "" && !shareWithList.includes(email)
      );

      if (newEmails.length > 0) {
        const updatedShareWithList = [...shareWithList, ...newEmails];
        setShareWithList(updatedShareWithList);
        props.handleChange({
          target: {
            name: "shareWith",
            value: updatedShareWithList,
          },
        });
      }

      setShareWith("");
      setShareError(null);
    } else if (!input) {
      setShareError(null);
    } else {
      setShareError(null);
    }
  };

  const handleShareWithDelete = (deletedItem: string) => {
    const newShareWith = shareWithList.filter((c) => c !== deletedItem);
    setShareWithList(newShareWith);
    props.handleChange({
      target: {
        name: "shareWith",
        value: newShareWith,
      },
    });
  };
  //#endregion

  //#region JobPost
  const { postJobRes, pjloading } = useSelector(
    (state: any) => state.PostInternalOrReferalJob
  );

  useEffect(() => {
    if (!pjloading && postJobRes?.res?.code == 200) {
      clearData();
    }
  }, [pjloading]);
  //#endregion

  //#region JobUpdate

  const [eduData, setEduData] = useState<any>([]);
  useEffect(() => {
    if (
      !jobLoading &&
      jobData?.data?.jobs.length &&
      optionsRendered &&
      id != undefined
    ) {
      updateReqValue();
    }
  }, [jobLoading, optionsRendered]);

  const updateReqValue = async () => {
    setLocationList(jobData?.data?.jobs[0].location);

    const selectedJob =
      jobData?.data?.jobs?.length == 1 ? jobData?.data?.jobs[0] : undefined;
    if (selectedJob) {
      const array: any = [];
      const array2: any = [];
      const array3: any = [];

      // get data from options
      selectedJob?.education.forEach((edu) => {
        let found = false;
        optionList.forEach((op) => {
          const foundEdu: any = op?.children?.find(
            (c) => edu?.course == c.label
          );
          if (foundEdu) {
            array.push(foundEdu);
            if (!found && !array2?.some((c) => c.label == op?.label)) {
              array2.push(op);
              found = true;
            }
          } else {
            if (op.label == edu.course) {
              array.push(op);
              found = true;
            }
          }
        });
      });

      array.forEach(async (selectedOption) => {
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
        let newOptions: any = [...optionList];
        const mainIndex = newOptions.findIndex(
          (c) => c.type == selectedOption.type
        );
        const index = newOptions
          .find((c) => c.type == selectedOption?.type)
          .children?.findIndex((d) => d.id == courseId);
        newOptions[mainIndex].children[index].children = data3;
        const array5: any = data3.forEach((item) => {
          if (
            selectedJob?.education
              ?.find((c) => c?.course == selectedOption.label)
              ?.stream?.map((d) => d)
              .includes(item.label)
          ) {
            array4.push(item);
          }
        });

        setOptionList(newOptions);
      });

      const array4 = array.concat(array2);
      setOutput(array4);
      setSelectedOptions(array4);
      const event = {
        target: {
          name: "eduQualification",
          value: array4,
        },
      };
      // setEduData(array4)

      props.values.eduQualification = array4;
      // await props.handleChange(event);

      setShareWithList(selectedJob?.assingedTo);
      // if (selectedJob?.salary?.varpay) {
      //   setpercentage(
      //     (selectedJob?.salary?.min / 100) * selectedJob?.salary?.varpay
      //   );
      //   setMaxpercentage(
      //     (selectedJob?.salary?.max / 100) * selectedJob?.salary?.varpay
      //   );
      //   setShowPercentage(true);
      // }
      setMaxSalChanged(selectedJob?.salary?.max ?? 0);
      setMinSalChanged(selectedJob?.salary?.min ?? 0);

      setMaxExpChanged(selectedJob?.exp?.max ?? 0);
      setMinExpChanged(selectedJob?.exp?.min ?? 0);

      setSkillsCount(
        selectedJob?.skills?.toString().replaceAll(",", "").length
      );
    }
  };
  useEffect(() => {
    if (props.values.variablePercent && props.values.salary) {
      setHideSalaryVariable(false);
      setShowPercentage(true);
      setpercentage(
        (props.values.salary[0] / 100) * props.values.variablePercent
      );
      setMaxpercentage(
        (props.values.salary[1] / 100) * props.values.variablePercent
      );
    } else {
      setHideSalaryVariable(true);
      setShowPercentage(false);
      setpercentage(0);
    }
  }, [props.values.variablePercent, props.values.salary]);

  const clearData = async () => {
    setLocationList([]);
    setMaxSalChanged(salaryEnum?.MAX);
    setMinSalChanged(salaryEnum?.MIN);
    setMaxExpChanged(workExpEnum?.MAX);
    setMinExpChanged(workExpEnum?.MIN);
    setShareWithList([]);
    // setMinExpChanged("");
    // setMaxExpChanged("");
    // setMaxSalChanged("");
    // setMinSalChanged("");
    setpercentage("");
    // setShowPercentage(false);
    setOutput([]);
    setSelectedOptions([]);
    setSkillsCount(0);
    setRoleCategoryMeta([]);
    setJobRoleMeta([]);
  };

  useEffect(() => {
    if (!patchJobloading && patchJobRes?.code == 200) clearData();
    setMaxSalChanged(salaryEnum?.MAX);
    setMinSalChanged(salaryEnum?.MIN);
    setMaxExpChanged(workExpEnum?.MAX);
    setMinExpChanged(workExpEnum?.MIN);
  }, [patchJobloading]);
  const { id } = useParams();
  useEffect(() => {
    if (id == undefined) {
      clearData();
    }
  }, [pageUrl, id]);

  useEffect(() => {
    if (!pjloading && postJobRes?.code == 200) {
      clearData();
      setMaxSalChanged(salaryEnum?.MAX);
      setMinSalChanged(salaryEnum?.MIN);
      setMaxExpChanged(workExpEnum?.MAX);
      setMinExpChanged(workExpEnum?.MIN);
    }
  }, [pjloading]);

  useEffect(() => {
    clearData();
    setMaxSalChanged(salaryEnum?.MAX);
    setMinSalChanged(salaryEnum?.MIN);
    setMaxExpChanged(workExpEnum?.MAX);
    setMinExpChanged(workExpEnum?.MIN);
  }, []);
  //#endregion

  return (
    <div id="dv_ij_job_req_bx" className="job-bx bg-white m-b30">
      <h5 className="mb-2">Job Requirements</h5>
      <div className="row">
        <div className="col-lg-12 col-md-12">
          <div>
            <label>
              Key Skills
              <span style={{ color: "red" }}>*</span>
            </label>
            <div className="d-flex justify-content-between">
              <span
                className="font_italic_sm mb-2"
                style={{ color: "#f8b065" }}
              >
                Specify Key skills required for this job role.
              </span>
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
                handleSelectOption(e);
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
                  <div className="error-scroll"> </div>
                )}
              </div>
              <span className="custom-char-count ">
                {!isNaN(250 - skillsCount) ? 250 - skillsCount : 250}{" "}
                Character(s) Left
              </span>
            </div>

            <div className="isHotDiv mb-4">
              <label>
                Work Experience(Year)<span className="form-error">*</span>
              </label>
              <div className="d-flex align-items-center ">
                <div className="d-flex align-items-center">
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
                  <div style={{ position: "relative", right: "7%" }}>To</div>
                  <input
                    type="text"
                    style={{ width: "50px" }}
                    className="form-control"
                    value={maxExpChanged}
                    onChange={(e) => {
                      if (regex.numberRegx.test(e.target.value)) {
                        handleMaxExpChange(e);
                      }
                    }}
                  />
                </div>
                <div style={{ width: "90%" }} className="mt-4">
                  <Slider
                    getAriaLabel={() => "Work exp range"}
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
                    max={maxExp}
                    step={1}
                    className="props.classes.thumb"
                    valueLabelFormat={(value) => <div>{value * 1}</div>}
                  />
                </div>
              </div>
              {props.errors.workExp && props.touched.workExp && (
                <p className="form-error">{props.errors.workExp}</p>
              )}
              {props.errors.workExp && <div className="error-scroll"> </div>}
            </div>
            <div className="isHotDiv">
              <label>
                Annual Salary Range<span className="form-error">*</span>
              </label>
              <div className="font_italic_sm mb-5">
                Please select the salary offered for this job using the slider
                below. Move the slider left or right to adjust the salary amount
              </div>
              <div className="d-flex">
                <div
                  className="btn-group "
                  role="group"
                  aria-label="Toggle manual switch"
                >
                  <label className="mr-2">
                    <input
                      type="radio"
                      name="currency"
                      value="INR"
                      className="card-input-element"
                      checked={props.values.currency === "INR"}
                      onChange={props.handleChange}
                    />
                    <div
                      className={
                        props.values.currency === "INR"
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
                      name="currency"
                      value="USD"
                      className="card-input-element"
                      checked={props.values.currency === "USD"}
                      onChange={props.handleChange}
                    />
                    <div
                      className={
                        props.values.currency === "USD"
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
                    onChange={(e) => {
                      if (regex.numberRegx.test(e.target.value)) {
                        handleMinSalChange(e);
                      }
                    }}
                  />
                  <div
                    style={{ position: "relative", right: "3%" }}
                    className="mt-2"
                  >
                    To
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    value={maxSalChanged}
                    onChange={(e) => {
                      if (regex.numberRegx.test(e.target.value)) {
                        handleMaxSalChange(e);
                      }
                    }}
                  />
                </div>
              </div>
              <div className="d-flex align-items-center">
                <div style={{ width: "100%" }}>
                  <Slider
                    getAriaLabel={() => "Salary range"}
                    value={props.values.salary}
                    valueLabelDisplay="auto"
                    getAriaValueText={valuetext}
                    min={0}
                    max={maxSal}
                    step={salaryinc}
                    className="props.classes.thumb"
                    valueLabelFormat={(value) => <div>{value}</div>}
                    onChange={(e: any) => {
                      if (e.target !== null) {
                        e.target.name = "salary";
                        handleSalSliderChange(e.target.value);
                      }
                      props.handleChange(e);
                      // setpercentage(calculatePercentage());
                      // setMaxpercentage(calculatePercentage());
                    }}
                  />
                  {props.errors.currency && props.touched.currency ? (
                    <span>
                      <p className="form-error">{props.errors.currency}</p>
                    </span>
                  ) : null}
                  {props.errors.currency && (
                    <div className="error-scroll"> </div>
                  )}
                </div>
              </div>
              {!showPercentage && (
                <div className="font_italic_sm">
                  Entire salary is fixed.It does not include any variable
                  component.
                  <Link
                    to="#"
                    style={{ textDecoration: "none" }}
                    className="p-2"
                    onClick={(e: any) => {
                      e.preventDefault();
                      setShowPercentage(true);
                      setHideSalaryVariable(false);
                    }}
                  >
                    Change
                  </Link>
                </div>
              )}

              {showPercentage && (
                <div className="mt-3">
                  <label>Percentage of salary that is variable</label>
                  <div>
                    <span className="font_italic_sm">
                      Spacify the percentage of variable component which is
                      included in salary above.
                    </span>
                    <div className="input-group mb-3 mt-2 d-flex align-items-center">
                      <div className="input-group-prepend">
                        <span className="input-group-text">%</span>
                      </div>
                      <input
                        type="number"
                        value={props.values.variablePercent}
                        name="variablePercent"
                        onInput={(e: any) => {
                          e.target.value = e.target.value.slice(0, 3);
                        }}
                        onChange={(e: any) => {
                          if (e.target !== null) {
                            e.target.name = "variablePercent";
                          }
                          props.handleChange(e);
                          // setpercentage(
                          //   Number(props.values.salary[0] / 100) * e.target.value
                          // );
                          // setMaxpercentage(
                          //   Number(props.values.salary[1] / 100) * e.target.value
                          // );
                        }}
                        className="form-control col-lg-1 col-md-2 text-center"
                        placeholder="00"
                        maxLength={2}
                      />
                      {props.values.variablePercent &&
                      percentage !== undefined &&
                      percentage !== 0 ? (
                        <div>
                          {percentage !== undefined
                            ? `${
                                props.values.currency === "INR" ? "₹" : "$"
                              }  ${percentage} is variable `
                            : "Entire salary is fixed"}
                          {maxpercentage !== undefined
                            ? `${
                                props.values.currency === "INR"
                                  ? " - ₹"
                                  : " - $"
                              }  ${maxpercentage} is variable`
                            : null}
                        </div>
                      ) : (
                        <div>Entire salary is fixed</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

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
                <Alert severity="info">
                  Displaying salary invites higher number of responses. However,
                  if you want to show salary, Please enter correct salary to
                  reach out to a relevant pool of candidates.
                </Alert>
              )}
            </div>
            <div>
              <label className="mt-3">
                Job location(s) Max(10)<span className="form-error">*</span>{" "}
              </label>
              <br />
              <input
                type="text"
                className="form-control"
                value={location}
                disabled={locationList?.length > 9}
                maxLength={200}
                onChange={(e) => {
                  setLocation(e.target.value);
                }}
                placeholder="Enter location (You can add multiple locations by clicking enter on after each location.)"
                onKeyUp={(input) => {
                  handleLocation(input);
                }}
                onBlur={(e) => {
                  handleLocation(e, true);
                }}
              />
              {props.errors.location && props.touched.location ? (
                <span>
                  <p className="form-error">{props.errors.location}</p>
                </span>
              ) : (
                ""
              )}
            </div>
            <div className="mt-2">
              {locationList?.map((c) => (
                <Chip
                  className="ml-2"
                  label={c}
                  variant="outlined"
                  onDelete={() => {
                    handleLocationDelete(c);
                  }}
                />
              ))}
            </div>
            <div className="mt-3">
              <label>
                Department<span className="form-error">*</span>
              </label>
              &nbsp;
              <BsInfoCircle title="It is the department of the company you are hiring for.For example Marketing, Sales, Accounts." />
              <Select
                placeholder="Select Department"
                isSearchable={true}
                isDisabled={false}
                isClearable={true}
                options={deptState}
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
                  setRoleCategoryState(null);
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
            {props.errors.department && <div className="error-scroll"> </div>}

            <div className="mt-3">
              <label>
                Role Category<span className="form-error">*</span>
              </label>
              &nbsp;
              <BsInfoCircle title="It is the role category in a company you are hiring for." />
              <Select
                placeholder="Select Role Category"
                isSearchable={true}
                isClearable={true}
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
                  setRoleCategoryState(option);
                  getJobRole(option.value);
                  props.values.role = "";
                  setRoleState(null);
                }}
              />
            </div>
            {props.errors.roleCategory && props.touched.roleCategory ? (
              <span>
                <p className="form-error">{props.errors.roleCategory}</p>
              </span>
            ) : (
              ""
            )}
            {props.errors.roleCategory && <div className="error-scroll"> </div>}
          </div>

          {props.values.roleCategory ? (
            <div className="mt-3">
              <label>
                Role<span className="form-error">*</span>
              </label>
              <Select
                placeholder="Select Job Role"
                isSearchable={true}
                isClearable={true}
                isDisabled={false}
                options={jobroleMeta}
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
                  handleRoleStateChange(option);
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
              {props.errors.role && <div className="error-scroll"> </div>}
            </div>
          ) : null}
        </div>
        <div className="col-lg-8 col-md-12  mt-3">
          <label className="mr-1">Reference code</label>
          <BsInfoCircle title="Add a unique reference number for this job." />
          <label style={{ marginLeft: "13%" }}>
            Number of vacancies<span className="form-error">*</span>
          </label>
        </div>

        <div className="col-lg-8 col-md-12 col-sm-12 d-flex">
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
          <>
            <div className="col-lg-8 ">
              <input
                type="text"
                name="vacancy"
                value={props.values.vacancy}
                className="form-control"
                maxLength={4}
                placeholder="No of vacancies"
                onInput={(e: any) => {
                  if (regex.noOfVacancy.test(e.target.value)) {
                    props.handleChange(e);
                  } else if (e.target.value.length == 0) {
                    e.target.value = "";
                  }
                }}
              />

              <div>
                {props.errors.vacancy && props.touched.vacancy ? (
                  <span>
                    <p className="form-error">{props.errors.vacancy}</p>
                  </span>
                ) : (
                  ""
                )}
              </div>
            </div>
            {props.errors.vacancy && <div className="error-scroll"> </div>}
          </>
        </div>
      </div>

      <div>
        <label className="mt-3">
          Education Qualification<span className="form-error">*</span>
        </label>
        <Select
          options={optionList}
          isMulti
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
              const event = { target: { name: "eduQualification", value: e } };
              props.handleChange(event);
            }
          }}
          value={props.values.eduQualification}
          // value={eduData}
          className="dropstyle"
          styles={customStyles}
          components={{
            Option: (props: any) => renderOption(props.data),
          }}
        />
        {props.errors.eduQualification && props.touched.eduQualification && (
          <span>
            <p className="form-error">{props.errors.eduQualification}</p>
          </span>
        )}
        {props.errors.eduQualification && <div className="error-scroll"> </div>}
      </div>
      <div>
        <label className="mt-3">
          Share With<span className="form-error">*</span>
        </label>
        <br />
        <span className="font_italic_sm" style={{ color: "#f8b065" }}>
          Please enter a valid email or email group name. These people will get
          an email once you post this job.
        </span>
        <input
          type="text"
          className="form-control"
          value={shareWith}
          maxLength={200}
          name="shareWith"
          onChange={(e) => {
            setShareWith(e.target.value);
          }}
          placeholder="Email/Email group  (You can add multiple addresses separated by a comma.)"
          onKeyUp={(input) => {
            handleShareWith(input);
          }}
          onBlur={(e) => {
            handleShareWith(e, true);
          }}
        />
        {!shareError && props.errors.shareWith && props.touched.shareWith && (
          <p className="form-error">{props.errors.shareWith}</p>
        )}
        {shareError && <p className="form-error">{shareError}</p>}
        {(shareError || props.errors.shareWith) && (
          <div className="error-scroll"> </div>
        )}
      </div>
      <div className="mt-2">
        {shareWithList?.map((c) => (
          <Chip
            className="ml-1"
            label={c}
            variant="outlined"
            onDelete={() => {
              handleShareWithDelete(c);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default JobRequirement;
