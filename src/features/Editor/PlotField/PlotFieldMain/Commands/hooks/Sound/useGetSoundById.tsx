import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { SoundTypes } from "../../../../../../../types/StoryData/Sound/SoundTypes";

type GetSoundByIdTypes = {
  soundId: string;
};

export default function useGetSoundById({ soundId }: GetSoundByIdTypes) {
  return useQuery({
    queryKey: ["story", "sound", soundId],
    queryFn: async () =>
      await axiosCustomized
        .get<SoundTypes>(`/stories/sounds/${soundId}`)
        .then((r) => r.data),
    enabled: !!soundId,
  });
}
