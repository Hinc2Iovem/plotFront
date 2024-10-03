import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationSayTypes } from "../../../../../types/Additional/TranslationTypes";

export default function useGetAllSayTranslationsByTopologyBlockId({
  topologyBlockId,
  language,
}: {
  topologyBlockId: string;
  language: CurrentlyAvailableLanguagesTypes;
}) {
  return useQuery({
    queryKey: ["translation", language, "plotFieldCommand", "say"],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationSayTypes[]>(
          `/says/topologyBlocks/${topologyBlockId}/translations/?currentLanguage=${language}`
        )
        .then((r) => r.data),
    enabled: !!topologyBlockId && !!language,
  });
}
