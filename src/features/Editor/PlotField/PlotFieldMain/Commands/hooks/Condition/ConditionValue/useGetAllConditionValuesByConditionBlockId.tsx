import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../../api/axios";
import { ConditionValueTypes } from "../../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";

type GetGetConditionValueByConditionBlockIdTypes = {
  conditionBlockId: string;
};

export default function useGetConditionValueByConditionBlockId({
  conditionBlockId,
}: GetGetConditionValueByConditionBlockIdTypes) {
  return useQuery({
    queryKey: ["conditionBlock", conditionBlockId, "conditionValue"],
    queryFn: async () =>
      await axiosCustomized
        .get<ConditionValueTypes[]>(
          `/plotFieldCommands/conditionBlocks/${conditionBlockId}/conditionValues`
        )
        .then((r) => r.data),
    enabled: !!conditionBlockId,
  });
}
