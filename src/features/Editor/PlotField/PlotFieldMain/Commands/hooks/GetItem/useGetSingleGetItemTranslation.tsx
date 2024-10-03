import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { TranslationGetItemTypes } from "../../../../../../../types/Additional/TranslationTypes";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type GetCommandGetItemTypes = {
  plotFieldCommandId: string;
  language: CurrentlyAvailableLanguagesTypes;
};

export default function useGetSingleGetItemTranslation({
  plotFieldCommandId,
  language,
}: GetCommandGetItemTypes) {
  return useQuery({
    queryKey: ["translation", "command", "getItem", plotFieldCommandId],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationGetItemTypes>(
          `/getItems/${plotFieldCommandId}/translations?currentLanguage=${language}`
        )
        .then((r) => r.data),
    enabled: !!plotFieldCommandId && !!language,
  });
}
