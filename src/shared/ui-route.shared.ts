export const enum UI_ROUTES {
  //#region Auth layout
  R001 = "/home",
  R002 = "/jobs/public/previewjob/",
  R003 = "/public/faq",
  R004 = "/public/quick-contact",
  //#endregion Auth layout

  //#region no layout
  R005 = "/jobSeekerSignin",
  R006 = "/forgotPassword",
  R007 = "/employerverifications",
  R008 = "/employerSignin",
  R009 = "/employerregister",
  R010 = "/jobseekerregister",
  R011 = "/ijapply",
  R012 = "/adminSignin",
  R013 = "/loader",
  R036 = "/runway",
  R037 = "/Error404",
  R038 = "/Error400",
  R039 = "/Error401",
  R040 = "/Error500",
  R041 = "/Error403",
  R042 = "*",
  R064 = "/termsandcondition",
  R065 = "/privacypolicy",
  R066 = "/consent",
  //#endregion no layout

  //#region Main layout
  R014 = "/js/selfAssessment",
  R015 = "/js/certificateCard",
  R016 = "/js/paymentStatus",
  R017 = "/js/assessmentPreview",
  R018 = "/jobseekerdashboard",
  R019 = "/changePassword",
  R020 = "/jobseekerProfile",
  R021 = "/pendingAction",
  R022 = "/jobs/savedjobs",
  R023 = "/jobs/appliedjobs",
  R024 = "/jobs/joblisting",
  R025 = "/jobs/js/previewjob",
  //#endregion Main layout

  //#region Admin layout
  R026 = "/SuperAdmin/UserManagement",
  R027 = "/admin/faq",
  R028 = "/admin/manageContact",
  R029 = "/admin/ticketManagement",
  R030 = "/adminDashboard",
  R031 = "/admin/AssessmentManage",
  R032 = "/admin/addAssessment",
  R033 = "/admin/employerRegistration",
  R034 = "/admin/jobSeekerRegistration",
  R035 = "/admin/polls",
  R063 = "/admin/TermsAndCondition",
  //#endregion Admin layout

  //#region Emp layout
  R043 = "/postjob/privatejob",
  R044 = "/postjob/hotjob",
  R045 = "/jobs/previewjob",
  R046 = "/empDashboard",
  R047 = "/jobs/manage-hot-private",
  R048 = "/employer/companyprofile",
  R049 = "/employer/employerprofile",
  R050 = "/employer/changePassword",
  R051 = "/jobs/applications",
  R052 = "/jobs/ijp-rjp-applications",
  R053 = "/jobs/advanceFilter",
  R054 = "/employer/jsProfilePreview",
  R055 = "/employer/jsProfile",
  R056 = "/postjob/internaljob",
  R057 = "/employer/userManagement",
  R058 = "/postjob/referaljob",
  R059 = "/employer/manage-ijp-rjp",
  R060 = "/inrjobs/applicantpreview",
  R061 = "/jobs/inr/previewjob",
  R062 = "/privatejsprofile",
  //#endregion Emp layout
}

export const getUI_ROUTES = (value: UI_ROUTES) => {
  try {
    const selectedEnum = eval(`UI_ROUTES.${value}`);
    return selectedEnum;
  } catch (error) {
    return new Error("Invalid enum name");
  }
};
