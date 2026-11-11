import * as Yup from "yup";
import { regex } from "../../common/validation";

export const UserManagementSchema = Yup.object().shape({
  fullName: Yup.string()
    .matches(regex.firstname, "Numeric and special characters are not allowed.")
    .trim("Empty space not allowed.")
    .min(1, "Full Name must contains minimum 1 characters.")
    .required("Please enter Full Name."),
  userEmail: Yup.string()
    .required("Please enter Email Address.")
    .matches(regex.email, "Please specify valid Email Address.")
    .trim("Empty space not allowed."),
  country: Yup.string().notRequired(),
  // allPermission: Yup.array().required("Please select Permission").nullable(),
  mobileNumber: Yup.string()
    .required("Please enter Contact Number.")
    .trim("Empty space not allowed.")
    .matches(regex.indian_mobile, "Please enter valid Contact Number."),
});
