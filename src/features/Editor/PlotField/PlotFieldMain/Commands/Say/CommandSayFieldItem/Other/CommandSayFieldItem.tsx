import { useEffect, useRef, useState } from "react";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import useDebounce from "../../../../../../../../hooks/utilities/useDebounce";
import { CommandSayVariationTypes } from "../../../../../../../../types/StoryEditor/PlotField/Say/SayTypes";
import useGetTranslationSay from "../../../hooks/Say/useGetTranslationSay";
import useUpdateCommandSayText from "../../../hooks/Say/useUpdateCommandSayText";
import useUpdateCommandSayType from "../../../hooks/Say/useUpdateCommandSayType";
import PlotfieldButton from "../../../../../../../shared/Buttons/PlotfieldButton";
import PlotfieldTextarea from "../../../../../../../shared/Textareas/PlotfieldTextarea";

type CommandSayFieldItemTypes = {
  nameValue: string;
  plotFieldCommandId: string;
  plotFieldCommandSayId: string;
  topologyBlockId: string;
};

const CommandSayPossibleUpdateVariations = ["author", "hint", "notify"];

export default function CommandSayFieldItem({
  nameValue,
  plotFieldCommandId,
  plotFieldCommandSayId,
  topologyBlockId,
}: CommandSayFieldItemTypes) {
  const { data: commandSayText } = useGetTranslationSay({
    commandId: plotFieldCommandId,
    language: "russian",
  });

  const [sayVariationType, setSayVariationType] = useState(nameValue);
  const [initialTextValue, setInitialTextValue] = useState("");
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
      setInitialTextValue((commandSayText.translations || [])[0]?.text || "");
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
    if (initialTextValue !== debouncedValue && debouncedValue?.trim().length) {
      updateCommandSayText.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

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
          className="capitalize text-start"
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
      <form className="sm:w-[77%] flex-grow w-full">
        <PlotfieldTextarea
          value={textValue}
          placeholder="Such a lovely day"
          onChange={(e) => setTextValue(e.target.value)}
        />
      </form>
    </div>
  );
}
