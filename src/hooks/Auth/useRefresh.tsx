import { axiosCustomized } from "../../api/axios";
import useAuth from "./useAuth";

type GetRefreshTypes = {
  accessToken: string;
};

export default function useRefreshToken() {
  const { setToken } = useAuth();
  const refresh = async () => {
    const res = await axiosCustomized.get<GetRefreshTypes>("/auth/refresh");
    setToken(() => {
      return {
        accessToken: res.data.accessToken,
      };
    });
    return res.data.accessToken;
  };
  return refresh;
}
