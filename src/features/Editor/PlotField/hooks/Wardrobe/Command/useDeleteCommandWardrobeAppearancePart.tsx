import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";

type DeleteCommandWardrobeTypes = {
  commandWardrobeId?: string;
  appearancePartId?: string;
};

export default function useDeleteCommandWardrobeAppearancePart({
  commandWardrobeId,
  appearancePartId,
}: DeleteCommandWardrobeTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      commandWardrobeBodyId,
      appearancePartBodyId,
    }: {
      commandWardrobeBodyId?: string;
      appearancePartBodyId?: string;
    }) => {
      const currentWardrobeId = commandWardrobeBodyId?.trim().length ? commandWardrobeBodyId : commandWardrobeId;
      const currentAppearancePartId = appearancePartBodyId?.trim().length ? appearancePartBodyId : appearancePartId;
      await axiosCustomized.delete(
        `/plotFieldCommands/commandWardrobes/${currentWardrobeId}/appearanceParts/${currentAppearancePartId}`
      );
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["commandWardrobe", commandWardrobeId, "appearanceTypes"],
      });
    },
  });
}
