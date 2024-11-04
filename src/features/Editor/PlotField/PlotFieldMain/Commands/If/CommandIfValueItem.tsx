import { useEffect, useState } from "react";
import { IfValueTypes } from "../../../../../../types/StoryEditor/PlotField/IfCommand/IfCommandTypes";
import useUpdateIfConditionValue from "../../../hooks/If/Values/useUpdateIfConditionValue";
import {
  AllConditionSigns,
  ConditionSignTypes,
} from "../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import useEscapeOfModal from "../../../../../../hooks/UI/useEscapeOfModal";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import AsideScrollableButton from "../../../../../shared/Aside/AsideScrollable/AsideScrollableButton";

export default function CommandIfValueItem({
  _id,
  name,
  sign,
  value,
}: IfValueTypes) {
  const [currentName, setCurrentName] = useState(name || "");
  const [currentSign, setCurrentSign] = useState(sign || "");
  const [currentValue, setCurrentValue] = useState(value || null);
  const [showSignModal, setShowSignModal] = useState(false);
  const theme = localStorage.getItem("theme");
  const updateValues = useUpdateIfConditionValue({ ifValueId: _id });

  const debouncedValue = useDebounce({ value: currentName, delay: 700 });

  useEffect(() => {
    if (currentSign) {
      updateValues.mutate({ sign: currentSign });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSign]);

  useEffect(() => {
    if (currentValue) {
      updateValues.mutate({ value: currentValue });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentValue]);

  useEffect(() => {
    if (debouncedValue) {
      updateValues.mutate({ name: debouncedValue });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  useEscapeOfModal({ setValue: setShowSignModal, value: showSignModal });
  return (
    <>
      <input
        type="text"
        placeholder="Название"
        className={`flex-grow px-[1rem] py-[.5rem] text-[1.3rem] text-text-light ${
          theme === "light" ? "outline-gray-300" : "outline-gray-600"
        } bg-secondary rounded-md shadow-md`}
        value={currentName}
        onChange={(e) => setCurrentName(e.target.value)}
      />
      <div className="relative flex-grow">
        <button
          onClick={() => setShowSignModal((prev) => !prev)}
          type="button"
          className={`w-full px-[1rem] py-[.5rem] shadow-md text-text-light rounded-md bg-secondary  ${
            theme === "light" ? "outline-gray-300" : "outline-gray-600"
          } text-[1.4rem]`}
        >
          {currentSign ? currentSign : "Знак"}
        </button>
        <aside
          className={`${showSignModal ? "" : "hidden"} ${
            currentSign ? "translate-y-[1rem]" : "translate-y-[2rem]"
          } absolute top-1/2 z-[10] p-[1rem] min-w-fit w-full max-h-[10rem] overflow-y-auto bg-secondary shadow-md rounded-md flex flex-col gap-[1rem] | containerScroll`}
        >
          {AllConditionSigns &&
            AllConditionSigns?.map((c) => (
              <PlotfieldIfSingsPrompt
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
        className={`flex-grow px-[1rem] py-[.5rem] text-[1.3rem] text-text-light  ${
          theme === "light" ? "outline-gray-300" : "outline-gray-600"
        } bg-secondary rounded-md shadow-md`}
        value={currentValue || ""}
        onChange={(e) => setCurrentValue(+e.target.value)}
      />
    </>
  );
}

type PlotfieldSingsPromptTypes = {
  setShowSignModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentSign: React.Dispatch<React.SetStateAction<ConditionSignTypes>>;
  signName: ConditionSignTypes;
};

function PlotfieldIfSingsPrompt({
  setShowSignModal,
  setCurrentSign,
  signName,
}: PlotfieldSingsPromptTypes) {
  return (
    <AsideScrollableButton
      type="button"
      onClick={() => {
        setShowSignModal(false);
        setCurrentSign(signName);
      }}
    >
      {signName}
    </AsideScrollableButton>
  );
}
