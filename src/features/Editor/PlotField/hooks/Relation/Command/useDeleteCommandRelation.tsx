import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";

type UpdateRelationCommandTextTypes = {
  relationCommandId: string;
};

export default function useDeleteCommandRelation({ relationCommandId }: UpdateRelationCommandTextTypes) {
  return useMutation({
    mutationFn: async () => await axiosCustomized.delete(`/plotFieldCommands/relationCommands/${relationCommandId}`),
  });
}
