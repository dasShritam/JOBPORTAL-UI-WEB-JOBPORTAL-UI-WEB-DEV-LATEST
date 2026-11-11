import { Suspense, lazy } from "react";
import { Navigate, RouteObject, useRoutes } from "react-router-dom";
import {
  ADMIN_PERMISSIONS,
  EMP_PERMISSIONS,
  RoleGroup,
  RoleType,
} from "./roles";
import ManageContactInfo from "../components/admin/support/ManageContactInfo";
import FaqPreview from "../components/admin/faq/FaqPreview";
import FAQ from "../components/admin/faq/FAQ";
import AuthLayout from "../components/authentication/auth-layout/Authlayout";
import AdminLogin from "../components/authentication/sign-in/adminLogin";
import ChangePassword from "../components/authentication/change-Password/ChangePassword";
import JobSeekerProfile from "../components/manage-account/profiles/jobseeker/JobSeekerProfile";
import AdminDashboard from "../components/dashboard/AdminDashboard";
import EmployerRegister from "../components/manage-account/registrations/EmployerRegister";
import JobSeekerRegister from "../components/manage-account/registrations/JobSeekerRegister";
import MainLayout from "../components/common/Layout/mainLayout/MainLayout";
import AdminLayout from "../components/common/Layout/adminLayout/AdminLayout";
import ForgotPassword from "../components/authentication/change-Password/ForgotPassword";
import Runway from "../components/authentication/runway/runway";
import ErrorPage404 from "../components/error-pages/ErrorPage404";
import ErrorPage400 from "../components/error-pages/ErrorPage400";
import ErrorPage401 from "../components/error-pages/ErrorPage401";
import ErrorPage500 from "../components/error-pages/ErrorPage500";
import ErrorPage403 from "../components/error-pages/ErrorPage403";
import PrivateRoute from "./PrivateRoute";
import SetPassword from "../components/manage-account/registrations/EmployerSetPassword";
import EmployerRegistration from "../components/admin/registration/employerRegistration";
import JobSeekerRegistration from "../components/admin/registration/jobSeekerRegistration";
import PendingAction from "../components/manage-account/profiles/jobseeker/PendingAction";
import PrivateJob from "../components/jobs/job-post/private-job/PrivateJob";
import EmpLayout from "../components/common/Layout/employerLayout/EmpLayout";
import JobPreview from "../components/jobs/job-preview/JobPreview";
import ManageJobs from "../components/jobs/manage-jobs/ManageJobs";
import Applications from "../components/jobs/job-applications/Applications";
import JsProfilePreview from "../components/employer/js-profile/jsProfilePreview";
import JobListingMain from "../components/jobs/job-lisiting/JobListingMain";
import SavedJobs from "../components/jobs/saved-jobs/SavedJobs";
import AppliedJobs from "../components/jobs/applied-jobs/AppliedJobs";
import JobSeekerPreview from "../components/employer/js-profile/js-view/JobSeekerPreview";
import AdvanceSearchResult from "../components/employer/advanced-filter/AdvanceSearchResult";
import JobSeekerDashboard from "../components/dashboard/JobSeekerDashboard";
import TicketManagement from "../components/admin/support/TicketManagement";
import SelfAssessment from "../components/jobSeeker/selfAssessment/SelfAssessment";
import ManagePolls from "../components/admin/polls/ManagePolls";
import NativeUserList from "../components/superAdmin/nativeUserList";
import IJPApply from "../components/jobs/job-post/internal_ref_job/IJPApply";
import EmployerManageUser from "../components/employer/EmployerManageUser/EmployerManageUser";
import ManageJobsRjpIjp from "../components/jobs/manage-jobs/manage-ijp-rjp-jobs/ManageJobs";
import AssessmentViewAndAction from "../components/jobSeeker/selfAssessment/AssemnetViewAndAction";
import IjpRjpApplications from "../components/jobs/job-applications/ijp-rjp-jobs-applications/IjpRjpApplications";
import InrRefApplicantPreview from "../components/employer/inr-ref-applicants/InrRefApplicantPreview";
import PaymentStatus from "../components/jobSeeker/selfAssessment/PaymentStatus";
import EmployerProfile from "../components/manage-account/profiles/employer/employer-profile/EmployerProfile";
import MainAssessment from "../components/admin/assessManage/mainAssessment";
import AddAssessment from "../components/admin/assessManage/AddAssessment";
import QuickContact from "../components/admin/support/QuickContact";
import CertificateCard from "../components/jobSeeker/selfAssessment/certificateCard";
import CompanyProfile from "../components/manage-account/profiles/employer/CompanyProfile";
import JobSeekerLogin from "../components/authentication/sign-in/jobSeekerLogin";
import EmployerLogin from "../components/authentication/sign-in/employerLogin";
import InternalJobView from "../components/jobs/job-preview/internal-job/InternalJobView";
import EmployerDashboard from "../components/dashboard/EmployerDashboard";
import { UI_ROUTES } from "../shared/ui-route.shared";
import TermsAndCondition from "../components/admin/support/TermsAndCondition";
import TermsAndConditions from "../components/common/public/TermsAndConditions";
import PrivacyPolicy from "../components/common/public/PrivacyPolicy";
import Consent from "../components/common/public/Consent";
import PrivateJsProfile from "../components/employer/private-js-profile/private-js-profile";
import { environment } from "../environments/environment";

