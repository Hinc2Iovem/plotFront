import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { TranslationAchievementTypes } from "../../../../../types/Additional/TranslationTypes";
import { UpdatedAtPossibleVariationTypes } from "../../../../../features/Profile/Translator/Recent/Filters/FiltersEverythingRecent";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type PaginatedAchievementTypes = {
  next?: {
    page: number;
    limit: number;
  };
  prev?: {
    page: number;
    limit: number;
  };
  results: TranslationAchievementTypes[];
  amountOfAchievements: number;
};

export default function useGetAchievementRecentTranslations({
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
      "achievement",
      "updatedAt",
      updatedAt,
    ],
    queryFn: async () =>
      await axiosCustomized
        .get<PaginatedAchievementTypes>(
          `/achievements/paginated/recent/translations?currentLanguage=${language}&updatedAt=${updatedAt}&page=${page}&limit=${limit}`
        )
        .then((r) => r.data),
    enabled: !!language && !!updatedAt && !!page && !!limit,
  });
}
