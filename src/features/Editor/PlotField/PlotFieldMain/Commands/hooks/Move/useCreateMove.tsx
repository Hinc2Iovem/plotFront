import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type CreateMoveTypes = {
  plotFieldCommandId: string;
};

export default function useCreateMove({ plotFieldCommandId }: CreateMoveTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.post(
        `/plotFieldCommands/${plotFieldCommandId}/moves`
      ),
  });
}
