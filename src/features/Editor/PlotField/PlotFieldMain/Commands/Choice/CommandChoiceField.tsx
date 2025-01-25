import { useEffect, useState } from "react";
import { ChoiceVariationsTypes } from "../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import useCheckIfShowingPlotfieldInsideChoiceOnMount from "../../../hooks/Choice/helpers/useCheckIfShowingPlotfieldInsideChoiceOnMount";

import { Button } from "@/components/ui/button";
import useGetCommandChoice from "../../../hooks/Choice/useGetCommandChoice";
import useUpdateChoiceIsAuthor from "../../../hooks/Choice/useUpdateChoiceIsAuthor";
import FocusedPlotfieldCommandNameField from "../../components/FocusedPlotfieldCommandNameField";
import ChoiceOptionBlocksList from "./Option/ChoiceOptionBlocksList";
import ChoiceQuestionField from "./QuestionField/ChoiceQuestionField";
import ChoiceVariationTypeBlock from "./VariationTypeBlock/ChoiceVariationTypeBlock";

type CommandChoiceFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
};

export default function CommandChoiceField({ plotFieldCommandId, topologyBlockId }: CommandChoiceFieldTypes) {
  const [timeLimit, setTimeLimit] = useState<number>(0);
  const [exitBlockId, setExitBlockId] = useState("");
  const [commandChoiceId, setCommandChoiceId] = useState("");
  const [amountOfOptions, setAmountOfOptions] = useState<number>();
  const [timeLimitDefaultOptionId, setTimeLimitDefaultOptionId] = useState("");
  const [characterId, setCharacterId] = useState("");
  const [isAuthor, setIsAuthor] = useState<boolean>();
  const [choiceVariationTypes, setChoiceVariationTypes] = useState<ChoiceVariationsTypes>("" as ChoiceVariationsTypes);

  const { data: commandChoice } = useGetCommandChoice({
    plotFieldCommandId,
  });

  const [isFocusedBackground, setIsFocusedBackground] = useState(false);
  const [showOptionPlot, setShowOptionPlot] = useState(false);

  // TODO ubrat
  useCheckIfShowingPlotfieldInsideChoiceOnMount({
    plotFieldCommandId: plotFieldCommandId,
    setIsFocusedBackground,
    setShowChoiceBlockPlot: setShowOptionPlot,
  });

  useEffect(() => {
    if (commandChoice) {
      setCommandChoiceId(commandChoice._id);
      if (commandChoice.timeLimit) {
        setTimeLimit(commandChoice.timeLimit);
      }
      if (commandChoice.exitBlockId) {
        setExitBlockId(commandChoice.exitBlockId);
      }
      if (commandChoice.choiceType) {
        setChoiceVariationTypes(commandChoice.choiceType);
      }
      if (commandChoice.characterId) {
        setCharacterId(commandChoice.characterId);
      }
      if (commandChoice.timeLimitDefaultOptionId) {
        setTimeLimitDefaultOptionId(commandChoice.timeLimitDefaultOptionId);
      }
      setAmountOfOptions(commandChoice.amountOfOptions);
      setIsAuthor(commandChoice.isAuthor);
    }
  }, [commandChoice]);

  return (
    <div className="flex gap-[5px] w-full flex-wrap rounded-md flex-col sm:items-start">
      <div className="flex gap-[5px] w-full flex-wrap">
        <FocusedPlotfieldCommandNameField nameValue={"choice"} plotFieldCommandId={plotFieldCommandId} />

        <div className="flex-grow">
          <ChoiceVariationTypeBlock
            choiceVariationTypes={choiceVariationTypes}
            setChoiceVariationTypes={setChoiceVariationTypes}
            setExitBlockId={setExitBlockId}
            setTimeLimit={setTimeLimit}
            choiceId={commandChoiceId}
            exitBlockId={exitBlockId}
            timeLimit={timeLimit}
            amountOfOptions={amountOfOptions || 0}
            timeLimitDefaultOptionId={timeLimitDefaultOptionId}
            insidePlotfield={true}
          />
        </div>
      </div>
      <UpdateIsAuthorButton commandChoiceId={commandChoiceId} isAuthor={isAuthor} setIsAuthor={setIsAuthor} />

      <ChoiceQuestionField
        setCharacterId={setCharacterId}
        textStyle={commandChoice?.textStyle || "default"}
        topologyBlockId={topologyBlockId}
        plotFieldCommandId={plotFieldCommandId}
        characterEmotionId={commandChoice?.characterEmotionId || ""}
        characterId={characterId}
        isAuthor={isAuthor || false}
        choiceId={commandChoice?._id || ""}
      />

      {commandChoiceId ? (
        <ChoiceOptionBlocksList
          choiceId={commandChoiceId}
          amountOfOptions={amountOfOptions || 0}
          plotFieldCommandId={plotFieldCommandId}
          currentTopologyBlockId={topologyBlockId}
          setShowOptionPlot={setShowOptionPlot}
          setIsFocusedBackground={setIsFocusedBackground}
          showOptionPlot={showOptionPlot}
          isFocusedBackground={isFocusedBackground}
        />
      ) : null}
    </div>
  );
}

type UpdateIsAuthorButtonTypes = {
  commandChoiceId: string;
  isAuthor: boolean | undefined;
  setIsAuthor: React.Dispatch<React.SetStateAction<boolean | undefined>>;
};

function UpdateIsAuthorButton({ commandChoiceId, isAuthor, setIsAuthor }: UpdateIsAuthorButtonTypes) {
  const updateChoiceIsAuthor = useUpdateChoiceIsAuthor({
    choiceId: commandChoiceId,
  });

  const [disabledBtn, setDisabledBtn] = useState(false);

  useEffect(() => {
    if (updateChoiceIsAuthor.isSuccess) {
      setDisabledBtn(false);
    }
  }, [updateChoiceIsAuthor]);
  return (
    <Button
      onClick={() => {
        setIsAuthor((prev) => !prev);
        setDisabledBtn(true);
        updateChoiceIsAuthor.mutate({ isAuthor: !isAuthor });
      }}
      disabled={disabledBtn}
      className={`rounded-md ${isAuthor ? `bg-green` : "bg-accent"} ${
        disabledBtn ? "cursor-not-allowed" : ""
      } text-text shadow-md w-full px-[10px] py-[5px] hover:opacity-80 focus-within:opacity-80 active:scale-[.99] transition-all`}
    >
      Автор
    </Button>
  );
}
