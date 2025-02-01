import useNavigation from "@/features/Editor/Context/Navigation/NavigationContext";
// nameValue is of type AllPossiblePlotfieldCommandTypes, but it's not user friendly so as for now it's of type string
type FocusedPlotfieldCommandNameFieldTypes = {
  nameValue: string;
  plotFieldCommandId: string;
  classes?: string;
  paraghClasses?: string;
};

export default function FocusedPlotfieldCommandNameField({
  nameValue,
  plotFieldCommandId,
  classes,
  paraghClasses,
}: FocusedPlotfieldCommandNameFieldTypes) {
  const isCommandFocused = plotFieldCommandId === useNavigation((state) => state.currentlyFocusedCommandId)._id;

  return (
    <div className={`${classes ? classes : "sm:w-[20%]"} min-w-[100px] relative`}>
      <p
        className={`${paraghClasses ? paraghClasses : "text-[17px] text-start"} ${
          isCommandFocused ? "bg-brand-gradient" : "bg-secondary"
        } min-w-fit text-text w-full capitalize px-[10px] py-[5px] rounded-md shadow-md transition-all cursor-default`}
      >
        {nameValue}
      </p>
    </div>
  );
}
