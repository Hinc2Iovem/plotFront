import { useParams } from "react-router-dom";
import useCreateCommentDuplicate from "../../../../../features/Editor/PlotField/hooks/duplicates/useCreateCommentDuplicate";
import useHandleDuplicationProcess from "./shared/useHandleDuplicationProcess";

type DuplicateFocusedCommandCommentTypes = {
  topologyBlockId: string;
};

export default function useDuplicateFocusedCommandComment({ topologyBlockId }: DuplicateFocusedCommandCommentTypes) {
  const { episodeId } = useParams();
  const createComment = useCreateCommentDuplicate({
    topologyBlockId,
    episodeId: episodeId || "",
  });

  useHandleDuplicationProcess({
    commandName: "comment",
    createCommand: createComment,
    episodeId: episodeId || "",
    topologyBlockId,
  });
}
