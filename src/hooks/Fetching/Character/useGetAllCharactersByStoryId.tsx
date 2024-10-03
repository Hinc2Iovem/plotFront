import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CharacterGetTypes } from "../../../types/StoryData/Character/CharacterTypes";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

export default function useGetAllCharactersByStoryId({
  storyId,
  language,
}: {
  storyId: string;
  language: CurrentlyAvailableLanguagesTypes;
}) {
  return useQuery({
    queryKey: ["story", storyId, "characters"],
    queryFn: async () =>
      await axiosCustomized
        .get<CharacterGetTypes[]>(`/characters/stories/${storyId}`)
        .then((r) => r.data),
    enabled: !!storyId && !!language,
  });
}
