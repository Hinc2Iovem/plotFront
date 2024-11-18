import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { KeyTypes } from "../../../../../types/StoryEditor/PlotField/Key/KeyTypes";

type GetCommandKeyTypes = {
  keyId: string;
};

export default function useGetKeyById({ keyId }: GetCommandKeyTypes) {
  return useQuery({
    queryKey: ["key", keyId],
    queryFn: async () =>
      await axiosCustomized.get<KeyTypes>(`/plotFieldCommands/keys/${keyId}/single`).then((r) => r.data),
    enabled: !!keyId,
  });
}
