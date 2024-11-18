import { useState } from "react";
import { ConditionSignTypes } from "../../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import useConditionBlocks from "../../Context/ConditionContext";
import useUpdateConditionRetry from "../../../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionRetry";
import ConditionSignField from "./ConditionSignField";
import PlotfieldInput from "../../../../../../../shared/Inputs/PlotfieldInput";
import ConditionBlockFieldName from "./shared/ConditionBlockFieldName";

type ConditionBlockVariationRetryTypes = {
  currentRentryAmount: number | null;
  currentSign?: ConditionSignTypes | null;
  conditionBlockId: string;
  plotfieldCommandId: string;
  conditionBlockVariationId: string;
};

export default function ConditionBlockVariationRetry({
  currentRentryAmount,
  conditionBlockId,
  plotfieldCommandId,
  conditionBlockVariationId,
}: ConditionBlockVariationRetryTypes) {
  const [retryAmount, setRetryAmount] = useState(typeof currentRentryAmount === "number" ? currentRentryAmount : null);
  const { updateConditionBlockVariationValue } = useConditionBlocks();

  const [focusedSecondTime, setFocusedSecondTime] = useState(false);

  const [currentlyActive, setCurrentlyActive] = useState(false);

  const updateConditionRetry = useUpdateConditionRetry({ conditionBlockRetryId: conditionBlockVariationId });

  return (
    <div className="relative flex gap-[.5rem] items-center w-full">
      <div className="w-[30%] h-full">
        <ConditionSignField
          conditionBlockId={conditionBlockId}
          conditionBlockVariationId={conditionBlockVariationId}
          plotfieldCommandId={plotfieldCommandId}
          type="retry"
        />
      </div>

      <div className="w-full relative">
        <PlotfieldInput
          type="number"
          focusedSecondTime={focusedSecondTime}
          onBlur={() => {
            setFocusedSecondTime(false);
            setCurrentlyActive(false);
          }}
          setFocusedSecondTime={setFocusedSecondTime}
          value={retryAmount || ""}
          className="border-[3px] border-double border-dark-mid-gray"
          onClick={() => setCurrentlyActive(true)}
          onChange={(e) => {
            if (+e.target.value < 0) {
              return;
            }
            setRetryAmount(+e.target.value);
            updateConditionBlockVariationValue({
              conditionBlockId,
              conditionBlockVariationId,
              plotfieldCommandId,
              amountOfRetries: +e.target.value,
            });
            setCurrentlyActive(true);
            updateConditionRetry.mutate({ amountOfRetries: +e.target.value });
          }}
          placeholder="Повторения"
        />

        <ConditionBlockFieldName currentlyActive={currentlyActive} text="Повторения" />
      </div>
    </div>
  );
}
