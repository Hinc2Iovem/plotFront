import { useRef } from "react";
import { useParams } from "react-router-dom";
import useGetTranslationCharacters, {
  getTranslationCharacters,
} from "../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacters";
import useOutOfModal from "../../../hooks/UI/useOutOfModal";
import EmotionHeaderCharacterNames from "./EmotionHeaderCharacterNames";
import { useQueryClient } from "@tanstack/react-query";

type EmotionHeaderCharacterTypes = {
  setShowCharacterModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCharacterId: React.Dispatch<React.SetStateAction<string>>;
  setCharacterName: React.Dispatch<React.SetStateAction<string>>;
  showCharacterModal: boolean;
  characterName: string;
};

export default function EmotionHeaderCharacters({
  setCharacterId,
  setShowModal,
  setShowCharacterModal,
  showCharacterModal,
  characterName,
  setCharacterName,
}: EmotionHeaderCharacterTypes) {
  const { storyId } = useParams();
  const modalRef = useRef<HTMLDivElement>(null);
  const theme = localStorage.getItem("theme");
  const { data: characters } = useGetTranslationCharacters({
    storyId: storyId || "",
    language: "russian",
  });

  useOutOfModal({
    modalRef,
    setShowModal: setShowCharacterModal,
    showModal: showCharacterModal,
  });

  const queryClient = useQueryClient();
  const prefetchCharacters = () => {
    queryClient.prefetchQuery({
      queryKey: [],
      queryFn: () =>
        getTranslationCharacters({
          language: "russian",
          storyId: storyId || "",
        }),
    });
  };

  return (
    <div className="flex flex-col gap-[.5rem] relative min-w-[20rem]">
      <button
        onMouseEnter={prefetchCharacters}
        onFocus={prefetchCharacters}
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(false);
          setShowCharacterModal(true);
        }}
        className="text-[1.5rem] focus-within:text-text-light focus-within:bg-primary-darker px-[1rem] text-text-dark hover:text-text-light py-[.5rem] outline-gray-400 bg-secondary rounded-md shadow-md hover:bg-primary-darker transition-all active:scale-[0.98]"
      >
        Имя Персонажа
      </button>

      <p
        className={`${characterName ? "" : "hidden"} text-[1.5rem] ${
          theme === "light"
            ? ""
            : "text-text-light opacity-80 hover:opacity-100 transition-opacity cursor-default"
        } border-b-[2px] border-gray-700 border-dotted text-center rounded-md`}
      >
        {characterName}
      </p>

      <aside
        ref={modalRef}
        id="scrollBar"
        className={`${showCharacterModal ? "" : "hidden"} ${
          characterName ? "translate-y-[1rem]" : "translate-y-[2rem]"
        } absolute top-1/2 z-[10] p-[1rem] min-w-[10rem] w-full max-h-[10rem] overflow-y-auto bg-secondary shadow-md rounded-md flex flex-col gap-[1rem] | containerScroll`}
      >
        {(!characterName && (characters?.length || 0) > 0) ||
        (characterName && (characters?.length || 0) > 1) ? (
          characters?.map((c) => (
            <EmotionHeaderCharacterNames
              key={c._id}
              setCharacterName={setCharacterName}
              setCharacterId={setCharacterId}
              setShowCharacterModal={setShowCharacterModal}
              {...c}
            />
          ))
        ) : (
          <button
            onClick={() => {
              setShowCharacterModal(false);
            }}
            className="text-start focus-within:text-text-light focus-within:bg-primary-darker text-[1.3rem] px-[.5rem] py-[.2rem] hover:bg-primary-darker hover:text-text-light text-text-dark transition-all rounded-md"
          >
            Пусто
          </button>
        )}
      </aside>
    </div>
  );
}
