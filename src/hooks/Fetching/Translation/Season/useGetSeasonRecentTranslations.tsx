import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { UpdatedAtPossibleVariationTypes } from "../../../../features/Profile/Translator/Recent/Filters/FiltersEverythingRecent";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationSeasonTypes } from "../../../../types/Additional/TranslationTypes";

type PaginatedSeasonTypes = {
  next?: {
    page: number;
    limit: number;
  };
  prev?: {
    page: number;
    limit: number;
  };
  results: TranslationSeasonTypes[];
  amountOfSeasons: number;
};

export default function useGetSeasonRecentTranslations({
  updatedAt,
  language = "russian",
  page,
  limit,
}: {
  updatedAt: UpdatedAtPossibleVariationTypes;
  language?: CurrentlyAvailableLanguagesTypes;
  page: number;
  limit: number;
}) {
  return useQuery({
    queryKey: [
      "paginated",
      "page",
      page,
      "limit",
      limit,
      "translation",
      language,
      "season",
      "updatedAt",
      updatedAt,
    ],
    queryFn: async () =>
      await axiosCustomized
        .get<PaginatedSeasonTypes>(
          `/seasons/paginated/recent/translations?currentLanguage=${language}&updatedAt=${updatedAt}&page=${page}&limit=${limit}`
        )
        .then((r) => r.data),
    enabled: !!language && !!updatedAt && !!page && !!limit,
  });
}
