import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { MusicTypes } from "../../../../../../../types/StoryData/Music/MusicTypes";

type GetMusicByIdTypes = {
  musicId: string;
};

export const getMusicById = async ({ musicId }: GetMusicByIdTypes) => {
  return await axiosCustomized
    .get<MusicTypes>(`/stories/music/${musicId}`)
    .then((r) => r.data);
};

export default function useGetMusicById({ musicId }: GetMusicByIdTypes) {
  return useQuery({
    queryKey: ["stories", "music", musicId],
    queryFn: async () => getMusicById({ musicId }),
    enabled: !!musicId,
  });
}
