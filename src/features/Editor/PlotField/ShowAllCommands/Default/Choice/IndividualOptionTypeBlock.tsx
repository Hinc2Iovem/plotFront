import { ChoiceOptionVariationsTypes } from "../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import amethyst from "../../../../../../assets/images/Editor/amethyst.png";
import common from "../../../../../../assets/images/Editor/blank.png";
import relationship from "../../../../../../assets/images/Editor/relationship.png";
import characteristic from "../../../../../../assets/images/Story/characteristic.png";

type IndividualOptionTypeBlockTypes = {
  ov: string;
  i: number;
  userId: string;
  currentDefaultChoiceOption: string;
  setOptionVariations: React.Dispatch<
    React.SetStateAction<ChoiceOptionVariationsTypes[]>
  >;
  setGroupedItems: React.Dispatch<
    React.SetStateAction<
      Record<
        string,
        {
          key: string;
          value: string;
        }
      >
    >
  >;
};

export default function IndividualOptionTypeBlock({
  i,
  ov,
  userId,
  currentDefaultChoiceOption,
  setOptionVariations,
  setGroupedItems,
}: IndividualOptionTypeBlockTypes) {
  const handleRemovingBlock = () => {
    if (currentDefaultChoiceOption?.trim().length) {
      const currentDefault =
        localStorage
          .getItem(`${userId},choiceOption,${currentDefaultChoiceOption}`)
          ?.split(",") || [];
      const updatedDefault = currentDefault.filter((_, index) => index !== i);
      localStorage.removeItem(
        `${userId},choiceOption,${currentDefaultChoiceOption}`
      );
      if (updatedDefault.length) {
        localStorage.setItem(
          `${userId},choiceOption,${currentDefaultChoiceOption}`,
          updatedDefault.toString()
        );
      } else {
        setGroupedItems((prev) => {
          return Object.fromEntries(
            Object.entries(prev).filter(
              (p) => p[1].key !== currentDefaultChoiceOption
            )
          );
        });
      }
    }
    setOptionVariations((prev) => {
      const newArray = prev.filter((_, index) => index !== i);
      return newArray;
    });
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleRemovingBlock();
      }}
      className="w-[3rem] max-w-[3.5rem] flex-grow rounded-md shadow-md"
    >
      <img
        src={
          ov === "characteristic"
            ? characteristic
            : ov === "common"
            ? common
            : ov === "premium"
            ? amethyst
            : relationship
        }
        alt={ov}
      />
    </button>
  );
}
