import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SelectWithBlur from "@/components/ui/selectWithBlur";
import { AllPossibleStatuses } from "../../../../../../../../../const/STATUSES";
import { StatusTypes } from "../../../../../../../../../types/StoryData/Status/StatusTypes";
import useUpdateIfStatus from "../../../../../../hooks/If/BlockVariations/patch/useUpdateIfStatus";
import useCommandIf from "../../../Context/IfContext";

type IfVariationStatusModalTypes = {
  ifVariationId: string;
  plotfieldCommandId: string;
  status: StatusTypes;
  setStatus: React.Dispatch<React.SetStateAction<StatusTypes>>;
};

export default function IfVariationStatusModal({
  ifVariationId,
  plotfieldCommandId,
  setStatus,
  status,
}: IfVariationStatusModalTypes) {
  const { updateIfVariationValue } = useCommandIf();

  const updateIfStatus = useUpdateIfStatus({ ifStatusId: ifVariationId });

  return (
    <SelectWithBlur
      onValueChange={(v: StatusTypes) => {
        setStatus(v);
        updateIfVariationValue({
          plotfieldCommandId,
          status: v,
          ifVariationId,
        });

        updateIfStatus.mutate({ status: v });
      }}
    >
      <SelectTrigger className="w-fit h-full text-[14px] py-[0] text-text capitalize border-border border-[3px] hover:bg-accent active:scale-[.99] transition-all">
        <SelectValue placeholder={status || "Статус"} onBlur={(v) => v.currentTarget.blur()} />
      </SelectTrigger>
      <SelectContent>
        {AllPossibleStatuses.map((pv) => {
          return (
            <SelectItem key={pv} value={pv} className={`${pv === status ? "hidden" : ""} capitalize w-full`}>
              {pv}
            </SelectItem>
          );
        })}
      </SelectContent>
    </SelectWithBlur>
  );
}
