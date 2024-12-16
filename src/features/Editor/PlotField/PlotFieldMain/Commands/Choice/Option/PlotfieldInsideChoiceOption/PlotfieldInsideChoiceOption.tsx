import { useParams } from "react-router-dom";
import command from "../../../../../../../../assets/images/Editor/command.png";
import plus from "../../../../../../../../assets/images/shared/add.png";
import { generateMongoObjectId } from "../../../../../../../../utils/generateMongoObjectId";
import ButtonHoverPromptModal from "../../../../../../../../ui/ButtonAsideHoverPromptModal/ButtonHoverPromptModal";
import useCreateBlankCommand from "../../../../../hooks/useCreateBlankCommand";
import PlotFieldMain from "../../../../PlotFieldMain";
import useChoiceOptions from "../../Context/ChoiceContext";
import { ChoiceOptionTypesAndTopologyBlockIdsTypes } from "../ChoiceOptionBlocksList";
import ChoiceOptionInputField from "./ChoiceOptionInputField";
import useDeleteChoiceOption from "../../../../../hooks/Choice/ChoiceOption/useDeleteChoiceOption";
import { useEffect, useRef, useState } from "react";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";

type PlotfieldInsideChoiceOptionTypes = {
  showOptionPlot: boolean;
  choiceId: string;
  plotfieldCommandId: string;
  isFocusedBackground: boolean;
  currentTopologyBlockId: string;
  setShowOptionPlot: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFocusedBackground: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function PlotfieldInsideChoiceOption({
  showOptionPlot,
  choiceId,
  plotfieldCommandId,
  isFocusedBackground,
  currentTopologyBlockId,
  setShowOptionPlot,
  setIsFocusedBackground,
}: PlotfieldInsideChoiceOptionTypes) {
  const { episodeId } = useParams();

  const { getCurrentlyOpenChoiceOption, getAllChoiceOptionsByChoiceId, getCurrentlyOpenChoiceOptionPlotId } =
    useChoiceOptions();

  // const [showMessage, setShowMessage] = useState("");

  const createCommand = useCreateBlankCommand({
    topologyBlockId: getCurrentlyOpenChoiceOption({ choiceId })?.topologyBlockId || "",
    episodeId: episodeId || "",
  });

  const handleCreateCommand = () => {
    const _id = generateMongoObjectId();
    createCommand.mutate({
      _id,
      topologyBlockId: getCurrentlyOpenChoiceOption({ choiceId })?.topologyBlockId || "",
    });
  };

  return (
    <section className={`${showOptionPlot || isFocusedBackground ? "" : "hidden"} flex flex-col gap-[1rem] relative`}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowOptionPlot(false);
          setIsFocusedBackground(false);
        }}
        className="w-[2.5rem] h-[1rem] bg-secondary rounded-md shadow-sm absolute right-[-.3rem] top-[-.3rem] hover:shadow-md transition-shadow"
      ></button>
      <form onSubmit={(e) => e.preventDefault()}>
        {getAllChoiceOptionsByChoiceId({ choiceId }).map((op, i) => (
          <ChoiceOptionInputField
            key={"optionValueInput-" + op.topologyBlockId + "-" + op.optionType + "-" + i}
            option={op.optionText || ""}
            topologyBlockId={op.topologyBlockId || ""}
            type={op.optionType}
            choiceOptionId={op.choiceOptionId}
            choiceId={choiceId}
          />
        ))}
      </form>
      <header className="w-full flex gap-[.5rem] relative px-[1rem] py-[.9rem] flex-wrap">
        {getAllChoiceOptionsByChoiceId({ choiceId }).map((op, i) => (
          <OptionVariationButton
            key={op.topologyBlockId + "-" + op.optionType + "-" + i}
            {...op}
            choiceId={choiceId}
            type={op.optionType}
            isFocusedBackground={isFocusedBackground}
            plotfieldCommandId={plotfieldCommandId}
            currentTopologyBlockId={currentTopologyBlockId}
            showedOptionPlotTopologyBlockId={getCurrentlyOpenChoiceOptionPlotId({ choiceId })}
            setIsFocusedBackground={setIsFocusedBackground}
            setShowOptionPlot={setShowOptionPlot}
          />
        ))}
      </header>

      <main className="flex flex-col gap-[.5rem] w-full">
        <div className="flex w-full bg-secondary rounded-md shadow-sm itesm-center  px-[1rem] py-[.5rem]">
          <div className="flex gap-[1rem]">
            <ButtonHoverPromptModal
              contentName="Все команды"
              positionByAbscissa="left"
              asideClasses="text-text-light text-[1.3rem] top-[3.5rem] bottom-[-3.5rem]"
              className="bg-primary-darker shadow-sm shadow-gray-400 active:scale-[.99]"
              variant="rectangle"
            >
              <img src={command} alt="Commands" className="w-[3rem]" />
            </ButtonHoverPromptModal>
            <ButtonHoverPromptModal
              contentName="Создать строку"
              positionByAbscissa="left"
              className="bg-primary  shadow-sm shadow-gray-400 active:scale-[.99] relative "
              asideClasses="text-text-light text-[1.3rem] top-[3.5rem] bottom-[-3.5rem]"
              onClick={handleCreateCommand}
              variant="rectangle"
            >
              <img
                src={plus}
                alt="+"
                className="w-[1.5rem] absolute translate-y-1/2 translate-x-1/2 right-[0rem] bottom-0"
              />
              <img src={command} alt="Commands" className="w-[3rem]" />
            </ButtonHoverPromptModal>
          </div>
        </div>
        <PlotFieldMain
          showAllCommands={false}
          renderedAsSubPlotfield={true}
          topologyBlockId={getCurrentlyOpenChoiceOption({ choiceId })?.topologyBlockId || ""}
        />
      </main>
    </section>
  );
}

