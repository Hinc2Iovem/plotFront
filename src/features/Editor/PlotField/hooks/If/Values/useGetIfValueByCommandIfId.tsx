import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";
import { IfValueTypes } from "../../../../../../types/StoryEditor/PlotField/IfCommand/IfCommandTypes";

type GetAllIfValuesByCommandIfIdTypes = {
  ifId: string;
};

export default function useGetAllIfValuesByCommandIfId({
  ifId,
}: GetAllIfValuesByCommandIfIdTypes) {
  return useQuery({
    queryKey: ["commandIf", ifId, "ifValue"],
    queryFn: async () =>
      await axiosCustomized
        .get<IfValueTypes[]>(`/plotFieldCommands/ifs/${ifId}/ifValues`)
        .then((r) => r.data),
    enabled: !!ifId,
  });
}
