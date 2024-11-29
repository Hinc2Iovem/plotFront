import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationCharacterTypes } from "../../../../types/Additional/TranslationTypes";

type GetPaginatedTranslationCharacterTypes = {
  storyId: string;
  page: number;
  limit: number;
  language: CurrentlyAvailableLanguagesTypes;
};

export type AllMightySearchCharacterResultTypes = {
  next: {
    page: number;
    limit: number;
  };
  prev: {
    page: number;
    prev: number;
  };
  results: TranslationCharacterTypes[];
  amountOfElements: number;
};

export const fetchAllMightyPaginatedTranslationCharacter = async ({
  limit,
  page,
  storyId,
  language,
}: GetPaginatedTranslationCharacterTypes): Promise<AllMightySearchCharacterResultTypes> => {
  return await axiosCustomized
    .get(
      `/characters/stories/translation/paginated/allMightySearch?storyId=${storyId}&page=${page}&limit=${limit}&language=${language}`
    )
    .then((r) => r.data);
};

export default function useGetPaginatedTranslationCharacter({
  storyId,
  limit,
  page,
  language,
}: GetPaginatedTranslationCharacterTypes) {
  return useInfiniteQuery({
    queryKey: [
      "all-mighty-search",
      "story",
      storyId,
      "character",
      "translation",
      language,
      "paginated",
      "page",
      page,
      "limit",
      limit,
    ],
    queryFn: () => fetchAllMightyPaginatedTranslationCharacter({ limit, page, storyId, language }),
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
