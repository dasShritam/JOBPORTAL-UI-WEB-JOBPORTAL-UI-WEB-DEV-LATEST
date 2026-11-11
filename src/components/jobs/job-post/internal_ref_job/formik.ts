import * as Yup from "yup";

export interface optionType {
  label: string;
  value: string;
}

export interface choiceType {
  id: number;
  choice: string;
  isPrefered: boolean;
  error: string;
}

export enum salaryEnum {
  MIN = 100000,
  MAX = 500000,
}

export enum workExpEnum {
  MIN = 0,
  MAX = 1,
}

export interface privateJobType {
  id: string | null;
  designation: optionType | null;
  jobType: "INTERNAL JOB" | "REFERRAL JOB";
  jobDesc: string;
  keySkills: optionType[] | null;
  workExp: number[] | null;
  salary: number[] | null;
  currency: string;
  isSalaryHidden: boolean;
  variablePercent: number | null;
  salaryOutput: string;
  location: string[];
  department: optionType | null;
  role: optionType | null;
  roleCategory: optionType | null;
  referenceCode: string;
  vacancy: "";
  eduQualification: object | null;
  startDate: string;
  endDate: string;
  showRecruiterDetails: boolean;
  hiringManager: string | null;
  shareWith: string[];
  jdFile: File | null;
  isBonus: boolean;
  bonus: string | null;
  bonusCondition: string;
  jdFileUrl: string;
  jdName: string;
}

export const initialValues: privateJobType = {
  id: null,
  designation: null,
  jobType: "INTERNAL JOB",
  jobDesc: "",
  keySkills: null,
  workExp: [workExpEnum.MIN, workExpEnum.MAX],
  salary: [salaryEnum.MIN, salaryEnum.MAX],
  currency: "INR",
  salaryOutput: "",
  isSalaryHidden: false,
  variablePercent: null,
  location: [],
  department: null,
  role: null,
  roleCategory: null,
  referenceCode: "",
  vacancy: "",
  eduQualification: null,
  startDate: "",
  endDate: "",
  showRecruiterDetails: false,
  hiringManager: null,
  shareWith: [],
  jdFile: null,
  isBonus: false,
  bonus: null,
  bonusCondition: "",
  jdFileUrl: "",
  jdName: "",
};

export const validateSchema = Yup.object().shape({
  designation: Yup.object()
    .nullable()
    .required("Please enter Job title / Designation."),
  jobDesc: Yup.string().nullable().required("Please enter Job Description."),
  keySkills: Yup.array()
    .required("Please enter some key Skills.")
    .min(1, "Please enter some key Skills.")
    .nullable(),
  workExp: Yup.array().required("Please specify Work Experience.").nullable(),
  salary: Yup.array()
    .required("Please specify Salary.")
    .nullable()
    .min(1, "Please specify Salary."),
  isSalaryHidden: Yup.boolean(),
  checkbox: Yup.boolean().notRequired().nullable(),
  variablePercent: Yup.number().nullable(),
  location: Yup.array()
    .required("Please enter Location.")
    .nullable()
    .min(1, "Please enter Location."),
  department: Yup.object().required("Please select Department.").nullable(),
  roleCategory: Yup.object()
    .required("Please select Role Category.")
    .nullable(),
  role: Yup.object().required("Please select Job Role.").nullable(),
  referenceCode: Yup.string().nullable(),
  vacancy: Yup.string()
    .required("Please enter Number Of Vacancies.")
    .nullable(),
  eduQualification: Yup.array()
    .required("Please select Education Qualification.")
    .nullable()
    .min(1, "Please select Education Qualification."),
  jobType: Yup.string(),
  showRecruiterDetails: Yup.boolean(),
  startDate: Yup.string().required("Please select Start Date.").nullable(),
  endDate: Yup.string().required("Please select End Date.").nullable(),
  hiringManager: Yup.object()
    .required("Please select Hiring Manager.")
    .nullable(),
  Published: Yup.boolean(),
  shareWith: Yup.array()
    .required("Please add a Email/Email Group.")
    .nullable()
    .min(1, "Please enter atleast one Email."),
  jdFile: Yup.object().nullable(),
  isBonus: Yup.boolean(),
  bonus: Yup.string().when("isBonus", {
    is: true,
    then: Yup.string()
      .required("Please specify Bonus Amount.")
      .min(4, "Minimum Bonus Amount is 1000.")
      .test("below-200000", "Maximum Bonus Amount is 200000.", (value) => {
        const parsedValue = Number(value);
        return !isNaN(parsedValue) && parsedValue < 200001;
      })
      .nullable(),
    otherwise: Yup.string().notRequired().nullable(),
  }),
  bonusCondition: Yup.string().notRequired().nullable(),
});

export const EducationOption = [
  "Diploma/Graduation",
  "12th",
  "10th",
  "Below 10th",
];
