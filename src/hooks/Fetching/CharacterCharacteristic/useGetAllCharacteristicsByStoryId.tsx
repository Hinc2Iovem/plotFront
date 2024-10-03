import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CharacterCharacteristicTypes } from "../../../types/StoryData/Characteristic/Characteristic";

type GetAllCharacteristicsTypes = {
  storyId: string;
};

export default function useGetAllCharacteristicsByStoryId({
  storyId,
}: GetAllCharacteristicsTypes) {
  return useQuery({
    queryKey: ["characteristics", "stories", storyId],
    queryFn: async () =>
      await axiosCustomized
        .get<CharacterCharacteristicTypes[]>(
          `/characterCharacteristics/stories/${storyId}`
        )
        .then((r) => r.data),
    enabled: !!storyId,
  });
}
