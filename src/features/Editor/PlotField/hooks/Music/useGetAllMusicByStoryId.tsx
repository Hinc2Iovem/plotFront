import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { MusicTypes } from "../../../../../types/StoryData/Music/MusicTypes";

type GetMusicByIdTypes = {
  storyId: string;
};

export const fetchAllMusic = async ({ storyId }: GetMusicByIdTypes) => {
  return await axiosCustomized.get<MusicTypes[]>(`/stories/${storyId}/music`).then((r) => r.data);
};

export default function useGetAllMusicByStoryId({ storyId }: GetMusicByIdTypes) {
  return useQuery({
    queryKey: ["stories", storyId, "music"],
    queryFn: () => fetchAllMusic({ storyId }),
    enabled: !!storyId,
  });
}
