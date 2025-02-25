import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";
import { StatusTypes } from "@/types/StoryData/Status/StatusTypes";

type UpdateStatusTextTypes = {
  statusId: string;
};

type UpdateStatusBodyTypes = {
  status?: StatusTypes;
  characterId?: string;
};

export default function useUpdateCommandStatus({ statusId }: UpdateStatusTextTypes) {
  return useMutation({
    mutationFn: async ({ characterId, status }: UpdateStatusBodyTypes) =>
      await axiosCustomized.patch(`/plotFieldCommands/status/${statusId}`, {
        status,
        characterId,
      }),
  });
}
