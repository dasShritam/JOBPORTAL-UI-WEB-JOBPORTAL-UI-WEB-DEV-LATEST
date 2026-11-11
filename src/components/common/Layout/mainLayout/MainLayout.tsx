import { Outlet } from "react-router-dom";
// import Footer from "../adminLayout/Footer";
import Footer from "../Footer";
import JsHeader from "../JsHeader";

const MainLayout = () => {
  return (
    <>
      <JsHeader />
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;
