import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";

type CreateWardrobeAppearanceTypeTypes = {
  commandWardrobeId: string;
  appearancePartId?: string;
};

export default function useCreateWardrobeAppearanceTypeBlock({
  commandWardrobeId,
  appearancePartId,
}: CreateWardrobeAppearanceTypeTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ appearancePartBodyId }: { appearancePartBodyId?: string }) => {
      const currentAppearancePartId = appearancePartBodyId?.trim().length ? appearancePartBodyId : appearancePartId;
      await axiosCustomized.post(
        `/plotFieldCommands/wardrobes/${commandWardrobeId}/appearanceParts/${currentAppearancePartId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["commandWardrobe", commandWardrobeId, "appearanceTypes"],
        type: "active",
        exact: true,
      });
    },
  });
}
