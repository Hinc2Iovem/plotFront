import { useParams } from "react-router-dom";
import useCreateCommandAchievement from "../../../../../features/Editor/PlotField/hooks/Achievement/useCreateCommandAchievement";
import useHandleCreatingViaKeyCombinationProcess from "./shared/useHandleCreatingViaKeyCombinationProcess";
import { CreateViaKeyCombinationOnMutation } from "../createViaKeyCombinationTypes";

type CreateAchievementViaKeyCombinationTypes = {
  topologyBlockId: string;
};

export default function useCreateAchievementViaKeyCombination({
  topologyBlockId,
}: CreateAchievementViaKeyCombinationTypes) {
  const { storyId } = useParams();

  const createAchievement = useCreateCommandAchievement({
    storyId: storyId || "",
    language: "russian",
  });

  useHandleCreatingViaKeyCombinationProcess<CreateViaKeyCombinationOnMutation>({
    createCommand: createAchievement,
    firstEngLetter: "a",
    secondEngLetter: "c",
    firstRusLetter: "ф",
    secondRusLetter: "с",
    topologyBlockId,
    commandName: "achievement",
  });
}
