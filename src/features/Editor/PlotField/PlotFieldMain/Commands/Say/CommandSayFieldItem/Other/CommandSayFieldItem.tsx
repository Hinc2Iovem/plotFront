import { useEffect, useRef, useState } from "react";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import useDebounce from "../../../../../../../../hooks/utilities/useDebounce";
import {
  CommandSayVariationTypes,
  CommandSideTypes,
} from "../../../../../../../../types/StoryEditor/PlotField/Say/SayTypes";
import PlotfieldButton from "../../../../../../../shared/Buttons/PlotfieldButton";
import PlotfieldTextarea from "../../../../../../../shared/Textareas/PlotfieldTextarea";
import useGetTranslationSay from "../../../../../hooks/Say/useGetTranslationSay";
import useUpdateCommandSayText from "../../../../../hooks/Say/useUpdateCommandSayText";
import useUpdateCommandSayType from "../../../../../hooks/Say/useUpdateCommandSayType";
import { TextStyleTypes } from "../../../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import TextSettingsModal from "../../../../../../components/TextSettingsModal";
import useUpdateSayTextSide from "../../../../../hooks/Say/useUpdateSayTextSide";
import useUpdateSayTextStyle from "../../../../../hooks/Say/useUpdateSayTextStyle";
import {
  checkTextSide,
  checkTextStyle,
} from "../../../../../utils/checkTextStyleTextSide";
import useCheckIsCurrentFieldFocused from "../../../../../../../../hooks/helpers/Plotfield/useCheckIsCurrentFieldFocused";
import usePlotfieldCommands from "../../../../../Context/PlotFieldContext";
import useFocuseOnCurrentFocusedFieldChange from "../../../../../../../../hooks/helpers/Plotfield/useFocuseOnCurrentFocusedFieldChange";

type CommandSayFieldItemTypes = {
  nameValue: string;
  plotFieldCommandId: string;
  plotFieldCommandSayId: string;
  topologyBlockId: string;
  textStyle: TextStyleTypes;
  textSide: CommandSideTypes;
  commandIfId: string;
  isElse: boolean;
};

const CommandSayPossibleUpdateVariations = ["author", "hint", "notify"];

export default function CommandSayFieldItem({
  nameValue,
  plotFieldCommandId,
  plotFieldCommandSayId,
  topologyBlockId,
  textStyle,
  textSide,
  commandIfId,
  isElse,
}: CommandSayFieldItemTypes) {
  const [currentTextStyle, setCurrentTextStyle] = useState(textStyle);
  const [currentTextSide, setCurrentTextSide] = useState(textSide);
  const [showTextSettingsModal, setShowTextSettingsModal] = useState(false);
  const isCommandFocused = useCheckIsCurrentFieldFocused({
    plotFieldCommandId,
  });
  const currentInput = useRef<HTMLTextAreaElement | null>(null);
  useFocuseOnCurrentFocusedFieldChange({ currentInput, isCommandFocused });

  const { updateCommandSide, updateCommandIfSide } = usePlotfieldCommands();
  const { data: commandSayText } = useGetTranslationSay({
    commandId: plotFieldCommandId,
    language: "russian",
  });

  const [sayVariationType, setSayVariationType] = useState(nameValue);
  const [textValue, setTextValue] = useState("");
  const debouncedValue = useDebounce({ value: textValue, delay: 500 });

  useEffect(() => {
    if (nameValue) {
      setSayVariationType(nameValue);
    }
  }, [nameValue]);

  useEffect(() => {
    if (commandSayText && !textValue.trim().length) {
      setTextValue((commandSayText.translations || [])[0]?.text || "");
    }
  }, [commandSayText]);

  const [showUpdateNameModal, setShowUpdateNameModal] = useState(false);
  const updateNameModalRef = useRef<HTMLDivElement | null>(null);

  const updateCommandSayNameValue = useUpdateCommandSayType({
    plotFieldCommandId,
    plotFieldCommandSayId,
  });

  const updateCommandSayText = useUpdateCommandSayText({
    commandId: plotFieldCommandId,
    textValue,
    topologyBlockId,
  });

  useEffect(() => {
    if (debouncedValue?.trim().length) {
      updateCommandSayText.mutate();
      checkTextStyle({ debouncedValue, setCurrentTextStyle });
      checkTextSide({
        debouncedValue,
        setCurrentTextSide,
        plotfieldCommandId: plotFieldCommandId,
        updateCommandSide,
        updateCommandIfSide,
        commandIfId,
        isElse,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  const updateCommandSaySide = useUpdateSayTextSide({
    sayId: plotFieldCommandSayId,
  });

  useEffect(() => {
    if (currentTextSide && plotFieldCommandSayId?.trim().length) {
      updateCommandSaySide.mutate({ textSide: currentTextSide });
    }
  }, [currentTextSide]);

  const updateCommandSayStyle = useUpdateSayTextStyle({
    sayId: plotFieldCommandSayId,
  });

  useEffect(() => {
    if (currentTextStyle && plotFieldCommandSayId?.trim().length) {
      updateCommandSayStyle.mutate({ textStyle: currentTextStyle });
    }
  }, [currentTextStyle]);

  useOutOfModal({
    modalRef: updateNameModalRef,
    setShowModal: setShowUpdateNameModal,
    showModal: showUpdateNameModal,
  });

  return (
    <div className="flex flex-wrap gap-[1rem] w-full bg-primary-darker rounded-md p-[.5rem] sm:flex-row flex-col">
      <div className="sm:w-[20%] min-w-[10rem] flex-grow w-full relative">
        <PlotfieldButton
          onClick={(e) => {
            e.stopPropagation();
            setShowUpdateNameModal((prev) => !prev);
            if (showUpdateNameModal) {
              e.currentTarget.blur();
            }
          }}
          className={`${
            isCommandFocused ? "bg-dark-dark-blue" : "bg-secondary"
          } capitalize text-start`}
        >
          {sayVariationType}
        </PlotfieldButton>
        <aside
          ref={updateNameModalRef}
          className={`${
            showUpdateNameModal ? "" : "hidden"
          } bg-secondary w-full translate-y-[.5rem] rounded-md shadow-md absolute z-10 flex flex-col gap-[.5rem] p-[.5rem]`}
        >
          {CommandSayPossibleUpdateVariations.map((pv) => {
            return (
              <PlotfieldButton
                key={pv}
                onClick={() => {
                  setSayVariationType(pv);
                  updateCommandSayNameValue.mutate(
                    pv as CommandSayVariationTypes
                  );
                  setShowUpdateNameModal(false);
                }}
                className={`${pv === nameValue ? "hidden" : ""} capitalize`}
              >
                {pv}
              </PlotfieldButton>
            );
          })}
        </aside>
      </div>
      <form className="sm:w-[77%] flex-grow w-full relative">
        <PlotfieldTextarea
          value={textValue}
          ref={currentInput}
          placeholder="Such a lovely day"
          onContextMenu={(e) => {
            e.preventDefault();
            setShowTextSettingsModal((prev) => !prev);
          }}
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

        <TextSettingsModal
          translateY="translate-y-[-15rem]"
          plotfieldCommandId={plotFieldCommandId}
          setShowModal={setShowTextSettingsModal}
          currentTextStyle={currentTextStyle}
          setCurrentTextStyle={setCurrentTextStyle}
          setTextValue={setTextValue}
          showModal={showTextSettingsModal}
          showTextSideRow={true}
          showTextStyleRow={true}
          setCurrentTextSide={setCurrentTextSide}
          currentSide={currentTextSide}
          isElse={isElse}
        />
      </form>
    </div>
  );
}