type OptionVariationButtonTypes = {
  showedOptionPlotTopologyBlockId: string;
  plotfieldCommandId: string;
  isFocusedBackground: boolean;
  choiceId: string;
  currentTopologyBlockId: string;
  setShowOptionPlot: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFocusedBackground: React.Dispatch<React.SetStateAction<boolean>>;
} & ChoiceOptionTypesAndTopologyBlockIdsTypes;

function OptionVariationButton({
  showedOptionPlotTopologyBlockId,
  type,
  topologyBlockId,
  choiceOptionId,
  plotfieldCommandId,
  isFocusedBackground,
  choiceId,
  currentTopologyBlockId,
  setIsFocusedBackground,
  setShowOptionPlot,
}: OptionVariationButtonTypes) {
  const { episodeId } = useParams();
  const {
    updateCurrentlyOpenChoiceOption,
    getCurrentlyOpenChoiceOptionPlotId,
    getChoiceOptionById,
    getAmountOfChoiceOptions,
  } = useChoiceOptions();

  const [suggestDeleting, setSuggestDeleting] = useState(false);
  const deleteRef = useRef<HTMLDivElement | null>(null);

  const deleteOption = useDeleteChoiceOption({
    choiceId,
    choiceOptionId,
    episodeId: episodeId || "",
    plotfieldCommandId,
    topologyBlockId: currentTopologyBlockId,
  });

  const buttonDeleteRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (buttonDeleteRef.current) {
      buttonDeleteRef.current.focus();
    }
  }, [suggestDeleting]);

  useOutOfModal({
    modalRef: deleteRef,
    setShowModal: setSuggestDeleting,
    showModal: suggestDeleting,
  });

  const handleUpdatingSessionStorage = () => {
    // 1) changing at the same level
    // 2) changing at different level(may go up or down)

    const currentFocusedCommandChoice = sessionStorage.getItem("focusedCommandChoice")?.split("?").filter(Boolean);
    const currentFocusedChoiceOption = sessionStorage.getItem("focusedChoiceOption")?.split("?").filter(Boolean);
    const currentFocusedCommandInsideType = sessionStorage
      .getItem("focusedCommandInsideType")
      ?.split("?")
      .filter(Boolean);

    const deepLevelChoice = currentFocusedCommandChoice?.includes("none")
      ? null
      : (currentFocusedCommandChoice?.length || 0) > 0
      ? (currentFocusedCommandChoice?.length || 0) - 1
      : null;

    if (typeof deepLevelChoice === "number") {
      // I'm inside some commandChoice
      // it may be somewhere in the back or at the front

      const currentChoiceIndex = currentFocusedCommandChoice?.findIndex((c) => c.includes(plotfieldCommandId)) || null;
      const currentChoiceOptionIndex =
        currentFocusedChoiceOption?.findIndex((c) => c.includes(plotfieldCommandId)) || null;
      const currentFocusedCommandInsideTypeIndex =
        currentFocusedCommandInsideType?.findIndex((c) => c.includes(plotfieldCommandId)) || 0;

      const insideTypeDeepLevel = (currentFocusedCommandInsideType?.length || 1) - 1;

      const newChoiceOption = getChoiceOptionById({ choiceOptionId, choiceId });

      sessionStorage.setItem("focusedTopologyBlock", newChoiceOption?.topologyBlockId || "");
      sessionStorage.setItem("focusedCommand", `choice-${plotfieldCommandId}`);

      if (
        typeof currentChoiceOptionIndex !== "number" ||
        currentChoiceOptionIndex < 0 ||
        typeof currentChoiceIndex !== "number" ||
        currentChoiceIndex < 0
      ) {
        // I assume that I have some level of deepness(basically I'm inside some choice command) but I'm going deeper
        console.log("lol");

        sessionStorage.setItem(
          "focusedCommandChoice",
          `${currentFocusedCommandChoice?.join("?")}?${plotfieldCommandId}-choiceId-${choiceId}?`
        );

        sessionStorage.setItem(
          "focusedChoiceOption",
          `${currentFocusedChoiceOption?.join("?")}?${newChoiceOption?.optionType}-${
            newChoiceOption?.choiceOptionId
          }-plotfieldCommandId-${plotfieldCommandId}?`
        );

        sessionStorage.setItem(
          "focusedCommandInsideType",
          `${currentFocusedCommandInsideType?.join("?")}?${plotfieldCommandId}-choice?`
        );
        return;
      }

      const currentChoice = (currentFocusedCommandChoice || [])[currentChoiceIndex];
      // const currentChoiceOption = (currentFocusedChoiceOption || [])[currentChoiceOptionIndex];

      // const currentInsideType = (currentFocusedCommandInsideType || [])[currentFocusedCommandInsideTypeIndex];

      const currentChoiceSplitted = currentChoice?.split("-");
      // const currentChoiceOptionSplitted = currentChoiceOption?.split("-");

      const currentChoicePlotfieldId = (currentChoiceSplitted || [])[0];

      if (currentChoicePlotfieldId === plotfieldCommandId) {
        // changing option inside the same choice
        (currentFocusedChoiceOption || [])[
          currentChoiceOptionIndex
        ] = `${newChoiceOption?.optionType}-${newChoiceOption?.choiceOptionId}-plotfieldCommandId-${plotfieldCommandId}`;

        sessionStorage.setItem("focusedChoiceOption", `${currentFocusedChoiceOption?.join("?")}?`);
      } else {
        // going up
        const newFocusedChoice = currentFocusedCommandChoice?.splice(0, currentChoiceIndex);
        const newFocusedChoiceOption = currentFocusedChoiceOption?.splice(0, currentChoiceOptionIndex);

        sessionStorage.setItem("focusedCommandChoice", `${newFocusedChoice?.join("?")}?`);
        sessionStorage.setItem("focusedChoiceOption", `${newFocusedChoiceOption?.join("?")}?`);
        if (insideTypeDeepLevel === 0) {
          // at the top level
          sessionStorage.setItem("focusedCommandInsideType", `default?${plotfieldCommandId}-choice?`);
        } else {
          const newFocusedCommandInsideType = currentFocusedCommandInsideType?.splice(
            0,
            currentFocusedCommandInsideTypeIndex
          );
          sessionStorage.setItem("focusedCommandInsideType", `${newFocusedCommandInsideType?.join("?")}?`);
        }
      }
    } else {
      // I assume that user goes deeper in terms of deepness level
      // currently not focused inside choice on any command or choice itself
      // here then I need to update inside component by using useEffect

      const newChoiceOption = getChoiceOptionById({ choiceOptionId, choiceId });

      sessionStorage.setItem("focusedCommand", `choice-${plotfieldCommandId}`);
      sessionStorage.setItem("focusedTopologyBlock", newChoiceOption?.topologyBlockId || "");
      sessionStorage.setItem("focusedCommandChoice", `${plotfieldCommandId}-choiceId-${choiceId}?`);
      sessionStorage.setItem(
        "focusedChoiceOption",
        `${newChoiceOption?.optionType}-${newChoiceOption?.choiceOptionId}-plotfieldCommandId-${plotfieldCommandId}?`
      );
      sessionStorage.setItem("focusedCommandInsideType", `default?${plotfieldCommandId}-choice?`);
    }
  };

  return (
    <div className="relative">
      <button
        onContextMenu={(e) => {
          e.preventDefault();
          setSuggestDeleting(true);
        }}
        onClick={(e) => {
          e.stopPropagation();
          e.currentTarget.blur();
          if (topologyBlockId) {
            updateCurrentlyOpenChoiceOption({
              plotfieldCommandId,
              choiceOptionId,
            });
            handleUpdatingSessionStorage();
          } else {
            console.log("Выберите Топологический Блок");
            // setShowOptionPlot(false);
            // setShowedOptionPlotTopologyBlockId("");
            // setAllChoiceOptionTypesAndTopologyBlockIds([]);
          }
        }}
        className={`${
          topologyBlockId === showedOptionPlotTopologyBlockId ||
          getCurrentlyOpenChoiceOptionPlotId({ choiceId }) === choiceOptionId
            ? "bg-primary-darker text-text-light focus-within:outline-secondary"
            : "bg-secondary"
        } ${
          isFocusedBackground && getCurrentlyOpenChoiceOptionPlotId({ choiceId }) === choiceOptionId
            ? "border-dark-blue border-dashed border-[2px]"
            : ""
        } ${
          !topologyBlockId
            ? "hover:outline-red-200 focus-within:outline-red-200"
            : `focus-within:bg-primary-darker focus-within:text-text-dark`
        } text-[1.5rem] outline-none rounded-md px-[1rem] py-[.5rem] shadow-sm transition-all hover:text-text-light text-text-dark hover:bg-primary-darker `}
      >
        {type}
      </button>

      <aside
        ref={deleteRef}
        className={`${
          suggestDeleting ? "" : "hidden"
        } absolute translate-y-[10%] z-[1001] w-full text-center rounded-md bg-primary text-text-light text-[1.5rem]`}
      >
        <button
          ref={buttonDeleteRef}
          className="hover:bg-primary-darker transition-all w-full rounded-md p-[1rem] outline-light-gray focus-within:border-light-gray focus-within:border-[2px]"
          onClick={() => {
            const amount = getAmountOfChoiceOptions({ choiceId });
            if (amount - 1 === 0) {
              setIsFocusedBackground(false);
              setShowOptionPlot(false);
            }
            setSuggestDeleting(false);
            deleteOption.mutate();
          }}
        >
          Удалить
        </button>
      </aside>
    </div>
  );
}
