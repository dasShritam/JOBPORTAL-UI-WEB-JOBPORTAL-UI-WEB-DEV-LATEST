import { Box, SwipeableDrawer } from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../../assets/customCss/notification.css";
import { Content } from "../../common/common";
import { AppContext } from "../../context/AppContext";
import { UseToastAlert } from "../../hooks/useToastAlert";
import {
  getNotifications,
  viewNotification,
  viewNotifyReset,
} from "../../redux/features/notification/NotificationSlice";
import { UI_ROUTES } from "../../shared/ui-route.shared";
import Swal from "sweetalert2";
import { ADMIN_PERMISSIONS, RoleType } from "../../routes/roles";
const noNotification = require("../../assets/images/NoNotificationIMG.png");

type Anchor = "top" | "left" | "bottom" | "right";
const pgLimit = 25;

const Notifications = ({ pageOpen }) => {
  const ref = useRef<HTMLDivElement>(null),
    { userInfo, notifySocketData } = useContext(AppContext),
    dispatch = useDispatch(),
    showSnackAlert = UseToastAlert(),
    [pgCount, setPgCount] = useState<number>(1),
    [ncount, setNCount] = useState<number>(0),
    [state, setState] = useState({
      top: false,
      left: false,
      bottom: false,
      right: false,
    }),
    [backClose, setBackClose] = useState(true),
    { viewNotify, loadNv } = useSelector((state: any) => state.viewNotify),
    { getNotify, loadNg } = useSelector((state: any) => state.getNotify),
    toggleDrawer =
      (anchor: Anchor, open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event &&
          event.type === "keydown" &&
          ((event as React.KeyboardEvent).key === "Tab" ||
            (event as React.KeyboardEvent).key === "Shift")
        ) {
          return;
        }
        setState({ ...state, [anchor]: open });
      },
    handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = ref.current || {};
      if (
        scrollTop &&
        clientHeight &&
        scrollHeight &&
        scrollTop + clientHeight >= scrollHeight - 5
      ) {
        if (
          getNotify?.data?.notifications?.length === pgLimit &&
          !loadNg &&
          !loadNv
        ) {
          dispatch(
            getNotifications({
              action: "next",
              pageId: pgCount + 1,
              pageLimit: pgLimit,
            })
          );
          setPgCount(1 + pgCount);
        }
      }
    },
    handleConfirmSwal = (values: any) => {
      Swal.fire({
        title: `<h4 style="color:red;">Permission Denied</h4>`,
        text: `Oops..! looks like you do not have permission to access this feature (${values}), please contact your Super Administrator.`,
        showCancelButton: false,
        confirmButtonColor: "red",
        confirmButtonText: "OK",
      }).then((result) => {});
    },
    notificationLayout = (anchor: Anchor) => (
      <>
        <Box
          sx={{ width: "350px" }}
          role="presentation"
          onClick={toggleDrawer(anchor, false)}
          onKeyDown={toggleDrawer(anchor, false)}
        >
          <div>
            <div
              className="d-flex justify-content-between align-items-baseline w-100"
              style={{ background: "white" }}
            >
              <div className="d-flex justify-content-between align-items-baseline  w-100">
                <h6 className="pl-2">Notifications</h6>
                {ncount !== 0 && (
                  <button
                    type="button"
                    className="btn-sm border-0 bg-transparent"
                    style={{
                      marginTop: "-24px",
                      boxShadow: "none",
                      fontSize: "13px",
                      fontStyle: "italic",
                      cursor: "pointer",
                    }}
                    onClick={(e: any) => {
                      e?.preventDefault();
                      markRead();
                    }}
                  >
                    Mark All As Read
                  </button>
                )}
              </div>
              <button
                type="button"
                className="close p-2 mr-2 mt-1"
                onClick={() => {
                  pageOpen(toggleDrawer("right", true), backClose);
                }}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div
              style={{ overflowY: "auto", maxHeight: "100vh" }}
              onScroll={handleScroll}
              ref={ref}
            >
              {notifySocketData?.length !== 0 &&
                notifySocketData?.map((e: any, i: any) => {
                  return message(e, i);
                })}
              {notifySocketData?.length === 0 && (
                <center className="mt-4">
                  <img src={noNotification} alt="" />
                  <br />
                  <div className="container">
                    <h6 className="mt-2">No Notifications Yet!</h6>
                    <span style={{ fontSize: "13px" }}>
                      You have no notifiactions right now. Come back later.
                    </span>
                  </div>
                </center>
              )}
            </div>
          </div>
        </Box>
      </>
    ),
    message = (tileData: any, no: number) => (
      <>
        <div key={no}>
          <Link
            to={
              tileData?.url === UI_ROUTES.R029
                ? userInfo?.permission?.includes(ADMIN_PERMISSIONS?.CSM) &&
                  tileData?.url
                : tileData?.url
            }
            style={{
              textDecoration: "none",
              color: "black",
            }}
            onClick={() => {
              RoleType.ADMINISTRATOR.includes(userInfo.roles[0]) &&
                !userInfo?.permission?.includes(ADMIN_PERMISSIONS?.CSM) &&
                handleConfirmSwal("Customer Support Tickets");
              if (
                tileData?.url === UI_ROUTES.R029 &&
                RoleType.ADMINISTRATOR.includes(userInfo.roles[0])
              ) {
                if (
                  RoleType.ADMINISTRATOR.includes(userInfo.roles[0]) &&
                  userInfo?.permission?.includes(ADMIN_PERMISSIONS?.CSM)
                ) {
                  !tileData?.read &&
                    dispatch(
                      viewNotification({
                        notificationId: [tileData?.id],
                        action: "READ",
                      })
                    );
                }
              } else {
                !tileData?.read &&
                  dispatch(
                    viewNotification({
                      notificationId: [tileData?.id],
                      action: "READ",
                    })
                  );
              }
            }}
          >
            <div className="notiDiv">
              <div
                className={
                  tileData?.read ? "notiDivChild" : "notiDivChild active"
                }
              >
                <span title={tileData?.content} style={{ fontSize: "13px" }}>
                  {Content(tileData?.content, 70)}
                </span>
                <div>
                  <span className="notiTime" style={{ fontSize: "12px" }}>
                    {tileData?.date}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </>
    ),
    markRead = () => {
      RoleType.ADMINISTRATOR.includes(userInfo.roles[0]) &&
        !userInfo?.permission?.includes(ADMIN_PERMISSIONS?.CSM) &&
        handleConfirmSwal("Customer Support Tickets");
      if (RoleType.ADMINISTRATOR.includes(userInfo.roles[0])) {
        if (userInfo?.permission?.includes(ADMIN_PERMISSIONS?.CSM)) {
          dispatch(
            viewNotification({
              notificationId: [],
              action: "READ",
            })
          );
        }
      } else {
        dispatch(
          viewNotification({
            notificationId: [],
            action: "READ",
          })
        );
      }
    };

  useEffect(() => {
    pageOpen(toggleDrawer("right", true), backClose);
  }, [backClose]);
  useEffect(() => {
    if (viewNotify && viewNotify?.code && viewNotify?.code === 200) {
      dispatch(
        getNotifications({
          action: "load",
          pageId: 1,
          pageLimit: pgLimit,
        })
      );
      dispatch(viewNotifyReset());
    } else if (
      !loadNv &&
      viewNotify &&
      viewNotify?.code &&
      viewNotify?.code !== 200
    ) {
      showSnackAlert("warning", viewNotify?.message);
      dispatch(viewNotifyReset());
    }
  }, [viewNotify]);
  useEffect(() => {
    if (!loadNg && getNotify && getNotify?.code && getNotify?.code === 200) {
      if (getNotify?.data?.count || getNotify?.data?.count === 0) {
        setNCount(getNotify?.data?.count);
      }
    }
    if (
      notifySocketData?.filter((e) => {
        return e?.read === false;
      })?.length
    ) {
      setNCount(1 + ncount);
    }
  }, [getNotify, notifySocketData]);
  useEffect(() => {
    const temp = notifySocketData?.map((e) => e?.url?.includes(UI_ROUTES.R025));
    if (temp?.length) sessionStorage.setItem("goBack", UI_ROUTES.R024);
  }, []);

  return (
    <>
      <style>
        {`
        .flex-container {
            display: flex;
        }
        
        .flex-child {
            flex: 1;
            margin-top:"10px"
        }  
        
        .flex-child:first-child {
            margin-right: -92px;
            margin-top: "-15px"
        } 
        .flex-child magenta {
            width: "150px"
        }
        .css-1160xiw-MuiPaper-root-MuiDrawer-paper{
            color:"#e3dcdc"
        }
        .MuiBox-root css-1ivgbss{

        }
        `}
      </style>
      <div
        onClick={() => {
          setBackClose(false);
        }}
      >
        {(["right"] as const)?.map((anchor) => (
          <React.Fragment key={"right"}>
            <SwipeableDrawer
              anchor={"right"}
              open={state["right"]}
              onClose={() => {
                toggleDrawer("right", false);
                setBackClose(false);
              }}
              style={{}}
              onOpen={toggleDrawer("right", true)}
            >
              {notificationLayout("right")}
            </SwipeableDrawer>
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default Notifications;
