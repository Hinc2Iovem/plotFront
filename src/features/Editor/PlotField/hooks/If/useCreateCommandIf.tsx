import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { IfCommandTypes } from "../../../../../types/StoryEditor/PlotField/IfCommand/IfCommandTypes";

type CreateCommandIfTypes = {
  plotFieldCommandId?: string;
};

export type CreateCommandIfBodyTypes = {
  plotfieldCommandId?: string;
  plotFieldCommandElseId: string;
  plotFieldCommandIfElseEndId: string;
};

export default function useCreateCommandIf({ plotFieldCommandId }: CreateCommandIfTypes) {
  return useMutation({
    mutationFn: async ({
      plotfieldCommandId,
      plotFieldCommandElseId,
      plotFieldCommandIfElseEndId,
    }: CreateCommandIfBodyTypes) => {
      const commandId = plotFieldCommandId?.trim().length ? plotFieldCommandId : plotfieldCommandId;
      await axiosCustomized.post<IfCommandTypes>(`/plotFieldCommands/${commandId}/ifs`, {
        plotFieldCommandElseId,
        plotFieldCommandIfElseEndId,
      });
    },
  });
}
