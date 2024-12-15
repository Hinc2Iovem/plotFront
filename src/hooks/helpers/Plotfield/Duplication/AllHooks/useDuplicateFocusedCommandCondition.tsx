import { useParams } from "react-router-dom";
import useCreateConditionDuplicate from "../../../../../features/Editor/PlotField/hooks/duplicates/useCreateConditionDuplicate";
import useHandleDuplicationProcess from "./shared/useHandleDuplicationProcess";

type DuplicateFocusedCommandConditionTypes = {
  topologyBlockId: string;
};

export default function useDuplicateFocusedCommandCondition({
  topologyBlockId,
}: DuplicateFocusedCommandConditionTypes) {
  const { episodeId } = useParams();
  const createCondition = useCreateConditionDuplicate({
    topologyBlockId,
    episodeId: episodeId || "",
  });

  useHandleDuplicationProcess({
    commandName: "condition",
    createCommand: createCondition,
    episodeId: episodeId || "",
    topologyBlockId,
  });
}
