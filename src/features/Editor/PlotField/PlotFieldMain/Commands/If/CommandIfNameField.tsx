import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import HideCommandsButton from "./HideCommandsButton";
import ButtonHoverPromptModal from "../../../../../../ui/ButtonAsideHoverPromptModal/ButtonHoverPromptModal";
import { generateMongoObjectId } from "../../../../../../utils/generateMongoObjectId";
import { AllPossiblePlotFieldComamndsTypes } from "../../../../../../types/StoryEditor/PlotField/PlotFieldTypes";
import usePlotfieldCommands from "../../../Context/PlotFieldContext";
import commandImg from "../../../../../../assets/images/Editor/command.png";
import plus from "../../../../../../assets/images/shared/add.png";
import { useRef, useState } from "react";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";
import AsideScrollable from "../../../../../../ui/Aside/AsideScrollable/AsideScrollable";
import { AllPossibleConditionBlockVariations } from "../../../../../../const/CONDITION_BLOCK_VARIATIONS";
import AsideScrollableButton from "../../../../../../ui/Aside/AsideScrollable/AsideScrollableButton";
import useAddNewIfVariation from "../../../hooks/If/BlockVariations/useAddNewIfVariation";
import useIfVariations from "./Context/IfContext";
import useAddNewLogicalOperator from "../../../hooks/If/BlockVariations/logicalOperator/useAddNewLogicalOperator";

type CommandIfNameFieldTypes = {
  topologyBlockId: string;
  plotfieldCommandIfId: string;
  plotfieldCommandId: string;
  setHideCommands: React.Dispatch<React.SetStateAction<boolean>>;
  hideCommands: boolean;
  isFocusedIf: boolean;
  isBackgroundFocused: boolean;
  isCommandFocused: boolean;
  createInsideElse: boolean;
  nameValue: "if" | "else";
};

export default function CommandIfNameField({
  topologyBlockId,
  plotfieldCommandIfId,
  plotfieldCommandId,
  nameValue,
  isCommandFocused,
  isBackgroundFocused,
  isFocusedIf,
  hideCommands,
  createInsideElse,
  setHideCommands,
}: CommandIfNameFieldTypes) {
  const { getCurrentAmountOfCommands } = usePlotfieldCommands();

  const createCommandInsideIf = useCreateBlankCommandInsideIf({
    topologyBlockId,
    plotfieldCommandIfId,
  });
  const createCommandInsideElse = useCreateBlankCommandInsideIf({
    topologyBlockId,
    plotfieldCommandIfId,
    isElse: true,
  });

  const handleCreateCommand = (isElse: boolean) => {
    const _id = generateMongoObjectId();
    if (isElse) {
      const elseCommandOrder = getCurrentAmountOfCommands({
        topologyBlockId,
      });
      createCommandInsideElse.mutate({
        commandOrder: elseCommandOrder,
        _id,
        command: "" as AllPossiblePlotFieldComamndsTypes,
        isElse: true,
        topologyBlockId,
        plotfieldCommandIfId,
      });
    } else {
      const ifCommandOrder = getCurrentAmountOfCommands({
        topologyBlockId,
      });

      createCommandInsideIf.mutate({
        commandOrder: ifCommandOrder,
        _id,
        command: "" as AllPossiblePlotFieldComamndsTypes,
        isElse,
        topologyBlockId,
        plotfieldCommandIfId,
      });
    }
  };

  return (
    <div className="min-w-[10rem] w-full relative flex items-center gap-[1rem] p-[.5rem]">
      <div className="flex gap-[.5rem] w-full">
        <PlotfieldCommandNameField
          className={`${
            isCommandFocused && !isBackgroundFocused && isFocusedIf ? "bg-dark-dark-blue" : "bg-secondary"
          }`}
        >
          {nameValue}
        </PlotfieldCommandNameField>
        <AddVariationButton nameValue={nameValue} ifId={plotfieldCommandIfId} plotfieldCommandId={plotfieldCommandId} />
        <HideCommandsButton hideCommands={hideCommands} setHideCommands={setHideCommands} />
      </div>
      <ButtonHoverPromptModal
        contentName="Создать строку"
        positionByAbscissa="right"
        className="shadow-sm shadow-gray-400 active:scale-[.99] relative bg-secondary"
        asideClasses="text-[1.3rem] -translate-y-1/4 text-text-light"
        onClick={() => handleCreateCommand(createInsideElse)}
        variant="rectangle"
      >
        <img
          src={plus}
          alt="+"
          className="w-[1.5rem] absolute translate-y-1/2 -translate-x-1/2 left-[0rem] bottom-0 z-[2]"
        />
        <img src={commandImg} alt="Commands" className="w-[3rem]" />
      </ButtonHoverPromptModal>
    </div>
  );
}

type AddVariationButtonTypes = {
  nameValue: "if" | "else";
  ifId: string;
  plotfieldCommandId: string;
};

function AddVariationButton({ nameValue, ifId, plotfieldCommandId }: AddVariationButtonTypes) {
  const { getAmountOfIfVariations, addNewLogicalOperator, addIfVariation } = useIfVariations();
  const [showVariationTypes, setShowVariationTypes] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const createIfVariation = useAddNewIfVariation({ ifId });
  const addLogicalOperator = useAddNewLogicalOperator({ ifId });

  useOutOfModal({ modalRef, setShowModal: setShowVariationTypes, showModal: showVariationTypes });
  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowVariationTypes((prev) => !prev);
        }}
        className={`${
          nameValue === "if" ? "" : "hidden"
        } text-[1.5rem] text-text-light bg-secondary hover:opacity-85 transition-all rounded-md px-[1rem] py-[.5rem] whitespace-nowrap active:scale-[0.99]`}
      >
        Добавить Условие +
      </button>

      <AsideScrollable ref={modalRef} className={`${showVariationTypes ? "" : "hidden"} left-0 translate-y-[.5rem]`}>
        {AllPossibleConditionBlockVariations.map((cbv) => (
          <AsideScrollableButton
            key={cbv}
            onClick={() => {
              setShowVariationTypes(false);
              const _id = generateMongoObjectId();
              createIfVariation.mutate({
                _id,
                type: cbv,
              });

              const amount = getAmountOfIfVariations({ plotfieldCommandId });

              if (amount > 0) {
                addNewLogicalOperator({ logicalOperator: "&&", plotfieldCommandId });
                addLogicalOperator.mutate({ logicalOperator: "&&" });
              }

              addIfVariation({
                plotfieldCommandId,
                ifVariation: {
                  ifVariationId: _id,
                  type: cbv,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              });
            }}
          >
            {cbv}
          </AsideScrollableButton>
        ))}
      </AsideScrollable>
    </div>
  );
}
