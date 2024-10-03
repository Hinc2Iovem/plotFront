import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { StoryTypes } from "../../../types/StoryData/Story/StoryTypes";

const getStoryById = async ({ id }: { id: string }): Promise<StoryTypes> => {
  return await axiosCustomized.get(`/stories/${id}`).then((r) => r.data);
};

export default function useGetSingleStory({ storyId }: { storyId: string }) {
  return useQuery({
    queryKey: ["stories", storyId],
    queryFn: () => getStoryById({ id: storyId }),
    enabled: !!storyId,
  });
}
