import { useEffect, useState } from "react";
import { ChoiceVariationsTypes } from "../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import useGetCommandChoice from "../hooks/Choice/useGetCommandChoice";
import useUpdateChoiceIsAuthor from "../hooks/Choice/useUpdateChoiceIsAuthor";
import ChoiceQuestionField from "./ChoiceQuestionField";
import ChoiceVariationTypeBlock from "./ChoiceVariationTypeBlock";
import ChoiceOptionBlocksList from "./Option/ChoiceOptionBlocksList";

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
  const [showCopyCursor, setShowCopyCursor] = useState(false);

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

  // const createChoiceDuplicate = useCreateChoice({
  //   plotFieldCommandId,
  //   topologyBlockId,
  // });
  // const fillChoiceDuplicateWithData = useUpdateChoice({
  //   choiceId: commandChoiceId,
  // });

  return (
    <div
      onMouseMoveCapture={(e) => {
        if (e.ctrlKey) {
          setShowCopyCursor(true);
        } else {
          setShowCopyCursor(false);
        }
      }}
      onClick={() => {
        // if (showCopyCursor) {
        //   handleCopyingCommand();
        // }
      }}
      onMouseLeave={() => {
        setShowCopyCursor(false);
      }}
      className="flex gap-[1rem] w-full flex-wrap bg-primary-light-blue rounded-md p-[.5rem] sm:flex-row flex-col sm:items-center"
      style={{ cursor: showCopyCursor ? "cell" : "" }}
    >
      <div className="sm:w-[20%] min-w-[10rem] flex-grow w-full relative">
        <h3 className="text-[1.3rem] text-start outline-gray-300 w-full capitalize px-[1rem] py-[.5rem] rounded-md shadow-md bg-white cursor-default">
          {nameValue}
        </h3>
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
      />

      <button
        onClick={() => {
          setIsAuthor((prev) => !prev);
          setDisabledBtn(true);
          updateChoiceIsAuthor.mutate({ isAuthor: !isAuthor });
        }}
        disabled={disabledBtn}
        className={`rounded-md ${
          isAuthor ? "text-white bg-green-300" : "bg-white text-gray-700"
        } ${
          disabledBtn ? "cursor-not-allowed" : ""
        } flex-grow shadow-md text-[1.3rem] px-[1rem] py-[.5rem] outline-gray-300`}
      >
        Автор
      </button>
      <ChoiceQuestionField
        topologyBlockId={topologyBlockId}
        plotFieldCommandId={plotFieldCommandId}
        characterEmotionId={commandChoice?.characterEmotionId || ""}
        characterId={characterId}
        setCharacterId={setCharacterId}
        isAuthor={isAuthor || false}
        choiceId={commandChoice?._id || ""}
      />

      <ChoiceOptionBlocksList
        choiceId={commandChoiceId}
        amountOfOptions={amountOfOptions || 0}
        plotFieldCommandId={plotFieldCommandId}
        currentTopologyBlockId={topologyBlockId}
      />
    </div>
  );
}
