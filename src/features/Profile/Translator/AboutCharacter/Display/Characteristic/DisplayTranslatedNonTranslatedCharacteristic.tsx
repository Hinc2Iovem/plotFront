import { useEffect, useState } from "react";
import useUpdateCharacteristicTranslation from "../../../../../../hooks/Patching/Translation/useUpdateCharacteristicTranslation";
import useDebounce from "../../../../../../hooks/utilities/useDebounce";
import { CurrentlyAvailableLanguagesTypes } from "../../../../../../types/Additional/CURRENTLY_AVAILABEL_LANGUAGES";
import { TranslationCharacterCharacteristicTypes } from "../../../../../../types/Additional/TranslationTypes";

type DisplayTranslatedNonTranslatedCharacteristicTypes = {
  languageToTranslate: CurrentlyAvailableLanguagesTypes;
  translateFromLanguage: CurrentlyAvailableLanguagesTypes;
  translated: TranslationCharacterCharacteristicTypes | null;
  nonTranslated: TranslationCharacterCharacteristicTypes | null;
  lastIndex: number;
  currentIndex: number;
};

export default function DisplayTranslatedNonTranslatedCharacteristic({
  translated,
  nonTranslated,
  languageToTranslate,
  translateFromLanguage,
}: DisplayTranslatedNonTranslatedCharacteristicTypes) {
  const [
    translatedBackUpCharacterCharacteristic,
    setTranslatedBackUpCharacterCharacteristic,
  ] = useState("");

  const [backUpCharacterCharacteristic, setBackUpCharacterCharacteristic] =
    useState("");
  const [
    translatedCharacterCharacteristic,
    setTranslatedCharacterCharacteristic,
  ] = useState("");

  const [characterCharacteristic, setCharacterCharacteristic] = useState("");
  const [characterCharacteristicId, setCharacterCharacteristicId] =
    useState("");

  useEffect(() => {
    if (translated) {
      setTranslatedCharacterCharacteristic(
        translated.translations.find(
          (t) => t.textFieldName === "characterCharacteristic"
        )?.text || ""
      );
      setTranslatedBackUpCharacterCharacteristic(
        translated.translations.find(
          (t) => t.textFieldName === "characterCharacteristic"
        )?.text || ""
      );
      setCharacterCharacteristicId(translated.characteristicId);
    }
  }, [translated]);

  useEffect(() => {
    if (nonTranslated) {
      setCharacterCharacteristic(
        nonTranslated.translations.find(
          (t) => t.textFieldName === "characterCharacteristic"
        )?.text || ""
      );
      setBackUpCharacterCharacteristic(
        nonTranslated.translations.find(
          (t) => t.textFieldName === "characterCharacteristic"
        )?.text || ""
      );
    } else {
      setCharacterCharacteristic("");
    }
  }, [nonTranslated, languageToTranslate]);

  const debouncedTranslatedName = useDebounce({
    value: translatedCharacterCharacteristic,
    delay: 500,
  });

  const updateCharacterTranslationTranslated =
    useUpdateCharacteristicTranslation({
      language: translateFromLanguage,
      characterCharacteristicId:
        characterCharacteristicId || nonTranslated?.characteristicId || "",
      storyId: translated?.storyId || nonTranslated?.storyId || "",
    });

  useEffect(() => {
    if (
      translatedBackUpCharacterCharacteristic !== debouncedTranslatedName &&
      debouncedTranslatedName?.trim().length
    ) {
      updateCharacterTranslationTranslated.mutate({
        characteristicName: debouncedTranslatedName,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTranslatedName]);

  const debouncedName = useDebounce({
    value: characterCharacteristic,
    delay: 500,
  });

  const updateCharacterTranslation = useUpdateCharacteristicTranslation({
    language: languageToTranslate,
    characterCharacteristicId:
      characterCharacteristicId || nonTranslated?.characteristicId || "",
    storyId: translated?.storyId || nonTranslated?.storyId || "",
  });

  useEffect(() => {
    if (
      backUpCharacterCharacteristic !== debouncedName &&
      debouncedName?.trim().length
    ) {
      updateCharacterTranslation.mutate({
        characteristicName: debouncedName,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName]);

  return (
    <div
      className={`h-fit flex-col w-full flex gap-[.5rem] bg-primary-darker p-[.5rem] rounded-md`}
    >
      <div
        className={`h-full w-full rounded-md shadow-md shadow-gray-400 bg-secondary`}
      >
        <form
          className="flex flex-col gap-[.5rem] p-[1rem] w-full"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            value={translatedCharacterCharacteristic}
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-secondary"
            onChange={(e) =>
              setTranslatedCharacterCharacteristic(e.target.value)
            }
          />
        </form>
      </div>
      <div
        className={`h-full w-full rounded-md shadow-md shadow-gray-400 bg-secondary`}
      >
        <form
          className="flex flex-col gap-[.5rem] p-[1rem] w-full"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            value={characterCharacteristic}
            placeholder="Характеристика"
            className="w-full border-dotted border-gray-600 border-[2px] text-[1.6rem] font-medium text-gray-700 outline-none rounded-md px-[1rem] py-[.5rem] bg-secondary"
            onChange={(e) => setCharacterCharacteristic(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
}
