import { useParams } from "react-router-dom";
import useCreateEffectDuplicate from "../../../../../features/Editor/PlotField/hooks/duplicates/useCreateEffectDuplicate";
import useHandleDuplicationProcess from "./shared/useHandleDuplicationProcess";

type DuplicateFocusedCommandEffectTypes = {
  topologyBlockId: string;
};

export default function useDuplicateFocusedCommandEffect({ topologyBlockId }: DuplicateFocusedCommandEffectTypes) {
  const { episodeId } = useParams();
  const createEffect = useCreateEffectDuplicate({
    topologyBlockId,
    episodeId: episodeId || "",
  });

  useHandleDuplicationProcess({
    commandName: "effect",
    createCommand: createEffect,
    episodeId: episodeId || "",
    topologyBlockId,
  });
}
