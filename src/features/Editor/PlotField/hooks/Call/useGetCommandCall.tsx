import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { CallTypes } from "../../../../../types/StoryEditor/PlotField/Call/CallTypes";
import { getTopologyBlockById } from "../TopologyBlock/useGetTopologyBlockById";

type GetCommandCallTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
};

export default function useGetCommandCall({
  plotFieldCommandId,
  topologyBlockId,
}: GetCommandCallTypes) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["plotfieldCommand", plotFieldCommandId, "call"],
    queryFn: async () => {
      const call = await axiosCustomized
        .get<CallTypes>(`/plotFieldCommands/${plotFieldCommandId}/calls`)
        .then((r) => r.data);

      queryClient.prefetchQuery({
        queryKey: ["topologyBlock", topologyBlockId],
        queryFn: () => getTopologyBlockById({ topologyBlockId }),
      });

      return call;
    },
  });
}
