import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";
import { CommandSayVariationTypes } from "../../../../../../types/StoryEditor/PlotField/Say/SayTypes";
type CreateSayCharacterCommandTypes = {
  plotFieldCommandId: string;
  characterId: string;
};
export default function useCreateSayCharacterCommand({
  plotFieldCommandId,
  characterId,
}: CreateSayCharacterCommandTypes) {
  return useMutation({
    mutationFn: async ({ type }: { type: CommandSayVariationTypes }) =>
      await axiosCustomized.post(`/plotFieldCommands/${plotFieldCommandId}/say/characters/${characterId}`, {
        type,
      }),
  });
}
