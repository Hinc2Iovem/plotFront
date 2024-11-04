import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { TranslationCommandTypes } from "../../../../../types/Additional/TranslationTypes";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type GetCommandGetItemTypes = {
  getItemId: string;
  language?: CurrentlyAvailableLanguagesTypes;
};

export default function useGetCommandGetItemTranslation({
  getItemId,
  language = "russian",
}: GetCommandGetItemTypes) {
  return useQuery({
    queryKey: ["translation", "command", "getItem", getItemId],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationCommandTypes[]>(
          `/translations/plotFieldCommands/getItems/${getItemId}?currentLanguage=${language}`
        )
        .then((r) => r.data),
    enabled: !!getItemId,
  });
}
