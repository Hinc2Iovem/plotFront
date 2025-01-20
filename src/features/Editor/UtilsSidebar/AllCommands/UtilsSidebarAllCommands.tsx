import { AllPossiblePlotFieldComamndsSaySubVariationsTypes } from "@/types/StoryEditor/PlotField/PlotFieldTypes";
import { UtilsSidebarAllPlotfieldCommandsTypes } from "./consts/UtilsSidebarAllPlotfieldCommands";
import { Button } from "@/components/ui/button";

type AllCommmandButtonsTypes = {
  pair: UtilsSidebarAllPlotfieldCommandsTypes[];
};

export default function AllCommmandButtons({ pair }: AllCommmandButtonsTypes) {
  return (
    <div className="flex mx-auto gap-[5px] items-center mt-[5px] translate-x-[3px]">
      {pair.map((p) => (
        <div key={p.commandNameFirst.name} className="flex">
          <PairOfCommands {...p} />
        </div>
      ))}
    </div>
  );
}

type PairOfCommandsTypes = {
  commandNameFirst: {
    name: AllPossiblePlotFieldComamndsSaySubVariationsTypes;
    src: string;
  };
  commandNameSecond: {
    name: AllPossiblePlotFieldComamndsSaySubVariationsTypes;
    src: string;
  };
};

function PairOfCommands({ commandNameFirst, commandNameSecond }: PairOfCommandsTypes) {
  return (
    <div className="flex gap-[5px]">
      <CommandButton buttonName={commandNameFirst.name} src={commandNameFirst.src} />
      <CommandButton buttonName={commandNameSecond.name} src={commandNameSecond.src} />
    </div>
  );
}

type CommandButtonTypes = {
  buttonName: AllPossiblePlotFieldComamndsSaySubVariationsTypes;
  src: string;
};

function CommandButton({ buttonName, src }: CommandButtonTypes) {
  return (
    <Button className="w-[50px] h-[50px] rounded-md relative bg-border hover:bg-brand-gradient active:scale-[.99] hover:shadow-brand-gradient-left hover:shadow-sm focus-within:bg-brand-gradient transition-all">
      <img
        draggable={false}
        src={src}
        alt={buttonName}
        className="w-[90%] absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
      />
    </Button>
  );
}
