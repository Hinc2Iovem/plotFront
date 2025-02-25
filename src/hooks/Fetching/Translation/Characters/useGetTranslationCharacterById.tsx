import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationCharacterTypes } from "../../../../types/Additional/TranslationTypes";

type GetTranslationCharacterByIdTypes = {
  characterId: string;
  language: CurrentlyAvailableLanguagesTypes;
};

export const getTranslationCharacterById = async ({
  characterId,
  language,
}: GetTranslationCharacterByIdTypes): Promise<TranslationCharacterTypes> => {
  return await axiosCustomized
    .get<TranslationCharacterTypes>(`/characters/${characterId}/translations?currentLanguage=${language}`)
    .then((r) => r.data);
};

export default function useGetTranslationCharacterById({ characterId, language }: GetTranslationCharacterByIdTypes) {
  return useQuery({
    queryKey: ["translation", language, "character", characterId],
    queryFn: () => getTranslationCharacterById({ characterId, language }),
    enabled: !!characterId && !!language,
  });
}
