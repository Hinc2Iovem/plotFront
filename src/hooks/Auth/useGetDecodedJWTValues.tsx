import { jwtDecode } from "jwt-decode";
import { DecodedTypes } from "../../features/Auth/RequireAuth";
import useAuth from "./useAuth";

export default function useGetDecodedJWTValues() {
  const { token } = useAuth();
  const decoded = token?.accessToken
    ? jwtDecode<DecodedTypes>(token.accessToken)
    : undefined;
  return {
    roles: decoded?.StaffInfo.roles,
    userId: decoded?.StaffInfo.userId,
    username: decoded?.StaffInfo.username,
  };
}