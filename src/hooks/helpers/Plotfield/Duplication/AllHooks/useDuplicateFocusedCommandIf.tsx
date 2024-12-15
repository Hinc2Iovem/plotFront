import { useParams } from "react-router-dom";
import useCreateIfDuplicate from "../../../../../features/Editor/PlotField/hooks/duplicates/useCreateIfDuplicate";
import useHandleDuplicationProcess from "./shared/useHandleDuplicationProcess";

type DuplicateFocusedCommandIfTypes = {
  topologyBlockId: string;
};

export default function useDuplicateFocusedCommandIf({ topologyBlockId }: DuplicateFocusedCommandIfTypes) {
  const { episodeId } = useParams();

  const createIf = useCreateIfDuplicate({
    topologyBlockId,
    episodeId: episodeId || "",
  });

  useHandleDuplicationProcess({
    commandName: "if",
    createCommand: createIf,
    episodeId: episodeId || "",
    topologyBlockId,
  });
}
