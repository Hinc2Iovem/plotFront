import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type UpdateAmbientTextTypes = {
  ambientId: string;
  ambientName: string;
};

export default function useUpdateAmbientText({
  ambientId,
  ambientName,
}: UpdateAmbientTextTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.patch(`/plotFieldCommands/ambients/${ambientId}`, {
        ambientName,
      }),
  });
}
