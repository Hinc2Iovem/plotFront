import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { StaffInfoTypes } from "../../../types/Staff/StaffTypes";

export default function useGetStaffInfoById({ staffId }: { staffId: string }) {
  return useQuery({
    queryKey: ["staff", staffId, "staffInfo"],
    queryFn: async () =>
      await axiosCustomized
        .get<StaffInfoTypes>(`/staff/${staffId}/staffInfo`)
        .then((r) => r.data),
    enabled: !!staffId,
  });
}
