import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationCharacterTypes } from "../../../types/Additional/TranslationTypes";

type DebouncedTranslationsTypes = {
  language?: CurrentlyAvailableLanguagesTypes;
  text: string;
  textFieldName: string;
};

const getDebouncedCharacters = async ({
  language = "russian",
  text,
  textFieldName,
}: DebouncedTranslationsTypes): Promise<TranslationCharacterTypes[]> => {
  return await axiosCustomized
    .get(
      `/translations/textFieldNames?currentLanguage=${language}&textFieldName=${textFieldName}&text=${text}`
    )
    .then((r) => r.data);
};

export default function useGetCharacterTranslationByTextFieldName({
  debouncedValue,
}: {
  debouncedValue: string;
}) {
  return useQuery({
    queryKey: ["translation", "textFieldName", "characters", debouncedValue],
    queryFn: () =>
      getDebouncedCharacters({
        text: debouncedValue,
        textFieldName: "characterName",
      }),
    enabled: debouncedValue?.trim().length > 0,
  });
}
