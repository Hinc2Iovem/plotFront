import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { StatTypes } from "../../../../../types/StoryEditor/PlotField/Stat/StatTypes";

type GetCommandStatTypes = {
  plotFieldCommandId: string;
};

export default function useGetCommandStat({ plotFieldCommandId }: GetCommandStatTypes) {
  return useQuery({
    queryKey: ["plotfieldCommand", plotFieldCommandId, "stat"],
    queryFn: async () =>
      await axiosCustomized.get<StatTypes>(`/plotFieldCommands/${plotFieldCommandId}/stats`).then((r) => r.data),
    enabled: !!plotFieldCommandId,
  });
}
