import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type UpdateIfKeyProps = {
  ifKeyId: string;
};

type UpdateIfKeyBody = {
  keyId?: string;
};

export default function useUpdateIfKey({ ifKeyId }: UpdateIfKeyProps) {
  return useMutation({
    mutationFn: async ({ keyId }: UpdateIfKeyBody) =>
      await axiosCustomized.patch(`/ifs/ifKey/${ifKeyId}/keys/${keyId}`),
  });
}
