import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useGetTranslationCharacters from "../../../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacters";
import useUpdateNameOrEmotion from "../../../hooks/Say/useUpdateNameOrEmotion";
import CommandSayCreateCharacterFieldModal from "./ModalCreateCharacter/CommandSayCreateCharacterFieldModal";
import { EmotionsTypes } from "../../../../../../../../types/StoryData/Character/CharacterTypes";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";

type FormCharacterTypes = {
  nameValue: string;
  setNameValue: React.Dispatch<React.SetStateAction<string>>;
  plotFieldCommandSayId: string;
  plotFieldCommandId: string;
  setShowCreateCharacterModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEmotionValue: React.Dispatch<React.SetStateAction<EmotionsTypes | null>>;
  setShowCharacters: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAllEmotions: React.Dispatch<React.SetStateAction<boolean>>;
  showCharacters: boolean;
  showCreateCharacterModal: boolean;
};

export default function FormCharacter({
  plotFieldCommandId,
  plotFieldCommandSayId,
  nameValue,
  setNameValue,
  setEmotionValue,
  setShowCreateCharacterModal,
  setShowCharacters,
  setShowAllEmotions,
  showCharacters,
  showCreateCharacterModal,
}: FormCharacterTypes) {
  const charactersRef = useRef<HTMLDivElement>(null);
  const { storyId } = useParams();
  const [newCharacterId, setNewCharacterId] = useState("");
  const theme = localStorage.getItem("theme");

  const updateNameOrEmotion = useUpdateNameOrEmotion({
    characterId: newCharacterId,
    plotFieldCommandId,
    plotFieldCommandSayId,
  });

  const { data: translatedCharacters } = useGetTranslationCharacters({
    storyId: storyId ?? "",
    language: "russian",
  });

  const allNames = useMemo(() => {
    if (translatedCharacters) {
      const names = translatedCharacters.map((tc) =>
        (tc.translations || [])[0].text.toLowerCase()
      );
      return names;
    }
    return [];
  }, [translatedCharacters]);

  const allNamesFiltered = useMemo(() => {
    if (translatedCharacters) {
      if (nameValue) {
        const onlyNames = translatedCharacters.map((tc) =>
          (tc.translations || [])[0].text.toLowerCase()
        );
        const names = onlyNames.filter((tc) =>
          tc.includes(nameValue.toLowerCase())
        );
        return names;
      } else {
        const names = translatedCharacters.map((tc) =>
          (tc.translations || [])[0].text.toLowerCase()
        );
        return names;
      }
    } else {
      return [];
    }
  }, [translatedCharacters, nameValue]);

  useEffect(() => {
    if (newCharacterId?.trim().length) {
      updateNameOrEmotion.mutate();
      setEmotionValue(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newCharacterId]);

  const handleNameFormSubmit = (e: React.FormEvent, nf?: string) => {
    e.preventDefault();
    if (!nameValue?.trim().length && !nf?.trim().length) {
      console.log("Заполните поле");
      return;
    }
    if (
      allNames.includes(nameValue.toLowerCase()) ||
      (nf && allNames.includes(nf.toLowerCase()))
    ) {
      translatedCharacters?.map((tc) => {
        if (
          tc.translations?.find(
            (tct) =>
              tct.text.toLowerCase() === nameValue.toLowerCase() ||
              (nf && tct.text.toLowerCase() === nf.toLowerCase())
          )
        ) {
          setNewCharacterId(tc.characterId);
          setEmotionValue(null);
        }
      });
    } else {
      setShowCreateCharacterModal(true);
      return;
    }
  };

  useOutOfModal({
    modalRef: charactersRef,
    setShowModal: setShowCharacters,
    showModal: showCharacters,
  });

  return (
    <>
      <form
        onSubmit={handleNameFormSubmit}
        className={`${showCharacters ? "z-[10]" : ""} w-full`}
      >
        <div className="relative w-full">
          <input
            type="text"
            value={nameValue}
            onClick={(e) => {
              e.stopPropagation();
              setShowCharacters((prev) => !prev);
              setShowAllEmotions(false);
            }}
            placeholder="Персонаж"
            className={`text-[1.3rem] w-full ${
              theme === "light" ? "outline-gray-300" : "outline-gray-600"
            } px-[1rem] py-[.5rem] text-text-light rounded-md shadow-md capitalize`}
            onChange={(e) => {
              setNameValue(e.target.value);
              setShowCharacters(true);
            }}
          />
          <aside
            ref={charactersRef}
            className={`absolute ${
              showCharacters && !showCreateCharacterModal ? "" : "hidden"
            } z-[2] w-full bg-secondary translate-y-[.5rem] shadow-md rounded-md max-h-[15rem] overflow-y-auto | containerScroll `}
          >
            <ul className="flex flex-col gap-[1rem] p-[.2rem]">
              {allNamesFiltered.length ? (
                allNamesFiltered?.map((nf, i) => {
                  return (
                    <li className="w-full" key={nf + "-" + i}>
                      <button
                        onClick={(e) => {
                          setNameValue(nf);
                          setShowCharacters(false);
                          handleNameFormSubmit(e, nf);
                        }}
                        className={`w-full text-start text-[1.4rem] px-[1rem] py-[.5rem] bg-secondary ${
                          theme === "light"
                            ? "outline-gray-300"
                            : "outline-gray-600"
                        } hover:bg-primary-darker focus-within:bg-primary-darker focus-within:text-text-light hover:text-text-light text-text-dark transition-all`}
                      >
                        {nf}
                      </button>
                    </li>
                  );
                })
              ) : !nameValue?.trim().length ? (
                <li>
                  <button
                    className={`w-full text-start text-[1.4rem] px-[1rem] py-[.5rem] bg-secondary ${
                      theme === "light"
                        ? "outline-gray-300"
                        : "outline-gray-600"
                    } hover:bg-primary-darker focus-within:bg-primary-darker focus-within:text-text-light hover:text-text-light text-text-dark transition-all`}
                  >
                    Пусто
                  </button>
                </li>
              ) : null}
            </ul>
          </aside>
        </div>
      </form>
      <CommandSayCreateCharacterFieldModal
        setEmotionValue={setEmotionValue}
        characterName={nameValue}
        commandSayId={plotFieldCommandSayId}
        plotFieldCommandId={plotFieldCommandId}
        setShowModal={setShowCreateCharacterModal}
        showModal={showCreateCharacterModal}
      />
    </>
  );
}
