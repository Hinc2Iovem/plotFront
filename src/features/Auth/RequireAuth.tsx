import { Navigate, Outlet, useLocation } from "react-router-dom";
import { JwtPayload, jwtDecode } from "jwt-decode";
import useAuth from "../../hooks/Auth/useAuth";
import { StaffRoles } from "../../types/Staff/StaffTypes";

type RequireAuthTypes = {
  allowedRoles: StaffRoles[];
};

export interface DecodedTypes extends JwtPayload {
  StaffInfo: {
    username: string;
    userId: string;
    roles: StaffRoles[];
  };
}

export default function RequireAuth({ allowedRoles }: RequireAuthTypes) {
  const { token } = useAuth();
  const location = useLocation();
  const decoded = token?.accessToken
    ? jwtDecode<DecodedTypes>(token.accessToken)
    : undefined;
  const roles: StaffRoles[] = decoded?.StaffInfo?.roles || [];

  return roles?.find((role) => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : token?.accessToken ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/auth/login" state={{ from: location }} replace />
  );
}
