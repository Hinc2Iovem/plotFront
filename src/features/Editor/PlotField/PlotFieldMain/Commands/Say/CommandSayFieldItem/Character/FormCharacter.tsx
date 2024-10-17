import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useGetTranslationCharacters from "../../../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacters";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import { EmotionsTypes } from "../../../../../../../../types/StoryData/Character/CharacterTypes";
import AsideScrollable from "../../../../../../../shared/Aside/AsideScrollable/AsideScrollable";
import AsideScrollableButton from "../../../../../../../shared/Aside/AsideScrollable/AsideScrollableButton";
import PlotfieldInput from "../../../../../../../shared/Inputs/PlotfieldInput";
import useUpdateNameOrEmotion from "../../../hooks/Say/useUpdateNameOrEmotion";
import CommandSayCreateCharacterFieldModal from "./ModalCreateCharacter/CommandSayCreateCharacterFieldModal";

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
          <PlotfieldInput
            type="text"
            value={nameValue}
            onClick={(e) => {
              e.stopPropagation();
              setShowCharacters((prev) => !prev);
              setShowAllEmotions(false);
            }}
            placeholder="Персонаж"
            onChange={(e) => {
              setNameValue(e.target.value);
              setShowCharacters(true);
            }}
          />
          <AsideScrollable
            ref={charactersRef}
            className={`${
              showCharacters && !showCreateCharacterModal ? "" : "hidden"
            } translate-y-[.5rem]`}
          >
            <ul className="flex flex-col gap-[1rem] p-[.2rem]">
              {allNamesFiltered.length ? (
                allNamesFiltered?.map((nf, i) => {
                  return (
                    <li className="w-full" key={nf + "-" + i}>
                      <AsideScrollableButton
                        onClick={(e) => {
                          setNameValue(nf);
                          setShowCharacters(false);
                          handleNameFormSubmit(e, nf);
                        }}
                      >
                        {nf}
                      </AsideScrollableButton>
                    </li>
                  );
                })
              ) : !nameValue?.trim().length ? (
                <li>
                  <AsideScrollableButton>Пусто</AsideScrollableButton>
                </li>
              ) : null}
            </ul>
          </AsideScrollable>
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
