import jwtDecode from "jwt-decode";
import { Link } from "react-router-dom";
import { RoleGroup, RoleType } from "../../routes/roles";

var bnr = require("../../assets/images/banner/bnr1.jpg");

function ErrorPage403() {
  const token = sessionStorage?.getItem("access_token")
      ? sessionStorage?.getItem("access_token")!
      : "",
    decodedToken: any = jwtDecode(token),
    role = decodedToken?.roles[0];
  let page;
  switch (role) {
    case RoleType.EMPLOYER_ADMINISTRATOR:
      page = "/empDashboard";
      break;
    case RoleType.RECRUITER:
      page = "/empDashboard";
      break;
    case RoleType.SUPER_ADMINISTRATOR:
      page = "/adminDashboard";
      break;
    case RoleType.ADMINISTRATOR:
      page = "/adminDashboard";
      break;
    case RoleType.JOBSEEKER:
      page = "/jobseekerDashboard";
      break;
    default:
      page = "/home";
      break;
  }
  return (
    <div className="page-wraper">
      <div className="page-content">
        <div
          className="dez-bnr-inr overlay-black-middle"
          style={{ backgroundImage: "url(" + bnr + ")" }}
        >
          <div className="container">
            <div className="dez-bnr-inr-entry">
              <h1 className="text-white">Error 403</h1>
              <div className="breadcrumb-row">
                <ul className="list-inline">
                  <li>
                    <Link to={page ? page : "/home"}>Home</Link>
                  </li>
                  <li>Error 403</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="section-full content-inner-3 bg-white ErrorPages">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12 error-page text-center">
                <h2
                  className="dz_error text-secondry"
                  style={{ marginBottom: "17px" }}
                >
                  403
                </h2>
                <h4 className="text-primary">Forbidden!!</h4>
                <p className="" style={{ fontFamily: "cursive" }}>
                  You do not have permission to access requested page.
                </p>
                <Link to={page ? page : "/home"} className="site-button">
                  {page !== "/home" ? "Back to Dashboard" : "Back to Home"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ErrorPage403;
