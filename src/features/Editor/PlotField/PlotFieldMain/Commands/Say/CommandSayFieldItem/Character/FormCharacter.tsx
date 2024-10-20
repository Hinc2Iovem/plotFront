import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useGetTranslationCharacters from "../../../../../../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacters";
import useOutOfModal from "../../../../../../../../hooks/UI/useOutOfModal";
import { EmotionsTypes } from "../../../../../../../../types/StoryData/Character/CharacterTypes";
import PlotfieldInput from "../../../../../../../shared/Inputs/PlotfieldInput";
import useUpdateNameOrEmotion from "../../../hooks/Say/useUpdateNameOrEmotion";
import PlotfieldCharacterPromptMain from "../../../Prompts/Characters/PlotfieldCharacterPromptMain";
import CommandSayCreateCharacterFieldModal from "./ModalCreateCharacter/CommandSayCreateCharacterFieldModal";
import useDebounce from "../../../../../../../../hooks/utilities/useDebounce";
import { useQueryClient } from "@tanstack/react-query";

type FormCharacterTypes = {
  nameValue: string;
  plotFieldCommandSayId: string;
  plotFieldCommandId: string;
  setShowCreateCharacterModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEmotionValue: React.Dispatch<React.SetStateAction<EmotionsTypes | null>>;
  setNameValue: React.Dispatch<React.SetStateAction<string>>;
  setShowCharacters: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAllEmotions: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentCharacterId: React.Dispatch<React.SetStateAction<string>>;
  showCharacters: boolean;
  showCreateCharacterModal: boolean;
  currentCharacterId: string;
  currentCharacterImg: string;
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
  currentCharacterId,
  setCurrentCharacterId,
  showCharacters,
  showCreateCharacterModal,
  currentCharacterImg,
}: FormCharacterTypes) {
  const queryClient = useQueryClient();
  const charactersRef = useRef<HTMLDivElement>(null);
  const { storyId } = useParams();
  const [newlyCreated, setNewlyCreated] = useState(false);
  const [newlyCreatedName, setNewlyCreatedName] = useState("");
  const [characterImg, setCharacterImg] = useState("");

  const updateNameOrEmotion = useUpdateNameOrEmotion({
    characterId: currentCharacterId,
    plotFieldCommandId,
    plotFieldCommandSayId,
  });

  const debouncedValue = useDebounce({ value: nameValue, delay: 700 });

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

  useEffect(() => {
    if (currentCharacterId?.trim().length) {
      updateNameOrEmotion.mutate();
      setEmotionValue(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCharacterId]);

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
          setCurrentCharacterId(tc.characterId);
          setNameValue((tc.translations || [])[0]?.text);
          setEmotionValue(null);
        }
      });
    } else {
      setShowCreateCharacterModal(true);
      return;
    }
  };

  useEffect(() => {
    if (debouncedValue?.trim().length && !showCharacters) {
      console.log(newlyCreated);
      if (newlyCreated) {
        if (newlyCreatedName !== nameValue) {
          console.log("obnyliaem emotion");
          setEmotionValue(null);
          return;
        }
        return;
      }

      setNewlyCreated(false);
      const matchedCharacter = translatedCharacters?.find((tc) =>
        tc.translations?.find(
          (tct) =>
            tct.textFieldName === "characterName" &&
            tct.text?.toLowerCase() === nameValue.toLowerCase()
        )
      );

      if (matchedCharacter) {
        setCurrentCharacterId(matchedCharacter.characterId);
        setNameValue((matchedCharacter.translations || [])[0].text);
        queryClient.invalidateQueries({
          queryKey: ["character", currentCharacterId],
        });
        updateNameOrEmotion.mutate();
      } else {
        if (!currentCharacterId?.trim().length) {
          setCurrentCharacterId("");
          setCharacterImg("");
          setNameValue("");
        }
        queryClient.invalidateQueries({
          queryKey: ["character", currentCharacterId],
        });
      }
    }
  }, [
    debouncedValue,
    translatedCharacters,
    showCharacters,
    newlyCreated,
    currentCharacterId,
  ]);

  useOutOfModal({
    modalRef: charactersRef,
    setShowModal: setShowCharacters,
    showModal: showCharacters,
  });

  return (
    <>
      <form
        onSubmit={handleNameFormSubmit}
        className={`${showCharacters ? "z-[10]" : ""} w-full relative`}
      >
        <PlotfieldInput
          onClick={(e) => {
            e.stopPropagation();
            setShowCharacters(true);
            setShowAllEmotions(false);
          }}
          value={nameValue}
          onChange={(e) => {
            setShowCharacters(true);
            setShowAllEmotions(false);
            setNameValue(e.target.value);
          }}
          placeholder="Имя Персонажа"
        />

        <img
          src={currentCharacterImg}
          alt="CharacterImg"
          className={`${
            currentCharacterImg?.trim().length ? "" : "hidden"
          } w-[3rem] object-cover top-[1.5px] rounded-md right-0 absolute`}
        />
        <PlotfieldCharacterPromptMain
          characterValue={nameValue}
          setCharacterId={setCurrentCharacterId}
          setCharacterName={setNameValue}
          setShowCharacterModal={setShowCharacters}
          showCharacterModal={showCharacters}
          setCharacterImg={setCharacterImg}
          setNewlyCreated={setNewlyCreated}
          translateAsideValue={"translate-y-[.5rem]"}
        />
      </form>
      <CommandSayCreateCharacterFieldModal
        setEmotionValue={setEmotionValue}
        characterName={nameValue}
        currentCharacterId={currentCharacterId}
        setCurrentCharacterId={setCurrentCharacterId}
        commandSayId={plotFieldCommandSayId}
        plotFieldCommandId={plotFieldCommandId}
        setShowModal={setShowCreateCharacterModal}
        showModal={showCreateCharacterModal}
        setNewlyCreated={setNewlyCreated}
        setNewlyCreatedName={setNewlyCreatedName}
      />
    </>
  );
}
