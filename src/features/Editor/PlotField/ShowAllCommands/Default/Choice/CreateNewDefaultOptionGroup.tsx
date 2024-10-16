import { ChoiceOptionVariationsTypes } from "../../../../../../types/StoryEditor/PlotField/Choice/ChoiceTypes";

type CreateNewDefaultOptionGroupTypes = {
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
  setCurrentDefaultChoiceOption: React.Dispatch<React.SetStateAction<string>>;
  optionVariations: ChoiceOptionVariationsTypes[];
  amountOfKeys: number;
  userId: string;
};

export default function CreateNewDefaultOptionGroup({
  setGroupedItems,
  setCurrentDefaultChoiceOption,
  optionVariations,
  amountOfKeys,
  userId,
}: CreateNewDefaultOptionGroupTypes) {
  const handleCreatingDefaultOptions = () => {
    if (!optionVariations.length) {
      console.log("Выберите хотябы 1 тип ответа");
      return;
    }

    localStorage.setItem(
      `${userId},choiceOption,v${amountOfKeys + 1}`,
      optionVariations.toString()
    );
    setGroupedItems((prev) => {
      const newItemKey = `v${amountOfKeys + 1}`;
      const item = {
        key: newItemKey,
        value: optionVariations.toString(),
      };
      setCurrentDefaultChoiceOption(`v${amountOfKeys + 1}`);
      return {
        ...prev,
        [newItemKey]: item,
      };
    });
  };

  return (
    <div className="flex flex-col w-full gap-[1rem] border-black">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleCreatingDefaultOptions();
        }}
        className="w-[90%] mx-auto mb-[1rem] text-[1.4rem] px-[1rem] py-[.5rem] shadow-md hover:text-text-dark hover:bg-primary-darker transition-all rounded-md"
      >
        Добавить Заготовку
      </button>
    </div>
  );
}
