import * as Yup from "yup";

interface optionType {
  label: string;
  value: string;
}

export interface choiceType {
  id: number
  choice: string
  isPrefered: boolean,
  error: string
}
export interface questionType {
  id: string
  questionType: string
  question: string
  isMandatory: boolean
  choices: choiceType[]
}

interface schedule {
  refreshType: string;
  start: string;
  refreshEndsAfter: string;
  noOfRefresh: number | null;
  refreshDate: string;
}

export interface privateJobType {
  id: string | null;
  designation: optionType | null;
  empType: optionType | null;
  jobType: boolean;
  workMode: optionType | null;
  hybridPolicy: string | null
  jobDesc: string | null;
  keySkills: optionType[] | null;
  workExp: number[] | null;
  checkbox: any;
  currency: number[] | null;
  currencySymbole: string;
  isSalaryHidden: boolean;
  locality: optionType[] | null;
  variablePercent: number | null;
  salaryOutput: string;
  location: optionType[] | null;
  isReadyToRelocate: any;
  industry: optionType | null;
  preferredIndustry: optionType | null;
  department: optionType | null;
  role: optionType | null;
  roleCategory: optionType | null,
  referenceCode: string;
  noOfVacancies: number | null;
  isPremium: boolean,
  premium: string | null;
  eduQualification: object | null;
  requestVideoProfile: boolean;
  includeWalkIn: boolean;
  contactPerson: string,
  contactNumber: string,
  venue: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  duration: optionType | null;
  questions: questionType[] | null;
  companyName: string;
  companyUrl: string;
  clientName: optionType | null;
  clientDetails: string;
  showRecruiterDetails: boolean;
  recruiterName: string;
  recruiterEmail: string;
  isNotifyMatch: boolean;
  notifyMatch: optionType | null;
  OftenMail: optionType | null;
  schedule: schedule | null;
  Published: boolean
}

export const initialValues: privateJobType =
{
  id: null,
  designation: null,
  empType: null,
  jobType: false,
  workMode: null,
  hybridPolicy: null,
  jobDesc: '',
  keySkills: null,
  workExp: [0, 1],
  checkbox: false,
  currency: [10000, 5000000],
  currencySymbole: "INR",
  salaryOutput: "",
  isSalaryHidden: false,
  variablePercent: null,
  location: null,
  locality: null,
  isReadyToRelocate: false,
  industry: null,
  preferredIndustry: null,
  department: null,
  role: null,
  roleCategory: null,
  referenceCode: "",
  noOfVacancies: null,
  isPremium: false,
  premium: "",
  eduQualification: null,
  requestVideoProfile: false,
  includeWalkIn: false,
  contactPerson: "",
  contactNumber: "",
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  duration: null
  // { label: "1", value: "1" }
  ,
  venue: "",
  questions: null,
  companyName: "",
  companyUrl: "",
  clientName: null,
  clientDetails: "",
  showRecruiterDetails: false,
  recruiterName: "",
  recruiterEmail: "",
  isNotifyMatch: false,
  notifyMatch: null,
  OftenMail: null,
  schedule: {
    refreshType: "Do not refresh",
    start: "",
    refreshEndsAfter: "After",
    noOfRefresh: null,
    refreshDate: "",
  },
  Published: true
};

