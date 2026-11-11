import { lazy, useState } from "react";
import { useDispatch } from "react-redux";
import "../../../assets/customCss/Pagination.css";
import "../../../assets/customCss/jobs/manage-jobs.css";
import { getAssessmentData } from "../../../redux/features/jobSeeker/JsAssessmentSlice";
import { AppContext } from "../../../context/AppContext";

const AssessAdminCard = lazy(() => import("./AssessAdminCard"));

type initialState = {
  hideFilterHandler?: any;
};
function AssessAdminListing({ hideFilterHandler }: initialState) {
  const [allAssess, setAllAssess] = useState(true);
  const [draftAssess, setDraftAssess] = useState(false);
  const dispatch = useDispatch();
  // const { filter } = useContext(AppContext);

  const draftDataHandler = () => {
    const AssessListOptions = {
      pageId: 1,
      pageLimit: 10,
      status: "All",
    };
    dispatch(getAssessmentData(AssessListOptions));
  };
  // const allDataHandler = () => {
  //   const AssessListOptions = {
  //     mode: "minimal",
  //     pageid: -1,
  //     title: "",
  //     jobid: "",
  //     status: [],
  //   };
  //   dispatch(fetchAssessmentData(AssessListOptions));
  // };

  return (
    <>
      <div>{allAssess && <AssessAdminCard />}</div>
    </>
  );
}

export default AssessAdminListing;
