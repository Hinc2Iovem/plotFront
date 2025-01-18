import { useState } from "react";
import { ChoiceVariationsTypes } from "../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import ChoiceChooseVariationType from "./ChoiceChooseVariationType";
import ChoiceMultipleBlock from "./ChoiceMultipleBlock";
import ChoiceTimeLimitBlock from "./ChoiceTimeLimitBlock";

type ChoiceVariationTypeBlockTypes = {
  exitBlockId: string;
  choiceId: string;
  timeLimit: number;
  choiceVariationTypes: ChoiceVariationsTypes;
  setExitBlockId: React.Dispatch<React.SetStateAction<string>>;
  setTimeLimit: React.Dispatch<React.SetStateAction<number>>;
  setChoiceVariationTypes: React.Dispatch<React.SetStateAction<ChoiceVariationsTypes>>;
  timeLimitDefaultOptionId: string;
  amountOfOptions: number;
  insidePlotfield?: boolean;
};

export default function ChoiceVariationTypeBlock({
  exitBlockId,
  choiceId,
  setExitBlockId,
  timeLimit,
  setTimeLimit,
  choiceVariationTypes,
  setChoiceVariationTypes,
  amountOfOptions,
  timeLimitDefaultOptionId,
  insidePlotfield = false,
}: ChoiceVariationTypeBlockTypes) {
  const [showChoiceDefaultTimeLimitBlockModal, setShowChoiceDefaultTimeLimitBlockModal] = useState(false);

  const [, setShowChoiceVariationTypesModal] = useState(false);

  return (
    <div className="flex gap-[5px] min-w-[300px] flex-wrap">
      <ChoiceChooseVariationType
        choiceId={choiceId}
        choiceVariationTypes={choiceVariationTypes}
        setChoiceVariationTypes={setChoiceVariationTypes}
      />

      <form
        className={`${
          choiceVariationTypes === "common" || !choiceVariationTypes?.trim().length ? "hidden" : ""
        } flex-grow shadow-md rounded-md relative`}
        onSubmit={(e) => e.preventDefault()}
      >
        <ChoiceTimeLimitBlock
          choiceId={choiceId}
          choiceVariationTypes={choiceVariationTypes}
          setShowChoiceDefaultTimeLimitBlockModal={setShowChoiceDefaultTimeLimitBlockModal}
          setShowChoiceVariationTypesModal={setShowChoiceVariationTypesModal}
          showChoiceDefaultTimeLimitBlockModal={showChoiceDefaultTimeLimitBlockModal}
          insidePlotfield={insidePlotfield}
          setTimeLimit={setTimeLimit}
          timeLimit={timeLimit}
          amountOfOptions={amountOfOptions}
          timeLimitDefaultOptionId={timeLimitDefaultOptionId}
        />

        <ChoiceMultipleBlock
          choiceId={choiceId}
          choiceVariationTypes={choiceVariationTypes}
          exitBlockId={exitBlockId}
          setExitBlockId={setExitBlockId}
        />
      </form>
    </div>
  );
}
