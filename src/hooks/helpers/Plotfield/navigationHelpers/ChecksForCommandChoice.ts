import { PlotfieldOptimisticCommandTypes } from "../../../../features/Editor/PlotField/Context/PlotfieldCommandSlice";
import { ChoiceOptionItemTypes } from "../../../../features/Editor/PlotField/PlotFieldMain/Commands/Choice/Context/ChoiceContext";

type GoingDownInsideChoiceTypes = {
  plotfieldCommandId: string | undefined;
  isGoingDown: boolean;
  getFirstChoiceOptionWithTopologyBlockId: ({
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
  }) => ChoiceOptionItemTypes | null;
  updateCurrentlyOpenChoiceOption: ({
    plotfieldCommandId,
    choiceOptionId,
    topologyBlockId,
  }: {
    plotfieldCommandId: string;
    choiceOptionId: string;
    topologyBlockId: string;
  }) => void;
};

export function GoingDownInsideChoice({
  getFirstChoiceOptionWithTopologyBlockId,
  isGoingDown,
  plotfieldCommandId,
  updateCurrentlyOpenChoiceOption,
}: GoingDownInsideChoiceTypes) {
  if (isGoingDown) {
    const firstOption = getFirstChoiceOptionWithTopologyBlockId({
      plotfieldCommandId: plotfieldCommandId || "",
    });
    if (!firstOption) {
      console.log(
        "You haven't created any option, or at least you haven't assigned any topology block to them, yet."
      );
      return;
    }

    updateCurrentlyOpenChoiceOption({
      plotfieldCommandId: plotfieldCommandId || "",
      choiceOptionId: firstOption.choiceOptionId,
      topologyBlockId: firstOption.topologyBlockId,
    });

    sessionStorage.setItem(
      "focusedTopologyBlock",
      `${firstOption.topologyBlockId}`
    );
  }
}

type GoingUpFromChoiceTypes = {
  plotfieldCommandId: string | undefined;
  isGoingUp: boolean;
  getCommandOnlyByPlotfieldCommandId: ({
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
  }) => PlotfieldOptimisticCommandTypes | null;
  getFirstChoiceOptionWithTopologyBlockId: ({
    plotfieldCommandId,
  }: {
    plotfieldCommandId: string;
  }) => ChoiceOptionItemTypes | null;
  updateCurrentlyOpenChoiceOption: ({
    plotfieldCommandId,
    choiceOptionId,
    topologyBlockId,
  }: {
    plotfieldCommandId: string;
    choiceOptionId: string;
    topologyBlockId: string;
  }) => void;
};

export function GoingUpFromChoice({
  getCommandOnlyByPlotfieldCommandId,
  getFirstChoiceOptionWithTopologyBlockId,
  isGoingUp,
  plotfieldCommandId,
  updateCurrentlyOpenChoiceOption,
}: GoingUpFromChoiceTypes) {
  if (isGoingUp) {
    const firstOption = getFirstChoiceOptionWithTopologyBlockId({
      plotfieldCommandId: plotfieldCommandId || "",
    });
    if (!firstOption) {
      console.log("Strangely you have a value which you don't suppose to have");
      return;
    }

    updateCurrentlyOpenChoiceOption({
      plotfieldCommandId: plotfieldCommandId || "",
      choiceOptionId: firstOption.choiceOptionId,
      topologyBlockId: "",
    });

    const currentPlotfieldCommand = getCommandOnlyByPlotfieldCommandId({
      plotfieldCommandId: plotfieldCommandId || "",
    });

    sessionStorage.setItem(
      "focusedTopologyBlock",
      `${currentPlotfieldCommand?.topologyBlockId}`
    );
    sessionStorage.setItem("focusedCommand", `${plotfieldCommandId}`);
  }
}
