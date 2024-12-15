import { useParams } from "react-router-dom";
import useCreateCallDuplicate from "../../../../../features/Editor/PlotField/hooks/duplicates/useCreateCallDuplicate";
import useHandleDuplicationProcess from "./shared/useHandleDuplicationProcess";

type DuplicateFocusedCommandCallTypes = {
  topologyBlockId: string;
};

export default function useDuplicateFocusedCommandCall({ topologyBlockId }: DuplicateFocusedCommandCallTypes) {
  const { episodeId } = useParams();

  const createCall = useCreateCallDuplicate({
    topologyBlockId,
    episodeId: episodeId || "",
  });

  useHandleDuplicationProcess({
    commandName: "call",
    createCommand: createCall,
    episodeId: episodeId || "",
    topologyBlockId,
  });
}
