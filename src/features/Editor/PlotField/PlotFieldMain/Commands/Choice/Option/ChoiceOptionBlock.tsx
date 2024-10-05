import { useEffect, useState } from "react";
import useDebounce from "../../../../../../../hooks/utilities/useDebounce";
import { TranslationChoiceOptionTypes } from "../../../../../../../types/Additional/TranslationTypes";
import useGetChoiceOptionById from "../../hooks/Choice/ChoiceOption/useGetChoiceOptionById";
import useUpdateChoiceOptionTranslationText from "../../hooks/Choice/ChoiceOption/useUpdateChoiceOptionTranslationText";
import { ChoiceOptionTypesAndTopologyBlockIdsTypes } from "./ChoiceOptionBlocksList";
import ChoiceOptionShowPlot from "./ChoiceOptionShowPlot";
import OptionSelectOrder from "./OptionSelectOrder";
import OptionSelectSexualOrientationBlock from "./OptionSelectSexualOrientationBlock";
import OptionSelectTopologyBlock from "./OptionSelectTopologyBlock";
import OptionCharacteristicBlock from "./OptionVariations/OptionCharacteristicBlock";
import OptionPremiumBlock from "./OptionVariations/OptionPremiumBlock";
import OptionRelationshipBlock from "./OptionVariations/OptionRelationshipBlock";
import useChoiceOptions from "../Context/ChoiceContext";

type ChoiceOptionBlockTypes = {
  currentTopologyBlockId: string;
  plotFieldCommandId: string;
  showOptionPlot: boolean;
  amountOfOptions: number;
  setOptionOrderToRevalidate: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  setShowOptionPlot: React.Dispatch<React.SetStateAction<boolean>>;
  setShowedOptionPlotTopologyBlockId: React.Dispatch<
    React.SetStateAction<string>
  >;
  setOptionOrderIdNotToRevalidate: React.Dispatch<React.SetStateAction<string>>;
  setOptionOrderIdToRevalidate: React.Dispatch<React.SetStateAction<string>>;
  setAllChoiceOptionTypesAndTopologyBlockIds: React.Dispatch<
    React.SetStateAction<ChoiceOptionTypesAndTopologyBlockIdsTypes[]>
  >;
  optionOrderIdNotToRevalidate: string;
  optionOrderToRevalidate: number | undefined;
} & TranslationChoiceOptionTypes;

export default function ChoiceOptionBlock({
  type,
  choiceOptionId,
  translations,
  showOptionPlot,
  plotFieldCommandId,
  currentTopologyBlockId,
  amountOfOptions,
  optionOrderIdNotToRevalidate,
  optionOrderToRevalidate,
  setOptionOrderIdNotToRevalidate,
  setOptionOrderToRevalidate,
  setOptionOrderIdToRevalidate,
  setShowOptionPlot,
  setShowedOptionPlotTopologyBlockId,
  setAllChoiceOptionTypesAndTopologyBlockIds,
}: ChoiceOptionBlockTypes) {
  const [showAllSexualOrientationBlocks, setShowAllSexualOrientationBlocks] =
    useState(false);
  const { addChoiceOption } = useChoiceOptions();
  const [showAllTopologyBlocks, setShowAllTopologyBlocks] = useState(false);
  const [showAllOrders, setShowAllOrders] = useState(false);

  const { data: choiceOption } = useGetChoiceOptionById({ choiceOptionId });
  const [topologyBlockId, setTopologyBlockId] = useState("");
  const [sexualOrientationType, setSexualOrientationType] = useState("");
  const [currentOrder, setCurrentOrder] = useState<number | undefined>();

  useEffect(() => {
    if (choiceOption) {
      setTopologyBlockId(choiceOption?.topologyBlockId || "");
      setSexualOrientationType(choiceOption?.sexualOrientationType || "");
      setCurrentOrder(choiceOption?.optionOrder);
      addChoiceOption({
        choiceOption: {
          optionType: choiceOption.type,
          optionText: translations[0]?.text,
          choiceOptionId: choiceOption._id,
          topologyBlockId: choiceOption.topologyBlockId,
        },
      });
      setAllChoiceOptionTypesAndTopologyBlockIds((prev) => {
        return [
          ...prev,
          {
            type: choiceOption.type,
            topologyBlockId: choiceOption?.topologyBlockId || "",
            option: translations[0]?.text || "",
            choiceOptionId,
          },
        ];
      });
    }
  }, [choiceOption]);

  useEffect(() => {
    if (
      optionOrderIdNotToRevalidate?.trim().length &&
      typeof optionOrderToRevalidate === "number"
    ) {
      if (
        choiceOption?.optionOrder === optionOrderToRevalidate &&
        choiceOptionId !== optionOrderIdNotToRevalidate
      ) {
        setCurrentOrder(undefined);
        setOptionOrderIdToRevalidate(choiceOption?._id || "");
      }
    }
  }, [optionOrderIdNotToRevalidate, optionOrderToRevalidate, choiceOptionId]);

  const [optionText, setOptionText] = useState("");

  useEffect(() => {
    if (translations) {
      translations.map((ot) => {
        if (ot.textFieldName === "choiceOption") {
          setOptionText(ot.text);
        }
      });
    }
  }, [translations]);

  const debouncedValue = useDebounce({ value: optionText, delay: 700 });

  const updateOptionTextTranslation = useUpdateChoiceOptionTranslationText({
    choiceOptionId,
    option: debouncedValue,
    type,
    choiceId: plotFieldCommandId,
    language: "russian",
  });

  useEffect(() => {
    if (
      (translations[0]?.text || "") !== debouncedValue &&
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
          value={optionText}
          onChange={(e) => setOptionText(e.target.value)}
          placeholder="Ответ"
          className="w-full text-[1.4rem] text-gray-700 rounded-md outline-gray-300 shadow-md bg-white px-[1rem]"
        />

        <div className="p-[.2rem] flex flex-col gap-[1rem]">
          {type === "premium" ? (
            <OptionPremiumBlock choiceOptionId={choiceOptionId} />
          ) : type === "characteristic" ? (
            <OptionCharacteristicBlock choiceOptionId={choiceOptionId} />
          ) : type === "relationship" ? (
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
                setShowedOptionPlotTopologyBlockId={
                  setShowedOptionPlotTopologyBlockId
                }
                topologyBlockId={topologyBlockId}
              />
              <OptionSelectOrder
                amountOfOptions={amountOfOptions}
                choiceId={choiceOption?.plotFieldCommandChoiceId || ""}
                choiceOptionId={choiceOptionId}
                setShowAllOrders={setShowAllOrders}
                showAllOrders={showAllOrders}
                optionOrder={currentOrder}
                setShowAllTopologyBlocks={setShowAllTopologyBlocks}
                setOptionOrderToRevalidate={setOptionOrderToRevalidate}
                setOptionOrderIdNotToRevalidate={
                  setOptionOrderIdNotToRevalidate
                }
                setCurrentOrder={setCurrentOrder}
              />
              <OptionSelectTopologyBlock
                setAllChoiceOptionTypesAndTopologyBlockIds={
                  setAllChoiceOptionTypesAndTopologyBlockIds
                }
                optionText={optionText}
                optionType={type}
                setTopologyBlockId={setTopologyBlockId}
                setShowAllTopologyBlocks={setShowAllTopologyBlocks}
                setShowAllOrders={setShowAllOrders}
                showAllTopologyBlocks={showAllTopologyBlocks}
                choiceOptionId={choiceOptionId}
                currentTopologyBlockId={currentTopologyBlockId}
                topologyBlockId={topologyBlockId}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
