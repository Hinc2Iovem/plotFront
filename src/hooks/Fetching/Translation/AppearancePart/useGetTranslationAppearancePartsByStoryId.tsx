import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationAppearancePartTypes } from "../../../../types/Additional/TranslationTypes";

export default function useGetTranslationAppearancePartsByStoryId({
  storyId,
  language = "russian",
}: {
  storyId: string;
  language?: CurrentlyAvailableLanguagesTypes;
}) {
  return useQuery({
    queryKey: ["translation", language, "story", storyId, "appearancePart"],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationAppearancePartTypes[]>(
          `/appearanceParts/stories/${storyId}/translations?currentLanguage=${language}`
        )
        .then((r) => r.data),
    enabled: !!storyId && !!language,
  });
}
