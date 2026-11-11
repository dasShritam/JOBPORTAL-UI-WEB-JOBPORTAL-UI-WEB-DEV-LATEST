import React from "react";
import { Link } from "react-scroll";

function ListingEmpProfileBar() {
  return (
    <div className="sticky-top bg-white custom_sticky-top">
      <div className="candidate-info onepage">
        <ul>
          <li>
            <Link
              activeClass="active"
              className="scroll-bar nav-link"
              to="Company_Details_bx"
              smooth={true}
              offset={-70}
              duration={500}
            >
              {/* <span>Company Profile</span> */}
            </Link>
          </li>
          {/* <li>
            <Link
              activeClass="active"
              className="scroll-bar nav-link"
              to="Account_Details_bx"
              smooth={true}
              offset={-70}
              duration={500}
            >
              <span>Account Details</span>
            </Link>
          </li> */}
          {/* <li>
            <Link
              activeClass="active"
              className="scroll-bar nav-link"
              to="KYC_Compliance_Details_bx"
              smooth={true}
              offset={-70}
              duration={500}
            >
              <span>KYC Compliance Details</span>
            </Link>
          </li> */}
        </ul>
      </div>
    </div>
  );
}
export default ListingEmpProfileBar;
