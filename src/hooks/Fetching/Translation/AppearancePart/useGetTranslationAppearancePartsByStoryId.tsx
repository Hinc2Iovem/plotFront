import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationAppearancePartTypes } from "../../../../types/Additional/TranslationTypes";

type AppearancePartTypes = {
  storyId: string;
  enabled?: boolean;
  language?: CurrentlyAvailableLanguagesTypes;
};

export const fetchAllTranslationAppearanceParts = async ({ storyId, language }: AppearancePartTypes) => {
  return await axiosCustomized
    .get<TranslationAppearancePartTypes[]>(
      `/appearanceParts/stories/${storyId}/translations?currentLanguage=${language}`
    )
    .then((r) => r.data);
};

export default function useGetTranslationAppearancePartsByStoryId({
  storyId,
  language = "russian",
  enabled = !!storyId && !!language,
}: AppearancePartTypes) {
  return useQuery({
    queryKey: ["translation", language, "story", storyId, "appearancePart"],
    queryFn: () => fetchAllTranslationAppearanceParts({ storyId, language }),
    enabled,
  });
}
