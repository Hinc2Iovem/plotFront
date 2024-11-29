import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type CreateSoundTypes = {
  plotFieldCommandId?: string;
};

export default function useCreateCommandSound({ plotFieldCommandId }: CreateSoundTypes) {
  return useMutation({
    mutationFn: async ({ plotfieldCommandId }: { plotfieldCommandId?: string }) => {
      const commandId = plotFieldCommandId?.trim().length ? plotFieldCommandId : plotfieldCommandId;
      await axiosCustomized.post(`/plotFieldCommands/${commandId}/sounds`);
    },
  });
}
