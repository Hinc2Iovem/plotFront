import { ContextMenuContent, ContextMenuItem } from "@/components/ui/context-menu";
import { useState } from "react";
import { TextStyleTypes } from "../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import { CommandSideTypes } from "../../../types/StoryEditor/PlotField/Say/SayTypes";
import AsideScrollableButton from "../../../ui/Aside/AsideScrollable/AsideScrollableButton";
import usePlotfieldCommands from "../PlotField/Context/PlotFieldContext";

type TextSettingsModalTypes = {
  showTextStyleRow: boolean;
  showTextSideRow: boolean;
  setTextValue: React.Dispatch<React.SetStateAction<string>>;
  currentTextStyle?: TextStyleTypes;
  currentSide?: CommandSideTypes;
  plotfieldCommandId: string;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentTextStyle?: React.Dispatch<React.SetStateAction<TextStyleTypes>>;
  setCurrentTextSide?: React.Dispatch<React.SetStateAction<CommandSideTypes>>;
};

export default function TextSettingsModal({
  showTextSideRow,
  showTextStyleRow,
  setTextValue,
  setShowModal,
  setCurrentTextSide,
  setCurrentTextStyle,
  currentSide,
  currentTextStyle,
  plotfieldCommandId,
}: TextSettingsModalTypes) {
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [descriptionText, setDescriptionText] = useState("" as TextStyleTypes);
  const { updateCommandSide } = usePlotfieldCommands();

  const handleHoverFocusTextStyle = (ts: string) => {
    setShowDescriptionModal(true);
    if (ts === "b") {
      setDescriptionText("bold");
    } else if (ts === "d") {
      setDescriptionText("default");
    } else if (ts === "i") {
      setDescriptionText("italic");
    } else {
      setDescriptionText("underscore");
    }
  };

  const handleBlurMouseLeaveTextStyle = () => {
    setShowDescriptionModal(false);
    setDescriptionText("" as TextStyleTypes);
  };

  return <div></div>;
}
