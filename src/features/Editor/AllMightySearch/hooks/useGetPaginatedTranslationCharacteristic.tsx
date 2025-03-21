import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationCharacterCharacteristicTypes } from "../../../../types/Additional/TranslationTypes";

type GetPaginatedTranslationCharacteristicTypes = {
  storyId: string;
  page: number;
  limit: number;
  language: CurrentlyAvailableLanguagesTypes;
};

export type AllMightySearchCharacteristicResultTypes = {
  next: {
    page: number;
    limit: number;
  };
  prev: {
    page: number;
    prev: number;
  };
  results: TranslationCharacterCharacteristicTypes[];
  amountOfElements: number;
};

export const fetchAllMightyPaginatedTranslationCharacteristic = async ({
  limit,
  page,
  storyId,
  language,
}: GetPaginatedTranslationCharacteristicTypes): Promise<AllMightySearchCharacteristicResultTypes> => {
  return await axiosCustomized
    .get(
      `/characteristics/stories/translation/paginated/allMightySearch?storyId=${storyId}&page=${page}&limit=${limit}&currentLanguage=${language}`
    )
    .then((r) => r.data);
};

export default function useGetPaginatedTranslationCharacteristic({
  storyId,
  limit,
  page,
  language,
}: GetPaginatedTranslationCharacteristicTypes) {
  return useInfiniteQuery({
    queryKey: [
      "all-mighty-search",
      "story",
      storyId,
      "characteristic",
      "translation",
      language,
      "paginated",
      "page",
      page,
      "limit",
      limit,
    ],
    queryFn: () => fetchAllMightyPaginatedTranslationCharacteristic({ limit, page, storyId, language }),
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
