import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { GetItemTypes } from "../../../../../../../types/StoryEditor/PlotField/GetItem/GetItemTypes";

type GetCommandGetItemTypes = {
  plotFieldCommandId: string;
};

export default function useGetCommandGetItem({
  plotFieldCommandId,
}: GetCommandGetItemTypes) {
  return useQuery({
    queryKey: ["plotfieldCommand", plotFieldCommandId, "getItem"],
    queryFn: async () =>
      await axiosCustomized
        .get<GetItemTypes>(`/plotFieldCommands/${plotFieldCommandId}/getItems`)
        .then((r) => r.data),
  });
}
