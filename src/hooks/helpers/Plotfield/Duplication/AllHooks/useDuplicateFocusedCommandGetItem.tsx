import { useParams } from "react-router-dom";
import useCreateGetItemDuplicate from "../../../../../features/Editor/PlotField/hooks/duplicates/useCreateGetItemDuplicate";
import useHandleDuplicationProcess from "./shared/useHandleDuplicationProcess";

type DuplicateFocusedCommandGetItemTypes = {
  topologyBlockId: string;
};

export default function useDuplicateFocusedCommandGetItem({ topologyBlockId }: DuplicateFocusedCommandGetItemTypes) {
  const { episodeId } = useParams();
  const createGetItem = useCreateGetItemDuplicate({
    topologyBlockId,
    episodeId: episodeId || "",
  });

  useHandleDuplicationProcess({
    commandName: "getitem",
    createCommand: createGetItem,
    episodeId: episodeId || "",
    topologyBlockId,
  });
}
