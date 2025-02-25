import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CharacterGetTypes } from "../../../types/StoryData/Character/CharacterTypes";

export const getCharacterById = async ({ characterId }: { characterId: string }): Promise<CharacterGetTypes> => {
  return await axiosCustomized.get<CharacterGetTypes>(`/characters/${characterId}`).then((r) => r.data);
};

export default function useGetCharacterById({ characterId }: { characterId: string }) {
  return useQuery({
    queryKey: ["character", characterId],
    queryFn: () => getCharacterById({ characterId }),
    enabled: !!characterId,
  });
}
