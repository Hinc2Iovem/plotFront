import { useParams } from "react-router-dom";
import useCreateAchievementDuplicate from "../../../../../features/Editor/PlotField/hooks/duplicates/useCreateAchievementDuplicate";
import useHandleDuplicationProcess from "./shared/useHandleDuplicationProcess";

type DuplicateFocusedCommandAchievementTypes = {
  topologyBlockId: string;
};

export default function useDuplicateFocusedCommandAchievement({
  topologyBlockId,
}: DuplicateFocusedCommandAchievementTypes) {
  const { storyId, episodeId } = useParams();

  const createAchievement = useCreateAchievementDuplicate({
    storyId: storyId || "",
    topologyBlockId,
    episodeId: episodeId || "",
  });

  useHandleDuplicationProcess({
    commandName: "achievement",
    createCommand: createAchievement,
    episodeId: episodeId || "",
    topologyBlockId,
  });
}
