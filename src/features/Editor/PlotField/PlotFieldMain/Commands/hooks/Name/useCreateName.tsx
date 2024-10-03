import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type CreateNameTypes = {
  plotFieldCommandId: string;
};

export default function useCreateName({ plotFieldCommandId }: CreateNameTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.post(
        `/plotFieldCommands/${plotFieldCommandId}/names`
      ),
  });
}
