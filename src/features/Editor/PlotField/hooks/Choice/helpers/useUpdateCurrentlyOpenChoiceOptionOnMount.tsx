import { useEffect } from "react";
import { TranslationChoiceOptionTypes } from "../../../../../../types/Additional/TranslationTypes";
import useChoiceOptions from "../../../PlotFieldMain/Commands/Choice/Context/ChoiceContext";

type UpdateCurrentlyOpenChoiceOptionOnMountTypes = {
  choiceOptions: TranslationChoiceOptionTypes[] | undefined;
  plotFieldCommandId: string;
};

export default function useUpdateCurrentlyOpenChoiceOptionOnMount({
  choiceOptions,
  plotFieldCommandId,
}: UpdateCurrentlyOpenChoiceOptionOnMountTypes) {
  const { updateCurrentlyOpenChoiceOption } = useChoiceOptions();
  useEffect(() => {
    if (choiceOptions) {
      const focusedChoiceOptions = sessionStorage
        .getItem("focusedChoiceOption")
        ?.split("?")
        .filter(Boolean);

      const deepLevelChoiceOptions = focusedChoiceOptions?.includes("none")
        ? null
        : (focusedChoiceOptions?.length || 0) > 0
        ? (focusedChoiceOptions?.length || 0) - 1
        : null;

      if (typeof deepLevelChoiceOptions === "number") {
        const currentChoiceOption = (focusedChoiceOptions || [])[
          deepLevelChoiceOptions
        ].split("-");
        const currentChoiceOptionId = currentChoiceOption[1];

        updateCurrentlyOpenChoiceOption({
          choiceOptionId: currentChoiceOptionId,
          plotfieldCommandId: plotFieldCommandId,
        });
      }
    }
  }, [choiceOptions, plotFieldCommandId, updateCurrentlyOpenChoiceOption]);
}
