import { useState } from "react";
import { ConditionSignTypes } from "../../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import useConditionBlocks from "../../Context/ConditionContext";
import useUpdateConditionRetry from "../../../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionRetry";
import ConditionSignField from "./ConditionSignField";
import PlotfieldInput from "../../../../../../../shared/Inputs/PlotfieldInput";

type ConditionBlockVariationRetryTypes = {
  currentRentryAmount: number | null;
  currentSign?: ConditionSignTypes | null;
  conditionBlockId: string;
  plotfieldCommandId: string;
  conditionBlockVariationId: string;
};

export default function ConditionBlockVariationRetry({
  currentRentryAmount,
  currentSign,
  conditionBlockId,
  plotfieldCommandId,
  conditionBlockVariationId,
}: ConditionBlockVariationRetryTypes) {
  const [retryAmount, setRetryAmount] = useState(typeof currentRentryAmount === "number" ? currentRentryAmount : null);
  const sign = typeof currentSign === "string" ? currentSign : null;

  const { updateConditionBlockVariationValue } = useConditionBlocks();

  const updateConditionRetry = useUpdateConditionRetry({ conditionBlockRetryId: conditionBlockVariationId });

  return (
    <div className="relative flex gap-[1rem]">
      {sign ? (
        <ConditionSignField
          conditionBlockId={conditionBlockId}
          conditionBlockVariationId={conditionBlockVariationId}
          plotfieldCommandId={plotfieldCommandId}
          type="retry"
        />
      ) : null}

      <PlotfieldInput
        type="text"
        value={retryAmount || ""}
        onChange={(e) => {
          setRetryAmount(+e.target.value);
          updateConditionBlockVariationValue({
            conditionBlockId,
            conditionBlockVariationId,
            plotfieldCommandId,
            amountOfRetries: +e.target.value,
          });
          updateConditionRetry.mutate({ amountOfRetries: +e.target.value });
        }}
        placeholder="Повторения"
      />
    </div>
  );
}
