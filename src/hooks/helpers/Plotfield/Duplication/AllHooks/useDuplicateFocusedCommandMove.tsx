import { useParams } from "react-router-dom";
import useCreateMoveDuplicate from "../../../../../features/Editor/PlotField/hooks/duplicates/useCreateMoveDuplicate";
import useHandleDuplicationProcess from "./shared/useHandleDuplicationProcess";

type DuplicateFocusedCommandMoveTypes = {
  topologyBlockId: string;
};

export default function useDuplicateFocusedCommandMove({ topologyBlockId }: DuplicateFocusedCommandMoveTypes) {
  const { episodeId } = useParams();
  const createMove = useCreateMoveDuplicate({
    topologyBlockId,
    episodeId: episodeId || "",
  });

  useHandleDuplicationProcess({
    commandName: "move",
    createCommand: createMove,
    episodeId: episodeId || "",
    topologyBlockId,
  });
}
