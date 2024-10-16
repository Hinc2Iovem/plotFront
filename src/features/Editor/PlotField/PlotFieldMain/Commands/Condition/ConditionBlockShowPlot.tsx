import useConditionBlocks from "./Context/ConditionContext";

type ConditionBlockShowPlotTypes = {
  setShowConditionBlockPlot: React.Dispatch<React.SetStateAction<boolean>>;
  targetBlockId: string;
  plotfieldCommandId: string;
  conditionBlockId: string;
};

export default function ConditionBlockShowPlot({
  setShowConditionBlockPlot,
  targetBlockId,
  plotfieldCommandId,
  conditionBlockId,
}: ConditionBlockShowPlotTypes) {
  const { updateCurrentlyOpenConditionBlock } = useConditionBlocks();
  const theme = localStorage.getItem("theme");
  return (
    <div className="relative flex-grow">
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (targetBlockId) {
            setShowConditionBlockPlot(true);
            updateCurrentlyOpenConditionBlock({
              targetBlockId,
              conditionBlockId,
              plotfieldCommandId,
            });
          } else {
            console.error("Choose TopologyBlock,firstly");
          }
        }}
        className={`text-[1.4rem] w-full text-text-light ${
          theme === "light" ? "outline-gray-300" : "outline-gray-600"
        } hover:bg-primary-darker transition-all focus-within:bg-primary-darker shadow-md rounded-md px-[1rem] py-[.5rem] whitespace-nowrap`}
        type="button"
      >
        Сценарий
      </button>
    </div>
  );
}
