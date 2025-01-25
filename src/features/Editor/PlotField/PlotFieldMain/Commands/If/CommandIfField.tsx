import { useEffect, useState } from "react";
import useGetCommandIf from "../../../hooks/If/useGetCommandIf";
import CommandIfNameField from "./CommandIfNameField";
import useIfVariations from "./Context/IfContext";

type CommandIfFieldTypes = {
  plotFieldCommandId: string;
  topologyBlockId: string;
};

export default function CommandIfField({ plotFieldCommandId, topologyBlockId }: CommandIfFieldTypes) {
  const [hideIfCommands, setHideIfCommands] = useState(false);
  const { data: commandIf } = useGetCommandIf({
    plotFieldCommandId,
  });
  const [commandIfId, setCommandIfId] = useState("");
  const { setCommandIf } = useIfVariations();

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
    <div className="flex gap-[10px] w-full rounded-md flex-col">
      <CommandIfNameField
        plotfieldCommandId={plotFieldCommandId}
        createInsideElse={false}
        commandIfId={commandIfId}
        hideCommands={hideIfCommands}
        nameValue="if"
        setHideCommands={setHideIfCommands}
        topologyBlockId={topologyBlockId}
      />
    </div>
  );
}
