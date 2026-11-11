import { combineReducers } from "redux";
import {
  adminLoginSlice,
  jsSocMediaLoginslice,
} from "./features/authentication/LoginSlice";
import { employerLoginSlice } from "./features/authentication/LoginSlice";
import { jobSeekerLoginSlice } from "./features/authentication/LoginSlice";
import UpdateKeySkillSlice from "./features/manage-account/profile/KeySkillSlice";
import logoutSlice from "./features/authentication/logoutSlice";
import {
  EducationDeleteSlice,
  EducationPatchSlice,
  EducationPostSlice,
} from "./features/manage-account/profile/EducationSlice";
import { jobSeekerRegsterSsoSlice } from "./features/authentication/jobSeekerRegisterSlice";
import { jobseekerSelfRegistrationSlice } from "./features/authentication/jobSeekerRegisterSlice";
import LocationcityMasterDataSlice from "../redux/features/masterData/LocationcitySlice";
import { Presentation } from "./features/manage-account/profile/Presentation";
import { deletePresentationDetailS1 } from "./features/manage-account/profile/Presentation";
import {
  ProjectDetailsSlice,
  DeleteProjectSlice,
} from "./features/manage-account/profile/ProjectSlice";
import { otpLoginSlice } from "./features/authentication/LoginSlice";
import employerMailVerifySlice from "./features/authentication/employerMailVerifySlice";
import ResumeHeadlineSlice from "./features/manage-account/Registration/ResumeHandleSlice";
import ProfileSummarySlice from "./features/manage-account/Registration/ProfileSummarySlice";
import onlineProfileSlice, {
  deleteProfileDetails,
} from "./features/manage-account/profile/onlineProfileSlice";
import JobSeekerProfile2Slice from "./features/manage-account/profile/JsSlice";
import {
  worksampleDeleteSlice,
  worksampleSlice,
} from "./features/manage-account/profile/WorkSampleSlice";
import {
  deletePatentDetails,
  PatentDetails,
} from "./features/manage-account/profile/PatentSlice";
import {
  DeleteITSkillDetailsSlice,
  iTSkillSlice,
} from "./features/manage-account/profile/ItSkillSlice";
import employerRegisterSlice from "./features/authentication/employerRegisterSlice";
import employerSetPwdSlice from "./features/authentication/employerSetPwdSlice";
import employerDeclareSclice from "./features/authentication/employerDeclareSclice";
import userMailSlice from "./features/authentication/userMailSlice";
import {
  CertificationDeleteSlice,
  CertificationSlice,
} from "./features/manage-account/profile/CertificationSlice";
import {
  accountInfoSlice,
  companyInfoSlice,
  downloadLogoSlice,
  employeerProfileSlice,
  UploadCompanyLogoSlice,
} from "./features/manage-account/profile/EmployerProfileSlice";
import {
  deleteEmployementDeatails,
  employmentDetails,
  Futureyearmonth,
} from "./features/manage-account/profile/EmploymentSlice";
import {
  forgetPwdSlice,
  resetPasswordSlice,
} from "./features/authentication/resetPasswordSlice";
import sendOtpSlice from "./features/authentication/sendOtpSlice";
import {
  verifyForgetPwdOtpSlice,
  verifyOtpCrtTokenSlice,
  verifyOtpSlice,
} from "./features/authentication/verifyOtpSlice";
import AuthEmployerRegSlice, {
  AddUserLimitSlice,
  DownloadUserInfoSlice,
  commonMasterDataLimitSlice,
} from "./features/admin/AuthEmployerRegSlice";
import {
  jobSeekerSendEmailSlices,
  jobSeekerVerifyotpSlices,
} from "./features/authentication/jobSeekerVerifyEmail";
import {
  BasicDetailSlice,
  ProfileStrengthSlice,
} from "./features/manage-account/profile/BasicDetailsSlice";

