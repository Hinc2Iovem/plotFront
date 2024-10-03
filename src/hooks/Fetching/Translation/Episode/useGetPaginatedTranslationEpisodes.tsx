import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationEpisodeTypes } from "../../../../types/Additional/TranslationTypes";

type PaginatedEpisodeTypes = {
  next?: {
    page: number;
    limit: number;
  };
  prev?: {
    page: number;
    limit: number;
  };
  results: TranslationEpisodeTypes[];
  amountOfEpisodes: number;
};

export default function useGetPaginatedTranslationEpisodes({
  language = "russian",
  page,
  limit,
  seasonId,
  storyId,
}: {
  language?: CurrentlyAvailableLanguagesTypes;
  page: number;
  limit: number;
  seasonId: string;
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
      seasonId,
      "episode",
    ],
    queryFn: async () =>
      await axiosCustomized
        .get<PaginatedEpisodeTypes>(
          `/episodes/paginated/translations?currentLanguage=${language}&page=${page}&limit=${limit}&seasonId=${seasonId}`
        )
        .then((r) => r.data),
    enabled: !!language && !!storyId && !!page && !!limit && !!seasonId,
  });
}
