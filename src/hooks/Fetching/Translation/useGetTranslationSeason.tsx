import { useQuery } from "@tanstack/react-query";
import { TranslationSeasonTypes } from "../../../types/Additional/TranslationTypes";
import { axiosCustomized } from "../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type GetTranslationSeasonTypes = {
  seasonId: string;
  language?: CurrentlyAvailableLanguagesTypes;
};

export default function useGetTranslationSeason({
  seasonId,
  language = "russian",
}: GetTranslationSeasonTypes) {
  return useQuery({
    queryKey: ["translation", "season", seasonId],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationSeasonTypes>(
          `/translations/seasons/${seasonId}?currentLanguage=${language}`
        )
        .then((r) => r.data),
  });
}
