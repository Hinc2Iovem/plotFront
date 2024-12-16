import { useQuery } from "@tanstack/react-query";
import { axiosCustomized } from "../../../../../api/axios";

type GetCommandIfTypes = {
  plotfieldCommandIfId: string;
  isElse: boolean | null;
};

type ReturnTypeCommandOrders = {
  _id: string;
  commandOrder: number;
};

export default function useGetCurrentCommandOrderCommandIf({ plotfieldCommandIfId, isElse }: GetCommandIfTypes) {
  return useQuery({
    queryKey: ["plotfieldCommand", "if", plotfieldCommandIfId, "isElse", isElse, "checkOrder"],
    queryFn: async () =>
      await axiosCustomized
        .get<ReturnTypeCommandOrders[]>(`/plotFieldCommands/ifs/${plotfieldCommandIfId}/checkOrder?isElse=${isElse}`)
        .then((r) => r.data),

    enabled: !!commandIfId && !!isElse,
  });
}
