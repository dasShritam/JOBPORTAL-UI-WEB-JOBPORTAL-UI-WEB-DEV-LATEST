import React from "react";
import { connect, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

function LogoutPage(props: any) {
  const dispatch = useDispatch();
const navigate=useNavigate();
  function onLogout() {
    //dispatch(logout(props.history));
    // window.location.reload();
   
  }
  return (
    <>
      <Link
        to={"#"}
        title="READ MORE"
        className="site-button"
        onClick={onLogout}
      >
        <i className="fa fa-lock"></i> Logout
      </Link>
    </>
  );
}

export default LogoutPage;
