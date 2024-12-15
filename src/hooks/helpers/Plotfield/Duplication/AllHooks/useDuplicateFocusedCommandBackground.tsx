import { useParams } from "react-router-dom";
import useCreateBackgroundDuplicate from "../../../../../features/Editor/PlotField/hooks/duplicates/useCreateBackgroundDuplicate";
import useHandleDuplicationProcess from "./shared/useHandleDuplicationProcess";

type DuplicateFocusedCommandBackgroundTypes = {
  topologyBlockId: string;
};

export default function useDuplicateFocusedCommandBackground({
  topologyBlockId,
}: DuplicateFocusedCommandBackgroundTypes) {
  const { episodeId } = useParams();
  const createBackground = useCreateBackgroundDuplicate({
    topologyBlockId,
    episodeId: episodeId || "",
  });

  useHandleDuplicationProcess({
    commandName: "background",
    createCommand: createBackground,
    episodeId: episodeId || "",
    topologyBlockId,
  });
}
