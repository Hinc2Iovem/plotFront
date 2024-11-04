import { TextStyleTypes } from "../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import { CommandSideTypes } from "../../../../types/StoryEditor/PlotField/Say/SayTypes";

type CheckTextStyleTypes = {
  debouncedValue: string;
  setCurrentTextStyle: React.Dispatch<React.SetStateAction<TextStyleTypes>>;
};

export const checkTextStyle = ({
  debouncedValue,
  setCurrentTextStyle,
}: CheckTextStyleTypes) => {
  if (debouncedValue.includes("<i>")) {
    setCurrentTextStyle("italic");
  } else if (debouncedValue.includes("<b>")) {
    setCurrentTextStyle("bold");
  } else if (debouncedValue.includes("<u>")) {
    setCurrentTextStyle("underscore");
  }
};

type CheckTextSideTypes = {
  debouncedValue: string;
  updateCommandSide: ({
    commandSide,
    id,
  }: {
    id: string;
    commandSide: "left" | "right";
  }) => void;
  updateCommandIfSide: ({
    commandSide,
    id,
    isElse,
  }: {
    id: string;
    commandSide: "left" | "right";
    isElse: boolean;
  }) => void;
  commandIfId: string;
  isElse: boolean;
  plotfieldCommandId: string;
  setCurrentTextSide: React.Dispatch<React.SetStateAction<CommandSideTypes>>;
};

export const checkTextSide = ({
  debouncedValue,
  setCurrentTextSide,
  updateCommandSide,
  plotfieldCommandId,
  commandIfId,
  isElse,
  updateCommandIfSide,
}: CheckTextSideTypes) => {
  if (debouncedValue.includes("<left>")) {
    setCurrentTextSide("left");
    if (commandIfId?.trim().length) {
      updateCommandIfSide({
        commandSide: "left",
        id: plotfieldCommandId,
        isElse,
      });
    } else {
      updateCommandSide({ commandSide: "left", id: plotfieldCommandId });
    }
  } else {
    if (debouncedValue.includes("<right>")) {
      setCurrentTextSide("right");

      if (commandIfId?.trim().length) {
        updateCommandIfSide({
          commandSide: "right",
          id: plotfieldCommandId,
          isElse,
        });
      } else {
        updateCommandSide({ commandSide: "right", id: plotfieldCommandId });
      }
    }
  }
};
