import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { axiosCustomized } from "../../../../../../api/axios";
import { CommandKeyTypes } from "../../../../../../types/StoryEditor/PlotField/Key/KeyTypes";
import ActionButton from "./ActionButton";

type UpdateCommandKeyTypes = {
  plotFieldCommandId: string;
  setCurrentKey: React.Dispatch<
    React.SetStateAction<{
      textValue: string;
      id: string;
    }>
  >;
};

export default function useUpdateCommandKey({ plotFieldCommandId, setCurrentKey }: UpdateCommandKeyTypes) {
  return useMutation({
    mutationFn: async ({ text }: { text: string }) =>
      await axiosCustomized
        .patch<CommandKeyTypes>(`/plotFieldCommands/${plotFieldCommandId}/commandKeys`, {
          text,
        })
        .then((r) => r.data),
    onError: (error, variables) => {
      const { text } = variables;
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          toast("Сервер не отвечает");
        } else if (error.response?.status === 404) {
          toast(`Ключ не найден, хотите создать?`, {
            action: <ActionButton plotfieldCommandId={plotFieldCommandId} text={text} setCurrentKey={setCurrentKey} />,

            className: `flex items-center justify-between`,
          });
        } else {
          toast("Что-то пошло не так");
        }
      }
    },
  });
}
