import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../api/axios";
import {
  IfKeyTypes,
  IfAppearanceTypes,
  IfCharacterTypes,
  IfCharacteristicTypes,
  IfLanguageTypes,
  IfRandomTypes,
  IfRetryTypes,
  IfStatusTypes,
} from "../../../../../../types/StoryEditor/PlotField/IfCommand/IfCommandTypes";

type GetAllIfVariationsByIfIdProps = {
  ifId?: string;
};

export type IfVariationResponseTypes = {
  key: IfKeyTypes[];
  appearance: IfAppearanceTypes[];
  character: IfCharacterTypes[];
  characteristic: IfCharacteristicTypes[];
  language: IfLanguageTypes[];
  random: IfRandomTypes[];
  retry: IfRetryTypes[];
  status: IfStatusTypes[];
};

export default function useGetAllIfVariationsByIfId({ ifId }: GetAllIfVariationsByIfIdProps) {
  return useQuery({
    queryKey: ["if", ifId, "variations"],
    queryFn: async () =>
      await axiosCustomized.get<IfVariationResponseTypes>(`/ifs/${ifId}/variations`).then((r) => r.data),
    enabled: !!ifId,
  });
}
