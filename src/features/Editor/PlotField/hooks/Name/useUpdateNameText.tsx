import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type UpdateNameTextTypes = {
  nameId: string;
  plotFieldCommandId: string;
};

type UpdateNameTextOnMutationTypes = {
  characterId?: string;
  newName?: string;
};

export default function useUpdateNameText({ nameId }: UpdateNameTextTypes) {
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
  });
}
