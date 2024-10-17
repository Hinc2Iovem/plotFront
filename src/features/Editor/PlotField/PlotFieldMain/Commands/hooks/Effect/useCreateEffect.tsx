import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type CreateEffectTypes = {
  plotFieldCommandId?: string;
};

export default function useCreateEffect({
  plotFieldCommandId,
}: CreateEffectTypes) {
  return useMutation({
    mutationFn: async ({
      plotfieldCommandId,
    }: {
      plotfieldCommandId?: string;
    }) => {
      const commandId = plotFieldCommandId?.trim().length
        ? plotFieldCommandId
        : plotfieldCommandId;
      await axiosCustomized.post(`/plotFieldCommands/${commandId}/effects`);
    },
  });
}
