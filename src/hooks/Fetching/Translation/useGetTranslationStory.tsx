import { useQuery } from "@tanstack/react-query";
import {
  GetTranslationTypes,
  TranslationStoryTypes,
} from "../../../types/Additional/TranslationTypes";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { axiosCustomized } from "../../../api/axios";

const getTranslation = async ({
  path,
  id,
  language = "russian",
}: GetTranslationTypes): Promise<TranslationStoryTypes[]> => {
  const res = await axiosCustomized
    .get(`${path}/${id}?currentLanguage=${language}`)
    .then((r) => r.data);
  return res;
};

type GetTranslationStoryTypes = {
  id: string;
  language?: CurrentlyAvailableLanguagesTypes;
};

export default function useGetTranslationStory({
  id,
  language,
}: GetTranslationStoryTypes) {
  return useQuery({
    queryKey: ["translation", "story", id],
    queryFn: () =>
      getTranslation({
        path: "/translations/stories",
        id,
        language,
      }),
  });
}
