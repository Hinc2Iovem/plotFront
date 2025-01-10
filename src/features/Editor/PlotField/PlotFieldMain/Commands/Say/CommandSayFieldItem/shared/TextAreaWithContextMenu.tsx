import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import usePlotfieldCommands from "@/features/Editor/PlotField/Context/PlotFieldContext";
import { TextStyleTypes } from "@/types/StoryEditor/PlotField/Choice/ChoiceTypes";
import { CommandSideTypes } from "@/types/StoryEditor/PlotField/Say/SayTypes";
import PlotfieldTextarea from "@/ui/Textareas/PlotfieldTextarea";
import { forwardRef, useState } from "react";

type TextAreaWithContextMenuTypes = {
  textValue: string;
  showTextSideRow: boolean;
  showTextStyleRow: boolean;
  plotfieldCommandId: string;
  currentSide: CommandSideTypes;
  currentTextStyle: TextStyleTypes;
  currentTextSide: CommandSideTypes;
  setCurrentTextSide: React.Dispatch<React.SetStateAction<CommandSideTypes>>;
  setCurrentTextStyle: React.Dispatch<React.SetStateAction<TextStyleTypes>>;
  setTextValue: React.Dispatch<React.SetStateAction<string>>;
  updateOnBlur: () => void;
};

const AllTextStyleTypes = ["b", "d", "i", "u"];
const AllTextSideTypes: CommandSideTypes[] = ["left", "right"];

const TextAreaWithContextMenu = forwardRef<HTMLTextAreaElement, TextAreaWithContextMenuTypes>(
  (
    {
      setTextValue,
      textValue,
      currentTextSide,
      currentTextStyle,
      setCurrentTextSide,
      setCurrentTextStyle,
      showTextSideRow,
      showTextStyleRow,
      updateOnBlur,
      plotfieldCommandId,
      currentSide,
    },
    ref
  ) => {
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
    return (
      <ContextMenu>
        <form className="flex-grow relative h-full">
          <ContextMenuTrigger>
            <PlotfieldTextarea
              value={textValue}
              ref={ref}
              placeholder="Such a lovely day"
              onBlur={updateOnBlur}
              className={`${
                currentTextStyle === "underscore"
                  ? "underline"
                  : currentTextStyle === "bold"
                  ? "font-bold"
                  : currentTextStyle === "italic"
                  ? "italic"
                  : ""
              } ${currentTextSide === "right" ? "text-right" : "text-left"} `}
              onChange={(e) => setTextValue(e.target.value)}
            />
          </ContextMenuTrigger>

          <ContextMenuContent className="flex flex-col gap-[10px] p-[10px] items-center">
            {showTextStyleRow ? (
              <div className="flex gap-[10px] items-center">
                {AllTextStyleTypes.map((ts) => (
                  <ContextMenuItem
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
                      }
                    }}
                    key={ts}
                    className={`${
                      currentTextStyle?.slice(0, 1) === ts ? "opacity-100 bg-accent" : "opacity-80"
                    } text-[15px] text-text hover:bg-accent hover:opacity-100 focus-within:opacity-100`}
                  >
                    {ts}
                    <TextStyleSubModal showModal={showDescriptionModal} ts={ts} text={descriptionText} />
                  </ContextMenuItem>
                ))}
              </div>
            ) : null}

            {showTextSideRow ? (
              <div className="w-full flex gap-[10px] items-center justify-center">
                {AllTextSideTypes.map((ts) => (
                  <ContextMenuItem
                    onClick={() => {
                      if (setCurrentTextSide) {
                        setCurrentTextSide(ts);
                        updateCommandSide({
                          commandSide: ts,
                          id: plotfieldCommandId,
                        });
                      }
                      setTextValue((prev) => prev.replace(/<\/?(left|right)>/g, ""));
                    }}
                    key={ts}
                    className={`${
                      currentSide === ts ? "bg-accent" : ""
                    } relative text-[13px] text-text px-[10px] py-[5px] hover:bg-accent hover:opacity-100 focus-within:opacity-100`}
                  >
                    {ts}
                  </ContextMenuItem>
                ))}
              </div>
            ) : null}
          </ContextMenuContent>
        </form>
      </ContextMenu>
    );
  }
);

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
      } z-[10] absolute right-0 translate-y-[30px] w-fit text-text bg-secondary shadow-md rounded-md px-[10px] py-[5px] text-[13px]`}
    >
      {text}
    </aside>
  );
}

TextAreaWithContextMenu.displayName = "TextAreaWithContextMenu";

export default TextAreaWithContextMenu;
