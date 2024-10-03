import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationCommandWardrobeTypes } from "../../../../../../../types/Additional/TranslationTypes";

type GetCommandWardrobeTypes = {
  commandId: string;
  language?: CurrentlyAvailableLanguagesTypes;
};

export default function useGetCommandWardrobeTranslation({
  commandId,
  language = "russian",
}: GetCommandWardrobeTypes) {
  return useQuery({
    queryKey: ["translation", language, "wardrobe", commandId],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationCommandWardrobeTypes>(
          `/commandWardrobes/${commandId}/translations?currentLanguage=${language}`
        )
        .then((r) => r.data),
    enabled: !!commandId && !!language,
  });
}
