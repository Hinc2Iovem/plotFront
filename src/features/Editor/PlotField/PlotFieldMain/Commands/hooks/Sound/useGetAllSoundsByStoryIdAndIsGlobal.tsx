import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { SoundTypes } from "../../../../../../../types/StoryData/Sound/SoundTypes";

type GetSoundByIdTypes = {
  storyId: string;
};

export default function useGetAllSoundByStoryIdAndIsGlobal({
  storyId,
}: GetSoundByIdTypes) {
  return useQuery({
    queryKey: ["story", storyId, "sound", "isGlobal"],
    queryFn: async () =>
      await axiosCustomized
        .get<SoundTypes[]>(`/stories/${storyId}/sounds/isGlobal`)
        .then((r) => r.data),
    enabled: !!storyId,
  });
}
