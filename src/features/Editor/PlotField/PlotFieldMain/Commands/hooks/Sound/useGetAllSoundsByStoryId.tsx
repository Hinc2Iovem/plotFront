import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { SoundTypes } from "../../../../../../../types/StoryData/Sound/SoundTypes";

type GetSoundByIdTypes = {
  storyId: string;
};

export default function useGetAllSoundByStoryId({
  storyId,
}: GetSoundByIdTypes) {
  return useQuery({
    queryKey: ["story", storyId, "sound"],
    queryFn: async () =>
      await axiosCustomized
        .get<SoundTypes[]>(`/stories/${storyId}/sounds`)
        .then((r) => r.data),
  });
}
