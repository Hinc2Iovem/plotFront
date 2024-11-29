import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type UpdateCharacterTypes = {
  characterId: string;
};

type UpdateCharacterBodyTypes = {
  nameTag?: string;
  type?: string;
  img?: string;
  currentLanguage: CurrentlyAvailableLanguagesTypes;
};

export default function useUpdateCharacter({ characterId }: UpdateCharacterTypes) {
  return useMutation({
    mutationFn: async ({ img, nameTag, type, currentLanguage }: UpdateCharacterBodyTypes) =>
      await axiosCustomized.patch(`/characters/${characterId}`, {
        img,
        nameTag,
        type,
        currentLanguage,
      }),
  });
}
