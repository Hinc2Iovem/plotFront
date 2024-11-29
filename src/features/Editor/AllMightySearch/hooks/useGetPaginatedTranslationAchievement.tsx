import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationAchievementTypes } from "../../../../types/Additional/TranslationTypes";

type GetPaginatedTranslationAchievementTypes = {
  storyId: string;
  page: number;
  limit: number;
  language: CurrentlyAvailableLanguagesTypes;
};

export type AllMightySearchAchievementResultTypes = {
  next: {
    page: number;
    limit: number;
  };
  prev: {
    page: number;
    prev: number;
  };
  results: TranslationAchievementTypes[];
  amountOfElements: number;
};

export const fetchAllMightyPaginatedTranslationAchievement = async ({
  limit,
  page,
  storyId,
  language,
}: GetPaginatedTranslationAchievementTypes): Promise<AllMightySearchAchievementResultTypes> => {
  return await axiosCustomized
    .get(
      `/achievements/stories/translation/paginated/allMightySearch?storyId=${storyId}&page=${page}&limit=${limit}&currentLanguage=${language}`
    )
    .then((r) => r.data);
};

export default function useGetPaginatedTranslationAchievement({
  storyId,
  limit,
  page,
  language,
}: GetPaginatedTranslationAchievementTypes) {
  return useInfiniteQuery({
    queryKey: [
      "all-mighty-search",
      "story",
      storyId,
      "achievement",
      "translation",
      language,
      "paginated",
      "page",
      page,
      "limit",
      limit,
    ],
    queryFn: async () => await fetchAllMightyPaginatedTranslationAchievement({ limit, page, storyId, language }),
    enabled: !!storyId && !!language && !!page && !!limit,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage?.next?.page;
      return nextPage > 0 ? nextPage : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      const prevPage = firstPage?.prev?.page;
      return prevPage > 0 ? prevPage : undefined;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
