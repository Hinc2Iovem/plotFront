import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { MoveTypes } from "../../../../../types/StoryEditor/PlotField/Move/MoveTypes";

type GetCommandMoveTypes = {
  plotFieldCommandId: string;
};

export default function useGetCommandMove({
  plotFieldCommandId,
}: GetCommandMoveTypes) {
  return useQuery({
    queryKey: ["plotfieldCommand", plotFieldCommandId, "move"],
    queryFn: async () =>
      await axiosCustomized
        .get<MoveTypes>(`/plotFieldCommands/${plotFieldCommandId}/moves`)
        .then((r) => r.data),
  });
}
