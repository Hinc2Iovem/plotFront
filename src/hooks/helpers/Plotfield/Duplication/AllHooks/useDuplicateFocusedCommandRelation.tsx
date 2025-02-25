import { useParams } from "react-router-dom";
import useCreateRelationDuplicate from "../../../../../features/Editor/PlotField/hooks/duplicates/useCreateRelationDuplicate";
import useHandleDuplicationProcess from "./shared/useHandleDuplicationProcess";

type DuplicateFocusedCommandRelationTypes = {
  topologyBlockId: string;
};

export default function useDuplicateFocusedCommandRelation({ topologyBlockId }: DuplicateFocusedCommandRelationTypes) {
  const { episodeId } = useParams();
  const createRelation = useCreateRelationDuplicate({
    topologyBlockId,
    episodeId: episodeId || "",
  });

  useHandleDuplicationProcess({
    commandName: "relation",
    createCommand: createRelation,
    episodeId: episodeId || "",
    topologyBlockId,
  });
}
