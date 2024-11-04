import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type CreateConditionTypes = {
  plotFieldCommandId?: string;
  episodeId: string;
};

type CreateConditionOnMutation = {
  coordinatesX: number;
  coordinatesY: number;
  targetBlockId: string;
  topologyBlockId: string;
  sourceBlockName: string;
  conditionBlockId: string;
  plotfieldCommandId?: string;
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
      plotfieldCommandId,
    }: CreateConditionOnMutation) => {
      const commandId = plotFieldCommandId?.trim().length
        ? plotFieldCommandId
        : plotfieldCommandId;

      await axiosCustomized.post(
        `/plotFieldCommands/${commandId}/episodes/${episodeId}/conditions`,
        {
          coordinatesX,
          coordinatesY,
          sourceBlockName,
          targetBlockId,
          topologyBlockId,
          conditionBlockId,
        }
      );
    },
  });
}
