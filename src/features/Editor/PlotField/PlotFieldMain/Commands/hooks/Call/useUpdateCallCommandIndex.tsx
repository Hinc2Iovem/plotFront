import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type UpdateCallCommandIndexTypes = {
  callId: string;
};

type UpdateCallCommandIndexOnMutationTypes = {
  commandIndex: number;
};

export default function useUpdateCallCommandIndex({
  callId,
}: UpdateCallCommandIndexTypes) {
  return useMutation({
    mutationFn: async ({
      commandIndex,
    }: UpdateCallCommandIndexOnMutationTypes) => {
      await axiosCustomized.patch(
        `/plotFieldCommands/calls/${callId}/commandIndex`,
        {
          referencedCommandIndex: commandIndex,
        }
      );
    },
  });
}
