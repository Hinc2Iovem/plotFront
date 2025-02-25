import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";

type CreateCommandRelationTypes = {
  plotFieldCommandId?: string;
};

export default function useCreateCommandRelation({ plotFieldCommandId }: CreateCommandRelationTypes) {
  return useMutation({
    mutationFn: async ({ plotfieldCommandId }: { plotfieldCommandId?: string }) => {
      const commandId = plotFieldCommandId?.trim().length ? plotFieldCommandId : plotfieldCommandId;
      await axiosCustomized.post(`/plotFieldCommands/${commandId}/relationCommands`);
    },
  });
}
