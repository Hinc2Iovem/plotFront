import { useEffect, useState } from "react";
import useIfVariations from "../../Context/IfContext";
import IfSignField from "../IfSignField";
import PlotfieldInput from "../../../../../../../../ui/Inputs/PlotfieldInput";
import IfFieldName from "./shared/IfFieldName";
import useSearch from "../../../../../../Context/Search/SearchContext";
import { useParams } from "react-router-dom";
import { ConditionSignTypes } from "../../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import useUpdateIfRetry from "../../../../../hooks/If/BlockVariations/patch/useUpdateIfRetry";

type IfVariationRetryTypes = {
  currentRentryAmount: number | null;
  currentSign?: ConditionSignTypes | null;
  plotfieldCommandId: string;
  topologyBlockId: string;
  ifVariationId: string;
};

export default function IfVariationRetry({
  currentRentryAmount,
  plotfieldCommandId,
  topologyBlockId,
  ifVariationId,
}: IfVariationRetryTypes) {
  const { episodeId } = useParams();
  const [retryAmount, setRetryAmount] = useState(typeof currentRentryAmount === "number" ? currentRentryAmount : null);
  const { updateIfVariationValue, getIfVariationById } = useIfVariations();

  const [currentlyActive, setCurrentlyActive] = useState(false);

  const updateIfRetry = useUpdateIfRetry({ ifRetryId: ifVariationId });

  const { addItem, updateValue } = useSearch();

  useEffect(() => {
    if (episodeId) {
      addItem({
        episodeId,
        item: {
          commandName: "If - Retry",
          id: ifVariationId,
          text: `${retryAmount}`,
          topologyBlockId,
          type: "ifVariation",
        },
      });
    }
  }, [episodeId]);

  useEffect(() => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "If - Retry",
        id: ifVariationId,
        value: `${getIfVariationById({ plotfieldCommandId, ifVariationId })?.sign} ${retryAmount}`,
        type: "ifVariation",
      });
    }
  }, [retryAmount, episodeId]);

  return (
    <div className="relative flex gap-[.5rem] items-center w-full">
      <div className="w-[30%] h-full">
        <IfSignField ifVariationId={ifVariationId} plotfieldCommandId={plotfieldCommandId} type="retry" />
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
            updateIfVariationValue({
              ifVariationId,
              plotfieldCommandId,
              amountOfRetries: +e.target.value,
            });
            setCurrentlyActive(true);
            updateIfRetry.mutate({ amountOfRetries: +e.target.value });
          }}
          placeholder="Повторения"
        />

        <IfFieldName currentlyActive={currentlyActive} text="Повторения" />
      </div>
    </div>
  );
}
