import { Link } from "react-scroll";

function JobPostListingSidebar() {
  return (
    <div className='custom-sticky-top bg-white' style={{ top: "80px" }}>
      <div className='candidate-info onepage'>
        <ul>
          <li>
            <Link
              activeClass='active'
              className='scroll-bar nav-link'
              to='job_desc_bx'
              smooth={true}
              offset={-70}
              duration={500}
            >
              <span>Job Description</span>
            </Link>
          </li>
          <li>
            <Link
              activeClass='active'
              className='scroll-bar nav-link'
              to='job_req_bx'
              smooth={true}
              offset={-70}
              duration={500}
            >
              <span>Job Requirements</span>
            </Link>
          </li>
          <li>
            <Link
              activeClass='active'
              className='scroll-bar nav-link'
              to='questions_bx'
              smooth={true}
              offset={-70}
              duration={500}
            >
              <span>Questions</span>
            </Link>
          </li>
          <li>
            <Link
              activeClass='active'
              className='scroll-bar nav-link'
              to='companyInfo_bx'
              smooth={true}
              offset={-70}
              duration={500}
            >
              <span>Company Info</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
export default JobPostListingSidebar;
