import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CharacterGetTypes } from "../../../types/StoryData/Character/CharacterTypes";
import { SearchCharacterVariationTypes } from "../../../features/Character/CharacterListPage";

type GetAllCharactersByStoryIdAndTypeProps = {
  storyId: string;
  searchCharacterType: SearchCharacterVariationTypes;
};

export default function useGetAllCharactersByStoryIdAndType({
  storyId,
  searchCharacterType,
}: GetAllCharactersByStoryIdAndTypeProps) {
  return useQuery({
    queryKey: ["story", storyId, "characters", searchCharacterType],
    queryFn: async () =>
      await axiosCustomized
        .get<CharacterGetTypes[]>(
          `/characters/stories/${storyId}/type?type=${searchCharacterType}`
        )
        .then((r) => r.data),
  });
}
