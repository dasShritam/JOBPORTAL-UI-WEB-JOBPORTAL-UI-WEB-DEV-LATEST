import "../../../../assets/customCss/jobs/internalJob.css";
import React, { useCallback } from "react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { debounce } from "lodash";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.min.js";
import { Modal } from "react-bootstrap";
import AsyncCreatableSelect from "react-select/async-creatable";
import "../../../../assets/customCss/jobs/job-post.css";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { RolesAndResponsibility } from "../../../../redux/features/jobs/job-post/private-job/PrivateJobSlice";
import {
  bytesToMegabytes,
  convertHtmlToText,
  customStyles,
} from "../../../../common/common";
import { Skeleton } from "@mui/material";
import { UseToastAlert } from "../../../../hooks/useToastAlert";
import { environment } from "../../../../environments/environment";
import { designationMasterData } from "../../../../ApiCall/masterData";
import { Link } from "react-router-dom";
import { BsCloudDownload, BsCloudUpload, BsInfoCircle } from "react-icons/bs";
import { IoCloseCircleOutline } from "react-icons/io5";
GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.5.141/pdf.worker.min.js";

interface OptionType {
  label: string;
  value: string;
}
interface Optionss {
  value: String;
  label: String;
  description: String;
}
function JobDescription(props: any) {
  const dispatch = useDispatch();
  const RolesAndResponsibility_master_data = useSelector(
    (state: any) => state.RolesAndResponsibility
  );

  const desgMaster = useSelector((state: any) => state.designation);

  const [typeOption, setTypeOption] = useState<any>();
  const [modeOption, setModeOption] = useState<any>();

  const [extractedText, setExtractedText] = useState("");
  const [fileContents, setFileContents] = useState("");
  const [text, setText] = useState("");

  const editorRef = useRef<ReactQuill>(null);
  const [importpopup, setImportpopup] = useState(false);
  const [showCheckboxes, setShowCheckboxes] = useState(true); //roles
  const [showDesiredcan, setShowDesiredcan] = useState(false);
  const [checkboxValues, setCheckboxValues] = useState<string[]>([]);
  const [desiredcheckboxValues, setDesiredCheckboxValues] = useState<string[]>(
    []
  );
  const [showInputField, setShowInputField] = useState<boolean>(false);
  const [saveCheckboxValues, setSaveCheckboxValues] = useState<string[]>([]);
  const [saveDesiredCheckboxValues, setSaveDesiredCheckboxValues] = useState<
    string[]
  >([]);
  const [textareaValue, setTextareaValue] = useState("");
  const [desiredValuetextarea, setDesiredValuetextarea] = useState("");
  const [finalValue, setFinalValue] = useState("");
  const [output, setOutput] = useState(
    `<strong><h3>Roles And Responsibilities </h3><br/>`
  );
  const [initialCheckboxValues, setInitialCheckboxValues] = useState<string[]>(
    []
  );
  const [value, setValue] = useState("");
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

  //#region designation
  const filterRoles: any = (inputValue: string, callback) => {
    if (inputValue.length >= 2) {
      const data = { pageno: 1, search: `${inputValue}` };
      designationMasterData(data).then((res) =>
        callback(
          res.map((role) => {
            return { label: role, value: role };
          })
        )
      );
    } else {
      return [];
    }
  };
  const loadRoleOptions = useCallback(debounce(filterRoles, 1000), []);
  //#endregion

  const [rolesoption, setRolesoption] = useState<any>([
    { label: "", value: "" },
  ]);
  const [desireCandidateOption, setDesireCandidateOption] = useState([
    { label: "", value: "" },
  ]);

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
          value: fileContents,
        },
      };
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
        props.handleChange(event);
      };
      reader.readAsBinaryString(e.target.files[0]);
    }
  };

  const [roleval, setRoleVal] = useState<any>("");
  const [desval, setDesVal] = useState<any>("");
  const array = async () => {
    if (props.values.designation != null) {
      const regex = /<(?!p\s*\/?)[^>]+>/gi;
      const stringWithoutTags = props.values.jobDesc.replace(regex, "");
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
    handleTextFileChange(e);
    handleFileUpload(e);
  };
  const [hidereact, setHidereact] = useState(false);
  const [showreact, setShowreact] = useState(true);
  const [isCheckboxCreated, setIsCheckboxCreated] = useState(false);
  const [loaderjd, setLoaderjd] = useState(false);
  const [companyInputValue, setCompanyInputValue] = useState("");
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
  const handleInputChanges = (newValue: string) => {
    setCompanyInputValue(newValue.slice(0, 150));
    // setCompanyInputValue(newValue.replace(/[^a-zA-Z0-9-.',()&@*\s]*$/, ""));
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
    setSaveCheckboxValues([]);
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
        : setRolesoption([{ label: "", value: "" }]);
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
  }, [props.values.designation]);

  const callRolesResApi = async () => {
    await dispatch(RolesAndResponsibility(props.values.designation.value));
    // setIsCheckboxCreated(false);
  };
  const allowedExtensions: string[] = ["docx", "pdf", "txt"];
  const snackAlert = UseToastAlert();
  const handleRestrict = (e: any) => {
    const videoValue = e?.target?.files && e?.target?.files[0];
    const ext = videoValue?.name?.split(".");
    if (ext && !allowedExtensions.includes(ext[ext.length - 1])) {
      snackAlert(
        "warning",
        "Please select valid file (allowed extensions are -docx, pdf, txt)"
      );
      setLoaderjd(false);
      // const eventss = { target: { name: "jobDesc", value: "", }, };
      // props.handleChange(eventss);
      return;
    }

    if (videoValue.size > 500000) {
      snackAlert("warning", "File size should be less than 500 KB");
      setLoaderjd(false);
      // const eventss = { target: { name: "jobDesc", value: "", }, };
      // props.handleChange(eventss);
      return;
    } else {
      handle(e);
    }
  };

  //#region file
  const showSnackAlert = UseToastAlert();
  const resumeSize = bytesToMegabytes(Number(environment.resumefile));
  const CheckFile = (e: any): boolean => {
    let regex = new RegExp(/[^\s]+(.*?).(.doc|.DOC|.docx|.DOCX|.pdf|.PDF)$/);
    const allowedExt = ["doc", "docx", "pdf"];
    const selectedFile: any = e.target.files && e.target.files[0];
    const extArray = selectedFile?.name?.split(".");
    const ext = extArray[extArray?.length - 1];
    const reader: any = new FileReader();
    reader.readAsArrayBuffer(selectedFile);
    reader.onload = function () {
      let file: any = new Blob([reader.result], { type: "application/pdf" });
      file.text().then((x) => {
        if (x.includes("Encrypt")) {
          showSnackAlert(
            "warning",
            "Please select a valid file which is not protected."
          );
          e.target.value = null;
          return false;
        }
        const resume = e.target.files[0].type;
        if (resume) {
          if (e.target?.files[0].size > environment.resumefile) {
            showSnackAlert(
              "warning",
              `Please select a valid file size, Supported file size upto ${resumeSize} MB`
            );
            e.target.value = null;
            const event = {
              target: {
                name: "jdFile",
                value: null,
              },
            };
            props.handleChange(event);
            return false;
          }
          if (allowedExt.includes(ext.toLowerCase())) {
            const event = {
              target: {
                name: "jdFile",
                value: e?.target?.files[0],
              },
            };
            props.handleChange(event);
            return true;
          } else {
            showSnackAlert(
              "warning",
              `Please select a valid resume format, Supported Formats: docx, pdf, upto ${resumeSize} MB`
            );
            e.target.value = null;
            const event = {
              target: {
                name: "jdFile",
                value: null,
              },
            };
            props.handleChange(event);
            return false;
          }
        }
        return false;
      });
    };
    return false;
  };

  useEffect(() => {
    if (props?.values?.jdFileUrl) {
      setShowDownloadBtn(true);
    } else setShowDownloadBtn(false);
  }, [props.values.jdFileUrl]);

  //#endregion

  const [showDownloadBtn, setShowDownloadBtn] = useState(false);
  const [notprotectedError, setNotprotectedError] = useState("");
  const [filesizeError, setFilesizeError] = useState("");
  const [resumeformatError, setResumeformatError] = useState("");
  const [undoFile, setUndoFile] = useState(null);

  const deleteFile = () => {
    setUndoFile(props.values.jdFile);
    const event = {
      target: {
        name: "jdFile",
        value: null,
      },
    };
    props.handleChange(event);
  };

  const undoJdFile = () => {
    const event = {
      target: {
        name: "jdFile",
        value: undoFile,
      },
    };
    props.handleChange(event);
    setUndoFile(null);
  };
  const handleDownload = () => {
    window.open(props.values.jdFileUrl);
  };

  return (
    <div id="job_desc_bx" className="job-bx bg-white m-b30">
      <h5 className="mb-2">Job Description</h5>
      {props?.values && (
        <div>
          <div className="row  mb-2" id="desigjd">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <label>Job title / Designation</label>
              <span className="form-error">*</span>&nbsp;
              <BsInfoCircle title="Tell us about the title or designation you are looking for." />
              <AsyncCreatableSelect
                className="dropstyle"
                placeholder="Type your designation"
                cacheOptions
                maxMenuHeight={200}
                isClearable={true}
                onBlur={props.setFieldTouched}
                onInputChange={handleInputChanges}
                inputValue={companyInputValue}
                value={props.values.designation}
                name="designation"
                noOptionsMessage={() => "Enter keyword to search"}
                loadOptions={loadRoleOptions}
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
              />
              {props.touched.designation && props.errors.designation && (
                <div className="form-error">{props?.errors?.designation}</div>
              )}
              {props.errors.designation && (
                <div className="error-scroll"> </div>
              )}
            </div>
          </div>

          <div id="attach_resume_bx" className="job-bx bg-white m-b30">
            <label>Upload Job Description</label>
            <p className="c_content_desc mb-0">
              You can upload the job description if you have.
            </p>
            {showDownloadBtn && (
              <div
                className="c_content_subheader"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <p>
                  <b>{props?.values?.jdName?.split("-")[1]}</b>
                </p>
                <p title="Click here to download this file">
                  <Link
                    className="float-right"
                    to={props.values.jdFileUrl}
                    style={{ color: "blue" }}
                  // onClick={() => {
                  //   handleDownload();
                  // }}
                  >
                    <BsCloudDownload />
                  </Link>
                </p>
              </div>
            )}
            <form className="attach-resume ">
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  {props.values.jdFile ? (
                    <div className="jdfile">
                      <div>
                        <span className="c_content_desc">
                          {props.values.jdFile?.name}
                        </span>
                      </div>
                      <div onClick={deleteFile} className="mt-1">
                        <IoCloseCircleOutline
                          style={{
                            color: "red",
                            fontSize: "20px",
                            cursor: "pointer",
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="form-group mb-0">
                      {undoFile && (
                        <div style={{ float: "right" }}>
                          <button
                            type="button"
                            onClick={undoJdFile}
                            className="btn btn-sm"
                          >
                            Undo
                          </button>
                        </div>
                      )}
                      <div className="custom-file d-block JP-RVlink">
                        <p className="m-auto align-self-center Rupload">
                          <BsCloudUpload /> &nbsp; Upload{" "}
                          {props.values.jdName && "New"} Job Description
                        </p>
                        {notprotectedError ? (
                          <span className="form-error">
                            {notprotectedError}
                          </span>
                        ) : (
                          ""
                        )}
                        {notprotectedError && (
                          <div className="error-scroll"> </div>
                        )}
                        {filesizeError ? (
                          <span className="form-error">{filesizeError}</span>
                        ) : (
                          ""
                        )}
                        {resumeformatError ? (
                          <span className="form-error">
                            {" "}
                            {resumeformatError}
                          </span>
                        ) : (
                          ""
                        )}
                        {filesizeError ||
                          (resumeformatError && (
                            <div className="error-scroll"> </div>
                          ))}
                        <p className="modal-custom-desc">
                          {`Supported Formats: docx, pdf, upto ${resumeSize}`}
                          MB
                        </p>

                        <input
                          type="file"
                          className="site-button form-control"
                          id="customFile"
                          title=""
                          style={{
                            width: "100%",
                            height: "50%",
                          }}
                          onChange={(e) => {
                            CheckFile(e);
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>

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
                      </label>{" "}
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
                  </label>
                  &nbsp;
                  <BsInfoCircle title="File must be in docx, pdf or txt format and should be less than 500 KB" />{" "}
                </div>{" "}
                <ReactQuill
                  id="reactquill"
                  ref={editorRef}
                  value={props.values.jobDesc}
                  style={{ width: "100%", marginTop: "-37px" }}
                  placeholder="Enter your job description with Roles And Responsibilities, Desired Candidate Profile"
                  onChange={(e) => {
                    const addedData =
                      e.toString() === "<p><br></p>" ||
                        e.toString() === "<h3><br></h3>"
                        ? ""
                        : e.toString();
                    const htmlString = convertHtmlToText(e.toString());
                    const event: any = {
                      target: {
                        name: "jobDesc",
                        value: htmlString?.trim() !== "" ? addedData : "",
                      },
                    };

                    if (addedData.length > 5000) {
                      snackAlert(
                        "warning",
                        "Text length must be less than 5000 characters"
                      );
                      setLoaderjd(false);
                      props.handleChange(event);
                    } else {
                      props.handleChange(event);
                    }
                  }}
                />
                {props.errors.jobDesc && props.touched.jobDesc && (
                  <p className="form-error error-scroll ">
                    {props.errors.jobDesc}
                  </p>
                )}
              </div>
            )}{" "}
            {hidereact && (
              <div className="job-bx mb-1">
                {" "}
                <Skeleton animation="wave" height={100} width="100%" />{" "}
              </div>
            )}
            <Modal
              show={importpopup}
              onHide={() => {
                setImportpopup(false);
                handleCancelClick();
                setIsCheckboxCreated(false);
              }}
              className="modal fade modal-bx-info editor "
            >
              <div
                className="modal-dialog my-0 "
                role="document"
                id="modalpopupstyle"
                style={{ width: "770px" }}
              >
                <div className="modal-content">
                  <div className="modal-header" id="headerjds">
                    <h5 className="modal-title" id="titlejds">
                      Suggested Job Descriptions
                    </h5>
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
                        onClick={handleRoleButtonClick}
                        className="col"
                      >
                        {rolesoption[0]?.label != "" &&
                          rolesoption[0]?.label != undefined && (
                            <h6 onClick={toggleCheckboxes}>
                              Roles And Responsibilities
                            </h6>
                          )}
                      </div>
                      <div
                        style={desiredbuttonstyle}
                        onClick={handleDesiredButtonClick}
                        className="col"
                      >
                        {desireCandidateOption[0]?.label != "" &&
                          desireCandidateOption[0]?.label != undefined && (
                            <h6
                              className="desired"
                              onClick={toggleDesiredCandidate}
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
                              <>
                                <label
                                  key={option.value}
                                // style={{ flexBasis: "33%", display: "flex" }}
                                >
                                  <input
                                    style={{
                                      marginRight: "5px",
                                      cursor: "pointer",
                                    }}
                                    type="checkbox"
                                    value={option.value}
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
                              </>
                            ))}
                        </div>
                      )}
                      {showDesiredcan && (
                        <div>
                          {desireCandidateOption[0]?.label != "" &&
                            desireCandidateOption.map((option, val) => (
                              <>
                                <label
                                  key={option.value}
                                // style={{ flexBasis: "33%", display: "flex" }}
                                >
                                  <input
                                    type="checkbox"
                                    style={{
                                      marginRight: "5px",
                                      cursor: "pointer",
                                    }}
                                    value={option.value}
                                    onChange={(e: any) => {
                                      handleDesiredCheckboxChange(e);
                                    }}
                                    checked={desiredcheckboxValues.includes(
                                      option.value
                                    )}
                                  />
                                  <span className="font-weight-normal">
                                    {option.label}
                                  </span>
                                </label>
                              </>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {desireCandidateOption[0]?.label != "" &&
                    rolesoption[0]?.label != "" &&
                    desireCandidateOption[0]?.label != undefined &&
                    rolesoption[0]?.label != undefined && (
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
                    )}{" "}
                </div>{" "}
              </div>
            </Modal>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobDescription;
