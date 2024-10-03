import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationAppearancePartTypes } from "../../../../types/Additional/TranslationTypes";

export default function useGetTranslationAppearanceParts({
  characterId,
  language = "russian",
  type,
}: {
  characterId: string;
  language?: CurrentlyAvailableLanguagesTypes;
  type?: string;
}) {
  return useQuery({
    queryKey: [
      "translation",
      language,
      "character",
      characterId,
      "appearancePart",
      "type",
      type,
    ],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationAppearancePartTypes[]>(
          `/appearanceParts/characters/${characterId}/types/translations?currentLanguage=${language}`
        )
        .then((r) => r.data),
    enabled: !!characterId && !!language,
  });
}
