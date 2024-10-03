import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { WaitTypes } from "../../../../../../../types/StoryEditor/PlotField/Wait/WaitTypes";

type GetCommandWaitTypes = {
  plotFieldCommandId: string;
};

export default function useGetCommandWait({
  plotFieldCommandId,
}: GetCommandWaitTypes) {
  return useQuery({
    queryKey: ["plotfieldCommand", plotFieldCommandId, "wait"],
    queryFn: async () =>
      await axiosCustomized
        .get<WaitTypes>(`/plotFieldCommands/${plotFieldCommandId}/wait`)
        .then((r) => r.data),
    enabled: !!plotFieldCommandId,
  });
}
