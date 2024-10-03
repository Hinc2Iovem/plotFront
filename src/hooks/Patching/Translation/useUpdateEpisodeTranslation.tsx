import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationTextFieldNameEpisodeTypes } from "../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";

type UpdateEpisodeTranslationTypes = {
  episodeId: string;
  seasonId: string;
  language: CurrentlyAvailableLanguagesTypes;
};

type UpdateEpisodeTranslationOnMutationTypes = {
  text: string;
  textFieldName: TranslationTextFieldNameEpisodeTypes;
};

export default function useUpdateEpisodeTranslation({
  episodeId,
  seasonId,
  language,
}: UpdateEpisodeTranslationTypes) {
  return useMutation({
    mutationFn: async ({
      text,
      textFieldName,
    }: UpdateEpisodeTranslationOnMutationTypes) =>
      await axiosCustomized.patch(`/episodes/${episodeId}/translations`, {
        currentLanguage: language,
        text,
        textFieldName,
        seasonId,
      }),
  });
}
