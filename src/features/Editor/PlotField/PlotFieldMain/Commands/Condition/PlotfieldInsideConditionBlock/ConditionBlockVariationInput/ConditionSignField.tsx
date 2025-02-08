import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SelectWithBlur from "@/components/ui/selectWithBlur";
import useUpdateConditionCharacter from "@/features/Editor/PlotField/hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionCharacter";
import useUpdateConditionCharacteristic from "@/features/Editor/PlotField/hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionCharacteristic";
import useUpdateConditionRetry from "@/features/Editor/PlotField/hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionRetry";
import {
  AllConditionSigns,
  ConditionSignTypes,
  ConditionValueVariationType,
} from "../../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import useConditionBlocks from "../../Context/ConditionContext";

type ConditionSignFieldTypes = {
  conditionBlockId: string;
  plotfieldCommandId: string;
  conditionBlockVariationId: string;
  type: ConditionValueVariationType;
  setCurrentSign: React.Dispatch<React.SetStateAction<ConditionSignTypes>>;
  currentSign: ConditionSignTypes;
};

export default function ConditionSignField({
  conditionBlockId,
  plotfieldCommandId,
  conditionBlockVariationId,
  type,
  currentSign,
  setCurrentSign,
}: ConditionSignFieldTypes) {
  const updateConditionBlockVariationSign = useConditionBlocks((state) => state.updateConditionBlockVariationSign);
  const updateValueCharacter = useUpdateConditionCharacter({ conditionBlockCharacterId: conditionBlockVariationId });
  const updateValueCharacteristic = useUpdateConditionCharacteristic({
    conditionBlockCharacteristicId: conditionBlockVariationId,
  });
  const updateValueRetry = useUpdateConditionRetry({ conditionBlockRetryId: conditionBlockVariationId });

  return (
    <SelectWithBlur
      onValueChange={(v: ConditionSignTypes) => {
        if (type === "character") {
          updateValueCharacter.mutate({ sign: v });
        } else if (type === "characteristic") {
          updateValueCharacteristic.mutate({ sign: v });
        } else if (type === "retry") {
          updateValueRetry.mutate({ sign: v });
        }

        updateConditionBlockVariationSign({
          conditionBlockId,
          sign: v,
          conditionBlockVariationId,
          plotFieldCommandId: plotfieldCommandId,
        });
        setCurrentSign(v);
      }}
    >
      <SelectTrigger className="text-text border-border border-[3px] hover:bg-accent active:scale-[.99] transition-all">
        <SelectValue placeholder={currentSign || "Знак"} onBlur={(v) => v.currentTarget.blur()} />
      </SelectTrigger>
      <SelectContent>
        {AllConditionSigns.map((pv) => {
          return (
            <SelectItem key={pv} value={pv} className={`${pv === currentSign ? "hidden" : ""} capitalize w-full`}>
              {pv}
            </SelectItem>
          );
        })}
      </SelectContent>
    </SelectWithBlur>
  );
}
