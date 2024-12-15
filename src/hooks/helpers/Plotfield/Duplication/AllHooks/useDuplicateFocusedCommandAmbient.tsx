import { useParams } from "react-router-dom";
import useCreateAmbientDuplicate from "../../../../../features/Editor/PlotField/hooks/duplicates/useCreateAmbientDuplicate";
import useHandleDuplicationProcess from "./shared/useHandleDuplicationProcess";

type DuplicateFocusedCommandAmbientTypes = {
  topologyBlockId: string;
};

export default function useDuplicateFocusedCommandAmbient({ topologyBlockId }: DuplicateFocusedCommandAmbientTypes) {
  const { episodeId } = useParams();

  const createAmbient = useCreateAmbientDuplicate({
    topologyBlockId,
    episodeId: episodeId || "",
  });

  useHandleDuplicationProcess({
    commandName: "ambient",
    createCommand: createAmbient,
    episodeId: episodeId || "",
    topologyBlockId,
  });
}
