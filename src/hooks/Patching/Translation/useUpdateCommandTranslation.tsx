import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

export type CommandEndPointVariationsTypes =
  | "choices"
  | "achievements"
  | "getItems"
  | "say"
  | "wardrobes";

export type CommandDynamicBodyNameVariationsTypes =
  | "choiceQuestion"
  | "achievementName"
  | "buttonText"
  | "itemDescription"
  | "itemName"
  | "text"
  | "title";

type UpdateCommandTranslationTypes = {
  commandId: string;
  language: CurrentlyAvailableLanguagesTypes;
  commandEndPoint: CommandEndPointVariationsTypes;
  dynamicCommandName: CommandDynamicBodyNameVariationsTypes;
};

type UpdateCommandTranslationOnMutationTypes = {
  commandText: string;
};

export default function useUpdateCommandTranslation({
  commandId,
  language,
  commandEndPoint,
  dynamicCommandName,
}: UpdateCommandTranslationTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      commandText,
    }: UpdateCommandTranslationOnMutationTypes) =>
      await axiosCustomized.patch(
        `/translations/plotFieldCommands/${commandEndPoint}/${commandId}`,
        {
          currentLanguage: language,
          [dynamicCommandName]: commandText,
        }
      ),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["translation", language, "plotFieldCommand", commandId],
        exact: true,
        type: "active",
      });
    },
  });
}
