import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { CharacterEmotionTypes } from "../../../../../../../types/StoryData/Emotion/CharacterEmotion";
import { CommandSayVariationTypes } from "../../../../../../../types/StoryEditor/PlotField/Say/SayTypes";

type GetEmotionEnabledTypes = {
  characterEmotionId: string;
  commandSayType: CommandSayVariationTypes;
};

export default function useGetEmotionEnabled({
  characterEmotionId,
  commandSayType,
}: GetEmotionEnabledTypes) {
  return useQuery({
    queryKey: ["character", "emotion", characterEmotionId],
    queryFn: async () =>
      await axiosCustomized
        .get<CharacterEmotionTypes>(`/characterEmotions/${characterEmotionId}`)
        .then((r) => r.data),
    enabled: commandSayType === "character" && !!characterEmotionId,
  });
}
