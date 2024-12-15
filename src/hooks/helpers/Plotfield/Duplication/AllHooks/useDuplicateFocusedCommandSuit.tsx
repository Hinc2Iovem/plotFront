import { useParams } from "react-router-dom";
import useCreateSuitDuplicate from "../../../../../features/Editor/PlotField/hooks/duplicates/useCreateSuitDuplicate";
import useHandleDuplicationProcess from "./shared/useHandleDuplicationProcess";

type DuplicateFocusedCommandSuitTypes = {
  topologyBlockId: string;
};

export default function useDuplicateFocusedCommandSuit({ topologyBlockId }: DuplicateFocusedCommandSuitTypes) {
  const { episodeId } = useParams();
  const createSuit = useCreateSuitDuplicate({
    topologyBlockId,
    episodeId: episodeId || "",
  });

  useHandleDuplicationProcess({
    commandName: "suit",
    createCommand: createSuit,
    episodeId: episodeId || "",
    topologyBlockId,
  });
}
