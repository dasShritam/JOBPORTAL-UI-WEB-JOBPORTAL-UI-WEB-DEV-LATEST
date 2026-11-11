import { Box, Drawer, IconButton } from "@mui/material";
import PizZip from "pizzip";
import { debounce } from "lodash";
import Pagination from "rc-pagination";
import { useCallback, useEffect, useRef, useState } from "react";
import Typography from "@mui/material/Typography";
import { Button, Modal } from "react-bootstrap";
import { FaFilter } from "react-icons/fa";
import { components } from "react-select";
import AsyncCreatableSelect from "react-select/async-creatable";
import Select from "react-select";
import {
  bytesToMegabytes,
  customStyles,
  getTimestampToDate,
} from "../../../common/common";
import { Formik } from "formik";
import "../../../assets/customCss/jobs/manage-jobs.css";
import { useDispatch, useSelector } from "react-redux";
import { DesignationMasterData } from "../../../redux/features/masterData/DesignationSlice";
import { SkillsMasterData } from "../../../redux/features/masterData/SkillsSlice";
import { getYearMonth } from "../../../redux/features/masterData/YearMonthSlice";
import { EducationOption } from "../../jobs/job-post/private-job/formData";
import {
  designationMasterData,
  locationsMasterData,
  specializationMasterData,
} from "../../../ApiCall/masterData";
import { jobSeekerProfileMasterData } from "../../../redux/features/masterData/MasterDataInfoSlice";
import {
  BsCloudDownload,
  BsCloudUpload,
  BsEyeFill,
  BsPersonCircle,
} from "react-icons/bs";
import { Link } from "react-router-dom";
import { IoCloseCircleOutline } from "react-icons/io5";
import { environment } from "../../../environments/environment";
import { UseToastAlert } from "../../../hooks/useToastAlert";
import {
  downloadAppResume,
  resetDownloadResume,
} from "../../../redux/features/employer/downloadMedia";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import Docxtemplater from "docxtemplater";
import {
  fetchJsPrivateDbData,
  postJobSeekerPrivateDB,
  resetPostJsPrivateDB,
} from "../../../redux/features/employer/private-js-profile/privateJsProfileSlice";
import { AnyAction } from "@reduxjs/toolkit";
import {
  downloadSAS,
  resetSAS,
} from "../../../redux/features/jobs/job-applications/downloadSASSlice";
import PrivateJsProfile_Skl from "./private-js-profile-Skl";
import { regex } from "../../../common/validation";
import Swal from "sweetalert2";
import {
  deletePrivateResume,
  resetDelPrivateResCreator,
} from "../../../redux/features/employer/private-js-db/privatedbdeleteSlice";
GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.5.141/pdf.worker.min.js";

type Anchor = "top" | "left" | "bottom" | "right";
var notfoundImg = require("../../../assets/images/background/No-record.png");

interface selectType {
  label: string;
  value: string;
}

type Option = {
  label: string;
  value: string;
  children?: Option[];
  type: string;
  id: string;
  isCourse: boolean;
};

const IntialValueForm = {
  designation: [],
  skills: [],
  eduQualification: [],
  location: [],
  tag: null,
  resume: [],
};
interface ColourOption {
  label: string;
  value: string;
}

