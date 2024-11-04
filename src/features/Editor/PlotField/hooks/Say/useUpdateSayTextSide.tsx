import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { CommandSideTypes } from "../../../../../types/StoryEditor/PlotField/Say/SayTypes";

type UpdateSayTextSideTypes = {
  sayId: string;
};

type UpdateSayTextSideOnMutationTypes = {
  textSide: CommandSideTypes;
};

export default function useUpdateSayTextSide({
  sayId,
}: UpdateSayTextSideTypes) {
  return useMutation({
    mutationFn: async ({ textSide }: UpdateSayTextSideOnMutationTypes) =>
      await axiosCustomized.patch(
        `/plotFieldCommands/say/${sayId}/commandSide`,
        {
          commandSide: textSide,
        }
      ),
  });
}
