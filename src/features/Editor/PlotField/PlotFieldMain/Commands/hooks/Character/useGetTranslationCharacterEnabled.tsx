import { useQuery } from "@tanstack/react-query";
import { TranslationCharacterTypes } from "../../../../../../../types/Additional/TranslationTypes";
import { axiosCustomized } from "../../../../../../../api/axios";
import { CommandSayVariationTypes } from "../../../../../../../types/StoryEditor/PlotField/Say/SayTypes";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

export default function useGetTranslationCharacterEnabled({
  characterId,
  commandSayType,
  language = "russian",
}: {
  characterId: string;
  commandSayType: CommandSayVariationTypes;
  language?: CurrentlyAvailableLanguagesTypes;
}) {
  return useQuery({
    queryKey: ["translation", language, "character", characterId],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationCharacterTypes[]>(
          `/translations/characters/${characterId}?currentLanguage=${language}`
        )
        .then((r) => r.data),
    enabled: commandSayType === "character" && !!characterId,
  });
}
