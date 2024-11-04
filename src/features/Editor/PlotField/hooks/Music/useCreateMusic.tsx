import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type CreateMusicTypes = {
  plotFieldCommandId?: string;
};

export default function useCreateMusic({
  plotFieldCommandId,
}: CreateMusicTypes) {
  return useMutation({
    mutationFn: async ({
      plotfieldCommandId,
    }: {
      plotfieldCommandId?: string;
    }) => {
      const commandId = plotFieldCommandId?.trim().length
        ? plotFieldCommandId
        : plotfieldCommandId;
      await axiosCustomized.post(`/plotFieldCommands/${commandId}/music`);
    },
  });
}
