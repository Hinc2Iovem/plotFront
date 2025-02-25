import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type UpdateStatusTextTypes = {
  statusId: string;
};

export default function useDeleteCommandStatus({ statusId }: UpdateStatusTextTypes) {
  return useMutation({
    mutationFn: async () => await axiosCustomized.delete(`/plotFieldCommands/status/${statusId}`),
  });
}
