import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationChoiceTypes } from "../../../../../types/Additional/TranslationTypes";

export default function useGetAllChoiceTranslationsByTopologyBlockId({
  topologyBlockId,
  language,
}: {
  topologyBlockId: string;
  language: CurrentlyAvailableLanguagesTypes;
}) {
  return useQuery({
    queryKey: ["translation", language, "plotFieldCommand", "choice"],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationChoiceTypes[]>(
          `/choices/topologyBlocks/${topologyBlockId}/translations/?currentLanguage=${language}`
        )
        .then((r) => r.data),
    enabled: !!topologyBlockId && !!language,
  });
}
