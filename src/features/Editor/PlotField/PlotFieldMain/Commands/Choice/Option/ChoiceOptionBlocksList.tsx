import { useEffect, useState } from "react";
import { ChoiceOptionVariationsTypes } from "../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import useGetAllChoiceOptionsByChoiceId from "../../../../hooks/Choice/ChoiceOption/useGetChoiceAllChoiceOptionsByChoiceId";
import useChoiceOptions from "../Context/ChoiceContext";
import ChoiceOptionBlock from "./OptionBlock/ChoiceOptionBlock";
import PlotfieldInsideChoiceOption from "./PlotfieldInsideChoiceOption/PlotfieldInsideChoiceOption";
import useUpdateCurrentlyOpenChoiceOptionOnMount from "../../../../hooks/Choice/helpers/useUpdateCurrentlyOpenChoiceOptionOnMount";

type ChoiceOptionBlockTypes = {
  currentTopologyBlockId: string;
  plotFieldCommandId: string;
  amountOfOptions: number;
  choiceId: string;
  showOptionPlot: boolean;
  isFocusedBackground: boolean;
  setShowOptionPlot: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFocusedBackground: React.Dispatch<React.SetStateAction<boolean>>;
};

export type ChoiceOptionTypesAndTopologyBlockIdsTypes = {
  topologyBlockId?: string;
  type: ChoiceOptionVariationsTypes;
  option?: string;
  choiceOptionId: string;
};

export default function ChoiceOptionBlocksList({
  currentTopologyBlockId,
  plotFieldCommandId,
  amountOfOptions,
  choiceId,
  showOptionPlot,
  isFocusedBackground,
  setShowOptionPlot,
  setIsFocusedBackground,
}: ChoiceOptionBlockTypes) {
  const { setChoiceOptions, getAllChoiceOptionsByPlotfieldCommandId } = useChoiceOptions();
  const [updated, setUpdated] = useState(false);

  const { data: allChoiceOptionBlocks } = useGetAllChoiceOptionsByChoiceId({
    plotFieldCommandChoiceId: plotFieldCommandId,
    language: "russian",
  });

  useEffect(() => {
    if (allChoiceOptionBlocks) {
      setChoiceOptions({
        choiceId,
        choiceOptions: allChoiceOptionBlocks,
        plotfieldCommandId: plotFieldCommandId,
      });

      return () => {
        setUpdated(true);
      };
    }
  }, [allChoiceOptionBlocks]);

  useUpdateCurrentlyOpenChoiceOptionOnMount({
    choiceOptions: allChoiceOptionBlocks,
    plotFieldCommandId,
  });

  return (
    <>
      <div className={`${showOptionPlot ? "bg-secondary w-full h-[15px] rounded-md" : ""}`}></div>
      <section
        className={`w-full ${
          showOptionPlot || isFocusedBackground
            ? ""
            : "grid grid-cols-[repeat(auto-fill,minmax(295px,1fr))] gap-[10px] items-center"
        } bg-primary rounded-md shadow-md `}
      >
        <PlotfieldInsideChoiceOption
          choiceId={choiceId}
          showOptionPlot={showOptionPlot}
          plotfieldCommandId={plotFieldCommandId}
          setShowOptionPlot={setShowOptionPlot}
          setIsFocusedBackground={setIsFocusedBackground}
          isFocusedBackground={isFocusedBackground}
          currentTopologyBlockId={currentTopologyBlockId}
        />

        {getAllChoiceOptionsByPlotfieldCommandId({ plotfieldCommandId: plotFieldCommandId })?.map((co) => (
          <ChoiceOptionBlock
            key={co.choiceOptionId}
            isFocusedBackground={isFocusedBackground}
            showOptionPlot={showOptionPlot}
            choiceId={choiceId}
            plotFieldCommandId={plotFieldCommandId}
            currentTopologyBlockId={currentTopologyBlockId}
            amountOfOptions={amountOfOptions}
            setShowOptionPlot={setShowOptionPlot}
            updated={updated}
            {...co}
          />
        ))}
      </section>
    </>
  );
}
