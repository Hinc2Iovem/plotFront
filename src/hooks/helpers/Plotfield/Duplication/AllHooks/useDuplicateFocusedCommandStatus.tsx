import { useParams } from "react-router-dom";
import useCreateStatusDuplicate from "../../../../../features/Editor/PlotField/hooks/duplicates/useCreateStatusDuplicate";
import useHandleDuplicationProcess from "./shared/useHandleDuplicationProcess";

type DuplicateFocusedCommandStatusTypes = {
  topologyBlockId: string;
};

export default function useDuplicateFocusedCommandStatus({ topologyBlockId }: DuplicateFocusedCommandStatusTypes) {
  const { episodeId } = useParams();
  const createStatus = useCreateStatusDuplicate({
    topologyBlockId,
    episodeId: episodeId || "",
  });

  useHandleDuplicationProcess({
    commandName: "status",
    createCommand: createStatus,
    episodeId: episodeId || "",
    topologyBlockId,
  });
}
