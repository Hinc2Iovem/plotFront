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
  const theme = localStorage.getItem("theme");
  return (
    <div className="relative self-end pr-[.2rem] pt-[.2rem]">
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
        className={`text-[1.3rem] ${
          theme === "light" ? "outline-gray-300" : "outline-gray-600"
        } text-text-light hover:text-text-light hover:bg-primary-darker transition-all focus-within:bg-primary-darker focus-within:text-text-light self-end shadow-md rounded-md px-[1rem] py-[.5rem] whitespace-nowrap`}
        type="button"
      >
        Сценарий
      </button>
    </div>
  );
}
