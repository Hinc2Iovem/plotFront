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
  const [showChoiceMultipleModal, setShowChoiceMultipleModal] = useState(false);
  const [showChoiceDefaultTimeLimitBlockModal, setShowChoiceDefaultTimeLimitBlockModal] = useState(false);

  const [showChoiceVariationTypesModal, setShowChoiceVariationTypesModal] = useState(false);

  return (
    <>
      <ChoiceChooseVariationType
        choiceId={choiceId}
        choiceVariationTypes={choiceVariationTypes}
        setChoiceVariationTypes={setChoiceVariationTypes}
        setShowChoiceMultipleModal={setShowChoiceMultipleModal}
        setShowChoiceVariationTypesModal={setShowChoiceVariationTypesModal}
        showChoiceVariationTypesModal={showChoiceVariationTypesModal}
      />

      <form
        className={`${
          choiceVariationTypes === "common" || !choiceVariationTypes?.trim().length ? "hidden" : ""
        } flex-grow shadow-md bg-primary rounded-md relative`}
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
          setShowChoiceMultipleModal={setShowChoiceMultipleModal}
          setShowChoiceVariationTypesModal={setShowChoiceVariationTypesModal}
          showChoiceMultipleModal={showChoiceMultipleModal}
        />
      </form>
    </>
  );
}
