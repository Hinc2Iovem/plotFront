import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { TranslationCommandWardrobeTypes } from "../../../../../types/Additional/TranslationTypes";
import { UpdatedAtPossibleVariationTypes } from "../../../../../features/Profile/Translator/Recent/Filters/FiltersEverythingRecent";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type PaginatedWardrobeTypes = {
  next?: {
    page: number;
    limit: number;
  };
  prev?: {
    page: number;
    limit: number;
  };
  results: TranslationCommandWardrobeTypes[];
  amountOfWardrobes: number;
};

export default function useGetCommandWardrobeRecentTranslations({
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
      "commandWardrobe",
      "updatedAt",
      updatedAt,
    ],
    queryFn: async () =>
      await axiosCustomized
        .get<PaginatedWardrobeTypes>(
          `/commandWardrobes/paginated/recent/translations?currentLanguage=${language}&updatedAt=${updatedAt}&page=${page}&limit=${limit}`
        )
        .then((r) => r.data),
    enabled: !!language && !!updatedAt && !!page && !!limit,
  });
}
