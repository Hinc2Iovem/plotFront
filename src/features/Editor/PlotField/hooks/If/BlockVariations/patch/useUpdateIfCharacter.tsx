import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type UpdateIfCharacterProps = {
  ifCharacterId: string;
};

type UpdateIfCharacterBody = {
  characterId?: string;
  sign?: string;
  value?: number | null;
};

export default function useUpdateIfCharacter({ ifCharacterId }: UpdateIfCharacterProps) {
  return useMutation({
    mutationFn: async ({ characterId, sign, value }: UpdateIfCharacterBody) =>
      await axiosCustomized.patch(`/ifs/ifCharacter/${ifCharacterId}`, {
        characterId,
        sign,
        value,
      }),
  });
}
