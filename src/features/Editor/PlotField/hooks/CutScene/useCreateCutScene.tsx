import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type CreateCutSceneTypes = {
  plotFieldCommandId?: string;
};

export default function useCreateCutScene({
  plotFieldCommandId,
}: CreateCutSceneTypes) {
  return useMutation({
    mutationFn: async ({
      plotfieldCommandId,
    }: {
      plotfieldCommandId?: string;
    }) => {
      const commandId = plotFieldCommandId?.trim().length
        ? plotFieldCommandId
        : plotfieldCommandId;
      await axiosCustomized.post(`/plotFieldCommands/${commandId}/cutScenes`);
    },
  });
}
