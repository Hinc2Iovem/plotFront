import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type UpdateIfCharacteristicProps = {
  ifCharacteristicId: string;
};

type UpdateIfCharacteristicBody = {
  characteristicId?: string | null;
  secondCharacteristicId?: string | null;
  sign?: string | null;
  value?: number | null;
};

export default function useUpdateIfCharacteristic({ ifCharacteristicId }: UpdateIfCharacteristicProps) {
  return useMutation({
    mutationFn: async ({ characteristicId, secondCharacteristicId, sign, value }: UpdateIfCharacteristicBody) =>
      await axiosCustomized.patch(`/ifs/ifCharacteristic/${ifCharacteristicId}`, {
        characteristicId,
        secondCharacteristicId,
        sign,
        value,
      }),
  });
}
