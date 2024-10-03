import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../../api/axios";

type CreateWardrobeAppearanceTypeTypes = {
  commandWardrobeId: string;
  appearancePartId: string;
};

export default function useCreateWardrobeAppearanceTypeBlock({
  commandWardrobeId,
  appearancePartId,
}: CreateWardrobeAppearanceTypeTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.post(
        `/plotFieldCommands/wardrobes/${commandWardrobeId}/appearanceParts/${appearancePartId}`
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["commandWardrobe", commandWardrobeId, "appearanceTypes"],
        type: "active",
        exact: true,
      });
    },
  });
}
