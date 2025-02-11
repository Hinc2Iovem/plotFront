import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";
import { CommandSayVariationTypes } from "../../../../../../types/StoryEditor/PlotField/Say/SayTypes";

type UpdateCommandSayTypes = {
  plotFieldCommandSayId: string;
  plotFieldCommandId: string;
};

export default function useUpdateCommandSayType({ plotFieldCommandSayId }: UpdateCommandSayTypes) {
  return useMutation({
    mutationFn: async (type: CommandSayVariationTypes) =>
      await axiosCustomized.patch(`/plotFieldCommands/say/${plotFieldCommandSayId}/type`, {
        type,
      }),
  });
}
