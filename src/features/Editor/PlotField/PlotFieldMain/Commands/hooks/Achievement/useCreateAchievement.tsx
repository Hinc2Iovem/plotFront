import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type CreateAchievementTypes = {
  storyId: string;
  plotFieldCommandId: string;
  topologyBlockId: string;
};

export default function useCreateAchievement({
  topologyBlockId,
  plotFieldCommandId,
  storyId,
}: CreateAchievementTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.post(
        `/achievements/${plotFieldCommandId}/topologyBlocks/${topologyBlockId}/translations`,
        {
          storyId,
        }
      ),
  });
}
