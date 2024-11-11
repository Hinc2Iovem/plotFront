import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../../api/axios";
import { StatusTypes } from "../../../../../../../../types/StoryData/Status/StatusTypes";

type UpdateConditionStatusProps = {
  conditionBlockStatusId: string;
};

type UpdateConditionStatusBody = {
  characterId?: string;
  status?: StatusTypes;
};

export default function useUpdateConditionStatus({ conditionBlockStatusId }: UpdateConditionStatusProps) {
  return useMutation({
    mutationFn: async ({ status, characterId }: UpdateConditionStatusBody) =>
      await axiosCustomized.patch(`/commandConditions/conditionBlocks/conditionStatus/${conditionBlockStatusId}`, {
        characterId,
        status,
      }),
  });
}
