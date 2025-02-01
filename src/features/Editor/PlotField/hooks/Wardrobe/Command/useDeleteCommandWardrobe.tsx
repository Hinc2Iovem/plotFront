import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";

type DeleteCommandWardrobeTypes = {
  plotfieldCommandId: string;
  commandWardrobeId?: string;
};

export default function useDeleteCommandWardrobe({
  commandWardrobeId,
  plotfieldCommandId,
}: DeleteCommandWardrobeTypes) {
  return useMutation({
    mutationFn: async ({ commandWardrobeBodyId }: { commandWardrobeBodyId?: string }) => {
      const currentWardrobeId = commandWardrobeBodyId?.trim().length ? commandWardrobeBodyId : commandWardrobeId;
      await axiosCustomized.delete(`/plotFieldCommands/${plotfieldCommandId}/commandWardrobes/${currentWardrobeId}`);
    },
  });
}
