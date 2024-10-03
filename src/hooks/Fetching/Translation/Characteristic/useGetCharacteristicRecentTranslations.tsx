import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { UpdatedAtPossibleVariationTypes } from "../../../../features/Profile/Translator/Recent/Filters/FiltersEverythingRecent";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationCharacterCharacteristicTypes } from "../../../../types/Additional/TranslationTypes";

type PaginatedCharacterTypes = {
  next?: {
    page: number;
    limit: number;
  };
  prev?: {
    page: number;
    limit: number;
  };
  results: TranslationCharacterCharacteristicTypes[];
  amountOfCharacteristics: number;
};

export default function useGetCharacteristicRecentTranslations({
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
      "characteristic",
      "updatedAt",
      updatedAt,
    ],
    queryFn: async () =>
      await axiosCustomized
        .get<PaginatedCharacterTypes>(
          `/characteristics/paginated/recent/translations?currentLanguage=${language}&updatedAt=${updatedAt}&page=${page}&limit=${limit}`
        )
        .then((r) => r.data),
    enabled: !!language && !!updatedAt && !!page && !!limit,
  });
}
