import * as Yup from "yup";
import { regex } from "../../../../common/validation";

export const AccountDetailsSchema = Yup.object().shape({
  username: Yup.string()
    .nullable()
    .matches(regex.firstname, "Numeric and special characters are not allowed.")
    .trim("Empty space not allowed.")
    .min(1, "First name must contains minimum 1 characters.")
    .max(50)
    .required("Please enter User name."),
  communicationEmail: Yup.string().nullable(),
  role: Yup.string()
    .nullable()
    .matches(regex.firstname, "Numeric and special characters are not allowed.")
    .trim("Empty space not allowed.")
    .min(3, "Role must contains minimum 3 characters.")
    .max(50)
    .required("Please enter your Role."),
  mobileNumber: Yup.string()
    .required("Please enter mobile number.")
    .trim("Empty space not allowed.")
    .matches(
      regex.international_mobile,
      "Please enter mobile number with minimum of 6 digits and maximum of 12 digits."
    ),
});

export const EmployeeProfilesSchema = Yup.object().shape({
  // industrialType: Yup.object().nullable().required("Please select industry."),
  contactPerson: Yup.string()
    .matches(regex.firstname, "Numeric and special characters are not allowed.")
    .trim("Empty space not allowed.")
    .min(1, "First name must contains minimum 1 characters.")
    .max(50, "Contact Person must be at most 50 characters.")
    .required("Please enter Contact Person name."),
  alias: Yup.string()
    .matches(
      regex.aliasRegex,
      "Alias must contain characters with a-z, A-Z, 0-9, (. | ! @ & () -) only."
    )
    .trim("Empty space not allowed.")
    .min(1, "Alias must contains minimum 1 characters.")
    .nullable(),

  contactPersonDesignation: Yup.string()
    .nullable()
    .trim("Empty space not allowed.")
    .min(1, "Please enter Contact Person designation.")
    .matches(
      regex.designation,
      "Please enter valid Contact Person designation. start with alphabets and allowed characters are space , - ."
    ),
  websiteUrl: Yup.string()
    .max(200, "Must be 200 characters or less.")
    .matches(regex.url, "Please provide valid website url.")
    .nullable(),
  country: Yup.string().notRequired(),
  altCountry: Yup.string().notRequired().nullable(),
  phoneNumber1: Yup.string()
    .required("Please enter Primary Phone Number.")
    .trim("Empty space not allowed.")
    .matches(
      regex.international_mobile,
      "Please enter Primary Phone Number with minimum of 6 digits and maximum of 12 digits."
    ),
  phoneNumber2: Yup.string()
    .trim("Empty space not allowed.")
    .matches(
      regex.international_mobile,
      "Please enter Secondary Phone Number with minimum of 6 digits and maximum of 12 digits."
    )
    .nullable(),
  profileforHotVacancies: Yup.string()
    .max(30, "Must be 30 characters or less.")

    .nullable(),
  profileforClassifieds: Yup.string()
    .max(30, "Must be 30 characters or less.")
    // .required("Please enter Profile for Classifieds")
    .nullable(),
  faxNumber: Yup.string()
    .matches(regex.FaxNumberRegex, "Please Enter valid FAX Number.")
    .max(15, "Must be 15 characters or less.")
    .trim("Empty space not allowed.")
    .nullable(),
  TANNumber: Yup.string()
    .max(10, "Must be 10 characters or less.")
    .matches(regex.TanNumberRegex, "Please Enter valid TAN Number.")
    .trim("Empty space not allowed.")
    .nullable(),
  Pincode: Yup.string()
    .trim("Empty space not allowed.")
    .matches(
      regex.pinCode,
      "Please enter Company Pin Code with minimum of 4 digits and maximum of 6 digits."
    )
    .required("Please enter Company Pin Code."),

  address: Yup.string()
    .trim("Empty space not allowed.")
    .min(1, "Please enter the correct Company Address.")
    .required("Please enter Company Address."),
});

// export const KYCDetailsSchema = yup.object().shape({
//   kycstatus: yup
//     .string()
//     .max(30, "Must be 30 characters or less")
//     .required("Please enter KYC Status")
//     .nullable(),
//   pannumber: yup
//     .string()
//     .max(15, "Must be 15 characters or less")
//     .required("Please enter PAN Number")
//     .nullable(),
//   panName: yup
//     .string()
//     .max(15, "Must be 15 characters or less")
//     .required("Please enter Name As per PAN Card")
//     .nullable(),
//   DatePan: yup
//     .string()
//     .max(15, "Must be 15 characters or less")
//     .required("Please enter Date on Pan Card")
//     .nullable(),
//   Addresslabel: yup
//     .string()
//     .max(15, "Must be 15 characters or less")
//     .required("Please enter Mobile Number")
//     .nullable(),
//   address: yup
//     .string()
//     .max(15, "Must be 15 characters or less")
//     .required("Please enter Mobile Number")
//     .nullable(),
//   country: yup
//     .string()
//     .max(15, "Must be 15 characters or less")
//     .required("Please enter Mobile Number")
//     .nullable(),
//   state: yup
//     .string()
//     .max(15, "Must be 15 characters or less")
//     .required("Please enter Mobile Number")
//     .nullable(),
//   city: yup
//     .string()
//     .max(15, "Must be 15 characters or less")
//     .required("Please enter Mobile Number")
//     .nullable(),
//   pincode: yup
//     .string()
//     .max(15, "Must be 15 characters or less")
//     .required("Please enter Mobile Number")
//     .nullable(),
//   GSTIN: yup
//     .string()
//     .max(15, "Must be 15 characters or less")
//     .required("Please enter Mobile Number")
//     .nullable(),
// });

// export const FORM_VALIDATION_KYC = yup.object().shape({
//   panNumber: yup
//     .string()
//     .max(
//       10,
//       "Incorrect Format. PAN should be a 10 character alpha-numeric unique identifier. e.g. AAAAA1111A"
//     )
//     .min(
//       10,
//       "Incorrect Format. PAN should be a 10 character alpha-numeric unique identifier. e.g. AAAAA1111A"
//     )

//     .required("Pan Number is mandatory")
//     .nullable(),
//   panName: yup
//     .string()
//     .max(30, "Must be 30 characters or less")
//     .required("Pan Name is mandatory")
//     .nullable(),
// });

// export const FORM_VALIDATION_AADHAR = yup.object().shape({});
