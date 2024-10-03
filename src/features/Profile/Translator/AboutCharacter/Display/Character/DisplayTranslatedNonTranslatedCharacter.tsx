import { useEffect, useState } from "react";
import { TranslationTextFieldName } from "../../../../../../const/TRANSLATION_TEXT_FIELD_NAMES";
import useUpdateCharacterTranslation from "../../../../../../hooks/Patching/Translation/useUpdateCharacterTranslation";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { CombinedTranslatedAndNonTranslatedCharacterTypes } from "../../Filters/FiltersEverythingCharacterForCharacter";

type DisplayTranslatedNonTranslatedCharacterTypes = {
  characterTypeFilter: string;
  languageToTranslate: CurrentlyAvailableLanguagesTypes;
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
} & CombinedTranslatedAndNonTranslatedCharacterTypes;

export default function DisplayTranslatedNonTranslatedCharacter({
  nonTranslated,
  translated,
  characterTypeFilter,
  languageToTranslate,
  translateFromLanguage,
}: DisplayTranslatedNonTranslatedCharacterTypes) {
  const [translatedCharacterNameInitial, setTranslatedCharacterNameInitial] =
    useState("");
  const [translatedUnknownNameInitial, setTranslatedUnknownNameInitial] =
    useState("");
  const [translatedDescriptionInitial, setTranslatedDescriptionInitial] =
    useState("");
  const [translatedCharacterName, setTranslatedCharacterName] = useState("");
  const [translatedUnknownName, setTranslatedUnknownName] = useState("");
  const [translatedDescription, setTranslatedDescription] = useState("");

  const [characterNameInitial, setCharacterNameInitial] = useState("");
  const [unknownNameInitial, setUnknownNameInitial] = useState("");
  const [descriptionInitial, setDescriptionInitial] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [unknownName, setUnknownName] = useState("");
  const [description, setDescription] = useState("");

  const [characterId, setCharacterId] = useState("");

  useEffect(() => {
    if (translated) {
      setCharacterId(translated.characterId);
      (translated?.translations || [])?.map((t) => {
        if (t.textFieldName === "characterName") {
          setTranslatedCharacterName(t.text);
          setTranslatedCharacterNameInitial(t.text);
        } else if (t.textFieldName === "characterDescription") {
          setTranslatedDescription(t.text);
          setTranslatedDescriptionInitial(t.text);
        } else if (t.textFieldName === "characterUnknownName") {
          setTranslatedUnknownName(t.text);
          setTranslatedUnknownNameInitial(t.text);
        }
      });
    }
  }, [translated]);

  useEffect(() => {
    if (nonTranslated) {
      (nonTranslated?.translations || [])?.map((nt) => {
        if (nt.textFieldName === "characterName") {
          setCharacterName(nt.text);
          setCharacterNameInitial(nt.text);
        } else if (nt.textFieldName === "characterDescription") {
          setDescription(nt.text);
          setDescriptionInitial(nt.text);
        } else if (nt.textFieldName === "characterUnknownName") {
          setUnknownName(nt.text);
          setUnknownNameInitial(nt.text);
        }
      });
    } else {
      setCharacterName("");
      setDescription("");
      setUnknownName("");
      setCharacterNameInitial("");
      setDescriptionInitial("");
      setUnknownNameInitial("");
    }
  }, [nonTranslated, languageToTranslate]);

  const debouncedTranslatedName = useDebounce({
    value: translatedCharacterName,
    delay: 500,
  });
  const debouncedTranslatedUnknownName = useDebounce({
    value: translatedUnknownName,
    delay: 500,
  });
  const debouncedTranslatedDescription = useDebounce({
    value: translatedDescription,
    delay: 500,
  });

  const debouncedName = useDebounce({ value: characterName, delay: 500 });
  const debouncedUnknownName = useDebounce({ value: unknownName, delay: 500 });
  const debouncedDescription = useDebounce({ value: description, delay: 500 });

  const updateCharacterTranslationTranslated = useUpdateCharacterTranslation({
    language: translateFromLanguage,
    characterId: characterId || nonTranslated?.characterId || "",
  });

  useEffect(() => {
    if (
      debouncedTranslatedName !== translatedCharacterNameInitial &&
      debouncedTranslatedName?.trim().length
    ) {
      updateCharacterTranslationTranslated.mutate({
        debouncedValue: debouncedTranslatedName,
        textFieldName: TranslationTextFieldName.CharacterName,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTranslatedName]);

  useEffect(() => {
    if (
      debouncedTranslatedUnknownName !== translatedUnknownNameInitial &&
      debouncedTranslatedUnknownName?.trim().length
    ) {
      updateCharacterTranslationTranslated.mutate({
        debouncedValue: debouncedTranslatedUnknownName,
        textFieldName: TranslationTextFieldName.CharacterUnknownName,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTranslatedUnknownName]);
  useEffect(() => {
    if (
      debouncedTranslatedDescription !== translatedDescriptionInitial &&
      debouncedTranslatedDescription?.trim().length
    ) {
      updateCharacterTranslationTranslated.mutate({
        debouncedValue: debouncedTranslatedDescription,
        textFieldName: TranslationTextFieldName.CharacterDescription,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTranslatedDescription]);

  const updateCharacterTranslation = useUpdateCharacterTranslation({
    language: languageToTranslate,
    characterId: characterId || nonTranslated?.characterId || "",
  });
  useEffect(() => {
    if (
      debouncedName !== characterNameInitial &&
      debouncedName?.trim().length
    ) {
      updateCharacterTranslation.mutate({
        debouncedValue: debouncedName,
        textFieldName: TranslationTextFieldName.CharacterName,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName]);
  useEffect(() => {
    if (
      debouncedUnknownName !== unknownNameInitial &&
      debouncedUnknownName?.trim().length
    ) {
      updateCharacterTranslation.mutate({
        debouncedValue: debouncedUnknownName,
        textFieldName: TranslationTextFieldName.CharacterUnknownName,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedUnknownName]);
  useEffect(() => {
    if (
      debouncedDescription !== descriptionInitial &&
      debouncedDescription?.trim().length
    ) {
      updateCharacterTranslation.mutate({
        debouncedValue: debouncedDescription,
        textFieldName: TranslationTextFieldName.CharacterDescription,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedDescription]);

  return (
    <div
      className={`${
        characterTypeFilter === "Обычный Персонаж" ||
        characterTypeFilter === "Главный Персонаж"
          ? "h-fit flex-col"
          : "min-h-[24rem] sm:flex-row flex-col"
      } w-full flex gap-[.5rem] bg-primary-pastel-blue p-[.5rem] rounded-md`}
    >
      <div
        className={`h-full ${
          characterTypeFilter === "Обычный Персонаж" ||
          characterTypeFilter === "Главный Персонаж"
            ? "w-full"
            : "w-full sm:w-[calc(50%)]"
        } rounded-md shadow-md shadow-gray-400 bg-white`}
      >
        <form
          className="flex flex-col gap-[.5rem] p-[1rem] w-full"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            value={translatedCharacterName}
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-white"
            onChange={(e) => setTranslatedCharacterName(e.target.value)}
          />
          {translated?.characterType === "minorcharacter" ? (
            <>
              <input
                type="text"
                value={translatedUnknownName}
                className="w-full border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-white"
                onChange={(e) => setTranslatedUnknownName(e.target.value)}
              />
              <textarea
                value={translatedDescription}
                rows={5}
                className="max-h-[12.5rem] w-full border-dotted border-gray-600 border-[2px] text-[1.5rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-white | containerScroll"
                onChange={(e) => setTranslatedDescription(e.target.value)}
              />
            </>
          ) : null}
        </form>
      </div>
      <div
        className={`h-full ${
          characterTypeFilter === "Обычный Персонаж" ||
          characterTypeFilter === "Главный Персонаж"
            ? "w-full"
            : "w-full sm:w-[calc(50%)] "
        } rounded-md shadow-md shadow-gray-400 bg-white`}
      >
        <form
          className="flex flex-col gap-[.5rem] p-[1rem] w-full"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            value={characterName}
            placeholder="Имя персонажа"
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-white"
            onChange={(e) => setCharacterName(e.target.value)}
          />
          {translated?.characterType === "minorcharacter" ? (
            <>
              <input
                type="text"
                value={unknownName}
                placeholder="Неивестное имя персонажа"
                className="w-full border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-white"
                onChange={(e) => setUnknownName(e.target.value)}
              />
              <textarea
                value={description}
                placeholder="Описание персонажа"
                rows={5}
                className="max-h-[12.5rem] w-full border-dotted border-gray-600 border-[2px] text-[1.5rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-white | containerScroll"
                onChange={(e) => setDescription(e.target.value)}
              />
            </>
          ) : null}
        </form>
      </div>
    </div>
  );
}
