import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../../../api/axios";

type GetCommandIfTypes = {
  commandIfId: string;
  isElse: boolean | null;
};

type ReturnTypeCommandOrders = {
  _id: string;
  commandOrder: number;
};

export default function useGetCurrentCommandOrderCommandIf({
  commandIfId,
  isElse,
}: GetCommandIfTypes) {
  return useQuery({
    queryKey: [
      "plotfieldCommand",
      "if",
      commandIfId,
      "isElse",
      isElse,
      "checkOrder",
    ],
    queryFn: async () =>
      await axiosCustomized
        .get<ReturnTypeCommandOrders[]>(
          `/plotFieldCommands/ifs/${commandIfId}/checkOrder?isElse=${isElse}`
        )
        .then((r) => r.data),

    enabled: !!commandIfId && !!isElse,
  });
}
