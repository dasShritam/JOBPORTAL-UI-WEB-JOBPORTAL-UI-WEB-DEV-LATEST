import { Chip, Stack } from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { convertHtmlToText } from "../../common/common";
import { regex } from "../../common/validation";
import { sendEmailToRecruiter } from "../../redux/features/employer/recruitmentMailslice";

interface propsType {
  formik: any;
  showModal: boolean;
  toggleModal: any;
  headerName: string;
  jobid: string;
  sendto?: string;
}

const EmailModel = (props: propsType) => {
  const dispatch = useDispatch();

  const editorRef = useRef<ReactQuill>(null);
  const SendMail = useSelector((state: any) => state.emailSend);
  const { Emails } = SendMail;
  const [textareaValue] = useState("");
  const [output, setOutput] = useState("");
  const [chip, setChip] = useState([""]);
  const [emailto, setEmailto] = useState<any>();
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    if (props.headerName === "Send Email") {
      setEmailto([values.Email_to_Box1]);
    } else if (props.headerName === "Forward Email") {
      setEmailto(chip);
    }
  }, [props]);

  const SendMails = () => {
    setLoader(true);
    const emailmodel = {
      to: emailto,
      sub: values.Email_sub,
      body: convertHtmlToText(output),
    };
    if (props?.jobid) emailmodel["jobid"] = props?.jobid;
    dispatch(sendEmailToRecruiter(emailmodel));
  };

  useEffect(() => {
    props?.sendto &&
      setBindEmpData({
        ...bindEmpData,
        Email_to_Box1: props?.sendto,
      });
  }, [props?.sendto]);

  useEffect(() => {
    if (Emails.code === 200) {
      setLoader(false);
      props.toggleModal();
      clearFunc();
    }

    if (Emails.code === 400) {
      setLoader(false);
    }
  }, [Emails.code]);

  const EmployeeProfilesSchema = Yup.object().shape({
    Email_to: Yup.string()
      // .required("Please enter email address.")
      .nullable()
      .notRequired()
      .matches(regex.email, "Please specify valid email address")
      .trim("Empty space not allowed"),
    Email_sub: Yup.string()
      .trim("Empty space not allowed.")
      .min(1, "Please enter the correct subject.")
      .required("Please enter subject."),
    Email_body: Yup.string()
      .trim("Empty space not allowed.")
      .min(1, "Please enter the correct Body .")
      .required("Please enter Body."),
    Email_to_Box1: Yup.string().notRequired(),
  });
  const [bindEmpData, setBindEmpData] = useState({
    Email_to_Box1: props?.sendto ? props?.sendto : "",
    Email_to: "",
    Email_sub: "",
    Email_body: "",
  });
  // const onSubmit: any = async (values: any, actions: any) => {
  //   await new Promise((resolve) => setTimeout(resolve, 1000));
  //   actions.resetForm();
  // };
  const clearFunc = () => {
    values.Email_to = "";
    values.Email_sub = "";
    values.Email_body = "";
    setOutput("");
    // errors.Email_to = "";
    // errors.Email_sub = "";
    // errors.Email_body = "";
    // errors.Email_to_Box1 = "";
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: bindEmpData,
    validationSchema: EmployeeProfilesSchema,
    enableReinitialize: true,
    onSubmit: (values: any) => {
      SendMails();
    },
  });

  const onclickChip = () => {
    const chipval = values.Email_to.split(",");
    setChip(chipval);
  };

  const handleDelete = () => {
    console.info("You clicked the delete icon.");
  };

  useEffect(() => {
    setOutput(` ${textareaValue}`);
  }, [textareaValue]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
    "video",
  ];

  return (
    <Modal
      show={props.showModal}
      backdrop="static"
      className="modal browse-job fade modal-bx-info editor emailmod"
    >
      <div className=".modal-dialog emaildd" role="document">
        <div className="modal-content email-content">
          <div className="modal-body">
            <div className="modal-custom-header">
              <h5 className="modal-title emailhead">{props.headerName}</h5>
              <button
                type="button"
                className="close"
                onClick={() => {
                  props.toggleModal();
                  clearFunc();
                }}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label
                      className="emaillabel"
                      style={{
                        color: "#979795",
                        fontSize: "13px",
                      }}
                    >
                      Send To:
                    </label>

                    {props.headerName === "Send Email" ? (
                      // <input
                      //   maxLength={100}
                      //   type="text"
                      //   name="Email_to_Box1"
                      //   className="emailInput"
                      //   onChange={handleChange}
                      //   onBlur={handleBlur}
                      //   value={values.Email_to_Box1}
                      // />
                      <span
                        // name="Email_to_Box1"
                        className="emailInput"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        {values.Email_to_Box1}
                      </span>
                    ) : (
                      <>
                        <input
                          maxLength={100}
                          type="text"
                          name="Email_to"
                          className="emailInput"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.Email_to}
                          onKeyUp={onclickChip}
                        />
                        <div>
                          {chip.map((keys) => {
                            return (
                              <Stack direction="row" spacing={1}>
                                <Chip label={keys} onDelete={handleDelete} />
                              </Stack>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <hr className="new1" />

                <div className="col-lg-12 col-md-12">
                  <div className="form-group">
                    <label
                      className="emaillabel"
                      style={{
                        color: "#979795",
                        fontSize: "13px",
                      }}
                    >
                      Subject:
                    </label>
                    <input
                      maxLength={100}
                      type="text"
                      name="Email_sub"
                      className="emailInput"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.Email_sub}
                    />
                    {errors.Email_sub && touched.Email_sub && (
                      <p
                        className="form-error"
                        style={
                          errors.Email_sub
                            ? {
                              marginTop: "-35px",
                              marginLeft: "50px",
                              marginBottom: "40px",
                            }
                            : {}
                        }
                      >
                        {errors.Email_sub}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </form>
            <ReactQuill
              id="reactquill"
              ref={editorRef}
              value={output}
              modules={modules}
              formats={formats}
              onChange={(e: any) => {
                setOutput(e);
                setFieldValue("Email_body", e);
              }}
            />
            <div className="mainline"></div>
            {errors.Email_body && touched.Email_body && (
              <p className="form-error">{errors.Email_body}</p>
            )}

            <div id="" className=" m-b30 modelbtnss" style={{ float: "right" }}>
              <button
                className="site-button border emailBtb"
                type="submit"
                onClick={() => {
                  handleSubmit();
                }}
                disabled={loader}
              >
                {loader && (
                  <i
                    className="fa fa-circle-o-notch fa-spin"
                    style={{ marginRight: "10px" }}
                  ></i>
                )}
                {loader ? "Sending" : "Send Email"}
              </button>
              <button
                aria-hidden="true"
                className="site-button border emailBtb"
                style={{ backgroundColor: "#a9a7a7" }}
                onClick={() => {
                  props.toggleModal();
                  clearFunc();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EmailModel;
