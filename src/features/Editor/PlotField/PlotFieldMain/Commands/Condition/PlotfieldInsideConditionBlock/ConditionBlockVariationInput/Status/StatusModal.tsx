import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SelectWithBlur from "@/components/ui/selectWithBlur";
import { AllPossibleStatuses } from "../../../../../../../../../const/STATUSES";
import { StatusTypes } from "../../../../../../../../../types/StoryData/Status/StatusTypes";
import useUpdateConditionStatus from "../../../../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionStatus";
import useConditionBlocks from "../../../Context/ConditionContext";

type StatusModalTypes = {
  status: StatusTypes;
  conditionBlockVariationId: string;
  conditionBlockId: string;
  plotfieldCommandId: string;
  setStatus: React.Dispatch<React.SetStateAction<StatusTypes>>;
};

export default function StatusModal({
  status,
  conditionBlockVariationId,
  conditionBlockId,
  plotfieldCommandId,
  setStatus,
}: StatusModalTypes) {
  const { updateConditionBlockVariationValue } = useConditionBlocks();
  const updateConditionStatus = useUpdateConditionStatus({ conditionBlockStatusId: conditionBlockVariationId });

  return (
    <SelectWithBlur
      onValueChange={(v: StatusTypes) => {
        setStatus(v);
        updateConditionBlockVariationValue({
          conditionBlockId,
          conditionBlockVariationId,
          plotfieldCommandId,
          status: v,
        });

        updateConditionStatus.mutate({ status: v });
      }}
    >
      <SelectTrigger className="w-fit h-full text-text capitalize border-border border-[3px] hover:bg-accent active:scale-[.99] transition-all">
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
