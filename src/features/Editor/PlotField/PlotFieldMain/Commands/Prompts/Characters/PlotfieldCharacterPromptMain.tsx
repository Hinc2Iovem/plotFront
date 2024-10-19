import { useRef } from "react";
import { useParams } from "react-router-dom";
import useGetCharacterTranslationByTextFieldNameAndSearch from "../../../../../../../hooks/Fetching/Character/useGetCharacterTranslationByTextFieldNameAndSearch";
import useOutOfModal from "../../../../../../../hooks/UI/useOutOfModal";
import PlotfieldCharactersPrompt from "./PlotfieldCharactersPrompt";
import AsideScrollable from "../../../../../../shared/Aside/AsideScrollable/AsideScrollable";

type PlotfieldCharacterPromptMainTypes = {
  setCharacterName: React.Dispatch<React.SetStateAction<string>>;
  setCharacterId: React.Dispatch<React.SetStateAction<string>>;
  setShowCharacterModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCharacterImg?: React.Dispatch<React.SetStateAction<string>>;
  showCharacterModal: boolean;
  characterDebouncedValue: string;
};

export default function PlotfieldCharacterPromptMain({
  setCharacterName,
  setCharacterId,
  setCharacterImg,
  setShowCharacterModal,
  showCharacterModal,
  characterDebouncedValue,
}: PlotfieldCharacterPromptMainTypes) {
  const { storyId } = useParams();
  const modalRef = useRef<HTMLDivElement>(null);
  const theme = localStorage.getItem("theme");
  const { data: allCharacters } =
    useGetCharacterTranslationByTextFieldNameAndSearch({
      storyId: storyId ?? "",
      language: "russian",
      showCharacters: true,
      debouncedValue: characterDebouncedValue,
    });

  useOutOfModal({
    modalRef,
    setShowModal: setShowCharacterModal,
    showModal: showCharacterModal,
  });

  return (
    <AsideScrollable
      ref={modalRef}
      className={`${showCharacterModal ? "" : "hidden"} ${
        !allCharacters?.length && characterDebouncedValue ? "hidden" : ""
      }`}
    >
      {allCharacters?.length ? (
        allCharacters?.map((c) => (
          <PlotfieldCharactersPrompt
            key={c._id}
            setCharacterName={setCharacterName}
            setCharacterId={setCharacterId}
            setCharacterImg={setCharacterImg}
            setShowCharacterModal={setShowCharacterModal}
            {...c}
          />
        ))
      ) : !characterDebouncedValue?.trim().length ? (
        <button
          type="button"
          className={`text-start ${
            theme === "light" ? "outline-gray-300" : "outline-gray-600"
          } focus-within:bg-primary-darker focus-within:text-text-light text-[1.3rem] px-[1rem] py-[.5rem] hover:bg-primary-darker hover:text-text-light text-text-dark transition-all rounded-md`}
        >
          Пусто
        </button>
      ) : null}
    </AsideScrollable>
  );
}
