import { Skeleton } from "@mui/material";
import JobdescriptionSkeleton from "./JobDescriptionSkeleton";
import JobRequirementSkeleton from "./JobRequirementSkeleton";
import QuestionsSkeleton from "./questions/QuestionsSkeleton";
import CompanyInfoSkeleton from "./CompanyInfoSkeleton";

function PrivatejobSkeleton() {
  return (
    <div className="page-content">
      <div className="content-block">
        <div className="section-full browse-job content-inner-2">
          <div className="container" style={{ marginTop: "2%" }}>
            <div className="row">
              <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12 m-b30">
                <Skeleton animation="wave" height={30} width="30%" />
              </div>
              <div className={`col-xl-9 col-lg-9 col-md-9 col-sm-12`}>
                <div>
                  <h5>
                    <Skeleton animation="wave" height={30} width="30%" />
                  </h5>
                  <span>
                    <Skeleton animation="wave" height={30} width="30%" />
                  </span>
                </div>
                <br />
                <div>
                  <JobdescriptionSkeleton />
                  <JobRequirementSkeleton />
                  <QuestionsSkeleton />
                  <CompanyInfoSkeleton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivatejobSkeleton;
