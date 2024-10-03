import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type UpdateCommentTextTypes = {
  commentId: string;
  comment: string;
};

export default function useUpdateCommentText({
  commentId,
  comment,
}: UpdateCommentTextTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.patch(`/plotFieldCommands/comments/${commentId}`, {
        comment,
      }),
  });
}
