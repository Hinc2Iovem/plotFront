import { useParams } from "react-router-dom";
import useCreateSayDuplicate from "../../../../../features/Editor/PlotField/hooks/duplicates/useCreateSayDuplicate";
import useHandleDuplicationProcess from "./shared/useHandleDuplicationProcess";

type DuplicateFocusedCommandNotifyTypes = {
  topologyBlockId: string;
};

export default function useDuplicateFocusedCommandNotify({ topologyBlockId }: DuplicateFocusedCommandNotifyTypes) {
  const { episodeId } = useParams();

  const createNotify = useCreateSayDuplicate({
    topologyBlockId,
    episodeId: episodeId || "",
  });

  useHandleDuplicationProcess({
    commandName: "say",
    createCommand: createNotify,
    episodeId: episodeId || "",
    topologyBlockId: topologyBlockId,
  });
}
