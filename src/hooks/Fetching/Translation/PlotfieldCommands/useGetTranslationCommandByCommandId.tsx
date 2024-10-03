import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationCommandTypes } from "../../../../types/Additional/TranslationTypes";

export default function useGetTranslationCommandByCommandId({
  commandId,
  language = "russian",
}: {
  commandId: string;
  language?: CurrentlyAvailableLanguagesTypes;
}) {
  return useQuery({
    queryKey: ["translation", language, "plotFieldCommand", commandId],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationCommandTypes[]>(
          `/translations/plotFieldCommands/${commandId}?currentLanguage=${language}`
        )
        .then((r) => r.data),
    enabled: !!commandId,
  });
}
