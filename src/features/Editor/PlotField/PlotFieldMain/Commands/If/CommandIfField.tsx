import { useEffect, useState } from "react";
import useGetCurrentFocusedElement from "../../../hooks/helpers/useGetCurrentFocusedElement";
import useGetCommandIf from "../../../hooks/If/useGetCommandIf";
import CommandIfNameField from "./CommandIfNameField";
import useIfVariations from "./Context/IfContext";
import IfVariationsField from "./Variations/IfVariationsField";

type CommandIfFieldTypes = {
  plotFieldCommandId: string;
  command: string;
  topologyBlockId: string;
};

export default function CommandIfField({ plotFieldCommandId, topologyBlockId }: CommandIfFieldTypes) {
  const [hideIfCommands, setHideIfCommands] = useState(false);
  const { data: commandIf } = useGetCommandIf({
    plotFieldCommandId,
  });

  const isCommandFocused = useGetCurrentFocusedElement()._id === plotFieldCommandId;

  const [commandIfId, setCommandIfId] = useState("");
  const { setCommandIf, getAllLogicalOperators } = useIfVariations();

  useEffect(() => {
    if (commandIf) {
      setCommandIf({
        ifVariations: [],
        logicalOperators: commandIf.logicalOperator || "",
        plotfieldCommandId: plotFieldCommandId,
      });
      setCommandIfId(commandIf._id);
    }
  }, [commandIf]);

  return (
    <div className="flex gap-[1rem] w-full bg-primary-darker rounded-md p-[.5rem] flex-col">
      <CommandIfNameField
        plotfieldCommandId={plotFieldCommandId}
        createInsideElse={false}
        commandIfId={commandIfId}
        hideCommands={hideIfCommands}
        isCommandFocused={isCommandFocused}
        nameValue="if"
        setHideCommands={setHideIfCommands}
        topologyBlockId={topologyBlockId}
      />

      <IfVariationsField
        ifId={commandIfId}
        plotfieldCommandId={plotFieldCommandId}
        logicalOperators={getAllLogicalOperators({ plotfieldCommandId: plotFieldCommandId })}
        topologyBlockId={topologyBlockId}
      />
    </div>
  );
}
