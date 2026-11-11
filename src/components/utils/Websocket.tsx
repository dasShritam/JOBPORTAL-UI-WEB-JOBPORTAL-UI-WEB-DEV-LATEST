import { useContext, useEffect, useState } from "react";
import { convertformatTimestamp } from "../../common/common";
import { AppContext } from "../../context/AppContext";
import { WebsocketContext } from "../../context/WebsocketContext";
import { UI_ROUTES, getUI_ROUTES } from "../../shared/ui-route.shared";

export interface NotificationPayload {
  title: string;
  content: string;
  sender: string;
  recipient: string[];
  role: string[];
  created_at: number;
}

export enum ManageJobEvents {
  FOLLOWING = "following" /*On jobseeker follow*/,
  JOB_APPLICATION_STATUS = "job-application-status" /*On change in job application status*/,
  JOB_POST = "job-post" /*On new job post*/,
  SUPPORT_REQUEST = "support-request" /*On new support request*/,
}

const Websocket: any = ({ children }): any => {
  const socket = useContext(WebsocketContext);
  const { notifySocketData, setNotifySocketCount } = useContext(AppContext),
    [socketData, setSocketData] = useState<any[]>([]);
  useEffect(() => {
    if (!socket) {
      return; // Skip if socket is null
    }

    socket.on("connect", () => {
      console.log("connected!");
    });

    socket.on("disconnect", (reason) => {
      if (reason === "io server disconnect") {
        socket.connect();
      }
    });
    socket.on("error", (error) => {
      console.log(`An error occured while connecting to websocket :: ${error}`);
    });

    socket.on(ManageJobEvents.FOLLOWING, (data) => {
      // Update the data in your component state
      setSocketData([data]);
      setNotifySocketCount({ data: data });
    });
    socket.on(ManageJobEvents.JOB_APPLICATION_STATUS, (data) => {
      // Update the data in your component state
      setSocketData([data]);
      setNotifySocketCount({ data: data });
    });
    socket.on(ManageJobEvents.JOB_POST, (data) => {
      // Update the data in your component state
      setSocketData([data]);
      setNotifySocketCount({ data: data });
    });
    socket.on(ManageJobEvents.SUPPORT_REQUEST, (data) => {
      // Update the data in your component state
      setSocketData([data]);
      setNotifySocketCount({ data: data });
    });

    return () => {
      if (!socket) {
        return; // Skip if socket is null
      }
      socket.off("connect");
      socket.off("onMessage");
      socket.emit("leaveRoom", "roomId");
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    if (socketData?.length) {
      let temp: any[] = [];
      socketData?.map((e) => {
        let url: string = "";
        if (e?.content?.userId)
          url = `${getUI_ROUTES(e?.content?.code)}/${e?.content?.userId}`;
        else if (e?.content?.jobid) {
          url = `${getUI_ROUTES(e?.content?.code)}/${e?.content?.jobid}`;
          if (e?.content?.code === "R025") {
            sessionStorage.setItem("goBack", UI_ROUTES.R024);
          }
        } else if (e?.content?.jobid)
          url = `${getUI_ROUTES(e?.content?.code)}/${e?.content?.jobid}`;
        else url = getUI_ROUTES(e?.content?.code);
        notifySocketData?.unshift({
          id: e?.id,
          title: e?.title,
          content: e?.content?.msg,
          date: convertformatTimestamp(e?.created_at),
          url: url,
          read: false,
        });
      });
      setSocketData([]);
      temp = [];
    }
  }, [socketData]);

  useEffect(() => {}, [notifySocketData]);

  return <>{children}</>;
};

export default Websocket;
