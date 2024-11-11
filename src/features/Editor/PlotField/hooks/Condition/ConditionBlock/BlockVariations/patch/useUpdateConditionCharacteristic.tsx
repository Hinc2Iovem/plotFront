import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../../api/axios";

type UpdateConditionCharacteristicProps = {
  conditionBlockCharacteristicId: string;
};

type UpdateConditionCharacteristicBody = {
  characteristicId?: string | null;
  secondCharacteristicId?: string | null;
  sign?: string | null;
  value?: number | null;
};

export default function useUpdateConditionCharacteristic({
  conditionBlockCharacteristicId,
}: UpdateConditionCharacteristicProps) {
  return useMutation({
    mutationFn: async ({ characteristicId, secondCharacteristicId, sign, value }: UpdateConditionCharacteristicBody) =>
      await axiosCustomized.patch(
        `/commandConditions/conditionBlocks/conditionCharacteristic/${conditionBlockCharacteristicId}`,
        {
          characteristicId,
          secondCharacteristicId,
          sign,
          value,
        }
      ),
  });
}
