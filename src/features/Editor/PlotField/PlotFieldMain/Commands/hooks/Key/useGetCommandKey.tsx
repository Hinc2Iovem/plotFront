import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { KeyTypes } from "../../../../../../../types/StoryEditor/PlotField/Key/KeyTypes";

type GetCommandKeyTypes = {
  plotFieldCommandId: string;
};

export default function useGetCommandKey({
  plotFieldCommandId,
}: GetCommandKeyTypes) {
  return useQuery({
    queryKey: ["plotfieldCommand", plotFieldCommandId, "key"],
    queryFn: async () =>
      await axiosCustomized
        .get<KeyTypes>(`/plotFieldCommands/${plotFieldCommandId}/keys`)
        .then((r) => r.data),
  });
}
