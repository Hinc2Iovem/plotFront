import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";
import { ConditionValueVariationType } from "../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";

type DeleteIfVariationProps = {
  ifVariationIdParams?: string;
};

type DeleteIfVariationBody = {
  type: ConditionValueVariationType;
  ifVariationIdBody?: string;
  index?: number;
  ifId?: string;
};

export default function useDeleteIfVariation({ ifVariationIdParams }: DeleteIfVariationProps) {
  return useMutation({
    mutationFn: async ({ type, ifVariationIdBody, ifId, index }: DeleteIfVariationBody) => {
      const ifVariationId = ifVariationIdParams?.trim().length ? ifVariationIdParams : ifVariationIdBody;
      await axiosCustomized.delete(`/ifs/variations/${ifVariationId}?type=${type}&index=${index}&ifId=${ifId}`);
    },
  });
}
