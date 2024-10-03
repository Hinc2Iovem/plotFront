import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type CreateCutSceneTypes = {
  plotFieldCommandId: string;
};

export default function useCreateCutScene({
  plotFieldCommandId,
}: CreateCutSceneTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.post(
        `/plotFieldCommands/${plotFieldCommandId}/cutScenes`
      ),
  });
}
