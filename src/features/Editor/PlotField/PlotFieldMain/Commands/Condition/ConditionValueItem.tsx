import { useEffect, useState } from "react";
import {
  AllConditionSigns,
  ConditionSignTypes,
  ConditionValueTypes,
} from "../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import useEscapeOfModal from "../../../../../../hooks/UI/useEscapeOfModal";
import useUpdateConditionValue from "../hooks/Condition/ConditionValue/useUpdateConditionValue";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";

export default function ConditionValueItem({
  _id,
  name,
  sign,
  value,
}: ConditionValueTypes) {
  const [nameText, setNameText] = useState(name || "");
  const [currentSign, setCurrentSign] = useState<ConditionSignTypes>(
    sign || ""
  );
  const [valueText, setValueText] = useState(value);

  const [showSignModal, setShowSignModal] = useState(false);

  const debouncedValue = useDebounce({ delay: 700, value: nameText });
  const updateValue = useUpdateConditionValue({ conditionValueId: _id });

  useEffect(() => {
    if (debouncedValue?.trim().length) {
      updateValue.mutate({ name: debouncedValue });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  useEffect(() => {
    if (valueText) {
      updateValue.mutate({ value: valueText });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueText]);

  useEffect(() => {
    if (currentSign?.trim().length) {
      updateValue.mutate({ sign: currentSign });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSign]);

  useEscapeOfModal({ value: showSignModal, setValue: setShowSignModal });

  return (
    <form
      className="w-full flex-grow flex flex-col gap-[1rem] bg-neutral-alabaster rounded-md"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="text"
        placeholder="Название"
        value={nameText}
        onChange={(e) => setNameText(e.target.value)}
        className="w-full px-[1rem] py-[.5rem] shadow-md rounded-md bg-white outline-gray-300 text-[1.4rem]"
      />
      <div className="relative w-full">
        <button
          onClick={() => setShowSignModal((prev) => !prev)}
          type="button"
          className="w-full px-[1rem] py-[.5rem] shadow-md rounded-md bg-white outline-gray-300 text-[1.4rem]"
        >
          {currentSign ? currentSign : "Знак"}
        </button>
        <aside
          className={`${showSignModal ? "" : "hidden"} ${
            currentSign ? "translate-y-[1rem]" : "translate-y-[2rem]"
          } absolute top-1/2 z-[10] p-[1rem] min-w-fit w-full max-h-[10rem] overflow-y-auto bg-white shadow-md rounded-md flex flex-col gap-[1rem] | scrollBar`}
        >
          {AllConditionSigns &&
            AllConditionSigns?.map((c) => (
              <PlotfieldSingsPrompt
                key={c}
                signName={c}
                setShowSignModal={setShowSignModal}
                setCurrentSign={setCurrentSign}
              />
            ))}
        </aside>
      </div>
      <input
        type="text"
        placeholder="Значение"
        value={valueText || ""}
        onChange={(e) => setValueText(+e.target.value)}
        className="w-full px-[1rem] py-[.5rem] shadow-md rounded-md bg-white outline-gray-300 text-[1.4rem]"
      />
    </form>
  );
}

type PlotfieldSingsPromptTypes = {
  signName: ConditionSignTypes;
  setShowSignModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentSign: React.Dispatch<React.SetStateAction<ConditionSignTypes>>;
};

export function PlotfieldSingsPrompt({
  setCurrentSign,
  setShowSignModal,
  signName,
}: PlotfieldSingsPromptTypes) {
  return (
    <button
      type="button"
      onClick={() => {
        setCurrentSign(signName);
        setShowSignModal(false);
      }}
      className="whitespace-nowrap outline-gray-300 w-full flex-wrap text-start text-[1.4rem] px-[.5rem] py-[.2rem] hover:bg-primary-light-blue hover:text-white transition-all rounded-md"
    >
      {signName}
    </button>
  );
}
