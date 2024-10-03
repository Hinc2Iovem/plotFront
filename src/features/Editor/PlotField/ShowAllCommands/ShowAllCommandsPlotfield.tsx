import { useEffect, useRef, useState } from "react";
import { PossibleCommandsCreatedByCombinationOfKeysTypes } from "../../../../const/COMMANDS_CREATED_BY_KEY_COMBINATION";
import { AllPossiblePlotFieldCommandsWithSayVariations } from "../../../../const/PLOTFIELD_COMMANDS";
import useEscapeOfModal from "../../../../hooks/UI/useEscapeOfModal";
import {
  ChoiceOptionVariationsTypes,
  ChoiceVariationsTypes,
} from "../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import ButtonCreateCommands from "./ButtonCreateCommands";
import CreatingCommandViaButtonClick from "./CreatingCommandViaButtonClick";
import CreatingMultipleCommands from "./CreatingMultipleCommands";
import ChoiceDefaultSettings from "./Default/Choice/ChoiceDefaultSettings";
import WaitDefaultSettings from "./Default/Wait/WaitDefaultSettings";

type ShowAllCommandsPlotfieldTypes = {
  showAllCommands: boolean;
  topologyBlockId: string;
  plotfieldExpanded: boolean;
  command: PossibleCommandsCreatedByCombinationOfKeysTypes;
  setShowAllCommands: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ShowAllCommandsPlotfield({
  setShowAllCommands,
  showAllCommands,
  topologyBlockId,
  plotfieldExpanded,
  command,
}: ShowAllCommandsPlotfieldTypes) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [halfSizeOfContainer, setHalfSizeOfContainer] = useState(0);

  const [allCommandsToCreate, setAllCommandsToCreate] = useState<string[]>([]);
  const [showDefaultSettings, setShowDefaultSettings] = useState({
    wait: false,
    choice: false,
  });
  const [time, setTime] = useState<string | null>(null);

  const [optionVariations, setOptionVariations] = useState<
    ChoiceOptionVariationsTypes[]
  >([]);
  const [choiceType, setChoiceType] = useState<ChoiceVariationsTypes>(
    "" as ChoiceVariationsTypes
  );

  useEffect(() => {
    const updateHalfSize = () => {
      if (containerRef.current) {
        setHalfSizeOfContainer(containerRef.current.offsetWidth / 2);
      }
    };

    updateHalfSize();

    window.addEventListener("resize", updateHalfSize);

    return () => {
      window.removeEventListener("resize", updateHalfSize);
    };
  }, [command, showAllCommands]);

  useEscapeOfModal({
    setValue: setShowAllCommands,
    value: showAllCommands,
  });

  return (
    <div
      ref={containerRef}
      className={`${
        showAllCommands ? "" : "hidden"
      } h-full w-full transition-all p-[1rem] overflow-y-auto | containerScroll`}
    >
      <div className="flex flex-col gap-[1rem] relative">
        {AllPossiblePlotFieldCommandsWithSayVariations.map((pc) => (
          <div
            key={pc}
            className="flex justify-between gap-[1rem] w-full items-center flex-wrap"
          >
            <div className="flex gap-[.5rem] items-center shadow-md px-[1rem] py-[.5rem] rounded-md">
              {/* TODO here will be an image which represents each command */}
              <CreatingCommandViaButtonClick
                pc={pc}
                topologyBlockId={topologyBlockId}
                setShowAllCommands={setShowAllCommands}
              />
              <CreatingMultipleCommands
                pc={pc}
                setTime={setTime}
                allCommandsToCreate={allCommandsToCreate}
                setShowDefaultSettings={setShowDefaultSettings}
                setAllCommandsToCreate={setAllCommandsToCreate}
              />
            </div>
            {/* Default */}
            <WaitDefaultSettings
              showWait={showDefaultSettings.wait && pc === "wait"}
              setTime={setTime}
              time={time}
            />
            <ChoiceDefaultSettings
              setOptionVariations={setOptionVariations}
              setChoiceType={setChoiceType}
              optionVariations={optionVariations}
              choiceType={choiceType}
              showChoice={showDefaultSettings.choice && pc === "choice"}
            />
            {/* Default */}
          </div>
        ))}
        <ButtonCreateCommands
          setShowAllCommands={setShowAllCommands}
          choiceType={choiceType}
          plotfieldExpanded={plotfieldExpanded}
          halfSizeOfContainer={halfSizeOfContainer}
          topologyBlockId={topologyBlockId}
          optionVariations={optionVariations}
          allCommandsToCreate={allCommandsToCreate}
          setAllCommandsToCreate={setAllCommandsToCreate}
          time={time}
        />
      </div>
    </div>
  );
}
