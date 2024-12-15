import { useParams } from "react-router-dom";
import useCreateKeyDuplicate from "../../../../../features/Editor/PlotField/hooks/duplicates/useCreateKeyDuplicate";
import useHandleDuplicationProcess from "./shared/useHandleDuplicationProcess";

type DuplicateFocusedCommandKeyTypes = {
  topologyBlockId: string;
};

export default function useDuplicateFocusedCommandKey({ topologyBlockId }: DuplicateFocusedCommandKeyTypes) {
  const { episodeId, storyId } = useParams();
  const createKey = useCreateKeyDuplicate({
    topologyBlockId,
    episodeId: episodeId || "",
    storyId: storyId || "",
  });

  useHandleDuplicationProcess({
    commandName: "key",
    createCommand: createKey,
    episodeId: episodeId || "",
    topologyBlockId,
  });
}
