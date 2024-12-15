import { useParams } from "react-router-dom";
import useCreateSayDuplicate from "../../../../../features/Editor/PlotField/hooks/duplicates/useCreateSayDuplicate";
import useHandleDuplicationProcess from "./shared/useHandleDuplicationProcess";

type DuplicateFocusedCommandCharacterTypes = {
  topologyBlockId: string;
};

export default function useDuplicateFocusedCommandCharacter({
  topologyBlockId,
}: DuplicateFocusedCommandCharacterTypes) {
  const { episodeId } = useParams();

  const createCharacter = useCreateSayDuplicate({
    topologyBlockId,
    episodeId: episodeId || "",
  });

  useHandleDuplicationProcess({
    commandName: "say",
    createCommand: createCharacter,
    episodeId: episodeId || "",
    topologyBlockId: topologyBlockId,
  });
}
