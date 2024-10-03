import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { TranslationStoryTypes } from "../../../types/Additional/TranslationTypes";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { StoryFilterTypes } from "../../../features/Story/Story";

type DebouncedTranslationsTypes = {
  language: CurrentlyAvailableLanguagesTypes;
  text: string;
  staffId: string;
};

const getDebouncedStories = async ({
  language = "russian",
  text,
  staffId,
}: DebouncedTranslationsTypes): Promise<TranslationStoryTypes[]> => {
  return await axiosCustomized
    .get(
      `/translations/textFieldNames/stories/staff/${staffId}/search?currentLanguage=${language}&text=${text}`
    )
    .then((r) => r.data);
};

export default function useGetStoryTranslationByTextFieldNameAndSearchAssigned({
  debouncedValue,
  language,
  staffId,
  storiesType,
}: {
  debouncedValue: string;
  staffId: string;
  language: CurrentlyAvailableLanguagesTypes;
  storiesType: StoryFilterTypes;
}) {
  return useQuery({
    queryKey: [
      "translation",
      "textFieldName",
      "search",
      "assigned",
      staffId,
      "stories",
      debouncedValue,
    ],
    queryFn: () =>
      getDebouncedStories({
        text: debouncedValue,
        staffId,
        language,
      }),
    enabled: !!language && storiesType === "allAssigned" && !!staffId,
  });
}
