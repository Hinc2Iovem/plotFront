import { useParams } from "react-router-dom";
import useCreateWaitDuplicate from "../../../../../features/Editor/PlotField/hooks/duplicates/useCreateWaitDuplicate";
import useHandleDuplicationProcess from "./shared/useHandleDuplicationProcess";

type DuplicateFocusedCommandWaitTypes = {
  topologyBlockId: string;
};

export default function useDuplicateFocusedCommandWait({ topologyBlockId }: DuplicateFocusedCommandWaitTypes) {
  const { episodeId } = useParams();
  const createWait = useCreateWaitDuplicate({
    topologyBlockId,
    episodeId: episodeId || "",
  });

  useHandleDuplicationProcess({
    commandName: "wait",
    createCommand: createWait,
    episodeId: episodeId || "",
    topologyBlockId,
  });
}
