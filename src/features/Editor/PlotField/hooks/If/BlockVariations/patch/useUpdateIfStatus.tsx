import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { StatusTypes } from "../../../../../../../types/StoryData/Status/StatusTypes";

type UpdateIfStatusProps = {
  ifStatusId: string;
};

type UpdateIfStatusBody = {
  characterId?: string;
  status?: StatusTypes;
};

export default function useUpdateIfStatus({ ifStatusId }: UpdateIfStatusProps) {
  return useMutation({
    mutationFn: async ({ status, characterId }: UpdateIfStatusBody) =>
      await axiosCustomized.patch(`/ifs/ifStatus/${ifStatusId}`, {
        characterId,
        status,
      }),
  });
}
