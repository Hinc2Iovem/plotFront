import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { axiosCustomized } from "../../../../../../api/axios";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { CommandAchievementTypes } from "../../../../../../types/StoryEditor/PlotField/Achievement/AchievementTypes";
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
            className: "flex text-[15px] text-white justify-between items-center",
            action: (
              <ActionButton
                plotfieldCommandId={plotFieldCommandId}
                text={text}
                setCurrentAchievement={setCurrentAchievement}
              />
            ),
          });
        } else {
          toast("Что-то пошло не так");
        }
      }
    },
  });
}
