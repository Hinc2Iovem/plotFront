import { useParams } from "react-router-dom";
import useCreateWardrobeDuplicate from "../../../../../features/Editor/PlotField/hooks/duplicates/useCreateWardrobeDuplicate";
import useHandleDuplicationProcess from "./shared/useHandleDuplicationProcess";

type DuplicateFocusedCommandWardrobeTypes = {
  topologyBlockId: string;
};

export default function useDuplicateFocusedCommandWardrobe({ topologyBlockId }: DuplicateFocusedCommandWardrobeTypes) {
  const { episodeId } = useParams();
  const createWardrobe = useCreateWardrobeDuplicate({
    topologyBlockId,
    episodeId: episodeId || "",
  });

  useHandleDuplicationProcess({
    commandName: "wardrobe",
    createCommand: createWardrobe,
    episodeId: episodeId || "",
    topologyBlockId,
  });
}
