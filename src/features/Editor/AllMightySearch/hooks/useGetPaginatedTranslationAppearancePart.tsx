import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationTextFieldNameAppearancePartsTypes } from "../../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";
import { TranslationAppearancePartTypes } from "../../../../types/Additional/TranslationTypes";

type GetPaginatedTranslationAppearancePartTypes = {
  storyId: string;
  page: number;
  limit: number;
  language: CurrentlyAvailableLanguagesTypes;
  characterId: string;
  type: TranslationTextFieldNameAppearancePartsTypes | "temp";
};

export type AllMightySearchAppearancePartResultTypes = {
  next: {
    page: number;
    limit: number;
  };
  prev: {
    page: number;
    prev: number;
  };
  results: TranslationAppearancePartTypes[];
  amountOfElements: number;
};

export const fetchAllMightyPaginatedTranslationAppearancePart = async ({
  limit,
  page,
  storyId,
  language,
  characterId,
  type,
}: GetPaginatedTranslationAppearancePartTypes): Promise<AllMightySearchAppearancePartResultTypes> => {
  return await axiosCustomized
    .get(
      `/appearanceParts/stories/translation/paginated/allMightySearch?storyId=${storyId}&page=${page}&limit=${limit}&currentLanguage=${language}&characterId=${characterId}&type=${type}`
    )
    .then((r) => r.data);
};

export default function useGetPaginatedTranslationAppearancePart({
  storyId,
  limit,
  page,
  language,
  characterId,
  type,
}: GetPaginatedTranslationAppearancePartTypes) {
  return useInfiniteQuery({
    queryKey: [
      "all-mighty-search",
      "story",
      storyId,
      "appearancePart",
      "character",
      characterId,
      "type",
      type,
      "translation",
      language,
      "paginated",
      "page",
      page,
      "limit",
      limit,
    ],
    queryFn: () =>
      fetchAllMightyPaginatedTranslationAppearancePart({ limit, page, storyId, language, characterId, type }),
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
