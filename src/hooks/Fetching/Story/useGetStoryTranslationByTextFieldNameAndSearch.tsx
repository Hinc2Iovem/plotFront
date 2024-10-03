import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { TranslationStoryTypes } from "../../../types/Additional/TranslationTypes";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { StoryFilterTypes } from "../../../features/Story/Story";

type DebouncedTranslationsTypes = {
  language: CurrentlyAvailableLanguagesTypes;
  text: string;
  textFieldName: string;
};

const getDebouncedStories = async ({
  language = "russian",
  text,
  textFieldName,
}: DebouncedTranslationsTypes): Promise<TranslationStoryTypes[]> => {
  return await axiosCustomized
    .get(
      `/translations/textFieldNames/search?currentLanguage=${language}&textFieldName=${textFieldName}&text=${text}`
    )
    .then((r) => r.data);
};

export default function useGetStoryTranslationByTextFieldNameAndSearch({
  debouncedValue,
  language,
  storiesType,
}: {
  debouncedValue: string;
  language: CurrentlyAvailableLanguagesTypes;
  storiesType: StoryFilterTypes;
}) {
  return useQuery({
    queryKey: [
      "translation",
      "textFieldName",
      "search",
      "stories",
      debouncedValue,
    ],
    queryFn: () =>
      getDebouncedStories({
        text: debouncedValue,
        textFieldName: "storyName",
        language,
      }),
    enabled: !!language && !!debouncedValue && storiesType === "all",
  });
}
