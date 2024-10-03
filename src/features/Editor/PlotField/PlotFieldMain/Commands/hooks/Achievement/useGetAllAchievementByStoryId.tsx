import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { AchievementTypes } from "../../../../../../../types/StoryEditor/PlotField/Achievement/AchievementTypes";

type GetAllAchievementsTypes = {
  storyId: string;
};

export default function useGetAllAchievementByStoryId({
  storyId,
}: GetAllAchievementsTypes) {
  return useQuery({
    queryKey: ["story", storyId, "achievements"],
    queryFn: async () =>
      await axiosCustomized
        .get<AchievementTypes[]>(`/stories/${storyId}/achievements`)
        .then((r) => r.data),
    enabled: !!storyId,
  });
}
