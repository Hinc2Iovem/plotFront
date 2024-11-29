import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CharacterGetTypes } from "../../../types/StoryData/Character/CharacterTypes";

export default function useGetCharacterById({ characterId }: { characterId: string }) {
  return useQuery({
    queryKey: ["character", characterId],
    queryFn: async () => await axiosCustomized.get<CharacterGetTypes>(`/characters/${characterId}`).then((r) => r.data),
    enabled: !!characterId,
  });
}
