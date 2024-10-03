import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationEpisodeTypes } from "../../../../types/Additional/TranslationTypes";

export default function useGetEpisodesTranslationsBySeasonId({
  seasonId,
  language,
}: {
  seasonId: string;
  language: CurrentlyAvailableLanguagesTypes;
}) {
  return useQuery({
    queryKey: ["translation", language, "season", seasonId, "episode"],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationEpisodeTypes[]>(
          `/episodes/seasons/${seasonId}/translations?currentLanguage=${language}`
        )
        .then((r) => r.data),
    enabled: !!seasonId && !!language,
  });
}
