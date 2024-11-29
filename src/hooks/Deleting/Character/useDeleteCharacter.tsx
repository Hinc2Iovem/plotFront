import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";

export default function useDeleteCharacter({
  characterId,
  invalidateQueryKey,
  exact = false,
}: {
  characterId: string;
  exact?: boolean;
  invalidateQueryKey?: string[];
}) {
  const localQueryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => await axiosCustomized.delete(`/characters/${characterId}`),
    onSettled: () => {
      if (invalidateQueryKey) {
        localQueryClient.invalidateQueries({
          queryKey: invalidateQueryKey,
          exact,
        });
      }
    },
  });
}
