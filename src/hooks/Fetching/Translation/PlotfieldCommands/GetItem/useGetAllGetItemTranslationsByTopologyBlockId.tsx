import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationGetItemTypes } from "../../../../../types/Additional/TranslationTypes";

export default function useGetAllGetItemTranslationsByTopologyBlockId({
  topologyBlockId,
  language,
}: {
  topologyBlockId: string;
  language: CurrentlyAvailableLanguagesTypes;
}) {
  return useQuery({
    queryKey: ["translation", language, "plotFieldCommand", "getItem"],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationGetItemTypes[]>(
          `/getItems/topologyBlocks/${topologyBlockId}/translations/?currentLanguage=${language}`
        )
        .then((r) => r.data),
    enabled: !!topologyBlockId && !!language,
  });
}
