import PlotfieldButton from "../../../../../../../../../ui/Buttons/PlotfieldButton";

export default function ConditionBlockVariationRandom() {
  return (
    <div className="relative w-full">
      <PlotfieldButton
        type="button"
        className={`bg-blue-600 active:bg-blue-600 focus-within:bg-blue-600 hover:bg-blue-500 text-text-light w-full`}
      >
        Рандом
      </PlotfieldButton>
    </div>
  );
}
