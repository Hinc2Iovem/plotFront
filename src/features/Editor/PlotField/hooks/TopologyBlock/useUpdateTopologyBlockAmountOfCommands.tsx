import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { TopologyBlockAddOrMinusTypes } from "../../../../../types/TopologyBlock/TopologyBlockTypes";

type UpdateTopologyBlockAmountOfCommands = {
  addOrMinusAmountOfCommand: TopologyBlockAddOrMinusTypes;
  topologyBlockId: string;
};

export default function useUpdateTopologyBlockAmountOfCommands({
  topologyBlockId,
  addOrMinusAmountOfCommand,
}: UpdateTopologyBlockAmountOfCommands) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.patch(
        `/topologyBlocks/${topologyBlockId}/topologyBlockInfo`,
        {
          addOrMinusAmountOfCommand,
        }
      ),
  });
}
