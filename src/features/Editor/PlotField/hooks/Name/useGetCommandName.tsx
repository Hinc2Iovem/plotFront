import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { NameTypes } from "../../../../../types/StoryEditor/PlotField/Name/NameTypes";

type GetCommandNameTypes = {
  plotFieldCommandId: string;
};

export default function useGetCommandName({ plotFieldCommandId }: GetCommandNameTypes) {
  return useQuery({
    queryKey: ["plotfieldCommand", plotFieldCommandId, "name"],
    queryFn: async () =>
      await axiosCustomized.get<NameTypes>(`/plotFieldCommands/${plotFieldCommandId}/names`).then((r) => r.data),
    enabled: !!plotFieldCommandId,
  });
}
