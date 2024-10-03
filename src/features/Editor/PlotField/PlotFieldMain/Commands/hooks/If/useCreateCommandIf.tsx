import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { IfCommandTypes } from "../../../../../../../types/StoryEditor/PlotField/IfCommand/IfCommandTypes";

type CreateCommandIfTypes = {
  plotFieldCommandId: string;
};

export default function useCreateCommandIf({
  plotFieldCommandId,
}: CreateCommandIfTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.post<IfCommandTypes>(
        `/plotFieldCommands/${plotFieldCommandId}/ifs`
      ),
  });
}
