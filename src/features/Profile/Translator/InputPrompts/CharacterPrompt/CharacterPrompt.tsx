import { useEffect, useRef, useState } from "react";
import useGetCharacterTranslationByTextFieldNameAndSearch from "../../../../../hooks/Fetching/Character/useGetCharacterTranslationByTextFieldNameAndSearch";
import useOutOfModal from "../../../../../hooks/UI/useOutOfModal";
import useDebounce from "../../../../../hooks/utilities/useDebounce";
import CheckForCompletenessAppearancePart from "./CheckForCompletenessAppearancePart";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";

type CharacterPromptTypes = {
  setCharacterId: React.Dispatch<React.SetStateAction<string>>;
  storyId?: string;
  characterId: string;
  currentTranslationView?: "appearancePart";
  appearancePartVariation?: string;
  currentLanguage: CurrentlyAvailableLanguagesTypes;
  translateToLanguage?: CurrentlyAvailableLanguagesTypes;
};

export default function CharacterPrompt({
  setCharacterId,
  storyId,
  characterId,
  currentTranslationView,
  currentLanguage,
  translateToLanguage,
  appearancePartVariation,
}: CharacterPromptTypes) {
  const [showCharacters, setShowCharacters] = useState(false);
  const modalCharactersRef = useRef<HTMLDivElement>(null);
  const [characterValue, setCharacterValue] = useState("");
  const [characterBackupValue, setCharacterBackupValue] = useState("");

  useOutOfModal({
    modalRef: modalCharactersRef,
    setShowModal: setShowCharacters,
    showModal: showCharacters,
  });

  const debouncedValue = useDebounce({ value: characterValue, delay: 500 });

  const { data: charactersSearch, isLoading } =
    useGetCharacterTranslationByTextFieldNameAndSearch({
      debouncedValue,
      language: "russian",
      storyId: storyId || "",
      showCharacters,
    });

  useEffect(() => {
    if (!characterId && debouncedValue?.trim().length) {
      setCharacterId(
        charactersSearch?.find(
          (cs) => (cs?.translations || [])[0]?.text === debouncedValue
        )?.characterId || ""
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, charactersSearch]);

  useEffect(() => {
    if (!showCharacters && !characterValue && characterBackupValue) {
      setCharacterValue(characterBackupValue);
    }
  }, [showCharacters, characterValue, characterBackupValue]);

  return (
    <form
      className="bg-white rounded-md shadow-md relative"
      onSubmit={(e) => e.preventDefault()}
    >
      {typeof storyId === "string" && storyId.length === 0 ? (
        <>
          <input
            type="text"
            className="w-full rounded-md bg-white text-[1.3rem] px-[1rem] py-[.5rem] text-gray-700 outline-none"
            placeholder="Имя Персонажа"
            value={characterValue}
            onChange={(e) => setCharacterValue(e.target.value)}
            onClick={(e) => {
              e.stopPropagation();
              if (characterValue?.trim().length) {
                setCharacterBackupValue(characterValue);
              }
              setCharacterValue("");
              setShowCharacters(true);
            }}
          />
          <aside
            ref={modalCharactersRef}
            className={`${
              showCharacters ? "" : "hidden"
            } max-h-[15rem] overflow-auto flex flex-col gap-[.5rem] min-w-fit w-full absolute bg-white rounded-md shadow-md translate-y-[.5rem] p-[1rem] | containerScroll`}
          >
            <button
              type="button"
              onClick={() => {
                setShowCharacters(false);
              }}
              className="text-[1.4rem] outline-gray-300 text-gray-600 text-start hover:bg-primary-pastel-blue hover:text-white rounded-md px-[1rem] py-[.5rem] hover:shadow-md"
            >
              Сначала Выберите Историю
            </button>
          </aside>
        </>
      ) : (
        <>
          <input
            type="text"
            className="w-full rounded-md bg-white text-[1.3rem] px-[1rem] py-[.5rem] text-gray-700 outline-none"
            placeholder="Имя Персонажа"
            onClick={(e) => {
              e.stopPropagation();
              if (characterValue?.trim().length) {
                setCharacterBackupValue(characterValue);
              }
              setCharacterValue("");
              setShowCharacters(true);
            }}
            value={characterValue}
            onChange={(e) => {
              setShowCharacters(true);
              setCharacterValue(e.target.value);
            }}
          />
          <aside
            ref={modalCharactersRef}
            className={`${
              showCharacters ? "" : "hidden"
            } max-h-[15rem] overflow-auto flex flex-col gap-[.5rem] min-w-fit w-full absolute bg-white rounded-md shadow-md translate-y-[.5rem] p-[1rem] | containerScroll`}
          >
            {isLoading ? (
              <div className="text-[1.4rem] text-gray-600 text-center py-[.5rem]">
                Загрузка...
              </div>
            ) : charactersSearch && charactersSearch.length > 0 ? (
              charactersSearch.map((s) => (
                <button
                  key={s._id}
                  type="button"
                  onClick={() => {
                    setCharacterId(s.characterId);
                    setCharacterValue((s?.translations || [])[0]?.text || "");
                    setShowCharacters(false);
                  }}
                  className="text-[1.4rem] outline-gray-300 text-gray-600 text-start hover:bg-primary-pastel-blue hover:text-white rounded-md px-[1rem] py-[.5rem] hover:shadow-md relative"
                >
                  {(s?.translations || [])[0]?.text || ""}
                  {currentLanguage && translateToLanguage ? (
                    <>
                      {currentTranslationView === "appearancePart" ? (
                        <CheckForCompletenessAppearancePart
                          currentLanguage={currentLanguage}
                          translateToLanguage={translateToLanguage}
                          appearancePartVariation={appearancePartVariation}
                          characterId={s.characterId}
                        />
                      ) : null}
                    </>
                  ) : null}
                </button>
              ))
            ) : (
              <button
                type="button"
                onClick={() => {
                  setShowCharacters(false);
                }}
                className="text-[1.4rem] outline-gray-300 text-gray-600 text-start hover:bg-primary-pastel-blue hover:text-white rounded-md px-[1rem] py-[.5rem] hover:shadow-md"
              >
                Нету Подходящих Персонажей
              </button>
            )}
          </aside>
        </>
      )}
    </form>
  );
}
