import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationCharacterTypes } from "../../../../types/Additional/TranslationTypes";

export default function useGetTranslationCharacterById({
  characterId,
  language,
}: {
  characterId: string;
  language: CurrentlyAvailableLanguagesTypes;
}) {
  return useQuery({
    queryKey: ["translation", language, "character", characterId],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationCharacterTypes>(
          `/characters/${characterId}/translations?currentLanguage=${language}`
        )
        .then((r) => r.data),
    enabled: !!characterId && !!language,
  });
}
