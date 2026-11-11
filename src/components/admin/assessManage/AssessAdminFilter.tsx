import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Accordion } from "react-bootstrap";
import { TbClearAll } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import Select from "react-select";
import { customStyles } from "../../../common/common";
import {
  filterAssessmentData,
  getAssessmentData,
  resetAssessmentData,
} from "../../../redux/features/jobSeeker/JsAssessmentSlice";
import { Formik, useFormik } from "formik";
import "../../../assets/customCss/assessment.css";
import { UseToastAlert } from "../../../hooks/useToastAlert";
// import { AppContext } from "../../../context/AppContext";

interface selectType {
  label: string;
  value: string;
}
const emptySelect: selectType = {
  label: "",
  value: "",
};

type Option = {
  label: string;
  value: string;
  children?: Option[];
  type: string;
  id: string;
  isCourse: boolean;
};

function AssessAdminFilter(props: any) {
  const dispatch = useDispatch();
  const [disSearch, setDisSearch] = useState(false);
  const [frontEnd, setFrontEnd] = useState(false);
  const [assessData, setAssessmentDetails] = useState<any>(null);
  const [categoryState, setCategoryState] = useState<any>();
  const [skillstate, setSkillstate] = useState<any>();
  const [skillsInfo, setSkillsInfo] = useState<any>(" ");
  const [categoryInfo, setCategoryInfo] = useState<any>(" ");
  const [categoryInp, setCategoryInp] = useState<any>(null);
  // const { setFilter } = useContext(AppContext);

  // START Fiter Data API

  const [bindEmpData, setBindEmpData] = useState({
    Category: "",
    Skills: "",
  });

  const SerachSchema = Yup.object().shape({
    Category: Yup.string()
      // .required("Please enter email address.")
      .nullable()
      .notRequired()

      .trim("Empty space not allowed"),
    skills: Yup.string()
      .trim("Empty space not allowed.")
      .nullable()
      .notRequired(),
  });

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: bindEmpData,
    onSubmit: (values: any) => {
      filtermethod();
    },
    validationSchema: SerachSchema,
    enableReinitialize: true,
  });
  // Context
  // setFilter(values.Category);

  const FilteredAssessRes = useSelector((state: any) => state.FilteredAssess);
  const { matchFilter, matchloading } = FilteredAssessRes;

  const showSnackAlert = UseToastAlert();
  const filtermethod = () => {};

  const resetHandler = (e: any) => {
    e.preventDefault();
    const AssessListOptions = {
      pageId: 1,
      pageLimit: 10,
      status: "ALL",
    };
    dispatch(getAssessmentData(AssessListOptions));
    values.Skills = "";
    setCategoryInp(null);
  };

  useEffect(() => {
    const JobListOptions = {
      mode: "minimal",
      pageid: 1,
      category: [],
      skills: [],
    };
    dispatch(filterAssessmentData(JobListOptions));
  }, []);

  const searchHandler = () => {
    // let category: any = values?.Category[0];
    let skills: any = values?.Skills;

    const fetchInfo = {
      pageId: 1,
      pageLimit: 10,
      status: "ALL",
      category: categoryInp?.label,
      skill: skills
        ? skills?.map((s) => {
            return s?.label;
          })
        : [],
    };
    dispatch(getAssessmentData(fetchInfo));
    props.handleFilteredDataFn(fetchInfo);
  };

  useEffect(() => {
    if (!matchloading && matchFilter?.data) {
      setSkillsInfo(matchFilter?.data?.skills);
    }
  }, [matchFilter, matchloading]);

  useEffect(() => {
    if (!matchloading && matchFilter?.data) {
      setCategoryInfo(matchFilter?.data?.categories);
    }
  }, [categoryInfo, matchFilter?.data, matchloading]);

  // END Fiter Data API

  // START Get Assessment Data API

  const AssessmentDetails = useSelector((state: any) => state.AssessmentData);
  const { jsAssRes, jsloading } = AssessmentDetails;

  useEffect(() => {
    if (!jsloading && jsAssRes && jsAssRes?.code === 200) {
      setAssessmentDetails(jsAssRes.data);
    }

    const AssessListOptions = {
      pageId: 1,
      pageLimit: 10,
      status: "ALL",
    };
    dispatch(getAssessmentData(AssessListOptions));
  }, [assessData, dispatch]);

  // skills
  const SkillFilterdata = (data: any) => {
    const options: any = [];
    data?.map((d: any) => {
      options.push({ label: d, value: d });
    });
    setSkillstate(options);
  };

  // Category

  const categoryFilterdata = (data: any) => {
    const options: any = [];
    data?.map((d: any) => {
      options.push({ label: d.category, value: d.category });
    });
    setCategoryState(options);
  };

  useEffect(() => {
    categoryFilterdata(matchFilter?.data?.categories);
    SkillFilterdata(matchFilter?.data?.skills);
  }, [categoryInfo, matchFilter]);

  // END Fiter Data API

  const disSearchBar = () => {
    frontEnd ? setDisSearch(true) : setDisSearch(false);
  };

  useEffect(() => {
    disSearchBar();
  }, [frontEnd]);

  useEffect(() => {
    if (
      jsAssRes?.response &&
      jsAssRes?.response?.data &&
      jsAssRes?.response?.data?.code !== 200
    ) {
      showSnackAlert("warning", jsAssRes?.response?.data?.message);
      dispatch(resetAssessmentData());
    }
  }, [jsAssRes, jsAssRes?.code]);

  return (
    <aside id="accordion1" className="sidebar-filter bg-white">
      <Accordion defaultActiveKey="0">
        <h6 className="title">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <i
                className="fa fa-filter"
                aria-hidden="true"
                style={{ color: "orange" }}
              ></i>{" "}
              Filters{" "}
            </div>
            <div>
              <Link
                to={"#"}
                onClick={(e: any) => {
                  resetHandler(e);
                }}
                className="font-12 float-right"
              >
                <TbClearAll /> Reset
              </Link>{" "}
            </div>
          </div>
        </h6>
        <Accordion.Collapse eventKey="0">
          <div id="companies" className="acod-body collapse show">
            <div className="acod-content">
              <div>
                {/* Category */}
                <label className="filterlable">Category</label>
                <Select
                  name="Category"
                  className="dropstyle mt-2 mb-2"
                  placeholder="Search by Category"
                  styles={customStyles}
                  isClearable={true}
                  options={categoryState}
                  value={categoryInp}
                  onChange={(e: any) => {
                    let event = {
                      target: {
                        name: "Category",
                        value: e,
                      },
                    };
                    setCategoryInp(event.target.value);
                  }}
                />
                {errors.Category && touched.Category && (
                  <span>
                    <p className="form-error">{errors.Category}</p>
                  </span>
                )}
                {/* Skills */}
                <label className="filterlable">Skills</label>
                <Select
                  placeholder="Search by Skills"
                  isClearable={false}
                  className="dropstyle mt-2 mb-2"
                  styles={customStyles}
                  name="Skills"
                  isMulti
                  value={values.Skills}
                  onChange={(e: any) => {
                    let event = {
                      target: {
                        name: "Skills",
                        value: e,
                      },
                    };
                    handleChange(event);
                  }}
                  options={skillstate}
                />
                {errors.Skills && touched.Skills && (
                  <span>
                    <p className="form-error">{props.Skills}</p>
                  </span>
                )}
              </div>
            </div>
            <div className="acod-content">
              <button
                type="submit"
                className="site-button btn-block"
                onClick={searchHandler}
                style={{ zIndex: "0" }}
              >
                Search
              </button>
            </div>
          </div>
        </Accordion.Collapse>
      </Accordion>
    </aside>
  );
}

export default AssessAdminFilter;
