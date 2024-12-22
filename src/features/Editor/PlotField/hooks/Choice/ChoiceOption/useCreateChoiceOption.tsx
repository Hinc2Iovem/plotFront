import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";
import { ChoiceOptionVariationsTypes } from "../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type CreateChoiceOptionTypes = {
  plotFieldCommandChoiceId: string;
  plotFieldCommandId: string;
  topologyBlockId: string;
  episodeId: string;
  language?: CurrentlyAvailableLanguagesTypes;
  coordinatesX: number;
  coordinatesY: number;
  sourceBlockName: string;
};
type CreateChoiceOptionOnMutationTypes = {
  type: ChoiceOptionVariationsTypes;
  targetBlockId: string;
  choiceOptionId: string;
  optionOrder: number;
};

export default function useCreateChoiceOption({
  plotFieldCommandChoiceId,
  plotFieldCommandId,
  topologyBlockId,
  episodeId,
  coordinatesX,
  coordinatesY,
  sourceBlockName,
}: CreateChoiceOptionTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ type, choiceOptionId, targetBlockId, optionOrder }: CreateChoiceOptionOnMutationTypes) =>
      await axiosCustomized.post(
        `/plotFieldCommands/${plotFieldCommandId}/choices/${plotFieldCommandChoiceId}/options`,
        {
          type,
          topologyBlockId,
          episodeId,
          choiceOptionId,
          targetBlockId,
          coordinatesX,
          coordinatesY,
          sourceBlockName,
          optionOrder,
        }
      ),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["connection", "episode", episodeId],
      });
    },
  });
}
