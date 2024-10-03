import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
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

export default function useGetPaginatedTranslationSeasons({
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
      "season",
    ],
    queryFn: async () =>
      await axiosCustomized
        .get<PaginatedSeasonTypes>(
          `/seasons/paginated/translations?currentLanguage=${language}&page=${page}&limit=${limit}&storyId=${storyId}`
        )
        .then((r) => r.data),
    enabled: !!language && !!page && !!limit && !!storyId,
  });
}
