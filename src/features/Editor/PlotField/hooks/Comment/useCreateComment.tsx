import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type CreateCommentTypes = {
  plotFieldCommandId?: string;
};

export default function useCreateComment({
  plotFieldCommandId,
}: CreateCommentTypes) {
  return useMutation({
    mutationFn: async ({
      plotfieldCommandId,
    }: {
      plotfieldCommandId?: string;
    }) => {
      const commandId = plotFieldCommandId?.trim().length
        ? plotFieldCommandId
        : plotfieldCommandId;
      await axiosCustomized.post(`/plotFieldCommands/${commandId}/comments`);
    },
  });
}
