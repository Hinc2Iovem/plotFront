import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type UpdateChoiceTextTypes = {
  choiceId: string;
  choiceQuestion: string;
  language?: CurrentlyAvailableLanguagesTypes;
};

export default function useUpdateChoiceTranslationText({
  choiceId,
  choiceQuestion,
  language = "russian",
}: UpdateChoiceTextTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.patch(
        `/translations/plotFieldCommands/choices/${choiceId}`,
        {
          currentLanguage: language,
          choiceQuestion,
        }
      ),
  });
}
