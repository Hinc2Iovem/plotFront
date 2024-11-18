import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { KeyTypes } from "../../../../../types/StoryEditor/PlotField/Key/KeyTypes";

type GetCommandKeyTypes = {
  storyId: string;
};

export const fetchAllKeys = async ({ storyId }: GetCommandKeyTypes) => {
  return await axiosCustomized.get<KeyTypes[]>(`/plotFieldCommands/stories/${storyId}/keys`).then((r) => r.data);
};

export default function useGetAllKeysByStoryId({ storyId }: GetCommandKeyTypes) {
  return useQuery({
    queryKey: ["stories", storyId, "key"],
    queryFn: () => fetchAllKeys({ storyId }),
    enabled: !!storyId,
  });
}