import PersonalDetailsSlice, {
  deletePersonalLang,
} from "./features/manage-account/profile/PersonalDetailsSlice";
import CareerProfileSlice from "./features/manage-account/profile/CareerProfileSlice";
import {
  downloadImageSlice,
  downloadResumeSlice,
  downloadVideoSlice,
  uploadFileSlice,
  DeletejobseekerFileSlice,
} from "./features/manage-account/profile/userFilesSlice";
import jobSeekerProfileMasterDataSlice from "./features/masterData/MasterDataInfoSlice";
import { contactInfoMasterDataSlice } from "./features/masterData/MasterDataInfoSlice";
import yearmonthSlice from "./features/masterData/YearMonthSlice";
import { JobSeekerVerifyotpSlice } from "./features/authentication/jobseekerVerifyOtpSlice";

import jobSeekerprofileSlice from "./features/manage-account/profile/JobSeekerProfileSlice";
import { postQuerySlice1 } from "../redux/features/admin/support/ManageContactInfoSlice";
import { addActivitySlice1 } from "../redux/features/admin/support/AddActivitySlice";
import { fetchTicketsSlice1 } from "../redux/features/admin/support/FetchTicketsSlice";
import { updateTicketStatusSlice } from "../redux/features/admin/support/TicketStatusSlice";
import { patchContactInfoSlice } from "../redux/features/admin/support/ManageContactInfoSlice";
import authJobSeekerRegsterSlice from "./features/admin/AuthJobseekerRegSlice";
import {
  publicationSlice,
  deletepublicationSlice,
} from "./features/manage-account/profile/WhitePaperSlice";
import SkillsSlice from "./features/masterData/SkillsSlice";
import CompanySlice from "./features/masterData/CompanySlice";
import DesignationSlice from "./features/masterData/DesignationSlice";
import industrySlice from "./features/masterData/industrySlice";

import countrySlice from "./features/masterData/countrySlice";
import LocationcitySlice from "./features/masterData/LocationcitySlice";
import DepartmentSlice from "./features/masterData/DepartmentSlice";
import commonMasterSlice from "./features/masterData/commonMasterSlice";
import InstituteSlice from "./features/masterData/InstituteSlice";

import { applicantInfoSlice } from "./features/employer/jsprofilepreviewslice";
import {
  GetPremiumCollegeSlice,
  RolesAndResponsibilitySlice,
  GetTemplatesSlice,
  PatchPrivateJobSlice,
  PostPrivateJobSlice,
  PostTemplateSlice,
  DeleteTemplateSlice,
} from "./features/jobs/job-post/private-job/PrivateJobSlice";

import {
  AuthJobSearchSlice,
  JobSearchSlice,
} from "./features/jobs/job-listing/JobListingSlice";
import {
  listingMinimalJobsSlice,
  ManageJobsSlice,
  TotalJobsApplicantsSlice,
  EmpStatisticsSlice,
  UpdateJobsStatusSlice,
} from "./features/jobs/manage-jobs/ManageJobsSlice";
import { applicantStatusSlice } from "./features/employer/applicationStatusslice";
import { emailSendSlice } from "./features/employer/recruitmentMailslice";
import {
  downloadAppImageSlice,
  downloadAppResumeSlice,
  downloadAppVideoSlice,
} from "./features/employer/downloadMedia";
import ApplicationSlice from "./features/jobs/job-applications/ApplicationSlice";
import {
  GetSavedJobsSlice,
  PatchSaveUnSaveJobSlice,
} from "./features/jobs/saved-jobs/SavedJobsSlice";

import { JobPreviewSlice } from "./features/jobs/job-preview/JobPreviewSlice";
import { ApplyJobSlice } from "./features/jobs/apply-job/ApplyJob";
import {
  EmplDetailsSlice,
  JobAdditionalApplicationSlice,
  JobApplicationSlice,
  JobAppliedCountSlice,
} from "./features/jobs/applied-jobs/AppliedJobSlice";

