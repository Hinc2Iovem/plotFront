import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../api/axios";
import { AppearancePartTypes } from "../../../types/StoryData/AppearancePart/AppearancePartTypes";

export default function useGetAppearancePartById({
  appearancePartId,
}: {
  appearancePartId: string;
}) {
  return useQuery({
    queryKey: ["appearancePart", appearancePartId],
    queryFn: async () =>
      await axiosCustomized
        .get<AppearancePartTypes>(`/appearanceParts/${appearancePartId}`)
        .then((r) => r.data),
    enabled: !!appearancePartId,
  });
}
