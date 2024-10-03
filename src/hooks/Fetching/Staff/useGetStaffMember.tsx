import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { StaffMemberTypes } from "../../../types/Staff/StaffTypes";

export default function useGetStaffMember({ staffId }: { staffId: string }) {
  return useQuery({
    queryKey: ["staff", staffId],
    queryFn: async () =>
      await axiosCustomized
        .get<StaffMemberTypes>(`/staff/${staffId}`)
        .then((r) => r.data),
    enabled: !!staffId,
  });
}
