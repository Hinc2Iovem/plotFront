import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CharacterCharacteristicTypes } from "../../../types/StoryData/Characteristic/Characteristic";

export default function useGetSingleCharacteristicById({
  characterCharacteristicId,
}: {
  characterCharacteristicId: string;
}) {
  return useQuery({
    queryKey: ["characteristic", characterCharacteristicId],
    queryFn: async () =>
      await axiosCustomized
        .get<CharacterCharacteristicTypes>(
          `/characterCharacteristics/${characterCharacteristicId}`
        )
        .then((r) => r.data),
    enabled: !!characterCharacteristicId,
  });
}
