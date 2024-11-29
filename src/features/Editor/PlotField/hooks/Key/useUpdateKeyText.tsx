import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type UpdateKeyTextTypes = {
  keyId: string;
  text: string;
};

export default function useUpdateKeyText({ keyId, text }: UpdateKeyTextTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.patch(`/keys/${keyId}`, {
        text,
      }),
  });
}
