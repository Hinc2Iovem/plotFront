import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";

type CreateAppearancePartTypes = {
  appearancePartName: string;
  storyId: string;
};

export default function useCreateAppearancePartOptimistic({
  appearancePartName,
  storyId,
}: CreateAppearancePartTypes) {
  return useMutation({
    mutationFn: async ({ appearancePartId }: { appearancePartId: string }) =>
      await axiosCustomized.post(
        `/appearanceParts/stories/${storyId}/optimistic/translations`,
        {
          appearancePartName,
          appearancePartId,
        }
      ),
  });
}
