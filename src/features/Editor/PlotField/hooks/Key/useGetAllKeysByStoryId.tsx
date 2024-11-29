import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { KeyTypes } from "../../../../../types/StoryEditor/PlotField/Key/KeyTypes";

type GetCommandKeyTypes = {
  storyId: string;
  enabled?: boolean;
};

export const fetchAllKeys = async ({ storyId }: GetCommandKeyTypes) => {
  return await axiosCustomized.get<KeyTypes[]>(`/keys/stories/${storyId}`).then((r) => r.data);
};

export default function useGetAllKeysByStoryId({ storyId, enabled = !!storyId }: GetCommandKeyTypes) {
  return useQuery({
    queryKey: ["stories", storyId, "key"],
    queryFn: () => fetchAllKeys({ storyId }),
    enabled,
  });
}
