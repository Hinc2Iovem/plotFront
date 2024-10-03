import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationCharacterTypes } from "../../../../types/Additional/TranslationTypes";
import { SearchCharacterVariationTypes } from "../../../../features/Character/CharacterListPage";

type GetTranslationCharactersByTypeTypes = {
  storyId: string;
  language: CurrentlyAvailableLanguagesTypes;
  characterType?: SearchCharacterVariationTypes;
  debouncedValue?: string;
};

export const getTranslationCharactersByType = async ({
  language,
  storyId,
  characterType,
  debouncedValue,
}: GetTranslationCharactersByTypeTypes) => {
  return await axiosCustomized
    .get<TranslationCharacterTypes[]>(
      `/characters/stories/languages/search/translations?currentLanguage=${language}&storyId=${storyId}&characterType=${characterType}&text=${debouncedValue}`
    )
    .then((r) => r.data);
};

export default function useGetTranslationCharactersByType({
  storyId,
  language = "russian",
  characterType,
  debouncedValue,
}: GetTranslationCharactersByTypeTypes) {
  return useQuery({
    queryKey: [
      "translation",
      language,
      "character",
      "type",
      characterType,
      "story",
      storyId,
      "search",
      debouncedValue,
    ],
    queryFn: async () =>
      getTranslationCharactersByType({
        language,
        storyId,
        characterType,
        debouncedValue,
      }),
    enabled: !!storyId,
  });
}
