import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import {
  AllTranslationTextFieldNamesTypes,
  TranslationSeasonTypes,
} from "../../../types/Additional/TranslationTypes";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type DebouncedTranslationsTypes = {
  language: CurrentlyAvailableLanguagesTypes;
  text: string;
  textFieldName: AllTranslationTextFieldNamesTypes;
};

const getDebouncedSeasons = async ({
  language = "russian",
  text,
  textFieldName,
}: DebouncedTranslationsTypes): Promise<TranslationSeasonTypes[]> => {
  return await axiosCustomized
    .get(
      `/translations/textFieldNames/search?currentLanguage=${language}&textFieldName=${textFieldName}&text=${text}`
    )
    .then((r) => r.data);
};

export default function useGetSeasonTranslationByTextFieldNameAndSearch({
  debouncedValue,
  language,
  storyId,
}: {
  debouncedValue: string;
  storyId: string;
  language: CurrentlyAvailableLanguagesTypes;
}) {
  return useQuery({
    queryKey: [
      "translation",
      "textFieldName",
      "search",
      "seasons",
      debouncedValue,
    ],
    queryFn: () =>
      getDebouncedSeasons({
        text: debouncedValue,
        textFieldName: "seasonName",
        language,
      }),
    enabled: !!language && !!storyId,
  });
}
