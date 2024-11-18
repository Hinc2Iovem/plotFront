import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { SoundTypes } from "../../../../../types/StoryData/Sound/SoundTypes";

type GetSoundByIdTypes = {
  storyId: string;
};

export const fetchAllSound = async ({ storyId }: GetSoundByIdTypes) => {
  return await axiosCustomized.get<SoundTypes[]>(`/stories/${storyId}/sounds`).then((r) => r.data);
};

export default function useGetAllSoundByStoryId({ storyId }: GetSoundByIdTypes) {
  return useQuery({
    queryKey: ["story", storyId, "sound"],
    queryFn: () => fetchAllSound({ storyId }),
  });
}
