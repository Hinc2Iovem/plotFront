import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type CreateSuitTypes = {
  plotFieldCommandId?: string;
};

export default function useCreateSuit({ plotFieldCommandId }: CreateSuitTypes) {
  return useMutation({
    mutationFn: async ({
      plotfieldCommandId,
    }: {
      plotfieldCommandId?: string;
    }) => {
      const commandId = plotFieldCommandId?.trim().length
        ? plotFieldCommandId
        : plotfieldCommandId;
      await axiosCustomized.post(`/plotFieldCommands/${commandId}/suits`);
    },
  });
}
