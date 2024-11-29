import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationCharacterCharacteristicTypes } from "../../../../types/Additional/TranslationTypes";

type CharacteristicTypes = {
  storyId: string;
  enabled?: boolean;
  language: CurrentlyAvailableLanguagesTypes;
};

export const fetchAllTranslationCharacteristics = async ({ language, storyId }: CharacteristicTypes) => {
  return await axiosCustomized
    .get<TranslationCharacterCharacteristicTypes[]>(
      `/characteristics/stories/${storyId}/translations?currentLanguage=${language}`
    )
    .then((r) => r.data);
};

export default function useGetAllCharacteristicsByStoryId({
  storyId,
  language = "russian",
  enabled = !!storyId && !!language,
}: CharacteristicTypes) {
  return useQuery({
    queryKey: ["translation", language, "story", storyId, "characteristic"],
    queryFn: () => fetchAllTranslationCharacteristics({ language, storyId }),
    enabled,
  });
}
