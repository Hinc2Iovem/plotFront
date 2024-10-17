import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { IfCommandTypes } from "../../../../../../../types/StoryEditor/PlotField/IfCommand/IfCommandTypes";

type CreateCommandIfTypes = {
  plotFieldCommandId?: string;
};

export default function useCreateCommandIf({
  plotFieldCommandId,
}: CreateCommandIfTypes) {
  return useMutation({
    mutationFn: async ({
      plotfieldCommandId,
    }: {
      plotfieldCommandId?: string;
    }) => {
      const commandId = plotFieldCommandId?.trim().length
        ? plotFieldCommandId
        : plotfieldCommandId;
      await axiosCustomized.post<IfCommandTypes>(
        `/plotFieldCommands/${commandId}/ifs`
      );
    },
  });
}
