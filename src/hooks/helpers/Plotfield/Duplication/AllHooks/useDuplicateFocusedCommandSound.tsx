import { useParams } from "react-router-dom";
import useCreateSoundDuplicate from "../../../../../features/Editor/PlotField/hooks/duplicates/useCreateSoundDuplicate";
import useHandleDuplicationProcess from "./shared/useHandleDuplicationProcess";

type DuplicateFocusedCommandSoundTypes = {
  topologyBlockId: string;
};

export default function useDuplicateFocusedCommandSound({ topologyBlockId }: DuplicateFocusedCommandSoundTypes) {
  const { episodeId } = useParams();
  const createSound = useCreateSoundDuplicate({
    topologyBlockId,
    episodeId: episodeId || "",
  });

  useHandleDuplicationProcess({
    commandName: "sound",
    createCommand: createSound,
    episodeId: episodeId || "",
    topologyBlockId,
  });
}
