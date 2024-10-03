import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CharacterCharacteristicTypes } from "../../../types/StoryData/Characteristic/Characteristic";

export default function useGetAllCharacteristics() {
  return useQuery({
    queryKey: ["characteristics"],
    queryFn: async () =>
      await axiosCustomized
        .get<CharacterCharacteristicTypes[]>(`/characterCharacteristics`)
        .then((r) => r.data),
  });
}
