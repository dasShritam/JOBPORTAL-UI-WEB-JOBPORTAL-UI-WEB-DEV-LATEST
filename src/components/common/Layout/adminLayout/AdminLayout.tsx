import { Outlet } from "react-router-dom";
import Footeradmin from "./Footer";
// import Footeradmin from "./Footer";
import Header from "./Header";
import Footer from "../Footer";

const AdminLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default AdminLayout;
