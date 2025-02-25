import { useParams } from "react-router-dom";
import useCreateStatDuplicate from "../../../../../features/Editor/PlotField/hooks/duplicates/useCreateStatDuplicate";
import useHandleDuplicationProcess from "./shared/useHandleDuplicationProcess";

type DuplicateFocusedCommandStatTypes = {
  topologyBlockId: string;
};

export default function useDuplicateFocusedCommandStat({ topologyBlockId }: DuplicateFocusedCommandStatTypes) {
  const { episodeId } = useParams();
  const createStat = useCreateStatDuplicate({
    topologyBlockId,
    episodeId: episodeId || "",
  });

  useHandleDuplicationProcess({
    commandName: "stat",
    createCommand: createStat,
    episodeId: episodeId || "",
    topologyBlockId,
  });
}
