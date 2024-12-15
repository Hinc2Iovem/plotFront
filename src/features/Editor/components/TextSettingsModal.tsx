import { useRef, useState } from "react";
import { TextStyleTypes } from "../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import { CommandSideTypes } from "../../../types/StoryEditor/PlotField/Say/SayTypes";
import AsideScrollable from "../../shared/Aside/AsideScrollable/AsideScrollable";
import AsideScrollableButton from "../../shared/Aside/AsideScrollable/AsideScrollableButton";
import useOutOfModal from "../../../hooks/UI/useOutOfModal";
import usePlotfieldCommands from "../PlotField/Context/PlotFieldContext";

type TextSettingsModalTypes = {
  showTextStyleRow: boolean;
  showTextSideRow: boolean;
  showModal: boolean;
  setTextValue: React.Dispatch<React.SetStateAction<string>>;
  currentTextStyle?: TextStyleTypes;
  currentSide?: CommandSideTypes;
  translateY: string;
  plotfieldCommandId: string;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentTextStyle?: React.Dispatch<React.SetStateAction<TextStyleTypes>>;
  setCurrentTextSide?: React.Dispatch<React.SetStateAction<CommandSideTypes>>;
};

const AllTextStyleTypes = ["b", "d", "i", "u"];
const AllTextSideTypes: CommandSideTypes[] = ["left", "right"];

export default function TextSettingsModal({
  showTextSideRow,
  showTextStyleRow,
  showModal,
  setTextValue,
  setShowModal,
  setCurrentTextSide,
  setCurrentTextStyle,
  currentSide,
  currentTextStyle,
  translateY,
  plotfieldCommandId,
}: TextSettingsModalTypes) {
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [descriptionText, setDescriptionText] = useState("" as TextStyleTypes);
  const { updateCommandSide } = usePlotfieldCommands();
  const modalRef = useRef<HTMLDivElement | null>(null);

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

  useOutOfModal({
    modalRef,
    setShowModal,
    showModal,
  });

  return (
    <AsideScrollable
      ref={modalRef}
      className={`${showModal ? "" : "hidden"} ${translateY} shadow-sm shadow-gray-500 min-h-[7rem] h-fit w-[20rem]`}
    >
      {showTextStyleRow ? (
        <div className="w-full flex gap-[.5rem]">
          {AllTextStyleTypes.map((ts) => (
            <AsideScrollableButton
              type="button"
              onFocus={() => handleHoverFocusTextStyle(ts)}
              onMouseOver={() => handleHoverFocusTextStyle(ts)}
              onBlur={handleBlurMouseLeaveTextStyle}
              onMouseLeave={handleBlurMouseLeaveTextStyle}
              onClick={() => {
                if (setCurrentTextStyle) {
                  if (ts === "b") {
                    setCurrentTextStyle("bold");
                  } else if (ts === "d") {
                    setCurrentTextStyle("default");
                  } else if (ts === "i") {
                    setCurrentTextStyle("italic");
                  } else {
                    setCurrentTextStyle("underscore");
                  }
                  setTextValue((prev) => prev.replace(/<\/?(i|b|u|d)>/g, ""));
                  setShowModal(false);
                }
              }}
              key={ts}
              className={`${
                currentTextStyle?.slice(0, 1) === ts ? "text-text-light bg-primary" : "bg-primary-darker"
              } relative text-[1.3rem] px-[0rem] py-[.5rem] hover:bg-primary `}
            >
              {ts}

              <TextStyleSubModal showModal={showDescriptionModal} ts={ts} text={descriptionText} />
            </AsideScrollableButton>
          ))}
        </div>
      ) : null}

      {showTextSideRow ? (
        <div className="w-full flex gap-[.5rem]">
          {AllTextSideTypes.map((ts) => (
            <AsideScrollableButton
              type="button"
              onClick={() => {
                if (setCurrentTextSide) {
                  setCurrentTextSide(ts);
                  updateCommandSide({
                    commandSide: ts,
                    id: plotfieldCommandId,
                  });
                }
                setShowModal(false);
                setTextValue((prev) => prev.replace(/<\/?(left|right)>/g, ""));
              }}
              key={ts}
              className={`${
                currentSide === ts ? "text-text-light bg-primary" : "bg-primary-darker"
              } relative text-[1.3rem] px-[0rem] py-[.5rem] hover:bg-primary `}
            >
              {ts}
            </AsideScrollableButton>
          ))}
        </div>
      ) : null}
    </AsideScrollable>
  );
}

type TextStyleSubModalTypes = {
  showModal: boolean;
  text: string;
  ts: string;
};

function TextStyleSubModal({ showModal, text, ts }: TextStyleSubModalTypes) {
  return (
    <aside
      className={`${showModal ? "" : "hidden"} ${
        text.slice(0, 1) === ts ? "" : "hidden"
      } z-[2] absolute right-0 translate-y-[.7rem] w-fit bg-primary-darker shadow-md rounded-md px-[1rem] py-[.5rem] text-[1.2rem] text-text-light`}
    >
      {text}
    </aside>
  );
}
