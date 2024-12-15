import { useParams } from "react-router-dom";
import useCreateSayDuplicate from "../../../../../features/Editor/PlotField/hooks/duplicates/useCreateSayDuplicate";
import useHandleDuplicationProcess from "./shared/useHandleDuplicationProcess";

type DuplicateFocusedCommandHintTypes = {
  topologyBlockId: string;
};

export default function useDuplicateFocusedCommandHint({ topologyBlockId }: DuplicateFocusedCommandHintTypes) {
  const { episodeId } = useParams();

  const createHint = useCreateSayDuplicate({
    topologyBlockId,
    episodeId: episodeId || "",
  });

  useHandleDuplicationProcess({
    commandName: "say",
    createCommand: createHint,
    episodeId: episodeId || "",
    topologyBlockId,
  });
}
