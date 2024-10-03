import { useEffect, useRef, useState } from "react";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import useDebounce from "../../../../../../../../hooks/utilities/useDebounce";
import { CommandSayVariationTypes } from "../../../../../../../../types/StoryEditor/PlotField/Say/SayTypes";
import useGetTranslationSay from "../../../hooks/Say/useGetTranslationSay";
import useUpdateCommandSayText from "../../../hooks/Say/useUpdateCommandSayText";
import useUpdateCommandSayType from "../../../hooks/Say/useUpdateCommandSayType";

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
    <div className="flex flex-wrap gap-[1rem] w-full bg-primary-light-blue rounded-md p-[.5rem] sm:flex-row flex-col">
      <div className="sm:w-[20%] min-w-[10rem] flex-grow w-full relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowUpdateNameModal((prev) => !prev);
          }}
          className="text-[1.3rem] text-start outline-gray-300 w-full capitalize px-[1rem] py-[.5rem] rounded-md shadow-md bg-white cursor-default"
        >
          {sayVariationType}
        </button>
        <aside
          ref={updateNameModalRef}
          className={`${
            showUpdateNameModal ? "" : "hidden"
          } bg-white w-full translate-y-[.5rem] rounded-md shadow-md absolute z-10`}
        >
          <ul>
            {CommandSayPossibleUpdateVariations.map((pv) => {
              return (
                <li
                  key={pv}
                  onClick={() => {
                    setSayVariationType(pv);
                    updateCommandSayNameValue.mutate(
                      pv as CommandSayVariationTypes
                    );
                    setShowUpdateNameModal(false);
                  }}
                  className={`${
                    pv === nameValue ? "hidden" : ""
                  } rounded-md capitalize text-[1.3rem] text-gray-700 hover:text-white transition-all p-[1rem] cursor-pointer hover:bg-primary-pastel-blue`}
                >
                  {pv}
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
      <form className="sm:w-[77%] flex-grow w-full">
        <textarea
          value={textValue}
          className=" w-full outline-gray-300 text-gray-600 text-[1.6rem] px-[1rem] py-[.5rem] rounded-md shadow-md sm:max-h-[20rem] max-h-[40rem]"
          placeholder="Such a lovely day"
          onChange={(e) => setTextValue(e.target.value)}
        />
      </form>
    </div>
  );
}
