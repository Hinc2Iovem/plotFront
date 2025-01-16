import PlotfieldCommandNameField from "../../../../../../ui/Texts/PlotfieldCommandNameField";
import useGetCurrentFocusedElement from "../../../hooks/helpers/useGetCurrentFocusedElement";

type CommandElseFieldTypes = {
  plotFieldCommandId: string;
};

export default function CommandEndField({ plotFieldCommandId }: CommandElseFieldTypes) {
  const isCommandFocused = useGetCurrentFocusedElement()._id === plotFieldCommandId;

  return (
    <div
      className={`${
        isCommandFocused ? "bg-brand-gradient" : "bg-secondary"
      } min-w-[10rem] w-full rounded-md relative flex items-center gap-[1rem] p-[.5rem]`}
    >
      <PlotfieldCommandNameField className={`shadow-none`}>End</PlotfieldCommandNameField>
    </div>
  );
}
