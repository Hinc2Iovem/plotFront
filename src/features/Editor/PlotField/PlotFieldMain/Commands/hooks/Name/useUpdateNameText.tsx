import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type UpdateNameTextTypes = {
  nameId: string;
  plotFieldCommandId: string;
};

type UpdateNameTextOnMutationTypes = {
  characterId?: string;
  newName?: string;
};

export default function useUpdateNameText({
  nameId,
  plotFieldCommandId,
}: UpdateNameTextTypes) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      characterId,
      newName,
    }: UpdateNameTextOnMutationTypes) =>
      await axiosCustomized.patch(
        `/plotFieldCommands/characters/names/${nameId}`,
        {
          newName,
          characterId,
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["plotfieldCommand", plotFieldCommandId, "name"],
        type: "active",
        exact: true,
      });
    },
  });
}
