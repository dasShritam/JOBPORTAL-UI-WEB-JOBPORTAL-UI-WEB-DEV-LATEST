export enum RoleType {
  ADMINISTRATOR = "ADMINISTRATOR",
  SUPER_ADMINISTRATOR = "SUPER ADMINISTRATOR",
  EMPLOYER_ADMINISTRATOR = "EMPLOYER ADMINISTRATOR",
  RECRUITER = "RECRUITER",
  JOBSEEKER = "JOBSEEKER",
}

export enum EMP_PERMISSIONS {
  MIJ = "MIJ", //Manage Internal Jobs
  MEJ = "MEJ", //Manage External Jobs
}

export enum ADMIN_PERMISSIONS {
  FAQM = "FAQM", //Frequently Asked Questions Management
  CSM = "CSM", //Customer Support Management
  CM = "CM", //Contact Management
  AM = "AM", //Assessment Management
  PM = "PM", //Poll Management
  TP = "TP", //Terms&condition and Privacy policy
}

export class RoleGroup {
  static readonly ALL_ROLES: RoleType[] = [
    RoleType.ADMINISTRATOR,
    RoleType.SUPER_ADMINISTRATOR,
    RoleType.JOBSEEKER,
    RoleType.EMPLOYER_ADMINISTRATOR,
    RoleType.RECRUITER,
  ];

  static readonly JOBSEEKER: RoleType[] = [RoleType.JOBSEEKER];

  static readonly ADMIN_SUPERADMIN: RoleType[] = [
    RoleType.ADMINISTRATOR,
    RoleType.SUPER_ADMINISTRATOR,
  ];

  static readonly EMP_ADMIN_RECRUITER: RoleType[] = [
    RoleType.EMPLOYER_ADMINISTRATOR,
    RoleType.RECRUITER,
  ];

  static readonly EMP_ADMIN_RECRUITER_JS: RoleType[] = [
    RoleType.EMPLOYER_ADMINISTRATOR,
    RoleType.RECRUITER,
    RoleType.JOBSEEKER,
  ];
}
