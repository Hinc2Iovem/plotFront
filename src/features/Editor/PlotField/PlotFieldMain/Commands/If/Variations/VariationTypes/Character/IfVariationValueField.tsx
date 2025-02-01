import { useState } from "react";
import useUpdateIfCharacter from "../../../../../../hooks/If/BlockVariations/patch/useUpdateIfCharacter";
import useCommandIf from "../../../Context/IfContext";
import PlotfieldInput from "../../../../../../../../../ui/Inputs/PlotfieldInput";
import IfFieldName from "../shared/IfFieldName";

type IfValueFieldTypes = {
  plotfieldCommandId: string;
  setShowCharacterPromptModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentIfValue: React.Dispatch<React.SetStateAction<number | null>>;
  currentIfValue: number | null;
  showCharacterPromptModal: boolean;
  ifVariationId: string;
};

export default function IfVariationValueField({
  plotfieldCommandId,
  showCharacterPromptModal,
  ifVariationId,
  currentIfValue,
  setCurrentIfValue,
  setShowCharacterPromptModal,
}: IfValueFieldTypes) {
  const { updateIfVariationValue } = useCommandIf();

  const [currentlyActive, setCurrentlyActive] = useState(false);

  const updateIf = useUpdateIfCharacter({
    ifCharacterId: ifVariationId,
  });

  return (
    <div className="min-w-[100px] flex-grow relative">
      <PlotfieldInput
        type="text"
        onBlur={() => {
          setCurrentlyActive(false);
        }}
        onClick={() => {
          setCurrentlyActive(true);
        }}
        placeholder="Значение"
        value={currentIfValue || ""}
        onChange={(e) => {
          if (showCharacterPromptModal) {
            setShowCharacterPromptModal(false);
          }
          setCurrentlyActive(true);
          updateIf.mutate({ value: +e.target.value });
          setCurrentIfValue(+e.target.value);

          updateIfVariationValue({
            plotfieldCommandId,
            ifVariationId,
            ifValue: +e.target.value,
          });
        }}
        className={`border-[3px] border-border text-text`}
      />
      <IfFieldName currentlyActive={currentlyActive} text="Персонаж" />
    </div>
  );
}
