import { Navigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
const PrivateRoute = ({
  children,
  roles,
  permission,
}: {
  children: JSX.Element;
  roles: any;
  permission?: any;
}) => {
  const userRole = () => {
    let decodedToken: any = jwtDecode(sessionStorage.getItem("access_token")!);
    return decodedToken.roles;
  };
  const isAuthenticated = sessionStorage.getItem("access_token") ? true : false;

  let decodedToken: any = sessionStorage.getItem("access_token")
    ? jwtDecode(sessionStorage.getItem("access_token")!)
    : "";
  // const userHasRequiredRole = roles[0] === decodedToken.roles[0] ? true : false;
  const userHasRequiredRole = roles.includes(
    decodedToken ? decodedToken.roles[0] : ""
  )
    ? true
    : false;

  let userHasRequiredPermission: boolean = false;
  if (decodedToken && userHasRequiredRole && permission) {
    userHasRequiredPermission = decodedToken?.permission?.includes(
      ...permission
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/Error401"></Navigate>;
  }

  if (isAuthenticated && !userHasRequiredRole) {
    return <Navigate to="/Error403" />;
  }

  if (isAuthenticated && permission && !userHasRequiredPermission) {
    return <Navigate to="/Error403" />;
  }

  return children;
};
export default PrivateRoute;
