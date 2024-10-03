import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { EpisodeStatusTypes } from "../../../types/StoryData/Episode/EpisodeTypes";

type UpdateStaffStoryStatusTypes = {
  storyId: string;
  staffId: string;
};
type UpdateStaffStoryStatusOnMutationTypes = {
  storyStatus: EpisodeStatusTypes;
};

export default function useUpdateStaffStoryStatus({
  storyId,
  staffId,
}: UpdateStaffStoryStatusTypes) {
  return useMutation({
    mutationFn: async ({
      storyStatus,
    }: UpdateStaffStoryStatusOnMutationTypes) =>
      await axiosCustomized.patch(
        `/stories/${storyId}/staff/${staffId}/status`,
        {
          storyStatus,
        }
      ),
  });
}
