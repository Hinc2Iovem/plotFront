import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";

type UpdateEmotionTypes = {
  characterId: string;
  emotionId: string;
};

type UpdateEmotionBodyTypes = {
  emotionName?: string;
  emotionImg?: string;
};

export default function useUpdateEmotion({ characterId, emotionId }: UpdateEmotionTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ emotionImg, emotionName }: UpdateEmotionBodyTypes) =>
      await axiosCustomized.patch(`/characterEmotions/characters/${characterId}/emotions/${emotionId}`, {
        emotionName,
        emotionImg,
      }),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["character", characterId],
      });
    },
  });
}
