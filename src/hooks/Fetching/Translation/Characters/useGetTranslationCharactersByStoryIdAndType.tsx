import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationCharacterTypes } from "../../../../types/Additional/TranslationTypes";
import { CharacterTypes } from "../../../../types/StoryData/Character/CharacterTypes";

type GetTranslationCharactersByStoryIdAndTypeTypes = {
  storyId: string;
  type: CharacterTypes;
  language: CurrentlyAvailableLanguagesTypes;
};

export const getTranslationCharactersByStoryIdAndType = async ({
  language,
  storyId,
  type,
}: GetTranslationCharactersByStoryIdAndTypeTypes) => {
  return await axiosCustomized
    .get<TranslationCharacterTypes[]>(
      `/characters/stories/${storyId}/type/translations?currentLanguage=${language}&type=${type}`
    )
    .then((r) => r.data);
};

export default function useGetTranslationCharactersByStoryIdAndType({
  storyId,
  language,
  type,
}: GetTranslationCharactersByStoryIdAndTypeTypes) {
  return useQuery({
    queryKey: ["translation", language, "character", "type", type, "story", storyId],
    queryFn: () => getTranslationCharactersByStoryIdAndType({ language, storyId, type }),
    enabled: !!storyId && !!language && !!type,
  });
}