export const validateSchema = Yup.object().shape({
  designation: Yup.object()
    .nullable()
    .required("Please enter Job title / Designation."),
  empType: Yup.object().nullable().required("Please select Employment Type."),
  workMode: Yup.object().nullable().required("Please select Work Mode."),
  hybridPolicy: Yup.string().when('workMode', {
    is: (c: any) => c?.label === "Hybrid",
    then: Yup.string().required("Please describe your Policy.").nullable()
  }).notRequired().nullable(),
  jobDesc: Yup.string()
    .nullable()
    .required("Please enter Job Description.")
  ,
  keySkills: Yup.array()
    .required("Please enter some key Skills.")
    .nullable()
    .min(1, 'Please enter some key Skills.')
  ,
  workExp: Yup.array().required("Please specify Work Experience.").nullable(),
  currency: Yup.array()
    .required("Please specify Salary.")
    .nullable()
    .min(1, "Please specify Salary."),
  isSalaryHidden: Yup.boolean(),
  checkbox: Yup.boolean().notRequired().nullable(),
  variablePercent: Yup.number().nullable(),
  location: Yup.array()
    .required("Please enter Locations.")
    .nullable()
    .min(1, "Please enter Locations."),

  locality: Yup.array().notRequired().nullable(),

  isReadyToRelocate: Yup.boolean(),
  industry: Yup.array().required('Please select Industries.').nullable().min(1, 'Please select Industries.'),
  preferredIndustry: Yup.object().nullable(),
  department: Yup.object().required('Please select Department.').nullable(),
  roleCategory: Yup.object().required('Please select Role Category.').nullable(),
  role: Yup.object().required('Please select Job Role.').nullable(),
  referenceCode: Yup.string().nullable(),
  noOfVacancies: Yup.number().nullable(),
  isPremium: Yup.boolean(),
  premium: Yup.object().nullable(),
  eduQualification: Yup.array()
    .required('Please select Education Qualification.')
    .nullable()
    .min(1, 'Please select Education Qualification.')
  ,
  requestVideoProfile: Yup.boolean(),
  includeWalkIn: Yup.boolean().notRequired(),
  contactPerson: Yup.string()
    .notRequired()
    .trim("Empty space not allowed.")
    .matches(
      /^[A-Za-z]+[A-Za-z\s]{0,50}$/,
      "Numeric and special characters are not allowed."
    )
    .nullable(),
  contactNumber: Yup.string()
    .max(12)
    .matches(/^[6-9]{1}[0-9]{9}$/, "Please enter valid mobile number.")
    .nullable(),
  googleMapUrl: Yup.string()
    .notRequired()
    // .matches(
    //   /https?:\/\/www\.google\.com\/maps\/(?:place\/)?(?:[^\/]+\/)*@(-?\d+(\.\d+)?),(-?\d+(\.\d+)?),\d+z/,
    //   "Please select valid google map url."
    // )
    .trim("Empty space not allowed.").nullable(),
  venue: Yup.string()
    .when("includeWalkIn", {
      is: true,
      then: Yup.string().required("Please tell us the venue details where this Walk-In will happen.").nullable().trim("Empty space not allowed."),
    }).nullable()

  // .required("Please select venue for walk in details.")
  ,
  startDate: Yup.string()

    .when("includeWalkIn", {
      is: true,
      then: Yup.string().required("Please select Start Date.").nullable(),
    }).nullable()


  // required("Please select start date.")
  ,
  endDate: Yup.string(),
  startTime: Yup.string()
    .when("includeWalkIn", {
      is: true,
      then: Yup.string().required("Please select Start Time for Walk-In details.").nullable(),
    })
  // .required("Please select start Time for walk in details.")
  ,
  endTime: Yup.string()
    .when("includeWalkIn", {
      is: true,
      then: Yup.string().required("Please select End Time for Walk-In details.").nullable(),
    })
  // .required("Please select end Time for walk in details.")
  ,
  duration: Yup.object()
    .when("includeWalkIn", {
      is: true,
      then: Yup.object().required("Please select Duration in days.").nullable(),
    }).nullable()
  // .required("Please select duration in days.")
  ,
  questions: Yup.object().nullable(),
  jobType: Yup.boolean(),
  companyName: Yup.string(),
  companyUrl: Yup.string().matches(
    /^(?=.{4,2048}$)((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]{1,63}(\.[a-zA-Z]{1,63}){1,5}(\/)?.([\w\?[a-zA-Z-_%\/@?]+)*([^\/\w\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/, 'Please Enter Valid URL. '),
  clientName: Yup.object().nullable(),
  clientDetails: Yup.string().nullable(),
  showRecruiterDetails: Yup.boolean(),
  recruiterName: Yup.string(),
  recruiterEmail: Yup.string().matches(/^(?=[^+\-_*\/]*$)([A-Za-z0-9.]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}([.][a-zA-Z]{2,})?)$/, "Please Enter Valid Mail."),
  isNotifyMatch: Yup.boolean(),
  notifyMatch: Yup.object().nullable(),
  OftenMail: Yup.object().nullable(),
  schedule: Yup.object().shape({
    refreshType: Yup.string(),
    start: Yup.string().nullable(),
    refreshEndsAfter: Yup.string(),
    noOfRefresh: Yup.object()
      .when("refreshType", {
        is: "After",
        then: Yup.object().required("Please select Duration in days.").nullable(),
      })
      .nullable(),
    refreshDate: Yup.string().nullable(),
  }),
  Published: Yup.boolean()
});

export const EducationOption = ["Diploma/Graduation", "12th", "10th", "Below 10th"];
