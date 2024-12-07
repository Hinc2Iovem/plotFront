import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type UpdateIfLanguageProps = {
  ifLanguageId: string;
};

type UpdateIfLanguageBody = {
  language?: CurrentlyAvailableLanguagesTypes;
};

export default function useUpdateIfLanguage({ ifLanguageId }: UpdateIfLanguageProps) {
  return useMutation({
    mutationFn: async ({ language }: UpdateIfLanguageBody) =>
      await axiosCustomized.patch(`/ifs/ifLanguage/${ifLanguageId}`, {
        language,
      }),
  });
}
