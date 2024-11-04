import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { ChoiceTypes } from "../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";

type GetCommandChoiceTypes = {
  plotFieldCommandId: string;
};

export default function useGetCommandChoice({
  plotFieldCommandId,
}: GetCommandChoiceTypes) {
  return useQuery({
    queryKey: ["plotfieldCommand", plotFieldCommandId, "choice"],
    queryFn: async () =>
      await axiosCustomized
        .get<ChoiceTypes>(`/plotFieldCommands/${plotFieldCommandId}/choices`)
        .then((r) => r.data),
    enabled: !!plotFieldCommandId,
  });
}
