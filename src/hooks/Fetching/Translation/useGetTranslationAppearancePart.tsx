import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { TranslationAppearancePartTypes } from "../../../types/Additional/TranslationTypes";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type GetTranslationAppearancePart = {
  appearancePartId: string;
  language?: CurrentlyAvailableLanguagesTypes;
};

export default function useGetTranslationAppearancePart({
  appearancePartId,
  language = "russian",
}: GetTranslationAppearancePart) {
  return useQuery({
    queryKey: ["translation", language, "appearancePart", appearancePartId],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationAppearancePartTypes>(
          `/appearanceParts/${appearancePartId}/translations?currentLanguage=${language}`
        )
        .then((r) => r.data),
    enabled: !!appearancePartId?.trim().length,
  });
}
