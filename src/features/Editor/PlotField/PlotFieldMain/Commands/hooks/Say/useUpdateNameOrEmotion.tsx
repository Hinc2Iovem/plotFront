import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type UpdateNameOrEmotionTypes = {
  plotFieldCommandId: string;
  plotFieldCommandSayId: string;
  characterId?: string;
  characterEmotionId?: string;
};

export default function useUpdateNameOrEmotion({
  plotFieldCommandId,
  plotFieldCommandSayId,
  characterEmotionId,
  characterId,
}: UpdateNameOrEmotionTypes) {
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({
        queryKey: ["plotfieldComamnd", plotFieldCommandId, "say"],
        exact: true,
        type: "active",
      });
      // queryClient.invalidateQueries({
      //   queryKey: ["character", "emotion", prevEmotionId],
      //   exact: true,
      //   type: "active",
      // });
    },
  });
}
