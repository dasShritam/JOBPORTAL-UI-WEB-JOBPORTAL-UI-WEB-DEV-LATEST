import { useState } from "react";
import "./assets/css/plugins.css";
import "./assets/css/style.css";
import "./assets/css/templete.css";
import "./assets/css/skin/skin-1.css";
import "./assets/plugins/slick/slick.min.css";
import "./assets/plugins/slick/slick-theme.min.css";
import AppRoutes from "./routes/AppRoutes";
import { AppContext } from "./context/AppContext";
import CustomizedSnackbars from "./components/utils/Toast";
import { WebsocketProvider, socket } from "./context/WebsocketContext";
import Websocket from "./components/utils/Websocket";
function App() {
  const [toaster, setToaster] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [paymentdata, setpaymentdata] = useState(null);
  const [notifySocketData, setNotifySocketData] = useState(null);
  const [notifySocketCount, setNotifySocketCount] = useState(null);

  return (
    <>
      <WebsocketProvider value={socket}>
        <AppContext.Provider
          value={{
            toaster,
            setToaster,
            userInfo,
            setUserInfo,
            paymentdata,
            setpaymentdata,
            notifySocketData,
            setNotifySocketData,
            notifySocketCount,
            setNotifySocketCount,
          }}
        >
          <Websocket>
            <AppRoutes />
          </Websocket>
        </AppContext.Provider>
        {toaster && <CustomizedSnackbars {...{ toaster, setToaster }} />}
      </WebsocketProvider>
    </>
  );
}

export default App;
