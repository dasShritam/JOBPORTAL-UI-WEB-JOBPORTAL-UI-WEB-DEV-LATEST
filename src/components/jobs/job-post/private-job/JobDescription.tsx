import React from "react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import JSZip from "jszip";
import Select from "react-select";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.min.js";
import { Modal } from "react-bootstrap";
import AsyncCreatableSelect from "react-select/async-creatable";
import { VscInfo } from "react-icons/vsc";
import "../../../../assets/customCss/jobs/job-post.css";
// import Docxtemplater from "docxtemplater";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { PDFDocument } from "pdf-lib";
import { RolesAndResponsibility } from "../../../../redux/features/jobs/job-post/private-job/PrivateJobSlice";
import { BiInfoCircle } from "react-icons/bi";
import { convertHtmlToText, customStyles } from "../../../../common/common";
import { Skeleton } from "@mui/material";
import { UseToastAlert } from "../../../../hooks/useToastAlert";
import { environment } from "../../../../environments/environment";
import { BsInfoCircle } from "react-icons/bs";
GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.5.141/pdf.worker.min.js";

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
}
interface Option {
  value: string;
  label: string;
}
interface ColourOption {
  label: string;
  value: string;
}
interface Optionss {
  value: String;
  label: String;
  description: String;
}
function JobDescription(props: any) {
  const [designationmasterDatas, setDesignationmasterDatas] = useState([
    { label: "", value: "" },
  ]);

  const dispatch = useDispatch();

  const designation_master_data = useSelector(
    (state: any) => state.designation
  );

  const JS_MASTER_DATA = useSelector((state: any) => state.jobSeekerMasterData);
  const RolesAndResponsibility_master_data = useSelector(
    (state: any) => state.RolesAndResponsibility
  );

  const listingJob = useSelector((state: any) => state.ManageJobs);
  const { allManageJobs, manageJobLoading } = listingJob;
  const [typeOption, setTypeOption] = useState<any>();
  const [modeOption, setModeOption] = useState<any>();
  const [modevalue, setModevalue] = useState<any>("");

  //-----------

  useEffect(() => {
    JS_MASTER_DATA.JSMasterData.map((e) => {
      let typeoptions: any = [];
      if (e.group == "EMPT") {
        e.data.map((e) => {
          typeoptions.push({ label: e.value, value: e.value });
        });
        setTypeOption(typeoptions);
      }
    });
    JS_MASTER_DATA.JSMasterData.map((e, i) => {
      let modeoptions: any = [];
      if (e.group == "WMODE") {
        e.data.map((e) => {
          modeoptions.push({
            label: e.value,
            value: e.id,
            description: e.desc,
          });
        });
        setModeOption(modeoptions);
      }
    });
    designationdatafunction(designation_master_data.DesignationData);
  }, [JS_MASTER_DATA]);
  const [showInputField, setShowInputField] = useState<boolean>(false);

  const [selectedOption, setSelectedOption] = useState<string>("");

  const [value, setValue] = useState("");

  const [extractedText, setExtractedText] = useState("");
  const [fileContents, setFileContents] = useState("");
  const [text, setText] = useState("");
  const fileContentss = extractedText || fileContents || text;

  const editorRef = useRef<ReactQuill>(null);
  const [importpopup, setImportpopup] = useState(false);
  const [showCheckboxes, setShowCheckboxes] = useState(true); //roles
  const [showDesiredcan, setShowDesiredcan] = useState(false);
  const [checkboxValues, setCheckboxValues] = useState<string[]>([]);
  const [desiredcheckboxValues, setDesiredCheckboxValues] = useState<string[]>(
    []
  );
  const [initialCheckboxValues, setInitialCheckboxValues] = useState<string[]>(
    []
  );
  const [saveCheckboxValues, setSaveCheckboxValues] = useState<string[]>([]);
  const [saveDesiredCheckboxValues, setSaveDesiredCheckboxValues] = useState<
    string[]
  >([]);
  const [textareaValue, setTextareaValue] = useState("");
  const [desiredValuetextarea, setDesiredValuetextarea] = useState("");
  const [finalValue, setFinalValue] = useState("");
  const [output, setOutput] = useState(
    `<strong><h3>Roles And Responsibilities </h3><br/>`
    // `<strong><h3>Roles And Responsibilities </h3><br/>
    // <h3>Desired Candidate Profile </h3><br/>
    // <h3>Job Benefits & Perks</h3></strong>`
  );
  const [showModal, setShowModal] = useState(false);

  const [rolebuttonStyle, setRoleButtonStyle] = useState({
    color: "skyblue",
    cursor: "pointer",
  });
  const [desiredbuttonstyle, setDesiredButtonStyle] = useState({
    color: "black",
    cursor: "pointer",
  });
  const handleRoleButtonClick = () => {
    setRoleButtonStyle({
      color: "skyblue",
      cursor: "pointer",
    });
    setDesiredButtonStyle({
      color: "black",
      cursor: "pointer",
    });
  };
  const handleDesiredButtonClick = () => {
    setDesiredButtonStyle({
      color: "skyblue",
      cursor: "pointer",
    });
    setRoleButtonStyle({
      color: "black",
      cursor: "pointer",
    });
  };
  const designation = [
    { value: "1", label: "Software" },
    { value: "2", label: "Hardware" },
  ];
  const designationdatafunction = (data: any) => {
    const options: any = [];
    data?.map((d: any) => {
      options.push({ value: d, label: d });
    });
    setDesignationmasterDatas(options);
  };
  const filterColors4 = (inputValue: string) => {
    return designationmasterDatas.filter((i) =>
      i.label?.toLowerCase().includes(inputValue?.toLowerCase())
    );
  };
  const promiseOptions4 = (inputValue: string) =>
    new Promise<ColourOption[] | any>((resolve) => {
      setTimeout(() => {
        resolve(filterColors4(inputValue));
      }, 1000);
    });

  const [rolesoption, setRolesoption] = useState<any>([
    { label: "", value: "" },
  ]);
  const [desireCandidateOption, setDesireCandidateOption] = useState([
    { label: "", value: "" },
  ]);
  const [loaderjd, setLoaderjd] = useState(false);
  useEffect(() => {
    if (loaderjd) {
      setHidereact(true);
      setShowreact(false);
      setLoaderjd(false);
    } else {
      setTimeout(() => {
        setHidereact(false);
        setShowreact(true);
      }, 3000);
    }
  }, [loaderjd]);

  //Text file
  const handleTextFileChange = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const fileContents = event.target.result;

      setFileContents(fileContents);
      const eventt = {
        target: {
          name: "jobDesc",
          value: fileContents.slice(0, 5000),
        },
      };
      // if (fileContents.length > 5100) {
      //   snackAlert("warning", "File length must be less than 5000 characters");
      //   setLoaderjd(false);
      //   const eventsss = { target: { name: "jobDesc", value: "" } };
      //   props.handleChange(eventsss);
      // } else {
      // }
      props.handleChange(eventt);

      // setOutput(fileContents);
    };
    reader.readAsText(file);
  };

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
        const event = {
          target: { name: "jobDesc", value: pdffile.slice(0, 5000) },
        };

        props.handleChange(event);
      };
      reader.readAsArrayBuffer(file);
    } else if (
      e.target.files[0].type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      // ||e.target.files[0].type === "application/msword"
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
        const event = {
          target: { name: "jobDesc", value: text.slice(0, 5000) },
        };
        // if (text.length > 100) {
        //   snackAlert(
        //     "warning",
        //     "File length must be less than 5000 characters"
        //   );
        //   setLoaderjd(false);
        //   const eventsss = {
        //     target: { name: "jobDesc", value: text.slice(0, 5000) },
        //   };
        //   props.handleChange(eventsss);
        // } else {
        // }
        props.handleChange(event);
      };
      reader.readAsBinaryString(e.target.files[0]);
    }
  };

  const [roleval, setRoleVal] = useState<any>("");
  const [desval, setDesVal] = useState<any>("");
  const array = async () => {
    toggleCheckboxes()
    handleRoleButtonClick()
    if (props.values.designation != null) {
      const regex = /<(?!p\s*\/?)[^>]+>/gi;
      const stringWithoutTags = props.values.jobDesc.replace(regex, "");
      // setRoleVal(stringWithoutTags.split('<p>').map((item) => item.replace(/<\/?p>/g, '')))
      const arr = stringWithoutTags
        .split("<p>")
        .map((item) => item.replace(/<\/?p>/g, ""));
      const datasss = rolesoption
        .filter((obj) => arr.includes(obj.label.replace(/\n/g, "")))
        .map((obj, i) => {
          return { label: obj.label.replace(/\n/g, ""), value: obj.value };
        });
      const data = desireCandidateOption
        .filter((obj) => arr.includes(obj.label.replace(/\n/g, "")))
        .map((obj) => {
          return { label: obj.label.replace(/\n/g, ""), value: obj.value };
        });
      setRoleVal(datasss);
      setDesVal(data);

      const matchedrole = datasss?.filter((obj1) =>
        rolesoption?.some((obj2) => obj1.value === obj2.value)
      );
      setCheckboxValues(
        matchedrole?.map((e) => {
          return e.value;
        })
      );
      const matcheddesired = data?.filter((obj1) =>
        desireCandidateOption?.some((obj2) => obj1.value === obj2.value)
      );
      setDesiredCheckboxValues(
        matcheddesired?.map((e) => {
          return e.value;
        })
      );
      return arr;
    }
  };

  const handleChange = () => {
    setValue(extractedText || text || fileContents);
  };


  const handle = (e: any) => {
    const event = {
      target: {
        name: "jobDesc",
        value: "",
      },
    };
    props.handleChange(event);
    setOutput("");

    // handleFileInputChanges(e);
    // handleFileChange(e);
    // handleFileInputChange(e);
    handleTextFileChange(e);
    // showFile(e);
    // showPdfFile(e);
    handleFileUpload(e);
  };
  const [hidereact, setHidereact] = useState(false);
  const [showreact, setShowreact] = useState(true);
  const [isCheckboxCreated, setIsCheckboxCreated] = useState(false);

  // useEffect(() => {
  //   if (output === "") {
  //     setHidereact(true);
  //     setShowreact(false);
  //   } else {
  //     setTimeout(() => {
  //       setHidereact(false);
  //       setShowreact(true);
  //     }, 3000);
  //   }
  // }, [output]);

  const formats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    { header: 1 },
    { header: 2 },
    { header: 3 },
    { header: 4 },
    { header: 5 },
    { header: 6 },
    { list: "ordered" },
    { list: "bullet" },
    { indent: "-1" },
    { indent: "+1" },
    { align: [] },
    { color: [] },
    { background: [] },
    { font: [] },
    { size: [] },
    { direction: "rtl" },
    { script: "sub" },
    { script: "super" },
    { image: [] },
    { video: [] },
    { formula: [] },
    "clean",
  ];

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ script: "sub" }, { script: "super" }],
        [{ direction: "rtl" }],
        ["link", "image", "video", "formula"],
        ["clean"],
      ],
    },
  };
  const sanitizeOptions = {
    allowedTags: ["p", "strong", "em"],
    allowedAttributes: { a: ["href"] },
    allowedStyles: {
      "font-size": [/^\d+(?:px|em)$/],
      "text-align": [/^left$/, /^right$/, /^center$/],
    },
    allowedIframeHostnames: ["www.youtube.com"],
    allowProtocolRelative: true,
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (e.target.checked) {
      setCheckboxValues([...checkboxValues, value]);
    } else {
      setCheckboxValues(checkboxValues.filter((val) => val !== value));
    }
  };
  const formatOptionLabel = (
    { label, description }: Optionss,
    { context }: { context: string }
  ) => {
    if (context === "value") {
      return label;
    }
    return (
      <div>
        {label} <br />
        {description}
      </div>
    );
  };

  const handleDesiredCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const values = e.target.value;
    if (e.target.checked) {
      setDesiredCheckboxValues([...desiredcheckboxValues, values]);
    } else {
      setDesiredCheckboxValues(
        desiredcheckboxValues.filter((val) => val !== values)
      );
    }
  };
  const handleSave = () => {
    setSaveCheckboxValues([...checkboxValues]);
    setSaveDesiredCheckboxValues([...desiredcheckboxValues]);
  };

  const toggleCheckboxes = () => {
    setShowCheckboxes(true);
    setShowDesiredcan(false);
  };
  //desired can
  const toggleDesiredCandidate = () => {
    // setShowDesiredcan(!showDesiredcan);
    setShowCheckboxes(false);
    setShowDesiredcan(true);
  };

  const updateTextareaValue = () => {
    const selectedLabels = rolesoption
      .filter((option) => checkboxValues.includes(option.value))
      .map((option) => option.label);
    setTextareaValue(selectedLabels.join("</br>"));
  };
  const updateDesiredTextareaValue = () => {
    const selectedLabelss = desireCandidateOption
      .filter((option) => desiredcheckboxValues.includes(option.value))
      .map((option) => option.label);
    setDesiredValuetextarea(selectedLabelss.join("</br>"));
  };

  const handleCancelClick = () => {
    setShowModal(false);
    setCheckboxValues([...saveCheckboxValues]);
    setDesiredCheckboxValues([...saveDesiredCheckboxValues]);
  };
  const handleSaveClick = () => {
    setInitialCheckboxValues([...checkboxValues]);
    setShowModal(false);
  };

  useEffect(() => {
    setInitialCheckboxValues([...checkboxValues]);
  }, [checkboxValues]);

  useEffect(() => {
    if (textareaValue || desiredValuetextarea) {
      const event = {
        target: {
          name: "jobDesc",
          value: `
         <strong><h3 aria-readonly>Roles And Responsibilities</h3></strong>
        <br/>
        <p>${textareaValue}</p>
        <br/>
        <strong><h3>Desired Candidate Profile</h3></strong>
        <br/>
        <p>${desiredValuetextarea}</p>
        <br/>`,
        },
      };

      props.handleChange(event);

      // setOutput(

      // );
    }
  }, [textareaValue, desiredValuetextarea]);

  useEffect(() => {
    setFinalValue(`${textareaValue}, ${desiredValuetextarea} `);
    setOutput(
      `     
      <strong><h3 aria-readonly>Roles And Responsibilities</h3></strong>
      <br/>
      <p>${textareaValue}</p>
      <br/>
      <strong><h3>Desired Candidate Profile</h3></strong>
      <br/>
      <p>${desiredValuetextarea}</p>
      <br/>      
      `
    );
  }, [textareaValue, desiredValuetextarea]);
  useEffect(() => {
    setCheckboxValues([...saveCheckboxValues]);
    setDesiredCheckboxValues([...saveDesiredCheckboxValues])
    setSaveCheckboxValues([]);
    setSaveDesiredCheckboxValues([]);
  }, []);

  useEffect(() => {
    if (RolesAndResponsibility_master_data?.loadingI == false) {
      RolesAndResponsibility_master_data?.roles?.data?.rolesNresp != undefined
        ? setRolesoption(
          RolesAndResponsibility_master_data?.roles?.data?.rolesNresp.map(
            (e, i) => {
              return {
                label: e,
                value: i.toString(),
              };
            }
          )
        )
        : (setRolesoption([{ label: "", value: "" }]))
      RolesAndResponsibility_master_data?.roles?.data?.candidate_prof !=
        undefined
        ? setDesireCandidateOption(
          RolesAndResponsibility_master_data?.roles?.data?.candidate_prof.map(
            (e, i) => {
              return {
                label: e,
                value: i.toString(),
              };
            }
          )
        )
        : setDesireCandidateOption([{ label: "", value: "" }]);
      setIsCheckboxCreated(true);
      // array()
    }
  }, [RolesAndResponsibility_master_data?.loadingI]);

  useEffect(() => {
    if (isCheckboxCreated) {
      array();
    }
  }, [isCheckboxCreated]);
  useEffect(() => {

    array();
  }, [props.values.designation])

  const callRolesResApi = async () => {
    await dispatch(RolesAndResponsibility(props.values.designation.value));
    // setIsCheckboxCreated(true);
  };
  const snackAlert = UseToastAlert();
  const handleRestrict = (e: any) => {
    const videoValue = e?.target?.files && e?.target?.files[0];

    if (
      videoValue.size > 500000
      // environment.jobdescription
    ) {
      snackAlert("warning", "File size should be less than 500 KB");
      setLoaderjd(false);
      const eventss = { target: { name: "jobDesc", value: "" } };
      props.handleChange(eventss); // props.values.jobDesc = null;
    } else if (
      videoValue.type !== "application/pdf" &&
      videoValue.type !==
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
      videoValue.type !== "text/plain"
      // &&videoValue.type !== "application/msword"
    ) {
      snackAlert("warning", "File must be in docx, pdf or txt format");
      setLoaderjd(false);
      const eventsss = { target: { name: "jobDesc", value: "" } };
      props.handleChange(eventsss);
    } else {
      handle(e);
    }
  };
  const isValidNewOption = (inputValue) => {
    if (inputValue.length === 0 || inputValue.length > 200) {
      return false;
    }
    return true;
  };

  return (
    <div id="job_desc_bx" className="job-bx bg-white m-b30">
      <h5 className="mb-2">Job Description</h5>
      <div>
        <div className="row" id="desigjd">
          <div className="col-lg-6 col-md-6 col-sm-6">
            <label>Job title / Designation</label>
            <span className="form-error">*</span>
            &nbsp;
            <BsInfoCircle
              className="mb-1"
              title="Tell us about the title or designation you are looking for."
            />
            <AsyncCreatableSelect
              className="dropstyle"
              placeholder="Type your designation"
              cacheOptions
              isClearable={true}
              isValidNewOption={isValidNewOption}
              onBlur={props.setFieldTouched}
              value={props.values.designation}
              name="designation"
              noOptionsMessage={() => "Enter keyword to search"}
              loadOptions={promiseOptions4}
              onChange={(e: any) => {
                let event = {
                  target: {
                    name: "designation",
                    value: e,
                  },
                };
                props.setFieldValue("designation", e?.value);
                props.handleChange(event);
              }}
            />{" "}
            {props.touched.designation && props.errors.designation && (
              <div className="form-error">{props?.errors?.designation}</div>
            )}
            {props.errors.designation && <div className="error-scroll"></div>}
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6">
            <label>Employment Type</label>
            <span className="form-error">*</span>
            <Select
              name="empType"
              className="dropstyle"
              placeholder="Mention employment type"
              // isClearable={true}
              options={typeOption}
              value={props.values.empType}
              onBlur={props.setFieldTouched}
              classNamePrefix="select"
              styles={customStyles}
              onChange={(option: any) => {
                props.setFieldValue("empType", option);
              }}
            />
            {props.touched.empType && props.errors.empType ? (
              <div className="form-error">{props?.errors?.empType}</div>
            ) : null}
            {props.errors.empType && <div className="error-scroll"></div>}
          </div>
        </div>
        <br />
        <div className="row" id="workjd">
          <div className="col-lg-6 col-md-6 col-sm-6">
            <label>Work Mode</label>
            <span className="form-error">*</span>
            &nbsp;
            <BsInfoCircle title="Select the work mode where the candidate will be working." />
            <Select
              name="workMode"
              className="dropstyle"
              placeholder="Mention Work Mode"
              // isClearable={true}
              options={modeOption}
              value={props.values.workMode}
              onBlur={props.setFieldTouched}
              formatOptionLabel={formatOptionLabel}
              classNamePrefix="select"
              styles={customStyles}
              onChange={(option: any) => {
                props.setFieldValue("workMode", option);
                // handleWork();
                if (option.label === "Hybrid") {
                  setShowInputField(true);
                  option.description = "";
                } else {
                  props.values.hybridPolicy = "";
                }
              }}
            />
            {props.touched.workMode && props?.errors?.workMode && (
              <div className="form-error">{props?.errors?.workMode}</div>
            )}
            {props.errors.workMode && <div className="error-scroll"></div>}
          </div>
          {props?.values?.workMode?.label == "Hybrid" && (
            <div className="col-lg-6 col-md-6 col-sm-6" id="hybrid-policy">
              <label>
                Define your hybrid policy <span className="form-error">*</span>
              </label>
              <input
                autoComplete="off"
                maxLength={100}
                name="hybridPolicy"
                placeholder="e.g. 3 days a week in office/ 10 days in a month etc."
                type="text"
                className="form-control"
                value={props.values.hybridPolicy}
                onChange={(e) => {
                  props.handleChange(e);
                  // props.values.workMode.description = e.target.value;
                }}
              />
              {props.errors.hybridPolicy && props.touched.hybridPolicy && (
                <p className="form-error ">{props.errors.hybridPolicy}</p>
              )}
              {props.errors.hybridPolicy && (
                <div className="error-scroll"></div>
              )}
              {/* {showInputField && !props.values.workMode.description && (
                <p className="form-error">Please Enter Policy</p>
              )} */}
            </div>
          )}
        </div>
        <br />
        <div id="jdtexteditor">
          <div className="mb-2">
            <label>Job Description</label>
            <span className="form-error">*</span>
          </div>
          {showreact && (
            <div>
              {" "}
              <div className="d-flex" style={{ marginLeft: "370px" }}>
                {" "}
                {props.values.designation && (
                  <>
                    {" "}
                    <label
                      className="jdsuggest"
                      style={{ color: "skyblue", cursor: "pointer" }}
                      onClick={async (e: any) => {
                        await callRolesResApi();
                        setImportpopup(true);
                      }}
                    >
                      {" "}
                      JD Suggestion{" "}
                    </label>
                    &nbsp;
                    <BsInfoCircle title="You can select from job description templates we have prepared for this role." />{" "}
                  </>
                )}
                &nbsp;
                <label
                  className="jdimport"
                  style={{ color: "skyblue", cursor: "pointer" }}
                >
                  {" "}
                  <input
                    className="float-right"
                    type="file"
                    style={{ display: "none" }}
                    id="file-input"
                    onChange={(e: any) => {
                      setLoaderjd(true);
                      handleRestrict(e);
                    }}
                  />{" "}
                  Import JD{" "}
                </label>&nbsp;
                <BsInfoCircle title="File must be in docx, pdf or txt format and should be less than 500 KB" />{" "}
              </div>{" "}
              <ReactQuill
                id="reactquill"
                ref={editorRef}
                value={props.values.jobDesc}
                style={{ width: "100%", marginTop: "-37px" }}
                placeholder="Enter your job description with Roles And Responsibilities, Desired Candidate Profile"
                onChange={(e: any) => {
                  const addedData =
                    e.toString() == "<p><br></p>" ||
                      e.toString() == "<h3><br></h3>"
                      ? ""
                      : e.toString();
                  const htmlString = convertHtmlToText(e.toString())
                  const event = {
                    target: {
                      name: "jobDesc",
                      value: htmlString?.trim() !== "" ? addedData : '',
                    },
                  };
                  handleChange();

                  if (addedData.length > 5000) {
                    snackAlert(
                      "warning",
                      "Text length must be less than 5000 characters"
                    );
                  } else {
                    props.handleChange(event);
                  }
                  // props.handleChange(event);

                  // setOutput(addedData);
                  // props.values.jobDesc = e.toString();
                }}
              />
              {props.errors.jobDesc && props.touched.jobDesc && (
                <p className="form-error error-scroll ">
                  {props.errors.jobDesc}
                </p>
              )}
            </div>
          )}{" "}
          {props.errors.jobDesc && <div className="error-scroll"></div>}
          {hidereact && (
            <div className="job-bx mb-1">
              {" "}
              <Skeleton animation="wave" height={100} width="100%" />{" "}
            </div>
          )}
          <Modal
            // style={{ width: "700px" }}
            show={importpopup}
            onHide={() => {
              setImportpopup(false);
              handleCancelClick();
              setIsCheckboxCreated(false);
            }}
            className="modal fade modal-bx-info editor "
          >
            {" "}
            <div
              className="modal-dialog my-0 "
              role="document"
              id="modalpopupstyle"
              style={{ width: "770px" }}
            >
              {" "}
              <div className="modal-content">
                {" "}
                <div className="modal-header" id="headerjds">
                  {" "}
                  <h5 className="modal-title" id="titlejds">
                    Suggested Job Descriptions
                  </h5>{" "}
                  <button
                    style={{ color: "white" }}
                    type="button"
                    className="close"
                    onClick={() => {
                      setImportpopup(false);
                      handleCancelClick();
                      setIsCheckboxCreated(false);
                    }}
                  >
                    <i
                      style={{ color: "white" }}
                      className="fa fa-times"
                      aria-hidden="true"
                    ></i>
                  </button>{" "}
                </div>{" "}
                <div className="modal-body">
                  {/* <div className="row"> */}
                  {desireCandidateOption[0]?.label == "" &&
                    rolesoption[0]?.label == "" && (
                      <div>
                        <h6>For this Designation. JD is not available</h6>
                      </div>
                    )}
                  {rolesoption[0]?.label == undefined && (
                    <div>
                      <h6>For this Designation. JD is not available</h6>
                    </div>
                  )}
                  <div className="row">
                    <div
                      style={rolebuttonStyle}
                      onClick={() => { handleRoleButtonClick(); toggleCheckboxes(); }}
                      className="col"
                    >
                      {rolesoption[0]?.label != "" && rolesoption[0]?.label != undefined && (
                        <h6 >
                          Roles And Responsibilities
                        </h6>
                      )}
                    </div>
                    <div
                      style={desiredbuttonstyle}
                      onClick={() => { handleDesiredButtonClick(); toggleDesiredCandidate(); }}
                      className="col"
                    >
                      {desireCandidateOption[0]?.label != "" && desireCandidateOption[0]?.label != undefined && (
                        <h6
                          className="desired"
                        >
                          Desired Candidate Profile
                        </h6>
                      )}
                    </div>
                  </div>
                  <div className="p-3">
                    {showCheckboxes && (
                      <div>
                        {rolesoption[0]?.label != "" &&
                          rolesoption.map((option, val) => (
                            <div key={option.value}>
                              <label
                                key={option.value}
                              // style={{ flexBasis: "33%", display: "flex" }}
                              >
                                <input
                                  key={option.value}
                                  style={{
                                    marginRight: "5px",
                                    cursor: "pointer",
                                  }}
                                  type="checkbox"
                                  value={option.value}
                                  // checked={checkboxChecked(jobboxcheck, val)}
                                  onChange={(e: any) => {
                                    handleCheckboxChange(e);
                                  }}
                                  checked={checkboxValues.includes(
                                    option.value
                                  )}
                                />
                                <span className="font-weight-normal">
                                  {option.label}
                                </span>
                              </label>
                            </div>
                          ))}
                      </div>
                    )}
                    {showDesiredcan && (
                      <div>
                        {desireCandidateOption[0]?.label != "" &&
                          desireCandidateOption.map((option, val) => (
                            <div key={option.value}>
                              <label
                                key={option.value}
                              // style={{ flexBasis: "33%", display: "flex" }}
                              >
                                <input
                                  key={option.value}
                                  type="checkbox"
                                  style={{
                                    marginRight: "5px",
                                    cursor: "pointer",
                                  }}
                                  value={option.value}
                                  onChange={(e: any) => {
                                    handleDesiredCheckboxChange(e);
                                    // setDesiredValuetextarea(e.target.value);
                                  }}
                                  checked={desiredcheckboxValues.includes(
                                    option.value
                                  )}
                                />
                                <span className="font-weight-normal">
                                  {option.label}
                                </span>
                              </label>
                            </div>
                          ))}
                      </div>
                    )}
                    {/* <textarea
                    value={finalValue}
                    onChange={(e) => {
                      setTextareaValue(e.target.value);
                      setDesiredValuetextarea(e.target.value);
                    }}
                  /> */}
                  </div>

                  {/* <div className="col-md-5">
                  <h4>Desired Candidate Profile</h4>
                </div> */}
                  {/* </div> */}
                </div>{" "}
                {desireCandidateOption[0]?.label != "" && desireCandidateOption[0]?.label != undefined ||
                  rolesoption[0]?.label != "" && rolesoption[0]?.label != undefined ? (
                  <div className="modal-footer">
                    {" "}
                    <button
                      type="button"
                      className="site-button"
                      onClick={() => {
                        updateTextareaValue();
                        updateDesiredTextareaValue();
                        setImportpopup(false);
                        handleSave();
                      }}
                    >
                      Add Suggestions
                    </button>{" "}
                    <button
                      type="button"
                      className="site-button"
                      onClick={() => {
                        setImportpopup(false);
                        handleCancelClick();
                        setIsCheckboxCreated(false);
                      }}
                    >
                      Cancel
                    </button>{" "}
                  </div>
                ) : ""}{" "}
              </div>{" "}
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default JobDescription;

