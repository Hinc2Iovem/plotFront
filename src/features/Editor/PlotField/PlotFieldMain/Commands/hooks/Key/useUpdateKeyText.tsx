import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type UpdateKeyTextTypes = {
  commandKeyId: string;
  text: string;
};

export default function useUpdateKeyText({
  commandKeyId,
  text,
}: UpdateKeyTextTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.patch(
        `/plotFieldCommands/commandKeys/${commandKeyId}/text`,
        {
          text,
        }
      ),
  });
}
