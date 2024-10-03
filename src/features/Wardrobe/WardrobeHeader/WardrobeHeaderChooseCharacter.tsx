import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useGetCharacterById from "../../../hooks/Fetching/Character/useGetCharacterById";
import useGetTranslationCharacters, {
  getTranslationCharacters,
} from "../../../hooks/Fetching/Translation/Characters/useGetTranslationCharacters";
import useOutOfModal from "../../../hooks/UI/useOutOfModal";
import { TranslationCharacterTypes } from "../../../types/Additional/TranslationTypes";
import { useQueryClient } from "@tanstack/react-query";

type WardrobeHeaderChooseCharacterTypes = {
  setCharacterId: React.Dispatch<React.SetStateAction<string>>;
  setShowCharacterModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowBodyTypeModal: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showCharacterModal: boolean;
};

export default function WardrobeHeaderChooseCharacter({
  setShowBodyTypeModal,
  setShowCharacterModal,
  setCharacterId,
  setShowModal,
  showCharacterModal,
}: WardrobeHeaderChooseCharacterTypes) {
  const { storyId } = useParams();
  const [characterName, setCharacterName] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

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
          setShowBodyTypeModal(false);
          setShowModal(false);
          setShowCharacterModal(true);
        }}
        className="text-[1.5rem] px-[1rem] py-[.5rem] outline-gray-400 bg-white rounded-md shadow-md hover:bg-primary-pastel-blue hover:text-white transition-all active:scale-[0.98]"
      >
        Имя Персонажа
      </button>
      <p
        className={`${
          characterName ? "" : "hidden"
        } text-[1.5rem] border-b-[2px] border-gray-700 border-dotted text-center rounded-md`}
      >
        {characterName}
      </p>
      <aside
        ref={modalRef}
        id="scrollBar"
        className={`${
          showCharacterModal ? "" : "hidden"
        } absolute top-1/2 translate-y-[1rem] z-[10] p-[1rem] w-full max-h-[10rem] overflow-y-auto bg-white shadow-md rounded-md flex flex-col gap-[1rem] | containerScroll`}
      >
        {(!characterName && (characters?.length || 0) > 0) ||
        (characterName && (characters?.length || 0) > 1) ? (
          characters?.map((c) => (
            <WardrobeHeaderChooseCharacterItem
              key={c._id}
              setCharacterId={setCharacterId}
              setCharacterName={setCharacterName}
              setShowCharacterModal={setShowCharacterModal}
              {...c}
            />
          ))
        ) : (
          <button
            onClick={() => {
              setShowCharacterModal(false);
            }}
            className="rounded-md text-[1.3rem] px-[.5rem] py-[.2rem] text-start hover:bg-primary-light-blue hover:text-white transition-all "
          >
            Пусто
          </button>
        )}
      </aside>
    </div>
  );
}

type WardrobeHeaderChooseCharacterItemTypes = {
  setCharacterName: React.Dispatch<React.SetStateAction<string>>;
  setCharacterId: React.Dispatch<React.SetStateAction<string>>;
  setShowCharacterModal: React.Dispatch<React.SetStateAction<boolean>>;
} & TranslationCharacterTypes;

function WardrobeHeaderChooseCharacterItem({
  setCharacterId,
  setCharacterName,
  setShowCharacterModal,
  characterId,
  translations,
}: WardrobeHeaderChooseCharacterItemTypes) {
  const { data: character } = useGetCharacterById({ characterId });
  const [currentCharacterName] = useState(
    translations?.find((t) => t.textFieldName === "characterName")?.text || ""
  );

  return (
    <>
      {character?.img ? (
        <button
          onClick={() => {
            setCharacterName(currentCharacterName);
            setCharacterId(characterId);
            setShowCharacterModal(false);
          }}
          className="rounded-md flex px-[.5rem] py-[.2rem] items-center justify-between hover:bg-primary-light-blue hover:text-white transition-all "
        >
          <p className="text-[1.3rem] rounded-md">{currentCharacterName}</p>
          <img
            src={character?.img}
            alt="CharacterImg"
            className="w-[3rem] rounded-md"
          />
        </button>
      ) : (
        <button
          onClick={() => {
            setCharacterName(currentCharacterName);
            setCharacterId(characterId);
            setShowCharacterModal(false);
          }}
          className="text-start text-[1.3rem] px-[.5rem] py-[.2rem] hover:bg-primary-light-blue hover:text-white transition-all rounded-md"
        >
          {currentCharacterName}
        </button>
      )}
    </>
  );
}
