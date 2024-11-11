import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../../api/axios";

type UpdateConditionAppearanceProps = {
  conditionBlockAppearanceId: string;
};

type UpdateConditionAppearanceBody = {
  appearancePartId?: string;
  currentlyDressed?: boolean;
};

export default function useUpdateConditionAppearance({ conditionBlockAppearanceId }: UpdateConditionAppearanceProps) {
  return useMutation({
    mutationFn: async ({ appearancePartId, currentlyDressed }: UpdateConditionAppearanceBody) =>
      await axiosCustomized.patch(
        `/commandConditions/conditionBlocks/conditionAppearance/${conditionBlockAppearanceId}`,
        {
          appearancePartId,
          currentlyDressed,
        }
      ),
  });
}
