import React from "react";
import { Link } from "react-scroll";

function ListingSidebarJs() {
  return (
    <div className="custom-sticky-top bg-white" style={{ top: "80px" }}>
      <div className="candidate-info onepage">
        <ul>
          <li>
            <Link
              activeClass="active"
              className="scroll-bar nav-link"
              to="Candidate_details_bx"
              smooth={true}
              offset={-70}
              duration={500}
            >
              <span>Candidate Details</span>
            </Link>
          </li>
          <li>
            <Link
              activeClass="active"
              className="scroll-bar nav-link"
              to="Work_Experience_bx"
              smooth={true}
              offset={-70}
              duration={500}
            >
              <span>Work Experience</span>
            </Link>
          </li>
          <li>
            <Link
              activeClass="active"
              className="scroll-bar nav-link"
              to="Education_bx"
              smooth={true}
              offset={-70}
              duration={500}
            >
              <span>Education</span>
            </Link>
          </li>
          <li>
            <Link
              activeClass="active"
              className="scroll-bar nav-link"
              to="It_Skills_bx"
              smooth={true}
              offset={-70}
              duration={500}
            >
              <span>IT Skills</span>
            </Link>
          </li>
          <li>
            <Link
              activeClass="active"
              className="scroll-bar nav-link"
              to="Projects_bx"
              smooth={true}
              offset={-70}
              duration={500}
            >
              <span>Projects</span>
            </Link>
          </li>
          <li>
            <Link
              activeClass="active"
              className="scroll-bar nav-link"
              to="Other_Details_bx"
              smooth={true}
              offset={-70}
              duration={500}
            >
              <span>Other Details</span>
            </Link>
          </li>
          <li>
            <Link
              activeClass="active"
              className="scroll-bar nav-link"
              to="Attached_Resume_bx"
              smooth={true}
              offset={-70}
              duration={500}
            >
              <span>Attached Resume</span>
            </Link>
          </li>
          <li>
            <Link
              activeClass="active"
              className="scroll-bar nav-link"
              to="Profile_video_bx"
              smooth={true}
              offset={-70}
              duration={500}
            >
              <span>Profile Video</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
export default ListingSidebarJs;
