import { useState } from "react";
import { useParams } from "react-router-dom";
import { ConditionSignTypes } from "../../../../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import PlotfieldInput from "../../../../../../../../../ui/Inputs/PlotfieldInput";
import useSearch from "../../../../../../../Context/Search/SearchContext";
import useAddItemInsideSearch from "../../../../../../../hooks/PlotfieldSearch/helpers/useAddItemInsideSearch";
import useUpdateIfRetry from "../../../../../../hooks/If/BlockVariations/patch/useUpdateIfRetry";
import useCommandIf from "../../../Context/IfContext";
import IfSignField from "../../IfSignField";
import IfFieldName from "../shared/IfFieldName";

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
  const { updateIfVariationValue, getIfVariationById } = useCommandIf();

  const [retryAmount, setRetryAmount] = useState(typeof currentRentryAmount === "number" ? currentRentryAmount : null);
  const [currentSign, setCurrentSign] = useState<ConditionSignTypes>(
    getIfVariationById({ plotfieldCommandId, ifVariationId })?.sign || ("" as ConditionSignTypes)
  );
  const [currentlyActive, setCurrentlyActive] = useState(false);

  const updateIfRetry = useUpdateIfRetry({ ifRetryId: ifVariationId });

  const { updateValue } = useSearch();

  useAddItemInsideSearch({
    commandName: "If - Retry",
    id: ifVariationId,
    text: `${currentSign} ${retryAmount}`,
    topologyBlockId,
    type: "ifVariation",
  });

  const updateRetry = () => {
    if (typeof retryAmount === "number" && retryAmount >= 0) {
      updateIfRetry.mutate({
        amountOfRetries: retryAmount,
      });
    }
  };

  const updateValues = (value: string) => {
    if (episodeId) {
      updateValue({
        episodeId,
        commandName: "If - Retry",
        id: ifVariationId,
        value: value || "",
        type: "ifVariation",
      });
    }
  };

  return (
    <div className="relative flex gap-[5px] w-full">
      <div className="w-[30%] h-full">
        <IfSignField
          setCurrentSign={setCurrentSign}
          currentSign={currentSign}
          ifVariationId={ifVariationId}
          plotfieldCommandId={plotfieldCommandId}
          type="retry"
        />
      </div>

      <div className="w-full relative">
        <PlotfieldInput
          type="number"
          onBlur={() => {
            setCurrentlyActive(false);
            updateRetry();
          }}
          value={retryAmount || ""}
          className="border-[3px] border-border text-text"
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
            updateValues(`${currentSign} ${e.target.value}`);
          }}
          placeholder="Повторения"
        />

        <IfFieldName currentlyActive={currentlyActive} text="Повторения" />
      </div>
    </div>
  );
}
