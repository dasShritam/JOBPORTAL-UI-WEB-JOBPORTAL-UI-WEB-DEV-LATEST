import React, { useCallback, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import { useDispatch, useSelector } from "react-redux";
import {
    patchUpdateKeySkills,
    resetKeySkillsSl,
} from "../../../../redux/features/manage-account/profile/KeySkillSlice";
import { UseToastAlert } from "../../../../hooks/useToastAlert";
import { getJobSeekerrData } from "../../../../redux/features/manage-account/profile/JsSlice";
import { BsPencil } from "react-icons/bs";
import "../../../../assets/customCss/Projects.css";
import { environment } from "../../../../environments/environment";

import AsyncCreatableSelect from "react-select/async-creatable";
import { skillsMasterData } from "../../../../ApiCall/masterData";
import { debounce } from "lodash";
import { regex } from "../../../../common/validation";
import { profileStrength } from "../../../../redux/features/manage-account/profile/BasicDetailsSlice";

type propsState = {
    displayModel?: boolean;
    trigger?: any;
};

function KeySkills({ displayModel, trigger }: propsState) {
    const showSnackAlert = UseToastAlert();
    const [hideKeyContent, setHideKeyContent] = useState(true);
    const [keyskill, setKeyskill] = useState(false);
    const limit = Number(
        environment.Jobseeker_Profile_Data_Limits.keySkills_limit
    );

    const handleHideKeyskill = () => {
        setKeyskill(false);
        setErrorMsg(false);
    };

    const pflStrength = useSelector((state: any) => state.profileStrength);
    const [keyValues, setKeyValues] = useState<string[]>([]);
    const [inpSkill, setInpSkill] = useState<any>([]);
    const [chipKeyValues, setChipKeyValues] = useState<string[]>([]);
    const [errorMsg, setErrorMsg] = useState(false);
    const [skillsCount, setSkillsCount] = useState<any>(0);
    const [chipData, setChipData] = React.useState<ChipData[]>([]);
    const [masterSkills, setMasterSkills] = useState<any>(null);

    const updatedKeySkills = useSelector(
        (state: any) => state.updateKeySkillsData
    );
    const { UpdatedSkills, loadingState } = updatedKeySkills;

    const dispatch = useDispatch();

    const JobSeekerProfileData = useSelector(
        (state: any) => state.JobSeekerProfile2
    );

    const { JobSeekerProfile, loading, error } = JobSeekerProfileData;

    const skillsmasterData = useSelector((state: any) => state.skills);
    const { SkillsData } = skillsmasterData;

    useEffect(() => {
        if (SkillsData && Array.isArray(SkillsData)) {
            setMasterSkills([
                ...SkillsData?.map((skill) => {
                    return { label: skill?.name, value: skill?.name };
                }),
            ]);
        }
    }, [SkillsData]);

    useEffect(() => {}, [masterSkills]);

    useEffect(() => {
        if (UpdatedSkills.message) {
            if (UpdatedSkills.code === 200) {
                showSnackAlert("success", UpdatedSkills.message, 200);
                dispatch(profileStrength());
                dispatch(getJobSeekerrData());
                dispatch(resetKeySkillsSl());
            } else if (
                UpdatedSkills &&
                UpdatedSkills.response &&
                UpdatedSkills.response.data &&
                UpdatedSkills.response.data.code != 200
            ) {
                showSnackAlert(
                    "warning",
                    UpdatedSkills.UpdatedSkills.response.data.message
                );
                dispatch(resetKeySkillsSl());
            }
        }
    }, [UpdatedSkills.code, loadingState]);

    interface ChipData {
        key: number;
        label: string;
    }

    useEffect(() => {
        if (JobSeekerProfile?.js_profile?.skills) {
            setChipKeyValues([...JobSeekerProfile?.js_profile?.skills?.key]);
            setKeyValues([...JobSeekerProfile?.js_profile?.skills?.key]);
            setChipData([
                ...JobSeekerProfile?.js_profile.skills.key?.map(
                    (val: any, index: any) => {
                        return { key: index, label: val };
                    }
                ),
            ]);
        }
    }, [JobSeekerProfile.js_profile]);

    const handleSave = () => {
        const data = inpSkill.map((skill) => skill.value);
        setKeyValues([...chipKeyValues]);

        setKeyskill(false);
        dispatch(patchUpdateKeySkills({ key: data }));
        if (!loading && UpdatedSkills.code === 200) {
            showSnackAlert("success", UpdatedSkills.message, 200);
            dispatch(profileStrength());
        }
    };

    const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            root: {
                display: "flex",
                justifyContent: "center",
                flexWrap: "wrap",
                listStyle: "none",
                padding: theme.spacing(0.5),
                margin: 0,
            },
            chip: {
                margin: theme.spacing(0.5),
            },
        })
    );

    const components = {
        DropdownIndicator: null,
    };
    const filterSkills: any = (inputValue: string, callback) => {
        if (inputValue.length >= 2) {
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
    // const promiseOptions = (inputValue: string) =>
    //   new Promise<[]>((resolve) => {
    //     setTimeout(() => {
    //       resolve(filterSkills(inputValue));
    //     }, 0);
    //   });

    const loadSkillsOptions = useCallback(debounce(filterSkills, 1000), []);

    const handleSelectOption = (option) => {
        const res = handleChangeInput(option);
        if (res) {
            setInpSkill(option);
        }
    };

    const handleChangeInput = (e): boolean => {
        const skills = e
            .map((skill) => skill.value)
            .toString()
            .replaceAll(",", "");

        if (skills.length > 500) {
            return false;
        } else if (skills.length) {
            setErrorMsg(false);
        } else {
            setErrorMsg(true);
            setSkillsCount(skills.length);
            return true;
        }
        setSkillsCount(skills.length);
        return true;
    };
    // const isValidInput = (inputValue: string): boolean => {
    //    return regex.asyncField.test(inputValue);
    //   }

    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (newValue: string) => {
        setInputValue(newValue.replace(/[^a-zA-Z0-9-.',:!()&+#/>\s]*$/, ""));
    };
    useEffect(() => {
        if (displayModel == true) {
            setKeyskill(true);
            setHideKeyContent(false);
        } else {
            setHideKeyContent(true);
        }
    }, [displayModel]);
    return (
        <>
            <div id="key_skills_bx" className="job-bx bg-white m-b30">
                {hideKeyContent && (
                    <>
                        <div className="d-flex">
                            <h5 className="m-b15 c_content_header">
                                Key Skills
                                <span className="font-14">
                                    {pflStrength?.pflStrnRes?.data
                                        ?.profileWeightage?.key_skill
                                        ? ` (${pflStrength?.pflStrnRes?.data?.profileWeightage?.key_skill}%)`
                                        : ""}
                                </span>
                            </h5>
                            <Link
                                to={"#"}
                                title="Click here to manage your key skills"
                                data-toggle="modal"
                                data-target="#keyskills"
                                onClick={() => {
                                    setInpSkill([
                                        ...keyValues.map((val) => {
                                            return { label: val, value: val };
                                        }),
                                    ]);
                                    setSkillsCount(
                                        keyValues.toString().replaceAll(",", "")
                                            .length
                                    );
                                    setKeyskill(true);
                                }}
                                className="edit-icon"
                            >
                                <BsPencil />
                            </Link>
                        </div>
                        <div className="job-time mr-auto">
                            <div className="c_content_details">
                                {!loading &&
                                    keyValues &&
                                    keyValues.map((s: any) => {
                                        return (
                                            <Link to={"#"}>
                                                <span
                                                    className="mr-1"
                                                    style={{
                                                        wordBreak: "break-all",
                                                    }}
                                                >
                                                    {s}
                                                </span>
                                            </Link>
                                        );
                                    })}
                            </div>
                        </div>
                    </>
                )}
                <Modal
                    show={keyskill}
                    backdrop="static"
                    onHide={() => {
                        handleHideKeyskill();
                        trigger && trigger(false);
                    }}
                    className="modal fade browse-job modal-bx-info editor"
                >
                    <div className="modal-dialog my-0" role="document">
                        <div className="modal-content"  >
                            <div className="modal-body">
                                <div className="modal-custom-header">
                                    <h5
                                        className="modal-title"
                                        id="KeyskillsModalLongTitle"
                                    >
                                        Key Skills
                                    </h5>
                                    <button
                                        type="button"
                                        className="close"
                                        onClick={() => {
                                            setKeyskill(false);
                                            setErrorMsg(false);
                                            trigger && trigger(false);
                                        }}
                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <p className="modal-custom-desc">
                                    Tell recruiters what you know or what you
                                    are known for e.g. Direct Marketing, Oracle,
                                    Java etc. We will send you job
                                    recommendations based on these skills. Each
                                    skill is created and separated by a enter.
                                </p>
                                <form
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                    }}
                                >
                                    <div className="row">
                                        <div className="col-lg-12 col-md-12">
                                            <div className="form-group">
                                                <AsyncCreatableSelect
                                                    components={components}
                                                    placeholder="Enter your area of Expertise/Specialization"
                                                    cacheOptions
                                                    isClearable={false}
                                                    isSearchable={true}
                                                    className="dropstyle"
                                                    name="skills"
                                                    maxMenuHeight={120}
                                                    minMenuHeight={120}
                                                    noOptionsMessage={() => "Enter keyword to search"}
                                                    isMulti
                                                    value={inpSkill}
                                                    onChange={(e) => {
                                                        handleSelectOption(e);
                                                    }}
                                                    defaultOptions
                                                    // isValidNewOption={isValidInput}
                                                    onInputChange={
                                                        handleInputChange
                                                    }
                                                    inputValue={inputValue}
                                                    loadOptions={
                                                        loadSkillsOptions
                                                    }
                                                />
                                                <span
                                                    className=""
                                                    style={{
                                                        display: "inline-block",
                                                        fontSize: "0.85em",
                                                        color: "grey",
                                                    }}
                                                >
                                                    {500 - skillsCount}{" "}
                                                    Character(s) Left
                                                </span>

                                                <div>
                                                    {errorMsg && (
                                                        <p className="form-error">
                                                            Please specify
                                                            atleast one Key
                                                            Skill.
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <br />
                            <div className="modal-custom-footer">
                                <button
                                    type="button"
                                    className="site-button site-warning-button z0"
                                    onClick={() => {
                                        setKeyskill(false);
                                        setErrorMsg(false);
                                        trigger && trigger(false);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="site-button z0"
                                    onClick={(e) => {
                                        if (
                                            inpSkill.length !== 0 ||
                                            chipKeyValues.join(",").length +
                                                inpSkill.length ==
                                                limit
                                        ) {
                                            handleSave();
                                            setErrorMsg(false);
                                        } else {
                                            setErrorMsg(true);
                                        }
                                    }}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    );
}

export default KeySkills;