import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { CommandAchievementTypes } from "../../../../../../types/StoryEditor/PlotField/Achievement/AchievementTypes";
import axios from "axios";
import { toast } from "sonner";
import ActionButton from "./ActionButton";

type UpdateCommandAchievementTypes = {
  plotFieldCommandId: string;
  language: CurrentlyAvailableLanguagesTypes;
  setCurrentAchievement: React.Dispatch<
    React.SetStateAction<{
      textValue: string;
      id: string;
    }>
  >;
};

export default function useUpdateCommandAchievement({
  plotFieldCommandId,
  language = "russian",
  setCurrentAchievement,
}: UpdateCommandAchievementTypes) {
  return useMutation({
    mutationFn: async ({ text }: { text: string }) =>
      await axiosCustomized
        .patch<CommandAchievementTypes>(
          `/plotFieldCommands/${plotFieldCommandId}/commandAchievements?currentLanguage=${language}`,
          {
            text,
          }
        )
        .then((r) => r.data),
    onError: (error, variables) => {
      const { text } = variables;
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast("Сервер не отвечает");
        } else if (error.response?.status === 404) {
          toast(`Такой ачивки не существует, хотите создать?`, {
            action: (
              <ActionButton
                plotfieldCommandId={plotFieldCommandId}
                text={text}
                setCurrentAchievement={setCurrentAchievement}
              />
            ),
            duration: 5000,
            className: "flex items-center justify-between",
          });
        } else {
          toast("Что-то пошло не так");
        }
      }
    },
  });
}
