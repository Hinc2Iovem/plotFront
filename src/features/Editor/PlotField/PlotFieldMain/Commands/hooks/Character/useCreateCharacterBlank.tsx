import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import {
  CharacterGetTypes,
  CharacterTypes,
} from "../../../../../../../types/StoryData/Character/CharacterTypes";

type CreateCharacterTypes = {
  storyId: string;
  name: string;
  characterType: CharacterTypes;
  language?: CurrentlyAvailableLanguagesTypes;
  onSuccessCallback?: (characterId: string) => void;
};

export default function useCreateCharacterBlank({
  storyId,
  name,
  characterType,
  language = "russian",
  onSuccessCallback,
}: CreateCharacterTypes) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["story", storyId, "new", "character", name],
    mutationFn: async ({ characterId }: { characterId: string }) =>
      await axiosCustomized
        .post<CharacterGetTypes>(`/characters/stories/${storyId}/blank`, {
          name,
          currentLanguage: language,
          type: characterType.toLowerCase(),
          characterId,
        })
        .then((r) => r.data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["translation", language, "character", "story", storyId],
        exact: true,
        type: "active",
      });
      if (onSuccessCallback) {
        onSuccessCallback(variables.characterId);
      }
      // queryClient.invalidateQueries({
      //   queryKey: ["plotfieldComamnd", plotFieldCommandId, "say"],
      //   exact: true,
      //   type: "active",
      // });
    },
  });
}
