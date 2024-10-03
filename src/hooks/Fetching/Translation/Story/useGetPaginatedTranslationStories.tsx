import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationStoryTypes } from "../../../../types/Additional/TranslationTypes";

type PaginatedStoryTypes = {
  next?: {
    page: number;
    limit: number;
  };
  prev?: {
    page: number;
    limit: number;
  };
  results: TranslationStoryTypes[];
  amountOfStories: number;
};

export default function useGetPaginatedTranslationStories({
  language = "russian",
  page,
  limit,
}: {
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
      "story",
    ],
    queryFn: async () =>
      await axiosCustomized
        .get<PaginatedStoryTypes>(
          `/stories/paginated/translations?currentLanguage=${language}&page=${page}&limit=${limit}`
        )
        .then((r) => r.data),
    enabled: !!language && !!page && !!limit,
  });
}
