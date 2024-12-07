import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type UpdateIfAppearanceProps = {
  ifAppearanceId: string;
};

type UpdateIfAppearanceBody = {
  appearancePartId?: string;
  currentlyDressed?: boolean;
};

export default function useUpdateIfAppearance({ ifAppearanceId }: UpdateIfAppearanceProps) {
  return useMutation({
    mutationFn: async ({ appearancePartId, currentlyDressed }: UpdateIfAppearanceBody) =>
      await axiosCustomized.patch(`/ifs/ifAppearance/${ifAppearanceId}`, {
        appearancePartId,
        currentlyDressed,
      }),
  });
}
