import { useEffect, useRef, useState } from "react";
import { ConditionSignTypes } from "../../../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import useConditionBlocks from "../../../Context/ConditionContext";
import useUpdateConditionRetry from "../../../../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionRetry";
import ConditionSignField from "../ConditionSignField";
import PlotfieldInput from "../../../../../../../../../ui/Inputs/PlotfieldInput";
import ConditionBlockFieldName from "../shared/ConditionBlockFieldName";
import useSearch from "../../../../../../../Context/Search/SearchContext";
import { useParams } from "react-router-dom";
import useAddItemInsideSearch from "../../../../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";

type ConditionBlockVariationRetryTypes = {
  currentRentryAmount: number | null;
  currentSign?: ConditionSignTypes | null;
  conditionBlockId: string;
  plotfieldCommandId: string;
  topologyBlockId: string;
  conditionBlockVariationId: string;
};

export default function ConditionBlockVariationRetry({
  currentRentryAmount,
  conditionBlockId,
  plotfieldCommandId,
  topologyBlockId,
  conditionBlockVariationId,
}: ConditionBlockVariationRetryTypes) {
  const { episodeId } = useParams();
  const [retryAmount, setRetryAmount] = useState(typeof currentRentryAmount === "number" ? currentRentryAmount : null);
  const { updateConditionBlockVariationValue, getConditionBlockVariationById } = useConditionBlocks();
  const [currentSign, setCurrentSign] = useState<ConditionSignTypes>(
    getConditionBlockVariationById({ conditionBlockId, plotfieldCommandId, conditionBlockVariationId })?.sign ||
      ("" as ConditionSignTypes)
  );
  const preventRerender = useRef(false);
  const [currentlyActive, setCurrentlyActive] = useState(false);

  const updateConditionRetry = useUpdateConditionRetry({ conditionBlockRetryId: conditionBlockVariationId });

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: "Condition - Retry",
    id: conditionBlockVariationId,
    text: `${retryAmount}`,
    topologyBlockId,
    type: "conditionVariation",
  });

  useEffect(() => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "Condition - Retry",
        id: conditionBlockVariationId,
        value: `${currentSign} ${retryAmount}`,
        type: "conditionVariation",
      });
    }
  }, [retryAmount, episodeId]);

  useEffect(() => {
    if (currentSign && preventRerender) {
      updateConditionRetry.mutate({ sign: currentSign });
    }

    return () => {
      preventRerender.current = true;
    };
  }, [currentSign]);

  return (
    <div className="relative flex gap-[5px] items-center w-full">
      <div className="w-[30%] h-full">
        <ConditionSignField
          setCurrentSign={setCurrentSign}
          currentSign={currentSign}
          conditionBlockId={conditionBlockId}
          conditionBlockVariationId={conditionBlockVariationId}
          plotfieldCommandId={plotfieldCommandId}
          type="retry"
        />
      </div>

      <div className="w-full relative">
        <PlotfieldInput
          type="number"
          onBlur={() => {
            setCurrentlyActive(false);
          }}
          value={retryAmount || ""}
          className="border-[3px] border-border text-text"
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
