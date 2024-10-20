import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type UpdateNameOrEmotionTypes = {
  plotFieldCommandId: string;
  plotFieldCommandSayId: string;
  characterId?: string;
  characterEmotionId?: string;
};

export default function useUpdateNameOrEmotion({
  plotFieldCommandSayId,
  characterEmotionId,
  characterId,
}: UpdateNameOrEmotionTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.patch(
        `/plotFieldCommands/say/${plotFieldCommandSayId}/characterOrEmotionId`,
        {
          characterEmotionId,
          characterId,
        }
      ),
    onSuccess: () => {
      // queryClient.invalidateQueries({
      //   queryKey: ["character", "emotion", prevEmotionId],
      //   exact: true,
      //   type: "active",
      // });
    },
  });
}
