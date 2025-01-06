import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import useGetCurrentFocusedElement from "../../../hooks/helpers/useGetCurrentFocusedElement";

type CommandElseFieldTypes = {
  plotFieldCommandId: string;
};

export default function CommandEndField({ plotFieldCommandId }: CommandElseFieldTypes) {
  const isCommandFocused = useGetCurrentFocusedElement()._id === plotFieldCommandId;

  return (
    <div className="min-w-[10rem] bg-primary rounded-md w-full relative flex items-center gap-[1rem] p-[.5rem]">
      <PlotfieldCommandNameField
        className={`${
          isCommandFocused
            ? "bg-gradient-to-r from-brand-gradient-left from-0% to-brand-gradient-right to-90%"
            : "bg-secondary"
        }`}
      >
        End
      </PlotfieldCommandNameField>
    </div>
  );
}
