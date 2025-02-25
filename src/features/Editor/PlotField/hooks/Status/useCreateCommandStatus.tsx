import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type CreateCommandStatusTypes = {
  plotFieldCommandId?: string;
};

export default function useCreateCommandStatus({ plotFieldCommandId }: CreateCommandStatusTypes) {
  return useMutation({
    mutationFn: async ({ plotfieldCommandId }: { plotfieldCommandId?: string }) => {
      const commandId = plotFieldCommandId?.trim().length ? plotFieldCommandId : plotfieldCommandId;
      await axiosCustomized.post(`/plotFieldCommands/${commandId}/status`);
    },
  });
}
