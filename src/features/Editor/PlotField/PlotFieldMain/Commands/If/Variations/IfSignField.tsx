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
import useCommandIf from "../Context/IfContext";

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
  const { updateIfVariationSign } = useCommandIf();
  const updateValueCharacter = useUpdateIfCharacter({ ifCharacterId: ifVariationId });
  const updateValueCharacteristic = useUpdateIfCharacteristic({
    ifCharacteristicId: ifVariationId,
  });
  const updateValueRetry = useUpdateIfRetry({ ifRetryId: ifVariationId });

  const updateSign = (v: ConditionSignTypes) => {
    if (AllConditionSigns.includes(v)) {
      if (type === "character") {
        updateValueCharacter.mutate({ sign: v });
      } else if (type === "characteristic") {
        updateValueCharacteristic.mutate({ sign: v });
      } else if (type === "retry") {
        updateValueRetry.mutate({ sign: v });
      }

      updateIfVariationSign({
        sign: v,
        ifVariationId,
        plotFieldCommandId: plotfieldCommandId,
      });
      setCurrentSign(v);
    }
  };

  return (
    <SelectWithBlur onValueChange={(v: ConditionSignTypes) => updateSign(v)}>
      <SelectTrigger className="text-text border-border border-[3px] hover:bg-accent active:scale-[.99] transition-all">
        <SelectValue placeholder={currentSign || "Знак"} />
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
