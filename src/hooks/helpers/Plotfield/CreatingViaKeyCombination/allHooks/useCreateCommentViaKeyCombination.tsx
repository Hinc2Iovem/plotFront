import useCreateComment from "../../../../../features/Editor/PlotField/hooks/Comment/useCreateComment";
import { CreateViaKeyCombinationOnMutation } from "../createViaKeyCombinationTypes";
import useHandleCreatingViaKeyCombinationProcess from "./shared/useHandleCreatingViaKeyCombinationProcess";

type CreateCommentViaKeyCombinationTypes = {
  topologyBlockId: string;
};

export default function useCreateCommentViaKeyCombination({ topologyBlockId }: CreateCommentViaKeyCombinationTypes) {
  const createComment = useCreateComment({});

  useHandleCreatingViaKeyCombinationProcess<CreateViaKeyCombinationOnMutation>({
    createCommand: createComment,
    firstEngLetter: "c",
    secondEngLetter: "m",
    firstRusLetter: "с",
    secondRusLetter: "ь",
    topologyBlockId,
    commandName: "comment",
  });
}
