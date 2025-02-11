import { axiosCustomized } from "@/api/axios";
import { useMutation } from "@tanstack/react-query";

type DeleteSayTypes = {
  sayId: string;
};

export default function useDeleteSay({ sayId }: DeleteSayTypes) {
  return useMutation({
    mutationFn: () => axiosCustomized.delete(`/plotFieldCommands/say/${sayId}`),
  });
}
