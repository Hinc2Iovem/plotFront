import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type UpdateCutSceneTextTypes = {
  cutSceneId: string;
  cutSceneName: string;
};

export default function useUpdateCutSceneText({
  cutSceneId,
  cutSceneName,
}: UpdateCutSceneTextTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.patch(
        `/plotFieldCommands/cutScenes/${cutSceneId}`,
        {
          cutSceneName,
        }
      ),
  });
}
