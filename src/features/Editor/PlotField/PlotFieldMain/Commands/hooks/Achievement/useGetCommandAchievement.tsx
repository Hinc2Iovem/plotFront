import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { AchievementTypes } from "../../../../../../../types/StoryEditor/PlotField/Achievement/AchievementTypes";

type GetCommandAchievementTypes = {
  plotFieldCommandId: string;
};

export default function useGetCommandAchievement({
  plotFieldCommandId,
}: GetCommandAchievementTypes) {
  return useQuery({
    queryKey: ["plotfieldCommand", plotFieldCommandId, "achievement"],
    queryFn: async () =>
      await axiosCustomized
        .get<AchievementTypes>(
          `/stories/plotFieldCommands/${plotFieldCommandId}/achievements`
        )
        .then((r) => r.data),
    enabled: !!plotFieldCommandId,
  });
}
