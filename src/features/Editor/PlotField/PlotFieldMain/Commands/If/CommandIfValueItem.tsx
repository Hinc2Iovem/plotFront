import { useEffect, useState } from "react";
import { IfValueTypes } from "../../../../../../types/StoryEditor/PlotField/IfCommand/IfCommandTypes";
import useUpdateIfConditionValue from "../hooks/If/Values/useUpdateIfConditionValue";
import { PlotfieldSingsPrompt } from "../Condition/ConditionValueItem";
import { AllConditionSigns } from "../../../../../../types/StoryEditor/PlotField/Condition/ConditionTypes";
import useEscapeOfModal from "../../../../../../hooks/UI/useEscapeOfModal";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";

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
        className="flex-grow px-[1rem] py-[.5rem] text-[1.3rem] text-gray-700 outline-gray-300 bg-white rounded-md shadow-md"
        value={currentName}
        onChange={(e) => setCurrentName(e.target.value)}
      />
      <div className="relative flex-grow">
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
        className="flex-grow px-[1rem] py-[.5rem] text-[1.3rem] text-gray-700 outline-gray-300 bg-white rounded-md shadow-md"
        value={currentValue || ""}
        onChange={(e) => setCurrentValue(+e.target.value)}
      />
    </>
  );
}
