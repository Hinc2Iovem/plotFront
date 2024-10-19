import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CharacterGetTypes } from "../../../types/StoryData/Character/CharacterTypes";

type GetAllCharactersTypes = {
  storyId: string;
};

export const getAllCharacters = async ({ storyId }: GetAllCharactersTypes) => {
  return await axiosCustomized
    .get<CharacterGetTypes[]>(`/characters/stories/${storyId}`)
    .then((r) => r.data);
};

export default function useGetAllCharactersByStoryId({
  storyId,
}: GetAllCharactersTypes) {
  return useQuery({
    queryKey: ["story", storyId, "characters"],
    queryFn: () => getAllCharacters({ storyId }),
    enabled: !!storyId,
  });
}
