import { TranslationAchievementTypes } from "@/types/Additional/TranslationTypes";
import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type GetCommandAchievementTypes = {
  plotFieldCommandId: string;
  language: CurrentlyAvailableLanguagesTypes;
};

export default function useGetCommandAchievement({
  plotFieldCommandId,
  language = "russian",
}: GetCommandAchievementTypes) {
  return useQuery({
    queryKey: ["plotfieldCommand", plotFieldCommandId, "achievement"],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationAchievementTypes>(
          `/plotFieldCommands/${plotFieldCommandId}/commandAchievements?currentLanguage=${language}`
        )
        .then((r) => r.data),
    enabled: !!plotFieldCommandId,
  });
}
