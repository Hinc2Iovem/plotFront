import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type CreateAchievementTypes = {
  storyId: string;
  plotFieldCommandId?: string;
  topologyBlockId: string;
};

export default function useCreateAchievement({
  topologyBlockId,
  plotFieldCommandId,
  storyId,
}: CreateAchievementTypes) {
  return useMutation({
    mutationFn: async ({
      plotfieldCommandId,
    }: {
      plotfieldCommandId?: string;
    }) => {
      const commandId = plotFieldCommandId?.trim().length
        ? plotFieldCommandId
        : plotfieldCommandId;

      await axiosCustomized.post(
        `/achievements/${commandId}/topologyBlocks/${topologyBlockId}/translations`,
        {
          storyId,
        }
      );
    },
  });
}
