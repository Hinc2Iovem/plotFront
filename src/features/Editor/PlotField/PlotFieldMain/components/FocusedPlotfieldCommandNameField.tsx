import useNavigation from "@/features/Editor/Context/Navigation/NavigationContext";
import PlotfieldCommandNameField from "@/ui/Texts/PlotfieldCommandNameField";
// nameValue is of type AllPossiblePlotfieldCommandTypes, but it's not user friendly so as for now it's of type string
type FocusedPlotfieldCommandNameFieldTypes = {
  nameValue: string;
  plotFieldCommandId: string;
};

export default function FocusedPlotfieldCommandNameField({
  nameValue,
  plotFieldCommandId,
}: FocusedPlotfieldCommandNameFieldTypes) {
  const isCommandFocused = plotFieldCommandId === useNavigation((state) => state.currentlyFocusedCommandId)._id;

  return (
    <div className="sm:w-[20%] min-w-[100px] relative">
      <PlotfieldCommandNameField className={`${isCommandFocused ? "bg-brand-gradient" : "bg-secondary"}`}>
        {nameValue}
      </PlotfieldCommandNameField>
    </div>
  );
}
