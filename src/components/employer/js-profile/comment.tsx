import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createComment,
  deleteComment,
  fetchComment,
  resetcreateComment,
  updateComment,
} from "../../../redux/features/employer/commentslice";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { Tooltip } from "@mui/material";
interface ListItem {
  id: number;
  name: string;
}

interface propsType {
  userId: string;
  jobId: string;
}
const Commentprofile = (props: propsType) => {
  const dispatch = useDispatch();
  const [list, setList] = useState<ListItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingItemName, setEditingItemName] = useState("");
  const [commentsids, setCommentid] = useState("");
  // Create Comments

  const createCommments = useSelector((state: any) => state.createComments);
  const { Comments, loadingS } = createCommments;

  const addcomment = () => {
    const addModel = {
      jobId: props.jobId,
      userId: props.userId,
      comment: newItemName,
    };
    dispatch(createComment(addModel));
  };

  useEffect(() => {
    if (Comments.code === 200) {
      fetchAllComments();
      dispatch(resetcreateComment());
    }
  }, [Comments.code, dispatch]);

  // Fetch Comments
  const fetchAllComments = () => {
    if (props?.jobId && props?.userId) {
      const fetchmodel = {
        jobId: props.jobId,
        userId: props.userId,
      };
      dispatch(fetchComment(fetchmodel));
    }
  };

  useEffect(() => {
    fetchAllComments();
  }, [props.jobId, props.userId]);

  const fetchCommments = useSelector((state: any) => state.fetchComments);
  const { FComments, loadingF } = fetchCommments;

  useEffect(() => {
    setCommentid(FComments?.data?.feedback?._id);
  }, [setCommentid]);

  // Update Comments
  const updateCommments = useSelector((state: any) => state.updateComments);
  const { UComments, loadingU } = updateCommments;

  const CommentUpdation = (cmtId: string, editingItemName: string) => {
    const updateModel = {
      jobId: props.jobId,
      userId: props.userId,
      comment: editingItemName,
      CommentId: cmtId,
    };
    dispatch(updateComment(updateModel));
  };

  useEffect(() => {
    if (UComments.code === 200) {
      fetchAllComments();
    }
  }, [UComments.code]);

  // Delete Comments

  const deleteCommments = useSelector((state: any) => state.deleteComment);
  const { DComments, loadingD } = deleteCommments;

  const deleteComm = (cmtId: string) => {
    const delModel = {
      jobId: props.jobId,
      userId: props.userId,
      CommentId: cmtId,
    };
    dispatch(deleteComment(delModel));
  };

  useEffect(() => {
    if (DComments.code === 200) {
      fetchAllComments();
    }
  }, [DComments.code]);

  //End API call

  const onSubmit: any = async (values: any, actions: any) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    actions.resetForm();
  };

  const [bindEmpData, setBindEmpData] = useState({
    comments: "",
  });

  const FORM_VALIDATION = Yup.object().shape({
    comments: Yup.string()
      .required("Please enter comment.")
      .min(5, "Minimum 5 characters are required.")
      .max(50, "Maximum 50 characters are allowed.")
      .nullable()
      .trim("Empty space not allowed."),
  });

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: bindEmpData,
    enableReinitialize: true,
    validationSchema: FORM_VALIDATION,
    onSubmit,
  });

  const handleAddItem = () => {
    if (newItemName.trim() !== "") {
      const newItem: ListItem = { id: Date.now(), name: newItemName };
      setList([...list, newItem]);
      setNewItemName("");
    }
  };

  const handleEditItem = (id: number, newName: string) => {
    const updatedList = list.map((item) => {
      if (item.id === id) {
        return { ...item, name: newName };
      } else {
        return item;
      }
    });
    setList(updatedList);
    setEditingItemId(null);
    setEditingItemName("");
  };
  const handleDeleteItem = (id: number) => {
    const updatedList = list.filter((item) => item.id !== id);
    setList(updatedList);
  };
  return (
    <div id="Comments_bx" className="job-bx bg-white m-b30">
      <div className="">
        <div>
          <Link to={"#"}>
            <img
              style={{ height: "100%" }}
              alt="Comment"
              src={require("../../../assets/images/banner/js-p-02.png")}
            />
          </Link>
          <span className="m-b15 card-heading cardprop">Comments</span>
        </div>
        <div className="mainline" style={{ marginBottom: "30px" }}></div>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              max={50}
              min={5}
              autoComplete="off"
              name="comments"
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="form-control comsection"
              placeholder="Enter your comment"
              onBlur={handleBlur}
            />
            {/* {!newItemName && <p className="form-error">Please enter comment</p>} */}
            <div className="addbtn">
              <button
                className="site-button border combtn"
                onClick={() => {
                  handleAddItem();
                  addcomment();
                }}
              >
                Comment
              </button>
            </div>
            {FComments?.data?.feedback?.length === 0 ? (
              <></>
            ) : (
              <>
                <div className="headercom">
                  {FComments?.data?.feedback?.length} Comment(s)
                </div>
              </>
            )}
            <div>
              <ul>
                {FComments?.data?.feedback &&
                  FComments?.data?.feedback?.map((item: any) => (
                    <li key={item._id} style={{ listStyle: "none" }}>
                      {editingItemId === item._id ? (
                        <>
                          <div className="Updatediv">
                            <div className="commfiled">
                              <input
                                type="text"
                                value={editingItemName}
                                onChange={(e) =>
                                  setEditingItemName(e.target.value)
                                }
                                className="form-control editControl"
                              />
                            </div>
                            <button
                              title="Save Comment"
                              onClick={() => {
                                CommentUpdation(item._id, editingItemName);
                                handleEditItem(item._id, editingItemName);
                              }}
                              className="site-button border updateBtn"
                            >
                              <i
                                className="fa fa-floppy-o btnicon"
                                aria-hidden="true"
                              ></i>
                            </button>

                            <button
                              title="Cancel"
                              className="site-button border cancelbtn"
                              onClick={() => {
                                setEditingItemId(null);
                                setEditingItemName("");
                              }}
                            >
                              <i
                                className="fa fa-times btnicon"
                                aria-hidden="true"
                              ></i>
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="viewdiv">
                            <div className="savedcomments">
                              <Tooltip placement="top" title={item?.cmt} arrow>
                                <div
                                  className="form-control addcontrol"
                                  data-toggle="tooltip"
                                >
                                  {item?.cmt}
                                </div>
                              </Tooltip>
                            </div>

                            <button
                              title="Edit Comment"
                              onClick={() => {
                                setEditingItemId(item._id);
                                setEditingItemName(item.cmt);
                              }}
                              className="site-button border editbtn"
                            >
                              <i
                                className="fa fa-pencil btnicon "
                                aria-hidden="true"
                              ></i>
                            </button>
                            <button
                              title="Delete Comment"
                              onClick={() => {
                                deleteComm(item._id);
                                handleDeleteItem(item.id);
                              }}
                              className="site-button border deletebtn"
                            >
                              <i
                                className="fa fa-trash btnicon"
                                aria-hidden="true"
                              ></i>
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Commentprofile;
