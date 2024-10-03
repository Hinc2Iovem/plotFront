import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { CommentTypes } from "../../../../../../../types/StoryEditor/PlotField/Comment/CommentTypes";

type GetCommandCommentTypes = {
  plotFieldCommandId: string;
};

export default function useGetCommandComment({
  plotFieldCommandId,
}: GetCommandCommentTypes) {
  return useQuery({
    queryKey: ["plotfieldCommand", plotFieldCommandId, "comment"],
    queryFn: async () =>
      await axiosCustomized
        .get<CommentTypes>(`/plotFieldCommands/${plotFieldCommandId}/comments`)
        .then((r) => r.data),
  });
}
