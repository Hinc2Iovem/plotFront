import { useQuery } from "@tanstack/react-query";
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
  return useQuery({
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
  });
}
