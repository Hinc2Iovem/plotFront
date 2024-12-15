import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type CreateAmbientTypes = {
  plotFieldCommandId?: string;
};

export default function useCreateAmbient({ plotFieldCommandId }: CreateAmbientTypes) {
  return useMutation({
    mutationFn: async ({ plotfieldCommandId }: { plotfieldCommandId?: string }) => {
      const commandId = plotFieldCommandId?.trim().length ? plotFieldCommandId : plotfieldCommandId;
      await axiosCustomized.post(`/plotFieldCommands/${commandId}/ambients`);
    },
  });
}
