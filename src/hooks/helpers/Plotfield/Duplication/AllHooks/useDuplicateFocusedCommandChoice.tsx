import { useParams } from "react-router-dom";
import useCreateChoiceDuplicate from "../../../../../features/Editor/PlotField/hooks/duplicates/useCreateChoiceDuplicate";
import useHandleDuplicationProcess from "./shared/useHandleDuplicationProcess";

type DuplicateFocusedCommandChoiceTypes = {
  topologyBlockId: string;
};

export default function useDuplicateFocusedCommandChoice({ topologyBlockId }: DuplicateFocusedCommandChoiceTypes) {
  const { episodeId } = useParams();
  const createChoice = useCreateChoiceDuplicate({
    topologyBlockId,
    episodeId: episodeId || "",
  });

  useHandleDuplicationProcess({
    commandName: "choice",
    createCommand: createChoice,
    episodeId: episodeId || "",
    topologyBlockId,
  });
}
