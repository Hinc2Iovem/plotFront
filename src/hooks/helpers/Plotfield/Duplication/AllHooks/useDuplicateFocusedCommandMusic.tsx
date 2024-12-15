import { useParams } from "react-router-dom";
import useCreateMusicDuplicate from "../../../../../features/Editor/PlotField/hooks/duplicates/useCreateMusicDuplicate";
import useHandleDuplicationProcess from "./shared/useHandleDuplicationProcess";

type DuplicateFocusedCommandMusicTypes = {
  topologyBlockId: string;
};

export default function useDuplicateFocusedCommandMusic({ topologyBlockId }: DuplicateFocusedCommandMusicTypes) {
  const { episodeId } = useParams();

  const createMusic = useCreateMusicDuplicate({
    topologyBlockId,
    episodeId: episodeId || "",
  });

  useHandleDuplicationProcess({
    commandName: "music",
    createCommand: createMusic,
    episodeId: episodeId || "",
    topologyBlockId,
  });
}
