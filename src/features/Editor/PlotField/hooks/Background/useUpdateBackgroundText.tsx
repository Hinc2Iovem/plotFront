import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type UpdateBackgroundTextTypes = {
  backgroundId: string;
  backgroundName?: string;
  pointOfMovement?: string;
};

export default function useUpdateBackgroundText({
  backgroundId,
  backgroundName,
  pointOfMovement,
}: UpdateBackgroundTextTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.patch(
        `/plotFieldCommands/backgrounds/${backgroundId}`,
        {
          backgroundName,
          pointOfMovement,
        }
      ),
  });
}
