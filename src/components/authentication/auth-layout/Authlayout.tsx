import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "../../common/Layout/Footer";

const AuthLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default AuthLayout;
