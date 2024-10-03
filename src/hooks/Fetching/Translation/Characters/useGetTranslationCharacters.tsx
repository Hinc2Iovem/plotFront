import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationCharacterTypes } from "../../../../types/Additional/TranslationTypes";

type GetTranslationCharactersTypes = {
  storyId: string;
  language: CurrentlyAvailableLanguagesTypes;
};

export const getTranslationCharacters = async ({
  language,
  storyId,
}: GetTranslationCharactersTypes) => {
  return await axiosCustomized
    .get<TranslationCharacterTypes[]>(
      `/characters/stories/${storyId}/translations?currentLanguage=${language}`
    )
    .then((r) => r.data);
};

export default function useGetTranslationCharacters({
  storyId,
  language,
}: GetTranslationCharactersTypes) {
  return useQuery({
    queryKey: ["translation", language, "character", "story", storyId],
    queryFn: () => getTranslationCharacters({ language, storyId }),
    enabled: !!storyId && !!language,
  });
}
