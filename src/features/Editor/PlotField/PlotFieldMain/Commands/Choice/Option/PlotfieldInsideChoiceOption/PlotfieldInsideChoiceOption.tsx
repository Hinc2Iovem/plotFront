import { useEffect, useState } from "react";
import PlotFieldMain from "../../../../PlotFieldMain";
import { ChoiceOptionTypesAndTopologyBlockIdsTypes } from "../ChoiceOptionBlocksList";
import ButtonHoverPromptModal from "../../../../../../../shared/ButtonAsideHoverPromptModal/ButtonHoverPromptModal";
import command from "../../../../../../../../assets/images/Editor/command.png";
import plus from "../../../../../../../../assets/images/shared/add.png";
import useCreateBlankCommand from "../../../hooks/useCreateBlankCommand";
import { generateMongoObjectId } from "../../../../../../../../utils/generateMongoObjectId";
import useGetTopologyBlockById from "../../../hooks/TopologyBlock/useGetTopologyBlockById";
import ChoiceOptionInputField from "./ChoiceOptionInputField";

type PlotfieldInsideChoiceOptionTypes = {
  showedOptionPlotTopologyBlockId: string;
  allChoiceOptionTypesAndTopologyBlockIds: ChoiceOptionTypesAndTopologyBlockIdsTypes[];
  showOptionPlot: boolean;
  choiceId: string;
  plotFieldCommandId: string;
  setShowedOptionPlotTopologyBlockId: React.Dispatch<
    React.SetStateAction<string>
  >;
  setShowOptionPlot: React.Dispatch<React.SetStateAction<boolean>>;
  setAllChoiceOptionTypesAndTopologyBlockIds: React.Dispatch<
    React.SetStateAction<ChoiceOptionTypesAndTopologyBlockIdsTypes[]>
  >;
};

export default function PlotfieldInsideChoiceOption({
  showedOptionPlotTopologyBlockId,
  allChoiceOptionTypesAndTopologyBlockIds,
  showOptionPlot,
  choiceId,
  plotFieldCommandId,
  setShowedOptionPlotTopologyBlockId,
  setShowOptionPlot,
}: PlotfieldInsideChoiceOptionTypes) {
  const { data: topologyBlock } = useGetTopologyBlockById({
    topologyBlockId: showedOptionPlotTopologyBlockId,
  });
  // const [showMessage, setShowMessage] = useState("");
  const [showAllCommands, setShowAllCommands] = useState(false);
  console.log(showAllCommands);

  const [currentAmountOfCommands, setCurrentAmountOfCommands] =
    useState<number>(0);

  useEffect(() => {
    if (topologyBlock) {
      setCurrentAmountOfCommands(
        topologyBlock.topologyBlockInfo?.amountOfCommands || 0
      );
    }
  }, [topologyBlock]);

  const createCommand = useCreateBlankCommand({
    topologyBlockId: showedOptionPlotTopologyBlockId,
  });

  const handleCreateCommand = () => {
    const _id = generateMongoObjectId();
    createCommand.mutate({
      _id,
      commandOrder: currentAmountOfCommands,
      topologyBlockId: showedOptionPlotTopologyBlockId,
    });
    setCurrentAmountOfCommands((prev) => prev + 1);
    if (createCommand.isError) {
      setCurrentAmountOfCommands((prev) => prev - 1);
    }
  };

  return (
    <section
      className={`${
        showOptionPlot ? "" : "hidden"
      } flex flex-col gap-[1rem] relative`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowOptionPlot(false);
          setShowedOptionPlotTopologyBlockId("");
          // setAllChoiceOptionTypesAndTopologyBlockIds([]);
        }}
        className="w-[2.5rem] h-[1rem] bg-white rounded-md shadow-sm absolute right-[-.3rem] top-[-.3rem] hover:shadow-md transition-shadow"
      ></button>
      <form onSubmit={(e) => e.preventDefault()}>
        {allChoiceOptionTypesAndTopologyBlockIds.map((op, i) => (
          <ChoiceOptionInputField
            key={
              "optionValueInput-" + op.topologyBlockId + "-" + op.type + "-" + i
            }
            option={op.option || ""}
            topologyBlockId={op.topologyBlockId || ""}
            type={op.type}
            choiceOptionId={op.choiceOptionId}
            choiceId={choiceId}
            plotFieldCommandId={plotFieldCommandId}
            currentTopologyBlockId={showedOptionPlotTopologyBlockId}
          />
        ))}
      </form>
      <header className="w-full flex gap-[.5rem] relative px-[1rem] py-[.9rem] flex-wrap">
        {allChoiceOptionTypesAndTopologyBlockIds.map((op, i) => (
          <OptionVariationButton
            key={op.topologyBlockId + "-" + op.type + "-" + i}
            setShowedOptionPlotTopologyBlockId={
              setShowedOptionPlotTopologyBlockId
            }
            showedOptionPlotTopologyBlockId={showedOptionPlotTopologyBlockId}
            {...op}
          />
        ))}
      </header>

      <main className="flex flex-col gap-[.5rem] w-full">
        <div className="flex w-full bg-white rounded-md shadow-sm itesm-center  px-[1rem] py-[.5rem]">
          <div className="flex gap-[1rem]">
            <ButtonHoverPromptModal
              onClick={() => setShowAllCommands(true)}
              contentName="Все команды"
              positionByAbscissa="left"
              asideClasses="text-[1.3rem] top-[3.5rem] bottom-[-3.5rem]"
              className="bg-primary-pastel-blue shadow-sm shadow-gray-400 active:scale-[.99]"
              variant="rectangle"
            >
              <img src={command} alt="Commands" className="w-[3rem]" />
            </ButtonHoverPromptModal>
            <ButtonHoverPromptModal
              contentName="Создать строку"
              positionByAbscissa="left"
              className="bg-primary-light-blue shadow-sm shadow-gray-400 active:scale-[.99] relative "
              asideClasses="text-[1.3rem] top-[3.5rem] bottom-[-3.5rem]"
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
          topologyBlockId={showedOptionPlotTopologyBlockId}
        />
      </main>
    </section>
  );
}

type OptionVariationButtonTypes = {
  setShowedOptionPlotTopologyBlockId: React.Dispatch<
    React.SetStateAction<string>
  >;
  showedOptionPlotTopologyBlockId: string;
} & ChoiceOptionTypesAndTopologyBlockIdsTypes;

function OptionVariationButton({
  setShowedOptionPlotTopologyBlockId,
  showedOptionPlotTopologyBlockId,
  type,
  topologyBlockId,
}: OptionVariationButtonTypes) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (topologyBlockId) {
          setShowedOptionPlotTopologyBlockId(topologyBlockId);
        } else {
          console.log("Выберите Топологический Блок");
          // setShowOptionPlot(false);
          // setShowedOptionPlotTopologyBlockId("");
          // setAllChoiceOptionTypesAndTopologyBlockIds([]);
        }
      }}
      className={`${
        topologyBlockId === showedOptionPlotTopologyBlockId
          ? "bg-primary-pastel-blue text-white focus-within:outline-white"
          : "bg-white"
      } ${
        !topologyBlockId
          ? "hover:outline-red-200 focus-within:outline-red-200"
          : "focus-within:bg-primary-pastel-blue focus-within:text-white"
      } text-[1.5rem] outline-none rounded-md px-[1rem] py-[.5rem] shadow-sm transition-all hover:bg-primary-pastel-blue hover:text-white `}
    >
      {type}
    </button>
  );
}
