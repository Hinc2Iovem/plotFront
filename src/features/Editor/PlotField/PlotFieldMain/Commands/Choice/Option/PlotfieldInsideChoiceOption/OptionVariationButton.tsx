import { Button } from "@/components/ui/button";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { useParams } from "react-router-dom";
import useDeleteChoiceOption from "../../../../../hooks/Choice/ChoiceOption/useDeleteChoiceOption";
import useChoiceOptions from "../../Context/ChoiceContext";
import { ChoiceOptionTypesAndTopologyBlockIdsTypes } from "../ChoiceOptionBlocksList";

type OptionVariationButtonTypes = {
  showedOptionPlotTopologyBlockId: string;
  plotfieldCommandId: string;
  isFocusedBackground: boolean;
  choiceId: string;
  currentTopologyBlockId: string;
  setShowOptionPlot: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFocusedBackground: React.Dispatch<React.SetStateAction<boolean>>;
} & ChoiceOptionTypesAndTopologyBlockIdsTypes;

export default function OptionVariationButton({
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

  const updateCurrentlyOpenChoiceOption = useChoiceOptions((state) => state.updateCurrentlyOpenChoiceOption);
  const getCurrentlyOpenChoiceOptionPlotId = useChoiceOptions((state) => state.getCurrentlyOpenChoiceOptionPlotId);
  const getAmountOfChoiceOptions = useChoiceOptions((state) => state.getAmountOfChoiceOptions);

  const deleteOption = useDeleteChoiceOption({
    choiceId,
    choiceOptionId,
    episodeId: episodeId || "",
    plotfieldCommandId,
    topologyBlockId: currentTopologyBlockId,
  });

  const handleUpdatingSessionStorage = () => {
    // TODO deleted some shit here, need to remake functionality for focus
    // 1) changing at the same level
    // 2) changing at different level(may go up or down)
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Button
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
            getCurrentlyOpenChoiceOptionPlotId({ plotfieldCommandId }) === choiceOptionId
              ? "bg-accent scale-[1.05]"
              : "bg-secondary"
          } ${
            isFocusedBackground && getCurrentlyOpenChoiceOptionPlotId({ plotfieldCommandId }) === choiceOptionId
              ? "bg-cyan"
              : ""
          } text-[17px] outline-none rounded-md px-[10px] py-[5px] shadow-sm transition-all text-text hover:bg-accent hover:scale-[1.02]`}
        >
          {type}
        </Button>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => {
            const amount = getAmountOfChoiceOptions({ plotfieldCommandId });
            if (amount - 1 === 0) {
              setIsFocusedBackground(false);
              setShowOptionPlot(false);
            }
            deleteOption.mutate();
          }}
        >
          Удалить
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
