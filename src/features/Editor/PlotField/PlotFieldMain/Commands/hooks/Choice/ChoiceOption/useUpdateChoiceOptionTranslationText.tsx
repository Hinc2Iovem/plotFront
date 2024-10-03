import { useMutation } from "@tanstack/react-query";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { axiosCustomized } from "../../../../../../../../api/axios";
import { TranslationTextFieldName } from "../../../../../../../../const/TRANSLATION_TEXT_FIELD_NAMES";
import { ChoiceOptionVariationsTypes } from "../../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";

type UpdateChoiceOptionTextTypes = {
  choiceOptionId: string;
  option: string;
  choiceId?: string;
  type: ChoiceOptionVariationsTypes;
  language?: CurrentlyAvailableLanguagesTypes;
};

export default function useUpdateChoiceOptionTranslationText({
  choiceOptionId,
  choiceId,
  option,
  type,
  language = "russian",
}: UpdateChoiceOptionTextTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.patch(
        `/choiceOptions/${choiceOptionId}/choices/${choiceId}/translations`,
        {
          currentLanguage: language,
          text: option,
          textFieldName: TranslationTextFieldName.ChoiceOption,
          type,
        }
      ),
  });
}
