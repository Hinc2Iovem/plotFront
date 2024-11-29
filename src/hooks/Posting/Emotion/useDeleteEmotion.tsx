import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";

type DeleteEmotionTypes = {
  characterId: string;
  emotionId: string;
};

export default function useDeleteEmotion({ characterId, emotionId }: DeleteEmotionTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.delete(`/characterEmotions/characters/${characterId}/emotions/${emotionId}`),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["character", characterId],
      });
    },
  });
}
