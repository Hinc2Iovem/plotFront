import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type CreateCommentTypes = {
  plotFieldCommandId: string;
};

export default function useCreateComment({
  plotFieldCommandId,
}: CreateCommentTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.post(
        `/plotFieldCommands/${plotFieldCommandId}/comments`
      ),
  });
}
