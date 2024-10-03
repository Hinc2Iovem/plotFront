import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../../api/axios";
import { ConditionBlockTypes } from "../../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";

type GetConditionBlocksByCommandConditionIdTypes = {
  commandConditionId: string;
};

export default function useGetConditionBlocksByCommandConditionId({
  commandConditionId,
}: GetConditionBlocksByCommandConditionIdTypes) {
  return useQuery({
    queryKey: ["commandCondition", commandConditionId, "conditionBlock"],
    queryFn: async () =>
      await axiosCustomized
        .get<ConditionBlockTypes[]>(
          `/commandConditions/${commandConditionId}/conditionBlocks`
        )
        .then((r) => r.data),
    enabled: !!commandConditionId,
  });
}
