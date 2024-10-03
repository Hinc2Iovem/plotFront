import { useQueries } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import useGetAllTranslatablePlotFieldCommands from "../../../../features/Editor/PlotField/PlotFieldMain/Commands/hooks/useGetAllTranslatablePlotFieldCommands";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationCommandTypes } from "../../../../types/Additional/TranslationTypes";

export default function useGetTranslationCommandsQueries({
  topologyBlockId,
  language = "russian",
}: {
  topologyBlockId: string;
  language?: CurrentlyAvailableLanguagesTypes;
}) {
  const { data: commands } = useGetAllTranslatablePlotFieldCommands({
    topologyBlockId,
  });

  return useQueries({
    queries: (commands ?? []).map((c) => {
      const commandType =
        c.command === "achievement"
          ? "achievements"
          : c.command === "choice"
          ? "choices"
          : c.command === "getitem"
          ? "getItems"
          : c.command === "say"
          ? "say"
          : c.command === "wardrobe"
          ? "wardrobes"
          : "say";

      return {
        queryKey: ["translation", language, "plotFieldCommand", c._id],
        queryFn: async () =>
          await axiosCustomized
            .get<TranslationCommandTypes[]>(
              `/translations/plotFieldCommands/${c._id}/${commandType}?currentLanguage=${language}`
            )
            .then((r) => r.data),
      };
    }),
  });
}
