import { TextStyleTypes } from "../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import { CommandSideTypes } from "../../../../types/StoryEditor/PlotField/Say/SayTypes";

type CheckTextStyleTypes = {
  debouncedValue: string;
  setCurrentTextStyle: React.Dispatch<React.SetStateAction<TextStyleTypes>>;
};

export const checkTextStyle = ({ debouncedValue, setCurrentTextStyle }: CheckTextStyleTypes) => {
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
  updateCommandSide: ({ commandSide, id }: { id: string; commandSide: "left" | "right" }) => void;
  plotfieldCommandId: string;
  setCurrentTextSide: React.Dispatch<React.SetStateAction<CommandSideTypes>>;
};

export const checkTextSide = ({
  debouncedValue,
  setCurrentTextSide,
  updateCommandSide,
  plotfieldCommandId,
}: CheckTextSideTypes) => {
  if (debouncedValue.includes("<left>")) {
    setCurrentTextSide("left");

    updateCommandSide({ commandSide: "left", id: plotfieldCommandId });
  } else {
    if (debouncedValue.includes("<right>")) {
      setCurrentTextSide("right");

      updateCommandSide({ commandSide: "right", id: plotfieldCommandId });
    }
  }
};
