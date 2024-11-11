import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../../api/axios";

type UpdateConditionCharacterProps = {
  conditionBlockCharacterId: string;
};

type UpdateConditionCharacterBody = {
  characterId?: string;
  sign?: string;
  value?: number | null;
};

export default function useUpdateConditionCharacter({ conditionBlockCharacterId }: UpdateConditionCharacterProps) {
  return useMutation({
    mutationFn: async ({ characterId, sign, value }: UpdateConditionCharacterBody) =>
      await axiosCustomized.patch(
        `/commandConditions/conditionBlocks/conditionCharacter/${conditionBlockCharacterId}`,
        {
          characterId,
          sign,
          value,
        }
      ),
  });
}
