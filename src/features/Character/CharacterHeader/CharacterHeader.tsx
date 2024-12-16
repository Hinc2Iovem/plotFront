import { useState } from "react";
import createCharacter from "../../../assets/images/Character/createCharacter.png";
import ButtonHoverPromptModal from "../../../ui/ButtonAsideHoverPromptModal/ButtonHoverPromptModal";
import CharacterHeaderCreateCharacterModal from "./CharacterHeaderCreateCharacterModal";
import CharacterHeaderSearchTypeBtns from "./CharacterHeaderSearchTypeBtns";
import { SearchCharacterVariationTypes } from "../CharacterListPage";

type CharacterHeaderTypes = {
  setSearchCharacterType: React.Dispatch<React.SetStateAction<SearchCharacterVariationTypes>>;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  searchCharacterType: SearchCharacterVariationTypes;
  searchValue: string;
  debouncedValue: string;
};

export default function CharacterHeader({
  searchCharacterType,
  searchValue,
  setSearchCharacterType,
  setSearchValue,
  debouncedValue,
}: CharacterHeaderTypes) {
  const [showCharacterModal, setShowCharacterModal] = useState(false);

  return (
    <>
      <header className="flex flex-col w-full gap-[1rem]">
        <div className="flex justify-between flex-wrap gap-[1rem] items-center">
          <form>
            <input
              type="text"
              className="text-[1.5rem] text-text-light px-[1rem] py-[.5rem] rounded-md outline-none shadow-md text-gray-700"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Майки"
            />
          </form>
          <ButtonHoverPromptModal
            onClick={() => setShowCharacterModal(true)}
            positionByAbscissa="right"
            marginAutoSide="ml-auto"
            contentName="Создать Персонажа"
            asideClasses="text-[1.3rem] top-[4.5rem] bottom-[-3.3rem] text-text-light"
            className="active:scale-[0.99] hover:scale-[1.01] bg-secondary"
          >
            <img src={createCharacter} alt="CreateCharacter" className="w-[4rem]" />
          </ButtonHoverPromptModal>
        </div>
        <CharacterHeaderSearchTypeBtns
          setSearchCharacterType={setSearchCharacterType}
          searchCharacterType={searchCharacterType}
        />
      </header>

      <CharacterHeaderCreateCharacterModal
        debouncedValue={debouncedValue}
        searchCharacterType={searchCharacterType}
        setShowCharacterModal={setShowCharacterModal}
        showCharacterModal={showCharacterModal}
      />
    </>
  );
}
