import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationCommandWardrobeTypes } from "../../../../../types/Additional/TranslationTypes";

export default function useGetAllCommandWardrobeTranslationsByTopologyBlockId({
  topologyBlockId,
  language,
}: {
  topologyBlockId: string;
  language: CurrentlyAvailableLanguagesTypes;
}) {
  return useQuery({
    queryKey: ["translation", language, "plotFieldCommand", "commandWardrobe"],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationCommandWardrobeTypes[]>(
          `/commandWardrobes/topologyBlocks/${topologyBlockId}/translations/?currentLanguage=${language}`
        )
        .then((r) => r.data),
    enabled: !!topologyBlockId && !!language,
  });
}
