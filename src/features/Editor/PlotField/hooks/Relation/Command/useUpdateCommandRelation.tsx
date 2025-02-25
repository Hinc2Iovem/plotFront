import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";

type UpdateRelationTextTypes = {
  relationId: string;
};

type UpdateRelationBodyTypes = {
  relationValue?: number;
  characterId?: string;
  sign?: "+" | "-";
};

export default function useUpdateCommandRelation({ relationId }: UpdateRelationTextTypes) {
  return useMutation({
    mutationFn: async ({ characterId, relationValue, sign }: UpdateRelationBodyTypes) =>
      await axiosCustomized.patch(`/plotFieldCommands/relationCommands/${relationId}`, {
        relationValue,
        sign,
        characterId,
      }),
  });
}
