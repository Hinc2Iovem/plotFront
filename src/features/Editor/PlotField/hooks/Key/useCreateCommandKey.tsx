import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type CreateKeyTypes = {
  plotFieldCommandId?: string;
  storyId: string;
};

export default function useCreateCommandKey({ plotFieldCommandId, storyId }: CreateKeyTypes) {
  return useMutation({
    mutationFn: async ({ plotfieldCommandId }: { plotfieldCommandId?: string }) => {
      const commandId = plotFieldCommandId?.trim().length ? plotFieldCommandId : plotfieldCommandId;
      await axiosCustomized.post(`/plotFieldCommands/${commandId}/stories/${storyId}/keys`);
    },
  });
}
