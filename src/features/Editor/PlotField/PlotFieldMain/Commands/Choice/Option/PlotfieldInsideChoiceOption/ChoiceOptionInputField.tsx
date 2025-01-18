import PlotfieldInput from "@/ui/Inputs/PlotfieldInput";
import React, { useEffect } from "react";
import useDebounce from "../../../../../../../../hooks/utilities/useDebounce";
import { ChoiceOptionVariationsTypes } from "../../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import useUpdateChoiceOptionTranslationText from "../../../../../hooks/Choice/ChoiceOption/useUpdateChoiceOptionTranslationText";
import useChoiceOptions from "../../Context/ChoiceContext";
import { Button } from "@/components/ui/button";

type ChoiceOptionInputFieldTypes = {
  choiceOptionId: string;
  choiceId: string;
  option: string;
  plotfieldCommandId: string;
  type: ChoiceOptionVariationsTypes;
  setShowOptionPlot: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFocusedBackground: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function ChoiceOptionInputField({
  type,
  option,
  choiceId,
  choiceOptionId,
  plotfieldCommandId,
  setShowOptionPlot,
  setIsFocusedBackground,
}: ChoiceOptionInputFieldTypes) {
  const { updateChoiceOptionText, getChoiceOptionText, getCurrentlyOpenChoiceOptionPlotId } = useChoiceOptions();
  const debouncedValue = useDebounce({
    delay: 700,
    value: getChoiceOptionText({ choiceId, choiceOptionId }),
  });

  const updateChoiceOption = useUpdateChoiceOptionTranslationText({
    choiceOptionId,
    option: debouncedValue,
    type,
    choiceId,
    language: "russian",
  });

  useEffect(() => {
    if (debouncedValue?.trim().length && option?.trim() !== debouncedValue.trim()) {
      updateChoiceOption.mutate();
    }
  }, [debouncedValue]);

  return (
    <div
      className={`${
        choiceOptionId === getCurrentlyOpenChoiceOptionPlotId({ plotfieldCommandId: plotfieldCommandId })
          ? ""
          : "hidden"
      }  flex gap-[5px]`}
    >
      <PlotfieldInput
        type="text"
        placeholder="Ответ"
        value={getChoiceOptionText({ choiceId, choiceOptionId })}
        onChange={(e) => {
          updateChoiceOptionText({
            choiceId,
            id: choiceOptionId,
            optionText: e.target.value,
          });
        }}
        className={`text-[15px] text-text rounded-md shadow-sm px-[10px] py-[5px] w-full focus-within:shadow-inner transition-shadow`}
      />

      <Button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowOptionPlot(false);
          setIsFocusedBackground(false);
        }}
        className="text-text bg-accent hover:opacity-80 transition-opacity"
      >
        Обратно
      </Button>
    </div>
  );
}
