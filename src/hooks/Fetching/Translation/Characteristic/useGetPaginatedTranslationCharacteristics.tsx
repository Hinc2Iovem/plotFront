import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationCharacterCharacteristicTypes } from "../../../../types/Additional/TranslationTypes";

type PaginatedCharacteristicTypes = {
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

export default function useGetPaginatedTranslationCharacteristics({
  language = "russian",
  page,
  limit,
  storyId,
}: {
  language?: CurrentlyAvailableLanguagesTypes;
  page: number;
  limit: number;
  storyId: string;
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
      "story",
      storyId,
      "characteristic",
    ],
    queryFn: async () =>
      await axiosCustomized
        .get<PaginatedCharacteristicTypes>(
          `/characteristics/paginated/translations?currentLanguage=${language}&page=${page}&limit=${limit}&storyId=${storyId}`
        )
        .then((r) => r.data),
    enabled: !!language && !!page && !!limit && !!storyId,
  });
}
