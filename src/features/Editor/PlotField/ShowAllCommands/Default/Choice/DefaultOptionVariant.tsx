import { ChoiceOptionVariationsTypes } from "../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";

type DefaultOptionVariantTypes = {
  gi: [
    string,
    {
      key: string;
      value: string;
    }
  ];
  currentDefaultChoiceOption: string;
  setCurrentDefaultChoiceOption: React.Dispatch<React.SetStateAction<string>>;
  setOptionVariations: React.Dispatch<
    React.SetStateAction<ChoiceOptionVariationsTypes[]>
  >;
};

export default function DefaultOptionVariant({
  gi,
  currentDefaultChoiceOption,
  setCurrentDefaultChoiceOption,
  setOptionVariations,
}: DefaultOptionVariantTypes) {
  return (
    <button
      onClick={() => {
        if (gi[0] === currentDefaultChoiceOption) {
          setCurrentDefaultChoiceOption("");
          setOptionVariations([]);
        } else {
          setCurrentDefaultChoiceOption(gi[0]);
          setOptionVariations(
            gi[1].value.split(",") as ChoiceOptionVariationsTypes[]
          );
        }
      }}
      className={`${
        gi[0] === currentDefaultChoiceOption
          ? "bg-primary-darker text-text-dark"
          : "hover:bg-primary-darker hover:text-text-dark bg-secondary text-black"
      } w-[3rem] rounded-md shadow-md text-[1.5rem]  transition-all`}
    >
      {gi[0]}
    </button>
  );
}
