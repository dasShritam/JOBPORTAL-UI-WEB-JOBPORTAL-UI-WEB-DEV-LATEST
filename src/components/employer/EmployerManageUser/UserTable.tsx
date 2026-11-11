import { Chip, IconButton, Popover, Switch, Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { BsPersonCircle } from "react-icons/bs";
import { MdNotInterested } from "react-icons/md";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Content,
  GetDisplayDateFromTimeStamp,
  GetTimeFromTimeStamp,
} from "../../../common/common";
import { EnDisUser } from "../../../redux/features/employer/EmployerManageUser/userEnDisManageSlice";
import { RoleType } from "../../../routes/roles";

enum perimissionE {
  MIJ = "MIJ",
  MEJ = "MEJ",
}

const UserTable = (props: any) => {
  const dispatch = useDispatch(),
    [data, setData] = useState<any>(),
    [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null),
    handleClick = (event: any) => {
      setAnchorEl(event.currentTarget);
    },
    handleClose = () => {
      setAnchorEl(null);
    },
    popOverOpen = Boolean(anchorEl),
    id = popOverOpen ? "simple-popover" : undefined,
    handleConfirmSwal = (inputData: any) => {
      Swal.fire({
        title: "Are you sure?",
        text: `Do you want to ${
          data?.isActive ? "disable" : "enable"
        } this user`,
        showCancelButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "red",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result?.isConfirmed) {
          dispatch(
            EnDisUser({
              userIds: [data?.user_id],
              enable: data?.isActive ? false : true,
            })
          );
        }
      });
    };
  useEffect(() => {
    setData(props.row);
  }, [props.row]);
  return (
    <>
      <tr
        key={`1${data?.user_id}1`}
        style={
          RoleType.EMPLOYER_ADMINISTRATOR !== data?.role
            ? {}
            : { backgroundColor: "#e0d8d833" }
        }
      >
        <td className="job-name d-flex ">
          <div
            style={{
              color: "lightgray",
              width: "42px",
            }}
          >
            {data?.pic && (
              <img
                alt=""
                style={{
                  borderRadius: "50%",
                  width: "42px",
                  height: "42px",
                }}
                src={
                  data?.pic
                    ? data?.pic
                    : require("../../../assets/images/av-pic-01.png")
                }
              />
            )}
            {!data?.pic && (
              <BsPersonCircle
                style={{
                  width: "42px",
                  fontSize: "42px",
                  color: "lightgray",
                }}
              />
            )}
          </div>
          <ul className="job-post-info ml-1 ">
            <li
              className="job-name"
              style={{
                fontWeight: "600",
                color: "#333",
                fontSize: "14px",
              }}
              title={data?.name}
            >
              {Content(data?.name, 30)}
            </li>
            <br />
            <li>
              <Link
                style={{
                  color: "#007bff",
                  fontSize: "14px",
                }}
                to={`mailto:${data?.contact?.primary?.mail}`}
                title={data?.contact?.primary?.mail}
              >
                {Content(data?.contact?.primary?.mail, 30)}
              </Link>
            </li>
          </ul>
        </td>
        <td className={"application tabletd table-body-JSR"}>
          <div className={"text tabletd"}>
            {`${data?.contact?.primary?.ph?.code} ${data?.contact?.primary?.ph?.phno}`}
          </div>
        </td>
        <td
          className={"application tabletd table-body-JSR"}
          title={data?.role}
        >
          {data?.role ? Content(data?.role, 15) : "Not Avilable"}
        </td>
        <td className={"application table-body-JSR"}>
          <ul>
            <Link
              to={"#"}
              onClick={handleClick}
              aria-describedby={id}
              style={{ color: "#007bff" }}
            >
              <li
                key={10}
                style={{ color: "#007bff" }}
              >{`${data?.permissions?.length} Permission(s)`}</li>
              <br />
              <li key={20} style={{ color: "#007bff" }}>
                {String(data?.accessibility?.start_date > 0) === "true"
                  ? "Yes"
                  : "No"}
                &nbsp;Restriction
              </li>
            </Link>

            <Popover
              id={id}
              open={popOverOpen}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              style={{
                boxShadow: "0px 1px 1px 0px #dacdcd",
              }}
            >
              <Typography sx={{ p: 2 }}>
                <div>
                  <h6>
                    <i className="fa fa-lock mt-1"></i> Permission
                  </h6>
                  {data?.permissions?.map((e, i) => {
                    if (e === perimissionE.MIJ)
                      return (
                        <Fragment key={i}>
                          <Chip
                            className="mt-1"
                            label="Manage Internal Job Post"
                          />
                          <br />
                        </Fragment>
                      );
                    if (e === perimissionE.MEJ)
                      return (
                        <Fragment key={i}>
                          <Chip
                            className="mt-1"
                            label="Manage External Job Post"
                          />
                          <br />
                        </Fragment>
                      );
                  })}
                  <hr />
                  <h6>
                    <MdNotInterested /> Restriction
                  </h6>
                  <>
                    {data?.accessibility?.start_date ? (
                      <ul style={{ listStyle: "none" }}>
                        <center>
                          <li>
                            {`${GetDisplayDateFromTimeStamp(
                              data?.accessibility?.start_date
                            )} ${GetTimeFromTimeStamp(
                              data?.accessibility?.start_date
                            )}`}
                          </li>
                          <li>{"To"}</li>
                          <li>
                            {`${GetDisplayDateFromTimeStamp(
                              data?.accessibility?.end_date
                            )} ${GetTimeFromTimeStamp(
                              data?.accessibility?.end_date
                            )}`}
                          </li>
                        </center>
                      </ul>
                    ) : (
                      "No Restriction"
                    )}
                  </>
                </div>
              </Typography>
            </Popover>
          </ul>
        </td>
        <td className=" table-body-JSR">
          <div className="d-flex justify-content-between align-items-center">
            <IconButton
              style={
                RoleType.EMPLOYER_ADMINISTRATOR === data?.role
                  ? { cursor: "default" }
                  : { cursor: "pointer" }
              }
              onClick={() => {
                if (RoleType.EMPLOYER_ADMINISTRATOR !== data?.role) {
                  props.setShow(true);
                  props.id(data?.user_id);
                }
              }}
              title={
                RoleType.EMPLOYER_ADMINISTRATOR !== data?.role
                  ? "Edit user details"
                  : "No action allowed"
              }
            >
              <BiEditAlt
                className={
                  RoleType.EMPLOYER_ADMINISTRATOR !== data?.role
                    ? "text-primary"
                    : "tabletd"
                }
              ></BiEditAlt>
            </IconButton>

            <div
              className="ml-2"
              aria-disabled={RoleType.EMPLOYER_ADMINISTRATOR !== data?.role}
            >
              {RoleType.EMPLOYER_ADMINISTRATOR !== data?.role && (
                <Switch
                  title={`${data?.isActive ? "Diasble" : "Enable"} user access`}
                  checked={data?.isActive}
                  style={{ cursor: "pointer" }}
                  onChange={(e) => {
                    handleConfirmSwal(e);
                  }}
                  inputProps={{ "aria-label": "controlled" }}
                />
              )}
              {RoleType.EMPLOYER_ADMINISTRATOR === data?.role && (
                <Switch
                  checked={true}
                  color="default"
                  title="No action allowed"
                  style={{ cursor: "default" }}
                />
              )}
            </div>
          </div>
        </td>
      </tr>
    </>
  );
};

export default UserTable;
