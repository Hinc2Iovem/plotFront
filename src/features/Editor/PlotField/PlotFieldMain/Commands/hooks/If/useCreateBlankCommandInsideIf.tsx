import { useMutation } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";
import { PlotFieldCommandIfTypes } from "../../../../../../../types/StoryEditor/PlotField/PlotFieldTypes";

type CreateBlankCommandTypes = {
  topologyBlockId: string;
  commandIfId: string;
  isElse?: boolean;
};

export default function useCreateBlankCommandInsideIf({
  topologyBlockId,
  commandIfId,
  isElse = false,
}: CreateBlankCommandTypes) {
  return useMutation({
    mutationKey: ["new", "plotfield", "topologyBlock", topologyBlockId],
    mutationFn: async (commandOrder: PlotFieldCommandIfTypes) => {
      await axiosCustomized.post(
        `/plotField/topologyBlocks/${topologyBlockId}/commandIfs/${commandIfId}`,
        {
          isElse,
          commandOrder: commandOrder.commandOrder,
          _id: commandOrder._id,
        }
      );
    },
  });
}

// const queryClient = useQueryClient();

// onMutate: async (newCommand: PlotFieldCommandIfTypes) => {
//   if (isElse) {
//     await queryClient.cancelQueries({
//       queryKey: ["plotfield", "commandIf", commandIfId, "insideElse"],
//     });
//     const prevCommands = queryClient.getQueryData([
//       "plotfield",
//       "commandIf",
//       commandIfId,
//       "insideElse",
//     ]);
//     queryClient.setQueryData(
//       ["plotfield", "commandIf", commandIfId, "insideElse"],
//       (old: PlotFieldCommandIfTypes[]) => [...old, newCommand]
//     );
//     return { prevCommands };
//   } else {
//     await queryClient.cancelQueries({
//       queryKey: ["plotfield", "commandIf", commandIfId, "insideIf"],
//     });
//     const prevCommands = queryClient.getQueryData([
//       "plotfield",
//       "commandIf",
//       commandIfId,
//       "insideIf",
//     ]);
//     queryClient.setQueryData(
//       ["plotfield", "commandIf", commandIfId, "insideIf"],
//       (old: PlotFieldCommandIfTypes[]) => [...old, newCommand]
//     );
//     return { prevCommands };
//   }
// },
// onError: (err, newCommand, context) => {
//   if (isElse) {
//     queryClient.setQueryData(
//       ["plotfield", "commandIf", commandIfId, "insideElse"],
//       context?.prevCommands
//     );
//   } else {
//     queryClient.setQueryData(
//       ["plotfield", "commandIf", commandIfId, "insideIf"],
//       context?.prevCommands
//     );
//   }
// },
// onSettled: () => {
//   if (isElse) {
//     queryClient.invalidateQueries({
//       queryKey: ["plotfield", "commandIf", commandIfId, "insideElse"],
//       type: "active",
//       exact: true,
//     });
//   } else {
//     queryClient.invalidateQueries({
//       queryKey: ["plotfield", "commandIf", commandIfId, "insideIf"],
//       type: "active",
//       exact: true,
//     });
//   }
// },
