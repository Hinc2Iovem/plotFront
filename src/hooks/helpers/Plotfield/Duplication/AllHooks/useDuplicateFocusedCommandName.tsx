import { useParams } from "react-router-dom";
import useCreateNameDuplicate from "../../../../../features/Editor/PlotField/hooks/duplicates/useCreateNameDuplicate";
import useHandleDuplicationProcess from "./shared/useHandleDuplicationProcess";

type DuplicateFocusedCommandNameTypes = {
  topologyBlockId: string;
};

export default function useDuplicateFocusedCommandName({ topologyBlockId }: DuplicateFocusedCommandNameTypes) {
  const { episodeId } = useParams();
  const createName = useCreateNameDuplicate({
    topologyBlockId,
    episodeId: episodeId || "",
  });

  useHandleDuplicationProcess({
    commandName: "name",
    createCommand: createName,
    episodeId: episodeId || "",
    topologyBlockId,
  });
}
