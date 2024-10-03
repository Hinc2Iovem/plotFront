import { useQuery } from "@tanstack/react-query";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { axiosCustomized } from "../../../api/axios";

type CheckAppearancePartTranslationCompletnessByCharacterIdTypes = {
  currentLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage: CurrentlyAvailableLanguagesTypes;
  appearancePartVariation?: string;
  characterId: string;
};

export default function useCheckAppearancePartTranslationCompletnessByCharacterId({
  appearancePartVariation,
  currentLanguage,
  characterId,
  translateToLanguage,
}: CheckAppearancePartTranslationCompletnessByCharacterIdTypes) {
  return useQuery({
    queryKey: [
      "completness",
      "translation",
      "from",
      currentLanguage,
      "to",
      translateToLanguage,
      "appearancePart",
      appearancePartVariation,
      "story",
      characterId,
    ],
    queryFn: async () =>
      await axiosCustomized
        .get<boolean>(
          `/appearanceParts/characters/${characterId}/completness/translations?currentLanguage=${currentLanguage}&translateToLanguage=${translateToLanguage}&appearancePartVariation=${appearancePartVariation}`
        )
        .then((r) => r.data),
    enabled: !!currentLanguage && !!translateToLanguage && !!characterId,
  });
}
