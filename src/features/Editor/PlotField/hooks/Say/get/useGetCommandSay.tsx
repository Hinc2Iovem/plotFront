import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";
import { SayTypes } from "../../../../../../types/StoryEditor/PlotField/Say/SayTypes";

type GetCommandSayTypes = {
  plotFieldCommandId: string;
};

export default function useGetCommandSay({ plotFieldCommandId }: GetCommandSayTypes) {
  return useQuery({
    queryKey: ["plotfieldComamnd", plotFieldCommandId, "say"],
    queryFn: async () =>
      await axiosCustomized.get<SayTypes>(`/plotFieldCommands/${plotFieldCommandId}/say`).then((r) => r.data),
    enabled: !!plotFieldCommandId,
  });
}
