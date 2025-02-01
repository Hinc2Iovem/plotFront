import { axiosCustomized } from "@/api/axios";
import { IfElseTypes } from "@/types/StoryEditor/PlotField/IfCommand/IfElseTypes";
import { useQuery } from "@tanstack/react-query";

type GetCommandElseTypes = {
  plotFieldCommandId: string;
};

export default function useGetCommandElse({ plotFieldCommandId }: GetCommandElseTypes) {
  return useQuery({
    queryKey: ["plotfieldCommand", plotFieldCommandId, "else"],
    queryFn: async () =>
      await axiosCustomized.get<IfElseTypes>(`/plotFieldCommands/${plotFieldCommandId}/else`).then((r) => r.data),
    enabled: !!plotFieldCommandId,
    refetchOnWindowFocus: false,
  });
}