import {
  createCommentSlice,
  deleteCommentSlice,
  fetchCommentSlice,
  updateCommentSlice,
} from "./features/employer/commentslice";
import downloadSASSlice from "./features/jobs/job-applications/downloadSASSlice";
import { JsProfileViewSlice } from "./features/employer/js-view/JsProfileViewSlice";
import { PostSearchProfilesSlice } from "./features/jobs/search-profile/SearchProfileSlice";
import { applicantStatusSlice2 } from "./features/jobs/job-applications/ApplicationStatusSlice";
import {
  DashboardJobSummarySlice,
  DashboardMatchingJobSlice,
} from "./features/manage-account/profile/JsDashboardSlice";
import { JobSeekerSlice } from "../components/admin/userManagement/UserManagement";
import {
  AssessmentDataSlice,
  JSAssessmentDataSlice,
  FilteredAssessmentSlice,
  PaymentbeforetxnSlSlice,
  PaymentAftertxnSlSlice,
  getAssessmentBriefSlice,
  ReportJobseekerSlice,
  reportDataSlice,
  AssessmentStatisticsSlice,
  JSAssessmentStatisticsSlice,
  getJobSeekrAssessmentSlice,
} from "./features/jobSeeker/JsAssessmentSlice";
import userGetEmpManagementSlice from "./features/employer/EmployerManageUser/userEmpManagementSlice";
import userPostEmpMangeSlice from "./features/employer/EmployerManageUser/userPostEmpMangeSlice";
import userPatchEmpManageSlice from "./features/employer/EmployerManageUser/userPatchEmpManageSlice";
import userEnDisManageSlice from "./features/employer/EmployerManageUser/userEnDisManageSlice";
import {
  DeleteFaqSlice,
  FetchFaqSlice,
  FetchSingleFaqSlice,
  PostFaqSlice,
  UpdateFaqSlice,
  VoteFaqSlice,
} from "./features/admin/faq/FaqSlice";
import {
  DeletePollSlice,
  PostPollSlice,
} from "./features/admin/polls/ManagePollsSlice";
import {
  GetHiringManagersSlice,
  GetInternalOrRefJobSlice,
  PatchInternalOrRefJobSlice,
  PostInternalOrRefJobSlice,
} from "./features/jobs/internal_ref_job/Internal_Ref_Job";
import {
  companyDetailSlice,
  employersDetailsSlice,
  resendMailSlice,
  userAccessibilitySlice,
} from "./features/admin/userManagement/UserManagementSlice";
import getEpmMailSlice from "./features/employer/EmployerManageUser/getEpmMailSlice";

import { FetchPollSlice } from "./features/admin/polls/ManagePollsSlice";
import {
  EmpIntStatisticsSlice,
  IntTotalJobsApplicantsSlice,
  InternalJobsSlice,
  UpdateInternalJobStatusSlice,
} from "./features/jobs/manage-jobs/MangeJobs-rjp-ijpSlice";
import IjpRjpApplicationSlice from "./features/jobs/job-applications/ijp-rjp-jobs-applications/IjpRjpApplicationSlice";
import { downloadQueryImgSlice } from "./features/admin/support/DownloadQueryImg";
import { uploadProfileImgSlice } from "./features/employer/employerProfileSlice";
import { InrRefApplicantSlice } from "./features/employer/inr-ref-applicants/InrRefApplicantPreviewSlice";
import {
  assessmentTredSlice,
  jobPostTrend,
  regTrendSlice,
  supportTktTrend,
  userStatistics,
} from "./features/dashboard/AdminDashboardSlice";
import { applicantIjpRjpStatusSlice2 } from "./features/jobs/job-applications/ijp-rjp-jobs-applications/IjpRjpApplicationStatusSlice";
import {
  FetchIJPRJPSlice,
  PostIntAppSlice,
  PostIntJobApplySlice,
  fetchValidJobSlice,
} from "./features/jobs/apply-job/apply-Inr-job/Apply-Internal-JobSlice";
import {
  viewAssessmentSlice,
  AddAssessmentSlice,
  UpdateStaustSlice,
  UpdateCurrencySlice,
  UpdateAssessmentSlice,
  DownloadAssessmentSlice,
} from "./features/admin/Assessment/manageAssessmentSlice";
import {
  fetchPollPreviewSlice,
  savePollAnswerSlice,
  singlePollSlice,
  singlePollGraphSlice,
} from "./features/admin/polls/PollPreviewSlice";
import {
  GetNativeuserManagementSlice,
  PatchNativeToggleSwitchSlice,
  PatchNativeuserManagementSlice,
  PostNativeuserManagementSlice,
} from "./features/admin/NativeuserManagementSlice";
import downloadCompSASSlice from "./features/jobs/job-applications/downloadCompSASSlice";
import { getAssessmentDataSlice } from "./features/employer/js-view/AssessmentDetailsSlice";
import {
  JobPostResponseSlice,
  JobPostStaticsSlice,
  getJobResponsePostSlice,
} from "./features/dashboard/employerDashboardSlice";
import { ResumeData } from "./features/jobSeeker/resumeParserSlice";
import {
  getNotificationSlice,
  viewNotificationSlice,
} from "./features/notification/NotificationSlice";
import {
  fetchjsPrivateDB,
  postjsPrivateDB,
} from "./features/employer/private-js-profile/privateJsProfileSlice";
import { GetTermsAndConditionsSlice1 } from "./features/common/public/TermsAndConditionSlice";
import {
  termsAndConditionSlice,
  getTermsAndConditionSlice,
  patchTermsAndConditionSlice,
  getTermsSettingsSlice,
} from "./features/admin/support/TermsAndCondition";
import privatedbdeleteSlice from "./features/employer/private-js-db/privatedbdeleteSlice";
import { TotalDownloadCsvFileSlice } from "./features/dashboard/AdminDownloadCSVSlice";
import { setEmailNotificationSlice1 } from "./features/common/public/EmailNotification";

