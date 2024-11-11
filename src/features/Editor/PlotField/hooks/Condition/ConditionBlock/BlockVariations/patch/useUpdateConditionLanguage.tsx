import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type UpdateConditionLanguageProps = {
  conditionBlockLanguageId: string;
};

type UpdateConditionLanguageBody = {
  language?: CurrentlyAvailableLanguagesTypes;
};

export default function useUpdateConditionLanguage({ conditionBlockLanguageId }: UpdateConditionLanguageProps) {
  return useMutation({
    mutationFn: async ({ language }: UpdateConditionLanguageBody) =>
      await axiosCustomized.patch(`/commandConditions/conditionBlocks/conditionLanguage/${conditionBlockLanguageId}`, {
        language,
      }),
  });
}
