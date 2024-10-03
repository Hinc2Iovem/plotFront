import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationCharacterCharacteristicTypes } from "../../../types/Additional/TranslationTypes";

type GetTranslationCharacteristicTypes = {
  characteristicId: string;
  language?: CurrentlyAvailableLanguagesTypes;
};

export default function useGetTranslationCharacteristic({
  characteristicId,
  language = "russian",
}: GetTranslationCharacteristicTypes) {
  return useQuery({
    queryKey: ["translation", language, "characteristic", characteristicId],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationCharacterCharacteristicTypes>(
          `/characteristics/${characteristicId}/translations?currentLanguage=${language}`
        )
        .then((r) => r.data),
    enabled: !!characteristicId && !!language,
  });
}
