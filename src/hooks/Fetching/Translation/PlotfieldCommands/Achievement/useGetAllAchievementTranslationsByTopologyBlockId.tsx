import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationAchievementTypes } from "../../../../../types/Additional/TranslationTypes";

export default function useGetAllAchievementTranslationsByTopologyBlockId({
  topologyBlockId,
  language,
}: {
  topologyBlockId: string;
  language: CurrentlyAvailableLanguagesTypes;
}) {
  return useQuery({
    queryKey: ["translation", language, "plotFieldCommand", "achievement"],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationAchievementTypes[]>(
          `/achievements/topologyBlocks/${topologyBlockId}/translations/?currentLanguage=${language}`
        )
        .then((r) => r.data),
    enabled: !!topologyBlockId && !!language,
  });
}
