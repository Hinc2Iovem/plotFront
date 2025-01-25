import useUpdateChoiceOptionTranslationText from "@/features/Editor/PlotField/hooks/Choice/ChoiceOption/useUpdateChoiceOptionTranslationText";
import { ChoiceOptionVariationsTypes } from "@/types/StoryEditor/PlotField/Choice/ChoiceTypes";
import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import { useState } from "react";
import useChoiceOptions from "../../Context/ChoiceContext";
import common from "@/assets/images/Editor/blank.png";
import premium from "@/assets/images/Editor/amethyst.png";
import relationship from "@/assets/images/Editor/relationship.png";
import characteristic from "@/assets/images/Story/characteristic.png";

type ChoiceOptionAnswerInputTypes = {
  choiceOptionId: string;
  optionType: ChoiceOptionVariationsTypes;
  plotFieldCommandId: string;
  choiceId: string;
};

export default function ChoiceOptionAnswerInput({
  choiceId,
  choiceOptionId,
  optionType,
  plotFieldCommandId,
}: ChoiceOptionAnswerInputTypes) {
  const { getChoiceOptionText, updateChoiceOptionText } = useChoiceOptions();

  const [answer, setAnswer] = useState(getChoiceOptionText({ choiceId, choiceOptionId }) || "");

  const updateOptionTextTranslation = useUpdateChoiceOptionTranslationText({
    choiceOptionId,
    option: answer,
    type: optionType,
    choiceId: plotFieldCommandId,
    language: "russian",
  });

  const onBlur = () => {
    updateChoiceOptionText({
      choiceId,
      id: choiceOptionId,
      optionText: answer,
    });
    updateOptionTextTranslation.mutate();
  };

  return (
    <div className="relative">
      <PlotfieldInput
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onBlur={onBlur}
        placeholder="Ответ"
        className={`w-full text-[13px] text-text rounded-md shadow-md bg-secondary px-[10px] pr-[35px]`}
      />

      <img
        src={
          optionType === "common"
            ? common
            : optionType === "premium"
            ? premium
            : optionType === "characteristic"
            ? characteristic
            : relationship
        }
        alt="variation"
        className={`${
          optionType === "common" ? "bg-accent rounded-md" : ""
        } absolute right-[3px] top-1/2 -translate-y-1/2 w-[30px]`}
      />
    </div>
  );
}
