import { useParams } from "react-router-dom";
import useCreateCutSceneDuplicate from "../../../../../features/Editor/PlotField/hooks/duplicates/useCreateCutSceneDuplicate";
import useHandleDuplicationProcess from "./shared/useHandleDuplicationProcess";

type DuplicateFocusedCommandCutSceneTypes = {
  topologyBlockId: string;
};

export default function useDuplicateFocusedCommandCutScene({ topologyBlockId }: DuplicateFocusedCommandCutSceneTypes) {
  const { episodeId } = useParams();
  const createCutScene = useCreateCutSceneDuplicate({
    topologyBlockId,
    episodeId: episodeId || "",
  });

  useHandleDuplicationProcess({
    commandName: "cutscene",
    createCommand: createCutScene,
    episodeId: episodeId || "",
    topologyBlockId,
  });
}
