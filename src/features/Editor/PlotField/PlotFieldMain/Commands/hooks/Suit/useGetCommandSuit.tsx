import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { SuitTypes } from "../../../../../../../types/StoryEditor/PlotField/Suit/SuitTypes";

type GetCommandSuitTypes = {
  plotFieldCommandId: string;
};

export default function useGetCommandSuit({
  plotFieldCommandId,
}: GetCommandSuitTypes) {
  return useQuery({
    queryKey: ["plotfieldCommand", plotFieldCommandId, "suit"],
    queryFn: async () =>
      await axiosCustomized
        .get<SuitTypes>(`/plotFieldCommands/${plotFieldCommandId}/suits`)
        .then((r) => r.data),
  });
}