const Home = lazy(() => import("../components/common/Landing/Homepage"));
const InternalOrReferalJob = lazy(
  () =>
    import("../components/jobs/job-post/internal_ref_job/InternalOrReferalJob")
);

const AppRoutes = () => {
  const homeRoutes: RouteObject = {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: UI_ROUTES.R001, element: <Home /> },
      { path: "", element: <Navigate to={UI_ROUTES.R001} /> },
      {
        path: `${UI_ROUTES.R002}:id`,
        element: <JobPreview />,
      },
    ],
  };

  const publicRoutes: RouteObject = {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: UI_ROUTES.R003,
        element: <FaqPreview />,
      },
      {
        path: UI_ROUTES.R004,
        element: <QuickContact />,
      },
    ],
  };

  const LoginRoutes: RouteObject = {
    path: "/",
    children: [
      {
        path: UI_ROUTES.R005,
        element: <JobSeekerLogin />,
      },
      {
        path: UI_ROUTES.R006,
        element: <ForgotPassword />,
      },
      {
        path: UI_ROUTES.R007,
        element: <SetPassword />,
      },
      {
        path: UI_ROUTES.R008,
        element: <EmployerLogin />,
      },
      {
        path: UI_ROUTES.R009,
        element: <EmployerRegister />,
      },
      {
        path: UI_ROUTES.R010,
        element: <JobSeekerRegister />,
      },
      {
        path: `${UI_ROUTES.R011}/:id`,
        element: <IJPApply />,
      },
      {
        path: `${UI_ROUTES.R064}`,
        element: <TermsAndConditions />,
      },
      {
        path: `${UI_ROUTES.R065}`,
        element: <PrivacyPolicy />,
      },
      {
        path: `${UI_ROUTES.R066}`,
        element: <Consent />,
      },
    ],
  };

  // const JSLoginRoutes: RouteObject = {
  //   path: "/",
  //   children: [
  //     {
  //       path: "/jslogin",
  //       element: <JobSeekerLogin />,
  //     },
  //     {
  //       path: "/employerSignin",
  //       element: <EmployerLogin />,
  //     },
  //     {
  //       path: "/employerregister",
  //       element: <EmployerRegister />,
  //     },
  //     {
  //       path: "/jobseekerregister",
  //       element: <JobSeekerRegister />,
  //     },
  //   ],
  // };

  const AdminLoginRoutes: RouteObject = {
    path: "/",
    children: [
      {
        path: UI_ROUTES.R012,
        element: <AdminLogin />,
      },
    ],
  };

  const RegisterRoutes: RouteObject = {
    path: "/",
    element: <AuthLayout />,
    children: [
      // {
      //   path: "/employerregister",
      //   element: <EmployerRegister />,
      // },
      // {
      //   path: "/jobseekerregister",
      //   element: <JobSeekerRegister />,
      // },
    ],
  };

  const JobSeekerRoutes: RouteObject = {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: environment?.HackerEarth ? UI_ROUTES.R014 : UI_ROUTES.R037,
        element: (
          <PrivateRoute roles={[RoleType.JOBSEEKER]}>
            <SelfAssessment />
          </PrivateRoute>
        ),
      },
      {
        path: `${UI_ROUTES.R015}/:id?`,
        element: (
          <PrivateRoute roles={[RoleType.JOBSEEKER]}>
            <CertificateCard />
          </PrivateRoute>
        ),
      },
      {
        path: UI_ROUTES.R016,
        element: (
          <PrivateRoute roles={[RoleType.JOBSEEKER]}>
            <PaymentStatus />
          </PrivateRoute>
        ),
      },
      {
        path: `${UI_ROUTES.R017}/:id?`,
        element: (
          <PrivateRoute roles={[RoleType.JOBSEEKER]}>
            <AssessmentViewAndAction />
          </PrivateRoute>
        ),
      },
      {
        path: UI_ROUTES.R018,
        element: (
          <PrivateRoute roles={[RoleType.JOBSEEKER]}>
            <JobSeekerDashboard />
          </PrivateRoute>
        ),
      },
      {
        path: UI_ROUTES.R019,
        element: <ChangePassword />,
      },
    ],
  };

  const ProfileRoutes: RouteObject = {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: UI_ROUTES.R020,
        element: (
          <PrivateRoute roles={[RoleType.JOBSEEKER]}>
            <JobSeekerProfile />
          </PrivateRoute>
        ),
      },

      {
        path: UI_ROUTES.R021,
        element: (
          <PrivateRoute roles={[RoleType.JOBSEEKER]}>
            <PendingAction />
          </PrivateRoute>
        ),
      },
      {
        path: UI_ROUTES.R022,
        element: (
          <PrivateRoute roles={[RoleType.JOBSEEKER]}>
            <SavedJobs />
          </PrivateRoute>
        ),
      },
      {
        path: `${UI_ROUTES.R023}/:id?`,
        element: (
          <PrivateRoute roles={[RoleType.JOBSEEKER]}>
            <AppliedJobs />
          </PrivateRoute>
        ),
      },
      {
        path: UI_ROUTES.R024,
        element: (
          <PrivateRoute roles={[RoleType.JOBSEEKER]}>
            <JobListingMain />
          </PrivateRoute>
        ),
      },
      {
        path: `${UI_ROUTES.R025}/:id?`,
        element: (
          <PrivateRoute roles={[...RoleGroup.EMP_ADMIN_RECRUITER_JS]}>
            <JobPreview />
          </PrivateRoute>
        ),
      },
    ],
  };

  const SuperAdminRoutes: RouteObject = {
    path: "/",
    element: <AdminLayout />,
    children: [
      {
        path: UI_ROUTES.R026,
        element: (
          <PrivateRoute roles={[RoleType.SUPER_ADMINISTRATOR]}>
            <NativeUserList />
          </PrivateRoute>
        ),
      },
      // {
      //   path: "admin/changePassword",
      //   element: <ChangePassword />,
      // },
      {
        path: UI_ROUTES.R027,
        element: (
          <PrivateRoute
            roles={[...RoleGroup.ADMIN_SUPERADMIN]}
            permission={[ADMIN_PERMISSIONS.FAQM]}
          >
            <FAQ />
          </PrivateRoute>
        ),
      },
      {
        path: UI_ROUTES.R028,
        element: (
          <PrivateRoute
            roles={[...RoleGroup.ADMIN_SUPERADMIN]}
            permission={[ADMIN_PERMISSIONS.CM]}
          >
            <ManageContactInfo />
          </PrivateRoute>
        ),
      },
      {
        path: UI_ROUTES.R063,
        element: (
          <PrivateRoute
            roles={[...RoleGroup.ADMIN_SUPERADMIN]}
            permission={[ADMIN_PERMISSIONS.TP]}
          >
            <TermsAndCondition />
          </PrivateRoute>
        ),
      },
      {
        path: UI_ROUTES.R029,
        element: (
          <PrivateRoute
            roles={[...RoleGroup.ADMIN_SUPERADMIN]}
            permission={[ADMIN_PERMISSIONS.CSM]}
          >
            <TicketManagement />
          </PrivateRoute>
        ),
      },
      {
        path: UI_ROUTES.R030,
        element: (
          <PrivateRoute roles={[...RoleGroup.ADMIN_SUPERADMIN]}>
            <AdminDashboard />
          </PrivateRoute>
        ),
      },
      {
        path: environment?.HackerEarth ? UI_ROUTES.R031 : UI_ROUTES.R037,
        element: (
          <PrivateRoute
            roles={[...RoleGroup.ADMIN_SUPERADMIN]}
            permission={[ADMIN_PERMISSIONS.AM]}
          >
            <MainAssessment />
          </PrivateRoute>
        ),
      },
      {
        path: UI_ROUTES.R032,
        element: (
          <PrivateRoute
            roles={[...RoleGroup.ADMIN_SUPERADMIN]}
            permission={[ADMIN_PERMISSIONS.AM]}
          >
            <AddAssessment />
          </PrivateRoute>
        ),
      },
      {
        path: UI_ROUTES.R033,
        element: (
          <PrivateRoute roles={[...RoleGroup.ADMIN_SUPERADMIN]}>
            <EmployerRegistration />
          </PrivateRoute>
        ),
      },
      {
        path: UI_ROUTES.R034,
        element: (
          <PrivateRoute roles={[...RoleGroup.ADMIN_SUPERADMIN]}>
            <JobSeekerRegistration />
          </PrivateRoute>
        ),
      },
      {
        path: UI_ROUTES.R035,
        element: (
          <PrivateRoute
            roles={[...RoleGroup.ADMIN_SUPERADMIN]}
            permission={[ADMIN_PERMISSIONS.PM]}
          >
            <ManagePolls />
          </PrivateRoute>
        ),
      },
    ],
  };
  const RunwayRoutes: RouteObject = {
    path: "/",
    children: [{ path: UI_ROUTES.R036, element: <Runway /> }],
  };

  const ErrorRoutes: RouteObject = {
    path: "",
    children: [
      { path: UI_ROUTES.R037, element: <ErrorPage404 /> },
      { path: UI_ROUTES.R038, element: <ErrorPage400 /> },
      { path: UI_ROUTES.R039, element: <ErrorPage401 /> },
      { path: UI_ROUTES.R040, element: <ErrorPage500 /> },
      { path: UI_ROUTES.R041, element: <ErrorPage403 /> },
      { path: UI_ROUTES.R042, element: <ErrorPage404 /> },
    ],
  };

  const EmployerRoutes: RouteObject = {
    path: "/",
    element: <EmpLayout />,
    children: [
      {
        path: `${UI_ROUTES.R043}/:id?`,
        element: (
          <PrivateRoute
            roles={[...RoleGroup.EMP_ADMIN_RECRUITER]}
            permission={[EMP_PERMISSIONS.MEJ]}
          >
            <PrivateJob />
          </PrivateRoute>
        ),
      },
      {
        path: `${UI_ROUTES.R044}/:id?`,
        element: (
          <PrivateRoute
            roles={[...RoleGroup.EMP_ADMIN_RECRUITER]}
            permission={[EMP_PERMISSIONS.MEJ]}
          >
            <PrivateJob />
          </PrivateRoute>
        ),
      },
      {
        path: `${UI_ROUTES.R045}/:id?`,
        element: (
          <PrivateRoute roles={[...RoleGroup.EMP_ADMIN_RECRUITER]}>
            <JobPreview />
          </PrivateRoute>
        ),
      },
      {
        path: UI_ROUTES.R046,
        element: (
          <PrivateRoute roles={[...RoleGroup.EMP_ADMIN_RECRUITER]}>
            <EmployerDashboard />
          </PrivateRoute>
        ),
      },
      {
        path: UI_ROUTES.R047,
        element: (
          <PrivateRoute
            roles={[...RoleGroup.EMP_ADMIN_RECRUITER]}
            permission={[EMP_PERMISSIONS.MEJ]}
          >
            <ManageJobs />
          </PrivateRoute>
        ),
      },
      {
        path: UI_ROUTES.R048,
        element: (
          <PrivateRoute roles={[...RoleGroup.EMP_ADMIN_RECRUITER]}>
            <CompanyProfile />
          </PrivateRoute>
        ),
      },
      {
        path: UI_ROUTES.R049,
        element: (
          <PrivateRoute roles={[...RoleGroup.EMP_ADMIN_RECRUITER]}>
            <EmployerProfile />
          </PrivateRoute>
        ),
      },
      {
        path: UI_ROUTES.R050,
        element: <ChangePassword />,
      },
      {
        path: UI_ROUTES.R051,
        element: (
          <PrivateRoute
            roles={[...RoleGroup.EMP_ADMIN_RECRUITER]}
            permission={[EMP_PERMISSIONS.MEJ]}
          >
            <Applications />
          </PrivateRoute>
        ),
      },
      {
        path: UI_ROUTES.R052,
        element: (
          <PrivateRoute
            roles={[...RoleGroup.EMP_ADMIN_RECRUITER]}
            permission={[EMP_PERMISSIONS.MIJ]}
          >
            <IjpRjpApplications />
          </PrivateRoute>
        ),
      },
      {
        path: UI_ROUTES.R053,
        element: (
          <PrivateRoute roles={[...RoleGroup.EMP_ADMIN_RECRUITER]}>
            <AdvanceSearchResult />
          </PrivateRoute>
        ),
      },
      {
        path: UI_ROUTES.R054,
        element: (
          <PrivateRoute roles={[...RoleGroup.EMP_ADMIN_RECRUITER]}>
            <JsProfilePreview />
          </PrivateRoute>
        ),
      },

      {
        path: `${UI_ROUTES.R055}/:id`,
        element: (
          <PrivateRoute roles={[...RoleGroup.EMP_ADMIN_RECRUITER]}>
            <JobSeekerPreview />
          </PrivateRoute>
        ),
      },
      {
        path: `${UI_ROUTES.R056}/:id?`,
        element: (
          <PrivateRoute
            roles={[...RoleGroup.EMP_ADMIN_RECRUITER]}
            permission={[EMP_PERMISSIONS.MIJ]}
          >
            <InternalOrReferalJob />
          </PrivateRoute>
        ),
      },
      {
        path: UI_ROUTES.R057,
        element: (
          <PrivateRoute roles={[RoleType.EMPLOYER_ADMINISTRATOR]}>
            <EmployerManageUser />
          </PrivateRoute>
        ),
      },
      {
        path: `${UI_ROUTES.R058}/:id?`,
        element: (
          <PrivateRoute
            roles={[...RoleGroup.EMP_ADMIN_RECRUITER]}
            permission={[EMP_PERMISSIONS.MIJ]}
          >
            <InternalOrReferalJob />
          </PrivateRoute>
        ),
      },
      {
        path: UI_ROUTES.R059,

        element: (
          <PrivateRoute
            roles={[...RoleGroup.EMP_ADMIN_RECRUITER]}
            permission={[EMP_PERMISSIONS.MIJ]}
          >
            <ManageJobsRjpIjp />
          </PrivateRoute>
        ),
      },
      {
        path: `${UI_ROUTES.R060}/:id`,

        element: (
          <PrivateRoute
            roles={[...RoleGroup.EMP_ADMIN_RECRUITER]}
            permission={[EMP_PERMISSIONS.MIJ]}
          >
            <InrRefApplicantPreview />
          </PrivateRoute>
        ),
      },
      {
        path: `${UI_ROUTES.R061}/:id`,
        element: (
          <PrivateRoute roles={[...RoleGroup.EMP_ADMIN_RECRUITER]}>
            <InternalJobView />
          </PrivateRoute>
        ),
      },
      {
        path: UI_ROUTES.R062,
        element: (
          <PrivateRoute roles={[...RoleGroup.EMP_ADMIN_RECRUITER]}>
            <PrivateJsProfile />
          </PrivateRoute>
        ),
      },
    ],
  };

  const router = useRoutes([
    homeRoutes,
    LoginRoutes,
    AdminLoginRoutes,
    RegisterRoutes,
    ProfileRoutes,
    RunwayRoutes,
    ErrorRoutes,
    EmployerRoutes,
    publicRoutes,
    SuperAdminRoutes,
    JobSeekerRoutes,
    // JSLoginRoutes,
  ]);
  return <Suspense>{router}</Suspense>;
};

export default AppRoutes;
