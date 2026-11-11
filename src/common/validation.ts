export const regex = {
  numberTyping: /^[0-9]*$/,
  noOfVacancy: /^(?!0)[0-9]*$/,
  alphabetTyping: /^[a-zA-Z]*$/,
  upperCaseTyping: /^[A-Z]*$/,
  lowerCaseTyping: /^[a-z]*$/,
  alphaNumericTyping: /^[a-zA-Z0-9]*$/,
  alphabetSpaceTyping: /^[a-zA-Z\s]*$/,
  upperCaseSpaceTyping: /^[A-Z\s]*$/,
  lowerCaseSpaceTyping: /^[a-z\s]*$/,
  nameRegex: /^[A-Za-z]+(?: [A-Za-z]+)*$/,
  password:
    /(?=^.{8,16}$)(?=.*\d)(?=.*[!@#$%^&*?]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
  email:
    /^(?=[^+\-_*\/]*$)([A-Za-z0-9.]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}([.][a-zA-Z]{2,})?)$/,
  international_mobile: /^[1-9][0-9]{5,11}$/,
  pinCode: /^[1-9][0-9]{3,5}$/,
  companyName: /^[a-zA-Z0-9][a-zA-Z0-9&'.,()&@_\s-]{0,100}$/,
  designation: /^[a-zA-Z0-9][a-zA-Z0-9\s.-]{0,150}$/,
  lastName: /^[A-Za-z]+[A-Za-z\s]{0,50}$/,
  firstname: /^[A-Za-z]+[A-Za-z\s]*$/,
  fullName: /^[A-Za-z]+[A-Za-z\s]{0,150}$/,
  indian_mobile: /^[6-9]{1}[0-9]{9}$/,
  numberRegx: /^[0-9]*$/,
  mobileMaxLength: /^\d{10}$/,
  empIndian_mobile: /^[+]{1}([0-9]){2}[6-9]{1}[0-9]{9}$/,
  url: /^(https?:\/\/)?(www\.)?([^\s\/]+\.[a-zA-Z]{2,}|localhost)(\/[^\s]*)?$/,
  asyncField: /^[0-9a-zA-Z-.',:!()&+#/>]*$/,
  asyncFieldSpaceTyping: /^[0-9a-zA-Z-.',:!()&+#/>\s]*$/,
  locationRegex: /[^a-zA-Z\s]*$/,
  aliasRegex: /^[0-9a-zA-Z-.|!@&_()\s]*$/,
  imageNameRegex: /^[^#%]*$/,
  empIdRegex: /^[a-zA-Z0-9-]*$/,
  companyFilter: /^[a-zA-Z0-9&'.,()&@_\s-]*$/,
  educationFilter: /^[a-zA-Z\s'/.-]*$/,
  skillsRegex: /[^a-zA-Z0-9-.',:!()&+#/>\s]*$/,
  educationRegex: /[^a-zA-Z0-9-.',:()&+/>\s]*$/,
  designationRegex: /[^a-zA-Z0-9][a-zA-Z0-9\s.-\s]*$/,
  TanNumberRegex: /^[A-Z]{4}[0-9]{5}[A-Z]{1}$/,
  FaxNumberRegex: /^\d{15}$/,
};
export const charaterLength = 16;
export const getUniqueId = () => {
  return Math.floor(Math.random() * 0xffffff * 1000000).toString(16);
};
export const getRandomString = (substringNumber: number) => {
  return (Math.random() + 1).toString(36).substring(substringNumber);
};
