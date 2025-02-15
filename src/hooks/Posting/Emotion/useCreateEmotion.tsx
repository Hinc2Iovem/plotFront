import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CharacterGetTypes } from "../../../types/StoryData/Character/CharacterTypes";

type CreateEmotionTypes = {
  characterId: string;
  emotionName?: string;
};

type CreateEmotionBodyTypes = {
  emotionBodyName?: string;
  imgUrl?: string;
  emotionId: string;
};

export default function useCreateEmotion({ characterId, emotionName }: CreateEmotionTypes) {
  return useMutation({
    mutationKey: ["new", "emotion", emotionName],
    mutationFn: async ({ emotionBodyName, emotionId, imgUrl }: CreateEmotionBodyTypes) =>
      await axiosCustomized
        .post<CharacterGetTypes>(`/characterEmotions/characters/${characterId}`, {
          emotionName: emotionBodyName?.trim().length ? emotionBodyName : emotionName,
          emotionId,
          imgUrl,
        })
        .then((r) => r.data),
    // TODO invalidate certain queries
    // onSettled: () => {
    //   queryClient.invalidateQueries({
    //     queryKey: ["character", characterId],
    //   });
    //   queryClient.invalidateQueries({
    //     queryKey: ["translation", "russian", "character", "story", storyId],
    //   });
    //   queryClient.invalidateQueries({
    //     queryKey: ["story", storyId, "characters"],
    //   });
    // },
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
