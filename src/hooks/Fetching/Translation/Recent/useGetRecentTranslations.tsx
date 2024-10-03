import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { UpdatedAtPossibleVariationTypes } from "../../../../features/Profile/Translator/Recent/Filters/FiltersEverythingRecent";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { RecentTranslationTypes } from "../../../../types/Additional/TranslationTypes";

export default function useGetRecentTranslations({
  updateAt,
  language = "russian",
}: {
  updateAt: UpdatedAtPossibleVariationTypes;
  language?: CurrentlyAvailableLanguagesTypes;
}) {
  return useQuery({
    queryKey: ["translation", language, "updatedAt", updateAt],
    queryFn: async () =>
      await axiosCustomized
        .get<RecentTranslationTypes[]>(
          `/translations/recent?currentLanguage=${language}&updatedAt=${updateAt}`
        )
        .then((r) => r.data),
    enabled: !!language && !!updateAt,
  });
}
