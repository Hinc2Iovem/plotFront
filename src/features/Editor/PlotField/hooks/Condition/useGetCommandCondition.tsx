import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { ConditionTypes } from "../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";

type GetCommandConditionTypes = {
  plotFieldCommandId: string;
};

export default function useGetCommandCondition({ plotFieldCommandId }: GetCommandConditionTypes) {
  return useQuery({
    queryKey: ["plotfieldCommand", plotFieldCommandId, "condition"],
    queryFn: async () =>
      await axiosCustomized
        .get<ConditionTypes>(`/plotFieldCommands/${plotFieldCommandId}/conditions`)
        .then((r) => r.data),
    enabled: !!plotFieldCommandId,
  });
}
