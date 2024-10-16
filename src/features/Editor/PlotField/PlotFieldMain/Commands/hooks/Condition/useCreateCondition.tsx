import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type CreateConditionTypes = {
  plotFieldCommandId: string;
  episodeId: string;
};

type CreateConditionOnMutation = {
  coordinatesX: number;
  coordinatesY: number;
  targetBlockId: string;
  topologyBlockId: string;
  sourceBlockName: string;
  conditionBlockId: string;
};

export default function useCreateCondition({
  plotFieldCommandId,
  episodeId,
}: CreateConditionTypes) {
  return useMutation({
    mutationFn: async ({
      coordinatesX,
      coordinatesY,
      sourceBlockName,
      targetBlockId,
      topologyBlockId,
      conditionBlockId,
    }: CreateConditionOnMutation) =>
      await axiosCustomized.post(
        `/plotFieldCommands/${plotFieldCommandId}/episodes/${episodeId}/conditions`,
        {
          coordinatesX,
          coordinatesY,
          sourceBlockName,
          targetBlockId,
          topologyBlockId,
          conditionBlockId,
        }
      ),
  });
}
