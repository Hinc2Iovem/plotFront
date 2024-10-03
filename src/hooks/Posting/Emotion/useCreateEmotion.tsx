import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CharacterGetTypes } from "../../../types/StoryData/Character/CharacterTypes";

type CreateEmotionTypes = {
  characterId: string;
  emotionName: string;
};

export default function useCreateEmotion({
  characterId,
  emotionName,
}: CreateEmotionTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["new", "emotion", emotionName],
    mutationFn: async () =>
      await axiosCustomized
        .post<CharacterGetTypes>(
          `/characterEmotions/characters/${characterId}`,
          {
            emotionName,
          }
        )
        .then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["character", characterId],
        exact: true,
        type: "active",
      });
    },
  });
}

// onSuccess: (data) => {
//   queryClient.setQueryData(
//     ["character", characterId],
//     (oldData: CharacterGetTypes | undefined) => {
//       if (!oldData) return data;

//       return {
//         ...oldData,
//         emotions: [...oldData.emotions, ...data.emotions],
//       };
//     }
//   );
// },
