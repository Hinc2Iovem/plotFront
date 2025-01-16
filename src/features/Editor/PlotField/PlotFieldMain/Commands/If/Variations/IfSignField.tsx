import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SelectWithBlur from "@/components/ui/selectWithBlur";
import useUpdateIfCharacter from "@/features/Editor/PlotField/hooks/If/BlockVariations/patch/useUpdateIfCharacter";
import useUpdateIfCharacteristic from "@/features/Editor/PlotField/hooks/If/BlockVariations/patch/useUpdateIfCharacteristic";
import useUpdateIfRetry from "@/features/Editor/PlotField/hooks/If/BlockVariations/patch/useUpdateIfRetry";
import {
  AllConditionSigns,
  ConditionSignTypes,
  ConditionValueVariationType,
} from "../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import useIfVariations from "../Context/IfContext";

type IfSignFieldTypes = {
  plotfieldCommandId: string;
  ifVariationId: string;
  type: ConditionValueVariationType;
  currentSign: ConditionSignTypes;
  setCurrentSign: React.Dispatch<React.SetStateAction<ConditionSignTypes>>;
};

export default function IfSignField({
  plotfieldCommandId,
  ifVariationId,
  type,
  currentSign,
  setCurrentSign,
}: IfSignFieldTypes) {
  const { updateIfVariationSign } = useIfVariations();
  const updateValueCharacter = useUpdateIfCharacter({ ifCharacterId: ifVariationId });
  const updateValueCharacteristic = useUpdateIfCharacteristic({
    ifCharacteristicId: ifVariationId,
  });
  const updateValueRetry = useUpdateIfRetry({ ifRetryId: ifVariationId });

  return (
    <SelectWithBlur
      onValueChange={(v: ConditionSignTypes) => {
        if (type === "character") {
          updateValueCharacter.mutate({ sign: currentSign });
        } else if (type === "characteristic") {
          updateValueCharacteristic.mutate({ sign: currentSign });
        } else if (type === "retry") {
          updateValueRetry.mutate({ sign: currentSign });
        }

        updateIfVariationSign({
          sign: currentSign,
          ifVariationId,
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
