import { Outlet } from "react-router-dom";

import EmpHeader from "./EmpHeader";
import Footer from "../Footer";

const EmpLayout = () => {
  return (
    <>
      <EmpHeader />
      <Outlet />
      <Footer />
    </>
  );
};

export default EmpLayout;
