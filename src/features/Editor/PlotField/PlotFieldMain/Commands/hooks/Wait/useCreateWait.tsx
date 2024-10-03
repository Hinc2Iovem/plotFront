import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type CreateWaitTypes = {
  plotFieldCommandId: string;
};

export default function useCreateWait({ plotFieldCommandId }: CreateWaitTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.post(
        `/plotFieldCommands/${plotFieldCommandId}/wait`
      ),
  });
}
