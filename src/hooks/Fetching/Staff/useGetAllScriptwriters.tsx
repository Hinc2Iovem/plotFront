import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { StaffMemberTypes } from "../../../types/Staff/StaffTypes";

export default function useGetAllScriptwriters() {
  return useQuery({
    queryKey: ["staff", "scriptwriters"],
    queryFn: async () => await axiosCustomized.get<StaffMemberTypes[]>(`/staff/scriptwriters`).then((r) => r.data),
  });
}
