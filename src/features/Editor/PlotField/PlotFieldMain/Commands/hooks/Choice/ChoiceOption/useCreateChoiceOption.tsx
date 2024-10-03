import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../../api/axios";
import { ChoiceOptionVariationsTypes } from "../../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type CreateChoiceOptionTypes = {
  plotFieldCommandChoiceId: string;
  plotFieldCommandId: string;
  topologyBlockId: string;
  episodeId: string;
  language?: CurrentlyAvailableLanguagesTypes;
};
type CreateChoiceOptionOnMutationTypes = {
  type: ChoiceOptionVariationsTypes;
};

export default function useCreateChoiceOption({
  plotFieldCommandChoiceId,
  plotFieldCommandId,
  topologyBlockId,
  episodeId,
  language = "russian",
}: CreateChoiceOptionTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ type }: CreateChoiceOptionOnMutationTypes) =>
      await axiosCustomized.post(
        `/plotFieldCommands/${plotFieldCommandId}/choices/${plotFieldCommandChoiceId}/options`,
        {
          type,
          topologyBlockId,
          episodeId
        }
      ),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "choice",
          plotFieldCommandId,
          "translation",
          language,
          "option",
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["plotfieldCommand", plotFieldCommandId, "choice"],
        exact: true,
        type: "active",
      });
    },
  });
}