function PrivateJsProfile() {
  const [datas, setDatas] = useState<any>([]),
    [hideReset, setHideReset] = useState(false),
    [isChecked, setIsChecked] = useState(false),
    [perPage, setPerPage] = useState(10),
    [size, setSize] = useState(perPage),
    [resumeErr, setResumeErr] = useState(""),
    [tagErr, setTagErr] = useState(false),
    [selectedResume, setSelectedResume] = useState<any[]>([]);

  const [postData, setPostData] = useState<any>([]);
  const [currentpage, setCurrentPage] = useState(1);
  const PerPageChange = (value: any) => {
    setSize(value);
    if (postData) {
      Math.ceil(postData?.length / value);
    }
  };
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { delPrivateRes, loadingDr } = useSelector(
    (state: any) => state.deleteResumePrivateDB
  );
  useEffect(() => {
    dispatch(resetSAS());
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const PrevNextArrow = (current: any, type: any, originalElement: any) => {
    if (type === "prev") {
      return (
        <button
          title="prev"
          className="previous"
          style={{ borderColor: "#eae6e6", borderRadius: "2px" }}
        >
          <i className="ti-arrow-left"></i> Prev
        </button>
      );
    }
    if (type === "next") {
      return (
        <button
          title="next"
          style={{ borderColor: "#eae6e6", borderRadius: "2px" }}
          className="pagination"
        >
          Next <i className="ti-arrow-right"></i>
        </button>
      );
    }
    return originalElement;
  };
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event?.target;
    setDatas((prev) =>
      prev?.map((checkbox) =>
        checkbox?.userid === name ? { ...checkbox, checked } : checkbox
      )
    );
    setIsChecked(datas?.every((checkbox) => checkbox?.checked === true));
  };

  const PaginationChange = (page: any, pageSize: any) => {
    setCurrentPage(page);
    setSize(pageSize);
    const fetchPageData = {
      searchText: [],
      tags: [],
      pageid: page,
      pageLimit: 10,
    };
    dispatch(fetchJsPrivateDbData(fetchPageData));
  };

  useEffect(() => {
    if (delPrivateRes && delPrivateRes?.code && delPrivateRes?.code === 200) {
      dispatch(fetchJsPrivateDbData(fetchOptions));
      showSnackAlert("success", delPrivateRes?.message);
      dispatch(resetDelPrivateResCreator());
      setHideReset(false);
    }
    if (delPrivateRes && delPrivateRes?.code && delPrivateRes?.code !== 200) {
      showSnackAlert("warning", delPrivateRes?.message);
      dispatch(resetDelPrivateResCreator());
    }
  }, [delPrivateRes]);

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      if (open) {
        formikRef.current.resetForm();
      }
      setState({ ...state, [anchor]: open });
    };

  //masterdata region
  const dispatch = useDispatch();
  const DesignationmasterData = useSelector((state: any) => state.designation);
  const { DesignationData } = DesignationmasterData;
  const [desig, setDesig] = useState<any>([]);
  useEffect(() => {
    if (Array.isArray(DesignationData)) {
      const data = DesignationData?.map((c: any) => {
        return {
          label: c,
          value: c,
        };
      });
      setDesig(data);
    }
  }, [DesignationData]);

  //skills region

  const skillsmasterData = useSelector((state: any) => state.skills);
  const { SkillsData } = skillsmasterData;
  const [skillMeta, setSkillMeta] = useState<any>([]);
  useEffect(() => {
    if (Array.isArray(SkillsData)) {
      const data = SkillsData?.map((c: any) => {
        return {
          label: c,
          value: c,
        };
      });
      setSkillMeta(data);
    }
  }, [SkillsData]);

  const filterColors = (inputValue: string) => {
    return skillMeta.filter((i) =>
      i.label?.toLowerCase().includes(inputValue?.toLowerCase())
    );
  };

  const promiseOptions = (inputValue: string) =>
    new Promise<selectType[]>((resolve) => {
      setTimeout(() => {
        resolve(filterColors(inputValue));
      }, 1000);
    });

  //end region

  //restricting the fileds
  const MAX_LENGTH = 150;
  const isValidNewOption = (inputValue, selectValue, selectOptions) => {
    if (inputValue.length === 0 || inputValue.length > MAX_LENGTH) {
      return false;
    }
    const isDuplicate = selectOptions.find(
      (option) => option.label === inputValue
    );
    if (isDuplicate) {
      return false;
    }
    return true;
  };

  const [inputValue, setInputValue] = useState("");
  const [locationInputValue, setLocationInputValue] = useState("");
  const [desigInputValue, setDesigInputValue] = useState("");
  const [eduInputValue, setEduInputValue] = useState("");

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue.replace(regex.skillsRegex, ""));
  };

  const handleInputLocation = (newValue: string) => {
    setLocationInputValue(newValue.replace(regex.locationRegex, ""));
  };

  const handleInputDesig = (newValue: string) => {
    setDesigInputValue(newValue.replace(regex.designationRegex, ""));
  };

  const handleInputEdu = (newValue: string) => {
    setEduInputValue(newValue.replace(regex.educationRegex, ""));
  };

  const designationFilterOptions: any = (inputValue: string, callback) => {
    if (inputValue.length > 0) {
      const data = { pageno: 1, search: `${inputValue}` };
      designationMasterData(data).then((res) =>
        callback(
          res.map((loc) => {
            return { label: loc, value: loc };
          })
        )
      );
    } else {
      return [];
    }
  };

  const designationPromiseOptions = useCallback(
    debounce(designationFilterOptions, 1000),
    []
  );

  useEffect(() => {
    const yearmonthObj = [
      {
        group: "All",
        params: [],
      },
    ];
    dispatch(getYearMonth(yearmonthObj));
    dispatch(DesignationMasterData({ pageno: -1, search: "" }));
    dispatch(SkillsMasterData({ pageno: -1, search: "" }));

    const masterDataObj = [
      {
        group: "All",
        active: 1,
      },
    ];
    dispatch(jobSeekerProfileMasterData(masterDataObj));
  }, []);

  // end masterdata region

  //education dropdown field region

  const formikRef = useRef<any>();
  const [outData, setOutdata] = useState<any>();

  const [modelpopup, setModelpopup] = useState(false);

  //resume region

  // file upload region

  const handleFileUpload = async (e: any) => {
    if (e.target.files[0].type === "application/pdf") {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async () => {
        const arrayBuffer: any = reader.result;
        const pdf = await getDocument(arrayBuffer).promise;
        const numPages = pdf.numPages;
        let pdffile = "";
        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items
            .map((item: any) => item.str)
            .join("\n");
          pdffile += pageText + "\n";
        }
        setOutdata(pdffile);
      };
      reader.readAsArrayBuffer(file);
    } else if (
      e.target.files[0].type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        const content = e.target.result;
        var doc = new Docxtemplater(new PizZip(content), {
          delimiters: {
            start: "12op1j2po1j2poj1po",
            end: "op21j4po21jp4oj1op24j",
          },
        });
        var text: any = doc.getFullText();
        const event = { target: { name: "resume", value: text } };
        formikRef.current.handleChange(event);
      };
      reader.readAsBinaryString(e.target.files[0]);
    }
  };

  const showSnackAlert = UseToastAlert();

  const resumeSize = bytesToMegabytes(Number(environment.resumefile));
  const [resumeformatError, setResumeformatError] = useState("");
  const [downloadResume, setDownloadResume] = useState(false);
  const [notprotectedError, setNotprotectedError] = useState("");
  const [filesizeError, setFilesizeError] = useState("");

  //end resume region

  //post api integration region
  const postJsPrivateData = useSelector((state: any) => state.PostJSPrivateDb);
  const { response, privatejsload } = postJsPrivateData;

  const postHandler = (tag: any) => {
    const uploadTag = tag?.map((item: any) => item?.label);
    let postData = {
      tags: uploadTag,
    };

    let formData = new FormData();
    selectedResume.forEach((file) => {
      formData.append(`resume`, file);
    });
    formData.append("fileInfo", JSON.stringify(postData));

    dispatch(postJobSeekerPrivateDB(formData));
  };

  useEffect(() => {
    if (response?.code === 200) {
      showSnackAlert("success", response.message);
      setModelpopup(false);
      setSelectedResume([]);
      dispatch(fetchJsPrivateDbData(fetchOptions));
      dispatch(resetPostJsPrivateDB());
    } else if (response?.response?.data?.code === 400) {
      showSnackAlert("warning", response?.response?.data?.message);
      dispatch(resetPostJsPrivateDB());
    }
  }, [response]);

  //end post api

  //fetch api integration
  const fetchJsPrivateData = useSelector(
    (state: any) => state.FetchJSPrivateDb
  );
  const { jsPrivateRes, jsPrivateLoading } = fetchJsPrivateData;
  const fetchOptions = {
    searchText: [],
    tags: [],
    pageid: 1,
    pageLimit: 10,
  };
  const fetchData = () => {
    dispatch(fetchJsPrivateDbData(fetchOptions));
  };
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {}, [jsPrivateRes]);

  const fetchHandler = (tag: any) => {
    const searchTag = tag?.map((item: any) => item?.label?.toLowerCase());
    const fetchData = {
      searchText: [],
      tags: [...searchTag],
      pageid: 1,
      pageLimit: 10,
    };
    dispatch(fetchJsPrivateDbData(fetchData));
  };

  const fetchSearchData = (
    loc: any[],
    desig: any[],
    skill: any[],
    edu: any[]
  ) => {
    const searchLoc = loc?.map((item: any) => item?.label);
    const searchDesig = desig?.map((item: any) => item?.label);
    const searchSkill = skill?.map((item: any) => item?.label);
    const searchEdu = edu?.map((item: any) => item?.label);
    const searchTextvalues = [
      ...searchLoc,
      ...searchDesig,
      ...searchSkill,
      ...searchEdu,
    ];
    const fetchOpt = {
      searchText: searchTextvalues,
      tags: [],
      pageid: 1,
      pageLimit: 10,
    };
    dispatch(fetchJsPrivateDbData(fetchOpt));
  };

  const [tagsDis, setTagsDis] = useState<any>();
  useEffect(() => {
    if (jsPrivateRes?.allTags && jsPrivateRes?.allTags?.length > 0) {
      let data = jsPrivateRes?.allTags?.map((tag: any) => {
        return {
          label: tag,
          value: tag,
        };
      });
      setTagsDis(data);

      if (jsPrivateRes?.code === 200) {
        setCurrentPage(1);
      }
    } else if (jsPrivateRes?.response?.data?.code === 400) {
      showSnackAlert("warning", jsPrivateRes?.response?.data?.message);
      dispatch(resetPostJsPrivateDB());
    }
  }, [jsPrivateRes]);

  const loadOptions = (
    inputValue: string,
    callback: (options: any[]) => void
  ) => {
    setTimeout(() => {
      const filteredOptions = tagsDis?.filter(
        (option: any) =>
          option?.label?.toLowerCase().includes(inputValue?.toLowerCase()) ||
          option?.value?.toLowerCase().includes(inputValue?.toLowerCase())
      );

      callback(filteredOptions);
    }, 500);
  };

  //end fetch api

  //download resume
  const { sasData, load } = useSelector((state: any) => state.downloadSAS);

  let resumeDownload = (id: string) => {
    let resumeOpt = {
      id: [id],
      sasFor: "PRIVATE_JS_DB",
    };
    dispatch(downloadSAS(resumeOpt));
  };
  useEffect(() => {
    if (downloadResume) {
      if (!load && sasData?.code === 200) {
        window.location.href = sasData.data[0].img_sas;
      }
    }
  }, [sasData]);
  //end download resume

  const resetAll = () => {
    formikRef.current.values.resume = "";
    setModelpopup(false);
    formikRef.current.resetForm();
    setTagErr(false);
    setResumeErr("");
    setSelectedResume([]);
  };

  const resumeValidation = (resume: any) => {
    if (resume.size > environment.resumefile) {
      showSnackAlert(
        "warning",
        `Please select a valid file size, Supported file size upto ${resumeSize} MB`
      );
      resume[
        "error"
      ] = `Please select a valid file size, Supported file size upto ${resumeSize} MB`;
      return resume;
    } else if (
      resume?.type === "application/pdf" ||
      resume?.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return resume;
    } else {
      resume[
        "error"
      ] = `Please select a valid resume format, Supported Formats: docx, pdf, upto ${resumeSize} MB`;
      return resume;
    }
  };

  const handleConfirmSwal = (val: any) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete ${val?.name} resume?`,
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result?.isConfirmed) {
        dispatch(deletePrivateResume(val?.id));
      }
    });
  };

  return (
    <div
      style={{ overflowY: "auto", maxHeight: "100vh" }}
      // onScroll={handleScroll}
      // ref={ref}
    >
      <Formik
        initialValues={IntialValueForm}
        innerRef={formikRef}
        enableReinitialize={true}
        onSubmit={() => {}}
      >
        {({ values, handleChange, resetForm }: any) => {
          const CheckFile = (e: any): any => {
            if (e?.target?.files?.length > 10) {
              setResumeErr("Sorry you can upload only 10 resume.");
              return false;
            }
            const resumeArray = Object.values(e.target.files);
            let resume: any[] = [];
            for (let i = 0; i < resumeArray.length; i++) {
              resume.push(resumeValidation(resumeArray[i]));
            }
            setSelectedResume([...resume]);
          };

          const deleteFile = (name: any) => {
            const filterResume = selectedResume.filter(
              (resume) => resume.name !== name
            );
            setSelectedResume(filterResume);
          };

          return (
            <>
              {jsPrivateLoading && <PrivateJsProfile_Skl />}
              {!jsPrivateLoading && (
                <div>
                  <div className="page-content bg-white">
                    <div className="content-block">
                      <div className="browse-job section-full bg-white p-t50 p-b20">
                        <div className="container">
                          <div className="job-bx browse-job clearfix mt-5 m-b30">
                            <div className="job-bx-title clearfix NativeTitle">
                              <div className="pull-left">
                                <h5 className="font-weight-700 pull-left text-uppercase">
                                  PRIVATE JOBSEEKER PROFILE
                                </h5>
                              </div>
                              <div
                                className="float-right"
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              >
                                {" "}
                                {hideReset && (
                                  <div>
                                    {" "}
                                    <Button
                                      variant="secondary"
                                      style={{
                                        width: "80px",
                                        marginRight: "5px",
                                        marginLeft: "-10px",
                                      }}
                                      onClick={() => {
                                        fetchData();
                                        setHideReset(false);
                                      }}
                                    >
                                      Reset
                                    </Button>
                                  </div>
                                )}
                                <div>
                                  <Button
                                    className="primary"
                                    style={{
                                      marginRight: "5px",
                                    }}
                                    onClick={() => {
                                      setModelpopup(true);
                                      values.resume = "";

                                      resetForm();
                                    }}
                                  >
                                    Upload Resume
                                  </Button>
                                </div>
                                <div>
                                  <Button onClick={toggleDrawer("right", true)}>
                                    <FaFilter />
                                    {"Filter"}
                                  </Button>
                                </div>
                              </div>
                            </div>

                            <Drawer anchor={"right"} open={state["right"]}>
                              <Box
                                sx={{
                                  width: 600,
                                  paddingLeft: 2,
                                  paddingRight: 2,
                                }}
                                role="presentation"
                              >
                                <div className="modal-custom-header float-right ml-aut">
                                  <button
                                    type="button"
                                    className="close "
                                    onClick={toggleDrawer("right", false)}
                                  >
                                    <span aria-hidden="true">&times;</span>
                                  </button>
                                </div>
                                <br />
                                <form
                                  action=""
                                  className="tab-pane active"
                                  autoComplete="off"
                                  onSubmit={(e: AnyAction) => {
                                    e.preventDefault();
                                    fetchHandler(values?.tag);
                                    setHideReset(true);
                                  }}
                                >
                                  <Typography>
                                    <b>Tag Name</b>
                                  </Typography>
                                  <div className="row">
                                    <div className="col-lg-10 m-t10 m-b10">
                                      <Select
                                        name="tag's"
                                        placeholder="Select tag"
                                        key={"tag"}
                                        options={tagsDis}
                                        isClearable={false}
                                        styles={customStyles}
                                        isMulti
                                        value={values.tag}
                                        onChange={(selectedOption) => {
                                          let event = {
                                            target: {
                                              name: "tag",
                                              value: selectedOption,
                                            },
                                          };

                                          handleChange(event);
                                        }}
                                        className="dropstyle"
                                        classNamePrefix="select"
                                      />
                                    </div>
                                    <div className="col-lg-2 m-t10 m-b10">
                                      <Button
                                        type="submit"
                                        onClick={toggleDrawer("right", false)}
                                      >
                                        Search
                                      </Button>
                                    </div>
                                  </div>
                                </form>

                                <div className="divider">
                                  <span
                                    style={{
                                      marginLeft: "49%",
                                    }}
                                  >
                                    or
                                  </span>
                                </div>
                                <form
                                  action=""
                                  className="tab-pane active"
                                  autoComplete="off"
                                  onSubmit={(e: AnyAction) => {
                                    e.preventDefault();
                                    fetchSearchData(
                                      values.location,
                                      values.designation,
                                      values.skills,
                                      values.eduQualification
                                    );
                                    setHideReset(true);
                                  }}
                                >
                                  <Typography>
                                    <b>Designation</b>
                                  </Typography>
                                  <div className="row">
                                    <div className="col-lg-12 m-t10 m-b10">
                                      <AsyncCreatableSelect
                                        components={components}
                                        isMulti
                                        isValidNewOption={isValidNewOption}
                                        key={"desig"}
                                        name="designation"
                                        placeholder="Enter designation"
                                        cacheOptions
                                        isClearable={false}
                                        noOptionsMessage={() =>
                                          "Enter keyword to search"
                                        }
                                        value={values.designation}
                                        onChange={(selectedOption) => {
                                          let event = {
                                            target: {
                                              name: "designation",
                                              value: selectedOption,
                                            },
                                          };

                                          handleChange(event);
                                        }}
                                        onInputChange={handleInputDesig}
                                        inputValue={desigInputValue}
                                        loadOptions={designationPromiseOptions}
                                        className="dropstyle"
                                        classNamePrefix="select"
                                      />
                                    </div>
                                  </div>
                                  <Typography>
                                    <b>Education</b>
                                  </Typography>
                                  <div className="row">
                                    <div className="col-lg-12 m-t10 m-b10">
                                      <AsyncCreatableSelect
                                        components={components}
                                        cacheOptions
                                        noOptionsMessage={() =>
                                          "Enter keyword "
                                        }
                                        isValidNewOption={isValidNewOption}
                                        isMulti
                                        placeholder="Enter education"
                                        key={"edu"}
                                        isClearable={false}
                                        onInputChange={handleInputEdu}
                                        inputValue={eduInputValue}
                                        name="eduQualification"
                                        onChange={(options) => {
                                          let event = {
                                            target: {
                                              name: "eduQualification",
                                              value: options,
                                            },
                                          };

                                          handleChange(event);
                                        }}
                                        value={values.eduQualification}
                                        className="dropstyle"
                                        styles={customStyles}
                                      />
                                    </div>
                                  </div>
                                  <Typography>
                                    <b>Key Skills</b>
                                  </Typography>
                                  <div className="row">
                                    <div className="col-lg-12 m-t10 m-b10">
                                      <AsyncCreatableSelect
                                        components={components}
                                        placeholder="Enter skills"
                                        cacheOptions
                                        isClearable={true}
                                        onInputChange={handleInputChange}
                                        isValidNewOption={isValidNewOption}
                                        inputValue={inputValue}
                                        key={"skills"}
                                        className="dropstyle"
                                        name="skills"
                                        isMulti
                                        noOptionsMessage={() =>
                                          "Enter keyword to search"
                                        }
                                        value={values.skills}
                                        onChange={(options) => {
                                          let event = {
                                            target: {
                                              name: "skills",
                                              value: options,
                                            },
                                          };
                                          handleChange(event);
                                        }}
                                        loadOptions={promiseOptions}
                                        classNamePrefix="select"
                                      />
                                    </div>
                                  </div>

                                  <Typography>
                                    <b>Location</b>
                                  </Typography>
                                  <div className="row">
                                    <div className="col-lg-12 m-t10 m-b10">
                                      <AsyncCreatableSelect
                                        components={components}
                                        placeholder="Enter location"
                                        cacheOptions
                                        isClearable={false}
                                        key={"loc"}
                                        onInputChange={handleInputLocation}
                                        inputValue={locationInputValue}
                                        isValidNewOption={isValidNewOption}
                                        className="dropstyle"
                                        name="location"
                                        isMulti
                                        noOptionsMessage={() =>
                                          "Enter keyword "
                                        }
                                        value={values.location}
                                        onChange={(options) => {
                                          let event = {
                                            target: {
                                              name: "location",
                                              value: options,
                                            },
                                          };

                                          handleChange(event);
                                        }}
                                        defaultOptions
                                        // loadOptions={
                                        //     locationsPromiseOptions
                                        // }
                                      />
                                    </div>
                                  </div>

                                  <Button
                                    variant="contained"
                                    type="submit"
                                    style={{
                                      width: "100%",
                                      marginTop: "40px",
                                      marginBottom: "20px",
                                      background: "#0d6efd",
                                      color: "white",
                                    }}
                                    onClick={toggleDrawer("right", false)}
                                  >
                                    Search
                                  </Button>
                                </form>
                              </Box>
                            </Drawer>

                            {jsPrivateRes?.userInfo &&
                              jsPrivateRes?.userInfo?.length === 0 && (
                                <center>
                                  {" "}
                                  <div className="col-lg-6">
                                    {" "}
                                    <img
                                      src={notfoundImg}
                                      alt=""
                                      style={{
                                        width: "70%",
                                      }}
                                    />{" "}
                                    <h6
                                      style={{
                                        fontSize: "13px",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Oops no record found.
                                    </h6>
                                  </div>
                                </center>
                              )}

                            {!jsPrivateLoading &&
                              jsPrivateRes?.userInfo &&
                              jsPrivateRes?.userInfo?.length !== 0 && (
                                <div className="row">
                                  <div className="col-xl-12 col-lg-12 col-md-12">
                                    <div>
                                      <table className="table-job-bx cv-manager company-manage-job">
                                        <thead>
                                          <tr>
                                            <th>User Name</th>
                                            <th>Email Address</th>

                                            <th className="text-center">
                                              Phone Number
                                            </th>
                                            <th className="text-center">
                                              Tag Name
                                            </th>
                                            <th className="text-center">
                                              Uploaded on
                                            </th>
                                            <th className="text-center">
                                              Action
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {jsPrivateRes?.userInfo?.length > 0 &&
                                            jsPrivateRes?.userInfo?.map(
                                              (item) => (
                                                <tr>
                                                  <td
                                                    key={item?.name}
                                                    className="job-name d-flex"
                                                    style={{
                                                      margin:
                                                        "-8px 0px -8px 0px",
                                                    }}
                                                  >
                                                    <>
                                                      <BsPersonCircle
                                                        style={{
                                                          fontSize: "47px",
                                                          color: "lightgray",
                                                        }}
                                                      />
                                                    </>
                                                    <div className="ml-2">
                                                      <>
                                                        <div
                                                          className=""
                                                          style={{
                                                            padding: "10px",
                                                          }}
                                                        >
                                                          {item?.name
                                                            ? item?.name
                                                            : "Not mentioned"}
                                                        </div>
                                                      </>
                                                    </div>
                                                  </td>
                                                  <td
                                                    className="application tabletd p-0"
                                                    key={item?.email}
                                                  >
                                                    <span className="">
                                                      <Link
                                                        style={{
                                                          color: "#007bff",
                                                          fontSize: "14px",
                                                        }}
                                                        to={`mailto:${
                                                          item?.email?.length
                                                            ? item?.email[0]
                                                            : ""
                                                        }`}
                                                      >
                                                        {item?.email?.length
                                                          ? item?.email[0]
                                                          : "Not mentioned"}
                                                      </Link>
                                                    </span>
                                                  </td>
                                                  <td
                                                    className="application tabletd p-0 text-center"
                                                    key={item?.phone}
                                                  >
                                                    <span className="">
                                                      {item?.phone
                                                        ? item?.phone[0]
                                                        : "Not mentioned"}
                                                    </span>
                                                  </td>

                                                  <td
                                                    className="application tabletd p-0 text-center"
                                                    key={item?.tags}
                                                  >
                                                    {" "}
                                                    <span className="">
                                                      {item?.tags?.length
                                                        ? item?.tags
                                                            ?.join(", ")
                                                            ?.toUpperCase()
                                                        : "Not mentioned"}
                                                    </span>
                                                  </td>
                                                  <td
                                                    className="application tabletd p-0 text-center"
                                                    key={item?.resume}
                                                  >
                                                    {getTimestampToDate(
                                                      item?.resume?.updated_at
                                                    )}
                                                  </td>
                                                  <td
                                                    className="application text-primary text-center"
                                                    key={item?.resume?.name}
                                                  >
                                                    <div className="d-flex align-items-center justify-content-between">
                                                      <IconButton
                                                        onClick={() => {
                                                          setDownloadResume(
                                                            true
                                                          );
                                                          item?.resume?.name &&
                                                            resumeDownload(
                                                              item?._id
                                                            );
                                                        }}
                                                        style={{
                                                          background: "white",
                                                        }}
                                                      >
                                                        <BsCloudDownload
                                                          title={
                                                            item?.resume?.name
                                                              ? "Click to download Resume"
                                                              : "Resume not available"
                                                          }
                                                          style={
                                                            item?.resume?.name
                                                              ? {
                                                                  color: "blue",
                                                                  cursor:
                                                                    "pointer",
                                                                }
                                                              : {
                                                                  color:
                                                                    "black ",
                                                                }
                                                          }
                                                        />
                                                      </IconButton>
                                                      <IconButton
                                                        style={{
                                                          background: "white",
                                                        }}
                                                        onClick={() => {
                                                          handleConfirmSwal({
                                                            id: item?._id,
                                                            name: item?.name,
                                                          });
                                                        }}
                                                        title="Click to delete Resume"
                                                      >
                                                        <i
                                                          style={{
                                                            color: "red",
                                                          }}
                                                          className="fa fa-trash-o fa-12px"
                                                        ></i>
                                                      </IconButton>
                                                    </div>
                                                  </td>
                                                </tr>
                                              )
                                            )}
                                        </tbody>
                                      </table>
                                    </div>
                                    {jsPrivateRes?.userInfo &&
                                      jsPrivateRes?.userInfo?.length !== 0 && (
                                        <div className="pagination-bx float-right m-b30  m-t20">
                                          <Pagination
                                            className="pagination-data"
                                            onChange={PaginationChange}
                                            total={jsPrivateRes?.totalCount}
                                            current={currentpage}
                                            pageSize={size}
                                            showSizeChanger={true}
                                            itemRender={PrevNextArrow}
                                            onShowSizeChange={PerPageChange}
                                          />
                                        </div>
                                      )}
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <Modal
                className="modal fade browse-job modal-bx-info editor "
                show={modelpopup}
                backdrop="static"
                onHide={() => {
                  setModelpopup(false);
                }}
              >
                <div
                  className="modal-dialog my-0"
                  role="document"
                  style={{ width: "100%" }}
                >
                  <div className="modal-content">
                    <div className="modal-body">
                      <div className="modal-custom-header">
                        <h5 className="modal-title"> Upload Resume(s)</h5>
                        <button
                          type="button"
                          className="close"
                          title="Close"
                          onClick={() => {
                            resetAll();
                          }}
                        >
                          {" "}
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>

                      <div>
                        <form className="attach-resume ">
                          <div className="row">
                            <div className="col-lg-12 col-md-12">
                              <div className="form-group">
                                <div className="custom-file d-block JP-RVlink">
                                  <p className="m-auto align-self-center Rupload">
                                    <BsCloudUpload /> <span className="ml-1"></span>
                                    Upload {values.jdName && "New"}  Resume(s)
                                  </p>

                                  {notprotectedError ? (
                                    <span className="form-error">
                                      {notprotectedError}
                                    </span>
                                  ) : (
                                    ""
                                  )}

                                  {filesizeError ? (
                                    <span className="form-error">
                                      {filesizeError}
                                    </span>
                                  ) : (
                                    ""
                                  )}

                                  {resumeformatError ? (
                                    <span className="form-error">
                                      {resumeformatError}
                                    </span>
                                  ) : (
                                    ""
                                  )}

                                  <p className="modal-custom-desc">
                                    {`Supported Formats: .docx & .pdf upto ${resumeSize}`}
                                    MB
                                  </p>

                                  <input
                                    type="file"
                                    className="site-button form-control"
                                    id="customFile"
                                    title=""
                                    accept=".pdf,.docx"
                                    multiple
                                    name="resume"
                                    style={{
                                      width: "100%",

                                      height: "50%",
                                    }}
                                    onChange={(e) => {
                                      setResumeErr("");
                                      CheckFile(e);
                                      handleFileUpload(e);
                                    }}
                                  />
                                </div>
                                <div className="col-lg-12 col-sm-12 pb-12">
                                  {selectedResume?.length > 0 &&
                                    selectedResume?.map((e) => (
                                      <>
                                        <span
                                          className="job-name d-flex"
                                          style={{
                                            border: "1px solid #e0e0e7",
                                            fontSize: " 13px",
                                            padding: "4px",
                                            justifyContent: "space-between",
                                            marginBottom: "4px",
                                          }}
                                        >
                                          {" "}
                                          {e.name}
                                          <IoCloseCircleOutline
                                            title="remove"
                                            onClick={() => {
                                              deleteFile(e.name);
                                            }}
                                            style={{
                                              color: "red",
                                              fontSize: "20px",
                                              cursor: "pointer",
                                            }}
                                          />
                                        </span>
                                        <span className="form-error">
                                          {e.error}
                                        </span>
                                      </>
                                    ))}
                                </div>
                                {resumeErr && (
                                  <p className="form-error">{resumeErr}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </form>
                        <label>Tag Name</label>
                        &nbsp;
                        <span
                          style={{
                            color: "red",
                          }}
                        >
                          *
                        </span>
                        <div className="row">
                          <div className="col-lg-12 col-md-12">
                            <AsyncCreatableSelect
                              components={components}
                              isMulti
                              isValidNewOption={isValidNewOption}
                              name="tag"
                              placeholder="Enter tag"
                              cacheOptions
                              isClearable={false}
                              noOptionsMessage={() => "Enter keyword"}
                              value={values.tag}
                              loadOptions={loadOptions}
                              onChange={(selectedOption) => {
                                let event = {
                                  target: {
                                    name: "tag",
                                    value: selectedOption,
                                  },
                                };
                                setTagErr(false);
                                handleChange(event);
                              }}
                              className="dropstyle"
                              classNamePrefix="select"
                            />
                            {tagErr && (
                              <p className="form-error">Please enter tag.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="modal-custom-footer mt-3 mb-5"
                      style={{ zIndex: "0" }}
                    >
                      <Button
                        type="button"
                        className="site-button site-warning-button"
                        style={{
                          border: "none",
                        }}
                        onClick={() => {
                          resetAll();
                        }}
                      >
                        Close
                      </Button>
                      &nbsp;
                      <Button
                        type="button"
                        disabled={privatejsload}
                        className="site-button "
                        onClick={() => {
                          if (!values?.tag?.length) {
                            setTagErr(true);
                          }
                          if (!selectedResume?.length) {
                            setResumeErr("Please upload resume.");
                          }
                          if (selectedResume?.length && values?.tag?.length) {
                            postHandler(values.tag);
                          }
                        }}
                      >
                        {privatejsload && (
                          <i className="fa fa-circle-o-notch fa-spin"></i>
                        )}{" "}
                        &nbsp;
                        {privatejsload ? "Uploading" : "Upload"}
                      </Button>{" "}
                      &nbsp;
                    </div>
                  </div>
                </div>
              </Modal>
            </>
          );
        }}
      </Formik>
    </div>
  );
}
export default PrivateJsProfile;
