import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";

type createMultipleCommandsTypes = {
  topologyBlockId: string;
  allCommands?: string;
  amountOfOptions?: number;
  choiceType?: string;
  optionVariations?: string;
  storyId?: string;
  episodeId?: string;
  waitValue?: number;
  currentAmountOfCommands: number;
};

export default function useCreateMultipleCommands({
  topologyBlockId,
  allCommands,
  amountOfOptions,
  choiceType,
  optionVariations,
  storyId,
  waitValue,
  episodeId,
  currentAmountOfCommands,
}: createMultipleCommandsTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.post(
        `/plotField/topologyBlocks/${topologyBlockId}/multipleCommands`,
        {
          allCommands,
          amountOfOptions,
          choiceType,
          optionVariations,
          storyId,
          waitValue,
          episodeId,
          currentAmountOfCommands,
        }
      ),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["plotfield", "topologyBlock", topologyBlockId],
      });
      queryClient.invalidateQueries({
        queryKey: ["topologyBlock", topologyBlockId],
      });
      queryClient.invalidateQueries({
        queryKey: ["connection", "episode", episodeId],
      });
    },
  });
}
