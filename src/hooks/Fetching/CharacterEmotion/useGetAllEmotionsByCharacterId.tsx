import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CharacterEmotionTypes } from "../../../types/StoryData/Emotion/CharacterEmotion";

export default function useGetAllEmotionsByCharacterId({
  characterId,
}: {
  characterId: string;
}) {
  return useQuery({
    queryKey: ["emotions", "character", characterId],
    queryFn: async () =>
      await axiosCustomized
        .get<CharacterEmotionTypes[]>(
          `/characterEmotions/characters/${characterId}`
        )
        .then((r) => r.data),
    enabled: !!characterId,
  });
}
