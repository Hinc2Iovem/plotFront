import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type CreateStatTypes = {
  plotFieldCommandId?: string;
};

export default function useCreateStat({ plotFieldCommandId }: CreateStatTypes) {
  return useMutation({
    mutationFn: async ({ plotfieldCommandId }: { plotfieldCommandId?: string }) => {
      const commandId = plotFieldCommandId?.trim().length ? plotFieldCommandId : plotfieldCommandId;
      await axiosCustomized.post(`/plotFieldCommands/${commandId}/stats`);
    },
  });
}
