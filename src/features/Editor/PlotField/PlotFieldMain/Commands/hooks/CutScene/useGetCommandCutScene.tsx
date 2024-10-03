import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { CutSceneTypes } from "../../../../../../../types/StoryEditor/PlotField/CutScene/CutSceneTypes";

type GetCommandCutSceneTypes = {
  plotFieldCommandId: string;
};

export default function useGetCommandChoice({
  plotFieldCommandId,
}: GetCommandCutSceneTypes) {
  return useQuery({
    queryKey: ["plotfieldCommand", plotFieldCommandId, "cutScene"],
    queryFn: async () =>
      await axiosCustomized
        .get<CutSceneTypes>(
          `/plotFieldCommands/${plotFieldCommandId}/cutScenes`
        )
        .then((r) => r.data),
    enabled: !!plotFieldCommandId,
  });
}
