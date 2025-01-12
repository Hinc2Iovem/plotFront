import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationTextFieldNameAppearancePartsTypes } from "../../../types/Additional/TRANSLATION_TEXT_FIELD_NAMES";
import { TranslationAppearancePartTypes } from "../../../types/Additional/TranslationTypes";

export default function useGetAllAppearancePartsByCharacterIdAndType({
  characterId,
  appearanceType,
  language,
}: {
  characterId: string;
  appearanceType: TranslationTextFieldNameAppearancePartsTypes | "temp";
  language: CurrentlyAvailableLanguagesTypes;
}) {
  console.log("main hook: ", "appearancePart", appearanceType?.toLowerCase(), "character", characterId);

  return useQuery({
    queryKey: ["appearancePart", appearanceType?.toLowerCase(), "character", characterId],
    queryFn: async () =>
      await axiosCustomized
        .get<TranslationAppearancePartTypes[]>(
          `/appearanceParts/characters/${characterId}/types/translations?type=${appearanceType}&currentLanguage=${language}`
        )
        .then((r) => r.data),
    enabled: !!characterId,
  });
}
