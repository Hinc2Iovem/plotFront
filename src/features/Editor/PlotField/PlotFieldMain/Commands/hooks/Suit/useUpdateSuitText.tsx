import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type UpdateSuitTextTypes = {
  suitId: string;
  characterId: string;
  suitName: string;
};

export default function useUpdateSuitText({
  suitId,
  characterId,
  suitName,
}: UpdateSuitTextTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.patch(
        `/plotFieldCommands/characters/${characterId}/suits/${suitId}`,
        {
          suitName,
        }
      ),
  });
}
