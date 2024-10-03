import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useCreateCharacter from "../../../hooks/Posting/Character/useCreateCharacter";
import LightBox from "../../shared/utilities/LightBox";
import {
  CharacterTypes,
  SearchCharacterVariationTypes,
} from "../CharacterListPage";

type CharacterHeaderCreateCharacterModalTypes = {
  setShowCharacterModal: React.Dispatch<React.SetStateAction<boolean>>;
  showCharacterModal: boolean;
  debouncedValue: string;
  searchCharacterType: SearchCharacterVariationTypes;
};

export default function CharacterHeaderCreateCharacterModal({
  showCharacterModal,
  setShowCharacterModal,
  searchCharacterType,
  debouncedValue,
}: CharacterHeaderCreateCharacterModalTypes) {
  const { storyId } = useParams();
  const [characterType, setCharacterType] =
    useState<CharacterTypes>("EmptyCharacter");
  const [name, setName] = useState("");
  const [unknownName, setUnknownName] = useState("");
  const [nameTag, setNameTag] = useState("");
  const [description, setDescription] = useState("");

  const createCharacter = useCreateCharacter({
    characterType,
    name,
    searchCharacterType:
      searchCharacterType === "all"
        ? ("" as SearchCharacterVariationTypes)
        : searchCharacterType,
    storyId: storyId ?? "",
    description,
    nameTag,
    unknownName,
    debouncedValue,
  });

  useEffect(() => {
    if (createCharacter.isSuccess) {
      setName("");
      setUnknownName("");
      setNameTag("");
      setDescription("");
    }
  }, [showCharacterModal, createCharacter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      characterType === "EmptyCharacter" ||
      characterType === "MainCharacter"
    ) {
      if (!name.trim().length) {
        console.log("Name is required");
        return;
      }
    } else if (characterType === "MinorCharacter") {
      if (
        !unknownName.trim().length ||
        !description.trim().length ||
        !nameTag.trim().length
      ) {
        console.log("UnknownName, description and nameTag are required");
        return;
      }
    }

    createCharacter.mutate();
    setShowCharacterModal(false);
  };

  return (
    <>
      <aside
        className={`${
          showCharacterModal ? "" : "hidden"
        } fixed top-1/2 z-[4] -translate-y-1/2 left-1/2 -translate-x-1/2 bg-neutral-magnolia rounded-md ${
          characterType === "MinorCharacter" ? "min-h-[48rem]" : "min-h-[24rem]"
        } sm:w-[40rem] w-[30rem] p-[1rem]`}
      >
        <form className="flex flex-col gap-[2rem]" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-[1rem]">
            <h2 className="text-[2.5rem] text-accent-marine-blue">
              Тип персонажа
            </h2>
            <ul className="flex gap-[1rem] flex-wrap">
              <li>
                <button
                  type="button"
                  onClick={() => setCharacterType("EmptyCharacter")}
                  className={`text-[1.3rem] ${
                    characterType === "EmptyCharacter"
                      ? "bg-accent-marine-blue text-white"
                      : "bg-white text-black"
                  } p-[1rem] rounded-md transition-all hover:bg-accent-marine-blue hover:text-white shadow-sm`}
                >
                  Персонаж Третьего Плана
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setCharacterType("MinorCharacter")}
                  className={`text-[1.3rem] ${
                    characterType === "MinorCharacter"
                      ? "bg-accent-marine-blue text-white"
                      : "bg-white text-black"
                  } p-[1rem] rounded-md transition-all hover:bg-accent-marine-blue hover:text-white shadow-sm`}
                >
                  Второстепенный Персонаж
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setCharacterType("MainCharacter")}
                  className={`text-[1.3rem] ${
                    characterType === "MainCharacter"
                      ? "bg-accent-marine-blue text-white"
                      : "bg-white text-black"
                  } p-[1rem] rounded-md transition-all hover:bg-accent-marine-blue hover:text-white shadow-sm`}
                >
                  Главный Персонаж
                </button>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-[2rem]">
            <input
              type="text"
              className="text-[1.5rem] w-full p-[1rem] outline-none text-gray-700"
              placeholder="Имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {characterType === "MinorCharacter" && (
              <>
                <input
                  type="text"
                  className="text-[1.5rem] w-full p-[1rem] outline-none text-gray-700"
                  placeholder="Имя(Незнакомец)"
                  value={unknownName}
                  onChange={(e) => setUnknownName(e.target.value)}
                />
                <input
                  type="text"
                  className="text-[1.5rem] w-full p-[1rem] outline-none text-gray-700"
                  placeholder="nameTag"
                  value={nameTag}
                  onChange={(e) => setNameTag(e.target.value)}
                />
                <textarea
                  className="text-[1.5rem] w-full max-h-[9rem] p-[1rem] outline-none text-gray-700"
                  placeholder="Описание"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </>
            )}
          </div>
          <button className="self-end hover:scale-[1.01] hover:bg-accent-marine-blue hover:text-white transition-all active:scale-[0.99] text-[1.5rem] mt-auto p-[1rem] rounded-md shadow-sm bg-white">
            Завершить
          </button>
        </form>
      </aside>
      <LightBox
        isLightBox={showCharacterModal}
        setIsLightBox={setShowCharacterModal}
      />
    </>
  );
}
