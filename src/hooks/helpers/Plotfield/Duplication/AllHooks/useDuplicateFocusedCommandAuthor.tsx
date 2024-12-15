import { useParams } from "react-router-dom";
import useCreateSayDuplicate from "../../../../../features/Editor/PlotField/hooks/duplicates/useCreateSayDuplicate";
import useHandleDuplicationProcess from "./shared/useHandleDuplicationProcess";

type DuplicateFocusedCommandAuthorTypes = {
  topologyBlockId: string;
};

export default function useDuplicateFocusedCommandAuthor({ topologyBlockId }: DuplicateFocusedCommandAuthorTypes) {
  const { episodeId } = useParams();

  const createAuthor = useCreateSayDuplicate({
    topologyBlockId,
    episodeId: episodeId || "",
  });

  useHandleDuplicationProcess({
    commandName: "say",
    createCommand: createAuthor,
    episodeId: episodeId || "",
    topologyBlockId: topologyBlockId,
  });
}
