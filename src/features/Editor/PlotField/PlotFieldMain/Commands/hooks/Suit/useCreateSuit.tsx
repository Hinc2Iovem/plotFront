import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type CreateSuitTypes = {
  plotFieldCommandId: string;
};

export default function useCreateSuit({ plotFieldCommandId }: CreateSuitTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.post(
        `/plotFieldCommands/${plotFieldCommandId}/suits`
      ),
  });
}
