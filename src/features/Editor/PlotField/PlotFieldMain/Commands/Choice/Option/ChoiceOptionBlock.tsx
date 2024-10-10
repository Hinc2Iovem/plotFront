import { useEffect, useState } from "react";
import useDebounce from "../../../../../../../hooks/utilities/useDebounce";
import useGetChoiceOptionById from "../../hooks/Choice/ChoiceOption/useGetChoiceOptionById";
import useUpdateChoiceOptionTranslationText from "../../hooks/Choice/ChoiceOption/useUpdateChoiceOptionTranslationText";
import useChoiceOptions, {
  ChoiceOptionItemTypes,
} from "../Context/ChoiceContext";
import ChoiceOptionShowPlot from "./ChoiceOptionShowPlot";
import OptionSelectOrder from "./OptionSelectOrder";
import OptionSelectSexualOrientationBlock from "./OptionSelectSexualOrientationBlock";
import OptionSelectTopologyBlock from "./OptionSelectTopologyBlock";
import OptionCharacteristicBlock from "./OptionVariations/OptionCharacteristicBlock";
import OptionPremiumBlock from "./OptionVariations/OptionPremiumBlock";
import OptionRelationshipBlock from "./OptionVariations/OptionRelationshipBlock";

type ChoiceOptionBlockTypes = {
  currentTopologyBlockId: string;
  plotFieldCommandId: string;
  showOptionPlot: boolean;
  amountOfOptions: number;
  setShowOptionPlot: React.Dispatch<React.SetStateAction<boolean>>;
  choiceId: string;
} & ChoiceOptionItemTypes;

export default function ChoiceOptionBlock({
  optionType,
  choiceId,
  choiceOptionId,
  showOptionPlot,
  plotFieldCommandId,
  currentTopologyBlockId,
  amountOfOptions,
  optionText,
  setShowOptionPlot,
}: ChoiceOptionBlockTypes) {
  const {
    updateChoiceOptionText,
    getChoiceOptionText,
    getChoiceOptionById,
    updateChoiceOptionOrder,
    updateChoiceOptionTopologyBlockId,
  } = useChoiceOptions();

  const [showAllSexualOrientationBlocks, setShowAllSexualOrientationBlocks] =
    useState(false);
  const [showAllTopologyBlocks, setShowAllTopologyBlocks] = useState(false);
  const [showAllOrders, setShowAllOrders] = useState(false);

  const { data: choiceOption } = useGetChoiceOptionById({ choiceOptionId });
  const [sexualOrientationType, setSexualOrientationType] = useState("");

  useEffect(() => {
    if (choiceOption) {
      setSexualOrientationType(choiceOption?.sexualOrientationType || "");
      updateChoiceOptionOrder({
        choiceId,
        choiceOptionId,
        optionOrder: choiceOption?.optionOrder as number,
      });
      updateChoiceOptionTopologyBlockId({
        choiceId,
        choiceOptionId,
        topologyBlockId: choiceOption.topologyBlockId,
        topologyBlockName:
          getChoiceOptionById({ choiceId, choiceOptionId })
            ?.topologyBlockName || "",
      });
    }
  }, [choiceOption]);

  const debouncedValue = useDebounce({
    value: getChoiceOptionText({ choiceId, choiceOptionId }),
    delay: 700,
  });

  const updateOptionTextTranslation = useUpdateChoiceOptionTranslationText({
    choiceOptionId,
    option: debouncedValue,
    type: optionType,
    choiceId: plotFieldCommandId,
    language: "russian",
  });

  useEffect(() => {
    if (
      (optionText || "") !== debouncedValue &&
      debouncedValue?.trim().length
    ) {
      updateOptionTextTranslation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <div
      className={`${
        showOptionPlot ? "hidden" : ""
      } w-full bg-white min-h-[10rem] h-full rounded-md shadow-md`}
    >
      <div className="w-full flex justify-between flex-col h-full">
        <input
          type="text"
          value={getChoiceOptionText({ choiceId, choiceOptionId })}
          onChange={(e) => {
            updateChoiceOptionText({
              choiceId,
              id: choiceOptionId,
              optionText: e.target.value,
            });
          }}
          placeholder="Ответ"
          className="w-full text-[1.4rem] text-gray-700 rounded-md outline-gray-300 shadow-md bg-white px-[1rem]"
        />

        <div className="p-[.2rem] flex flex-col gap-[1rem]">
          {optionType === "premium" ? (
            <OptionPremiumBlock choiceOptionId={choiceOptionId} />
          ) : optionType === "characteristic" ? (
            <OptionCharacteristicBlock choiceOptionId={choiceOptionId} />
          ) : optionType === "relationship" ? (
            <OptionRelationshipBlock choiceOptionId={choiceOptionId} />
          ) : null}
          <div className="flex justify-between w-full">
            <div
              className={`${
                showAllSexualOrientationBlocks ? "" : "overflow-hidden"
              } w-[calc(50%+2.5rem)] self-end`}
            >
              <OptionSelectSexualOrientationBlock
                setShowAllSexualOrientationBlocks={
                  setShowAllSexualOrientationBlocks
                }
                setShowAllTopologyBlocks={setShowAllTopologyBlocks}
                showAllSexualOrientationBlocks={showAllSexualOrientationBlocks}
                choiceOptionId={choiceOptionId}
                sexualOrientation={sexualOrientationType}
              />
            </div>
            <div
              className={`${
                showAllTopologyBlocks || showAllOrders ? "" : "overflow-hidden"
              } w-[18rem] flex flex-col`}
            >
              <ChoiceOptionShowPlot
                setShowOptionPlot={setShowOptionPlot}
                topologyBlockId={
                  getChoiceOptionById({ choiceId, choiceOptionId })
                    ?.topologyBlockId || ""
                }
                choiceId={choiceId}
                choiceOptionId={choiceOptionId}
              />
              <OptionSelectOrder
                amountOfOptions={amountOfOptions}
                choiceId={choiceOption?.plotFieldCommandChoiceId || ""}
                choiceOptionId={choiceOptionId}
                setShowAllOrders={setShowAllOrders}
                showAllOrders={showAllOrders}
                setShowAllTopologyBlocks={setShowAllTopologyBlocks}
              />
              <OptionSelectTopologyBlock
                choiceId={choiceId}
                setShowAllTopologyBlocks={setShowAllTopologyBlocks}
                setShowAllOrders={setShowAllOrders}
                showAllTopologyBlocks={showAllTopologyBlocks}
                choiceOptionId={choiceOptionId}
                currentTopologyBlockId={currentTopologyBlockId}
                topologyBlockId={
                  getChoiceOptionById({ choiceId, choiceOptionId })
                    ?.topologyBlockId || ""
                }
                topologyBlockName={
                  getChoiceOptionById({ choiceId, choiceOptionId })
                    ?.topologyBlockName || ""
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
