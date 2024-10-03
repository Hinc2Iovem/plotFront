import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationStoryTypes } from "../../../types/Additional/TranslationTypes";

type GetTranslationStoryTypes = {
  storyId: string;
  language: CurrentlyAvailableLanguagesTypes;
};

const getStoryById = async ({
  storyId,
  language,
}: GetTranslationStoryTypes): Promise<TranslationStoryTypes> => {
  return await axiosCustomized
    .get(`/stories/${storyId}/translations?currentLanguage=${language}`)
    .then((r) => r.data);
};

export default function useGetTranslationStoryById({
  storyId,
  language,
}: GetTranslationStoryTypes) {
  return useQuery({
    queryKey: ["stories", storyId, "language", language],
    queryFn: () => getStoryById({ storyId: storyId, language }),
  });
}
