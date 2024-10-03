import { useQuery } from "@tanstack/react-query";
import { TranslationEpisodeTypes } from "../../../types/Additional/TranslationTypes";
import { axiosCustomized } from "../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type GetTranslationEpisodeTypes = {
  episodeId: string;
  language: CurrentlyAvailableLanguagesTypes;
};

export const getTranslationEpisode = async ({
  episodeId,
  language,
}: GetTranslationEpisodeTypes) => {
  return await axiosCustomized
    .get<TranslationEpisodeTypes>(
      `/episodes/${episodeId}/translations?currentLanguage=${language}`
    )
    .then((r) => r.data);
};

export default function useGetTranslationEpisode({
  episodeId,
  language = "russian",
}: GetTranslationEpisodeTypes) {
  return useQuery({
    queryKey: ["translation", language, "episode", episodeId],
    queryFn: () => getTranslationEpisode({ episodeId, language }),
    enabled: !!episodeId,
  });
}
