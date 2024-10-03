import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationCharacterCharacteristicTypes } from "../../../../types/Additional/TranslationTypes";

export default function useGetSingleCharacteristicByLanguageAndGroupingName({
  characteristicId,
  language = "russian",
}: {
  characteristicId: string;
  language?: CurrentlyAvailableLanguagesTypes;
}) {
  return useQuery({
    queryKey: [
      "translation",
      language,
      "story",
      "characteristic",
      characteristicId,
    ],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationCharacterCharacteristicTypes>(
          `/characteristics/${characteristicId}/translations?currentLanguage=${language}`
        )
        .then((r) => r.data),
    enabled: !!characteristicId && !!language,
  });
}
