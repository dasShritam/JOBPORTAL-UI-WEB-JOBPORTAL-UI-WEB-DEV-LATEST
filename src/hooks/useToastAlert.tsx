import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export const UseToastAlert = () => {
  let color: string;
  const { setToaster } = useContext(AppContext);
  const showSnackbar = (
    type: "success" | "error" | "info" | "warning",
    text: string,
    duration: number = type === "error" ? 5000 : 3000
  ) => {
    switch (type) {
      case "success":
        color = "green";
        break;
      case "info":
        color = "orange";
        break;
      case "error":
        color = "red";
        break;
    }

    setToaster({
      type,
      text,
      //You can also give duration- Snackbar.LENGTH_SHORT, Snackbar.LENGTH_LONG
      duration,
      //color of snakbar
      backgroundColor: color,
      // type === 'success' ? ('green') : (type === 'error' ? 'red' : 'blue'),
      //color of text
      textColor: "success" ? "white" : type === "error" ? "white" : "black",
      //action
      // action: {
      //   text: 'Dismiss',
      //   textColor: 'success' ? 'white' : type === 'error' ? 'white' : 'black',
      //   // onPress: () => {
      //   // },
      // },
    });
  };

  return showSnackbar;
};
