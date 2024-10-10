import useChoiceOptions from "../Context/ChoiceContext";

type ChoiceOptionShowPlotTypes = {
  setShowOptionPlot: React.Dispatch<React.SetStateAction<boolean>>;
  topologyBlockId: string;
  choiceId: string;
  choiceOptionId: string;
};

export default function ChoiceOptionShowPlot({
  setShowOptionPlot,
  topologyBlockId,
  choiceId,
  choiceOptionId,
}: ChoiceOptionShowPlotTypes) {
  const { updateCurrentlyOpenChoiceOption } = useChoiceOptions();
  return (
    <div className="relative self-end pr-[.2rem] pb-[.2rem]">
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (topologyBlockId) {
            setShowOptionPlot(true);
            updateCurrentlyOpenChoiceOption({
              topologyBlockId,
              choiceId,
              choiceOptionId,
            });
          } else {
            console.error("Choose TopologyBlock,firstly");
          }
        }}
        className="text-[1.3rem] hover:text-white hover:bg-primary-pastel-blue transition-all focus-within:bg-primary-pastel-blue focus-within:text-white self-end outline-none text-gray-700 shadow-md rounded-md px-[1rem] py-[.5rem] whitespace-nowrap"
        type="button"
      >
        Сценарий
      </button>
    </div>
  );
}
