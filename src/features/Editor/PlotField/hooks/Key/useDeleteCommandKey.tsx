import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type DeleteCommandKeyTypes = {
  commandKeyId: string;
  plotfieldCommandId: string;
};

export default function useDeleteCommandKey() {
  return useMutation({
    mutationFn: async ({ commandKeyId, plotfieldCommandId }: DeleteCommandKeyTypes) =>
      await axiosCustomized.delete(`/plotFieldCommands/${plotfieldCommandId}/commandKeys/${commandKeyId}`),
  });
}
