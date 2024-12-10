import { useEffect, useState } from "react";
import { ConditionSignTypes } from "../../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import useConditionBlocks from "../../Context/ConditionContext";
import useUpdateConditionRetry from "../../../../../hooks/Condition/ConditionBlock/BlockVariations/patch/useUpdateConditionRetry";
import ConditionSignField from "./ConditionSignField";
import PlotfieldInput from "../../../../../../../shared/Inputs/PlotfieldInput";
import ConditionBlockFieldName from "./shared/ConditionBlockFieldName";
import useSearch from "../../../../../../Context/Search/SearchContext";
import { useParams } from "react-router-dom";

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

  const [currentlyActive, setCurrentlyActive] = useState(false);

  const updateConditionRetry = useUpdateConditionRetry({ conditionBlockRetryId: conditionBlockVariationId });

  const { addItem, updateValue } = useSearch();

  useEffect(() => {
    if (episodeId) {
      addItem({
        episodeId,
        item: {
          commandName: "Condition - Retry",
          id: conditionBlockVariationId,
          text: `${retryAmount}`,
          topologyBlockId,
          type: "conditionVariation",
        },
      });
    }
  }, [episodeId]);

  useEffect(() => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "Condition - Retry",
        id: conditionBlockVariationId,
        value: `${
          getConditionBlockVariationById({ conditionBlockId, plotfieldCommandId, conditionBlockVariationId })?.sign
        } ${retryAmount}`,
        type: "conditionVariation",
      });
    }
  }, [retryAmount, episodeId]);

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
          onBlur={() => {
            setCurrentlyActive(false);
          }}
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
