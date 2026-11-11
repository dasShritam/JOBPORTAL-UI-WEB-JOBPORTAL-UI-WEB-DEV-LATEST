import React from "react";

export const AppContext = React.createContext<{
  toaster: any;
  userInfo: any;
  paymentdata: any;
  notifySocketData: any;
  notifySocketCount: any;

  setToaster: React.Dispatch<React.SetStateAction<any>>;
  setUserInfo: React.Dispatch<React.SetStateAction<any>>;
  setpaymentdata: React.Dispatch<React.SetStateAction<any>>;
  setNotifySocketData: React.Dispatch<React.SetStateAction<any>>;
  setNotifySocketCount: React.Dispatch<React.SetStateAction<any>>;
}>({
  toaster: false,
  userInfo: {},
  paymentdata: {},
  notifySocketData: [],
  notifySocketCount: {},

  setToaster: () => {},
  setUserInfo: () => {},
  setpaymentdata: () => {},
  setNotifySocketData: () => {},
  setNotifySocketCount: () => {},
});
