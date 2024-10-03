import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type UpdateWardrobeCurrentDressedTypes = {
  commandWardrobeId: string;
};

type UpdateWardrobeCurrentDressedOnMutationTypes = {
  characterId?: string;
  isCurrentDressed?: boolean;
};

export default function useUpdateWardrobeCurrentDressedAndCharacterId({
  commandWardrobeId,
}: UpdateWardrobeCurrentDressedTypes) {
  return useMutation({
    mutationFn: async ({
      characterId,
      isCurrentDressed,
    }: UpdateWardrobeCurrentDressedOnMutationTypes) =>
      await axiosCustomized.patch(
        `/plotFieldCommands/wardrobes/${commandWardrobeId}`,
        {
          isCurrentDressed,
          characterId,
        }
      ),
  });
}
