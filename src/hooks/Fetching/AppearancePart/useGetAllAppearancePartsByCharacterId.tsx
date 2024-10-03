import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { AppearancePartTypes } from "../../../types/StoryData/AppearancePart/AppearancePartTypes";

export default function useGetAllAppearancePartsByCharacterId({
  characterId,
}: {
  characterId: string;
}) {
  return useQuery({
    queryKey: ["appearancePart", "character", characterId],
    queryFn: async () =>
      await axiosCustomized
        .get<AppearancePartTypes[]>(
          `/appearanceParts/characters/${characterId}`
        )
        .then((r) => r.data),
    enabled: !!characterId,
  });
}