export default combineReducers({
  skills: SkillsSlice,
  compnayname: CompanySlice,
  designation: DesignationSlice,
  employeeProfile: employeerProfileSlice,
  companyInfo: companyInfoSlice,
  companylogo: UploadCompanyLogoSlice,
  downloadLogo: downloadLogoSlice,
  accountInfo: accountInfoSlice,
  patentx: PatentDetails,
  deletePatentDeatails: deletePatentDetails,
  ITSkills: iTSkillSlice,
  DeleteITSkillDetails: DeleteITSkillDetailsSlice,
  adminLogin: adminLoginSlice,
  jobSeekerLogin: jobSeekerLoginSlice,
  employerLogin: employerLoginSlice,
  verifyAndCrtToken: verifyOtpCrtTokenSlice,
  verifyForgetPwdOtp: verifyForgetPwdOtpSlice,
  verifyOtp: verifyOtpSlice,
  otpLogin: otpLoginSlice,
  resetPassword: resetPasswordSlice,
  forgetPwd: forgetPwdSlice,
  updateKeySkillsData: UpdateKeySkillSlice,
  logout: logoutSlice,
  publication: publicationSlice,
  deletePublication: deletepublicationSlice,
  jobSeekerRegister: jobSeekerRegsterSsoSlice,
  jobSeekerSelfRegister: jobseekerSelfRegistrationSlice,
  projectDetails: ProjectDetailsSlice,
  presentationDetails: Presentation,
  updateResumeHeadline: ResumeHeadlineSlice,
  updateProfileSummary: ProfileSummarySlice,
  onlineProfileDetails: onlineProfileSlice,
  JobSeekerProfile2: JobSeekerProfile2Slice,
  workSample: worksampleSlice,
  deleteworksample: worksampleDeleteSlice,
  itSkill: iTSkillSlice,
  empRegister: employerRegisterSlice,
  employerSetPwd: employerSetPwdSlice,
  employerDeclare: employerDeclareSclice,
  employerMailVerify: employerMailVerifySlice,
  userMailVerify: userMailSlice,
  CertificateStatus: CertificationSlice,
  LocationCitiesData: LocationcityMasterDataSlice,
  employmentDetail: employmentDetails,
  sendOtp: sendOtpSlice,
  authEmpReg: AuthEmployerRegSlice,
  jobSeekerSendEmail: jobSeekerSendEmailSlices,
  jobSeekerVerifyOtp: jobSeekerVerifyotpSlices,
  basicDetails: BasicDetailSlice,
  profileStrength: ProfileStrengthSlice,
  personalDetails: PersonalDetailsSlice,
  downloadImage: downloadImageSlice,
  downloadResume: downloadResumeSlice,
  downloadVideo: downloadVideoSlice,
  uploadFile: uploadFileSlice,
  careerProfile: CareerProfileSlice,
  jobseekerotpVerify: JobSeekerVerifyotpSlice,
  jobseekerProfile: jobSeekerprofileSlice,
  postQuery: postQuerySlice1,
  fetchTickets: fetchTicketsSlice1,
  addActivity: addActivitySlice1,
  updateTicketStatus: updateTicketStatusSlice,
  patchContactInfo: patchContactInfoSlice,
  deletePersonalLan: deletePersonalLang,
  deleteEmploymentDetail: deleteEmployementDeatails,
  deletePresentationDetails: deletePresentationDetailS1,
  deleteProject: DeleteProjectSlice,
  authJobSeekerRegster: authJobSeekerRegsterSlice,
  DeleteProfileDetails: deleteProfileDetails,
  certificationDeleteSl: CertificationDeleteSlice,
  jobSeekerMasterData: jobSeekerProfileMasterDataSlice,
  yearmonthMasterdata: yearmonthSlice,
  futureyearmonth: Futureyearmonth,
  locationcity: LocationcitySlice,
  departmentdata: DepartmentSlice,
  industryType: industrySlice,
  findJob: JobSearchSlice,
  authfindJob: AuthJobSearchSlice,
  contactInfoMasterData: contactInfoMasterDataSlice,
  countryCode: countrySlice,
  DeletejobseekerFile: DeletejobseekerFileSlice,
  CommonMasterData: commonMasterSlice,
  institue: InstituteSlice,
  PostJob: PostPrivateJobSlice,
  ManageJobs: ManageJobsSlice,
  TotalJobsApplicants: TotalJobsApplicantsSlice,
  EmpStatisticsData: EmpStatisticsSlice,
  PatchPrivate: PatchPrivateJobSlice,
  UpdateJobsData: UpdateJobsStatusSlice,
  JsSocMediaLogin: jsSocMediaLoginslice,
  jsPrfilePreview: applicantInfoSlice,
  jsProfileDetails: JsProfileViewSlice,
  appStatus2: applicantStatusSlice2,
  appStatus: applicantStatusSlice,
  emailSend: emailSendSlice,
  PostPrivateJobSlice: PostPrivateJobSlice,
  GetTemplatesSlice: GetTemplatesSlice,
  PostTemplateSlice: PostTemplateSlice,
  GetSavedJobsSlice: GetSavedJobsSlice,
  PatchSaveUnSaveJobSlice: PatchSaveUnSaveJobSlice,
  GetTermsAndConditions: GetTermsAndConditionsSlice1,
  savedjobx: GetSavedJobsSlice,
  downloadAppImg: downloadAppImageSlice,
  downloadQueryImg: downloadQueryImgSlice,
  downloadAppRes: downloadAppResumeSlice,
  downloadAppVid: downloadAppVideoSlice,
  viewApplication: ApplicationSlice,
  Jobpreviews: JobPreviewSlice,
  JobApply: ApplyJobSlice,
  JobApplicationData: JobApplicationSlice,
  JobAdditionalApplicationData: JobAdditionalApplicationSlice,
  JobAppliedCountData: JobAppliedCountSlice,
  EmplDetailsData: EmplDetailsSlice,
  createComments: createCommentSlice,
  fetchComments: fetchCommentSlice,
  updateComments: updateCommentSlice,
  deleteComment: deleteCommentSlice,
  downloadSAS: downloadSASSlice,
  Listingalljobs: listingMinimalJobsSlice,
  searchProfile: PostSearchProfilesSlice,
  RolesAndResponsibility: RolesAndResponsibilitySlice,
  GetPremiumCollege: GetPremiumCollegeSlice,
  jobSummary: DashboardJobSummarySlice,
  matchingJobs: DashboardMatchingJobSlice,
  getuserEmpManagement: userGetEmpManagementSlice,
  postuserEmpManagement: userPostEmpMangeSlice,
  patchuserEmpMangement: userPatchEmpManageSlice,
  EnDisUser: userEnDisManageSlice,
  UpdateIntJobStatus: UpdateInternalJobStatusSlice,
  InternalJobs: InternalJobsSlice,
  getEpmMails: getEpmMailSlice,
  postFAQData: PostFaqSlice,
  SingleFAQData: FetchSingleFaqSlice,
  fetchFAQData: FetchFaqSlice,
  deleteFAQData: DeleteFaqSlice,
  updateFAQData: UpdateFaqSlice,
  voteFAQCount: VoteFaqSlice,
  JobSeekerData1: JobSeekerSlice,
  FilteredAssess: FilteredAssessmentSlice,
  AssessmentBrief: getAssessmentBriefSlice,
  AssessmentData: AssessmentDataSlice,
  UpdateReportDetails: reportDataSlice,
  JSAssessmentData: JSAssessmentDataSlice,
  getJobSeekrAssess: getJobSeekrAssessmentSlice,
  PaymentBeforeTns: PaymentbeforetxnSlSlice,
  PaymentAfterTns: PaymentAftertxnSlSlice,
  fetchPollx: FetchPollSlice,
  deletePollx: DeletePollSlice,
  postPollx: PostPollSlice,
  GetHiringManager: GetHiringManagersSlice,
  PostInternalOrReferalJob: PostInternalOrRefJobSlice,
  GetInternalJobs: GetInternalOrRefJobSlice,
  PatchInternalJob: PatchInternalOrRefJobSlice,
  viewIjpRjpApplication: IjpRjpApplicationSlice,
  appIjpRjpStatus: applicantIjpRjpStatusSlice2,
  postInternalJobApply: PostIntJobApplySlice,
  userAccessibility: userAccessibilitySlice,
  companyDetails: companyDetailSlice,
  employersDetails: employersDetailsSlice,
  resendMail: resendMailSlice,
  GetNativeuserManagementData: GetNativeuserManagementSlice,
  PostNativeuserManagementData: PostNativeuserManagementSlice,
  PatchNativeuserManagementData: PatchNativeuserManagementSlice,
  PatchNativeToggleData: PatchNativeToggleSwitchSlice,
  uploadProfileImgData: uploadProfileImgSlice,
  InrRefApplicantData: InrRefApplicantSlice,
  RegTrend: regTrendSlice,
  JobPostTrend: jobPostTrend,
  UserStatistics: userStatistics,
  SupportTktTrend: supportTktTrend,
  fetchPollPreviewSlice: fetchPollPreviewSlice,
  savePollAnswerSlice: savePollAnswerSlice,
  AddAssessment: AddAssessmentSlice,
  UpdateAssessment: UpdateAssessmentSlice,
  viewAssessment: viewAssessmentSlice,
  UpdateStausTest: UpdateStaustSlice,
  ReportDataJs: ReportJobseekerSlice,
  UpdateCurrencyText: UpdateCurrencySlice,
  DownloadAssessment: DownloadAssessmentSlice,
  singlePollx: singlePollSlice,
  singlePollxGraph: singlePollGraphSlice,
  EmpInternalStatisticsData: EmpIntStatisticsSlice,
  companySAS: downloadCompSASSlice,
  assessmentDetailsx: getAssessmentDataSlice,
  AssessmentStatistics: AssessmentStatisticsSlice,
  JSAssessmentStatistics: JSAssessmentStatisticsSlice,
  JobPostStatistics: JobPostStaticsSlice,
  JobResponseStatistics: JobPostResponseSlice,
  getJobResponsePost: getJobResponsePostSlice,
  JobPostResponse: JobPostResponseSlice,
  ResumeDatax: ResumeData,
  getNotify: getNotificationSlice,
  viewNotify: viewNotificationSlice,
  PostJSPrivateDb: postjsPrivateDB,
  FetchJSPrivateDb: fetchjsPrivateDB,
  EducationDeletex: EducationDeleteSlice,
  EducationPatchx: EducationPatchSlice,
  EducationPostx: EducationPostSlice,
  FetchIJPRJP: FetchIJPRJPSlice,
  TermsAndCondition: termsAndConditionSlice,
  GetTermsAndCondition: getTermsAndConditionSlice,
  assessmentTread: assessmentTredSlice,
  intJobApplicants: IntTotalJobsApplicantsSlice,
  DeleteTemplateSlicex: DeleteTemplateSlice,
  PostIntAppData: PostIntAppSlice,
  fetchValidJobData: fetchValidJobSlice,
  deleteResumePrivateDB: privatedbdeleteSlice,
  DownloadUserInfoData: DownloadUserInfoSlice,
  TotalDownloadCsvFileData: TotalDownloadCsvFileSlice,
  AddUserLimitData: AddUserLimitSlice,
  AddMasterdataLimitData: commonMasterDataLimitSlice,
  TermsSettings: patchTermsAndConditionSlice,
  TermsGetSettings: getTermsSettingsSlice,
  EmailNotification: setEmailNotificationSlice1,
});
