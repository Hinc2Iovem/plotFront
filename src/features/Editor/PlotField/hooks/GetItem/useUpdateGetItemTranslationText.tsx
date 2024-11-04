import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type UpdateGetItemTextTypes = {
  getItemId: string;
  buttonText?: string;
  itemName?: string;
  itemDescription?: string;
  language?: CurrentlyAvailableLanguagesTypes;
};

export default function useUpdateGetItemTranslationText({
  getItemId,
  buttonText,
  itemName,
  itemDescription,
  language = "russian",
}: UpdateGetItemTextTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.patch(
        `/translations/plotFieldCommands/getItems/${getItemId}`,
        {
          currentLanguage: language,
          buttonText,
          itemName,
          itemDescription,
        }
      ),
  });
}
