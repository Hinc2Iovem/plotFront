import { useQueries } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationSeasonTypes } from "../../../../types/Additional/TranslationTypes";
import useGetSeasonsByStoryId from "../../Season/useGetSeasonsByStoryId";

export default function useGetTranslationSeasonsQueries({
  storyId,
  language = "russian",
}: {
  storyId: string;
  language?: CurrentlyAvailableLanguagesTypes;
}) {
  const { data: seasons } = useGetSeasonsByStoryId({
    storyId: storyId ?? "",
    language: "russian",
  });
  return useQueries({
    queries: (seasons ?? []).map((c) => {
      return {
        queryKey: ["translation", language, "season", c._id],
        queryFn: async () =>
          await axiosCustomized
            .get<TranslationSeasonTypes>(
              `/translations/seasons/${c._id}?currentLanguage=${language}`
            )
            .then((r) => r.data),
      };
    }),
  });
}
