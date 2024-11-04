import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type MakeSoundGlobalTypes = {
  soundId: string;
  isGlobal: boolean;
};

export default function useMakeSoundGlobal({
  soundId,
  isGlobal,
}: MakeSoundGlobalTypes) {
  return useMutation({
    mutationFn: async () =>
      await axiosCustomized.patch(
        `/plotFieldCommands/sounds/${soundId}/isGlobal`,
        {
          isGlobal,
        }
      ),
  });
}
