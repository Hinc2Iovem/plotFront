import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { TranslationTextFieldName } from "../../../const/TRANSLATION_TEXT_FIELD_NAMES";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type UpdateSeasonTranslationTypes = {
  seasonId: string;
  storyId: string;
  language: CurrentlyAvailableLanguagesTypes;
};

type UpdateSeasonTranslationOnMutationTypes = {
  seasonName?: string;
};

export default function useUpdateSeasonTranslation({
  seasonId,
  language,
  storyId,
}: UpdateSeasonTranslationTypes) {
  return useMutation({
    mutationFn: async ({
      seasonName,
    }: UpdateSeasonTranslationOnMutationTypes) =>
      await axiosCustomized.patch(`/seasons/${seasonId}/translations`, {
        currentLanguage: language,
        text: seasonName,
        textFieldName: TranslationTextFieldName.SeasonName,
        storyId,
      }),
  });
}
