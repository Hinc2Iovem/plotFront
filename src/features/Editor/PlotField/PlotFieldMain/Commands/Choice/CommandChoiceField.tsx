import { useEffect, useState } from "react";
import useCheckIsCurrentFieldFocused from "../../../../../../hooks/helpers/Plotfield/useCheckIsCurrentFieldFocused";
import { ChoiceVariationsTypes } from "../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import PlotfieldCommandNameField from "../../../../../shared/Texts/PlotfieldCommandNameField";
import useCheckIfShowingPlotfieldInsideChoiceOnMount from "../../../hooks/Choice/helpers/useCheckIfShowingPlotfieldInsideChoiceOnMount";
import useGoingDownInsideChoiceOption from "../../../hooks/Choice/helpers/useGoingDownInsideChoiceOption";
import useGetCommandChoice from "../../../hooks/Choice/useGetCommandChoice";
import useUpdateChoiceIsAuthor from "../../../hooks/Choice/useUpdateChoiceIsAuthor";
import ChoiceQuestionField from "./ChoiceQuestionField";
import ChoiceVariationTypeBlock from "./ChoiceVariationTypeBlock";
import ChoiceOptionBlocksList from "./Option/ChoiceOptionBlocksList";
import useHandleNavigationThroughOptionsInsideChoice from "../../../hooks/Choice/helpers/useHandleNavigationThroughOptionsInsideChoice";
import useGoingUpFromChoiceOptions from "../../../hooks/Choice/helpers/useGoingUpFromChoiceOption";

type CommandChoiceFieldTypes = {
  plotFieldCommandId: string;
  command: string;
  topologyBlockId: string;
};

export default function CommandChoiceField({
  plotFieldCommandId,
  command,
  topologyBlockId,
}: CommandChoiceFieldTypes) {
  const [timeLimit, setTimeLimit] = useState<number>(0);
  const [exitBlockId, setExitBlockId] = useState("");
  const theme = localStorage.getItem("theme");
  const [nameValue] = useState<string>(command ?? "Choice");
  const [commandChoiceId, setCommandChoiceId] = useState("");
  const [amountOfOptions, setAmountOfOptions] = useState<number>();
  const [timeLimitDefaultOptionId, setTimeLimitDefaultOptionId] = useState("");
  const [characterId, setCharacterId] = useState("");
  const [isAuthor, setIsAuthor] = useState<boolean>();
  const [choiceVariationTypes, setChoiceVariationTypes] =
    useState<ChoiceVariationsTypes>("" as ChoiceVariationsTypes);
  const { data: commandChoice } = useGetCommandChoice({
    plotFieldCommandId,
  });

  const [isFocusedBackground, setIsFocusedBackground] = useState(false);
  const [showOptionPlot, setShowOptionPlot] = useState(false);
  const isCommandFocused = useCheckIsCurrentFieldFocused({
    plotFieldCommandId,
  });

  useCheckIfShowingPlotfieldInsideChoiceOnMount({
    plotFieldCommandId: plotFieldCommandId,
    setIsFocusedBackground,
    setShowChoiceBlockPlot: setShowOptionPlot,
  });

  useGoingDownInsideChoiceOption({
    choiceId: commandChoiceId,
    plotfieldCommandId: plotFieldCommandId,
    setIsFocusedBackground,
    setShowChoiceOptionPlot: setShowOptionPlot,
  });

  useGoingUpFromChoiceOptions({
    choiceId: commandChoiceId,
    plotfieldCommandId: plotFieldCommandId,
    setIsFocusedBackground,
    setShowChoiceOptionPlot: setShowOptionPlot,
  });

  useHandleNavigationThroughOptionsInsideChoice({
    plotfieldCommandId: plotFieldCommandId,
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
    <div className="flex gap-[1rem] w-full flex-wrap bg-primary-darker rounded-md p-[.5rem] sm:flex-row flex-col sm:items-start">
      <div className="sm:w-[20%] min-w-[10rem] flex-grow w-full relative">
        <PlotfieldCommandNameField
          className={`${
            isCommandFocused ? "bg-dark-dark-blue" : "bg-secondary"
          }`}
        >
          {nameValue}
        </PlotfieldCommandNameField>
      </div>

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

      <button
        onClick={() => {
          setIsAuthor((prev) => !prev);
          setDisabledBtn(true);
          updateChoiceIsAuthor.mutate({ isAuthor: !isAuthor });
        }}
        disabled={disabledBtn}
        className={`rounded-md ${
          isAuthor
            ? `${
                theme === "light" ? "bg-green-300" : "bg-green-400"
              } text-text-dark`
            : "bg-secondary text-gray-700"
        } ${disabledBtn ? "cursor-not-allowed" : ""} ${
          theme === "light" ? "outline-gray-300" : "outline-gray-600"
        } text-text-light flex-grow shadow-md text-[1.3rem] px-[1rem] py-[.5rem] outline-gray-300`}
      >
        Автор
      </button>

      <ChoiceQuestionField
        textStyle={commandChoice?.textStyle || "default"}
        topologyBlockId={topologyBlockId}
        plotFieldCommandId={plotFieldCommandId}
        characterEmotionId={commandChoice?.characterEmotionId || ""}
        characterId={characterId}
        setCharacterId={setCharacterId}
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
