import { useRef, useState } from "react";
import useOutOfModal from "../../../../../../hooks/UI/useOutOfModal";

const CHARACTER_TYPES = [
  "Обычный Персонаж",
  "Второстепенный Персонаж",
  "Главный Персонаж",
];

type CharacterTypesDropDownTypes = {
  characterType: string;
  setCharacterTypeRus: React.Dispatch<React.SetStateAction<string>>;
  setCharacterTypeEng: React.Dispatch<React.SetStateAction<string>>;
};

export default function CharacterTypesDropDown({
  characterType,
  setCharacterTypeRus,
  setCharacterTypeEng,
}: CharacterTypesDropDownTypes) {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useOutOfModal({ modalRef, setShowModal, showModal });
  return (
    <div className="bg-secondary rounded-md shadow-md relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowModal((prev) => !prev);
        }}
        className="text-[1.3rem] text-center px-[1rem] py-[.5rem] whitespace-nowrap"
      >
        {characterType || "Тип Персонажа"}
      </button>
      <aside
        ref={modalRef}
        className={`${
          showModal ? "" : "hidden"
        } overflow-auto flex flex-col gap-[.5rem] min-w-fit w-full absolute bg-secondary rounded-md shadow-md translate-y-[.5rem] p-[1rem] right-0`}
      >
        {CHARACTER_TYPES.map((ct) => (
          <button
            key={ct}
            type="button"
            onClick={() => {
              if (ct === characterType) {
                setCharacterTypeRus("");
                setCharacterTypeEng("");
              } else {
                setCharacterTypeRus(ct);
                const characterTypeToEng =
                  ct === "Обычный Персонаж"
                    ? "emptycharacter"
                    : ct === "Второстепенный Персонаж"
                    ? "minorcharacter"
                    : "maincharacter";
                setCharacterTypeEng(characterTypeToEng);
              }
              setShowModal(false);
            }}
            className={`${
              ct === characterType
                ? "bg-primary-darker text-text-dark"
                : " text-gray-600 bg-secondary"
            } text-[1.4rem] outline-gray-300 text-start hover:bg-primary-darker hover:text-text-dark rounded-md px-[1rem] py-[.5rem] hover:shadow-md`}
          >
            {ct === "Главный Персонаж"
              ? ct
              : ct === "Обычный Персонаж"
              ? "Обычные Персонажи"
              : "Второстепенные Персонажи"}
          </button>
        ))}
      </aside>
    </div>
  );
}
