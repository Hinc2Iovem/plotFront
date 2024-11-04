import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type UpdateWaitTextTypes = {
  waitValue: number;
};

export default function useUpdateWaitText({ waitValue }: UpdateWaitTextTypes) {
  return useMutation({
    mutationFn: async ({ waitId }: { waitId: string }) =>
      await axiosCustomized.patch(`/plotFieldCommands/wait/${waitId}`, {
        waitValue,
      }),
  });
}
