import { ChoiceOptionVariationsTypes } from "../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";
import ButtonHoverPromptModal from "../../../../../../ui/ButtonAsideHoverPromptModal/ButtonHoverPromptModal";
import amethyst from "../../../../../../assets/images/Editor/amethyst.png";
import common from "../../../../../../assets/images/Editor/blank.png";
import relationship from "../../../../../../assets/images/Editor/relationship.png";
import characteristic from "../../../../../../assets/images/Story/characteristic.png";

type ShowOptionVariationsModalTypes = {
  userId: string;
  showOptionVariations: boolean;
  currentDefaultChoiceOption: string;
  optionVariations: ChoiceOptionVariationsTypes[];
  setOptionVariations: React.Dispatch<React.SetStateAction<ChoiceOptionVariationsTypes[]>>;
};

export default function ShowOptionVariationsModal({
  userId,
  showOptionVariations,
  currentDefaultChoiceOption,
  optionVariations,
  setOptionVariations,
}: ShowOptionVariationsModalTypes) {
  return (
    <div
      className={`absolute ${
        showOptionVariations ? "" : "hidden"
      } top-[4rem] flex gap-[.5rem] shadow-md bg-secondary rounded-md w-fit`}
    >
      <OptionVariationItem
        currentDefaultChoiceOption={currentDefaultChoiceOption}
        optionVariations={optionVariations}
        userId={userId}
        positionByAbscissa={"left"}
        alt={"premium"}
        contentName="Premium"
        src={amethyst}
        setOptionVariations={setOptionVariations}
      />
      <OptionVariationItem
        currentDefaultChoiceOption={currentDefaultChoiceOption}
        optionVariations={optionVariations}
        userId={userId}
        positionByAbscissa={"left"}
        alt={"relationship"}
        contentName="Relationship"
        src={relationship}
        setOptionVariations={setOptionVariations}
      />
      <OptionVariationItem
        currentDefaultChoiceOption={currentDefaultChoiceOption}
        optionVariations={optionVariations}
        userId={userId}
        positionByAbscissa={"right"}
        alt={"characteristic"}
        contentName="Characteristic"
        src={characteristic}
        setOptionVariations={setOptionVariations}
      />
      <OptionVariationItem
        currentDefaultChoiceOption={currentDefaultChoiceOption}
        optionVariations={optionVariations}
        userId={userId}
        alt={"common"}
        positionByAbscissa={"right"}
        contentName="Common"
        src={common}
        setOptionVariations={setOptionVariations}
      />
    </div>
  );
}

const MAX_AMOUNT_OF_OPTIONS = 7;

type OptionVariationItemTypes = {
  contentName: string;
  src: string;
  currentDefaultChoiceOption: string;
  userId: string;
  alt: ChoiceOptionVariationsTypes;
  positionByAbscissa: "right" | "left";
  optionVariations: ChoiceOptionVariationsTypes[];
  setOptionVariations: React.Dispatch<React.SetStateAction<ChoiceOptionVariationsTypes[]>>;
};

function OptionVariationItem({
  alt,
  contentName,
  src,
  positionByAbscissa,
  optionVariations,
  currentDefaultChoiceOption,
  userId,
  setOptionVariations,
}: OptionVariationItemTypes) {
  const handleAdding = () => {
    if (optionVariations.length < MAX_AMOUNT_OF_OPTIONS) {
      setOptionVariations((prev) => {
        return [...prev, alt];
      });
      if (currentDefaultChoiceOption?.trim().length) {
        const defaultOptions = localStorage.getItem(`${userId},choiceOption,${currentDefaultChoiceOption}`);
        localStorage.setItem(`${userId},choiceOption,${currentDefaultChoiceOption}`, `${defaultOptions},${alt}`);
      }
    } else {
      console.log("Не более 7 ответов");

      return;
    }
  };
  return (
    <ButtonHoverPromptModal
      contentName={contentName}
      onClick={handleAdding}
      positionByAbscissa={positionByAbscissa}
      className="w-[3rem] rounded-md"
      positionForDiv="relative"
      asideClasses="absolute -translate-y-[7.5rem] text-[1.3rem]"
    >
      <img src={src} alt={alt} className="w-full object-cover" />
    </ButtonHoverPromptModal>
  );
}
